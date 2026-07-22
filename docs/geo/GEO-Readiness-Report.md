# GEO Readiness Report

> Sprint：GEO Sprint No.001 — GEO 基础框架建设（第一阶段）
>
> 审计日期：2026-07-22
>
> 审计对象：中国信托制物业发展平台 Next.js Website
>
> 结论：**代码层 GEO 基础能力 V1.0 已建立；线上可抓取状态仍被正式域名与部署确认阻断。**

## 1. 执行摘要

本 Sprint 已建立 JD、GT、QA、Article 四类知识对象的统一发布链路。对象只有在 `Approved`，或 Foundation Registry 同时满足 `approved + foundation_ready` 时才会公开；草稿与审核中对象不会进入详情页、sitemap 或 RSS。

本地生产构建与页面抽查通过，JD001 已能输出稳定 URL、Title、Description、Canonical、OpenGraph、Twitter Card、内容 JSON-LD、BreadcrumbList JSON-LD 和自动 Related Content。GT、QA、Article 当前没有已批准对象，因此保留真实空状态，没有创建演示数据。

当前最大的外部阻断不是页面代码，而是域名：仓库 Next.js 文档指定的 `dev.judao.club`，以及 VitePress GEO 配置使用的 `geo.judao.org`，在 2026-07-22 对 Google Public DNS 查询均返回 `NXDOMAIN`。因此，现阶段不能宣称平台已经具备线上被 Google、ChatGPT 或 Perplexity 抓取、索引和引用的条件。

## 2. 本次已完成

### 2.1 统一知识对象发布

| 对象 | 稳定 URL | 当前已批准数量 | 公开条件 |
|---|---|---:|---|
| JD 治理辞典 | `/knowledge/[id]` | 7 | Approved / Foundation Ready |
| GT 治理标准 | `/standards/[id]` | 0 | Approved / Foundation Ready |
| QA 标准问答 | `/faq/[id]` | 0 | Approved / Foundation Ready |
| Article 文章 | `/articles/[id]` | 0 | Approved / Foundation Ready |

统一模板自动输出：

- URL 与 lowercase canonical path
- Title 与 Description
- Canonical
- OpenGraph
- Twitter Card
- 页面可索引 robots metadata
- JD：`DefinedTerm` JSON-LD
- GT：`TechArticle` JSON-LD
- QA：`FAQPage` / `Question` / `Answer` JSON-LD
- Article：`Article` JSON-LD
- 全站 `Organization` 与 `WebSite` JSON-LD

### 2.2 Breadcrumb

Breadcrumb 组件同时输出可见导航和 `BreadcrumbList` JSON-LD。详情页按以下层级自动形成：

```text
首页 → 对象中心 → 章节/分类 → 对象 ID + 标题
```

旧 Foundation JD 缺少显式分类时，会从正文的“第一篇 / 第一章”标题推导展示层级；不会把中文分类名写成新的关系主键。

### 2.3 Related Content

每个知识详情页固定提供以下四组推荐：

- 相关 JD
- 相关 GT
- 相关文章
- 相关 FAQ / QA

排序优先使用已登记对象关系，其次使用分类与关键词相似度，最后使用稳定 Object ID 排序。只推荐已经公开的对象；某一类型没有正式对象时显示真实空状态。

### 2.4 站点结构

| 项目 | 结果 | 说明 |
|---|---|---|
| sitemap | 完成 | 仅包含公开对象；对象有可信更新时间时才写 `lastModified` |
| robots | 完成 | 允许 Googlebot、OAI-SearchBot、ChatGPT-User、PerplexityBot；继续屏蔽 `/api/` 与 `/admin/` |
| metadata | 完成 | 四类对象集中生成，避免页面各自漂移 |
| favicon | 完成 | 复用现有品牌印章资源，不新增视觉资产 |
| RSS | 完成 | `/feed.xml` 自动发布全部已批准 GEO 对象；无可信日期时不伪造 `pubDate` |
| 空页面 | 完成 | 未批准或不存在的详情返回 404，并声明 `noindex` |

## 3. Google / ChatGPT / Perplexity 基础条件

### Google

代码层已满足可抓取 URL、robots、绝对 sitemap URL、canonical、服务端正文和结构化数据的基础要求。Google 官方说明 sitemap 应包含希望出现在搜索结果中的 canonical URL，且应使用完整绝对 URL；canonical 与 sitemap 可以共同强化首选 URL 信号。参考：[Google sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)、[Google canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)。

待线上域名可解析并部署后，仍需在 Google Search Console 提交 sitemap、检查 URL，并持续观察抓取与索引覆盖。代码通过不等于 Google 必然收录。

### ChatGPT

`robots.txt` 已显式允许 `OAI-SearchBot`，同时允许用户请求触发的 `ChatGPT-User`。OpenAI 官方出版者说明要求网站不要阻止 OAI-SearchBot，才能让内容有机会进入 ChatGPT 的摘要、片段、引用和链接。参考：[OpenAI Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)。

当前本地 HTML 已含可引用标题、摘要、稳定 URL、正文、来源信息、实体类型和知识关系。上线后能否被引用仍取决于公开可访问性、搜索发现、内容权威性与具体查询相关性，不能由站点代码保证。

### Perplexity

`robots.txt` 已显式允许 `PerplexityBot`。Perplexity 官方建议允许该 crawler，并允许其公布的 IP 范围，以便网站出现在搜索结果中。参考：[Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)。

上线后应检查 CDN/WAF 是否只看 User-Agent 或错误拦截其官方 IP；仓库代码无法验证生产网络策略。

## 4. 风险与改进建议

### 高优先级

