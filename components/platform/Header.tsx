'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const navItems = [
  {href: '/knowledge', label: '知识中心'},
  {href: '/standards', label: '治理标准'},
  {href: '/cases', label: '案例'},
  {href: '/laws', label: '法律法规'},
  {href: '/research', label: '研究'},
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="platformHeader">
      <Link className="platformBrand" href="/">
        <img alt="聚道物业研究院" className="platformBrandLogo" src="/brand/judao-logo-horizontal.png" />
      </Link>
      <nav aria-label="主导航" className="platformNav">
        {navItems.map((item) => (
          <Link className={pathname === item.href || pathname?.startsWith(`${item.href}/`) ? 'active' : undefined} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
