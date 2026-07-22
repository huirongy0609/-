# Production Deployment Audit V1.0

## 1. 审计结论

- 审计对象：中国信托制物业发展平台
- 审计日期：2026-07-22（Asia/Shanghai）
- 目标生产地址：`https://judao.club`
- 已知服务器：`82.156.4.179`
- 上线判断：**NO-GO，当前不应切换为正式生产流量**

当前距离正式上线的主要问题不是“是否再买一台服务器”，而是现有域名、服务器入口、安全边界和发布流程尚未闭环。完成 P0 项目前，不建议向搜索引擎提交站点，也不建议对外宣布上线。

当前 P0 阻塞项：

1. `judao.club` 根域没有 A/AAAA 记录；只有 `www.judao.club` 指向 `82.156.4.179`。
2. 域名请求到达腾讯云后被重定向至 DNSPod `webblock` 页面，需要核实 ICP 备案及腾讯云接入备案状态。
3. 服务器 443 端口不可用，尚无可验证的生产 HTTPS；不能提供目标地址 `https://judao.club`。
4. 服务器 3000 端口直接暴露公网，可绕过 Nginx、域名及未来 TLS 策略。
5. `/admin/knowledge` 无登录控制；知识对象 API 的 POST、PUT、DELETE 无鉴权，可被公网调用并修改本地数据。
6. 生产站点 URL 未形成强制配置：未设置 `NEXT_PUBLIC_SITE_URL` 时会回退到 `https://dev.judao.club`，污染 Canonical、OpenGraph、JSON-LD、Sitemap、RSS 和 robots。
7. 现网版本落后：服务器当前 `/robots.txt`、`/sitemap.xml`、`/feed.xml` 均返回 404，首页也未呈现 GEO Sprint No.001 的完整元数据。
8. 生产依赖审计有 3 个 High、6 个 Moderate 漏洞；其中包括当前 Next.js 14.2.35。上线前需要评估升级或形成明确、可验证的缓解结论。

**服务器判断：暂不建议新增服务器。** 先在腾讯云控制台核实现有实例的 CPU、内存、磁盘余量、地域和备案接入状态。如果现有服务器不低于 2 vCPU / 4 GB RAM / 40 GB SSD，且能完成备案、端口和安全整改，它足以承载当前低写入、内容型 MVP 的初始生产流量。

## 2. 审计范围与方法

本次仅进行只读代码、构建、依赖、DNS 和公网入口检查，并新增本报告；未修改业务功能、元数据、环境变量、服务器或 DNS 配置。

证据范围：

- 当前分支基线：`codex/geo-sprint-001-foundation`，基线提交 `18b5f2e710d55f887585c086fd906b62320af3ff`
- Next.js 主平台：`app/`、`components/`、`lib/`、`public/`、`data/`
- VitePress GEO 站点：`site/`、`content/`、`scripts/generate-geo-mvp.mjs`
- 部署文件：`package.json`、`package-lock.json`、`next.config.mjs`、`.env.example`、`.github/workflows/geo-pages.yml`、`README.md`
- 公网检查：使用公共 DNS 解析器和 HTTP/HTTPS 请求检查 `judao.club`、`www.judao.club`、`dev.judao.club`、`geo.judao.org`、`82.156.4.179`
- 构建验证：`NEXT_PUBLIC_SITE_URL=https://judao.club npm run build`
- 依赖验证：`npm audit --omit=dev --audit-level=high`

注意：当前工作目录存在大量与本审计无关的未提交文件和修改。构建成功只能证明当前工作目录可编译，不能视为可发布、可复现的生产制品。生产发布必须从干净、已合并、已标记的提交重新执行 `npm ci` 和构建。

## 3. 当前发布面判定

仓库内实际存在三个不同的发布面：

| 发布面 | 技术 | 当前默认域名 | 当前状态 | 生产建议 |
| --- | --- | --- | --- | --- |
| 主平台 | Next.js 14 App Router | `dev.judao.club` | 功能最完整；GEO V1 已接入 | 作为 `https://judao.club` 唯一生产主站 |
| GEO 静态站 | VitePress / GitHub Pages | `geo.judao.org`；工作流实际覆盖为 GitHub Pages 地址 | 存在重复内容和独立 Canonical | 上线前明确停用、重定向或并入同域路径 |
| 旧静态站 | `trust-property-site` | `example.com` | 遗留发布物 | 明确排除在生产构建和发布之外 |

