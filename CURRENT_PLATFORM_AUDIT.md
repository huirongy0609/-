# CURRENT_PLATFORM_AUDIT

本报告只基于当前代码库实际状态，不包含愿景、规划或下一阶段开发建议。

## 第一部分：项目总览

### 项目名称

当前 `package.json` 名称：`community-governance-map-mvp`

当前页面与 metadata 呈现名称：`全国信托制社区治理协同平台`

README 仍使用旧名称：`全国社区治理协同地图 MVP`

### 技术栈

- Next.js 14.2.x，App Router
- React 18
- TypeScript
- Tailwind CSS v3
- Framer Motion
- lucide-react
- zod
- 本地 JSON mock 数据
- Remotion 相关依赖与脚本仍存在

### 主要依赖

运行依赖：

- `next`
- `react`
- `react-dom`
- `framer-motion`
- `lucide-react`
- `zod`
- `remotion`
- `@remotion/*`

开发依赖：

- `typescript`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- React / Node 类型包

### 当前代码规模

按当前扫描的主要代码与数据文件统计：

- TS/TSX/JSON/CSS 主要文件合计约 `7038` 行
- `app/globals.css` 约 `3725` 行，是当前最大单文件
- `components/CityRuntimeLayer.tsx` 约 `410` 行
- `app/intelligence/IntelligenceExplorer.tsx` 约 `264` 行
- `components/HomeCommandCenter.tsx` 约 `239` 行
- `components/ParkingConflictFlow.tsx` 约 `186` 行

### 项目目录结构

```text
/app
  /cases
    /[id]/page.tsx
    CasesExplorer.tsx
    page.tsx
  /intelligence
    IntelligenceExplorer.tsx
    page.tsx
  /map/page.tsx
  /parking-conflict-demo/page.tsx
  /submit/page.tsx
  globals.css
  layout.tsx
  page.tsx

/components
  CaseMatchPanel.tsx
  CityNetworkMap.tsx
  CityRuntimeLayer.tsx
  HomeCommandCenter.tsx
  ParkingConflictFlow.tsx
  TrustRulePanel.tsx

/lib
  /domain
    api-response.ts
    case.ts
    intelligence.ts
    region.ts
    submission.ts
  /repositories
    cases.ts
    intelligence.ts
    regions.ts
    submissions.ts
  elevenlabs.ts
  heygen.ts
  renderVideo.ts
  scriptGenerator.ts
  types.ts

/data
  cases.json
  categories.json
  cities.json
  intelligence.json
  parking-conflict-demo.json
  sample-script.json
  stats.json

/public
  audio.mp3
  audio.wav
  cover.jpg
  /renders

/remotion
  BookGuideVideo.tsx
  Root.tsx
  index.ts

/video_build
/video_review
/.tmp
/content-factory
/section1_hyperframes_style
/hyperframes_trust_budget
```

## 第二部分：页面盘点

### 首页

路径：`/`

完成度：`75%`

用途：平台总入口，展示全国信托制社区治理协同平台、今日治理态势、重点治理事件、全国协同网络、AI治理中心、信托制闭环、六大中心。

当前状态：可展示。刚从功能/概念混合首页收敛成平台介绍型首页。页面内容清晰，但仍主要是静态 mock 展示。

---

### 停车纠纷 Demo

路径：`/parking-conflict-demo`

完成度：`80%`

用途：展示“停车管理争议”如何进入信托制协同治理闭环。

当前状态：可展示。包含事件概况、AI研判、信托制规则、案例匹配、多方协同、时间流、结果预览。没有真实交互和真实数据流。

---

### 全国地图 / 城市运行页

路径：`/map`

完成度：`70%`

用途：展示城市协同网络、城市运行层、风险信号、协同脉冲等。

当前状态：可展示。视觉偏“城市治理运行空间”，数据来自 `cities.json` 和 `stats.json`。不是精确地图，属于示意型可视化。

---

### AI情报页

路径：`/intelligence`

完成度：`70%`

