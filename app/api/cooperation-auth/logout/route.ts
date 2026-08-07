import {NextResponse} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Cooperation admin logout failed', error);
  }
  return NextResponse.redirect(new URL('/cooperation/admin/login', request.url), {status: 303});
}
