import Link from 'next/link';

const navItems = [
  {href: '/knowledge', label: '知识中心'},
  {href: '/standards', label: '标准中心'},
  {href: '/books', label: '产品中心'},
  {href: '/cases', label: '案例中心'},
  {href: '/reports', label: 'GEO'},
  {href: '/research', label: '社区'},
];

export function Header() {
  return (
    <header className="platformHeader">
      <Link className="platformBrand" href="/">
        <span className="platformBrandMark">聚</span>
        <span>
          <strong>中国信托制物业发展平台</strong>
          <em>Judao Research Institute</em>
        </span>
      </Link>
      <nav aria-label="主导航" className="platformNav">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
