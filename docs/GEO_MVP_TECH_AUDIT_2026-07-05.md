# GEO MVP 技术审查｜2026-07-05

## 一、网站目录结构

```text
.
├── content/
│   ├── articles/                # 引流文章页与百科源内容
│   ├── books/                   # 图书转化页源内容
│   ├── cases/                   # 案例页源内容
│   ├── city/                    # 城市长尾页源内容
│   ├── courses/                 # 课程/咨询转化页源内容
│   ├── faq/                     # FAQ 问答页源内容
│   ├── knowledge/               # 预留
│   ├── reports/                 # 预留
│   ├── research/                # 预留
│   └── tools/                   # 工具模板页源内容
├── data/
│   ├── index-monitor.csv
│   ├── keyword-page-groups.csv
│   ├── keywords.csv
│   ├── page-quality-audit.csv
│   └── publish-log.csv
├── docs/
│   ├── GEO_DAILY_REPORT_2026-07-05.md
│   ├── GEO_DEPLOYMENT_LOG_2026-07-05.md
│   ├── GEO_MVP_TECH_AUDIT_2026-07-05.md
│   ├── GEO_URL_RULES.md
│   ├── geo-homepage-preview-2026-07-05.png
│   └── security-audit-notes.md
├── scripts/
│   ├── build-site.mjs
│   ├── generate-geo-mvp.mjs
│   ├── generate-keywords.mjs
│   ├── generate-pages.mjs
│   ├── refresh-sitemap.mjs
│   └── update-publish-log.mjs
└── site/
    ├── .vitepress/
    │   ├── config.mts
    │   └── dist/
    │       ├── index.html
    │       ├── robots.txt
    │       ├── sitemap.xml
    │       ├── rss.xml
    │       ├── articles/
    │       ├── assets/
    │       ├── books/
    │       ├── cases/
    │       ├── city/
    │       ├── consulting/
    │       ├── courses/
    │       ├── faq/
    │       ├── tools/
    │       └── wiki/
    ├── public/
    │   ├── robots.txt
    │   ├── rss.xml
    │   └── sitemap.xml
    ├── articles/
    ├── books/
    ├── cases/
    ├── city/
    ├── consulting/
    ├── courses/
    ├── faq/
    ├── tools/
    └── wiki/
```

备注：当前未创建 `site/.vitepress/theme/`，使用 VitePress 默认主题。

## 二、首页效果

首页预览截图：

```text
docs/geo-homepage-preview-2026-07-05.png
```

检查结论：

- 首页布局：VitePress 默认文档布局，左侧为侧边栏，主内容为知识入口。
- 导航栏：已包含首页、百科、资金治理、开放式预算、业主共同基金、案例库、工具模板、常见问答、图书与课程、咨询服务。
- 分类入口：核心入口区已包含百科、资金治理、预算、共同基金、案例、工具、城市、FAQ、图书课程、咨询服务。
- 文章列表：未在首页以卡片列表呈现，目前通过侧边栏和核心入口承接。
- 图书入口：已存在 `/books/fund-governance`。
- 课程入口：已存在 `/courses/trust-property-training`。
- 咨询入口：已存在 `/consulting/`。

审查判断：首页可用于 MVP 上线，但视觉和信息组织仍是文档站形态，不是最终 GEO Growth 首页。

## 三、生成后的静态文件

已执行：

```bash
npm run build
```

结果：

```text
Next.js build passed
✓ Compiled successfully
✓ Generating static pages (39/39)
```

GEO 静态站构建：

```bash
npm run geo:build-site
```

结果：

```text
VitePress build passed
site/.vitepress/dist/
```

静态文件检查：

| 文件 | 状态 |
|---|---|
| 首页 HTML `index.html` | 已生成 |
| CSS `assets/style.*.css` | 已生成 |
| JS `assets/*.js` | 已生成 |
| `sitemap.xml` | 已生成 |
| `robots.txt` | 已生成 |
| `rss.xml` | 已生成 |

本地 HTTP 检查：

