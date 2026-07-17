import Link from 'next/link';
import type {Metadata} from 'next';
import {TopicCard} from '@/components/beta/TopicCard';
import {SearchBar} from '@/components/platform/SearchBar';
import {getLatestTopics, getPopularTopics, getTopicProvider} from '@/lib/repositories/topics';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '信托制物业知识发布平台 Beta',
  description: '从 Topic 进入信托制物业知识、治理标准、案例、法律依据与研究。',
  alternates: {canonical: '/'},
};

export default async function HomePage() {
  const provider = getTopicProvider();
  const [catalog, latestTopics, popularTopics] = await Promise.all([
    provider.getCatalog(),
    getLatestTopics(3),
    getPopularTopics(3),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfcfb] text-[var(--ink)]">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto w-[min(1120px,calc(100vw-40px))]">
          <div className="mx-auto flex max-w-4xl flex-col items-center pb-20 pt-16 text-center md:pb-24 md:pt-24">
            <p className="text-sm font-semibold tracking-[0.08em] text-[var(--primary-dark)]">中国信托制物业知识平台</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--ink)] md:text-6xl">
              从专题进入知识，<br className="hidden sm:block" />从知识进入治理。
            </h1>
            <div className="mt-2 w-full max-w-3xl text-left">
              <SearchBar action="/search" placeholder="搜索 Topic、知识概念、治理标准或案例" />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
              <span className="text-[var(--subtle)]">热门搜索</span>
              {popularTopics.map((topic) => (
                <Link
                  className="border-b border-transparent pb-0.5 transition hover:border-[var(--primary-dark)] hover:text-[var(--primary-dark)]"
                  href={`/search?q=${encodeURIComponent(topic.title)}`}
                  key={topic.id}
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,calc(100vw-40px))] py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">LATEST TOPICS</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">最新 Topic</h2>
          </div>
          <Link className="text-sm font-semibold text-[var(--primary-dark)]" href="/topics">查看全部 →</Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {latestTopics.map((topic) => (
            <TopicCard categories={catalog.categories} key={topic.id} tags={catalog.tags} topic={topic} />
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto w-[min(1120px,calc(100vw-40px))] py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--primary-dark)]">POPULAR TOPICS</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">热门 Topic</h2>
            </div>
            <p className="max-w-lg text-right text-xs leading-6 text-[var(--subtle)]">
              {catalog.provider === 'foundation' ? '按 Foundation Registry 更新记录排序。' : 'Beta 排序仅用于页面验证，不代表内容权威等级。'}
            </p>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {popularTopics.map((topic, index) => (
              <Link
                className="group grid gap-3 py-7 transition md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center"
                href={`/topics/${topic.slug}`}
                key={topic.id}
              >
                <span className="font-mono text-sm text-[var(--subtle)]">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold transition group-hover:text-[var(--primary-dark)]">{topic.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">{topic.summary}</p>
                </div>
                <span aria-hidden="true" className="text-[var(--primary-dark)]">阅读 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
