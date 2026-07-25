# 《知识对象与 SSOT 一致性分析》

版本：V2.0

状态：Approved Architecture Reference

结论：方案 B（Knowledge Object 聚合模型）已正式采用

## 1. 分析问题

本分析比较两种知识治理模型。

### 方案 A：分离对象

```text
JD
Question
Answer
Evidence
```

每类内容拥有独立身份、版本、生命周期和发布状态，通过关系连接。

### 方案 B：统一知识对象

```text
Knowledge Object
├── Definition
├── Questions
├── Canonical Answer
└── Evidence Bindings
```

一个知识主题拥有一个永久身份和一个权威版本边界；Question、Answer、Evidence Binding 是其组成部分。网站、搜索、AI 和 GEO 读取派生视图。

## 2. 评价标准

1. 是否符合唯一真实知识源（SSOT）；
2. 是否能避免语义重复和版本漂移；
3. 是否适合 AI 检索与可追溯回答；
4. 是否适合 GEO 和多渠道发布；
5. 是否支持长期审核、修订与审计；
6. 是否支持关系复用与知识图谱；
7. 是否能扩展到十万级知识对象；
8. 是否兼容现有 Foundation、Lifecycle 和 Release 架构。

## 3. 方案 A 分析

### 3.1 优点

- Question、Answer、Evidence 可以分别分工和审核；
- 每类对象可以独立扩展字段；
- 同一 Evidence 可以自然复用；
- 图模型清晰，适合表达多对多关系；
- 适用于 Question 或 Answer 本身确实具有独立业务身份的系统。

### 3.2 缺点

- 同一理论被拆成多个版本边界；
- JD 更新后必须追踪并同步大量 Answer；
- Question、Answer 的“独立发布”容易被误解为独立权威；
- 同一个概念可能出现 JD 正文、标准答案、FAQ 答案、AI Answer 多份近似正文；
- 批准状态可能不一致：JD 已更新，Answer 仍指向旧版本；
- 搜索可能返回同一主题的多张重复结果；
- GEO 可能生成多个互相竞争的 Canonical 页面；
- AI 必须跨多个 Registry 拼装答案，增加遗漏、过期和权限错误；
- 为维护 QID、AID、关系和生命周期付出较高治理成本。

### 3.3 适用条件

方案 A 更适合以下场景：

- Question 是调查、工单或考试题，具有独立业务生命周期；
- Answer 由不同机构独立发布，允许多个权威立场；
- Evidence 是跨领域证据库的核心产品；
- 系统目标是管理多方观点，而不是维护单一制度权威答案。

本项目的目标是建立“信托制物业”的第一权威知识入口，强调唯一理论来源，因此方案 A 的独立性收益小于一致性成本。

## 4. 方案 B 分析

### 4.1 优点

- 一个概念只有一个身份和当前批准版本；
- Definition、Questions、Canonical Answer 在同一审核中核验；
- 父对象修订可以精确标记所有衍生视图为待复核；
- AI 只需检索一个对象包即可获得定义、问法、答案和证据；
- Search 可用多个 Question 提高召回，但结果聚合到一个对象；
- GEO 可生成多种内容视图，同时维持唯一 Canonical；
- 对象版本、审批记录、Release Manifest 和渠道回执能够统一对账；
- 当前正式 Q/A/E 对象数量为零，切换成本低；
- 保留 JD ID，兼容现有 Foundation 和公开 URL。

### 4.2 缺点

- 对象可能变大，单文件或单表实现会造成编辑和加载压力；
- 多人同时编辑不同组件可能发生冲突；
- 一个 Canonical Answer 需要通过 claim blocks 覆盖多个问题；
- 可复用 Evidence、Law、Case 不能全部机械嵌入；
- 若对象边界划分错误，可能形成过大主题或重复主题；
- 组件级权限和审核分工需要清晰设计。

### 4.3 缓解措施

