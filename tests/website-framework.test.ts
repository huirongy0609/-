import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterWebsiteObjects,
  paginateWebsiteObjects,
  type WebsiteFoundationObject,
} from '../lib/website/foundation-view-model.ts';

const fixtures: WebsiteFoundationObject[] = [
  {
    id: 'JD001',
    type: 'JD',
    title: 'Definition One',
    version: 'V1.0',
    sources: ['foundation-index'],
    updatedAt: '2026-01-01',
    relationshipCount: 1,
    packageMemberCount: 0,
  },
  {
    id: 'GT-P001',
    type: 'GT_PACKAGE',
    title: 'Package One',
    version: 'V1.0',
    sources: ['foundation-index'],
    updatedAt: '2026-02-01',
    relationshipCount: 2,
    packageMemberCount: 4,
  },
];

test('filters the website view by approved object type contract without changing source records', () => {
  const result = filterWebsiteObjects(fixtures, {type: 'GT_PACKAGE'}, ['JD', 'GT_PACKAGE']);
  assert.deepEqual(result.map((item) => item.id), ['GT-P001']);
  assert.equal(fixtures.length, 2);
});

test('searches stable identity metadata and registered source fields', () => {
  assert.deepEqual(
    filterWebsiteObjects(fixtures, {q: 'jd001'}, ['JD', 'GT_PACKAGE']).map((item) => item.id),
    ['JD001'],
  );
  assert.equal(filterWebsiteObjects(fixtures, {source: 'foundation-index'}, ['JD']).length, 1);
});

test('clamps pagination to a valid page without hardcoded result counts', () => {
  const result = paginateWebsiteObjects(fixtures, '9', 1);
  assert.equal(result.page, 2);
  assert.equal(result.pageCount, 2);
  assert.deepEqual(result.items.map((item) => item.id), ['GT-P001']);
});
