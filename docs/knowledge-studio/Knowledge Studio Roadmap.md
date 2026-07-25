# Knowledge Studio Roadmap

版本：V1.0
状态：Design

## 1. 路线原则

1. 先稳定对象、版本和生命周期，再开发复杂 UI。
2. 先保证人工审核和可追溯发布，再引入 AI 辅助。
3. 当前 Foundation 继续作为权威来源，迁移必须对账。
4. JD 始终是唯一理论 SSOT。
5. 每阶段都可以独立验收和回滚。
6. 不以对象数量、自动生成量或界面完成度替代知识质量。

## 2. 第一阶段：知识编辑

### 目标

建立统一的 Common Envelope、Type-specific Payload 和 Relationship Editor 契约，使 JD、Question、Answer、Evidence、Case、Law、GT 等对象可以使用同一编辑框架。

### 范围

- 对象 ID 和类型 Registry；
- Draft 创建与保存；
- 通用字段编辑；
- 类型专属字段扩展点；
- 来源追溯；
- 关系候选；
- Schema 与必填校验；
- 跨对象只读搜索；
- 当前 Foundation Adapter。

### 不做

- 不开放公开写 API；
- 不自动生成内容；
- 不替换 Foundation SSOT；
- 不建设复杂富文本或页面搭建器。

### 验收

- 所有支持类型均可生成合法 Draft；
- 无类型通过复制独立编辑器实现；
- Draft 不进入公开 Website、Search、AI 或 GEO；
- 对象 ID 唯一；
- 现有 Foundation 对象读取结果不变。

## 3. 第二阶段：审核

### 目标

实现统一 `draft → in_review → approved` 流程和类型特定审核清单。

### 范围

- Review Queue；
- 审核人分配；
- 退回意见；
- Approval Record；
- 职责分离；
- 服务端权限校验；
- 来源、法律、Evidence 和关系门槛；
- 审核时版本冻结。

### 验收

- 普通编辑不能批准；
- AI 不能改变状态；
- 审核对象修改必须先退回 Draft；
- Approval Record 与版本 checksum 一致；
- 所有决定可审计。

## 4. 第三阶段：版本管理与发布中心

### 目标

实现不可变版本、Diff、Release Manifest、多目标发布和回滚。

### 范围

- Object Version；
- 版本比较；
- 替代和归档；
- Release Candidate；
- Publication Validation；
- Website / Search / AI / GEO Adapters；
- 目标回执；
- `approved → published`；
- 回滚与紧急撤回。

### 验收

- Approved 不自动公开；
- Published 必须有成功 Release；
- 多目标版本可对账；
- 重复发布幂等；
- 回滚不删除审计历史；
- 当前公开版本可一键定位到对象、版本、批准和 Release。

## 5. 第四阶段：知识图谱

### 目标

把显式 Edge Object 投影为可查询知识图谱。

### 范围

- 受控 Predicate；
- 反向关系；
- 关系版本和来源；
- Graph Projection；
- 影响分析；
- 失效边与孤立对象检查；
- Related Content 与图查询；
- Law 失效和 JD 修订传播。

### 验收

- Graph 可由 Authority Layer 重建；
- 图中每个节点和边可追溯；
- Draft 对象和边不公开；
- `maps_to`、`supersedes` 等约束有效；
- 关系不复制正文。

## 6. 第五阶段：AI 知识生产

### 目标

在人工治理和发布体系成熟后，引入可控的 AI 辅助生产。

### AI 可以做

- 提出 Question 候选；
- 标记可能重复对象；
- 建议关系候选；
- 生成摘要候选；
- 检查 Answer 与 JD 版本可能不一致；
- 提示 Evidence 或 Citation 缺口；
- 辅助检索和影响分析。

### AI 不可以做

- 自行创建正式理论；
- 自动批准或发布；
- 把聊天记录直接写入 Registry；
- 伪造 Evidence、法律依据、案例或搜索热度；
- 静默修改已批准 JD；
- 绕过人工审核写入 Published Read Model。

