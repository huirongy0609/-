import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {ArticleBody} from '@/components/platform/ArticleBody';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {CitationPanel} from '@/components/platform/CitationPanel';
import {KnowledgeRelation} from '@/components/platform/KnowledgeRelation';
import {PageTitle} from '@/components/platform/PageTitle';
import {Sidebar} from '@/components/platform/Sidebar';
import {foundationTypeLabels, lifecycleLabels} from '@/lib/domain/foundation';
import {getFoundationKnowledgeObject, getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: {params: {id: string}}): Promise<Metadata> {
  const item = await getFoundationKnowledgeObject(params.id);
  if (!item) return {title: '知识对象未找到'};
  const canonicalPath = `/knowledge/${item.id.toLowerCase()}`;
  const description = item.summary.replace(/[*_`#>]/g, '').trim();
  return {
    title: item.title,
    description,
    alternates: {canonical: canonicalPath},
    openGraph: {
      title: item.title,
      description,
      type: 'article',
      url: canonicalPath,
    },
  };
}

export default async function KnowledgeDetailPage({params}: {params: {id: string}}) {
  const [item, allObjects] = await Promise.all([getFoundationKnowledgeObject(params.id), getFoundationKnowledgeObjects()]);
  if (!item) notFound();

  const objectLookup = new Map(allObjects.map((object) => [object.id, object]));
  const currentIndex = allObjects.findIndex((object) => object.id === item.id);
  const previous = currentIndex > 0 ? allObjects[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < allObjects.length - 1 ? allObjects[currentIndex + 1] : undefined;
  const gtRelations = item.relatedObjects
    .flatMap((relation) => {
      const related = objectLookup.get(relation.id);
      return related?.type === 'GT' ? [related] : [];
    });
  const jdRelations = item.relatedObjects
    .flatMap((relation) => {
      const related = objectLookup.get(relation.id);
      return related?.type === 'JD' ? [related] : [];
    });

  return (
    <main className="platformPage">
      <article className="platformContainer">
        <Breadcrumb
          items={[
            {href: '/', label: '首页'},
            {href: '/knowledge', label: '知识中心'},
            {label: item.title},
          ]}
        />
        <PageTitle
          description={item.summary}
          eyebrow={foundationTypeLabels[item.type]}
          meta={[item.id, item.version || '版本未标注']}
          status={item.lifecycleStatus}
          tags={item.tags}
          title={item.title}
        />

        <KnowledgeRelation
          items={[
            {label: '所属主题', value: item.category, href: `/knowledge?category=${encodeURIComponent(item.category)}`},
            {label: '上一篇', value: previous?.title || '暂无', href: previous ? `/knowledge/${previous.id.toLowerCase()}` : undefined},
            {label: '下一篇', value: next?.title || '暂无', href: next ? `/knowledge/${next.id.toLowerCase()}` : undefined},
            {label: '关联 GT', value: gtRelations[0]?.title || '暂无已登记关联', href: gtRelations[0] ? `/knowledge/${gtRelations[0].id.toLowerCase()}` : undefined},
            {label: '关联案例', value: '待案例库确认'},
            {label: '关联法规', value: '待法规库确认'},
          ]}
        />

        <div className="platformDocLayout">
          <aside className="platformSidebar platformDocNav">
            <h2>词条导航</h2>
            <a href="#definition">一句话定义</a>
            <a href="#body">核心解释</a>
            <a href="#relations">知识关系</a>
            <Link href="/knowledge">返回知识中心</Link>
          </aside>
          <div>
            <section className="articleBody" id="definition">
              <p className="platformEyebrow">一句话定义</p>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{item.summary}</p>
            </section>
            <div id="body">
              <ArticleBody source={item.body} />
            </div>
            <section className="articleBody" id="relations">
              <h2>知识关系</h2>
              <div className="mt-4 grid gap-3">
                {item.relatedObjects.length ? (
                  item.relatedObjects.map((relation) => {
                    const related = objectLookup.get(relation.id);
                    return related ? (
                      <Link className="platformTextLink" href={`/knowledge/${related.id.toLowerCase()}`} key={relation.id}>
                        {related.id} · {related.title}
                      </Link>
                    ) : (
                      <span className="text-sm text-[var(--muted)]" key={relation.id}>
                        {relation.id} · 当前索引未提供正文
                      </span>
                    );
                  })
                ) : (
                  <p className="text-sm leading-7 text-[var(--muted)]">暂无已登记关联对象。</p>
                )}
              </div>
            </section>
          </div>

          <Sidebar title="引用信息">
            <CitationPanel
              items={[
                {label: '对象编号', value: item.id},
                {label: '标题', value: item.title},
                {label: '生命周期', value: item.lifecycleStatus ? lifecycleLabels[item.lifecycleStatus] : '未登记'},
                {label: '版本', value: item.versionNote || item.version || '未标注'},
                {label: '批准日期', value: item.approvedAt || '不适用'},
                {label: '来源路径', value: item.filePath || '未登记'},
              ]}
            />
            <div className="mt-6">
              <h2>相关阅读</h2>
              <div className="mt-4 grid gap-3">
                {jdRelations.length ? (
                  jdRelations.slice(0, 4).map((relation) => (
                    <Link className="platformTextLink" href={`/knowledge/${relation.id.toLowerCase()}`} key={relation.id}>
                      {relation.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-[var(--muted)]">暂无已登记关联对象。</p>
                )}
              </div>
            </div>
          </Sidebar>
        </div>
      </article>
    </main>
  );
}
