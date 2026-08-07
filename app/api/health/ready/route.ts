import {NextResponse} from 'next/server';
import {checkCooperationDatabase} from '@/lib/cooperation/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!await checkCooperationDatabase()) throw new Error('database_not_ready');
    return NextResponse.json({status: 'ready'}, {headers: {'Cache-Control': 'no-store'}});
  } catch {
    return NextResponse.json({status: 'not_ready'}, {
      status: 503,
      headers: {'Cache-Control': 'no-store'},
    });
  }
}
