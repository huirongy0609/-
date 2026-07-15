import {statusTokens, type StatusKey} from '@/lib/design-tokens/status';

type StatusBadgeProps = {
  status?: string | null;
  children?: React.ReactNode;
};

const toneClassNames: Record<string, string> = {
  success: 'platformStatus platformStatusSuccess',
  warning: 'platformStatus platformStatusWarning',
  neutral: 'platformStatus platformStatusNeutral',
  danger: 'platformStatus platformStatusDanger',
  muted: 'platformStatus platformStatusMuted',
};

export function StatusBadge({status, children}: StatusBadgeProps) {
  const key = normalizeStatus(status);
  const token = statusTokens[key];
  return <span className={toneClassNames[token.tone]}>{children || token.label}</span>;
}

function normalizeStatus(status?: string | null): StatusKey {
  if (!status) return 'status_not_declared';
  const normalized = status.toLowerCase().replace(/\s+/g, '_');
  if (normalized in statusTokens) return normalized as StatusKey;
  if (normalized.includes('approved') || normalized.includes('已审核') || normalized.includes('已批准')) return 'approved';
  if (normalized.includes('review') || normalized.includes('审核')) return 'in_review';
  if (normalized.includes('draft') || normalized.includes('候选')) return 'draft';
  if (normalized.includes('archive') || normalized.includes('归档')) return 'archived';
  return 'status_not_declared';
}