正式上线必须先确定唯一权威来源。建议：

- 主域和唯一 Canonical：`https://judao.club`
- `http://judao.club/*`、`http://www.judao.club/*`、`https://www.judao.club/*`：永久 301 到对应的 `https://judao.club/*`
- 不允许 VitePress、GitHub Pages 和主站同时以各自 Canonical 公开同一批内容；否则会分散索引、引用和权重。

## 4. 域名与 GEO 输出审计

### 4.1 硬编码域名清单

对源文件和生成文件进行统计，结果如下：

| 域名 | 数量与位置 | 是否影响生产 | 结论 |
| --- | --- | --- | --- |
| `dev.judao.club` | 共 8 处：`README.md` 3 处、`lib/geo/site.ts` 1 处、既有 GEO 报告 4 处 | `lib/geo/site.ts` 会影响全部 Next.js GEO 输出 | P0：生产环境必须显式配置，后续应取消生产回退值并 fail closed |
| `geo.judao.org` | `content/**/*.md` 82 个文件、`site/**/*.md` 82 个文件、`site/public` 146 次、配置/生成器 2 处，另有文档记录 | 会影响 VitePress Canonical、Sitemap、RSS、robots 和重复内容治理 | P0/P1：上线前决定该发布面的去留并统一域名 |
| `example.com` | `trust-property-site` 遗留配置和生成文件 | 若误部署会产生错误 Canonical | P1：从生产发布范围中明确排除 |

### 4.2 Next.js 主平台输出链路

`lib/geo/site.ts` 已把站点 URL 集中到 `getSiteUrl()`，但当前逻辑为：

```text
NEXT_PUBLIC_SITE_URL
  ↓ 未设置时
https://dev.judao.club
```

以下生产输出均依赖该结果：

| 输出 | 位置 | 当前机制 | 风险 |
| --- | --- | --- | --- |
| Canonical | 页面 metadata | 相对路径结合 `metadataBase` | 缺少生产变量时指向 dev 域名 |
| OpenGraph | 页面 metadata | 统一 metadata 工具生成 | URL 和图片地址受站点根地址影响 |
| Twitter Card | 页面 metadata | 统一 metadata 工具生成 | 图片地址受站点根地址影响 |
| JSON-LD | `lib/geo/metadata.ts` | 生成绝对 URL | 缺少变量时实体 ID 和页面 URL 指向 dev 域名 |
| Sitemap | `app/sitemap.ts` | 通过站点根地址生成 | 缺少变量时整站 URL 错误 |
| robots | `app/robots.ts` | 生成 Host 和 Sitemap 地址 | 缺少变量时爬虫入口错误 |
| RSS | `app/feed.xml/route.ts` | 生成频道和条目绝对 URL | 缺少变量时订阅地址错误 |
| favicon | `app/layout.tsx` | 使用 `/brand/judao-logo-seal.png` | 主平台已具备；需在生产构建后验证 200、类型和尺寸 |

结论：技术上已经实现“一处配置影响全站”，但还没有实现“生产配置缺失即拒绝构建”。在上线准备 Sprint 中应将站点根地址改为服务器侧强校验配置，或者至少在 production build 阶段校验 `NEXT_PUBLIC_SITE_URL=https://judao.club`，不得静默回退到 dev 域名。

### 4.3 VitePress GEO 站点

- `site/.vitepress/config.mts` 使用 `GEO_SITE_URL` 和 `GEO_SITE_BASE_PATH`，但默认值仍为 `https://geo.judao.org`。
- `.github/workflows/geo-pages.yml` 发布时把地址覆盖为 GitHub Pages URL 和 `/-/` base path。
- `content/` 与 `site/` 的大量 frontmatter Canonical 仍硬编码为 `geo.judao.org`。
- `site/public/robots.txt`、`sitemap.xml`、`rss.xml` 是带旧域名的生成文件。
- VitePress 配置未发现明确 favicon 配置。

这意味着仅修改 `GEO_SITE_URL` 不足以完成生产域名切换；必须重新生成内容和公开文件，并验证最终 HTML 中的 Canonical。若 VitePress 不再作为独立生产站，应停止对外索引或实施 301，避免重复内容。

## 5. 环境变量审计

### 5.1 当前变量

