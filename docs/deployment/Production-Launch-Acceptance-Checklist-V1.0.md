# 正式上线验收清单 V1.0

## A. 合并和部署前

- [ ] PR 仅包含 ENG-028 文件，无用户工作区无关修改。
- [ ] TypeScript、Foundation、Beta、GEO、Security tests、Production Build 全部通过。
- [ ] `npm audit --omit=dev` 为 0 Critical；High 例外已审阅。
- [ ] 敏感信息扫描无真实 Token、密码、私钥、证书。
- [ ] Vercel Production 已设置 `ADMIN_USERNAME`、`ADMIN_PASSWORD`、`KNOWLEDGE_WRITES_ENABLED=false`。
- [ ] 缺少管理员环境变量的构建失败测试通过。

## B. 当前生产部署

- [ ] `/`、`/knowledge/jd001`、`/robots.txt`、`/sitemap.xml`、`/feed.xml` 为 200。
- [ ] JD001、JD003、JD009 可读；JD008、JD010 为 404 且未出现在 Sitemap/RSS。
- [ ] `/admin`、`/admin/knowledge`、`/api/knowledge-objects` 未认证为 401。
- [ ] 未认证 POST 为 401；已认证且 writes=false 的写请求为 403。
- [ ] 所有六项安全响应头存在。
- [ ] 公开阅读的桌面和移动端无回归。

## C. 域名激活

- [ ] 三个域名审核通过。
- [ ] Vercel 六个 Domain 均为 Valid Configuration。
- [ ] 阿里云 DNS 与 Vercel Domain 卡片的精确记录一致，无冲突 A/AAAA/CNAME。
- [ ] 六个域名 HTTPS 证书有效。
- [ ] `NEXT_PUBLIC_SITE_URL=https://xintuozhiwuye.com` 已用于最新 Production Deployment。
- [ ] 五个辅助域 301 到主域并保留路径、查询参数。
- [ ] `npm run production:verify-domain` 输出 0 FAIL。

## D. SEO/GEO

- [ ] 首页 Title/Description 明确“信托制物业”。
- [ ] 知识详情标题为“{标题}｜信托制物业”。
- [ ] Canonical、OpenGraph、JSON-LD、Sitemap、robots Host、RSS 均只使用新主域。
- [ ] Sitemap/RSS 无管理、API、草稿、重复 URL。
- [ ] Googlebot、Bingbot、OAI-SearchBot、PerplexityBot 允许访问公开页面。
- [ ] GPTBot 训练抓取政策完成项目负责人确认。
- [ ] Search Console、Bing Webmaster 已添加新域并提交 Sitemap。

## E. 自动化命令

域名未激活前，本机生产构建可使用：

```bash
ADMIN_USERNAME=local-admin \
ADMIN_PASSWORD='replace-with-a-local-16-plus-character-value' \
KNOWLEDGE_WRITES_ENABLED=false \
NEXT_PUBLIC_SITE_URL=https://xintuozhiwuye.com \
npm run build
```

正式域名激活后执行：

```bash
npm run production:verify-domain
```

脚本检查 DNS、HTTPS、公共路由、未发布对象、robots、Sitemap、RSS、Canonical、OpenGraph、Twitter Card、JSON-LD、安全响应头、后台/API 未认证访问及五个辅助域 301。输出 `PASS/WARN/FAIL`，任何 FAIL 均以非零状态退出。
