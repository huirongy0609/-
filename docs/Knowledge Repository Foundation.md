# Knowledge Repository Foundation

> **所属项目：** 中国信托制物业发展平台
>
> **对应任务：** Codex 任务单 No.026
>
> **文件性质：** Knowledge Repository 工程设计说明
>
> **版本：** V1.0
>
> **状态：** `in_review`
>
> **维护角色：** Platform Engineering Center
>
> **批准角色：** 项目总架构师
>
> **最后更新：** 2026-07-22

## 一、文件定位

本文件定义平台知识对象的统一目录、Metadata 契约和引用关系，为持续导入 JD、GT、Case、Law、QA、Tool、Product 与 Course 提供可维护的工程基础。

本次只建设数据组织能力，不批准任何知识内容，不修改现有知识对象、Foundation Manifest、生命周期或发布资格；也不开发 AI、Prompt、业务页面和新的视觉体系。

## 二、设计原则

1. **Foundation 是正式对象权威源。** 已批准对象继续以 `knowledge/foundation/` 及其人工治理记录为准，不建立第二套权威库。
2. **目录只表达对象类型，不表达批准事实。** 文件进入某个目录，不会自动获得 `approved` 或 Foundation Ready 状态。
3. **Metadata 先于批量导入。** 新对象进入自动导入流程前，必须满足统一 Schema；历史对象通过兼容适配读取，不静默改写正文。
4. **稳定 ID 连接全部对象。** 文件名、标题和页面路径可以变化，`object_id` 不随展示方式变化。
5. **关系使用对象 ID。** 不使用标题、中文显示名或文件路径作为长期关系键。
6. **缺失值不得推测。** 来源、版本、状态和关系无法核实时保持待处理，不生成模拟对象或虚假引用。
7. **内容与工程分离。** Codex维护结构、Schema、索引和校验；内容批准仍由 Architecture Review 和项目总架构师决定。

## 三、数据组织方式

### 3.1 正式对象根目录

平台沿用现有正式根目录：

```text
knowledge/foundation/v1.0/
├── jd/
├── gt/
├── case/
├── law/
├── qa/
├── tool/
├── product/
└── course/
```

对象类型与目录登记在 `config/foundation/object-types.v1.json`。本次只启用目录和契约，不迁移现有文件，不在空目录中生成示例或模拟数据。

### 3.2 类型职责

| 对象类型 | 目录 | 主要内容 | ID示例 |
| --- | --- | --- | --- |
| `JD` | `jd/` | 治理词典、概念和标准定义 | `JD-034` |
| `GT` | `gt/` | 治理标准、规则、方法和工具包成员 | `GT-B07` |
| `CASE` | `case/` | 经核验、可复盘的治理案例 | `CASE-001` |
| `LAW` | `law/` | 法律、行政法规、政策及其可追溯元数据 | `LAW-001` |
| `QA` | `qa/` | 围绕真实问题形成的标准问答 | `QA-001` |
| `TOOL` | `tool/` | 表单、清单、模板、计算或诊断工具 | `TOOL-001` |
| `PRODUCT` | `product/` | 平台产品及稳定产品知识 | `PRODUCT-001` |
| `COURSE` | `course/` | 课程、项目和学习路径对象 | `COURSE-001` |

现有 Foundation Engine 和网站仍以 `FAQ` 作为 QA 的运行时兼容类型。新目录和业务语义使用 `QA`；导入层将 `QA` 规范化为现有 `FAQ` 运行时类型，直至一次独立、经批准的迁移完成。两者不得生成重复对象。

### 3.3 文件命名

- 文件名使用小写英文 kebab-case；
- 文件名以稳定对象 ID 开头，例如 `jd-034-what-is-co-governance-v1.0.md`；
- 标题保留正式中文名称；
- 文件名中的版本只用于识别正文版本，不替代 Metadata 和 Git 历史；
- 同一有效版本只保留一个正式入口，被替代版本按既有归档规则处理。

## 四、统一 Metadata

### 4.1 规范字段

机器契约位于 `config/foundation/knowledge-object.schema.v1.json`。为兼容现有 Foundation Engine，仓库文件统一使用 snake_case 字段；API 或前端需要 camelCase 时，由 Repository Adapter 转换，不要求知识正文维护两套字段。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `schema_version` | 是 | Metadata 契约版本，当前为 `1.0` |
| `object_id` | 是 | 全局稳定对象 ID，对应概念字段 `id` |
| `object_type` | 是 | 对象类型，对应概念字段 `type` |
| `title` | 是 | 正式显示标题 |
| `summary` | 是 | 可独立理解的摘要，不从正文自动臆测 |
| `keywords` | 是 | 去重后的稳定检索关键词数组 |
| `category` | 是 | 分类 ID；中文名称仅用于展示 |
| `version` | 是 | 内容版本，例如 `V1.0` |
| `status` | 是 | 既有 Knowledge Lifecycle 状态 |
| `source` | 是 | 一个或多个可追溯来源 ID 或正式引用 |
| `updated_at` | 是 | 内容最后更新时间，ISO日期，对应概念字段 `updatedAt` |
| `relations` | 否 | 被当前对象引用的稳定对象 ID 数组 |

生命周期只允许：`draft`、`in_review`、`approved`、`pending_revision`、`archived`。文件存在、目录归属、Commit 或 PR 合并均不得自动改变该状态。

