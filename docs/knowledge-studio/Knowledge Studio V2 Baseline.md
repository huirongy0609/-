# Knowledge Studio V2 Baseline

版本：V2.0

状态：Approved / Frozen Baseline

批准日期：2026-07-25

批准依据：Knowledge Object Model V2.0（PR #18，Merge Commit `e93c78229482d01a1acc2d9a77667c947714c73a`）

## 1. 基线效力

本文件是 Knowledge Studio V2 后续产品、内容、数据、搜索、GEO、AI 和工程工作的统一架构基线。

发生解释冲突时，适用顺序为：

1. 本 V2 Baseline；
2. 《Knowledge Object Model V2.0》；
3. 《Knowledge Studio V2 调整建议》；
4. 《知识对象与 SSOT 一致性分析》；
5. 不与上述文件冲突的 V1 生命周期、版本、关系与发布设计。

旧 Question Object、独立 Answer Layer 及独立 Question Registry 设计保留为历史研究记录，不再具有现行规范效力，不得据此实施。

## 2. 核心原则

### 2.1 唯一真实知识源

Knowledge Object 是平台唯一真实知识源（SSOT）。

每个知识主题只有一个永久 `object_id`，只有一个对象级版本边界。标题、页面、用户问法、渠道、语言视图或传播形式不得创建平行知识源。

### 2.2 一个对象，一个版本边界

Definition、Questions、Canonical Answer、Evidence Bindings 及其他组成部分共同形成一个不可变 Object Version。

审核、批准、发布和回滚针对完整 Object Version：

```text
draft → in_review → approved → published → archived
```

`approved` 与 `published` 严格分离。Published 必须具备 Release Manifest 和必要目标回执。

### 2.3 所有内容围绕对象组织

网站页面、问题入口、标准回答、证据、文章、工具、案例和媒体都必须能够追溯到：

- `object_id`；
- `version_id`；
- Approval Record；
- Release Record（公开内容适用）；
- Evidence / Source Traceability（适用）。

无法回溯到 Knowledge Object 的内容不得成为平台正式知识。

## 3. Knowledge Object 标准组成

```text
Knowledge Object
├── Metadata
├── Definition
├── Questions
├── Canonical Answer
├── Evidence
├── Related Objects
├── Cases
├── Tools
├── GEO Assets
├── Media
└── Version History
```

### 3.1 Metadata

保存永久身份、标题、别名、分类、关键词、语言、责任人、来源追溯、复核策略和公开级别。

### 3.2 Definition

保存对象的唯一标准定义、适用范围和边界。Definition 是对象组件，不是独立对象或第二套定义库。

### 3.3 Questions

保存用户对同一知识主题的真实问法、意图、受众、别名和回答范围映射。

Question 不具有独立理论身份，不建立独立权威生命周期。用于检索的 Question Document 是可重建索引视图。

### 3.4 Canonical Answer

保存对象当前版本、当前语言的唯一标准解释。多个 Questions 可以映射到 Canonical Answer 的不同 claim blocks，不得分别维护重复标准答案。

### 3.5 Evidence

Evidence Binding 属于 Object Version，并将具体 claim 绑定到可核验 Source Record 和精确定位。

共享 Source Record 只是来源登记，不是理论 SSOT。来源名称或链接不能替代声明级 Evidence Binding。

### 3.6 Related Objects

使用稳定 ID 和受控 Predicate 连接其他 Knowledge Objects。关系只保存语义与目标身份，不复制目标正文。

### 3.7 Cases

对象内简短例证可以作为组件。具有独立事实、来源、隐私和版本治理要求的完整案例可以成为独立 Knowledge Object，再通过关系引用。

### 3.8 Tools

对象专属工具作为对象组件；被多个主题复用且需要独立版本和批准的工具可以成为独立 Knowledge Object。

### 3.9 GEO Assets

GEO Article、FAQ 表达、AI Summary、多语言表达及引用友好摘要都属于父对象的衍生资产。它们必须保存 `derived_from_version_id`，不得增加 Canonical Answer 中不存在的理论。

### 3.10 Media

图片、视频、PPT、图表及其他媒体通过资产绑定归属于对象或引用共享资产。媒体展示不能改变知识事实。

### 3.11 Version History

记录对象每个不可变版本、变化组件、审批、发布、替代关系、校验值和有效期。已批准或已发布版本不得静默覆盖。

## 4. Reconstructable Views 原则

以下均不是独立知识：

- Website View；
- AI View；
- GEO View；
- Search View。

它们全部是 Knowledge Object 的可重建视图（Reconstructable Views）。

```text
Published Knowledge Object Version
├── Website View
├── AI View
├── GEO View
└── Search View
```

每个 View 必须携带或能够解析：

