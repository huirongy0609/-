# Knowledge Portal Architecture

本文档定义 Knowledge Portal V0.4 的知识资产模型。

本阶段不引入数据库、CMS、AI、登录、搜索或后台系统。

## 1. knowledge-base 目录结构

所有知识资产统一放在：

```text
knowledge-base/
```

当前采用单层 Markdown 文件结构：

```text
knowledge-base/
  article-*.md
  book-*.md
  report-*.md
  research-*.md
  case-*.md
```

后续如果资产数量增长，可以按类型分目录，但页面读取逻辑不能依赖目录名。

系统只以 frontmatter 的 `type` 字段识别资产类型。

## 2. Knowledge Asset Schema

每个 Markdown 文件必须使用以下 frontmatter：

```yaml
---
id:
title:
type:
summary:
tags:
authors:
source:
updated:
cover:
relations:
---
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 全局唯一知识资产 ID |
| `title` | string | 是 | 展示标题 |
| `type` | enum | 是 | 知识资产类型 |
| `summary` | string | 是 | 摘要，用于列表、首页和 AI 理解 |
| `tags` | string[] | 是 | 主题标签 |
| `authors` | string[] | 是 | 作者或机构 |
| `source` | string | 是 | 来源说明 |
| `updated` | string | 是 | 更新时间，格式建议 `YYYY-MM-DD` |
| `cover` | string | 是 | 封面地址，可为空 |
| `relations` | string[] | 是 | 关联知识资产 ID |

## 3. 支持的资产类型

首批支持 8 类：

```text
Book
Report
Research
Case
Map
Standard
Toolkit
Article
```

### Book

用于图书、手册、系统化出版物。

职责：

- 承接系统学习
- 沉淀长期知识框架
- 关联知识卡、报告和课程入口

### Report

用于发展报告、专题报告、城市观察报告。

职责：

- 沉淀高权重研究资产
- 连接案例、研究和行业判断
- 作为 AI 可引用的结构化成果

### Research

用于研究文章、政策观察、方法论。

职责：

- 解释问题
- 形成判断
- 为报告和知识资产提供研究基础

### Case

用于实践案例。

职责：

- 记录真实问题和实践机制
- 反哺知识、报告、研究和标准
- 不作为宣传稿使用

### Map

用于地图、网络、关系图、区域实践图谱。

职责：

- 表达空间关系
- 表达实践分布
- 为后续知识图谱和区域报告预留结构

### Standard

用于标准、规范、制度建议。

职责：

- 沉淀经过案例和研究验证的共识
- 连接工具包、模板和客户成功实践

### Toolkit

用于工具包、模板组、操作清单。

职责：

- 把知识转化为可操作资产
- 服务客户成功和项目导入

### Article

用于概念解释、知识卡、百科条目、FAQ 型内容。

职责：

- 回答“是什么、为什么、怎么做”
- 服务 AI 理解和用户入门学习
- 连接案例、报告、研究和图书

## 4. 命名规范

### 文件名

文件名使用英文小写和连字符：

```text
article-what-is-trust-property.md
report-property-fund-governance.md
book-trust-property.md
case-chengdu-guidong.md
```

规则：

- 不使用中文文件名。
- 不使用空格。
- 不使用下划线。
- 前缀建议与 `type` 对应。

### id

`id` 必须全局唯一，建议与文件名一致：

```yaml
id: article-what-is-trust-property
```

规则：

- 使用英文小写。
- 使用连字符。
- 不把中文展示标签作为稳定 ID。
- 案例可以在 id 中保留公众识别地名，但不能把城市名作为关系键。

## 5. Frontmatter 规范

### 示例

```yaml
---
id: article-what-is-trust-property
title: 什么是信托制物业
type: Article
summary: 以业主共同基金、项目账户、预算治理、信息公开和受托人责任为核心的物业服务治理模式。
tags: [信托制物业, 基础概念, 治理结构]
authors: [聚道智库]
source: 聚道智库原创
updated: 2026-06-30
cover:
relations: [report-trust-property-development, case-chengdu-guidong]
---
```

### 校验规则

读取层位于：

```text
lib/knowledge-assets.ts
```

所有 Markdown frontmatter 会按 TypeScript / Zod schema 校验。

## 6. Architecture Review V1.0 当前系统事实

更新时间：2026-07-13

本节补充当前平台真实工程状态，供 ChatGPT 进行 Architecture Review V1.0。前文 Knowledge Portal V0.4 仍作为知识资产模型的历史基线保留。

### 6.1 技术架构

| 层级 | 当前状态 |
|---|---|
| 前端 | Next.js 14、React 18、TypeScript |
| 静态知识站 | VitePress，位于 `site/` |
| 后端 | 未建立独立后端框架 |
| API | 未发现稳定 `app/api` 路由 |
| 数据 | 文件驱动，JSON / CSV / Markdown / TypeScript schema |
| 权限 | 未实现登录、用户、角色、权限和后台审批 |
| 部署 | `site/` 通过 GitHub Pages workflow 构建部署；Next.js 部署方式未固定 |
| 自动化 | GEO 生成、站点构建、sitemap、发布日志、稳定性检查脚本已存在 |

### 6.2 当前运行边界

当前 Next.js 运行边界为：

```text
app server page
  -> lib/repositories/*
  -> lib/domain/*
  -> data/*.json
```

当前知识资产读取边界为：

```text
app/knowledge 或相关页面
  -> lib/knowledge-assets.ts
  -> knowledge-base/registry/registry.ts
  -> knowledge-base/*.md
```

当前 GEO 静态站构建边界为：

```text
scripts/geo-* / scripts/build-site.mjs
  -> data/*.csv
  -> site/
  -> site/.vitepress/dist
  -> .github/workflows/geo-pages.yml
```

### 6.3 已实现数据对象

| 对象 | 状态 | 位置 |
|---|---|---|
| Case | 已实现基础版 | `lib/domain/case.ts`、`data/cases.json` |
| Region | 已实现基础版 | `lib/domain/region.ts`、`data/cities.json` |
| Intelligence | 已实现基础版 | `lib/domain/intelligence.ts`、`data/intelligence.json` |
| Submission | 部分实现 | `lib/domain/submission.ts` |
| Knowledge Asset | 部分实现 | `knowledge-base/registry/registry.ts` |
| Book Structure | 部分实现 | `knowledge-base/schema/book.ts` |
| Knowledge Relation | 部分实现 | `knowledge-base/schema/relation.ts` |
| GT Knowledge Node | 部分实现 | `gt-geo/knowledge-nodes/` |
| Evidence Package | 未实现 | 无正式对象 |
| User / Course / Product | 未实现或仅内容页存在 | 无正式 schema |

### 6.4 Knowledge Object 落地状态

当前已真正实现：

- `ObjectID`：frontmatter `id`
- `ObjectType`：`Book / Report / Research / Case / Map / Standard / Toolkit / Article`
- 基础 `Metadata`：title、summary、tags、authors、source、updated、cover
- `Reference` 基础关系：relations 与 relationEdges
- `Tags`：frontmatter tags

当前仅部分实现：

- `Lifecycle`：存在自由文本 status，但未强制 Draft / Review / Approved / Superseded / Archived
- `Source Traceability`：已有文档规则，但未进入 registry 校验

当前未实现：

- 对象级 Version
- Evidence Package
- reviewer / approver / approved_at
- AI Citation Pack
- Retrieval API
- Answer Guardrails

### 6.5 架构风险

- `app/`、`site/`、`trust-property-site/`、`content/` 并行存在，第一发布面尚未确认。
- 当前没有数据库、API、权限和后台，不具备真实多角色协作产品能力。
- Knowledge Object 标准未完整工程化，不能直接支撑正式 AI 问答。
- `site/.vitepress/dist/` 构建产物当前存在于仓库中，后续需确认是否继续入库。
- 内容工厂和正式知识库之间缺少审核队列边界。

### 6.6 下一步架构优先级

P0：

- 第一发布面确认。
- Approved File Register。
- Knowledge Object 最小 schema。
- 知识资产校验脚本。
- 目录健康检查。

P1：

- 静态搜索索引。
- Source Registry 到 Knowledge Asset 的映射。
- GT-GEO 节点元数据统一。
- 提交页最小持久化接口契约。

P2：

- 登录、权限和后台。
- 数据库化。
- AI Retrieval API 和 Citation Pack。
- Course、Product、User 等产品面模型。

如果字段缺失、类型不合法或 `type` 不属于 8 类之一，构建应失败。

## 6. relations 使用规则

`relations` 用于后续知识图谱、AI 检索、推荐和自动化。

规则：

- `relations` 填写其他知识资产的 `id`。
- 不填写 URL。
- 不填写展示标题。
- 不填写中文标签。
- 不使用城市名、机构名、作者名作为关系键。
- 至少保留空数组结构；正式资产建议关联 1-3 个核心资产。

推荐关系：

```text
Article → Case / Report / Research
Case → Article / Report / Standard
Report → Research / Case / Book
Research → Article / Report
Book → Article / Report / Research
Standard → Case / Toolkit / Report
Toolkit → Standard / Case / Article
Map → Case / Report / Research
```

## 7. 当前页面读取原则

页面不读取目录名。

页面只按 `type` 读取知识资产：

```text
/knowledge → Article
/reports → Report
/books → Book
/research → Research
```

首页读取各类型最新资产：

```text
Article
Research
Report
Book
Case
```

`Case` 当前仍保留现有 `/cases` 页面，同时在 `knowledge-base` 中保留案例资产，为后续统一案例体系做准备。
