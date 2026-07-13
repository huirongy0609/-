# Foundation Knowledge Pack V1.0 Manifest

> 清单状态：`incomplete_source_audit`
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
| JD001 | 《什么是信托？》 | `not_found` | 未发现JD001编号、独立同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD001正式原件及批准证据 |
| JD002 | 《什么是信托制？》 | `not_found` | 未发现JD002编号、独立同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD002正式原件及批准证据 |
| JD003 | 《什么是信托制物业？》 | `draft_or_working_copy` | `data/knowledge-objects.json`；`knowledge-base/article-what-is-trust-property.md`；`content/articles/what-is-trust-property-management.md`；`trust-property-site/encyclopedia/what-is-trust-property.md`；`KNOWLEDGE_PORTAL_IA_V1.md`；`jst-index.md` | MVP对象v0.1 Draft；Article/GEO-MVP/百科和映射版本并存 | 未发现JD003批准记录；MVP对象明确写明正式定义等待审核，百科页明确待杨老师确认，JST状态为draft | 不入库；请提供JD003正式批准版，或由杨老师指定候选及其批准记录 |
| JD004 | 《什么是信义义务？》 | `not_found` | 未发现JD004编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD004正式原件及批准证据 |
| JD005 | 《什么是受托关系？》 | `not_found` | 未发现JD005编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD005正式原件及批准证据 |
| JD006 | 《谁是信托制物业中的委托人？》 | `not_found` | 未发现JD006编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD006正式原件及批准证据 |
| JD007 | 《谁是信托制物业中的受托人？》 | `not_found` | 未发现JD007编号、同名原件或批准记录 | 不可核实 | 未发现 | 请提供JD007正式原件及批准证据 |
| JD008 | 《什么是业主共同基金？》 | `draft_or_working_copy` | `content/articles/owner-common-fund.md`；`trust-property-site/encyclopedia/owner-common-fund.md`；`KNOWLEDGE_PORTAL_IA_V1.md`；`KNOWLEDGE_PORTAL_UX_V1.md`；`jst-index.md`；`data/asset-index.csv` | GEO-MVP-V1、待确认百科页、JST draft及页面映射并存 | 未发现JD008批准记录；GEO页面标明待补充权威定义出处，百科页标明待杨老师确认，JST状态为draft | 不入库；请提供JD008正式批准版，或由杨老师指定候选及其批准记录 |

## 入库结论

- 当前可直接入库：0项。
- 必须等待确认或提供原件：11项。
- 本清单不得作为11份正式原件的替代品。
