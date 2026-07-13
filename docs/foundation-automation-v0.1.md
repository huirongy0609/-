# Foundation Knowledge Pack 自动索引与一致性校验机制 V0.1

> 对应任务：Codex任务单 No.007
>
> 技术状态：V0.1
>
> 适用范围：Foundation Knowledge Pack

## 一、机制定位

本机制将Foundation Manifest转换为稳定的机器可读索引，并对Manifest、正式目录、Draft隔离区、README、Audit Report和索引执行一致性校验。

权威关系如下：

```text
项目总架构师批准决定
  ↓
Foundation Manifest人工登记
  ↓
index.json自动生成
  ↓
自动一致性校验
```

`index.json`是Manifest的机器可读生成物，不是新的批准来源，也不得取代Manifest和批准记录。

## 二、文件

| 文件 | 用途 |
| --- | --- |
| `knowledge/foundation/index.json` | 面向网站、知识中心和AI的机器可读索引 |
| `scripts/generate-foundation-index.mjs` | 从Manifest生成索引 |
| `scripts/validate-foundation.mjs` | 对Foundation执行只读检查；可写出校验报告 |
| `docs/foundation-validation-report.md` | 最近一次自动校验结果 |

## 三、命令

只生成索引：

```bash
npm run foundation:index
```

只校验现有索引并更新报告：

```bash
npm run foundation:validate
```

重新生成索引并校验：

```bash
npm run foundation:refresh
```

校验发现错误时返回非零退出码。警告不会阻断执行，但会进入报告。

## 四、索引字段

每个对象至少包含：

- `id`：知识对象ID；
- `title`：正式登记标题；
- `version`：可核实版本，无法核实时为`null`；
- `version_note`：Manifest中的原始版本说明；
- `lifecycle_status`：生命周期状态，尚无生命周期决定时为`null`；
- `source_audit_status`：原件审计状态，原件或候选已取得时为`null`；
- `file_path`：Foundation正式文件或Draft候选路径；
- `object_type`：对象类型；
- `approved_at`：批准日期，未批准时为`null`；
- `approval_record`：批准记录，未批准时为`null`；
- `status_evidence`：Manifest中的状态判断证据；
- `sha256`：文件校验值；
- `related_objects`：已经在Manifest解析的关联对象及其当前生命周期状态；
- `last_updated`：最后更新时间；当前Manifest未登记时保持`null`。

任何缺失值都保持`null`或保留Manifest原始说明，脚本不得推测。

## 五、自动校验范围

校验脚本检查：

- Manifest与`index.json`对象记录和汇总是否一致；
- Approved对象是否存在于Foundation正式目录；
- Draft是否位于独立隔离区；
- 正式目录和Draft目录是否存在未登记Markdown文件；
- ID是否重复；
- 路径是否有效；
- SHA-256是否一致；
- 生命周期状态是否符合AR-004；
- `not_found`是否只用于原件审计状态；
- 已解析关联对象是否存在、状态是否一致；
- README、Manifest和Audit Report的数量统计是否一致。

脚本不会修改知识正文、Manifest、Audit或生命周期状态，也不会把Draft自动升级为Approved。

## 六、JD009后续入库步骤

本任务不创建JD009对象。未来JD009完成审核后，按以下顺序执行：

1. Work提交JD009 V1.0审核稿，生命周期为`in_review`。
2. 项目总架构师明确批准具体正文、版本和`approved`状态。
3. Codex保存批准原文至Foundation正式目录，不改正文。
4. 在Manifest登记JD009标题、版本、生命周期、正式路径、批准日期、批准记录和SHA-256。
5. 在Audit Report记录来源、判断依据、版本冲突和入库结论。
6. 在Manifest引用关系表登记已经核实的JD005、JD006、JD007 Draft、JD008 Draft、GT-B07和GT-B08关系；Draft关系必须保留状态。
7. 运行`npm run foundation:index`更新机器索引。
8. 运行`npm run foundation:validate`，确认错误项为0。
9. 提交JD009原件、Manifest、Audit、索引和校验报告。

只有步骤2由项目总架构师决定`approved`；步骤3—9是Codex的Repository Update执行过程。

## 七、维护规则

- Manifest继续作为人工登记源，不手工编辑`index.json`。
- 批准、状态变化、版本替代、归档或引用关系变化后，应重新生成索引并校验。
- 自动化发现差异时只报告，不自动修复知识内容或治理状态。
- Website、知识中心和AI只读取索引中明确登记的数据，并同时识别生命周期状态。
