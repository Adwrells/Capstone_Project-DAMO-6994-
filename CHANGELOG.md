# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows
[Semantic Versioning](https://semver.org/).

This file starts at 1.1.0; versions 1.0.0–1.0.4 predate it and are recorded only as git tags,
each named after the fix or feature it introduced.

## [2.1.0] — 2026-09-02

### Added
- Pulled the remaining genuinely-new frontend pieces from the `Bharath` branch that the
  earlier partial pull (below) had missed: `App.tsx`'s clickable sidebar navigation wired
  through typed `apiService` calls, a redesigned `ArchitecturePipelineCard.tsx`, an Executive
  Dashboard trends hook (`fetchDashboardTrends`, calls `GET /api/dashboard/trends` — that
  route doesn't exist yet, so the call fails gracefully and the trend chart stays empty until
  it's added), chart builder / data cleaning UX polish, and a Stage 6 → Stage 7 workflow
  navigation button on Strategic Insights. As before, backend/server/auth files were left
  untouched. `apiService.ts` and `architectureService.ts` are consequently no longer dead
  code (see Fixed, below, for the caveat on the latter).

### Fixed
- `ctas_urgency_score` collapse: `map_ctas_urgency()` checked the generic `"urgent"`
  substring before the specific `"less"`/`"non"` checks, so `Less urgent` and `Non-urgent`
  both matched CTAS-III. Four of six triage categories (CTAS III, Less urgent, Non-urgent,
  Unknown) collapsed onto urgency score `3`, which corrupted H3's WLS regression design
  matrix and silently degraded the Executive Dashboard's ERBI breakdown by triage level.
  Reordered the checks and made `Unknown`/unrecognised text return `None` instead of a
  default score, so it's excluded via the `IS NOT NULL` filters `regression.py`/`erbi.py`
  already had, rather than pooled into a real acuity level. Patched the live
  `healthcare.db` and the master Excel workbook so this is correct immediately, not just
  after a future reprocess. H3's measured sample size moved 912 → 760 and R² rose to 0.6256.
- Dataset Explorer's column statistics (`excel_service.get_sheet_statistics`) computed plain
  unweighted `mean`/`median`/quartiles over the aggregate CIHI rows, ignoring `ed_visits` —
  the same frequency-weighting mistake H1–H5 were built to avoid. Added
  `weighted_quantile`/`weighted_variance`/`weighted_mode` to the canonical
  `backend/analytics/statistics/weighted.py` engine and wired `excel_service` to use them
  whenever a sheet carries a weight column (`ed_visits`, or `total_visits` on `Demographics`).
- A correct, already-unit-tested fix for the `age_group` dash-mismatch and roll-up
  double-counting defects existed in `backend/analytics/preprocessing/cleaning.py` but was
  never imported by the live pipeline that populates `healthcare.db`. Wired
  `normalize_age_group()`/`AGGREGATE_ROW_LABELS` into `backend/preprocessing/transformations.py`
  so a future reprocess (including from a custom upload) can't silently reintroduce either
  defect. No effect on current output — today's data was already clean going in.

### Changed
- `README.md` — corrected the Model Fit Diagnostics table, the polynomial-degree complexity
  curve, and the database provenance row counts to the values measured after the fixes above
  (several were stale even before this pass, notably `ed_visits`'s row count); corrected the
  `apiService.ts`/`architectureService.ts`/`architecture.py` dead-code claims now that
  `ArchitecturePipelineCard.tsx` renders (its backend call still isn't proxied, so it falls
  back to a static overview).

## [Unreleased]

### Added
- JWT authentication (`backend/auth/`) — a single seeded account (`AUTH_USERNAME` /
  `AUTH_PASSWORD` / `SECRET_KEY` in `backend/config/settings.py`), `POST /api/auth/login`
  issuing bearer tokens, and `get_current_user` gating every FastAPI router except `auth`
  itself, `/`, and `/api/health`. `server.ts` now authenticates server-to-server (caching the
  token, re-authenticating once on a `401`) when proxying `/api/model-diagnostics/*` and
  `/api/user-datasets/*`, since those calls would otherwise be rejected.
- Rate limiting on `POST /api/auth/login` (`backend/auth/rate_limit.py`, `slowapi`) — 5
  attempts/minute per IP; a caller over the limit gets `429` before the password check even
  runs. In-memory storage (resets on restart, not shared across processes/workers) — fine for
  this single-process deployment; a multi-worker deployment would need `Limiter(storage_uri=
  "redis://...")` for the limit to hold across workers.
- Pooled SQLite connections (`backend/database/engine.py`) — a SQLAlchemy `QueuePool`
  (`pool_size=5, max_overflow=10`) backs the production database instead of opening and
  closing a raw `sqlite3.connect()` on every call. Only the pool is used; query execution
  stays on genuine `sqlite3.Connection` objects (via `engine.raw_connection().dbapi_connection`)
  so pandas' `read_sql_query`/`to_sql` and existing `?`-placeholder queries are untouched. A
  `DatabaseManager` built against a custom path (tests, `load_csv.py`) gets `NullPool` instead,
  preserving the old open/close-per-call behavior so temp-directory teardown isn't blocked by
  an open pooled connection (an issue on Windows).
- Two-service `docker-compose.yml` (`node` + `python`, same image, different `command:`) —
  the Python backend previously never started in the container at all (`Dockerfile`'s `CMD`
  only ran `npm start`); `python` now runs `uvicorn backend.main:app` and is reachable only
  from `node` over the compose network (`expose`, not `ports`), not published to the host.
- `.env.example` and `python-dotenv` (`backend/config/settings.py` loads `.env` automatically)
  so `AUTH_USERNAME`/`AUTH_PASSWORD`/`SECRET_KEY`/`CORS_ORIGINS`/`GEMINI_API_KEY` can be set
  once and picked up by Docker, `launch.py`, and a direct `python -m backend.main` alike.
  `launch.py` prints a note when `.env` is missing. `guide_to_implement.md` (gitignored,
  local-only) covers the remaining path to a public HTTPS deployment on AWS.
- Pulled the Executive Dashboard rebuild and Dataset Explorer/Insights/Reports page updates
  from the `Bharath` branch — frontend only. Backend changes on that branch (including a
  different `server.ts` proxy implementation and modified FastAPI routers) were deliberately
  not pulled, to avoid disturbing the auth/pooling/rate-limiting work above. `server.ts` gained
  four additional proxy prefixes (`/api/dashboard`, `/api/statistics`, `/api/insights`,
  `/api/reports`) so the pulled pages' data fetches resolve, reusing the existing JWT-forwarding
  proxy — `/api/dataset` was deliberately excluded since server.ts already has native handlers
  for it (a different, Node-side data source) that a proxy prefix would have shadowed.

### Changed
- Every FastAPI route handler in `backend/api/*.py` changed from `async def` to `def`. None
  of them ever awaited anything — each one called straight into blocking `sqlite3`/pandas code
  while declared `async`, which runs directly on the single asyncio event loop and stalls every
  other in-flight request for the query's duration. A sync `def` handler runs in FastAPI's
  threadpool instead, so combined with connection pooling above, concurrent requests actually
  parallelize now instead of serializing.
- `requirements.txt` — added `sqlalchemy`, `python-jose[cryptography]`, `passlib[bcrypt]`,
  `slowapi`, `python-dotenv`, and pinned `bcrypt==4.0.1` (bcrypt ≥4.1's stricter 72-byte check
  breaks passlib 1.7.4's own backend self-test with `ValueError: password cannot be longer
  than 72 bytes`).

> **Breaking:** every FastAPI route now requires a bearer token except `/`, `/api/health`, and
> `/api/auth/login`. Any existing direct caller of the API (outside `server.ts`, which was
> updated alongside this change) will start getting `401` until it authenticates first.

## [2.0.0] — 2026-08-27

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
