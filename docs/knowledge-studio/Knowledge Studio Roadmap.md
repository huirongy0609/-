# Knowledge Studio Roadmap

版本：V2.0
状态：Approved / Baseline Frozen

> 本 Roadmap 受《Knowledge Studio V2 Baseline》约束。Knowledge Object 是唯一 SSOT；Definition、Questions、Canonical Answer 与 Evidence Bindings 属于同一对象。旧独立 Question / Answer 路线不再有效。

## 1. 路线原则

1. 先稳定对象、版本和生命周期，再开发复杂 UI。
2. 先保证人工审核和可追溯发布，再引入 AI 辅助。
3. 当前 Foundation 继续作为 Authority Adapter，迁移必须对账。
4. Knowledge Object 是唯一 SSOT；现有 JD ID 作为 Knowledge Object 永久身份继续使用。
5. 每阶段都可以独立验收和回滚。
6. 不以对象数量、自动生成量或界面完成度替代知识质量。

## 2. Phase 1：Infrastructure Baseline（已完成）

### 阶段结论

平台已经完成支持持续知识生产的基础能力：

- Knowledge Center；
- Foundation Engine；
- Search Index；
- GEO Framework；
- Knowledge Object Schema 基础；
- 统一生命周期；
- 不可变版本、Approval Record 和 Release Manifest 设计；
- Knowledge Object Model V2；
- Knowledge Studio V2 Baseline。

除真实知识生产暴露 P0 阻塞外，不再继续以 Infrastructure First 作为默认工作方式。

## 3. Phase 2：Knowledge Object Production（当前阶段）

### 阶段转向

平台工作重心正式由：

```text
Infrastructure First
```

转入：

```text
Knowledge First
```

### 主要目标

1. 依据 Primary Sources、Book Mapping Report 和批准原件建设 JD000～JDxxx；
2. 建设和完善 GT；
3. 建设有真实来源、隐私边界和时间事实的案例；
4. 建设 Evidence Bindings 和可复用 Source Records；
5. 完善每个 Knowledge Object 的 Metadata、Definition、Questions 和 Canonical Answer；
6. 建设 Related Objects、Cases、Tools、GEO Assets 和 Media 绑定；
7. 以网站永久知识页作为第一发布面；
8. 由同一 Published Object Version 生成 Website、Search、GEO 和 AI Views。

“JD000～JDxxx”只表示长期编号范围，不代表对应对象已经入库。实际资产数量必须以 Foundation / Authority Registry 为准。

### 生产顺序

```text
Primary Source / 杨老师母稿
  → Knowledge Object Draft
  → Definition / Questions / Canonical Answer / Evidence
  → Review
  → Approved
  → Release
  → Website
  → Search / GEO / AI Reconstructable Views
```

### 验收指标

- 新增对象均有永久 ID、来源追溯和明确生命周期；
- 已批准对象不存在第二套定义或标准答案；
- Questions 全部属于父 Knowledge Object；
- Evidence 能定位到对象声明和真实来源；
- Draft 不进入公开页面、Search、GEO 或 AI；
- Published 内容具备 Release Manifest 和必要回执；
- 对象关系只引用稳定 ID，不复制正文；
- 覆盖率和对象数量来自 Registry，不使用宣称数字。

### 当前不做

- 不建立独立 Question Registry；
- 不建立独立 Answer Registry；
- 不建立第二套 GEO 正文；
- 不因未来规模提前引入数据库、ORM、图数据库或向量数据库；
- 不以开发 Studio UI 替代知识生产；
- 不自动生成或批准知识。

## 4. 后续工程能力 A：Knowledge Object 编辑

### 目标

在真实知识生产证明需要后，建立统一 Knowledge Object 编辑框架。Definition、Questions、Canonical Answer 和 Evidence Bindings 作为同一对象组件；Case、Law、GT 等仅在满足独立对象判定标准时成为 Knowledge Object。

### 范围

- 对象 ID 和类型 Registry；
- Draft 创建与保存；
- 通用字段编辑；
- 对象组件扩展点；
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

- 所有支持对象均可生成合法 Draft；
- 不为 Definition、Question 或 Answer 创建独立权威编辑器；
- Draft 不进入公开 Website、Search、AI 或 GEO；
- 对象 ID 唯一；
- 现有 Foundation 对象读取结果不变。

## 5. 后续工程能力 B：审核

### 目标

实现统一 `draft → in_review → approved` 流程和对象组件审核清单。最终 Approval Record 必须绑定完整 Object Version checksum。

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

## 6. 后续工程能力 C：版本管理与发布中心

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

