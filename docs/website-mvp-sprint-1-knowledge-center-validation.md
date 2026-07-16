# Website MVP Sprint 1｜Knowledge Center Validation Report

> 项目：中国信托制物业发展平台
>
> 任务：Codex No.022
>
> 执行角色：Platform Engineering Center
>
> 日期：2026-07-16
>
> 状态：PASS

## 1. Sprint Scope

本 Sprint 仅完成 `/knowledge` Knowledge Center MVP：

- Knowledge Landing；
- JD、GT Package、CASE、LAW、FAQ、RESEARCH 六类入口；
- 统一搜索框；
- 对象类型、来源与排序筛选；
- Foundation 驱动的统一 Knowledge Card；
- 按 Website IA V1.1 生成的对象详情链接；
- 真实空状态与按需分页。

本 Sprint 未实现登录、收藏、评论、AI 对话、推荐或权限管理。

## 2. Page Governance

| 项目 | 决策 |
| --- | --- |
| Page purpose | 统一发现、检索并进入可公开 Foundation Knowledge Object |
| Target user | 公众、物业从业者、街道社区、业委会、研究者 |
| Primary entity | Foundation Ready Knowledge Object |
| Required data | Object ID、类型、标题、版本、来源、更新时间、关系数量、Package 成员数量 |
| Empty state | 保留筛选条件并明确当前没有匹配的公开对象，不生成替代内容 |
| Navigation entry | 一级导航 `Knowledge`，Canonical `/knowledge` |
| URL filters | `q`、`type`、`source`、`sort`、`page` |
| MVP scope | 是；对应 Website IA V1.1 的 Knowledge Center Collection |

## 3. Data Boundary

- 唯一对象入口：`getPublicWebsiteObjects()`。
- Registry 来源：Knowledge Foundation Engine `buildKnowledgeRegistry()`。
- 公开门禁：`status === approved && foundation_ready === true`。
- Candidate、draft、in_review、archived 与未 Foundation Ready 对象不进入公共结果。
- 分类数量由当前公开对象集合实时计算，没有写死统计值。
- 本 Sprint 未新增 Mock 数据，未修改 Foundation 数据、Manifest 或知识正文。

当前 Registry 提供 7 个公开对象，均为 JD；GT Package、CASE、LAW、FAQ、RESEARCH 当前为 0，页面按真实数据展示 0 和空状态。

## 4. Implementation Validation

| Capability | Result | Evidence |
| --- | --- | --- |
| Knowledge Landing | PASS | 页面展示标题、说明、六类入口和 Registry 实时总数 |
| Category support | PASS | JD、GT Package、CASE、LAW、FAQ、RESEARCH 共 6 类 |
| Unified search | PASS | 搜索 `JD003` 精确返回 1 个公开对象 |
| Object type filter | PASS | 选择 `RESEARCH` 后 URL 保留筛选，显示真实 0 结果空状态 |
| Knowledge Card | PASS | 统一展示类型、Approved 状态、标题、版本、来源状态与 Object ID |
| Detail link | PASS | `JD003` 卡片成功进入 `/knowledge/jd003` 并读取 Foundation 正文 |
| Canonical routing contract | PASS | 六类对象详情路径按 Website IA V1.1 生成并由自动测试覆盖 |
| Pagination | PASS | 继续使用 Foundation Browser 的按需分页，不硬编码页数 |
| Accessibility | PASS | Breadcrumb、Landmark、Heading、Label、Card link 与空状态语义可读取 |
| Responsive | PASS | 1280px 与 390px 均无横向页面溢出；移动端筛选控件均在视口内 |
| Browser console | PASS | 0 error，0 warning |

## 5. Automated Validation

| Check | Result | Summary |
| --- | --- | --- |
| Knowledge Center view tests | PASS | 5 passed，0 failed |
| Foundation Engine tests | PASS | 7 passed，0 failed |
| Foundation Engine validation | PASS | 0 engineering errors；14 existing data notices |
| TypeScript | PASS | `npx tsc --noEmit --pretty false` |
| Production Build | PASS | Compiled successfully；47/47 static pages generated |
| Dependency audit | PASS | 未新增依赖 |
| Global CSS audit | PASS | `app/globals.css` 未修改；复用 Platform Design System 现有原语 |

14 条 Foundation notice 来自既有未注册关系和平台标准生命周期数据，不是本 Sprint 引入的工程错误。本任务未修改相关对象或标准。

## 6. Screenshots

- [Knowledge Center desktop](website-mvp-sprint-1-screenshots/knowledge-center-desktop.png)
- [Knowledge Center mobile](website-mvp-sprint-1-screenshots/knowledge-center-mobile.png)

截图分别记录 1280px 桌面页面与 390px 移动端首屏。浏览器同时核验了搜索结果、类型空状态和详情页跳转。

## 7. Scope Audit

- ADR-001 与 Website IA 未修改。
- ADR-002 与 Repository Structure 未修改。
- Knowledge Foundation Engine 未修改。
- Knowledge Object、Golden Sample、GT Package、Manifest 与知识正文未修改。
- Header、Footer 与其他 Center 页面未修改。
- 未新增 Mock 数据或依赖。
- 未执行 Push。
