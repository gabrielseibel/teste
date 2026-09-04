import { getAIProvider } from '@/services/ai';
import { parseStructuredJson } from '@/services/ai/parseStructuredJson';
import { analyzeUrl } from '@/services/url-analysis/analyzeUrl';
import { maskPii } from '@/services/security/piiMask';
import { annotateInjectionAttempts } from '@/services/security/promptGuard';
import { buildDeterministicScamAnalysis } from './fallback';
import { detectEmergency, scanForScamPatterns } from './patterns';
import { buildScamUserMessage, SCAM_SYSTEM_PROMPT } from './prompt';
import { scamAnalysisResultSchema } from './schema';
import type { ScamAnalysisInput, ScamAnalysisResult } from './types';

const AI_TIMEOUT_MS = 30_000;

export interface AnalyzeScamOutcome {
  result: ScamAnalysisResult;
  aiUsed: boolean;
}

function mergeUrlWarnings(result: ScamAnalysisResult, warnings: string[]): ScamAnalysisResult {
  if (warnings.length === 0) return result;
  return {
    ...result,
    signals: [
      ...result.signals,
      ...warnings.map((w, i) => ({
        id: `url_warning_${i}`,
        label: 'Sinal encontrado no link informado',
        description: w,
        severity: 'medio' as const,
        fromCatalog: false,
      })),
    ],
  };
}

/** Defesa em profundidade: força o modo de emergência se a detecção determinística encontrar frases de dano já ocorrido, mesmo que a IA não tenha sinalizado. */
function enforceEmergencyFloor(result: ScamAnalysisResult, fullText: string): ScamAnalysisResult {
  if (result.emergency.isEmergency || !detectEmergency(fullText)) return result;
  const fallback = buildDeterministicScamAnalysis({ narrative: fullText });
  return {
    ...result,
    emergency: fallback.emergency,
  };
}

export async function analyzeScam(rawInput: ScamAnalysisInput): Promise<AnalyzeScamOutcome> {
  const { masked: maskedNarrative } = maskPii(rawInput.narrative);
  const maskedImageOcr = rawInput.imageOcrText ? maskPii(rawInput.imageOcrText).masked : undefined;
  const input: ScamAnalysisInput = { ...rawInput, narrative: maskedNarrative, imageOcrText: maskedImageOcr };

  const fullText = [input.narrative, input.link ?? '', input.imageOcrText ?? ''].filter(Boolean).join('\n');
  const catalogHints = scanForScamPatterns(fullText);
  const { suspicious: injectionSuspected } = annotateInjectionAttempts(fullText);

  const urlWarnings = input.link ? analyzeUrl(input.link).warnings : [];

  const provider = getAIProvider();
  if (!provider) {
    const fallback = buildDeterministicScamAnalysis(input);
    return { result: mergeUrlWarnings(fallback, urlWarnings), aiUsed: false };
  }

  const user = buildScamUserMessage({ input, catalogHints, injectionSuspected });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const completion = await provider.complete({
      system: SCAM_SYSTEM_PROMPT,
      user,
      signal: controller.signal,
      maxTokens: 2200,
    });

    const parsed = parseStructuredJson(completion.text, scamAnalysisResultSchema);
    if (!parsed.success || !parsed.data) {
      const fallback = buildDeterministicScamAnalysis(input);
      return { result: mergeUrlWarnings(fallback, urlWarnings), aiUsed: false };
    }

    const enforced = enforceEmergencyFloor(parsed.data, fullText);
    return { result: mergeUrlWarnings(enforced, urlWarnings), aiUsed: true };
  } catch {
    const fallback = buildDeterministicScamAnalysis(input);
    return { result: mergeUrlWarnings(fallback, urlWarnings), aiUsed: false };
  } finally {
    clearTimeout(timeoutId);
  }
}
