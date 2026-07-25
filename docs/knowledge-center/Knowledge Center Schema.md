# Knowledge Center Schema

版本：V1.0
目标：以 Foundation 知识对象为 SSOT，同时支持网站、GEO、AI、知识图谱和交叉引用。

## 设计原则

1. `object_id` 是永久身份，不使用标题作为主键。
2. 正文只保存一份，页面、搜索、AI 和 GEO 共用同一对象。
3. 生命周期决定公开性，只有 approved 且 Foundation Ready 的对象可以公开。
4. 关系只保存目标 Object ID，不复制目标标题。
5. 新字段采用向后兼容方式，旧对象可以逐步迁移。
6. 法律依据必须可核验，不能为了 Schema 完整而填写推测内容。

## 字段定义

| 业务字段 | 机器字段 | 类型 | 规则 |
| --- | --- | --- | --- |
| 编号 | `object_id` | string | 必填、唯一、永久；JD 使用 `JD001` 形式 |
| 标题 | `title` | string | 必填 |
| 一句话定义 | `definition` | string | 建议必填；面向摘要、搜索和 AI 首答 |
| 正文 | Markdown body | string | 必填；批准后按版本冻结 |
| 关键词 | `keywords` | string[] | 受控词表，去重 |
| 所属章节 | `chapter` | string | 稳定章节名称，不使用城市等关系键 |
| 关联词条 | `relations` | string[] | 只存 Object ID |
| 法律依据 | `legal_basis` | string[] | 可核验来源；后续迁移为 LAW/Evidence 引用 |
| 发布日期 | `published_at` | date | 首次正式公开日期 |
| 版本号 | `version` | string | `V1.0` 等语义版本 |
| 更新时间 | `updated_at` | date | 当前版本更新时间 |
| 问题映射 | `questions` | string[] | 真实问题表达，去重，保留问号 |

## 治理辅助字段

以下字段继续沿用 Foundation 标准：

- `schema_version`
- `object_type`
- `status`
- `source`
- `foundation_id`
- `candidate_id`
- `created_at`
- `package_id`
- `parent_object`
- `children`

图书来源对象还应遵守 Book Traceability 要求；`source` 不得只写笼统书名，应能定位到现有 Source Governance 和 Book Mapping 基线。

## 推荐 Markdown

```yaml
---
schema_version: "1.0"
object_id: JD009
object_type: JD
title: 什么是开放式预算？
definition: 开放式预算是业主共同基金的年度使用预算制度。
summary: 解释开放式预算的对象、形成、执行、公开和监督机制。
keywords:
  - 开放式预算
  - 预算治理
  - 业主共同基金
category: 资金治理
chapter: 第三章 资金治理
version: V1.0
status: approved
source:
  - knowledge/foundation/v1.0/manifest.md
legal_basis: []
published_at: 2026-07-14
updated_at: 2026-07-14
relations:
  - JD005
  - JD006
  - JD008
questions:
  - 为什么要实行开放式预算？
  - 开放式预算是什么？
  - 预算如何编制？
---

# 什么是开放式预算？

正文……
```

示例中的关系只代表数据格式；公开页面仍需检查目标是否已批准。`legal_basis: []` 表示尚未登记可核验法律依据，不应用推测内容填充。

## Question Mapping

V1 使用 `questions[]` 直接挂在知识对象上，解决“一个权威对象可由多种用户问法进入”的需求。

规则：

- 问题必须能由当前对象正文回答；
- 不保存答案副本，答案仍来自正文；
- 不把搜索关键词机械改写成问题；
- 同一问题只归属一个主对象，其他对象通过关系引用；
- Questions 参与站内检索，但不自动生成 FAQPage；
- 只有页面存在真实问答内容时，才允许输出 FAQPage Schema。

未来需要意图、语言、热度和版本治理时，再升级为独立 Question Object：

```text
Question ID
→ primary_object_id
→ related_object_ids
→ intent
→ locale
→ lifecycle
```

## Related Topics

```text
JD009.relations = [JD005, JD006, JD008]
        ↓
Registry 检查目标存在
        ↓
Publication 检查目标已批准
        ↓
页面只链接 JD005、JD006
```

当 JD008 后续批准并进入公开 Registry，无需修改 JD009 页面代码即可自动出现。

## 兼容策略

- 旧 Foundation Markdown 没有 frontmatter 时，从“一句话定义”和“用户问题”章节兼容提取；
- 无法可靠提取的字段保持 `null` 或空数组；
- 不回写、改写已批准正文；
- 旧 `data/knowledge-objects.json` 仅作为兼容源，后续停止承载正式 JD；
- Schema 新字段暂不全部设为 required，待 JD001—JD049 完成迁移校验后再收紧。

## GEO、AI 与知识图谱映射

| 能力 | 使用字段 |
| --- | --- |
| Canonical / 页面身份 | `object_id` + 路由 |
| Title / Description | `title`、`definition`、`summary` |
| DefinedTerm JSON-LD | `object_id`、`title`、`definition` |
| 搜索召回 | 标题、定义、关键词、章节、Questions、正文 |
| AI 首答 | `definition` + 正文 |
| AI 追问 | `questions[]` |
| 知识图谱边 | `relations[]` |
| 证据引用 | `source[]`、`legal_basis[]` |
| 新鲜度 | `version`、`published_at`、`updated_at` |
