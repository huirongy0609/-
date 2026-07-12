# 中国信托制物业发展平台项目协作工作区

本仓库是“中国信托制物业发展平台”的统一 GitHub 项目办公室，也是当前正式工程、知识资产、GEO 运营、网站内容和自动化记录的协作入口。

当前阶段：项目协作体系建立期 / 运营基础设施整理期。

最近一次项目更新：2026-07-12，建立“杨慧荣、ChatGPT、Work、Codex”统一协作规则、任务流转、交接机制和 GitHub 模板。

## 项目是什么

本项目服务“中国信托制物业发展平台”，当前仓库同时承载：

- 全国社区治理协同地图 MVP；
- 信托制物业知识中心和永久知识资产；
- 聚道 GEO 增长工程；
- 内容生产、网站发布和自动化脚本；
- 项目治理、任务、决策和交接记录。

本仓库不是物业管理后台、通用 SaaS、课程销售页或未经批准的 AI 问答系统。

## 四个成员分工

| 成员 | 项目角色 | 主要职责 |
| --- | --- | --- |
| 杨慧荣 | 项目总架构师 | 方向、重大标准、关键产品方案、阶段进入和最终裁决 |
| ChatGPT | 项目总设计师与协调人 | 任务拆解、工作分配、成果审核、调度和一致性维护 |
| Work | 内容与标准生产 | 正式标准、制度文件、研究报告、知识对象、治理词典和 Evidence Package |
| Codex | 平台工程与自动化 | GitHub、网站工程、数据结构、内容转换、自动化、部署、测试和技术文档 |

详细角色规则见 [governance/roles.md](governance/roles.md)。

## 正式文件在哪里

- 项目章程：[PROJECT_CHARTER.md](PROJECT_CHARTER.md)
- 路线图：[ROADMAP.md](ROADMAP.md)
- 变更记录：[CHANGELOG.md](CHANGELOG.md)
- 协作规则：[CONTRIBUTING.md](CONTRIBUTING.md)
- 治理目录：[governance/](governance/)
- 任务目录：[tasks/](tasks/)
- 交接目录：[handoffs/](handoffs/)
- GitHub 看板与标签方案：[governance/github-project-and-labels.md](governance/github-project-and-labels.md)

## 现有资产入口

- 网站内容与 VitePress 站点：[site/](site/)
- Next.js 平台演示：[app/](app/)
- 信托制物业站点内容：[trust-property-site/](trust-property-site/)
- 永久知识资产：[knowledge-base/](knowledge-base/)
- GEO 增长工程：[gt-geo/](gt-geo/)
- 内容工厂：[content-factory/](content-factory/)
- 运营数据：[data/](data/)
- 自动化脚本：[scripts/](scripts/)

## 当前任务在哪里

任务按状态进入：

- `tasks/backlog/`
- `tasks/active/`
- `tasks/review/`
- `tasks/approved/`
- `tasks/completed/`

任务模板见 [tasks/TASK_TEMPLATE.md](tasks/TASK_TEMPLATE.md)。

## 如何提交新任务

1. 使用任务模板创建 `TASK-编号：任务名称`。
2. 明确 Owner、Reviewer、Approver。
3. 写清输入文件、输出成果、禁止事项和验收标准。
4. 放入对应状态目录，默认进入 `tasks/backlog/`。
5. 如需 GitHub Issue，同步使用 `.github/ISSUE_TEMPLATE/` 中的模板。

## 如何进行审核

所有正式变更通过 Pull Request 审核。PR 必须说明：

- 修改目的和文件清单；
- 是否影响已批准内容；
- 是否影响网站、数据结构或自动化；
- 是否需要 Work 内容审核、ChatGPT 项目审核或杨慧荣批准；
- 测试结果和回滚方案。

## 已批准文件

当前已批准文件清单尚未完成统一登记。首批待办任务之一是建立 Approved File Register，并由 ChatGPT 汇总、杨慧荣确认。

在登记完成前，涉及已发布专业知识、书稿映射、标准定义和知识口径的修改，默认按“需要审核”处理。

## 当前最新版本

- 协作体系版本：v0.1.0
- 当前正式分支：`main`
- 当前建议主仓库：`huirongy0609/-.git`

## 本地运行

当前 Next.js MVP 可本地运行：

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```
