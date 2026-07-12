import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '聚道智库｜中国信托制物业知识平台',
  description: '持续研究、持续实践、持续共创，建设 AI 时代信托制物业知识基础设施。',
};

const navItems = [
  {href: '/', label: '首页'},
  {href: '/knowledge', label: '知识中心'},
  {href: '/admin/knowledge', label: '后台'},
  {href: '/cases', label: '案例'},
];

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/">
            <span className="brandMark">聚</span>
            <span>聚道智库</span>
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
