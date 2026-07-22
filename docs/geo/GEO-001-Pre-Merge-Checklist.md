# GEO Sprint No.001 合并前检查表

## 1. 检查结论

- 检查日期：2026-07-22（Asia/Shanghai）
- 目标 PR：[PR #10 — GEO Sprint No.001](https://github.com/huirongy0609/-/pull/10)
- 当前结论：**暂不直接合并**
- 建议顺序：**PR #6 已合并 → 将 PR #10 retarget 到 `main` → 等待新增 CI 全部通过 → 完成审阅 → 合并 PR #10**

本检查表只用于合并准备。本次不执行 merge、rebase、retarget，不修改 DNS、Vercel 或生产服务器。

## 2. 前置 PR 状态

### First Public Release

| 项目 | 状态 |
| --- | --- |
| PR | [PR #6 — Release v0.1.0 — First Public Release](https://github.com/huirongy0609/-/pull/6) |
| Base / Head | `main` ← `codex/eng-026-first-public-release` |
| 状态 | 已于 2026-07-22 13:03:10 UTC 合并 |
| Head SHA | `268178d904da8ac878a558d3bf2212158c85c699` |
| Merge SHA | `a4c845dba787511d81a583fc1fed837c1d99f1e0` |
| 未合并 Commit | 无；PR #6 的 38 个 commits 已进入 `main` |
| GitHub Review | 未发现正式 Review submission，不能认定为“已完成 GitHub 审阅” |

### GEO Sprint No.001

| 项目 | 状态 |
| --- | --- |
| PR | [PR #10 — GEO Sprint No.001](https://github.com/huirongy0609/-/pull/10) |
| 当前 Base / Head | `codex/eng-026-first-public-release` ← `codex/geo-sprint-001-foundation` |
| 状态 | Open、Draft、可合并；尚未合并 |
| Head SHA（检查时） | `18b5f2e710d55f887585c086fd906b62320af3ff` |
| 未合并 Commit | 2 个 GEO commits 尚未进入 Base / `main` |
| GitHub Review | 未发现正式 Review submission |
| GitHub CI（检查时） | 无 workflow run、无 commit status |

### 正确合并顺序

1. **先合并 PR #6** —— 已完成。
2. **再合并 PR #10** —— 尚未执行；必须先完成本表中的 retarget、CI 和审阅检查。

### 安全的 Base 调整方案（本次不执行）

优先方案是直接把 PR #10 的 Base 从 `codex/eng-026-first-public-release` retarget 为 `main`。PR #6 已合并到 `main`，而 PR #10 以 PR #6 的 head 为开发基线；正常情况下 retarget 后应只保留 GEO Sprint 差异。

执行 retarget 前后必须分别记录并比较：

- changed files 数量；
- commits 数量；
- `git diff main...codex/geo-sprint-001-foundation`；
- 是否出现 PR #6 的 207 个文件被重复带入；
- 是否出现与最新 `main` 的冲突。

若 retarget 后 diff 不干净，才采用备用方案：在干净工作树中从最新 `origin/main` 创建临时备份分支，将 GEO 的两个 commits rebase/cherry-pick 到最新 `main`，验证后使用 `--force-with-lease` 更新原分支。不得使用 `git reset --hard`，不得在当前含大量无关修改的工作区执行历史改写。

## 3. CI 状态

### 审计发现

仓库原有 `.github/workflows/geo-pages.yml`，但它只在以下事件运行：

- push 到 `main`；
- workflow_dispatch；
- 每日 schedule。

该工作流只执行 `geo:stability-check` 并部署 VitePress GitHub Pages，**不会在 PR #10 上运行，也不覆盖 TypeScript、Next.js production build、foundation、beta 和 GEO readiness 检查**。

### 本次最小 CI 补充

新增 `.github/workflows/pr-ci.yml`，对全部 pull request 和手动触发执行：

- [x] `npx --no-install tsc --noEmit --pretty false`
- [x] `npm run foundation:test`
- [x] `npm run beta:test`
- [x] `npm run geo:readiness-check`
- [x] `NEXT_PUBLIC_SITE_URL=https://judao.club npm run build`

CI 使用 Node 22，并只授予 `contents: read`。[GitHub Actions run #29931950208](https://github.com/huirongy0609/-/actions/runs/29931950208) 已完成，全部步骤为 success。

本地同命令组验证结果：TypeScript 通过、Foundation 8/8、Beta 20/20、GEO Readiness 20/20、Next.js production build 通过（46 个路由）。本地结果不能替代 GitHub Actions 状态。

## 4. 域名与发布平台状态

### 权威域名结论

| 项目 | 结论 |
| --- | --- |
| 正式生产域名 | `https://judao.club`（由项目任务、README 和 schema 共同指向；尚未实际可用） |
| Vercel 预览域名 | **未确认**；仓库没有真实 `*.vercel.app` 地址 |
| 当前公开静态地址 | `https://huirongy0609.github.io/-/`，2026-07-22 检查返回 HTTP 200；它是 GitHub Pages，不是已确认的 Vercel Preview |
| `judao.club` DNS | 根域 A/CNAME 均无结果，HTTPS 无法解析 |
| `www.judao.club` DNS | A → `82.156.4.179` |
| `dev.judao.club` DNS | NXDOMAIN / 无 A 记录 |
| `geo.judao.org` DNS | NXDOMAIN / 无 A 记录 |
| Vercel 项目绑定 | **无法确认，且仓库内无绑定证据**：没有 `.vercel/project.json`、没有 `vercel.json`、没有 Vercel CLI，也没有可识别的 Vercel workflow |

Vercel 绑定状态必须由项目负责人在 Vercel Dashboard 的 Project → Settings → Domains / Git 中核实。不能根据域名注册商、DNS 服务商或仓库中的部署说明推断已经绑定。

### 最终 GEO 域名要求

正式发布时，下列输出必须统一使用 `https://judao.club`：

| 输出 | 最终值 |
| --- | --- |
| Sitemap | `https://judao.club/sitemap.xml`，其中每个 `<loc>` 使用 `https://judao.club` |
| Canonical | `https://judao.club` + 当前页面路径 |
| robots Host | `https://judao.club` |
| robots Sitemap | `https://judao.club/sitemap.xml` |
| RSS | `https://judao.club/feed.xml`，频道和条目 URL 使用正式域名 |

当前 Next.js GEO 输出均通过 `getSiteUrl()` 共享同一地址来源；但缺少 `NEXT_PUBLIC_SITE_URL` 时仍会回退到 `https://dev.judao.club`。因此“统一生成机制”已通过，“生产环境安全默认值”尚未通过。

## 5. 环境变量状态

| 检查项 | 状态 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` 统一驱动 Metadata / JSON-LD / sitemap / robots / RSS | 通过 | 统一入口为 `lib/geo/site.ts` |
| PR CI 显式设置生产 URL | 通过（待 Actions 验证） | 新增 workflow 使用 `https://judao.club` |
| `.env.example` 记录站点 URL | 未通过 | 当前只记录视频服务变量 |
| Production 缺变量时拒绝构建/启动 | 未通过 | 当前静默回退 `dev.judao.club` |
| Vercel Production 环境变量 | 未核实 | 需在 Vercel Dashboard 或实际部署平台核实 |
| Vercel Preview 环境变量 | 未核实 | 需先确认 Vercel 项目和 Preview URL |

合并 PR #10 可以建立 GEO 框架，但在 production deploy 前必须完成正式 URL 强校验和部署平台变量配置。

## 6. 合并前功能检查

### Sitemap

- [x] 存在 `app/sitemap.ts`。
- [x] 只收录允许公开的知识对象。
- [x] URL 复用统一 Site URL。
- [x] 本地 production 模式实际请求 `/sitemap.xml` 返回 200，Content-Type 为 `application/xml`，`<loc>` 使用 `https://judao.club`。
- [ ] GitHub Actions production build 后检查输出只含 `https://judao.club`。
- [ ] 正式域名上线后通过 HTTP 请求验证 `/sitemap.xml` 返回 200。

### robots

- [x] 存在 `app/robots.ts`。
- [x] 允许 Googlebot、OAI-SearchBot、ChatGPT-User、PerplexityBot 抓取公开页面。
- [x] robots 的 Host 和 Sitemap 复用统一 Site URL。
- [x] 本地 production 模式实际请求 `/robots.txt` 返回 200，Host 和 Sitemap 使用 `https://judao.club`。
- [ ] GitHub Actions production build 后检查输出只含 `https://judao.club`。
- [ ] 正式域名上线后通过 HTTP 请求验证 `/robots.txt` 返回 200。

### Canonical 与 Metadata

- [x] JD、GT、QA、Article 使用统一 metadata 生成器。
- [x] Canonical、OpenGraph、Twitter Card 与 JSON-LD 复用统一 Site URL。
- [x] BreadcrumbList 使用统一绝对 URL。
- [x] 本地 production 模式实际请求 `/knowledge/JD001` 返回 200；Canonical、OpenGraph、JSON-LD 均使用 `https://judao.club`。
- [x] 本地 production 模式实际请求 `/feed.xml` 返回 200，Content-Type 为 RSS，频道和条目 URL 使用 `https://judao.club`。
- [ ] 在 PR CI / Preview 中抽查四种对象的最终 HTML。
- [ ] 正式部署前确认不存在 `dev.judao.club`、`geo.judao.org` 或 `example.com` 泄漏。

### Approved 发布控制

- [x] 公开列表只返回 Approved，或 Foundation Registry 中同时满足 `approved + foundation_ready` 的对象。
- [x] Draft、Review、Archived 对象不进入公开详情页、sitemap 和 RSS。
- [x] 当前 7 个已批准 JD 可发布；GT、QA、Article 没有批准对象时保持真实空状态。
- [x] 本地 `foundation:test`、`beta:test` 和 `geo:readiness-check` 已在 GEO Sprint 验证通过。
- [ ] 新增 GitHub Actions 对同一控制逻辑复验并显示成功状态。

## 7. GitHub Pages / Vercel 冲突检查

- [ ] 确认 Next.js 是 `https://judao.club` 的唯一正式生产应用。
- [ ] 明确 VitePress GitHub Pages 仅为内部/预览用途，或停止公开部署。
- [ ] 若继续公开 GitHub Pages，为其设置 noindex，且不得生成与正式站竞争的 Canonical。
- [ ] 清理或重新生成仍引用 `geo.judao.org` 的 VitePress frontmatter、sitemap、robots 和 RSS。
- [ ] 在完成发布架构决策前，不把 GitHub Pages 地址提交给搜索引擎。

现有 GitHub Pages 工作流会在 `main` push 后公开部署 VitePress。PR #10 合并会触发该流程，因此重复索引策略必须在正式生产上线前关闭；它不阻止代码框架进入 `main`，但阻止多站点同时作为正式 Canonical 发布。

## 8. 回滚方案

### 合并回滚

1. 合并前记录 `main` 的最后稳定 SHA（至少包含 PR #6 的 merge SHA `a4c845dba787511d81a583fc1fed837c1d99f1e0`）。
2. PR #10 使用普通 GitHub merge 或团队批准的合并策略，保留可识别的 merge commit。
3. 若合并后 CI、路由或 Approved 门禁异常，使用 `git revert` 回退 PR #10 的 merge commit，并通过新 PR 审阅；不得改写 `main` 历史。
4. 重新部署上一稳定 SHA，并验证首页、Topic001、JD001～JD006、JD009、robots、sitemap 和 RSS。

### 部署回滚

- 保留上一版构建产物、环境变量快照和对应 Git SHA。
- 回滚不能把 Draft/Review/Archived 内容重新开放。
- 回滚后重新检查 Canonical、robots 与 Sitemap，避免代码回滚但域名输出仍指向错误环境。

## 9. 合并准入条件

PR #10 只有在以下条件全部满足后才建议从 Draft 转为 Ready 并合并：

- [x] PR #6 已合并。
- [ ] PR #10 Base 已安全 retarget 到 `main`，且 diff 只包含 GEO Sprint 差异。
- [x] Pull Request CI 全部通过。
- [ ] 至少完成一次正式 GitHub Review，无未解决阻断意见。
- [ ] 项目负责人确认 `https://judao.club` 为唯一正式 Canonical。
- [ ] 部署平台已明确 `NEXT_PUBLIC_SITE_URL` 的 Production 值；Preview 值与 Preview 域名一致。
- [ ] GitHub Pages / VitePress 的非正式索引策略已确认。
- [ ] 回滚负责人和上一稳定 SHA 已记录。

## 10. 建议动作

1. 推送本次最小 PR CI 与检查表，使 PR #10 触发 Actions。
2. 将 PR #10 Base 从已合并的功能分支 retarget 到 `main`，复核 changed files 和 commits。
3. 等待 TypeScript、production build、foundation、beta、GEO readiness 全部通过。
4. 完成正式 GitHub Review。
5. 确认正式域名和 Vercel/实际部署平台绑定；不修改 DNS。
6. 满足准入条件后，再决定是否合并 PR #10。
