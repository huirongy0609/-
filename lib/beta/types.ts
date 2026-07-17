export const topicSectionTypes = ['JD', 'GT', 'FAQ', 'LAW', 'CASE', 'RESEARCH'] as const;
export const topicLifecycleStatuses = ['draft', 'in_review', 'approved', 'archived'] as const;
export const topicReleaseLevels = ['Candidate', 'Foundation Ready', 'Website Ready'] as const;

export type TopicSectionType = (typeof topicSectionTypes)[number];
export type TopicLifecycleStatus = (typeof topicLifecycleStatuses)[number];
export type TopicReleaseLevel = (typeof topicReleaseLevels)[number];
export type TopicReferenceStatus = 'approved' | 'in_review';

export type TopicTaxonomyEntry = {
  id: string;
  label: string;
};

export type TopicReference = {
  id: string;
  title: string;
  status: TopicReferenceStatus;
  href?: string;
};

export type TopicSection = {
  type: TopicSectionType;
  label: string;
  items: TopicReference[];
};

export type TopicEvidence = {
  id: string;
  label: string;
  source?: string;
};

/** Canonical Topic contract returned by the Repository to Website consumers. */
export type Topic = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  status: TopicLifecycleStatus;
  releaseLevel: TopicReleaseLevel;
  sections: TopicSection[];
  evidence: TopicEvidence[];
  updatedAt: string;
  categoryId: string;
  tagIds: string[];
  keywords: string[];
  popularity: number;
};

/** Compatibility alias retained for ENG-023 Website components. */
export type BetaTopic = Topic;

export type BetaFallbackTopic = Omit<Topic, 'subtitle' | 'status' | 'releaseLevel' | 'evidence'> & {
  subtitle?: string;
  status: 'beta_preview';
  releaseLevel?: TopicReleaseLevel;
  evidence?: TopicEvidence[];
};

export type TopicCatalog = {
  schemaVersion: string;
  provider: 'foundation' | 'beta_fallback';
  notice: string;
  categories: TopicTaxonomyEntry[];
  tags: TopicTaxonomyEntry[];
  topics: Topic[];
  warnings: TopicValidationWarning[];
};

export type BetaFallbackCatalog = Omit<TopicCatalog, 'provider' | 'topics' | 'warnings'> & {
  provider: 'beta_fallback';
  topics: BetaFallbackTopic[];
  warnings?: TopicValidationWarning[];
};

export type TopicRegistryDocument = {
  schemaVersion: string;
  generatedAt: string | null;
  foundationIndex: string;
  manifestRoot?: string;
  manifests?: string[];
  categories: TopicTaxonomyEntry[];
  tags: TopicTaxonomyEntry[];
  /** @deprecated ENG-025 legacy inline records; use manifests. */
  topics?: unknown[];
};

export type TopicValidationWarning = {
  code: string;
  message: string;
  topicId?: string;
};

export type TopicQuery = {
  q?: string;
  category?: string;
  tag?: string;
};

export type TopicProvider = {
  readonly source: 'foundation' | 'beta_fallback';
  getCatalog(): Promise<TopicCatalog>;
  getTopics(query?: TopicQuery): Promise<Topic[]>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
};

export type BetaSearchScope = 'all' | 'topics' | 'knowledge';

export type RepositorySearchOptions = {
  scope?: BetaSearchScope;
  includeFullText?: boolean;
};

export type BetaSearchResult = {
  id: string;
  kind: 'topic' | 'knowledge';
  typeLabel: string;
  title: string;
  excerpt: string;
  href: string;
  statusLabel: string;
};
