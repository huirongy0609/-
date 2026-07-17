import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
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
    <main className="min-h-screen bg-[#fbfcfb] text-[var(--ink)]">
      <article className="mx-auto w-[min(1120px,calc(100vw-40px))] pb-24">
        <Breadcrumb items={[{href: '/', label: '首页'}, {href: '/topics', label: 'Topic'}, {label: topic.title}]} />

        <header className="mx-auto max-w-[820px] pb-12 pt-12 md:pb-16 md:pt-16">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--subtle)]">
            <Tag>Topic Index</Tag>
            <span>{topic.id}</span>
            <span>{category}</span>
            <span>Beta Preview</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.2] tracking-[-0.02em] md:text-6xl">{topic.title}</h1>
          <p className="mt-6 text-lg leading-9 text-[var(--muted)]">{topic.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => <Tag key={tag.id}>{tag.label}</Tag>)}
          </div>
        </header>

        <div className="grid items-start gap-10 border-t border-[var(--line)] pt-10 lg:grid-cols-[210px_minmax(0,760px)] lg:justify-center lg:gap-16">
          <aside className="border-b border-[var(--line)] pb-8 lg:sticky lg:top-8 lg:border-b-0 lg:pb-0">
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--subtle)]">本页目录</p>
            <nav aria-label="Topic Index" className="mt-5 grid justify-start gap-1">
              <a className="border-l-2 border-[var(--primary-dark)] py-2 pl-4 text-sm font-semibold text-[var(--primary-dark)]" href="#topic-index">Topic Index</a>
              {topic.sections.map((section) => (
                <a className="border-l-2 border-[var(--line)] py-2 pl-4 text-sm text-[var(--muted)] transition hover:border-[var(--primary-dark)] hover:text-[var(--primary-dark)]" href={`#${section.type.toLocaleLowerCase('en')}`} key={section.type}>
                  {section.type} · {section.label}
                </a>
              ))}
            </nav>
            <Link className="mt-7 inline-block text-sm font-semibold text-[var(--primary-dark)]" href="/topics">← 返回 Topic 列表</Link>
          </aside>

          <div className="min-w-0">
            <div className="border-l-2 border-[var(--line-strong)] pl-5 text-sm leading-7 text-[var(--muted)]">
              {catalog.notice} 已批准对象可进入正文；`in_review` 条目仅展示索引元数据，不提供候选正文链接。
            </div>
            <section className="scroll-mt-10 border-b border-[var(--line)] py-12 first:pt-10" id="topic-index">
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">阅读说明</p>
              <h2 className="mt-3 text-3xl font-semibold">Topic Index</h2>
              <p className="mt-5 text-[17px] leading-9 text-[var(--muted)]">本页按 JD → GT → FAQ → LAW → CASE → Research 组织阅读。每个条目的状态直接来自 Beta 目录；页面不会把待审核条目标记为 Foundation Ready。</p>
            </section>
            {topic.sections.map((section) => <TopicSectionBlock key={section.type} section={section} />)}
          </div>
        </div>
      </article>
    </main>
  );
}

function TopicSectionBlock({section}: {section: TopicSection}) {
  return (
    <section className="scroll-mt-10 border-b border-[var(--line)] py-12" id={section.type.toLocaleLowerCase('en')}>
      <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">{section.type}</p>
      <h2 className="mt-3 text-3xl font-semibold">{section.label}</h2>
      {section.items.length ? (
        <div className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {section.items.map((item) => (
            <div className="flex flex-wrap items-center justify-between gap-5 py-5" key={item.id}>
              <div>
                <p className="m-0 text-xs font-semibold text-[var(--subtle)]">{item.id}</p>
                {item.href ? (
                  <Link className="mt-2 block text-base font-semibold leading-7 text-[var(--ink)] hover:text-[var(--primary-dark)]" href={item.href}>{item.title}</Link>
                ) : (
                  <strong className="mt-2 block text-base leading-7 text-[var(--ink)]">{item.title}</strong>
                )}
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">当前 Beta 目录没有可展示条目，等待 Foundation 发布。</p>
      )}
    </section>
  );
}
