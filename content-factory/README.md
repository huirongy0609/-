# AI 内容自动生产机器

这是一个本地可运行的半自动内容生产系统。你只需要输入一个主题，系统就会按一组中文 Agent 提示词，生产一整套内容包：

- 爆款选题分析
- 标题库
- 公众号长文
- 短视频口播稿
- 直播转化稿
- 小红书文案
- 封面图提示词
- 视频分镜脚本
- 最终发布清单

第一阶段不做自动发布，不接复杂 API，重点是把内容生产流程和提示词标准搭好。第二阶段加入本地 Python 脚本跑通流程。第三阶段已经接入 OpenAI API 调用层，可以生成真实内容包。

## 怎么输入主题

打开：

```text
inputs/topic.txt
```

把里面的示例主题替换成你的主题，例如：

```text
普通人如何用 AI 提升收入
```

主题可以很短，但建议包含：

- 面向谁
- 解决什么问题
- 希望转化什么产品或服务

例如：

```text
职场新人如何用 AI 提升工作效率，并自然转化到 AI 办公课
```

## 每个 Agent 的作用

| 文件 | 作用 |
|---|---|
| `prompts/00_master_controller.md` | 总控 Agent，负责组织完整内容生产包 |
| `prompts/01_topic_agent.md` | 爆款选题分析，把普通主题变成有传播力的选题 |
| `prompts/02_title_agent.md` | 生成公众号、短视频、小红书、直播间标题 |
| `prompts/03_wechat_writer_agent.md` | 写公众号长文，固定使用七段结构 |
| `prompts/04_short_video_agent.md` | 生成 60 秒和 90 秒短视频口播稿 |
| `prompts/05_live_selling_agent.md` | 生成直播转化稿，支持卖书、卖课、服务 |
| `prompts/06_xiaohongshu_agent.md` | 生成小红书标题、正文、标签和互动话术 |
| `prompts/07_cover_prompt_agent.md` | 生成公众号、短视频、小红书封面图提示词 |
| `prompts/08_video_storyboard_agent.md` | 把口播稿拆成可拍摄的视频分镜 |
| `prompts/09_quality_check_agent.md` | 检查内容包质量，并给出修改建议 |

## 风格训练库

## Brand OS 品牌操作系统

当前系统新增 `brand_os/`，作为所有内容生成之前的前置品牌层。

它不是新 Agent，而是一套统一规则，用来锁定：

- 世界观：信托制物业是一套关于“信任如何被重新建立”的新治理文明。
- 语言气质：短句、克制、冷静、有判断，像纪录片旁白。
- 情绪节奏：安静进入、压力显影、根因浮现、秩序出现、稳定收口。
- 视觉哲学：档案馆、公共空间、治理账本、时间痕迹、建筑感。
- 禁止规则：禁止 SaaS 感、培训机构感、课程销售感、国产营销页感。
- 品牌人格：公共治理研究者、制度设计者、纪录片导演、档案管理员。

默认运行时，系统只注入 `brand_os/brand_os_compact.md`，保持低 token 消耗。需要重写官网、品牌手册、书籍介绍等核心资产时，可关闭 LOW_TOKEN_MODE 读取完整 Brand OS。

## 风格训练库

第四阶段新增了 `style_training/`，用于让所有 Agent 统一学习内容风格：

| 文件 | 作用 |
|---|---|
| `style_training/style_rules.md` | 总风格规则，约束每段的信息密度、观点、情绪和节奏 |
| `style_training/tone_library.md` | 情绪语气库，包含压迫感、冲突感、阶层感、危机感等表达 |
| `style_training/emotional_hooks.md` | 开头钩子库，强化前三秒和第一段抓人能力 |
| `style_training/transition_patterns.md` | 转折结构库，让内容有情绪推进 |
| `style_training/closing_templates.md` | 自然转化收口库，支持卖书、卖课、卖服务 |
| `style_training/viral_structures.md` | 爆款结构库和爆款浓度评分标准 |

脚本运行时会自动把这些风格规则注入每个 Agent，不需要手动复制。

## 一次完整内容生产流程怎么跑

### 方式一：真实 AI 一键生成

先在 `inputs/topic.txt` 写入主题，然后在项目目录运行：

