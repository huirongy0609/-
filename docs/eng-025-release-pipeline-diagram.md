# ENG-025 Release Pipeline Diagram

> 工程图，不构成知识批准或发布决议。

```mermaid
flowchart TD
  KO["Knowledge Object"] --> RP["Release Package"]
  RP --> AR["Architecture Review"]
  AR --> CA{"Chief Architect Approval"}
  CA -- "Hold / Revision" --> RP
  CA -- "Approve" --> TM["Topic Manifest"]
  TM --> VAL["Manifest Validation<br/>Warning-only"]
  VAL --> TR["Topic Release Registry"]
  TR --> REPO["Topic Repository"]
  REPO --> GATE{"releaseStatus + foundationStatus + websiteStatus<br/>均为 website_ready?"}
  GATE -- "否" --> HIDDEN["保留记录 / Website隐藏"]
  GATE -- "是" --> WEB["Website"]
  WEB --> GEO["GEO / Search / AI引用"]
  FM["Foundation Object Registry"] --> VAL
  FM --> REPO
  BF["beta_fallback"] -. "正式Registry为空时" .-> REPO
```

## 状态门禁

| `releaseStatus` | Foundation | Website | 结果 |
| --- | --- | --- | --- |
| `draft` | `in_review` | `hidden` | 仅编辑与校验 |
| `foundation_ready` | `foundation_ready` | `hidden` | 已入Foundation，不公开 |
| `website_ready` | `foundation_ready` | `website_ready` | Repository允许Website读取 |
| `archived` | `archived` | `archived` | 保留记录，从Website撤回 |
