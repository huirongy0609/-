import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildFoundationIndex,
  INDEX_PATH,
  MANIFEST_PATH,
  REPO_ROOT,
} from "./generate-foundation-index.mjs";

const REPORT_PATH = "docs/foundation-validation-report.md";
const README_PATH = "knowledge/foundation/v1.0/README.md";
const AUDIT_PATH = "docs/foundation-source-audit-report-v1.md";
const FORMAL_ROOTS = [
  "knowledge/foundation/v1.0/jd",
  "knowledge/foundation/v1.0/standards",
];
const DRAFT_ROOT = "knowledge/foundation/drafts";
const LIFECYCLE_STATUSES = new Set([
  "draft",
  "in_review",
  "approved",
  "pending_revision",
  "archived",
]);
const SOURCE_AUDIT_STATUSES = new Set(["not_found"]);

const results = { passed: [], warnings: [], errors: [] };

function pass(name, detail) {
  results.passed.push({ name, detail });
}

function warn(name, detail, action) {
  results.warnings.push({ name, detail, action });
}

function error(name, detail, action) {
  results.errors.push({ name, detail, action });
}

function assert(name, condition, detail, action) {
  if (condition) {
    pass(name, detail);
  } else {
    error(name, detail, action);
  }
}

async function sha256(path) {
  const content = await readFile(path);
  return createHash("sha256").update(content).digest("hex");
}

async function markdownFiles(root) {
  const absoluteRoot = resolve(REPO_ROOT, root);
  let entries;
  try {
    entries = await readdir(absoluteRoot, { withFileTypes: true });
  } catch (cause) {
    if (cause?.code === "ENOENT") {
      return [];
    }
    throw cause;
  }

  const files = [];
  for (const entry of entries) {
    const child = resolve(absoluteRoot, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await markdownFiles(relative(REPO_ROOT, child))));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(relative(REPO_ROOT, child));
    }
  }
  return files;
}

function declaredCounts(markdown, status) {
  const escaped = status.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const values = [];
  const prosePattern = new RegExp("`" + escaped + "`[：:]\\s*(\\d+)项", "g");
  const tablePattern = new RegExp(
    "\\|\\s*`" + escaped + "`\\s*\\|\\s*(\\d+)\\s*\\|",
    "g",
  );
  for (const pattern of [prosePattern, tablePattern]) {
    for (const match of markdown.matchAll(pattern)) {
      values.push(Number(match[1]));
    }
  }
  return values;
}

function verifyDocumentCounts(label, markdown, expectedCounts) {
  for (const [status, expected] of Object.entries(expectedCounts)) {
    const declarations = declaredCounts(markdown, status);
    assert(
      `${label}统计：${status}`,
      declarations.length > 0 && declarations.every((value) => value === expected),
      declarations.length
        ? `登记值${declarations.join("、")}；索引值${expected}`
        : `未找到${status}统计；索引值${expected}`,
      `将${label}中的${status}数量更新为${expected}。`,
    );
  }
}

