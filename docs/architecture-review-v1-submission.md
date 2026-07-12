# Architecture Review V1.0 Submission

- 项目：中国信托制物业发展平台
- 任务：提交平台开发成果，接受第一次架构审查
- 提交人：Codex
- 日期：2026-07-13
- 状态：Draft，提交 ChatGPT 编制《Development Review Report V1.0》
- GitHub 仓库：`https://github.com/huirongy0609/-`
- 当前 PR：`https://github.com/huirongy0609/-/pull/2`
- 当前分支：`codex-platform-engineering-architecture-v1`

## 一、项目目录结构

以下目录树基于当前工作区和 PR #2 分支整理，省略 `.git/`、`node_modules/`、`.next/`、缓存目录和构建依赖目录。

```text
.
├── .github/
│   └── workflows/
│       └── geo-pages.yml
├── app/
│   ├── books/
│   ├── cases/
│   ├── demo/
│   ├── galaxy/
│   ├── golden-steward-world/
│   ├── intelligence/
│   ├── knowledge/
│   ├── map/
│   ├── newbie-village/
│   ├── parking-conflict-demo/
│   ├── reports/
│   ├── research/
│   ├── student/
│   ├── submit/
│   ├── trust-world/
│   ├── village/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CaseMatchPanel.tsx
│   ├── CityNetworkMap.tsx
│   ├── CityRuntimeLayer.tsx
│   ├── DemoExperienceChrome.tsx
│   ├── FirstGateMvp.tsx
│   ├── GoldenStewardMvpPages.tsx
│   ├── GoldenStewardWorld.tsx
│   ├── HomeCommandCenter.tsx
│   ├── KnowledgePortalMvp.tsx
│   ├── NewbieVillageExperience.tsx
│   ├── ParkingConflictFlow.tsx
│   ├── TrustRulePanel.tsx
│   └── TrustWorldEntrance.tsx
├── content/
├── content-factory/
├── data/
│   ├── asset-index.csv
│   ├── cases.json
│   ├── categories.json
│   ├── cities.json
│   ├── entity-library.csv
│   ├── index-monitor.csv
│   ├── intelligence.json
│   ├── keyword-page-groups.csv
│   ├── keywords.csv
│   ├── knowledge-graph.csv
│   ├── page-quality-audit.csv
│   ├── parking-conflict-demo.json
│   ├── publish-log.csv
│   ├── source-registry.csv
│   ├── stats.json
│   └── topic-hub.csv
├── docs/
├── geo-assets/
├── geo-publishing/
├── geo-research/
├── gt-geo/
│   ├── content-factory/
│   ├── daily-reports/
│   ├── growth-paths/
│   ├── knowledge-nodes/
│   ├── question-bank/
│   └── standard-answer-library/
├── handoffs/
├── knowledge-base/
│   ├── books/
│   ├── docs/
│   ├── registry/
│   ├── schema/
│   └── *.md
├── lib/
│   ├── domain/
│   ├── repositories/
│   ├── knowledge-assets.ts
│   ├── scriptGenerator.ts
│   └── types.ts
├── mock-data/
├── public/
├── release-packages/
├── remotion/
├── scripts/
├── site/
│   ├── .vitepress/
│   ├── articles/
│   ├── books/
│   ├── cases/
│   ├── city/
│   ├── consulting/
│   ├── courses/
│   ├── faq/
│   ├── public/
│   ├── tools/
│   └── wiki/
├── trust-property-site/
├── types/
├── video_build/
└── video_review/
```

说明：

- 当前未发现 `packages/` 目录。
- 当前未发现 `app/api/` 下的 API 路由文件。
- `site/.vitepress/dist/` 是构建产物，建议后续确认是否继续入库。

## 二、系统架构说明

| 项目 | 当前真实状态 |
|---|---|
| 前端框架 | Next.js 14、React 18、TypeScript；另有 VitePress 静态站点 `site/` |
| 后端框架 | 未建立独立后端框架；Next.js 当前主要作为页面与服务端读取层使用 |
| 数据存储方式 | 文件驱动：JSON、CSV、Markdown、TypeScript schema |
| API 组织方式 | 未发现稳定 `app/api` 实现；当前通过 server page -> repository -> JSON/Markdown 读取 |
| 权限模型 | 未实现登录、用户、角色、权限或后台审批 |
| 数据校验 | `lib/domain/*` 与 `knowledge-base/registry/registry.ts` 使用 zod / TypeScript 类型进行基础校验 |
| 部署方式 | GitHub Pages / VitePress GEO 站点自动化已存在；Next.js 站点部署方式未在当前代码中固定 |
| 自动化 | `.github/workflows/geo-pages.yml`、`scripts/geo-*`、`scripts/build-site.mjs` |

