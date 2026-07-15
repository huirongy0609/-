import type {
  KnowledgeRelationship,
  RelationshipKind,
} from "./types.ts";

const targetPattern = /^(?:BK\d+-)?(?:JD|GT|CASE|FAQ|QA|LAW)[-_]?[A-Z0-9-]+$/i;

export function relationshipKind(targetId: string): RelationshipKind | null {
  const normalized = targetId.toUpperCase();
  if (/^(?:BK\d+-)?JD/.test(normalized)) return "RELATED_JD";
  if (/^GT/.test(normalized)) return "RELATED_GT";
  if (/^CASE/.test(normalized)) return "RELATED_CASE";
  if (/^(?:FAQ|QA)/.test(normalized)) return "RELATED_FAQ";
  if (/^LAW/.test(normalized)) return "RELATED_LAW";
  return null;
}

export function extractRelationshipTargets(markdown: string): string[] {
  const section = markdown.match(
    /^##\s+(?:六、)?关联知识对象\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m,
  )?.[1];
  if (!section) return [];

  const targets: string[] = [];
  for (const line of section.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const firstCell = line
      .trim()
      .replace(/^\|/, "")
      .split("|")[0]
      .replaceAll("`", "")
      .trim();
    if (targetPattern.test(firstCell)) targets.push(firstCell.toUpperCase());
  }
  return [...new Set(targets)];
}

export function buildRelationships(
  sourceObjectId: string,
  targetIds: string[],
  registeredIds: ReadonlySet<string>,
): KnowledgeRelationship[] {
  return targetIds.flatMap((targetObjectId) => {
    const kind = relationshipKind(targetObjectId);
    if (!kind) return [];
    return [{
      source_object_id: sourceObjectId,
      target_object_id: targetObjectId,
      kind,
      target_registered: registeredIds.has(targetObjectId),
    }];
  });
}
