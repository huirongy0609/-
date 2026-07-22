# Production Launch Execution Report V1.0

- 任务：ENG-025｜完成 Vercel 正式生产部署与上线复验闭环
- 执行时间：2026-07-23（Asia/Shanghai）
- 正式域名：`https://judao.club`
- 最终结论：**NO-GO**

## 1. 最新 main 基线

| 项目 | 结果 |
| --- | --- |
| GitHub Repository | `huirongy0609/-` |
| 最新 `main` Commit | `a778a5efb9623abdab9f1d5f67c43f1fd8dce02f` |
| Commit 时间 | 2026-07-22 23:31:24 +08:00 |
| Commit 标题 | `GEO Sprint No.001：建立 GEO 基础框架 V1.0 (#10)` |
| RSS Route | `app/feed.xml/route.ts` 已合入 |
| 首页 JSON-LD | `app/layout.tsx` 已接入 `JsonLd` |
| 知识详情 JSON-LD | `GeoKnowledgeDetail` 与 Breadcrumb 已接入 `JsonLd` |
| robots | `app/robots.ts` 完整 |
| sitemap | `app/sitemap.ts` 完整 |
| Production Site URL | `NEXT_PUBLIC_SITE_URL=https://judao.club` 已存在于 Vercel Production |

生产部署使用单独的 detached clean worktree，固定于上述 `main` SHA。Vercel CLI 只在临时工作树加入本地链接忽略项；应用源代码、路由、内容和构建输入均来自该 `main` Commit，没有夹带 ENG-025 GitHub Pages 变更或原工作区修改。

## 2. Vercel Production Deployment

| 项目 | 结果 |
| --- | --- |
| Vercel Project | `yanghuirong1/judao-club` |
| Project ID | `prj_A8kkvIav1xni7YmrBsksGwlK0tZA` |
| Deployment ID | `dpl_HZmd3qXhCjbnJczMvgHgn12cccty` |
| Deployment URL | `https://judao-club-7n6hmytct-yanghuirong1.vercel.app` |
| Stable Production Alias | `https://judao-club.vercel.app` |
| Target | `production` |
| Status | `Ready` |
| 创建时间 | 2026-07-23 06:58:48 +08:00 |
| Source Commit | `a778a5efb9623abdab9f1d5f67c43f1fd8dce02f` |
| Build Region | Washington, D.C., USA (`iad1`) |
| Build Machine | 2 cores / 8 GB |

Vercel Production 环境变量列表实测包含：

```text
NEXT_PUBLIC_SITE_URL    Encrypted    Production
```

该部署由 `vercel --prod` 创建，不是 Preview Deployment。Vercel 已将 `judao-club.vercel.app` 和目标自定义域名别名关联到新部署；自定义域名仍因外部 DNS 未配置而不可达。

## 3. Vercel 默认生产域名 HTTP 复验

复验入口：`https://judao-club.vercel.app`

| Route | HTTP | Content-Type | 结果 |
| --- | ---: | --- | --- |
| `/` | 200 | `text/html; charset=utf-8` | PASS |
| `/knowledge/JD001` | 200 | `text/html; charset=utf-8` | PASS |
| `/robots.txt` | 200 | `text/plain` | PASS |
| `/sitemap.xml` | 200 | `application/xml` | PASS |
| `/feed.xml` | 200 | `application/rss+xml; charset=utf-8` | PASS |

RSS 已恢复。Feed channel 与知识条目的绝对 URL 均使用 `https://judao.club`。

## 4. Metadata 与 JSON-LD 复验

### 首页

- Title：`共同委托`
- Description：存在且非空
- Canonical：`https://judao.club`
- OpenGraph URL：`https://judao.club`
- Twitter Card：`summary`
- JSON-LD：1 个有效 JSON 文档，包含 Organization 与 WebSite graph
- Vercel URL 污染：0

### `/knowledge/JD001`

- Title：`什么是信托？｜中国信托制物业发展平台`
- Description：存在且非空
- Canonical：`https://judao.club/knowledge/jd001`
- OpenGraph URL：`https://judao.club/knowledge/jd001`
- Twitter Card：`summary`
- JSON-LD：3 个有效 JSON 文档，包含站点、内容与 Breadcrumb 数据
- Vercel URL 污染：0

HTML 中的 JSON-LD 已逐块执行 JSON 解析，全部有效；抽取到的业务 URL 均属于 `https://judao.club`。`https://schema.org` 是 Schema context，不属于域名污染。

## 5. robots 与 sitemap 复验

正式站 `robots.txt`：

- 允许公开页面；
- 禁止 `/api/` 与 `/admin/`；
- 单独声明 Googlebot、OAI-SearchBot、ChatGPT-User、PerplexityBot；
- `Host: https://judao.club`；
- `Sitemap: https://judao.club/sitemap.xml`。

正式站 `sitemap.xml` 返回 200，抽查 `<loc>` 全部以 `https://judao.club` 开头，没有 Vercel 默认域名。

## 6. GitHub Pages 去索引实施

ENG-025 分支将 GitHub Pages 明确改为内部预览环境：

