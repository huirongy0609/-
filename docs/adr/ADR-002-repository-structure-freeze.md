# ADR-002｜Repository Structure Freeze

> 所属项目：中国信托制物业发展平台
>
> 文件性质：Architecture Decision Record
>
> 决策主题：Repository Structure V1.0
>
> 版本：V1.0
>
> 日期：2026-07-16
>
> 状态：`in_review`
>
> 提交角色：Platform Engineering Center
>
> 批准角色：Chief Architect（待 Architecture Review）

## 1. Context

当前仓库已经形成可构建、可发布并被现有协作流程持续使用的工程结构。早期的 `knowledge/`、`product/`、`geo/`、`work/`、`codex/` 等目标目录用于表达职责，但并未完整反映仓库中已经运行的路径、脚本、链接和 Git 历史。

若为了匹配理论目录一次性移动现有文件，将同时增加以下风险：

- 中断页面、脚本、静态资源、文档和部署配置中的路径引用；
- 割裂 Git 历史，降低 `git blame`、审计和回滚的可用性；
- 让工程迁移与知识内容、网站发布或日常运营发生不必要耦合；
- 在没有业务收益的情况下扩大验证范围和回归风险。

因此，本 ADR 将工程现实作为基线，把概念职责映射到现有目录，不通过迁移制造第二套结构。

## 2. Decision

Repository Structure V1.0 冻结以下正式一级目录：

```text
app/
components/
content-factory/
data/
docs/
geo-assets/
lib/
project-office/
public/
scripts/
site/
```

“冻结”表示这些目录的路径和一级职责成为稳定工程契约，不表示目录内部永远不能新增、调整或清理文件。兼容性的内部演进仍可进行，但不得改变已批准的平台标准、知识对象或 Website IA。

本决策同时确定：

1. 不再以建立 `knowledge/`、`product/`、`geo/`、`work/`、`codex/` 新一级目录为迁移目标。
2. 这些规划名称改为职责概念，通过 Repository Structure V1.0 的目录映射落到现有路径。
3. 不执行一次性目录重构，不复制现有内容到平行目录，不重写 Git 历史。
4. 任何一级目录的新增、删除、重命名、合并或职责变更，必须先提交独立 ADR，经 Architecture Review 批准后，再由独立 Engineering PR 实施。
5. 目录调整 PR 必须包含影响清单、引用检查、Build、TypeScript、回滚方案和迁移验证。

详细职责和映射见 [Repository Structure V1.0](../repository-structure-v1.0.md)。

## 3. Baseline Evidence

正式 Baseline 以 GitHub 默认分支 `origin/main` 的已跟踪结构和本任务明确批准的目录清单为依据。核验时，`origin/main` 包含上述 11 个目录。

本地任务分支的父提交 `8bb18669a0304ee08e5e9e5b72eef2cb317d1f3c` 未跟踪 `project-office/`，但 `origin/main` 已跟踪该目录及其 `inbox/`、`submissions/`、`handoffs/`、`archive/`、`standards/` 协作结构。该差异不通过本 ADR 补建或迁移；后续合并时应保持默认分支中的既有 `project-office/`，并将其视为正式 Baseline。

仓库中未列入上述冻结清单的现有专业或历史目录不因本 ADR 被删除、移动或重新定性。它们保持原位，并继续受现有专项规则约束；如需纳入正式一级目录契约，必须另行提交 ADR。

## 4. Superseded Planning

[GitHub Repository Structure Proposal V1.1](../github-repository-structure-proposal-v1.md) 中关于新建并迁移到 `knowledge/`、`product/`、`geo/`、`work/`、`codex/` 等一级目录的目标结构，由本 ADR 的 Baseline 与 Mapping 决策取代。

原提案继续作为历史设计依据保留，不删除、不改写；其中不涉及目录迁移且未与本 ADR 冲突的工程治理原则仍可参考。若存在冲突，以 Architecture Review 最终批准的 ADR-002 为准。

## 5. Alternatives Considered

### 5.1 一次性迁移到理论目标结构

不采用。该方案影响面过大，回归验证成本高，并会同时改变路径、协作方式和发布链路。

### 5.2 保留现有目录，同时新建平行目录

不采用。双轨结构会造成权威来源不清、内容重复和长期同步成本。

### 5.3 不定义结构规则，按任务临时放置

不采用。缺少稳定职责会继续扩大路径漂移，也无法为后续调整提供 Architecture Review 边界。

### 5.4 冻结现状并建立职责映射

采用。该方案保留运行路径和 Git 历史，同时允许未来通过小范围、可验证、可回滚的工程变更渐进演进。

## 6. Consequences

### Positive

- 现有 Build、部署、链接和协作路径不因本决策发生变化；
- Git 历史保持连续，目录责任可通过单一 Mapping 查询；
- 工程 PR 不需要夹带知识对象或大规模内容迁移；
- 后续结构调整具有明确的批准、验证和回滚门槛。

### Trade-offs

- 部分概念职责不会对应同名一级目录，需要通过映射理解；
- 某些现有目录可能继续承载多个相邻子职责，需要依靠边界规则避免混放；
- 未来若确有迁移收益，仍需单独 ADR 和分阶段实施，不能在普通功能 PR 中顺带完成。

## 7. Compliance

ADR-002 获 Architecture Review 批准后：

- Repository Structure V1.0 正式生效；
- 未经批准不得重构仓库一级目录；
- 本 ADR 本身不授权任何目录迁移、代码变更、Foundation 变更、Knowledge Object 变更或 Website IA 变更；
- 本任务不产生 Migration。
