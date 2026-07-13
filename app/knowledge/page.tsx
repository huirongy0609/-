import Link from 'next/link';
import {FoundationObjectCard} from '@/components/FoundationObjectCard';
import {
  foundationTypeLabels,
  lifecycleLabels,
  type FoundationLifecycle,
  type FoundationObjectType,
} from '@/lib/domain/foundation';
import {getFoundationCategories, searchFoundationKnowledgeObjects} from '@/lib/repositories/foundation';

type KnowledgeSearchParams = {
  q?: string;
  type?: string;
  category?: string;
  status?: string;
};

export const dynamic = 'force-dynamic';

export default async function KnowledgePage({searchParams}: {searchParams: KnowledgeSearchParams}) {
  const activeType: FoundationObjectType | 'All' = searchParams.type === 'JD' || searchParams.type === 'GT' ? searchParams.type : 'All';
  const activeCategory = searchParams.category || 'All';
  const activeStatus: FoundationLifecycle | 'All' = isLifecycle(searchParams.status) ? searchParams.status : 'All';
  const query = searchParams.q || '';
  const [items, categories] = await Promise.all([
    searchFoundationKnowledgeObjects({
      query,
      type: activeType,
      category: activeCategory,
      status: activeStatus,
    }),
    getFoundationCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">Foundation Browser</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">知识浏览</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
            直接读取 Foundation 中已登记的 JD 与 GT。支持分类、关键词、标签和生命周期筛选；不使用模拟知识补齐空缺。
          </p>
        </div>

        <form className="mt-6 grid gap-3 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-4 md:grid-cols-[1fr_150px_170px_150px_auto]">
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
            {Object.entries(foundationTypeLabels).map(([value, label]) => (
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
          <select
            className="rounded-md border border-[#2a3431] bg-[#0b1110] px-4 py-3 text-sm text-[#f3f6f4] outline-none focus:border-[#4fbda8]"
            defaultValue={activeStatus}
            name="status"
          >
            <option value="All">全部状态</option>
            {Object.entries(lifecycleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-[#4fbda8] px-5 py-3 text-sm font-semibold text-[#07110f]" type="submit">
            搜索
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {(['JD', 'GT'] as FoundationObjectType[]).map((type) => (
            <Link
              className="rounded-full border border-[#2a3431] px-4 py-2 text-sm font-semibold text-[#b8c4bf] transition hover:border-[#4fbda8]"
              href={`/knowledge?type=${type}`}
              key={type}
            >
              {foundationTypeLabels[type]}
            </Link>
          ))}
          <Link className="rounded-full border border-[#2a3431] px-4 py-2 text-sm font-semibold text-[#b8c4bf] transition hover:border-[#4fbda8]" href="/standards">
            平台标准
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-[#b8c4bf]">找到 {items.length} 个真实 Foundation 对象</p>
          {(query || activeType !== 'All' || activeCategory !== 'All' || activeStatus !== 'All') && (
            <Link className="text-sm font-semibold text-[#6fafa2]" href="/knowledge">
              清除筛选
            </Link>
          )}
        </div>

        <section className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoundationObjectCard item={item} key={item.id} />
          ))}
        </section>

        {items.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-8 text-center text-[#b8c4bf]">
            <p className="font-semibold text-[#f3f6f4]">没有匹配的知识对象</p>
            <p className="mt-2 text-sm leading-7">
              {activeType === 'GT' ? '当前 Foundation 尚未登记 GT 正式对象；页面不会生成模拟数据。' : '请调整关键词、分类或生命周期筛选。'}
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function isLifecycle(value?: string): value is FoundationLifecycle {
  return Boolean(value && value in lifecycleLabels);
}
