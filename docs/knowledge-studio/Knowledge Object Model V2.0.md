# 《Knowledge Object Model V2.0》

版本：V2.0

状态：Design Proposal

适用范围：Knowledge Studio、Knowledge Center、Foundation Engine、Search、GEO、AI Read Model

最高原则：一个知识对象是一个知识主题的唯一真实知识源（SSOT）

## 1. 决策摘要

建议采用 Knowledge Object V2 模型。

V2 不再把 Definition、Question、Answer 当作三个彼此独立的正式知识对象，而是把它们定义为同一个 Knowledge Object 的受治理组成部分：

```text
Knowledge Object
├── Identity & Metadata
├── Definition
├── Questions
├── Canonical Answer
├── Evidence Bindings
├── Related Objects
├── GEO Assets
├── Tools
├── Cases
├── Media
└── Version History
```

核心判断：

1. Knowledge Object 是永久身份、版本、审核和发布的最小权威单元。
2. Definition 是该对象的标准定义，不再等同于一种独立对象类型。
3. Question 是用户语言入口，不具有独立理论身份。
4. Canonical Answer 是对该对象的唯一标准解释，不建立平行 Answer SSOT。
5. Evidence 是对象内的声明—来源绑定；可引用共享 Source Record，但不得复制成另一套理论。
6. GEO、Search、AI、FAQ、网站页面是同一对象的 Read Model 或 Publication View，不是新的知识源。
7. JD001 等现有 ID 可继续作为 Knowledge Object 的永久 ID，不要求重新编号。
8. V2 保留 V1 已设计的生命周期、不可变版本、Approval Record、Release Manifest 和发布回执。

## 2. 模型边界

### 2.1 什么是一个 Knowledge Object

Knowledge Object 表达一个可以被稳定命名、定义、提问、回答、举证、关联和长期修订的知识主题。

例如，`JD009` 的对象主题是“开放式预算”。以下内容都围绕同一主题：

- “什么是开放式预算”的标准定义；
- 用户可能提出的多个真实问题；
- 面向公开阅读和 AI 输出的唯一标准答案；
- 支撑关键声明的法律、图书章节、案例或数据；
- 关联的治理工具、案例、文章、图片和视频；
- 搜索、GEO、培训等渠道使用的衍生表达。

它们不应分别产生互相漂移的理论版本。

### 2.2 什么不是 Knowledge Object

以下内容默认不是独立 Knowledge Object：

- 同一概念的一个问法；
- 同一概念的一段标准回答；
- 页面标题、SEO Description 或 AI 摘要；
- 某个渠道的文章改写；
- 搜索索引文档；
- JSON-LD、RSS 或 Sitemap 条目；
- 发布构建产物；
- 单纯用于排版的图片裁切或视频转码。

这些内容是对象的组件、视图、投影或发布资产。

### 2.3 何时允许形成另一个 Knowledge Object

仅当某项内容同时满足以下条件时，才考虑建立独立 Knowledge Object：

1. 它具有可独立表述的知识主题，而不是原对象的问法或改写；
2. 它需要独立生命周期、版本和批准决定；
3. 它可以被多个对象引用，且不能合理归属于其中任何一个对象；
4. 它有稳定永久身份；
5. 分离后不会形成同一理论的两个权威版本。

例如，一部法律、一个完整案例或一套治理标准可以在后续作为独立 Knowledge Object；但它与主题对象之间必须通过关系引用，而不能复制正文。是否独立由知识治理决定，不由页面形态决定。

## 3. V2 逻辑结构

### 3.1 Authority Aggregate

```text
Knowledge Object
├── object_id
├── object_kind
├── current_draft_version_id
├── current_approved_version_id
├── current_published_version_id
├── Object Versions[]
├── Approval Records[]
└── Release Records[]
```

Knowledge Object 表示永久身份。Object Version 表示一次不可变的完整知识快照。

```text
Object Version
├── version_id
├── schema_version
├── semantic_version
├── metadata
├── definition
├── questions[]
├── canonical_answer
├── evidence_bindings[]
├── related_object_edges[]
├── geo_assets[]
├── tool_bindings[]
├── case_bindings[]
├── media_assets[]
├── component_checksums
├── lifecycle_status
└── object_checksum
```

