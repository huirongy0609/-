import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import test from 'node:test';

import {
  isWebsiteReadyTopic,
  validateTopicRegistry,
} from '../lib/foundation/topic-registry.ts';

test('loads the formal Topic001 Manifest path without legacy inline Topic records', async () => {
  const source = await readFile(resolve(process.cwd(), 'config/foundation/topic-registry.v1.json'), 'utf8');
  const result = validateTopicRegistry(JSON.parse(source) as unknown);

  assert.equal(result.foundationIndex, 'knowledge/foundation/index.json');
  assert.deepEqual(result.manifestPaths, ['foundation/topic-manifests/topic001.json']);
  assert.equal(result.topics.length, 0);
  assert.equal(result.warnings.some((item) => item.code === 'EMPTY_REGISTRY'), false);
});

test('normalizes the compatible Topic model and exposes only approved Website Ready records', () => {
  const result = validateTopicRegistry({
    schemaVersion: '1.0',
    topics: [{
      id: 'TOPIC-001',
      slug: 'registered-topic',
      title: 'Registered Topic',
      subtitle: 'Subtitle',
      summary: 'Summary',
      status: 'approved',
      releaseLevel: 'Website Ready',
      sections: [],
      evidence: [{id: 'EV-001', label: 'Evidence'}],
      updatedAt: '2026-07-17',
      keywords: ['keyword'],
    }],
  });

  assert.equal(result.topics.length, 1);
  assert.equal(result.topics[0].subtitle, 'Subtitle');
  assert.equal(result.topics[0].sections.length, 6);
  assert.equal(result.topics[0].evidence.length, 1);
  assert.equal(isWebsiteReadyTopic(result.topics[0]), true);
});

test('downgrades invalid states to Candidate warnings instead of throwing', () => {
  const result = validateTopicRegistry({
    topics: [{id: 'TOPIC-002', slug: 'invalid-state', title: 'Invalid State', status: 'published', releaseLevel: 'Public'}],
  });

  assert.equal(result.topics[0].status, 'draft');
  assert.equal(result.topics[0].releaseLevel, 'Candidate');
  assert.equal(isWebsiteReadyTopic(result.topics[0]), false);
  assert.equal(result.warnings.some((item) => item.code === 'INVALID_STATUS'), true);
  assert.equal(result.warnings.some((item) => item.code === 'INVALID_RELEASE_LEVEL'), true);
  assert.equal(result.warnings.some((item) => item.code === 'MISSING_SECTIONS'), true);
});

test('skips malformed and duplicate registry records without crashing the Website', () => {
  const result = validateTopicRegistry({
    topics: [
      {id: 'TOPIC-003', slug: 'duplicate', title: 'First', status: 'approved', releaseLevel: 'Website Ready', sections: []},
      {id: 'TOPIC-003', slug: 'duplicate-two', title: 'Second', status: 'approved', releaseLevel: 'Website Ready', sections: []},
      {id: 'TOPIC-004', slug: '', title: '', status: 'draft', releaseLevel: 'Candidate'},
    ],
  });

  assert.equal(result.topics.length, 0);
  assert.equal(result.warnings.some((item) => item.code === 'DUPLICATE_ID'), true);
  assert.equal(result.warnings.some((item) => item.code === 'MISSING_SLUG'), true);
  assert.equal(result.warnings.some((item) => item.code === 'MISSING_TITLE'), true);
});
