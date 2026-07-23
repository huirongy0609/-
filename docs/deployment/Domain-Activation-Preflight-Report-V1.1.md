# 正式域名接入前置准备报告 V1.1

## 1. 最终结论

**READY FOR DOMAIN ACTIVATION**

ENG-028B 已完成 PR 合并、Vercel Production 环境变量配置、最新 `main` 生产部署、安全复验及 SEO/GEO 复验。自动化生产验收结果为：

```text
PASS=52 WARN=1 FAIL=0
```

唯一 WARN 是按任务边界主动跳过尚未激活的新域名 DNS 与辅助域名跳转检查，不是当前代码或 Production Deployment 故障。除 DNS 激活步骤外不存在关键 FAIL。

本任务没有购买域名、修改阿里云 DNS，也没有向 Vercel 绑定 `xintuozhiwuye.com`、`.cn` 或 `.net`。

## 2. PR #13 合并结果

| 项目 | 结果 |
| --- | --- |
| PR | `#13`，ENG-028：正式域名接入前置准备与生产环境加固 |
| 合并方式 | Squash merge |
| 合并状态 | 已合并 |
| Merge Commit | `baee74c02c4d5ba212430b3d09dd6bcf95e4a267` |
| 合并时间 | 2026-07-23 23:55:20（Asia/Shanghai） |
| GitHub Actions | 通过 |
| 阻塞性 Review | 无 |
| 合并冲突 | 无 |

合并前已检查：

- 未发现硬编码管理员凭据、Token、私钥或真实 `.env` 文件。
- 管理页面和 Knowledge API 均执行服务端鉴权。
- 公开知识页面不属于管理 Middleware 匹配范围。
- Knowledge API 的 GET/POST/PUT/DELETE 均有权限边界。
- 写操作除管理员鉴权外还受 `KNOWLEDGE_WRITES_ENABLED` 独立控制。

## 3. Vercel Production 配置

正确项目为：

```text
yanghuirong1/judao-club
```

已配置为 Production-only 的环境变量：

| 变量 | 状态 |
| --- | --- |
| `ADMIN_USERNAME` | 已配置为非默认、不可猜测用户名 |
| `ADMIN_PASSWORD` | 已配置强随机密码，长度 32，未写入代码、GitHub、报告或日志 |
| `KNOWLEDGE_WRITES_ENABLED` | `false` |
| `NEXT_PUBLIC_SITE_URL` | `https://judao-club.vercel.app` |

当前正式新域名尚未激活，且旧 `judao.club` 根域不可稳定访问，因此现阶段 Canonical 使用可访问的稳定 Vercel Production Alias。域名激活窗口再将 `NEXT_PUBLIC_SITE_URL` 一次性切换为 `https://xintuozhiwuye.com`，不得提前指向不可访问域名。

管理员密码只保存在 Vercel Sensitive Environment Variable 中。首次需要人工登录后台前，应由项目负责人在密码管理器中生成并轮换为本人持有的新强密码；生产写入仍必须保持关闭。

## 4. Production Deployment

| 项目 | 结果 |
| --- | --- |
| Deployment ID | `dpl_GYzjaLzBYMTEePPmuXf7mf1Fs9Jy` |
| Deployment URL | `https://judao-club-admnavxgf-yanghuirong1.vercel.app` |
| Production Alias | `https://judao-club.vercel.app` |
| Source Commit | `baee74c02c4d5ba212430b3d09dd6bcf95e4a267` |
| 创建时间 | 2026-07-24 00:08:24（Asia/Shanghai） |
| Target | Production |
| 状态 | Ready |
| Build | 通过；Next.js 14.2.35；生产鉴权变量校验通过；30 个路由项（含 Middleware） |

Vercel CLI 在上传输出后的最终回执阶段出现一次 `fetch failed`，但随后通过 Deployment ID 独立查询确认部署状态为 `Ready`，稳定 Production Alias 已绑定该 Deployment。

## 5. 正式生产路由复验

目标：

```text
https://judao-club.vercel.app
```

| 路由 | 预期 | 实测 |
| --- | ---: | ---: |
| `/` | 200 | 200 |
| `/knowledge/jd001` | 200 | 200 |
| `/knowledge/jd003` | 200 | 200 |
| `/knowledge/jd008` | 未发布，404 | 404 |
| `/knowledge/jd009` | 200 | 200 |
| `/knowledge/jd010` | 未发布，404 | 404 |
| `/robots.txt` | 200 | 200 |
| `/sitemap.xml` | 200 | 200 |
| `/feed.xml` | 200 | 200 |

JD008 和 JD010 的 404 是批准状态控制的预期结果；二者未进入 Sitemap 或 RSS。

## 6. 后台与 API 安全复验

| 场景 | 实测结果 |
| --- | --- |
| 无凭据访问 `/admin` | 401 |
| 无凭据访问 `/admin/knowledge` | 401 |
| 无凭据 GET `/api/knowledge-objects` | 401 |
| 无凭据 POST `/api/knowledge-objects` | 401 |
| 错误用户名 | 401 |
| 错误密码 | 401 |
| 正确凭据访问后台 | 200 |
| 正确凭据 GET Knowledge API | 200 |
| 正确凭据、writes=false 执行 POST | 403 |
| 正确凭据发送非法 PATCH | 405 |
| 正确凭据、writes=false 发送异常请求体 | 403 |
| 连续三次错误认证 | 每次均为 401 |
| 非管理公开页面 | 200 |

