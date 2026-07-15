import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";

import {isKnownLifecycleStatus} from "../lib/foundation/lifecycle-engine.ts";
import {buildProductionLog} from "../lib/foundation/production-log.ts";
import {
  buildKnowledgeRegistry,
  loadLifecycleConfig,
  PRODUCTION_LOG_PATH,
  REGISTRY_PATH,
  RELATIONSHIPS_PATH,
} from "../lib/foundation/registry-engine.ts";
import type {KnowledgeRegistry} from "../lib/foundation/types.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function relationshipsDocument(registry: KnowledgeRegistry): Record<string, unknown> {
  const relationships = registry.objects.flatMap((object) => object.relationships);
  return {
    schema_version: "1.0",
    generated_at: registry.generated_at,
    summary: {
      total: relationships.length,
      unresolved: relationships.filter((relationship) => !relationship.target_registered).length,
    },
    relationships,
  };
}

async function expectedOutputs(): Promise<Record<string, string>> {
  const registry = await buildKnowledgeRegistry(repoRoot);
  return {
    [REGISTRY_PATH]: json(registry),
    [RELATIONSHIPS_PATH]: json(relationshipsDocument(registry)),
    [PRODUCTION_LOG_PATH]: buildProductionLog(registry),
  };
}

async function sync(): Promise<void> {
  const outputs = await expectedOutputs();
  await Promise.all(Object.entries(outputs).map(async ([path, content]) => {
    const outputPath = resolve(repoRoot, path);
    await mkdir(dirname(outputPath), {recursive: true});
    await writeFile(outputPath, content, "utf8");
  }));
  console.log(`Foundation Engine synced ${Object.keys(outputs).length} generated files.`);
}

async function validate(): Promise<void> {
  const [outputs, registry, lifecycleConfig] = await Promise.all([
    expectedOutputs(),
    buildKnowledgeRegistry(repoRoot),
    loadLifecycleConfig(repoRoot),
  ]);
  const errors: string[] = [];
  const notices: string[] = [];
  const ids = registry.objects.map((object) => object.object_id);

  if (new Set(ids).size !== ids.length) errors.push("Registry contains duplicate Object IDs.");
  for (const object of registry.objects) {
    if (!object.object_id || !object.object_type || !object.title) {
      errors.push(`${object.object_id || "Unknown object"} is missing required identity metadata.`);
    }
    if (!isKnownLifecycleStatus(object.status, lifecycleConfig)) {
      errors.push(`${object.object_id} has unknown lifecycle status ${object.status}.`);
    }
    const eligible = lifecycleConfig.statuses.find((status) => status.id === object.status)
      ?.foundation_eligible ?? false;
    const expectedReady = Boolean(eligible && object.foundation_id);
    if (object.foundation_ready !== expectedReady) {
      errors.push(`${object.object_id} has an invalid Foundation Ready flag.`);
    }
    if (!eligible && object.foundation_ready) {
      errors.push(`${object.object_id} is Foundation Ready before an eligible lifecycle state.`);
    }
    if (object.candidate_id && object.metadata_format === "none") {
      errors.push(`${object.object_id} has no parseable Markdown metadata.`);
    }
    if (object.status === null) notices.push(`${object.object_id} has no lifecycle decision.`);
    for (const relationship of object.relationships) {
      if (!relationship.target_registered) {
        notices.push(
          `${relationship.source_object_id} references unregistered ${relationship.target_object_id}.`,
        );
      }
    }
  }

  for (const [path, expected] of Object.entries(outputs)) {
    let actual: string;
    try {
      actual = await readFile(resolve(repoRoot, path), "utf8");
    } catch {
      errors.push(`${path} is missing; run npm run foundation:sync.`);
      continue;
    }
    if (actual !== expected) errors.push(`${path} is stale; run npm run foundation:sync.`);
  }

  console.log(
    `Foundation Engine validation: ${errors.length} error(s), ${notices.length} data notice(s).`,
  );
  for (const notice of notices) console.log(`NOTICE ${notice}`);
  for (const error of errors) console.error(`ERROR ${error}`);
  if (errors.length) process.exitCode = 1;
}

const command = process.argv[2];
if (command === "sync") await sync();
else if (command === "validate") await validate();
else {
  console.error(
    `Usage: node ${relative(repoRoot, fileURLToPath(import.meta.url))} <sync|validate>`,
  );
  process.exitCode = 1;
}
