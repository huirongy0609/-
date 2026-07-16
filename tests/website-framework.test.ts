import assert from 'node:assert/strict';
import test from 'node:test';

import {
  countWebsiteObjectsByType,
  filterWebsiteObjects,
  getWebsiteObjectHref,
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

test('derives Knowledge Center category counts from Foundation view objects', () => {
  assert.deepEqual(countWebsiteObjectsByType(fixtures), {
    JD: 1,
    GT_PACKAGE: 1,
    CASE: 0,
    LAW: 0,
    FAQ: 0,
    RESEARCH: 0,
  });
});

test('links every website object type to its frozen canonical collection', () => {
  assert.equal(getWebsiteObjectHref(fixtures[0]), '/knowledge/jd001');
  assert.equal(getWebsiteObjectHref(fixtures[1]), '/standards/gt-p001');
  assert.equal(getWebsiteObjectHref({...fixtures[0], id: 'CASE-001', type: 'CASE'}), '/cases/case-001');
  assert.equal(getWebsiteObjectHref({...fixtures[0], id: 'LAW-001', type: 'LAW'}), '/laws/law-001');
  assert.equal(getWebsiteObjectHref({...fixtures[0], id: 'FAQ-001', type: 'FAQ'}), '/faq/faq-001');
  assert.equal(getWebsiteObjectHref({...fixtures[0], id: 'RESEARCH-001', type: 'RESEARCH'}), '/research/research-001');
});
