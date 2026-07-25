# 《Knowledge Studio V2 调整建议》

版本：V2.0

状态：Approved / Governed by Knowledge Studio V2 Baseline

前置文档：《Knowledge Object Model V2.0》

## 1. 调整目标

本次调整不是重建 Knowledge Studio，而是改变 Studio 管理知识的聚合边界：

```text
V1：JD / Question / Answer / Evidence 分别进入对象工作台

V2：Knowledge Object 进入工作台
    Definition / Questions / Canonical Answer / Evidence Bindings
    作为同一对象的受治理组成部分
```

保留：

- Object ID；
- 不可变 Object Version；
- `draft → in_review → approved → published → archived`；
- Approval Record；
- Release Manifest；
- Publication Receipts；
- Read Models；
- Edge / Graph Projection；
- Foundation Adapter 和渐进迁移。

调整：

- 不再设立独立“AI 问题”和“标准答案”权威工作区；
- 不再为 Question、Answer 建立独立理论生命周期；
- 发布中心以完整 Knowledge Object Version 为发布单元；
- Dashboard 以对象覆盖与组件完整度为核心；
- Search、GEO、AI 读取对象视图，不读取平行知识库。

## 2. 产品信息架构调整

### 2.1 建议结构

```text
Knowledge Studio
├── Dashboard
├── Knowledge Objects
│   ├── All Objects
│   ├── My Drafts
│   ├── In Review
│   ├── Approved
│   └── Published
├── Review Center
├── Release Center
├── Source & Evidence Registry
├── Relationship Explorer
├── Version History
├── Search
└── Analytics
```

### 2.2 原模块处理

| V1 模块 | V2 处理 | 原因 |
| --- | --- | --- |
| 知识对象（JD） | 升级为 Knowledge Objects | JD ID 可保留，但工作台不再以“词典页面类型”限制对象 |
| AI 问题 | 调整为对象编辑器内 Questions 视图 | Question 是用户语言映射，不是理论对象 |
| 标准答案 | 调整为对象编辑器内 Canonical Answer | 一个主题只能有一个标准解释源 |
| 证据 | 保留 Source Registry；Evidence Binding 在对象内编辑 | 共享来源可复用，声明绑定必须属于对象版本 |
| 案例 | 对象内绑定；复杂案例可独立登记 | 兼顾单主题例证与跨主题案例复用 |
| 法律法规 | 保留可复用来源/独立对象能力 | 法律具有独立版本、效力和跨对象影响 |
| 治理地图 | 保留为关系视图或独立复杂对象 | 不复制 Definition 和 Answer |
| 发布中心 | 保留并改为发布 Object Version | 确保所有视图版本一致 |

“Questions”“Answers”仍可作为 Dashboard 筛选和覆盖统计入口，但不能成为独立权威写入面。

## 3. 统一对象编辑器

本任务不开发 UI。未来编辑器的信息架构建议如下：

| Section | 页面目的 | 主数据 | 空状态 | MVP |
| --- | --- | --- | --- | --- |
| Overview | 确认对象身份、状态和责任 | ID、标题、类型、版本、负责人 | 缺少必填字段时阻止送审 | 是 |
| Definition | 编辑标准定义与边界 | Definition | 明确标记“尚未形成定义”，不可发布 | 是 |
| Questions | 维护真实用户问法 | Questions | 显示采集规范，不生成示例问题 | 是 |
| Canonical Answer | 维护唯一标准解释 | Answer + claim blocks | 明确标记未完成，不自动生成 | 是 |
| Evidence | 将声明绑定到来源 | Evidence Bindings | 标记证据缺口 | 是 |
| Relationships | 维护对象关系 | Edge candidates | 显示孤立状态 | 是 |
| GEO | 管理衍生发布资产 | GEO Asset manifests | 无资产时不影响理论批准；发布目标按策略判断 | 后续 |
| Tools / Cases | 绑定工具和案例 | Bindings | 无绑定时隐藏公开栏目 | 后续 |
| Media | 管理权利与发布用途 | Media manifests | 无媒体时不造占位图 | 后续 |
| Versions | 查看版本、Diff、批准和发布 | Version History | 首版显示单版本 | 是 |

### 页面治理

