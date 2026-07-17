import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import test from 'node:test';

import {filterTopics} from '../lib/beta/topic-query.ts';
import {topicSectionTypes, type TopicCatalog} from '../lib/beta/types.ts';

async function catalog(): Promise<TopicCatalog> {
  return JSON.parse(await readFile(resolve(process.cwd(), 'data/beta-topics.json'), 'utf8')) as TopicCatalog;
}

test('loads an explicitly labelled beta fallback catalog', async () => {
  const data = await catalog();
  assert.equal(data.provider, 'beta_fallback');
  assert.equal(data.schemaVersion, 'beta-1');
  assert.equal(data.topics.length, 3);
});

test('filters topics by keyword, stable category id, and stable tag id', async () => {
  const data = await catalog();
  assert.deepEqual(filterTopics(data.topics, {q: 'JD003'}).map((topic) => topic.id), ['P0-01']);
  assert.deepEqual(filterTopics(data.topics, {category: 'funds'}).map((topic) => topic.id), ['P0-05']);
  assert.deepEqual(filterTopics(data.topics, {tag: 'common-entrustment'}).map((topic) => topic.id), ['P0-02']);
});

test('keeps the six Topic Detail sections in the approved reading order', async () => {
  const data = await catalog();
  for (const topic of data.topics) {
    assert.deepEqual(topic.sections.map((section) => section.type), topicSectionTypes);
  }
});

test('never links in-review references as public detail pages', async () => {
  const data = await catalog();
  const references = data.topics.flatMap((topic) => topic.sections.flatMap((section) => section.items));
  assert.equal(references.filter((item) => item.status === 'in_review').every((item) => !item.href), true);
  assert.equal(references.filter((item) => item.status === 'approved').every((item) => item.href?.startsWith('/knowledge/')), true);
});