1. **确定正式公开域名并恢复 DNS。** `dev.judao.club` 与 `geo.judao.org` 当前均为 NXDOMAIN。没有可解析、HTTPS 可访问的公开域名，任何 crawler 都无法抓取。
2. **冻结唯一主发布面。** 仓库同时存在 Next.js Website 与 VitePress `site/`，且配置了不同域名。必须明确哪个是知识对象的 canonical 主站；另一站应做 301 或明确 cross-domain canonical，避免内容重复、链接权重分散和运营口径冲突。
3. **部署后做真实线上验收。** 检查首页、四类详情、`/robots.txt`、`/sitemap.xml`、`/feed.xml` 的 200 状态、TLS、canonical 域名一致性、WAF/CDN crawler 放行和移动端可渲染性。
4. **补齐正式 GT、QA、Article。** 目前只有 7 个已批准 JD。技术框架虽已支持四类对象，但知识网络单一，Related Content 的跨类型边较少，不利于主题权威与引用覆盖。
5. **提交搜索入口并建立索引基线。** 在 Google Search Console 提交 sitemap；同时记录已发现、已抓取、已索引 URL 数量。没有基线就无法判断每个 Sprint 是否提升 GEO 能力。

### 中优先级

1. **补齐发布日期、更新时间与责任主体。** Foundation JD 当前多缺 `updatedAt`、作者/审核人和明确来源字段；应由知识治理流程提供，不应由页面伪造。随后补充 `datePublished`、`dateModified`、`author`、`reviewedBy`。
2. **深化 Evidence 引用。** 将书籍章节、法律条文、案例来源变成可解析的 Evidence 关系，并在正文附近给出链接；这是 AI 回答引用时判断可核验性的核心内容条件。
3. **形成主题 Hub 内链。** 当前对象间内链已自动化，但主题页与对象页的双向关系仍应加强：主题页列权威对象，对象页回链主题 Hub，避免只靠列表与 sitemap 发现。
4. **补齐其它 Foundation 类型的详情闭环。** CASE 已有详情；LAW 与 RESEARCH 当前只有列表路由。未来一旦批准这些对象，必须先补详情路由，否则注册表可生成链接但页面可能 404。
5. **为分享卡建立正式 1200×630 资产。** 当前复用现有品牌印章并采用 `summary` 卡，功能有效；后续可按设计系统增加克制的专题分享图，但不应阻塞索引。
6. **建立生产日志与 crawler 监测。** 区分 Googlebot、OAI-SearchBot、ChatGPT-User、PerplexityBot 的请求、状态码、命中页面和失败原因。

### 低优先级

1. 为 Schema 深化 `about`、`mentions`、`citation`、`isBasedOn`、`sameAs` 等关系，但必须建立在真实 Evidence 数据上。
2. 对多语言预留 `hreflang` 和语言化 URL；没有翻译内容前不要提前生成空语言页。
3. 评估 `llms.txt`，但不把它当作 Google、OpenAI 或 Perplexity 收录的替代条件；robots、公开 HTML、稳定链接、sitemap 和内容质量仍是基础。
4. 当对象超过 50,000 URL 时拆分 sitemap index；当前规模无需提前复杂化。

## 5. SEO / GEO 发布检查清单

每次发布知识对象前检查：

- [ ] 对象状态为 Approved，且不是 Draft / Review / Archived
- [ ] Object ID 稳定且全站唯一
- [ ] Title 准确，不与其他对象重复
- [ ] Description 是可独立理解的完整句，不是章节标签
- [ ] Canonical 使用唯一正式域名和唯一对象 URL
- [ ] 页面返回 200；不存在对象返回 404
- [ ] 页面正文在服务端 HTML 中可读取
- [ ] OpenGraph 与 Twitter Card 存在
- [ ] 内容 JSON-LD 类型与对象类型一致
- [ ] Breadcrumb 可见且 BreadcrumbList JSON-LD 有效
- [ ] 至少登记来源；涉及书籍时具有 Book Traceability
- [ ] Related Content 不链接草稿或 404
- [ ] URL 已进入 sitemap；`lastModified` 只使用真实更新时间
- [ ] RSS 已出现新对象
- [ ] robots 没有阻止目标 crawler
- [ ] 无 `noindex`、登录墙、验证码或 WAF 误拦截
- [ ] Google Rich Results / Schema Validator 无阻断错误
- [ ] Search Console 已发现 URL，并记录索引状态

## 6. 验证记录

- `npm run beta:test`：20/20 通过
- `npm run foundation:test`：待最终提交前运行
- `npx tsc --noEmit`：通过
- `NEXT_PUBLIC_SITE_URL=https://dev.judao.club npm run build`：通过，46 个路由成功生成/注册
- 本地生产抽查：JD001、robots、sitemap、RSS、FAQ 中心、文章中心返回有效输出
- 本地 sitemap：16 个唯一 URL，其中 7 个公开 JD、1 个公开 Topic
- 公开 DNS：`dev.judao.club`、`geo.judao.org` 均返回 NXDOMAIN

## 7. 下一阶段建议

建议 Sprint No.002 先完成“正式域名与线上索引闭环”，再进入 Schema 深化：

1. 决定唯一主站域名与主发布框架。
2. 完成 DNS、HTTPS、部署和全路径 200/404 验收。
3. 提交 Search Console sitemap，建立抓取/索引基线。
4. 发布至少 1 个正式 GT、1 个正式 QA、1 个正式 Article，验证四类完整闭环。
5. 为上述对象补 Evidence 与 Book Traceability，再深化 Schema。

这样下一 Sprint 的结果可以用“已发现 URL、已抓取 URL、已索引 URL、被引用页面、crawler 错误率”衡量，而不只用代码完成度衡量。
