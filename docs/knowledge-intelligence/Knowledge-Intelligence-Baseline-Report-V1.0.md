# Knowledge Intelligence Baseline Report V1.0

> 历史状态说明：本报告记录 V1 基线时点事实。其中关于建立独立 Question Registry、Answer Layer 的下一步建议已由 Knowledge Studio V2 Baseline 正式取代，不得继续作为实施依据。资产数量和当时测试结果仍保留审计价值。

审计日期：2026-07-25
审计任务：Codex No.028
结论：PASS

## 1. 结论

Knowledge Center V1.0、AI Question Layer V1.0 与 Knowledge Studio 总体设计 V1.0 已按依赖顺序完成去叠加、复核和合并。三个 PR 的最终差异均只包含各自真实变更，合并后的 `main` 已重新完成本地完整测试、Production Build 和实际 HTTP 路由验证。

平台已达到 **Knowledge Intelligence Baseline V1.0**，含义是：

- Knowledge Center 的对象、搜索、Metadata 和公开关系基础可用；
- Question、Answer、Evidence、Citation 的架构边界已经明确；
- Knowledge Studio 的产品、生命周期、关系和发布架构已有正式设计基线；
- JD 继续作为唯一理论 SSOT；
- 未生成新的 Question、Answer、Evidence 或治理正文。

该结论不表示 JD001—JD049 已全部入库，不表示 Question / Answer / Evidence 正式对象已经生产，也不表示 Knowledge Studio 后台已经开发。

## 2. 合并顺序与结果

| 顺序 | PR | 最终 Head | 最终 Base | 最终范围 | CI | Merge Commit |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | #15 Knowledge Center V1.0 | `42519a9feab8800358112f184cb2375e3e5b45d7` | `main` | 18 个 Knowledge Center 文件；另含发布日期真实性最小修正与回归测试 | [run 30160026820](https://github.com/huirongy0609/-/actions/runs/30160026820) success | `ad4a6630e2ff2563a1c1f78859d86f22cf2c186d` |
| 2 | #16 AI Question Layer V1.0 | `8590b16450969e882c8874be8e1315eee738920c` | 最新 `main` | 1 个 Commit，3 份 Question Layer 文档，750 行 | [run 30160127791](https://github.com/huirongy0609/-/actions/runs/30160127791) success | `ebe75dcdde867ae4cce6057ba7d0c58a0180b9ea` |
| 3 | #17 Knowledge Studio V1.0 | `0f8cfd814be4cae8802316700018acd5f299f275` | 最新 `main` | 1 个 Commit，4 份 Studio 文档，958 行 | [run 30160235601](https://github.com/huirongy0609/-/actions/runs/30160235601) success | `154a7c0fbc7d6d9181fa0999332f663638ac8b18` |

三项合并完成时的 `main` Commit：

```text
154a7c0fbc7d6d9181fa0999332f663638ac8b18
```

PR #16 在 #15 合并后重新基于 `main` 只重放 Question Layer Commit；PR #17 在 #16 合并后重新基于 `main` 只重放 Studio Commit。两次均使用 `force-with-lease` 更新远程分支并重新运行 CI，因此最终 diff 不包含已合并前置内容。

## 3. PR #15 复核

### 通过项

- Knowledge Object Schema 增加 `definition`、`chapter`、`legal_basis`、`published_at`、`questions` 等兼容字段；
- 新版 YAML frontmatter 和旧版 JD Markdown 均可读取；
- Questions 进入搜索字段；
- Related Topics 仅从公开对象集合解析 JD；
- Draft 或未登记关系目标不会生成公开链接；
- 未修改已批准 JD 正文；
- 未修改首页、全局样式或无关 UI；
- 新增 Knowledge Center 与 Foundation Engine 回归测试。

### 合并前修正

初次复核发现正式 Foundation 对象的 `approved_at` 以及旧 Markdown 的“批准日期”会被当作 `published_at`，继而可能进入 JSON-LD `datePublished`。批准日期不等于首次公开日期。

修正后：

- 只有显式 `published_at`、`publishedAt` 或“发布日期”可作为发布日期；
- Foundation 正式对象缺少真实发布日期时保持 `null`；
- JSON-LD 不再伪造 `datePublished`；
- 新增 2 项边界回归测试。

## 4. 最终合并状态完整验证

验证基线：

```text
main@154a7c0fbc7d6d9181fa0999332f663638ac8b18
```

所有命令均在最新 `main` 的全新隔离 worktree 中重新执行，没有只引用 PR 原有 CI。

