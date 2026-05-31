# State Management Strategy

本文档分析当前 `useState + useMemo` 筛选方案，并定义状态管理演进路径。当前阶段不引入 Redux、Zustand、React Query。

## 1. Current State Model

当前状态全部是局部 UI 状态：

- `CityNetworkMap`: `selectedCity`
- `IntelligencePage`: `category`, `keyword`
- `CasesPage`: `category`, `city`, `tag`, `keyword`
- `SubmitPage`: `submitted`

筛选逻辑通过 `useMemo` 从本地 JSON 派生。

## 2. Current Strengths

- 简单、可读、容易维护。
- 不引入额外依赖。
- 与 MVP mock JSON 数据匹配。
- 没有服务端状态和客户端缓存一致性问题。
- 页面之间没有强共享状态，因此不需要全局 store。
- 对演示场景足够稳定。

## 3. Current Limits

### URL 不可分享

筛选条件存在组件内，刷新或分享链接会丢失。

### SSR/Search Params 未利用

当前筛选只在客户端执行，无法用 URL 直接生成某个筛选状态的页面。

### 数据量上限低

本地数组筛选适合几十到几百条。数据规模增大后，客户端筛选会影响性能。

### 筛选语义分散

`IntelligencePage` 和 `CasesPage` 各自实现过滤逻辑，未来容易出现搜索规则不一致。

### 无提交持久化

`SubmitPage.submitted` 只表示本地 UI 成功，不代表真实 Submission 创建。

## 4. URL State Evolution

下一阶段建议优先演进为 URL State，而不是全局状态。

### Intelligence URL Params

```text
/intelligence?category=policy&keyword=物业治理
```

语义：

- `category`: 情报分类 enum
- `keyword`: 搜索关键词

### Cases URL Params

```text
/cases?method=trust_property&city=常州&tag=财务公开&keyword=公共收益
```

语义：

- `method`: GovernanceMethod id
- `region`: Region id，未来替代 city 字符串
- `tag`: 展示标签
- `keyword`: 搜索关键词

### Benefits

- 可分享、可刷新、可回退。
- 方便后续 SSR 或服务端查询。
- 不需要全局 store。
- 更符合列表页和搜索页的产品语义。

## 5. SSR Compatibility Path

### Current

Client component imports JSON and filters locally.

### Step 1: Parse Search Params at Page Boundary

在页面级读取 search params，将初始筛选条件传给客户端筛选组件。

### Step 2: Extract Pure Filtering Functions

将筛选规则变为纯函数：

- `filterCases(cases, filters)`
- `filterIntelligence(items, filters)`

这样同一逻辑可用于客户端和服务端。

### Step 3: Move Data Loading to Server Boundary

保持 JSON 数据也可以，但让页面服务端组件负责读取数据，客户端组件只负责交互。

### Step 4: Replace JSON Source

未来接入 API 或数据库时，URL params 可以直接映射为查询条件。

## 6. AI Search Future Compatibility

AI 搜索不要一开始替代当前关键词筛选。建议分层：

### Layer 1: Keyword Search

当前 `.includes()` 逻辑，适合 MVP。

### Layer 2: Field-Aware Search

对 title、summary、tags、region、method 分字段加权。

### Layer 3: AI Summary Search

对 Intelligence 的 AI 摘要、政策要点、风险点做语义检索。

### Layer 4: Cross-Entity Search

搜索一次返回：

- Case
- Intelligence
- Region
- GovernanceMethod
- Organization
- Expert

### Compatibility Rule

搜索状态仍应落在 URL：

```text
/search?q=信托制物业&scope=case,intelligence&method=trust_property
```

不要把 AI 搜索结果塞进全局 store。搜索结果应由查询条件派生。

## 7. When Global State Is Needed

当前不需要全局状态。

未来只有出现以下情况才考虑：

- 登录用户身份在多个页面影响权限和展示。
- 跨页面保持待提交草稿。
- 多步骤提交流程跨页面。
- 全局通知中心。
- 城市共建工作台存在复杂协作状态。
- 实时审核队列或多人协作。

即便如此，优先顺序应是：

1. URL State
2. Server State from API
3. Local component state
4. Context for small app-wide concerns
5. External store only when复杂度真实出现

## 8. What Not To Do Now

- 不引入 Redux。
- 不引入 Zustand。
- 不引入 React Query。
- 不为 mock JSON 建缓存层。
- 不把所有筛选状态提升到 layout。
- 不把提交状态伪装成真实数据写入。

## 9. Governance Rule

所有新增列表页必须先回答：

- 筛选条件是否应进入 URL？
- 数据是否可由 URL + source 派生？
- 是否真的需要跨页面共享？

如果答案是否定的，继续使用局部状态。
