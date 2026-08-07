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
  const authorization = authorizeCooperationAdmin(request, 'lead:read');
  if (authorization.status === 'missing_configuration') {
    return NextResponse.json({error: '后台查看功能尚未配置。'}, {status: 503});
  }
  if (authorization.status === 'unauthorized') {
    return NextResponse.json({error: '无权查看合作线索记录。'}, {status: 401});
  }

  return NextResponse.json({records: await listCooperationLeads()}, {
    headers: {'Cache-Control': 'no-store'},
  });
}