- 页面目的：生产和审核完整 Knowledge Object，不是编辑网站页面。
- 目标用户：内容编辑、专业审核人、批准人、发布管理员、审计用户。
- 主实体：Knowledge Object Version。
- 必需数据：身份、Definition、Canonical Answer、来源追溯、生命周期、版本。
- 空状态：显示真实缺口，不创建 Mock 内容。
- 导航入口：Knowledge Objects 为唯一主入口；组件通过对象内导航进入。
- Filters：类型、状态、负责人、更新时间可以进入内部 URL；敏感权限信息不得进入 URL。
- MVP：对象编辑、审核、版本、发布为 MVP；复杂分析和 AI 辅助后置。

## 4. Workflow 调整

### 4.1 审核单元

审核对象从“若干相互依赖对象”调整为“完整 Object Version”：

```text
Draft Object Version
  → Schema Validation
  → Component Completeness
  → Professional Review
  → Evidence Review
  → Relationship Review
  → Approval
```

审核任务可以按组件分工，但最终 Approval Record 必须绑定完整 Object Version checksum。

### 4.2 组件级工作状态

为支持协作，可以使用非权威的组件工作状态：

```text
not_started
in_progress
ready_for_review
needs_revision
complete
```

这些状态只服务生产进度，不决定公开性。唯一正式生命周期仍属于 Object Version。

### 4.3 门槛

`in_review → approved` 至少检查：

- Definition 与 Canonical Answer 一致；
- Questions 可以由该对象回答；
- 关键声明存在适用的 Evidence Binding；
- 相关对象引用有效；
- Book Traceability 已完成（适用时）；
- 无未声明的 Mock、AI 生成或占位内容；
- 所有必需组件 checksum 已冻结。

`approved → published` 继续检查：

- Website、Search、AI、GEO 视图来自相同 Object Version；
- Canonical URL 唯一；
- Draft 组件未进入发布；
- Release Manifest 完整；
- 必要目标回执成功；
- 回滚点可用。

## 5. Review Center 调整

Review Center 建议按对象聚合展示：

- 对象身份和版本；
- 本次变更组件；
- Definition / Answer 语义差异；
- 新增或失效 Questions；
- Evidence 覆盖变化；
- 关系影响；
- 受影响的 GEO、Search、AI 和渠道资产；
- 批准前阻塞项。

禁止把同一对象的 Definition、Question、Answer 分配为互不知情的三个批准决定。

## 6. Release Center 调整

Release Candidate 的最小单元为已批准 Object Version：

```text
Release Candidate
├── object_version_id
├── website_view
├── search_view
├── ai_read_model
├── geo_assets
├── graph_projection
└── target policies
```

目标回执必须可对账到相同 `object_version_id`。如果 Search 仍指向旧版本而 Website 已更新，发布中心必须显示版本不一致，不能标记完整成功。

组件可采用不同部署节奏，但公开“当前版本”指针只能在必要目标达到策略要求后更新。

## 7. Dashboard 调整

### 7.1 核心计数

| 指标 | V2 口径 |
| --- | --- |
| Knowledge Objects | Registry 中永久对象数 |
| Published Objects | 有有效 Published Version 的对象数 |
| Draft / In Review / Approved | 按当前工作版本状态统计 |
| Definition Coverage | 具备已批准 Definition 的对象比例 |
| Question Coverage | 至少一个已审核真实问题的对象比例 |
| Canonical Answer Coverage | 具备已批准 Canonical Answer 的对象比例 |
| Evidence Coverage | 关键声明满足 Evidence Policy 的对象比例 |
| GEO Coverage | 具备有效 GEO Asset 的已发布对象比例 |
| Stale Assets | 来源版本落后于当前 Published Version 的衍生资产数 |

Question 数量仍可作为运营指标，但必须显示为“Questions 组件条目数”，不能称为独立正式知识对象数量。

### 7.2 质量指标

- Question 无法由父对象回答；
- Definition 与 Canonical Answer 冲突；
- 无证据关键声明；
- 指向 Draft / Archived 对象的公开关系；
- 旧版本 GEO / AI / Search 视图；
- Approved 未 Published；
- Source Record 失效影响对象；
- 孤立对象和重复主题候选。

所有指标来自 Registry / Metric Snapshot，不硬编码。

## 8. Search 与 AI 工作区调整

### Search

- 内部搜索结果以 Knowledge Object 为主实体；
- 可显示命中的 Question、Definition 或 claim block；
- 同一对象多处命中合并为一个结果；
- 搜索视图不得成为独立写入入口。

### AI

- AI 辅助只创建 Candidate；
- Candidate 必须附目标 `object_id` 和建议修改组件；
- 不允许 AI 直接建立正式 Question、Answer 或 Evidence；
- AI 读取 Published Object Package；
- AI 输出必须携带对象 ID、版本和 Evidence/Citation。

