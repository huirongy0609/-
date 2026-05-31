# Motion System Guide

动效目标：解释治理状态变化，而不是炫技。

## 1. 动效原则

- 低频
- 稳定
- 有目的
- 不抢信息
- 不制造兴奋感

## 2. 基础动效

### Fade In

用途：

- 面板出现
- 标题出现
- 标签出现

时长：

- 200-320ms

### Slide In

用途：

- AI 面板进入
- 风险队列展开
- 城市详情卡出现

时长：

- 280-420ms

### Scale In

用途：

- 城市节点点亮
- 风险节点出现

时长：

- 300-500ms

### Data Flow

用途：

- 城市连接
- 案例复用
- 政策同步

时长：

- 2-4s

### Risk Pulse

用途：

- 中风险提醒

时长：

- 1.2-2s

## 3. 缓动

推荐：

```text
cubic-bezier(0.22, 1, 0.36, 1)
ease-out
```

避免：

- bounce
- elastic
- overshoot
- shake

## 4. 地图动效

允许：

- 节点呼吸
- 节点点亮
- 连接线出现
- 数据粒子缓慢移动
- 视角平滑拉远

禁止：

- 快速旋转
- 地球飞入
- 大量粒子
- 霓虹扫屏

## 5. 风险动效

风险动效必须克制。

步骤：

1. Amber 风险点出现。
2. 一圈弱扩散。
3. 第二圈低透明扩散。
4. AI 扫描线经过。
5. 风险标签出现。
6. 扩散停止，变成稳定状态。

禁止：

- 红色闪烁
- 警报灯
- 爆炸
- 剧烈震动

## 6. UI面板动效

### AI Analysis Panel

- 从右侧滑入
- 背景轻微 blur
- 状态条依次加载
- 不使用聊天气泡弹跳

### Metric Tile

- 数字缓慢滚动
- 趋势线轻微绘制
- 不使用夸张翻牌

### City Card

- 从节点旁展开
- 边框先出现
- 内容淡入
- 不弹跳

## 7. 镜头运动

### Slow Push

用于进入指挥中心。

### Pull Back

用于小区到城市、城市到全国。

### Lateral Pan

用于驾驶舱和城市卡片浏览。

### Static Hold

用于关键判断和结尾。

## 8. 转场

推荐：

- soft cut
- fade
- map zoom
- panel wipe
- data-line transition

避免：

- glitch
- flash
- spin
- cube
- lens flare burst
