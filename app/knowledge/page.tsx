import Link from 'next/link';
import type {Metadata} from 'next';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {PageTitle} from '@/components/platform/PageTitle';
import {Tag} from '@/components/platform/Tag';
import {FoundationBrowser} from '@/components/website/FoundationBrowser';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {
  countWebsiteObjectsByType,
  websiteObjectTypes,
  websiteTypeDescriptions,
  websiteTypeLabels,
  type WebsiteObjectQuery,
} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '知识中心',
  description: '跨 JD、GT、Article、FAQ、CASE、LAW 与研究检索可公开知识对象。',
  alternates: {canonical: '/knowledge'},
};

export default async function KnowledgePage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  const objects = await getPublicWebsiteObjects();
  const counts = countWebsiteObjectsByType(objects);

  return (
    <main className="platformPage">
      <section className="platformContainer pb-20">
        <Breadcrumb items={[{href: '/', label: '首页'}, {label: '知识中心'}]} />
        <PageTitle
          description="统一检索治理词典、治理标准、文章、案例、法律法规、常见问题与研究；所有结果均来自已批准知识对象。"
          eyebrow="Knowledge Center"
          meta={[`${objects.length} 个公开对象`]}
          title="知识中心"
        />

        <section aria-labelledby="knowledge-types-title" className="platformSection !pt-8">
          <div className="platformSectionTitle">
            <div>
              <h2 id="knowledge-types-title">按知识类型进入</h2>
              <p>各类入口共享同一公开对象注册表；数量由当前已批准对象实时计算。</p>
            </div>
          </div>
          <div className="platformGrid platformGridThree">
            {websiteObjectTypes.map((type) => (
              <Link className="platformEntryCard" href={`/knowledge?type=${type}`} key={type}>
                <Tag>{type === 'GT_PACKAGE' ? 'GT Package' : type}</Tag>
                <h3>{websiteTypeLabels[type]}</h3>
                <p>{websiteTypeDescriptions[type]}</p>
                <div className="knowledgeCardFooter">
                  <span>{counts[type]} 个公开对象</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="knowledge-browser-title" className="platformSection">
          <div className="platformSectionTitle">
            <div>
              <h2 id="knowledge-browser-title">检索公开知识</h2>
              <p>搜索 Object ID、标题或来源，并按对象类型、来源与更新时间筛选排序。</p>
            </div>
          </div>
          <FoundationBrowser
            allowedTypes={websiteObjectTypes}
            basePath="/knowledge"
            emptyDescription="请调整关键词或筛选条件；页面不会生成模拟知识对象。"
            emptyTitle="没有匹配的公开知识对象"
            searchParams={searchParams}
          />
        </section>
      </section>
    </main>
  );
}
