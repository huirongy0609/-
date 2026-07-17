import Image from 'next/image';
import Link from 'next/link';
import type {Metadata} from 'next';
import {BetaNav} from '@/components/beta/BetaNav';
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
    <main className="min-h-screen bg-graphite text-data-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-governance">
        <div className="platform-atmosphere" />
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100vw-40px))] pb-20">
          <BetaNav dark />
          <div className="grid gap-14 pt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <Image alt="聚道物业研究院" height={64} priority src="/brand/judao-logo-seal.png" width={64} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-civic-muted">judao.club · Website Beta</p>
                  <p className="mt-1 text-sm text-data-soft">中国信托制物业发展平台</p>
                </div>
              </div>
              <h1 className="mt-9 max-w-4xl text-5xl font-semibold leading-[1.08] text-data-white md:text-7xl">
                从专题进入知识，<br />从知识进入治理。
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-data-soft">
                面向社区治理实践的信托制物业知识发布平台，连接概念、治理标准、案例、法律依据、常见问题与研究。
              </p>
              <div className="max-w-3xl">
                <SearchBar action="/search" placeholder="搜索标题、关键词、Topic 或知识正文" />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="platform-primary-link" href="/topics">浏览全部 Topic →</Link>
                <Link className="inline-flex min-h-11 items-center rounded-card border border-white/15 px-5 text-sm font-semibold text-data-soft transition hover:border-civic/40 hover:text-data-white" href="/about">
                  了解平台
                </Link>
              </div>
            </div>

            <aside className="rounded-panel border border-white/10 bg-white/[0.045] p-7 shadow-panel backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-civic-muted">First Reading</p>
              <h2 className="mt-4 text-2xl font-semibold">第一次来到这里</h2>
              <p className="mt-4 text-sm leading-7 text-data-soft">先选择一个 Topic，再沿着 Topic Index 阅读已批准知识与待审核关联对象。</p>
              <div className="mt-7 grid gap-3">
                {latestTopics.map((topic, index) => (
                  <Link className="flex items-center justify-between gap-4 border-t border-white/10 py-4 text-sm font-semibold text-data-white transition hover:text-civic" href={`/topics/${topic.slug}`} key={topic.id}>
                    <span>{String(index + 1).padStart(2, '0')} · {topic.title}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-data-muted">{catalog.notice}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,calc(100vw-40px))] py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-civic-muted">Latest Topics</p>
            <h2 className="mt-3 text-3xl font-semibold">最新 Topic</h2>
          </div>
          <Link className="text-sm font-semibold text-civic" href="/topics">查看全部 →</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {latestTopics.map((topic) => (
            <TopicCard categories={catalog.categories} dark key={topic.id} tags={catalog.tags} topic={topic} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid w-[min(1200px,calc(100vw-40px))] gap-12 py-20 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-civic-muted">Popular Topics</p>
            <h2 className="mt-3 text-3xl font-semibold">热门 Topic</h2>
            <p className="mt-5 text-sm leading-8 text-data-soft">Beta 热度仅用于演示排序，不代表平台正式评价、批准顺序或内容权威等级。</p>
          </div>
          <div className="grid gap-3">
            {popularTopics.map((topic, index) => (
              <Link className="flex items-center justify-between gap-5 rounded-card border border-white/10 px-6 py-5 transition hover:border-civic/40 hover:bg-white/[0.04]" href={`/topics/${topic.slug}`} key={topic.id}>
                <div className="flex items-center gap-5">
                  <span className="font-mono text-sm text-civic-muted">0{index + 1}</span>
                  <div>
                    <strong className="text-lg text-data-white">{topic.title}</strong>
                    <p className="mt-1 text-sm text-data-muted">{topic.summary}</p>
                  </div>
                </div>
                <span aria-hidden="true" className="text-civic">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1200px,calc(100vw-40px))] gap-10 py-20 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-civic-muted">About the Platform</p>
          <h2 className="mt-3 text-3xl font-semibold">可阅读、可引用、可持续演进的知识基础设施</h2>
        </div>
        <div className="text-base leading-9 text-data-soft">
          <p>平台以 Topic 组织阅读路径，以 Foundation Object 管理正式知识，以清晰的生命周期边界区分已批准内容与 Beta 演示索引。</p>
          <p className="mt-4">本阶段优先交付可运行网站，再通过后续 Sprint 持续接入正式 Topic、完善搜索和发布流程。</p>
        </div>
      </section>
    </main>
  );
}