用途：展示 AI 情报、分类筛选、关键词搜索、治理 Agent 概念化运行空间。

当前状态：可展示，有搜索和分类筛选。内容来自 `intelligence.json`。页面仍残留较强“Agent 系统”叙事，和最新“信托制平台”锚定不完全一致。

---

### 案例库页

路径：`/cases`

完成度：`75%`

用途：展示社区治理案例列表，支持关键词、分类、城市、标签筛选。

当前状态：可用。数据来自 `cases.json`，支持筛选，但筛选状态不进 URL。

---

### 案例详情页

路径：`/cases/[id]`

完成度：`70%`

用途：展示单个案例的治理模式、成果、关键动作、风险提示、提交主体等。

当前状态：可用。静态生成 5 个 mock 案例详情页。

---

### 共建提交页

路径：`/submit`

完成度：`60%`

用途：演示案例、政策线索、城市动态、舆情线索、城市共建申请的提交入口。

当前状态：可填写并显示本地成功状态。没有持久化，没有后端，没有校验服务。

---

### 404 页面

路径：`/_not-found`

完成度：Next.js 默认

用途：缺省错误页。

当前状态：框架默认生成。

## 第三部分：组件盘点

### HomeCommandCenter

功能：首页平台呈现。

被引用页面：`/`

完成度：`75%`

说明：当前最符合“全国信托制社区治理协同平台”定位。主要是静态展示，无复杂交互。

### ParkingConflictFlow

功能：停车纠纷治理 Demo 页面主体。

被引用页面：`/parking-conflict-demo`

完成度：`80%`

说明：当前最完整的真实治理闭环演示组件。

### TrustRulePanel

功能：展示信托制规则提示。

被引用页面：`/parking-conflict-demo`

完成度：`80%`

说明：内容清晰，组件职责单一。

### CaseMatchPanel

功能：展示全国案例匹配建议。

被引用页面：`/parking-conflict-demo`

完成度：`80%`

说明：当前只服务停车 Demo。

### CityRuntimeLayer

功能：全国城市运行网络页面主体。

被引用页面：`/map`

完成度：`70%`

说明：视觉完成度高，但概念层较重，和最新“信托制平台”定位需要后续统一。

### CityNetworkMap

功能：旧版城市网络示意图。

被引用页面：当前未发现页面引用。

完成度：`60%`

说明：可能是早期地图组件遗留。可展示城市点位与城市卡片，但已被 `CityRuntimeLayer` 替代。

### CasesExplorer

功能：案例库筛选与列表。

被引用页面：`/cases`

完成度：`75%`

说明：功能可用，采用本地 state + useMemo。

### IntelligenceExplorer

功能：AI 情报筛选、Agent 运行空间、情报卡片。

被引用页面：`/intelligence`

完成度：`70%`

说明：交互可用，但产品叙事仍偏 AI Agent 平台。

## 第四部分：数据模型盘点

### GovernanceCase / LegacyCaseDto / CaseView

来源：`lib/domain/case.ts`、`data/cases.json`

字段：

- `id`
- `title`
- `city`
- `district`
- `submitter`
- `subjectType`
- `communityType`
- `problem`
- `model`
- `actions`
- `result`
- `risks`
- `tags`
- `publishedAt`
- `status`

用途：案例库、案例详情。

是否实际使用：已使用。

说明：已有 zod 校验和 DTO → Domain → View mapper，但 `CaseView` 仍等同 legacy DTO。

### IntelligenceEntity / LegacyIntelligenceDto / IntelligenceView

来源：`lib/domain/intelligence.ts`、`data/intelligence.json`

字段：

- `id`
- `title`
- `category`
- `region`
- `city`
- `source`
- `summary`
- `tags`
- `publishedAt`
- `url`
- `aiSummaryStatus`

用途：AI 情报页。

是否实际使用：已使用。

说明：已有 server-side repository validation。页面中仍以 view 数据为主。

### RegionEntity / LegacyCityRegionDto / CityRegionView

来源：`lib/domain/region.ts`、`data/cities.json`

字段：

