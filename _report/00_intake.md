# Intake: Repository Modernization & Automation

**Date**: 2025-11-17
**Agent ID**: agent.prompt.audit-plan-implement.v1
**Branch**: `claude/audit-plan-implement-agent-019ADFMXn4ohXxgQN2W4cSwU`

---

## Task Summary

1. **Fix bugs and remove legacy code** — Clean up ESLint errors, unused imports, and deprecated patterns
2. **Update dependencies and enable self-updates** — Upgrade outdated packages, resolve security vulnerabilities, automate dependency management
3. **Configure deployments** — Harden GitHub Pages workflow, add Vercel deployment configuration
4. **Automate development cycle** — Add CI workflows for linting, testing, and quality gates

---

## Assumptions & Locked Defaults

### Stack (Confirmed)
- **Language**: JavaScript (ES2024, ESM)
- **Package Manager**: npm 9+
- **Build System**: Vite 5.4+ (upgrading to 7.2.2)
- **Linter**: ESLint 8.x → 9.x
- **Formatter**: Prettier
- **Test Framework**: Browser-based tests via Vite server + Playwright (optional)
- **CI Provider**: GitHub Actions

### Deployment Targets
- **GitHub Pages**: Already configured (`.github/workflows/deploy.yml`)
- **Vercel**: To be added (zero-config Vite deployment)

### Automation Scope
- **Dependency updates**: Dependabot (weekly, auto-merge patches)
- **Code quality**: Pre-commit hooks (lint, format) via Husky + lint-staged
- **CI checks**: Lint, build, test on PR and push to main

### Non-Functionals
- **Performance**: Maintain existing build performance; no regressions
- **Security**: Resolve all 7 vulnerabilities (5 moderate, 2 high)
- **A11y**: No new requirements (existing standards maintained)
- **i18n**: Not applicable

---

## Definition of DONE

### Acceptance Criteria
1. ✅ **Zero ESLint errors** — Fix 6 existing errors (unused variables/imports)
2. ✅ **Zero security vulnerabilities** — Update dependencies to resolve all 7 audit findings
3. ✅ **Latest stable dependencies** — Upgrade to latest compatible versions (Three.js exception: validate breaking changes)
4. ✅ **Self-updating dependencies** — Dependabot configured for automated PRs
5. ✅ **GitHub Pages deployment** — Working workflow with optimized builds
6. ✅ **Vercel deployment** — Working configuration (vercel.json + preview deployments)
7. ✅ **Pre-commit automation** — Husky + lint-staged for format/lint on commit
8. ✅ **CI quality gates** — GitHub Actions workflow: lint → build → test
9. ✅ **All tests passing** — Existing browser tests execute successfully
10. ✅ **Documentation updated** — README, CHANGELOG, ADR as needed

### Out of Scope
- Refactoring `lumaLabs/` standalone demos (minimal fixes only per AGENTS.md)
- Major architectural changes (this is maintenance/tooling work)
- New features (focus on stability and automation)

---

## Known Constraints

1. **Three.js version pinned to 0.157.0** → Latest is 0.181.1 (24 minor versions behind)
   - **Risk**: Breaking changes in r158-r181 (color space API, deprecated methods)
   - **Decision**: Audit breaking changes before upgrading; may defer to separate task
2. **ESLint 8.x → 9.x migration** → Breaking changes in config format (flat config)
   - **Approach**: Migrate to ESLint 9 flat config during upgrade
3. **vite-plugin-svg-icons** → Causes transitive vulnerabilities (braces, micromatch, postcss)
   - **Decision**: Evaluate alternatives or accept risk if SVG icons aren't critical

---

## Deliverables

- `_report/01_audit.md` — Dependency analysis, risk assessment, code quality report
- `_report/02_plan.md` — Numbered task list with MVP/hardening phases
- Updated `package.json` — Latest dependencies, new scripts
- `.github/workflows/ci.yml` — Lint, build, test automation
- `.github/workflows/deploy.yml` — Enhanced GitHub Pages deployment
- `.github/dependabot.yml` — Automated dependency updates
- `vercel.json` — Vercel deployment configuration
- `.husky/` + `lint-staged.config.js` — Pre-commit automation
- Updated `CHANGELOG.md` — Keep a Changelog format
- `docs/adr/ADR-0001-*.md` — Architectural decision record for major changes
- `HANDOFF.md` — Status, decisions, next steps

---

## Next Steps

1. **Audit** (Step 1) — Deep dive into codebase: map dependencies, identify legacy patterns, assess risks
2. **Plan** (Step 2) — Break into 3–7 slices: MVP (quick wins), hardening (tests), docs, release
3. **Implement** (Steps 3–4) — Execute plan with atomic commits
4. **Document** (Step 5) — Update all docs
5. **Release** (Step 6) — Conventional commits, PR, merge
6. **Handoff** (Step 7) — Final report for continuity
