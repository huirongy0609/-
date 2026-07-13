export type FoundationObjectType = 'JD' | 'GT';

export type FoundationLifecycle = 'draft' | 'in_review' | 'approved' | 'pending_revision' | 'archived';

export type FoundationRelation = {
  id: string;
  lifecycleStatus: FoundationLifecycle | null;
};

export type FoundationKnowledgeObject = {
  id: string;
  type: FoundationObjectType;
  title: string;
  summary: string;
  body: string;
  category: string;
  tags: string[];
  version: string | null;
  versionNote: string | null;
  lifecycleStatus: FoundationLifecycle | null;
  sourceAuditStatus: string | null;
  filePath: string | null;
  approvedAt: string | null;
  relatedObjects: FoundationRelation[];
};

export const foundationTypeLabels: Record<FoundationObjectType, string> = {
  JD: '治理词典',
  GT: '治理工具',
};

export const lifecycleLabels: Record<FoundationLifecycle, string> = {
  draft: '候选稿',
  in_review: '审核中',
  approved: '已批准',
  pending_revision: '待修订',
  archived: '已归档',
};
