# Implementation Plan: Repository Modernization & Automation

**Date**: 2025-11-17
**Branch**: `claude/audit-plan-implement-agent-019ADFMXn4ohXxgQN2W4cSwU`
**Estimated Duration**: 4-6 hours
**Strategy**: Vertical slice MVP → Harden → Document → Release

---

## Overview

This plan breaks the modernization work into **7 executable slices**, prioritizing critical fixes and security updates before adding automation infrastructure.

**Key Principle**: Each slice delivers **testable, releasable increments** that can be committed atomically.

---

## Slice 1: Critical Code Fixes (MVP Foundation)

**Goal**: Eliminate code-breaking issues and ESLint errors
**Duration**: 30 minutes
**Risk**: Low (surgical fixes)

### Tasks

#### 1.1 Fix ESLint Errors (6 total)
```javascript
// main.js:6-7 — Remove unused imports
- import { CinematicRenderer } from '@renderers/CinematicRenderer';
- import { CinematicCamera } from '@cameras/CinematicCamera';

// src/gui/TweakpaneManager.js:5 — Remove unused import
- import { CAMERA_PRESETS } from '@presets/cameraPresets';

// src/gui/TweakpaneManager.js:331 — Remove unused parameter
- updateCameraControls(camera) {
+ updateCameraControls() {

// src/presets/envPresets.js:185 — Prefix unused variable
- environments.forEach((env, _) => {
+ environments.forEach((env, _index) => {

// src/tests/presetManager.test.js:17 — Remove unused variable
- const result = manager.loadPreset('default');
```

#### 1.2 Rename Misnamed File
```bash
# Before: /src/presets/.js
# After:  /src/presets/sceneConfigs.js
mv src/presets/.js src/presets/sceneConfigs.js

# Update import in src/tests/sceneTest.js
- import { sceneConfigs } from '@presets/.js';
+ import { sceneConfigs } from '@presets/sceneConfigs';
```

#### 1.3 Delete Orphaned Files
```bash
rm src/core/cameras/CinematicCamera.js      # Duplicate
rm src/core/controls/camera-controls.js     # Empty file
rm src/core/scenes/DefaultScene.js          # Broken import, unused
```

#### 1.4 Add Missing Barrel Exports
```javascript
// NEW FILE: src/core/components/geometries/index.js
export { Box } from './Box.js';
export { Sphere } from './Sphere.js';
export { Plane } from './Plane.js';
export { Circle } from './Circle.js';
export { Cylinder } from './Cylinder.js';
```

### Verification
```bash
npm run lint  # Should pass with 0 errors
npm run build # Should succeed
```

### Commit Message
```
fix: resolve ESLint errors and critical code issues

- Remove 6 unused variables and imports
- Rename src/presets/.js to sceneConfigs.js
- Delete orphaned files (CinematicCamera duplicate, empty camera-controls)
- Delete broken DefaultScene.js (unused, had non-existent import)
- Add barrel export for geometries to fix import resolution

Fixes: main.js:6-7, TweakpaneManager.js:5,331, envPresets.js:185
```

---

## Slice 2: Security & Dependency Updates (MVP Security)

**Goal**: Resolve all 7 npm audit vulnerabilities
**Duration**: 45 minutes
**Risk**: Medium (dependency updates may introduce regressions)

### Tasks

#### 2.1 Remove Unused Vulnerable Package
```bash
npm uninstall vite-plugin-svg-icons
# Eliminates 4 vulnerabilities: braces, micromatch, postcss, svg-baker
```

#### 2.2 Remove Other Unused Dev Dependencies
```bash
npm uninstall vite-plugin-compression \
              vite-plugin-env-compatible \
              vite-plugin-pwa
# Reduces attack surface, speeds up npm install
```

#### 2.3 Update Dependencies with Security Fixes
```bash
# Auto-fix safe updates
npm audit fix

# Manual updates for packages with available fixes
npm install vite@7.2.2          # Fixes path traversal (GHSA-93m4-6634-74q7)
npm install playwright@1.56.1   # Patch update
npm install vite-plugin-glsl@1.5.4
npm install postprocessing@6.38.0
```

