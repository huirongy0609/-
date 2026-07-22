# 中国信托制物业发展平台工程总体架构

Status: Draft
Version: V1.0 建议稿
Date: 2026-07-12
Owner: Codex
Reviewer: ChatGPT
Approver: 杨慧荣

## 0. 文件定位

本文是“中国信托制物业发展平台”的工程总体架构建议稿。

它不是功能开发任务书，不直接启动新页面、小程序、AI 问答、数据库或后台系统。

本文与即将形成的《中国信托制物业发展平台总体建设纲要 V1.0》是上下位关系：

- 《中国信托制物业发展平台总体建设纲要 V1.0》是平台最高规划文件，负责定义平台使命、战略边界、阶段目标、业务体系、内容体系、产品体系和总体治理原则。
- 本文是总体建设纲要之下的工程专项架构，只回答工程模块、数据契约、协作链路、技术演进、质量控制和仓库治理问题。
- 如本文与总体建设纲要发生不一致，以总体建设纲要为准；本文应作为工程侧执行细则修订，不得替代总体建设纲要。
- 本文不批准任何新功能启动。任何新功能仍需进入任务、决策、PR 和项目总架构师批准流程。

本文回答：

- 平台应划分哪些工程模块。
- 各模块之间如何协作。
- 哪些先开发，哪些后开发。
- 如何支持未来 AI、知识中心、小程序、课程、搜索、GEO 等长期发展。
- GitHub 仓库未来应如何组织。

## 1. 工程总原则

如果本平台要运行十年，工程建设不能只围绕页面和活动内容展开，而应围绕“可信知识资产的长期生产、治理、检索、分发和复用”展开。

建议采用以下总原则：

1. GitHub 是正式事实来源。
2. 书稿、标准、案例、知识页、GEO 节点和网站页面必须可追溯。
3. 网站是第一发布面，微信、视频号、FAQ、SEO 摘要和其它渠道是派生输出。
4. AI 只能引用已登记、已溯源、可审核的知识资产。
5. 先文件驱动，后数据库化；先结构稳定，后自动化增强。
6. 先建立知识资产模型和质量检查，再建设 AI 问答和小程序。
7. 工程模块之间通过清晰数据契约协作，不通过页面之间相互复制内容协作。
8. 已批准知识不可由工程侧擅自修改；任何涉及 Approved 内容的变更必须进入审核、批准和 PR 门禁。

## 2. 平台工程模块划分

建议将平台划分为十一个长期模块。

```text
中国信托制物业发展平台
├── 01 governance-office      项目治理与协作办公室
├── 02 source-library         权威来源与书稿映射
├── 03 knowledge-registry     永久知识资产注册中心
├── 04 site-publication       网站与公开发布层
├── 05 geo-growth-engine      GEO 增长与问题路径系统
├── 06 content-factory        内容复用与传播生产系统
├── 07 search-index           搜索、索引与推荐层
├── 08 ai-reference-layer     AI 引用与问答能力层
├── 09 product-surfaces       小程序、课程、工具、客户成功等产品面
├── 10 automation-quality     自动化、质量检查与部署
└── 11 platform-ops           版本、权限、发布和运营治理
```

### 2.1 governance-office

职责：

- 管理项目角色、任务、审批、决策、PR、交接和版本记录。
- 维护 GitHub Issue、PR、Project、Labels。
- 记录哪些文件是 Draft、Review、Approved、Superseded、Archived。

当前对应：

- `PROJECT_CHARTER.md`
- `ROADMAP.md`
- `CONTRIBUTING.md`
- `governance/`
- `tasks/`
- `handoffs/`
- `.github/`

建议：

- No.001 PR 合并后，此模块成为所有后续协作的必经入口。
- 优先建立 Approved File Register，避免 Codex 误改已批准内容。
- 将 Approved File Register 作为 PR 审核门禁的数据来源之一。
- 对涉及已批准知识、标准、书稿映射、来源治理和正式口径的路径建立受保护清单，清单可先文件化，后续再接入 CI 检查。

### 2.2 source-library

职责：

- 管理权威来源、书稿映射、覆盖率、修订建议和引用边界。
- 确保网站知识页和 AI 引用可以回到书、章节、案例或标准。

当前对应：

