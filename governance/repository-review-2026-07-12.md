# Repository Review 2026-07-12

Status: Draft
Reviewer: Codex

## 1. 当前正式仓库名称

本地工作区：

```text
/Users/Administrator/Documents/New project
```

Git remote：

```text
origin https://github.com/huirongy0609/-.git
```

建议 GitHub 显示名称待杨慧荣确认。当前远端仓库名为 `-`。

## 2. 当前默认分支

本地当前分支和远端跟踪关系显示：

```text
main...origin/main
```

因此当前默认协作分支按 `main` 处理。

## 3. 现有目录结构摘要

关键目录：

- `app/`：Next.js 页面与演示入口。
- `components/`：前端组件。
- `content/`：文章、案例、城市、课程、FAQ、工具等内容。
- `site/`：VitePress/GEO 静态站点内容与构建目标。
- `trust-property-site/`：信托制物业站点内容包。
- `knowledge-base/`：书籍、案例、报告、研究、知识图谱、注册表和 schema。
- `gt-geo/`：GEO 增长工程知识节点、日报、标准答案库和问题库。
- `content-factory/`：内容生产系统、提示词、渠道稿件和运营资料。
- `data/`：本地 JSON/CSV 数据。
- `scripts/`：GEO、sitemap、发布日志和站点构建脚本。
- `docs/`：GEO 报告、图书映射、知识来源治理和修订记录。
- `remotion/`：视频生成相关代码，按现有规则不在本任务中触碰。

## 4. 已有重要文档

- `PROJECT.md`
- `DESIGN_SYSTEM.md`
- `DOMAIN_MODEL.md`
- `Repository-Inventory.md`
- `docs/book-mapping-report-trust-property-governance-foundation.md`
- `docs/book-coverage-trust-property-governance-foundation.md`
- `docs/knowledge-source-governance.md`
- `docs/revision-notes-trust-property-governance-foundation.md`
- `docs/GEO_STABLE_OPERATIONS.md`
- `gt-geo/README.md`
- `content-factory/README.md`

## 5. 已有网站、GEO、知识库和自动化代码

已发现：

- 网站：`app/`、`site/`、`trust-property-site/`。
- GEO：`gt-geo/`、`geo-research/`、`geo-publishing/`、`docs/GEO_*`。
- 知识库：`knowledge-base/`、`content/knowledge/`、`docs/book-*`。
- 自动化：`scripts/`、`.github/workflows/geo-pages.yml`、`content-factory/core/`。

## 6. 是否存在多个重复仓库或重复目录

本地只发现一个 Git 仓库：

```text
../New project/.git
```

未发现多个 Git 仓库。

但存在多个功能相近目录：

- `site/` 与 `trust-property-site/` 都承载站点内容。
- `content/`、`knowledge-base/`、`gt-geo/knowledge-nodes/` 都承载知识类内容。
- `content-factory/` 与 `gt-geo/content-factory/` 都与内容生产相关。

本次不判定为重复、不删除、不迁移、不合并。后续如需整理，必须先形成决策记录和迁移方案。

## 7. 主仓库建议

建议当前仓库作为今后主协作仓库，理由：

- 已连接 GitHub 远端。
- 已存在网站、GEO、知识库、内容工厂、数据和自动化资产。
- 已存在 GitHub Pages 工作流。
- 当前任务要求不新建功能、不迁移仓库，本仓库足以承载协作治理层。

待确认事项：

- 是否将远端仓库显示名从 `-` 调整为更明确名称。
- 是否建立 GitHub Project 看板。
- 是否批量创建标签。
