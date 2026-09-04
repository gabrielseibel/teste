import type { SearchProvider, SearchResultItem } from './SearchProvider';
import { tierForUrl } from './SearchProvider';

/**
 * Adapter para a Brave Search API (https://api.search.brave.com).
 * Requer BRAVE_SEARCH_API_KEY no ambiente. Escolhida como padrão de
 * referência por ter um plano gratuito simples de obter uma chave de API;
 * a interface SearchProvider permite trocar por outro provedor (Bing, Google
 * Programmable Search, SerpAPI etc.) sem alterar o restante do sistema.
 */
export class BraveSearchProvider implements SearchProvider {
  readonly name = 'brave-search';

  constructor(private readonly apiKey: string) {}

  async search(query: string, options?: { maxResults?: number; signal?: AbortSignal }): Promise<SearchResultItem[]> {
    const maxResults = options?.maxResults ?? 5;
    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(maxResults));
    url.searchParams.set('country', 'br');
    url.searchParams.set('search_lang', 'pt');

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': this.apiKey,
      },
      signal: options?.signal,
    });

    if (!response.ok) {
      throw new Error(`Falha na busca (Brave Search): ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as {
      web?: { results?: Array<{ title: string; url: string; description?: string; age?: string }> };
    };

    const results = json.web?.results ?? [];
    return results.slice(0, maxResults).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.description ?? '',
      publishedDate: r.age,
      tier: tierForUrl(r.url),
    }));
  }
}
