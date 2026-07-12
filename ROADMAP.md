# ROADMAP

- 项目：中国信托制物业发展平台
- Owner：Codex
- Reviewer：ChatGPT
- Approver：杨慧荣
- 当前阶段：Architecture Review V1.0
- 更新时间：2026-07-13

## 当前原则

当前阶段不优先开发新功能，优先完成工程事实梳理、知识对象底座、目录治理、审核门禁和第一发布面确认。

## P0：两周内必须完成

1. 完成 PR #2 的 Architecture Review V1.0。
2. 确认第一发布面：`app/`、`site/`、`trust-property-site/` 的职责边界。
3. 建立 Approved File Register 草案。
4. 建立 Knowledge Object 最小工程 schema 草案。
5. 建立知识资产 frontmatter 校验脚本方案。
6. 建立目录健康检查方案。

## P1：重要建设项

1. 统一 Source Registry、Knowledge Asset Registry、GT-GEO 节点之间的映射关系。
2. 建立静态搜索索引方案。
3. 为 GT-GEO Knowledge Node 增加稳定元数据。
4. 为提交页设计最小持久化接口契约。
5. 将 Architecture Review checklist 固化到 PR 审核流程。

## P2：后续建设项

1. 登录、角色、权限和审核后台。
2. 数据库化迁移方案。
3. AI Retrieval API、Citation Pack 和 Answer Guardrails。
4. Course、Product、User、Customer Success 等产品面模型。
5. 内容工厂审核队列与正式知识库对接。

## 当前阻塞

- 主仓库名称和长期命名尚未确认。
- 第一发布面尚未确认。
- PR #1、PR #2 尚未合并。
- Knowledge Object V1.0 标准尚未转为完整工程 schema。
- GEO Pages 部署授权曾有 blocker 记录，需要后续专项排查。