| 验证项 | 命令 / 方法 | 结果 |
| --- | --- | --- |
| TypeScript | `npm exec --offline -- tsc --noEmit --pretty false` | PASS |
| Production Build | 生产环境变量 + `npm run build` | PASS；编译、Lint/类型检查、25 个静态页面生成成功 |
| Knowledge Center | `npm run knowledge-center:test` | PASS，5/5 |
| Foundation Tests | `npm run foundation:test` | PASS，9/9 |
| Beta Tests | `npm run beta:test` | PASS，20/20 |
| GEO Readiness | `npm run geo:readiness-check` | PASS，30/30；仅有未显式设置 Site URL 的环境 WARN |
| GEO Site URL | `npm run geo:site:test` | PASS，5/5 |
| Security | `npm run security:test` | PASS，4/4 |
| Foundation Engine | `npm run foundation:sync` 后 `npm run foundation:engine:validate` | PASS，0 error；3 data notices |
| 搜索索引 | Beta 搜索测试 + Production `/search?q=开放式预算` | PASS；真实命中 JD009 |
| 新旧 Frontmatter | Foundation 与 Knowledge Center 测试 | PASS；YAML 和旧版 blockquote / 正文提取均通过 |
| Draft 不公开 | Beta 测试 + Production JD009 链接抽查 | PASS |
| Related Topics 状态过滤 | Knowledge Center 测试 + Production JD009 抽查 | PASS；JD008 公开链接数为 0 |
| JSON-LD 日期真实性 | 回归测试 + Production JD009 抽查 | PASS；无真实发布日期时不输出 `datePublished` |

### 本地 Production HTTP

测试 Origin：

```text
http://127.0.0.1:3210
```

Metadata 期望 Origin 通过测试环境显式设置为：

```text
https://xintuozhiwuye.com
```

| 路由 | 状态 | 补充验证 |
| --- | --- | --- |
| `/` | 200 | Canonical 正确；JSON-LD 存在 |
| `/knowledge/JD001` | 200 | Canonical 正确；JSON-LD 存在 |
| `/knowledge/JD009` | 200 | 无 JD008 Draft 公开链接；未伪造 `datePublished` |
| `/robots.txt` | 200 | `text/plain` |
| `/sitemap.xml` | 200 | `application/xml` |
| `/feed.xml` | 200 | `application/rss+xml` |
| `/search?q=开放式预算` | 200 | 命中 JD009 |
| `/admin` | 401 | 未认证拒绝 |
| `/admin/knowledge` | 401 | 未认证拒绝 |
| `/api/knowledge-objects` | 401 | 未认证拒绝 |

## 5. 当前知识资产实况

统计权威来源：

- `knowledge/foundation/index.json`；
- 由 Foundation Engine 重新生成的 Registry；
- 正式 Foundation 文件路径；
- 生命周期和 `foundation_ready` 状态。

不以设计文档、Schema 示例、路由承载能力或旧 Draft JSON 代替正式资产。

### JD

| 状态 | 数量 | 对象 |
| --- | --- | --- |
| Approved + Foundation Ready | 7 | JD001、JD002、JD003、JD004、JD005、JD006、JD009 |
| Draft + 非 Foundation Ready | 2 | JD007、JD008 |
| 尚未发现正式文件、批准记录或 Registry 对象 | 40 | JD010—JD049 |

架构已经能够承载 JD001—JD049，但当前实际正式 JD 只有 7 个。不得表述为 49 个 JD 已入库。

### Question / Answer / Evidence

| 对象 | 正式对象数量 | 说明 |
| --- | --- | --- |
| Question | 0 | 只有 Schema 和编号示例，没有 Question Registry 正式对象 |
| Answer | 0 | 只有预留接口，没有标准答案对象 |
| Evidence | 0 | 只有预留接口；不存在正式 Evidence Registry 对象 |

文档中的 `Q000001`、占位字段和对象关系示例属于 Schema 说明，不是知识资产。

### Knowledge Studio

Knowledge Studio 当前仍只有 4 份设计文档：

- Architecture；
- Lifecycle；
- Roadmap；
- Object Relationship Model。

当前不存在 Knowledge Studio 后台页面、数据库、写入服务或 AI Agent。

### Standard 数据通知

Foundation Engine 发现：

- STD-001；
- STD-002；
- STD-003。

三者当前均没有生命周期决定、正式文件路径或 Foundation Ready 状态。它们不属于已发布 Standard；Engine 将其报告为 3 条 data notice，而不是正式资产。

