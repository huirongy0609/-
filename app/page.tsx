import Link from 'next/link';
import type {Metadata} from 'next';
import {TopicCard} from '@/components/beta/TopicCard';
import {SearchBar} from '@/components/platform/SearchBar';
import {Tag} from '@/components/platform/Tag';
import {WebsiteObjectCard} from '@/components/website/WebsiteObjectCard';
import {topic001MvpContent} from '@/lib/content/topic001-mvp';
import {getTopicProvider} from '@/lib/repositories/topics';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: topic001MvpContent.title,
  description: topic001MvpContent.seoDescription,
  keywords: [...topic001MvpContent.keywords],
  alternates: {canonical: '/'},
  openGraph: {
    title: topic001MvpContent.title,
    description: topic001MvpContent.seoDescription,
    type: 'website',
    url: '/',
  },
};

export default async function HomePage() {
  const provider = getTopicProvider();
  const [catalog, topic, publicObjects] = await Promise.all([
    provider.getCatalog(),
    provider.getTopicBySlug(topic001MvpContent.slug),
    getPublicWebsiteObjects(),
  ]);
  const publicJds = publicObjects.filter((item) => item.type === 'JD'
    && topic001MvpContent.publicObjectIds.includes(item.id as typeof topic001MvpContent.publicObjectIds[number]));

  return (
    <main className="min-h-screen bg-[#fbfcfb] text-[var(--ink)]">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto w-[min(1120px,calc(100vw-40px))]">
          <div className="mx-auto flex max-w-4xl flex-col items-center pb-20 pt-16 text-center md:pb-24 md:pt-24">
            <p className="text-sm font-semibold tracking-[0.08em] text-[var(--primary-dark)]">中国信托制物业发展平台</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--ink)] md:text-6xl">
              {topic001MvpContent.homeCard.subtitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
              {topic001MvpContent.homeCard.introduction}
            </p>
            <div className="mt-8 w-full max-w-3xl text-left">
              <SearchBar action="/search" placeholder="搜索 Topic、知识概念、治理标准或案例" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,calc(100vw-40px))] py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">KNOWLEDGE</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">知识分类</h2>
          </div>
          <Link className="text-sm font-semibold text-[var(--primary-dark)]" href="/knowledge">查看全部 →</Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <Link className="platformEntryCard" href="/knowledge?type=JD">
            <Tag>JD</Tag>
            <h3>治理词典</h3>
            <p>7个已批准公开的JD</p>
            <div className="knowledgeCardFooter">
              <span>Foundation Ready</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto w-[min(1120px,calc(100vw-40px))] py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">TOPIC001</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">首页推荐内容</h2>
            </div>
          </div>
          <div className="mt-7 max-w-2xl">
            {topic ? <TopicCard categories={catalog.categories} tags={catalog.tags} topic={topic} /> : null}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,calc(100vw-40px))] py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">LATEST CONTENT</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">最新内容</h2>
          </div>
        </div>
        {publicJds.length ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publicJds.map((item) => <WebsiteObjectCard item={item} key={item.id} />)}
          </div>
        ) : null}
      </section>
    </main>
  );
}
