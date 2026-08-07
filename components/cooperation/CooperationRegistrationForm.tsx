'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowRight, LoaderCircle} from 'lucide-react';
import {
  cooperationDirections,
  cooperationLabels,
  cooperationStatuses,
  partnerTypes,
} from '@/lib/cooperation/schema';
import styles from '@/app/partners/partners.module.css';
import localStyles from '@/app/cooperation/cooperation.module.css';

function SectionTitle({number, title, description}: {number: string; title: string; description: string}) {
  return (
    <div className={styles.sectionTitle}>
      <span className={styles.sectionNumber}>{number}</span>
      <div><h2>{title}</h2><p>{description}</p></div>
    </div>
  );
}

export function CooperationRegistrationForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const payload = {
      organizationName: form.get('organizationName'),
      contactName: form.get('contactName'),
      phone: form.get('phone'),
      city: form.get('city'),
      wechat: form.get('wechat'),
      email: form.get('email'),
      organizationWebsite: form.get('organizationWebsite'),
      partnerType: form.get('partnerType'),
      cooperationDirections: form.getAll('cooperationDirections'),
      currentStatus: form.get('currentStatus'),
      notes: form.get('notes'),
      consentDataUse: form.get('consentDataUse') === 'true',
      websiteConfirmation: form.get('websiteConfirmation'),
    };

    try {
      const response = await fetch('/api/cooperation-leads', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const result = await response.json() as {leadNumber?: string; error?: string};
      if (!response.ok || !result.leadNumber) throw new Error(result.error || '提交失败');
      router.push(`/cooperation/success?lead=${encodeURIComponent(result.leadNumber)}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : '提交暂时未完成，请稍后重试。');
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.formSection}>
        <SectionTitle number="1" title="基础信息" description="用于识别共建主体并安排后续人工沟通。" />
        <div className={styles.fieldGrid}>
          <label className={styles.field}><span className={styles.label}>企业/机构名称</span><input autoComplete="organization" className={styles.input} name="organizationName" required /></label>
          <label className={styles.field}><span className={styles.label}>联系人姓名</span><input autoComplete="name" className={styles.input} name="contactName" required /></label>
          <label className={styles.field}><span className={styles.label}>联系电话</span><input autoComplete="tel" className={styles.input} inputMode="tel" name="phone" required type="tel" /></label>
          <label className={styles.field}><span className={styles.label}>所在城市</span><input className={styles.input} name="city" placeholder="例：四川省成都市" required /></label>
          <label className={styles.field}><span className={styles.label}>微信 <span className={styles.optional}>（选填）</span></span><input className={styles.input} name="wechat" /></label>
          <label className={styles.field}><span className={styles.label}>邮箱 <span className={styles.optional}>（选填）</span></span><input autoComplete="email" className={styles.input} name="email" type="email" /></label>
          <label className={styles.fullField}><span className={styles.label}>企业官网 <span className={styles.optional}>（选填）</span></span><input className={styles.input} name="organizationWebsite" placeholder="https://" type="url" /></label>
          <label aria-hidden="true" className={localStyles.honeypot}><span>请勿填写</span><input autoComplete="off" name="websiteConfirmation" tabIndex={-1} /></label>
        </div>
      </section>

      <section className={styles.formSection}>
        <SectionTitle number="2" title="合作类型与方向" description="请选择参与共建的主体类型与希望进一步沟通的合作事项。" />
        <div className={styles.fieldGrid}>
          <fieldset className={styles.fullField}>
            <legend className={styles.label}>合作类型</legend>
            <div className={styles.choiceGrid}>{partnerTypes.map((value) => <label className={styles.choice} key={value}><input name="partnerType" required type="radio" value={value} /><span>{cooperationLabels.partnerType[value]}</span></label>)}</div>
          </fieldset>
          <fieldset className={styles.fullField}>
            <legend className={styles.label}>希望合作方向（可多选）</legend>
            <div className={styles.choiceGrid}>{cooperationDirections.map((value) => <label className={styles.choice} key={value}><input name="cooperationDirections" type="checkbox" value={value} /><span>{cooperationLabels.direction[value]}</span></label>)}</div>
          </fieldset>
        </div>
      </section>

      <section className={styles.formSection}>
        <SectionTitle number="3" title="当前需求与补充说明" description="帮助平台判断当前需求和沟通起点，不构成审批、认证或公开发布。" />
        <div className={styles.fieldGrid}>
          <fieldset className={styles.fullField}>
            <legend className={styles.label}>当前需求与状态</legend>
            <div className={styles.choiceGrid}>{cooperationStatuses.map((value) => <label className={styles.choice} key={value}><input name="currentStatus" required type="radio" value={value} /><span>{cooperationLabels.status[value]}</span></label>)}</div>
          </fieldset>
          <label className={styles.fullField}><span className={styles.label}>补充说明 <span className={styles.optional}>（选填）</span></span><textarea className={styles.textarea} maxLength={1000} name="notes" placeholder="可补充合作背景、当前需求或便于联系的时间" /></label>
        </div>
      </section>

      <section className={styles.formSection}>
        <SectionTitle number="4" title="信息使用确认" description="本登记仅用于建立合作共建线索和后续人工联系。" />
        <p className={styles.authorizationNote}>提交后将形成一条内部合作共建线索记录。登记编号不代表伙伴身份、案例公开、平台认证或合作获批；未经另行授权，信息不会作为公开案例发布。</p>
        <label className={styles.choice}><input name="consentDataUse" required type="checkbox" value="true" /><span>我已知悉并同意平台为合作共建沟通、需求分派和人工跟进使用本次提交的信息。</span></label>
      </section>

      {error ? <p aria-live="polite" className={styles.error}>{error}</p> : null}
      <div className={styles.submitBar}>
        <p>请确认联系方式准确。提交成功后，页面将显示本次合作共建线索的唯一登记编号。</p>
        <button className={`${styles.primaryButton} ${styles.submitButton}`} disabled={submitting} type="submit">
          {submitting ? <><LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> 正在提交</> : <>提交登记 <ArrowRight aria-hidden="true" size={18} /></>}
        </button>
      </div>
    </form>
  );
}
