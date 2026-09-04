import { getKnowledgeProvider } from '@/services/knowledge';
import { analyzeUrl } from '@/services/url-analysis/analyzeUrl';
import { maskPii } from '@/services/security/piiMask';
import { buildScamAnalysis } from './engine';
import { detectEmergency, scanForScamPatterns } from './patterns';
import type { ScamAnalysisInput, ScamAnalysisResult } from './types';

export interface AnalyzeScamOutcome {
  result: ScamAnalysisResult;
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

/**
 * Motor de análise de golpes — 100% determinístico, sem chamada a nenhuma
 * IA generativa. Compara o relato do usuário contra o catálogo de táticas
 * conhecidas (KnowledgeProvider: Supabase por padrão, com fallback estático
 * embutido) e monta o resultado a partir dos sinais efetivamente
 * encontrados.
 */
export async function analyzeScam(rawInput: ScamAnalysisInput): Promise<AnalyzeScamOutcome> {
  const { masked: maskedNarrative } = maskPii(rawInput.narrative);
  const maskedImageOcr = rawInput.imageOcrText ? maskPii(rawInput.imageOcrText).masked : undefined;
  const input: ScamAnalysisInput = { ...rawInput, narrative: maskedNarrative, imageOcrText: maskedImageOcr };

  const answersText = (input.previousAnswers ?? []).map((a) => `${a.question} ${a.answer}`).join('\n');
  const fullText = [input.narrative, input.link ?? '', input.imageOcrText ?? '', answersText]
    .filter(Boolean)
    .join('\n');

  const knowledge = getKnowledgeProvider();
  const [patterns, knownDomains] = await Promise.all([knowledge.getScamPatterns(), knowledge.getKnownDomains()]);

  const matches = scanForScamPatterns(fullText, patterns);
  const isEmergency = detectEmergency(fullText);
  const urlWarnings = input.link ? analyzeUrl(input.link, knownDomains.map((d) => d.domain)).warnings : [];

  const result = buildScamAnalysis(matches, isEmergency);
  return { result: mergeUrlWarnings(result, urlWarnings) };
}
