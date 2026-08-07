import {createHmac, timingSafeEqual} from 'node:crypto';

export const cooperationRoles = ['super_admin', 'cooperation_reviewer', 'data_admin'] as const;
export type CooperationRole = typeof cooperationRoles[number];
export type CooperationPermission = 'user:manage' | 'role:manage' | 'audit:read' | 'lead:read' | 'lead:review' | 'data:export' | 'stats:read';

const permissions: Record<CooperationRole, CooperationPermission[]> = {
  super_admin: ['user:manage', 'role:manage', 'audit:read', 'lead:read', 'lead:review', 'data:export', 'stats:read'],
  cooperation_reviewer: ['lead:read', 'lead:review'],
  data_admin: ['lead:read', 'data:export', 'stats:read'],
};

export type CooperationIdentity = {
  sub: string;
  email: string;
  role: CooperationRole;
  mfa: true;
  exp: number;
};

export type AuthorizationResult =
  | {status: 'authorized'; identity: CooperationIdentity}
  | {status: 'unauthorized'; reason: string}
  | {status: 'missing_configuration'; reason: string};

function decodeSession(value: string, secret: string): CooperationIdentity | null {
  const [payload, suppliedSignature] = value.split('.');
  if (!payload || !suppliedSignature) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  const supplied = Buffer.from(suppliedSignature);
  const calculated = Buffer.from(expected);
  if (supplied.length !== calculated.length || !timingSafeEqual(supplied, calculated)) return null;
  try {
    const identity = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as CooperationIdentity;
    if (!identity.sub || !identity.email || !cooperationRoles.includes(identity.role)) return null;
    if (identity.mfa !== true || identity.exp <= Math.floor(Date.now() / 1000)) return null;
    return identity;
  } catch {
    return null;
  }
}

function sessionCookie(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('cooperation_admin_session='))?.split('=').slice(1).join('=');
}

export function authorizeCooperationAdmin(request: Request, required: CooperationPermission): AuthorizationResult {
  const secret = process.env.COOPERATION_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) return {status: 'missing_configuration', reason: 'session_secret_not_configured'};
  const value = sessionCookie(request);
  if (!value) return {status: 'unauthorized', reason: 'session_missing'};
  const identity = decodeSession(decodeURIComponent(value), secret);
  if (!identity) return {status: 'unauthorized', reason: 'session_invalid_or_mfa_missing'};
  if (!permissions[identity.role].includes(required)) return {status: 'unauthorized', reason: 'permission_denied'};
  return {status: 'authorized', identity};
}

