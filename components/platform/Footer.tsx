import Link from 'next/link';

const quickLinks = [
  {href: '/topics', label: 'Topic 专题'},
  {href: '/knowledge', label: '知识中心'},
  {href: '/standards', label: '治理标准中心'},
  {href: '/cases', label: '案例中心'},
  {href: '/laws', label: '法律法规中心'},
  {href: '/faq', label: 'FAQ 中心'},
  {href: '/research', label: '研究中心'},
  {href: '/search', label: '平台搜索'},
  {href: '/about', label: '关于平台'},
];

export function Footer() {
  return (
    <footer className="platformFooter" id="platform-footer">
      <div className="platformFooterIntro">
        <p className="platformFooterSlogan">从问题进入知识，从知识进入治理。</p>
        <p className="platformFooterText">中国信托制物业发展平台持续沉淀信托制物业知识、标准、案例与治理方法，服务物业企业、街道社区、业委会和研究机构。</p>
        <p className="platformFooterText">Website Beta Sprint 1</p>
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
        <span>公开门禁：Foundation Ready</span>
        <span>当前阶段：Knowledge Publishing Beta</span>
      </div>
      <div className="platformFooterLegal">
        <span>© 2026 聚道研究院 · 信托制物业知识基础设施</span>
      </div>
    </footer>
  );
}
