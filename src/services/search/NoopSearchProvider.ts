import type { SearchProvider, SearchResultItem } from './SearchProvider';

/**
 * Provedor de busca "vazio", usado quando nenhuma credencial de busca está
 * configurada. Retorna sempre uma lista vazia — o pipeline de fact-checking
 * já foi projetado para lidar honestamente com a ausência de resultados
 * (classificando como "não confirmada" em vez de inventar fontes).
 */
export class NoopSearchProvider implements SearchProvider {
  readonly name = 'noop';

  async search(): Promise<SearchResultItem[]> {
    return [];
  }
}