```text
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env
```

打开 `.env`，填入：

```text
OPENAI_API_KEY=你的 API Key
```

然后运行：

```text
.venv/bin/python run_pipeline.py
```

也可以直接传入主题并指定输出文件：

```text
.venv/bin/python run_pipeline.py --topic "普通人如何用 AI 提升内容创作效率" --output outputs/demo_ai_content.md
```

稳定生产阶段推荐使用 `--lite`，只生成标题、公众号长文、短视频口播：

```text
.venv/bin/python run_pipeline.py --lite
```

`LOW_TOKEN_MODE` 默认开启。日常运行不要关闭它。只有确实需要完整风格库时，才使用：

```text
.venv/bin/python run_pipeline.py --full-style
```

脚本会依次读取 `prompts/` 下的 10 个 Agent 提示词，调用 OpenAI API，并把结果汇总到：

```text
outputs/content_package.md
```

可选配置：

```text
OPENAI_MODEL=gpt-5.2
OPENAI_TEMPERATURE=0.8
OPENAI_MAX_TOKENS=6000
OPENAI_TIMEOUT=120
QUALITY_MAX_ROUNDS=1
```

稳定生产阶段已关闭自动多轮重写和自动持续优化。`quality_check` 最多执行一次。

### 方式二：人工半自动流程

如果暂时不运行脚本，也可以手动操作：

1. 在 `inputs/topic.txt` 写入主题。
2. 复制 `prompts/01_topic_agent.md`，把主题填进去，生成选题分析。
3. 把主题和选题分析填入 `prompts/02_title_agent.md`，生成标题库。
4. 选择一个主标题，填入 `prompts/03_wechat_writer_agent.md`，生成公众号长文。
5. 把主题、选题分析、文章核心观点填入 `prompts/04_short_video_agent.md`，生成短视频口播稿。
6. 把主题、选题分析、产品方向填入 `prompts/05_live_selling_agent.md`，生成直播转化稿。
7. 把主题、选题分析、核心观点填入 `prompts/06_xiaohongshu_agent.md`，生成小红书文案。
8. 把主题和内容方向填入 `prompts/07_cover_prompt_agent.md`，生成封面图提示词。
9. 把短视频口播稿填入 `prompts/08_video_storyboard_agent.md`，生成视频分镜脚本。
10. 把完整内容包填入 `prompts/09_quality_check_agent.md`，做质量检查。
11. 把最终版本整理到 `outputs/content_package.md`。

## 输出放在哪里

所有最终内容建议放在：

```text
outputs/
```

推荐文件名：

```text
outputs/content_package.md
```

如果一次生产多个主题，可以按日期和主题创建文件：

```text
outputs/2026-05-18-AI提效内容包.md
```

## 后续如何升级成自动化脚本

当前 `run_pipeline.py` 会自动完成下面的事：

1. 读取 `inputs/topic.txt`。
2. 读取当前 Agent 必要提示词。
3. 注入 Brand OS 和风格训练短规则。
4. 按顺序调用 OpenAI API。
5. 把必要上游输出传给下一步。
6. 生成完整内容包草稿。
7. 运行 `quality_check_agent` 做一次质量检查。
8. 保存到 `outputs/content_package.md`。

运行命令：

```text
python3 run_pipeline.py
```

后续还可以继续升级：

- 增加配置文件，选择内容风格、目标平台、产品类型。
- 增加历史选题库，避免重复选题。
- 增加人工复盘流程，根据评分决定下一次选题和人工修改方向。
- 增加多文件输出，把公众号、短视频、小红书、直播稿分开保存。
- 接入图片生成工具，自动生成封面图。
- 接入剪辑工具，自动生成视频草稿。

## 当前系统架构

```text
run_pipeline.py
  -> core/prompt_loader.py      读取 Agent 提示词
  -> brand_os/*.md              注入品牌世界观、语言气质、视觉哲学和禁止规则
  -> style_training/*.md        注入统一内容风格
  -> core/ai_client.py          统一调用 OpenAI API
  -> core/pipeline_engine.py    控制 Agent 顺序、必要上下文传递、单次质检
  -> analytics/scoring_engine.py          本地内容评分
  -> analytics/viral_pattern_detector.py  爆款结构识别
  -> analytics/performance_logger.py      记录历史表现数据
  -> core/markdown_exporter.py  导出最终 Markdown 内容包
```

