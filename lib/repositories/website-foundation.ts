import 'server-only';

import {cache} from 'react';
import {buildKnowledgeRegistry} from '@/lib/foundation/registry-engine';
import {
  isWebsiteObjectType,
  type WebsiteFoundationObject,
} from '@/lib/website/foundation-view-model';

export const getPublicWebsiteObjects = cache(async (): Promise<WebsiteFoundationObject[]> => {
  const registry = await buildKnowledgeRegistry(process.cwd());

  return registry.objects
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
      }] : []);
});
