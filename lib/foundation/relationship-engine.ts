import type {
  KnowledgeRelationship,
  KnowledgeObjectType,
  RelationshipKind,
} from "./types.ts";

const targetPattern = /^(?:BK\d+-)?(?:JD|GT|CASE|FAQ|QA|LAW|TOOL|PRODUCT|COURSE)[-_]?[A-Z0-9-]+$/i;

export function relationshipKind(
  targetId: string,
  targetType?: KnowledgeObjectType,
): RelationshipKind | null {
  const normalized = targetId.toUpperCase();
  if (targetType === "GT_PACKAGE") return "RELATED_GT_PACKAGE";
  if (targetType === "JD") return "RELATED_JD";
  if (targetType === "GT") return "RELATED_GT";
  if (targetType === "CASE") return "RELATED_CASE";
  if (targetType === "FAQ") return "RELATED_FAQ";
  if (targetType === "LAW") return "RELATED_LAW";
  if (targetType === "TOOL") return "RELATED_TOOL";
  if (targetType === "PRODUCT") return "RELATED_PRODUCT";
  if (targetType === "COURSE") return "RELATED_COURSE";
  if (/^(?:BK\d+-)?JD/.test(normalized)) return "RELATED_JD";
  if (/^GT-P(?:ACKAGE)?[-_]?/i.test(normalized)) return "RELATED_GT_PACKAGE";
  if (/^GT/.test(normalized)) return "RELATED_GT";
  if (/^CASE/.test(normalized)) return "RELATED_CASE";
  if (/^(?:FAQ|QA)/.test(normalized)) return "RELATED_FAQ";
  if (/^LAW/.test(normalized)) return "RELATED_LAW";
  if (/^TOOL/.test(normalized)) return "RELATED_TOOL";
  if (/^PRODUCT/.test(normalized)) return "RELATED_PRODUCT";
  if (/^COURSE/.test(normalized)) return "RELATED_COURSE";
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
  registeredTargets: ReadonlySet<string> | ReadonlyMap<string, KnowledgeObjectType>,
): KnowledgeRelationship[] {
  return targetIds.flatMap((targetObjectId) => {
    const targetType = registeredTargets instanceof Map
      ? registeredTargets.get(targetObjectId)
      : undefined;
    const kind = relationshipKind(targetObjectId, targetType);
    if (!kind) return [];
    return [{
      source_object_id: sourceObjectId,
      target_object_id: targetObjectId,
      kind,
      target_registered: registeredTargets.has(targetObjectId),
    }];
  });
}
