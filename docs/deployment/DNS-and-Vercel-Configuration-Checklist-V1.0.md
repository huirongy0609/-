# 正式域名 DNS 与 Vercel 配置清单 V1.0

## 1. 目标

- 唯一正式地址：`https://xintuozhiwuye.com`
- 永久跳转来源：
  - `https://www.xintuozhiwuye.com`
  - `https://xintuozhiwuye.cn`
  - `https://www.xintuozhiwuye.cn`
  - `https://xintuozhiwuye.net`
  - `https://www.xintuozhiwuye.net`
- 所有辅助域名使用 HTTP 301 永久跳转，保留路径和查询参数。

## 2. 操作顺序

1. 确认三个域名均完成注册局审核、实名认证状态正常，并记录注册商、DNS 服务商和当前 NS。
2. 合并并部署 ENG-028；先在当前生产地址验证管理员接口已关闭、公开阅读正常。
3. 在 Vercel Project `judao-club` 的 Settings → Domains 中添加六个域名，不选择购买，不更换域名所有权。
4. 将 `xintuozhiwuye.com` 设置为唯一主域；其余五个域名在 Domain → Edit 中设置 `301 Permanent Redirect` 到主域。
5. 对每一张 Vercel Domain 卡片运行/查看 Inspect，抄录该域名实际要求的 A、CNAME 或 TXT 所有权验证记录。
6. 在阿里云 DNS 控制台逐条添加 Vercel 给出的精确记录。先清除同主机记录上的冲突 A/AAAA/CNAME，但不得删除 MX、TXT、CAA 等不相关记录。
7. 等待 Vercel 六张 Domain 卡片均为 `Valid Configuration`，并确认 SSL 证书签发成功。
8. 将 Vercel Production 的 `NEXT_PUBLIC_SITE_URL` 改为 `https://xintuozhiwuye.com`，从最新 `main` 重新执行一次 Production Deployment。
9. 执行 `npm run production:verify-domain`；只有零 FAIL 才结束变更窗口。

## 3. 阿里云 DNS 建议表

Vercel 官方说明：根域通常使用 A 记录，子域使用 CNAME；通用示例值不一定等于项目专属值，必须以添加域名后 Vercel Domain 卡片或 `vercel domains inspect <domain>` 显示的值为准。不得复用 `judao.club` 的旧项目专属 CNAME。

| 域名 | 阿里云主机记录 | 建议类型 | 记录值 |
| --- | --- | --- | --- |
| xintuozhiwuye.com | `@` | A | Vercel 对该域显示的精确 A 值 |
| www.xintuozhiwuye.com | `www` | CNAME | Vercel 对该域显示的精确 CNAME 值 |
| xintuozhiwuye.cn | `@` | A | Vercel 对该域显示的精确 A 值 |
| www.xintuozhiwuye.cn | `www` | CNAME | Vercel 对该域显示的精确 CNAME 值 |
| xintuozhiwuye.net | `@` | A | Vercel 对该域显示的精确 A 值 |
| www.xintuozhiwuye.net | `www` | CNAME | Vercel 对该域显示的精确 CNAME 值 |

如 Vercel 要求 `_vercel` TXT 所有权验证，按 Domain 卡片显示值增加 TXT，验证后是否保留以 Vercel指示为准。TTL 建议切换前设为 600 秒；稳定 48 小时后可恢复为 3600 秒。

参考：

- [Vercel：设置自定义域名](https://vercel.com/docs/domains/set-up-custom-domain)
- [Vercel：部署与域名跳转](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)
- [Vercel：域名故障排查](https://vercel.com/docs/domains/troubleshooting)

## 4. HTTPS 与跳转验收

```bash
dig +short A xintuozhiwuye.com
dig +short CNAME www.xintuozhiwuye.com
curl -I http://xintuozhiwuye.com
curl -I https://xintuozhiwuye.com
curl -I https://www.xintuozhiwuye.com
curl -I https://xintuozhiwuye.cn
curl -I https://www.xintuozhiwuye.cn
curl -I https://xintuozhiwuye.net
curl -I https://www.xintuozhiwuye.net
npm run production:verify-domain
```

主域必须 200，HTTP 必须跳 HTTPS；五个辅助域必须返回 301 且 `Location` 指向 `https://xintuozhiwuye.com` 的同一路径。证书 SAN、有效期和主机名均必须正确，不接受循环跳转或临时 302/307。

## 5. 上线后控制

- Google Search Console 和 Bing Webmaster 添加新域并提交 `/sitemap.xml`。
- RSS 对外地址为 `https://xintuozhiwuye.com/feed.xml`。
- 至少保留 Vercel 默认 Production Alias 作为不公开的应急入口；其 Metadata 仍必须指向正式主域。
- 观察 24–48 小时的 4xx/5xx、证书、DNS 和抓取日志后再降低变更警戒。
