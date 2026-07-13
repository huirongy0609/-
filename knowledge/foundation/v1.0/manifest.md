# Foundation Knowledge Pack V1.0 Manifest

> 清单状态：`partial_approved_ingest`
>
> 审计日期：2026-07-13
>
> 治理依据：Architecture Review AR-004批准的《知识对象生命周期管理规范 V1.0》
>
> 说明：本清单不包含未经核实的批准信息；生命周期状态与原件审计状态分列记录，Draft路径不表示该文件已经进入正式库。

## 生命周期状态

- `draft`：工作稿、审核稿或尚未批准的候选稿；只可进入Draft隔离区。
- `in_review`：已经提交项目总架构师审核。
- `approved`：已经由项目总架构师批准；Codex入库是后续独立执行动作。
- `pending_revision`：曾有正式内容，但当前需要修订并重新批准；修订完成前不进入当前正式版本。
- `archived`：已经被后续版本替代并归档。

## 原件审计状态

- `not_found`：尚未取得可核验原件；发现引用、映射或相邻材料时在证据栏单独说明。

原件已经取得时，本清单暂以“—（原件已取得）”或“—（候选已取得）”记录，不擅自增加尚未批准的审计状态。

## 11项原件清单

| 编号 | 正式名称 | 生命周期状态 | 原件审计状态 | 已发现路径 | 版本 | 批准证据 | 建议处理 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| STD-001 | 《中国信托制物业知识对象标准 V1.0》 | — | `not_found` | 引用：`docs/architecture-review-v1-submission.md`、`docs/development-status-report-v1.md`；相邻但不等价：`GT-Object-Standard-V1.md` | 引用声称V1.0；原件版本不可核实 | 只有引用和相邻材料，未取得原件或批准记录 | 请杨老师提供原件及批准证据；不得用GT对象编号标准替代 |
| STD-002 | 《中国信托制物业知识对象模板标准 V1.0》 | — | `not_found` | 未发现 | 不可核实 | 未发现 | 请提供正式原件及批准证据 |
| STD-003 | 《聚道信托制物业治理词典建设规范 V1.0》 | — | `not_found` | 未发现 | 不可核实 | 未发现 | 请提供正式原件及批准证据 |
| JD001 | 《什么是信托？》 | `approved` | —（原件已取得） | `knowledge/foundation/v1.0/jd/jd001-what-is-trust.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD001为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD002 | 《什么是信托制？》 | `approved` | —（原件已取得） | `knowledge/foundation/v1.0/jd/jd002-what-is-trust-based-system.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD002为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD003 | 《什么是信托制物业？》 | `approved` | —（原件已取得） | `knowledge/foundation/v1.0/jd/jd003-what-is-trust-property.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0（版本由批准确认补充，未写入正文） | 项目总架构师于2026-07-13明确确认附件中JD003为批准原件，并确认正式版本为V1.0 | 已入库；正文冻结，版本元数据仅在本Manifest记录 |
| JD004 | 《什么是信义义务？》 | `approved` | —（原件已取得） | `knowledge/foundation/v1.0/jd/jd004-what-is-fiduciary-duty.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD004为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD005 | 《什么是受托关系？》 | `approved` | —（原件已取得） | `knowledge/foundation/v1.0/jd/jd005-what-is-fiduciary-relationship.md`；来源附件`8dcebbf2-43a7-47b7-b407-d5813c0c9c02/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD005为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD006 | 《谁是信托制物业中的委托人？》 | `approved` | —（原件已取得） | `knowledge/foundation/v1.0/jd/jd006-who-is-the-settlor.md`；来源附件`8dcebbf2-43a7-47b7-b407-d5813c0c9c02/pasted-text.txt` | V1.0（2026年版） | 项目总架构师于2026-07-13明确确认附件中JD006为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD007 | 《谁是信托制物业中的受托人？》 | `draft` | —（候选已取得） | `knowledge/foundation/drafts/jd/jd007-who-is-the-trustee-v0.1-draft.md`；来源附件`8dcebbf2-43a7-47b7-b407-d5813c0c9c02/pasted-text.txt` | V0.1（审核稿） | 原文标注“项目总架构师审核中”；项目总架构师于2026-07-13明确确认其不是正式原件 | 保留在Draft隔离区；补齐缺失表格并正式批准后方可入库 |
| JD008 | 《什么是业主共同基金？》 | `draft` | —（候选已取得） | `knowledge/foundation/drafts/jd/jd008-owner-common-fund-draft.md`；另有网站、百科和映射候选 | 版本未标注 | 项目总架构师于2026-07-13明确确认当前版本不作为正式原件入库 | 保留在Draft隔离区；修正缺失表格和关联编号、补充版本并批准后方可入库 |

## 入库结论

- 已确认并完成入库：6项（JD001—JD006）。
- Draft候选：2项（JD007、JD008），均未进入正式库。
- `in_review`：0项。
- `pending_revision`：0项；当前没有证据表明某一未入库对象曾是正式批准版后进入修订状态。
- `archived`：0项。
- 原件审计状态`not_found`：3项（三份标准）。
- 本清单不得作为11份正式原件的替代品。

## 已入库文件校验值

校验算法：SHA-256。

| 编号 | 入库文件 | SHA-256 |
| --- | --- | --- |
| JD001 | `jd/jd001-what-is-trust.md` | `375cb55506e12633382057915d81516454c9359a0c1641977561a12738d41bd5` |
| JD002 | `jd/jd002-what-is-trust-based-system.md` | `690a20fa7aad745c869631048fb3c17eb1518b80fd695d94b2b9454c25c38b62` |
| JD003 | `jd/jd003-what-is-trust-property.md` | `9b324bb807d4167a2c283786c442276e1a6ea53af91e7269f00767ae41165c1b` |
| JD004 | `jd/jd004-what-is-fiduciary-duty.md` | `996c7d0f1a4f116b4626236302f3639897b17f3947f28fdd69f447b9537a9d5d` |
| JD005 | `jd/jd005-what-is-fiduciary-relationship.md` | `2932d536a76d203643b9b7dd11d704476817fe0b9f05634abf6ac9c312543d67` |
| JD006 | `jd/jd006-who-is-the-settlor.md` | `c68ada1e77a4b03873488afe01c41912521942a98b6239160fbe65d8af88e24c` |

附件整体SHA-256：`59478bfcda120631a09c524de26fefaea888c481b07e67a78955aa70eacc8dbc`。四个入库文件按JD001—JD004顺序拼接后，正文与批准附件一致；仓库文本规范仅补充一个终止换行符。

第二份附件整体SHA-256：`cc2421010c61afc76ae977f408f410a780726c4733a614df79ad293a4b86a4ed`。JD005取附件第1—79行、JD006取第81—171行，均与入库文件逐字一致；附件中的对话衔接文字没有混入批准正文。

## Draft候选校验值

| 编号 | Draft文件 | SHA-256 |
| --- | --- | --- |
| JD007 | `../drafts/jd/jd007-who-is-the-trustee-v0.1-draft.md` | `01c99843cbac81164e16b2da4c52086b37f53834e5b188224fb282779637a0d4` |
| JD008 | `../drafts/jd/jd008-owner-common-fund-draft.md` | `3a8e2b155e1b956404e062253cea0eb8f780e12f3da1f2bc3dd4b283462dd73b` |

JD007取第二份附件第177—293行，JD008取第296—385行，均与Draft文件逐字一致。原稿中的“暂时无法在飞书文档外展示此内容”和关联编号冲突原样保留，作为后续修订事项，不代表正式知识结论。

## 引用关系登记

本节只登记批准原文中已经出现的关联，不回写原件正文。

| 来源对象 | 已解析关联 | 尚未解析的原文关联 |
| --- | --- | --- |
| JD001 | JD002、JD003、JD004 | 什么是委托人、什么是受托人、什么是受益人 |
| JD002 | JD001、JD003、JD004 | 什么是委托人、什么是受托人、什么是受益人 |
| JD003 | JD001、JD002、JD004、JD005、JD006、JD007 | 无 |
| JD004 | JD001、JD002、JD003、JD005 | 什么是受托人 |
| JD005 | JD001、JD002、JD003、JD004、JD006、JD007、JD008 | 无；编号对应名称仍待各对象正式批准时核对 |
| JD006 | JD003、JD005、JD007 | 什么是业主共同决定、什么是业主共同体、什么是业主大会 |

尚未解析项保留原文名称，不在缺少正式对象标准和对应原件时擅自绑定编号。
