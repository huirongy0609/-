import type {BetaTopic, TopicQuery} from '@/lib/beta/types';

export function filterTopics(topics: BetaTopic[], query: TopicQuery = {}): BetaTopic[] {
  const normalizedQuery = query.q?.trim().toLocaleLowerCase('zh-CN') ?? '';

  return topics
    .filter((topic) => !query.category || topic.categoryId === query.category)
    .filter((topic) => !query.tag || topic.tagIds.includes(query.tag))
    .filter((topic) => {
      if (!normalizedQuery) return true;
      const referenceText = topic.sections.flatMap((section) => section.items.flatMap((item) => [item.id, item.title]));
      return [topic.id, topic.title, topic.summary, ...topic.keywords, ...referenceText]
        .join(' ')
        .toLocaleLowerCase('zh-CN')
        .includes(normalizedQuery);
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.id.localeCompare(right.id));
}
