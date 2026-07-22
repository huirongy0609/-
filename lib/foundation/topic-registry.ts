import {
  topicLifecycleStatuses,
  topicReleaseLevels,
  topicSectionTypes,
  type Topic,
  type TopicLifecycleStatus,
  type TopicReference,
  type TopicRegistryDocument,
  type TopicReleaseLevel,
  type TopicSection,
  type TopicSectionType,
  type TopicTaxonomyEntry,
  type TopicValidationWarning,
} from '../beta/types.ts';

const sectionLabels: Record<TopicSectionType, string> = {
  JD: '治理词典',
  GT: '治理标准',
  FAQ: '常见问题',
  LAW: '法律依据',
  CASE: '实践案例',
  RESEARCH: '专题研究',
};

export type TopicRegistryValidation = {
  schemaVersion: string;
  generatedAt: string | null;
  foundationIndex: string;
  manifestRoot: string;
  manifestPaths: string[];
  categories: TopicTaxonomyEntry[];
  tags: TopicTaxonomyEntry[];
  topics: Topic[];
  warnings: TopicValidationWarning[];
};

export function validateTopicRegistry(input: unknown): TopicRegistryValidation {
  const warnings: TopicValidationWarning[] = [];
  const root = isRecord(input) ? input : {};
  if (!isRecord(input)) warnings.push(warning('INVALID_REGISTRY', 'Topic Registry 必须是 JSON object。'));
  if (asString(root.repositoryWarning)) {
    warnings.push(warning('REGISTRY_READ_FAILED', `Topic Registry 读取失败：${asString(root.repositoryWarning)}`));
  }

  const rawManifestPaths = Array.isArray(root.manifests) ? root.manifests : [];
  const manifestPaths = rawManifestPaths.flatMap((item) => typeof item === 'string' && item.trim() ? [item.trim()] : []);
  for (const manifestPath of duplicateValues(manifestPaths)) {
    warnings.push(warning('DUPLICATE_MANIFEST_PATH', `Topic Registry 重复登记 Manifest: ${manifestPath}。`));
  }

  const rawTopics = Array.isArray(root.topics) ? root.topics : [];
  if (!Array.isArray(root.manifests) && !Array.isArray(root.topics)) {
    warnings.push(warning('MISSING_MANIFESTS', 'Topic Registry 缺少 manifests 数组。'));
  }
  if (!manifestPaths.length && !rawTopics.length) {
    warnings.push(warning('EMPTY_REGISTRY', 'Topic Release Registry 当前没有已登记 Manifest；Repository 将启用 beta_fallback。'));
  }

  const topics = rawTopics.flatMap((raw, index) => normalizeTopic(raw, index, warnings));
  warnForDuplicates(topics, 'id', 'DUPLICATE_ID', warnings);
  warnForDuplicates(topics, 'slug', 'DUPLICATE_SLUG', warnings);

  const duplicateIds = duplicateValues(topics.map((topic) => topic.id));
  const duplicateSlugs = duplicateValues(topics.map((topic) => topic.slug));

  return {
    schemaVersion: asString(root.schemaVersion) || '1.0',
    generatedAt: asString(root.generatedAt) || null,
    foundationIndex: asString(root.foundationIndex) || 'knowledge/foundation/index.json',
    manifestRoot: asString(root.manifestRoot) || 'foundation/topic-manifests',
    manifestPaths: [...new Set(manifestPaths)],
    categories: normalizeTaxonomy(root.categories),
    tags: normalizeTaxonomy(root.tags),
    topics: topics.filter((topic) => !duplicateIds.has(topic.id) && !duplicateSlugs.has(topic.slug)),
    warnings,
  };
}

export function isWebsiteReadyTopic(topic: Topic): boolean {
  return topic.status === 'approved' && topic.releaseLevel === 'Website Ready';
}