- `docs/knowledge-source-governance.md`
- `docs/book-mapping-report-trust-property-governance-foundation.md`
- `docs/book-coverage-trust-property-governance-foundation.md`
- `docs/revision-notes-trust-property-governance-foundation.md`
- `knowledge-base/books/content/`
- `knowledge-base/books/book-engine.ts`

建议：

- 所有新知识页必须带 Book Traceability 或 Source Traceability。
- 不重复解析书稿。普通运营使用 Book Mapping Report。
- 新书进入平台时，必须同时建立 Mapping Report、Coverage Tracker 和 Revision Notes。

### 2.3 knowledge-registry

职责：

- 统一注册 Book、Report、Research、Case、Map、Standard、Toolkit、Article 等永久知识资产。
- 提供稳定 ID、frontmatter schema、关系边、状态、来源和更新时间。
- 成为未来搜索、AI、推荐、小程序和课程的共同数据底座。

当前对应：

- `knowledge-base/`
- `knowledge-base/docs/ASSET_REGISTRY.md`
- `knowledge-base/docs/KNOWLEDGE_GRAPH.md`
- `knowledge-base/schema/`
- `knowledge-base/registry/`
- `lib/knowledge-assets.ts`

建议：

- 短期继续文件驱动，不急于引入数据库。
- 中期建立 `status`、`source_trace`、`review_status`、`approved_by`、`approved_at` 等元数据。
- 长期把 Registry 抽象为可替换数据源，使页面不依赖 Markdown 文件系统。

### 2.4 site-publication

职责：

- 承载官网、知识中心、百科、FAQ、案例、热点、工具和课程入口。
- 将永久知识资产转化为公开可读、可搜索、可引用的页面。

当前对应：

- `site/`
- `trust-property-site/`
- `app/`
- `content/`
- `scripts/build-site.mjs`
- `.github/workflows/geo-pages.yml`

建议：

- 短期对 `site/`、`trust-property-site/`、`app/`、`content/` 的边界进行审查，形成目录职责表、内容来源表、发布路径表和风险清单。
- 在审查和决策完成前，不迁移、不删除、不合并这些并行目录。
- 第一发布面的确认应通过决策记录完成，不能在工程 PR 中顺手完成目录收敛。
- 页面内容应从知识资产或站点内容源生成，不应在多个目录手工复制同一知识正文。
- 网站层只做表达、路由和用户体验，不应成为专业定义的最终来源。

### 2.5 geo-growth-engine

职责：

- 从真实行业问题出发，维护 Question Bank、Knowledge Node、Growth Path、GEO 状态和流量路径。
- 把外部问题连接到已确认知识资产、书、课程、咨询、工具和合作入口。

当前对应：

- `gt-geo/`
- `geo-research/`
- `geo-publishing/`
- `data/keywords.csv`
- `data/keyword-page-groups.csv`
- `data/index-monitor.csv`
- `data/page-quality-audit.csv`
- `scripts/geo-*`

建议：

- Growth Path 是 GEO 的最高对象，Question 只是入口，Knowledge Node 是回答对象。
- GEO 节点不得直接生成未经确认的标准答案。
- 每个 GEO 输出最终应能映射到知识资产、网站页面或待 Work 确认任务。

### 2.6 content-factory

职责：

- 把母稿、知识页、案例和观点转化为公众号、短视频、小红书、标题、封面提示词和其它传播格式。
- 支持人工审核后的内容复用，不替代知识生产中心。

当前对应：

- `content-factory/`
- `content-factory/prompts/`
- `content-factory/brand_os/`
- `content-factory/style_training/`
- `content-factory/content_library/`
- `content-factory/run_pipeline.py`

建议：

- 内容工厂的输入应优先来自网站永久知识页或 Work 已审核母稿。
- 输出必须保留来源字段和审核状态。
- 不建议让内容工厂直接写入正式知识库。

### 2.7 search-index

职责：

- 建立关键词索引、全文搜索、关系搜索、章节定位、推荐阅读和站内导航。
- 为 AI 检索和用户搜索共用同一套索引基础。

当前对应：

- `data/knowledge-graph.csv`
- `data/entity-library.csv`
- `data/source-registry.csv`
- `data/topic-hub.csv`
- `data/page-quality-audit.csv`
- `knowledge-base/registry/`

建议：

- 第一阶段使用静态索引文件，支持构建期生成。
- 第二阶段引入轻量搜索引擎，例如本地构建 JSON 索引或静态站点搜索。
- 第三阶段再考虑向量索引和混合检索。
- 搜索结果必须展示来源、更新时间、状态和关系，不只展示标题。

