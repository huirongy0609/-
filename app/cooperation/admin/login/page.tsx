import type {Metadata} from 'next';
import Link from 'next/link';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from '../../cooperation.module.css';

export const metadata: Metadata = {title: '合作共建后台登录', robots: {index: false, follow: false, nocache: true}};
export const dynamic = 'force-dynamic';

export default function CooperationAdminLoginPage() {
  const loginUrl = process.env.COOPERATION_ADMIN_LOGIN_URL?.trim();
  return (
    <main className={partnerStyles.page}>
      <div className={`${partnerStyles.container} ${partnerStyles.section}`}>
        <section className={styles.adminIntro}>
          <p className={partnerStyles.eyebrow}>COOPERATION ADMIN · SSO</p>
          <h1>合作共建后台登录</h1>
          <p>后台要求组织身份登录、MFA 验证和角色授权。未认证访问不会显示登记记录。</p>
          {loginUrl ? <Link className={partnerStyles.primaryButton} href={loginUrl}>使用组织账号登录</Link> : <p>预发布身份提供方尚未配置，后台登录暂不可用。</p>}
        </section>
      </div>
    </main>
  );
}
