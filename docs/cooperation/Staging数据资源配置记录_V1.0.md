# Staging 数据资源配置记录 V1.0

## 1. 记录结论

| 字段 | 结果 |
|---|---|
| 任务 | Codex No.029.1（继续执行） |
| 配置日期 | 2026-08-07 |
| Staging 应用 | `xintuozhiwuye-cooperation-staging` |
| Vercel Project ID | `prj_SdUxdaDVCZIQZLMv1KKyzBYHrJFs` |
| Supabase 资源名 | `xintuozhiwuye-cooperation-staging-db` |
| Vercel Resource ID | `store_X4c2aavq53SgFdjb` |
| Supabase Project Ref | `aoenetwpbruvhrnxpqbv` |
| 区域 | Tokyo, Japan（`ap-northeast-1` / `hnd1`） |
| 计划 | Supabase Free Plan |
| 最终状态 | `READY` |

## 2. 环境隔离

- 数据资源仅连接独立 Vercel Staging 项目，未连接正式官网项目。
- 数据库与身份变量仅注入 Vercel `Preview` 环境；未写入 Production 环境。
- 最终 Release Candidate 仍受 Vercel Deployment Protection 保护，不绑定生产域名。
- 未修改生产 DNS、正式域名、生产数据库或 `main` 分支。
- Sites D1 继续作为历史源，Staging PostgreSQL 只接收迁移副本与测试写入。

## 3. 数据库连接

应用使用 PostgreSQL 连接池。优先读取 `COOPERATION_DATABASE_URL`，并保留
`POSTGRES_URL` 与 `POSTGRES_URL_NON_POOLING` 兼容项。数据库连接启用 TLS，移除连接串中的弱
`sslmode=require` 覆盖后，以 Supabase Root 2021 CA 执行证书链和主机名校验。

证书信息：

| 项目 | 值 |
|---|---|
| 根证书主体 | `CN=Supabase Root 2021 CA` |
| SHA-256 指纹 | `80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA` |
| 有效期 | 2021-04-28 至 2031-04-26 |
| Vercel Secret | `SUPABASE_DB_CA_CERT`（Sensitive） |

不得使用 `rejectUnauthorized=false` 或明文数据库连接替代该配置。

## 4. 环境变量与 Secrets

以下变量已存在于 Preview；本记录只登记名称和用途，不记录值：

| 类型 | 变量 | 管理要求 |
|---|---|---|
| 公开配置 | `NEXT_PUBLIC_SUPABASE_URL` | 仅 Preview |
| 公开配置 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 仅 Preview，最小权限 |
| 敏感 | `COOPERATION_DATABASE_URL` | Sensitive，服务端使用 |
| 敏感 | `POSTGRES_URL*` / `POSTGRES_PASSWORD` | Sensitive，不得进入日志 |
| 敏感 | `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` | Sensitive，仅管理操作 |
| 敏感 | `SUPABASE_JWT_SECRET` | Sensitive，不得下发浏览器 |
| 敏感 | `SUPABASE_DB_CA_CERT` | Sensitive，服务端证书校验 |

一次性 `COOPERATION_MIGRATION_TOKEN` 已在验证完成后从 Preview 删除；临时迁移端点和安全探针也已从最终构建移除。

## 5. 应用与数据资源对应关系

```text
Vercel Preview
xintuozhiwuye-cooperation-staging
        ↓ Preview-only environment variables
Supabase Staging
aoenetwpbruvhrnxpqbv
        ├── PostgreSQL cooperation_* tables
        └── Supabase Auth + TOTP MFA
```

最终 Preview：`https://xintuozhiwuye-cooperation-staging-6thxz88rf-yanghuirong1.vercel.app`

