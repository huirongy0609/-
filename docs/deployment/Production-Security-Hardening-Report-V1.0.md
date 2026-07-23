# 生产环境安全加固报告 V1.0

## 1. 审计结论

最新 `main` 审计时存在未鉴权 `/admin`、公开知识对象写 API、无 CSP/HSTS 等 P0 问题。本分支已完成代码层修复，公开阅读路径不受影响。

## 2. 已修复

| 项目 | 处理 |
| --- | --- |
| 管理页面 | Edge Middleware 服务端 HTTP Basic 管理员鉴权；失败返回 401 与 `WWW-Authenticate` |
| Knowledge API | GET/POST/PUT/DELETE 均执行服务端管理员校验，不依赖前端隐藏 |
| 写入能力 | `KNOWLEDGE_WRITES_ENABLED` 默认关闭；即使管理员通过，未显式开启也返回 403 |
| 生产密钥 | 构建和启动前校验 `ADMIN_USERNAME`、`ADMIN_PASSWORD`；缺失或密码少于 16 位直接失败 |
| 默认密码 | 无默认值；`.env.example` 只提供空占位 |
| 安全响应头 | CSP、HSTS、nosniff、Referrer-Policy、Permissions-Policy、X-Frame-Options |
| 框架标识 | 关闭 `X-Powered-By` |
| SEO 私有面 | robots 禁止 `/admin/` 与 `/api/`；Sitemap/RSS 只读批准对象 |

HTTP Basic 仅允许在 HTTPS 后使用。它适合当前单管理员、低频内部入口，不是未来多用户权限系统。Vercel Serverless 文件系统不应作为知识写入持久层，因此正式环境应持续保持 `KNOWLEDGE_WRITES_ENABLED=false`，直至独立的数据写入架构获批。

## 3. 环境变量

| 变量 | Production | 是否敏感 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 当前为 `https://judao.club`；激活后改为新主域 | 否 |
| `ADMIN_USERNAME` | 必填 | 是 |
| `ADMIN_PASSWORD` | 必填，至少 16 位高熵值 | 是 |
| `KNOWLEDGE_WRITES_ENABLED` | `false` | 否 |

密钥只能写入 Vercel Environment Variables，不得写入 Git、PR、日志或报告。每次轮换后重新部署，并立即验证旧凭据失效。

## 4. 依赖审计

执行非破坏性 `npm audit fix` 后：

- Production：`0 Critical / 2 High`。
- 已消除 `fast-uri`、`ws` 和旧 Remotion 兼容版本线内可修复问题。
- 剩余 High 来自 Next.js 14 及其内置 PostCSS；npm 当前仅给出升级 Next.js 16 的强制修复路径。
- 未执行 `npm audit fix --force`，因为 Next.js 14 → 16 属于破坏性升级，必须单独 Sprint 完成路由、Middleware、构建、RSC 与部署回归。

风险判断：站点使用公开 App Router/RSC 路径，DoS/缓存类风险不能宣称“不可利用”；但当前没有 `next/image` 远程模式、未配置 rewrites、未使用 Server Actions、没有自定义 WebSocket 服务，部分通告的具体入口不在当前生产路径。此项作为 P1 上线例外记录，并要求：

1. Vercel 层启用流量/攻击防护和告警；
2. 不开放写入与后台；
3. 单独安排 Next.js 16 兼容升级；
4. 每周重新运行生产依赖审计。

## 5. 尚需在部署环境确认

- Vercel Production 已配置管理员密钥，且日志未打印环境变量。
- `/admin`、`/api/knowledge-objects` 线上未认证均为 401。
- 已认证管理员在 writes=false 时，POST/PUT/DELETE 为 403。
- Vercel 项目没有遗留 Debug Deployment、公开环境变量或未使用后台域名。
- 如启用 Vercel Firewall/Attack Challenge，确认不阻断 Googlebot、Bingbot、OAI-SearchBot 和 PerplexityBot 的公开读取。

## 6. 验证结果

- 鉴权单元测试：4/4。
- 未认证 `/admin`、`/admin/knowledge`、Knowledge API GET/POST：全部 401。
- 正确管理员凭据访问 `/admin`：200。
- 正确管理员凭据且 `KNOWLEDGE_WRITES_ENABLED=false` 时 POST：403。
- 六项安全响应头：本地 Production HTTP 实测全部存在。
- 环境变量缺失失败测试：通过。
- 敏感信息扫描：无真实凭据或私钥。
