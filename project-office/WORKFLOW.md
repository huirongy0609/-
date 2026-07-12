# Project Office Workflow

## 四个角色

### 项目总架构师（杨老师）

- 负责项目方向、重大决策和最终批准。
- 对关键标准、关键产品方案和重大争议作最终裁决。

### ChatGPT

- 负责项目统筹、任务设计、任务拆解和成果审核。
- 将任务发布到 GitHub Inbox。
- 审核 Work 与 Codex 的提交成果。

### Work

- 负责知识资产、标准文件和正式文档生产。
- 按任务要求提交成果到 `project-office/submissions/work/`。
- 任务完成后形成交接记录。

### Codex

- 负责软件开发、GitHub 维护和技术实现。
- 按任务要求提交成果到 `project-office/submissions/codex/`。
- 任务完成后形成交接记录。

## 工作流程

```text
任务发布
↓
Inbox
↓
领取任务
↓
执行
↓
Submission
↓
ChatGPT Review
↓
Handoff
↓
Archive
```

## 目录使用规则

- `inbox/`：只存放待领取或待执行任务。
- `submissions/`：只存放待 ChatGPT 审核的成果。
- `handoffs/`：只存放任务完成后的交接记录。
- `archive/`：存放已完成、废止或阶段性归档内容。
- `standards/`：存放项目办公室流程、模板和协作标准。

## 文件要求

- 任务、成果、审核意见和交接记录应使用 Markdown 文件。
- 文件名应包含日期、编号或任务代号，便于检索和追溯。
- 正式成果必须通过 Git 提交留痕。
- 未经审核批准，不得将 `submissions/` 中的成果视为最终正式文件。

## 边界

本流程只定义项目协作方式，不定义项目业务内容。

本目录初始化任务不得修改已有业务文件。
