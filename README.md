# 中国信托制物业发展平台 Website Beta

judao.club 的 Next.js Website Beta。当前版本进入 Phase 2：Knowledge Publishing，优先交付可运行、可浏览、可搜索、可持续迭代的网站。

## 当前页面

- `/`：Knowledge First 浅色首页，以平台 Logo、定位和搜索为第一视觉，并展示最新 Topic 与热门 Topic。
- `/topics`：Topic 列表，支持关键词、分类和标签筛选。
- `/topics/[slug]`：Topic 阅读页，按 JD、GT、FAQ、LAW、CASE、Research 展示 Topic Index。
- `/search`：基础联合搜索，覆盖 Topic 元数据和已公开 Foundation JD 正文。
- `/about`：平台介绍与 Beta 数据边界。
- `/knowledge`：Foundation 驱动的知识中心。

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS + Platform Design System
- Knowledge Foundation Engine
- Foundation Topic Repository（Registry 为空时自动启用明确标注的 beta fallback）

## 数据边界

正式知识对象来自 Knowledge Foundation Engine，公共页面只展示 `approved` 且 `foundation_ready` 的对象。

当前正式 Website Ready Topic 为 0。Website 的唯一 Topic 数据入口是 `lib/repositories/topics.ts`；正式 Registry 非空时自动使用 Foundation 数据，Registry 为空时才启用 `data/beta-topics.json` 这一明确标注的 `beta_fallback` 演示目录：

- 不代表 Topic 已通过 Architecture Review；
- 不提供 `in_review` 对象的正文链接；
- 已批准 JD 继续链接到 Foundation 详情页；
- 首个经批准的 Topic Release Record 登记后，页面无需修改即可自动退出 fallback；撤回时保留 Registry 记录并自动停止公开。

## 本地开发

环境要求：Node.js 18+，推荐使用当前锁文件对应的 npm 版本。

```bash
npm install
npm run dev
```

浏览器访问：

```text
http://localhost:3000
```

## 验证

```bash
npm run beta:test
npm run foundation:test
npm run foundation:engine:validate
npx tsc --noEmit --pretty false
npm run build
```

## Development 部署

Development 环境不新增基础设施，继续使用当前 Next.js 运行方式：

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://dev.judao.club npm run build
NEXT_PUBLIC_SITE_URL=https://dev.judao.club npm run start
```

默认监听 `3000` 端口。部署服务器可由现有 Nginx 反向代理到该端口，并沿用项目现有 HTTPS、PM2 和发布流程。

建议的 Development 环境变量：

```text
NEXT_PUBLIC_SITE_URL=https://dev.judao.club
NODE_ENV=production
```

发布前必须执行 Beta tests、Foundation validation、TypeScript 和 Production Build。Development 部署不得修改 Topic、Foundation、知识对象或平台标准。

## 当前非目标

Sprint 1 不包含登录、收藏、评论、AI 对话、推荐、权限管理或正式 Topic 发布后台。
