import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getCaseViewById, getCaseViews} from '@/lib/repositories/cases';

export function generateStaticParams() {
  return getCaseViews().map((item) => ({id: item.id}));
}

export default function CaseDetailPage({params}: {params: {id: string}}) {
  const item = getCaseViewById(params.id);
  if (!item) notFound();

  return (
    <main className="pageShell">
      <article className="container detailPage">
        <Link className="backLink" href="/cases">
          返回案例库
        </Link>
        <div className="detailHeader">
          <div>
            <p className="eyebrow">{item.city} / {item.district}</p>
            <h1>{item.title}</h1>
            <p>{item.problem}</p>
          </div>
          <span className="status active">{item.status === 'approved' ? '已审核' : '审核中'}</span>
        </div>

        <section className="detailGrid">
          <div className="detailBlock">
            <h2>治理模式</h2>
            <p>{item.model}</p>
          </div>
          <div className="detailBlock">
            <h2>阶段成果</h2>
            <p>{item.result}</p>
          </div>
          <div className="detailBlock">
            <h2>关键动作</h2>
            <ul>
              {item.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
          <div className="detailBlock">
            <h2>风险提示</h2>
            <ul>
              {item.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="detailMeta">
          <span>提交主体：{item.submitter}</span>
          <span>主体类型：{item.subjectType}</span>
          <span>小区类型：{item.communityType}</span>
          <span>发布时间：{item.publishedAt}</span>
        </section>
        <div className="tagRow">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </article>
    </main>
  );
}
