import Link from 'next/link';
import type {ReactNode} from 'react';

export type PortalEntry = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export type ContentCard = {
  title: string;
  summary: string;
  tag?: string;
  status?: string;
};

export const portalEntries: PortalEntry[] = [
  {
    label: 'Knowledge',
    title: '知识中心',
    description: '浏览、分类、搜索 JD、GT、Article 等统一知识对象。',
    href: '/knowledge',
  },
  {
    label: 'Admin',
    title: '后台基础',
    description: '新增、修改、删除知识对象，验证 MVP 的最小内容管理闭环。',
    href: '/admin/knowledge',
  },
];

export const hotQuestions = [
  '什么是信托制物业？',
  '什么是资金治理？',
  '为什么需要开放式预算？',
  '为什么越来越多小区采用信托制物业？',
];

export const latestCases: ContentCard[] = [
  {
    title: '成都贵东社区信托制物业案例',
    summary: '预留案例结构：用于沉淀项目背景、核心问题、导入路径和可复制启示。',
    status: 'Reserved',
  },
  {
    title: '苏州吴江翡翠半岛信托制物业案例',
    summary: '预留案例结构：等待真实材料核验后进入案例库。',
    status: 'Reserved',
  },
  {
    title: '上海城里苑信托制物业案例',
    summary: '预留案例结构：后续关联资金治理、预算治理与信息公开知识卡。',
    status: 'Reserved',
  },
];

export function PageShell({children}: {children: ReactNode}) {
  return (
    <main className="min-h-screen bg-[#0b1110] text-[#f3f6f4]">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">{children}</section>
    </main>
  );
}

export function HeroSection() {
  return (
    <section className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">China Trust-Based Property Knowledge Platform</p>
      <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">聚道智库</h1>
      <p className="mt-5 text-2xl font-semibold text-[#f3f6f4]">中国信托制物业知识平台</p>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
        持续研究、持续实践、持续共创，建设 AI 时代信托制物业知识基础设施。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="inline-flex justify-center rounded-full bg-[#4fbda8] px-5 py-3 text-sm font-semibold text-[#07110f]" href="/knowledge">
          开始学习
        </Link>
        <Link className="inline-flex justify-center rounded-full border border-[#2a3431] px-5 py-3 text-sm font-semibold text-[#b8c4bf]" href="/cases">
          浏览案例
        </Link>
        <Link className="inline-flex justify-center rounded-full border border-[#2a3431] px-5 py-3 text-sm font-semibold text-[#b8c4bf]" href="/research">
          查看研究
        </Link>
      </div>
    </section>
  );
}

export function PortalEntryGrid({entries}: {entries: PortalEntry[]}) {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2">
      {entries.map((entry) => (
        <Link
          className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition hover:-translate-y-0.5 hover:border-[#4fbda8]/45"
          href={entry.href}
          key={entry.label}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{entry.label}</p>
          <h2 className="mt-3 text-xl font-semibold">{entry.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{entry.description}</p>
        </Link>
      ))}
    </section>
  );
}

export function QuestionList({questions}: {questions: string[]}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {questions.map((question) => (
        <Link className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-4 text-base font-semibold transition hover:border-[#4fbda8]/45" href="/knowledge" key={question}>
          {question}
        </Link>
      ))}
    </div>
  );
}

export function HomeSection({children, eyebrow, title}: {children: ReactNode; eyebrow: string; title: string}) {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ContentCardGrid({items}: {items: ContentCard[]}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5" key={item.title}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{item.tag ?? item.status ?? 'Update'}</p>
          <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{item.summary}</p>
        </article>
      ))}
    </div>
  );
}

export function MinimalIndexPage({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: ContentCard[];
}) {
  return (
    <PageShell>
      <section className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">{description}</p>
      </section>
      <HomeSection eyebrow="MVP Index" title="静态内容入口">
        <ContentCardGrid items={items} />
      </HomeSection>
    </PageShell>
  );
}
