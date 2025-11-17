# Audit Report: 3D Model Splats Stager

**Date**: 2025-11-17
**Branch**: `claude/audit-plan-implement-agent-019ADFMXn4ohXxgQN2W4cSwU`
**Total Source Files**: 76
**Lines of Code**: ~7,566

---

## Executive Summary

The codebase is **generally well-structured** with modern ES modules, clear separation of concerns, and a manager-based architecture. However, it has accumulated **technical debt** that impacts maintainability, security, and code quality:

- ⚠️ **3 Critical Issues**: Broken imports, misnamed files, missing barrel exports
- 🔒 **7 Security Vulnerabilities**: 5 moderate, 2 high (npm audit)
- 📦 **9 Outdated Dependencies**: Including Three.js (24 minor versions behind)
- 🧹 **6 ESLint Errors**: Unused variables and imports
- 🗑️ **2 Orphaned Files**: Duplicate code and empty files
- 📉 **~5% Test Coverage**: Only PresetManager has unit tests

**Immediate Action Required**: Fix critical import issues before deploying.

---

## 1. Dependency Analysis

### Current Dependencies (package.json)

| Package | Current | Wanted | Latest | Notes |
|---------|---------|--------|--------|-------|
| **three** | 0.157.0 | 0.157.0 | **0.181.1** | 24 minor versions behind, breaking changes likely |
| **@types/three** | 0.157.2 | 0.157.2 | **0.181.0** | Must match three.js version |
| **postprocessing** | 6.37.8 | 6.38.0 | 6.38.0 | Minor update available |
| **vite** | 7.1.7 | 7.2.2 | 7.2.2 | Security fix available |
| **eslint** | 8.57.1 | 8.57.1 | **9.39.1** | Major version upgrade (breaking: flat config) |
| **playwright** | 1.55.1 | 1.56.1 | 1.56.1 | Minor update |
| **vite-plugin-glsl** | 1.5.3 | 1.5.4 | 1.5.4 | Patch available |
| **vite-plugin-pwa** | 1.0.3 | 1.1.0 | 1.1.0 | Minor update |
| **rimraf** | 5.0.10 | 5.0.10 | **6.1.0** | Major version available |

### Unused Dependencies

```json
{
  "postprocessing": "^6.36.4",  // ❌ Never imported (0 references in codebase)
  "vite-plugin-compression": "^0.5.1",  // ⚠️ In devDeps but not in vite.config.js
  "vite-plugin-env-compatible": "^2.0.1",  // ⚠️ In devDeps but not in vite.config.js
  "vite-plugin-pwa": "^1.0.2",  // ⚠️ In devDeps but not in vite.config.js
  "vite-plugin-svg-icons": "^2.0.1"  // ⚠️ Causes security vulnerabilities, unused
}
```

**Recommendation**: Remove unused plugins to reduce attack surface and bundle size.

---

## 2. Security Vulnerability Report (npm audit)

### Summary
- **Total**: 7 vulnerabilities
- **Critical**: 0
- **High**: 2
- **Moderate**: 5

### High Severity

#### 1. `braces` (High) — Uncontrolled Resource Consumption
- **CVE**: GHSA-grv7-fg5c-xmjg
- **CVSS**: 7.5/10 (AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H)
- **Affected**: `braces < 3.0.3`
- **Path**: `vite-plugin-svg-icons → svg-baker → micromatch → braces`
- **Fix**: Update to `braces@3.0.3+` or remove `vite-plugin-svg-icons`

#### 2. `micromatch` (Moderate → High) — Regular Expression Denial of Service (ReDoS)
- **CVE**: GHSA-952p-6rrq-rcjv
- **CVSS**: 5.3/10 (escalated by dependency on vulnerable braces)
- **Affected**: `micromatch <= 4.0.7`
- **Path**: `vite-plugin-svg-icons → svg-baker → micromatch`
- **Fix**: Update to `micromatch@4.0.8+`

### Moderate Severity

