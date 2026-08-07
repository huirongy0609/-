import type {Metadata} from 'next';
import Link from 'next/link';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from './cooperation.module.css';

export const metadata: Metadata = {
  title: '合作共建',
  description: '共同参与中国信托制物业理论研究、实践探索、人才培养和行业协同发展。',
  alternates: {canonical: '/cooperation'},
};

export default function CooperationPage() {
  return (
    <main className={partnerStyles.page}>
      <div className={partnerStyles.formShell}>
        <section className={styles.introPanel}>
          <p className={partnerStyles.eyebrow}>COOPERATION · 共建生态</p>
          <h1>共同参与中国信托制物业发展生态建设</h1>
          <p>平台连接物业服务企业、街道社区、业主组织、政府及相关机构、行业专家、技术服务机构和培训生态伙伴，共同推动理论研究、实践探索、人才培养与行业协同。</p>
          <div className={styles.scopeNote}>
            <strong>边界说明</strong>
            <span>登记是合作需求表达，不是加入组织，不会自动产生伙伴身份、认证结果或公开案例。</span>
          </div>
          <Link className={`${partnerStyles.primaryButton} ${styles.entryLink}`} href="/cooperation/register">进入合作共建登记</Link>
        </section>
      </div>
    </main>
  );
}
