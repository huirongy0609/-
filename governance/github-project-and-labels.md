# GitHub Project And Labels

Status: Draft
Version: v0.1.0
Date: 2026-07-12

## GitHub Project 看板方案

如仓库权限允许，建立 GitHub Project：

```text
中国信托制物业发展平台项目组
```

建议栏目：

- 待规划
- 待分配
- Work 执行中
- Codex 执行中
- ChatGPT 审核中
- 等待总架构师确认
- 已批准
- 已完成
- 阻塞

## Project 字段

建议字段：

- Owner：Work / Codex / ChatGPT / Architect
- Type：Content / Engineering / Decision / Bug / Standard / Knowledge / Data
- Priority：P0 / P1 / P2
- Status：Backlog / Active / Review / Approved / Completed / Blocked
- Needs Approval：Yes / No

## Labels

```text
owner:work
owner:codex
review:chatgpt
approval:architect
type:content
type:engineering
type:decision
type:bug
type:standard
type:knowledge
status:blocked
priority:p0
priority:p1
priority:p2
```

## 无 Project 权限时的替代方案

如果暂时不能创建 GitHub Project：

- 使用 Issue 模板分类任务。
- 使用 Labels 标记责任人、类型、审核和优先级。
- 使用 `tasks/` 目录作为状态事实来源。
- 使用 `handoffs/` 目录保存任务完成后的正式交接。

## 后续待确认

- 是否由 Codex 批量创建 Labels。
- 是否由杨慧荣确认 Project 名称。
- 是否由 ChatGPT 维护 Project 状态。
