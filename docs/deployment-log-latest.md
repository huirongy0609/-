# GEO Deployment Log

Date: 2026-07-05
Status: DEPLOY_BLOCKED

## Checks

- Knowledge asset listener
- GEO generation
- VitePress build
- sitemap.xml / robots.txt / rss.xml
- 首页 / FAQ / 工具页 / 案例页 / 城市页
- Metadata: Title / Meta / Canonical / OpenGraph / JSON-LD / Breadcrumb
- Internal dead links
- Forbidden terms

## Failures

- GitHub push failed: `fatal: could not read Username for 'https://github.com': Device not configured`
- GitHub CLI auth status reports the `huirongy0609` token is invalid. Re-authenticate with `gh auth login -h github.com`.

## Deployment Status

Build and local stability checks passed. Public deployment is blocked by GitHub authentication, not by site generation.

## Raw Log

```text
[2026-07-05T03:56:18.454Z] RUN geo-generate: npm run geo:generate

> community-governance-map-mvp@0.1.0 geo:generate
> node scripts/generate-geo-mvp.mjs

[2026-07-05T03:56:18.704Z] RUN asset-listener: npm run geo:asset-listen

> community-governance-map-mvp@0.1.0 geo:asset-listen
> node scripts/geo-asset-listener.mjs

Detected 0 knowledge asset(s) in geo-assets/inbox.

[2026-07-05T03:56:18.993Z] RUN geo-build-site: npm run geo:build-site

> community-governance-map-mvp@0.1.0 geo:build-site
> node scripts/build-site.mjs


  vitepress v1.6.4

build complete in 5.52s.

- building client + server bundles...
[32m✓[0m building client + server bundles...
- rendering pages...
[32m✓[0m rendering pages...
- generating sitemap...
[32m✓[0m generating sitemap...
```
