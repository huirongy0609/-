import {NextResponse} from 'next/server';
import {getCooperationAdminRole} from '@/lib/cooperation/database';
import {createSupabaseServerClient} from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return NextResponse.json({error: '登录会话已失效。'}, {status: 401});
    if (!await getCooperationAdminRole(user.id)) return NextResponse.json({error: '账号未获授权。'}, {status: 403});
    const {data: existing} = await supabase.auth.mfa.listFactors();
    const verified = existing?.totp.find((factor) => factor.status === 'verified');
    if (verified) return NextResponse.json({next: 'mfa', factorId: verified.id});
    const {data, error} = await supabase.auth.mfa.enroll({factorType: 'totp', friendlyName: '合作共建后台'});
    if (error || !data) return NextResponse.json({error: 'MFA 注册失败。'}, {status: 400});
    return NextResponse.json({next: 'verify', factorId: data.id, qrCode: data.totp.qr_code});
  } catch (error) {
    console.error('MFA enrollment failed', error);
    return NextResponse.json({error: '身份服务暂不可用。'}, {status: 503});
  }
}