#### 3. `vite` (Moderate) — Path Traversal on Windows
- **CVE**: GHSA-93m4-6634-74q7
- **Affected**: `vite >= 7.1.0 <= 7.1.10`
- **Current**: `7.1.7`
- **Fix**: Update to `vite@7.2.2` ✅ Available

#### 4. `postcss` (Moderate) — ReDoS + Line Return Parsing Error
- **CVEs**: GHSA-566m-qj78-rww5, GHSA-7fh5-64p2-3v2j
- **CVSS**: 5.3/10
- **Affected**: `postcss < 8.4.31`
- **Path**: `vite-plugin-svg-icons → svg-baker → postcss@8.4.30`
- **Fix**: Update to `postcss@8.4.31+`

#### 5. `js-yaml` (Moderate) — Prototype Pollution
- **CVE**: GHSA-mh29-5h37-fv8m
- **CVSS**: 5.3/10
- **Affected**: `js-yaml < 4.1.1`
- **Fix**: Auto-fixable via `npm audit fix`

### Transitive Dependency Risk Map

```
vite-plugin-svg-icons@2.0.1 (unused)
  └─ svg-baker
      ├─ micromatch (HIGH: ReDoS)
      │   └─ braces (HIGH: Resource exhaustion)
      └─ postcss (MODERATE: ReDoS + injection)
```

**Decision Point**: Since `vite-plugin-svg-icons` is **not used** in the codebase, **remove it** to eliminate the entire vulnerability chain.

---

## 3. Code Quality Issues

### ESLint Errors (6 Total)

```javascript
// main.js
6:10  error  'CinematicRenderer' is defined but never used  no-unused-vars
7:10  error  'CinematicCamera' is defined but never used    no-unused-vars

// src/gui/TweakpaneManager.js
5:3   error  'CAMERA_PRESETS' is defined but never used  no-unused-vars
331:23  error  'camera' is defined but never used          no-unused-vars

// src/presets/envPresets.js
185:15  error  '_' is defined but never used  no-unused-vars

// src/tests/presetManager.test.js
17:11  error  'result' is assigned a value but never used  no-unused-vars
```

**Fixes Required**:
- Remove unused imports in main.js (lines 6-7)
- Remove unused import CAMERA_PRESETS in TweakpaneManager.js:5
- Remove unused parameter `camera` in TweakpaneManager.js:331
- Replace `_` with `_` prefix or remove in envPresets.js:185
- Remove unused `result` variable in test file

---

## 4. Critical Code Issues

### 🚨 CRITICAL: Broken Imports

#### Issue #1: Misnamed File
```bash
# Current state:
/src/presets/.js  # ❌ File literally named ".js"

# Should be:
/src/presets/sceneConfigs.js
```

**Impact**: Import resolution may fail or cause build errors.

#### Issue #2: Non-existent Import Path
```javascript
// src/core/scenes/DefaultScene.js:7
import { Camera } from '../cameras/Camera.js';  // ❌ File doesn't exist

// Expected path:
import { Camera } from '../components/cameras/Camera.js';
```

**Impact**: Runtime error if DefaultScene is ever imported.

**Note**: DefaultScene is **never imported** in the codebase → Consider **deletion**.

#### Issue #3: Missing Barrel Exports
```javascript
// src/core/components/geometries/GeometryHandler.js
import { Box, Sphere, Plane, Circle, Cylinder } from "@geometries";
//                                                     ^^^^^^^^^^^
// ❌ No index.js in /src/core/components/geometries/
```

**Impact**: Build failure when GeometryHandler is loaded.

---

### 🗑️ ORPHANED CODE

| File | Status | Reason |
|------|--------|--------|
| `/src/core/cameras/CinematicCamera.js` | **DUPLICATE** | Shadowed by `/src/core/components/cameras/CinematicCamera.js`; main.js uses `@cameras` alias which resolves to the components/ version |
| `/src/core/controls/camera-controls.js` | **EMPTY** | 0 bytes; never imported |