## 7. 后续工程能力 D：知识图谱

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
- 对象间受控 Predicate 与 `supersedes` 等约束有效；
- 关系不复制正文。

## 8. 后续工程能力 E：AI 辅助生产

### 目标

在人工治理和发布体系成熟后，引入可控的 AI 辅助生产。

### AI 可以做

- 为指定 Knowledge Object 提出 Questions 组件候选；
- 标记可能重复对象；
- 建议关系候选；
- 生成摘要候选；
- 检查 Canonical Answer 与 Definition、Evidence 可能不一致；
- 提示 Evidence 或 Citation 缺口；
- 辅助检索和影响分析。

### AI 不可以做

- 自行创建正式理论；
- 自动批准或发布；
- 把聊天记录直接写入 Authority；
- 伪造 Evidence、法律依据、案例或搜索热度；
- 静默修改已批准 Knowledge Object；
- 绕过人工审核写入 Published Read Model。

### 验收

- 所有 AI 产物明确标为 Candidate；
- 人工审核记录完整；
- AI 写权限与正式库隔离；
- 每项 Published 内容都能追溯到批准人和来源；
- AI 回答带对象 ID、版本和 Citation。

## 9. Dashboard 与统计演进

### 第一阶段

- Knowledge Object 数量；
- Definition、Questions、Canonical Answer、Evidence 覆盖率；
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

## 10. 从 Markdown 到 Studio 的迁移

### 阶段 A：只读接入

Studio 通过 Adapter 读取 Foundation、Manifest 和 Markdown，不改变现有写入链路。

### 阶段 B：双读单写

Studio 成为 Draft 和 Workflow 的唯一写入面；正式发布仍生成兼容 Foundation 产物。禁止双写两个权威源。

### 阶段 C：权威切换

完成对象数、版本、checksum、关系和发布结果对账后，正式切换 Authority Adapter。旧 Markdown 保留为可导出的版本载体或归档，不再作为并行可写 SSOT。

### 阶段 D：清理兼容层

在回滚窗口结束且审计批准后，移除旧写入入口。所有消费者只读取 Published Read Model。

## 11. 十万级里程碑

| 规模 | 重点 |
| --- | --- |
| 1,000 对象 | 验证对象契约、审核、版本和发布 |
| 10,000 对象 | 持久化索引、增量统计、关系质量和任务队列 |
| 100,000 对象 | 分区、事件消费、Graph Projection、批量影响分析和 SLO |

技术升级由真实容量、延迟和运维指标触发，不因路线图预先引入 ORM、图数据库、向量数据库或消息队列。

## 12. 建议实施顺序

1. 立即进入 Knowledge Object Production；
2. 优先建设、完善和发布真实 JD、GT、Case 和 Evidence；
3. 用真实对象验证 V2 组件边界，不创建独立 Question / Answer Registry；
4. 仅在真实生产出现阻塞时立项编辑、审核或发布工程能力；
5. 完成版本与 Release 对账后再迁移权威写入面；
6. 关系质量稳定后建设 Graph Projection；
7. 最后开放受控 AI 候选生产。

## 13. 当前风险

| 风险 | 影响 | 控制 |
| --- | --- | --- |
| 把 Studio 当普通 CMS | 版本、关系和审批丢失 | 以对象和 Release 为核心，不以页面为核心 |
| 新数据库与 Foundation 双写 | 产生双 SSOT | Adapter 迁移、双读单写、强制对账 |
| Approved 被误当 Published | 未完成发布即对外声明 | 独立 Release 状态和回执 |
| 所有对象强行使用完全相同组件 | 产生无意义或虚假数据 | 必需组件 + 按对象类型启用可选组件 |
| 再建 Question / Answer Registry | 形成第二套 SSOT | Baseline 禁止；Questions 和 Canonical Answer 归属父对象 |
| AI 提前参与正式写入 | 污染知识库 | Candidate-only、只读正式库、人工批准 |
| 关系自由文本化 | 无法形成知识图谱 | 受控 Predicate 和 Edge Schema |
| 十万级目标导致过早工程化 | 成本和复杂度失控 | 按真实规模门槛升级 |

## 14. 当前阶段明确不做

- 不开发后台 UI；
- 不开发数据库；
- 不修改首页或详情页；
- 不在工程任务中编写未经批准的治理内容；知识生产任务按来源治理执行；
- 不自动生成知识；
- 不开发 AI Agent；
- 不改变当前 Foundation 状态机；
- 不修改现有对象或关系；
- 不引入依赖；
- 不部署 Knowledge Studio。
