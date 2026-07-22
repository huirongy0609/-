import {
  topicSectionTypes,
  type Topic,
  type TopicEvidence,
  type TopicReference,
  type TopicSection,
  type TopicSectionType,
  type TopicValidationWarning,
} from '../beta/types.ts';

export const topicManifestReleaseStatuses = [
  'draft',
  'foundation_ready',
  'website_ready',
  'archived',
] as const;

export const topicManifestFoundationStatuses = [
  'in_review',
  'foundation_ready',
  'archived',
] as const;

export const topicManifestWebsiteStatuses = ['hidden', 'website_ready', 'archived'] as const;

export type TopicManifestReleaseStatus = (typeof topicManifestReleaseStatuses)[number];
export type TopicManifestFoundationStatus = (typeof topicManifestFoundationStatuses)[number];
export type TopicManifestWebsiteStatus = (typeof topicManifestWebsiteStatuses)[number];

export type TopicManifest = {
  schemaVersion: string;
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  releaseStatus: TopicManifestReleaseStatus;
  foundationStatus: TopicManifestFoundationStatus;
  websiteStatus: TopicManifestWebsiteStatus;
  version: string;
  releaseRecord: string;
  updatedAt: string;
  objects: string[];
  categoryId: string;
  tagIds: string[];
  keywords: string[];
  popularity: number;
  evidence: TopicEvidence[];
};

export type TopicManifestValidation = {
  manifest: TopicManifest | null;
  warnings: TopicValidationWarning[];
};

type ManifestObjectView = {
  id: string;
  title: string;
  href?: string;
};

const sectionLabels: Record<TopicSectionType, string> = {
  JD: '治理词典',
  GT: '治理标准',
  FAQ: '常见问题',
  LAW: '法律依据',
  CASE: '实践案例',
  RESEARCH: '专题研究',
};

export function validateTopicManifest(
  input: unknown,
  knownObjectIds: ReadonlySet<string> = new Set(),
): TopicManifestValidation {
  const warnings: TopicValidationWarning[] = [];
  const root = isRecord(input) ? input : {};
  if (!isRecord(input)) warnings.push(warning('INVALID_MANIFEST', 'Topic Manifest 必须是 JSON object。'));

  const id = asString(root.id);
  const slug = asString(root.slug);
  const title = asString(root.title);
  if (!id) warnings.push(warning('MISSING_ID', 'Topic Manifest 缺少 id。'));
  if (!slug) warnings.push(warning('MISSING_SLUG', `Topic Manifest ${id || '(unknown)'} 缺少 slug。`, id));
  if (!title) warnings.push(warning('EMPTY_TITLE', `Topic Manifest ${id || '(unknown)'} 的 title 为空。`, id));

  const releaseStatus = normalizeEnum(
    root.releaseStatus,
    topicManifestReleaseStatuses,
    'draft',
    'INVALID_RELEASE_STATUS',
    id,
    warnings,
  );
  const foundationStatus = normalizeEnum(
    root.foundationStatus,
    topicManifestFoundationStatuses,
    'in_review',
    'INVALID_FOUNDATION_STATUS',
    id,
    warnings,
  );
  const websiteStatus = normalizeEnum(
    root.websiteStatus,
    topicManifestWebsiteStatuses,
    'hidden',
    'INVALID_WEBSITE_STATUS',
    id,
    warnings,
  );

  const rawObjects = Array.isArray(root.objects) ? root.objects : [];
  if (!Array.isArray(root.objects) || rawObjects.length === 0) {
    warnings.push(warning('MISSING_OBJECTS', `Topic Manifest ${id || '(unknown)'} 没有登记 objects。`, id));
  }
  const objects = rawObjects.flatMap((item) => typeof item === 'string' && item.trim() ? [item.trim()] : []);
  for (const objectId of duplicateValues(objects)) {
    warnings.push(warning('DUPLICATE_OBJECT', `Topic Manifest ${id || '(unknown)'} 重复引用对象 ${objectId}。`, id));
  }
  const uniqueObjects = [...new Set(objects)];
  if (knownObjectIds.size > 0) {
    for (const objectId of uniqueObjects) {
      if (!knownObjectIds.has(objectId)) {
        warnings.push(warning('MISSING_OBJECT', `Topic Manifest ${id || '(unknown)'} 引用的对象 ${objectId} 未进入 Foundation Registry。`, id));
      }
    }
  }

  const releaseRecord = asString(root.releaseRecord);
  if (!releaseRecord) warnings.push(warning('MISSING_RELEASE_RECORD', `Topic Manifest ${id || '(unknown)'} 缺少 Release Record。`, id));
  if (releaseStatus === 'website_ready' && (foundationStatus !== 'foundation_ready' || websiteStatus !== 'website_ready')) {
    warnings.push(warning('INCONSISTENT_RELEASE_STATUS', `Topic Manifest ${id || '(unknown)'} 标记 website_ready，但 Foundation 或 Website 状态未就绪。`, id));
  }

  if (!id || !slug || !title) return {manifest: null, warnings};

  return {
    manifest: {
      schemaVersion: asString(root.schemaVersion) || '1.0',
      id,
      slug,
      title,
      subtitle: asString(root.subtitle),
      summary: asString(root.summary),
      releaseStatus,
      foundationStatus,
      websiteStatus,
      version: asString(root.version) || '1.0.0',
      releaseRecord,
      updatedAt: asString(root.updatedAt),
      objects: uniqueObjects,
      categoryId: asString(root.categoryId),
      tagIds: stringArray(root.tagIds),
      keywords: stringArray(root.keywords),
      popularity: typeof root.popularity === 'number' && Number.isFinite(root.popularity) ? root.popularity : 0,
      evidence: normalizeEvidence(root.evidence),
    },
    warnings,
  };
}

