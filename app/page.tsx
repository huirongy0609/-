import Link from 'next/link';
import {FoundationObjectCard} from '@/components/FoundationObjectCard';
import {KnowledgeCard} from '@/components/platform/KnowledgeCard';
import {SearchBar} from '@/components/platform/SearchBar';
import {Tag} from '@/components/platform/Tag';
import {foundationTypeLabels} from '@/lib/domain/foundation';
import {getCaseViews} from '@/lib/repositories/cases';
import {getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';
import {getPlatformStandards} from '@/lib/repositories/standards';

export const dynamic = 'force-dynamic';

const entryCards = [
  {href: '/knowledge', title: '知识中心', label: 'Knowledge', description: '治理词典、核心概念与可引用知识对象。', featured: true},
  {href: '/standards', title: '标准中心', label: 'Standards', description: '平台标准、引用规则与治理规范。'},
  {href: '/cases', title: '案例中心', label: 'Case', description: '真实项目案例与治理复盘。'},
  {href: '/books', title: '产品中心', label: 'Products', description: '图书、课程与工具入口。'},
  {href: '/reports', title: 'GEO', label: 'GEO', description: 'AI 搜索与认知研究入口。'},
  {href: '/research', title: '社区', label: 'Community', description: '研究、共创与发展网络。'},
];

export default async function HomePage() {
  const [objects, standards, cases] = await Promise.all([
    getFoundationKnowledgeObjects(),
    getPlatformStandards(),
    Promise.resolve(getCaseViews()),
  ]);

  const approvedObjects = objects.filter((item) => item.lifecycleStatus === 'approved');
  const latestKnowledge = [...approvedObjects]
    .sort((a, b) => (b.approvedAt || '').localeCompare(a.approvedAt || '') || b.id.localeCompare(a.id, 'en', {numeric: true}))
    .slice(0, 3);
  const popularQuestions = approvedObjects.filter((item) => item.type === 'JD').slice(0, 5);
  const featuredKnowledge = approvedObjects.slice(0, 6);
  const latestStandards = standards.slice(0, 3);
  const featuredCases = cases.slice(0, 3);

  return (
    <main className="platformPage">
      <section className="platformHero">
        <div className="platformContainer platformHeroGrid">
          <div>
            <span className="platformEyebrow">Knowledge First · 中国信托制物业发展平台</span>
            <h1>可信、开放、可引用的信托制物业知识平台</h1>
            <p className="platformHeroLead">持续沉淀知识、标准、案例与治理方法，服务物业企业、街道社区、业委会和研究机构。</p>
            <p className="platformHeroBrand">聚道研究院建设面向 AI 时代的信托制物业知识基础设施。</p>
            <SearchBar />
            <div className="heroQuickLinks">
              {['什么是信托制物业？', '什么是开放式预算？', '公共收益归谁？', '为什么物业费越来越难收？'].map((question) => (
                <Link href={`/knowledge?q=${encodeURIComponent(question)}`} key={question}>
                  {question}
                </Link>
              ))}
            </div>
          </div>

          <aside className="platformPanel">
            <div className="platformPanelTitle">
              <h2>最新知识</h2>
              <Link href="/knowledge">查看知识索引</Link>
            </div>
            <div className="platformGrid">
              {latestKnowledge.map((item) => (
                <KnowledgeCard
                  href={`/knowledge/${item.id}`}
                  key={item.id}
                  objectId={item.id}
                  status={item.lifecycleStatus}
                  summary={item.summary}
                  title={item.title}
                  typeLabel={foundationTypeLabels[item.type]}
                />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="platformContainer platformSection">
        <div className="platformSectionTitle">
          <div>
            <h2>大家都在问</h2>
            <p>从真实问题进入知识，再进入治理方法。</p>
          </div>
          <Link className="platformTextLink" href="/knowledge?type=JD">查看全部问题</Link>
        </div>
        <div className="questionList">
          {popularQuestions.map((item) => (
            <Link className="questionLink" href={`/knowledge/${item.id}`} key={item.id}>
              {item.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="platformContainer platformSection">
        <div className="platformSectionTitle">
          <div>
            <h2>平台入口</h2>
            <p>知识平台优先，平台能力辅助。用户可以从问题、标准、案例或产品入口继续深入。</p>
          </div>
        </div>
        <div className="platformGrid platformGridSix">
          {entryCards.map((entry) => (
            <Link className="platformEntryCard" href={entry.href} key={entry.title}>
              <Tag>{entry.label}</Tag>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="platformContainer platformSection">
        <div className="platformSectionTitle">
          <div>
            <h2>精选知识</h2>
            <p>以统一知识对象承载 JD、GT、案例和标准引用关系。</p>
          </div>
          <Link className="platformTextLink" href="/knowledge">进入知识中心</Link>
        </div>
        <div className="platformGrid platformGridThree">
          {featuredKnowledge.map((item) => (
            <FoundationObjectCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <section className="platformContainer platformSection">
        <div className="platformGrid platformGridTwo">
          <div>
            <div className="platformSectionTitle">
              <div>
                <h2>最新标准</h2>
                <p>以正式标准口径沉淀平台运行规则。</p>
              </div>
            </div>
            <div className="platformGrid">
              {latestStandards.map((standard) => (
                <KnowledgeCard
                  href={`/standards/${standard.slug}`}
                  key={standard.slug}
                  objectId={standard.version}
                  status={standard.status}
                  summary={standard.summary}
                  title={standard.title}
                  typeLabel="标准"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="platformSectionTitle">
              <div>
                <h2>精选案例</h2>
                <p>案例作为知识生产机制，而不是宣传材料。</p>
              </div>
            </div>
            <div className="platformGrid">
              {featuredCases.map((item) => (
                <KnowledgeCard
                  href={`/cases/${item.id}`}
                  key={item.id}
                  objectId={`${item.city} · ${item.district}`}
                  status={item.status}
                  summary={item.problem}
                  title={item.title}
                  typeLabel="案例"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="platformContainer platformSection">
        <div className="platformPanel">
          <div className="platformPanelTitle">
            <h2>第一次了解信托制物业</h2>
            <Link href="/knowledge">继续阅读</Link>
          </div>
          <div className="platformGrid platformGridThree">
            {['信托制物业', '受托关系', '业主共同基金', '开放式预算', '长期公共信任'].map((step, index) => (
              <Link className="questionLink" href={`/knowledge?q=${encodeURIComponent(step)}`} key={step}>
                {String(index + 1).padStart(2, '0')} · {step}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
