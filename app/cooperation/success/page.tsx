import type {Metadata} from 'next';
import Link from 'next/link';
import {CheckCircle2} from 'lucide-react';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from '../cooperation.module.css';

export const metadata: Metadata = {title: '合作共建登记提交成功', robots: {index: false, follow: false}};

export default function CooperationSuccessPage({searchParams}: {searchParams: {lead?: string}}) {
  const leadNumber = /^COL-\d{4}-\d{4,}$/.test(searchParams.lead || '') ? searchParams.lead : '';
  return (
    <main className={partnerStyles.page}>
      <div className={partnerStyles.successShell}>
        <section className={partnerStyles.successCard}>
          <span className={partnerStyles.successIcon}><CheckCircle2 aria-hidden="true" size={34} /></span>
          <p className={partnerStyles.eyebrow}>SUBMISSION RECEIVED</p>
          <h1>登记已提交</h1>
          <p>感谢您参与中国信托制物业发展生态共建。信息已进入合作共建线索记录，后续将由工作人员人工查看并联系。</p>
          {leadNumber ? <div className={partnerStyles.caseNumber}><span>合作共建线索编号（Cooperation Lead）</span><strong>{leadNumber}</strong></div> : null}
          <p className={styles.successDisclaimer}>该编号仅用于查询本次登记，不代表合作获批、伙伴身份、案例公开或平台认证。</p>
          <Link className={`${partnerStyles.secondaryButton} ${styles.returnLink}`} href="/">返回平台首页</Link>
        </section>
      </div>
    </main>
  );
}
