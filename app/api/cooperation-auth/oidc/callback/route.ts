import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import {appendCooperationAuditLog, getCooperationAdminRole} from '@/lib/cooperation/database';
import {
  oidcConfiguration,
  oidcApplicationUrl,
  oidcCookieOptions,
  oidcNonceCookie,
  oidcSessionCookie,
  oidcStateCookie,
  oidcVerifierCookie,
  verifyOidcIdToken,
} from '@/lib/cooperation/oidc-auth';

export const runtime = 'nodejs';

function loginRedirect(error: string) {
  const url = oidcApplicationUrl('/cooperation/admin/login');
  url.searchParams.set('error', error);
  return NextResponse.redirect(url, {status: 303});
}

async function auditDenied(reason: string) {
  try {
    await appendCooperationAuditLog({actorSubject: 'anonymous', actorRole: 'none',
      action: 'auth.oidc', resourceType: 'cooperation_admin', outcome: 'denied',
      detail: {reason}});
  } catch (error) {
    console.error('OIDC failure audit write failed', error);
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(oidcStateCookie)?.value;
  const nonce = cookieStore.get(oidcNonceCookie)?.value;
  const verifier = cookieStore.get(oidcVerifierCookie)?.value;
  if (!code || !state || !expectedState || state !== expectedState || !nonce || !verifier) {
    await auditDenied('invalid_callback');
    return loginRedirect('invalid_callback');
  }

  try {
    const config = oidcConfiguration();
    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code_verifier: verifier,
      }),
      cache: 'no-store',
    });
    const token = await tokenResponse.json() as {id_token?: string};
    if (!tokenResponse.ok || !token.id_token) throw new Error('OIDC token exchange failed');
    const payload = await verifyOidcIdToken(token.id_token, nonce);
    const role = await getCooperationAdminRole(payload.sub as string);
    if (!role) {
      await appendCooperationAuditLog({actorSubject: payload.sub as string, actorRole: 'none',
        action: 'auth.oidc', resourceType: 'cooperation_admin', outcome: 'denied',
        detail: {reason: 'admin_not_provisioned'}});
      return loginRedirect('not_authorized');
    }

    await appendCooperationAuditLog({actorSubject: payload.sub as string, actorRole: role,
      action: 'auth.oidc', resourceType: 'cooperation_admin', outcome: 'success',
      detail: {mfaVerified: true}});
    const response = NextResponse.redirect(oidcApplicationUrl('/cooperation/admin'), {status: 303});
    const maxAge = Math.max(60, Math.min(28800, (payload.exp || 0) - Math.floor(Date.now() / 1000)));
    response.cookies.set(oidcSessionCookie, token.id_token, {...oidcCookieOptions, maxAge});
    response.cookies.delete(oidcStateCookie);
    response.cookies.delete(oidcNonceCookie);
    response.cookies.delete(oidcVerifierCookie);
    return response;
  } catch (error) {
    console.error('OIDC callback failed', error);
    await auditDenied('authentication_failed');
    return loginRedirect('authentication_failed');
  }
}
