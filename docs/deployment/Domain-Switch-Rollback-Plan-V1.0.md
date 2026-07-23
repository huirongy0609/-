# 正式域名切换回滚方案 V1.0

## 1. 触发条件

出现以下任一情况立即回滚：主域证书错误、持续 5xx、DNS 大面积错误、循环跳转、Canonical 指向不可访问域、管理/API 鉴权失效，或验收脚本存在 FAIL。

## 2. 切换前必须记录

- 当前 Vercel Production Deployment ID、Source Commit、Production Alias。
- 切换前 `NEXT_PUBLIC_SITE_URL` 的实际值。
- 六个域名的 Vercel 配置截图/导出。
- 阿里云 DNS 旧记录、TTL 和修改时间。
- 最近一次通过验收的 Vercel Deployment。

## 3. 回滚步骤

1. 在 Vercel 将 Production 回滚/Promote 到最近一次已验证 Deployment；不要删除新部署。
2. 将 Production `NEXT_PUBLIC_SITE_URL` 恢复为切换前记录值，并基于已验证 Commit 重新部署。
3. 在 Vercel 暂停五个辅助域到新主域的跳转，避免新旧规则形成循环。
4. 如故障来自新域绑定，从 Project Domains 中解除新域与当前 Production 的关联；保留域名账户所有权，不删除注册。
5. 在阿里云把新域 DNS 恢复到切换前记录或临时撤销指向 Vercel的记录；只操作已记录的六个目标主机，不影响 MX/TXT/CAA。
6. 保留 `https://judao-club.vercel.app` 作为应急访问入口。它不作为长期 Canonical；对外公告只在项目负责人确认后发布。

## 4. Canonical 保护

- 环境变量和 Deployment 必须成对回滚，禁止只改 DNS 不改 Canonical。
- 恢复后抓取首页、JD001、Sitemap、RSS，确保它们使用同一个可访问站点源。
- 不在 Next.js 路由与 Vercel Domain 两处同时创建相反方向的跳转。
- 清理浏览器永久跳转缓存时使用新的无缓存客户端验证，避免把本地缓存误判为线上循环。

## 5. 回滚验证

```bash
npm run production:verify-current
curl -I https://judao-club.vercel.app/
curl -I https://judao-club.vercel.app/knowledge/jd001
curl -I https://judao-club.vercel.app/robots.txt
curl -I https://judao-club.vercel.app/sitemap.xml
curl -I https://judao-club.vercel.app/feed.xml
```

确认公开路由恢复、Metadata 使用已恢复的站点源、后台/API 仍为 401、写入仍为关闭、安全响应头仍完整。记录故障窗口和回滚完成时间，再由项目负责人决定新的切换时间。
