import Link from 'next/link';
import type {Metadata} from 'next';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {PageTitle} from '@/components/platform/PageTitle';
import {SearchBar} from '@/components/platform/SearchBar';
import {Tag} from '@/components/platform/Tag';
import {FoundationBrowser} from '@/components/website/FoundationBrowser';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {
  websiteObjectTypes,
  type WebsiteObjectQuery,
  type WebsiteObjectType,
} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '中国信托制物业知识平台',
  description: '从统一页面框架进入信托制物业知识、治理标准、案例、法律法规、FAQ 与研究。',
  alternates: {canonical: '/'},
};

const centerDefinitions: Array<{
  description: string;
  href: string;
  label: string;
  title: string;
  type: WebsiteObjectType;
}> = [
  {href: '/knowledge', title: '知识中心', label: 'Knowledge', description: '跨类型检索公开知识对象。', type: 'JD'},
  {href: '/standards', title: '治理标准中心', label: 'Standards', description: '以 GT Package 组织治理标准。', type: 'GT_PACKAGE'},
  {href: '/cases', title: '案例中心', label: 'Cases', description: '浏览已登记、可复盘的案例对象。', type: 'CASE'},
  {href: '/laws', title: '法律法规中心', label: 'Laws', description: '查看知识关系中的法律法规对象。', type: 'LAW'},
  {href: '/faq', title: 'FAQ 中心', label: 'FAQ', description: '从问题进入已批准知识。', type: 'FAQ'},
  {href: '/research', title: '研究中心', label: 'Research', description: '浏览专题研究与行业研究对象。', type: 'RESEARCH'},
];

export default async function HomePage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  const objects = await getPublicWebsiteObjects();
  const counts = new Map<WebsiteObjectType, number>();
  for (const object of objects) counts.set(object.type, (counts.get(object.type) ?? 0) + 1);

  return (
    <main className="platformPage">
      <section className="platformContainer pb-20">
        <Breadcrumb items={[{label: '首页'}]} />
        <section className="platformHero !pb-8">
          <PageTitle
            description="以 Knowledge Foundation Engine 为唯一对象来源，建立统一、可检索、可扩展的网站访问框架。"
            eyebrow="Website MVP Framework V1.0"
            title="中国信托制物业知识平台"
          />
          <SearchBar action="/knowledge" placeholder="搜索 Object ID、标题或来源" />
        </section>

        <section className="platformSection !pt-8">
          <div className="platformSectionTitle">
            <div>
              <h2>平台中心</h2>
              <p>从统一入口进入 Foundation 对象集合；对象数量全部由当前 Registry 计算。</p>
            </div>
          </div>
          <div className="platformGrid platformGridThree">
            {centerDefinitions.map((center) => (
              <Link className="platformEntryCard" href={center.href} key={center.href}>
                <Tag>{center.label}</Tag>
                <h3>{center.title}</h3>
                <p>{center.description}</p>
                <div className="knowledgeCardFooter">
                  <span>{counts.get(center.type) ?? 0} 个公开对象</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="platformSection">
          <div className="platformSectionTitle">
            <div>
              <h2>当前公开知识</h2>
              <p>这里只展示 Foundation Ready 且生命周期为 approved 的真实对象。</p>
            </div>
          </div>
          <FoundationBrowser
            allowedTypes={websiteObjectTypes}
            basePath="/"
            emptyDescription="当前 Foundation 没有符合公开条件的对象。"
            emptyTitle="暂无公开知识对象"
            pageSize={6}
            searchParams={searchParams}
          />
        </section>
      </section>
    </main>
  );
}
