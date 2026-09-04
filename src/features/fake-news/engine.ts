import type { FactCheckMatch } from '@/services/knowledge/KnowledgeProvider';
import { fakeNewsAnalysisResultSchema } from './schema';
import type { ConfidenceLevel, EvidenceItem, FakeNewsAnalysisResult, NewsSourceRef } from './types';

export const NEWS_DISCLAIMER =
  'Esta ferramenta fornece uma análise automatizada, baseada em uma base curada de alegações já verificadas, para ajudar na tomada de decisão. Ela não substitui orientação profissional, investigação oficial ou confirmação diretamente com a instituição envolvida.';

function confidenceFromSimilarity(similarity: number): ConfidenceLevel {
  if (similarity >= 0.5) return 'alta';
  if (similarity >= 0.32) return 'media';
  return 'baixa';
}

function supportsFromClassification(classification: FactCheckMatch['classification']): EvidenceItem['supports'] {
  if (classification === 'provavelmente_falsa' || classification === 'enganosa_fora_de_contexto') return 'falsa';
  if (classification === 'provavelmente_verdadeira' || classification === 'confirmada_por_fontes') return 'verdadeira';
  return 'neutro';
}

function sourceTypeFrom(match: FactCheckMatch): NewsSourceRef['type'] {
  return match.sourceType ?? 'fact_checking';
}

function tierFrom(type: NewsSourceRef['type']): NewsSourceRef['tier'] {
  if (type === 'oficial') return 1;
  if (type === 'jornalistico') return 2;
  if (type === 'fact_checking') return 3;
  return 4;
}

/**
 * Monta a análise final do Modo 2 a partir das correspondências encontradas
 * na base de alegações conhecidas (KnowledgeProvider.matchFactChecks) e dos
 * sinais de linguagem sensacionalista detectados no texto. Este é o único
 * motor de análise do VERIFICA — não há nenhuma chamada a um modelo de IA
 * generativa nem a um serviço de busca em nenhum ponto do sistema.
 */
export function buildFakeNewsAnalysis(
  content: string,
  matches: FactCheckMatch[],
  sensationalistRedFlags: string[],
): FakeNewsAnalysisResult {
  return fakeNewsAnalysisResultSchema.parse(buildFakeNewsAnalysisUnsafe(content, matches, sensationalistRedFlags));
}

/** Constrói o resultado; validado contra o schema em `buildFakeNewsAnalysis` acima como rede de segurança. */
function buildFakeNewsAnalysisUnsafe(
  content: string,
  matches: FactCheckMatch[],
  sensationalistRedFlags: string[],
): FakeNewsAnalysisResult {
  if (matches.length === 0) {
    return {
      type: 'misinformation',
      classification: 'nao_confirmada',
      confidence: 'baixa',
      claim: content.slice(0, 200),
      evidence: [],
      sources: [],
      explanation:
        'Não consegui confirmar essa informação com segurança. Ela não corresponde a nenhuma alegação da nossa base de conhecimento — o que não significa que seja verdadeira nem falsa, apenas que não temos, no momento, uma base sólida para avaliá-la.',
      redFlags: sensationalistRedFlags,
      howToVerify: [
        'Procure a mesma informação em veículos jornalísticos estabelecidos e compare os textos.',
        'Verifique se órgãos oficiais relacionados ao tema (governo, empresa citada) publicaram algo a respeito.',
        'Procure a data original da informação — conteúdos antigos às vezes voltam a circular como se fossem atuais.',
        'Consulte agências de fact-checking brasileiras dedicadas a esse tipo de verificação (Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas).',
      ],
      questions: [
        {
          id: 'tem_fonte',
          text: 'Você recebeu essa informação com algum link de origem (site, veículo de notícia)?',
          options: ['Sim', 'Não', 'Não sei'],
        },
        {
          id: 'sabe_data',
          text: 'Você sabe se essa informação é recente ou pode ser antiga?',
          options: ['É recente', 'Pode ser antiga', 'Não sei'],
        },
      ],
      disclaimer: NEWS_DISCLAIMER,
    };
  }

  const [best] = matches;
  const confidence = confidenceFromSimilarity(best!.similarity);

  const evidence: EvidenceItem[] = matches.map((m) => ({
    statement: m.claim,
    kind: 'fato_encontrado',
    supports: supportsFromClassification(m.classification),
  }));

  const sources: NewsSourceRef[] = matches.map((m) => {
    const type = sourceTypeFrom(m);
    return {
      title: m.sourceTitle ?? 'Base de alegações conhecidas do VERIFICA',
      url: m.sourceUrl,
      date: m.sourceDate,
      tier: tierFrom(type),
      type,
      relation: `Alegação semelhante encontrada em nossa base de conhecimento (${Math.round(m.similarity * 100)}% de similaridade textual).`,
    };
  });

  const howToVerify =
    best!.howToVerify.length > 0
      ? best!.howToVerify
      : ['Procure a mesma informação em veículos jornalísticos estabelecidos.', 'Consulte agências de fact-checking brasileiras.'];

  return {
    type: 'misinformation',
    classification: best!.classification,
    confidence,
    claim: content.slice(0, 200),
    evidence,
    sources,
    explanation: best!.explanation,
    redFlags: [...best!.redFlags, ...sensationalistRedFlags],
    howToVerify,
    questions: [],
    disclaimer: NEWS_DISCLAIMER,
  };
}