- 逻辑聚合、物理分块，以 Version Manifest 固定组件版本；
- 组件级 Draft 和 Diff，完整对象级 Approval；
- Canonical Answer 使用声明块，Question 映射到回答范围；
- Evidence 采用对象内 Binding + 共享 Source Record；
- 独立 Law、Case、Standard 仅在确有独立身份时建立；
- 建立重复主题和对象边界审核；
- Read Model 异步生成并可重建，不扩大 Authority 写入面。

## 5. 对比矩阵

| 维度 | 方案 A：分离对象 | 方案 B：统一对象 | 判断 |
| --- | --- | --- | --- |
| SSOT | 依赖关系约束维持一致，容易漂移 | 权威内容天然位于同一版本边界 | B 明显更优 |
| 理论唯一性 | Answer 容易演化为第二理论源 | Canonical Answer 属于对象本身 | B 更优 |
| 用户问题覆盖 | 可独立扩展和统计 | 作为对象内数组同样可扩展和投影 | 基本相当 |
| AI 检索 | 需跨 Registry 联接和版本判断 | 一次读取对象包 | B 更优 |
| AI 引用 | 链路完整但拼装复杂 | claim → Evidence Binding 内聚 | B 更稳 |
| GEO | 容易产生薄问题页和 Canonical 竞争 | 一个对象、多种派生视图 | B 更优 |
| 搜索 | 多对象结果容易重复 | 多 Question 召回、对象级聚合 | B 更优 |
| 证据复用 | 独立 Evidence 复用直接 | 需共享 Source Record + Binding | A 略简单；B 可解决 |
| 审核分工 | 可按对象独立流转 | 可按组件分工，最终对象批准 | B 更符合整体一致性 |
| 更新影响 | 关系图触发大量对象复核 | 父版本直接标记衍生资产 | B 更可控 |
| 大规模性能 | 小对象易分区 | 需物理组件化 | 取决于实现 |
| 现有架构兼容 | 与 V1 文档一致 | 保留版本、生命周期和发布层 | B 可渐进兼容 |
| 治理成本 | ID、状态、版本和关系数量大 | 组件多但权威对象少 | B 更低 |

## 6. SSOT 一致性规则

采用 V2 后，应确立以下不可违反的规则。

### Rule 1：唯一身份

同一知识主题只能有一个永久 `object_id`。标题、栏目、语言视图或 URL 变化不创建新理论身份。

### Rule 2：唯一当前权威版本

每个对象只能有一个 `current_approved_version_id` 和一个 `current_published_version_id`。两者可以不同，但不能各有多个“当前”版本。

### Rule 3：唯一 Canonical Answer

每个对象版本、每种正式语言只有一个 Canonical Answer。渠道表达不得自称新的标准答案。

### Rule 4：问题不是理论

Questions 只描述用户意图和语言映射。问题数量、搜索热度或 AI 生成结果不能改变 Definition。

### Rule 5：证据绑定声明

Evidence 必须绑定到具体 claim；只有来源名称而没有定位不能证明一致性。来源记录可复用，理论判断不能外包给来源字符串。

### Rule 6：视图可重建

Website、Search、AI、GEO、Graph、RSS、Sitemap 和培训内容必须能由 Published Object Version 重建。任何视图都不得反向成为 Authority。

### Rule 7：批准与发布分离

完整对象版本批准后，仍需 Release Manifest 和目标回执才能 Published。组件完成不等于对象批准，代码合并不等于知识发布。

### Rule 8：无双写

迁移期采用双读单写。Markdown、数据库、Studio 和渠道系统中只能有一个被授权的正式写入面。

## 7. AI 适配分析

### 方案 A 的 AI 路径

```text
用户问题
→ Question Registry
→ JD Registry
→ Answer Registry
→ Evidence Registry
→ 版本与状态交叉校验
→ 输出
```

风险在于联接缺失、某一对象过期、权限状态不一致，以及 Answer 复制 JD 后产生语义漂移。

### 方案 B 的 AI 路径

```text
用户问题
→ Question Projection 匹配 object_id
→ Published Knowledge Object Package
→ Canonical Answer claim blocks
→ Evidence Bindings
→ 带版本与引用输出
```

V2 更适合 AI，原因包括：