### 2.8 ai-reference-layer

职责：

- 为未来 AI 问答、AI 摘要、AI 引用、AI 写作辅助提供可信检索和引用边界。
- 防止 AI 自行创造信托制物业专业口径。

建议能力：

- Citation Pack：给 AI 的可引用材料包。
- Retrieval API：按问题检索相关知识资产、章节、案例和标准。
- Answer Guardrails：回答前检查来源、状态和禁止事项。
- Review Queue：无法确认的问题进入 Work 或 ChatGPT 审核。
- Evaluation Set：用标准问题集检测 AI 回答是否越界。

AI 接入原则：

- AI 先检索，后回答。
- 无来源则不形成正式答案。
- Draft 资产可用于内部辅助，Approved 资产才可用于正式公开答案。
- 所有 AI 生成内容必须保留输入来源、模型版本、生成时间和审核状态。

### 2.9 product-surfaces

职责：

- 承接未来小程序、课程、工具、客户成功、认证、案例库、咨询入口等产品面。
- 每个产品面只读取稳定知识资产和 API，不直接复制权威内容。

潜在产品面：

- 官网与知识中心。
- 小程序。
- 数字图书阅读器。
- 课程与训练营。
- 工具模板中心。
- 客户成功诊断工具。
- 机构合作入口。
- AI 问答或 AI 导读。

建议：

- 产品面按阶段启用，不一次性建设。
- 小程序和课程不应先于知识资产状态治理和搜索索引。
- 客户成功工具需要明确数据隐私、输入输出边界和审核责任。

### 2.10 automation-quality

职责：

- 自动化构建、质量检查、死链检查、sitemap、RSS、页面质量、知识关系和元数据完整性。
- 为 PR 和日常运营提供工程护栏。

当前对应：

- `.github/workflows/geo-pages.yml`
- `scripts/geo-stability-check.mjs`
- `scripts/refresh-sitemap.mjs`
- `scripts/update-publish-log.mjs`
- `scripts/generate-pages.mjs`

建议检查：

- Markdown frontmatter 完整性。
- Knowledge Asset ID 唯一性。
- relations 目标是否存在。
- Book Traceability 是否存在。
- Approved 文件是否被直接修改。
- 受保护路径是否被工程侧直接修改。
- PR 是否缺少对应任务、决策或交接文件。
- 内链、sitemap、RSS、robots、canonical URL。
- 页面标题、摘要、更新时间、来源字段。
- AI 引用材料包是否只包含允许状态资产。

### 2.11 platform-ops

职责：

- 管理版本、发布、权限、分支、PR、回滚、环境变量、部署和事故记录。
- 将平台从“多人协作文件夹”治理成“长期运行工程系统”。

建议：

- `main` 永远保持可发布。
- 所有正式变更走 Branch -> PR -> Review -> Merge。
- 建立 release notes 和 deployment log。
- 把技术债、迁移计划和审批事项纳入 GitHub Issues。
- 对涉及 Approved 内容的 PR 建立强制审核标记。

## 3. 模块协作关系

建议主链路：

```text
Primary Source / Work 母稿
  ↓
source-library
  ↓
knowledge-registry
  ↓
site-publication
  ↓
search-index
  ↓
ai-reference-layer
  ↓
product-surfaces / content-factory / geo-growth-engine
```

四方职责链路：

```text
Work
  ↓ 产出专业母稿、标准、制度、治理词典、Evidence Package、正式内容草案
ChatGPT
  ↓ 审核内容口径、总体一致性、任务拆解、跨模块协调、需杨老师确认事项
Codex
  ↓ 工程集成、知识入库、页面生成、索引构建、自动化检查、部署与技术交接
杨慧荣
  ↓ 批准关键方向、重大标准、核心口径、阶段进入和重大争议裁决
GitHub
  ↓ 记录任务、决策、PR、交接、版本和审查历史
```

四方协作规则：

- Work 是专业母稿和正式内容的生产中心，不负责工程实现。
- ChatGPT 是总体设计和一致性审核中心，负责判断内容与工程是否偏离平台方向。
- Codex 是工程集成中心，只能基于已确认输入进行结构化、发布、索引、检查和部署。
- 杨慧荣是关键批准人，涉及平台方向、核心定义、重大标准、阶段进入和争议裁决时必须确认。
- Codex 发现内容缺口、结构冲突或工程风险时，应形成任务、决策或交接，不得直接创造专业口径补洞。

