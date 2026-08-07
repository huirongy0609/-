import {NextResponse} from 'next/server';
import {z} from 'zod';
import {appendCooperationAuditLog, getCooperationAdminRole} from '@/lib/cooperation/database';
import {createSupabaseServerClient} from '@/lib/supabase/server';

const verifySchema = z.object({
  factorId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: '请输入六位验证码。'}, {status: 400});
  try {
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return NextResponse.json({error: '登录会话已失效。'}, {status: 401});
    const role = await getCooperationAdminRole(user.id);
    if (!role) return NextResponse.json({error: '账号未获授权。'}, {status: 403});
    const {error} = await supabase.auth.mfa.challengeAndVerify({
      factorId: parsed.data.factorId,
      code: parsed.data.code,
    });
    if (error) {
      await appendCooperationAuditLog({actorSubject: user.id, actorRole: role, action: 'auth.mfa',
        resourceType: 'cooperation_admin', outcome: 'denied', detail: {reason: 'invalid_totp'}});
      return NextResponse.json({error: '验证码无效或已过期。'}, {status: 401});
    }
    await appendCooperationAuditLog({actorSubject: user.id, actorRole: role, action: 'auth.mfa',
      resourceType: 'cooperation_admin', outcome: 'success'});
    return NextResponse.json({ok: true});
  } catch (error) {
    console.error('MFA verification failed', error);
    return NextResponse.json({error: '身份服务暂不可用。'}, {status: 503});
  }
}