export function validateManifestUniqueness(manifests: TopicManifest[]): TopicValidationWarning[] {
  const warnings: TopicValidationWarning[] = [];
  for (const id of duplicateValues(manifests.map((manifest) => manifest.id))) {
    warnings.push(warning('DUPLICATE_ID', `Topic Manifest 存在重复 id: ${id}。`, id));
  }
  for (const slug of duplicateValues(manifests.map((manifest) => manifest.slug))) {
    warnings.push(warning('DUPLICATE_SLUG', `Topic Manifest 存在重复 slug: ${slug}。`));
  }
  return warnings;
}

export function isWebsiteReadyManifest(manifest: TopicManifest): boolean {
  return manifest.releaseStatus === 'website_ready'
    && manifest.foundationStatus === 'foundation_ready'
    && manifest.websiteStatus === 'website_ready';
}

export function topicFromManifest(
  manifest: TopicManifest,
  objectViews: ReadonlyMap<string, ManifestObjectView> = new Map(),
): Topic {
  const websiteReady = isWebsiteReadyManifest(manifest);
  const sections = emptySections();
  for (const objectId of manifest.objects) {
    const type = inferSectionType(objectId);
    if (!type) continue;
    const view = objectViews.get(objectId);
    const reference: TopicReference = {
      id: objectId,
      title: view?.title || objectId,
      status: view ? 'approved' : 'in_review',
      href: view?.href,
    };
    sections.find((section) => section.type === type)?.items.push(reference);
  }

  return {
    id: manifest.id,
    slug: manifest.slug,
    title: manifest.title,
    subtitle: manifest.subtitle,
    summary: manifest.summary,
    status: manifest.releaseStatus === 'archived' ? 'archived' : manifest.releaseStatus === 'draft' ? 'draft' : 'approved',
    releaseLevel: websiteReady
      ? 'Website Ready'
      : manifest.releaseStatus === 'foundation_ready' ? 'Foundation Ready' : 'Candidate',
    sections,
    evidence: manifest.evidence,
    updatedAt: manifest.updatedAt,
    categoryId: manifest.categoryId,
    tagIds: manifest.tagIds,
    keywords: manifest.keywords,
    popularity: manifest.popularity,
  };
}

function inferSectionType(objectId: string): TopicSectionType | null {
  const normalized = objectId.toUpperCase();
  return topicSectionTypes.find((type) => normalized === type || normalized.startsWith(`${type}-`)
    || normalized.includes(`-${type}-`) || normalized.match(new RegExp(`^${type}\\d`))) ?? null;
}

function emptySections(): TopicSection[] {
  return topicSectionTypes.map((type) => ({type, label: sectionLabels[type], items: []}));
}

function normalizeEvidence(value: unknown): TopicEvidence[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => isRecord(item) && asString(item.id) && asString(item.label)
    ? [{id: asString(item.id), label: asString(item.label), source: asString(item.source) || undefined}]
    : []);
}

function normalizeEnum<const T extends readonly string[]>(
  value: unknown,
  values: T,
  fallback: T[number],
  code: string,
  topicId: string,
  warnings: TopicValidationWarning[],
): T[number] {
  if (typeof value === 'string' && values.includes(value as T[number])) return value as T[number];
  warnings.push(warning(code, `Topic Manifest ${topicId || '(unknown)'} 的状态 ${String(value || '(empty)')} 非法，已按 ${fallback} 处理。`, topicId));
  return fallback;
}

function duplicateValues(values: string[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) seen.has(value) ? duplicates.add(value) : seen.add(value);
  return duplicates;
}

function warning(code: string, message: string, topicId?: string): TopicValidationWarning {
  return {code, message, topicId: topicId || undefined};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())).map((item) => item.trim()) : [];
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
