# Figma UI Spec

项目：社区治理协同平台

用途：给设计师、产品、前端在 Figma 中建立统一文件结构与组件规格。

## 1. Figma 文件结构

推荐页面：

```text
00 Cover
01 Design Tokens
02 Components
03 Map System
04 Dashboard Layouts
05 Platform Pages
06 Film Frames
07 Prototype Flow
08 Archive
```

## 2. 命名规则

### 页面命名

- 使用英文编号 + 中文说明。
- 示例：`04 Dashboard Layouts / 城市治理驾驶舱`

### 组件命名

```text
Component / Category / Name / Variant
```

示例：

- `Component / Metric / Tile / Default`
- `Component / Metric / Tile / Warning`
- `Component / Map / City Node / Active`
- `Component / Map / City Node / Pending`
- `Component / AI / Analysis Panel / Generated`

### 图层命名

- 重要图层必须命名。
- 装饰图层使用 `decor / ...`。
- 数据图层使用 `data / ...`。
- 地图图层使用 `map / ...`。

## 3. 画布规格

### Web Desktop

- Frame：`1440 x 1024`
- Grid：12 columns
- Margin：`80px`
- Gutter：`24px`

### Presentation Frame

- Frame：`1920 x 1080`
- Grid：12 columns
- Margin：`64px`
- Gutter：`20px`

### Mobile Preview

- Frame：`390 x 844`
- Grid：4 columns
- Margin：`20px`
- Gutter：`12px`

## 4. Auto Layout 规则

- 所有卡片必须使用 Auto Layout。
- 按钮、标签、指标块必须有固定 padding。
- 文本区域必须设置最大宽度。
- 卡片内部间距统一使用 token。
- 不手动拖拽制造视觉对齐。

推荐间距：

- 卡片内边距：`20px / 24px`
- 标签与标题：`8px`
- 标题与正文：`10px`
- 模块之间：`24px`
- 页面大区之间：`40px / 48px`

## 5. 组件规格

### Command Header

- Height：`60px`
- Padding：`0 32px`
- Background：Deep Graphite
- Border bottom：`1px Divider Gray`
- Left：平台名称 + 当前视图
- Center：区域范围 / 更新时间
- Right：AI 状态 / 数据状态

### Metric Tile

- Min width：`160px`
- Height：`96-124px`
- Radius：`8px`
- Border：`1px Divider Gray`
- Background：Charcoal Surface
- Padding：`20px`
- Number：Metric Number
- Label：Meta

### Governance Card

- Radius：`8px`
- Border：`1px Divider Gray`
- Background：Charcoal Surface
- Padding：`20px`
- 标题最多两行。
- 摘要最多三行。
- 标签不超过四个。

### Risk Card

- Radius：`8px`
- Border：
  - Medium：`rgba(184, 137, 69, 0.34)`
  - High：`rgba(168, 93, 85, 0.34)`
- Background：
  - Medium：Amber Surface
  - High：深色底 + 少量 restrained red 标记
- 禁止闪烁、震动、警报图标泛滥。

### AI Analysis Panel

- Radius：`8px`
- Border：`1px Teal Border`
- Header：分析对象 + 状态
- Body：摘要 / 证据 / 建议
- Footer：关联案例 / 下一步动作

## 6. 地图组件规格

### City Node

尺寸：

- Active：`10-14px`
- Pending：`6-8px`
- Risk：Active Node + `4px` Amber status dot

状态：

- Active：Civic Teal
- Pending：Data Gray `40%`
- Selected：Civic Teal + 低透明外环
- Risk：Amber 小标识，不改变主节点色

### Data Flow Line

- Stroke：`1px`
- Color：Civic Teal `35%`
- Arrow：可选，极细
- Motion：慢速，不做强流光

### Risk Heat

- Fill：Signal Amber `12-18%`
- Ring：Soft Amber `25%`
- Blur：`8-16px`
- 不使用大面积红色。

## 7. 文本规范

### 中文字体

- 首选：PingFang SC
- 备用：Noto Sans SC / Source Han Sans

### 英文和数字

- 首选：Inter
- 备用：SF Pro / IBM Plex Sans

### 字号

- Hero Title：`56-72`
- Page Title：`40-48`
- Section：`22-28`
- Card Title：`16-20`
- Body：`15-17`
- Meta：`11-13`
- Metric：`32-48`

## 8. Prototype 规则

允许：

- Hover：边框轻微变亮。
- Click：城市卡片展开。
- Filter：切换状态层。
- Panel：右侧面板滑入。

禁止：

- 花哨页面切换。
- 快速缩放。
- 弹性过强动画。
- 粒子爆炸。

## 9. 交付切图规则

- 图标优先使用线性图标。
- 地图可导出 SVG。
- 复杂背景使用 PNG/WebP。
- 视频 KV 使用 `1920 x 1080`。
- 封面使用 `1920 x 1080` 和 `1280 x 720` 两版。

