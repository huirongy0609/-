# ENG-023A｜Website UI Baseline Alignment

## UI Review

### 当前偏差

- Home 使用大面积深色背景、双栏 Hero、引导面板和多层卡片，视觉重心更接近 SaaS Dashboard，而不是知识检索入口。
- Home 的搜索虽然存在，但在 Logo、长标题、说明、按钮和右侧面板之后才形成视觉焦点。
- Topic Detail 采用“正文在左、卡片目录在右”的产品页面结构；正文与条目被多层卡片包裹，连续阅读感不足。
- Search 使用筛选面板和卡片结果，容易形成后台查询页面观感。

### 保留内容

- 官方聚道 Logo 与既有品牌资产。
- 现有低饱和青绿色 Design Tokens、中文字体栈和 8px 圆角基线。
- Home、Topic Detail、Search 的路由、数据来源、查询参数与搜索逻辑。
- Topic 状态、标签、对象链接和 Foundation 发布边界。

### 对齐调整

- Home 恢复白色与浅灰基调，把官方 Logo、一句话定位、大搜索框和热门搜索置于第一视觉层。
- 移除页面内重复的 Beta 导航，保留全站官方 Header 作为唯一品牌与主导航入口。
- Home 只保留最新 Topic 与热门 Topic，移除首屏右侧引导面板、额外 CTA 和平台介绍堆叠。
- Topic Detail 调整为左侧锚点目录、右侧窄正文列；移除正文外层阴影卡片，将对象条目改为连续分隔列表。
- Search 调整为居中的知识搜索入口，结果采用文档式线性列表，不再使用 Dashboard 筛选面板和卡片墙。

## Design Notes

本次不是重新设计，而是实现已经批准的 Knowledge First 方向：搜索先于功能陈列，阅读先于组件展示，知识层级先于 Dashboard 指标。浅色背景、克制边界、舒适正文宽度和稳定锚点共同服务长期知识阅读。

未修改全局 Design Tokens，也未新增品牌主色。页面继续使用现有 `--primary-dark`、`--muted`、`--line` 等变量，保证聚道品牌识别和现有 Design System 一致。

## Scope Validation

- UI only：Home、Topic Detail、Search。
- 无路由变更。
- 无 Foundation、数据模型或 Provider 变更。
- 无 Topic、搜索逻辑或平台标准变更。
- 无新增依赖与全局 CSS 变更。

## Screenshot Matrix

| View | Before | After |
| --- | --- | --- |
| Home Desktop | `docs/eng-023-screenshots/home-desktop.jpg` | `docs/eng-023a-screenshots/home-desktop-after.jpg` |
| Home Mobile | `docs/eng-023-screenshots/home-mobile.jpg` | `docs/eng-023a-screenshots/home-mobile-after.jpg` |
| Topic Detail Desktop | `docs/eng-023-screenshots/topic-detail-desktop.jpg` | `docs/eng-023a-screenshots/topic-detail-desktop-after.jpg` |
| Topic Detail Mobile | — | `docs/eng-023a-screenshots/topic-detail-mobile-after.jpg` |
| Search Desktop | — | `docs/eng-023a-screenshots/search-desktop-after.jpg` |
