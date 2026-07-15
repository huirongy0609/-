import type {KnowledgeObject, KnowledgeRegistry} from "./types.ts";

function escapeCell(value: string | null): string {
  return (value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function displayId(object: KnowledgeObject): string {
  if (object.candidate_id && object.foundation_id) {
    return `${object.candidate_id} → ${object.foundation_id}`;
  }
  return object.foundation_id ?? object.candidate_id ?? object.object_id;
}

export function buildProductionLog(registry: KnowledgeRegistry): string {
  const jdObjects = registry.objects.filter((object) => object.object_type === "JD");
  const statusCounts = jdObjects.reduce<Record<string, number>>((counts, object) => {
    const status = object.status ?? "unassigned";
    counts[status] = (counts[status] ?? 0) + 1;
    return counts;
  }, {});
  const byStatus = Object.entries(statusCounts)
    .filter(([status]) => status !== "unassigned")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([status, count]) => `- \`${status}\`：${count}`);
  const rows = jdObjects.map((object) => [
    escapeCell(displayId(object)),
    escapeCell(object.title),
    escapeCell(object.version),
    escapeCell(object.status ? `\`${object.status}\`` : null),
    object.foundation_ready ? "True" : "False",
    escapeCell(object.file_path),
  ].join(" | "));

  return [
    "# JD Production Log",
    "",
    "> 此文件由 `npm run foundation:sync` 自动生成，请勿手工维护。",
    ">",
    "> 权威生命周期来自 Foundation Manifest 或知识对象元数据；本台账不产生批准事实。",
    "",
    "## 同步摘要",
    "",
    `- JD对象：${jdObjects.length}`,
    `- Foundation Ready：${jdObjects.filter((object) => object.foundation_ready).length}`,
    ...byStatus,
    "",
    "## 对象台账",
    "",
    "对象编号 | 名称 | 版本 | 生命周期 | Foundation Ready | 来源文件",
    "--- | --- | --- | --- | --- | ---",
    ...rows,
    "",
    "## 同步边界",
    "",
    "- Approved 前，`Foundation Ready` 始终为 `False`。",
    "- `approved` 只有同时取得 Foundation ID 时才为 `True`。",
    "- 同步过程不修改任何知识正文、Golden Sample、Manifest 或生命周期状态。",
    "",
  ].join("\n");
}
