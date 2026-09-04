import { AnthropicProvider } from './AnthropicProvider';
import { OpenAIProvider } from './OpenAIProvider';
import type { AIProvider } from './AIProvider';

export type { AIProvider, AICompletionParams, AICompletionResult } from './AIProvider';
export { AIProviderError } from './AIProvider';

/**
 * Fábrica do provedor de IA configurado via variáveis de ambiente.
 *
 * AI_PROVIDER=anthropic (padrão se ANTHROPIC_API_KEY estiver definida)
 * AI_PROVIDER=openai    (se OPENAI_API_KEY estiver definida)
 *
 * Se nenhuma chave estiver configurada, retorna `null` — as camadas de
 * análise (scam-analysis / fake-news) devem então usar a análise
 * determinística de fallback, NUNCA fingir uma resposta de IA. Isso mantém
 * o sistema honesto sobre integrações que ainda não têm credencial.
 */
let cachedProvider: AIProvider | null | undefined;

export function getAIProvider(): AIProvider | null {
  if (cachedProvider !== undefined) return cachedProvider;

  const explicit = process.env.AI_PROVIDER?.toLowerCase();
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (explicit === 'anthropic' && anthropicKey) {
    cachedProvider = new AnthropicProvider(anthropicKey, process.env.ANTHROPIC_MODEL);
  } else if (explicit === 'openai' && openaiKey) {
    cachedProvider = new OpenAIProvider(openaiKey, process.env.OPENAI_MODEL);
  } else if (!explicit && anthropicKey) {
    cachedProvider = new AnthropicProvider(anthropicKey, process.env.ANTHROPIC_MODEL);
  } else if (!explicit && openaiKey) {
    cachedProvider = new OpenAIProvider(openaiKey, process.env.OPENAI_MODEL);
  } else {
    cachedProvider = null;
  }

  return cachedProvider;
}

/** Usado apenas em testes, para resetar o cache do singleton entre casos. */
export function __resetAIProviderCacheForTests() {
  cachedProvider = undefined;
}