审核与批准针对完整 Object Version。发布只能引用已批准的不可变版本。

### 3.2 Metadata

| 字段 | 作用 |
| --- | --- |
| `schema_version` | V2 Schema 版本 |
| `object_id` | 永久身份；现有 JD ID 可沿用 |
| `object_kind` | 概念、制度、方法、标准、法律、案例等稳定机器值 |
| `legacy_type` | 兼容 JD、GT、CASE 等现有分类；不作为新 SSOT |
| `title` | 正式标题 |
| `aliases[]` | 同义名、简称、常见叫法 |
| `summary` | 对象级摘要 |
| `keywords[]` | 受控关键词 |
| `category_id` | 稳定分类身份 |
| `locale` | BCP 47 |
| `owner_id` | 知识责任人 |
| `source_traceability` | 图书、批准原件及其他来源追溯 |
| `review_policy` | 专业、法律、证据等审核要求 |
| `freshness_policy` | 复核周期和触发条件 |
| `sensitivity` | 公开、内部、受限 |

标题、分类或路径变化不得改变 `object_id`。

### 3.3 Definition

Definition 是知识对象的最短权威定义：

```text
definition
├── statement
├── scope
├── boundaries[]
├── source_binding_ids[]
└── reviewed_at
```

要求：

- 一个版本只能有一个当前 Definition；
- Definition 必须能够独立被引用；
- 边界和不适用范围不能只留在长正文中；
- Definition 的变化属于知识语义变化，必须触发对象新版本和重新审核。

### 3.4 Questions

Questions 是同一对象的用户语言映射集合：

```text
questions[]
├── local_question_id
├── text
├── normalized_text
├── aliases[]
├── intent_type
├── audiences[]
├── priority
├── source_traceability
├── answer_scope_refs[]
├── status
└── reviewed_at
```

规则：

- Question 不再拥有脱离父对象的理论生命周期；
- `local_question_id` 只用于对象内稳定定位，例如 `JD009#q-001`；
- Question 的批准状态不能超过所在 Object Version；
- 问题可以独立进入派生搜索索引，但目标始终是父对象；
- 问题可被不同渠道显示或隐藏，不因此产生新知识对象；
- 同义问法进入 `aliases[]`，不为数量或 SEO 批量拆成对象；
- 旧 `Q000001` 若尚未形成正式数据，可停止启用；若未来已经存在外部引用，则保留为兼容别名并解析到 `object_id + local_question_id`。

### 3.5 Canonical Answer

Canonical Answer 是对象当前版本的唯一标准解释：

```text
canonical_answer
├── short_answer
├── full_answer
├── claim_blocks[]
├── applicability
├── limitations[]
├── source_binding_ids[]
└── reviewed_at
```

规则：

1. 每个对象版本、每种正式语言只能有一个 Canonical Answer。
2. 多个 Question 可以定位到 Canonical Answer 的不同 `claim_blocks`，不得各自维护一份重复答案。
3. 面向业主、物业企业或街道社区的不同表达是 Presentation View；若改变事实含义，必须回到 Canonical Answer 修订。
4. AI 可以基于允许的 claim blocks 组织回答，但生成文本不是新的 Canonical Answer。
5. Canonical Answer 与 Definition 不应互相矛盾；自动一致性检查只能告警，批准仍由人工完成。

### 3.6 Evidence Bindings

Evidence 在 V2 中分为两层：

```text
Evidence Binding（属于 Knowledge Object Version）
├── binding_id
├── claim_locator
├── source_record_id
├── source_locator
├── support_type
├── verification_status
├── verified_by
├── verified_at
└── valid_until

Source Record（可共享的来源登记）
├── source_record_id
├── source_type
├── title
├── publisher_or_authority
├── edition_or_version
├── canonical_location
└── integrity_metadata
```

Evidence Binding 属于对象版本，表达“本对象的哪项声明由何处支撑”。Source Record 可以被多个对象复用，但它只是来源登记，不是平行理论 SSOT。

