# Design Token System

项目：社区治理协同平台

用途：统一视觉语言，避免页面、视频画面和演示物料出现风格漂移。

## 1. Token 命名原则

Token 命名只表达语义，不表达具体页面。

推荐结构：

```text
color.background.primary
color.surface.default
color.text.primary
color.signal.riskMedium
spacing.6
radius.card
motion.panel.enter
```

禁止：

- `homeGreen`
- `bigBlue`
- `cyberGlow`
- `mapCardColor1`

## 2. Color Tokens

### Background

| Token | Value | 用途 |
|---|---:|---|
| `color.background.primary` | `#0B1110` | 页面主背景 |
| `color.background.secondary` | `#0E1A17` | 大屏次背景 |
| `color.background.elevated` | `#151C1A` | 卡片和控制台表面 |
| `color.background.overlay` | `rgba(11, 17, 16, 0.78)` | 弹层、地图标签 |

### Surface

| Token | Value | 用途 |
|---|---:|---|
| `color.surface.default` | `#151C1A` | 默认卡片 |
| `color.surface.subtle` | `#111715` | 次级模块 |
| `color.surface.tealTint` | `rgba(79, 189, 168, 0.08)` | 选中或 AI 分析区 |
| `color.surface.amberTint` | `rgba(184, 137, 69, 0.10)` | 中风险提示 |

### Text

| Token | Value | 用途 |
|---|---:|---|
| `color.text.primary` | `#F3F6F4` | 主文本 |
| `color.text.secondary` | `#B8C4BF` | 正文和说明 |
| `color.text.tertiary` | `#7E8D88` | 元信息 |
| `color.text.inverse` | `#0B1110` | 浅色按钮文字 |

### Brand

| Token | Value | 用途 |
|---|---:|---|
| `color.brand.primary` | `#4FBDA8` | 关键高亮、主按钮 |
| `color.brand.muted` | `#6FAFA2` | 图表、细线 |
| `color.brand.dark` | `#1F6F63` | 深色状态 |
| `color.brand.border` | `rgba(79, 189, 168, 0.28)` | 选中边框 |

### Signal

| Token | Value | 用途 |
|---|---:|---|
| `color.signal.info` | `#6FAFA2` | 信息状态 |
| `color.signal.success` | `#4FBDA8` | 已完成、已生成 |
| `color.signal.riskMedium` | `#B88945` | 中风险 |
| `color.signal.riskLow` | `#D6B06B` | 低风险/待关注 |
| `color.signal.riskHigh` | `#A85D55` | 高风险，限制使用 |

### Border

| Token | Value | 用途 |
|---|---:|---|
| `color.border.default` | `#2A3431` | 默认边框 |
| `color.border.subtle` | `rgba(184, 196, 191, 0.10)` | 低对比分割 |
| `color.border.active` | `rgba(79, 189, 168, 0.34)` | 选中态 |
| `color.border.warning` | `rgba(184, 137, 69, 0.34)` | 风险态 |

## 3. Typography Tokens

### Font Family

| Token | Value |
|---|---|
| `font.family.zh` | `PingFang SC, Noto Sans SC, Source Han Sans, sans-serif` |
| `font.family.en` | `Inter, SF Pro Display, IBM Plex Sans, sans-serif` |
| `font.family.mono` | `IBM Plex Mono, SFMono-Regular, monospace` |

### Font Size

| Token | Value | 用途 |
|---|---:|---|
| `font.size.11` | `11px` | 小标签 |
| `font.size.12` | `12px` | 元信息 |
| `font.size.14` | `14px` | 辅助文本 |
| `font.size.16` | `16px` | 正文 |
| `font.size.20` | `20px` | 卡片标题 |
| `font.size.28` | `28px` | 区块标题 |
| `font.size.40` | `40px` | 页面标题 |
| `font.size.56` | `56px` | 演示标题 |
| `font.size.72` | `72px` | 发布会级主标题 |

### Line Height

| Token | Value |
|---|---:|
| `font.line.tight` | `1.15` |
| `font.line.normal` | `1.45` |
| `font.line.relaxed` | `1.65` |
| `font.line.article` | `1.8` |

## 4. Spacing Tokens

| Token | Value |
|---|---:|
| `spacing.1` | `4px` |
| `spacing.2` | `8px` |
| `spacing.3` | `12px` |
| `spacing.4` | `16px` |
| `spacing.5` | `20px` |
| `spacing.6` | `24px` |
| `spacing.8` | `32px` |
| `spacing.10` | `40px` |
| `spacing.12` | `48px` |
| `spacing.16` | `64px` |
| `spacing.20` | `80px` |

## 5. Radius Tokens

| Token | Value | 用途 |
|---|---:|---|
| `radius.none` | `0` | 地图线框 |
| `radius.xs` | `4px` | 标签 |
| `radius.sm` | `6px` | 小按钮 |
| `radius.card` | `8px` | 卡片 |
| `radius.panel` | `10px` | 大面板 |
| `radius.full` | `999px` | 节点、胶囊标签 |

限制：

- 常规卡片不超过 `8px`。
- 不使用软萌大圆角。

## 6. Shadow Tokens

默认不依赖阴影建立层级。

| Token | Value | 用途 |
|---|---|---|
| `shadow.none` | `none` | 默认 |
| `shadow.subtle` | `0 8px 24px rgba(0,0,0,0.18)` | 轻浮层 |
| `shadow.panel` | `0 18px 48px rgba(0,0,0,0.24)` | 弹出面板 |

禁止：

- 彩色发光阴影。
- 重投影。
- 卡片悬浮过强。

## 7. Motion Tokens

| Token | Value | 用途 |
|---|---:|---|
| `motion.duration.fast` | `140ms` | hover |
| `motion.duration.base` | `220ms` | 按钮、卡片 |
| `motion.duration.panel` | `360ms` | 面板进入 |
| `motion.duration.map` | `700ms` | 地图层切换 |
| `motion.duration.narrative` | `1200ms` | 视频叙事镜头 |

| Token | Value |
|---|---|
| `motion.ease.standard` | `cubic-bezier(0.2, 0, 0.2, 1)` |
| `motion.ease.out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `motion.ease.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` |

## 8. Data Visualization Tokens

### Chart Colors

| Token | Value |
|---|---:|
| `chart.primary` | `#4FBDA8` |
| `chart.secondary` | `#6FAFA2` |
| `chart.neutral` | `#7E8D88` |
| `chart.warning` | `#B88945` |
| `chart.highRisk` | `#A85D55` |

### Map Layers

| Token | Value |
|---|---:|
| `map.line.province` | `rgba(184,196,191,0.18)` |
| `map.line.city` | `rgba(184,196,191,0.12)` |
| `map.node.active` | `#4FBDA8` |
| `map.node.pending` | `rgba(126,141,136,0.46)` |
| `map.flow.case` | `rgba(79,189,168,0.42)` |
| `map.heat.risk` | `rgba(184,137,69,0.16)` |

## 9. Token 使用禁令

- 不新增页面专属颜色。
- 不新增高饱和科技蓝。
- 不使用随机渐变。
- 不用发光替代信息层级。
- 不把风险全部显示为红色。

