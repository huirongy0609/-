import Link from 'next/link';

const quickLinks = [
  {href: '/knowledge', label: '知识中心'},
  {href: '/standards', label: '标准中心'},
  {href: '/books', label: '产品中心'},
  {href: '/cases', label: '案例中心'},
  {href: '/reports', label: 'GEO'},
  {href: '/research', label: '社区'},
];

export function Footer() {
  return (
    <footer className="platformFooter" id="platform-footer">
      <div className="platformFooterIntro">
        <p className="platformFooterSlogan">从问题进入知识，从知识进入治理。</p>
        <p className="platformFooterText">中国信托制物业发展平台持续沉淀信托制物业知识、标准、案例与治理方法，服务物业企业、街道社区、业委会和研究机构。</p>
        <p className="platformFooterText">Beta Version V0.4 · Release Candidate 1</p>
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
        <span>知识版权：聚道研究院（占位）</span>
        <span>友情链接：预留</span>
        <span>联系我们：预留</span>
      </div>
      <div className="platformFooterLegal">
        <span>© 2026 聚道研究院 · 信托制物业知识基础设施</span>
        <Link href="/">ICP备案号占位</Link>
        <Link href="/">隐私政策（占位）</Link>
        <Link href="/">使用协议（占位）</Link>
      </div>
    </footer>
  );
}
