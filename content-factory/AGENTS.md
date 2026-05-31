# AGENTS｜Codex 项目操作说明

本文件给 Codex 使用，约束后续在 `content-factory` 中的行为。

## 1. 项目目标

`content-factory` 是一个稳定生产阶段的 AI 内容公司系统。

当前目标只有三个：

1. 稳定生成。
2. 稳定发布。
3. 稳定收集数据。

不要继续扩展新模块。不要继续做大型架构升级。

## 2. 内容风格

所有内容生成前，先遵守 `brand_os/`，再参考 `style_training/`。

Brand OS 最高规则：

- 信托制物业不是普通物业服务、SaaS、培训课或咨询包装。
- 它是一套关于“信任如何被重新建立”的新治理文明。
- 语言要像纪录片旁白：短句、克制、冷静、有判断。
- 核心圣物是“共同资产治理账本”，代表信任被记录下来的证据。
- 禁止把内容写成招生页、销售页、国产营销页。

内容风格参考：

- 中文头部自媒体。
- 有冲突、有情绪、有传播感。
- 有信息密度和节奏。
- 不像 AI。
- 不写空话、套话、正能量废话。
- 转化自然，不硬卖，不承诺保证结果。

## 3. 文件结构

核心目录：

```text
inputs/              输入主题
prompts/             Agent 提示词
brand_os/            品牌操作系统，内容生成前置规则
style_training/      风格训练规则
core/                API 调用、流水线、导出
analytics/           本地评分和数据复盘
operations/          发布、平台、账号、数据跟踪
monetization/        产品、漏斗、私域、销售
outputs/             内容包和日志
```

稳定生产相关文件：

```text
run_pipeline.py
SYSTEM_FREEZE.md
AGENTS.md
operations/content_tracking.csv
outputs/performance_log.jsonl
```

## 4. 禁止事项

禁止：

- 自动增加模块。
- 大型重构。
- 无限优化。
- 无限重写。
- 多轮评分循环。
- Agent 递归调用。
- 默认扫描全项目。
- 默认读取所有文件。
- 默认把完整上游内容传给所有 Agent。
- 绕过 Brand OS 直接生成内容。
- 把信托制物业写成普通课程、普通咨询或普通物业服务。
- 在没有用户明确要求时接自动发布、热点抓取、评论互动、私域 CRM。

## 5. Token 节省原则

必须遵守：

- 优先读取当前任务需要的文件。
- 不重复扫描全项目。
- 不重复读取所有 prompts。
- 不重复读取 `brand_os/` 全量内容，默认只注入 `brand_os/brand_os_compact.md`。
- 不重复读取 `style_training/` 全量内容。
- 默认使用 LOW_TOKEN_MODE。
- Agent 只读取自己的 prompt 和必要上游输出。
- quality_check 只执行一次。
- 本地 analytics 只评分一次，不改写正文。
- 日常内容优先使用 `--lite`。

## 6. 推荐工作方式

如果用户要日常生产内容：

```text
.venv/bin/python run_pipeline.py --lite
```

如果用户要完整内容包：

```text
.venv/bin/python run_pipeline.py
```

如果用户要改系统：

先判断是否违反 `SYSTEM_FREEZE.md`。如果是新增模块、无限优化或大型重构，应拒绝扩展，建议进入稳定发布和数据记录。
