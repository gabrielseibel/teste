import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { FactCheckMatch, KnowledgeProvider, KnownDomain, ScamPatternDef } from './KnowledgeProvider';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

interface Cached<T> {
  data: T;
  expiresAt: number;
}

interface MatchFactChecksRow {
  claim: string;
  classification: string;
  explanation: string;
  red_flags: string[] | null;
  how_to_verify: string[] | null;
  source_title: string | null;
  source_url: string | null;
  source_type: string | null;
  source_date: string | null;
  similarity: number;
}

/**
 * Base de conhecimento persistida no Supabase (Postgres), somente-leitura
 * para o app (RLS). Permite adicionar novas táticas de golpe, domínios ou
 * alegações verificadas diretamente no banco, sem precisar alterar código
 * ou fazer novo deploy. Ver supabase/migrations/ para o schema completo.
 */
export class SupabaseKnowledgeProvider implements KnowledgeProvider {
  readonly name = 'supabase';
  private client: SupabaseClient;
  private patternsCache: Cached<ScamPatternDef[]> | null = null;
  private domainsCache: Cached<KnownDomain[]> | null = null;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }

  async getScamPatterns(): Promise<ScamPatternDef[]> {
    if (this.patternsCache && this.patternsCache.expiresAt > Date.now()) {
      return this.patternsCache.data;
    }

    const { data, error } = await this.client
      .from('scam_patterns')
      .select('id, label, description, severity, category, keywords')
      .eq('active', true);

    if (error) throw new Error(`Falha ao carregar scam_patterns do Supabase: ${error.message}`);

    const patterns = (data ?? []) as ScamPatternDef[];
    this.patternsCache = { data: patterns, expiresAt: Date.now() + CACHE_TTL_MS };
    return patterns;
  }

  async getKnownDomains(): Promise<KnownDomain[]> {
    if (this.domainsCache && this.domainsCache.expiresAt > Date.now()) {
      return this.domainsCache.data;
    }

    const { data, error } = await this.client.from('known_domains').select('domain, category');

    if (error) throw new Error(`Falha ao carregar known_domains do Supabase: ${error.message}`);

    const domains = (data ?? []) as KnownDomain[];
    this.domainsCache = { data: domains, expiresAt: Date.now() + CACHE_TTL_MS };
    return domains;
  }

  async matchFactChecks(
    query: string,
    options?: { minSimilarity?: number; limit?: number },
  ): Promise<FactCheckMatch[]> {
    const { data, error } = await this.client.rpc('match_fact_checks', {
      query,
      min_similarity: options?.minSimilarity ?? 0.35,
      match_count: options?.limit ?? 3,
    });

    if (error) throw new Error(`Falha ao consultar match_fact_checks no Supabase: ${error.message}`);

    return ((data ?? []) as MatchFactChecksRow[]).map((row) => ({
      claim: row.claim,
      classification: row.classification as FactCheckMatch['classification'],
      explanation: row.explanation,
      redFlags: row.red_flags ?? [],
      howToVerify: row.how_to_verify ?? [],
      sourceTitle: row.source_title ?? undefined,
      sourceUrl: row.source_url ?? undefined,
      sourceType: (row.source_type as FactCheckMatch['sourceType']) ?? undefined,
      sourceDate: row.source_date ?? undefined,
      similarity: row.similarity,
    }));
  }
}
