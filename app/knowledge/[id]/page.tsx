import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MarkdownView} from '@/components/MarkdownView';
import {foundationTypeLabels, lifecycleLabels} from '@/lib/domain/foundation';
import {getFoundationKnowledgeObject, getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';

export const dynamic = 'force-dynamic';

export default async function KnowledgeDetailPage({params}: {params: {id: string}}) {
  const [item, allObjects] = await Promise.all([getFoundationKnowledgeObject(params.id), getFoundationKnowledgeObjects()]);
  if (!item) notFound();
  const objectLookup = new Map(allObjects.map((object) => [object.id, object]));
  const lifecycle = item.lifecycleStatus ? lifecycleLabels[item.lifecycleStatus] : '状态未登记';

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <article className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-[#6fafa2]" href="/knowledge">
          返回知识中心
        </Link>
        <header className="mt-5 rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#4fbda8]/12 px-3 py-1 text-xs font-semibold text-[#9bd8cd]">{item.id} · {foundationTypeLabels[item.type]}</span>
            <span className="rounded-full border border-[#2a3431] px-3 py-1 text-xs text-[#b8c4bf]">{lifecycle}</span>
            <span className="rounded-full border border-[#2a3431] px-3 py-1 text-xs text-[#b8c4bf]">{item.version || '版本未标注'}</span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">{item.title}</h1>
          <div className="mt-6 border-l-2 border-[#4fbda8] pl-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">一句话定义</p>
            <p className="mt-3 text-base leading-8 text-[#d7dfdc]">{item.summary}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span className="rounded-full bg-[#4fbda8]/10 px-2.5 py-1 text-xs text-[#9bd8cd]" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        {item.body ? (
          <section className="mt-6 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-6 md:p-8">
            <MarkdownView source={item.body} />
          </section>
        ) : (
          <section className="mt-6 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-8 text-center text-sm text-[#b8c4bf]">
            Foundation 已登记该对象，但当前没有可读取的正文文件。
          </section>
        )}

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5">
            <h2 className="text-lg font-semibold">延伸阅读</h2>
            {item.relatedObjects.length ? (
              <div className="mt-3 flex flex-col gap-2">
                {item.relatedObjects.map((relation) => {
                  const related = objectLookup.get(relation.id);
                  return related ? (
                    <Link className="text-sm leading-7 text-[#9bd8cd] hover:text-[#f3f6f4]" href={`/knowledge/${related.id}`} key={relation.id}>
                      {related.id} · {related.title}
                    </Link>
                  ) : (
                    <span className="text-sm leading-7 text-[#b8c4bf]" key={relation.id}>
                      {relation.id} · 当前索引未提供正文
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">暂无已登记关联对象。</p>
            )}
          </div>
          <div className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5">
            <h2 className="text-lg font-semibold">Foundation 记录</h2>
            <dl className="mt-3 space-y-2 text-sm leading-7 text-[#b8c4bf]">
              <div className="flex justify-between gap-4"><dt>生命周期</dt><dd>{item.lifecycleStatus || '未登记'}</dd></div>
              <div className="flex justify-between gap-4"><dt>版本</dt><dd>{item.versionNote || item.version || '未标注'}</dd></div>
              <div className="flex justify-between gap-4"><dt>批准日期</dt><dd>{item.approvedAt || '不适用'}</dd></div>
            </dl>
          </div>
        </section>
      </article>
    </main>
  );
}
