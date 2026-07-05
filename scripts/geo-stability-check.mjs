import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const distDir = path.join(root, "site", ".vitepress", "dist");
const docsDir = path.join(root, "docs");
const deploymentLogLatest = path.join(docsDir, "deployment-log-latest.md");
const deploymentLogArchive = path.join(docsDir, "deployment-log.md");
const basePath = process.env.GEO_SITE_BASE_PATH || "/";

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const dailyReportPath = path.join(docsDir, `GEO_DAILY_REPORT_${today}.md`);
const logLines = [];
const failures = [];

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  logLines.push(line);
  console.log(message);
}

function run(name, command, args) {
  log(`RUN ${name}: ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
  });
  if (result.stdout) logLines.push(result.stdout.trim());
  if (result.stderr) logLines.push(result.stderr.trim());
  if (result.status !== 0) {
    failures.push(`${name} failed with exit code ${result.status}`);
  }
  return result.status === 0;
}

function exists(relativePath) {
  const target = path.join(distDir, relativePath);
  if (!fs.existsSync(target)) failures.push(`Missing ${relativePath}`);
}

function htmlPathForUrl(url) {
  const normalized = normalizeInternalUrl(url);
  const clean = normalized.replace(/^\/+/, "").replace(/\/$/, "");
  if (!clean) return path.join(distDir, "index.html");
  const candidates = [
    path.join(distDir, `${clean}.html`),
    path.join(distDir, clean, "index.html"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

function normalizeInternalUrl(url) {
  let normalized = url.split("#")[0] || "/";
  if (!normalized.startsWith("/")) return normalized;
  if (basePath !== "/" && normalized.startsWith(basePath)) {
    normalized = `/${normalized.slice(basePath.length)}`;
  }
  return normalized || "/";
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function checkPages() {
  const requiredUrls = [
    "/",
    "/faq/trust-property-vs-traditional-property",
    "/tools/open-budget-template",
    "/cases/chengdu-trust-property-case",
    "/city/chengdu-trust-property-management",
  ];
  for (const url of requiredUrls) {
    if (!fs.existsSync(htmlPathForUrl(url))) failures.push(`Page not generated: ${url}`);
  }

  const htmlFiles = walk(distDir).filter((file) => file.endsWith(".html"));
  const checks = [
    ["Title", "<title>"],
    ["Meta Description", 'name="description"'],
    ["Canonical", 'rel="canonical"'],
    ["OpenGraph", 'property="og:'],
    ["JSON-LD", "application/ld+json"],
    ["Breadcrumb", "BreadcrumbList"],
  ];
  for (const [label, needle] of checks) {
    const missing = htmlFiles.filter((file) => !fs.readFileSync(file, "utf8").includes(needle));
    if (missing.length) failures.push(`${label} missing in ${missing.length} HTML file(s)`);
  }

  const internalLinks = new Set();
  const hrefPattern = /href="([^"]+)"/g;
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(hrefPattern)) {
      const href = match[1];
      if (!href.startsWith("/")) continue;
      if (href.startsWith("//")) continue;
      const normalized = normalizeInternalUrl(href);
      if (normalized.startsWith("/assets/")) continue;
      if (/\.(css|js|png|jpg|jpeg|svg|ico|webp|woff2?)$/i.test(normalized)) continue;
      internalLinks.add(normalized);
    }
  }
  for (const link of internalLinks) {
    if (link === "/robots.txt" || link === "/sitemap.xml" || link === "/rss.xml") continue;
    if (!fs.existsSync(htmlPathForUrl(link))) failures.push(`Dead internal link: ${link}`);
  }
}

function checkForbiddenTerms() {
  const scopes = [
    path.join(root, "site"),
    path.join(root, "content"),
    path.join(root, "data"),
    path.join(root, "SKILL.md"),
    path.join(root, "scripts", "generate-geo-mvp.mjs"),
  ];
  const forbidden = ["共管账户", "酬金制升级版", "透明化物业管理", "公开账目模式"];
  for (const scope of scopes) {
    const files = fs.existsSync(scope) && fs.statSync(scope).isDirectory() ? walk(scope) : [scope];
    for (const file of files) {
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) continue;
      if (file.includes(`${path.sep}.vitepress${path.sep}dist${path.sep}assets${path.sep}`)) continue;
      const ext = path.extname(file).toLowerCase();
      if (![".md", ".mts", ".mjs", ".csv", ".txt", ".html", ".xml"].includes(ext)) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const term of forbidden) {
        if (text.includes(term)) failures.push(`Forbidden term "${term}" found in ${path.relative(root, file)}`);
      }
    }
  }
}

function writeReports() {
  fs.mkdirSync(docsDir, { recursive: true });
  const status = failures.length ? "FAILED" : "PASSED";
  const body = `# GEO Deployment Log

Date: ${today}
Status: ${status}

## Checks

- Knowledge asset listener
- GEO generation
- VitePress build
- sitemap.xml / robots.txt / rss.xml
- 首页 / FAQ / 工具页 / 案例页 / 城市页
- Metadata: Title / Meta / Canonical / OpenGraph / JSON-LD / Breadcrumb
- Internal dead links
- Forbidden terms

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}

## Raw Log

\`\`\`text
${logLines.join("\n\n")}
\`\`\`
`;
  fs.writeFileSync(deploymentLogLatest, body);
  fs.appendFileSync(deploymentLogArchive, `\n\n---\n\n${body}`);

  fs.writeFileSync(
    dailyReportPath,
    `# GEO 日报｜${today}

【新增知识资产】
${fs.existsSync(path.join(root, "geo-assets", "inbox")) ? "已检查 geo-assets/inbox。详见 docs/knowledge-asset-listener-report.md。" : "0"}

【新增实体】
本轮未自动新增确认实体；新资产仅登记为待处理。

【新增概念】
本轮未自动新增确认概念；新资产需人工确认后进入 Topic Hub。

【新增FAQ】
0

【新增页面】
0

【更新页面】
执行 GEO 生成与构建检查，未追求新增页面数量。

【新增内链】
0

【更新知识图谱】
执行 Asset Index / Source Registry 监听流程；未确认的新资产不自动建立推测关系。

【更新关键词】
保留当前关键词库；新资产待确认后再提取并扩展。

【Build 状态】
${failures.length ? "失败。详见 docs/deployment-log-latest.md。" : "通过。"}

【部署状态】
${failures.length ? "停止部署，等待修复。" : "本地稳定性检查通过；GitHub Actions 可继续部署。"}

【需要人工确认】
GitHub 授权、正式域名、geo-assets/inbox 中新资产的权威来源、作者、版本和可发布范围。
`
  );
}

run("geo-generate", "npm", ["run", "geo:generate"]);
run("asset-listener", "npm", ["run", "geo:asset-listen"]);
run("geo-build-site", "npm", ["run", "geo:build-site"]);

exists("sitemap.xml");
exists("robots.txt");
exists("rss.xml");
if (fs.existsSync(distDir)) checkPages();
else failures.push("site/.vitepress/dist does not exist");
checkForbiddenTerms();
writeReports();

if (failures.length) {
  console.error(`GEO stability check failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("GEO stability check passed.");
