# AI Knowledge Layer Roadmap

版本：V1.0
状态：Historical / Superseded by Knowledge Studio V2 Baseline
目标规模：1,000+ Question、1,000+ Answer，并由网站、搜索、GEO、培训和 AI 统一消费

> 冻结声明：本文件所述独立 Question Registry、Answer Layer 和 Q → A 独立对象链不再执行。现行路线以 Knowledge Object 为唯一 SSOT，Questions、Canonical Answer 和 Evidence Bindings 属于同一 Object Version；AI 只消费可重建 AI View。

## 1. 总体路线

```text
JD（唯一理论 SSOT）
  ↓
Question（用户语言映射）
  ↓
Answer（批准后的表达层）
  ↓
Evidence（可核验来源）
  ↓
Citation（声明级引用）
  ↓
AI（受控检索与回答）
```

每一层只能引用上游，不复制或取代上游权威内容。没有通过当前阶段的治理门槛，不进入下一阶段。

## 2. 当前基础

- Foundation Registry 已作为正式 JD 权威源；
- 正式对象具有 ID、版本、状态和来源治理；
- Knowledge Center V1.0 已预留 JD `questions[]`；
- Questions 已可参与当前服务端字段搜索；
- 公开边界为 approved + Foundation Ready；
- Answer、Evidence、Citation 尚未建立正式对象；
- 当前仓库中已批准 JD 的数量仍需继续按 Foundation 对账，不能以项目口头总数替代 Registry 事实。

## 3. Phase 1：Question Registry

### 目标

建立稳定 QID、生命周期、受众、意图、JD 映射和只读索引契约。

### 工作

1. 批准 Question Schema 和编号规则；
2. 建立单一 QID 分配 Registry；
3. 以人工审核方式迁移现有 `questions[]`；
4. 建立 Q → Primary JD 与 JD → Q 派生索引；
5. 校验 Draft 隔离、重复问题和失效 JD；
6. 将 Published Q 加入独立搜索文档，但结果先聚合到主 JD；
7. 输出供网站、GEO、培训和 AI 使用的只读 Question 导出。

### 进入条件

- 主 JD 已批准且 Foundation Ready；
- 问题来自真实表达或可追溯材料；
- 映射经人工确认。

### 完成指标

| 指标 | 目标 |
| --- | --- |
| QID 唯一率 | 100% |
| Published Q 的主 JD 有效率 | 100% |
| Draft 公开数量 | 0 |
| 重复正式 Q | 0 |
| Question 来源追溯 | 100% |
| Question → JD 映射覆盖 | 100% |

## 4. Phase 2：Answer Layer

### 目标

为高优先级 Question 建立经批准、可版本化、可追溯的标准回答。

### 原则

- Answer 是 JD 的用户表达层，不是理论源；
- Answer 必须记录 QID、主 JD ID 和主 JD 版本；
- 一个 Q 允许多个历史 Answer 版本，但只能有一个当前有效版本；
- JD 修订时，相关 Answer 自动进入复核队列；
- 没有批准 Answer 时明确返回“尚未发布”，不得由系统伪造。

### 建议顺序

1. 先覆盖 P0 Question；
2. 建立 Answer 审核与版本流程；
3. 建立 Answer 与 JD 一致性检查；
4. 再扩展 P1、P2；
5. 达到稳定质量后再考虑 Question Detail 与 FAQ 页面。

### 完成指标

| 指标 | 目标 |
| --- | --- |
| P0 Published Q 的 Approved Answer 覆盖 | 100% |
| Answer → Q/JD 可追溯 | 100% |
| Answer 与当前 JD 版本一致 | 100% |
| 无来源自动生成 Answer | 0 |

## 5. Phase 3：Evidence Layer

### 目标

把法律、政策、图书章节、标准、案例和可核验数据升级为独立 Evidence Object。

### 工作

1. 批准 Evidence 类型与验证状态；
2. 记录来源、精确定位、版本和核验时间；
3. 将现有 `legal_basis[]` 逐步迁移为 Evidence 引用；
4. 建立失效、更新与冲突检查；
5. 对图书来源遵守 Book Traceability 和 Revision Notes；
6. 不修改原始书稿或已批准引用原文。

### 完成指标

| 指标 | 目标 |
| --- | --- |
| Evidence 可定位 | 100% |
| 法律依据可核验 | 100% |
| 失效来源告警 | 100% |
| 推测或虚构证据 | 0 |

## 6. Phase 4：Citation Layer

### 目标

建立 Answer 中具体陈述与 Evidence 具体位置之间的声明级引用。

### 工作

1. 定义 `claim_locator` 与 `evidence_locator`；
2. 支持一个陈述引用多项证据；
3. 支持同一证据被多个 Answer 复用；
4. 生成面向网页、AI 和培训的一致引用格式；
5. 对证据更新触发受影响 Citation 与 Answer 复核；
6. 建立无证据陈述、失效引用和循环引用检查。