#### 2.4 Remove Unused Runtime Dependency
```bash
npm uninstall postprocessing  # Never imported in codebase
```

#### 2.5 Update Three.js Types (Match Runtime)
```bash
# Keep types in sync with three@0.157.0 (defer major Three.js upgrade)
npm install --save-dev @types/three@0.157.2
```

### Verification
```bash
npm audit  # Should show 0 vulnerabilities
npm outdated  # Check remaining updates
npm run build  # Ensure no regressions
```

### Commit Message
```
fix(deps): resolve 7 security vulnerabilities and remove unused packages

- Remove vite-plugin-svg-icons (unused, caused 4 transitive vulnerabilities)
- Remove vite-plugin-compression, vite-plugin-env-compatible, vite-plugin-pwa (unused)
- Remove postprocessing (unused runtime dependency)
- Update vite 7.1.7 → 7.2.2 (fixes path traversal CVE)
- Update playwright, vite-plugin-glsl, others to latest patches
- Run npm audit fix for auto-fixable issues (js-yaml)

Security fixes:
- GHSA-grv7-fg5c-xmjg (braces ReDoS) - RESOLVED
- GHSA-952p-6rrq-rcjv (micromatch ReDoS) - RESOLVED
- GHSA-93m4-6634-74q7 (vite path traversal) - RESOLVED
- GHSA-566m-qj78-rww5 (postcss ReDoS) - RESOLVED
- GHSA-7fh5-64p2-3v2j (postcss injection) - RESOLVED
- GHSA-mh29-5h37-fv8m (js-yaml prototype pollution) - RESOLVED
```

---

## Slice 3: Update Deprecated APIs (MVP Compatibility)

**Goal**: Modernize Three.js API usage for future-proofing
**Duration**: 20 minutes
**Risk**: Low (well-documented migration)

### Tasks

#### 3.1 Update BasicRenderer.js
```javascript
// Line 24
- this.outputEncoding = THREE.sRGBEncoding;
+ this.outputColorSpace = THREE.SRGBColorSpace;
```

#### 3.2 Update Renderer.js
```javascript
// Line 18
- this.outputEncoding = THREE.sRGBEncoding;
+ this.outputColorSpace = THREE.SRGBColorSpace;
```

#### 3.3 Update EnvironmentManager.js
```javascript
// Line 42 (approximate)
- envMap.encoding = THREE.sRGBEncoding;
+ envMap.colorSpace = THREE.SRGBColorSpace;
```

### Verification
```bash
npm run lint  # No errors
npm run dev   # Visual test: check rendering output
# Open browser, verify 3D scene renders correctly with proper colors
```

### Commit Message
```
refactor: update deprecated Three.js encoding API to colorSpace

Replace deprecated outputEncoding/encoding with outputColorSpace/colorSpace
in preparation for Three.js r158+ compatibility.

Updated files:
- src/core/renderers/BasicRenderer.js
- src/core/renderers/Renderer.js
- src/core/managers/EnvironmentManager.js

Ref: https://threejs.org/docs/#manual/en/introduction/Color-management
```

---

## Slice 4: Configuration Cleanup (MVP Maintainability)

**Goal**: Remove unused aliases and sync configs
**Duration**: 15 minutes
**Risk**: Low (removing unused references)

### Tasks

#### 4.1 Update vite.config.js
```javascript
// Remove unused aliases (lines 39-44):
resolve: {
  alias: {
    "@": resolveSrc(""),
    "@core": resolveSrc("core"),
    "@components": resolveSrc("core/components"),
    "@managers": resolveSrc("core/managers"),
    "@generators": resolveSrc("core/generators"),
    "@scenes": resolveSrc("core/scenes"),
    "@utils": resolveSrc("core/utils"),
    "@encoders": resolveSrc("core/components/encoders"),
    "@environments": resolveSrc("core/components/environments"),
    "@geometries": resolveSrc("core/components/geometries"),
    "@lights": resolveSrc("core/components/lights"),
    "@loaders": resolveSrc("core/components/loaders"),
    "@materials": resolveSrc("core/components/materials"),
    "@cameras": resolveSrc("core/components/cameras"),
    "@assets": resolveSrc("assets"),
    "@environmentMaps": resolveSrc("assets/environmentMaps"),
    "@presets": resolveSrc("presets"),
    "@renderers": resolveSrc("core/renderers"),
    "@tests": resolveSrc("tests"),
    // REMOVED: @effects, @monitoring, @postprocessing, @shaders, @controls,
    //          @config, @models, @textures, @panoramas
  }
}
```

