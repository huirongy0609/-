# Knowledge Studio Architecture

版本：V1.0
状态：Design

## 1. 产品定义

Knowledge Studio 是信托制物业知识资产的生产控制台，不是普通 CMS。

普通 CMS 主要管理页面和文章；Knowledge Studio 管理的是具有永久身份、生命周期、版本、审批证据、关系和发布责任的知识对象。网站、搜索、GEO、AI、培训及后续数字治理产品只消费其发布结果，不在各自系统内另建正式知识副本。

治理辞典（JD）始终是信托制物业理论的唯一正式来源（SSOT）。Question、Answer、Evidence、Case、Law、GT、Standard、Product 和 Course 均通过引用 JD 或其他已批准对象形成应用层、证据层和传播层，不能覆盖或改写 JD 理论。

## 2. 设计目标

1. 为所有知识对象提供统一身份、编辑、审核、版本和发布框架。
2. 严格区分“已批准”与“已发布”。
3. 支持网站、Search Index、GEO 和 AI 的一次发布、多端消费。
4. 所有关系可追溯、可校验，并可升级为知识图谱。
5. 支持未来十万级知识对象，不把物理存储写死为 Markdown 或某一种数据库。
6. 保留当前 Foundation Registry 的权威地位，采用渐进迁移，不形成双 SSOT。
7. AI 可以辅助候选内容，但不能自行批准、发布或写回正式知识库。

## 3. 目标用户与角色

| 角色 | 核心职责 | 权限边界 |
| --- | --- | --- |
| 内容编辑 | 创建草稿、维护元数据和关系候选 | 不得批准或发布 |
| 专业审核人 | 核验理论、证据、法律与对象关系 | 可提出修改，不得伪造批准记录 |
| 项目总架构师 / 批准人 | 作出 `approved` 决定 | 批准不等于发布 |
| 发布管理员 | 创建 Release、执行发布和回滚 | 只能发布已批准版本 |
| 知识运营 | 检查覆盖、搜索和渠道表现 | 不得直接改写已发布版本 |
| 审计只读用户 | 查看历史版本、审批与发布证据 | 无写权限 |
| AI 服务账户 | 读取已发布快照 | 只读，不得改变状态 |

同一自然人可以承担多个角色，但系统记录必须保留每个动作对应的角色、时间和证据。

## 4. 产品信息架构

| 模块 | 页面目的 | 主实体 | 必需数据 | 空状态 | 导航入口 | 筛选是否进入 URL | MVP |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | 查看生产与发布健康度 | Registry Snapshot | 类型计数、状态计数、最近更新、发布健康 | 明确显示尚无对象或指标未接入 | 一级 | 时间、类型可进入 URL | 是 |
| 知识对象 | 管理 JD 及通用对象 | Knowledge Object | ID、类型、标题、版本、状态、负责人 | 引导创建 Draft，不生成示例内容 | 一级 | 类型、状态、负责人进入 URL | 是 |
| AI 问题 | 管理 Q 与 JD 映射 | Question | QID、问题、主 JD、类型、受众、状态 | 无问题时显示真实采集流程 | 一级 | 状态、类型、受众、JD 进入 URL | 第二阶段 |
| 标准答案 | 管理 A 版本 | Answer | AID、QID、JD 版本、证据、状态 | 无 Answer 时引导回主 JD | 一级 | 状态、QID、JD 进入 URL | 第二阶段 |
| 证据 | 管理可核验来源 | Evidence | 来源、定位、验证状态、有效期 | 不创建占位证据 | 一级 | 类型、验证状态、有效性进入 URL | 第二阶段 |
| 案例 | 管理实践案例 | Case | 时间、地点、来源、关联 JD/GT、状态 | 提示仅录入可核验案例 | 一级 | 状态、主题、地区可进入 URL；地区不是关系键 | 后续 |
| 法律法规 | 管理 Law 与效力 | Law | 法规身份、机关、效力、版本、定位 | 提示完成来源核验 | 一级 | 效力、层级、发布机关进入 URL | 后续 |
| 治理地图 | 组织 GT 节点与关系 | GT | GT ID、节点、边、关联 JD | 不自动生成关系图 | 一级 | 状态、主题进入 URL | 后续 |
| 发布中心 | 创建 Release 并查看目标结果 | Release | 版本快照、校验、目标、回执、回滚点 | 显示暂无待发布版本 | 一级 | 状态、目标、时间进入 URL | 是 |
| 版本管理 | 比较和恢复对象版本 | Object Version | 差异、作者、审批、替代关系 | 显示仅有一个版本 | 二级 | 对象 ID 和版本进入 URL | 第二阶段 |
| 审核中心 | 处理 Review 队列 | Review Task | 对象版本、审核项、意见、决定 | 显示无待审对象 | 一级 | 状态、类型、审核人进入 URL | 第二阶段 |
| 搜索 | 跨对象定位知识资产 | Search Document | 查询、类型、状态、版本、关系 | 给出无结果和查询建议，不造内容 | 全局 | 查询和公开筛选进入 URL | 是 |
| 统计分析 | 查看覆盖、质量和渠道表现 | Metric Snapshot | 口径、时间窗、来源、数值 | 未接入指标明确标为不可用 | 一级 | 时间、类型、渠道进入 URL | 后续 |

内部审核状态、权限信息和安全字段不得出现在公开 URL。上述仅是信息架构，不代表本轮开发页面。

## 5. 逻辑架构

