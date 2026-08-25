# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows
[Semantic Versioning](https://semver.org/).

This file starts at 1.1.0; versions 1.0.0–1.0.4 predate it and are recorded only as git tags,
each named after the fix or feature it introduced.

## [1.1.0] — 2026-08-24

### Added
- A minimal frontend test suite (Vitest + React Testing Library) — the frontend previously
  had no automated tests. Covers `biEngine.ts`'s pure statistical/semantic-model functions
  and a `Layout` render smoke test. `npm run test` runs it.
- Error logging in `backend/database/database_manager.py` — every read/write/script method
  now logs the failing query (trimmed) and the database path on a `sqlite3.Error` before
  re-raising, so a failure is visible in logs rather than only in a raised exception with no
  context about which database file was involved.
- `BACKEND_STATISTICS_NOTES.md` — a from-source technical reference for every statistical
  method in `backend/analytics/`: formulas, the actual code, and which live endpoint (if any)
  calls it. Local-only (gitignored).
- `PIPELINE_MODULES_REPORT.md` — a full module/library audit across the Python backend, the
  Node/Express server, and the frontend. Local-only (gitignored).

### Changed
- `README.md` — added a "Runtime topology" section documenting the three-process
  architecture (React SPA, Express server, FastAPI backend) and which routes `server.ts`
  actually proxies to FastAPI; expanded "Two data paths" to "Three data paths" to cover the
  Node-side SQLite store; added an "AI assistance (Gemini)" section; added a file-by-file
  reference table; added an "End-to-End Program Flow" walkthrough.
- Corrected the "Five Hypotheses" table's H5 row: it previously described a chi-square test
  of sex vs. visit disposition, which exists in code (`backend/analytics/hypothesis/H5.py`,
  `backend/analytics/statistics/chi_square.py`) but is exercised only by its test suite. What
  the running app actually computes for "H5" is an ERBI trend + forecast, confirmed against
  both `GET /statistics/h5` and `AnalyticsCore.tsx`'s own labeling.
- Documented that `backend/analytics/hypothesis/H1.py`–`H5.py` are test-only reference
  handlers, and that most of the FastAPI `/api/*` surface (`statistics`, `dashboard`,
  `insights`, `reports`, `architecture`) is unreachable from the browser — `server.ts` proxies
  only `/api/model-diagnostics/*` and `/api/user-datasets/*`. The hypothesis-testing UI a user
  actually sees is computed client-side in `AnalyticsCore.tsx`.

### Removed
- `frontend/src/pages/StatisticalAnalysis/AnalyticsEngine.tsx` — an unrouted, unimported
  alternate statistical-analysis page superseded by `AnalyticsCore.tsx`. Confirmed dead via a
  repo-wide reference search; removal verified safe with a clean `tsc --noEmit` and an
  identical production `vite build` output before and after.

### Fixed
- `npm audit fix` applied for the new test-tooling dependency tree — cleared one
  high-severity transitive advisory (`nanoid`) picked up by Vitest's dependencies.
