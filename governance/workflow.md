# Workflow

Status: Draft
Version: v0.1.0
Date: 2026-07-12

## 任务状态

标准流转：

```text
Backlog
→ Active
→ Review
→ Approved
→ Completed
```

出现问题时进入：

```text
Blocked
```

## 任务目录

- `tasks/backlog/`：尚未排期或待拆解任务。
- `tasks/active/`：正在执行任务。
- `tasks/review/`：等待 ChatGPT、Work 或 Codex 审核。
- `tasks/approved/`：已批准，等待归档或发布。
- `tasks/completed/`：已完成并交接。

## 交接规则

每次任务完成后必须生成交接文件，按对象进入：

- `handoffs/to-work/`
- `handoffs/to-codex/`
- `handoffs/to-chatgpt/`
- `handoffs/to-architect/`

交接文件至少包括：

- 完成了什么。
- 修改了哪些文件。
- 哪些内容需要审核。
- 哪些地方存在风险。
- 哪些决策尚未确认。
- 下一步建议交给谁。
- 对应 commit 或 Pull Request。

## GitHub Issue 分类

Issue 类型：

- 内容任务。
- 工程任务。
- 缺陷。
- 决策事项。
- 文件审核。
- 数据问题。

## 建议标签

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

## 项目看板方案

如仓库权限允许，建立 GitHub Project，栏目如下：

- 待规划。
- 待分配。
- Work 执行中。
- Codex 执行中。
- ChatGPT 审核中。
- 等待总架构师确认。
- 已批准。
- 已完成。
- 阻塞。

如权限或工具不支持建立 Project，则使用 Issue、Label 和 `tasks/` 目录状态替代。
