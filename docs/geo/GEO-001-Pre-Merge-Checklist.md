# GEO Sprint No.001 合并前检查表

## 1. 检查结论

- 检查日期：2026-07-22（Asia/Shanghai）
- 目标 PR：[PR #10 — GEO Sprint No.001](https://github.com/huirongy0609/-/pull/10)
- 当前结论：**合并收口进行中；正式 Review 完成前不合并**
- 建议顺序：**PR #6 已合并 → PR #10 已 retarget 到 `main` → 完成最终 CI 与正式 Review → 由项目负责人决定合并 PR #10**

本检查表用于记录合并收口。PR #10 已安全 retarget 到 `main`；本次未执行 merge 或 rebase，也未修改 DNS、Vercel 或生产服务器。

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
| 当前 Base / Head | `main` ← `codex/geo-sprint-001-foundation` |
| 状态 | Open、Draft、可合并；尚未合并 |
| Head SHA（检查时） | `18b5f2e710d55f887585c086fd906b62320af3ff` |
| 未合并 Commit | 2 个 GEO commits 尚未进入 Base / `main` |
| GitHub Review | 未发现正式 Review submission |
| GitHub CI（检查时） | 无 workflow run、无 commit status |

### 正确合并顺序

1. **先合并 PR #6** —— 已完成。
2. **再合并 PR #10** —— 尚未执行；必须先完成本表中的 retarget、CI 和审阅检查。

### Base 调整结果

PR #10 已从 `codex/eng-026-first-public-release` retarget 到 `main`。Retarget 前后均为 31 个 changed files、5 个 commits、+1203/−314；没有出现 PR #6 的 207 个文件重复回流。

复核结果：

- `git diff main...codex/geo-sprint-001-foundation` 仅包含 GEO Sprint、CI 和审阅准备文件；
- GitHub compare 显示 head ahead 5、behind 3，merge base 为 PR #6 head；
- 本地 `git merge-tree --write-tree origin/main HEAD` 成功，无冲突；
- 没有意外删除或大面积重复变更；
- 因 diff 正常，不需要 rebase 或 cherry-pick。

若最终审阅期间 `main` 再次前进并产生冲突，应在干净工作树中从最新 `origin/main` 创建临时备份分支，只 rebase/cherry-pick GEO 真实 commits，并使用 `--force-with-lease`；不得在当前含大量无关修改的工作区改写历史。

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

当前 Next.js GEO 输出均通过 `getSiteUrl()` 共享同一地址来源。Production 缺少 `NEXT_PUBLIC_SITE_URL` 时使用安全的 `https://judao.club`；不会再生成 `dev.judao.club`。Vercel Preview 在未显式配置且存在 `VERCEL_URL` 时使用对应预览地址；普通非生产环境使用 `http://localhost:3000`。

## 5. 环境变量状态

| 检查项 | 状态 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` 统一驱动 Metadata / JSON-LD / sitemap / robots / RSS | 通过 | 统一入口为 `lib/geo/site.ts` |
| PR CI 显式设置生产 URL | 通过 | workflow 使用 `https://judao.club` |
| `.env.example` 记录站点 URL | 通过 | 示例值为 `https://judao.club`，不含真实密钥 |
| Production 缺变量时的行为 | 通过 | 安全回退 `https://judao.club`，不使用 dev 域名 |
| Vercel Production 环境变量 | 未核实 | 需在 Vercel Dashboard 或实际部署平台核实 |
| Vercel Preview 环境变量 | 代码支持 | 未显式配置时读取 Vercel 自动提供的 `VERCEL_URL`；实际绑定仍需平台核实 |

设置方式：

- 本地：`NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run dev`；未设置时也使用 localhost。
- Vercel Production：Project → Settings → Environment Variables，为 Production 设置 `NEXT_PUBLIC_SITE_URL=https://judao.club` 后重新部署。
- Vercel Preview：优先不设置该变量，让应用读取 `VERCEL_URL`；如需要固定预览域名，可为 Preview 单独设置完整 HTTPS URL。
- 缺少变量：Production → `https://judao.club`；Vercel Preview → `https://<VERCEL_URL>`；普通非生产 → `http://localhost:3000`。
- 显式配置不是有效 HTTP(S) URL 时，构建或启动明确报错。

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

- [x] 确认 Next.js 是 `https://judao.club` 的唯一正式生产应用。
- [x] 推荐 VitePress GitHub Pages 仅作为内部预览用途。
- [ ] 为继续公开的 GitHub Pages 设置 noindex，且不得生成与正式站竞争的 Canonical。
- [ ] 清理或重新生成仍引用 `geo.judao.org` 的 VitePress frontmatter、sitemap、robots 和 RSS。
- [ ] 在完成发布架构决策前，不把 GitHub Pages 地址提交给搜索引擎。

三选一建议：

1. 停用：能彻底消除重复索引，但本任务明确暂不删除或停用。
2. **保留为内部预览并统一 noindex（推荐）**：保留当前审阅入口，同时明确它不是正式发布面；在 `judao.club` DNS/HTTPS 尚未就绪时风险和可逆性最均衡。
3. 重定向到 `https://judao.club`：长期最干净，但应等正式域名、HTTPS 和全部目标路径稳定后再实施，否则会把可用预览重定向到不可达站点。

当前 GitHub Pages 仍可能造成重复内容、重复索引、Canonical 冲突，并使旧页面继续被搜索引擎抓取。推荐方案的 noindex 尚未实施，因此它是生产公开发布前的剩余动作，但不要求在本任务中删除 Pages。

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
- [x] PR #10 Base 已安全 retarget 到 `main`，且 diff 只包含 GEO Sprint 差异。
- [x] Pull Request CI 全部通过。
- [ ] 至少完成一次正式 GitHub Review，无未解决阻断意见。
- [x] 项目负责人确认 `https://judao.club` 为唯一正式 Canonical。
- [x] 代码与文档已明确 Production / Preview / Local 的 Site URL 策略。
- [x] GitHub Pages / VitePress 推荐采用“内部预览 + noindex”。
- [ ] 回滚负责人和上一稳定 SHA 已记录。

## 10. 建议动作

1. 提交生产 Site URL 安全策略、环境说明与测试。
2. 等待最终 GitHub Actions 全部通过。
3. 将 PR #10 从 Draft 改为 Ready for review。
4. 指定正式审阅人并完成 Review；不由本任务自行合并。
5. 生产部署前实施 GitHub Pages noindex，并在实际部署平台核实域名绑定。
