import {NextResponse} from 'next/server';
import {z} from 'zod';
import {appendCooperationAuditLog, getCooperationAdminRole} from '@/lib/cooperation/database';
import {createSupabaseServerClient} from '@/lib/supabase/server';

const loginSchema = z.object({
  email: z.email().max(240),
  password: z.string().min(12).max(200),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: '登录信息格式不正确。'}, {status: 400});
  try {
    const supabase = await createSupabaseServerClient();
    const {data, error} = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) {
      await appendCooperationAuditLog({actorSubject: 'anonymous', actorRole: 'none', action: 'auth.password',
        resourceType: 'cooperation_admin', outcome: 'denied', detail: {reason: 'invalid_credentials'}});
      return NextResponse.json({error: '账号或密码不正确。'}, {status: 401});
    }
    const role = await getCooperationAdminRole(data.user.id);
    if (!role) {
      await appendCooperationAuditLog({actorSubject: data.user.id, actorRole: 'none', action: 'auth.password',
        resourceType: 'cooperation_admin', outcome: 'denied', detail: {reason: 'admin_not_provisioned'}});
      await supabase.auth.signOut();
      return NextResponse.json({error: '账号未获得合作后台权限。'}, {status: 403});
    }
    const {data: factors} = await supabase.auth.mfa.listFactors();
    const verified = factors?.totp.find((factor) => factor.status === 'verified');
    await appendCooperationAuditLog({actorSubject: data.user.id, actorRole: role, action: 'auth.password',
      resourceType: 'cooperation_admin', outcome: 'success', detail: {mfaPending: true}});
    return NextResponse.json(verified
      ? {next: 'mfa', factorId: verified.id}
      : {next: 'enroll'});
  } catch (error) {
    console.error('Cooperation admin login failed', error);
    return NextResponse.json({error: '身份服务暂不可用。'}, {status: 503});
  }
}
