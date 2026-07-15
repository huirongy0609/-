export const statusTokens = {
  approved: {
    label: 'Approved',
    tone: 'success',
  },
  in_review: {
    label: 'In Review',
    tone: 'warning',
  },
  draft: {
    label: 'Draft',
    tone: 'neutral',
  },
  deprecated: {
    label: 'Deprecated',
    tone: 'danger',
  },
  archived: {
    label: 'Archive',
    tone: 'muted',
  },
  pending_revision: {
    label: 'Pending Reference',
    tone: 'warning',
  },
  reviewing: {
    label: 'In Review',
    tone: 'warning',
  },
  rejected: {
    label: 'Deprecated',
    tone: 'danger',
  },
  status_not_declared: {
    label: 'Draft',
    tone: 'neutral',
  },
} as const;

export type StatusKey = keyof typeof statusTokens;
