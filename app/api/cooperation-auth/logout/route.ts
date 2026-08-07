import {NextResponse} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {cooperationIdentityProvider, oidcSessionCookie} from '@/lib/cooperation/oidc-auth';

export async function POST(request: Request) {
  if (cooperationIdentityProvider() === 'oidc') {
    const response = NextResponse.redirect(new URL('/cooperation/admin/login', request.url), {status: 303});
    response.cookies.delete(oidcSessionCookie);
    return response;
  }
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Cooperation admin logout failed', error);
  }
  return NextResponse.redirect(new URL('/cooperation/admin/login', request.url), {status: 303});
}
