import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '全国信托制社区治理协同平台',
  description: '面向信托制、风险治理、案例复用和多方协同的全国社区治理平台。',
};

const navItems = [
  {href: '/', label: '首页'},
  {href: '/parking-conflict-demo', label: '停车纠纷Demo'},
  {href: '/map', label: '全国地图'},
  {href: '/intelligence', label: 'AI情报'},
  {href: '/cases', label: '案例库'},
  {href: '/submit', label: '共建提交'},
];

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/">
            <span className="brandMark">协</span>
            <span>全国信托制社区治理协同平台</span>
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
