# Knowledge Object Lifecycle

版本：V2.0
状态：Approved / Governed by Knowledge Studio V2 Baseline

> V2 兼容说明：统一生命周期继续有效，但其治理单元调整为完整 Knowledge Object Version。Definition、Questions、Canonical Answer 和 Evidence Binding 可有组件级工作状态，不再拥有彼此独立的正式生命周期；Approval Record 仍绑定完整版本校验值。

## 1. 统一生命周期

所有正式知识对象采用同一主流程：

```text
draft
  → in_review
  → approved
  → published
  → archived
```

中文显示：

```text
草稿 → 审核中 → 已批准 → 已发布 → 已归档
```

机器值沿用稳定英文枚举，显示层可以使用中文标签。任务描述中的 `Review` 对应现有机器值 `in_review`。

`pending_revision` 作为异常修订状态保留：

```text
approved / published
  → pending_revision
  → draft（新版本）
  → in_review
  → approved
  → published
```

## 2. 状态定义

| 状态 | 定义 | 可编辑 | 可公开 | 可进入 AI / Search |
| --- | --- | --- | --- | --- |
| `draft` | 工作版本，尚未提交审核 | 是 | 否 | 否 |
| `in_review` | 已冻结并进入审核 | 仅通过退回 Draft 后修改 | 否 | 否 |
| `approved` | 内容和关系已由批准人确认，具备发布资格 | 否；修订需新版本 | 否 | 否 |
| `published` | 指定版本已进入有效 Release，必要发布目标成功 | 否；修订需新版本 | 是 | 是 |
| `pending_revision` | 已批准或已发布内容存在待修订事项 | 否；创建新 Draft | 视风险决定是否撤回旧发布版本 | 仅可保留经明确决定的旧发布版本 |
| `archived` | 已停用或被替代，保留历史与审计 | 否 | 否 | 否 |

`approved` 只表示批准决定；`published` 必须有 Release Manifest 和目标回执。不得用文件存在、代码合并或构建成功代替发布事实。

## 3. 对象与版本分离

```text
Knowledge Object
  object_id
  current_draft_version_id
  current_approved_version_id
  current_published_version_id

Object Version
  version_id
  semantic_version
  immutable_payload
  lifecycle_status
  checksum
```

- Object 表示永久身份。
- Object Version 表示一次不可变内容快照。
- 已发布版本继续服务时，可以并行存在新的 Draft。
- 新版本发布成功后更新 `current_published_version_id`，旧版本进入 superseded / archived 记录。
- 不静默覆盖已批准或已发布正文。

这种模型避免“为了修订而立即下线仍然有效的旧版本”。若旧版本存在严重风险，应通过撤回决定和 Release 明确处理。

## 4. 状态转换

| From | To | 触发者 | 前置条件 | 产物 |
| --- | --- | --- | --- | --- |
| 无 | `draft` | 编辑 | 对象 ID 唯一、类型有效 | Draft Version |
| `draft` | `in_review` | 编辑 / 提交人 | 必填字段、Schema、关系目标通过基础校验 | Review Task |
| `in_review` | `draft` | 审核人 | 有明确退回意见 | Review Decision |
| `in_review` | `approved` | 批准人 | 专业、来源、关系和类型门槛通过 | Approval Record |
| `approved` | `published` | 发布管理员 / Release Service | Release 校验及必要目标回执成功 | Release Manifest、Publication Receipts |
| `approved` | `pending_revision` | 批准人 | 发现批准版本需要修订 | Revision Note |
| `published` | `pending_revision` | 批准人 | 风险、失效来源或重大错误 | Impact Record、处置决定 |
| `published` | `archived` | 批准人 + 发布管理员 | 已被替代或正式停用 | Archive Record、撤回回执 |
| `pending_revision` | `draft` | 编辑 | 创建新 Version ID | Draft Version |
| `approved` | `archived` | 批准人 | 未发布版本取消 | Archive Record |

禁止：

- `draft → published`；
- `in_review → published`；
- `published → draft` 直接回写；
- 普通编辑设置 `approved` 或 `published`；
- AI 设置任何生命周期状态。

## 5. 通用门槛

### Draft → In Review