- `id`
- `name`
- `province`
- `caseCount`
- `policyCount`
- `organizationCount`
- `status`
- `latestUpdate`
- `tags`
- `x`
- `y`

用途：地图页、城市运行页。

是否实际使用：已使用。

说明：`x/y` 是展示坐标，不是真实地理坐标。

### SubmissionEntity / LegacySubmissionDto / SubmissionView

来源：`lib/domain/submission.ts`

字段：

- `name`
- `phone`
- `organizationName`
- `organizationType`
- `city`
- `district`
- `submissionType`
- `title`
- `description`
- `relatedUrl`
- `attachmentRefs`
- `consentToPublishAfterReview`
- 衍生字段：`id`、`reviewStatus`、`createdAt`

用途：理论上用于提交数据边界。

是否实际使用：部分使用。

说明：提交页没有调用 repository 或 schema，只做本地表单状态。

### ParkingConflictDemo

来源：`data/parking-conflict-demo.json`

字段：

- `event`
- `aiAssessment`
- `trustRules`
- `matchedCases`
- `collaboration`
- `timeline`
- `outcomePreview`

用途：停车纠纷 Demo 页面。

是否实际使用：已使用。

说明：没有 zod schema，没有 repository，直接 JSON import 到页面。

### Categories

来源：`data/categories.json`

字段：

- `intelligence`
- `cases`
- `identities`
- `submissionTypes`

用途：情报筛选、案例筛选、提交页 select。

是否实际使用：已使用。

### Stats

来源：`data/stats.json`

字段：

- `cityCount`
- `caseCount`
- `todayIntelligence`
- `organizationCount`
- `policyCount`

用途：首页底部 CTA 使用部分 metric；早期首页/地图也使用。

是否实际使用：部分使用。

## 第五部分：平台能力盘点

| 能力 | 当前状态 | 说明 |
|---|---|---|
| 治理事件展示 | 部分实现 | 首页有静态事件，停车 Demo 有完整事件展示。 |
| 停车纠纷闭环展示 | 已实现 | `/parking-conflict-demo` 完成一条 mock 闭环。 |
| 信托制规则展示 | 已实现 | Demo 中有规则提示面板。 |
| 全国案例匹配展示 | 已实现 | Demo 中有 3 个 mock 匹配案例。 |
| 多方协同状态展示 | 已实现 | Demo 中展示物业、社区、街道、业委会、AI 状态。 |
| 治理结果展示 | 部分实现 | Demo 有结果预览，但没有真实状态计算。 |
| 案例库 | 已实现 | 列表、筛选、详情均可用。 |
| AI情报展示 | 已实现 | 情报列表、搜索、分类筛选可用。 |
| AI真实能力 | 未实现 | 无真实 AI API，全部 mock/static。 |
| 地图/城市网络展示 | 部分实现 | 有示意网络，不是真实地图。 |
| 搜索 | 部分实现 | 案例库、情报页支持客户端搜索。 |
| 表单提交 | 部分实现 | 只有本地成功状态，无持久化。 |
| 用户系统 | 未实现 | 无登录、无用户身份。 |
| 权限系统 | 未实现 | 无角色权限。 |
| 后台系统 | 未实现 | 无管理后台。 |
| 数据库 | 未实现 | 仅本地 JSON。 |
| 审核流 | 未实现 | 仅文案上提到审核。 |
| 视频生成能力 | 部分存在 | Remotion/视频脚本存在，但与当前平台 MVP 无直接产品入口。 |

## 第六部分：视觉体系审计

### 色彩体系

当前主色为深色背景 + 灰调青绿色：

- `graphite #0B1110`
- `governance #0E1A17`
- `charcoal #151C1A`
- `civic #4FBDA8`
- `civic-muted #6FAFA2`
- `data white/soft/muted`
- `signal amber/red`

整体色彩统一度较高，已经避免了廉价科技蓝。

### 字体体系

- Sans：Inter + 系统字体 + PingFang SC / Microsoft YaHei
- Mono：IBM Plex Mono / SFMono-Regular / ui-monospace

