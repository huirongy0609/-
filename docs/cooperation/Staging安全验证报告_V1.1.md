# Staging 安全验证报告 V1.1

## 1. 结论

**PASS。** 测试使用真实 Supabase Auth、TOTP MFA、Session、Staging PostgreSQL RBAC 映射和远程应用 API。

## 2. 身份链路

```text
密码登录
→ Supabase Auth 验证
→ TOTP 因子验证
→ AAL2 Session
→ 数据库角色映射
→ 服务端权限判断
→ 追加式审计
```

创建普通用户、审核管理员、超级管理员各 1 个一次性 Staging 身份，三者均完成真实 TOTP 注册与验证。
测试结束后 3 个 Auth 用户和 2 条管理员映射均已删除；未虚构或保留生产管理员身份。

## 3. 测试结果

| 场景 | 预期 | 实际 | 结果 |
|---|---:|---:|---|
| 普通用户登录合作后台 | 403 | 403 | PASS |
| 普通用户调用管理员 API | 401 | 401 | PASS |
| 审核管理员密码登录 | 200 | 200 | PASS |
| 错误 TOTP | 401 | 401 | PASS |
| 正确 TOTP / AAL2 | 200 | 200 | PASS |
| 审核管理员读取线索 | 200 | 200 | PASS |
| 审核管理员执行审核权限 | 200 | 200 | PASS |
| 审核管理员管理角色 | 403 | 403 | PASS |
| 超级管理员管理角色 | 200 | 200 | PASS |
| 超级管理员查看审计 | 200 | 200 | PASS |
| 无 Session 调用管理员 API | 401 | 401 | PASS |
| 伪造 Token 调用管理员 API | 401 | 401 | PASS |
| 登出后复用 Session | 401 | 401 | PASS |
| 未认证后台页面 | 307 登录页 | 307 | PASS |
| AAL2 超级管理员后台页面 | 200 | 200 | PASS |

## 4. 审计完整性

远程审计快照共 15 条：

| 类别 | 成功 | 拒绝 |
|---|---:|---:|
| 密码登录 | 2 | 1 |
| MFA | 2 | 1 |
| 线索读取 | 1 | 4 |
| 审核权限探针 | 1 | 0 |
| 角色管理权限探针 | 1 | 1 |
| 审计查看权限探针 | 1 | 0 |

审计 UPDATE 操作被数据库触发器拒绝，`immutable = true`。最终冒烟测试又产生至少一条未认证拒绝日志；
15 条为执行安全矩阵时的固定快照，不是最终累计上限。

## 5. 临时测试面关闭

- 临时迁移端点：最终 Release Candidate 返回 404。
- 临时安全探针：最终 Release Candidate 返回 404。
- 一次性迁移 Secret：已从 Vercel Preview 删除。
- 一次性身份及本地凭据：已从 Supabase Auth 删除；凭据不进入 Git 或报告。
- Vercel Deployment Protection：保持启用，未为测试降低全站保护。

## 6. 依赖与构建

`npm audit --omit=dev` 复核结果：0 critical、0 high、0 moderate、0 low。合作测试 2/2、既有安全测试 4/4、
TypeScript 校验通过；Vercel 远程生产构建为 READY。

