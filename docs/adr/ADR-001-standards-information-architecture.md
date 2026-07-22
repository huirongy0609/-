# ADR-001：Standards Information Architecture

- Status: Accepted
- Date: 2026-07-16
- Decision Owner: Chief Architect
- Engineering Owner: Platform Engineering Center
- Applies To: Website Information Architecture V1.1+

## Context

Website IA V1.0 已将 GT Package 规划到 `/standards/`，但当前网站的同一路径正在承载平台建设标准。两类对象的用户、来源、治理职责与发布目的不同：

- GT Package 是面向公众和实践者的一级知识对象，由 Knowledge Factory 生产，经 Architecture Review 批准后进入 Foundation；
- 平台建设标准用于约束平台工程、知识生产、生命周期与协作，属于平台自身的建设与治理信息。

如果两类标准共用 `/standards/`，会导致导航语义、Breadcrumb、Canonical、搜索分类、Sitemap 和未来对象关系发生冲突，也可能使平台建设标准被误解为 GT Package 知识对象。

## Decision

采用以下唯一分类：

```text
/standards/
  GT Package Collection

/standards/{package-id}/
  GT Package Detail

/platform/standards/
  Platform Construction Standards Collection

/platform/standards/{standard-slug}/
  Platform Construction Standard Detail
```

具体约束：

1. 主导航 `Standards` 只链接 `/standards/`，只表示 GT Package。
2. 平台建设标准通过 `Platform` Utility Navigation、Footer 或治理入口访问，二级标签使用完整名称“平台建设标准”。
3. GT Package Breadcrumb 为 `Home > Standards > {Package}`。
4. 平台建设标准 Breadcrumb 为 `Home > Platform > Platform Standards > {Standard}`。
5. 两类对象使用独立 Collection、详情模板语义、Canonical 和 XML Sitemap 分组。
6. 平台建设标准不是 Foundation GT Package，不进入默认 Knowledge Object 搜索结果。
7. 本决策只确定信息归属，不改变任何标准正文、Foundation 类型、Manifest 或 Knowledge Engine。

## Rationale

- **对象边界清晰**：Knowledge Object 与平台治理资产不会因同名栏目混淆。
- **用户预期稳定**：公众访问 `Standards` 时获得可执行的 GT Package；平台协作者在 `Platform` 域查找建设规范。
- **Canonical 唯一**：每类对象拥有稳定、不可重叠的 URL namespace。
- **可扩展**：`/platform/` 后续可容纳经批准的平台治理信息，而不污染公共知识分类。
- **迁移可追踪**：现有平台标准详情可以逐项迁移并建立永久重定向。

## Consequences

### Positive

- `/standards/` 可以长期稳定承载 GT Package 与其 Rule、Method、Principle、Evidence 层级。
- 平台建设标准拥有明确的导航和发布边界。
- Search、Breadcrumb、Canonical、Sitemap 与 Analytics 可以按对象族区分。

### Costs and Risks

- 当前 `/standards` Collection 的语义需要一次原子切换，不能同时服务两类标准。
- 当前 `/standards/{slug}` 平台标准详情需要迁移到 `/platform/standards/{slug}/` 并建立永久重定向。
- 内部链接、Canonical、结构化数据、XML Sitemap 与导航必须在同一实施 PR 中同步更新。
- GT Package 尚无 Approved 对象时，新的 `/standards/` 必须显示真实空状态，不得用平台标准或 Mock 数据填充。

## Migration Boundary

ADR-001 不授权本次文档任务修改运行代码。后续 Engineering PR 必须：

1. 清点当前 `/standards` 下的平台标准与所有入站链接；
2. 建立 `/platform/standards/` Collection 和详情路由；
3. 将平台标准 Canonical 与内部链接切换到新路径；
4. 为旧平台标准详情建立永久重定向；
5. 将 `/standards/` 原子切换为 GT Package Collection；
6. 分离 `standards.xml` 与 `platform-standards.xml`；
7. 验证 Build、TypeScript、Canonical、Breadcrumb、Redirect、Sitemap 和 dead links。

Collection `/standards` 的旧语义不能通过重定向保留，因为该路径将继续存在并承载 GT Package；因此切换必须以内容类型和部署版本为边界，而不是把 `/standards` 重定向到自身或同时返回两类对象。

## Alternatives Considered

### A. 两类标准继续共用 `/standards/`

Rejected。会造成对象类型、导航、搜索和 Canonical 混淆，无法形成长期稳定的 Standards 语义。

### B. GT Package 使用 `/knowledge/gt-package/`

Rejected。GT Package 已被 Architecture Decision 定义为 Standards 一级对象；降入通用 Knowledge 路径会削弱标准包的独立语义。

### C. 平台建设标准不提供公开路径

Rejected as a universal rule。部分批准后的平台标准可能需要公开供协作者查阅；是否公开仍由各标准的批准状态决定，但其信息归属固定在 `/platform/standards/`。

## Non-goals

- 不修改 UI、页面或样式；
- 不修改平台建设标准或 GT Package 内容；
- 不批准任何 Candidate Knowledge；
- 不修改 Foundation、Manifest、Knowledge Object 或 Knowledge Engine；
- 不执行路由、Redirect、Canonical 或 Sitemap 代码迁移。
