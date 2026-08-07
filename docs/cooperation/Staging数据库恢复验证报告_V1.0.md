# Staging 数据库恢复验证报告 V1.0

| 字段 | 结果 |
|---|---|
| 任务 | Codex No.029.1 |
| 日期 | 2026-08-07 |
| 数据库资源 | BLOCKED |
| 第一轮迁移/验证/备份 | NOT RUN（远程资源未创建） |
| 第二轮恢复/再次验证 | NOT RUN（远程资源未创建） |
| 报告结论 | 不通过，等待人工接受 Supabase 服务条款 |

## 已完成准备

- 已建立独立 Vercel Staging 项目，不连接生产域名。
- 已实现 PostgreSQL 六表 schema、追加式不可变审计触发器及 COL 原子序列。
- 已形成 `scripts/cooperation/staging-recovery.mjs`，仅在显式提供
  `--confirm-staging xintuozhiwuye-cooperation-staging` 时运行。
- 恢复程序限定操作六张 `cooperation_*` 表，不删除 Sites D1 源数据，不重置已发 COL。
- 历史源备份仍为 1 条，最大编号 `COL-2026-0001`，期望下一编号 `COL-2026-0002`。

## 计划验证步骤

```text
真实 D1 导出
→ Staging PostgreSQL 建表
→ 导入并验证数量/关系/COL
→ 生成权限 0600 的逻辑备份
→ 仅重建 cooperation_* 表
→ 从备份恢复
→ 再次验证数量/关系/COL/审计不可变性
```

## 必须补齐的证据

- 远程数据库资源 ID、区域和连接状态（不记录连接密钥）。
- 第一轮与第二轮的源数量、成功数量、异常、孤儿记录、重复 COL、序列值。
- 备份生成时间、备份文件哈希和恢复时间。
- 审计表 UPDATE/DELETE 被触发器拒绝的远程测试证据。
- 数据责任人对恢复结果的真实签认。

没有上述远程证据前，`database_ready` 与本报告不得标记 PASS。

