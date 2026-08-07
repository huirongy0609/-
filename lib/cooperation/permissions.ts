export const cooperationRoles = ['super_admin', 'cooperation_reviewer', 'data_admin'] as const;
export type CooperationRole = typeof cooperationRoles[number];
export type CooperationPermission = 'user:manage' | 'role:manage' | 'audit:read' | 'lead:read' | 'lead:review' | 'data:export' | 'stats:read';

const permissions: Record<CooperationRole, CooperationPermission[]> = {
  super_admin: ['user:manage', 'role:manage', 'audit:read', 'lead:read', 'lead:review', 'data:export', 'stats:read'],
  cooperation_reviewer: ['lead:read', 'lead:review'],
  data_admin: ['lead:read', 'data:export', 'stats:read'],
};

export function roleHasPermission(role: CooperationRole, required: CooperationPermission) {
  return permissions[role].includes(required);
}
