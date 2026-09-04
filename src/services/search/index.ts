import { BraveSearchProvider } from './BraveSearchProvider';
import { NoopSearchProvider } from './NoopSearchProvider';
import type { SearchProvider } from './SearchProvider';

export type { SearchProvider, SearchResultItem } from './SearchProvider';

let cached: SearchProvider | undefined;

export function getSearchProvider(): SearchProvider {
  if (cached) return cached;
  const braveKey = process.env.BRAVE_SEARCH_API_KEY;
  cached = braveKey ? new BraveSearchProvider(braveKey) : new NoopSearchProvider();
  return cached;
}

export function __resetSearchProviderCacheForTests() {
  cached = undefined;
}
