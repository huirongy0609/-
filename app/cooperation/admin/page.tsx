import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {CooperationAdminRecords} from '@/components/cooperation/CooperationAdminRecords';
import {authorizeCooperationAdmin} from '@/lib/cooperation/admin-auth';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from '../cooperation.module.css';

export const metadata: Metadata = {
  title: '合作共建线索记录',
  robots: {index: false, follow: false, nocache: true},
};

export default function CooperationAdminPage() {
  const cookieHeader = cookies().toString();
  const authorization = authorizeCooperationAdmin(new Request('http://internal/cooperation/admin', {headers: {cookie: cookieHeader}}), 'lead:read');
  if (authorization.status !== 'authorized') redirect('/cooperation/admin/login?next=%2Fcooperation%2Fadmin');
  return (
    <main className={partnerStyles.page}>
      <div className={`${partnerStyles.container} ${partnerStyles.section}`}>
        <div className={styles.adminIntro}>
          <p className={partnerStyles.eyebrow}>COOPERATION LEADS · INTERNAL</p>
          <h1>合作共建线索记录</h1>
          <p>仅限获授权工作人员查看。V1.0 不提供自动审批、发布或身份赋予。</p>
        </div>
        <CooperationAdminRecords />
      </div>
    </main>
  );
}
