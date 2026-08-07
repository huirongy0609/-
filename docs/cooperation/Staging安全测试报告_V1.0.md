# Staging 安全测试报告 V1.0

> 历史阻断记录。本报告已由《Staging 安全验证报告 V1.1》取代。

## 当前结论

**PARTIAL / 尚未闭环。** 应用外层 Vercel SSO 保持启用；通过受控保护绕过令牌执行内部测试。Supabase 身份与数据库未配置，因此真实 MFA、Session、RBAC 和审计远程测试尚不可执行。

## 已执行

| 测试项 | 结果 | 证据 |
|---|---|---|
| Staging 部署保护 | PASS | 未登录公网请求返回 Vercel SSO 302 |
| 受控访问公开登记页 | PASS | `/cooperation/register` 返回 200 |
| 未认证后台页面 | PASS | `/cooperation/admin` 返回 307 至登录页 |
| 未配置身份时 API 默认关闭 | PASS | `/api/cooperation-leads` 返回 503 |
| RBAC 最小权限单元测试 | PASS | 审核管理员不可导出；数据管理员不可审核 |
| 依赖漏洞扫描 | PASS | 生产依赖 0 漏洞 |

## 待远程身份资源建立后执行

| 测试项 | 通过条件 |
|---|---|
| 登录 | 正确账号可进入 MFA；错误账号 401 且写审计 |
| MFA | 未达到 AAL2 不得访问；正确 TOTP 后建立 AAL2 Session |
| Session 失效 | 登出、过期、篡改 Cookie 均返回 401/跳转登录 |
| 越权访问 | `cooperation_reviewer` 导出返回 403；`data_admin` 审核返回 403 |
| API 绕过 | 直接调用列表、导出、审核接口均执行服务端权限判断 |
| 审计完整性 | 成功、拒绝、失败均留痕；UPDATE/DELETE 被数据库触发器拒绝 |
| 敏感信息 | 日志不得含电话、邮箱、微信、密码、TOTP Secret 或 Session Token |

全部待执行项有真实远程证据前，身份安全闭环不得标记 PASS。