| 变量 | 使用范围 | 当前状态 | 缺口 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Next.js 主平台 | 已使用，但未写入 `.env.example`，有 dev 硬编码回退 | P0 |
| `GEO_SITE_URL` | VitePress GEO 站点 | 已使用，有 `geo.judao.org` 回退 | P1；若继续发布则为 P0 |
| `GEO_SITE_BASE_PATH` | VitePress GEO 站点 | 已使用，工作流覆盖为 `/-/` | P1；需按目标发布路径配置 |
| `NODE_ENV` | Next.js 运行模式 | README 中说明；由构建/启动脚本通常自动设置 | 需纳入部署清单和服务配置 |

`.env.example` 当前只记录视频服务相关变量，没有记录网站部署变量。生产 Web 服务若不使用视频渲染，不应复制无关视频 API 密钥。

### 5.2 建议环境矩阵

| 环境 | Next.js | VitePress（仅在继续保留时） |
| --- | --- | --- |
| 开发 | `NEXT_PUBLIC_SITE_URL=http://localhost:3000` | `GEO_SITE_URL=http://localhost:5173`、`GEO_SITE_BASE_PATH=/` |
| 测试 | `NEXT_PUBLIC_SITE_URL=https://staging.judao.club`（需先批准并配置） | 使用测试站真实 URL 和 base path |
| 生产 | `NEXT_PUBLIC_SITE_URL=https://judao.club` | 若并入主域，使用批准后的同域 URL；否则停止索引或明确独立用途 |

`NEXT_PUBLIC_*` 在 Next.js 构建期间会被内联，因此生产 URL 必须在构建阶段提供，不能假定部署后临时修改即可改变已经生成的页面。更稳妥的后续方案是使用仅服务器可见的 `SITE_URL` 并在生产构建和启动时强校验，但该调整不属于本次审计范围。

环境隔离最低要求：

1. 开发、测试、生产使用独立环境文件或部署平台变量，不提交真实 secret。
2. 每个环境从干净提交独立构建；若复用制品，必须确认 URL 不在构建期固化。
3. 构建后自动抽查首页、知识页、robots、sitemap、RSS 中是否只出现目标环境域名。
4. CI 对 `dev.judao.club`、`geo.judao.org`、`example.com` 的生产输出执行禁止列表检查。

## 6. 构建与部署配置审计

### 6.1 当前方式

Next.js 主平台当前可推断的部署方式为：

```text
Git 工作目录 → npm install / npm run build → next start:3000 → Nginx:80/443
```

README 提到 Nginx 和 PM2，但仓库内没有可复现的 Nginx server block、PM2 ecosystem、systemd service、Dockerfile、Compose、Vercel 配置或 Next.js 发布工作流。VitePress 有 GitHub Pages 工作流，但它不部署 Next.js 主平台。

### 6.2 构建验证

执行：

```bash
NEXT_PUBLIC_SITE_URL=https://judao.club npm run build
```

结果：

- Next.js 14.2.35 构建成功。
- TypeScript 检查通过。
- 共生成或识别 46 个页面/路由。
- 首屏共享 JavaScript 约 87.3 kB；各路由首载约 96–151 kB。
- `.next/standalone` 不存在；`next.config.mjs` 未启用 `output: 'standalone'`。

因此：**代码可以完成 production build，但仓库目前没有形成可复现、可回滚、可审计的 production deployment。**

### 6.3 Node.js 版本

- `package.json` 没有 `engines`。
- 仓库没有 `.nvmrc`、`.node-version` 或 `.tool-versions`。
- README 仍写 Node 18+；Node 18 已结束生命周期。
- GEO Pages 工作流使用 Node 20；截至审计日 Node 20 已结束生命周期。
- 本机审计环境为 Node 26.0.0，它是 Current 线，不应作为当前生产默认基线。

建议在上线准备 Sprint 中固定 Node 22 LTS，并在本地、CI、服务器保持一致；若选择 Node 24 LTS，应先完成兼容性验证。生产应使用 Active LTS 或 Maintenance LTS，而非 EOL 或 Current 版本。

### 6.4 输出、静态资源与运行时文件

