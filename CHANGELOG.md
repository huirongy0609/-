# CHANGELOG

本文件记录中国信托制物业发展平台工程变更。格式遵循“日期 + 变更摘要 + 影响范围”。

## 2026-07-13

### Added

- 新增 Knowledge Object 统一模型，首批支持 `JD`、`GT`、`Article`。
- 新增文件驱动知识对象存储：`data/knowledge-objects.json`。
- 新增知识中心浏览、分类、关键词搜索和详情页。
- 新增 Markdown 基础渲染组件。
- 新增最简后台：`/admin/knowledge`。
- 新增 Knowledge Object CRUD API：`/api/knowledge-objects`。

### Changed

- 首页接入最新知识和最新文章。
- 导航菜单增加知识中心和后台入口。
- `ROADMAP.md` 从 Architecture Review 阶段更新为 MVP P0 Development 阶段。

### Deferred

- AI 问答、GEO 分析、登录权限细化、支付、小程序和工作流继续暂缓。

## 2026-07-13 Architecture Review

### Added

- 新增 `docs/architecture-review-v1-submission.md`，提交 Architecture Review V1.0 可审核成果包。
- 新增 `ROADMAP.md`，开始持续维护开发路线图。
- 新增 `CHANGELOG.md`，开始持续维护版本变更记录。
- 新增 `handoffs/to-chatgpt/HANDOFF-2026-005.md`，交接 ChatGPT 进行第一次架构审查。

### Changed

- 更新 `ARCHITECTURE.md`，补充当前系统真实架构、数据模型、Knowledge Object 落地状态、API 状态和部署状态。

### Notes

- 本次不修改运行代码、页面、样式、数据和部署脚本。
- 本次不实现数据库、API、权限、搜索或 AI 问答。
- 本次提交继续使用原 PR #2，不新建 PR，不合并。
