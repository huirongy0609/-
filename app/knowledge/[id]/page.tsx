import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MarkdownView} from '@/components/MarkdownView';
import {knowledgeObjectTypeLabels} from '@/lib/domain/knowledge-object';
import {getKnowledgeObjectById} from '@/lib/repositories/knowledge-objects';

export const dynamic = 'force-dynamic';

export default async function KnowledgeDetailPage({params}: {params: {id: string}}) {
  const item = await getKnowledgeObjectById(params.id);
  if (!item) notFound();

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <article className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-[#6fafa2]" href="/knowledge">
          返回知识中心
        </Link>
        <header className="mt-5 rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#4fbda8]/12 px-3 py-1 text-xs font-semibold text-[#9bd8cd]">{knowledgeObjectTypeLabels[item.type]}</span>
            <span className="rounded-full border border-[#2a3431] px-3 py-1 text-xs text-[#b8c4bf]">{item.status}</span>
            <span className="rounded-full border border-[#2a3431] px-3 py-1 text-xs text-[#b8c4bf]">{item.version}</span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">{item.title}</h1>
          <p className="mt-5 text-base leading-8 text-[#b8c4bf]">{item.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span className="rounded-full bg-[#4fbda8]/10 px-2.5 py-1 text-xs text-[#9bd8cd]" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-6 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-6 md:p-8">
          <MarkdownView source={item.body} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5">
            <h2 className="text-lg font-semibold">引用关系</h2>
            <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{item.references.length ? item.references.join(' / ') : '暂无引用关系'}</p>
          </div>
          <div className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5">
            <h2 className="text-lg font-semibold">Evidence</h2>
            <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{item.evidenceRefs.length ? item.evidenceRefs.join(' / ') : 'MVP 阶段暂未绑定 Evidence Package'}</p>
          </div>
        </section>
      </article>
    </main>
  );
}
