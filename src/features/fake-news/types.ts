/**
 * Tipos do domínio "Essa notícia é verdade?" (Modo 2 — fact-checking).
 */

export type NewsClassification =
  | 'provavelmente_falsa'
  | 'enganosa_fora_de_contexto'
  | 'nao_confirmada'
  | 'provavelmente_verdadeira'
  | 'confirmada_por_fontes';

export type ConfidenceLevel = 'alta' | 'media' | 'baixa';

export interface EvidenceItem {
  statement: string;
  /** 'fato_encontrado' = veio de um registro concreto da base de conhecimento; 'inferencia_do_sistema' = dedução sem correspondência direta */
  kind: 'fato_encontrado' | 'inferencia_do_sistema';
  supports: 'verdadeira' | 'falsa' | 'neutro';
}

export interface NewsSourceRef {
  title: string;
  url?: string;
  date?: string;
  /** Nível na hierarquia de confiabilidade de fontes (1 = mais confiável) */
  tier: 1 | 2 | 3 | 4;
  type: 'oficial' | 'jornalistico' | 'fact_checking' | 'outra';
  relation: string;
}

export interface FakeNewsAnalysisResult {
  type: 'misinformation';
  classification: NewsClassification;
  confidence: ConfidenceLevel;
  claim: string;
  evidence: EvidenceItem[];
  sources: NewsSourceRef[];
  explanation: string;
  redFlags: string[];
  howToVerify: string[];
  questions: Array<{ id: string; text: string; options: string[] }>;
  disclaimer: string;
}

export interface FakeNewsAnalysisInput {
  content: string;
  url?: string;
  previousAnswers?: Array<{ question: string; answer: string }>;
  imageOcrText?: string;
}
