# UI Design System

项目：社区治理协同平台

视觉方向：Apple Keynote + Palantir + Bloomberg + OpenAI 发布会。

目标：让界面像城市级治理操作系统，而不是传统后台或廉价科技大屏。

## 1. UI原则

- 信息优先，装饰克制。
- 组件服务治理研判，不服务炫技。
- 高密度信息必须有清晰层级。
- 深色背景上使用低对比边框和灰调青绿色高亮。
- 所有状态都要可信、可解释、可复盘。

## 2. 色彩

### 背景

- Deep Graphite：`#0B1110`
- Governance Black Green：`#0E1A17`
- Charcoal Surface：`#151C1A`

### 主色

- Civic Teal：`#4FBDA8`
- Muted Teal：`#6FAFA2`
- Dark Teal：`#1F6F63`

### 文本

- Off White：`#F3F6F4`
- Soft Gray：`#B8C4BF`
- Data Gray：`#7E8D88`

### 边框

- Divider Gray：`#2A3431`
- Teal Border：`rgba(79, 189, 168, 0.28)`

### 风险

- Signal Amber：`#B88945`
- Soft Amber：`#D6B06B`
- Restrained Red：`#A85D55`

## 3. 字体

### 中文

- PingFang SC
- Source Han Sans
- Noto Sans SC

### 英文与数字

- Inter
- SF Pro
- IBM Plex Sans

### 层级

- Display：56-88px，700-800
- Page Title：36-56px，650-750
- Section Title：20-28px，600-700
- Metric Number：28-48px，650-750
- Body：15-17px，line-height 1.6-1.8
- Meta：11-13px，500-700

## 4. 组件

### Command Header

用途：城市治理控制台顶部状态区。

包含：

- 平台名称
- 当前视图
- 城市范围
- 更新时间
- AI 状态

规范：

- 高度 56-64px
- 背景深色
- 底部 1px 分割线
- 不使用强发光 logo

### Metric Tile

用途：关键指标。

结构：

- 小标签
- 主数值
- 单位
- 趋势说明

规范：

- 深色 surface
- 1px 边框
- 数字清晰
- 趋势色低饱和

### Governance Card

用途：政策、案例、AI 建议。

结构：

- 标题
- 分类
- 地区
- 摘要
- 状态
- 标签

规范：

- 中等信息密度
- 不使用大图装饰
- 标签小而清晰

### Risk Card

用途：风险预警。

结构：

- 风险等级
- 事件类型
- 触发信号
- 影响范围
- 建议动作

规范：

- 中风险使用 Amber
- 高风险少量使用 Restrained Red
- 禁止闪烁

### AI Analysis Panel

用途：AI 研判结果。

结构：

- 输入来源
- 分析状态
- 摘要
- 关联案例
- 建议动作

规范：

- 不拟人化
- 不使用聊天头像
- 像分析工作台

## 5. 布局

推荐控制台布局：

```text
顶部：Command Header
左侧：Map / City Layer
右侧：AI Analysis Panel
底部：Key Metrics
侧边：Risk Queue / Case Feed
```

## 6. 禁止项

- 高饱和蓝紫
- 霓虹灯效
- 大面积发光
- 游戏 HUD
- 花字
- 卡片堆叠过多
- 圆角过大
- 重阴影
