import Link from 'next/link';
import {getPlatformStandards} from '@/lib/repositories/standards';

export const dynamic = 'force-dynamic';

export default async function StandardsPage() {
  const standards = await getPlatformStandards();

  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">Platform Standards</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">平台标准</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
            读取 `docs/standards/` 中的当前平台标准。Platform Standards 用于当前平台运行，与历史 Source Archive 分轨管理。
          </p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {standards.map((standard) => (
            <Link
              className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition hover:-translate-y-0.5 hover:border-[#4fbda8]/45"
              href={`/standards/${standard.slug}`}
              key={standard.slug}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{standard.type}</p>
                <span className="rounded-full border border-[#2a3431] px-2.5 py-1 text-xs text-[#b8c4bf]">{standard.status}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold leading-8">{standard.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{standard.summary}</p>
              <p className="mt-5 text-xs text-[#6fafa2]">{standard.version}</p>
            </Link>
          ))}
        </div>

        {standards.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-8 text-center text-[#b8c4bf]">当前标准目录为空。</div>
        ) : null}
      </section>
    </main>
  );
}
