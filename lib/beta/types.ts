export const topicSectionTypes = ['JD', 'GT', 'FAQ', 'LAW', 'CASE', 'RESEARCH'] as const;

export type TopicSectionType = (typeof topicSectionTypes)[number];
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

export type BetaTopic = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryId: string;
  tagIds: string[];
  keywords: string[];
  updatedAt: string;
  popularity: number;
  status: 'beta_preview';
  sections: TopicSection[];
};

export type TopicCatalog = {
  schemaVersion: string;
  provider: 'beta_fallback';
  notice: string;
  categories: TopicTaxonomyEntry[];
  tags: TopicTaxonomyEntry[];
  topics: BetaTopic[];
};

export type TopicQuery = {
  q?: string;
  category?: string;
  tag?: string;
};

export type TopicProvider = {
  source: 'foundation' | 'beta_fallback';
  getCatalog(): Promise<TopicCatalog>;
  getTopics(query?: TopicQuery): Promise<BetaTopic[]>;
  getTopicBySlug(slug: string): Promise<BetaTopic | undefined>;
};

export type BetaSearchScope = 'all' | 'topics' | 'knowledge';

export type BetaSearchResult = {
  id: string;
  kind: 'topic' | 'knowledge';
  typeLabel: string;
  title: string;
  excerpt: string;
  href: string;
  statusLabel: string;
};