**Recommendation**: Delete both files.

---

### 🔧 DEPRECATED API USAGE

**Three.js r152+ deprecated `encoding` in favor of `colorSpace`:**

```javascript
// ❌ DEPRECATED (used in 3 files):
renderer.outputEncoding = THREE.sRGBEncoding;  // BasicRenderer.js, Renderer.js
texture.encoding = THREE.sRGBEncoding;         // EnvironmentManager.js

// ✅ MODERN (already used in main.js, TweakpaneManager.js):
renderer.outputColorSpace = THREE.SRGBColorSpace;
texture.colorSpace = THREE.SRGBColorSpace;
```

**Files to update**:
1. `/src/core/renderers/BasicRenderer.js:24`
2. `/src/core/renderers/Renderer.js:18`
3. `/src/core/managers/EnvironmentManager.js:42`

**Impact**: Future Three.js versions (0.158+) will remove deprecated APIs.

---

## 5. Configuration Audit

### Unused Vite Aliases (9 Total)

**These aliases in `vite.config.js` point to non-existent directories:**

```javascript
// vite.config.js resolve.alias (lines 39-44)
"@effects": resolveSrc("effects"),          // ❌ No /src/effects/
"@monitoring": resolveSrc("monitoring"),    // ❌ No /src/monitoring/
"@postprocessing": resolveSrc("postprocessing"), // ❌ No /src/postprocessing/
"@shaders": resolveSrc("shaders"),          // ❌ No /src/shaders/
"@controls": resolveSrc("controls"),        // ⚠️ Has only empty camera-controls.js
"@config": resolveSrc("config"),            // ❌ No /src/config/
"@models": resolveSrc("assets/models"),     // ❌ No /src/assets/models/
"@textures": resolveSrc("assets/textures"), // ❌ No /src/assets/textures/
"@panoramas": resolveSrc("assets/panoramas") // ❌ No /src/assets/panoramas/
```

**Recommendation**: Remove all unused aliases to reduce config noise. Also update `jsconfig.json` for consistency.

---

## 6. Test Coverage Analysis

### Current State
- **Test Files**: 2 (`presetManager.test.js`, `sceneTest.js`)
- **Test Framework**: Browser-based (served via Vite), Playwright for E2E
- **Coverage**: ~5% (only PresetManager class)

### Gaps
- ❌ No unit tests for managers (SceneManager, CameraManager, EnvironmentManager)
- ❌ No tests for loaders (GLTFLoader, PLYLoader, LumaLabsLoader)
- ❌ No tests for materials, geometries, lights
- ❌ `sceneTest.js` is not a unit test (requires DOM + HTML page)

### CI/CD Integration
- ⚠️ `package.json` has `test:playwright` script but **not run in CI**
- ⚠️ `.github/workflows/deploy.yml` only runs `npm run build` (no test step)

**Recommendation**: Add test step to CI workflow, expand coverage to core managers.

---

## 7. Risk Assessment

### High Risk (Immediate Action)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Security vulnerabilities (7 total) | **HIGH** | **HIGH** | Update dependencies, remove unused packages |
| Broken import in DefaultScene.js | **MEDIUM** | **LOW** | Delete file or fix import (file unused) |
| Misnamed `.js` file | **MEDIUM** | **MEDIUM** | Rename to `sceneConfigs.js` |
| Missing barrel exports in geometries/ | **MEDIUM** | **MEDIUM** | Add `index.js` with re-exports |

### Medium Risk (Planned Maintenance)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Deprecated Three.js APIs | **MEDIUM** | **HIGH** | Update 3 files to use `colorSpace` API |
| Outdated Three.js (0.157.0 → 0.181.1) | **MEDIUM** | **MEDIUM** | Audit breaking changes before upgrade |
| Orphaned code cluttering codebase | **LOW** | **LOW** | Delete unused files |
| No automated testing in CI | **MEDIUM** | **HIGH** | Add test step to workflow |