- Next.js 输出目录为默认 `.next/`。
- 当前 `.next/` 含构建缓存，约 431 MB；不可直接把整个本地目录视为最小发布制品。
- 当前 `node_modules/` 约 849 MB，Remotion 相关依赖显著增加安装、构建和安全审计范围。
- 当前 `public/` 约 49 MB；包含图片、音频和视频资产。上线前应从干净 Git 提交重新核算，而不是以存在大量未跟踪文件的工作目录为准。
- 多个页面和 API 在运行时通过 `process.cwd()` 读取 `data/`、`foundation/`、`knowledge/` 等仓库文件。当前非 standalone 部署必须携带完整所需目录和 production dependencies。
- `next.config.mjs` 的 output tracing 包含部分 `config/`、`foundation/`、`knowledge/`，但没有覆盖所有运行时数据目录。若后续启用 standalone/container，需要针对 `data/**` 和实际读取路径做专项打包验证。

### 6.5 现网版本

对 `82.156.4.179:3000` 的只读检查显示：

- 首页返回 Next.js 页面，但标题和元数据对应旧版本。
- `/robots.txt` 返回 404。
- `/sitemap.xml` 返回 404。
- `/feed.xml` 返回 404。

现有进程不能直接视为 GEO Sprint No.001 的生产候选版本。必须从目标合并提交做全新、干净、可记录 SHA 的部署。

## 7. 安全与可运维性缺口

### 7.1 P0：公开写接口

- `app/admin/knowledge/page.tsx` 明确处于无登录状态。
- `app/api/knowledge-objects/route.ts` 暴露无鉴权 POST，并写入 `data/knowledge-objects.json`。
- `app/api/knowledge-objects/[id]/route.ts` 暴露无鉴权 PUT、DELETE。
- robots 中的 `Disallow: /admin`、`Disallow: /api` 只是爬虫建议，不是访问控制。

上线前必须二选一：

1. 快速上线方案：在 Nginx/防火墙层禁止公网访问 `/admin`，并禁止非公开 API 的写方法或整个管理 API；应用仅作为只读内容站运行。
2. 完整方案：在独立 Sprint 中增加认证、授权、审计日志和持久化存储。

在该问题解决前，平台不可正式上线。

### 7.2 P0：公网端口

`82.156.4.179:3000` 当前可直接从公网访问。上线前必须：

- Next.js 仅监听 `127.0.0.1:3000` 或私网地址。
- 腾讯云安全组和主机防火墙仅向公网开放 80、443，以及受限来源的运维端口。
- 所有用户流量经过 Nginx，实现 Host 校验、TLS、重定向、限流和日志。
- Nginx 默认虚拟主机拒绝未知 Host，避免直接 IP 或伪造 Host 绕过策略。

### 7.3 依赖安全

`npm audit --omit=dev --audit-level=high` 结果：

- High：3
- Moderate：6
- 主要涉及 Next.js 14.2.35、`fast-uri`、`ws`，以及间接依赖链。
- `npm audit fix --force` 提议跨越到 Next.js 16，属于破坏性升级，不应自动执行。

上线前应建立专门修复分支，升级并重新运行构建、路由、元数据和 API 回归。若某项暂不能升级，必须记录具体 advisory、实际可达性、缓解措施、负责人和复查日期。Remotion 当前位于 Web 的 production dependencies；虽然本任务禁止触碰遗留视频区域，后续应把视频构建工具与在线 Web 运行制品隔离，减少安装体积和攻击面。

### 7.4 P1：运维闭环

仓库目前未发现以下生产配置：

- Next.js 自动部署工作流
- 版本化 release 目录与一键回滚
- PM2/systemd 可复现配置
- Nginx 可复现配置
- 健康检查与进程自动恢复
- 日志轮转、错误告警和资源监控
- 数据备份与恢复演练
- 发布后 smoke test

如果快速上线阶段封禁所有写接口，知识数据可继续以 Git 为事实来源；一旦恢复在线写入，本地 JSON 不具备多实例一致性、可靠备份和审计能力，必须迁移到有持久化、备份和权限控制的存储。

## 8. DNS、备案与 HTTPS 审计

### 8.1 2026-07-22 公网快照

| 检查项 | 结果 | 判断 |
| --- | --- | --- |
| `judao.club` A | NOERROR 但无 A 记录 | P0 |
| `judao.club` AAAA | 无记录 | 当前可接受；没有 IPv6 服务时不要添加 |
| `www.judao.club` A | `82.156.4.179`，TTL 600 | 已解析 |
| NS | `dns19.hichina.com`、`dns20.hichina.com` | 正常存在 |
| `dev.judao.club` | NXDOMAIN | 与旧 fallback 不一致 |
| `geo.judao.org` | NXDOMAIN | 与旧 GEO 内容不一致 |
| 域名经 80 访问服务器 | 302 到 DNSPod `webblock` 页面 | P0，疑似备案/接入备案拦截，需控制台确认 |
| 443 | 连接失败/不可用 | P0 |
| 3000 | 公网可直接访问 Next.js | P0 安全缺口 |

