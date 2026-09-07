# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows
[Semantic Versioning](https://semver.org/).

This file starts at 1.1.0; versions 1.0.0–1.0.4 predate it and are recorded only as git tags,
each named after the fix or feature it introduced.

## [2.2.2] — 2026-09-07

### Fixed
- **CI: Backend Test Suite was failing on every push.** A bare `pytest` invocation (what CI
  runs) walks the whole repo for test discovery and was trying to collect `scratch/test_erbi.py`
  — an ad-hoc script with no test functions that happens to match the `test_*.py` naming
  pattern — failing on import with `ModuleNotFoundError: No module named 'backend'`. Added
  `pytest.ini` scoping discovery to `tests/`, matching the already-documented canonical command,
  so both CI and any local bare `pytest` run are unaffected by `scratch/` content.
- **Statistical Analysis stage had no way to reach the Executive Dashboard.** Same bug as the
  Dataset Explorer fix in 2.2.1: `onNavigateNext` was accepted as a prop but never wired to a
  button. Added the matching "Proceed to Stage 5" button.
- **DOCX export produced a file no Word-compatible reader could open.** Selecting "DOCX" in
  Reports & Export downloaded a file labelled with the real Word MIME type and `.docx`
  extension, but the payload was still plain text — the same failure mode already correctly
  avoided for PDF (per the existing code comment: "a real PDF needs an xref table... a text
  payload labelled application/pdf yields a file no reader can open") but never applied to
  DOCX. Removed the option rather than build a real OOXML writer for a format not otherwise in
  scope.
- **XLSX quick-export button was a mislabeled duplicate of CSV** (called the same CSV handler,
  downloaded a `.csv` file despite the button saying "XLSX"). Removed.
- **ZIP quick-export button was permanently non-functional** — wired to
  `document.getElementById('export-trigger-btn')`, an id that does not exist anywhere in the
  app, so it only ever showed a deflection message pointing at a feature that isn't there
  either. Removed. Export is now a single consolidated flow: pick a format, one button
  generates it.
- **Exported report text carried stale H1/H2 statistics** inconsistent with the rest of the
  platform: the "Statistical & Model Estimations" section of the generated report hardcoded H1
  as `H(4) = 48.74` and H2 as `U = 5.22e14`, versus the canonical ≈126.3M and ≈2.69×10¹² shown
  on the dashboard and hypothesis suite. Reconciled, and rewrote the exported content as
  genuine Markdown (proper headings, tables, bold) instead of ASCII-art dividers.

### Added
- `docs/Reports/App_Screenshots.pdf` — full-page screenshots of all seven platform stages in
  light mode, captured end-to-end via a scripted browser walkthrough now that both navigation
  bugs above are fixed.

## [2.2.1] — 2026-09-07

### Fixed
- **Executive Dashboard KPI subtitle**: the "Reported Median LOS" card's subtitle hardcoded
  `+0.0h over benchmark` whenever the value exceeded the 6-hour CIHI benchmark, regardless of
  the actual gap — now computed from the real median LOS (`ExecutiveKPIGrid.tsx`).
- **H5 contingency panel showed static example numbers**: the "Admission Disparity" stat pill
  hardcoded `Δ 0.62%` and `Cramér's V = 0.0210` in JSX instead of the values `run_h5`/the
  client-side mirror actually computed — now derives disparity from the observed contingency
  table and receives `cramersV` as a prop (`AnalyticsCore.tsx`).
- **Longitudinal Trend badge always claimed significance**: both the collapsed-header badge and
  the expanded card unconditionally read "Statistically Significant Trend (p < 0.0001,
  Monotonic Upward)" regardless of the Mann-Kendall result for the active dataset — now derives
  significance, p-value, and direction from `trends.mk` (`AnalyticsCore.tsx`).
- **Manual CSV uploads always reported 0 duplicate records**: `DatasetUpload.tsx`'s demo-dataset
  path computed real duplicate counts via a `Set`, but the "browse a file" path hardcoded
  `duplicates: 0`. Applied the same dedup check to uploaded files.
- **Upload Quality Score floor**: the score was clamped to a minimum of 88% no matter how much
  missing/duplicate data a file had, and always rendered green. Removed the artificial floor and
  colour-coded the score (green ≥90, amber ≥70, red below).
- **Architecture pipeline stage cards always showed "VERIFIED"**: each of the four pipeline
  stage cards rendered a green checkmark and "VERIFIED" regardless of the stage's actual
  `status` (`ready`/`pending`/other). Now branches icon, colour, and footer label on status.
- **Data Table column headers truncated with no way to read the full name**: unlike the data
  cells (which have a `title` tooltip), truncated header labels like `FISCAL_YEAR_STA…` had
  none. Added `title={col.label}` (`DataTable.tsx`).
- **Accessibility**: two icon-only buttons (Prep & Quality Engine's dataset-preview close and
  full-inspection back button) had only a `title` attribute, not an `aria-label`; the five
  report-chapter checkboxes in Export Reports weren't wrapped in a `<label>`, so clicking the
  visible text didn't toggle them and screen readers had no accessible name for each control.
- **Invalid Tailwind utility classes** that silently generated no CSS: `h-13` → `h-14` (Prep
  pipeline action button/status bars), `w-84` → `w-80` (Strategic Insights evidence tooltip),
  `py-0.2` → `py-0.5` (Dashboard Filters "N active" badge, Custom Chart Builder preset badge).

## [2.2.0] — 2026-09-05

### Fixed
- **H3 Single Source of Truth Reconciled**: Eliminated all stale multivariate regression fallbacks ($R^2 = 0.3163$, slope $-116.60\text{ min}$, $-1.94\text{ h}$) across frontend dashboards, strategic insights, export reports, and backend synthesis services. Reconciled all references to the canonical univariate WLS model across 5 triage categories ($N = 760$, total visit weight $174,207,395$, $\beta_1 = -73.9240\text{ min/unit}$ [$-1.232\text{ h/unit}$], intercept $\beta_0 = 430.9542\text{ min}$ [$7.183\text{ h}$], $R^2 = 0.6256$, $F = 1266.6521$, $p = 7.10 \times 10^{-164}$, 95% CI $[-78.0016, -69.8465]\text{ min}$).
- **ERBI Burden Reconciled to Canonical 9.32**: Corrected legacy 8.33 placeholders in `ExecutiveKPIGrid.tsx`, `strategic_synthesis_service.py`, `ExportReports.tsx`, and `ResourceBurdenTrend.tsx` to canonical $9.32$ score-hours per visit ($1,623,142,920.63$ total burden hours over $174,207,395$ visits).
- **Metric Decoupling (ERBI vs TEM)**: Distinctly separated Estimated Resource Burden Index (acuity-weighted reported LOS proxy: $\Sigma(\text{urgency} \times \text{LOS hours} \times \text{visits}) / \Sigma(\text{visits}) = 9.32$) from Total ED-Minutes (TEM: time-volume scale $\text{visits} \times \text{median LOS minutes}$).
- **Forecasting Methodology Standardized**: Replaced all mentions of "Holt's Linear" with "Simple Exponential Smoothing (SES)" and 95% prediction intervals in analytics hubs, reports, and charts, conforming to backend forecasting implementation.
- **H2 Terminology & Metrics Hardened**: Enforced "Admitted vs Non-Admitted" (never "Discharged") across all views and reconciled median stay durations ($10.60\text{ h}$ vs $2.50\text{ h}$, $U = 2.689 \times 10^{12}, z = 6,952.46, r_b = 0.9981, p < 0.001$).
- **Longitudinal Trend Reconciled**: Grounded 19-year annual series (FY 2003–2021) in canonical `age_sex` table ($4.91\text{M}$ to $13.99\text{M}$ arrivals, peak $15.08\text{M}$ in FY 2018-19, total $175,762,944$ visits, Mann-Kendall $Z = 5.5977, p < 0.001$, Sen's slope $= 550,907.4\text{ visits/year}$).
- **Causal Claims Removed**: Enforced strict non-causal academic phrasing in `AboutProject.tsx`, `H3UrgencyRegression.tsx`, and `ConsultantInsights.tsx`.

### Added
- Dedicated backend analytical routes: `/api/statistics/h5` (Pearson Chi-Square & Cramér's V), `/api/statistics/trend` and `/trends` (Mann-Kendall), `/api/statistics/forecast` (SES), and `/api/statistics/erbi` (canonical burden metrics).
- Explicit warning banners in `DataExplorer.tsx` when backend data services are unreachable, preventing silent fallback substitution.
- Architecture specification updates detailing React 19.0.1, database topology (6 tables, 8,685 rows), and clear decoupling between deterministic Python analytics and optional Gemini assistant features.

## [2.1.2] — 2026-09-04

### Fixed
- `App.tsx`'s enterprise sidebar was `position: fixed` on every screen narrower than the
  `md` (768px) breakpoint, permanently overlaying the left ~256px (~80px collapsed) of the
  viewport at `z-40` with no way to dismiss it, while the main content div still rendered at
  full width underneath, starting at `x: 0`. On a 390px-wide viewport this covered roughly
  two-thirds of the screen and intercepted clicks on the content beneath it (confirmed via a
  Playwright walkthrough — a `Next:` button click timed out with "subtree intercepts pointer
  events"). Added mobile-drawer behaviour: a header hamburger button opens it, a dismissible
  backdrop and slide transform (`-translate-x-full` / `translate-x-0`, gated by
  `md:translate-x-0`) close it, and the sidebar's own collapse button now closes the drawer
  on mobile instead of collapsing it.
- Executive Dashboard KPI card subtitles (`ExecutiveKPIGrid.tsx`) were clipped mid-word by a
  forced `truncate` even though the card had vertical room to spare — e.g. "18.00M Admitted
  Inpati…", "1.62B Acuity-Weighted…", "100% Empirical Decisi…" on a full 1440px desktop
  viewport. Replaced with wrapping text so the full subtitle renders on up to two lines.

### Changed
- The sidebar is now `sticky` (desktop/tablet) instead of scrolling out of view after about
  one viewport height on long pages such as the Executive Dashboard (~5300px tall); mobile
  keeps its `fixed` drawer behaviour via the same responsive class.

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
