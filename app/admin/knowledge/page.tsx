import Link from 'next/link';
import {KnowledgeAdminClient} from '@/components/KnowledgeAdminClient';
import {getKnowledgeObjects} from '@/lib/repositories/knowledge-objects';

export const dynamic = 'force-dynamic';

export default async function KnowledgeAdminPage() {
  const items = await getKnowledgeObjects();

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-[#6fafa2]" href="/knowledge">
          返回知识中心
        </Link>
        <div className="mt-5 rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">MVP Admin</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">知识对象后台</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
            当前后台不含登录权限，仅用于 MVP 阶段验证 Knowledge Object 的新增、修改和删除能力。
          </p>
        </div>
        <KnowledgeAdminClient initialItems={items} />
      </section>
    </main>
  );
}
