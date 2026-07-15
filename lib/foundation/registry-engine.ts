import {readdir, readFile} from "node:fs/promises";
import {relative, resolve} from "node:path";

import {
  isFoundationReady,
  validateLifecycleConfig,
} from "./lifecycle-engine.ts";
import {
  metadataString,
  normalizeNullableId,
  normalizeStatus,
  parseMarkdownMetadata,
} from "./metadata-parser.ts";
import {
  buildRelationships,
  extractRelationshipTargets,
} from "./relationship-engine.ts";
import type {
  KnowledgeObject,
  KnowledgeRegistry,
  LifecycleConfig,
  MetadataFormat,
} from "./types.ts";

export const LIFECYCLE_CONFIG_PATH = "config/foundation/lifecycle.v1.json";
export const FOUNDATION_INDEX_PATH = "knowledge/foundation/index.json";
export const REGISTRY_PATH = "knowledge/foundation/generated/registry.json";
export const RELATIONSHIPS_PATH = "knowledge/foundation/generated/relationships.json";
export const PRODUCTION_LOG_PATH = "knowledge/foundation/generated/jd-production-log.md";

export type FoundationIndexObject = {
  id: string;
  title: string;
  version: string | null;
  lifecycle_status: string | null;
  file_path: string | null;
  object_type: string;
  approved_at: string | null;
  last_updated: string | null;
  related_objects: Array<{id: string}>;
};

export type FoundationIndexInput = {
  source_manifest: string;
  objects: FoundationIndexObject[];
};

type ParsedCandidateInput = {
  filePath: string;
  markdown: string;
  metadataFormat: MetadataFormat;
  attributes: Record<string, unknown>;
};

export type CandidateMarkdownInput = {
  filePath: string;
  markdown: string;
};

async function markdownFiles(root: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(root, {withFileTypes: true});
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw cause;
  }
  const files: string[] = [];
  for (const entry of entries) {
    const child = resolve(root, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(child)));
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") {
      files.push(child);
    }
  }
  return files;
}

function titleFromMarkdown(markdown: string): string {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? "";
  return heading.match(/《([^》]+)》/)?.[1] ?? heading.trim();
}

function candidateObject(input: ParsedCandidateInput): Omit<KnowledgeObject, "relationships"> & {
  relationshipTargets: string[];
} {
  const attributes = input.attributes;
  const candidateId = normalizeNullableId(
    metadataString(attributes, "candidate_id", "candidateId", "候选对象编号"),
  );
  const foundationId = normalizeNullableId(
    metadataString(attributes, "foundation_id", "foundationId", "正式Foundation编号"),
  );
  const explicitObjectId = normalizeNullableId(
    metadataString(attributes, "object_id", "objectId", "id"),
  );
  const objectId = foundationId ?? candidateId ?? explicitObjectId;
  if (!objectId) throw new Error(`${input.filePath} is missing an object ID.`);

  const source = metadataString(attributes, "source", "来源图书");
  const objectTypeLabel = metadataString(attributes, "object_type", "type", "知识对象类型");
  const objectType = objectTypeLabel?.match(/\b(JD|GT|CASE|FAQ|QA|LAW)\b/i)?.[1]
    ?.toUpperCase() ?? objectId.match(/(?:^|-)(JD|GT|CASE|FAQ|QA|LAW)/i)?.[1]
    ?.toUpperCase() ?? "UNKNOWN";
  const status = normalizeStatus(
    metadataString(attributes, "status", "lifecycle_status", "生命周期状态"),
  );
  const createdAt = metadataString(attributes, "created_at", "createdAt", "提交日期");
  const updatedAt = metadataString(attributes, "updated_at", "updatedAt") ?? createdAt;

  return {
    object_id: objectId.toUpperCase(),
    candidate_id: candidateId?.toUpperCase() ?? null,
    foundation_id: foundationId?.toUpperCase() ?? null,
    object_type: objectType,
    status,
    version: metadataString(attributes, "version", "版本"),
    source: source ? [source] : [],
    created_at: createdAt,
    updated_at: updatedAt,
    title: metadataString(attributes, "title", "名称") ?? titleFromMarkdown(input.markdown),
    file_path: input.filePath,
    metadata_format: input.metadataFormat,
    foundation_ready: false,
    relationshipTargets: extractRelationshipTargets(input.markdown),
  };
}

