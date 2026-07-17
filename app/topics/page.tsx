import Link from 'next/link';
import type {Metadata} from 'next';
import {BetaNav} from '@/components/beta/BetaNav';
import {TopicCard} from '@/components/beta/TopicCard';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {EmptyState} from '@/components/platform/EmptyState';
import {PageTitle} from '@/components/platform/PageTitle';
import {getTopicProvider} from '@/lib/repositories/topics';
import type {TopicQuery} from '@/lib/beta/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Topic 专题',
  description: '按分类、标签和关键词浏览信托制物业 Topic。',
  alternates: {canonical: '/topics'},
};

export default async function TopicsPage({searchParams}: {searchParams: TopicQuery}) {
  const provider = getTopicProvider();
  const [catalog, topics] = await Promise.all([provider.getCatalog(), provider.getTopics(searchParams)]);
  const hasFilters = Boolean(searchParams.q || searchParams.category || searchParams.tag);

  return (
    <main className="platformPage">
      <section className="platformContainer pb-20">
        <BetaNav />
        <Breadcrumb items={[{href: '/', label: '首页'}, {label: 'Topic'}]} />
        <PageTitle
          description="以 Topic 组织概念、治理标准、案例、FAQ、法律依据与研究，形成连续阅读路径。"
          eyebrow="Topic Library"
          meta={[`${topics.length} 个匹配专题`, catalog.provider === 'foundation' ? 'Website Ready' : 'Beta Preview']}
          title="专题 Topic"
        />

        <form action="/topics" className="platformFilterPanel mt-8">
          <label className="sr-only" htmlFor="topic-query">搜索 Topic</label>
          <input defaultValue={searchParams.q} id="topic-query" name="q" placeholder="搜索 Topic、关键词或对象编号" />
          <label className="sr-only" htmlFor="topic-category">分类</label>
          <select defaultValue={searchParams.category ?? ''} id="topic-category" name="category">
            <option value="">全部分类</option>
            {catalog.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="topic-tag">标签</label>
          <select defaultValue={searchParams.tag ?? ''} id="topic-tag" name="tag">
            <option value="">全部标签</option>
            {catalog.tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.label}</option>)}
          </select>
          <button type="submit">筛选 Topic</button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">数据接口：{provider.source}</p>
          {hasFilters ? <Link className="platformTextLink" href="/topics">清除筛选</Link> : null}
        </div>

        <section aria-label="Topic 列表" className="platformSection !pt-8">
          {topics.length ? (
            <div className="platformGrid platformGridThree">
              {topics.map((topic) => <TopicCard categories={catalog.categories} key={topic.id} tags={catalog.tags} topic={topic} />)}
            </div>
          ) : (
            <EmptyState description="请调整关键词、分类或标签；Beta 不会生成伪造的搜索结果。" title="没有匹配的 Topic" />
          )}
        </section>
      </section>
    </main>
  );
}
