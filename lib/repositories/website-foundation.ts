import 'server-only';

import {cache} from 'react';
import {buildKnowledgeRegistry} from '@/lib/foundation/registry-engine';
import {getKnowledgeObjects} from '@/lib/repositories/knowledge-objects';
import {
  isWebsiteObjectType,
  type WebsiteObjectType,
  type WebsiteFoundationObject,
} from '@/lib/website/foundation-view-model';

export const getPublicWebsiteObjects = cache(async (): Promise<WebsiteFoundationObject[]> => {
  const [registry, localObjects] = await Promise.all([
    buildKnowledgeRegistry(process.cwd()),
    getKnowledgeObjects(),
  ]);

  const foundationObjects = registry.objects
    .filter((object) => object.status === 'approved' && object.foundation_ready)
    .flatMap((object) => isWebsiteObjectType(object.object_type) ? [{
        id: object.object_id,
        type: object.object_type,
        title: object.title,
        version: object.version,
        sources: object.source,
        updatedAt: object.updated_at,
        relationshipCount: object.relationships.length,
        packageMemberCount: object.children.length,
        definition: object.definition,
        summary: object.summary,
        keywords: object.keywords,
        category: object.category,
        chapter: object.chapter,
        legalBasis: object.legal_basis,
        publishedAt: object.published_at,
        questions: object.questions,
        filePath: object.file_path,
        relatedIds: object.relationships.map((relationship) => relationship.target_object_id),
      }] : []);

  const dataObjects: WebsiteFoundationObject[] = localObjects
    .filter((object) => object.status === 'Approved')
    .map((object) => ({
      id: object.id,
      type: toWebsiteType(object.type),
      title: object.title,
      version: object.version,
      sources: object.references,
      updatedAt: object.updatedAt,
      relationshipCount: object.relatedIds.length || object.references.length,
      packageMemberCount: 0,
      definition: object.definition,
      summary: object.summary,
      keywords: object.tags,
      category: object.category,
      chapter: object.chapter,
      legalBasis: object.legalBasis,
      publishedAt: object.publishedAt,
      questions: object.questions,
      filePath: null,
      relatedIds: object.relatedIds.length ? object.relatedIds : object.references,
    }));

  const byIdentity = new Map<string, WebsiteFoundationObject>();
  for (const object of [...foundationObjects, ...dataObjects]) {
    const key = `${object.type}:${object.id.toLowerCase()}`;
    if (!byIdentity.has(key)) byIdentity.set(key, object);
  }
  return [...byIdentity.values()].sort((left, right) => left.id.localeCompare(right.id, 'en', {numeric: true}));
});

function toWebsiteType(type: 'JD' | 'GT' | 'QA' | 'Article'): WebsiteObjectType {
  if (type === 'QA') return 'FAQ';
  if (type === 'Article') return 'ARTICLE';
  return type;
}
