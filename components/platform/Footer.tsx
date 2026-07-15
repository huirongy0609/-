import Link from 'next/link';

const quickLinks = [
  {href: '/knowledge', label: '知识中心'},
  {href: '/standards', label: '治理标准'},
  {href: '/cases', label: '真实案例'},
  {href: '/books', label: '图书'},
  {href: '/research', label: '研究'},
];

export function Footer() {
  return (
    <footer className="platformFooter">
      <div>
        <p className="platformFooterSlogan">从问题进入知识，从知识进入治理。</p>
        <p className="platformFooterText">中国信托制物业发展平台持续沉淀知识、标准、案例与治理方法。</p>
      </div>
      <div className="platformFooterLinks">
        {quickLinks.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
      <p className="platformFooterText">© 聚道研究院 · 信托制物业知识基础设施</p>
    </footer>
  );
}