正确凭据和关闭写入的场景在本次相同代码及相同管理员变量的首次 Production Release 上完成实测；随后只修改公开 Site URL 并重新部署。最终 Deployment 再次独立验证了全部未认证边界，结果均为 401。

日志和报告未记录密码、Authorization Header 或其他认证材料。

## 7. 安全响应头

首页与 JD001 均通过以下生产 HTTP 响应头检查：

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options: DENY`

CSP 同时设置 `frame-ancestors 'none'`，管理页面不能被第三方页面嵌套。公开页面、字体、图片和脚本在生产页面抽查中正常加载；未观察到明显浏览器控制台错误。

## 8. SEO/GEO 复验

- 首页 Title、Description 和正文主品牌均为“信托制物业”。
- 首页 Canonical 与 OpenGraph URL 为 `https://judao-club.vercel.app`。
- JD001 Canonical 与 OpenGraph URL 为 `https://judao-club.vercel.app/knowledge/jd001`。
- 首页和 JD001 均存在 JSON-LD 与 Twitter Card。
- Sitemap 和 RSS 均使用当前可访问的 Production Alias。
- Sitemap/RSS 不包含后台、API、草稿或未批准对象。
- robots 明确声明 Googlebot、Bingbot、OAI-SearchBot 和 PerplexityBot，未错误阻止公开知识页面。
- 页面元数据未出现 `dev.judao.club`、`geo.judao.org` 或 `github.io`。
- 页面未出现 `XinTuo Commons`、`TrustPM` 等废弃母品牌。
- 尚未把不可访问的 `xintuozhiwuye.com` 提前写入 Canonical。

## 9. 自动化验收输出

执行：

```bash
node scripts/verify-production-activation.mjs \
  --target https://judao-club.vercel.app \
  --expected-origin https://judao-club.vercel.app \
  --skip-dns \
  --skip-aliases
```

结果：

```text
SUMMARY PASS=52 WARN=1 FAIL=0
```

52 项 PASS 覆盖公开路由、草稿隔离、robots、Sitemap、RSS、Canonical、OpenGraph、Twitter Card、JSON-LD、安全响应头以及后台/API 未认证保护。

## 10. 依赖漏洞处置

当前生产依赖审计：

```text
Critical: 0
High: 2
```

剩余两条 High 路径：

1. `next@14.2.35`
2. `next@14.2.35 -> postcss@8.4.31`

npm 当前提供的自动修复路径会把 Next.js 14 强制升级到 Next.js 16，属于破坏性主版本升级。本 Sprint 未为追求扫描数字归零而执行 `npm audit fix --force`。

影响与缓解：

- 当前无 Server Actions、rewrites、自定义 WebSocket 或远程图片 `remotePatterns`。
- 生产写入关闭，后台/API 均受服务端鉴权保护。
- 生产运行于 Vercel Edge/CDN 边界。
- 仍不能把公开 RSC/缓存/DoS 类风险声明为完全不可利用，需作为 P1 上线例外持续跟踪。
- 单独安排 Next.js 16 兼容升级 Sprint，并在升级前完成 Middleware、App Router、RSC、构建和部署回归。
- 每周重新运行生产依赖审计。

不存在 Critical 漏洞；两项 High 不构成本次域名激活的 P0 阻塞，但必须持续处置。

## 11. 域名激活边界与下一步

本次未修改：

- 阿里云 DNS；
- `xintuozhiwuye.com`、`.cn`、`.net` 的 Vercel Domains；
- 新域名 HTTPS；
- 新域名 301 跳转。

域名注册审核通过后，严格按以下既有文件执行：

- `docs/deployment/DNS-and-Vercel-Configuration-Checklist-V1.0.md`
- `docs/deployment/Production-Launch-Acceptance-Checklist-V1.0.md`
- `docs/deployment/Domain-Switch-Rollback-Plan-V1.0.md`

激活窗口必须先完成 Vercel Domains 配置和 DNS，再把 `NEXT_PUBLIC_SITE_URL` 切换为 `https://xintuozhiwuye.com` 并重新部署；随后运行不带 `--skip-dns`、`--skip-aliases` 的完整验收。

## 12. 验收判定

| 条件 | 结果 |
| --- | --- |
| PR #13 已合并 | PASS |
| Production 部署最新合并代码 | PASS |
| CI 与 Production Build | PASS |
| 后台未认证访问被拒绝 | PASS |
| Knowledge API 未认证访问被拒绝 | PASS |
| 生产写入关闭 | PASS |
| 公开页面正常 | PASS |
| 安全响应头 | PASS |
| SEO/GEO 基线 | PASS |
| Critical 漏洞为 0 | PASS |
| 自动验收除 DNS 外无关键 FAIL | PASS |
| 未修改新域名 DNS/绑定 | PASS |

最终结论：

```text
READY FOR DOMAIN ACTIVATION
```
