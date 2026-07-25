# Object Relationship Model

版本：V1.0
状态：Design

## 1. 目标

关系模型用于表达知识对象之间可审计、可版本化的语义连接，并为搜索、Related Content、GEO、AI 检索和未来知识图谱提供统一底座。

关系只保存对象 ID 和关系语义，不复制目标标题、摘要或正文。目标展示信息由 Registry 按目标 ID 解析。

## 2. 核心关系图

```text
JD ── mapped_by ──> Question
Question ── answered_by ──> Answer
Answer ── supported_by ──> Evidence
Citation ── cites ──> Evidence
Citation ── annotates_claim_in ──> Answer

Law ── serves_as ──> Evidence
Law ── governs / constrains ──> JD / GT / Standard
Case ── illustrates / validates / challenges ──> JD / GT
GT ── organizes / applies ──> JD
Standard ── operationalizes ──> JD / GT
Product ── implements ──> Standard / GT
Course ── teaches ──> JD / GT / Standard / Case
```

关系方向以语义定义为准。反向关系由图投影派生，不要求双写。

## 3. Edge Object

每条关系使用独立 Edge Object：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `edge_id` | string | 永久唯一，不复用 |
| `source_object_id` | string | 起点对象 ID |
| `source_version_id` | string | 建立关系时对应的起点版本 |
| `predicate` | enum | 受控关系类型 |
| `target_object_id` | string | 目标对象 ID |
| `target_version_constraint` | string/null | 固定版本或版本范围；空表示当前有效版本 |
| `direction` | enum | 固定为 `directed` 或经批准的 `symmetric` |
| `status` | enum | `draft`、`in_review`、`approved`、`archived` |
| `provenance` | object | 来源、建立人、审核记录 |
| `confidence` | enum/null | 仅用于候选关系；正式批准边不以模型分数替代审核 |
| `valid_from` | datetime/null | 生效时间 |
| `valid_to` | datetime/null | 失效时间 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

Edge 生命周期跟随审核流程，但不能反向改变两端对象的生命周期。

## 4. 受控 Predicate

### 理论与问题

| Predicate | Source → Target | 含义 |
| --- | --- | --- |
| `maps_to` | Question → JD | 用户问题的唯一主 JD |
| `also_relates_to` | Question → JD | 补充关联 JD |
| `answers` | Answer → Question | Answer 回答指定 Q |
| `derived_from` | Answer → JD | Answer 的理论来源与版本 |

### 证据与引用

| Predicate | Source → Target | 含义 |
| --- | --- | --- |
| `supported_by` | Answer / JD / Case → Evidence | 对象由证据支持 |
| `cites` | Citation → Evidence | Citation 指向证据定位 |
| `annotates_claim_in` | Citation → Answer | Citation 标注 Answer 中的声明 |
| `evidences` | Evidence → Case / JD / GT | 证据支撑的对象 |

### 法律、案例与治理地图

| Predicate | Source → Target | 含义 |
| --- | --- | --- |
| `governs` | Law → JD / GT / Standard | 法律对对象形成规范依据 |
| `constrains` | Law → JD / GT / Standard | 法律形成边界或限制 |
| `illustrates` | Case → JD / GT | 案例说明理论或治理机制 |
| `validates` | Case → JD / GT | 经审核案例为机制提供实践印证 |
| `challenges` | Case → JD / GT | 案例暴露适用边界或待修订问题 |
| `organizes` | GT → JD / Standard | 治理地图组织多个对象 |
| `applies` | GT / Case → JD | 在场景中应用 JD |
| `operationalizes` | Standard → JD / GT | 标准把理论转化为可执行规范 |

### 产品与培训

| Predicate | Source → Target | 含义 |
| --- | --- | --- |
| `implements` | Product → Standard / GT | 产品实现已批准规范 |
| `teaches` | Course → JD / GT / Standard / Case | 课程教授指定版本知识 |
| `references` | 任意对象 → 任意对象 | 仅在不存在更具体谓词时使用 |
| `supersedes` | 新版本对象 → 旧版本对象 | 替代关系 |

新增 Predicate 必须经过治理评审；不得把中文标签或自由文本作为持久化关系类型。

## 5. 核心链路约束

### JD → Question

- 正式边实际存储为 `Question maps_to JD`；
- 每个 Published Question 必须且只能有一条有效 `maps_to`；
- `JD.question_ids[]` 由反向索引派生；
- Question 不复制 JD 正文。

### Question → Answer

- 一个 Question 可以有多个历史 Answer Version；
- 同一语言和受众范围只能有一个当前 Published Answer；
- Answer 必须记录对应 JD 版本；
- 主 JD 版本变化会触发 Answer 复核。

### Answer → Evidence → Citation

- Answer 可由多项 Evidence 支持；
- Evidence 可以复用；
- Citation 连接 Answer 中的具体声明与 Evidence 中的具体位置；
- 只有来源链接而没有声明定位的记录不算完整 Citation。

### Case

- Case 是可核验事实对象，不是理论来源；
- Case 可以 `illustrates`、`validates` 或 `challenges` JD/GT；
- 单个案例不得自动把理论边标为有效；
- 涉及个人信息时必须完成匿名化或授权检查。

### Law