实际字体依赖没有显式加载，最终取决于本机字体。

### 布局体系

当前存在两套布局：

1. 新首页使用大留白、分屏、低边框平台展示风格。
2. 老页面使用 `pageShell`、`container`、`caseGrid`、`toolBar` 等传统页面结构。

因此全站布局体系不完全统一。

### 组件风格

当前组件风格混合：

- 首页：接近企业级平台官网 / Keynote 风格。
- 停车 Demo：偏深色治理协同展示。
- 地图页 / 情报页：偏城市驾驶舱和 AI Agent 运行空间。
- 案例库 / 提交页：偏传统 SaaS / 后台表单。

### 页面风格判断

当前整体更接近：

`宣传网站 + 治理平台 Demo + 局部 SaaS 后台`

理由：

- 首页已经像平台型官网。
- 停车 Demo 像可信的治理场景演示。
- 地图页和情报页仍像概念化驾驶舱。
- 案例库和提交页是常规业务页面。
- 没有真实工作台、真实账户、真实数据流，因此还不是完整治理平台。

## 第七部分：问题清单

### 架构问题

- `app/globals.css` 超过 3700 行，历史样式、页面样式、组件样式混在一起。
- 当前首页新视觉和旧页面视觉共存在同一个 CSS 文件里，长期会继续膨胀。
- `CityNetworkMap` 似乎未被引用，可能是遗留组件。
- Remotion、视频生成、ElevenLabs、Heygen、content-factory 等资产仍在仓库中，与当前平台产品无直接关系。
- `parking-conflict-demo.json` 没有 schema validation，也没有 repository boundary。
- `SubmissionEntity` 已建模，但提交页没有使用该模型。
- README 描述仍是旧 MVP，和当前“全国信托制社区治理协同平台”不一致。

### 产品问题

- 产品定位刚被重新锚定，但地图、AI情报、案例库、提交页仍有旧定位痕迹。
- 首页讲“平台”，停车 Demo 讲“真实闭环”，但其他页面还没有完全服务“信托制治理协同平台”。
- 停车 Demo 是唯一真正完整的治理闭环，其他场景只是静态标题。
- 没有“平台如何被真实使用”的连续操作路径：从首页到 Demo 有路径，但从 Demo 到提交、案例沉淀、审核公开没有真实闭环。
- 首页展示“治理事件 128”等数字，但这些数字不是从事件数据推导出来。

### 视觉问题

- 首页视觉较克制，但其他页面仍有强烈 dashboard / AI运行空间风格。
- 案例库和提交页偏传统表单/列表，和首页的高级平台感落差明显。
- `globals.css` 中仍保留大量早期“运行态/Agent/意识/结果”等样式，即使首页不再使用。
- 某些页面信息密度和视觉语言不统一。

### 交互问题

- 首页基本是静态展示，只有链接。
- 停车 Demo 无交互，只能观看。
- 案例库和情报页筛选不写入 URL，无法分享筛选状态。
- 提交表单只有本地成功提示，没有数据保存。
- 地图页是示意交互，不是真实地图交互。

### 信息架构问题

- 顶部导航包含“全国地图 / AI情报 / 案例库 / 共建提交”，但首页提出“六大中心”，两者不一致。
- “停车纠纷Demo”直接进入主导航，适合演示，但不像长期产品导航。
- 文档数量极多，且不少是概念治理文档，会干扰后续判断当前真实产品范围。
- 首页 P0 后，旧的“城市意识/Agent/运行空间”文档仍留在仓库中。

## 第八部分：资产清单

### 值得保留的页面

- 首页：当前最能表达平台整体定位。
- 停车纠纷 Demo：当前最完整的真实治理闭环样板。
- 案例库 / 案例详情：已具备基本内容资产价值。
- AI情报页：有信息流和筛选基础，但需要定位收敛。
- 地图页：有全国协同感基础，但需要降低概念化。

### 值得保留的组件

