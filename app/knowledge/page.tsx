import Link from 'next/link';
import type {Metadata} from 'next';
import {FoundationObjectCard} from '@/components/FoundationObjectCard';
import {EmptyState} from '@/components/platform/EmptyState';
import {PageTitle} from '@/components/platform/PageTitle';
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

export const metadata: Metadata = {
  title: '知识中心',
  description: '搜索、筛选和阅读中国信托制物业发展平台 Foundation 中已经登记的 JD 与 GT 知识对象。',
  alternates: {canonical: '/knowledge'},
};

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
    <main className="platformPage">
      <section className="platformContainer">
        <PageTitle
          description="搜索、筛选和阅读 Foundation 中已经登记的 JD 与 GT。知识中心只展示真实登记对象，不使用模拟知识补齐空缺。"
          eyebrow="Knowledge Center"
          title="知识中心"
        />

        <form className="platformFilterPanel">
          <input defaultValue={query} name="q" placeholder="搜索标题、摘要、标签或正文" />
          <select defaultValue={activeType} name="type">
            <option value="All">全部类型</option>
            {Object.entries(foundationTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select defaultValue={activeCategory} name="category">
            <option value="All">全部分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select defaultValue={activeStatus} name="status">
            <option value="All">全部状态</option>
            {Object.entries(lifecycleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button type="submit">搜索</button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">找到 {items.length} 个真实 Foundation 对象</p>
          <div className="flex flex-wrap gap-2">
            {(['JD', 'GT'] as FoundationObjectType[]).map((type) => (
              <Link className="platformTag" href={`/knowledge?type=${type}`} key={type}>
                {foundationTypeLabels[type]}
              </Link>
            ))}
            <Link className="platformTag" href="/standards">
              平台标准
            </Link>
            {(query || activeType !== 'All' || activeCategory !== 'All' || activeStatus !== 'All') && (
              <Link className="platformTextLink" href="/knowledge">
                清除筛选
              </Link>
            )}
          </div>
        </div>

        <section className="platformSection !pt-8">
          {items.length ? (
            <div className="platformGrid platformGridThree">
              {items.map((item) => (
                <FoundationObjectCard item={item} key={item.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="没有匹配的知识对象"
              description={activeType === 'GT' ? '当前 Foundation 尚未登记 GT 正式对象；页面不会生成模拟数据。' : '请调整关键词、分类或生命周期筛选。'}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function isLifecycle(value?: string): value is FoundationLifecycle {
  return Boolean(value && value in lifecycleLabels);
}
