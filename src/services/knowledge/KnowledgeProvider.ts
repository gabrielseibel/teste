/**
 * Camada de abstração para a base de conhecimento usada pelo motor
 * determinístico de análise (catálogo de táticas de golpe, domínios
 * oficiais de referência, e alegações já verificadas para o Modo 2).
 *
 * Este é o único "provedor de dados" do VERIFICA — não há chamada a
 * nenhuma IA generativa em nenhum lugar do sistema. Toda análise é
 * baseada em correspondência contra informações já conhecidas, mantidas
 * nesta base (por padrão no Supabase; um provedor estático embutido no
 * código serve de fallback para rodar localmente sem nenhuma configuração).
 */

export interface ScamPatternDef {
  id: string;
  label: string;
  description: string;
  severity: 'alto' | 'medio' | 'baixo';
  category: string;
  /** Padrões regex (fonte, sem os delimitadores) aplicados com a flag "i". */
  keywords: string[];
}

export interface KnownDomain {
  domain: string;
  category: string;
}

export type FactCheckClassification =
  | 'provavelmente_falsa'
  | 'enganosa_fora_de_contexto'
  | 'nao_confirmada'
  | 'provavelmente_verdadeira'
  | 'confirmada_por_fontes';

export interface FactCheckMatch {
  claim: string;
  classification: FactCheckClassification;
  explanation: string;
  redFlags: string[];
  howToVerify: string[];
  sourceTitle?: string;
  sourceUrl?: string;
  sourceType?: 'oficial' | 'jornalistico' | 'fact_checking' | 'outra';
  sourceDate?: string;
  /** 0 a 1, quão parecido o texto do usuário é do "claim" registrado. */
  similarity: number;
}

export interface KnowledgeProvider {
  readonly name: string;
  getScamPatterns(): Promise<ScamPatternDef[]>;
  getKnownDomains(): Promise<KnownDomain[]>;
  matchFactChecks(query: string, options?: { minSimilarity?: number; limit?: number }): Promise<FactCheckMatch[]>;
}