- `object_id`；
- `source_version_id`；
- `view_schema_version`；
- `generated_at`；
- 公开与权限策略；
- 对账标识或 checksum。

View 可以删除并重建，不拥有审核权、批准权或反向写入 Authority 的权力。

### Website View

负责页面结构、导航、Metadata、Structured Data 和公开阅读体验。页面不是新的知识对象。

### AI View

负责向 AI 提供 Definition、匹配 Questions、Canonical Answer claim blocks、Evidence Bindings 和版本信息。AI 生成表达不是正式知识。

### GEO View

负责搜索意图适配、FAQ、文章、摘要和引用表达。所有 GEO 资产必须回指父对象及版本，不得建立平行 GEO 正文。

### Search View

负责索引标题、别名、Questions、Definition 和 claim blocks。同一对象的多个命中必须聚合到同一 Knowledge Object。

## 5. SSOT 禁止事项

自本基线生效起，禁止建立：

1. 第二套 Question Registry；
2. 第二套 Answer Registry；
3. 第二套 GEO 正文；
4. 第二套定义；
5. 与 Knowledge Object 并行可写的 Markdown、数据库或渠道知识库；
6. 不能回溯到父对象版本的 AI、Search、Website 或 GEO 正式内容；
7. 以页面、问法、摘要、索引或向量记录替代 Knowledge Object 身份；
8. 由 AI 自动批准、发布或静默写回正式知识。

Question 可以有对象内稳定定位符；Answer 可以有 claim block 定位符；这些定位符不构成独立权威 Registry。

所有衍生内容必须引用同一个 Knowledge Object。

## 6. 允许的扩展

V2 允许在不破坏 SSOT 的前提下扩展：

- 新组件类型；
- 新对象类型；
- 新受控关系；
- 新 Evidence 类型；
- 新语言；
- 新 Website / AI / GEO / Search View；
- 新发布目标；
- 新审核清单；
- 新存储或索引技术；
- 新图谱、培训、API 或媒体消费方式。

扩展必须满足：

1. 永久对象身份不变；
2. 当前权威版本唯一；
3. 组件属于对象或通过稳定关系引用对象；
4. Read Model 可重建；
5. 不新增平行权威写入面；
6. Approved / Published 分离继续有效；
7. 迁移经过对账并可回滚。

## 7. 与现有平台兼容

- 现有 JD ID 继续作为 Knowledge Object 永久身份；
- Foundation Registry 在 Authority Adapter 正式迁移前继续承载当前权威事实；
- 现有 `questions[]` 只作为对象内 Questions 的兼容字段；
- 现有 Related Topics 继续作为对象关系的兼容投影；
- Website、Search、GEO 和 JSON-LD 继续消费公开对象；
- 不因本基线自动修改代码、数据库或现网数据；
- 后续迁移必须采用双读单写，禁止双 SSOT。

## 8. 当前阶段：Knowledge Object Production

基础设施基线已经能够支持知识对象持续建设。平台工作重心正式由：

```text
Infrastructure First
```

转入：

```text
Knowledge First
```

当前阶段优先事项：

- 依据 Primary Sources 和 Book Mapping 建设 JD000～JDxxx；
- 建设 GT；
- 建设可核验案例；
- 建设 Evidence Bindings 和 Source Records；
- 完善现有 Knowledge Object 的 Definition、Questions、Canonical Answer、关系和版本；
- 将网站作为知识资产第一发布面；
- 持续改善内链、Related Objects、GEO 和 AI 可引用性。

“JD000～JDxxx”表示编号承载范围，不代表这些对象已经入库或获批。实际数量必须以 Foundation / Authority Registry 为准。

除非出现真实 P0 生产阻塞，不再以扩展框架替代知识资产建设。

## 9. 冻结声明

自本基线批准后，Knowledge Studio V2 的核心对象模型原则上冻结。

未来新增能力只能扩展，不能破坏：

> Knowledge Object 作为唯一真实知识源（SSOT）的架构原则。

任何拟改变下列事项的提案必须作为架构例外处理，并取得项目总架构师书面批准：

- Question 或 Answer 重新成为独立权威对象；
- 同一主题存在多个当前 Canonical Answer；
- View 获得独立权威写入权；
- Authority 出现双写；
- 发布绕过对象版本、审批或 Release Manifest；
- AI 获得批准或发布权。

未获批准的例外不得进入实施。

## 10. 基线结论

Knowledge Studio V2 Baseline 正式生效。

平台正式进入 Knowledge Object Production（知识对象建设阶段）。后续默认任务应优先生产、完善、关联和发布真实 Knowledge Objects，而不是继续讨论 Question、Answer 或 Definition 是否独立，也不是继续扩展未被真实知识生产证明必要的基础设施。
