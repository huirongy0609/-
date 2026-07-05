# GEO Growth Engine Stable Operations

## Goal

Keep the GEO independent site continuously buildable, deployable and inspectable.

## Public Site

Default GitHub Pages target:

- Repository: `https://github.com/huirongy0609/-.git`
- Public URL after GitHub Pages is enabled: `https://huirongy0609.github.io/-/`

Future custom domain can replace this with `https://geo.judao.org`.

## Automated Deployment

Workflow:

- `.github/workflows/geo-pages.yml`

Triggers:

- push to `main`
- manual workflow dispatch
- daily schedule at `01:00 UTC` / `09:00 Asia/Shanghai`

Steps:

1. install dependencies with `npm ci`
2. run `npm run geo:stability-check`
3. upload deployment logs as GitHub Actions artifacts
4. deploy `site/.vitepress/dist` to GitHub Pages only when checks pass

## Daily Stability Check

Command:

```bash
npm run geo:stability-check
```

The check runs:

- knowledge asset listener
- GEO generation
- VitePress build
- `sitemap.xml`, `robots.txt`, `rss.xml`
- homepage, FAQ, tools, cases and city page existence
- Title, Meta, Canonical, OpenGraph, JSON-LD and Breadcrumb checks
- internal dead-link check
- forbidden term check

Outputs:

- `docs/deployment-log-latest.md`
- `docs/deployment-log.md`
- `docs/GEO_DAILY_REPORT_YYYY-MM-DD.md`
- `docs/knowledge-asset-listener-report.md`

## Knowledge Asset Intake

Place verified new source assets in:

- `geo-assets/inbox/`

Then run:

```bash
npm run geo:asset-listen
```

The listener registers assets into:

- `data/source-registry.csv`
- `data/asset-index.csv`

It does not rewrite authority content and does not create unconfirmed relations.

## Failure Recovery Rule

If any of these occur, stop content generation first:

- build failure
- deploy failure
- GitHub token invalid
- generated page missing or 404 risk
- sitemap / robots / RSS missing
- forbidden term hit
- dead internal link

Record the failure in `docs/deployment-log-latest.md`, fix the platform issue, then resume GEO content work.
