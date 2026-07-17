import 'server-only';

import {getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {getTopicProvider} from '@/lib/repositories/topics';
import type {BetaSearchResult, BetaSearchScope} from '@/lib/beta/types';

export async function searchBetaContent(query: string, scope: BetaSearchScope = 'all'): Promise<BetaSearchResult[]> {
  const normalized = query.trim().toLocaleLowerCase('zh-CN');
  if (!normalized) return [];

  const results: BetaSearchResult[] = [];

  if (scope !== 'knowledge') {
    const topics = await getTopicProvider().getTopics({q: query});
    results.push(...topics.map((topic) => ({
      id: topic.id,
      kind: 'topic' as const,
      typeLabel: 'Topic',
      title: topic.title,
      excerpt: topic.summary,
      href: `/topics/${topic.slug}`,
      statusLabel: 'Beta Preview',
    })));
  }

  if (scope !== 'topics') {
    const [publicViews, foundationObjects] = await Promise.all([
      getPublicWebsiteObjects(),
      getFoundationKnowledgeObjects(),
    ]);
    const publicIds = new Set(publicViews.map((item) => item.id));
    results.push(...foundationObjects
      .filter((item) => publicIds.has(item.id))
      .filter((item) => [item.id, item.title, item.summary, item.body, ...item.tags]
        .join(' ')
        .toLocaleLowerCase('zh-CN')
        .includes(normalized))
      .map((item) => ({
        id: item.id,
        kind: 'knowledge' as const,
        typeLabel: item.type,
        title: item.title,
        excerpt: plainText(item.summary),
        href: `/knowledge/${item.id.toLocaleLowerCase('en')}`,
        statusLabel: 'Foundation Ready',
      })));
  }

  return results.sort((left, right) => exactMatchRank(left, normalized) - exactMatchRank(right, normalized)
    || left.id.localeCompare(right.id, 'en', {numeric: true}));
}

function plainText(value: string): string {
  return value
    .replace(/[*_`#>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function exactMatchRank(result: BetaSearchResult, normalizedQuery: string): number {
  if (result.id.toLocaleLowerCase('en') === normalizedQuery) return 0;
  if (result.title.toLocaleLowerCase('zh-CN') === normalizedQuery) return 1;
  if (result.title.toLocaleLowerCase('zh-CN').includes(normalizedQuery)) return 2;
  return 3;
}
