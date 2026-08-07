import type {Metadata} from 'next';
import {CooperationRegistrationForm} from '@/components/cooperation/CooperationRegistrationForm';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from '../cooperation.module.css';

export const metadata: Metadata = {
  title: '合作共建登记',
  description: '共同参与中国信托制物业发展生态建设，登记机构合作类型、合作方向与当前需求。',
  alternates: {canonical: '/cooperation/register'},
};

export default function CooperationRegisterPage() {
  return (
    <main className={partnerStyles.page}>
      <div className={partnerStyles.formShell}>
        <div className={styles.introPanel}>
          <p className={partnerStyles.eyebrow}>合作共建登记 · V1.0</p>
          <h1>中国信托制物业发展平台合作共建登记</h1>
          <p>中国信托制物业发展平台致力于推动信托制物业理论研究、实践探索、人才培养和行业协同发展。欢迎相关机构参与平台合作共建。</p>
          <div className={styles.scopeNote}><strong>登记说明</strong><span>这是参与生态共建的需求登记，不是加入某个组织。登记不产生伙伴身份，不提供自动审批、公开发布或用户注册。</span></div>
        </div>
        <CooperationRegistrationForm />
      </div>
    </main>
  );
}