- 检索主键是知识对象而不是页面或问法；
- 多个问法共享同一答案来源；
- 对象包可以原子标记版本和新鲜度；
- Evidence 与 claim 一起读取；
- 无匹配时可以明确识别知识缺口；
- AI 生成只形成临时表达，不形成独立 Answer SSOT。

## 8. GEO 适配分析

方案 B 支持“一个对象、多种发布视图”：

- 永久知识页承载 Canonical；
- Question 用于标题、段落、FAQ 或搜索入口；
- GEO Article 引用父对象版本；
- JSON-LD、OpenGraph、RSS、Sitemap 使用同一 Site URL 和对象身份；
- 多语言、AI Summary、比较页可以作为派生资产；
- 父对象修订时，所有资产进入影响检查。

这比为每个 Question 建立薄页面更能避免：

- 重复内容；
- 关键词蚕食；
- Canonical 冲突；
- 页面可见内容与 FAQPage 不一致；
- AI 引用到过期 Answer。

## 9. 长期知识管理分析

### 知识主题稳定，表达可以变化

永久身份应绑定“开放式预算”这个知识主题，而不是某次问法或页面布局。Question、文章、视频和培训都是表达渠道。

### 版本应覆盖完整语义

Definition 改变而 Answer 不变，或 Answer 改变而 Evidence 未复核，都会破坏一致性。完整对象版本能让批准人一次看到这些变化。

### 关系应连接对象，不连接副本

Related Objects、Law、Case、Tool 和 GT 通过 ID 关系连接。图投影展示关系，但不复制各节点正文。

### 审计应回答四个问题

任一公开答案都必须能回答：

1. 它属于哪个 Knowledge Object？
2. 来自哪个 Object Version？
3. 谁在何时批准？
4. 哪些 Evidence 支撑具体声明？

V2 可以把四项证据放入同一发布链。

## 10. 国际产品与标准的可借鉴原则

本节只提炼设计原则，不照搬产品实现。

### Notion

Notion 官方将数据库描述为页面集合：每个条目本身是页面，并通过 Properties 组织；同一数据库内容可以用表格、列表、看板、日历等不同视图展示。

可借鉴：

- 内容实体与展示视图分离；
- 同一条目在不同视图中保持相同身份；
- Properties 用于筛选和组织，不需要复制页面。

不照搬：

- Knowledge Studio 需要更严格的不可变版本、批准记录和发布回执；
- 视图权限不能替代知识生命周期。

参考：