#### 4.2 Update jsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@components/*": ["src/core/components/*"],
      "@managers/*": ["src/core/managers/*"],
      "@generators/*": ["src/core/generators/*"],
      "@scenes/*": ["src/core/scenes/*"],
      "@utils/*": ["src/core/utils/*"],
      "@encoders/*": ["src/core/components/encoders/*"],
      "@environments/*": ["src/core/components/environments/*"],
      "@geometries/*": ["src/core/components/geometries/*"],
      "@lights/*": ["src/core/components/lights/*"],
      "@loaders/*": ["src/core/components/loaders/*"],
      "@materials/*": ["src/core/components/materials/*"],
      "@assets/*": ["src/assets/*"],
      "@environmentMaps/*": ["src/assets/environmentMaps/*"],
      "@renderers/*": ["src/core/renderers/*"],
      "@cameras/*": ["src/core/components/cameras/*"],
      "@presets/*": ["src/presets/*"],
      "@tests/*": ["src/tests/*"]
      // REMOVED: @hdri, @effects, @monitoring, @postprocessing, @shaders,
      //          @controls, @config (kept @cameras as it's used)
    }
  }
}
```

### Verification
```bash
npm run build  # Ensure aliases still resolve correctly
```

### Commit Message
```
chore: remove unused Vite aliases and sync configs

Remove 9 unused path aliases pointing to non-existent directories:
@effects, @monitoring, @postprocessing, @shaders, @controls, @config,
@models, @textures, @panoramas

Sync vite.config.js and jsconfig.json for consistency.
```

---

## Slice 5: Deployment Configuration (MVP Deployment)

**Goal**: Add Vercel support and improve GitHub Pages workflow
**Duration**: 30 minutes
**Risk**: Low (additive changes)

### Tasks

#### 5.1 Create Vercel Configuration
```json
// NEW FILE: vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}
```

#### 5.2 Enhance GitHub Pages Workflow
```yaml
# Update .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npm run lint  # ADD: Quality gate

      - run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Verification
```bash
# Local test
npm run build
npm run preview  # Should serve on http://localhost:4173

# After push, check:
# - GitHub Actions runs successfully
# - GitHub Pages site updates
```

### Commit Message
```
feat: add Vercel deployment and enhance GitHub Pages workflow

- Add vercel.json for zero-config Vite deployment
- Add lint step to GitHub Pages workflow as quality gate
- Add workflow_dispatch trigger for manual deploys
- Add concurrency control to prevent deployment conflicts
```

---

## Slice 6: Development Automation (Hardening)

**Goal**: Automate dependency updates and CI checks
**Duration**: 45 minutes
**Risk**: Low (GitHub-managed workflows)

### Tasks

#### 6.1 Create Dependabot Configuration
```yaml
# NEW FILE: .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    reviewers:
      - "KBLLR"  # Replace with repo owner
    commit-message:
      prefix: "chore(deps)"
      include: "scope"
    groups:
      vite-ecosystem:
        patterns:
          - "vite*"
      three-ecosystem:
        patterns:
          - "three"
          - "@types/three"
      dev-dependencies:
        dependency-type: "development"
        update-types:
          - "patch"
          - "minor"
```

#### 6.2 Create CI Workflow
```yaml
# NEW FILE: .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npx prettier --check .

      - name: Build
        run: npm run build

      - name: Test
        run: npm run test
        continue-on-error: true  # Tests are basic, don't fail CI yet

      - name: Security audit
        run: npm audit --audit-level=high
```

#### 6.3 Add Pre-commit Scripts (Optional)
```json
// Update package.json scripts:
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js --fix",
    "lint:check": "eslint . --ext .js",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "clean": "rimraf dist",
    "test:scene": "vite",
    "test": "npm run test:scene",
    "test:playwright": "start-server-and-test \"npm run test:scene\" http://localhost:5173 \"node src/tests/playwright.test.cjs\"",
    "validate": "npm run lint:check && npm run format:check && npm run build"
  }
}
```