function formalObject(
  object: FoundationIndexObject,
  sourceManifest: string,
): Omit<KnowledgeObject, "relationships"> & {relationshipTargets: string[]} {
  return {
    object_id: object.id.toUpperCase(),
    candidate_id: null,
    foundation_id: object.file_path ? object.id.toUpperCase() : null,
    object_type: object.object_type.toUpperCase(),
    status: object.lifecycle_status,
    version: object.version,
    source: [sourceManifest],
    created_at: null,
    updated_at: object.last_updated,
    title: object.title,
    file_path: object.file_path,
    metadata_format: "none",
    foundation_ready: false,
    relationshipTargets: object.related_objects.map((related) => related.id.toUpperCase()),
  };
}

function sortObjects(left: KnowledgeObject, right: KnowledgeObject): number {
  return left.object_id.localeCompare(right.object_id, "en", {numeric: true});
}

function countBy(values: Array<string | null>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = value ?? "unassigned";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

export async function loadLifecycleConfig(repoRoot: string): Promise<LifecycleConfig> {
  const source = await readFile(resolve(repoRoot, LIFECYCLE_CONFIG_PATH), "utf8");
  const config = JSON.parse(source) as LifecycleConfig;
  const errors = validateLifecycleConfig(config);
  if (errors.length) throw new Error(errors.join("\n"));
  return config;
}

export function buildKnowledgeRegistryFromInputs(
  config: LifecycleConfig,
  foundationIndex: FoundationIndexInput,
  candidateInputs: CandidateMarkdownInput[],
): KnowledgeRegistry {
  const parsedCandidates: ParsedCandidateInput[] = candidateInputs.map((input) => {
    const metadata = parseMarkdownMetadata(input.markdown);
    return {
      ...input,
      metadataFormat: metadata.format,
      attributes: metadata.attributes,
    };
  });
  const pendingObjects = [
    ...foundationIndex.objects.map((object) => formalObject(object, foundationIndex.source_manifest)),
    ...parsedCandidates.map(candidateObject),
  ];
  const registeredIds = new Set(pendingObjects.map((object) => object.object_id));
  const objects: KnowledgeObject[] = pendingObjects.map(({relationshipTargets, ...object}) => ({
    ...object,
    foundation_ready: isFoundationReady(object.status, object.foundation_id, config),
    relationships: buildRelationships(object.object_id, relationshipTargets, registeredIds),
  })).sort(sortObjects);
  const generatedAt = objects
    .flatMap((object) => [object.updated_at, object.created_at])
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

  return {
    schema_version: "1.0",
    generated_at: generatedAt,
    lifecycle_config: LIFECYCLE_CONFIG_PATH,
    summary: {
      total: objects.length,
      by_type: countBy(objects.map((object) => object.object_type)),
      by_status: countBy(objects.map((object) => object.status)),
      foundation_ready: objects.filter((object) => object.foundation_ready).length,
    },
    objects,
  };
}

export async function buildKnowledgeRegistry(repoRoot: string): Promise<KnowledgeRegistry> {
  const [config, indexSource] = await Promise.all([
    loadLifecycleConfig(repoRoot),
    readFile(resolve(repoRoot, FOUNDATION_INDEX_PATH), "utf8"),
  ]);
  const foundationIndex = JSON.parse(indexSource) as FoundationIndexInput;
  const productionRoot = resolve(repoRoot, "docs/knowledge-production");
  const candidatePaths = (await markdownFiles(productionRoot)).filter((filePath) =>
    /book1-jd-batch-\d+/.test(filePath),
  );
  const candidateInputs = await Promise.all(candidatePaths.map(async (absolutePath) => ({
    filePath: relative(repoRoot, absolutePath),
    markdown: await readFile(absolutePath, "utf8"),
  })));
  return buildKnowledgeRegistryFromInputs(config, foundationIndex, candidateInputs);
}