- [Notion：What is a database?](https://www.notion.com/help/what-is-a-database)
- [Notion：Views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts)

### Obsidian

Obsidian 官方以 Note 为内容载体，Properties 保存可供人和机器读取的结构化元数据；Internal Links 将 Notes 连接成知识网络；Bases 可以对同一批文件建立多个独立筛选、排序和展示视图。

可借鉴：

- 一个内容源可以同时拥有结构化属性、正文和关系；
- 图是链接的投影，不是正文权威源；
- 多种视图不要求复制底层内容；
- 别名可以表达不同叫法而不创建新实体。

不照搬：

- 文件名和自由链接不足以承担正式治理身份；
- 本项目需要受控 Predicate、生命周期、审批和发布边界。

参考：

- [Obsidian：Properties](https://obsidian.md/help/properties)
- [Obsidian：Internal links](https://obsidian.md/help/links)
- [Obsidian：Graph view](https://obsidian.md/help/plugins/graph)
- [Obsidian：Bases Views](https://obsidian.md/help/bases/views)

### Confluence

Confluence 官方说明数据库可作为结构化信息的集中来源，并支持对同一数据库建立不同布局、筛选和排序视图；数据库、条目或具体值可以通过 Smart Links 动态嵌入其他页面。

可借鉴：

- 结构化来源与展示位置分离；
- 嵌入内容应动态指向来源，而不是复制后失去同步；
- 权限、内容树和可搜索性属于内容治理的一部分。

不照搬：

- 普通页面发布流程不足以满足本项目 Approved / Published 分离；
- Smart Link 不等同于 Evidence 的声明级引用。

参考：

- [Confluence：Get started with databases](https://support.atlassian.com/confluence-cloud/docs/get-started-with-confluence-databases/)
- [Confluence：Database views](https://support.atlassian.com/confluence-cloud/docs/database-views/)
- [Confluence：Share databases, entries, or values](https://support.atlassian.com/confluence-cloud/docs/share-databases-entries-or-values/)

### 知识图谱与 Web 架构

W3C 的 Web 架构强调稳定 URI 用于标识资源，并允许同一资源具有不同表示；Semantic Web 指南还强调不要把概念本身与描述它的网页混淆。

可借鉴：

- Knowledge Object ID 表示知识主题；
- HTML 页面、JSON-LD、AI Package 和 Graph Projection 是它的表示；
- 对象身份必须稳定，表示可以演进；
- 不应为同一资源随意制造多个权威身份。

不照搬：

- 本阶段不需要实施 RDF、SPARQL 或 303 URI；
- 先稳定领域对象、关系和版本，再决定图技术。

参考：

- [W3C：Architecture of the World Wide Web Summary](https://www.w3.org/TR/webarch/summary.html)
- [W3C：Cool URIs for the Semantic Web](https://www.w3.org/TR/cooluris/)

## 11. 从国际实践得到的共同原则

1. 先定义稳定实体，再设计视图。
2. 属性、正文和关系可以围绕同一实体组织。
3. 多种视图应读取同一底层数据，不复制权威内容。
4. 链接和图是关系投影，不是第二知识源。
5. 展示路径与永久身份解耦。
6. 可复用来源应通过引用连接，而不是在各对象复制。
7. 版本、权限和审批必须由本项目治理要求补足。

这些原则与 V2 一致，但不能直接证明任何具体产品的数据模型适合本项目；V2 的最终边界仍由信托制物业知识治理目标决定。

## 12. 一致性测试清单

未来实现前应建立以下验证：

- 同一 `object_id` 不存在两个当前批准版本；
- 同一对象语言不存在两个 Canonical Answer；
- Questions 全部属于有效父对象；
- Search Question 投影全部指向父对象；
- FAQ / GEO 内容能追溯到 Object Version；
- Published 视图不包含 Draft 组件；
- Evidence Binding 的 claim 和 source locator 均有效；
- Source Record 更新能够列出受影响对象；
- Website、AI、Search 和 GEO 的版本可对账；
- Read Model 删除后可以完整重建；
- 旧 JD ID 和公开 URL 在迁移后仍可解析；
- Foundation 与 Studio 不存在同时可写的正式源。

## 13. 已知风险

### P0

- 若 V1 Question / Answer 独立 Registry 在 V2 决策后继续建设，将立即形成双模型和迁移成本。
- 若没有明确唯一写入面，V2 也会退化为另一套 SSOT。

### P1

- 对象边界过大或过小会导致审核困难或主题重复。
- Canonical Answer 的 claim block 设计需要用真实 JD 验证。
- Evidence Binding 与共享 Source Record 的边界需要单独 Schema 评审。
- 旧文档仍描述独立 Q/A，应在 V2 获批后明确标记历史状态。

### P2

- 多语言、受众视图和媒体资产的版本策略需后续深化。
- Graph、向量索引和 AI Retrieval 的技术选型应由真实规模触发。

## 14. 最终结论

方案 B 已正式采用，Knowledge Object V2 成为 Knowledge Studio 下一阶段标准。

方案 B 能证明：

- 一个对象可以统一承载 Definition、Questions、Canonical Answer、Evidence Binding 和衍生资产；
- 它比独立维护 JD / Question / Answer 更符合本项目“唯一权威答案”的使命；
- 它降低 AI 联接错误、GEO 重复页面、版本漂移和长期审核成本；
- 它不破坏现有生命周期、版本、关系、Release Manifest 和 Foundation Adapter；
- 它可以通过逻辑聚合、物理分块支持大规模扩展。

设计批准已在正式 Question、Answer、Evidence 独立对象仍为零的窗口完成。后续实施必须另立 Sprint；本设计批准本身不修改任何运行时系统。