### Verification
```bash
# Test locally
npm run validate  # Should pass all checks

# After push, verify:
# - CI workflow runs on PRs
# - Dependabot creates weekly PRs
```

### Commit Message
```
feat: add development automation with Dependabot and CI

- Add Dependabot config for weekly dependency updates
- Group related dependencies (vite, three.js ecosystems)
- Add CI workflow with lint, format, build, test, and audit checks
- Add validate script for local pre-push checks
- Set security audit threshold to 'high' in CI

Automation improvements:
- Weekly dependency PRs (Monday 9am)
- PR quality gates (lint, format, build must pass)
- Auto-detect vulnerabilities in CI
```

---

## Slice 7: Documentation Updates (Release Prep)

**Goal**: Update docs to reflect changes
**Duration**: 30 minutes
**Risk**: None (documentation only)

### Tasks

#### 7.1 Update CHANGELOG.md
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Vercel deployment configuration
- Dependabot for automated dependency updates
- CI workflow with lint, format, build, and test checks
- Barrel export for geometries components

### Changed
- Updated Vite 7.1.7 → 7.2.2 (security fix)
- Migrated Three.js encoding API to colorSpace API
- Enhanced GitHub Pages workflow with quality gates

### Removed
- Unused dev dependencies: vite-plugin-svg-icons, vite-plugin-compression, vite-plugin-env-compatible, vite-plugin-pwa
- Unused runtime dependency: postprocessing
- Orphaned files: src/core/cameras/CinematicCamera.js, src/core/controls/camera-controls.js, src/core/scenes/DefaultScene.js
- 9 unused Vite path aliases

### Fixed
- 6 ESLint errors (unused variables and imports)
- 7 security vulnerabilities (braces, micromatch, vite, postcss, js-yaml)
- Misnamed file: src/presets/.js → sceneConfigs.js
- Missing barrel export for geometries causing import failures

### Security
- Resolved GHSA-grv7-fg5c-xmjg (braces ReDoS, HIGH)
- Resolved GHSA-952p-6rrq-rcjv (micromatch ReDoS, MODERATE)
- Resolved GHSA-93m4-6634-74q7 (vite path traversal, MODERATE)
- Resolved 4 other moderate vulnerabilities in transitive dependencies
```

#### 7.2 Update README.md
```markdown
# 3D Model Splats Stager

...existing content...

## Deployment

### GitHub Pages
This project automatically deploys to GitHub Pages on every push to `main`. The deployment includes:
- Automated linting checks
- Optimized production builds
- Source maps for debugging

### Vercel
Deploy to Vercel with one click or connect your GitHub repository:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KBLLR/3dmodel-splats-stager)

Vercel will automatically detect the Vite configuration and set up preview deployments for PRs.

## Development Automation