腾讯云官方资料说明：中国大陆服务器上的公开网站需完成 ICP 备案；若备案原接入商不是腾讯云，使用腾讯云大陆服务器还需办理接入备案。腾讯云也会对未完成相应备案的域名进行阻断。由于备案状态需要在账号控制台或工信部系统进一步核验，本报告将 `webblock` 判断为高可信线索，而不是最终法律结论。

### 8.2 推荐 DNS 目标状态

```text
@    A      82.156.4.179
www  CNAME  judao.club.
```

也可以让 `www` 继续使用同 IP 的 A 记录，但 CNAME 更便于以后统一切换。上线窗口 TTL 建议保持 600 秒；稳定后可提高。没有配置 IPv6 服务前不要创建 AAAA。

目标重定向：

```text
http://judao.club/*      ┐
http://www.judao.club/*  ├─ 301 → https://judao.club/*
https://www.judao.club/* ┘
```

### 8.3 HTTPS

- 证书需覆盖 `judao.club` 和 `www.judao.club`。
- 先在 DNS 与备案放行后完成 ACME/证书签发，再开放 443。
- Nginx 启用 TLS 1.2/1.3，并设置证书自动续期和到期告警。
- HTTP 到 HTTPS 使用 301；不要让应用同时产生 http 和 https Canonical。
- HSTS 仅在 HTTPS、证书续期和所有必要子域都验证稳定后开启。先使用较短 `max-age`，不要一开始启用 `includeSubDomains` 或 preload。

## 9. 服务器需求审计

### 9.1 判断依据

当前平台的真实负载特征：

- Next.js 内容型平台，当前构建识别 46 个页面/路由。
- 大部分访问为读取和索引，尚无数据库、认证、爬虫或在线 AI 推理服务。
- 部分页面动态读取本地 JSON/Markdown/Foundation 数据。
- 单页首载约 96–151 kB；共享 JS 约 87.3 kB。
- `public/` 含图片、音视频；适合由 Nginx/CDN 缓存。
- 当前 production dependencies 含 Remotion，导致安装和构建资源高于纯内容站。
- 尚无真实并发量、峰值 QPS、带宽和缓存命中率数据，因此高并发只能给出架构级建议，不能据此立即采购。

### 9.2 配置分级

| 等级 | 建议配置 | 适用场景 | 说明 |
| --- | --- | --- | --- |
| 最低推荐 | 2 vCPU / 4 GB RAM / 40 GB SSD / 2–4 GB swap | 初始上线、低并发、单实例 | 4 GB 为同机安装和构建留余量；2 GB 运行可能可行，但当前依赖体积下构建有 OOM 风险，不作为推荐值 |
| 推荐 | 4 vCPU / 8 GB RAM / 80 GB SSD | 日常生产、同机保留多个 release、日志和回滚 | 可运行 Nginx + 1–2 个 Node 进程；上线初期更稳妥 |
| 高并发 | 8 vCPU / 16 GB RAM / 160 GB SSD 起，或两台以上应用实例 + 负载均衡/CDN | 经监控证实单机 CPU、内存或延迟达到扩容阈值后 | 多实例前必须先取消本地写入依赖、统一缓存/持久化，并把静态大文件交给 CDN/对象存储 |

高并发方案不是本阶段采购建议。应先上线监控，记录 CPU、RSS 内存、P95 响应时间、5xx、带宽和磁盘趋势，再决定纵向或横向扩容。

### 9.3 是否需要新增服务器

**当前证据不足以支持新增服务器。** 请先在腾讯云控制台确认现有 `82.156.4.179`：

- 实例地域是否为中国大陆，备案接入是否可完成。
- CPU、RAM、系统盘/数据盘总量与可用空间。
- 操作系统和 Node/Nginx 支持状态。
- 安全组、快照、备份、带宽上限和到期时间。

若满足 2 vCPU / 4 GB / 40 GB、磁盘有至少 20 GB 可用、备案与 443 可解决，则先复用。仅在实例低于最低推荐、已停止维护、无法完成备案接入、带宽不足或监控证实资源瓶颈时，再立项迁移或新增服务器。

