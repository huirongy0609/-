# Knowledge Center Roadmap

版本：V1.0

## 当前完成

- Foundation Registry 作为正式知识对象 SSOT；
- approved + Foundation Ready 公开边界；
- JD、GT、FAQ、Article 等公开对象适配；
- Markdown 正文加载和路径安全；
- Title、Description、Canonical、OpenGraph、Twitter Card、JSON-LD；
- Sitemap、RSS 和 robots；
- ID、标题、摘要、关键词、分类和正文搜索；
- 混合类型 Related Content；
- 本次新增显式“关联词条”，只链接已公开 JD；
- 本次新增 `definition/chapter/legal_basis/published_at/questions` 兼容字段；
- 本次新增旧 Markdown 一句话定义与用户问题提取；
- 本次将 Questions 和章节纳入知识检索字段。

## 下一步

### P0：完成治理辞典真实入库

1. 核对 JD001—JD049 的批准原件和批准记录；
2. 将 JD007—JD049 按生命周期标准进入 Foundation；
3. 不修改已批准正文，只补充伴随 metadata；
4. 生成 JD001—JD049 完整性报告；
5. 验证 49 个对象均可访问、可搜索、可被 sitemap 收录。

完成条件：Registry 中出现 49 个唯一 JD，且每个公开对象均为 approved + Foundation Ready。

### P1：元数据治理

1. 为 49 个 JD 补齐一句话定义、章节、关键词和日期；
2. 建立章节 ID 与展示名称分离机制；
3. 建立受控关键词表和同义词表；
4. 将法律依据迁移到 LAW/Evidence 对象；
5. 为关系登记增加缺失目标、循环和草稿边界校验；
6. 在版本发布流程中自动校验 Questions。

### P1：搜索与 AI 读取

1. 为搜索增加字段权重：编号 > 标题 > Questions > 定义 > 关键词 > 正文；
2. 增加中文分词、同义词和拼音召回评估；
3. 提供只读知识对象导出，不开放写接口；
4. 输出带来源、版本和更新时间的 AI 检索载荷；
5. 建立 Question → Primary Object 映射覆盖率。

### P2：知识图谱

1. 关系类型细分为定义依赖、上下位、对比、制度依据、实践应用；
2. 建立反向关系；
3. 对孤立对象、过度连接对象和失效边执行质量检查；
4. Topic 继续作为聚合层，不复制原子对象正文。

## 风险

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| “已完成 49 个 JD”与仓库仅 7 个 approved JD 不一致 | 无法据实上线完整辞典 | 先完成原件、批准记录和 Manifest 对账 |
| 旧 JSON 模型继续写正式对象 | 产生双 SSOT | 正式 JD 只进入 Foundation，旧 API 保持关闭 |
| 自动推断 Tag/章节被误认为权威数据 | AI 和 GEO 表达漂移 | 批量入库时人工治理 metadata |
| Draft 关系被公开 | 泄露未批准内容 | 关系解析必须经过公开 Registry 过滤 |
| Questions 堆砌关键词 | 页面质量和 AI 召回下降 | 只录入真实问题，建立去重和主对象规则 |
| 法律依据不可核验 | 引用风险 | 使用 LAW/Evidence 对象和可追溯来源 |
| 过早引入向量库或图数据库 | 增加双写和运维成本 | 先以 49 个 JD 验证对象、关系和检索质量 |

## 建议

- 以“49 个 JD 全量 Foundation Ready”为下一次知识运营里程碑；
- 用伴随 metadata 升级旧对象，不改写批准正文；
- 每次发布同时检查对象、关系、搜索、sitemap、RSS 和 JSON-LD；
- 把 Questions 覆盖率作为 AI Readiness 指标，但不自动生成虚假 FAQ；
- 先完善权威内容覆盖，再评估专用搜索或知识图谱基础设施。

## 不要做

- 不建立第二套知识对象数据库；
- 不把 Topic 当作 JD 正文容器；
- 不用占位文本补齐 JD010—JD049；
- 不公开 Draft 或 in_review 对象；
- 不修改已批准知识正文；
- 不为 Question Mapping 新增聊天、Agent 或 AI API；
- 不为 49 个对象引入 ORM、向量数据库或图数据库；
- 不因搜索需要复制正文；
- 不在没有真实问答内容时输出 FAQPage Schema；
- 不进行首页、视觉和导航重构。

## 建议验收指标

| 指标 | V1 目标 |
| --- | --- |
| JD Foundation Ready | 49 / 49 |
| 稳定 ID | 100% |
| 一句话定义 | 100% |
| Questions 覆盖 | ≥ 80%，以真实问题为准 |
| 失效关系 | 0 |
| Draft 公开链接 | 0 |
| 搜索可发现 | 49 / 49 |
| Sitemap 收录 | 49 / 49 |
| Source Traceability | 100% |
