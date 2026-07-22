# 中国信托制物业发展平台 MVP V0.2 信息架构

> 对应任务：Codex 任务单 No.012
> 状态：实施基线
> 日期：2026-07-13

## 1. 范围

V0.2 验证“真实 Foundation → 网站浏览 → 知识阅读 → 标准查看”的最小闭环。页面只读取仓库现有知识和标准，不引入数据库、登录、权限、支付、AI 对话、小程序、用户中心或课程系统。

## 2. 页面 IA

| 页面 | 目的 | 目标用户 | 主体 | 所需数据 | 空状态 | 导航入口 | URL 筛选 | MVP 范围 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 提供平台总入口、搜索、最新知识、热门问题和分类导航 | 首次访问者、社区工作者、业主、物业从业者 | 平台 | Foundation 对象、分类、标准数量 | 无知识时保留搜索与分类入口 | 主导航“首页” | 搜索提交到 `/knowledge?q=` | 是 |
| `/knowledge` | 浏览和检索 JD、GT | 所有知识用户 | Knowledge Object | Foundation index、正文、标签、分类、生命周期 | 明确说明当前筛选无对象；GT 无对象时不得填充模拟数据 | 主导航“知识中心” | `q`、`type`、`category`、`status` | 是 |
| `/knowledge/[id]` | 阅读单个 JD 或 GT | 知识使用者 | Knowledge Object | 标题、定义摘要、正文、版本、状态、关系、标签 | 对象不存在时返回 404 | 列表卡片、关联对象 | 否 | 是 |
| `/standards` | 查看平台标准目录 | 内部协作者、审核者 | Platform Standard | `docs/standards/*.md` 元数据 | 无标准时说明目录尚未建立 | 主导航“标准” | 否 | 是 |
| `/standards/[slug]` | 阅读标准正文 | 内部协作者、审核者 | Platform Standard | 标准 Markdown 正文和元数据 | 文件不存在时返回 404 | 标准目录 | 否 | 是 |
| `/admin` | 提供内部后台四类入口 | 内部协作者 | Knowledge Object / GT / Case / Evidence | 入口定义与当前可用状态 | 未实施模块显示“预留”，不生成模拟数据 | 主导航“内部后台” | 否 | 是（仅入口） |
| `/admin/knowledge` | 保留现有 MVP 知识对象编辑原型 | 内部测试者 | Legacy MVP Knowledge Object | `data/knowledge-objects.json` | 无对象时可新建草稿 | 后台 Knowledge Object 入口 | 否 | 保留，不扩展 |

## 3. 数据边界

1. 公开知识页以 `knowledge/foundation/index.json` 和其中登记的真实文件为数据源。
2. `approved`、`draft` 等状态按 Foundation 原记录显示，不由页面推断或修改。
3. 当前 Foundation 没有 GT 时，GT 浏览器展示真实空状态。
4. Standards 页面读取 `docs/standards/`，排除目录 README；标准状态来自文件元数据。
5. 现有后台编辑原型仍使用 `data/knowledge-objects.json`，不得冒充 Foundation 正式库。

## 4. 页面关系

```text
首页
├── 搜索 → Foundation 浏览器
├── 最新知识 → JD/GT 阅读页
├── 热门问题 → JD 阅读页
├── 分类导航 → Foundation 分类结果
├── 标准 → Standards 目录 → 标准正文
└── 内部后台 → Knowledge Object / GT / Case / Evidence 入口
```