当前稳定运行边界仍接近 `BASELINE_ARCHITECTURE.md`：页面从 server repositories 读取本地 JSON，zod 校验留在服务端，客户端组件只接收可序列化 props。当前平台还没有形成“数据库 + API + 权限 + 后台”的产品级后端。

## 三、数据库与数据模型

当前没有正式数据库、ORM、迁移脚本或数据表。已有数据模型属于文件驱动模型。

| 数据对象 | 实现状态 | 当前字段设计 |
|---|---|---|
| Knowledge Object / Knowledge Asset | 部分实现 | `id`、`title`、`type`、`summary`、`tags`、`authors`、`source`、`updated`、`cover`、`relations`、`status`、`body`、`relationEdges` |
| JD | 未实现 | 未发现稳定数据模型 |
| GT | 部分实现 | `gt-geo/knowledge-nodes/GT-KN-*.md` 已有节点文件；工程 schema 未统一 |
| Case | 已实现基础版 | `id`、`title`、`city`、`district`、`submitter`、`subjectType`、`communityType`、`problem`、`model`、`actions`、`result`、`risks`、`tags`、`publishedAt`、`status` |
| Course | 部分实现 | `site/courses/` 有页面内容；未发现 Course schema、API 或数据库对象 |
| Product | 未实现 | 未发现 Product schema、API 或数据库对象 |
| User | 未实现 | 未发现登录、用户表、会话或角色模型 |
| Evidence Package | 未实现 | `data/source-registry.csv`、`docs/knowledge-source-governance.md` 有来源治理线索，但没有 Evidence Package 对象 |
| Region / CityRegion | 已实现基础版 | `id`、`name`、`province`、`caseCount`、`policyCount`、`organizationCount`、`status`、`latestUpdate`、`tags`、`x`、`y` |
| Intelligence | 已实现基础版 | `id`、`title`、`category`、`region`、`city`、`source`、`summary`、`tags`、`publishedAt`、`url`、`aiSummaryStatus` |
| Submission | 部分实现 | 表单 DTO 与实体转换已存在；缺少持久化、审核流和后台 |

核心代码位置：

- `lib/domain/case.ts`
- `lib/domain/intelligence.ts`
- `lib/domain/region.ts`
- `lib/domain/submission.ts`
- `lib/repositories/cases.ts`
- `lib/repositories/intelligence.ts`
- `lib/repositories/regions.ts`
- `lib/repositories/submissions.ts`
- `knowledge-base/registry/registry.ts`
- `knowledge-base/schema/relation.ts`
- `knowledge-base/schema/book.ts`

## 四、Knowledge Object 实现情况

《中国信托制物业知识对象标准 V1.0》目前没有完整工程落地。现状是“Knowledge Asset Registry 基础版”。

| 标准能力 | 当前状态 | 已实现位置 | 说明 |
|---|---|---|---|
| ObjectID | 已实现基础版 | `knowledge-base/registry/registry.ts` | frontmatter 必填 `id` |
| ObjectType | 已实现基础版 | `assetTypes` | 支持 `Book / Report / Research / Case / Map / Standard / Toolkit / Article` |
| Version | 未实现 | 无 | 目前只依赖 Git 历史，没有对象级 version 字段 |
| Metadata | 部分实现 | asset frontmatter | 已有标题、摘要、标签、作者、来源、更新时间、封面 |
| Reference | 部分实现 | `relations`、`relationEdges` | 支持关系 token 解析，关系类型包括 `references`、`derivedFrom`、`belongsTo`、`relatedTo`、`generatedBy`、`implements` |
| Evidence | 未实现 | 无 | 未形成证据包、证据项、来源可信度、采集时间、证据状态 |
| Lifecycle | 部分实现 | `status` | 有自由文本 `status`，但没有强制 Draft / Review / Approved / Superseded / Archived |
| Tags | 已实现基础版 | `tags` | 必填数组字段 |
| Reviewer / Approver | 未实现 | 无 | 未发现 reviewer、approver、approved_at 字段 |
| Source Traceability | 部分规则实现 | `docs/knowledge-source-governance.md` | 有 `knowledge_source` 推荐形态，但未纳入 registry 校验 |
| AI Citation Boundary | 未实现 | 无 | 未形成 Citation Pack、Retrieval API、Answer Guardrails |

当前真实结论：

- 已实现：ObjectID、ObjectType、基础 Metadata、Tags、Reference 基础关系。
- 部分实现：Lifecycle、Source Traceability。
- 未实现：Version、Evidence Package、审批字段、AI 引用边界、对象级质量门禁。

