import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import test from 'node:test';

import {extractKnowledgeCenterFields} from '../lib/knowledge-center/markdown.ts';
import {resolvePublishedRelatedTopics} from '../lib/knowledge-center/relationships.ts';

test('declares the Knowledge Center V1 fields in the Foundation metadata schema', async () => {
  const schema = JSON.parse(
    await readFile(resolve(process.cwd(), 'config/foundation/knowledge-object.schema.v1.json'), 'utf8'),
  ) as {
    properties: Record<string, unknown>;
  };

  for (const field of ['object_id', 'title', 'definition', 'summary', 'keywords', 'chapter', 'relations', 'legal_basis', 'published_at', 'version', 'updated_at', 'questions']) {
    assert.ok(schema.properties[field], `schema is missing ${field}`);
  }
});

test('extracts Knowledge Center fields from structured frontmatter', () => {
  const fields = extractKnowledgeCenterFields(`---
definition: 开放式预算是共同基金的年度预算治理制度。
chapter: 第三章 资金治理
legal_basis:
  - 中华人民共和国民法典
published_at: 2026-07-14
questions:
  - 为什么要实行开放式预算？
  - 预算如何编制？
---

## 正文

正式正文。
`);

  assert.equal(fields.definition, '开放式预算是共同基金的年度预算治理制度。');
  assert.equal(fields.chapter, '第三章 资金治理');
  assert.deepEqual(fields.legalBasis, ['中华人民共和国民法典']);
  assert.equal(fields.publishedAt, '2026-07-14');
  assert.deepEqual(fields.questions, ['为什么要实行开放式预算？', '预算如何编制？']);
});

test('extracts the one-line definition and question mapping from legacy JD Markdown', () => {
  const fields = extractKnowledgeCenterFields(`# JD009 什么是开放式预算？

## 用户问题

为什么要实行开放式预算？ 开放式预算是什么？预算如何编制？

## 一句话定义

**开放式预算，是业主共同基金的年度使用预算制度。**

## 正文

正式正文。
`);

  assert.equal(fields.definition, '开放式预算，是业主共同基金的年度使用预算制度。');
  assert.deepEqual(fields.questions, [
    '为什么要实行开放式预算？',
    '开放式预算是什么？',
    '预算如何编制？',
  ]);
});

test('does not treat an approval date as a publication date', () => {
  const fields = extractKnowledgeCenterFields(`---
批准日期: 2026-07-14
---

# 正文
`);

  assert.equal(fields.publishedAt, null);
});

test('resolves only registered, published JD relations in declared order', () => {
  const objects = [
    {id: 'JD008', type: 'JD', title: '业主共同基金'},
    {id: 'JD010', type: 'JD', title: '预算编制'},
    {id: 'GT001', type: 'GT', title: '预算标准'},
  ];

  assert.deepEqual(
    resolvePublishedRelatedTopics(
      {id: 'JD009', relatedIds: ['JD010', 'JD008', 'GT001', 'JD999', 'JD010']},
      objects,
    ).map((object) => object.id),
    ['JD010', 'JD008'],
  );
});