运营链路：

```text
真实问题 / 热点案例 / 用户搜索
  ↓
geo-growth-engine
  ↓
ChatGPT 拆解任务
  ↓
Work 生产或确认内容
  ↓
Codex 入库、建页、索引、检查、部署
  ↓
handoff + PR + Review
```

AI 链路：

```text
用户问题
  ↓
search-index 检索
  ↓
ai-reference-layer 组装 Citation Pack
  ↓
Answer Guardrails 检查
  ↓
AI 草稿
  ↓
Review / Publish / Blocked
```

## 4. 阶段路线

### Phase 0：协作与治理稳定

目标：

- 合并 No.001 协作体系。
- 建立 Approved File Register。
- 明确主仓库、分支、PR、Project、Labels。
- 确认本文架构是否作为 V1.0 方向。

首阶段可验收成果：

| 成果 | 验收标准 | 责任建议 |
| --- | --- | --- |
| Approved File Register | 登记文件路径、状态、Owner、Reviewer、Approver、批准时间、保护规则；至少覆盖书稿映射、知识来源治理、标准、站点核心内容和 GEO 运营文件 | ChatGPT + Codex |
| 知识对象最小 Schema | 定义 `id`、`type`、`title`、`summary`、`status`、`source_trace`、`relations`、`updated` 等最小字段，并说明 Draft/Review/Approved 使用规则 | Work + Codex |
| 来源追溯字段 | 为知识页、标准、案例、GEO 节点和 AI 引用材料包设计统一 `source_trace` 或等效字段 | Work + ChatGPT + Codex |
| 目录健康检查 | 输出 `site/`、`trust-property-site/`、`app/`、`content/`、`knowledge-base/`、`gt-geo/` 的职责审查表，不做迁移、删除或合并 | Codex |
| PR 审核门禁 | 建立 PR 模板检查、Approved 路径提示、任务/交接关联检查和构建/文档检查的最小门禁方案 | Codex |

不做：

- 新功能开发。
- 数据库。
- AI 问答。
- 小程序。

### Phase 1：知识资产底座稳定

目标：

- 统一 Knowledge Asset schema。
- 建立 source trace、status、review metadata。
- 完成核心 Book Mapping 和 Coverage Tracker 的运营闭环。
- 建立关系有效性检查。

优先原因：

没有可信知识资产底座，搜索、AI、小程序、课程都会变成内容复制和口径扩散。

### Phase 2：网站第一发布面稳定

目标：

- 确认 `site/`、`trust-property-site/`、`app/`、`content/` 的长期边界。
- 建立知识页模板、热点案例模板、FAQ 模板、工具页模板。
- 建立 sitemap、RSS、内链、推荐阅读、相关案例和相关法规机制。

### Phase 3：搜索与索引

目标：

- 建立站内搜索索引。
- 建立知识资产索引。
- 建立章节、案例、标准、FAQ 的统一检索。
- 建立 GEO 问题到知识资产的映射。

### Phase 4：AI 引用层

目标：

- 建立 Citation Pack。
- 建立 Retrieval API。
- 建立 Answer Guardrails。
- 建立 AI 回答评测集。

进入条件：

- 核心知识资产具备状态、来源、关系和审核字段。
- 搜索索引稳定。
- 已批准内容保护规则可执行。

### Phase 5：产品面扩展

目标：

- 小程序。
- 课程与训练营。
- 数字图书阅读器。
- 工具模板中心。
- 客户成功诊断。
- AI 导读或 AI 问答。

进入条件：

- 每个产品面都有明确数据契约。
- 不直接复制专业口径。
- 能追溯到知识资产或已批准内容。

## 5. GitHub 仓库组织建议

### 5.1 当前阶段：单仓库主协作

建议当前继续使用一个主仓库承载：

- 项目治理。
- 网站与知识资产。
- GEO 运营。
- 内容工厂。
- 自动化脚本。
- 数据文件。

理由：

- 当前资产关系尚未完全稳定。
- 过早拆仓会增加同步成本。
- GitHub 作为统一办公室，现阶段需要集中事实来源。

### 5.2 单仓库内部建议结构

建议逐步收敛为：

