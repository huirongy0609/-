import Link from 'next/link';
import {knowledgeObjectTypeLabels, knowledgeObjectTypeSchema, type KnowledgeObjectType} from '@/lib/domain/knowledge-object';
import {getKnowledgeObjectCategories, searchKnowledgeObjects} from '@/lib/repositories/knowledge-objects';

type KnowledgeSearchParams = {
  q?: string;
  type?: string;
  category?: string;
};

export const dynamic = 'force-dynamic';

export default async function KnowledgePage({searchParams}: {searchParams: KnowledgeSearchParams}) {
  const parsedType = knowledgeObjectTypeSchema.safeParse(searchParams.type);
  const activeType = parsedType.success ? parsedType.data : 'All';
  const activeCategory = searchParams.category || 'All';
  const query = searchParams.q || '';
  const [items, categories] = await Promise.all([
    searchKnowledgeObjects({
      query,
      type: activeType,
      category: activeCategory,
    }),
    getKnowledgeObjectCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">Knowledge Center</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">知识中心</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
            统一管理 JD 治理词典、GT 治理工具和 Article 文章。当前 MVP 支持浏览、分类、关键词搜索和详情查看。
          </p>
        </div>

        <form className="mt-6 grid gap-3 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-4 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            className="rounded-md border border-[#2a3431] bg-[#0b1110] px-4 py-3 text-sm text-[#f3f6f4] outline-none focus:border-[#4fbda8]"
            defaultValue={query}
            name="q"
            placeholder="搜索标题、摘要、标签或正文"
          />
          <select
            className="rounded-md border border-[#2a3431] bg-[#0b1110] px-4 py-3 text-sm text-[#f3f6f4] outline-none focus:border-[#4fbda8]"
            defaultValue={activeType}
            name="type"
          >
            <option value="All">全部类型</option>
            {Object.entries(knowledgeObjectTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-[#2a3431] bg-[#0b1110] px-4 py-3 text-sm text-[#f3f6f4] outline-none focus:border-[#4fbda8]"
            defaultValue={activeCategory}
            name="category"
          >
            <option value="All">全部分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-[#4fbda8] px-5 py-3 text-sm font-semibold text-[#07110f]" type="submit">
            搜索
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {(['JD', 'GT', 'Article'] as KnowledgeObjectType[]).map((type) => (
            <Link
              className="rounded-full border border-[#2a3431] px-4 py-2 text-sm font-semibold text-[#b8c4bf] transition hover:border-[#4fbda8]"
              href={`/knowledge?type=${type}`}
              key={type}
            >
              {knowledgeObjectTypeLabels[type]}
            </Link>
          ))}
          <Link className="rounded-full border border-[#2a3431] px-4 py-2 text-sm font-semibold text-[#b8c4bf] transition hover:border-[#4fbda8]" href="/admin/knowledge">
            后台维护
          </Link>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Link
              className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition hover:-translate-y-0.5 hover:border-[#4fbda8]/45"
              href={`/knowledge/${item.id}`}
              key={item.id}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{knowledgeObjectTypeLabels[item.type]}</p>
                <span className="rounded-full border border-[#2a3431] px-2 py-1 text-xs text-[#b8c4bf]">{item.status}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span className="rounded-full bg-[#4fbda8]/10 px-2.5 py-1 text-xs text-[#9bd8cd]" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>

        {items.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-8 text-center text-[#b8c4bf]">
            没有找到匹配的知识对象。
          </div>
        ) : null}
      </section>
    </main>
  );
}
