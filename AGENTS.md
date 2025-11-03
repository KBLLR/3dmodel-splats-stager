# AGENTS.md

Audience: humans and AI agents working in this repository. This file defines expectations, conventions, and tips for making safe, minimal, and consistent changes.

Scope: the entire repository rooted at this folder.

## Quick Start
- Requirements: Node.js 18+ (Vite 5), npm 9+.
- Install: `npm i`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint/format: `npm run lint`, `npm run format`
- Scene tests: `npm run test` (serves `src/tests` via Vite)

## Project Layout
- `index.html`, `main.js`: default app entry.
- `src/`: application code and assets.
  - `core/`: rendering, cameras, environments, managers, etc.
  - `gui/`: Tweakpane Manager and helpers.
  - `assets/`: images, HDRI, models, audio.
  - `presets/`: preset data (env, fog, camera, scene requirements).
- `public/`: static assets served at root (avoid duplicating assets already in `src/assets`).
- `lumaLabs/`: standalone prototypes/demos; not part of the main build. Keep edits minimal and localized when fixing issues here.

## Module Resolution & Aliases
Aliased imports are configured in both `vite.config.js` and `jsconfig.json`. Prefer these paths:
- `@` → `src`
- `@core` → `src/core`
- `@components` → `src/core/components`
- `@managers` → `src/core/managers`
- `@renderers` → `src/core/renderers`
- `@cameras` → `src/core/cameras`
- `@controls` → `src/core/controls`
- `@environments` → `src/core/components/environments`
- `@effects` → `src/core/effects`
- `@postprocessing` → `src/core/postprocessing`
- `@utils` → `src/utils`
- `@gui` → `src/gui`
- `@assets` → `src/assets`
- `@models` → `src/assets/models`
- `@textures` → `src/assets/textures`
- `@environmentMaps` → `src/assets/environmentMaps`
- `@presets` → `src/presets`
- `@tests` → `src/tests`

When you add or move folders, update both `vite.config.js` and `jsconfig.json` consistently.

## Three.js Version Notes (r157+)
- Use `THREE.SRGBColorSpace` for color spaces; avoid deprecated `encoding` options.
- For `WebGLRenderTarget`/`WebGLCubeRenderTarget`, prefer `{ colorSpace: THREE.SRGBColorSpace }`.
- Tone mapping defaults: ACESFilmic is standard here.

## Tweakpane Usage
- Use `TweakpaneManager` (`@gui/TweakpaneManager`) to create UI. It provides:
  - `addFolder({ title: string })` or `addFolder("Title")` alias (internally uses `createFolder`).
  - `pane.addTab`, `folder.addBinding`, etc. via Tweakpane.
  - `refresh()` and `dispose()` passthroughs.
- Event signature: `.on("change", ({ value }) => { ... })` (Tweakpane v4 style). Do not assume raw value is passed.
- Prefer updating parameters then calling `pane.refresh()` or component-specific update methods when needed.

## HDRI Environments & Assets
- HDR files live under `src/assets/environmentMaps/hdr/`. EXR files, if used, under `src/assets/environmentMaps/exr/`.
- `HDRIEnvironment` resolves preset paths using Vite’s `import.meta.glob` with `{ as: 'url' }`. Keep preset paths in `src/presets/envPresets.js` like `/environmentMaps/hdr/<file>.hdr` — the loader will resolve to the correct bundled URL.
- If you add new HDRs, place them in the folder above and add a corresponding preset entry.
- The environment system exposes `environment.debugObject` with keys like `intensity`, `blur`, `rotation`, `path`, `exposure`. Use `environment.updateFromDebug(scene, renderer)` to apply changes.

## Vite Configuration
- Aliases are defined under `resolve.alias`.
- `build` and `server.hmr` should be top-level keys in the exported config (not nested under `resolve`). If you alter Vite config, preserve structure and keep aliases in sync with `jsconfig.json`.
- For runtime asset URLs, prefer `import.meta.glob` or `new URL('./path', import.meta.url)`. Avoid hardcoding dev server URLs.

## Coding Conventions
- ESM only (`"type": "module"` is set). Use `import`/`export`; do not use CommonJS.
- Keep diffs small and focused. Avoid refactors that aren’t required by the task.
- Match existing file style (Prettier config included). Run `npm run format` if you touch multiple files.
- Favor descriptive variable names; avoid single-letter names.
- Do not add license headers unless explicitly requested.

## Prototypes in `lumaLabs/`
- These HTML files are standalone demos. If fixing issues (e.g., reassigning a `const`), keep changes minimal (e.g., change to `let`) and avoid cross-wiring them into the main app.

## Common Pitfalls
- Tweakpane change handlers must destructure `{ value }`.
- With Three r157+, replace deprecated `encoding` with `colorSpace` options.
- Reassignments: don’t reassign `const` variables. Use `let` if reassignment is intended.
- Ensure new assets are placed under `src/assets/...` to be bundled by Vite.

## PRs/Commits (for human contributors)
- Use clear, task-focused commit messages.
- Don’t mix unrelated changes. Update docs when behavior changes.
- If you move/rename files referenced by presets or aliases, update references atomically.

## When in Doubt
- Prefer minimal, surgical changes.
- Keep presets and aliases consistent.
- Validate locally (`npm run dev`) and check the browser console for warnings/errors.