## 10. Production Deployment Checklist（按上线顺序）

### 阶段 A：发布决策与合规

- [ ] 确认 `https://judao.club` 是唯一主站和唯一 Canonical。
- [ ] 明确 VitePress/GitHub Pages/旧站的停用、重定向或非索引策略。
- [ ] 在腾讯云和备案系统核实 ICP 备案、腾讯云接入备案状态。
- [ ] 确认网站底部备案号展示要求；上线后按适用要求办理公安备案。
- [ ] 确认现有服务器规格、地域、磁盘、带宽和到期时间。

### 阶段 B：安全与发布候选版本

- [ ] 封禁公网 `/admin` 和知识对象写 API，或完成正式鉴权。
- [ ] 关闭公网 3000；Next.js 仅监听回环/私网地址。
- [ ] 完成 High/Moderate 依赖漏洞处置和回归，不执行未经验证的强制跨版本升级。
- [ ] 固定 Node 22 LTS，并在本地、CI、服务器统一。
- [ ] 从干净、已合并 SHA 执行 `npm ci`、测试和 production build。
- [ ] 记录 release SHA、构建时间、Node/npm 版本和依赖锁文件校验。
- [ ] 准备版本化部署与回滚步骤；保留上一版可运行 release。

### 阶段 C：生产配置与站内验证

- [ ] 构建时设置 `NEXT_PUBLIC_SITE_URL=https://judao.club`。
- [ ] 若保留 VitePress，设置正确的 `GEO_SITE_URL`/`GEO_SITE_BASE_PATH` 并重新生成全部输出。
- [ ] 检查生产制品中不再出现 `dev.judao.club`、`geo.judao.org`、`example.com`。
- [ ] 确认运行时所需 `data/`、`foundation/`、`knowledge/` 等目录已部署。
- [ ] Nginx 只接受批准 Host，并正确传递代理头。
- [ ] 本机逐项验证首页、JD/GT/QA/Article、favicon、Canonical、OpenGraph、Twitter Card、JSON-LD。
- [ ] 本机验证 `/robots.txt`、`/sitemap.xml`、`/feed.xml` 均为 200 且只含生产域名。

### 阶段 D：DNS 与 HTTPS

- [ ] 添加根域 `@ A 82.156.4.179`。
- [ ] 设置 `www` 指向主域或同一 IP。
- [ ] 确认没有错误 AAAA 记录。
- [ ] 开放安全组和主机防火墙的 80/443；运维端口限制来源。
- [ ] 签发并安装覆盖根域和 www 的 SSL 证书。
- [ ] 配置证书自动续期和到期告警。
- [ ] 配置 http、www 到 `https://judao.club` 的单跳 301。
- [ ] 外网验证证书链、TLS、重定向、未知 Host 和直接 IP 行为。

### 阶段 E：上线验收

- [ ] 外网重新验证首页和四类知识页的状态码、Canonical 与 Schema。
- [ ] 验证 robots 未误阻断公开内容，且 admin/API 不可被未授权访问。
- [ ] 验证 Sitemap 中 URL 全部 200、无 dev/geo/example 域名。
- [ ] 验证 RSS 可订阅、favicon 可加载、OpenGraph 图片可抓取。
- [ ] 验证移动端、404、中文 URL、静态资源和缓存。
- [ ] 验证日志、进程自恢复、磁盘、CPU、内存和 5xx 告警。
- [ ] 完成回滚演练并记录负责人。

### 阶段 F：搜索与发现

- [ ] 在 Google Search Console 验证 Domain Property 并提交 Sitemap。
- [ ] 在 Bing Webmaster Tools 验证站点并提交 Sitemap。
- [ ] 检查 Google/Bing 抓取结果和结构化数据错误。
- [ ] 确认 robots 允许 Googlebot、Bingbot 及需要开放的 AI 检索机器人。
- [ ] 观察索引覆盖、重复 Canonical、404、抓取失败和服务器错误。
- [ ] HTTPS 稳定后分阶段启用 HSTS。

## 11. 上线缺口优先级

### P0：必须完成后才能上线

