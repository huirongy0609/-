# 阿里云 Production Candidate 部署包

本目录只描述候选环境，不授权生产域名或真实数据。

## 本次候选资源

- ECS：`i-2ze3pfv8exzmja2z3djk`，华北 2（北京）；
- RDS：`pgm-2zeq84bw32bwouou`，PostgreSQL 16；
- 数据库：`trust_property`；
- 应用账号：`trust_app`；迁移账号：`trust_admin`。

任何密码、OIDC Client Secret 和证书私钥均不得进入 Git 或命令回显。

## Workbench 部署

部署人在 ECS Workbench 中执行，Codex 根据脱敏回显验收。正式 DNS、正式数据、`main` 分支和 Staging 均不在本操作范围内。

```bash
cd /opt/trust-property-cooperation
cp deploy/alicloud/production-candidate/environment.example \
  deploy/alicloud/production-candidate/.env.candidate
chmod 600 deploy/alicloud/production-candidate/.env.candidate
mkdir -p deploy/alicloud/production-candidate/secrets
chmod 700 deploy/alicloud/production-candidate/secrets
```

部署人须在 Workbench 内编辑 `.env.candidate`，不得将其内容粘贴到工单或聊天。RDS 根证书保存为 `secrets/rds-ca.pem`，权限为 `600`。

所有 Compose 命令均显式指定候选环境文件：

```bash
cd /opt/trust-property-cooperation/deploy/alicloud/production-candidate
docker compose --env-file .env.candidate -f docker-compose.yml config --quiet
docker compose --env-file .env.candidate -f docker-compose.yml --profile tools run --rm migrate
docker compose --env-file .env.candidate -f docker-compose.yml build app
docker compose --env-file .env.candidate -f docker-compose.yml up -d app
```

## 构建

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://<candidate-host> \
  --tag <acr-registry>/trust-property/cooperation:<commit-sha> .
```

镜像必须以 commit SHA 固定 tag，并记录 image digest。禁止使用可变 `latest` 作为发布依据。

## 运行边界

- ECS 仅从 ACR 拉取已扫描镜像；应用进程使用非 root 用户；
- ALB 健康检查使用 `/api/health/live`，就绪验证使用 `/api/health/ready`；
- RDS 仅接受应用安全组的私网 TLS 连接；
- 环境变量实际值从 KMS/Secrets 注入，不从本文件或镜像注入；
- IDaaS 使用 OIDC 授权码 + PKCE；管理员必须完成 MFA，`sub` 再映射到数据库角色；
- Candidate 使用专用 VPC、RDS、IDaaS 应用、KMS Secret、SLS Project 和 RAM 角色；
- 不导入真实数据，不创建正式业务账号，不绑定正式域名。
- Candidate HTTP 端口只绑定 `127.0.0.1`，使用 Workbench 或 SSH 隧道验收，不开放公网安全组端口。

## 部署前静态检查

```bash
npm run cooperation:candidate:env-check
npm run cooperation:candidate:database-check
npm run cooperation:test
npm run security:test
npx tsc --noEmit
npm audit --omit=dev
```

## 远程验证门槛

只有资源 ID、地域、VPC、安全组、RDS、IDaaS、KMS、SLS、备份 ID、恢复报告、镜像 digest 和测试证据齐全，才能标记 `production_candidate_ready=true`。
