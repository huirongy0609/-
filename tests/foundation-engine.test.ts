import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import test from "node:test";

import {
  canTransition,
  isFoundationReady,
  validateLifecycleConfig,
} from "../lib/foundation/lifecycle-engine.ts";
import {
  normalizeNullableId,
  normalizeStatus,
  parseMarkdownMetadata,
} from "../lib/foundation/metadata-parser.ts";
import {validateGtPackageRegistry} from "../lib/foundation/package-registry.ts";
import {
  buildRelationships,
  extractRelationshipTargets,
} from "../lib/foundation/relationship-engine.ts";
import {buildKnowledgeRegistryFromInputs} from "../lib/foundation/registry-engine.ts";
import type {LifecycleConfig} from "../lib/foundation/types.ts";

const repoRoot = process.cwd();

async function lifecycleConfig(): Promise<LifecycleConfig> {
  return JSON.parse(
    await readFile(resolve(repoRoot, "config/foundation/lifecycle.v1.json"), "utf8"),
  ) as LifecycleConfig;
}

test("parses YAML front matter without changing the body", () => {
  const source = [
    "---",
    "object_id: BK1-JD-100",
    "status: in_review",
    "relations:",
    "  - JD001",
    "  - LAW-001",
    "---",
    "# 正文",
  ].join("\n");
  const result = parseMarkdownMetadata(source);
  assert.equal(result.format, "yaml_frontmatter");
  assert.equal(result.attributes.object_id, "BK1-JD-100");
  assert.deepEqual(result.attributes.relations, ["JD001", "LAW-001"]);
  assert.equal(result.body, "# 正文");
});

test("reads current JD blockquote metadata as a compatibility input", () => {
  const source = [
    "# BK1-JD-100《测试对象》V1.0",
    "",
    "> **候选对象编号：** BK1-JD-100  ",
    "> **正式Foundation编号：** 未分配  ",
    "> **生命周期状态：** `in_review`",
  ].join("\n");
  const result = parseMarkdownMetadata(source);
  assert.equal(result.format, "legacy_blockquote");
  assert.equal(normalizeNullableId(result.attributes["候选对象编号"] as string), "BK1-JD-100");
  assert.equal(normalizeNullableId(result.attributes["正式Foundation编号"] as string), null);
  assert.equal(normalizeStatus(result.attributes["生命周期状态"] as string), "in_review");
});

test("lifecycle behavior is loaded from configuration", async () => {
  const config = await lifecycleConfig();
  assert.deepEqual(validateLifecycleConfig(config), []);
  assert.equal(canTransition("draft", "in_review", config), true);
  assert.equal(canTransition("draft", "approved", config), false);
  assert.equal(isFoundationReady("in_review", "JD100", config), false);
  assert.equal(isFoundationReady("approved", null, config), false);
  assert.equal(isFoundationReady("approved", "JD100", config), true);
});

test("extracts and classifies supported knowledge relationships", () => {
  const markdown = [
    "## 六、关联知识对象",
    "",
    "| 关联对象 | 名称 |",
    "|---|---|",
    "| JD001 | JD |",
    "| GT-B07 | GT |",
    "| CASE-001 | Case |",
    "| FAQ-001 | FAQ |",
    "| LAW-001 | Law |",
    "",
    "## 七、来源",
  ].join("\n");
  const targets = extractRelationshipTargets(markdown);
  const relationships = buildRelationships("BK1-JD-100", targets, new Set(["JD001"]));
  assert.deepEqual(
    relationships.map(({target_object_id, kind, target_registered}) => ({
      target_object_id,
      kind,
      target_registered,
    })),
    [
      {target_object_id: "JD001", kind: "RELATED_JD", target_registered: true},
      {target_object_id: "GT-B07", kind: "RELATED_GT", target_registered: false},
      {target_object_id: "CASE-001", kind: "RELATED_CASE", target_registered: false},
      {target_object_id: "FAQ-001", kind: "RELATED_FAQ", target_registered: false},
      {target_object_id: "LAW-001", kind: "RELATED_LAW", target_registered: false},
    ],
  );
});

