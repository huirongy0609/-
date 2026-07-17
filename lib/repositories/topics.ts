import 'server-only';

import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {cache} from 'react';
import {filterTopics} from '@/lib/beta/topic-query';
import type {BetaTopic, TopicCatalog, TopicProvider, TopicQuery} from '@/lib/beta/types';

const catalogPath = path.join(process.cwd(), 'data', 'beta-topics.json');

const loadCatalog = cache(async (): Promise<TopicCatalog> => {
  const source = await readFile(catalogPath, 'utf8');
  const parsed = JSON.parse(source) as TopicCatalog;
  if (parsed.provider !== 'beta_fallback' || !Array.isArray(parsed.topics)) {
    throw new Error('Beta topic catalog is invalid.');
  }
  return parsed;
});

const betaFallbackProvider: TopicProvider = {
  source: 'beta_fallback',
  getCatalog: loadCatalog,
  async getTopics(query = {}) {
    const catalog = await loadCatalog();
    return filterTopics(catalog.topics, query);
  },
  async getTopicBySlug(slug) {
    const catalog = await loadCatalog();
    return catalog.topics.find((topic) => topic.slug === slug);
  },
};

export function getTopicProvider(): TopicProvider {
  // Foundation Topic Provider 接入后只需替换此工厂，不改变页面契约。
  return betaFallbackProvider;
}

export async function getLatestTopics(limit = 3): Promise<BetaTopic[]> {
  const topics = await getTopicProvider().getTopics();
  return topics.slice(0, limit);
}

export async function getPopularTopics(limit = 3): Promise<BetaTopic[]> {
  const topics = await getTopicProvider().getTopics();
  return [...topics]
    .sort((left, right) => right.popularity - left.popularity || left.id.localeCompare(right.id))
    .slice(0, limit);
}