| URL | 状态 |
|---|---|
| `/` | 200 |
| `/faq/trust-property-vs-traditional-property` | 200 |
| `/tools/open-budget-template` | 200 |
| `/cases/chengdu-trust-property-case` | 200 |
| `/city/chengdu-trust-property-management` | 200 |
| `/books/fund-governance` | 200 |
| `/robots.txt` | 200 |
| `/sitemap.xml` | 200 |
| `/rss.xml` | 200 |

## 四、部署方案

推荐当前优先选择 GitHub Pages。

原因：

- 当前站点是 VitePress 静态站，`site/.vitepress/dist/` 可直接部署。
- 仓库已存在 GitHub remote。
- GitHub Pages 对静态知识站足够，成本低，部署链路简单。
- 后续可通过 GitHub Actions 自动构建并发布。

Vercel 适合后续阶段：

- 如果需要 preview deployment、团队协作、域名配置和分支预览，Vercel 更方便。
- 当前没有 Vercel CLI，也未检测到 Vercel token。

当前部署阻塞：

```text
GitHub CLI token invalid
git push 返回 Invalid username or token
```

必须人工授权：

```bash
gh auth login -h github.com
```

或配置有 repo 写权限的 GitHub Personal Access Token。

授权后可以自动完成：

- 推送 `site/.vitepress/dist/` 到 `gh-pages`。
- 配置/检查 Pages 分支。
- 访问首页、FAQ、工具、案例、城市、robots、sitemap、RSS。
- 写入部署日志。

## 五、SEO 检查

| 项目 | 当前状态 | 说明 |
|---|---|---|
| Title | 存在 | VitePress 已生成 `<title>` |
| Meta Description | 存在 | 已从 frontmatter 生成 |
| Canonical | 缺失 | 需要新增 head transform 或 theme 扩展 |
| OpenGraph | 缺失 | 需要补 `og:title`、`og:description`、`og:url` |
| JSON-LD | 缺失 | 需要补结构化数据 |
| Breadcrumb | 缺失 | 页面可视有导航，但没有 BreadcrumbList Schema |
| RSS | 存在 | `/rss.xml` |
| Sitemap | 存在 | `/sitemap.xml` |
| robots | 存在 | `/robots.txt` |

结论：基础 SEO 已达 MVP 可访问水平，但 AI 引用增强所需的 Canonical、OG、JSON-LD、Breadcrumb 仍需补齐。

## 六、GEO 检查

| 项目 | 当前状态 | 说明 |
|---|---|---|
| 内链数量 | 已支持 | 每页至少包含百科、工具、案例/城市、图书/课程转化入口 |
| FAQ 区块 | 已支持 | Markdown 页面有 FAQ 文本区块 |
| FAQPage Schema | 未支持 | 需生成 JSON-LD |
| Article Schema | 未支持 | 需生成 JSON-LD |
| Book Schema | 未支持 | 需生成 JSON-LD |
| Course Schema | 未支持 | 需生成 JSON-LD |
| 来源说明 | 已支持 | 页面底部有来源说明 |
| 更新时间 | 已支持 | 页面 frontmatter 与正文有更新时间 |

结论：GEO 内容结构已具备，但机器可读 Schema 尚未实现。

## 七、性能检查

未运行 Lighthouse 正式评分，当前为构建产物预估。

目标分数：

| 项目 | 目标 |
|---|---|
| Performance | 90+ |
| SEO | 85+，补齐 Canonical/OG/JSON-LD 后目标 95+ |
| Accessibility | 90+ |
| Best Practice | 90+ |

当前风险：

- VitePress 默认主题性能较好。
- 首页内容较轻，预计 Performance 可达 90+。
- SEO 会因 Canonical、OG、JSON-LD 缺失被扣分。
- Accessibility 预计较好，但需要 Lighthouse 实测。

## 八、授权前结论

可以进入 GitHub 授权与部署，但建议部署前或部署后立即补：

1. Canonical。
2. OpenGraph。
3. JSON-LD Schema：FAQPage、Article、Book、Course、BreadcrumbList。
4. 首页信息架构升级为 GEO Growth 首页，而不只是文档首页。

当前不应继续生成页面，应先完成部署或 SEO/GEO 结构化数据补强。
