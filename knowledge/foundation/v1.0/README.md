# Foundation Knowledge Pack V1.0

> 所属项目：中国信托制物业发展平台（总部）
>
> 目录性质：基础知识包入库框架
>
> 版本：V1.0
>
> 建立日期：2026-07-13
>
> 当前状态：`partial_approved_ingest`

## 1. 目录用途

本目录用于接收、核验和管理中国信托制物业发展平台第一批基础知识原件，包括三份基础标准和 JD001—JD008。

目录结构：

```text
knowledge/foundation/v1.0/
├── README.md
├── manifest.md
├── standards/
└── jd/
    ├── jd001-what-is-trust.md
    ├── jd002-what-is-trust-based-system.md
    ├── jd003-what-is-trust-property.md
    ├── jd004-what-is-fiduciary-duty.md
    ├── jd005-what-is-fiduciary-relationship.md
    └── jd006-who-is-the-settlor.md
```

- `standards/`：仅接收三份已经核实并获得批准的 V1.0 标准原件。
- `jd/`：仅接收 JD001—JD008 已经核实并获得批准的正式原件。
- `manifest.md`：逐项记录来源、版本、批准证据、生命周期状态和建议处理。
- `../drafts/`：Foundation候选稿隔离区，不属于V1.0正式知识包，不得作为正式知识对象引用。

## 2. Foundation Knowledge Pack 定位

Foundation Knowledge Pack 计划作为后续 JD、GT、案例和标准建设的基础权威来源。当前已正式入库JD001—JD006，11份原件仍未齐全，因此本目录处于部分入库状态，**不得宣布为完整的唯一权威来源，不得作为缺失对象或Draft候选的替代品**。

只有以下条件全部满足后，才能将知识包状态升级为 `approved`：

1. 11份原件全部到位。
2. 每份文件的标题、编号和版本与批准对象一致。
3. 每份文件均具备可核实的批准证据。
4. 重复版本和内容冲突已经裁决。
5. `manifest.md` 已登记最终入库路径、来源路径和校验信息。
6. 项目总架构师明确批准 Foundation Knowledge Pack V1.0 成为唯一权威来源。

## 3. 当前状态

截至2026-07-13：

- 生命周期状态：
  - `approved`：6项（JD001—JD006）。
  - `draft`：2项（JD007、JD008）。
  - `in_review`：0项。
  - `pending_revision`：0项。
  - `archived`：0项。
- 原件审计状态：
  - `not_found`：3项（三份标准）。

详细证据见 [manifest](manifest.md)、[Foundation Source Audit Report V1.0](../../../docs/foundation-source-audit-report-v1.md)和[知识对象生命周期管理规范 V1.0](../../../docs/standards/knowledge-object-lifecycle-management-v1.0.md)。

## 4. 正式文件入库规则

1. 不得根据文件名称重新编写原件。
2. 不得把网站文章、百科页、JST映射、MVP样例、摘要或聊天内容当作正式原件。
3. 不得仅因文件名包含“正式版”“批准版”就确认权威性。
4. 候选文件必须核对正文、版本、状态、批准记录、正式引用和Git历史。
5. 入库时保留原文，不在搬运过程中改写专业内容。
6. 文件名采用稳定编号和英文短名；显示标题保留正式中文名称。最终命名需服从已批准的知识对象标准和模板标准。
7. 每个正式文件入库后，应在 `manifest.md` 登记原始来源、入库路径、版本、批准证据、批准日期和文件校验值。
8. 无法确认的候选文件可保留在原位置，或按批准要求复制到`knowledge/foundation/drafts/`隔离管理；不得进入版本化正式库，不得标记为正式。

## 5. 生命周期状态与原件审计状态

根据Architecture Review AR-004，Foundation中的JD、GT、Case、Evidence、Standard、Law、QA、Tool和Product Object统一采用以下生命周期状态：

| 状态 | 含义 | 是否进入Foundation正式库 |
| --- | --- | --- |
| `draft` | 工作稿、审核稿或尚未批准的候选稿 | 否；可进入Draft隔离区 |
| `in_review` | 已提交项目总架构师审核 | 否 |
| `approved` | 已由项目总架构师批准，等待或已经由Codex完成正式入库 | Codex完成入库后进入正式库 |
| `pending_revision` | 曾有正式内容，但当前需要修订并重新批准 | 否；修订完成前不进入当前正式版本 |
| `archived` | 已被后续版本替代并归档 | 否；归档保存 |

原件审计状态与生命周期分开管理。当前批准的审计状态只有：

| 审计状态 | 含义 |
| --- | --- |
| `not_found` | 尚未取得可核验原件 |

`not_found`不得填写在生命周期状态字段。文件即使存在引用、映射或相邻材料，只要尚未取得可核验原件，原件审计状态仍为`not_found`，并在Manifest的证据栏说明实际发现。

## 6. 两步确认制

所有正式知识对象采用两步确认：

1. **项目总架构师批准**：明确确认某一具体正文及版本是正式原件。
2. **Codex入库**：建立规范目录，保留批准正文，记录来源和校验值，更新Manifest与Audit，建立引用关系；Codex不得改写正文，也不得以入库替代批准。

缺少第一步批准，不得执行正式入库；只有批准而尚未完成第二步入库的文件，不得宣称已经进入Foundation Knowledge Pack。

## 7. 正文冻结与版本连续性

平台正式知识对象一经批准，原则上正文冻结：

- 不在批准原件上直接修改正文。
- 仅缺版本、状态、来源、批准证据等元数据时，通过Manifest或伴随metadata补充，不写入原件正文。
- 需要修订时建立可追溯的新版本，例如V1.1修订版或V2.0重大修订版。
- 新版本必须重新完成“项目总架构师批准—Codex入库”两步确认。
- 旧批准版保留，不静默覆盖；Manifest登记替代关系、批准日期和校验值。

本规则先作为Foundation Knowledge Pack入库规则执行，后续由项目总架构师纳入平台正式标准。

## 8. 批准与更新责任

- 内容责任角色负责核对原件内容、编号和来源。
- Codex负责入库、校验、链接检查和版本追溯，不负责批准专业内容。
- ChatGPT负责架构一致性评审和冲突整理。
- 项目总架构师负责正式原件、知识包状态及重大版本变化的最终批准。
- 已批准知识对象的任何正文修订均通过新版本管理，不以“小修”名义直接修改冻结正文。
- 被替代文件不得静默覆盖，应记录替代关系并按批准方案保留或归档。

## 9. 禁止事项

- 在未经项目总架构师批准时，将JD009提交审核稿作为正式知识对象入库。
- 将 `data/knowledge-objects.json` 中的MVP Draft当作已入库JD003正式版。
- 将网站文章或百科页当作JD003、JD008正式版。
- 将 `GT-Object-Standard-V1.md` 当作《中国信托制物业知识对象标准 V1.0》。
- 将Draft候选作为Foundation正式知识对象引用或发布。
- 在未批准前删除或改写现有候选文件。
