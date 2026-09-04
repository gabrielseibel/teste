import { getKnowledgeProvider } from '@/services/knowledge';
import { maskPii } from '@/services/security/piiMask';
import { analyzeUrl } from '@/services/url-analysis/analyzeUrl';
import { buildFakeNewsAnalysis } from './engine';
import { detectSensationalistLanguage } from './redFlags';
import type { FakeNewsAnalysisInput, FakeNewsAnalysisResult } from './types';

export interface AnalyzeNewsOutcome {
  result: FakeNewsAnalysisResult;
}

// Limiar calibrado empiricamente: com a base de alegações maior, textos sem
// nenhuma relação temática podem coincidir em ~0.20-0.24 só por palavras
// comuns do português (ex.: "governo", "está", "não"). Correspondências reais
// (mesma alegação parafraseada) tipicamente pontuam 0.5+. 0.35 mantém uma
// margem de segurança confortável dos dois lados.
const MIN_SIMILARITY = 0.35;
const MAX_MATCHES = 3;

/**
 * Motor de fact-checking — 100% determinístico, sem chamada a nenhuma IA
 * generativa nem serviço de busca. Compara o conteúdo enviado pelo usuário
 * contra uma base curada de alegações já verificadas (KnowledgeProvider:
 * Supabase por padrão, com fallback estático embutido) por similaridade de
 * texto. Sem correspondência suficiente, a resposta é honestamente "não
 * confirmada" — nunca uma afirmação sem base.
 */
export async function analyzeNews(rawInput: FakeNewsAnalysisInput): Promise<AnalyzeNewsOutcome> {
  const { masked: maskedContent } = maskPii(rawInput.content);
  const maskedImageOcr = rawInput.imageOcrText ? maskPii(rawInput.imageOcrText).masked : undefined;
  const input: FakeNewsAnalysisInput = { ...rawInput, content: maskedContent, imageOcrText: maskedImageOcr };

  const answersText = (input.previousAnswers ?? []).map((a) => `${a.question} ${a.answer}`).join('\n');
  // A consulta de similaridade usa apenas o conteúdo principal (+ OCR), sem
  // as respostas de esclarecimento — texto extra tende a diluir a
  // similaridade por trigramas em vez de ajudar. As respostas ainda entram
  // na varredura de linguagem sensacionalista abaixo.
  const matchQuery = [input.content, input.imageOcrText ?? ''].filter(Boolean).join('\n');
  const fullText = [matchQuery, answersText].filter(Boolean).join('\n');

  const knowledge = getKnowledgeProvider();
  const [matches, knownDomains] = await Promise.all([
    knowledge.matchFactChecks(matchQuery, { minSimilarity: MIN_SIMILARITY, limit: MAX_MATCHES }),
    input.url ? knowledge.getKnownDomains() : Promise.resolve([]),
  ]);

  const sensationalistRedFlags = detectSensationalistLanguage(fullText);
  const urlWarnings = input.url ? analyzeUrl(input.url, knownDomains.map((d) => d.domain)).warnings : [];

  const result = buildFakeNewsAnalysis(matchQuery, matches, [...sensationalistRedFlags, ...urlWarnings]);
  return { result };
}