function auditObjectSections(markdown) {
  const headings = [...markdown.matchAll(/^### 5\.\d+\s+(.+)$/gm)];
  return headings.map((match, index) => ({
    heading: match[1],
    body: markdown.slice(
      match.index + match[0].length,
      headings[index + 1]?.index ?? markdown.length,
    ),
  }));
}

function reportTimestamp() {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day} ${value.hour}:${value.minute}:${value.second}（Asia/Shanghai）`;
}

function reportSection(title, items, emptyText) {
  const lines = [`## ${title}`, ""];
  if (items.length === 0) {
    lines.push(`- ${emptyText}`);
    return lines;
  }
  for (const item of items) {
    lines.push(`- **${item.name}**：${item.detail}`);
    if (item.action) {
      lines.push(`  - 建议处理：${item.action}`);
    }
  }
  return lines;
}

function buildReport() {
  return [
    "# Foundation Validation Report",
    "",
    "> 对应任务：Codex任务单 No.007",
    ">",
    `> 检查时间：${reportTimestamp()}`,
    ">",
    "> 检查方式：`npm run foundation:validate`",
    ">",
    `> 结果：${results.errors.length === 0 ? "PASS" : "FAIL"}`,
    "",
    "## 检查范围",
    "",
    `- \`${MANIFEST_PATH}\`与\`${INDEX_PATH}\`的一致性；`,
    "- Foundation V1.0正式目录和Draft隔离目录；",
    "- ID、路径、SHA-256、生命周期与原件审计状态；",
    "- Manifest、README、Audit Report数量统计；",
    "- 已登记关联对象及其生命周期状态。",
    "",
    "## 结果摘要",
    "",
    `- 通过项：${results.passed.length}`,
    `- 警告项：${results.warnings.length}`,
    `- 错误项：${results.errors.length}`,
    "",
    ...reportSection("通过项", results.passed, "无。"),
    "",
    ...reportSection("警告项", results.warnings, "无。"),
    "",
    ...reportSection("错误项", results.errors, "无。"),
    "",
    "## 建议处理方式",
    "",
    results.errors.length === 0
      ? "- 当前没有阻断性错误；保持Manifest为人工登记源，在批准入库或状态变化后重新生成索引并运行校验。"
      : "- 先处理全部错误，再重新生成索引并运行校验；脚本不会自动修改知识正文、生命周期状态或Manifest。",
    results.warnings.length === 0
      ? "- 当前没有警告。"
      : "- 警告不阻断校验，但应按各项建议补齐原件或元数据。",
    "",
    "## 自动化边界",
    "",
    "- 本校验不会修改JD、GT、Case、Evidence、Standard、Law、QA、Tool或Product Object正文。",
    "- 本校验不会修改Manifest、Audit或生命周期状态。",
    "- 使用`--write-report`时，仅覆盖本报告文件。",
    "",
  ].join("\n");
}

async function validate() {
  const [indexText, manifest, readme, audit] = await Promise.all([
    readFile(resolve(REPO_ROOT, INDEX_PATH), "utf8"),
    readFile(resolve(REPO_ROOT, MANIFEST_PATH), "utf8"),
    readFile(resolve(REPO_ROOT, README_PATH), "utf8"),
    readFile(resolve(REPO_ROOT, AUDIT_PATH), "utf8"),
  ]);
  const index = JSON.parse(indexText);
  const expected = await buildFoundationIndex({ generatedAt: index.generated_at });
  const auditSections = auditObjectSections(audit);

  assert(
    "索引与Manifest",
    JSON.stringify(index.objects) === JSON.stringify(expected.objects),
    "index.json对象记录与Manifest生成结果一致。",
    "运行npm run foundation:index重新生成索引，并复核Manifest改动。",
  );
  assert(
    "索引汇总",
    JSON.stringify(index.summary) === JSON.stringify(expected.summary),
    "index.json汇总与对象记录一致。",
    "重新生成索引，禁止手工修改汇总数字。",
  );

  const ids = index.objects.map((object) => object.id);
  assert(
    "ID唯一性",
    new Set(ids).size === ids.length,
    `共${ids.length}项，未发现重复ID。`,
    "在Manifest中裁决重复ID后重新生成索引。",
  );

  for (const object of index.objects) {
    const auditSection = auditSections.find(
      (candidate) =>
        candidate.heading.includes(object.id) || candidate.heading.includes(object.title),
    );
    assert(
      `${object.id} Audit逐项记录`,
      Boolean(auditSection),
      auditSection?.heading ?? "未找到对应逐项审计章节。",
      "在Audit Report第五章补充该对象的逐项判断。",
    );

    if (auditSection) {
      const auditLifecycle =
        auditSection.body.match(/生命周期状态：`([^`]+)`/)?.[1] ??
        (auditSection.body.includes("生命周期状态：—") ? null : undefined);
      const auditSourceStatus =
        auditSection.body.match(/原件审计状态：`([^`]+)`/)?.[1] ?? null;
      assert(
        `${object.id} Audit生命周期`,
        auditLifecycle === object.lifecycle_status,
        `Audit：${auditLifecycle ?? "空"}；索引：${object.lifecycle_status ?? "空"}。`,
        "由项目总架构师裁决状态后同步更新Manifest与Audit。",
      );
      assert(
        `${object.id} Audit原件审计状态`,
        auditSourceStatus === object.source_audit_status,
        `Audit：${auditSourceStatus ?? "空"}；索引：${object.source_audit_status ?? "空"}。`,
        "同步更新Manifest与Audit中的原件审计状态。",
      );
      if (object.file_path) {
        assert(
          `${object.id} Audit文件路径`,
          auditSection.body.includes(object.file_path),
          object.file_path,
          "在Audit逐项判断中登记实际Foundation或Draft路径。",
        );
      }
    }

    const lifecycleValid =
      object.lifecycle_status === null || LIFECYCLE_STATUSES.has(object.lifecycle_status);
    assert(
      `${object.id}生命周期状态`,
      lifecycleValid && object.lifecycle_status !== "not_found",
      object.lifecycle_status ?? "未设置生命周期；仅登记原件审计状态。",
      "只使用AR-004批准的生命周期状态；not_found只能用于原件审计状态。",
    );

    const auditValid =
      object.source_audit_status === null ||
      SOURCE_AUDIT_STATUSES.has(object.source_audit_status);
    assert(
      `${object.id}原件审计状态`,
      auditValid,
      object.source_audit_status ?? "原件或候选已经取得。",
      "当前只允许not_found，且必须写入原件审计状态字段。",
    );

    if (object.source_audit_status === "not_found") {
      warn(
        `${object.id}原件未取得`,
        `${object.title}尚未取得可核验原件。`,
        "由项目总架构师提供具体原件及批准证据后，再按两步确认制处理。",
      );
    }

    if (!object.file_path) {
      assert(
        `${object.id}空路径规则`,
        object.source_audit_status === "not_found" && object.sha256 === null,
        "未取得原件，文件路径和SHA-256保持空值。",
        "补充真实文件路径与校验值，或将原件审计状态设为not_found。",
      );
      continue;
    }

    const absolutePath = resolve(REPO_ROOT, object.file_path);
    let actualHash = null;
    try {
      actualHash = await sha256(absolutePath);
      pass(`${object.id}文件存在`, object.file_path);
    } catch (cause) {
      error(
        `${object.id}文件存在`,
        `${object.file_path}无法读取：${cause.message}`,
        "恢复文件或修正Manifest登记路径。",
      );
    }

    if (actualHash) {
      assert(
        `${object.id} SHA-256`,
        actualHash === object.sha256,
        actualHash === object.sha256
          ? "校验值一致。"
          : `实际${actualHash}；登记${object.sha256 ?? "空"}`,
        "不得自动修正文；确认文件来源后更新Manifest校验值或恢复批准原件。",
      );
    }

    if (object.lifecycle_status === "approved") {
      assert(
        `${object.id}正式目录`,
        object.file_path.startsWith("knowledge/foundation/v1.0/") &&
          !object.file_path.includes("/drafts/"),
        object.file_path,
        "将Approved原件按批准路径入正式目录，并更新Manifest。",
      );
      assert(
        `${object.id}批准记录`,
        Boolean(object.approved_at && object.approval_record),
        `批准日期${object.approved_at ?? "空"}；批准记录${object.approval_record ? "已登记" : "空"}。`,
        "补充真实批准日期和批准记录，不得猜测。",
      );
    }

    if (object.lifecycle_status === "draft") {
      assert(
        `${object.id} Draft隔离`,
        object.file_path.startsWith("knowledge/foundation/drafts/"),
        object.file_path,
        "将Draft移出正式目录，保留在Draft隔离区。",
      );
    }

    for (const relationship of object.related_objects) {
      const target = index.objects.find((candidate) => candidate.id === relationship.id);
      assert(
        `${object.id}关联${relationship.id}`,
        Boolean(target) && target.lifecycle_status === relationship.lifecycle_status,
        target
          ? `目标存在，状态${target.lifecycle_status ?? "空"}。`
          : "目标未登记。",
        "在Manifest中修正关联ID或目标状态后重新生成索引。",
      );
    }
  }

  const formalFiles = (await Promise.all(FORMAL_ROOTS.map(markdownFiles))).flat();
  const draftFiles = await markdownFiles(DRAFT_ROOT);
  const indexedPaths = new Set(
    index.objects.map((object) => object.file_path).filter((path) => path !== null),
  );

  assert(
    "正式目录文件登记",
    formalFiles.every((path) => indexedPaths.has(path)),
    `${formalFiles.length}个Markdown知识原件均已进入索引。`,
    `将遗漏文件登记到Manifest：${formalFiles
      .filter((path) => !indexedPaths.has(path))
      .join("、")}`,
  );
  assert(
    "Draft目录文件登记",
    draftFiles.every((path) => indexedPaths.has(path)),
    `${draftFiles.length}个Draft均已进入索引。`,
    `将遗漏Draft登记到Manifest：${draftFiles
      .filter((path) => !indexedPaths.has(path))
      .join("、")}`,
  );

  const indexedFormal = index.objects.filter((object) => object.lifecycle_status === "approved");
  const indexedDrafts = index.objects.filter((object) => object.lifecycle_status === "draft");
  assert(
    "正式目录与Approved数量",
    formalFiles.length === indexedFormal.length,
    `正式文件${formalFiles.length}；Approved索引${indexedFormal.length}。`,
    "检查正式目录是否混入Draft，或Manifest是否漏登Approved文件。",
  );
  assert(
    "Draft目录与Draft数量",
    draftFiles.length === indexedDrafts.length,
    `Draft文件${draftFiles.length}；Draft索引${indexedDrafts.length}。`,
    "检查Draft目录是否漏登或混入非Draft文件。",
  );

  const expectedCounts = {
    ...index.summary.lifecycle,
    not_found: index.summary.source_audit.not_found,
  };
  verifyDocumentCounts("README", readme, expectedCounts);
  verifyDocumentCounts("Manifest", manifest, expectedCounts);
  verifyDocumentCounts("Audit", audit, expectedCounts);
}

await validate();

if (process.argv.includes("--write-report")) {
  await writeFile(resolve(REPO_ROOT, REPORT_PATH), buildReport(), "utf8");
  console.log(`校验报告已生成：${REPORT_PATH}`);
}

console.log(
  `Foundation校验：${results.passed.length}通过，${results.warnings.length}警告，${results.errors.length}错误。`,
);

if (results.errors.length > 0) {
  process.exitCode = 1;
}