| 缺口 | 完成标准 |
| --- | --- |
| 根域无 A 记录 | `judao.club` 公共 DNS 稳定解析到批准的生产入口 |
| 疑似备案/接入备案拦截 | 域名不再进入 DNSPod webblock；控制台备案状态有记录 |
| 无 HTTPS | 根域和 www 的有效证书、443、自动续期、HTTP 301 全部验证通过 |
| 3000 公网暴露 | 公网不可直连，应用仅由 Nginx/私网访问 |
| admin/API 无鉴权写入 | 未授权用户不能新增、修改、删除知识对象 |
| 生产域名可能回退 dev | production build 缺少站点 URL 时失败，或发布流程强制设置并验证 `https://judao.club` |
| 多发布面 Canonical 冲突 | 明确唯一主站，VitePress/旧站不再制造可索引重复内容 |
| 现网版本过旧 | 从干净目标 SHA 部署；robots、sitemap、RSS 和 GEO 元数据均通过外网验收 |
| 依赖安全高风险 | High 漏洞升级修复或完成经批准、可验证的缓解与风险接受 |

### P1：建议在上线窗口一并完成

- 固定 Node 22 LTS；更新 README、CI 和服务器版本基线。
- 将站点 URL 写入 `.env.example` 和发布操作手册，但不提交真实 secret。
- 建立可复现的 Nginx、PM2/systemd、release、回滚和 smoke test 配置。
- 建立日志轮转、资源/5xx/证书告警和日常备份。
- 从 Web production artifact 中隔离 Remotion/视频构建工具。
- 补充 VitePress favicon；明确 `trust-property-site` 不参与生产发布。
- 完成 Search Console、Bing Webmaster 和 Sitemap 提交。
- 完成备案号展示及适用的公安备案流程。

### P2：上线后优化

- 静态图片、音视频接入 CDN/对象存储并配置长期缓存。
- 关闭 `X-Powered-By` 等非必要技术暴露，补充经过验证的安全响应头。
- HTTPS 稳定后逐步启用 HSTS，再评估 `includeSubDomains` 和 preload。
- 增加独立健康检查端点、合成监控和定期灾难恢复演练。
- 根据真实 P95、并发、带宽和缓存命中率决定多实例和负载均衡。
- 若恢复在线编辑，将本地 JSON 写入迁移至具备认证、审计、备份和并发控制的持久化系统。

## 12. 上线 Go/No-Go 验收门槛

满足以下全部条件后，才建议将状态从 NO-GO 改为 GO：

1. P0 清单全部关闭，并有命令输出、截图或控制台记录。
2. `https://judao.club` 和一个代表性 JD、GT、QA、Article 页面外网返回 200。
3. 根域为唯一 Canonical；www/http 单跳 301；无 dev、geo、example 域名泄漏。
4. robots、sitemap、RSS、favicon 均返回 200；Sitemap URL 抽检无 404。
5. 未授权用户无法访问管理入口或调用写 API；公网 3000 不可达。
6. 生产 release 对应唯一 Git SHA，可在 15 分钟内回滚到上一稳定版本。
7. TLS、证书续期、日志、进程守护、资源和错误告警完成一次演练。

## 13. 下一次上线准备 Sprint 建议范围

建议把下一 Sprint 严格限定为生产准备，不新增业务功能：

1. 统一生产域名与环境校验，清理生产输出中的旧域名。
2. 封闭 admin/API 公网写能力及 3000 端口。
3. 固定 Node LTS，处置依赖漏洞，建立干净构建。
4. 建立 Nginx、服务守护、版本化 release、回滚和 smoke test。
5. 完成 DNS、备案接入、HTTPS 和外网 GEO 验收。
6. 建立最小监控、备份和上线记录。

## 14. 参考依据

- Next.js 自托管说明（建议在应用前设置 Nginx 等反向代理）：<https://nextjs.org/docs/app/guides/self-hosting>
- Next.js 环境变量说明（`NEXT_PUBLIC_` 在构建时内联）：<https://nextjs.org/docs/pages/guides/environment-variables>
- Node.js 发布状态（生产应用应使用 Active LTS 或 Maintenance LTS）：<https://nodejs.org/en/about/previous-releases>
- 腾讯云 ICP 备案接入说明：<https://cloud.tencent.com/document/product/243/97669>
- 腾讯云域名被阻断排查：<https://cloud.tencent.com/document/faq/243/20220>
- 腾讯云大陆服务器未备案域名阻断说明：<https://cloud.tencent.com/document/faq/243/43878>

---

本报告为技术与运维审计，不替代云厂商、备案主管部门或法律合规意见。备案、接入备案和公安备案的最终状态应由项目负责人在对应官方控制台核实并留档。
