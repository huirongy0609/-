import {NextResponse} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {
  cooperationIdentityProvider,
  oidcApplicationUrl,
  oidcCookieOptions,
  oidcSessionCookie,
} from '@/lib/cooperation/oidc-auth';

export async function POST(request: Request) {
  if (cooperationIdentityProvider() === 'oidc') {
    const response = NextResponse.redirect(oidcApplicationUrl('/cooperation/admin/login'), {status: 303});
    response.cookies.set(oidcSessionCookie, '', {
      ...oidcCookieOptions,
      expires: new Date(0),
      maxAge: 0,
    });
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