### Dependency Updates
This project uses [Dependabot](https://docs.github.com/en/code-security/dependabot) for automated weekly dependency updates. PRs are created every Monday for:
- Security patches (auto-review recommended)
- Minor and patch updates
- Grouped ecosystem updates (Vite, Three.js)

### Continuous Integration
Every PR runs automated checks:
- ✅ ESLint (code quality)
- ✅ Prettier (formatting)
- ✅ Build validation
- ✅ Security audit (high/critical only)
- ✅ Tests (browser-based)

Run all checks locally:
```bash
npm run validate
```

...existing content...
```

#### 7.3 Create ADR for Major Decisions
```markdown
# ADR 0001: Dependency Management & Security Automation

**Date**: 2025-11-17

## Status
Accepted

## Context
The project had accumulated technical debt:
- 7 security vulnerabilities (5 moderate, 2 high)
- 9 outdated dependencies
- 4 unused dev dependencies causing transitive vulnerabilities
- No automated dependency updates
- No CI quality gates

Manual dependency management is error-prone and time-consuming.

## Decision
Implement automated dependency management and security workflows:

1. **Dependabot** for weekly dependency updates
2. **GitHub Actions CI** for quality gates on every PR
3. **Remove unused dependencies** to reduce attack surface
4. **Group related updates** (vite, three.js ecosystems) to minimize PR noise

## Consequences

### Positive
- Security vulnerabilities caught early (CI blocks high/critical)
- Dependency updates become routine (weekly PRs, easy review)
- Reduced maintenance burden (automation > manual checks)
- Faster onboarding (clear CI feedback for contributors)

### Negative
- Weekly Dependabot PRs require review time (~5-10 min/week)
- CI runtime adds ~2-3 minutes to PR workflow
- Breaking dependency updates may require investigation

### Risks
- Dependabot auto-merge could introduce regressions (mitigated by CI checks)
- Three.js major version updates require manual testing (grouped separately)

## Alternatives Considered

1. **Renovate**: More configurable but overkill for this project size
2. **Manual updates**: Current state, proven unsustainable
3. **Snyk**: Paid tool, unnecessary for public repo with GitHub's free security features

## Implementation Notes
- Dependabot runs Mondays 9am UTC (low-traffic time)
- CI audit threshold set to "high" (moderate vulns don't block, but are visible)
- Tests run with `continue-on-error` until coverage improves
```

### Commit Message
```
docs: update README, CHANGELOG, and add ADR for automation

- Add CHANGELOG.md following Keep a Changelog format
- Document Vercel deployment in README
- Document CI/CD workflows and Dependabot
- Add ADR-0001 for dependency management decisions
```

---

## Test List (Per Slice)

### Slice 1: Critical Fixes
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run build` succeeds
- [ ] Visual test: dev server runs without console errors

### Slice 2: Security
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] `npm run build` succeeds with updated deps
- [ ] `npm run dev` works (no runtime errors)

### Slice 3: Deprecated APIs
- [ ] `npm run lint` passes
- [ ] Visual test: 3D scene renders with correct colors
- [ ] No Three.js deprecation warnings in console

### Slice 4: Config Cleanup
- [ ] `npm run build` succeeds (aliases resolve)
- [ ] No import errors at runtime

### Slice 5: Deployment
- [ ] Local preview works (`npm run preview`)
- [ ] GitHub Actions workflow passes
- [ ] Vercel deployment succeeds (after repo connection)

### Slice 6: Automation
- [ ] `npm run validate` passes locally
- [ ] CI workflow runs on PR
- [ ] Dependabot config validated (wait for Monday)

### Slice 7: Documentation
- [ ] README renders correctly on GitHub
- [ ] CHANGELOG follows Keep a Changelog format
- [ ] ADR is clear and actionable

---

## Interfaces & Contracts

### Public API (Unchanged)
```javascript
// main.js entry point
import { SceneManager } from '@managers/SceneManager';

const manager = new SceneManager();
// No breaking changes to manager APIs
```

### Build Output Contract
```bash
# dist/ structure (unchanged)
dist/
  ├── assets/
  ├── index.html
  └── index-[hash].js
```

### CI/CD Contract
```yaml
# GitHub Actions outputs
- build-success: true/false
- lint-passed: true/false
- audit-critical-vulnerabilities: 0
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Dependency updates break build | CI validates every change; rollback via git revert |
| Three.js API changes missed | Defer major version upgrade; current changes are backward-compatible |
| Vercel deployment misconfigured | Test with preview deployment first |
| Dependabot PR spam | Grouped updates + open-pr-limit: 5 |
| CI slows down development | Fast checks only (~2 min); no slow E2E tests yet |

---

## Definition of Done (Per Slice)

Each slice is considered complete when:
1. ✅ Code changes implemented
2. ✅ Tests pass (automated + manual)
3. ✅ Committed with Conventional Commit message
4. ✅ No regressions in `npm run build` or `npm run dev`

---

## Next Steps

1. **Execute Slices 1-7** sequentially (can parallelize some)
2. **Commit atomically** after each slice
3. **Test cumulatively** (each slice builds on previous)
4. **Push and create PR** after all slices complete
5. **Verify CI/CD** workflows in GitHub Actions
6. **Create handoff document** with status and next steps

---

**Estimated Total Time**: 3.5 - 4.5 hours
**Commits**: 7 (one per slice)
**Files Changed**: ~20
**Lines Added/Removed**: +500 / -150 (net +350)