### 验收

- 所有 AI 产物明确标为 Candidate；
- 人工审核记录完整；
- AI 写权限与正式库隔离；
- 每项 Published 内容都能追溯到批准人和来源；
- AI 回答带对象 ID、版本和 Citation。

## 7. Dashboard 与统计演进

### 第一阶段

- JD、Question、Answer、Evidence 数量；
- Draft、In Review、Approved、Published 数量；
- 最近更新；
- 校验失败和失效关系。

### 第二阶段

- 审核队列时长；
- 已批准未发布；
- 发布成功率；
- 版本复核到期；
- 类型和负责人覆盖。

### 后续预留

- 热门知识对象；
- 热门搜索；
- Question 无结果率；
- AI 引用率；
- GEO 收录和引用表现；
- 渠道内容复用情况。

热门指标必须有真实事件、时间窗、去重和隐私口径；没有数据时显示“未接入”，不得构造榜单。

## 8. 从 Markdown 到 Studio 的迁移

### 阶段 A：只读接入

Studio 通过 Adapter 读取 Foundation、Manifest 和 Markdown，不改变现有写入链路。

### 阶段 B：双读单写

Studio 成为 Draft 和 Workflow 的唯一写入面；正式发布仍生成兼容 Foundation 产物。禁止双写两个权威源。

### 阶段 C：权威切换

完成对象数、版本、checksum、关系和发布结果对账后，正式切换 Authority Adapter。旧 Markdown 保留为可导出的版本载体或归档，不再作为并行可写 SSOT。

### 阶段 D：清理兼容层

在回滚窗口结束且审计批准后，移除旧写入入口。所有消费者只读取 Published Read Model。

## 9. 十万级里程碑

| 规模 | 重点 |
| --- | --- |
| 1,000 对象 | 验证对象契约、审核、版本和发布 |
| 10,000 对象 | 持久化索引、增量统计、关系质量和任务队列 |
| 100,000 对象 | 分区、事件消费、Graph Projection、批量影响分析和 SLO |

技术升级由真实容量、延迟和运维指标触发，不因路线图预先引入 ORM、图数据库、向量数据库或消息队列。

## 10. 建议实施顺序

1. 批准 Knowledge Studio Architecture、Lifecycle 和 Relationship Model；
2. 将前置 PR #15、#16 依次合并并完成本 PR retarget；
3. 另立实施 Sprint，先做只读 Studio Prototype 和 Schema 校验；
4. 批准统一 Lifecycle V2 后再修改运行时状态机；
5. 先上线编辑和审核，再上线发布中心；
6. 完成版本与 Release 对账后再迁移权威写入面；
7. 关系质量稳定后建设 Graph Projection；
8. 最后开放受控 AI 候选生产。

## 11. 当前风险

| 风险 | 影响 | 控制 |
| --- | --- | --- |
| 把 Studio 当普通 CMS | 版本、关系和审批丢失 | 以对象和 Release 为核心，不以页面为核心 |
| 新数据库与 Foundation 双写 | 产生双 SSOT | Adapter 迁移、双读单写、强制对账 |
| Approved 被误当 Published | 未完成发布即对外声明 | 独立 Release 状态和回执 |
| 所有类型强行使用完全相同字段 | 产生无意义或虚假数据 | Common Envelope + Type-specific Payload |
| AI 提前参与正式写入 | 污染知识库 | Candidate-only、只读正式库、人工批准 |
| 关系自由文本化 | 无法形成知识图谱 | 受控 Predicate 和 Edge Schema |
| 十万级目标导致过早工程化 | 成本和复杂度失控 | 按真实规模门槛升级 |

## 12. 本轮明确不做

- 不开发后台 UI；
- 不开发数据库；
- 不修改首页或详情页；
- 不编写治理内容；
- 不自动生成知识；
- 不开发 AI Agent；
- 不改变当前 Foundation 状态机；
- 不修改现有对象或关系；
- 不引入依赖；
- 不部署 Knowledge Studio。
