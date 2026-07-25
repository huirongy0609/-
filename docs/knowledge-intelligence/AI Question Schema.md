# AI Question Schema

版本：V1.0
状态：Historical / Superseded by Knowledge Studio V2 Baseline
适用范围：AI Question Layer、站内搜索、GEO、FAQ、培训与后续 AI 读取

> 冻结声明：本文件保留为历史设计记录，不再是实施规范。Question 已调整为 Knowledge Object 内部 Questions 组件；禁止建立独立 Question Registry、独立 Q 生命周期或第二套 SSOT。现行规范见 `docs/knowledge-studio/Knowledge Studio V2 Baseline.md`。

## 1. 目标与边界

Question Object（Q 对象）是用户语言到治理辞典（JD）的映射层。

```text
用户问题
  → Question Object
  → 已批准 JD
  → Answer（预留）
  → Evidence（预留）
  → Citation（预留）
```

Q 对象拥有独立编号、版本和生命周期，因此可以被搜索、统计和跨渠道复用；但它没有独立创造理论的权力。所有正式 Q 必须锚定至少一个已批准 JD，JD 始终是信托制物业理论的唯一正式来源（SSOT）。

本规范只定义数据契约，不生成 Question、Answer、Evidence 或 Citation 内容。

## 2. 核心关系

```text
JD 1 ───── N Question
Question 1 ───── N Answer Version（预留）
Answer N ───── N Evidence（预留）
Answer 1 ───── N Citation（预留）
```

- 一个 JD 可以对应多个 Question。
- 一个 Question 必须有且只有一个 `primary_jd_id`。
- 一个 Question 可以通过 `related_jd_ids` 补充关联 JD，但不能以此替代主 JD。
- `JD.question_ids[]` 是从 Question Registry 派生的反向索引，不在 JD 原件中人工双写。
- Answer、Evidence、Citation 使用独立 ID 引用，不嵌套复制到 Question 或 JD 正文。

## 3. Question Object

### 3.1 规范字段

| 字段 | 类型 | 必填 | 规则 |
| --- | --- | --- | --- |
| `schema_version` | string | 是 | 当前为 `1.0` |
| `qid` | string | 是 | `Q` + 6 位数字；唯一、永久、不得复用 |
| `question` | string | 是 | 面向用户的真实自然语言问题 |
| `normalized_question` | string | 是 | 仅用于去重和检索，不用于公开展示 |
| `question_type` | enum | 是 | 使用稳定机器值，见 3.2 |
| `keywords` | string[] | 是 | 受控关键词；去重；允许空数组 |
| `primary_jd_id` | string | 是 | 必须指向一个存在的 JD |
| `related_jd_ids` | string[] | 是 | 仅存 JD ID；不得包含主 JD；允许空数组 |
| `status` | enum | 是 | Question 自身生命周期，见 3.3 |
| `priority` | enum | 是 | `P0`、`P1`、`P2` |
| `audiences` | enum[] | 是 | 使用稳定机器值，见 3.4 |
| `locale` | string | 是 | BCP 47；首期为 `zh-CN` |
| `version` | string | 是 | `V1.0` 等语义版本 |
| `source_traceability` | object | 是 | 记录问题来源与审核依据，不复制 JD 正文 |
| `answer_ids` | string[] | 是 | 预留；V1 必须为空数组 |
| `evidence_ids` | string[] | 是 | 预留；V1 必须为空数组 |
| `citation_ids` | string[] | 是 | 预留；V1 必须为空数组 |
| `created_at` | datetime | 是 | ISO 8601 |
| `updated_at` | datetime | 是 | ISO 8601，不能早于 `created_at` |
| `published_at` | datetime/null | 是 | 仅 `published` 可非空 |
| `supersedes` | string/null | 是 | 修订替代关系；不得覆盖旧版本 |

### 3.2 Question Type

持久化数据不得使用中文显示标签作为枚举值。

| 机器值 | 中文显示 | 说明 |
| --- | --- | --- |
| `what` | 是什么 | 概念、定义、范围 |
| `why` | 为什么 | 原因、目的、价值 |
| `how` | 怎么做 | 方法、流程、操作 |
| `who` | 谁负责 | 主体、角色、责任 |
| `when` | 何时 | 时间、条件、触发点 |
| `where` | 在哪里 | 场景、位置、适用范围 |
| `compare` | 有何区别 | 对比、边界、辨析 |
| `scenario` | 遇到这种情况怎么办 | 场景化治理问题 |
| `risk` | 有什么风险 | 风险识别与防范 |
| `process` | 流程是什么 | 程序、步骤、节点 |

新增类型必须更新受控词表，不允许自由填写近义枚举。

### 3.3 Question 生命周期

