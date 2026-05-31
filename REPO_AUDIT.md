# Repository Asset Audit

本文档审计当前仓库遗留资产，不删除文件、不改变依赖，只标记引用关系和清理风险。

## 1. Current Product Surface

当前社区治理 MVP 实际使用：

- `app/`
- `components/CityNetworkMap.tsx`
- `data/cities.json`
- `data/intelligence.json`
- `data/cases.json`
- `data/categories.json`
- `data/stats.json`
- `app/globals.css`

构建结果显示当前 Next 页面路由为：

- `/`
- `/map`
- `/intelligence`
- `/cases`
- `/cases/[id]`
- `/submit`

## 2. Still Referenced Assets

### Directly Referenced by MVP

- `lucide-react`: used by current pages and `CityNetworkMap`.
- `next`, `react`, `react-dom`, `typescript`: core application stack.
- `data/*.json`, excluding `data/sample-script.json`: current UI data source.

### Referenced by package scripts

`package.json` still contains:

- `studio`: `remotion studio remotion/index.ts`
- `render:sample`: `remotion render remotion/index.ts BookGuideVideo out/book-guide-sample.mp4 --props=data/sample-script.json`

These scripts reference:

- `remotion/`
- `data/sample-script.json`
- `public/cover.jpg`
- `public/audio.mp3`

### Referenced by Old Video Pipeline

`lib/renderVideo.ts`, `lib/scriptGenerator.ts`, `lib/elevenlabs.ts`, and `lib/heygen.ts` reference:

- Remotion CLI
- `public/cover.jpg`
- `public/audio.mp3`
- ElevenLabs API
- HeyGen API
- fallback render scripts

## 3. Likely Expired or MVP-Irrelevant Assets

These appear unrelated to the current community governance product surface:

- `remotion/`
- `remotion.config.ts`
- `lib/elevenlabs.ts`
- `lib/heygen.ts`
- `lib/renderVideo.ts`
- `lib/scriptGenerator.ts`
- `lib/types.ts`
- `data/sample-script.json`
- `scripts/render_fallback.m`
- `scripts/render_fallback.swift`
- `scripts/render_motion_sample.mjs`
- `public/audio.mp3`
- `public/audio.wav`
- `public/cover.jpg`
- `public/renders/*.mp4`
- `public/renders/player.html`
- `.tmp/`
- `video_build/`
- `video_review/`
- `section1_hyperframes_style/`
- `hyperframes_trust_budget/`
- Chinese manuscript and video planning markdown files in repo root

Important: “MVP-irrelevant” does not mean safe to delete immediately. Some may be valuable source assets for a different project.

## 4. package.json Suspicious Dependencies

Current dependencies include:

- `@remotion/bundler`
- `@remotion/cli`
- `@remotion/player`
- `@remotion/renderer`
- `remotion`

For the community governance MVP, these are suspicious because:

- No current `app/` page imports Remotion.
- Current product does not render videos.
- They increase install size and cognitive load.
- They keep old video scripts visible in package commands.

Current dependency that is valid:

- `lucide-react`: used in UI.

## 5. MVP-Unrelated Directories

### Clearly unrelated to current app shell

- `.tmp/`
- `video_build/`
- `video_review/`
- `section1_hyperframes_style/`
- `hyperframes_trust_budget/`
- `remotion/`

### Potentially unrelated but needs owner confirmation

- `content-factory/`
- root Chinese manuscript files
- root video planning markdown files

These appear to belong to a broader content/video production workspace, not this Next.js product.

## 6. Safety Cleanup Recommendations

Do not delete immediately. Use a staged cleanup:

### Step 1: Mark Product Boundary

Define current product-owned paths:

- `app/`
- `components/`
- `data/cities.json`
- `data/intelligence.json`
- `data/cases.json`
- `data/categories.json`
- `data/stats.json`
- `README.md`
- `TODO.md`
- governance docs

### Step 2: Quarantine Legacy Assets

Move legacy assets to an archival directory only after owner approval, for example:

- `_archive/video-generation/`
- `_archive/content-production/`

Do not mix archive cleanup with product feature work.

### Step 3: Remove Unused Scripts

After archive confirmation, remove from `package.json`:

- `studio`
- `render:sample`

### Step 4: Remove Remotion Dependencies

After scripts and imports are gone, remove:

- `@remotion/bundler`
- `@remotion/cli`
- `@remotion/player`
- `@remotion/renderer`
- `remotion`

### Step 5: Rebuild and Verify

Run:

- `npm install`
- `npm run build`

## 7. Deletion Risk Assessment

### Low Risk After Confirmation

- `.tmp/` generated render artifacts.
- `public/renders/*.mp4` if not used for current demos.
- `public/renders/player.html` if no active demo depends on it.

Risk: losing previous video outputs.

### Medium Risk

- `remotion/`
- `scripts/render_*`
- `lib/renderVideo.ts`
- `lib/scriptGenerator.ts`
- `data/sample-script.json`

Risk: breaking old video-generation scripts still used outside the current MVP.

### High Risk

- `content-factory/`
- root manuscript markdown files
- `video_build/`
- `video_review/`

Risk: these may represent separate active workflows, source material, or deliverables.

## 8. Build Impact

Current `npm run build` passes with the legacy assets present. This means cleanup is not urgent for runtime correctness, but is important for:

- maintainability
- onboarding
- deployment size
- AI agent focus
- avoiding accidental edits to unrelated projects

## 9. Governance Rule

Future work should not touch legacy video/content assets unless the task explicitly targets them. Product work should remain inside the current product boundary.
