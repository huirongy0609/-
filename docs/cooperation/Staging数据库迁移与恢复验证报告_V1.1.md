# Staging 数据库迁移与恢复验证报告 V1.1

## 1. 结论

**PASS。** 两轮操作均在真实 Supabase Staging PostgreSQL 上执行，本地结果未替代远程证据。

```text
database_ready = true
migration_verified = true
```

## 2. 数据范围

| 项目 | 结果 |
|---|---:|
| 历史源记录 | 1 |
| 迁移成功 | 1 |
| 异常 | 0 |
| 目标业务表 | 6 |
| 最大历史 COL | `COL-2026-0001` |
| 期望下一编号 | `COL-2026-0002` |

六表为：机构、登记、伙伴状态、COL 序列、管理员映射和审计日志。迁移操作只作用于 Staging 的
`cooperation_*` 表，未写入或删除 Sites D1 历史源。

## 3. 第一轮：迁移、验证、备份

```text
Schema Deploy
→ 历史数据导入
→ 关系与 COL 校验
→ 公开登记业务测试
→ 逻辑备份
```

| 校验项 | 结果 |
|---|---:|
| `cooperation_registration` | 1 |
| `cooperation_organization` | 1 |
| `cooperation_partner_status` | 1 |
| `cooperation_col_sequence` | 1 |
| 孤儿登记 | 0 |
| 重复 COL | 0 |
| 2026 序列值 | 1 |

备份文件在执行环境以 `0600` 权限生成，SHA-256：

`70ae53a30311328cbd8c683e00adbc4ff450330dd67d8682bd70a99d57aa1272`

备份包含个人信息，因此不提交 Git，不在报告中复制内容。

## 4. 第二轮：清理、恢复、再验证

在明确的 Staging 资源内仅清理并重建六张 `cooperation_*` 表，随后从第一轮逻辑备份恢复。

| 校验项 | 恢复结果 |
|---|---:|
| 登记 | 1 |
| 机构 | 1 |
| 状态 | 1 |
| 孤儿记录 | 0 |
| 重复编号 | 0 |
| 2026 序列值 | 1 |
| 下一编号 | `COL-2026-0002` |

## 5. 恢复后业务流程

恢复后通过最终应用 API 提交一条标记为 Staging 测试的登记，HTTP 201，实际生成
`COL-2026-0002`。随后再次从已核验备份恢复基线，测试记录已清理；最终仍为 1 条历史记录，下一编号仍是
`COL-2026-0002`。

该结果证明序列未从零开始、并发生成逻辑使用数据库原子更新，且恢复不会导致 COL 重号或断档。

## 6. 审计与回滚

- 审计表 UPDATE 测试被 `cooperation_audit_log_immutable` 触发器拒绝。
- 审计日志为追加式，测试身份删除后仍保留授权与拒绝证据。
- 回滚单元是 Staging 的六张合作表；生产数据库、生产 DNS 与 D1 源不在操作范围。
- 最终 Release Candidate 不包含临时迁移 API；一次性迁移 Secret 已删除。

