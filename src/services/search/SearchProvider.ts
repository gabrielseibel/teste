/**
 * Camada de abstração para pesquisa na internet, usada pelo pipeline de
 * fact-checking (Modo 2) para localizar fontes públicas independentes.
 *
 * Assim como AIProvider, nenhuma outra parte do sistema deve chamar uma API
 * de busca diretamente. Resultados nunca são tratados como verdade — apenas
 * como evidência a ser cruzada pela IA, sempre citando a fonte original.
 */

import { classifyDomainTier } from '@/features/fake-news/sourceHierarchy';

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  tier: 1 | 2 | 3 | 4;
}

export interface SearchProvider {
  readonly name: string;
  search(query: string, options?: { maxResults?: number; signal?: AbortSignal }): Promise<SearchResultItem[]>;
}

export function tierForUrl(url: string): 1 | 3 | 4 {
  try {
    return classifyDomainTier(new URL(url).hostname);
  } catch {
    return 4;
  }
}
