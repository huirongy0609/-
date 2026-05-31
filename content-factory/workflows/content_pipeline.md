# Content Pipeline｜内容生产流程

这个流程用于把 `inputs/topic.txt` 里的一个主题，逐步生产成完整内容包。

## 阶段 1：人工半自动流程

当前项目第一阶段不接复杂 API，不自动发布。你可以手动把主题和提示词复制到任意大模型工具中执行。

推荐顺序：

1. 打开 `inputs/topic.txt`，写入本次主题。
2. 使用 `prompts/01_topic_agent.md` 生成爆款选题分析。
3. 把主题和选题分析交给 `prompts/02_title_agent.md` 生成标题库。
4. 选择一个主标题，交给 `prompts/03_wechat_writer_agent.md` 生成公众号长文。
5. 把核心观点交给 `prompts/04_short_video_agent.md` 生成短视频口播稿。
6. 把主题、选题分析和产品方向交给 `prompts/05_live_selling_agent.md` 生成直播转化稿。
7. 把主题和核心观点交给 `prompts/06_xiaohongshu_agent.md` 生成小红书文案。
8. 把主题和内容方向交给 `prompts/07_cover_prompt_agent.md` 生成封面图提示词。
9. 把口播稿交给 `prompts/08_video_storyboard_agent.md` 生成视频分镜脚本。
10. 把全部内容交给 `prompts/09_quality_check_agent.md` 做质量检查。
11. 把最终内容整理进 `outputs/content_package.md`。

## 阶段 2：一键生成脚本

第二阶段可以增加一个本地脚本，例如：

```text
scripts/run_pipeline.js
```

脚本负责：

1. 读取 `inputs/topic.txt`。
2. 读取 `prompts/` 中的 Agent 提示词。
3. 按顺序调用大模型。
4. 把每一步输出作为下一步输入。
5. 汇总生成 `outputs/content_package.md`。
6. 可选生成 `outputs/{日期}-{主题}/` 文件夹，分别保存公众号、短视频、小红书、直播稿等内容。

## 推荐的数据流

```text
topic.txt
  -> 01_topic_agent
  -> 02_title_agent
  -> 03_wechat_writer_agent
  -> 04_short_video_agent
  -> 05_live_selling_agent
  -> 06_xiaohongshu_agent
  -> 07_cover_prompt_agent
  -> 08_video_storyboard_agent
  -> 09_quality_check_agent
  -> content_package.md
```

## 质量门槛

生成 `content_package.md` 前，必须确认：

- 每个模块都有完整正文。
- 公众号文章符合七段结构。
- 短视频有自然转化收口。
- 直播稿有卖书、卖课或服务转化。
- 小红书文案有标题、正文、标签、评论引导。
- 封面图提示词能直接交给绘图工具。
- 分镜脚本能被普通创作者直接拍摄。
- 最终发布清单可勾选执行。
