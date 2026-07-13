# Platform Standards

## Purpose

本目录保存中国信托制物业发展平台当前执行或提交审核的平台级标准。平台标准用于指导当前平台运行，与 `knowledge/foundation/sources/` 保存的历史来源资料分轨管理，二者互不替代。

## Governance Tracks

- **Track A — Platform Standards：** 当前平台标准，按知识对象生命周期进行审核、批准、修订和归档。
- **Track B — Source Archive：** 历史原件及其来源核验记录，不因当前标准建立而改变接收或核验状态。

## Status Values

- `in_review`：已提交项目总架构师审核，尚未批准。
- `approved`：已获项目总架构师批准，具备正式入库资格；是否已进入正式库以 Codex 入库记录为准。
- `pending_revision`：当前正式内容等待修订和重新批准。
- `archived`：已被后续版本替代并归档。

## Standards Index

| 标准 | 版本 | 状态 | 文件类型 | 用途 |
| --- | --- | --- | --- | --- |
| [知识对象生命周期管理规范](knowledge-object-lifecycle-management-v1.0.md) | V1.0 | `approved` | Platform Standard | 规定知识对象生命周期、审批与入库职责 |
| [治理词典基础建设规范](governance-dictionary-foundation-standard-v1.0.md) | V1.0 | `in_review` | Platform Standard | 指导治理词典、JD、GT及相关治理知识对象的当前建设 |

## Change Process

1. 新标准由责任角色编制并标记为 `in_review`。
2. 项目总架构师作出批准决定。
3. Codex执行正式入库、目录登记和必要的技术校验。
4. 未经批准不得标记为 `approved`。
5. 历史原件继续进入 Source Archive，不覆盖当前平台标准；当前平台标准也不得冒充历史原件。
