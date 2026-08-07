'use client';

import {useState} from 'react';
import partnerStyles from '@/app/partners/partners.module.css';
import styles from '@/app/cooperation/cooperation.module.css';

type Step = 'credentials' | 'mfa' | 'enroll';

export function CooperationAdminLogin({identityProvider}: {identityProvider: 'supabase' | 'oidc'}) {
  const [step, setStep] = useState<Step>('credentials');
  const [factorId, setFactorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/cooperation-auth/login', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: form.get('email'), password: form.get('password')}),
    });
    const result = await response.json() as {next?: string; factorId?: string; error?: string};
    if (!response.ok) {
      setMessage(result.error || '登录失败。');
      setLoading(false);
      return;
    }
    if (result.next === 'mfa' && result.factorId) {
      setFactorId(result.factorId);
      setStep('mfa');
    } else {
      const enrollResponse = await fetch('/api/cooperation-auth/mfa/enroll', {method: 'POST'});
      const enroll = await enrollResponse.json() as {factorId?: string; qrCode?: string; next?: string; error?: string};
      if (!enrollResponse.ok || !enroll.factorId) setMessage(enroll.error || 'MFA 注册失败。');
      else {
        setFactorId(enroll.factorId);
        setQrCode(enroll.qrCode || '');
        setStep(enroll.next === 'mfa' ? 'mfa' : 'enroll');
      }
    }
    setLoading(false);
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const code = new FormData(event.currentTarget).get('code');
    const response = await fetch('/api/cooperation-auth/mfa/verify', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({factorId, code}),
    });
    const result = await response.json() as {ok?: boolean; error?: string};
    if (response.ok && result.ok) window.location.assign('/cooperation/admin');
    else {
      setMessage(result.error || 'MFA 验证失败。');
      setLoading(false);
    }
  }

  if (identityProvider === 'oidc') return (
    <div className={styles.accessPanel}>
      <div>
        <strong>组织身份登录</strong>
        <p>将跳转至经批准的身份服务，并强制执行多因素认证。</p>
      </div>
      <a className={partnerStyles.primaryButton} href="/api/cooperation-auth/oidc/login">使用组织身份登录</a>
    </div>
  );

  if (step === 'credentials') return (
    <form className={partnerStyles.form} onSubmit={login}>
      <label className={partnerStyles.field}><span className={partnerStyles.label}>管理员邮箱</span><input autoComplete="username" className={partnerStyles.input} name="email" required type="email" /></label>
      <label className={partnerStyles.field}><span className={partnerStyles.label}>密码</span><input autoComplete="current-password" className={partnerStyles.input} minLength={12} name="password" required type="password" /></label>
      {message ? <p aria-live="polite" className={styles.error}>{message}</p> : null}
      <button className={partnerStyles.primaryButton} disabled={loading} type="submit">{loading ? '正在验证…' : '继续'}</button>
    </form>
  );

  return (
    <form className={partnerStyles.form} onSubmit={verify}>
      {step === 'enroll' ? <><p>请先使用身份验证器扫描二维码，再输入六位动态验证码。</p>{qrCode ? <img alt="MFA TOTP 注册二维码" height="220" src={qrCode} width="220" /> : null}</> : <p>请输入身份验证器生成的六位动态验证码。</p>}
      <label className={partnerStyles.field}><span className={partnerStyles.label}>动态验证码</span><input autoComplete="one-time-code" className={partnerStyles.input} inputMode="numeric" maxLength={6} name="code" pattern="[0-9]{6}" required /></label>
      {message ? <p aria-live="polite" className={styles.error}>{message}</p> : null}
      <button className={partnerStyles.primaryButton} disabled={loading} type="submit">{loading ? '正在验证…' : '完成 MFA 验证'}</button>
    </form>
  );
}