### Low Risk (Nice to Have)

- Unused Vite aliases
- Inconsistent import styles (.js extension)
- Unused devDependencies (plugins)

---

## 8. Dependency Map (Simplified)

### Direct Dependencies

```
main.js
  ├─ three@0.157.0
  ├─ tweakpane@4.0.5
  ├─ stats.js@0.17.0
  └─ @managers/SceneManager
       ├─ @managers/CameraManager
       ├─ @managers/EnvironmentManager
       ├─ @managers/LoaderManager
       └─ @components/loaders/*
            ├─ three/examples/jsm/loaders/GLTFLoader
            ├─ three/examples/jsm/loaders/PLYLoader
            └─ @lumaai/luma-web@0.2.2

vite.config.js
  └─ vite-plugin-glsl@1.5.3

devDependencies (unused)
  ├─ vite-plugin-compression (not in config)
  ├─ vite-plugin-env-compatible (not in config)
  ├─ vite-plugin-pwa (not in config)
  └─ vite-plugin-svg-icons (not in config) → VULNERABILITIES
```

**Circular Dependencies**: None detected ✅

---

## 9. Summary & Recommendations

### Quick Wins (Can be done in 1-2 hours)

1. ✅ **Fix ESLint errors** (remove 6 unused variables/imports)
2. ✅ **Update Vite** to 7.2.2 (security fix)
3. ✅ **Remove vite-plugin-svg-icons** (eliminates 4 vulnerabilities)
4. ✅ **Run `npm audit fix`** (auto-fix js-yaml)
5. ✅ **Delete orphaned files** (2 files)
6. ✅ **Rename `.js` to `sceneConfigs.js`**
7. ✅ **Add geometries/index.js** barrel export

### Medium Effort (3-4 hours)

8. ✅ **Update deprecated Three.js APIs** (3 files)
9. ✅ **Migrate ESLint 8 → 9** (flat config)
10. ✅ **Add Dependabot config** (.github/dependabot.yml)
11. ✅ **Add Vercel config** (vercel.json)
12. ✅ **Add CI workflow** (lint + build + test)
13. ✅ **Remove unused Vite aliases** (9 aliases in 2 files)

### High Effort (Defer to Separate Task)

14. ⏸️ **Upgrade Three.js** 0.157.0 → 0.181.1 (requires thorough testing)
15. ⏸️ **Expand test coverage** (manager classes, loaders)
16. ⏸️ **Add pre-commit hooks** (Husky + lint-staged)

---

## 10. Files Requiring Changes

### Priority 1 (Critical)
```
/src/presets/.js                          → Rename to sceneConfigs.js
/src/core/scenes/DefaultScene.js          → Delete (unused, broken import)
/src/core/components/geometries/index.js  → CREATE (barrel export)
package.json                              → Remove vite-plugin-svg-icons
```

### Priority 2 (High)
```
/main.js                                  → Remove lines 6-7 (unused imports)
/src/gui/TweakpaneManager.js              → Remove lines 5, 331 (unused vars)
/src/presets/envPresets.js                → Fix line 185 (unused _)
/src/tests/presetManager.test.js          → Remove line 17 (unused result)
/src/core/renderers/BasicRenderer.js      → Update outputEncoding → outputColorSpace
/src/core/renderers/Renderer.js           → Update outputEncoding → outputColorSpace
/src/core/managers/EnvironmentManager.js  → Update encoding → colorSpace
/src/core/cameras/CinematicCamera.js      → DELETE (duplicate)
/src/core/controls/camera-controls.js     → DELETE (empty)
```

### Priority 3 (Medium)
```
vite.config.js                            → Remove 9 unused aliases
jsconfig.json                             → Remove 9 unused aliases
package.json                              → Remove 4 unused plugins
.eslintrc.json                            → Migrate to ESLint 9 flat config
.github/workflows/deploy.yml              → Add test step
```

---

**Next Step**: Proceed to **02_plan.md** with a phased implementation strategy.
