import { readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const MANIFEST_PATH = "knowledge/foundation/v1.0/manifest.md";
export const INDEX_PATH = "knowledge/foundation/index.json";

const lifecycleStatuses = [
  "draft",
  "in_review",
  "approved",
  "pending_revision",
  "archived",
];

function section(markdown, startHeading, endHeading) {
  const start = markdown.indexOf(startHeading);
  if (start === -1) {
    throw new Error(`Manifest缺少章节：${startHeading}`);
  }

  const contentStart = start + startHeading.length;
  const end = endHeading ? markdown.indexOf(endHeading, contentStart) : -1;
  return markdown.slice(contentStart, end === -1 ? undefined : end);
}

function tableCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function inlineCodeValue(value) {
  const match = value.match(/`([^`]+)`/);
  return match ? match[1] : null;
}

function normalizeTitle(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("《") && trimmed.endsWith("》")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function verifiedVersion(value) {
  if (value.includes("不可核实") || value.includes("未标注")) {
    return null;
  }
  return value.match(/V\d+(?:\.\d+)?/)?.[0] ?? null;
}

function filePath(value) {
  const matches = [...value.matchAll(/`(knowledge\/foundation\/[^`]+\.md)`/g)];
  return matches[0]?.[1] ?? null;
}

function approvalDate(evidence, lifecycleStatus) {
  if (lifecycleStatus !== "approved") {
    return null;
  }
  return evidence.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
}

function parseManifestRows(markdown) {
  const rows = section(markdown, "## 11项原件清单", "## 入库结论")
    .split("\n")
    .filter((line) => /^\|\s*(?:STD-\d+|JD\d+)\s*\|/.test(line))
    .map(tableCells);

  return rows.map(
    ([id, title, lifecycleCell, auditCell, discoveredPaths, version, evidence]) => {
      const lifecycleStatus = inlineCodeValue(lifecycleCell);
      const sourceAuditStatus = inlineCodeValue(auditCell);
      return {
        id,
        title: normalizeTitle(title),
        version: verifiedVersion(version),
        version_note: version,
        lifecycle_status: lifecycleStatus,
        source_audit_status: sourceAuditStatus,
        file_path: filePath(discoveredPaths),
        object_type: id.startsWith("JD") ? "JD" : "Standard",
        approved_at: approvalDate(evidence, lifecycleStatus),
        approval_record: lifecycleStatus === "approved" ? evidence : null,
        status_evidence: evidence === "未发现" ? null : evidence,
        sha256: null,
        related_objects: [],
        last_updated: null,
      };
    },
  );
}

function parseChecksums(markdown) {
  const checksums = new Map();
  for (const line of markdown.split("\n")) {
    if (!/^\|\s*JD\d+\s*\|/.test(line)) {
      continue;
    }
    const [id, , checksumCell] = tableCells(line);
    const checksum = checksumCell?.match(/[a-f0-9]{64}/)?.[0];
    if (checksum) {
      checksums.set(id, checksum);
    }
  }
  return checksums;
}

function parseRelationships(markdown) {
  const relationships = new Map();
  const relationshipSection = section(markdown, "## 引用关系登记", null);

  for (const line of relationshipSection.split("\n")) {
    if (!/^\|\s*(?:STD-\d+|JD\d+)\s*\|/.test(line)) {
      continue;
    }
    const [sourceId, resolved] = tableCells(line);
    const targetIds = resolved.match(/(?:STD-\d+|JD\d+)/g) ?? [];
    relationships.set(sourceId, [...new Set(targetIds)]);
  }
  return relationships;
}

export async function buildFoundationIndex({ generatedAt = new Date().toISOString() } = {}) {
  const manifest = await readFile(resolve(REPO_ROOT, MANIFEST_PATH), "utf8");
  const objects = parseManifestRows(manifest);
  const checksums = parseChecksums(manifest);
  const relationships = parseRelationships(manifest);
  const objectsById = new Map(objects.map((object) => [object.id, object]));

  for (const object of objects) {
    object.sha256 = checksums.get(object.id) ?? null;
    object.related_objects = (relationships.get(object.id) ?? []).map((id) => ({
      id,
      lifecycle_status: objectsById.get(id)?.lifecycle_status ?? null,
    }));
  }

  const lifecycle = Object.fromEntries(
    lifecycleStatuses.map((status) => [
      status,
      objects.filter((object) => object.lifecycle_status === status).length,
    ]),
  );

  return {
    schema_version: "0.1",
    generated_at: generatedAt,
    source_manifest: MANIFEST_PATH,
    governance_standard: "docs/standards/knowledge-object-lifecycle-management-v1.0.md",
    summary: {
      total: objects.length,
      lifecycle,
      source_audit: {
        not_found: objects.filter((object) => object.source_audit_status === "not_found")
          .length,
      },
    },
    objects,
  };
}

export async function writeFoundationIndex() {
  const index = await buildFoundationIndex();
  const outputPath = resolve(REPO_ROOT, INDEX_PATH);
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  return { index, outputPath };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  const { index, outputPath } = await writeFoundationIndex();
  console.log(
    `Foundation索引已生成：${relative(REPO_ROOT, outputPath)}（${index.objects.length}项）`,
  );
}
