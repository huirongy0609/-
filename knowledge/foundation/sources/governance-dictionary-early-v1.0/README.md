# 《治理词典》早期V1.0原始资料区

> 所属项目：中国信托制物业发展平台（总部）
>
> 对应任务：Codex任务单 No.008
>
> 服务任务：Work任务单 No.021
>
> 当前接收结果：0/6份资料达到`verified_readable`
>
> No.021来源条件：未满足

## 一、目录用途

本目录只用于接收、保存、核验和追溯《治理词典》早期建设阶段的六份V1.0原始资料：

1. 《治理词典》项目定位（V1.0）
2. 《治理词典》编写规范（V1.0）
3. 《治理词典》第一阶段建设方案（V1.0）
4. 《治理词典》内容架构设计（V1.0）
5. 《治理词典》词条标准（V1.0）
6. 《治理词典》编写原则（V1.0）

这些文件只作为Work No.021整合《聚道信托制物业治理词典建设规范 V1.1》的历史来源和追溯依据。

## 二、资料性质

- 历史原始资料不是现行批准标准。
- 历史原始资料不属于Foundation正式知识对象，也不进入知识对象生命周期。
- 文件被接收、保存或核验，不等于内容获得`approved`状态。
- 来源接收状态与Task Status、Knowledge Object Lifecycle和Source Audit Status分开管理。
- 当前聊天中出现的六个标题不构成原件，不得据此生成或重建文件。

## 三、目录结构

```text
knowledge/foundation/sources/governance-dictionary-early-v1.0/
├── README.md
├── source-manifest.md
├── source-gap-report.md
├── verification-method.md
└── originals/
```

- `originals/`：保存收到的原始文件字节，不保存根据记忆、摘要或标题重建的内容。
- `source-manifest.md`：登记六份资料的接收、路径、格式、可读性、校验值和来源。
- `source-gap-report.md`：记录已收到、尚缺、不可读、冲突和No.021启动条件。
- `verification-method.md`：说明文件完整性和可读性核验方法。

## 四、原件保护规则

1. Codex不得修改、重写、润色或补全原始文件正文。
2. 应保存原始文件，不以转写稿、提取文本、截图或格式转换文件替代原件。
3. 原始文件名、接收来源、文件格式和SHA-256必须登记。
4. 如需生成提取文本或可读副本，应作为派生核验材料另行保存，并明确关联原件；不得覆盖`originals/`中的文件。
5. 文件内容完整可读不代表内容现行有效，也不代表获得批准。
6. 发现标题、版本、重复文件或内容冲突时，只记录事实，交由项目总架构师裁决。

## 五、接收状态

本来源区使用以下接收状态，它们不是知识对象生命周期状态：

| 接收状态 | 含义 |
| --- | --- |
| `not_received` | 尚未收到具体文件；仅有标题或提及不算收到 |
| `received_unverified` | 已保存原始文件，但尚未完成全部完整性和可读性检查 |
| `verified_readable` | 原件已经保存，且文件可打开、正文非空、标题和版本可识别、未发现截断迹象、SHA-256已登记 |

## 六、No.021启动条件

只有六份资料全部达到`verified_readable`，`source-gap-report.md`才可以记录：

> No.021 source condition satisfied

Codex只能提交来源核验结果，不得自行将Work No.021从`paused (waiting_for_source_materials)`变更为`in_progress`。任务状态变化由项目统筹确认。

## 七、治理依据

本目录执行Platform Rule PR-001“原始资料优先原则”：

```text
Source
→ Standard
→ Knowledge Object
→ Publish
```

没有完整原始资料，不恢复标准；不依据标题、记忆、聊天摘要或后续讨论反向重建原文。
