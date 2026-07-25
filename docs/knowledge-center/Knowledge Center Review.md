# Knowledge Center Review

版本：V1.0
审计基线：`main@610f040a69b2b56a61714cb33c38e512430d2a04`
审计日期：2026-07-25

## 结论

现有知识中心已经具备可持续演进的基础：Foundation Registry 是正式知识对象权威源，公开页面只读取已批准且 `foundation_ready` 的对象，Markdown 正文、GEO Metadata、JSON-LD 和关系登记均已有数据链路。

但当前仓库尚不能据实宣布“JD001—JD049 已全部上线”。最新 `main` 中只有 JD001—JD006、JD009 共 7 个已批准 JD；JD007、JD008 为草稿；未发现 JD010—JD049 的 Foundation 正式文件、Manifest 登记或批准记录。这是知识资产入库缺口，不应通过代码生成占位内容绕过。

本次代码升级后，知识中心框架能够承载 49 个治理辞典对象；真正上线仍取决于 JD007—JD049 按既有批准流程进入 Foundation SSOT。

## 审计范围

| 项目 | 当前实现 | 结论 |
| --- | --- | --- |
| Topic 数据结构 | `config/foundation/topic-registry.v1.json` + Topic Manifest；Topic 是聚合主题，不是 JD 本体 | 可用。应继续与知识对象分层，不能把 Topic 当作 JD 数据源 |
| Markdown Loader | 支持 YAML frontmatter、旧版 blockquote metadata 和正文保留 | 可兼容现状；仅支持扁平字段和字符串数组，不支持复杂嵌套结构 |
| Search Index | 服务端运行时读取公开 Registry；可选正文检索 | 49 个 JD 阶段可用；不是持久化倒排索引，规模扩大后需替换 |
| Metadata | 已有 ID、类型、状态、版本、摘要、关键词、分类、来源、日期和关系 | 本次增量支持 definition、chapter、legal_basis、published_at、questions |
| Tag | Candidate 可从 metadata 读取；旧 Foundation 正式对象部分依赖正文推断 | 可展示但权威性不足，应随 JD 批量入库补齐人工治理关键词 |
| Related Topics | Foundation 已有关系登记；详情页已有混合类型相关推荐 | 本次新增独立“关联词条”，只展示已登记且公开的 JD |

## 数据链路

```text
批准原件 Markdown
  → Foundation Manifest / Index
  → Foundation Registry
  → Website Foundation Adapter
  → GEO Publication Adapter
  → Knowledge Center / Search / Metadata / Related Topics
```

`data/knowledge-objects.json` 仍是早期 MVP 兼容源，其中现有对象均为 Draft。它不应成为 JD001—JD049 的第二权威库，也不应覆盖 Foundation 中的同 ID 正式对象。

## Topic 数据结构

Topic 当前承担“围绕一个治理议题组织多个知识对象”的职责，包含分类、标签、六类内容区段、证据和发布级别。这个模型适合专题聚合，但不适合直接保存治理辞典正文。

建议保持：

- JD 是可引用的原子知识对象；
- Topic 是引用 JD、GT、FAQ、LAW、CASE 等对象的聚合层；
- Topic 只保存对象引用，不复制 JD 正文；
- 只有 `approved + Website Ready` Topic 可以公开。

## Markdown Loader

### 已具备

- YAML frontmatter；
- 旧版中文 blockquote metadata；
- Markdown 正文不被重写；
- 字符串和扁平字符串数组；
- 路径越界保护。

### 本次增强

- 可读取 `definition`；
- 可读取 `chapter`；
- 可读取 `legal_basis[]`；
- 可读取 `published_at`；
- 可读取 `questions[]`；
- 对旧版 JD 可从“一句话定义”和“用户问题”章节兼容提取。

### 限制

Loader 不是完整 YAML 解析器。法律依据若未来需要结构化到“法律名称、条款、链接、适用说明”，应升级为独立 Evidence/LAW 引用对象，而不是在当前扁平 frontmatter 中嵌套复杂对象。

## Search Index

当前搜索不是预生成的倒排索引，而是对公开对象的服务端字段匹配。此前主要覆盖 ID、标题、摘要、分类与标签；本次将一句话定义、章节和 Questions 纳入检索字段，并修正不同对象类型应进入各自详情路由的问题。

对于 49 个 JD，这种实现简单、稳定、足够。出现以下任一条件时再引入持久化索引：

- 公开对象达到数千级；
- 需要中文分词、同义词、拼音或权重排序；
- 需要搜索分析、召回率评估；
- 需要 API 级向量或混合检索。

## Metadata 与 Tag

正式对象应在批准时显式提供摘要、关键词、章节和日期，不应长期依靠正文启发式推断。推断值只能作为兼容展示，不是权威元数据。

建议 JD001—JD049 批量入库时执行：

1. 使用稳定 Object ID；
2. 一句话定义与正文保持可追溯；
3. 关键词采用受控词表；
4. 章节使用稳定章节名称；
5. 关系只登记真实对象 ID；
6. 法律依据引用 LAW/Evidence 对象或可核验来源；
7. Questions 保持真实用户表达，不堆砌同义关键词。

## Related Topics

详情页现在有两层关系：

- “相关内容”：允许按已登记关系、分类和关键词推荐不同类型对象；
- “关联词条”：只按 Foundation 显式关系展示已公开 JD。

未批准对象不会生成链接。例如 JD009 当前登记 JD008，但 JD008 在 `main` 仍为 Draft，因此不会公开链接；待 JD008 获批入库后会自动出现。

## 风险优先级

### P0

- JD001—JD049 的项目状态与仓库状态不一致：仓库仅有 7 个已批准 JD。
- JD007—JD049 若没有正式文件、批准记录和 Manifest 登记，不能作为 SSOT 上线。

### P1

- 旧正式 JD 缺少统一结构化 frontmatter，摘要、章节和关键词部分依赖推断。
- `data/knowledge-objects.json` 与 Foundation 并存，未来写入流程若继续使用旧 API，可能形成第二权威源。
- 关系中包含 Draft target 时，必须持续保持“登记但不公开链接”的边界。

### P2

- 搜索尚无中文分词、同义词和权重模型。
- 法律依据仍为字符串数组，尚未形成 LAW/Evidence 级可验证引用。
- Questions 尚无独立问题对象 ID、意图分类和回答映射。

## 验收建议

治理辞典整体上线前，应生成一份机器校验清单，逐项确认 JD001—JD049：

- 文件存在；
- ID 唯一；
- 状态 approved；
- Foundation Ready；
- 标题和一句话定义非空；
- 版本、发布日期、更新时间有效；
- 关系目标存在；
- Questions 去重；
- 草稿不进入 sitemap、RSS 和公开搜索。
