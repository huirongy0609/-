import {
  topicFromManifest,
  validateManifestUniqueness,
  validateTopicManifest,
  type TopicManifest,
} from './topic-manifest.ts';
import type {Topic, TopicValidationWarning} from '../beta/types.ts';

type ManifestObjectView = {
  id: string;
  title: string;
  href?: string;
};

export type TopicManifestLoadOptions = {
  readManifest: (manifestPath: string) => Promise<unknown>;
  knownObjectIds?: ReadonlySet<string>;
  objectViews?: ReadonlyMap<string, ManifestObjectView>;
};

export type TopicManifestLoadResult = {
  manifests: TopicManifest[];
  topics: Topic[];
  warnings: TopicValidationWarning[];
};

/** Shared Manifest adapter used by Repository and release-simulation tests. */
export async function loadTopicManifestCatalog(
  manifestPaths: string[],
  options: TopicManifestLoadOptions,
): Promise<TopicManifestLoadResult> {
  const manifests: TopicManifest[] = [];
  const warnings: TopicValidationWarning[] = [];

  for (const manifestPath of manifestPaths) {
    try {
      const validation = validateTopicManifest(
        await options.readManifest(manifestPath),
        options.knownObjectIds,
      );
      warnings.push(...validation.warnings);
      if (validation.manifest) manifests.push(validation.manifest);
    } catch (error) {
      warnings.push({
        code: 'MANIFEST_READ_FAILED',
        message: `Topic Manifest ${manifestPath} 读取失败：${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  warnings.push(...validateManifestUniqueness(manifests));
  const duplicateIds = duplicateValues(manifests.map((manifest) => manifest.id));
  const duplicateSlugs = duplicateValues(manifests.map((manifest) => manifest.slug));
  const validManifests = manifests.filter((manifest) => !duplicateIds.has(manifest.id) && !duplicateSlugs.has(manifest.slug));

  return {
    manifests: validManifests,
    topics: validManifests.map((manifest) => topicFromManifest(manifest, options.objectViews)),
    warnings,
  };
}

function duplicateValues(values: string[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) seen.has(value) ? duplicates.add(value) : seen.add(value);
  return duplicates;
}