### 4.2 标准 Metadata 结构

以下片段用于说明字段，不代表真实知识对象，也不得作为 Foundation 内容导入：

```yaml
---
schema_version: "1.0"
object_id: "JD-034"
object_type: "JD"
title: "什么是共同治理？"
summary: "待 Architecture Review 的对象摘要"
keywords: ["共同治理", "社区治理"]
category: "governance-mechanism"
version: "V1.0"
status: "in_review"
source: ["SOURCE-ID"]
updated_at: "2026-07-22"
relations: ["GT-B07", "LAW-001"]
---
```

真实对象不得复制示例中的状态、来源、关系或内容；每个值必须来自该对象的真实批准与来源记录。

### 4.3 类型专项字段

统一 Metadata 是最低契约。各类型可以增加专项字段，例如 Law 的发布机关和效力状态、Case 的地区和证据、Course 的适用人群，但不得覆盖统一字段含义。专项字段应先在相应对象标准中定义；Schema 允许增量扩展，不要求在本阶段建立通用后台或数据库。

## 五、引用关系

### 5.1 基本模型

关系采用有方向的边：

```text
source_object_id --relation_kind--> target_object_id
```

对象正文只登记目标 ID；Foundation Engine依据目标类型生成关系类别并检查目标是否已登记。关系存在不等于目标对象已经批准，未登记目标必须保留为 unresolved，不得自动创建占位对象。

### 5.2 本阶段支持的关系路径

- JD → GT：概念引用治理标准；
- GT → LAW：治理标准引用法律政策；
- CASE → JD：案例引用概念与解释框架；
- QA → 多个知识对象：标准问答组合引用 JD、GT、CASE、LAW、Tool、Product 或 Course；
- 任意对象 → Tool / Product / Course：用于后续学习、实践或产品连接，但不表示商业推荐或批准关系。

Foundation Engine继续兼容 `RELATED_JD`、`RELATED_GT`、`RELATED_GT_PACKAGE`、`RELATED_CASE`、`RELATED_FAQ`、`RELATED_LAW`，本次增加 `RELATED_TOOL`、`RELATED_PRODUCT` 和 `RELATED_COURSE`。QA仍映射至现有 `RELATED_FAQ`，避免破坏已发布路由与 Topic 契约。

### 5.3 关系约束

1. 目标使用稳定对象 ID，不使用 URL、标题或文件名；
2. 同一对象内重复目标去重；
3. 允许登记尚未注册的目标，但校验必须报告 unresolved；
4. 引用不传递生命周期，不得因引用 Approved 对象而自动 Approved；
5. 删除、替代或归档对象时，必须执行反向引用影响检查；
6. 复杂关系属性未来可升级为独立关系记录，本阶段不引入数据库或图数据库。

## 六、导入与校验流程

后续自动导入按以下顺序执行：

1. 接收 Markdown 和 Metadata；
2. 依据统一 Schema 校验必填字段、枚举、ID、版本与日期；
3. 依据 `object-types.v1.json` 确定对象目录和 QA/FAQ 兼容映射；
4. 检查 `object_id` 唯一性和版本冲突；
5. 解析 `relations` 并生成关系记录；
6. 保留 unresolved 引用并输出校验提示；
7. 根据既有生命周期配置计算 Foundation Ready；
8. 更新 Registry 和关系索引；
9. 由 Repository Adapter 向网站、搜索或未来 API 提供稳定数据。

导入工具不得修改知识正文、猜测缺失 Metadata、自动批准对象或将 Candidate 直接公开。

## 七、与现有系统的兼容

- `knowledge/foundation/index.json`、Manifest 和批准记录继续承担现有正式对象治理职责；
- `lib/foundation/` 继续作为生命周期、Registry、Package 和关系引擎；
- 现有 JD、GT Package、CASE、FAQ、LAW、RESEARCH 和 STANDARD 处理保持有效；
- QA通过FAQ兼容层读取，不改变现有 `/faq/` 路由；
- 本次新增对象类型和关系枚举是增量扩展，不要求迁移现有对象；
- 网站只消费 Repository 已确认可公开的数据，不扫描新目录或因目录存在而展示内容。

## 八、后续扩展建议

1. 为 Schema 增加专项子契约，例如 `law.v1`、`case.v1`、`course.v1`；
2. 建立独立 import validate 命令，在写入 Registry 前校验 Metadata；
3. 为关系增加 `relation_id`、证据和有效期，形成可审计关系记录；
4. 建立反向引用索引和版本影响报告；
5. 在对象规模增长后接入全文索引，保持 Repository 返回契约不变；
6. 只有在文件系统与现有 Registry 无法满足规模、并发或审计要求时，再经 ADR 评估数据库；
7. JD034及后续对象应先按本 Metadata 契约形成审核稿，经 Architecture Review批准后再执行 Foundation 入库。

## 九、验收边界

No.026 完成的事实包括：

- 八类知识对象具有统一目录登记；
- 新对象具有统一、机器可校验的 Metadata 契约；
- 引用关系可覆盖 JD、GT、Case、Law、QA、Tool、Product 和 Course；
- Foundation Engine可识别新增对象类型及其关系；
- 现有 Foundation 正文、Manifest、生命周期、页面、视觉、AI和Prompt保持不变。

本文件处于 `in_review`。提交、推送或合并不等于项目总架构师批准。
