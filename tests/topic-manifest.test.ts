import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import test from 'node:test';

import {
  isWebsiteReadyManifest,
  validateManifestUniqueness,
  validateTopicManifest,
} from '../lib/foundation/topic-manifest.ts';
import {loadTopicManifestCatalog} from '../lib/foundation/topic-manifest-loader.ts';
import {isWebsiteReadyTopic, validateTopicRegistry} from '../lib/foundation/topic-registry.ts';

async function loadJson(filePath: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(resolve(process.cwd(), filePath), 'utf8')) as Record<string, unknown>;
}

test('formal Release Registry stores Manifest paths and keeps draft Topic001 unregistered', async () => {
  const registry = validateTopicRegistry(await loadJson('config/foundation/topic-registry.v1.json'));
  const topic001 = validateTopicManifest(await loadJson('foundation/topic-manifests/topic001.json'));

  assert.equal(registry.manifestPaths.length, 0);
  assert.equal(registry.topics.length, 0);
  assert.equal(topic001.manifest?.releaseStatus, 'draft');
  assert.equal(topic001.manifest?.websiteStatus, 'hidden');
  assert.equal(isWebsiteReadyManifest(topic001.manifest!), false);
});

test('Mock Manifest runs Registry → Repository adapter → Website contract without entering formal Registry', async () => {
  const mockRegistry = validateTopicRegistry(await loadJson('tests/fixtures/topic-release-registry.mock.json'));
  const loaded = await loadTopicManifestCatalog(mockRegistry.manifestPaths, {readManifest: loadJson});

  assert.equal(mockRegistry.manifestPaths[0], 'tests/fixtures/topic-manifest.mock.json');
  assert.equal(loaded.warnings.some((item) => item.code === 'MISSING_OBJECTS'), true);
  assert.equal(isWebsiteReadyManifest(loaded.manifests[0]), true);
  const topic = loaded.topics[0];
  assert.equal(isWebsiteReadyTopic(topic), true);
  assert.equal(topic.slug, 'eng-025-manifest-verification');
});

test('Manifest validation reports invalid state, empty title, duplicate objects and missing Release Record as warnings', () => {
  const validation = validateTopicManifest({
    id: 'topic-warning',
    slug: 'topic-warning',
    title: '',
    releaseStatus: 'published',
    foundationStatus: 'ready',
    websiteStatus: 'public',
    releaseRecord: '',
    objects: ['JD001', 'JD001', 'MISSING-JD'],
  }, new Set(['JD001']));

  const codes = new Set(validation.warnings.map((item) => item.code));
  assert.equal(validation.manifest, null);
  assert.equal(codes.has('EMPTY_TITLE'), true);
  assert.equal(codes.has('INVALID_RELEASE_STATUS'), true);
  assert.equal(codes.has('DUPLICATE_OBJECT'), true);
  assert.equal(codes.has('MISSING_OBJECT'), true);
  assert.equal(codes.has('MISSING_RELEASE_RECORD'), true);
});

test('Manifest collection warns about duplicate slug without throwing', () => {
  const first = validateTopicManifest({id: 'topic-a', slug: 'duplicate-slug', title: 'A', releaseStatus: 'draft', foundationStatus: 'in_review', websiteStatus: 'hidden', releaseRecord: 'AR-A', objects: ['JD001']}).manifest!;
  const second = validateTopicManifest({id: 'topic-b', slug: 'duplicate-slug', title: 'B', releaseStatus: 'draft', foundationStatus: 'in_review', websiteStatus: 'hidden', releaseRecord: 'AR-B', objects: ['JD002']}).manifest!;

  assert.equal(validateManifestUniqueness([first, second]).some((item) => item.code === 'DUPLICATE_SLUG'), true);
});
