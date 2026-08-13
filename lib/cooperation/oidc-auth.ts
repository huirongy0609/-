import {cookies} from 'next/headers';
import {createRemoteJWKSet, jwtVerify} from 'jose';
import {oidcPayloadHasMfa} from './oidc-utils';

export {oidcPayloadHasMfa, pkceChallenge, randomUrlSafe} from './oidc-utils';

export const oidcSessionCookie = '__Host-cooperation-admin';
export const oidcStateCookie = '__Host-cooperation-oidc-state';
export const oidcVerifierCookie = '__Host-cooperation-oidc-verifier';
export const oidcNonceCookie = '__Host-cooperation-oidc-nonce';

type OidcConfiguration = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  jwksUri: string;
  redirectUri: string;
  mfaAcrValues: string[];
  mfaPolicyClaim?: {name: string; value: string};
};

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function httpsUrl(name: string, value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error(`${name} must use HTTPS`);
  return url.toString();
}

export function cooperationIdentityProvider() {
  return process.env.COOPERATION_IDENTITY_PROVIDER?.trim() === 'oidc' ? 'oidc' : 'supabase';
}

export function oidcConfiguration(): OidcConfiguration {
  const siteOrigin = requiredEnvironment('NEXT_PUBLIC_SITE_URL').replace(/\/$/, '');
  const mfaPolicyClaimName = process.env.COOPERATION_OIDC_MFA_POLICY_CLAIM_NAME?.trim() || '';
  const mfaPolicyClaimValue = process.env.COOPERATION_OIDC_MFA_POLICY_CLAIM_VALUE?.trim() || '';
  if (Boolean(mfaPolicyClaimName) !== Boolean(mfaPolicyClaimValue)) {
    throw new Error('OIDC MFA policy claim name and value must be configured together');
  }
  if (mfaPolicyClaimName && !/^[A-Za-z_][A-Za-z0-9_.-]{0,63}$/.test(mfaPolicyClaimName)) {
    throw new Error('OIDC MFA policy claim name is invalid');
  }
  return {
    issuer: httpsUrl('COOPERATION_OIDC_ISSUER', requiredEnvironment('COOPERATION_OIDC_ISSUER')).replace(/\/$/, ''),
    clientId: requiredEnvironment('COOPERATION_OIDC_CLIENT_ID'),
    clientSecret: requiredEnvironment('COOPERATION_OIDC_CLIENT_SECRET'),
    authorizationEndpoint: httpsUrl('COOPERATION_OIDC_AUTHORIZATION_ENDPOINT', requiredEnvironment('COOPERATION_OIDC_AUTHORIZATION_ENDPOINT')),
    tokenEndpoint: httpsUrl('COOPERATION_OIDC_TOKEN_ENDPOINT', requiredEnvironment('COOPERATION_OIDC_TOKEN_ENDPOINT')),
    jwksUri: httpsUrl('COOPERATION_OIDC_JWKS_URI', requiredEnvironment('COOPERATION_OIDC_JWKS_URI')),
    redirectUri: process.env.COOPERATION_OIDC_REDIRECT_URI?.trim()
      || `${siteOrigin}/api/cooperation-auth/oidc/callback`,
    mfaAcrValues: (process.env.COOPERATION_OIDC_MFA_ACR_VALUES || '')
      .split(',').map((value) => value.trim()).filter(Boolean),
    mfaPolicyClaim: mfaPolicyClaimName
      ? {name: mfaPolicyClaimName, value: mfaPolicyClaimValue}
      : undefined,
  };
}

export function oidcApplicationUrl(path: string) {
  const siteOrigin = httpsUrl('NEXT_PUBLIC_SITE_URL', requiredEnvironment('NEXT_PUBLIC_SITE_URL'))
    .replace(/\/$/, '');
  return new URL(path, `${siteOrigin}/`);
}

function jwks(uri: string) {
  let value = jwksCache.get(uri);
  if (!value) {
    value = createRemoteJWKSet(new URL(uri), {timeoutDuration: 5000, cooldownDuration: 30000});
    jwksCache.set(uri, value);
  }
  return value;
}

export async function verifyOidcIdToken(token: string, expectedNonce?: string) {
  const config = oidcConfiguration();
  const result = await jwtVerify(token, jwks(config.jwksUri), {
    issuer: config.issuer,
    audience: config.clientId,
    algorithms: ['RS256', 'ES256'],
    clockTolerance: 30,
  });
  if (expectedNonce && result.payload.nonce !== expectedNonce) throw new Error('OIDC nonce mismatch');
  if (!result.payload.sub) throw new Error('OIDC subject is missing');
  if (!oidcPayloadHasMfa(result.payload, config.mfaAcrValues, config.mfaPolicyClaim)) {
    throw new Error('OIDC MFA evidence is missing');
  }
  return result.payload;
}

export async function currentOidcIdentity() {
  const token = (await cookies()).get(oidcSessionCookie)?.value;
  if (!token) return null;
  const payload = await verifyOidcIdToken(token);
  return {
    sub: payload.sub as string,
    email: typeof payload.email === 'string' ? payload.email : '',
    expiresAt: payload.exp,
  };
}

export const oidcCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
};
