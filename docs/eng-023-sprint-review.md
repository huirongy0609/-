# ENG-023 Sprint Review｜Website Beta Sprint 1

> 项目：中国信托制物业发展平台（judao.club）
>
> 执行角色：Platform Engineering Center
>
> 日期：2026-07-17
>
> 结果：PASS

## 1. 本次完成了什么

Website Beta 已形成可启动、可浏览、可搜索的第一阶段产品闭环：

- 深色首页：Platform Logo、一句话定位、全站搜索、最新 Topic、热门 Topic、平台简介和 Beta 导航；
- Topic List：Topic 卡片、关键词搜索、稳定分类 ID、稳定标签 ID 与真实空状态；
- Topic Detail：阅读型布局、Topic Index，以及 JD、GT、FAQ、LAW、CASE、Research 六类内容区；
- Search：联合搜索 Topic 元数据与公开 Foundation JD 的标题、摘要和正文；
- About：平台介绍、Topic 阅读方式和 Beta 数据边界；
- README：更新本地运行、验证和 Development 部署说明；
- Footer：增加 Topic、Search、About 入口并更新当前产品阶段。

## 2. 页面治理记录

| 页面 | Purpose | Primary Entity | Required Data | Empty State | URL Filters | MVP |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 从搜索或 Topic 进入知识 | Topic / Search Entry | Logo、定位、Topic、Provider notice | Topic 为空时保留搜索与平台介绍 | `q` 提交至 `/search` | 是 |
| `/topics` | 浏览和筛选 Topic | Topic | ID、标题、摘要、分类、标签、索引数量 | 不生成伪造结果 | `q`, `category`, `tag` | 是 |
| `/topics/[slug]` | 阅读 Topic Index | Topic + Reference | 六类区段、对象状态、公开链接 | 无条目区段显示等待 Foundation | 无 | 是 |
| `/search` | 搜索 Topic 与公开知识 | Search Result | 查询、范围、标题、摘要、状态、链接 | 引导调整查询，不补造结果 | `q`, `scope` | 是 |
| `/about` | 解释平台与发布边界 | Platform | 定位、Topic 方式、Beta 边界 | 保留基础平台说明 | 无 | 是 |

目标用户为物业从业者、街道社区、业委会、研究者和公共治理参与者。新页面通过首页 Beta 导航和 Footer 进入。

## 3. 数据与 Foundation 对接

审计确认：当前正式 Website Ready Topic 为 0，现有 P0 Topic 与 Topic Package 仍为 `in_review / not_ingested`。

Sprint 采用明确标注的 `beta_fallback` 数据源验证产品结构：

```text
Page
→ TopicProvider
→ beta_fallback（当前）
→ Foundation Topic Provider（后续替换）
```

- `data/beta-topics.json` 不代表 Architecture Approved；
- `in_review` 引用只显示 ID、标题和状态，不生成候选正文链接；
- Approved JD 继续通过 Foundation 页面公开；
- Search 只全文检索公开 Foundation JD，不检索候选正文；
- 本 Sprint 未修改 Topic、Knowledge Object、Foundation、标准、Roadmap 或 Architecture Review。

## 4. 遇到的技术问题

### 正式 Topic 尚未具备发布条件

产品要求展示 Topic，但 Foundation 中没有 Website Ready Topic。工程侧不能把候选包伪装为正式内容，因此建立了可替换 Provider 和显式 Beta Preview 状态，兼顾可演示性与生命周期纪律。

### 搜索需要跨两个数据源

Topic 当前来自 Beta Provider，正式知识来自 Foundation。基础搜索在服务端合并两类结果，并以 Foundation 公开 ID 集合作为正文搜索门禁，避免 Candidate 被全文检索暴露。

### 当前工作区存在并行改动

Header、Sitemap 和内容运营文件已有未提交改动。本 Sprint 避免覆盖这些文件，通过复用的 Beta 二级导航与 Footer 完成新入口，提交范围只包含 ENG-023 文件。

## 5. 推迟到下一 Sprint

- 正式 Foundation Topic Provider 与 Topic Release Gate；
- 搜索相关度评分、关键词高亮、分页和独立索引；
- Topic 正式更新时间、热度指标与发布记录；
- Header 与 Beta 二级导航的统一收敛；
- Sitemap、RSS 与正式 Topic Canonical 发布；
- 登录、收藏、评论、AI 对话、推荐和权限管理。

## 6. 对产品与工程的建议

下一 Sprint 建议聚焦 **Topic Foundation Integration + Search Quality**：

1. 由 Architecture Review 批准首个 Website Ready Topic，并形成正式 Topic Release Record；
2. 实现 Foundation Topic Provider，保持现有页面契约不变；
3. 为 Search 增加稳定索引字段、结果高亮和分页；
4. 合并主导航与 Beta 导航，更新 Sitemap 后部署 Development 环境；
5. 继续坚持 Engineering PR 与 Knowledge PR 分离。

## 7. Validation Summary

| Check | Result |
| --- | --- |
| Website Beta tests | PASS：9/9 |
| Foundation Engine tests | PASS：7/7 |
| Foundation validation | PASS：0 error；14 existing data notices |
| TypeScript | PASS |
| Production Build | PASS：50/50 static pages |
| Home search | PASS：“开放式预算”返回 Topic + JD009 |
| Topic filter | PASS：`category=funds` 返回 1 个 Topic |
| Topic Detail | PASS：Topic Index + 六类区段 |
| Candidate link gate | PASS：0 个候选正文链接 |
| Responsive | PASS：1280px / 390px 无横向溢出 |
| Browser console | PASS：0 error / 0 warning |

## 8. Screenshots

- [Home desktop](eng-023-screenshots/home-desktop.jpg)
- [Home mobile](eng-023-screenshots/home-mobile.jpg)
- [Topic Detail desktop](eng-023-screenshots/topic-detail-desktop.jpg)

## 9. Local Run

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。Development 部署步骤见根目录 [README](../README.md)。
