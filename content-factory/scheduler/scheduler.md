# Scheduler｜生产调度说明

## 当前自动任务

App 级 cron 已存在：

- 名称：物业行业IP每日内容生产
- 状态：ACTIVE
- 时间：每天 08:00
- 工作目录：`/Users/Administrator/Documents/New project/content-factory`

## 文件系统调度规则

每日生产不依赖新增代码，按以下顺序执行：

1. 读取 `scheduler/topic_queue.md`。
2. 检查 `topics.md`，避免重复。
3. 生成公众号、短内容、口播和选题说明。
4. 保存到 `content_library/` 对应目录。
5. 更新 `topics.md`。
6. 记录到 `logs/daily_production_log.md`。

## 失败处理

如果 App 自动任务未运行：

1. 人工启动当天生产。
2. 不开发新功能。
3. 不等待用户指定主题。
4. 从 topic queue 中选择下一条未完成选题。
