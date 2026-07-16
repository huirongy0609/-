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

export const websiteTypeDescriptions: Record<WebsiteObjectType, string> = {
  JD: '理解信托制物业的基础概念与治理语言。',
  GT_PACKAGE: '查看由规则、方法、原则与证据组成的治理标准包。',
  CASE: '通过已登记实践理解治理机制如何落地。',
  LAW: '查找知识对象关联的法律法规与适用依据。',
  FAQ: '从真实问题进入已经批准的权威知识。',
  RESEARCH: '浏览专题研究、行业观察与长期研究成果。',
};

export function countWebsiteObjectsByType(
  objects: WebsiteFoundationObject[],
): Record<WebsiteObjectType, number> {
  const counts = Object.fromEntries(websiteObjectTypes.map((type) => [type, 0])) as Record<WebsiteObjectType, number>;
  for (const object of objects) counts[object.type] += 1;
  return counts;
}

export function getWebsiteObjectHref(object: Pick<WebsiteFoundationObject, 'id' | 'type'>): string {
  const id = object.id.toLocaleLowerCase('en');
  switch (object.type) {
    case 'GT_PACKAGE': return `/standards/${id}`;
    case 'CASE': return `/cases/${id}`;
    case 'LAW': return `/laws/${id}`;
    case 'FAQ': return `/faq/${id}`;
    case 'RESEARCH': return `/research/${id}`;
    case 'JD': return `/knowledge/${id}`;
  }
}

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
