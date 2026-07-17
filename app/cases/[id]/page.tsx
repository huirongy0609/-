import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {CitationPanel} from '@/components/platform/CitationPanel';
import {KnowledgeRelation} from '@/components/platform/KnowledgeRelation';
import {PageTitle} from '@/components/platform/PageTitle';
import {Sidebar} from '@/components/platform/Sidebar';
import {Tag} from '@/components/platform/Tag';
import {getCaseViewById, getCaseViews} from '@/lib/repositories/cases';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';

export async function generateStaticParams() {
  const publicObjects = await getPublicWebsiteObjects();
  return publicObjects.filter((item) => item.type === 'CASE').map((item) => ({id: item.id.toLowerCase()}));
}

export async function generateMetadata({params}: {params: {id: string}}): Promise<Metadata> {
  const publicObjects = await getPublicWebsiteObjects();
  const isPublic = publicObjects.some((object) => object.type === 'CASE' && object.id.toLowerCase() === params.id.toLowerCase());
  if (!isPublic) return {title: '案例未找到'};
  const item = getCaseViewById(params.id);
  if (!item) return {title: '案例未找到'};
  return {
    title: item.title,
    description: item.problem,
    alternates: {canonical: `/cases/${item.id}`},
    openGraph: {
      title: item.title,
      description: item.problem,
      type: 'article',
      url: `/cases/${item.id}`,
    },
  };
}

export default async function CaseDetailPage({params}: {params: {id: string}}) {
  const publicObjects = await getPublicWebsiteObjects();
  const isPublic = publicObjects.some((object) => object.type === 'CASE' && object.id.toLowerCase() === params.id.toLowerCase());
  if (!isPublic) notFound();
  const item = getCaseViewById(params.id);
  if (!item) notFound();
  const cases = getCaseViews();
  const currentIndex = cases.findIndex((caseItem) => caseItem.id === item.id);
  const previous = currentIndex > 0 ? cases[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < cases.length - 1 ? cases[currentIndex + 1] : undefined;

  return (
    <main className="platformPage">
      <article className="platformContainer">
        <Breadcrumb
          items={[
            {href: '/', label: '首页'},
            {href: '/cases', label: '案例中心'},
            {label: item.title},
          ]}
        />
        <PageTitle
          description={item.problem}
          eyebrow="Case Study"
          meta={[item.id, `${item.city} · ${item.district}`, item.publishedAt]}
          status={item.status}
          tags={item.tags}
          title={item.title}
        />

        <KnowledgeRelation
          items={[
            {label: '关联 JD', value: item.tags[0] || '待确认'},
            {label: '关联 GT', value: item.model || '待确认'},
            {label: '推荐引用', value: `${item.city} ${item.title}`},
            {label: '上一篇', value: previous?.title || '暂无', href: previous ? `/cases/${previous.id}` : undefined},
            {label: '下一篇', value: next?.title || '暂无', href: next ? `/cases/${next.id}` : undefined},
          ]}
        />

        <div className="platformLayout">
          <div className="platformGrid">
            <section className="articleBody">
              <p className="platformEyebrow">案例摘要</p>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{item.problem}</p>
            </section>
            <CaseSection title="项目背景">
              <p>{item.city} {item.district} · {item.communityType}。提交主体为{item.submitter}，主体类型为{item.subjectType}。</p>
            </CaseSection>
            <CaseSection title="核心问题">
              <p>{item.problem}</p>
            </CaseSection>
            <CaseSection title="实施过程">
              <ul>
                {item.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </CaseSection>
            <CaseSection title="治理结果">
              <p>{item.result}</p>
            </CaseSection>
            <CaseSection title="案例启示">
              <p>{item.model}</p>
            </CaseSection>
            <CaseSection title="证据说明">
              <ul>
                {item.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </CaseSection>
          </div>

          <Sidebar title="案例引用">
            <dl>
              <div>
                <dt>案例编号</dt>
                <dd>{item.id}</dd>
              </div>
              <div>
                <dt>城市地区</dt>
                <dd>{item.city} · {item.district}</dd>
              </div>
              <div>
                <dt>发布时间</dt>
                <dd>{item.publishedAt}</dd>
              </div>
              <div>
                <dt>审核状态</dt>
                <dd>{item.status === 'approved' ? '已审核' : '审核中'}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <h2>关联知识</h2>
              <div className="platformTagRow mt-4">
                {item.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <CitationPanel
                items={[
                  {label: '标题', value: item.title},
                  {label: '地区', value: `${item.city} ${item.district}`},
                  {label: '日期', value: item.publishedAt},
                ]}
              />
            </div>
            <div className="mt-6">
              <Link className="platformTextLink" href="/cases">返回案例中心</Link>
            </div>
          </Sidebar>
        </div>
      </article>
    </main>
  );
}

function CaseSection({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section className="articleBody caseStudySection">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