```text
/
├── governance/          项目治理、角色、决策、审批
├── tasks/               任务状态
├── handoffs/            交接记录
├── docs/                架构、来源治理、覆盖报告、运营报告
├── knowledge-base/      永久知识资产 Registry / Book Engine
├── site/                第一发布面
├── gt-geo/              GEO Growth Path 系统
├── content-factory/     内容复用生产系统
├── data/                索引、运营数据、质量检查数据
├── scripts/             自动化脚本
├── app/                 Next.js 产品实验或未来应用面
├── components/          前端组件
└── archive/             已归档材料
```

### 5.3 后续可能拆分的仓库

仅当模块边界稳定后，再考虑拆分：

- `trust-property-platform`：主站和应用工程。
- `trust-property-knowledge`：知识资产和书籍结构。
- `trust-property-geo`：GEO 增长工程。
- `trust-property-content-factory`：内容生产自动化。
- `trust-property-infra`：部署、搜索、AI 引用服务。

拆分条件：

- 每个模块有独立发布节奏。
- 数据契约稳定。
- 权限边界不同。
- CI/CD 不再适合同仓执行。

当前不建议拆仓。

## 6. 数据与知识治理建议

### 6.1 稳定 ID

所有知识资产必须有稳定 ID。ID 不使用中文展示标签，不使用城市名作为关系键。

建议 ID 类型：

```text
book-*
book-*.chapter.*
article-*
case-*
standard-*
toolkit-*
geo-kn-*
growth-path-*
source-*
```

### 6.2 状态字段

建议所有正式资产逐步支持：

```yaml
status: Draft | Review | Approved | Superseded | Archived
reviewer:
approver:
approved_at:
source_trace:
```

### 6.3 已批准知识保护机制

“已批准知识不可由工程侧擅自修改”必须落到可执行机制，而不是只写在协作原则中。

建议采用三层控制：

第一层：Approved File Register。

```text
approved-file-register
├── path
├── status
├── owner
├── reviewer
├── approver
├── approved_at
├── protected_scope
└── change_rule
```

要求：

- 登记所有 Approved 文件和受保护片段。
- 标明是否允许工程侧修改 frontmatter、链接、排版或正文。
- 标明修改是否必须由 Work、ChatGPT 或杨慧荣审核。

第二层：受保护路径或受保护片段清单。

建议首批纳入：

- `docs/knowledge-source-governance.md`
- `docs/book-mapping-report-trust-property-governance-foundation.md`
- `docs/book-coverage-trust-property-governance-foundation.md`
- `docs/revision-notes-trust-property-governance-foundation.md`
- `knowledge-base/books/content/`
- `knowledge-base/book-*.md`
- `knowledge-base/report-*.md`
- `knowledge-base/research-*.md`
- `knowledge-base/case-*.md`
- 后续经杨慧荣确认的标准、定义和正式知识页。

第三层：PR 审核门禁。

门禁规则：

- PR 触及受保护路径时，必须在 PR 中声明影响范围。
- PR 触及 Approved 文件正文时，必须关联任务、变更说明、审核人和批准人。
- Codex 可以修改结构、索引、链接、元数据和自动化，但不得绕过审批改写专业定义、标准正文、书稿内容或正式知识口径。
- CI 或脚本可先以 warning 方式提示，稳定后再升级为 blocking check。

### 6.4 关系字段

当前 `relations` 可以继续使用，但中长期建议统一为 typed relation：

```yaml
relations:
  - type: derivedFrom
    target: book-trust-property-governance-foundation.chapter.xxx
  - type: references
    target: case-chengdu-guidong
```

### 6.5 来源追溯字段

建议所有正式知识对象逐步具备来源追溯字段。

最小形态：

```yaml
source_trace:
  primary_source:
    type:
    id:
    title:
    section:
  relation:
  evidence:
  review_status:
```

用途：

- 支持网站页面说明来源。
- 支持搜索结果展示可信度。
- 支持 AI Citation Pack 只读取可引用材料。
- 支持发现页面内容与书稿或标准冲突。

## 7. API 与服务演进建议

当前不建议立刻建设后端 API。

建议演进顺序：

1. 文件 Registry API：构建期或服务端函数读取 Markdown/CSV/JSON。
2. Search API：提供站内搜索和知识资产检索。
3. Citation API：给 AI 提供可引用材料包。
4. Product API：给小程序、课程、工具、客户成功读取稳定数据。
5. Admin API：最后再考虑后台编辑、审核和权限。

不要从 Admin API 或数据库后台开始。

## 8. AI 接入建议