- `HomeCommandCenter`：新首页平台呈现组件。
- `ParkingConflictFlow`：真实 Demo 主组件。
- `TrustRulePanel`：信托制规则表达清晰。
- `CaseMatchPanel`：案例复用表达清晰。
- `CasesExplorer`：案例库基础功能可用。

### 值得保留的数据内容

- `parking-conflict-demo.json`：目前最贴近真实治理闭环。
- `cases.json`：已有 5 个案例，可作为案例库雏形。
- `intelligence.json`：可支撑 AI情报页演示。
- `cities.json`：可支撑全国协同网络示意。
- `categories.json`：支撑筛选和提交表单。

### 值得保留的设计语言

- 灰调青绿色主色。
- 深色背景 + 大留白 + 克制卡片。
- 首页的 Keynote/Linear/Stripe 式平台表达。

### 需要谨慎处理的资产

- `remotion/`
- `video_build/`
- `video_review/`
- `.tmp/`
- `content-factory/`
- `lib/elevenlabs.ts`
- `lib/heygen.ts`
- `lib/renderVideo.ts`

这些有内容生产价值，但对当前平台产品不是核心运行资产。

## 第九部分：平台判断

当前项目最像：

`宣传网站 + 治理平台 Demo`

次接近：

`案例平台`

不太像：

- 物业系统
- 完整治理平台
- 完整 AI 平台
- 完整 SaaS 后台

原因：

- 首页现在明确像一个平台展示入口。
- 停车 Demo 能讲清一个真实治理闭环。
- 案例库和情报页有内容平台基础。
- 但没有真实用户、权限、数据库、审核流、事件处理流和后台，所以还不是可运营的治理平台。
- 也没有真实 AI 调用，所以不是完整 AI 平台。

## 第十部分：下一步建议

以下只基于审计结果，不涉及本轮代码修改。

### 最应该保留什么

- 当前 P0 首页方向：它最清晰表达平台。
- `/parking-conflict-demo`：它是当前唯一能说明“平台如何处理真实问题”的样板。
- `parking-conflict-demo.json`：它是当前最有产品价值的 mock 数据。
- 案例库和案例详情基础结构。
- 灰调青绿色、深色、克制留白的视觉方向。
- 已有 domain/repository 的轻量校验边界。

### 最应该删除什么

先不要直接删除，但从产品主线看，最不应该继续占据平台注意力的是：

- 大量“城市意识 / 文明 / Agent / 宇宙化”概念文档。
- Remotion、视频、音频、Heygen、ElevenLabs 等与当前平台展示无关的运行资产。
- 未引用的旧组件，如疑似遗留的 `CityNetworkMap`。
- 首页旧阶段遗留在 `globals.css` 中的大量未用样式。

### 最应该重构什么

- `app/globals.css`：需要拆分或清理，否则视觉和维护成本会继续失控。
- 产品信息架构：顶部导航、首页六大中心、现有页面之间不一致。
- `parking-conflict-demo` 数据边界：应补 schema/repository，但当前审计阶段不处理。
- 提交页：当前只是表单演示，没有接入 submission domain。
- AI情报页：需要从 Agent 概念页收敛为“信托制治理情报中心”。
- 地图页：需要从抽象运行空间收敛为“全国信托制治理协同网络”。

## 结论

现在到底有什么：

- 一个较完整的平台展示首页。
- 一个较完整的停车纠纷信托制治理闭环 Demo。
- 一个可用的案例库与案例详情。
- 一个可用的 AI 情报展示页。
- 一个示意型全国协同网络页。
- 一个本地状态提交页。
- 一批 mock JSON 数据。
- 一批历史治理/视觉/视频文档与资产。

现在到底缺什么：

- 真实数据。
- 真实 AI。
- 真实事件流。
- 数据库。
- 审核后台。
- 用户与权限。
- 持久化提交。
- 统一后的产品信息架构。
- 全站一致的信托制平台语言。

现在到底像什么：

- 当前最像“全国信托制社区治理协同平台的宣传型 MVP + 一个真实治理闭环 Demo”。
- 还不是正式治理操作系统。
