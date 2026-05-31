# Design System Governance

本文档基于当前 `app/globals.css` 进行治理分析，不新增 UI 页面，不修改现有样式。

目标气质：Apple Keynote + HyperFrames，克制、留白、秩序感、灰调青绿色。

明确禁止方向：科技蓝、高饱和、赛博朋克、重阴影、炫技动画。

## 1. Current Design Tokens

当前 tokens 定义在 `:root`：

```css
--bg: #f5f8f7;
--surface: #ffffff;
--surface-soft: #edf6f3;
--ink: #10201d;
--muted: #5d6f69;
--line: #d8e6e1;
--primary: #0c9f83;
--primary-dark: #08705f;
--teal-soft: #d9f2eb;
--blue: #356f91;
--amber: #bc8738;
--shadow: 0 22px 60px rgba(25, 67, 58, 0.1);
```

### Governance Notes

- `--primary` is slightly saturated for the target “灰调青绿色”，可保留为行动色，但不宜大面积使用。
- `--blue` 当前没有明显必要，且接近“科技蓝”方向，应谨慎使用或改为低饱和 slate-teal。
- `--amber` 用于 pending 状态可接受，但应仅服务状态语义。
- `--shadow` 偏大，适合 hero 演示，但不适合成为所有卡片默认阴影。

## 2. Typography System

当前字体：

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif
```

### Current Usage

- Hero/Page H1: `clamp(42px, 6.6vw, 86px)`，`font-weight: 750`。
- Detail H1: `clamp(34px, 4vw, 58px)`。
- Section H2: `24px`。
- Card headings: `20px`。
- Body text: `17px` with `line-height: 1.85` for hero/page intro.
- Meta text: `13px`。
- Eyebrow: `13px` uppercase with letter spacing.

### Governance Recommendation

Define a stable type scale:

- `display`: 64-86px, only homepage or major keynote sections.
- `pageTitle`: 42-58px, internal pages.
- `sectionTitle`: 24-30px.
- `cardTitle`: 18-22px.
- `body`: 16-17px.
- `meta`: 13px.

Rules:

- Do not use hero-scale type inside cards.
- Keep letter spacing only for eyebrow/meta labels.
- Do not use negative letter spacing.
- Prefer Chinese readability over decorative typography.

## 3. Spacing Scale

Current spacing is mostly hand-coded:

- `8px`, `9px`, `10px`, `12px`, `13px`, `14px`, `16px`, `18px`, `20px`, `22px`, `24px`, `28px`, `30px`, `34px`, `36px`, `48px`, `54px`, `80px`

### Proposed Scale

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-7`: 32px
- `space-8`: 40px
- `space-9`: 48px
- `space-10`: 64px
- `space-11`: 80px

Rules:

- Cards use 18-24px padding.
- Page hero vertical rhythm should use 48-80px, not arbitrary values.
- Filter rows and tag rows should use 8-12px gaps.

## 4. Radius Scale

Current usage:

- Cards: mostly `8px`
- Buttons: `10px`
- Pills: `999px`
- Brand mark/icon badge: `8px`

### Proposed Scale

- `radius-sm`: 6px
- `radius-md`: 8px
- `radius-lg`: 10px
- `radius-pill`: 999px

Rules:

- Most cards remain 8px.
- Buttons may stay 10px, but avoid large rounded “friendly SaaS” shapes.
- Pills are only for tags, filters, and status badges.

## 5. Grid System

Current grids:

- `.container`: max width `1180px`。
- Homepage hero: 2 columns.
- Stats: 5 columns.
- Dashboard: 2 columns.
- Platform flow: 4 columns.
- Map page: content + side panel.
- Case grid: 2 columns.
- Submit grid: form + aside.

Responsive:

- At `960px`, most layouts collapse to one column; stats/platform/cases/detail remain 2 columns.
- At `640px`, all major grids collapse to one column.

### Governance Recommendation

- Keep `1180px` as product max width.
- Use 12-column thinking for future complex layouts, but do not introduce a grid framework yet.
- Avoid nested cards inside cards.
- Page sections should remain full-width bands or direct containers.

## 6. Card System

