import { getAIProvider } from '@/services/ai';
import { parseStructuredJson } from '@/services/ai/parseStructuredJson';
import { getSearchProvider } from '@/services/search';
import type { SearchResultItem } from '@/services/search/SearchProvider';
import { maskPii } from '@/services/security/piiMask';
import { annotateInjectionAttempts } from '@/services/security/promptGuard';
import { analyzeUrl } from '@/services/url-analysis/analyzeUrl';
import { buildDeterministicNewsAnalysis } from './fallback';
import { buildFakeNewsUserMessage, FAKE_NEWS_SYSTEM_PROMPT } from './prompt';
import { fakeNewsAnalysisResultSchema } from './schema';
import type { FakeNewsAnalysisInput, FakeNewsAnalysisResult } from './types';

const AI_TIMEOUT_MS = 30_000;
const SEARCH_TIMEOUT_MS = 10_000;

export interface AnalyzeNewsOutcome {
  result: FakeNewsAnalysisResult;
  aiUsed: boolean;
  searchUsed: boolean;
}

function buildSearchQuery(input: FakeNewsAnalysisInput): string {
  if (input.url) return input.url;
  return input.content.slice(0, 200);
}

async function trySearch(input: FakeNewsAnalysisInput): Promise<SearchResultItem[]> {
  const provider = getSearchProvider();
  if (provider.name === 'noop') return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
  try {
    return await provider.search(buildSearchQuery(input), { maxResults: 6, signal: controller.signal });
  } catch {
    // Falha de busca não deve derrubar a análise — apenas seguimos sem
    // resultados externos, e o pipeline já sabe responder honestamente
    // nesse caso ("não confirmada").
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

function mergeUrlWarnings(result: FakeNewsAnalysisResult, warnings: string[]): FakeNewsAnalysisResult {
  if (warnings.length === 0) return result;
  return { ...result, redFlags: [...result.redFlags, ...warnings] };
}

export async function analyzeNews(rawInput: FakeNewsAnalysisInput): Promise<AnalyzeNewsOutcome> {
  const { masked: maskedContent } = maskPii(rawInput.content);
  const maskedImageOcr = rawInput.imageOcrText ? maskPii(rawInput.imageOcrText).masked : undefined;
  const input: FakeNewsAnalysisInput = { ...rawInput, content: maskedContent, imageOcrText: maskedImageOcr };

  const fullText = [input.content, input.imageOcrText ?? ''].filter(Boolean).join('\n');
  const { suspicious: injectionSuspected } = annotateInjectionAttempts(fullText);
  const urlWarnings = input.url ? analyzeUrl(input.url).warnings : [];

  const searchResults = await trySearch(input);

  const provider = getAIProvider();
  if (!provider) {
    const fallback = buildDeterministicNewsAnalysis(input);
    return { result: mergeUrlWarnings(fallback, urlWarnings), aiUsed: false, searchUsed: searchResults.length > 0 };
  }

  const user = buildFakeNewsUserMessage({ input, searchResults, injectionSuspected });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const completion = await provider.complete({
      system: FAKE_NEWS_SYSTEM_PROMPT,
      user,
      signal: controller.signal,
      maxTokens: 2400,
    });

    const parsed = parseStructuredJson(completion.text, fakeNewsAnalysisResultSchema);
    if (!parsed.success || !parsed.data) {
      const fallback = buildDeterministicNewsAnalysis(input);
      return { result: mergeUrlWarnings(fallback, urlWarnings), aiUsed: false, searchUsed: searchResults.length > 0 };
    }

    return {
      result: mergeUrlWarnings(parsed.data, urlWarnings),
      aiUsed: true,
      searchUsed: searchResults.length > 0,
    };
  } catch {
    const fallback = buildDeterministicNewsAnalysis(input);
    return { result: mergeUrlWarnings(fallback, urlWarnings), aiUsed: false, searchUsed: searchResults.length > 0 };
  } finally {
    clearTimeout(timeoutId);
  }
}