AI 接入分四层：

### 8.1 AI 辅助生产

用途：

- 帮 Work 和 ChatGPT 生成草稿、改写、摘要、任务拆解。

边界：

- 不能直接发布。
- 不能创造专业口径。
- 不能覆盖权威来源。

### 8.2 AI 检索引用

用途：

- 基于已登记知识资产回答问题。
- 给出引用来源。

边界：

- 只引用允许状态资产。
- 无来源则回答“不足以形成正式答案”。

### 8.3 AI GEO 监测

用途：

- 发现外部问题、搜索趋势、AI 引用表现、页面缺口。

边界：

- 监测结果进入任务队列，不直接生成正式内容。

### 8.4 AI 产品能力

用途：

- AI 导读、AI 问答、AI 课程助手、AI 客户成功诊断。

进入条件：

- 搜索索引、Citation Pack、审核规则、评测集稳定。

## 9. 搜索建设建议

搜索应分三步：

### 9.1 站内静态搜索

输入：

- 网站页面。
- Knowledge Asset Registry。
- FAQ。
- 案例。
- 工具。

输出：

- 标题、摘要、标签、类型、更新时间、来源、URL。

### 9.2 结构化知识搜索

能力：

- 按 Book/Chapter/Case/Standard/Toolkit 搜索。
- 按 relation 搜索。
- 按 Growth Path 搜索。
- 按 source trace 搜索。

### 9.3 混合检索

能力：

- 关键词检索 + 语义检索。
- 引用材料包排序。
- AI 问答上下文组装。

前提：

- 知识资产状态和来源治理稳定。

## 10. 主要工程风险

### 风险 1：多个内容目录并行扩散

表现：

- `site/`、`trust-property-site/`、`app/`、`content/`、`knowledge-base/` 各自保存相似内容或承担相近发布职责。

建议：

- 本 PR 只提出审查与收敛方案，不做迁移、删除或合并。
- 先产出目录职责表、内容来源表、发布路径表和重复风险清单。
- 再由 ChatGPT 整理收敛方案并提交杨慧荣确认第一发布面。
- 决策确认后，另行建立迁移任务、回滚方案和验收标准。

### 风险 2：AI 早于知识治理上线

表现：

- AI 回答可能偏离书稿、标准和杨老师口径。

建议：

- AI 问答排在搜索索引和 Citation Pack 之后。

### 风险 3：数据库过早引入

表现：

- 在资产模型未稳定前引入数据库，会把不成熟结构固化。

建议：

- 文件驱动阶段继续完善 schema 和校验。
- 数据库只在编辑、权限、并发、审核流确有需要时进入。

### 风险 4：内容工厂越过知识生产中心

表现：

- 传播内容直接反向成为正式知识。

建议：

- 内容工厂只输出渠道稿。
- 正式知识必须回到 Work 和 source-library。

### 风险 5：项目协作不落 GitHub

表现：

- 聊天中完成任务，但仓库中没有任务、交接、决策记录。

建议：

- No.001 机制合并后，所有正式任务必须进入 GitHub。

## 11. 首批工程待办建议

1. 合并并执行 No.001 协作工作区。
2. 建立 Approved File Register。
3. 建立知识对象最小 Schema：`id`、`type`、`title`、`summary`、`status`、`source_trace`、`relations`、`updated`。
4. 建立来源追溯字段规范，先覆盖知识页、标准、案例、GEO 节点和 AI 引用材料包。
5. 建立目录健康检查：审查 `site/`、`trust-property-site/`、`app/`、`content/`、`knowledge-base/`、`gt-geo/`，不做迁移。
6. 建立 PR 审核门禁：Approved 文件提示、受保护路径提示、任务/交接关联检查。
7. 建立 relation 有效性检查脚本。
8. 建立网站页面与 Book Mapping Report 的覆盖检查。
9. 建立静态搜索索引设计稿。
10. 建立 AI Citation Pack 设计稿。
11. 建立 GitHub Project 和 Labels。
12. 建立每周工程健康报告模板。

## 12. 当前建议结论

工程上不建议立即进入功能开发。

建议项目组先批准三个基础方向：

1. 当前阶段继续单仓库主协作。
2. 先稳定知识资产、来源治理、文件状态和审批规则。
3. 搜索和 AI 都必须建立在可追溯知识资产之上。

这三个方向确认后，再进入下一阶段实施任务拆解。