这样既满足“Evidence 属于同一对象”，又避免在多个对象中复制同一法律、图书或原始资料。

### 3.7 Related Objects

对象之间使用受控关系：

```text
related_object_edges[]
├── edge_id
├── predicate
├── target_object_id
├── target_version_constraint
├── provenance
└── status
```

推荐谓词包括：

- `broader_than` / `narrower_than`；
- `prerequisite_of`；
- `related_to`；
- `operationalized_by`；
- `illustrated_by`；
- `governed_by`；
- `supersedes`。

关系不复制目标对象标题、定义或正文。显示信息由 Registry 解析。

### 3.8 GEO Assets

GEO Assets 是同一对象的传播和检索视图：

```text
geo_assets[]
├── asset_id
├── asset_type
├── target_query_or_intent
├── content_ref
├── derived_from_version_id
├── canonical_object_id
├── publication_status
└── freshness_status
```

可包括：

- 长文；
- FAQ 展示视图；
- AI Summary；
- 比较页片段；
- Citation-friendly 摘要；
- 多语言翻译。

GEO Asset 不得自行增加 Canonical Answer 中不存在的理论。所有公开资产必须标记来源对象版本，并在父对象更新后进入影响检查。

### 3.9 Tools、Cases、Media

采用“归属或引用”双模式：

| 类型 | 对象内归属 | 独立对象引用 |
| --- | --- | --- |
| Tool | 仅服务一个对象、没有独立治理意义 | 被多个主题复用或需要独立版本/审批 |
| Case | 仅为对象内的简短例证 | 具有完整事实、来源、隐私和独立生命周期 |
| Media | 对象专属图片、图表、视频/PPT | 跨对象共享且需要独立版权/版本治理 |

无论采用哪种模式，父对象只保存绑定关系和发布策略，不复制另一对象的完整正文。

### 3.10 Version History

Version History 记录完整对象演进：

```text
version_history[]
├── version_id
├── semantic_version
├── changed_components[]
├── change_summary
├── supersedes_version_id
├── approval_id
├── release_ids[]
├── checksum
└── effective_period
```

版本规则：

- Definition、Canonical Answer 或核心 Evidence 变化：至少次版本并重新审核；
- Question 增删、关系调整或非语义元数据变化：按影响采用补丁或次版本；
- 拼写、格式等不改变语义的变化：补丁版本；
- 已批准或已发布版本不可静默覆盖；
- 对象可保留旧 Published Version，同时创建新 Draft。

## 4. 多种视图

同一 Object Version 可以生成多个可重建视图：

```text
Authority Object Version
├── Website View
├── Search Documents
├── AI Retrieval Package
├── GEO / FAQ View
├── Structured Data
├── RSS / Sitemap Entry
├── Training View
└── Graph Projection
```

所有视图必须包含：

- `object_id`；
- `source_version_id`；
- `generated_at`；
- `view_schema_version`；
- `checksum` 或可对账标识；
- 公开状态和权限范围。

视图可以删除并重建，不拥有批准权，不得反向覆盖 Authority Object。

## 5. 生命周期兼容

V2 沿用现有统一生命周期：

```text
draft → in_review → approved → published → archived
```

`approved` 与 `published` 继续严格分离：

- Approved 表示完整 Object Version 已被批准；
- Published 表示该版本已进入成功 Release；
- 发布必须形成 Release Manifest 和必要目标回执；
- Draft、in_review、archived 不进入公开视图；
- `pending_revision` 继续作为异常修订状态。

组件不建立相互独立的主生命周期。必要时可使用组件级工作状态，但 Object Version 只有在所有必需组件通过后才能批准。

## 6. 发布契约

```text
Approved Object Version
  → Release Candidate
  → Publication Validation
  → Release Manifest
  → Website / Search / AI / GEO / Graph Adapters
  → Publication Receipts
  → Published
```

Release Manifest 至少记录：

- 对象与版本；
- 每个视图的版本和校验值；
- Canonical URL；
- Search、AI、GEO、Website 目标；
- 发布策略；
- 目标回执；
- 回滚点。

