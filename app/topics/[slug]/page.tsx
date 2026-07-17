import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {BetaNav} from '@/components/beta/BetaNav';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {PageTitle} from '@/components/platform/PageTitle';
import {StatusBadge} from '@/components/platform/StatusBadge';
import {Tag} from '@/components/platform/Tag';
import {getTopicProvider} from '@/lib/repositories/topics';
import type {TopicSection} from '@/lib/beta/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {
  const topic = await getTopicProvider().getTopicBySlug(params.slug);
  if (!topic) return {title: 'Topic 未找到'};
  return {
    title: topic.title,
    description: topic.summary,
    alternates: {canonical: `/topics/${topic.slug}`},
  };
}

export default async function TopicDetailPage({params}: {params: {slug: string}}) {
  const provider = getTopicProvider();
  const [catalog, topic] = await Promise.all([provider.getCatalog(), provider.getTopicBySlug(params.slug)]);
  if (!topic) notFound();

  const category = catalog.categories.find((item) => item.id === topic.categoryId)?.label ?? topic.categoryId;
  const tags = catalog.tags.filter((item) => topic.tagIds.includes(item.id));

  return (
    <main className="platformPage">
      <article className="platformContainer pb-20">
        <BetaNav />
        <Breadcrumb items={[{href: '/', label: '首页'}, {href: '/topics', label: 'Topic'}, {label: topic.title}]} />
        <PageTitle
          description={topic.summary}
          eyebrow="Topic Index"
          meta={[topic.id, category, 'Beta Preview']}
          tags={tags.map((tag) => tag.label)}
          title={topic.title}
        />

        <section className="mb-8 rounded-card border border-[var(--line)] bg-[var(--surface-soft)] px-5 py-4 text-sm leading-7 text-[var(--muted)]">
          {catalog.notice} 已批准对象可进入正文；`in_review` 条目仅展示索引元数据，不提供候选正文链接。
        </section>

        <div className="platformLayout">
          <div className="grid gap-6">
            <section className="articleBody" id="topic-index">
              <p className="platformEyebrow">阅读说明</p>
              <h2>Topic Index</h2>
              <p>本页按 JD → GT → FAQ → LAW → CASE → Research 组织阅读。每个条目的状态直接来自 Beta 目录；页面不会把待审核条目标记为 Foundation Ready。</p>
            </section>
            {topic.sections.map((section) => <TopicSectionBlock key={section.type} section={section} />)}
          </div>

          <aside className="platformSidebar">
            <h2>专题目录</h2>
            <nav aria-label="Topic Index" className="mt-4 grid gap-3">
              <a className="platformTextLink" href="#topic-index">Topic Index</a>
              {topic.sections.map((section) => (
                <a className="platformTextLink" href={`#${section.type.toLocaleLowerCase('en')}`} key={section.type}>{section.type} · {section.label}</a>
              ))}
            </nav>
            <div className="mt-7 border-t border-[var(--line)] pt-6">
              <h2>标签</h2>
              <div className="platformTagRow mt-4">
                {tags.map((tag) => <Tag key={tag.id}>{tag.label}</Tag>)}
              </div>
            </div>
            <div className="mt-7 border-t border-[var(--line)] pt-6">
              <Link className="platformTextLink" href="/topics">返回 Topic 列表</Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

function TopicSectionBlock({section}: {section: TopicSection}) {
  return (
    <section className="articleBody" id={section.type.toLocaleLowerCase('en')}>
      <p className="platformEyebrow">{section.type}</p>
      <h2>{section.label}</h2>
      {section.items.length ? (
        <div className="mt-5 grid gap-3">
          {section.items.map((item) => (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-[var(--line)] bg-[var(--surface-soft)] px-5 py-4" key={item.id}>
              <div>
                <p className="m-0 text-xs font-semibold text-[var(--subtle)]">{item.id}</p>
                {item.href ? (
                  <Link className="mt-1 block font-semibold text-[var(--ink)] hover:text-[var(--primary-dark)]" href={item.href}>{item.title}</Link>
                ) : (
                  <strong className="mt-1 block text-[var(--ink)]">{item.title}</strong>
                )}
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">当前 Beta 目录没有可展示条目，等待 Foundation 发布。</p>
      )}
    </section>
  );
}
