import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {ArticleBody} from '@/components/platform/ArticleBody';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {CitationPanel} from '@/components/platform/CitationPanel';
import {KnowledgeRelation} from '@/components/platform/KnowledgeRelation';
import {PageTitle} from '@/components/platform/PageTitle';
import {Sidebar} from '@/components/platform/Sidebar';
import {getPlatformStandard, getPlatformStandards} from '@/lib/repositories/standards';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {
  const standard = await getPlatformStandard(params.slug);
  if (!standard) return {title: '标准未找到'};
  return {
    title: standard.title,
    description: standard.summary,
    alternates: {canonical: `/standards/${standard.slug}`},
    openGraph: {
      title: standard.title,
      description: standard.summary,
      type: 'article',
      url: `/standards/${standard.slug}`,
    },
  };
}

export default async function StandardDetailPage({params}: {params: {slug: string}}) {
  const [standard, standards] = await Promise.all([getPlatformStandard(params.slug), getPlatformStandards()]);
  if (!standard) notFound();

  const related = standards.filter((item) => item.slug !== standard.slug).slice(0, 3);
  const currentIndex = standards.findIndex((item) => item.slug === standard.slug);
  const previous = currentIndex > 0 ? standards[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < standards.length - 1 ? standards[currentIndex + 1] : undefined;
  const toc = extractToc(standard.body);

  return (
    <main className="platformPage">
      <article className="platformContainer">
        <Breadcrumb
          items={[
            {href: '/', label: '首页'},
            {href: '/standards', label: '标准中心'},
            {label: standard.title},
          ]}
        />
        <PageTitle
          description={standard.summary}
          eyebrow={standard.type}
          meta={[standard.version, standard.filePath]}
          status={standard.status}
          title={standard.title}
        />

        <KnowledgeRelation
          items={[
            {label: '标准编号', value: standard.version},
            {label: '生命周期', value: standard.status},
            {label: '关联标准', value: related[0]?.title || '暂无已登记关联', href: related[0] ? `/standards/${related[0].slug}` : undefined},
            {label: '上一篇', value: previous?.title || '暂无', href: previous ? `/standards/${previous.slug}` : undefined},
            {label: '下一篇', value: next?.title || '暂无', href: next ? `/standards/${next.slug}` : undefined},
          ]}
        />

        <div className="platformLayout">
          <ArticleBody source={standard.body} />
          <Sidebar title="标准阅读">
            <dl>
              <div>
                <dt>标准编号</dt>
                <dd>{standard.version}</dd>
              </div>
              <div>
                <dt>状态</dt>
                <dd>{standard.status}</dd>
              </div>
              <div>
                <dt>来源</dt>
                <dd>{standard.filePath}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <h2>目录</h2>
              <div className="mt-4 grid gap-2">
                {toc.length ? toc.map((heading) => <span className="text-sm text-[var(--muted)]" key={heading}>{heading}</span>) : <span className="text-sm text-[var(--muted)]">正文未生成目录。</span>}
              </div>
            </div>
            <div className="mt-6">
              <h2>关联标准</h2>
              <div className="mt-4 grid gap-3">
                {related.length ? (
                  related.map((item) => (
                    <Link className="platformTextLink" href={`/standards/${item.slug}`} key={item.slug}>
                      {item.title}
                    </Link>
                  ))
                ) : (
                  <span className="text-sm text-[var(--muted)]">暂无关联标准。</span>
                )}
              </div>
            </div>
            <div className="mt-6">
              <CitationPanel
                items={[
                  {label: '标题', value: standard.title},
                  {label: '版本', value: standard.version},
                  {label: '路径', value: standard.filePath},
                ]}
              />
            </div>
          </Sidebar>
        </div>
      </article>
    </main>
  );
}

function extractToc(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^#{2,3}\s+/.test(line) || /^(?:[一二三四五六七八九十]+、)/.test(line))
    .map((line) => line.replace(/^#{2,3}\s+/, ''))
    .slice(0, 8);
}
