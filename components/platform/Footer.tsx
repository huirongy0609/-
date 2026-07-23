import Link from 'next/link';

const quickLinks = [
  {href: '/topics', label: 'Topic 专题'},
  {href: '/knowledge', label: '知识中心'},
  {href: '/search', label: '平台搜索'},
  {href: '/about', label: '关于平台'},
];

export function Footer() {
  return (
    <footer className="platformFooter" id="platform-footer">
      <div className="platformFooterIntro">
        <p className="platformFooterSlogan">从共同决定，到专业履职</p>
        <p className="platformFooterText">信托制物业</p>
        <p className="platformFooterText">中国信托制物业发展平台</p>
        <p className="platformFooterText">第一次公开发布（MVP）</p>
      </div>
      <div className="platformFooterColumn">
        <strong>快速入口</strong>
        <div className="platformFooterLinks">
          {quickLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="platformFooterColumn">
        <strong>平台信息</strong>
        <span>对象来源：Knowledge Foundation Engine</span>
        <span>已公开内容：7个JD</span>
        <span>暂未公开内容：GT、LAW、FAQ、CASE、Research</span>
      </div>
      <div className="platformFooterLegal">
        <span>© 2026 聚道研究院 · 信托制物业知识基础设施</span>
      </div>
    </footer>
  );
}