## 五、网站页面

### Next.js 页面

| 页面 | 路径 | 完成程度 |
|---|---|---|
| 首页 | `/` | 进行中，已有 MVP 页面 |
| 全国地图 | `/map` | 进行中 |
| AI 情报 | `/intelligence` | 进行中，展示 AI 摘要状态字段，但不是 AI 搜索 |
| 案例库 | `/cases` | 进行中 |
| 案例详情 | `/cases/[id]` | 进行中 |
| 共建提交 | `/submit` | 进行中，缺少持久化 |
| 知识中心 | `/knowledge` | 进行中 |
| 图书 | `/books` | 进行中 |
| 研究 | `/research` | 进行中 |
| 报告 | `/reports` | 进行中 |
| 金牌管家成长世界 | `/golden-steward-world/*` | 进行中，偏产品/体验原型 |
| 学员空间 | `/student/*` | 进行中，偏产品/体验原型 |
| 信任世界入口 | `/trust-world` | 进行中，偏体验入口 |
| 登录 | 无 | 未实现 |
| 管理后台 | 无 | 未实现 |
| 搜索 | 无稳定独立页面 | 未实现生产级搜索 |

### VitePress / GEO 静态站

`site/` 下已有 Wiki、FAQ、Articles、Cases、City、Courses、Tools 等内容结构，可由 VitePress 构建并通过 GitHub Pages 工作流部署。

## 六、API

当前未发现稳定 API。

| API 类型 | 状态 | 说明 |
|---|---|---|
| REST API | 未实现 | 未发现 `app/api` 路由文件 |
| GraphQL API | 未实现 | 未发现 GraphQL server 或 schema |
| Search API | 未实现 | 未发现生产级搜索接口 |
| AI Retrieval API | 未实现 | 未发现 AI 检索或引用接口 |
| Submission API | 未实现 | 当前提交页缺少持久化 API |
| Repository functions | 已实现基础版 | `lib/repositories/*` 是服务端读取层，不是公开 API |

## 七、下一阶段开发计划

### P0（必须，两周内优先）

1. 确认第一发布面：Next.js `app/`、VitePress `site/`、`trust-property-site/` 的职责边界。
2. 建立 Knowledge Object 最小工程 schema：状态枚举、版本、source trace、reviewer、approver、evidence refs。
3. 建立 Approved File Register 草案，作为“已批准知识不可由工程侧擅自修改”的工程门禁基础。
4. 增加知识资产 frontmatter 校验脚本，先检查必填字段、状态枚举、关系目标是否存在。
5. 建立目录健康检查，识别重复内容源、构建产物入库、未归属目录和高风险路径。

### P1（重要）

1. 设计静态搜索索引：从 `knowledge-base/`、`site/`、`gt-geo/` 生成统一索引。
2. 建立 Source Registry 与 Knowledge Object 的映射关系。
3. 为 GT-GEO Knowledge Node 增加统一元数据和映射字段。
4. 为提交页设计最小持久化方案，但暂不接数据库，先形成接口契约。
5. 补齐 PR 模板中的 Architecture Review checklist。

### P2（后续）

1. 设计登录、角色、权限、审核后台。
2. 设计数据库化迁移方案。
3. 设计 AI Retrieval API、Citation Pack 和 Answer Guardrails。
4. 建设课程、产品、用户、客户成功等产品面数据模型。
5. 将内容工厂输出接入审核队列，而不是直接进入正式知识库。

## 八、提交方式

本次提交提供以下可审核材料：

- GitHub 仓库：`https://github.com/huirongy0609/-`
- 当前 PR：`https://github.com/huirongy0609/-/pull/2`
- 架构建议稿：`docs/platform-engineering-architecture-v1.md`
- 开发状态报告：`docs/development-status-report-v1.md`
- 本次审查提交包：`docs/architecture-review-v1-submission.md`
- 系统架构持续文档：`ARCHITECTURE.md`
- 路线图持续文档：`ROADMAP.md`
- 变更记录持续文档：`CHANGELOG.md`
- 本次 handoff：`handoffs/to-chatgpt/HANDOFF-2026-005.md`

## 九、给 ChatGPT 的审查提示

请重点审查：

1. 当前工程是否适合继续单仓库推进。
2. `site/`、`app/`、`trust-property-site/` 的职责边界如何收敛。
3. Knowledge Asset Registry 是否可作为 Knowledge Object V1.0 的工程基础。
4. 是否应优先做 Approved File Register 和知识对象校验脚本。
5. 是否允许在未引入数据库前继续文件驱动。
6. 是否需要将 `site/.vitepress/dist/` 等构建产物移出正式源码管理。
