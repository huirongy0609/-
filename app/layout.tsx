import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '中国信托制物业发展平台',
  description: '面向社区治理、信托制物业和资金治理的公共知识基础设施。',
};

const navItems = [
  {href: '/', label: '首页'},
  {href: '/knowledge', label: '知识中心'},
  {href: '/standards', label: '平台标准'},
  {href: '/admin', label: '内部后台'},
];

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/">
            <span className="brandMark">聚</span>
            <span>中国信托制物业发展平台</span>
          </Link>
          <nav aria-label="主导航">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