- Law 保存发布机关、效力、版本和条款定位；
- Law 可以本身作为 Evidence，也可以生成精确条款 Evidence；
- Law 失效时，所有依赖边进入影响分析；
- 不以法规标题字符串代替 Law/Evidence ID。

### GT

- GT 是治理地图或标准组织层，不复制 JD；
- GT 节点引用 JD、Standard、Case、Law 等对象；
- 图中节点和边必须能回到正式对象及版本；
- Draft 目标不得进入公开图投影。

## 6. 统一编辑模型

Knowledge Studio 使用“通用信封 + 类型负载 + 关系集合”：

```text
Knowledge Object
├── Common Envelope
├── Type-specific Payload
├── Relationships
├── Workflow
├── Version
└── Publication Metadata
```

### Common Envelope

| 字段 | 说明 |
| --- | --- |
| `schema_version` | 对象 Schema 版本 |
| `object_id` | 永久身份 |
| `object_type` | JD、QUESTION、ANSWER、EVIDENCE、CASE、LAW、GT 等 |
| `title` | 展示标题；Question 可由问题文本派生显示，但仍有稳定 ID |
| `summary` | 简明摘要 |
| `content_ref` | 正文或结构化负载引用 |
| `keywords` | 受控关键词 |
| `tags` | 受控运营标签；不作为关系键 |
| `category_id` | 稳定分类 ID，显示名称分离 |
| `owner_id` | 责任人 |
| `locale` | BCP 47 |
| `source_traceability` | 来源和定位 |
| `created_at` / `updated_at` | 对象时间 |

### Workflow 与版本

| 字段 | 说明 |
| --- | --- |
| `lifecycle_status` | 统一生命周期 |
| `version_id` | 不可变版本身份 |
| `semantic_version` | V1.0 等展示版本 |
| `review_ids[]` | 审核记录 |
| `approval_id` | 批准记录 |
| `supersedes_version_id` | 替代版本 |
| `published_at` | 首次成功发布时间 |
| `release_ids[]` | 发布记录 |

### Relationships

| 字段 | 说明 |
| --- | --- |
| `outgoing_edge_ids[]` | 从当前对象发出的关系 |
| `incoming_edge_ids[]` | 派生反向关系，不人工双写 |
| `citation_ids[]` | 适用时的声明级引用 |

### Publication / SEO（预留）

| 字段 | 说明 |
| --- | --- |
| `slug` | 可读路径片段；Object ID 保持永久身份 |
| `canonical_policy` | 默认由 Site URL + 路由生成 |
| `seo_title` | 可选人工覆写，必须通过长度与一致性校验 |
| `seo_description` | 可选人工覆写，不堆砌关键词 |
| `robots_policy` | 公开 / noindex 等受控策略 |
| `structured_data_type` | 必须与实际页面内容一致 |
| `social_image_ref` | 分享图引用 |

### Question Mapping（预留）

- `primary_question_ids[]` 由 Question Registry 派生；
- 旧 `questions[]` 仅用于迁移兼容；
- 不在多个对象里复制问题文本。

### AI Metadata（预留）

| 字段 | 说明 |
| --- | --- |
| `ai_readiness` | 是否满足 AI 读取门槛 |
| `retrieval_summary_ref` | 已批准检索摘要引用 |
| `embedding_version` | 派生索引版本，不属于理论内容 |
| `citation_required` | 输出是否必须带 Citation |
| `sensitivity` | 公开、内部、受限 |
| `freshness_policy` | 复核周期 |

AI Metadata 是派生和控制信息，不允许保存未经批准的“AI 理论结论”。

## 7. 图投影与查询

Authority Layer 保存对象和 Edge；Graph Projection 用于查询：

- 一个 JD 有哪些 Question；
- 一个 Question 当前有哪些 Answer；
- 一个 Answer 的证据与 Citation；
- 哪些 JD 受某条 Law 失效影响；
- 哪些 Case 支持或挑战某个 GT；
- 哪些 Product / Course 依赖即将修订的知识版本。

Graph Projection 可以重建，不是 SSOT。十万级对象阶段至少建立：

- source_object_id 索引；
- target_object_id 索引；
- predicate 索引；
- lifecycle_status 索引；
- source + predicate 复合索引；
- target + predicate 复合索引。

## 8. 关系发布校验

1. source 和 target 均存在；
2. Predicate 允许对应的类型组合；
3. Published Edge 的两端满足公开策略；
4. 不存在未批准的循环依赖；
5. `maps_to` 唯一性通过；
6. `supersedes` 不形成环；
7. 固定版本目标真实存在；
8. 法律和证据有效性未过期；
9. Draft Edge 不进入公开 Graph、Search、GEO 或 AI；
10. 删除对象前完成入边影响分析。

## 9. 关系质量指标

- 孤立 JD 数量；
- 无主 JD 的 Question 数量；
- 无 JD 版本的 Answer 数量；
- 无 Citation 的需证据 Answer 数量；
- 指向 Draft / Archived 的公开边数量；
- 失效 Law 影响对象数量；
- 关系类型使用 `references` 的比例；
- 循环与失效边数量；
- 图投影与 Authority Edge 数量差异。

指标必须由真实 Registry 和 Edge 数据计算，不硬编码。
