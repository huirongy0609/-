import 'server-only';

import {searchTopicRepository} from '@/lib/repositories/topics';
import type {BetaSearchResult, BetaSearchScope} from '@/lib/beta/types';

/** @deprecated Use searchTopicRepository. Retained for ENG-023 compatibility. */
export function searchBetaContent(query: string, scope: BetaSearchScope = 'all'): Promise<BetaSearchResult[]> {
  return searchTopicRepository(query, {scope});
}
