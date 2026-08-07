'use client';

import {useEffect, useState} from 'react';
import {LoaderCircle, RefreshCw} from 'lucide-react';
import type {CooperationLeadRecord} from '@/lib/cooperation/database';
import {cooperationLabels} from '@/lib/cooperation/schema';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from '@/app/cooperation/cooperation.module.css';

export function CooperationAdminRecords() {
  const [records, setRecords] = useState<CooperationLeadRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadRecords() {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/cooperation-leads', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const result = await response.json() as {records?: CooperationLeadRecord[]; error?: string};
      if (!response.ok || !result.records) throw new Error(result.error || '记录读取失败。');
      setRecords(result.records);
      setMessage(`已读取 ${result.records.length} 条合作共建线索。`);
    } catch (error) {
      setRecords(null);
      setMessage(error instanceof Error ? error.message : '记录读取失败。');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadRecords(); }, []);

  return (
    <>
      <section className={styles.accessPanel}>
        <div className={styles.accessHeading}><div><h2>已通过组织身份验证</h2><p>本页面仅使用服务端会话，不接收或保存共享查看口令。</p></div></div>
        <div className={styles.accessControls}>
          <button className={`${partnerStyles.primaryButton} ${partnerStyles.submitButton}`} disabled={loading} onClick={loadRecords} type="button">{loading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={17} /> : <RefreshCw aria-hidden="true" size={17} />} 查看记录</button>
        </div>
        {message ? <p aria-live="polite" className={styles.message}>{message}</p> : null}
      </section>

      {records ? (
        <section aria-label="合作共建线索记录" className={styles.recordsSection}>
          {records.length === 0 ? <div className={styles.empty}><h2>暂无合作共建线索</h2><p>新的公开登记提交后将显示在这里。</p></div> : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>登记信息</th><th>合作意向</th><th>联系信息</th><th>提交信息</th></tr></thead>
                <tbody>{records.map((record) => (
                  <tr key={record.leadNumber}>
                    <td><strong>{record.organizationName}</strong><span className={styles.mono}>{record.leadNumber}</span><span>{cooperationLabels.partnerType[record.partnerType]}</span><span>{record.city}</span></td>
                    <td><strong>{cooperationLabels.status[record.currentStatus]}</strong><ul>{record.cooperationDirections.map((direction) => <li key={direction}>{cooperationLabels.direction[direction]}</li>)}</ul>{record.notes ? <span>说明：{record.notes}</span> : null}</td>
                    <td><strong>{record.contactName}</strong><span>{record.phone}</span>{record.wechat ? <span>微信：{record.wechat}</span> : null}{record.email ? <span>{record.email}</span> : null}{record.organizationWebsite ? <a href={record.organizationWebsite} rel="noreferrer" target="_blank">企业官网</a> : null}</td>
                    <td><span>{new Intl.DateTimeFormat('zh-CN', {dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Shanghai'}).format(new Date(record.submittedAt))}</span><span>来源：{record.sourcePage}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </>
  );
}
