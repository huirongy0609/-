# 正式域名接入前置准备报告 V1.0

## 1. 结论

ENG-028 已完成不依赖域名控制权的代码、配置、测试和操作预案。新域名尚在注册局审核期，本次没有购买域名、修改阿里云 DNS、向 Vercel 绑定新域名或删除现有生产部署。

代码审阅结论为：完成本 PR 合并、在 Vercel 配置管理员密钥并部署后，项目具备进入域名激活窗口的技术条件。正式状态必须以 PR CI、Preview/Production 复验以及域名审核后的 DNS、证书和跳转验收为准。

## 2. 本次完成

- 核心页面主品牌统一为“信托制物业”；“中国信托制物业发展平台”仅保留为项目/正式主体说明。
- Metadata、OpenGraph、Twitter、RSS、WebSite/Organization JSON-LD 复用 `siteName`。
- 知识详情标题使用“{知识对象标题}｜信托制物业”。
- `NEXT_PUBLIC_SITE_URL` 继续作为 Canonical、OpenGraph、JSON-LD、Sitemap、robots、RSS 的唯一站点源。
- 当前生产回退地址仍为 `https://judao.club`，本 Sprint 没有提前切换域名；激活时只需更新 Production 环境变量。
- Googlebot、Bingbot、OAI-SearchBot、ChatGPT-User、PerplexityBot 对公开页面可抓取，`/admin/` 与 `/api/` 禁止抓取。
- GPTBot 未与 OAI-SearchBot 混同；训练抓取策略仍由项目组另行决定。当前通用 `User-agent: *` 规则会允许 GPTBot 访问公开页面，激活前应做一次明确的政策确认。
- 管理页面和知识对象 API 使用服务端管理员鉴权；写能力默认关闭。
- 新增 CSP、HSTS、nosniff、Referrer-Policy、Permissions-Policy 和防嵌入策略。
- 新增自动化域名上线验收脚本及回滚方案。

## 3. 品牌检查范围

| 表面 | 结果 |
| --- | --- |
| 首页、浏览器标题、首页 OpenGraph | 主品牌为“信托制物业” |
| 页眉 | 文字品牌为“信托制物业”；保留聚道机构图形资产 |
| 页脚 | “信托制物业”为主品牌；正式项目名称作为主体说明保留 |
| 详情页 | 标题格式统一；Metadata/JSON-LD 使用主品牌 |
| RSS | Channel 标题使用“信托制物业” |
| 404、搜索 | 继承全局品牌模板，无旧母品牌 |
| AI 相关入口 | 未发现 XinTuo Commons、TrustPM 等新母品牌；现有 AI 功能名称属于功能名称 |
| About | 主标题为“信托制物业”，正式项目名称仅作项目说明 |

## 4. 知识对象抽查

未修改任何批准知识正文。

| 对象 | 发布状态/预期 | 技术检查 |
| --- | --- | --- |
| JD001 | 已发布，200 | 标题、编号、摘要、正文、Canonical、JSON-LD、内链与分享 Metadata 完整 |
| JD003 | 已发布，200 | 同上 |
| JD008 | Draft，404 | 未发布对象未进入公开路由、Sitemap 或 RSS |
| JD009 | 已发布，200；当前最新批准 JD | 同上 |
| JD010 | 未进入正式发布库，404 | 不公开、不进入 Sitemap/RSS |

移动端不引入新布局；沿用现有响应式详情组件。最终视觉抽查必须在 PR Preview 和正式域名各执行一次。

## 5. 环境切换策略

| 环境 | `NEXT_PUBLIC_SITE_URL` |
| --- | --- |
| Local | `http://localhost:3000`，或显式设置 |
| Vercel Preview | 建议留空，由 `VERCEL_URL` 自动生成 Preview Metadata |
| 当前 Production | `https://judao.club` |
| 域名激活后的 Production | `https://xintuozhiwuye.com` |

生产构建和启动必须同时提供 `ADMIN_USERNAME` 与至少 16 位的 `ADMIN_PASSWORD`。`KNOWLEDGE_WRITES_ENABLED` 默认且建议保持 `false`。

## 6. 尚未执行

- 新域名注册局审核。
- Vercel Domains 添加与验证。
- 阿里云 DNS 记录。
- 新域名 HTTPS 证书。
- 六个辅助域名的永久 301。
- Production 环境变量切换和由此触发的正式部署。

这些步骤必须严格按《正式域名 DNS 与 Vercel 配置清单 V1.0》执行，不能把预案写成已完成事实。

## 7. 本地验证记录

- TypeScript：通过。
- Foundation tests：8/8。
- Beta tests：20/20。
- Site URL policy：5/5。
- Authentication security tests：4/4。
- GEO Readiness：30/30。
- Production Build：通过，Next.js 14.2.35，30 个路由项（含 Middleware）。
- 本地 Production HTTP 验收：52 PASS / 1 WARN / 0 FAIL；WARN 仅为按任务边界跳过尚未生效的新域 DNS。
- 已认证管理员访问：200；已认证但 writes=false 的 POST：403。
- 缺少管理员变量：环境校验按预期失败。
- 敏感信息扫描：未发现 GitHub/OpenAI/Slack Token 格式或私钥；命中的两处均为文档占位示例。
