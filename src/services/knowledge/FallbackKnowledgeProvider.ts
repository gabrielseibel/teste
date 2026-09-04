import type { FactCheckMatch, KnowledgeProvider, KnownDomain, ScamPatternDef } from './KnowledgeProvider';

/**
 * Decorator que tenta um provedor primário (tipicamente Supabase) e, em
 * caso de falha (rede indisponível, projeto pausado, erro de configuração),
 * recorre automaticamente a um provedor de fallback (StaticKnowledgeProvider)
 * — nunca deixando a análise indisponível por causa de uma falha de infra.
 */
export class FallbackKnowledgeProvider implements KnowledgeProvider {
  readonly name: string;

  constructor(
    private readonly primary: KnowledgeProvider,
    private readonly fallback: KnowledgeProvider,
  ) {
    this.name = `${primary.name}+${fallback.name}`;
  }

  async getScamPatterns(): Promise<ScamPatternDef[]> {
    try {
      return await this.primary.getScamPatterns();
    } catch (err) {
      console.error(`[knowledge] ${this.primary.name} falhou em getScamPatterns, usando ${this.fallback.name}`, err instanceof Error ? err.message : err);
      return this.fallback.getScamPatterns();
    }
  }

  async getKnownDomains(): Promise<KnownDomain[]> {
    try {
      return await this.primary.getKnownDomains();
    } catch (err) {
      console.error(`[knowledge] ${this.primary.name} falhou em getKnownDomains, usando ${this.fallback.name}`, err instanceof Error ? err.message : err);
      return this.fallback.getKnownDomains();
    }
  }

  async matchFactChecks(query: string, options?: { minSimilarity?: number; limit?: number }): Promise<FactCheckMatch[]> {
    try {
      return await this.primary.matchFactChecks(query, options);
    } catch (err) {
      console.error(`[knowledge] ${this.primary.name} falhou em matchFactChecks, usando ${this.fallback.name}`, err instanceof Error ? err.message : err);
      return this.fallback.matchFactChecks(query, options);
    }
  }
}
