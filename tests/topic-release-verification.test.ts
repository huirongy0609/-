import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import test from 'node:test';

import {filterTopics} from '../lib/beta/topic-query.ts';
import {isWebsiteReadyTopic, validateTopicRegistry} from '../lib/foundation/topic-registry.ts';

const releasedFixture = 'tests/fixtures/topic-release-record.mock.json';
const withdrawnFixture = 'tests/fixtures/topic-release-record-withdrawn.mock.json';

async function loadJson(path: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(resolve(process.cwd(), path), 'utf8')) as Record<string, unknown>;
}

test('keeps validation records outside the formal Foundation Topic Registry', async () => {
  const formal = validateTopicRegistry(await loadJson('config/foundation/topic-registry.v1.json'));
  const fixture = await loadJson(releasedFixture);

  assert.equal(formal.topics.length, 0);
  assert.deepEqual(formal.manifestPaths, ['foundation/topic-manifests/topic001.json']);
  assert.equal(fixture.verificationOnly, true);
  assert.match(String(fixture.notice), /not formal Foundation data/);
});

test('approved Website Ready Release Record exits fallback and drives Website views', async () => {
  const registry = validateTopicRegistry(await loadJson(releasedFixture));
  const visible = registry.topics.filter(isWebsiteReadyTopic);

  assert.equal(registry.topics.length, 1, 'a non-empty Registry prevents beta_fallback');
  assert.equal(visible.length, 1, 'Home, Topic List and Topic Detail receive the released Topic');
  assert.equal(visible[0].slug, 'eng-024b-release-verification');
  assert.equal(`/topics/${visible[0].slug}`, '/topics/eng-024b-release-verification');
  assert.deepEqual(filterTopics(visible, {q: '发布验证'}).map((topic) => topic.id), ['MOCK-TOPIC-ENG-024B']);
  assert.deepEqual(filterTopics(visible, {q: 'Release Record'}).map((topic) => topic.id), ['MOCK-TOPIC-ENG-024B']);
});

test('withdrawal keeps the Release Record but removes it from Website and Search', async () => {
  const registry = validateTopicRegistry(await loadJson(withdrawnFixture));
  const visible = registry.topics.filter(isWebsiteReadyTopic);

  assert.equal(registry.topics.length, 1, 'rollback must not delete the Release Record');
  assert.equal(registry.topics[0].status, 'archived');
  assert.equal(visible.length, 0, 'Website hides an archived Topic');
  assert.equal(filterTopics(visible, {q: '发布验证'}).length, 0, 'Repository Search removes an archived Topic');
});
