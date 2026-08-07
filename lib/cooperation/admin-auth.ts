import {appendCooperationAuditLog, getCooperationAdminRole} from './database';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {roleHasPermission, type CooperationPermission, type CooperationRole} from './permissions';
import {cooperationIdentityProvider, currentOidcIdentity} from './oidc-auth';

export {cooperationRoles, roleHasPermission} from './permissions';
export type {CooperationPermission, CooperationRole} from './permissions';

export type CooperationIdentity = {
  sub: string;
  email: string;
  role: CooperationRole;
  mfa: true;
};

export type AuthorizationResult =
  | {status: 'authorized'; identity: CooperationIdentity}
  | {status: 'unauthorized'; reason: string}
  | {status: 'forbidden'; reason: string}
  | {status: 'missing_configuration'; reason: string};

async function safeAudit(entry: Parameters<typeof appendCooperationAuditLog>[0]) {
  try {
    await appendCooperationAuditLog(entry);
  } catch (error) {
    console.error('Cooperation audit write failed', error);
  }
}

export async function authorizeCooperationAdmin(
  required: CooperationPermission,
  context: {action: string; resourceType: string; requestId?: string},
): Promise<AuthorizationResult> {
  if (cooperationIdentityProvider() === 'oidc') {
    let user;
    try {
      user = await currentOidcIdentity();
    } catch {
      await safeAudit({actorSubject: 'anonymous', actorRole: 'none', action: context.action,
        resourceType: context.resourceType, outcome: 'denied', requestId: context.requestId,
        detail: {reason: 'oidc_session_invalid_or_mfa_missing'}});
      return {status: 'unauthorized', reason: 'oidc_session_invalid_or_mfa_missing'};
    }
    if (!user) return {status: 'unauthorized', reason: 'session_missing_or_invalid'};
    const role = await getCooperationAdminRole(user.sub);
    if (!role || !roleHasPermission(role, required)) {
      await safeAudit({actorSubject: user.sub, actorRole: role || 'none', action: context.action,
        resourceType: context.resourceType, outcome: 'denied', requestId: context.requestId,
        detail: {reason: role ? 'permission_denied' : 'admin_not_provisioned'}});
      return {status: 'forbidden', reason: role ? 'permission_denied' : 'admin_not_provisioned'};
    }
    return {status: 'authorized', identity: {sub: user.sub, email: user.email, role, mfa: true}};
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return {status: 'missing_configuration', reason: 'identity_provider_not_configured'};
  }

  const {data: {user}, error} = await supabase.auth.getUser();
  if (error || !user) {
    await safeAudit({actorSubject: 'anonymous', actorRole: 'none', action: context.action,
      resourceType: context.resourceType, outcome: 'denied', requestId: context.requestId,
      detail: {reason: 'session_missing_or_invalid'}});
    return {status: 'unauthorized', reason: 'session_missing_or_invalid'};
  }

  const {data: assurance} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (!assurance || assurance.currentLevel !== 'aal2') {
    await safeAudit({actorSubject: user.id, actorRole: 'unresolved', action: context.action,
      resourceType: context.resourceType, outcome: 'denied', requestId: context.requestId,
      detail: {reason: 'mfa_required'}});
    return {status: 'unauthorized', reason: 'mfa_required'};
  }

  const role = await getCooperationAdminRole(user.id);
  if (!role || !roleHasPermission(role, required)) {
    await safeAudit({actorSubject: user.id, actorRole: role || 'none', action: context.action,
      resourceType: context.resourceType, outcome: 'denied', requestId: context.requestId,
      detail: {reason: role ? 'permission_denied' : 'admin_not_provisioned'}});
    return {status: 'forbidden', reason: role ? 'permission_denied' : 'admin_not_provisioned'};
  }

  return {status: 'authorized', identity: {
    sub: user.id,
    email: user.email || '',
    role,
    mfa: true,
  }};
}
