import {NextResponse} from 'next/server';
import {
  oidcConfiguration,
  oidcCookieOptions,
  oidcNonceCookie,
  oidcStateCookie,
  oidcVerifierCookie,
  pkceChallenge,
  randomUrlSafe,
} from '@/lib/cooperation/oidc-auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const config = oidcConfiguration();
    const state = randomUrlSafe();
    const nonce = randomUrlSafe();
    const verifier = randomUrlSafe(48);
    const authorizationUrl = new URL(config.authorizationEndpoint);
    authorizationUrl.searchParams.set('client_id', config.clientId);
    authorizationUrl.searchParams.set('redirect_uri', config.redirectUri);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid email');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('nonce', nonce);
    authorizationUrl.searchParams.set('code_challenge', pkceChallenge(verifier));
    authorizationUrl.searchParams.set('code_challenge_method', 'S256');
    if (config.mfaAcrValues.length) authorizationUrl.searchParams.set('acr_values', config.mfaAcrValues.join(' '));

    const response = NextResponse.redirect(authorizationUrl);
    const transient = {...oidcCookieOptions, maxAge: 600};
    response.cookies.set(oidcStateCookie, state, transient);
    response.cookies.set(oidcNonceCookie, nonce, transient);
    response.cookies.set(oidcVerifierCookie, verifier, transient);
    return response;
  } catch (error) {
    console.error('OIDC login configuration failed', error);
    return NextResponse.json({error: '组织身份登录尚未配置。'}, {status: 503});
  }
}
