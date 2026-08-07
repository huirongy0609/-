import {NextResponse} from 'next/server';
import {authorizeCooperationAdmin} from '@/lib/cooperation/admin-auth';
import {insertCooperationLead, listCooperationLeads} from '@/lib/cooperation/database';
import {cooperationLeadSchema} from '@/lib/cooperation/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const parsed = cooperationLeadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({
        error: '请检查并完善登记信息。',
        fields: parsed.error.flatten().fieldErrors,
      }, {status: 400});
    }

    const result = await insertCooperationLead(parsed.data, '/cooperation/register');
    return NextResponse.json(result, {status: 201});
  } catch (error) {
    console.error('Cooperation lead submission failed', error);
    return NextResponse.json({error: '提交暂时未完成，请稍后重试。'}, {status: 500});
  }
}

export async function GET(request: Request) {
  const requestId = request.headers.get('x-vercel-id') || crypto.randomUUID();
  const authorization = await authorizeCooperationAdmin('lead:read', {
    action: 'lead.list', resourceType: 'cooperation_registration', requestId,
  });
  if (authorization.status === 'missing_configuration') {
    return NextResponse.json({error: '后台查看功能尚未配置。'}, {status: 503});
  }
  if (authorization.status === 'unauthorized') {
    return NextResponse.json({error: '无权查看合作线索记录。'}, {status: 401});
  }

  if (authorization.status === 'forbidden') {
    return NextResponse.json({error: '当前账号没有查看权限。'}, {status: 403});
  }

  const records = await listCooperationLeads();
  const {appendCooperationAuditLog} = await import('@/lib/cooperation/database');
  await appendCooperationAuditLog({
    actorSubject: authorization.identity.sub,
    actorRole: authorization.identity.role,
    action: 'lead.list',
    resourceType: 'cooperation_registration',
    outcome: 'success',
    requestId,
    detail: {recordCount: records.length},
  });
  return NextResponse.json({records}, {
    headers: {'Cache-Control': 'no-store'},
  });
}
