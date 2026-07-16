import type {KnowledgeObjectType} from '@/lib/foundation/types';

export const websiteObjectTypes = [
  'JD',
  'GT_PACKAGE',
  'CASE',
  'LAW',
  'FAQ',
  'RESEARCH',
] as const;

export type WebsiteObjectType = (typeof websiteObjectTypes)[number];

export type WebsiteFoundationObject = {
  id: string;
  type: WebsiteObjectType;
  title: string;
  version: string | null;
  sources: string[];
  updatedAt: string | null;
  relationshipCount: number;
  packageMemberCount: number;
};

export type WebsiteObjectQuery = {
  q?: string;
  type?: string;
  source?: string;
  sort?: string;
};

export const websiteTypeLabels: Record<WebsiteObjectType, string> = {
  JD: '治理词典',
  GT_PACKAGE: '治理标准包',
  CASE: '案例',
  LAW: '法律法规',
  FAQ: '常见问题',
  RESEARCH: '研究',
};

export function isWebsiteObjectType(value: KnowledgeObjectType): value is WebsiteObjectType {
  return websiteObjectTypes.includes(value as WebsiteObjectType);
}

export function filterWebsiteObjects(
  objects: WebsiteFoundationObject[],
  query: WebsiteObjectQuery,
  allowedTypes: readonly WebsiteObjectType[],
): WebsiteFoundationObject[] {
  const normalizedQuery = query.q?.trim().toLocaleLowerCase('zh-CN') ?? '';
  const requestedType = allowedTypes.includes(query.type as WebsiteObjectType)
    ? query.type as WebsiteObjectType
    : null;

  return objects
    .filter((object) => allowedTypes.includes(object.type))
    .filter((object) => !requestedType || object.type === requestedType)
    .filter((object) => !query.source || object.sources.includes(query.source))
    .filter((object) => {
      if (!normalizedQuery) return true;
      return [object.id, object.title, object.type, ...object.sources]
        .join(' ')
        .toLocaleLowerCase('zh-CN')
        .includes(normalizedQuery);
    })
    .sort(objectSorter(query.sort));
}

export function paginateWebsiteObjects<T>(
  items: T[],
  requestedPage: string | undefined,
  pageSize = 9,
): {items: T[]; page: number; pageCount: number; total: number} {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const parsedPage = Number.parseInt(requestedPage ?? '1', 10);
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), pageCount) : 1;
  const offset = (page - 1) * pageSize;

  return {
    items: items.slice(offset, offset + pageSize),
    page,
    pageCount,
    total: items.length,
  };
}

function objectSorter(sort?: string): (left: WebsiteFoundationObject, right: WebsiteFoundationObject) => number {
  if (sort === 'title') {
    return (left, right) => left.title.localeCompare(right.title, 'zh-CN');
  }
  if (sort === 'updated') {
    return (left, right) => (right.updatedAt ?? '').localeCompare(left.updatedAt ?? '')
      || left.id.localeCompare(right.id, 'en', {numeric: true});
  }
  return (left, right) => left.id.localeCompare(right.id, 'en', {numeric: true});
}
