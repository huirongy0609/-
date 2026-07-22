import Link from 'next/link';
import {EmptyState} from '@/components/platform/EmptyState';
import {SearchBar} from '@/components/platform/SearchBar';

const hotLinks = [
  {href: '/knowledge/jd009', label: '什么是开放式预算？'},
  {href: '/knowledge/jd005', label: '什么是受托关系？'},
  {href: '/knowledge', label: '浏览知识中心'},
  {href: '/standards', label: '查看标准中心'},
];

export default function NotFoundPage() {
  return (
    <main className="platformPage">
      <section className="platformContainer notFoundPage">
        <EmptyState title="页面没有找到" description="这个链接可能已经失效，或对应知识对象尚未发布。" />
        <div className="platformPanel">
          <h1>继续搜索平台知识</h1>
          <SearchBar />
          <div className="heroQuickLinks">
            {hotLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link className="platformButton notFoundHomeLink" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
