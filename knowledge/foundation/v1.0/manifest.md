# Foundation Knowledge Pack V1.0 Manifest

> 清单状态：`partial_approved_ingest`
>
> 审计日期：2026-07-13
>
> 说明：本清单不包含未经核实的批准信息；“已发现路径”只表示候选或引用位置，不表示该文件可以入库。

## 状态定义

- `confirmed_approved_original`：正文、版本和批准记录均可核实的正式批准原件。
- `probable_original_needs_confirmation`：高度疑似原件，但缺少充分批准证据。
- `draft_or_working_copy`：明确为草稿、MVP样例、待确认稿或工作版本。
- `reference_or_mapping_only`：只有提及、目录、映射、摘要或非等价相邻文件。
- `not_found`：在本次检索范围内未发现可对应的文件或明确引用。

## 11项原件清单

| 编号 | 正式名称 | 当前状态 | 已发现路径 | 版本 | 批准证据 | 建议处理 |
| --- | --- | --- | --- | --- | --- | --- |
| STD-001 | 《中国信托制物业知识对象标准 V1.0》 | `reference_or_mapping_only` | `docs/architecture-review-v1-submission.md`；`docs/development-status-report-v1.md`；相邻但不等价：`GT-Object-Standard-V1.md` | 引用声称V1.0；原件版本不可核实 | 未发现批准记录或原件；工程报告只说明该标准尚未完整落地 | 请杨老师提供原件及批准证据；不得用GT对象编号标准替代 |
| STD-002 | 《中国信托制物业知识对象模板标准 V1.0》 | `not_found` | 未发现 | 不可核实 | 未发现 | 请提供正式原件及批准证据 |
| STD-003 | 《聚道信托制物业治理词典建设规范 V1.0》 | `not_found` | 未发现 | 不可核实 | 未发现 | 请提供正式原件及批准证据 |
| JD001 | 《什么是信托？》 | `confirmed_approved_original` | `knowledge/foundation/v1.0/jd/jd001-what-is-trust.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD001为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD002 | 《什么是信托制？》 | `confirmed_approved_original` | `knowledge/foundation/v1.0/jd/jd002-what-is-trust-based-system.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD002为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD003 | 《什么是信托制物业？》 | `confirmed_approved_original` | `knowledge/foundation/v1.0/jd/jd003-what-is-trust-property.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0（版本由批准确认补充，未写入正文） | 项目总架构师于2026-07-13明确确认附件中JD003为批准原件，并确认正式版本为V1.0 | 已入库；正文冻结，版本元数据仅在本Manifest记录 |
| JD004 | 《什么是信义义务？》 | `confirmed_approved_original` | `knowledge/foundation/v1.0/jd/jd004-what-is-fiduciary-duty.md`；来源附件`39245a45-bd9d-409c-a261-ad2c6705aa00/pasted-text.txt` | V1.0 | 项目总架构师于2026-07-13明确确认附件中JD004为批准原件 | 已入库；正文冻结，后续修订另建版本 |
| JD005 | 《什么是受托关系？》 | `not_found` | 未发现JD005编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD005正式原件及批准证据 |
| JD006 | 《谁是信托制物业中的委托人？》 | `not_found` | 未发现JD006编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD006正式原件及批准证据 |
| JD007 | 《谁是信托制物业中的受托人？》 | `not_found` | 未发现JD007编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD007正式原件及批准证据 |
| JD008 | 《什么是业主共同基金？》 | `draft_or_working_copy` | `content/articles/owner-common-fund.md`；`trust-property-site/encyclopedia/owner-common-fund.md`；`KNOWLEDGE_PORTAL_IA_V1.md`；`KNOWLEDGE_PORTAL_UX_V1.md`；`jst-index.md`；`data/asset-index.csv` | GEO-MVP-V1、待确认百科页、JST draft及页面映射并存 | 未发现JD008批准记录；GEO页面标明待补充权威定义出处，百科页标明待杨老师确认，JST状态为draft | 不入库；请提供JD008正式批准版，或由杨老师指定候选及其批准记录 |

## 入库结论

- 已确认并完成入库：4项（JD001—JD004）。
- 必须等待确认或提供原件：7项（三份标准、JD005—JD008）。
- 本清单不得作为11份正式原件的替代品。

## 已入库文件校验值

校验算法：SHA-256。

| 编号 | 入库文件 | SHA-256 |
| --- | --- | --- |
| JD001 | `jd/jd001-what-is-trust.md` | `375cb55506e12633382057915d81516454c9359a0c1641977561a12738d41bd5` |
| JD002 | `jd/jd002-what-is-trust-based-system.md` | `690a20fa7aad745c869631048fb3c17eb1518b80fd695d94b2b9454c25c38b62` |
| JD003 | `jd/jd003-what-is-trust-property.md` | `9b324bb807d4167a2c283786c442276e1a6ea53af91e7269f00767ae41165c1b` |
| JD004 | `jd/jd004-what-is-fiduciary-duty.md` | `996c7d0f1a4f116b4626236302f3639897b17f3947f28fdd69f447b9537a9d5d` |

附件整体SHA-256：`59478bfcda120631a09c524de26fefaea888c481b07e67a78955aa70eacc8dbc`。四个入库文件按JD001—JD004顺序拼接后，正文与批准附件一致；仓库文本规范仅补充一个终止换行符。

## 引用关系登记

本节只登记批准原文中已经出现的关联，不回写原件正文。

| 来源对象 | 已解析关联 | 尚未解析的原文关联 |
| --- | --- | --- |
| JD001 | JD002、JD003、JD004 | 什么是委托人、什么是受托人、什么是受益人 |
| JD002 | JD001、JD003、JD004 | 什么是委托人、什么是受托人、什么是受益人 |
| JD003 | JD001、JD002、JD004、JD005、JD006、JD007 | 无 |
| JD004 | JD001、JD002、JD003、JD005 | 什么是受托人 |

尚未解析项保留原文名称，不在缺少正式对象标准和对应原件时擅自绑定编号。
