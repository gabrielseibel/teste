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
 * O VERIFICA roda inteiramente no navegador (export estático, sem backend
 * próprio) — por isso as variáveis precisam do prefixo `NEXT_PUBLIC_` para
 * que o Next.js as inclua no bundle do cliente. Isso é seguro: a chave é a
 * "anon key" pública do Supabase, protegida por Row Level Security
 * (somente leitura de registros ativos), do mesmo jeito que qualquer app
 * mobile/SPA que fala diretamente com o Supabase.
 *
 * NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY configuradas
 * → usa Supabase, com fallback automático para os dados estáticos embutidos
 *   em caso de falha (rede, projeto pausado, etc).
 * Nenhuma das duas configuradas → usa diretamente os dados estáticos,
 *   permitindo rodar o app inteiro localmente/offline sem nenhuma configuração.
 */
export function getKnowledgeProvider(): KnowledgeProvider {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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
