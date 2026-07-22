# ROADMAP

- 项目：中国信托制物业发展平台
- Owner：Codex
- Reviewer：ChatGPT
- Approver：杨慧荣
- 当前阶段：MVP P0 Development
- 更新时间：2026-07-13

## 当前原则

当前阶段开始建设平台最小可运行版本。优先完成首页、知识中心、Knowledge Object 基础模型、Markdown 渲染和最简后台 CRUD；AI 问答、GEO 分析、支付、小程序和工作流暂缓。

## P0：两周内必须完成

1. 首页可访问，展示平台名称、简介、导航、最新知识和最新文章。
2. 知识中心支持浏览、分类、关键词搜索和详情页。
3. Knowledge Object 支持 `JD`、`GT`、`Article` 三类基础对象。
4. 内容正文支持 Markdown 基础渲染。
5. 最简后台支持新增、修改、删除知识对象。
6. 保持文件驱动，不引入数据库、权限细化和 AI 问答。

## P1：重要建设项

1. 增加 Knowledge Object 字段校验脚本。
2. 建立 Source Registry、Evidence Package 与 Knowledge Object 的映射方案。
3. 将 `knowledge-base/` 现有资产迁移或映射到统一 Knowledge Object 模型。
4. 为后台增加基础审核状态视图。
5. 建立静态搜索索引方案。

## P2：后续建设项

1. 登录、角色、权限和审核后台。
2. 数据库化迁移方案。
3. AI Retrieval API、Citation Pack 和 Answer Guardrails。
4. Course、Product、User、Customer Success 等产品面模型。
5. 内容工厂审核队列与正式知识库对接。

## 当前阻塞

- 主仓库名称和长期命名尚未确认。
- 第一发布面已临时采用 Next.js `app/` 承接 MVP，正式长期边界仍待确认。
- PR #1、PR #2 尚未合并。
- Knowledge Object V1.0 标准尚未转为完整工程 schema。
- GEO Pages 部署授权曾有 blocker 记录，需要后续专项排查。