任一必要目标失败时，不得宣称完整发布成功。

## 7. 搜索、AI 与 GEO 适配

### Search

- Question 可以投影为多个搜索入口；
- 索引文档 ID 可使用 `{object_id}#{local_question_id}`；
- 多条问题命中聚合为一个 Knowledge Object 结果；
- 点击进入同一个永久对象页面；
- 索引丢失后可从 Published Object Version 重建。

### AI

AI Retrieval Package 建议包含：

```text
object_id
version_id
definition
matched_questions[]
canonical_answer.claim_blocks[]
evidence_bindings[]
related_object_ids[]
freshness
publication_receipt
```

AI 先识别对象，再从该对象的 Canonical Answer 和 Evidence 范围内组织回答。没有可用内容时明确返回知识缺口，不生成正式知识。

### GEO

- 一个对象只有一个 Canonical 页面；
- FAQ、文章、摘要均回指同一对象身份和版本；
- FAQPage 只能使用页面实际可见、已批准的问题与答案；
- GEO Asset 不与主对象争夺 Canonical；
- Structured Data、OpenGraph、RSS 和 Sitemap 都由相同 Published View 生成。

## 8. 规模与并发

V2 聚合不等于把所有内容存进一个巨型字段。

逻辑上一个对象是一个审核和发布边界；物理上可以按组件分块保存：

```text
object_id
  → metadata component
  → definition component
  → question components
  → canonical answer component
  → evidence binding components
  → asset manifests
```

通过 Version Manifest 固定组件版本与校验值。这样可以支持：

- 分区加载；
- 多人编辑不同组件；
- 组件级 Diff；
- 增量索引；
- 十万级对象；
- 不改变统一 SSOT 边界。

物理存储仍不在本设计中指定，不提前绑定数据库、ORM、向量库或图数据库。

## 9. 迁移原则

1. 保留现有 JD ID，不进行批量重编号。
2. 现有 JD 正文映射为 Knowledge Object 的 Definition、Canonical Answer 或正文组件，必须人工核验，不能自动改写。
3. 现有 `questions[]` 迁移为对象内 Questions；不得自动宣布批准。
4. 当前尚无正式 Question、Answer、Evidence 对象，因此应在产生独立数据前完成模型切换。
5. V1 的 QID、AID 设计保留为历史设计，不启动独立 Registry。
6. Foundation Registry 在权威切换前继续运行；V2 通过 Adapter 读取和输出兼容字段。
7. 迁移采用双读单写，不允许 V1 与 V2 同时成为可写 SSOT。
8. 当前运行时代码、生命周期和公开边界不因本文自动改变；实施必须另立 Sprint。

## 10. 非目标

- 不在本轮实现 Schema；
- 不修改现有代码、Markdown 内容或数据库；
- 不开发 Knowledge Studio UI；
- 不自动生成 Question、Answer 或 GEO 内容；
- 不把搜索索引、向量或知识图谱变成 SSOT；
- 不改变已批准知识事实；
- 不提前决定物理存储。

## 11. 验收条件

V2 进入实施前必须确认：

1. 一个对象只能有一个当前批准 Definition 和 Canonical Answer；
2. Questions 只能属于并指向一个父 Knowledge Object；
3. Evidence Binding 能定位到具体声明和可核验来源；
4. 所有衍生视图能回溯到 Object Version；
5. 更新父对象能识别受影响的 Search、AI、GEO、Tool、Case 和 Media；
6. V1 对象可在不改变永久 ID 的情况下读取；
7. Approved 与 Published 仍严格分离；
8. 不产生第二个权威写入面。

## 12. 最终建议

建议将 Knowledge Object V2 作为 Knowledge Studio 下一阶段的标准知识对象模型。

理由不是“把字段放在一起更方便”，而是 V2 把同一主题的身份、语义、问法、答案、证据和发布责任固定在同一个版本边界内。它减少跨对象同步和版本漂移，更适合 AI 检索、GEO 多视图、长期审计及十万级知识资产治理，同时完整保留 V1 已建立的生命周期、版本、关系和发布架构。
