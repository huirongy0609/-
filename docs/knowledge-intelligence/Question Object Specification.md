# Question Object Specification

版本：V1.0
状态：Design

## 1. 对象定义

Question Object 是一个可独立编号、治理、检索和分发的用户问题对象。它负责把用户真实表达映射到权威 JD，不保存或创造治理理论。

“独立存在”指：

- 有独立 QID；
- 有独立版本与生命周期；
- 可被搜索、GEO、培训和 AI 路由单独引用；
- 可有多个 Answer 版本（后续阶段）。

“不得脱离 JD”指：

- 注册时必须指定 `primary_jd_id`；
- 发布时主 JD 必须已批准且公开；
- 问题必须能由主 JD 的正式内容回答；
- JD 修订后必须重新核验映射；
- Question、Answer 均不能覆盖、改写或替代 JD。

## 2. QID 编号规则

正式格式：

```text
Q000001
Q000002
...
Q999999
```

规则：

1. `Q` 为固定大写前缀；
2. 后接 6 位十进制数字；
3. 起始编号为 `Q000001`；
4. 编号只表达永久身份，不编码 JD、章节、受众、类型或语言；
5. 编号一经分配永久保留，删除、归档或合并后不得复用；
6. 分配必须由单一 Registry 原子执行，禁止多人各自维护计数器；
7. 格式容量为 999,999，足以支持 10,000+ Question；
8. 将来超出容量时通过 Schema 新版本扩展，不提前改变 V1 格式。

不采用 `JD009-Q01`，因为 Question 可能随治理调整更换主 JD，语义型编号会导致身份变化和链接失效。

## 3. 语义与质量规则

### 3.1 问题粒度

一个 Q 只表达一个主要意图。包含多个独立问题的句子应由人工拆分；仅属同一意图的自然补充可以保留。

### 3.2 去重

去重分为三层：

1. 精确重复：规范化文本相同；
2. 近义重复：表达不同但意图、受众和主 JD 相同；
3. 边界相邻：表面相似，但治理场景或答案范围不同。

前两类优先合并为一个正式 Q，并把其他表达登记为后续可扩展的 `aliases[]`；第三类可以保留，但必须写明差异。不得只靠字符串或向量相似度自动合并。

### 3.3 问题真实性

Question 应来自真实用户表达、已批准材料、搜索查询研究或人工确认的服务场景。不得为了数量、SEO 或 FAQ Schema 批量生成近义问题。

### 3.4 版本

- 标点、空格等不改变语义的修正：补丁版本；
- 表达或受众范围改变但仍映射同一理论：次版本；
- 主意图或理论映射改变：新建 QID，旧 Q 标记 `superseded`；
- JD 正文升级后，至少更新 `mapped_jd_version` 与核验记录。

## 4. Question Detail 页面原型

本节只定义信息架构，不开发页面、不改变现有 UI。

### 页面目的

让用户以自然问题进入权威 JD，并清楚看到答案来源、版本和关联入口。

### 目标用户

业主、物业企业、业委会、街道社区、普通公众和专业研究者。

### 主实体

Question Object。JD 是该页面的权威理论来源。

### 必需数据

1. 问题正文；
2. QID、版本和更新时间；
3. 简短回答区（仅在后续存在已批准 Answer 时展示）；
4. 对应主 JD；
5. 关联 JD；
6. 关联问题；
7. 法律依据 / Evidence（仅展示已核验对象）；
8. Citation（仅在 Answer 与 Evidence 已建立声明级关系后展示）；
9. 适用受众和问题类型；
10. 来源追溯与内容状态。

### 空状态

- 无 Answer：显示“标准回答尚未发布”，并引导阅读主 JD；不得自动拼接或虚构回答。
- 无 Evidence：不显示空的“法律依据”栏目；不得用宽泛法规名称占位。
- 无关联问题：隐藏该区域，不用推荐算法制造关系。
- 主 JD 不可公开：Question 不得公开。

### 导航与 URL

- 页面未来建议使用稳定路径 `/questions/Q000001`；
- Breadcrumb 建议为“首页 → 问题库 → Q000001 问题标题”；
- QID 保证标题调整时 URL 不变；
- 导航入口是否公开，应在 Question 内容规模和审核流程成熟后决定，不属于本轮范围；
- V1 不新增首页、搜索页或详情页入口。

