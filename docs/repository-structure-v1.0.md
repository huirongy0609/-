# Repository Structure V1.0

> 所属项目：中国信托制物业发展平台
>
> 文件性质：工程结构基线
>
> 对应决策：[ADR-002｜Repository Structure Freeze](adr/ADR-002-repository-structure-freeze.md)
>
> 版本：V1.0
>
> 日期：2026-07-16
>
> 状态：`in_review`
>
> 维护角色：Platform Engineering Center
>
> 批准角色：Chief Architect（待 Architecture Review）

## 一、Repository Baseline

Repository Structure V1.0 以当前 GitHub 默认分支的稳定工程结构为基线，冻结以下正式一级目录：

```text
/
├── app/
├── components/
├── content-factory/
├── data/
├── docs/
├── geo-assets/
├── lib/
├── project-office/
├── public/
├── scripts/
└── site/
```

冻结范围是一级路径和职责边界。目录内部允许在既有治理规则内渐进维护；冻结不等于禁止正常工程演进，也不把当前每一个文件永久固化。

## 二、Directory Responsibility

| 正式目录 | 长期职责 | 允许内容 | 边界 |
| --- | --- | --- | --- |
| `app/` | Next.js 应用路由、页面入口、Metadata 与页面级组合 | App Router 文件、路由布局、页面装配、框架要求的入口 | 不作为知识正文或工程治理文档的权威来源 |
| `components/` | 可复用的 React 组件与平台展示原语 | 跨页面组件、领域组件、既有视觉原语 | 不复制页面数据，不存放知识对象，不建立与现有组件重复的模式 |
| `content-factory/` | Knowledge Factory 的内容生产、复用与运营工作区 | 生产流程、渠道资产、内容库、生产辅助资料 | Candidate 或生产素材不因进入本目录自动成为 Foundation；不得替代批准流程 |
| `data/` | 应用消费的结构化数据和稳定数据契约 | 本地结构化数据、索引输入、受控配置数据 | 不隐藏 Mock，不以展示标签充当稳定枚举，不绕过 Knowledge Foundation 的状态规则 |
| `docs/` | 平台、工程、架构、标准、验证与运行记录 | ADR、架构文档、工程规范、验证报告、部署记录 | 文档批准不等同于知识对象批准；不保存运行代码副本 |
| `geo-assets/` | GEO 专项资产的稳定存放位置 | GEO 分析、映射、发布辅助资产及其说明 | 不建立第二套网站正文，不替代 `site/` 的发布结构 |
| `lib/` | 平台共享逻辑、领域引擎、数据访问与服务适配 | Foundation Engine、解析器、Registry、服务端工具、共享 TypeScript 模块 | 不放页面展示实现，不硬编码知识正文或业务统计 |
| `project-office/` | Work、Codex 与评审之间的正式协作中心 | inbox、submissions、handoffs、archive、standards 及角色子路径 | 不存平台代码、业务正文或未经审核的正式知识对象 |
| `public/` | Next.js 可直接公开访问的静态资源 | 图片、图标、静态文件、框架公开资源 | 不存密钥、源文件工作区或可由构建生成的缓存 |
| `scripts/` | 构建、验证、同步、发布和运维自动化 | 可审查脚本、检查工具、数据同步入口 | 不承载长期业务数据，不把人工知识判断写入自动化 |
| `site/` | 现有独立知识发布与 GEO 站点工程 | VitePress 配置、公开知识页面、站点级索引与静态发布资源 | 不与 `app/` 互相复制运行代码；内容仍须遵守来源与批准规则 |

### 2.1 Baseline 边界说明

- `app/` 与 `site/` 是现有的两个发布实现边界。本文件不合并它们，也不改变路由或 Website IA。
- `content-factory/` 管理生产过程；Foundation 状态和发布资格仍由既有 Knowledge Foundation Engine 与批准流程决定。
- `docs/` 管理工程和治理文档；知识正文的权威性不能仅由文件位置推导。
- 未列入冻结清单的现有专业、测试、配置或历史目录保持原位。本文件不删除、不迁移，也不扩大其职责。

## 三、Directory Mapping

早期规划目录不再作为待创建的一级路径。其职责按下表映射到当前 Baseline：

