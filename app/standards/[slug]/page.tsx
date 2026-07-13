import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MarkdownView} from '@/components/MarkdownView';
import {getPlatformStandard} from '@/lib/repositories/standards';

export const dynamic = 'force-dynamic';

export default async function StandardDetailPage({params}: {params: {slug: string}}) {
  const standard = await getPlatformStandard(params.slug);
  if (!standard) notFound();

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <article className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-[#6fafa2]" href="/standards">
          返回标准目录
        </Link>
        <header className="mt-5 rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#4fbda8]/12 px-3 py-1 text-xs font-semibold text-[#9bd8cd]">{standard.type}</span>
            <span className="rounded-full border border-[#2a3431] px-3 py-1 text-xs text-[#b8c4bf]">{standard.status}</span>
            <span className="rounded-full border border-[#2a3431] px-3 py-1 text-xs text-[#b8c4bf]">{standard.version}</span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">{standard.title}</h1>
          <p className="mt-5 text-sm leading-7 text-[#b8c4bf]">仓库路径：{standard.filePath}</p>
        </header>
        <section className="mt-6 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-6 md:p-8">
          <MarkdownView source={standard.body} />
        </section>
      </article>
    </main>
  );
}