### 完成指标

| 指标 | 目标 |
| --- | --- |
| 需要证据的 Answer 声明引用覆盖 | 100% |
| Citation 定位有效率 | 100% |
| 失效引用 | 0 |
| 引用与展示来源一致 | 100% |

## 7. Phase 5：AI Consumption

### 目标

让 AI 在受控范围内读取已发布 Question、JD、Answer、Evidence 和 Citation，生成可追溯回答。

### 检索顺序

```text
用户输入
  → Question 匹配
  → 主 JD 验证
  → 当前 Approved Answer
  → Evidence / Citation
  → 带版本与来源的输出
```

### 安全边界

- AI 只读取 Published / Approved 对象；
- 没有批准 Answer 时，AI 回到 JD 原文范围内，不把生成文本登记为正式答案；
- 输出必须带对象 ID、版本和来源；
- AI 不得写回 Foundation、Question Registry 或批准状态；
- 低置信度、无匹配或证据冲突时转为“无法据现有知识确认”；
- 不把聊天记录直接当作 Question 或 Evidence；
- 不因 GEO 需要制造 FAQ、Answer 或结构化数据。

### 完成指标

| 指标 | 目标 |
| --- | --- |
| AI 回答的 Q/JD 可追溯 | 100% |
| 需要引用的回答具备 Citation | 100% |
| Draft 内容泄露 | 0 |
| 脱离 JD 创造理论 | 0 |
| 过期版本回答 | 0 |

## 8. Search、GEO 与渠道策略

### Search

- Published Q 独立入索引；
- 同一 JD 的多条命中在结果层聚合；
- 初期跳转主 JD，不新增 Search UI；
- 建立问题召回率、无结果查询和重复问题指标。

### GEO / AI Citation

- Question 用于覆盖真实用户问法，不用于关键词堆砌；
- 只有页面可见正式 Answer 时才允许 FAQPage；
- Canonical、版本和来源保持单一；
- AI 导出保留 QID、JD ID、Answer ID、Evidence ID 与 Citation ID；
- 网站永久知识页始终是第一发布面。

### 统一复用

公众号、视频号脚本、培训、FAQ 和后续 AI 产品引用同一 QID；渠道可以调整表达长度，但不得建立脱离 Q/JD 的第二套正式问答库。

## 9. 规模化策略

### 1,000+ Question

- 单一 Schema 和 Registry；
- QID 不含业务语义；
- 按状态、主 JD、受众、类型和语言建立索引；
- 自动校验格式、关系和重复候选，人工决定语义合并；
- 用覆盖率和真实查询命中率衡量质量，不以数量作为唯一目标。

### 1,000+ Answer

- Answer 独立版本；
- 主 JD 更新触发影响分析；
- Evidence/Citation 分离以便复用；
- 公开、内部和归档索引物理隔离；
- 达到检索性能门槛后再评估专用搜索，不提前引入复杂基础设施。

## 10. 风险与控制

| 风险 | 影响 | 控制 |
| --- | --- | --- |
| Question 脱离 JD | 形成第二理论源 | Published Q 强制主 JD 与版本校验 |
| 批量生成近义问题 | 搜索稀释、GEO 薄内容 | 真实来源、人工去重和发布审批 |
| Answer 复制后失去同步 | 版本漂移 | 保存 JD 版本，JD 更新触发复核 |
| Evidence 不可核验 | 引用失真 | 强制来源定位和验证状态 |
| FAQPage 与页面不一致 | 结构化数据风险 | 仅对可见正式问答输出 |
| 搜索出现大量重复结果 | 用户体验下降 | 按主 JD 聚合 Q 命中 |
| AI 写回正式库 | 污染 SSOT | 所有 AI 接口只读，发布需人工批准 |
| 过早采用复杂技术 | 双写和维护成本上升 | 先用文件 Registry 验证 1,000 级对象 |

## 11. 建议执行顺序

1. 批准本轮 Question Schema；
2. 前置 Knowledge Center V1.0 合并后，将 Question Layer PR retarget 到 `main`；
3. 另立内容运营任务，人工登记首批 P0 Question；
4. 运行关系、重复、生命周期和搜索索引校验；
5. 完成 Question 层验收后，再批准 Answer Object；
6. Evidence 和 Citation 分阶段建设；
7. 最后接入 AI，且始终保持只读和可追溯。

## 12. 本阶段不要做

- 不自动生成 Question；
- 不编写 Answer；
- 不伪造 Evidence 或 Citation；
- 不开发聊天、Agent 或数字分身；
- 不修改首页、详情页或 Search UI；
- 不修改已批准 JD 正文；
- 不建立第二套知识 SSOT；
- 不用 Question 数量替代真实覆盖质量；
- 不在没有正式 Answer 的页面输出 FAQPage；
- 不提前引入 ORM、向量数据库或图数据库。
