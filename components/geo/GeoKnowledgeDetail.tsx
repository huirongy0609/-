import Link from 'next/link';
import {ArticleBody} from '@/components/platform/ArticleBody';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {CitationPanel} from '@/components/platform/CitationPanel';
import {KnowledgeRelation} from '@/components/platform/KnowledgeRelation';
import {PageTitle} from '@/components/platform/PageTitle';
import {Sidebar} from '@/components/platform/Sidebar';
import {JsonLd} from '@/components/geo/JsonLd';
import {buildContentJsonLd} from '@/lib/geo/metadata';
import {
  geoCollectionPaths,
  geoContentTypes,
  geoTypeLabels,
  getGeoObjectPath,
  getRelatedGeoContent,
  type PublishedGeoObject,
} from '@/lib/geo/publication';

export function GeoKnowledgeDetail({
  object,
  allObjects,
}: {
  object: PublishedGeoObject;
  allObjects: PublishedGeoObject[];
}) {
  const related = getRelatedGeoContent(object, allObjects);
  const sameType = allObjects.filter((item) => item.type === object.type);
  const currentIndex = sameType.findIndex((item) => item.id === object.id);
  const previous = currentIndex > 0 ? sameType[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < sameType.length - 1 ? sameType[currentIndex + 1] : undefined;

  return (
    <main className="platformPage">
      <JsonLd data={buildContentJsonLd(object)} />
      <article className="platformContainer">
        <Breadcrumb
          items={[
            {href: '/', label: '首页'},
            {href: geoCollectionPaths[object.type], label: geoTypeLabels[object.type]},
            {href: `${geoCollectionPaths[object.type]}?category=${encodeURIComponent(object.category)}`, label: object.category},
            {label: `${object.id} ${object.title}`},
          ]}
        />
        <PageTitle
          description={object.summary}
          eyebrow={geoTypeLabels[object.type]}
          meta={[object.id, object.version || '版本未标注']}
          status="approved"
          tags={object.tags}
          title={object.title}
        />

        <KnowledgeRelation
          items={[
            {label: '所属分类', value: object.category, href: `${geoCollectionPaths[object.type]}?category=${encodeURIComponent(object.category)}`},
            {label: '上一篇', value: previous?.title || '暂无', href: previous ? getGeoObjectPath(previous) : undefined},
            {label: '下一篇', value: next?.title || '暂无', href: next ? getGeoObjectPath(next) : undefined},
            {label: '已登记关联', value: object.relatedIds.length ? `${object.relatedIds.length} 个对象` : '暂无已登记关联'},
          ]}
        />

        <div className="platformDocLayout">
          <aside className="platformSidebar platformDocNav">
            <h2>页面导航</h2>
            <a href="#summary">摘要</a>
            <a href="#body">正文</a>
            <a href="#related-content">相关内容</a>
            <Link href={geoCollectionPaths[object.type]}>返回{geoTypeLabels[object.type]}</Link>
          </aside>

          <div>
            <section className="articleBody" id="summary">
              <p className="platformEyebrow">摘要</p>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{object.summary}</p>
            </section>
            <div id="body">
              <ArticleBody source={object.body} />
            </div>
            <section className="articleBody" id="related-content">
              <h2>相关内容</h2>
              <p>基于已登记关系、分类与关键词自动推荐，帮助继续阅读并形成可抓取的知识网络。</p>
              <div className="mt-6 grid gap-6">
                {geoContentTypes.map((type) => (
                  <section key={type}>
                    <h3>相关{geoTypeLabels[type]}</h3>
                    <div className="mt-3 grid gap-3">
                      {related[type].length ? related[type].map((item) => (
                        <Link className="platformTextLink" href={getGeoObjectPath(item)} key={`${item.type}-${item.id}`}>
                          {item.id} · {item.title}
                        </Link>
                      )) : (
                        <p className="text-sm leading-7 text-[var(--muted)]">暂无已发布对象。</p>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          </div>

          <Sidebar title="引用信息">
            <CitationPanel
              items={[
                {label: '对象编号', value: object.id},
                {label: '标题', value: object.title},
                {label: '类型', value: geoTypeLabels[object.type]},
                {label: '状态', value: '已批准'},
                {label: '版本', value: object.version || '未标注'},
                {label: '更新时间', value: object.updatedAt || '未登记'},
                {label: '来源', value: object.sources.join('、') || '未登记'},
              ]}
            />
          </Sidebar>
        </div>
      </article>
    </main>
  );
}