test("builds a registry from isolated engineering fixtures", async () => {
  const config = await lifecycleConfig();
  const registry = buildKnowledgeRegistryFromInputs(
    config,
    {source_manifest: "test-fixture", objects: []},
    [{
      filePath: "test-fixtures/candidate.md",
      markdown: [
        "---",
        "object_id: TEST-JD-001",
        "candidate_id: TEST-JD-001",
        "foundation_id: null",
        "object_type: JD",
        "status: in_review",
        "version: V1.0",
        "source: test-fixture",
        "created_at: 2026-01-01",
        "updated_at: 2026-01-01",
        "title: Test Fixture",
        "---",
      ].join("\n"),
    }],
  );
  assert.equal(registry.summary.total, 1);
  assert.equal(registry.schema_version, "1.1");
  assert.equal(registry.summary.by_type.JD, 1);
  assert.deepEqual(registry.packages, []);
  assert.equal(registry.objects.filter((object) => object.candidate_id).length, 1);
  assert.equal(registry.objects[0].package_id, null);
  assert.equal(registry.objects[0].package_version, null);
  assert.equal(registry.objects[0].parent_object, null);
  assert.deepEqual(registry.objects[0].children, []);
  assert.equal(
    registry.objects.every((object) => object.status === "approved" || !object.foundation_ready),
    true,
  );
  assert.equal(
    registry.objects.filter((object) => object.foundation_ready).every(
      (object) => object.status === "approved" && Boolean(object.foundation_id),
    ),
    true,
  );
});

test("registers a GT Package with Rule, Method, Principle, and Evidence children", async () => {
  const config = await lifecycleConfig();
  const object = (
    objectId: string,
    objectType: string,
    extra: string[],
    relations: string[] = [],
  ) => ({
    filePath: `test-fixtures/${objectId.toLowerCase()}.md`,
    markdown: [
      "---",
      `object_id: ${objectId}`,
      `candidate_id: ${objectId}`,
      `object_type: ${objectType}`,
      "status: in_review",
      "version: V1.0",
      "source: test-fixture",
      "created_at: 2026-01-01",
      "updated_at: 2026-01-01",
      `title: ${objectId}`,
      ...extra,
      ...(relations.length ? [`relations: [${relations.join(", ")}]`] : []),
      "---",
    ].join("\n"),
  });
  const registry = buildKnowledgeRegistryFromInputs(
    config,
    {source_manifest: "test-fixture", objects: []},
    [
      object("GT-P9001", "GT_PACKAGE", [
        "package_id: GT-P9001",
        "package_version: V1.0",
        "children: [GT-P9001-R01, GT-P9001-R02, GT-P9001-M01, GT-P9001-E01]",
      ], ["CASE-TEST-001"]),
      object("GT-P9001-R01", "GT", [
        "package_id: GT-P9001",
        "parent_object: GT-P9001",
        "package_member_type: RULE",
      ]),
      object("GT-P9001-R02", "GT", [
        "package_id: GT-P9001",
        "parent_object: GT-P9001",
        "package_member_type: PRINCIPLE",
      ]),
      object("GT-P9001-M01", "GT", [
        "package_id: GT-P9001",
        "parent_object: GT-P9001",
        "package_member_type: METHOD",
      ]),
      object("GT-P9001-E01", "GT", [
        "package_id: GT-P9001",
        "parent_object: GT-P9001",
        "package_member_type: EVIDENCE",
      ]),
      object("JD-TEST-001", "JD", [], ["GT-P9001"]),
      object("CASE-TEST-001", "CASE", [], ["FAQ-TEST-001"]),
      object("FAQ-TEST-001", "FAQ", []),
    ],
  );

  assert.equal(registry.summary.by_type.GT_PACKAGE, 1);
  assert.equal(registry.packages.length, 1);
  assert.equal(registry.packages[0].package_id, "GT-P9001");
  assert.deepEqual(
    registry.packages[0].children.map((child) => child.member_type),
    ["RULE", "PRINCIPLE", "METHOD", "EVIDENCE"],
  );
  assert.deepEqual(validateGtPackageRegistry(registry.objects, registry.packages), []);

  const byId = new Map(registry.objects.map((entry) => [entry.object_id, entry]));
  assert.equal(byId.get("JD-TEST-001")?.relationships[0]?.kind, "RELATED_GT_PACKAGE");
  assert.equal(byId.get("GT-P9001")?.relationships[0]?.kind, "RELATED_CASE");
  assert.equal(byId.get("CASE-TEST-001")?.relationships[0]?.kind, "RELATED_FAQ");
});

test("keeps legacy QA identifiers compatible with the FAQ object type", async () => {
  const config = await lifecycleConfig();
  const registry = buildKnowledgeRegistryFromInputs(
    config,
    {source_manifest: "test-fixture", objects: []},
    [{
      filePath: "test-fixtures/qa-test-001.md",
      markdown: [
        "---",
        "object_id: QA-TEST-001",
        "candidate_id: QA-TEST-001",
        "object_type: QA",
        "status: in_review",
        "title: QA compatibility",
        "---",
      ].join("\n"),
    }],
  );

  assert.equal(registry.objects[0].object_type, "FAQ");
});
