# TASK-2026-003：梳理 GEO 日常运营任务流

## 项目

中国信托制物业发展平台

## 任务背景

仓库中已有 GEO 报告、知识节点、问题库、发布脚本和稳定性检查，但日常运营任务流尚需统一到 GitHub 任务机制。

## 任务目标

形成 GEO 日常运营任务模板，明确 Work、ChatGPT、Codex 的输入输出边界。

## 负责人

- Owner：ChatGPT
- Reviewer：Codex
- Approver：杨慧荣

## 输入文件

- `gt-geo/README.md`
- `docs/GEO_STABLE_OPERATIONS.md`
- `scripts/geo-stability-check.mjs`
- `data/page-quality-audit.csv`

## 输出成果

- GEO 日常运营任务模板。
- GEO 检查清单。

## 执行要求

- 网站是第一发布面。
- 每次更新必须有交接记录。

## 禁止事项

- 不得自动发布未经审核的专业内容。
- 不得新增 crawler 或 AI API。

## 验收标准

- 能支持每日知识页、热点、链接、sitemap 和 SEO 检查。

## 关联文件

- `governance/workflow.md`

## 当前状态

Backlog

## 交接对象

Codex

## 交接说明

Codex 后续负责把检查清单映射到可执行脚本或 GitHub Actions。

## 创建时间

2026-07-12

## 更新时间

2026-07-12