| 原规划 | Repository Structure V1.0 实际目录 | 映射规则 |
| --- | --- | --- |
| `knowledge/` | `content-factory/`（生产主路径）；`data/`、`lib/`（运行消费与工程能力） | Knowledge Factory 生产资产进入 `content-factory/`；结构化运行数据和 Foundation Engine 分别沿用 `data/`、`lib/`。不得据此移动或修改任何现有 Knowledge Object。 |
| `geo/` | `geo-assets/`（资产主路径）；`site/`、`scripts/`（发布与自动化） | GEO 资产进入 `geo-assets/`；既有站点表达和自动化保持在当前运行路径，不新建平行 `geo/`。 |
| `work/` | `project-office/inbox/work/`、`project-office/submissions/work/`、`project-office/handoffs/work/` | Work 按协作阶段进入对应角色子路径，不建立独立一级目录。 |
| `codex/` | `project-office/inbox/codex/`、`project-office/submissions/codex/`、`project-office/handoffs/codex/` | Codex 按协作阶段进入对应角色子路径，不建立独立一级目录。 |
| `product/` | `docs/`（产品与架构定义）；`app/`、`components/`（实现） | “做什么、为何做、如何验收”进入现有文档体系；运行实现保持在应用和组件目录，不把代码迁入文档结构。 |

映射是职责导航，不是文件迁移授权。若某个现有文件的位置与映射不一致，应先提出 Engineering Issue，确认权威来源、引用影响和回滚方式，再决定是否需要新的 ADR。

## 四、Evolution Strategy

仓库采用渐进式演进，不采用一次性重构。

### 4.1 默认路径

1. 优先在现有正式目录内完成新增或维护。
2. 先定义职责、接口和所有权，再决定是否需要调整路径。
3. 能通过文档导航、索引或适配层解决的问题，不以目录迁移处理。
4. 工程变化与知识内容变化分开提交；Engineering PR 不夹带 Candidate Knowledge。

### 4.2 必须触发 ADR 的变化

以下变化必须先提交 ADR，并经 Architecture Review 批准：

- 新增或删除一级目录；
- 一级目录重命名、合并或拆分；
- 一级目录的主要职责发生变化；
- 跨目录批量迁移会改变公开 URL、构建入口、发布链路或权威来源；
- 需要长期维护平行结构或兼容层。

### 4.3 分阶段实施要求

获得批准后，目录调整仍须通过独立 Engineering PR 实施，并至少包括：

1. 来源与目标文件清单；
2. import、链接、路由、脚本、CI/CD 和部署引用影响；
3. 使用 `git mv` 或等价的历史保留方式；
4. TypeScript、Build、链接及专项测试；
5. 明确回滚点和兼容期；
6. 迁移完成后的旧路径处理与验证报告。

禁止在功能开发、内容生产或日常维护 PR 中顺带进行批量目录重构。

## 五、Engineering Principles

1. **工程现实优先**：不因理论规划而迁移已稳定运行的目录。
2. **Git 历史连续**：优先保持文件历史、审计线索和回滚能力。
3. **链接与路径稳定**：不破坏现有 URL、import、脚本、文档链接和部署入口。
4. **Build 稳定**：结构变化必须在独立分支验证 TypeScript、Build 和相关测试。
5. **单一职责映射**：概念职责通过本文件映射，不建立同义平行根目录。
6. **最小变更范围**：目录调整与业务功能、知识内容、Foundation 和 Website IA 解耦。
7. **先决策后实施**：所有一级结构调整必须先有 ADR 和 Architecture Review。
8. **可追踪、可回滚**：每次结构变更必须有 Commit、PR、Validation 和回滚说明。
9. **不自批标准**：Platform Engineering Center 提交工程建议，不替代 Chief Architect 批准。
10. **知识边界不变**：目录位置不改变 Knowledge Object 的 Lifecycle、Foundation Ready 或批准状态。

## 六、本次 Validation

本次提交仅新增两份工程治理文档：

- `docs/adr/ADR-002-repository-structure-freeze.md`
- `docs/repository-structure-v1.0.md`

本次不创建业务目录，不删除或迁移文件，不修改代码、Build 配置、Foundation、Knowledge Object 或 Website IA，不执行 Migration，不 Push。

验证结果在提交前记录：

| 检查项 | 结果 |
| --- | --- |
| 变更范围审计 | PASS：仅包含上述两份新增文档 |
| TypeScript | PASS：`npx tsc --noEmit --pretty false` |
| Production Build | PASS：`npm run build`，47/47 静态页面生成完成 |
