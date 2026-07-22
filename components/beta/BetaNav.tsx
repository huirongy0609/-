import Link from 'next/link';

const betaNavItems = [
  {href: '/', label: '首页'},
  {href: '/topics', label: '专题'},
  {href: '/knowledge', label: '知识中心'},
  {href: '/search', label: '搜索'},
  {href: '/about', label: '关于平台'},
];

export function BetaNav({dark = false}: {dark?: boolean}) {
  return (
    <nav
      aria-label="Website Beta 导航"
      className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-b py-4 text-sm font-semibold ${dark ? 'border-white/10 text-data-soft' : 'border-[var(--line)] text-[var(--muted)]'}`}
    >
      {betaNavItems.map((item) => (
        <Link className={dark ? 'transition hover:text-data-white' : 'transition hover:text-[var(--primary-dark)]'} href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
