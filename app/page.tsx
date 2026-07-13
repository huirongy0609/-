import Link from 'next/link';
import {FoundationObjectCard} from '@/components/FoundationObjectCard';
import {foundationTypeLabels} from '@/lib/domain/foundation';
import {getFoundationCategories, getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';
import {getPlatformStandards} from '@/lib/repositories/standards';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [objects, categories, standards] = await Promise.all([
    getFoundationKnowledgeObjects(),
    getFoundationCategories(),
    getPlatformStandards(),
  ]);
  const approvedObjects = objects.filter((item) => item.lifecycleStatus === 'approved');
  const latestKnowledge = [...approvedObjects]
    .sort((a, b) => (b.approvedAt || '').localeCompare(a.approvedAt || '') || b.id.localeCompare(a.id, 'en', {numeric: true}))
    .slice(0, 6);
  const popularQuestions = approvedObjects.filter((item) => item.type === 'JD').slice(0, 6);
  const jdCount = objects.filter((item) => item.type === 'JD').length;
  const gtCount = objects.filter((item) => item.type === 'GT').length;

  return (
    <main className="min-h-screen bg-[#0b1110] text-[#f3f6f4]">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        <header className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">MVP V0.2 · Knowledge Infrastructure</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">中国信托制物业发展平台</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
            面向社区治理、信托制物业和资金治理的公共知识基础设施。当前版本开放 Foundation 知识浏览、检索与平台标准阅读。
          </p>

          <form action="/knowledge" className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <input
              aria-label="搜索知识"
              className="min-h-12 flex-1 rounded-md border border-[#2a3431] bg-[#0b1110] px-4 text-sm text-[#f3f6f4] outline-none placeholder:text-[#72807b] focus:border-[#4fbda8]"
              name="q"
              placeholder="搜索信托、受托关系、共同基金……"
            />
            <button className="min-h-12 rounded-md bg-[#4fbda8] px-6 text-sm font-semibold text-[#07110f]" type="submit">
              搜索知识
            </button>
          </form>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric label="Foundation JD" value={jdCount} />
            <Metric label="Foundation GT" value={gtCount} />
            <Metric label="Platform Standards" value={standards.length} />
          </div>
        </header>

        <section className="mt-10">
          <SectionHeading eyebrow="Browse" title="分类导航" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EntryLink href="/knowledge?type=JD" label="JD" title={foundationTypeLabels.JD} description="阅读平台治理词典和正式定义。" />
            <EntryLink href="/knowledge?type=GT" label="GT" title={foundationTypeLabels.GT} description="浏览治理工具；无正式对象时显示真实空状态。" />
            {categories.slice(0, 2).map((category) => (
              <EntryLink
                description={`查看归入“${category}”的 Foundation 对象。`}
                href={`/knowledge?category=${encodeURIComponent(category)}`}
                key={category}
                label="Category"
                title={category}
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Foundation" title="最新知识" />
            <Link className="text-sm font-semibold text-[#6fafa2]" href="/knowledge">
              查看全部
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestKnowledge.map((item) => (
              <FoundationObjectCard item={item} key={item.id} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading eyebrow="Questions" title="热门问题" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {popularQuestions.map((item) => (
                <Link
                  className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-4 text-sm font-semibold leading-7 transition hover:border-[#4fbda8]/45"
                  href={`/knowledge/${item.id}`}
                  key={item.id}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Standards" title="平台标准" />
            <Link className="mt-5 block rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition hover:border-[#4fbda8]/45" href="/standards">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{standards.length} Standards</p>
              <h3 className="mt-3 text-xl font-semibold">查看标准目录</h3>
              <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">阅读当前批准或提交审核的平台标准，不与历史 Source Archive 混用。</p>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({label, value}: {label: string; value: number}) {
  return (
    <div className="rounded-lg border border-[#2a3431] bg-[#0b1110]/55 p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6fafa2]">{label}</span>
      <strong className="mt-3 block text-3xl font-semibold">{value}</strong>
    </div>
  );
}

function SectionHeading({eyebrow, title}: {eyebrow: string; title: string}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
    </div>
  );
}

function EntryLink({description, href, label, title}: {description: string; href: string; label: string; title: string}) {
  return (
    <Link className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition hover:-translate-y-0.5 hover:border-[#4fbda8]/45" href={href}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{label}</p>
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{description}</p>
    </Link>
  );
}
