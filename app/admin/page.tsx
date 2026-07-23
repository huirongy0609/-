import Link from 'next/link';

const adminEntries = [
  {
    label: 'Knowledge Object',
    title: '知识对象',
    description: '进入现有 MVP 编辑原型。该原型仍使用本地草稿数据，不代表 Foundation 正式库。',
    href: '/admin/knowledge',
    status: '可用原型',
  },
  {
    label: 'GT',
    title: '治理工具',
    description: '查看 Foundation GT 浏览入口。当前没有正式对象时显示真实空状态。',
    href: '/knowledge?type=GT',
    status: '浏览入口',
  },
  {
    label: 'Case',
    title: '治理案例',
    description: '保留案例入口，后续与正式 Case 对象和 Evidence 建立关系。',
    href: '/cases',
    status: '现有入口',
  },
  {
    label: 'Evidence',
    title: '证据包',
    description: '预留 Evidence Package 入口。本阶段不开发录入、审批或权限功能。',
    href: null,
    status: '预留',
  },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-[#0b1110] px-5 py-10 text-[#f3f6f4] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-lg border border-[#2a3431] bg-[#151c1a]/78 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6fafa2]">Authenticated Internal MVP</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">内部后台入口</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c4bf]">
            此入口仅对已配置的管理员开放，不建设通用用户或复杂权限系统。正式知识仍由 Foundation 与既有治理流程管理。
          </p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {adminEntries.map((entry) => {
            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">{entry.label}</p>
                  <span className="rounded-full border border-[#2a3431] px-2.5 py-1 text-xs text-[#b8c4bf]">{entry.status}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{entry.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#b8c4bf]">{entry.description}</p>
              </>
            );

            return entry.href ? (
              <Link
                className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition hover:-translate-y-0.5 hover:border-[#4fbda8]/45"
                href={entry.href}
                key={entry.label}
              >
                {content}
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-[#2a3431] bg-[#151c1a]/48 p-5" key={entry.label}>
                {content}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