| 状态 | 含义 | 是否公开/进入正式索引 |
| --- | --- | --- |
| `draft` | 已登记但未完成审核 | 否 |
| `in_review` | 已提交审核 | 否 |
| `published` | 已批准且主 JD 可公开 | 是 |
| `pending_revision` | 正式问题待修订 | 否；保留历史记录 |
| `superseded` | 已被新版 Q 替代 | 否；保留审计记录 |
| `archived` | 停用归档 | 否 |

Question 的状态不改变 JD 状态。Codex 不得以 Question 发布反推 JD 已批准。

### 3.4 Audience

| 机器值 | 中文显示 |
| --- | --- |
| `owner` | 业主 |
| `property_enterprise` | 物业企业 |
| `owners_committee` | 业委会 |
| `street_community` | 街道社区 |
| `general_public` | 普通公众 |
| `researcher` | 研究与专业人员 |

一个 Question 可服务多个受众；受众只影响表达、检索和渠道分发，不改变 JD 的理论内容。

### 3.5 Source Traceability

```yaml
source_traceability:
  source_type: human_curated
  source_ref: null
  mapped_jd_version: V1.0
  reviewed_by: null
  review_note: null
```

- `source_type` 首期允许 `human_curated`、`user_research`、`search_query`、`approved_material`。
- 未取得真实来源时保持 `null`，不得虚构用户调研、搜索量或批准记录。
- `mapped_jd_version` 用于说明 Question 在哪个 JD 版本下完成语义核验。

## 4. 示例结构

以下内容仅演示字段格式，不代表新增或批准任何真实 Question：

```yaml
schema_version: "1.0"
qid: Q000001
question: "<待人工审核的真实用户问题>"
normalized_question: "<仅用于去重的规范化文本>"
question_type: why
keywords: []
primary_jd_id: JD009
related_jd_ids: []
status: draft
priority: P1
audiences:
  - owner
locale: zh-CN
version: V1.0
source_traceability:
  source_type: human_curated
  source_ref: null
  mapped_jd_version: V1.0
  reviewed_by: null
  review_note: null
answer_ids: []
evidence_ids: []
citation_ids: []
created_at: "2026-07-25T00:00:00+08:00"
updated_at: "2026-07-25T00:00:00+08:00"
published_at: null
supersedes: null
```

## 5. Answer、Evidence、Citation 预留接口

### Answer（预留）

```text
answer_id
qid
primary_jd_id
mapped_jd_version
answer_version
status
content_ref
evidence_ids[]
citation_ids[]
created_at
updated_at
```

Answer 必须由对应 JD 支撑；它是面向用户的表达层，不是新的理论来源。V1 不创建标准答案或 Answer 内容。

### Evidence（预留）

```text
evidence_id
evidence_type
title
source_ref
locator
verification_status
version
updated_at
```

Evidence 必须可核验。法律、政策、图书章节、案例或数据应记录精确定位信息，不以无法核验的字符串替代。

### Citation（预留）

```text
citation_id
answer_id
claim_locator
evidence_id
evidence_locator
display_label
verified_at
```

Citation 表达“回答中的哪项陈述由哪项证据支持”，不能只保存一个泛化来源链接。

## 6. Registry 与存储原则

建议建立独立 Question Registry，Q 文件按 ID 存储：

```text
questions/
  Q000001.yaml
  Q000002.yaml
```

逻辑关系：

```text
Question Registry
  → 校验 primary_jd_id
  → 读取公开 JD Registry
  → 生成 JD.question_ids[] 反向索引
  → 输出 Search / GEO / AI 只读载荷
```

首期不需要 ORM、数据库、向量库或图数据库。达到数千对象后，可更换物理存储和索引，但 QID、字段契约与关系语义保持不变。

## 7. 发布校验

Question 从 `in_review` 进入 `published` 前必须全部通过：

1. QID 唯一且格式正确；
2. `question` 与 `normalized_question` 非空；
3. 不存在同语言同义重复 Q；
4. `primary_jd_id` 存在、为 JD、已批准且 Foundation Ready；
5. Question 能由主 JD 当前正式版本回答；
6. 关联 JD 均存在，且不包含主 JD；
7. 枚举值、版本和日期有效；
8. 问题来源与审核记录可追溯；
9. Answer/Evidence/Citation 预留字段未被填入虚构内容；
10. Draft、待修订和归档对象不进入公开搜索、sitemap、RSS 或 GEO 输出。

## 8. 从 `questions[]` 迁移

Knowledge Center V1.0 的 JD `questions[]` 是兼容字段。升级时：

1. 对现有字符串逐条人工去重；
2. 为每条获准问题分配 QID；
3. 将原 JD 设为 `primary_jd_id`；
4. 完成类型、受众、来源和生命周期审核；
5. 由 Registry 派生 `JD.question_ids[]`；
6. 迁移完成前保留旧字段只读兼容；
7. 禁止同时人工维护字符串数组和 Q Registry 两套正式关系。

迁移不能自动把现有字符串宣布为 `published`，也不能据此生成答案或 FAQPage。