### Filters 是否进入 URL

若未来问题库列表支持 `audience`、`question_type`、`priority` 筛选，可将可分享且有搜索价值的筛选写入查询参数；内部审核状态不得暴露为公开筛选。当前不实现。

### MVP 范围判断

Question Detail 页面不属于本轮架构设计 MVP。本轮只完成对象契约、治理规则和未来页面信息架构。

### Metadata 与 Structured Data

- Title 建议：`{问题}｜信托制物业`；
- Canonical 使用 QID 稳定路由；
- Description 只能来自已批准摘要或 Answer；
- 没有已批准 Answer 时，不输出 `FAQPage`；
- 页面可在存在可见问题与正式 Answer 后使用适合内容的 `Question`/`FAQPage` 结构；
- JSON-LD 不得声称不存在的 acceptedAnswer、作者或证据。

## 5. Question Search 分析

### 是否独立进入索引

建议：Question 应作为独立文档进入搜索索引，但首期不建立独立 Search UI，也不自动建立可索引 Question 页面。

### 优点

- 直接匹配用户自然语言，提高长尾问题召回；
- 同一 JD 可覆盖多个真实意图；
- 可按受众、类型、优先级和语言分析覆盖缺口；
- AI 可先路由 Q，再读取对应 JD，降低脱离 SSOT 回答的风险；
- GEO、FAQ、培训和公众号可共享同一问题标识；
- 可评估“问题 → JD → 答案”的命中率和引用率。

### 风险

- Question 与 JD 同时返回可能造成重复结果；
- 大量近义问题会稀释检索质量；
- 没有 Answer 的 Question 页面可能形成薄内容；
- 自动公开问题页可能造成 SEO 关键词蚕食；
- Draft 问题泄露会产生治理和内容风险；
- 若 Question 复制 JD 正文，会形成第二 SSOT。

### V1 推荐策略

1. 仅 `published` Question 进入正式 Question Index；
2. 索引保存 QID、问题文本、类型、受众、关键词和 JD 引用，不复制 JD 正文；
3. 搜索结果首期仍跳转主 JD，并显示匹配到的用户问题；
4. 同一 JD 命中的多个 Q 在结果层聚合，避免重复卡片；
5. 建议权重：Question 精确匹配 > Question 近义匹配 > JD 标题 > JD 定义 > 关键词 > 正文；
6. Draft、待修订、替代和归档 Q 全部排除；
7. 在页面与 Answer 质量成熟前，不把 Question URL 加入 sitemap；
8. 不修改当前搜索 UI，本轮仅保留索引契约。

### 建议索引文档

```text
document_type: question
document_id: Q000001
display_text: <question>
normalized_text: <normalized_question>
question_type: why
audiences: [owner]
keywords: []
primary_jd_id: JD009
related_jd_ids: []
status: published
locale: zh-CN
version: V1.0
updated_at: <timestamp>
target_url: /knowledge/JD009
```

`target_url` 首期指向主 JD；未来正式发布 Question Detail 后再切换为 Q URL。

## 6. API / 导出契约建议

未来只读消费者应通过统一导出读取：

```text
GET Question by QID
LIST published Questions by JD
SEARCH published Questions
EXPORT Question → JD mappings
```

响应必须包含对象版本、主 JD 版本、更新时间和状态。写入、批准和发布不应通过公开 API 开放。

AI 读取的最小载荷：

```text
Question identity
Question text
Primary JD identity + version
Related JD identities
Approved Answer references（若存在）
Evidence/Citation references（若存在）
Freshness metadata
```

## 7. 治理角色

- 项目负责人 / 项目总架构师：批准 Question 生命周期和理论映射；
- 内容运营：收集真实问题、提交映射和受众建议；
- Codex：执行 Registry 入库、结构校验、索引生成、版本和审计记录；
- AI：只能消费已发布对象，不得自行把生成内容写回正式 Question Registry。

## 8. 本轮明确不做

- 不自动生成或批量改写问题；
- 不编写标准答案；
- 不生成 Evidence 或 Citation；
- 不开发 Question 页面；
- 不修改搜索 UI；
- 不开发聊天、Agent 或 AI API；
- 不修改 JD 正文；
- 不将现有 `questions[]` 自动宣布为正式 Question；
- 不增加 ORM、数据库、向量库或图数据库。
