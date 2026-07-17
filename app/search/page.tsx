import Link from 'next/link';
import type {Metadata} from 'next';
import {BetaNav} from '@/components/beta/BetaNav';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {EmptyState} from '@/components/platform/EmptyState';
import {PageTitle} from '@/components/platform/PageTitle';
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
    <main className="platformPage">
      <section className="platformContainer pb-20">
        <BetaNav />
        <Breadcrumb items={[{href: '/', label: '首页'}, {label: '搜索'}]} />
        <PageTitle
          description="基础版搜索覆盖 Topic 标题、关键词、索引条目，以及已公开 Foundation JD 的标题、摘要和正文。"
          eyebrow="Search Beta"
          title="搜索平台知识"
        />

        <form action="/search" className="platformFilterPanel mt-8">
          <label className="sr-only" htmlFor="site-search-query">搜索内容</label>
          <input defaultValue={query} id="site-search-query" name="q" placeholder="输入标题、关键词、Topic 或 Object ID" />
          <label className="sr-only" htmlFor="site-search-scope">搜索范围</label>
          <select defaultValue={scope} id="site-search-scope" name="scope">
            <option value="all">全部范围</option>
            <option value="topics">仅 Topic</option>
            <option value="knowledge">仅公开知识</option>
          </select>
          <button type="submit">搜索</button>
        </form>

        <section aria-live="polite" className="platformSection !pt-8">
          {!query ? (
            <EmptyState description="可搜索“信托制物业”“共同委托”“开放式预算”或 Object ID。" title="输入关键词开始搜索" />
          ) : results.length ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm text-[var(--muted)]">“{query}”找到 {results.length} 条结果</p>
                <Link className="platformTextLink" href="/search">清除搜索</Link>
              </div>
              <div className="grid gap-4">
                {results.map((result) => (
                  <article className="knowledgeCard" key={`${result.kind}-${result.id}`}>
                    <div className="knowledgeCardMeta">
                      <Tag>{result.typeLabel}</Tag>
                      <span className="text-xs font-semibold text-[var(--subtle)]">{result.statusLabel}</span>
                    </div>
                    <h3><Link href={result.href}>{result.title}</Link></h3>
                    <p>{result.excerpt}</p>
                    <div className="knowledgeCardFooter">
                      <span>{result.id}</span>
                      <Link className="platformTextLink" href={result.href}>打开结果 →</Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <EmptyState description="请调整关键词或搜索范围；搜索不会补造 Topic 或知识对象。" title={`没有找到“${query}”`} />
          )}
        </section>
      </section>
    </main>
  );
}

function isSearchScope(value: string | undefined): value is BetaSearchScope {
  return value === 'all' || value === 'topics' || value === 'knowledge';
}
