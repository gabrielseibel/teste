import { FallbackKnowledgeProvider } from './FallbackKnowledgeProvider';
import { StaticKnowledgeProvider } from './StaticKnowledgeProvider';
import { SupabaseKnowledgeProvider } from './SupabaseKnowledgeProvider';
import type { KnowledgeProvider } from './KnowledgeProvider';

export type {
  KnowledgeProvider,
  ScamPatternDef,
  KnownDomain,
  FactCheckMatch,
  FactCheckClassification,
} from './KnowledgeProvider';

let cached: KnowledgeProvider | undefined;

/**
 * Fábrica do provedor de conhecimento.
 *
 * SUPABASE_URL + (SUPABASE_ANON_KEY ou SUPABASE_PUBLISHABLE_KEY) configurados
 * → usa Supabase, com fallback automático para os dados estáticos embutidos
 *   em caso de falha (rede, projeto pausado, etc).
 * Nenhuma das duas configuradas → usa diretamente os dados estáticos,
 *   permitindo rodar o app inteiro localmente sem nenhuma configuração.
 */
export function getKnowledgeProvider(): KnowledgeProvider {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  const staticProvider = new StaticKnowledgeProvider();

  if (url && key) {
    cached = new FallbackKnowledgeProvider(new SupabaseKnowledgeProvider(url, key), staticProvider);
  } else {
    cached = staticProvider;
  }

  return cached;
}

export function __resetKnowledgeProviderCacheForTests() {
  cached = undefined;
}
