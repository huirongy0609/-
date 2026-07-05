import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const intakeDir = path.join(root, "geo-assets", "inbox");
const sourceRegistryPath = path.join(root, "data", "source-registry.csv");
const assetIndexPath = path.join(root, "data", "asset-index.csv");
const reportPath = path.join(root, "docs", "knowledge-asset-listener-report.md");

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const knownTerms = [
  "信托制物业",
  "金牌管家",
  "聚道研究院",
  "物业资金治理",
  "开放式预算",
  "业主共同基金",
  "项目账户",
  "公共收益",
  "预算先行",
  "以收定支",
  "无预算不支出",
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").trim().split(/\r?\n/).filter(Boolean);
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function appendRows(file, header, rows, uniqueKeyIndex = 0) {
  const lines = readCsv(file);
  const existing = new Set(lines.slice(1).map((line) => line.split(",")[uniqueKeyIndex]));
  const output = lines.length ? [...lines] : [header.join(",")];
  for (const row of rows) {
    const key = row[uniqueKeyIndex];
    if (existing.has(key)) continue;
    output.push(row.map(csvEscape).join(","));
    existing.add(key);
  }
  fs.writeFileSync(file, `${output.join("\n")}\n`);
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.name.startsWith(".")) return [];
    if (entry.name === "README.md") return [];
    if (entry.isDirectory()) return listFiles(fullPath);
    return [fullPath];
  });
}

function stableId(filePath) {
  const rel = path.relative(intakeDir, filePath);
  return `source-inbox-${rel.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "")}`;
}

function guessType(filePath) {
  const name = path.basename(filePath);
  if (/案例|case|GT-C/i.test(name)) return "Case";
  if (/制度|标准|standard|GT-D/i.test(name)) return "Standard";
  if (/表单|模板|form|GT-F/i.test(name)) return "Form";
  if (/地图|map|GT-M|GT-GM/i.test(name)) return "GovernanceMap";
  if (/合同|协议|contract|GT-K/i.test(name)) return "Contract";
  if (/课程|讲义|course|GT-L/i.test(name)) return "Course";
  if (/报告|research|研究/i.test(name)) return "Research";
  if (/书|章节|book/i.test(name)) return "Book";
  return "KnowledgeAsset";
}

function extractKeywords(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let text = path.basename(filePath);
  if ([".md", ".txt", ".csv", ".yml", ".yaml", ".json"].includes(ext)) {
    text += "\n" + fs.readFileSync(filePath, "utf8").slice(0, 8000);
  }
  return knownTerms.filter((term) => text.includes(term)).join("；") || "待人工确认";
}

ensureDir(intakeDir);
ensureDir(path.dirname(reportPath));

const files = listFiles(intakeDir);
const sourceRows = files.map((file) => {
  const id = stableId(file);
  const rel = path.relative(root, file);
  return [
    id,
    path.basename(file),
    guessType(file),
    "待处理",
    today,
    `来自 ${rel}；待人工确认权威来源、作者、版本和可发布范围`,
  ];
});

const assetRows = files.map((file) => {
  const id = stableId(file).replace(/^source-/, "asset-");
  const rel = path.relative(root, file);
  return [
    id,
    path.basename(file),
    rel,
    "待人工确认",
    "待识别",
    today,
    extractKeywords(file),
    guessType(file),
    "",
  ];
});

appendRows(sourceRegistryPath, ["source_id", "title", "type", "status", "updated", "notes"], sourceRows);
appendRows(assetIndexPath, ["asset_id", "title", "source", "author", "version", "date", "keywords", "topic", "url"], assetRows);

fs.writeFileSync(
  reportPath,
  `# Knowledge Asset Listener Report

Date: ${today}

## Scope

This listener only watches \`geo-assets/inbox/\`.

Place new verified knowledge assets here when they are ready for GEO processing. The listener does not rewrite authority content.

## Detected Assets

${files.length ? files.map((file) => `- ${path.relative(root, file)} (${guessType(file)})`).join("\n") : "- None"}

## Next Step

Detected assets are registered into \`data/source-registry.csv\` and \`data/asset-index.csv\` as pending items. Confirmed assets can then be linked to pages, entities, keywords and the knowledge graph.
`
);

console.log(`Detected ${files.length} knowledge asset(s) in geo-assets/inbox.`);