- Object ID 与 Version ID 有效；
- 标题、摘要、对象类型和来源已填写；
- 正文或类型负载符合 Schema；
- 关系目标格式正确；
- 不含未声明的 Mock 内容；
- 敏感信息检查通过；
- 指定负责人和审核人。

### In Review → Approved

- 专业内容核验通过；
- 来源和 Book Traceability（适用时）可追溯；
- 法律与证据可核验；
- 关系没有失效目标或未说明的 Draft 依赖；
- 版本差异已阅读；
- Approval Record 包含批准人、时间、决定和版本校验值。

### Approved → Published

- 当前版本校验值与 Approval Record 一致；
- Release Candidate 只包含已批准版本；
- URL、Canonical、结构化数据和权限边界校验通过；
- Draft / Review 对象未进入公开输出；
- Website、Search Index、AI Read Model 等必要目标返回成功回执；
- Release Manifest 已保存；
- 已生成可执行回滚点。

## 6. 类型特定门槛

统一生命周期不意味着所有对象使用完全相同的专业校验。

| 类型 | Approved 前的附加门槛 |
| --- | --- |
| Knowledge Object | 理论归属、批准原件、Foundation 与 Book Traceability；必需组件完整 |
| Questions 组件 | 问题可由父对象回答；真实来源、去重和回答范围明确 |
| Canonical Answer 组件 | 与 Definition 一致；claim blocks、适用边界和来源明确 |
| Evidence Binding | claim、来源精确定位、验证状态、有效期可核验 |
| Case | 事实来源、时间、主体匿名化或授权、关联 JD/GT |
| Law | 发布机关、效力层级、现行状态、条款定位 |
| GT | 节点、边、依赖 JD 和关系完整性 |
| Standard | 规范来源、适用范围、版本和审批主体 |
| Product | 与知识对象的实现关系，不把营销内容当理论 |
| Course | 引用已批准知识版本，教学表达不改写理论 |

## 7. 审核模型

### Review Task

```text
review_id
object_id
version_id
review_type
assignee
status
checklist_version
comments[]
decision
created_at
decided_at
```

### Approval Record

```text
approval_id
object_id
version_id
approved_by
approved_at
decision
checksum
conditions[]
```

批准记录不可被后续编辑覆盖。条件式批准必须在发布前逐项关闭；否则保持 `approved` 但不可发布。

## 8. 发布状态与生命周期分离

为处理多目标发布，Release 还需要独立状态：

```text
release_draft
validating
deploying
succeeded
partially_failed
failed
rolled_back
```

对象只有在 Release 为 `succeeded` 且必要目标全部确认后才进入 `published`。可选目标失败可以记录 WARN，但不能掩盖必要目标失败。

## 9. 修订、撤回与归档

### 普通修订

旧 Published Version 保持在线，新建 Draft；新版本通过完整审核和发布后替代旧版本。

### 紧急撤回

若存在法律失效、严重错误或敏感信息泄露：

1. 记录影响和批准决定；
2. 从公开 Read Model 撤回指定版本；
3. 保留审计副本；
4. 更新 sitemap、Search 和 AI Export；
5. 将对象标记 `pending_revision`；
6. 创建修订 Draft。

### 归档

归档不是删除。URL 的处理由对象类型和发布政策决定，可以返回替代对象或归档说明，但不得把已归档内容继续作为当前 AI 答案。

## 10. 与现有规范的迁移

当前 Foundation 生命周期为：

```text
draft → in_review → approved → pending_revision / archived
```

迁移建议：

1. 不修改现有对象状态事实；
2. 为当前公开且有真实发布证据的 `approved` 版本补建 Release Record；
3. 只有对账成功的对象才迁移为 `published`；
4. 未公开的 `approved` 对象保持 `approved`；
5. 旧 Question Schema 不再实施独立生命周期；既有兼容数据如出现，只能迁移为 Knowledge Object 内 Questions 组件；
6. 更新 Schema、Lifecycle Engine 和 Read Model 必须作为后续独立实施 Sprint；
7. 迁移完成前继续以 approved + Foundation Ready 作为当前运行时公开边界。

本设计文档不改变当前运行时状态机。