1. Pages 工作流设置 `GEO_PREVIEW_NOINDEX=1`；
2. 所有 Pages HTML 输出 `<meta name="robots" content="noindex,nofollow">`；
3. noindex 模式移除 canonical；
4. noindex 模式移除 `og:url`；
5. noindex 模式禁用 JSON-LD；
6. 删除 Pages sitemap，并使生成器在预览模式不再重新创建；
7. Pages `robots.txt` 输出 `Disallow: /`；
8. GEO stability check 增加反向断言，防止 canonical、OpenGraph URL、JSON-LD 或 sitemap 回归。

本地 Pages production artifact 已验证：

- `noindex,nofollow`：存在；
- canonical：不存在；
- `og:url`：不存在；
- JSON-LD：不存在；
- sitemap.xml：不存在；
- robots.txt：`Disallow: /`。

线上 GitHub Pages 当前仍是旧构建，只有 ENG-025 Draft PR 合并到 `main` 并完成 `GEO Pages Deploy` 后，才能进行真实线上 noindex 验证。本任务不直接合并 Draft PR，也不删除 GitHub Pages。

## 7. DNS 与 HTTPS 当前状态

权威 DNS 核验：

- NS：`dns19.hichina.com`、`dns20.hichina.com`；
- SOA：`hostmaster.hichina.com`；
- 因此当前权威 DNS 服务确属阿里云/万网体系；
- `judao.club` 根域 A：无记录；
- `www.judao.club`：仍指向 `82.156.4.179`。

Vercel Domains 当前再次显示：

- `judao.club`：`Invalid Configuration`；
- `judao-club.vercel.app`：`Valid Configuration`；
- 当前推荐记录：`A` / `@` / `216.198.79.1`。

HTTP/TLS 实测：

- `https://judao-club.vercel.app`：200，HTTPS 正常；
- `http://judao.club`：DNS 无法解析；
- `https://judao.club`：DNS 无法解析，无法验证正式证书；
- `https://www.judao.club`：本轮不作为根域完成证据，仍需后续统一到唯一正式域名。

## 8. 杨老师唯一必须操作的上线步骤

当前唯一阻止 `judao.club` 正式可访问与 HTTPS 验收的 P0 项是根域 DNS。

责任主体：持有阿里云 DNS 管理权限的项目负责人（杨老师或其明确授权人员）。Codex 当前没有阿里云 DNS 授权，因此未声称或尝试修改。

在阿里云控制台执行一次：

1. 打开「云解析 DNS」→「权威 DNS 解析」→ `judao.club` →「解析设置」。
2. 新增记录：记录类型 `A`，主机记录 `@`，记录值 `216.198.79.1`，TTL 建议 `600` 秒或默认值。
3. 如控制台提示根域存在冲突的 A/AAAA/CNAME，先截图并确认，不能盲目覆盖。
4. 保存后无需再进行代码、Vercel 或 GitHub 操作。

`www.judao.club` 当前仍指向旧服务器，属于 P1 唯一域名规范化事项。正式根域可用后，应决定由旧服务器或 Vercel 对 `www` 做 301 到 `https://judao.club`，不得长期提供第二套公开内容。

## 9. DNS 生效后的自动复验

DNS 保存后按以下顺序自动/只读复验：

```bash
dig +short A judao.club @8.8.8.8
curl -I http://judao.club
curl -I https://judao.club
curl -I https://judao.club/knowledge/JD001
curl -I https://judao.club/robots.txt
curl -I https://judao.club/sitemap.xml
curl -I https://judao.club/feed.xml
```

随后抓取首页和 JD001 HTML，再验证：

- HTTP 自动跳转 HTTPS；
- 无证书错误、无循环跳转；
- 最终地址为 `https://judao.club`；
- Canonical、OpenGraph、JSON-LD 不含 Vercel URL；
- robots、sitemap、feed 的绝对 URL 均为 `https://judao.club`。

## 10. 验证汇总

| Check | 结果 |
| --- | --- |
| TypeScript | PASS |
| Foundation Test | PASS，8/8 |
| Beta Test | PASS，20/20 |
| Site URL Test | PASS，5/5 |
| GEO Readiness | PASS，21/21 |
| GitHub Pages noindex stability | PASS |
| Next.js Production Build | PASS，30 个公开/系统路由条目（含动态路由） |
| Vercel Production Build | PASS |
| Vercel Production HTTP | PASS，5/5 |
| RSS | PASS，HTTP 200 |
| JSON-LD | PASS，首页与 JD001 均有效 |
| Canonical / OpenGraph | PASS，统一 `https://judao.club` |
| Root DNS | FAIL，根域无 A 记录 |
| Custom-domain HTTPS | NOT TESTABLE，等待 DNS |

依赖安装时 `npm audit` 报告 4 High、8 Moderate；这是当前 `main` 的既有状态，不由本次无依赖变更引入，也未使用破坏性 `audit fix --force`。该项应继续由独立安全整改任务跟踪。

## 11. 最终结论

**NO-GO**。

Vercel Production Deployment、RSS、JSON-LD、Canonical、OpenGraph 和默认生产别名已经通过。唯一 P0 阻塞项是：

> `judao.club` 根域尚未在阿里云 DNS 添加 `A @ → 216.198.79.1`，因此正式域名及其 HTTPS 无法验证。

杨老师只需完成第 8 节的一次 DNS 操作。DNS 生效并通过第 9 节复验后，结论可改为 `PRODUCTION READY`；在此之前不得对外声称正式上线。