## 系统冻结

当前项目已经进入稳定生产阶段，规则见：

- `SYSTEM_FREEZE.md`
- `AGENTS.md`

当前不再新增模块，不再做无限优化，不再做大型重构。唯一目标是稳定生成、稳定发布、稳定收集数据。

## 数据反馈学习能力

第五阶段新增 `analytics/`，让系统开始分析哪些内容更可能表现好：

| 文件 | 作用 |
|---|---|
| `analytics/metrics_definition.md` | 定义评分维度和评分标准 |
| `analytics/scoring_engine.py` | 对开头、情绪、冲突、金句、传播、完读、转化、人味、AI 味、爆款潜力打分 |
| `analytics/viral_pattern_detector.py` | 识别标题模式、开头模式、情绪节奏、转折结构、收口方式 |
| `analytics/rewrite_optimizer.py` | 已保留为历史工具，稳定生产阶段不自动调用 |
| `analytics/performance_logger.py` | 把每次生成的评分、模式和优化轮次写入 `outputs/performance_log.jsonl` |

每次生成后，最终内容包会包含 `# 数据复盘`，展示评分、最强段、最弱段、AI 味段落和人工优化建议；不会自动改写正文。

## 内容运营系统

第六阶段新增 `operations/`，用于把内容生产接到真实运营：

| 文件 | 作用 |
|---|---|
| `operations/publish_calendar.md` | 未来 30 天内容规划、日更节奏、周复盘节奏、爆款追踪节奏 |
| `operations/platform_strategy.md` | 公众号、小红书、视频号、抖音的平台差异和改写策略 |
| `operations/account_matrix.md` | 主号、切片号、情绪号、AI号、财富号的账号矩阵 |
| `operations/content_tracking.csv` | 内容数据跟踪表，记录标题、平台、发布时间、阅读、点赞、收藏、评论、转化 |
| `operations/viral_case_library.md` | 爆款案例库，沉淀标题、开头、情绪、节奏、收口 |
| `operations/audience_profiles.md` | 焦虑中产、创业者、AI 从业者、普通打工人的用户画像 |

推荐运营动作：

1. 每天按 `publish_calendar.md` 选择主题。
2. 运行 `run_pipeline.py` 生成内容包。
3. 按 `platform_strategy.md` 改写到不同平台。
4. 按 `account_matrix.md` 分发到不同账号。
5. 发布后把数据填入 `content_tracking.csv`。
6. 表现好的内容写入 `viral_case_library.md`。
7. 每周根据数据更新选题方向和账号策略。

## 商业化变现系统

第七阶段新增 `monetization/`，用于把内容、运营和私域接到现金流：

| 文件 | 作用 |
|---|---|
| `monetization/offer_system.md` | 定义核心 Offer，明确用户买的不是工具，而是内容商业化确定性 |
| `monetization/product_ladder.md` | 免费内容、引流产品、核心产品、高客单服务、私董咨询的产品阶梯 |
| `monetization/conversion_funnels.md` | 内容到关注、私信、社群、咨询、成交的转化漏斗 |
| `monetization/trust_building_system.md` | 专业感、信任感、权威感、稀缺感的建立方式 |
| `monetization/lead_magnet_system.md` | 资料包、小课、模板等引流产品和私信承接流程 |
| `monetization/consultation_script.md` | 高客单咨询脚本和异议回应 |
| `monetization/community_strategy.md` | 免费群、付费群、陪跑群的运营与转化策略 |
| `monetization/sales_content_templates.md` | 卖课、卖咨询、卖服务、卖社群、卖 AI 系统的自然转化模板 |

商业化路径：

```text
内容曝光
  -> 关注 / 收藏 / 评论
  -> 私信领取资料
  -> 社群承接
  -> 直播 / 咨询
  -> 训练营 / 服务 / 私董成交
  -> 复购 / 转介绍
```

## 项目边界

当前项目只负责内容生产，不负责自动发布。

你可以把它理解成一个本地内容工厂：先把选题和文案生产稳定，再考虑接自动化、图片、视频和发布平台。