## 6. 架构能力清单

### 已具备

- Foundation Registry 作为正式知识对象权威源；
- approved + Foundation Ready 的当前公开边界；
- 新旧 JD Markdown 兼容读取；
- 定义、章节、法律依据、日期和 Questions 元数据接口；
- Questions 搜索召回；
- Related Topics 的公开状态过滤；
- Draft 隔离；
- Canonical、OpenGraph、Twitter、JSON-LD、Sitemap、RSS 和 robots；
- QID、Question 生命周期、JD 锚定和搜索设计；
- Answer、Evidence、Citation 预留关系；
- Knowledge Studio 的信息架构、统一编辑、生命周期、关系、发布和十万级扩展设计。

### 尚未实现

- 独立 Question Registry；
- Answer / Evidence / Citation 正式对象；
- Question Detail 页面；
- Knowledge Studio 后台；
- Studio 数据库或权威存储迁移；
- Release Manifest 运行时；
- Graph Projection；
- AI 知识生产或问答服务。

## 7. SSOT、占位与虚构内容审计

### 正式层

未发现新增的正式占位 Question、Answer、Evidence 或虚构治理内容。三个 PR 没有修改已批准 JD 正文。

### 兼容层

`data/knowledge-objects.json` 仍保存 3 个早期 MVP Draft：

- `jd-trust-property`；
- `gt-open-budget-checklist`；
- `article-why-knowledge-object`。

它们全部为 Draft，不属于 Foundation 正式对象，也不应覆盖同主题正式 JD。当前公开读取以 Foundation 为准，生产写入保持关闭，因此尚未形成第二个正式 SSOT；但若旧写 API 重新开放，仍存在双 SSOT 风险。

### 文档示例

Question 和 Studio 文档包含明确标记的字段示例、占位符和未来接口。它们没有进入 Registry、搜索正式对象或公开知识页面，不计入资产数量。

## 8. 已知风险

### P0

当前基线无阻止合并或运行的 P0 技术问题。

### P1

1. JD010—JD049 共 40 个对象尚未入库；JD007、JD008 仍为 Draft。
2. Question、Answer、Evidence 正式对象均为 0，Knowledge Intelligence 目前是架构基线而非完整知识问答库。
3. `data/knowledge-objects.json` 旧 Draft 兼容源仍存在，必须持续保持只读和非正式边界。
4. STD-001—STD-003 缺少生命周期决定和正式文件，Foundation Engine 持续报告 data notice。
5. 现有正式 JD 未登记真实 `published_at`；当前正确行为是省略 JSON-LD `datePublished`，后续应由治理流程补齐真实日期。

### P2

1. 当前搜索是运行时字段匹配，不是持久化索引；
2. 法律依据尚未升级为可核验 Evidence / Law 对象；
3. Knowledge Studio 生命周期中的 `published` 与 Release Manifest 仍为设计，当前运行时继续使用 approved + Foundation Ready；
4. Knowledge Studio 的十万级架构尚未经过真实容量验证。

## 9. 下一步建议

1. 先完成 JD007、JD008 的审核决定和 JD010—JD049 的真实入库，不生成占位正文。
2. 对 STD-001—STD-003 作出明确生命周期决定或从候选 Index 中移除无效登记。
3. 建立首批人工审核的 P0 Question Registry；不要自动批量生成。
4. Question 稳定后再批准 Answer Schema 和 Evidence/Citation 治理流程。
5. 保持旧 Knowledge API 生产写入关闭，直到 Studio 单写迁移方案获批。
6. Knowledge Studio 后续实施应从只读 Adapter 和 Schema 校验开始，不直接引入数据库。
7. 为正式 JD 补录真实首次发布日期；不能继续使用批准日期推断。

## 10. Baseline 判定

完成条件逐项结果：

| 条件 | 结果 |
| --- | --- |
| PR #15、#16、#17 按顺序合并 | PASS |
| 每次合并前更新到最新 main | PASS |
| PR 差异无重复继承内容 | PASS |
| 最终 main 完整测试通过 | PASS |
| 基线报告真实反映资产现状 | PASS |
| 未新增虚构知识或正式占位内容 | PASS |

最终结论：

```text
PASS — Knowledge Intelligence Baseline V1.0 已建立。
```

范围声明：

```text
架构与技术基线通过；
知识资产全量建设尚未完成；
Knowledge Studio 仍处于设计阶段。
```