## 9. 与 Foundation Engine 的兼容

近期不修改 Foundation Engine。

建议后续 Adapter 分三步：

### Phase A：V2 读取映射

- JD ID → `object_id`；
- `one_liner` / 摘要 → Definition 候选映射；
- 正文 → Canonical Answer / body 候选映射；
- `questions[]` → Questions 候选；
- `legal_basis[]` → Evidence Binding 候选；
- Related Topics → Related Object Edges。

所有映射先进入只读或 Draft，不自动批准。

### Phase B：双读单写

Studio 成为 V2 Draft 的唯一写入面；发布继续生成 Foundation 兼容产物。禁止 Foundation Markdown 与 Studio 同时被人工写入。

### Phase C：权威切换

完成对象、版本、关系、checksum 和发布结果对账后切换 Authority Adapter。Read Models 可以重建，旧载体保留为导出或归档。

## 10. 与 V1 文档的关系

V2 已获批准，下列 V1 设计由 V2 决策正式替代：

| V1 设计 | V2 决策 |
| --- | --- |
| Question 为独立正式对象 | Question 为 Knowledge Object 内部组件 |
| Answer 为独立正式对象 | Canonical Answer 为对象内唯一标准解释 |
| Question Registry 是独立权威源 | Questions Index 是由对象版本生成的 Read Model |
| Q → A → Evidence 独立生命周期链 | Object Version 统一生命周期，Evidence Binding 属于版本 |
| Dashboard 分别统计正式 Q/A 对象 | 统计对象数和组件覆盖率 |
| 问题详情页是独立 Canonical 页面 | 默认定位到 Knowledge Object 页面或对象内锚点 |

继续有效：

- Knowledge Studio 不是 CMS；
- 统一生命周期；
- Approved / Published 分离；
- 不可变版本；
- Release Manifest 与回执；
- Edge Object 与图投影；
- AI 无批准和发布权；
- Foundation 渐进迁移。

## 11. 建议实施顺序

1. 批准 V2 概念边界和“一个对象、一个 Canonical Answer”原则；
2. 将 V1 Question / Answer 独立模型标记为被 V2 取代的历史设计；
3. 定义 V2 Schema，但不立即选择数据库；
4. 用现有已批准 JD 做只读映射验证，不修改正文；
5. 验证 Questions 搜索投影和对象级结果聚合；
6. 验证 Evidence Binding 与共享 Source Record；
7. 定义组件级 Diff、Version Manifest 和审核清单；
8. 再进入 Studio 编辑器实施；
9. 完成对账后切换唯一写入面；
10. 最后接入 AI 候选生产。

## 12. 风险与控制

| 风险 | 影响 | 控制 |
| --- | --- | --- |
| 对象聚合过大 | 编辑冲突、加载缓慢 | 逻辑聚合、物理组件分块、Version Manifest |
| 一个答案无法覆盖所有问题 | 表达僵硬 | Canonical Answer 使用 claim blocks，问题映射到范围 |
| Evidence 无法跨对象复用 | 大量复制 | 对象内 Binding + 共享 Source Record |
| GEO 资产演化过快 | 与主对象漂移 | 保存 `derived_from_version_id`，父版本更新触发复核 |
| 旧 QID 已有外部引用 | 链接失效 | 兼容别名解析，不继续建立独立权威源 |
| V1/V2 并行写入 | 双 SSOT | 双读单写、Authority Adapter 和迁移对账 |
| 组件完成被误当对象批准 | 未完整审核即发布 | Approval 绑定完整 Object Version checksum |
| 为“统一”复制法律、案例、媒体 | 数据膨胀与失真 | 归属/引用双模式，关系不复制正文 |

## 13. 本轮边界

- 只调整设计文档；
- 不修改代码、Schema 实现或数据；
- 不开发后台 UI；
- 不新增数据库；
- 不迁移 JD、Question 或 Answer；
- 不创建示例知识内容；
- 不改变现网 Search、GEO、AI 或公开页面；
- 不把本建议视为已经完成技术实施。

## 14. 调整建议结论

V2 聚合边界已在保持 Knowledge Studio V1 基础设施不变的前提下正式批准。

这是一项模型收敛，而不是架构推倒重来：Studio 继续管理对象、版本、审核和发布，只是不再让 Question 与 Answer 演化成平行知识库。该调整应在正式 Question / Answer 数据尚为零时完成，迁移成本最低、SSOT 风险最小。