function normalizeTopic(raw: unknown, index: number, warnings: TopicValidationWarning[]): Topic[] {
  if (!isRecord(raw)) {
    warnings.push(warning('INVALID_TOPIC', `topics[${index}] 不是有效 object。`));
    return [];
  }

  const id = asString(raw.id);
  const slug = asString(raw.slug);
  const title = asString(raw.title);
  if (!id) warnings.push(warning('MISSING_ID', `topics[${index}] 缺少 id。`));
  if (!slug) warnings.push(warning('MISSING_SLUG', `topics[${index}] 缺少 slug。`, id));
  if (!title) warnings.push(warning('MISSING_TITLE', `topics[${index}] 缺少 title。`, id));
  if (!id || !slug || !title) return [];

  const status = normalizeStatus(raw.status, id, warnings);
  const releaseLevel = normalizeReleaseLevel(raw.releaseLevel, id, warnings);
  const sections = normalizeSections(raw.sections, id, warnings);

  return [{
    id,
    slug,
    title,
    subtitle: asString(raw.subtitle),
    summary: asString(raw.summary),
    status,
    releaseLevel,
    sections,
    evidence: Array.isArray(raw.evidence) ? raw.evidence.flatMap((item) => {
      if (!isRecord(item) || !asString(item.id) || !asString(item.label)) return [];
      return [{id: asString(item.id), label: asString(item.label), source: asString(item.source) || undefined}];
    }) : [],
    updatedAt: asString(raw.updatedAt),
    categoryId: asString(raw.categoryId),
    tagIds: stringArray(raw.tagIds),
    keywords: stringArray(raw.keywords),
    popularity: typeof raw.popularity === 'number' && Number.isFinite(raw.popularity) ? raw.popularity : 0,
  }];
}

function normalizeStatus(value: unknown, topicId: string, warnings: TopicValidationWarning[]): TopicLifecycleStatus {
  if (typeof value === 'string' && topicLifecycleStatuses.includes(value as TopicLifecycleStatus)) return value as TopicLifecycleStatus;
  warnings.push(warning('INVALID_STATUS', `Topic ${topicId} 的 status 无效，已按 draft 处理。`, topicId));
  return 'draft';
}

function normalizeReleaseLevel(value: unknown, topicId: string, warnings: TopicValidationWarning[]): TopicReleaseLevel {
  if (typeof value === 'string' && topicReleaseLevels.includes(value as TopicReleaseLevel)) return value as TopicReleaseLevel;
  warnings.push(warning('INVALID_RELEASE_LEVEL', `Topic ${topicId} 的 releaseLevel 无效，已按 Candidate 处理。`, topicId));
  return 'Candidate';
}

function normalizeSections(value: unknown, topicId: string, warnings: TopicValidationWarning[]): TopicSection[] {
  if (!Array.isArray(value)) {
    warnings.push(warning('MISSING_SECTIONS', `Topic ${topicId} 缺少 sections，已生成空 Section 结构。`, topicId));
    return emptySections();
  }

  return topicSectionTypes.map((type) => {
    const raw = value.find((item) => isRecord(item) && item.type === type);
    if (!isRecord(raw)) {
      warnings.push(warning('MISSING_SECTION', `Topic ${topicId} 缺少 ${type} Section，已按空 Section 处理。`, topicId));
      return {type, label: sectionLabels[type], items: []};
    }
    const items = Array.isArray(raw.items) ? raw.items.flatMap(normalizeReference) : [];
    return {type, label: asString(raw.label) || sectionLabels[type], items};
  });
}

function normalizeReference(value: unknown): TopicReference[] {
  if (!isRecord(value) || !asString(value.id) || !asString(value.title)) return [];
  return [{
    id: asString(value.id),
    title: asString(value.title),
    status: value.status === 'approved' ? 'approved' : 'in_review',
    href: asString(value.href) || undefined,
  }];
}

function emptySections(): TopicSection[] {
  return topicSectionTypes.map((type) => ({type, label: sectionLabels[type], items: []}));
}

function normalizeTaxonomy(value: unknown): TopicTaxonomyEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => isRecord(item) && asString(item.id) && asString(item.label)
    ? [{id: asString(item.id), label: asString(item.label)}]
    : []);
}

function warnForDuplicates(topics: Topic[], key: 'id' | 'slug', code: string, warnings: TopicValidationWarning[]): void {
  for (const value of duplicateValues(topics.map((topic) => topic[key]))) {
    warnings.push(warning(code, `Topic Registry 存在重复 ${key}: ${value}。`, key === 'id' ? value : undefined));
  }
}

function duplicateValues(values: string[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) seen.has(value) ? duplicates.add(value) : seen.add(value);
  return duplicates;
}

function warning(code: string, message: string, topicId?: string): TopicValidationWarning {
  return {code, message, topicId};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