Current card classes:

- `.heroPanel`
- `.sectionBlock`
- `.statCard`
- `.intelCard`
- `.caseCard`
- `.flowItem`
- `.cityCard`
- `.sidePanel`
- `.submitAside`
- `.detailBlock`
- `.detailPage`

### Repetition

The following values repeat across card-like surfaces:

- `border: 1px solid var(--line)`
- `border-radius: 8px`
- `background: var(--surface)`
- `padding: 18px-24px`

### Drift Risk

Each card class controls its own border, radius, background, and shadow. Future AI-generated additions may create new variants instead of reusing existing rules.

### Governance Recommendation

Conceptually define:

- `card.base`: white surface, line border, 8px radius.
- `card.elevated`: base + soft shadow, only hero/key panels.
- `card.interactive`: base + hover lift.
- `card.status`: state-oriented card, not general content.

Avoid:

- Heavy shadows on every card.
- Gradient cards except for one strategic callout.
- Cards inside cards.

## 7. Button System

Current classes:

- `.btn`
- `.btn.primary`
- `.btn.secondary`
- `.btn.ghost`
- `.btn.wide`
- `.btn.full`

### Current Semantics

- Primary: green filled CTA.
- Secondary: white bordered CTA.
- Ghost: text-like action.

### Governance Recommendation

Button hierarchy:

- Primary: one primary action per view section.
- Secondary: navigational or alternative action.
- Ghost: low-emphasis link action.

Rules:

- Do not create new button colors casually.
- Use icon + text only when icon clarifies action.
- Avoid oversized CTA buttons except in form submission or hero.

## 8. Interaction Rules

Current interactions:

- Card/button hover uses `translateY(-2px)`.
- Map city dots change selected state.
- Filters update active pill.
- Submit form shows success box.

### Governance Recommendation

Keep interactions subtle:

- Hover lift: max 2px.
- Transition duration: 120-180ms.
- No large parallax.
- No decorative motion loops.
- No cyber/particle effects.
- Map animation should remain suggestive, not game-like.

## 9. Color Semantics

Recommended semantic mapping:

- Background: `--bg`
- Surface: `--surface`
- Soft Surface: `--surface-soft`
- Text Primary: `--ink`
- Text Secondary: `--muted`
- Border: `--line`
- Action Primary: `--primary`
- Action Dark: `--primary-dark`
- Status Active: `--teal-soft` + `--primary-dark`
- Status Pending: low-saturation amber
- Link: `--primary-dark`

### Color Warnings

- Avoid introducing saturated blue, neon cyan, purple gradients, or black cyber backgrounds.
- If `--blue` remains, use it sparingly for data accents only.
- Reduce reliance on large shadows to preserve Apple/Keynote restraint.

## 10. Inconsistencies and Drift Risks

### Repeated Styles

- Card borders/radii/backgrounds repeated across many classes.
- Text color and line height repeated in grouped selectors.
- `8px` radius and `var(--line)` appear repeatedly without semantic naming.

### Inconsistencies

- Buttons use `10px` radius while cards use `8px`; acceptable if intentional.
- `.checkbox` uses `display: flex !important` but also sets `grid-template-columns`, which does not apply to flex.
- `.heroPanel`, `.sectionBlock`, `.sidePanel`, `.submitAside`, `.detailPage` all get the same shadow even though not all should be elevated.

### Easy-to-Drift Areas

- New pages may copy and mutate card classes.
- New filters may invent different pill styles.
- New data visualizations may introduce saturated tech colors.
- Map styles may evolve into overly animated or inaccurate visual complexity.

### Not Fully Aligned With Target

- `--primary: #0c9f83` is slightly vivid for “灰调青绿色” if used broadly.
- `--shadow` is a little dramatic for a restrained governance platform.
- Current large H1 works for keynote demo, but should be used sparingly in product surfaces.

## 11. Governance Rules

- New UI must reuse existing visual primitives before adding new CSS.
- Any new color token must have semantic purpose.
- Any new page must first define information architecture.
- Global CSS changes require review against this document.
- Avoid component-specific one-off visual tokens unless the pattern repeats at least twice.
