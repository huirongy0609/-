import Link from 'next/link';
import {Tag} from '@/components/platform/Tag';
import type {BetaTopic, TopicTaxonomyEntry} from '@/lib/beta/types';

export function TopicCard({
  topic,
  categories,
  tags,
  dark = false,
}: {
  topic: BetaTopic;
  categories: TopicTaxonomyEntry[];
  tags: TopicTaxonomyEntry[];
  dark?: boolean;
}) {
  const category = categories.find((item) => item.id === topic.categoryId)?.label ?? topic.categoryId;
  const topicTags = tags.filter((item) => topic.tagIds.includes(item.id));
  const objectCount = topic.sections.reduce((total, section) => total + section.items.length, 0);

  return (
    <Link
      className={dark
        ? 'block rounded-card border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-0.5 hover:border-civic/40 hover:bg-white/[0.065]'
        : 'platformEntryCard'}
      href={`/topics/${topic.slug}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{category}</Tag>
        <span className={dark ? 'text-xs font-semibold text-data-muted' : 'text-xs font-semibold text-[var(--subtle)]'}>{topic.releaseLevel}</span>
      </div>
      <h3 className={dark ? 'mt-5 text-2xl font-semibold text-data-white' : undefined}>{topic.title}</h3>
      <p className={dark ? 'mt-3 text-sm leading-7 text-data-soft' : undefined}>{topic.summary}</p>
      <div className="platformTagRow mt-5">
        {topicTags.map((tag) => <Tag key={tag.id}>{tag.label}</Tag>)}
      </div>
      <div className={`mt-6 flex items-center justify-between gap-4 text-sm font-semibold ${dark ? 'text-civic' : 'text-[var(--primary-dark)]'}`}>
        <span>{objectCount} 个索引条目</span>
        <span aria-hidden="true">阅读专题 →</span>
      </div>
    </Link>
  );
}
