import {readFile, readdir} from 'node:fs/promises';
import {resolve, sep} from 'node:path';

import {validateManifestUniqueness, validateTopicManifest, type TopicManifest} from '../lib/foundation/topic-manifest.ts';
import {validateTopicRegistry} from '../lib/foundation/topic-registry.ts';

const registryPath = resolve(process.cwd(), 'config/foundation/topic-registry.v1.json');

async function main(): Promise<void> {
  let input: unknown;
  try {
    input = JSON.parse(await readFile(registryPath, 'utf8')) as unknown;
  } catch (error) {
    input = {topics: [], repositoryWarning: error instanceof Error ? error.message : String(error)};
  }

  const result = validateTopicRegistry(input);
  const warnings = [...result.warnings];
  const knownObjectIds = await readFoundationObjectIds(result.foundationIndex, warnings);
  const discoveredPaths = await discoverManifestPaths(result.manifestRoot, warnings);
  const registeredPaths = new Set(result.manifestPaths);
  const manifestPaths = [...new Set([...result.manifestPaths, ...discoveredPaths])];
  const manifests: TopicManifest[] = [];

  for (const manifestPath of manifestPaths) {
    if (!registeredPaths.has(manifestPath)) {
      warnings.push({code: 'UNREGISTERED_MANIFEST', message: `Topic Manifest ${manifestPath} 尚未进入正式 Release Registry。`});
    }
    try {
      const source = await readFile(resolveRepositoryPath(manifestPath), 'utf8');
      const validation = validateTopicManifest(JSON.parse(source) as unknown, knownObjectIds);
      warnings.push(...validation.warnings);
      if (validation.manifest) manifests.push(validation.manifest);
    } catch (error) {
      warnings.push({code: 'MANIFEST_READ_FAILED', message: `Topic Manifest ${manifestPath} 读取失败：${error instanceof Error ? error.message : String(error)}`});
    }
  }

  warnings.push(...validateManifestUniqueness(manifests));
  console.log(`Topic Manifest Validation: ${manifests.length} valid manifest(s), ${result.manifestPaths.length} registered, ${warnings.length} warning(s)`);
  for (const item of warnings) console.warn(`[${item.code}] ${item.message}`);
}

async function readFoundationObjectIds(indexPath: string, warnings: Array<{code: string; message: string}>): Promise<Set<string>> {
  try {
    const source = JSON.parse(await readFile(resolveRepositoryPath(indexPath), 'utf8')) as {objects?: Array<{id?: string}>};
    return new Set((source.objects ?? []).flatMap((item) => typeof item.id === 'string' ? [item.id] : []));
  } catch (error) {
    warnings.push({code: 'FOUNDATION_INDEX_READ_FAILED', message: `Foundation Index 读取失败：${error instanceof Error ? error.message : String(error)}`});
    return new Set();
  }
}

async function discoverManifestPaths(manifestRoot: string, warnings: Array<{code: string; message: string}>): Promise<string[]> {
  try {
    const entries = await readdir(resolveRepositoryPath(manifestRoot), {withFileTypes: true});
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => `${manifestRoot}/${entry.name}`);
  } catch (error) {
    warnings.push({code: 'MANIFEST_ROOT_READ_FAILED', message: `Manifest 目录读取失败：${error instanceof Error ? error.message : String(error)}`});
    return [];
  }
}

function resolveRepositoryPath(filePath: string): string {
  const root = resolve(process.cwd());
  const absolutePath = resolve(root, filePath);
  if (!absolutePath.startsWith(`${root}${sep}`)) throw new Error(`Path escapes repository: ${filePath}`);
  return absolutePath;
}

await main();
