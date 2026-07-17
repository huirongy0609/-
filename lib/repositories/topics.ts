import 'server-only';

import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {cache} from 'react';
import {filterTopics} from '@/lib/beta/topic-query';
import {
  isWebsiteReadyTopic,
  validateTopicRegistry,
} from '@/lib/foundation/topic-registry';
import {getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {getWebsiteObjectHref} from '@/lib/website/foundation-view-model';
import type {
  BetaFallbackCatalog,
  BetaSearchResult,
  BetaSearchScope,
  RepositorySearchOptions,
  Topic,
  TopicCatalog,
  TopicProvider,
  TopicValidationWarning,
} from '@/lib/beta/types';

const topicRegistryPath = path.join(process.cwd(), 'config', 'foundation', 'topic-registry.v1.json');
const betaFallbackPath = path.join(process.cwd(), 'data', 'beta-topics.json');

let resolvedSource: TopicProvider['source'] = 'foundation';

const loadRepositoryCatalog = cache(async (): Promise<TopicCatalog> => {
  const registry = await readAndValidateRegistry();
  if (!registry.topics.length) {
    resolvedSource = 'beta_fallback';
    return loadBetaFallback(registry.warnings);
  }

  resolvedSource = 'foundation';
  const publicObjects = await getPublicWebsiteObjects();
  const warnings = [...registry.warnings];
  const hydratedTopics = hydrateTopicReferences(registry.topics, publicObjects, warnings);

  return {
    schemaVersion: registry.schemaVersion,
    provider: 'foundation',
    notice: 'Topic 数据来自 Foundation Topic Registry；仅 approved + Website Ready Topic 对网站公开。',
    categories: registry.categories,
    tags: registry.tags,
    topics: hydratedTopics.filter(isWebsiteReadyTopic),
    warnings,
  };
});

const repositoryProvider: TopicProvider = {
  get source() {
    return resolvedSource;
  },
  getCatalog: loadRepositoryCatalog,
  async getTopics(query = {}) {
    const catalog = await loadRepositoryCatalog();
    return filterTopics(catalog.topics, query);
  },
  async getTopicBySlug(slug) {
    const catalog = await loadRepositoryCatalog();
    return catalog.topics.find((topic) => topic.slug === slug);
  },
};

/** Website's only Topic data entry. */
export function getTopicProvider(): TopicProvider {
  return repositoryProvider;
}

export async function getLatestTopics(limit = 3): Promise<Topic[]> {
  const topics = await repositoryProvider.getTopics();
  return topics.slice(0, limit);
}

export async function getPopularTopics(limit = 3): Promise<Topic[]> {
  const topics = await repositoryProvider.getTopics();
  return [...topics]
    .sort((left, right) => right.popularity - left.popularity || left.id.localeCompare(right.id))
    .slice(0, limit);
}

/**
 * Repository Search contract. `includeFullText` is intentionally optional so a
 * future index or API can replace filesystem body scans without changing pages.
 */
export async function searchTopicRepository(
  query: string,
  options: RepositorySearchOptions = {},
): Promise<BetaSearchResult[]> {
  const normalized = query.trim().toLocaleLowerCase('zh-CN');
  if (!normalized) return [];

  const scope: BetaSearchScope = options.scope ?? 'all';
  const results: BetaSearchResult[] = [];

  if (scope !== 'knowledge') {
    const topics = await repositoryProvider.getTopics({q: query});
    results.push(...topics.map((topic) => ({
      id: topic.id,
      kind: 'topic' as const,
      typeLabel: 'Topic',
      title: topic.title,
      excerpt: topic.summary,
      href: `/topics/${topic.slug}`,
      statusLabel: topic.releaseLevel,
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
      .filter((item) => {
        const fields = [item.id, item.title, item.summary, item.category, ...item.tags];
        if (options.includeFullText) fields.push(item.body);
        return fields.join(' ').toLocaleLowerCase('zh-CN').includes(normalized);
      })
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

async function readAndValidateRegistry() {
  try {
    const source = await readFile(topicRegistryPath, 'utf8');
    return validateTopicRegistry(JSON.parse(source) as unknown);
  } catch (error) {
    return validateTopicRegistry({
      topics: [],
      schemaVersion: '1.0',
      foundationIndex: 'knowledge/foundation/index.json',
      repositoryWarning: error instanceof Error ? error.message : String(error),
    });
  }
}

async function loadBetaFallback(registryWarnings: TopicValidationWarning[]): Promise<TopicCatalog> {
  const source = await readFile(betaFallbackPath, 'utf8');
  const parsed = JSON.parse(source) as BetaFallbackCatalog;
  if (parsed.provider !== 'beta_fallback' || !Array.isArray(parsed.topics)) {
    return {
      schemaVersion: '1.0',
      provider: 'beta_fallback',
      notice: 'Beta fallback 无法读取；当前没有可展示 Topic。',
      categories: [],
      tags: [],
      topics: [],
      warnings: [...registryWarnings, {code: 'INVALID_FALLBACK', message: 'Beta fallback catalog 无效。'}],
    };
  }

  const warnings = [...registryWarnings, {code: 'BETA_FALLBACK_ACTIVE', message: 'Foundation Topic Registry 无 Topic 数据，已启用 beta_fallback。'}];
  const normalizedTopics: Topic[] = parsed.topics.map((topic) => ({
    ...topic,
    subtitle: topic.subtitle ?? '',
    status: 'in_review',
    releaseLevel: 'Candidate',
    evidence: topic.evidence ?? [],
  }));
  const publicObjects = await getPublicWebsiteObjects();

  return {
    schemaVersion: parsed.schemaVersion,
    provider: 'beta_fallback',
    notice: parsed.notice,
    categories: parsed.categories,
    tags: parsed.tags,
    topics: hydrateTopicReferences(normalizedTopics, publicObjects, warnings),
    warnings,
  };
}

function hydrateTopicReferences(
  topics: Topic[],
  publicObjects: Awaited<ReturnType<typeof getPublicWebsiteObjects>>,
  warnings: TopicValidationWarning[],
): Topic[] {
  const publicById = new Map(publicObjects.map((object) => [object.id, object]));
  return topics.map((topic) => ({
    ...topic,
    sections: topic.sections.map((section) => ({
      ...section,
      items: section.items.map((reference) => {
        const object = publicById.get(reference.id);
        if (!object) {
          if (topic.releaseLevel === 'Website Ready') {
            warnings.push({
              code: 'UNRESOLVED_FOUNDATION_REFERENCE',
              message: `Website Ready Topic ${topic.id} 引用了未公开 Foundation Object: ${reference.id}。`,
              topicId: topic.id,
            });
          }
          return {...reference, status: 'in_review' as const, href: undefined};
        }
        return {
          ...reference,
          title: object.title,
          status: 'approved' as const,
          href: getWebsiteObjectHref(object),
        };
      }),
    })),
  }));
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
