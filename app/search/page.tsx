import Link from 'next/link';
import type {Metadata} from 'next';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {Tag} from '@/components/platform/Tag';
import {searchBetaContent} from '@/lib/repositories/beta-search';
import type {BetaSearchScope} from '@/lib/beta/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索 Topic 与 Foundation Ready 知识对象。',
  alternates: {canonical: '/search'},
};

export default async function SearchPage({searchParams}: {searchParams: {q?: string; scope?: string}}) {
  const query = searchParams.q?.trim() ?? '';
  const scope = isSearchScope(searchParams.scope) ? searchParams.scope : 'all';
  const results = await searchBetaContent(query, scope);

  return (
    <main className="min-h-screen bg-[#fbfcfb] text-[var(--ink)]">
      <section className="mx-auto w-[min(1120px,calc(100vw-40px))] pb-24">
        <Breadcrumb items={[{href: '/', label: '首页'}, {label: '搜索'}]} />

        <header className="mx-auto max-w-4xl pb-10 pt-14 text-center md:pt-20">
          <p className="text-sm font-semibold tracking-[0.08em] text-[var(--primary-dark)]">KNOWLEDGE SEARCH</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-6xl">搜索平台知识</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">从 Topic、知识概念、治理标准和公开 Foundation 内容中找到清晰的阅读入口。</p>
        </header>

        <form action="/search" className="mx-auto grid max-w-4xl gap-3 rounded-card border border-[var(--line-strong)] bg-white p-3 shadow-[0_14px_50px_rgba(18,33,30,0.08)] md:grid-cols-[minmax(0,1fr)_150px_auto]">
          <label className="sr-only" htmlFor="site-search-query">搜索内容</label>
          <input className="min-h-14 min-w-0 border-0 bg-transparent px-3 text-lg text-[var(--ink)] outline-none placeholder:text-[var(--subtle)]" defaultValue={query} id="site-search-query" name="q" placeholder="搜索 Topic、关键词或 Object ID" />
          <label className="sr-only" htmlFor="site-search-scope">搜索范围</label>
          <select className="min-h-12 border-0 border-t border-[var(--line)] bg-white px-3 text-sm text-[var(--muted)] outline-none md:border-l md:border-t-0" defaultValue={scope} id="site-search-scope" name="scope">
            <option value="all">全部范围</option>
            <option value="topics">仅 Topic</option>
            <option value="knowledge">仅公开知识</option>
          </select>
          <button className="min-h-12 rounded-card border-0 bg-[var(--primary-dark)] px-7 text-sm font-semibold text-white transition hover:opacity-90" type="submit">搜索</button>
        </form>

        <section aria-live="polite" className="mx-auto mt-14 max-w-4xl">
          {!query ? (
            <div className="border-t border-[var(--line)] py-14 text-center">
              <h2 className="text-xl font-semibold">输入关键词开始搜索</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">可搜索“信托制物业”“共同委托”“开放式预算”或 Object ID。</p>
            </div>
          ) : results.length ? (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
                <p className="text-sm text-[var(--muted)]">“{query}”找到 {results.length} 条结果</p>
                <Link className="text-sm font-semibold text-[var(--primary-dark)]" href="/search">清除搜索</Link>
              </div>
              <div className="divide-y divide-[var(--line)]">
                {results.map((result) => (
                  <article className="py-7" key={`${result.kind}-${result.id}`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <Tag>{result.typeLabel}</Tag>
                      <span className="text-xs font-semibold text-[var(--subtle)]">{result.statusLabel}</span>
                      <span className="text-xs text-[var(--subtle)]">{result.id}</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold leading-9"><Link className="hover:text-[var(--primary-dark)]" href={result.href}>{result.title}</Link></h2>
                    <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[var(--muted)]">{result.excerpt}</p>
                    <Link className="mt-4 inline-block text-sm font-semibold text-[var(--primary-dark)]" href={result.href}>打开结果 →</Link>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="border-t border-[var(--line)] py-14 text-center">
              <h2 className="text-xl font-semibold">没有找到“{query}”</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">请调整关键词或搜索范围；搜索不会补造 Topic 或知识对象。</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function isSearchScope(value: string | undefined): value is BetaSearchScope {
  return value === 'all' || value === 'topics' || value === 'knowledge';
}