```text
Knowledge Studio
├── Identity & Access
├── Object Workspace
│   ├── Common Editor
│   ├── Type-specific Sections
│   ├── Relationship Editor
│   └── Validation
├── Workflow
│   ├── Review Queue
│   ├── Approval Record
│   └── Lifecycle Engine
├── Versioning
│   ├── Immutable Versions
│   ├── Diff
│   └── Supersession
├── Release Center
│   ├── Release Candidate
│   ├── Manifest
│   ├── Target Adapters
│   └── Rollback
├── Read Models
│   ├── Search Index
│   ├── Graph Projection
│   ├── Dashboard Metrics
│   └── AI Export
└── Audit
    ├── Action Log
    ├── Review Evidence
    └── Publication Receipts
```

## 6. 数据与服务边界

### 6.1 Authority Layer

保存对象身份、不可变版本、生命周期、审批记录、关系和 Release Manifest。它是 Studio 的权威写入面。

当前阶段仍以 Foundation Registry、Manifest、正式 Markdown 和伴随 metadata 为权威来源。未来更换存储时，必须先迁移和对账，再切换 Authority Adapter；不能让 Markdown 与新数据库同时成为可写 SSOT。

### 6.2 Workflow Layer

执行状态转换、审核分配、审批证据校验和权限检查。所有转换均为服务端操作，不能只依赖前端隐藏按钮。

### 6.3 Publication Layer

把已批准的不可变版本组成 Release Candidate，完成 Schema、关系、权限、SEO/GEO 和来源校验后，生成 Release Manifest，并通过适配器发布到：

- Website；
- Search Index；
- AI Read Model；
- GEO / Structured Data；
- RSS / Sitemap（仅适用公开对象）；
- 后续培训或 API 只读出口。

### 6.4 Read Model Layer

搜索、Dashboard、知识图谱和 AI 使用独立的可重建 Read Model。Read Model 不是 SSOT；丢失后可由 Authority Layer 和 Release Manifest 重建。

## 7. 十万级扩展设计

### 永久身份

- 对象 ID 与标题、分类和物理路径解耦；
- ID 永不复用；
- 版本使用独立 Version ID；
- 关系只存 ID，不复制标题或正文。

### 不可变版本

对象每次提交审核形成不可变版本。修订创建新版本，不覆盖已批准或已发布版本。`current_published_version_id` 只是指针。

### 分区与索引

- 按对象类型和 ID 范围分区是物理优化，不改变对象契约；
- 搜索索引按状态和语言隔离；
- 审核队列按状态、负责人和更新时间建立索引；
- 关系建立 source、target、predicate 三类索引；
- Dashboard 使用增量 Metric Snapshot，不在每次打开时扫描全部对象。

### 事件与幂等

发布动作产生带唯一 Event ID 的领域事件。Website、Search、AI 和 Graph 消费者必须幂等；重复消费不能创建重复页面、边或索引文档。

### 一致性

- 对象和版本写入要求强一致；
- Read Model 允许可观测的最终一致；
- 发布中心显示每个目标的版本和回执；
- 必要目标未确认时，不得把 Release 宣布为 `published`。

本设计不决定具体数据库、消息队列或搜索产品，避免在需求和数据契约尚未验证前锁定技术。

## 8. 安全与审计

- 所有写接口必须鉴权；
- 审批和发布使用独立权限；
- 禁止共享默认管理员账号；
- 日志不记录密码、Token、Authorization Header 或知识原件中的敏感字段；
- 每次状态变化记录 actor、role、timestamp、from、to、reason 和 object_version_id；
- 批准记录、发布回执和回滚记录不可被普通编辑删除；
- AI 服务账户只允许读取 Published Read Model；
- Draft、Review 和内部 Evidence 不进入公开搜索、sitemap、RSS 或 AI 导出。

## 9. Dashboard 设计

### 核心指标

| 指标 | 口径 |
| --- | --- |
| JD 数量 | Registry 中 `object_type=JD` 的唯一对象数 |
| Question 数量 | Question Registry 中唯一 QID 数 |
| Answer 数量 | Answer Registry 中唯一 AID 数 |
| Evidence 数量 | Evidence Registry 中唯一 EID 数 |
| Draft 数量 | 当前工作版本处于 `draft` 的对象数 |
| Published 数量 | 存在有效 `current_published_version_id` 的对象数 |
| 最近更新 | 按最新版本 `updated_at` 排序，不使用文件 mtime |
| 热门知识对象 | 预留；必须来自真实访问事件和明确时间窗 |
| 热门搜索 | 预留；必须来自匿名化真实查询，不记录敏感搜索内容 |

计数必须从 Registry 或 Metric Snapshot 计算，不得硬编码。Dashboard 同时显示“数据更新时间”和“统计口径版本”。

### 质量与发布健康

- 无主 JD 的 Published Question；
- 无证据的需证据 Answer；
- 失效关系；
- 待审核时间；
- 已批准未发布数量；
- 发布目标版本不一致；
- 待修订或失效法律影响对象；
- 最近一次 Release 状态。

## 10. 技术决策摘要

1. Knowledge Studio 是唯一内部知识写入控制面。
2. Foundation / Authority Layer 是正式知识 SSOT；Read Model 可重建。
3. JD 是唯一理论 SSOT，其他对象只能引用、解释、举证或应用。
4. 对象身份、版本、审核、批准、发布和渠道回执分开记录。
5. 统一编辑框架由 Common Envelope + Type-specific Payload 组成。
6. 统一生命周期的主路径为 `draft → in_review → approved → published → archived`。
7. `pending_revision` 是异常修订状态，不与正常主路径混淆。
8. 关系使用显式 Edge Object，为未来知识图谱预留。
9. 发布使用不可变 Release Manifest 和幂等适配器。
10. 本轮不开发 UI、数据库、Agent 或自动知识生产。
