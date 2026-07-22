import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import {parseMarkdownMetadata} from '@/lib/foundation/metadata-parser';
import {getKnowledgeObjects} from '@/lib/repositories/knowledge-objects';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import type {WebsiteFoundationObject, WebsiteObjectType} from '@/lib/website/foundation-view-model';

export const geoContentTypes = ['JD', 'GT', 'QA', 'Article'] as const;
export type GeoContentType = (typeof geoContentTypes)[number];

export type PublishedGeoObject = {
  id: string;
  type: GeoContentType;
  title: string;
  summary: string;
  body: string;
  category: string;
  tags: string[];
  version: string | null;
  updatedAt: string | null;
  sources: string[];
  relatedIds: string[];
};

export type RelatedGeoContent = Record<GeoContentType, PublishedGeoObject[]>;

export const geoTypeLabels: Record<GeoContentType, string> = {
  JD: '治理辞典',
  GT: '治理标准',
  QA: '标准问答',
  Article: '文章',
};

export const geoCollectionPaths: Record<GeoContentType, string> = {
  JD: '/knowledge',
  GT: '/standards',
  QA: '/faq',
  Article: '/articles',
};

export function getGeoObjectPath(object: Pick<PublishedGeoObject, 'id' | 'type'>): string {
  return `${geoCollectionPaths[object.type]}/${object.id.toLowerCase()}`;
}

export async function getPublishedGeoObjects(): Promise<PublishedGeoObject[]> {
  const [websiteObjects, localObjects] = await Promise.all([
    getPublicWebsiteObjects(),
    getKnowledgeObjects(),
  ]);
  const approvedLocal = new Map(
    localObjects
      .filter((object) => object.status === 'Approved')
      .map((object) => [`${toGeoType(object.type)}:${object.id.toLowerCase()}`, object] as const),
  );

  return Promise.all(websiteObjects.flatMap((object) => {
    const type = websiteTypeToGeoType(object.type);
    if (!type) return [];
    const local = object.filePath ? undefined : approvedLocal.get(`${type}:${object.id.toLowerCase()}`);
    return [toPublishedObject(object, type, local)];
  }));
}

export async function getPublishedGeoObject(
  type: GeoContentType,
  id: string,
): Promise<PublishedGeoObject | undefined> {
  const objects = await getPublishedGeoObjects();
  return objects.find((object) => object.type === type && object.id.toLowerCase() === id.toLowerCase());
}

export function getRelatedGeoContent(
  current: PublishedGeoObject,
  objects: PublishedGeoObject[],
  limitPerType = 4,
): RelatedGeoContent {
  const relatedIdSet = new Set(current.relatedIds.map((id) => id.toLowerCase()));
  const candidates = objects
    .filter((object) => !(object.type === current.type && object.id.toLowerCase() === current.id.toLowerCase()))
    .map((object) => ({
      object,
      explicit: relatedIdSet.has(object.id.toLowerCase()) ? 1 : 0,
      score: similarityScore(current, object),
    }))
    .sort((left, right) => right.explicit - left.explicit || right.score - left.score || left.object.id.localeCompare(right.object.id, 'en', {numeric: true}));

  return Object.fromEntries(geoContentTypes.map((type) => [
    type,
    candidates.filter((candidate) => candidate.object.type === type).slice(0, limitPerType).map((candidate) => candidate.object),
  ])) as RelatedGeoContent;
}

async function toPublishedObject(
  object: WebsiteFoundationObject,
  type: GeoContentType,
  local?: Awaited<ReturnType<typeof getKnowledgeObjects>>[number],
): Promise<PublishedGeoObject> {
  const source = local?.body ?? await readRegisteredBody(object.filePath);
  const body = parseMarkdownMetadata(source).body.trim();
  const inferredTags = deriveTags(object.title, body, type);
  return {
    id: object.id,
    type,
    title: object.title,
    summary: object.summary?.trim() || local?.summary || extractSummary(body, object.title),
    body,
    category: object.category?.trim() || local?.category || inferCategory(body, type),
    tags: unique([...(object.keywords ?? []), ...(local?.tags ?? []), ...inferredTags]),
    version: object.version,
    updatedAt: object.updatedAt,
    sources: unique(object.sources),
    relatedIds: unique([...(object.relatedIds ?? []), ...(local?.references ?? [])]),
  };
}

async function readRegisteredBody(filePath?: string | null): Promise<string> {
  if (!filePath) return '';
  const root = path.resolve(process.cwd());
  const absolutePath = path.resolve(root, filePath);
  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Registered knowledge path escapes repository: ${filePath}`);
  }
  return fs.readFile(absolutePath, 'utf8');
}

function extractSummary(body: string, title: string): string {
  const lines = body.split(/\r?\n/).map((line) => line.trim());
  const candidate = lines.find((line) => {
    if (line.length < 18 || line === title || /[：:]$/.test(line)) return false;
    return !/^(#|---|[-*]\s|\d+[.、]|[一二三四五六七八九十]+、|【版本信息】)/.test(line);
  });
  const summary = candidate || `${title}的权威知识说明。`;
  return summary.length > 180 ? `${summary.slice(0, 178)}…` : summary;
}

function inferCategory(body: string, type: GeoContentType): string {
  const chapter = body.split(/\r?\n/).map((line) => line.trim()).find((line) => /^第[一二三四五六七八九十百\d]+[篇章]\s*/.test(line));
  return chapter || geoTypeLabels[type];
}

function deriveTags(title: string, body: string, type: GeoContentType): string[] {
  const source = `${title}\n${body}`;
  const vocabulary = ['信托制物业', '信托', '信义义务', '受托关系', '委托人', '受托人', '受益人', '业主共同基金', '预算治理', '社区治理'];
  return [geoTypeLabels[type], ...vocabulary.filter((term) => source.includes(term))].slice(0, 6);
}

function similarityScore(left: PublishedGeoObject, right: PublishedGeoObject): number {
  const leftTags = new Set(left.tags.map((tag) => tag.toLowerCase()));
  const sharedTags = right.tags.filter((tag) => leftTags.has(tag.toLowerCase())).length;
  const sameCategory = left.category === right.category ? 2 : 0;
  const titleOverlap = left.tags.some((tag) => right.title.includes(tag)) ? 1 : 0;
  return sharedTags * 3 + sameCategory + titleOverlap;
}

function websiteTypeToGeoType(type: WebsiteObjectType): GeoContentType | null {
  if (type === 'JD') return 'JD';
  if (type === 'GT' || type === 'GT_PACKAGE') return 'GT';
  if (type === 'FAQ') return 'QA';
  if (type === 'ARTICLE') return 'Article';
  return null;
}

function toGeoType(type: 'JD' | 'GT' | 'QA' | 'Article'): GeoContentType {
  return type;
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
