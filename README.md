# Healthcare Analytics Platform

A full-stack analytics platform for Emergency Department (ED) performance, built for the
DAMO-699 capstone at the University of Niagara Falls Canada. The system ingests Canadian
Institute for Health Information (CIHI) emergency department data and delivers statistical
hypothesis testing, throughput forecasting, executive dashboards, and exportable clinical
reports.

---

## Overview

The platform addresses a single operational question: **what drives Emergency Department
length of stay, and which patient cohorts are most affected?** It answers this through five
pre-registered statistical hypotheses, an interactive data explorer, and an executive
dashboard, all reading from a reproducible analytical database.

| Capability | Description |
| :--- | :--- |
| Data preparation | Client-side cleaning engine with deduplication, imputation, normalisation and feature engineering |
| Hypothesis testing | Five fixed hypotheses (H1–H5) using non-parametric methods appropriate to skewed clinical data |
| Model validation | Post-cleaning overfitting / underfitting diagnostics with learning and complexity curves |
| Executive dashboard | KPI cards, resource burden index (ERBI), and ranked clinical problems |
| Forecasting | Simple exponential smoothing with Mann-Kendall trend detection |
| Reporting | Multi-format export including genuine vector PDF output |

---

## Recent Updates

**v2.2.2** — CI fix, navigation gaps, and export cleanup (see [CHANGELOG.md](CHANGELOG.md)):
- Fixed the Backend Test Suite CI workflow, which had been failing on every push since a
  scratch script got swept into pytest's default test discovery.
- Fixed the Statistical Analysis stage having no button to reach the Executive Dashboard
  (same class of bug as the Dataset Explorer fix below).
- Removed a DOCX export option that produced an unopenable file, a duplicate XLSX button, and
  a permanently non-functional ZIP button; consolidated Reports & Export to one clean flow.
- Added `docs/Reports/App_Screenshots.pdf`, a full-page walkthrough of all seven stages.

**v2.2.1** — UI/UX correctness pass (see [CHANGELOG.md](CHANGELOG.md) for full detail):
- Fixed several dashboard/analytics displays that showed static example values instead of the
  computed result (KPI benchmark subtitle, H5 contingency disparity/Cramér's V, longitudinal
  trend significance badge).
- Fixed uploaded-file duplicate detection and removed an artificial quality-score floor in
  `DatasetUpload.tsx`; architecture pipeline stage cards now reflect real stage status instead
  of always showing "VERIFIED".
- Accessibility: added missing `aria-label`s on icon-only buttons, wrapped report-chapter
  checkboxes in `<label>`s, added a tooltip for truncated Data Table column headers.
- Fixed three invalid Tailwind utility classes (`h-13`, `w-84`, `py-0.2`) that silently produced
  no CSS.

**v2.2.0** — Master Capstone Platform Audit & Analytical Consistency Hardening:
- Established a single source of analytical truth across the database, Python analytics engines, FastAPI endpoints, React pages, and PDF export dossier.
- Reconciled H3 WLS regression parameters to canonical univariate model ($R^2 = 0.6256$, slope $\beta_1 = -73.92\text{ min/score}$ [$-1.232\text{ h/score}$], $p < 0.001$).
- Reconciled ERBI to canonical $9.32$ score-hours per visit ($1.623\text{B}$ total burden hours), cleanly decoupled from TEM (Total ED-Minutes: $visits \times median\_los\_min$).
- Standardized forecasting methodology to Simple Exponential Smoothing (SES) with 95% prediction intervals (deprecating "Holt's Linear").
- Reconciled 19-year annual volume series to canonical `age_sex` table ($4.91\text{M}$ to $13.99\text{M}$ visits, $N = 175,762,944$, Mann-Kendall $Z = 5.5977, p < 0.001$).
- Standardized H2 terminology and metrics to "Admitted vs Non-Admitted" visits ($10.60\text{ h}$ vs $2.50\text{ h}$, $U = 2.689 \times 10^{12}, r_b = 0.9981$).
- Enforced non-causal language and added explicit warning banners for API fallbacks. See [CHANGELOG.md](CHANGELOG.md) for the complete audit log.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Recharts |
| Node server | Express (`server.ts`), port **3000** — serves Vite in middleware mode, handles uploads, Excel parsing and Gemini insight calls |
| Python backend | FastAPI (`backend/main.py`), port **8000** — 33 routes, sync handlers (see [Connection pooling](#connection-pooling--concurrency)) |
| Database | SQLite, schema in `backend/database/schema.sql`, pooled via SQLAlchemy (see below) |
| Auth | JWT bearer tokens (`python-jose` + `passlib`) gating every FastAPI route except `/` and `/api/health`; `POST /api/auth/login` is rate-limited (`slowapi`, 5/minute/IP) — see [Authentication](#authentication) |
| Testing | pytest — 299 tests across 20 suites |

The platform runs as two services on two ports. The user interface remains functional
without the Python backend, though model diagnostics and dataset persistence report as
unavailable.

---

## Installation

The bootstrap script is the fastest path on a development machine. A containerised
alternative requiring no local Node or Python install is described under
[Docker Deployment](#docker-deployment) at the end of this document.

### Option 1 — Bootstrap script (recommended)

```bash
python launch.py
```

`launch.py` performs the entire setup in sequence and requires no other command:

| Step | Action |
| :-- | :--- |
| 1 | Installs Node dependencies via `npm install` |
| 2 | Creates the Python virtual environment at `.venv`, and **recreates it if broken** — for example when the project was copied from another machine |
| 3 | Installs `requirements.txt` into that environment |
| 4 | Runs the test suite as a smoke check. Failures are reported but do not halt startup |
| 5 | Starts the development server and opens `http://localhost:3000` in the default browser |

The script keeps the server in the foreground; `Ctrl+C` stops it cleanly.

Prerequisites: Python 3.10 or later, and Node.js 20 or later.

> `launch.py` starts the **Node server only**. The FastAPI analytics backend is launched
> separately — see *Running the platform* below.

### Option 2 — Manual setup

```bash
npm install
```

```bash
pip install -r requirements.txt
```

---

## Running the platform

The frontend and Node server, on port **3000**:

```bash
npm run dev
```

The Python analytics backend, on port **8000**, in a separate terminal:

```bash
python -m backend.main
```

Both are required for the full feature set. The Node server proxies
`/api/model-diagnostics/*` and `/api/user-datasets/*` through to FastAPI; the interface
remains usable without it, reporting those two features as unavailable.

All Python commands must be run from the repository root — every module imports `backend.*`,
which resolves only when the root is the working directory.

The FastAPI backend requires a bearer token on every route except `/` and `/api/health` (see
[Authentication](#authentication)). It works with no configuration — `AUTH_USERNAME` /
`AUTH_PASSWORD` default to `admin` / `changeme`, and `SECRET_KEY` falls back to a per-process
random value if unset — but a real deployment should set all three explicitly:

```bash
# .env, or the environment the server runs in
AUTH_USERNAME=admin
AUTH_PASSWORD=changeme
SECRET_KEY=some-long-random-value      # required for tokens to survive a server restart
```

`server.ts` reads the same `AUTH_USERNAME` / `AUTH_PASSWORD` variables to log into FastAPI on
the app's behalf when proxying `/api/model-diagnostics/*` and `/api/user-datasets/*` — see
[Authentication](#authentication) for why the Node layer, not the browser, holds this token.

### Additional commands

| Task | Command |
| :--- | :--- |
| TypeScript type check | `npm run lint` |
| Production build | `npm run build` |
| Start the production build | `npm start` |
| Rebuild the database | `python -m backend.database.load_csv` |
| Preview a rebuild | `python -m backend.database.load_csv --dry-run` |
| Initialise schema only | `python -m backend.database.init_database` |

---

## Codebase knowledge graph (graphify)

The repo ships a graphify setup under `.claude/`: a knowledge graph of the codebase that
answers structural questions without grepping through the source. The configuration is
committed; the tool itself is not, so each developer installs it once.

### One-time setup

The package is `graphifyy` (two y's); the command it installs is `graphify`.

```bash
uv tool install --upgrade graphifyy
```

`pip install graphifyy` works without `uv`. Then check that the command resolves on PATH,
because the `PreToolUse` hooks in `.claude/settings.json` call it by bare name:

```bash
graphify --version
```

Until it resolves, those hooks fail on every Bash, Grep, Read and Glob call in Claude Code.
If the command is not found, add the relevant tool directory (`uv tool dir`, or pipx's
`~/.local/bin`) to PATH and reopen the terminal.

Build the graph once by typing `/graphify .` at the **Claude Code prompt**, from the repo
root. It is a slash command, not a shell command: running it in PowerShell or cmd only
returns "not recognized as an internal or external command".

### Everyday use

| Task | Command |
| :--- | :--- |
| Ask a structural question | `graphify query "how does H1 load its data"` |
| Trace how two things connect | `graphify path "FitDiagnostics" "sqlite_loader"` |
| Explain one concept | `graphify explain "ERBI"` |
| List architectural hubs | `graphify god-nodes --top 10` |
| Find what a change affects | `graphify affected "loader"` |
| Refresh after committing | `graphify update .` |

`graphify update .` re-extracts from the AST with no LLM call and no API cost. Run it after
committing so the graph does not answer from code that no longer exists.

Only `graphify-out/GRAPH_REPORT.md` is committed, as a readable architecture overview. The
graph itself, the HTML view and the caches stay local: they are generated, and `graph.json`
would conflict on nearly every merge.

---

## Architecture

The full specification, including layer contracts and conformance checks, is documented in
[architecture.md](architecture.md).

### Runtime topology

The platform runs as **three** processes, not two:

| Process | Entry point | Port | Role |
| :--- | :--- | :--- | :--- |
| React SPA | `index.html` → `frontend/src/main.tsx` | served by the process below | UI, client-side cleaning, Recharts visualizations |
| Node server | `server.ts` (Express) | **3000** | Serves the SPA (Vite in middleware mode during dev, static `dist/` in production), owns the preload/upload dataset pipeline, and calls Gemini |
| Python backend | `backend/main.py` (FastAPI) | **8000** | Hypothesis testing (H1–H5), model diagnostics, cleaned-dataset persistence, executive KPIs |

`server.ts` is the single HTTP entry point a browser talks to. Most routes it answers
directly in Node; two prefixes — `/api/model-diagnostics` and `/api/user-datasets` — it
proxies verbatim to FastAPI (forwarding the `X-Session-Id` header so isolation still holds),
returning a `backend_offline` status if that service isn't running rather than failing the
whole request. The root `package.json` (`npm run dev` → `tsx server.ts`) is what actually
runs the app; `frontend/package.json` duplicates the same UI dependencies for standalone
`tsc`/`vite` tooling against the same `frontend/src/` tree, but the app itself is built and
served from the repository root.

Several names inside `server.ts` describe what a piece of infrastructure *emulates*, not
what it *is* — worth knowing before assuming Postgres, Redis, or DuckDB are actually running:

| Name used in code | What it actually is |
| :--- | :--- |
| "PostgreSQL Metadata Store" | A single JSON file, `uploads/metadata.db.json`, read/written whole on every access |
| "Redis Cache" (`RedisCacheManager`) | An in-process `Map` with manual TTL expiry — cleared on server restart |
| "DuckDB" query engine (`executeDuckDBQuery`) | Hand-written JS filter/group-by/aggregate over an in-memory array, no SQL engine involved |
| "Parquet" files | Plain `JSON.stringify`d arrays under `uploads/parquet/` |
| Forecasting "worker job" | A `setTimeout`-deferred async function on the same event loop, not a separate worker process or queue |

None of this is a defect — it's a deliberately dependency-free simulation of a heavier BI
stack for a capstone deployment — but the architecture should be read as "single Node
process emulating these systems," not "these systems are deployed."

### Analytical layering

The analytics core enforces a strict separation:

- `backend/analytics/statistics/` contains **pure computation only** — the frequency-weighted
  Kruskal-Wallis/Mann-Whitney/Dunn engine (`weighted.py`), chi-square, WLS regression, ANOVA,
  assumption checks. No business logic, no I/O.
- `backend/analytics/hypothesis/` holds the H1–H5 handlers, which compose the statistics
  layer and shape response payloads.
- `backend/services/` owns data access and business rules. API routers remain transport
  only, containing no SQL.

### Three data paths

The platform maintains three independent data flows, backed by **two separate SQLite
files**, and the separation is deliberate.

**Path A — live session.** Cleaning executes client-side in the browser. Cleaned rows enter
React state, which fans out synchronously to the explorer, statistical analysis, dashboard,
insights and reporting pages. The cohort is also persisted via FastAPI to its own isolated
table (`user_dataset_<id>`) in `backend/database/healthcare.db`, so it survives a refresh.

**Path B — seeded store.** FastAPI analytics (H1–H5, KPIs, ERBI, forecasting) read the six
seeded tables in that same `backend/database/healthcare.db`, which are rebuilt offline from
the cleaned master workbook by `load_csv.py`. A user's upload never writes these tables —
this is what keeps the H1–H5 cohort fixed and the figures reported in the capstone
reproducible, regardless of platform use.

**Path C — Node preload store.** `server.ts` independently ingests the five raw capstone
CSVs (`ED_Visits`, `CTAS_Triage`, `Visit_Disposition`, `Main_Problems`, `Demographics`) via
`better-sqlite3` into a *second*, gitignored database at `uploads/healthcare_analytics.db`
the first time `/api/preload-datasets` is called, then serves subsequent requests straight
from SQLite. This is the store behind the Dataset Explorer's sheet browser
(`/api/dataset/:sheet`, `/api/dataset/statistics/:sheet`) and is entirely separate from
Path A/B's Python-side database — the two never share a connection or a file.

### Concurrent users

Uploads are scoped by an opaque session identifier the browser generates on first load and
sends as an `X-Session-Id` header. Each session lists and reads only its own datasets; a
request for another session's dataset returns 404, which avoids confirming that the
identifier exists at all.

Concurrency was verified with two simultaneous uploads: both succeeded, each landed in its
own table with no cross-contamination, and the seeded cohort was unchanged.

> This is isolation, not per-user authentication. The session identifier is generated
> client-side and sent unverified, so it prevents users from encountering each other's data
> by accident rather than defending against a determined caller. The JWT layer below gates
> *access to the API at all*; it does not attach an identity to a session, so it does not by
> itself change this paragraph — see [Authentication](#authentication).

### Authentication

Every FastAPI route requires a bearer token except `/` and `/api/health`. There is a single
seeded account (`AUTH_USERNAME` / `AUTH_PASSWORD` in `backend/config/settings.py`, both
overridable by environment variable) rather than a `users` table — this platform has no
self-registration and no per-user roles today, so a token proves "this caller was allowed to
authenticate," not "this caller is a distinct user." Session-scoped dataset isolation (above)
remains a separate mechanism, keyed by the `X-Session-Id` header, not by the JWT subject.

| Piece | Where |
| :--- | :--- |
| Password hashing, token encode/decode | `backend/auth/security.py` (`passlib[bcrypt]`, `python-jose`) |
| `get_current_user` dependency | `backend/auth/dependencies.py` — `OAuth2PasswordBearer`, reads the `Authorization: Bearer …` header |
| `POST /api/auth/login` | `backend/api/auth.py` — the only unauthenticated route besides `/` and `/api/health`; returns `{"access_token", "token_type"}` |
| Wiring | `backend/main.py` — `app.include_router(router, dependencies=[Depends(get_current_user)])` for every router except `auth` |
| Rate limiting | `backend/auth/rate_limit.py` (`slowapi`) — `POST /api/auth/login` is capped at **5 attempts/minute per IP**; a caller over the limit gets `429` with `{"error": "Rate limit exceeded: 5 per 1 minute"}` instead of reaching the password check |

The browser never holds this token. `server.ts` is the only client of the FastAPI backend in
the deployed app — it proxies `/api/model-diagnostics/*` and `/api/user-datasets/*` — so it
logs in with the seeded credentials on first proxied request, caches the token in memory, and
re-authenticates once on a `401` (e.g. after a backend restart mints a new ephemeral
`SECRET_KEY`). See `getFastApiToken()` in `server.ts`. This server-to-server login happens at
most a couple of times per backend restart, well under the rate limit above — it isn't a
caller the limit is meant to catch.

The rate limiter's storage is in-memory (`slowapi`'s default `MemoryStorage`): the counter
resets on every restart and is not shared across processes. That's fine for the single-process
deployment this platform runs as, but would need a shared backend (`Limiter(storage_uri=
"redis://...")`) to hold the limit across multiple workers or instances.

### Connection pooling & concurrency

FastAPI route handlers in `backend/api/` are synchronous (`def`, not `async def`) so the
framework runs each one in its threadpool rather than on the single asyncio event loop —
before this, an `async def` handler calling straight into blocking `sqlite3` code would stall
every other in-flight request for the duration of that query. `backend/database/engine.py`
backs this with a pooled SQLAlchemy engine (`QueuePool`, `pool_size=5, max_overflow=10`) so
concurrent requests reuse warm connections instead of opening and closing a new one each time.

SQLAlchemy supplies the pool only, not the query layer: `DatabaseManager.connection()`
(`backend/database/database_manager.py`) checks out a connection via
`engine.raw_connection()` and hands callers the underlying `sqlite3.Connection` directly —
`pandas.read_sql_query`/`to_sql`, `?`-style placeholders and raw cursor calls all work
unchanged, because pandas needs a genuine synchronous DBAPI connection regardless. A
`DatabaseManager` constructed against a custom path (tests, `load_csv.py --target`) gets
`NullPool` instead — connections open and close per checkout exactly as before, so a test's
`TemporaryDirectory` can be cleaned up immediately rather than waiting on a pooled connection
to release its file handle (pooled connections holding a database file open past teardown
fail to delete on Windows).

### AI assistance (Gemini)

Three routes in `server.ts` call the Gemini API (`gemini-3.5-flash`, via `@google/genai`)
with a lazily-initialized client (`getGeminiClient()`) that only activates when
`GEMINI_API_KEY` is set in the environment:

| Route | Purpose |
| :--- | :--- |
| `POST /api/smart-query` | Turns a natural-language question into structured column filters |
| `POST /api/assistant/chart-builder` | Turns a natural-language chart request into a chart config (type, axes, aggregation, color) |
| `POST /api/analyze-dataset` | Generates an executive-style dataset summary, KPI cards, findings, and recommendations |

Every route wraps its Gemini call in a `try/catch` and falls back to a deterministic,
keyword-matched heuristic (and, for `/api/analyze-dataset`, a set of pre-written
domain-specific analyses — healthcare, SaaS, marketing, retail) when the client is absent or
the call fails, returning `isFallback: true` so the caller can distinguish a genuine model
response from the offline heuristic. This is why the platform's AI-assisted features work
with no API key configured, just with generic rather than data-specific output.

---

## The Five Hypotheses

Length of stay in emergency department data is strongly right-skewed, so the platform
defaults to non-parametric methods rather than assuming normality.

| ID | Research question | Method |
| :-- | :--- | :--- |
| **H1** | Does LOS differ across CTAS triage levels? | Weighted Kruskal-Wallis with Dunn post-hoc (Bonferroni) |
| **H2** | Does LOS differ between admitted and non-admitted visits? | Weighted Mann-Whitney U |
| **H3** | Does CTAS urgency score predict LOS? | Weighted Least Squares regression |
| **H4** | Does LOS differ across patient age groups? | Weighted Kruskal-Wallis with Dunn post-hoc |
| **H5** | Is ED visit volume trending over time, and what resource burden does it represent? | Mann-Kendall trend test + Sen's slope, Simple Exponential Smoothing forecast, and the ERBI composite index |

> **Correction (this audit):** H5 was previously documented here as a chi-square test of
> patient sex vs. visit disposition. That test *is* implemented — `backend/analytics/statistics/chi_square.py`
> and `backend/analytics/hypothesis/H5.py` — but it is exercised only by `tests/test_h5.py`;
> no live route calls it. What `GET /statistics/h5` actually returns, and what
> `AnalyticsCore.tsx` labels "H5" in the running UI (`// H5: ERBI Trend + Holt's Linear Trend
> Forecasting`), is the trend/forecast/ERBI combination now shown above. See
> `BACKEND_STATISTICS_NOTES.md` §14 for the full live-vs-test-only breakdown of every
> hypothesis handler.

Each hypothesis has a *reference* handler in `backend/analytics/hypothesis/` (`H1.py`–`H5.py`)
that is exercised by its matching test suite and by a companion notebook in
`backend/hypothesis testing/` (`H1_testing.ipynb` … `H5_testing.ipynb`), each of which derives
the result independently and checks it against the underlying statistics engine for agreement.
For H1/H2/H4, the **live API** path is a second, separate implementation —
`hypothesis_testing.py`'s own `run_h1_test`/`run_h2_test`/`run_h4_test` — which calls the same
`backend/analytics/statistics/weighted.py` primitives directly, so its numbers agree with the
`hypothesis/H*.py` reference handler even though it's not the same function. For H3, the live
path is `backend/analytics/regression.py::run_h3_regression()` (true visit-weighted WLS),
distinct from the unweighted OLS in `hypothesis/H3.py`. None of `/api/statistics/*` is actually
reachable from the browser in the running app, though: `server.ts` only proxies
`/api/model-diagnostics/*` and `/api/user-datasets/*` to FastAPI (see
[Runtime topology](#runtime-topology)), and nothing in `frontend/src` calls `/api/statistics/*`
either — the H1–H5 results a user actually sees come entirely from the client-side
TypeScript mirror in `AnalyticsCore.tsx`, described next.

### Every row is an aggregate, not an observation

`ctas_triage`, `visit_disposition`, `age_sex`, `main_problems`, and `ed_visits` each store one
row per reported combination — a median LOS plus the `ed_visits` count it summarises. Running
H1/H2/H4 unweighted therefore tests "do the ~900 aggregate rows differ?" instead of "do the
~174 million visits differ?" The platform runs every rank, tie correction, and p-value over
the **visit-weighted** population instead. The single implementation lives in
`backend/analytics/statistics/weighted.py`; `hypothesis_testing.py`, `hypothesis/H*.py`,
`statistics/kruskal.py`, and the client-side mirror in
`frontend/src/pages/StatisticalAnalysis/AnalyticsCore.tsx` all delegate to it — verified to
agree with it bit-for-bit on the seeded H1 cohort (H = 126,319,368.2434, weighted N =
174,207,395). p-values come from exact chi-square, normal, and Student-t survival functions
(pure Python, checked against SciPy to ~1e-12), not the logistic tail approximations the
platform previously used.

The Dataset Explorer's per-column statistics (`excel_service.get_sheet_statistics`) are
weighted the same way: `weighted_quantile`/`weighted_variance`/`weighted_mode` (added to
`weighted.py` alongside the existing `weighted_mean`/`weighted_median`) drive mean, median,
mode, quartiles, and standard deviation for every numeric column whenever its sheet carries
a weight column (`ed_visits`, or `total_visits` on `Demographics`) — the weight column itself,
and sheets without one, keep the plain unweighted `pandas` path. Each weighted result carries
a `weighted_by` field so the frontend can label it.

---

## Data

### Sources

| Path | Contents |
| :--- | :--- |
| `data/Explorer Dataset/` | Raw per-dataset CSV exports and the notebooks that produced them |
| `data/Explorer Dataset/cleaned/` | Cleaned copies, same file names, written by `Explorer_Dataset_Cleaning.ipynb` |
| `data/cleaned dataset/` | Master workbook containing all six datasets as sheets |
| `backend/database/healthcare.db` | The seeded analytical database |

### Explorer Dataset cleaning

`data/Explorer Dataset/Explorer_Dataset_Cleaning.ipynb` audits and cleans the raw exports
that back the dataset explorer, deliberately conservatively: it corrects what is wrong,
flags what is incomplete, and deletes only what is actively misleading and recoverable.
Measured values are never imputed or rewritten.

| Action | What | Why |
| :--- | :--- | :--- |
| Removed | `visit_disposition == 'Total'` and `main_problem == 'Any'` roll-up rows | `ED_Visits.csv` mixes aggregate rows into the detail; the `Total` rows equal the detail sum exactly, so leaving them in doubles every unfiltered total. Recoverable by summing the detail rows. |
| Corrected | `age_group` / `population_category` spelling | `CTAS_Triage.csv` writes an EN DASH (`00–19`); every other export uses an ASCII hyphen (`0-19`). A join on `age_group` across files silently matched nothing until this was normalised. |
| Flagged, not deleted | `is_suppressed` column | CIHI reports small suppressed counts as `0`, not as missing. The row stays visible in the explorer; the hypothesis engines already filter `ed_visits > 0` in SQL. |
| Corrected | `median_los_hours` | Recomputed from the authoritative `median_los_minutes` column rather than trusted as reported. |

`backend/database/load_csv.py` prefers `data/Explorer Dataset/cleaned/` when present and
falls back to the raw files, so table names, column names, and every downstream call site
are unaffected — rebuild with `python -m backend.database.load_csv` after re-running the
cleaning notebook.

**Fixed:** `ctas_urgency_score` previously collapsed CTAS III, `Less urgent`, `Non-urgent`,
and `Unknown` all onto the value `3` — a substring-matching bug in `map_ctas_urgency()`
(`backend/preprocessing/feature_engineering.py`) checked the generic `"urgent"` pattern
before the specific `"less"`/`"non"` checks. Fixed by reordering the checks and mapping the
five CTAS acuity tiers to five distinct scores; `Unknown`/unrecognised triage text now
returns `None` rather than a default score, so it's excluded from H3's regression and the
Executive Dashboard's ERBI breakdown the same way roll-up rows already are, instead of being
silently pooled into a real acuity level. This changed H3's measured result
(`run_h3_regression()`, the live weighted-least-squares engine): sample size 912 → 760
(`Unknown` correctly excluded) and R² rose to 0.6256, since the regression's design matrix
no longer has four of its six triage categories collapsed onto one x-value. The Model Fit
Diagnostics numbers below (an unrelated, unweighted polynomial-degree fit) moved too — see
that section.

### Database provenance

The seeded database is committed to version control deliberately. Applying `schema.sql`
alone produces seven empty tables, so a fresh clone would otherwise render empty dashboards.

The database is fully reproducible from source. `load_csv.py` reads the cleaned master
workbook — the only source carrying all six datasets, including `Age_Sex`, which has no
standalone CSV export.

A rebuild produces **8,685 rows** across the six analytical tables:

```
ed_visits           5,586     ctas_triage           912
visit_disposition     936     age_sex               152
main_problems       1,063     demographics           36
```

### Column contract

The cleaning notebooks emit analyst-facing column names; the schema declares database-facing
names. `COLUMN_MAP` in `load_csv.py` bridges the two:

| Cleaned | Schema |
| :--- | :--- |
| `median_los_minutes` | `median_length_of_stay_min` |
| `median_los_hours` | `length_of_stay_hours` |
| `population_category` | `age_broad_category` |
| `admission_flag` | `is_admitted` |
| `visit_percentage` | `percentage` |

The mapping is guarded by a dedicated test suite, because a silent drift would load NULLs
into analytic columns without raising an error.

---

## Model Fit Diagnostics

After cleaning completes, the platform assesses whether a model trained on the cleaned
cohort generalises or has merely memorised it. A polynomial model is fitted on 70% of the
data and scored on a held-out 30%.

| Signal | Verdict |
| :--- | :--- |
| Training R² < 0.30 | **Underfitting** — the model never learned the signal |
| Training R² − holdout R² > 0.15 | **Overfitting** — it fitted noise specific to the training rows |
| Otherwise | **Good Fit** — performance holds on unseen data |

Underfitting is evaluated first, so a model that failed on its own training data is never
misreported as overfit. Imputation placeholders written during cleaning are excluded from
the fit and counted separately, ensuring a filled gap is never treated as an observation.

Four visualisations accompany the verdict: a learning curve, a complexity curve marking the
optimal polynomial degree, a predicted-versus-actual scatter split by train and holdout, and
a residual plot.

### Running the diagnostics

```bash
python -m pytest tests/test_model_diagnostics_service.py -v
```

That suite asserts all three verdicts are reachable and correctly assigned. In the browser,
the panel appears at the end of the Prep & Quality Engine stage once cleaning completes; the
FastAPI backend must be running for it to compute.

### What these datasets actually show

The verdicts below were measured against the cleaned datasets in this repository, at
polynomial degree 1. They are reported as found rather than as hoped for.

| Dataset | Predictor → Target | n | Train R² | Holdout R² | Verdict |
| :--- | :--- | ---: | ---: | ---: | :--- |
| `Visit_Disposition` | admission flag → LOS hours | 936 | 0.642 | 0.657 | **Good Fit** |
| `CTAS_Triage` | CTAS urgency → LOS hours | 760 | 0.588 | 0.602 | **Good Fit** |
| `ED_Visits` | admission flag → LOS hours | 5,586 | 0.229 | 0.233 | Underfitting |
| `Main_Problems` | ED visits → LOS hours | 1,063 | 0.094 | 0.094 | Underfitting |
| `ED_Visits` | CTAS urgency → LOS hours | 4,655 | 0.007 | 0.012 | Underfitting |
| `ED_Visits` | ED visits → LOS hours | 5,586 | 0.000 | −0.000 | Underfitting |

> `CTAS_Triage` and `ED_Visits` CTAS-urgency rows were re-measured after fixing the
> `ctas_urgency_score` collapse bug (see [Every row is an aggregate](#every-row-is-an-aggregate-not-an-observation)
> and the changelog) — `n` drops because `Unknown` triage rows now correctly score as
> missing rather than a default `3`, and R² rose because the predictor now has five genuinely
> distinct values instead of three.

**Two relationships hold.** Admission status explains roughly 64% of the variance in length
of stay, and holdout R² slightly *exceeds* training R² — the model generalises cleanly, with
no sign of memorisation. CTAS urgency explains around 59%, up from 42% before the urgency-score
fix. Both are clinically expected: admitted patients occupy beds longer, and higher-acuity
presentations take longer to resolve. These support H2 and H3 respectively.

**Most other pairings explain almost nothing**, and the platform says so rather than
presenting a weak model as a finding. Volume (`ED visits`) does not predict length of stay
at all — R² of 0.000 — which is itself a defensible negative result.

**Aggregation level decides whether the CTAS signal is visible.** The same predictor scores
0.588 in `CTAS_Triage` but 0.007 in `ED_Visits`. `ED_Visits` is disaggregated by main problem
and disposition, so case-mix variation swamps the acuity effect. The relationship is real;
it is only detectable once the data is aggregated to the level at which acuity is the
dominant driver. Any claim about CTAS and length of stay should state the aggregation it was
measured at.

### A caution on polynomial degree

The complexity curve for CTAS urgency shows why degree should not be raised casually:

```
degree 1   train R²  0.5877   validation R²  0.6021
degree 2   train R²  0.6339   validation R²  0.6357
degree 3   train R²  0.6824   validation R²  0.6834
degree 4   train R²  0.6824   validation R²  0.6834   ← optimal
degree 5+  train R² -4.6930   validation R² -3.9898
```

`ctas_urgency_score` takes only five distinct values (before the urgency-score fix above, it
effectively took only three — CTAS III/`Less urgent`/`Non-urgent`/`Unknown` were all collapsed
onto `3`, and the "five distinct values" this section used to claim wasn't actually true of
the data). A polynomial above degree 4 is unidentifiable against five points and the fit
collapses — the negative R² means it predicts worse than the mean. R² is deliberately not
clamped at zero, because that collapse is a real signal and hiding it would misrepresent the
model. Five-fold cross-validation gives 0.589 ± 0.034, consistent with the holdout result.

---

## Report Export

Reports export as genuine PDF documents through the browser's print engine rather than a
generated text file. Charts are rendered as vector graphics and remain sharp at any zoom
level. The approach requires no additional dependency; the operator selects **Save as PDF**
as the print destination.

---

## Testing

The platform ships **299 tests across 20 suites**.

```bash
python -m pytest tests
```

| Command | Purpose |
| :--- | :--- |
| `python -m pytest tests -v` | Verbose — every test identifier |
| `python -m pytest tests -q --tb=short` | Fastest readable full run |
| `python -m pytest tests -x` | Stop at the first failure |
| `python -m pytest tests --cov=backend --cov-report=term-missing` | Coverage with uncovered line numbers |
| `python -m pytest tests/test_h1.py -v` | A single suite |
| `python -m pytest tests -k "kruskal" -v` | Select by name pattern |

### Suite coverage

| Suite | Tests | Covers |
| :--- | ---: | :--- |
| `test_weighted_statistics.py` | 38 | The shared weighted engine: exact chi²/normal/Student-t tails, weighted Kruskal-Wallis, Mann-Whitney U, Dunn post-hoc |
| `test_model_validation.py` | 33 | Splitting, polynomial fitting, metrics, curves, fit verdict |
| `test_dashboard_services.py` | 29 | Dashboard, insights and dataset service layers |
| `test_user_datasets.py` | 28 | Cleaned-dataset persistence and cohort isolation |
| `test_hypothesis_pipeline.py` | 34 | H1/H2/H4 against the seeded database, incl. a notebook-anchored parity check |
| `test_model_diagnostics_service.py` | 23 | Underfitting, overfitting and good-fit verdicts end to end |
| `test_data_loader.py` | 15 | Cleaned-dataset to schema column contract |
| `test_h1.py`–`test_h5.py` | 49 | The five hypothesis handlers and their statistical routines |
| `test_preprocessing.py` | 13 | Cleaning, feature engineering, validation |
| `test_user_dataset_isolation.py` | 12 | Session-scoped isolation between concurrent users |
| `test_dashboard.py` | 8 | KPI aggregation, ERBI, insight generation |
| `test_api.py` | 6 | FastAPI endpoint handlers, incl. `/statistics/methods` |
| `test_analytics.py` | 5 | Analytics and statistics engine |
| `test_dependencies.py` | 3 | Every third-party import declared in `requirements.txt` |
| `test_architecture_services.py` | 2 | Service orchestration |
| `test_database.py` | 1 | SQLite connection lifecycle |

### Frontend tests (Vitest)

The frontend had no test suite until this pass. A minimal one now exists — deliberately
small, meant as a starting point rather than coverage of the whole UI:

```bash
npm run test
```

| File | Covers |
| :--- | :--- |
| `frontend/src/utils/biEngine.test.ts` | `buildSemanticModel()`'s Dimension/Measure classification, `calculateAdvancedStats()`'s mean/median/count (incl. the empty-input case), `calculateLinearRegression()`'s slope/intercept/R² against an exact linear series |
| `frontend/src/components/layout/Layout.test.tsx` | A render smoke test — `Layout` mounts and renders its children |

Configured in `vitest.config.ts` (kept separate from `vite.config.ts`, whose dev-server
settings are tuned for this environment and shouldn't be touched by test tooling), using
`jsdom` + React Testing Library. One environment-specific note: the default `forks` worker
pool fails to spawn on this checkout because the repo path contains spaces — `pool: 'threads'`
is set explicitly to work around that; it can be dropped if the repo is moved to a
space-free path and the default pool is preferred.

---

## Project Structure

```
├── index.html              SPA entry point, loads /frontend/src/main.tsx
├── frontend/src/           React application — pages, components, services, utilities
├── server.ts               Express server (port 3000) — SPA host, dataset preload/upload
│                           pipeline, Node-side SQLite ingestion, Gemini AI routes; proxies
│                           /api/model-diagnostics and /api/user-datasets to FastAPI
├── backend/
│   ├── api/                FastAPI routers (transport only)
│   ├── auth/                JWT + password verification for the single seeded account,
│   │                       plus rate limiting on /api/auth/login (rate_limit.py)
│   ├── analytics/
│   │   ├── statistics/     Pure mathematical routines
│   │   ├── hypothesis/     H1–H5 business handlers
│   │   ├── dashboard/      KPI and ERBI computation
│   │   └── forecasting/    Exponential smoothing
│   ├── services/           Business logic and data access
│   ├── database/           Schema, pooled connection manager (engine.py), loader, seeded
│   │                       database (healthcare.db — Path A/B, committed)
│   └── hypothesis testing/ H1–H5 notebooks, each verified against the running API
├── data/
│   ├── Explorer Dataset/   Raw CSV exports, cleaning notebook, and cleaned/ output
│   └── cleaned dataset/    Master workbook (all six datasets as sheets)
├── uploads/                Node-side state (gitignored): healthcare_analytics.db (Path C),
│                           metadata.db.json, parquet/, exports, logs
├── docs/                   Capstone documentation
├── tests/                  Automated test suites
├── Dockerfile              Container image — Node 20 with Python 3
└── launch.py               One-shot bootstrap
```

### File-by-file reference

**Root**

| File | What it does |
| :--- | :--- |
| `index.html` | The SPA's HTML shell. Mounts React at `#root` and loads `frontend/src/main.tsx` as a module script — the only HTML page in the app. |
| `server.ts` | Express app entry point (see [Runtime topology](#runtime-topology) above). |
| `vite.config.ts` | Vite build config for the root app — React + Tailwind v4 plugins, the `@` path alias, and an HMR toggle disabled via `DISABLE_HMR` during agent-driven edits. |
| `tsconfig.json` | TypeScript compiler options shared by `server.ts` and `frontend/src/`. |
| `package.json` / `package-lock.json` | Root Node manifest. `npm run dev` (`tsx server.ts`), `build`, and `start` are what actually run the app — this is the manifest that matters at runtime. |
| `requirements.txt` | Python dependency manifest for the FastAPI backend (see `PIPELINE_MODULES_REPORT.md` for the full breakdown). |
| `pyrightconfig.json` | Pyright type-checker config for the Python backend — points it at `.venv` and adds `backend/` to the search path. |
| `vitest.config.ts` | Vitest config for the (new, minimal) frontend test suite — `jsdom` environment, React plugin, `pool: 'threads'` to work around a Windows spawn issue with spaces in the repo path. Deliberately separate from `vite.config.ts`. |
| `docker-compose.yml` | Two-service compose file — `node` and `python` — both built from the same `Dockerfile`, distinguished only by `command:`. Only `node` publishes a port to the host; `python` is reachable solely from `node` over the compose network (see [Docker Deployment](#docker-deployment)). |
| `Dockerfile` | Container image definition — Node 20 base plus a Python 3 virtualenv. One image serves both compose services. |
| `.env.example` | Template for `.env` (gitignored) — `AUTH_USERNAME`/`AUTH_PASSWORD`/`SECRET_KEY`/`CORS_ORIGINS`/`GEMINI_API_KEY`. Loaded automatically by `backend/config/settings.py` (`python-dotenv`) and by `server.ts` (`dotenv`). |
| `launch.py` | One-shot local bootstrap: installs Node/Python dependencies, verifies the analytical database, frees stale ports, runs the test suite as a smoke check, then starts both servers. |
| `architecture.md` | The full architecture specification — layer contracts and conformance checks referenced throughout this README. |
| `DASHBOARD_ROADMAP.md` | A planning/roadmap document for dashboard engineering work — describes target state and grading goals, not necessarily what's implemented today. |
| `hypothesis_testing_analysis.md` | A generated status snapshot from a hypothesis-testing pipeline run (H1–H5 telemetry). |
| `alerts.md` | Not documentation — a cached GitHub API error response ("Code scanning is not enabled…") left over from an earlier command. Safe to delete. |
| `scratch_verify_data.py` | An ad-hoc, standalone script that recomputes H1 directly against `scipy` (`friedmanchisquare`, `wilcoxon`, `kendalltau`, `theilslopes`) as an independent cross-check — outside the main pipeline, not imported by it. |

**Backend — `backend/api/` (FastAPI routers, transport only)**

> ⚠️ Of these 11 routers, `server.ts` proxies only two to the browser —
> `model_diagnostics.py` and `user_datasets.py` (`PYTHON_PROXY_PREFIXES` at `server.ts:437`).
> The rest are real, tested, and reachable only by calling FastAPI directly on port 8000 —
> nothing in the deployed app's request path reaches them, and (checked directly)
> `ExecutiveDashboard.tsx`, `ConsultantInsights.tsx`, and `ExportReports.tsx` make **no**
> `/api/*` calls at all, computing everything client-side instead. Full breakdown, including
> the same finding for the hypothesis-testing engine, in `PIPELINE_MODULES_REPORT.md` §3–4
> and `BACKEND_STATISTICS_NOTES.md` §14.

| File | What it does |
| :--- | :--- |
| `dashboard.py` | Executive KPI endpoints, computed directly from SQLite tables. Not called by `ExecutiveDashboard.tsx` (see caveat above). |
| `statistics.py` | Statistical analysis endpoints (incl. `/statistics/methods`). Not called by `AnalyticsCore.tsx`. |
| `insights.py` | Strategic recommendations (`get_strategic_recommendations`, `get_insights_summary`). Not called by `ConsultantInsights.tsx`. |
| `reports.py` | A stub — one endpoint, `GET /export-summary`, returning a hardcoded `format_options` list. Not a real report generator and not called by `ExportReports.tsx`, which does its own client-side print-to-PDF. |
| `model_diagnostics.py` | Overfitting/underfitting diagnostics for the post-cleaning dataset. **Genuinely reachable** — proxied. |
| `dataset_explorer_api.py` | Excel worksheets, dataset rows, and statistical summaries for the explorer. |
| `upload.py` | Dataset ingestion and upload handling. |
| `datasets.py` | Dataset management endpoints. |
| `user_datasets.py` | Session-isolated persistence for datasets a user has cleaned (see the concurrency note above). **Genuinely reachable** — proxied. |
| `architecture.py` | Pipeline-overview endpoint. `ArchitecturePipelineCard.tsx` now renders (from `AboutProject.tsx`), but `/api/architecture` still isn't in `server.ts`'s `PYTHON_PROXY_PREFIXES`, so the card's fetch fails against a live backend — it catches that and falls back to its built-in static overview rather than erroring. |
| `auth.py` | `POST /api/auth/login` — the one public router; issues a bearer token for the seeded account (see [Authentication](#authentication)). |

**Backend — `backend/services/` (business logic and data access)**

| File | What it does |
| :--- | :--- |
| `dashboard_service.py` | `DashboardService` — executive KPI queries and dataset metadata summaries. |
| `analytics_service.py` | `AnalyticsService` — decouples API controllers from DB queries and the ERBI engine; also reports pipeline-stage readiness. |
| `insights_service.py` | `InsightsService` — outlier and volume-based recommendation detection. |
| `preprocessing_service.py` | Orchestrates cleaning, feature engineering, and validation for the API layer. |
| `dataset_service.py` | Generic dataset access layer. |
| `user_dataset_service.py` | Persists a user's cleaned dataset into its own isolated SQLite table. |
| `model_diagnostics_service.py` | Fits a train/test split and scores over/underfitting for the Fit Diagnostics panel. |
| `excel_service.py` | Reads the master Excel workbook via pandas/openpyxl for the Dataset Explorer. Column statistics are visit-weighted via `weighted.py` (see [Every row is an aggregate](#every-row-is-an-aggregate-not-an-observation)) whenever the sheet carries a weight column. |

**Frontend — `frontend/src/pages/`**

| File | What it does |
| :--- | :--- |
| `ExecutiveDashboard/ExecutiveDashboard.tsx` | KPI cards, 8 filters, and 9 switchable charts over the seeded ED data — computed entirely client-side (no `/api/*` calls in this file; not fed by `dashboard_service.py`). |
| `DatasetExplorer/DataExplorer.tsx` | Dataset Explorer — loads the master workbook dynamically, all worksheets selectable, no hardcoded data. `DatasetExplorer.tsx` is a thin route wrapper that re-exports it. |
| `PrepQualityEngine/DataCleaning.tsx` | The data preparation & quality engine — 7-step cleaning workflow, 5 validation dimensions, feature engineering. `PrepQualityEngine.tsx` re-exports it as the routed page. |
| `PrepQualityEngine/FitDiagnostics.tsx` | Renders inside `DataCleaning` — visualizes the post-cleaning over/underfitting assessment. Genuinely backed by FastAPI, via the proxied `/api/model-diagnostics/*`. |
| `StatisticalAnalysis/AnalyticsCore.tsx` | The H1–H5 hypothesis-testing UI. **This is where the real numbers come from** — a full client-side TypeScript mirror of the weighted statistics engine, not a caller of `/api/statistics/*` (which isn't proxied). `StatisticalAnalysis.tsx` re-exports it. |
| `StrategicInsights/ConsultantInsights.tsx` | Strategic recommendations page — computed client-side, no `/api/*` calls; **not** backed by `insights_service.py` despite the naming similarity. `StrategicInsights.tsx` re-exports it. |
| `Reports/ExportReports.tsx` | Report export page — triggers the browser's print-to-PDF engine over already-rendered charts, no backend call of any kind. `Reports.tsx` re-exports it. |
| `AboutProject/AboutProject.tsx` | The capstone "about this project" summary page. |

**Frontend — `frontend/src/utils/` and `frontend/src/services/`**

| File | What it does |
| :--- | :--- |
| `utils/types.ts` | Shared TypeScript types/interfaces used across pages (`KPIItem`, `CustomVisualization`, `DatasetStats`, etc.). |
| `utils/biEngine.ts` | Builds the semantic model (`buildSemanticModel`, `SemanticField`) consumed by the dashboard and chart builder. |
| `utils/mockDatasets.ts` | Sample/preloaded dataset definitions offered in the upload UI. |
| `utils/printToPdf.ts` | Wraps the browser print engine for the PDF report export. |
| `services/apiService.ts` | An HTTP client against `/api`. No longer dead code: `App.tsx`, `DataCleaning.tsx`, `CustomChartBuilder.tsx`, `ExecutiveDashboard.tsx`, and `ConsultantInsights.tsx` call its `fetchPreloadedDatasets`/`fetchSqliteStatus`/`fetchDashboardTrends`/`fetchSmartQuery`/`fetchChartBuilderAssistant`/`fetchAnalyzeDataset` exports. Most of these resolve against `server.ts`'s own Node-side routes, not FastAPI. |
| `services/architectureService.ts` | Fetches `/api/architecture/pipeline` for `ArchitecturePipelineCard.tsx`, which now renders (from `AboutProject.tsx`) — but the route still isn't proxied, so the call fails and the card falls back to its static overview (see the `architecture.py` row above). |
| `services/modelDiagnosticsService.ts` | Client for the FastAPI model-diagnostics endpoints — **genuinely live**, via the proxied `/api/model-diagnostics/*`. |
| `services/userDatasetService.ts` | Client for persisting/loading a user's cleaned dataset (`persistCleanedDataset`) — **genuinely live**, via the proxied `/api/user-datasets/*`. |

---

## Docker Deployment

One `Dockerfile` builds a single image carrying both runtimes (Node + Python), so neither
needs to be installed on the host. `docker-compose.yml` builds that image **twice** — once
per service — and overrides its default command so one container runs the Node server and
the other runs FastAPI; this is what actually starts both halves of the app, which running
the raw image alone (`docker run`, no compose) does not.

### Quick start (recommended — via Compose)

```bash
cp .env.example .env    # fill in real AUTH_PASSWORD / SECRET_KEY before this leaves your machine
docker compose up --build
```

The application is then available at `http://localhost:3000`, with FastAPI reachable only
from the `node` container over the compose network — not published to the host. See
[Authentication](#authentication) for what `AUTH_PASSWORD`/`SECRET_KEY` control, and
`guide_to_implement.md` (gitignored, local-only) for the full path to a public HTTPS
deployment on AWS.

### What the image contains

| Stage | Detail |
| :--- | :--- |
| Base | `node:20-slim` |
| System packages | `python3`, `python3-pip`, `python3-venv`, with apt caches cleared to keep the layer small |
| Node dependencies | `npm install` against the copied `package*.json` |
| Python environment | Virtual environment at `/opt/venv`, placed on `PATH`, populated from `requirements.txt` |
| Build | `npm run build` — Vite compiles the frontend, esbuild bundles the server to `dist/server.cjs` |
| Default runtime | `npm start` (Node only) — the default `CMD`, used as-is by the `node` compose service and by a bare `docker run`; the `python` compose service overrides it with `uvicorn backend.main:app --host 0.0.0.0 --port 8000` |

Dependency files are copied before the application source, so Docker's layer cache reuses
the dependency install whenever only application code has changed.

`.dockerignore` keeps `node_modules/`, `.venv/`, `__pycache__/`, `dist/`, `uploads/` and
`.git/` out of the build context. Host artefacts therefore cannot leak into the image, and
the build stays fast.

### Running the image directly (without Compose)

`docker run` alone only gets the Node server — the same limitation the image always had,
now made explicit by the `EXPOSE 3000 8000` and the comment above `CMD` in the `Dockerfile`.
Run FastAPI in a second container from the same image, pointing Node at it:

```bash
docker build -t healthcare-analytics .
docker network create hap-net
docker run -d --name hap-python --network hap-net \
  healthcare-analytics uvicorn backend.main:app --host 0.0.0.0 --port 8000
docker run -p 3000:3000 --network hap-net \
  -e PYTHON_API_URL=http://hap-python:8000 \
  healthcare-analytics
```

`docker compose up` (above) does exactly this, with less to type and no port published for
the Python container by default.

### Persisting uploads

The container creates `uploads/` at build time, but its contents are lost when the container
is removed. Mount a volume onto the `node` service to retain them:

```bash
docker run -p 3000:3000 -v ${PWD}/uploads:/app/uploads healthcare-analytics
```

### Scope of the container

Data cleaning, exploration, dashboards, hypothesis views and report export function from the
`node` service alone. Model fit diagnostics and cleaned-dataset persistence proxy to FastAPI
and report as unavailable unless the `python` service (or a manually run second container,
above) is also up and reachable at `PYTHON_API_URL`.

---

## End-to-End Program Flow

This section traces execution from process start to a rendered chart, naming the concrete
module or library responsible for each step, so the architecture above can be read as a
single continuous path rather than a set of independent layers.

Startup begins with `launch.py` (or, in a container, `docker-compose.yml`/`Dockerfile`),
which installs dependencies, verifies `backend/database/healthcare.db`, and then launches
two independent OS processes. The first is `npm run dev`, which resolves to `tsx server.ts`:
Node loads `dotenv` to populate `process.env` (`GEMINI_API_KEY`, `PYTHON_API_URL`), constructs
an `express` app, and — because `NODE_ENV !== "production"` — calls Vite's `createServer` in
middleware mode so the same Express process both answers API routes and streams the compiled
React bundle. The second process is `python -m backend.main`, which builds a `fastapi`
application, registers `pydantic` request/response models on every router in `backend/api/`,
and starts `uvicorn` listening on port 8000; from this point the two processes communicate
only when Express's `fetch`-based proxy forwards `/api/model-diagnostics/*` and
`/api/user-datasets/*` verbatim, carrying the `X-Session-Id` header, to that Uvicorn socket.

A browser request for `/` is served by Vite's middleware, which returns `index.html`; the
`<script type="module" src="/frontend/src/main.tsx">` tag it contains triggers `react-dom`'s
`createRoot` to mount `App.tsx`, which pulls in `react`'s `useState`/`useEffect`, `lucide-react`
icons, and the `motion` animation library, and lays out the ten pages under Tailwind v4
utility classes compiled by the `@tailwindcss/vite` plugin. `App.tsx` also imports
`biEngine.ts` (`buildSemanticModel`) so every page shares one semantic view of whatever
dataset is currently active in React state.

Data enters the system through three independent code paths that never share a database
connection. In the Node preload path, `GET /api/preload-datasets` in `server.ts` uses the
`xlsx` (SheetJS) library, loaded via a Node `createRequire` shim, to parse the five raw
capstone CSV/XLSX sources; each worksheet is written through `better-sqlite3` into
`uploads/healthcare_analytics.db`, with column types inferred by hand-written heuristics
(`inferColumnType`) rather than a schema file, and subsequent calls read straight back from
that SQLite connection. In the user-upload path, `DatasetUpload.tsx` posts raw rows to
`POST /api/datasets`, which `server.ts` writes as JSON through Node's `fs` module into
`uploads/original/` and `uploads/parquet/` (a JSON file standing in for a columnar format)
and registers in the single `uploads/metadata.db.json` file that the code refers to, in
comments only, as a "PostgreSQL metadata store." In the seeded path, `backend/database/load_csv.py`
runs offline against Python's `csv`/`sqlite3` standard-library modules and
`backend/database/schema.sql` to populate the six seeded tables inside
`backend/database/healthcare.db` — the fixed cohort every hypothesis test reads from.

Cleaning happens client-side first: `DataCleaning.tsx` runs deduplication, imputation, and
CTAS/age-group normalisation directly in the browser over the in-memory dataset, then calls
`persistCleanedDataset()` in `userDatasetService.ts`, which `POST`s to `/api/user-datasets`.
Express's proxy hands that request to FastAPI, where the `user_datasets.py` router (guarded
by the `X-Session-Id` isolation header) calls `user_dataset_service.py`, which uses Python's
`re` module to sanitize column identifiers before writing a session-scoped `user_dataset_<id>`
table through `backend/database/database_manager.py`'s `sqlite3` connection. A parallel,
schema-validation-only version of this pipeline exists for programmatic/offline use:
`backend/services/preprocessing_service.py` composes `backend/preprocessing/cleaning.py` and
`feature_engineering.py` (both `pandas`/`numpy`) with `backend/analytics/preprocessing/validation.py`
(pure `typing`, no data-science dependency) to dedupe, impute, derive fiscal year and CTAS
urgency score, and validate schema/null ratios before a record ever reaches SQLite.

**Correction (later audit pass):** the two paragraphs originally here described statistical
analysis, the dashboard, and insights as calling into the FastAPI routers below. That's what
the Python code is *built* to do, and it's real and tested — but a direct check found
**zero `fetch()` calls to any `/api/*` endpoint** in `AnalyticsCore.tsx`, `ExecutiveDashboard.tsx`,
or `ConsultantInsights.tsx`, and `server.ts` proxies only `/api/model-diagnostics/*` and
`/api/user-datasets/*` to FastAPI — `/api/statistics/*`, `/api/dashboard/*`, and
`/api/insights/*` are not reachable from the browser at all. So here is what actually runs:

Statistical analysis (H1–H5), the Executive Dashboard's KPIs, and the Strategic Insights
recommendations are computed **entirely client-side**, in TypeScript, from data already
sitting in React state. `AnalyticsCore.tsx` contains its own `weightedKruskalWallis()`,
`weightedMannWhitneyU()`, `weightedDunn()`, `wls()`, and `chiSqP()` — a from-scratch mirror of
the math in `backend/analytics/statistics/weighted.py` close enough to agree bit-for-bit on
the seeded cohort, but a separate implementation, not a network call into it.
`ExecutiveDashboard.tsx` and `ConsultantInsights.tsx` work the same way. The Python-side
`backend/analytics/hypothesis/H1.py`–`H5.py` handlers, `dashboard_service.py`,
`analytics_service.py`, and `insights_service.py` are real, correct, and covered by
`pytest` — they are just never in the request path a deployed user actually exercises. Full
detail, including the specific discovery that `GET /statistics/h5` computes something
different from what `hypothesis/H5.py` implements, is in `BACKEND_STATISTICS_NOTES.md` §14
and `PIPELINE_MODULES_REPORT.md` §3–4.

Model-fit diagnostics are the genuine exception: `FitDiagnostics.tsx` calls
`modelDiagnosticsService.ts`, which Express **does** forward to FastAPI's `model_diagnostics.py`
router and `model_diagnostics_service.py`, where Python's `random` module drives the
train/test split and `math` computes the polynomial fit metrics behind the learning/complexity
curves — this one genuinely round-trips through the Python backend, because
`/api/model-diagnostics/*` is one of the two proxied prefixes.

Two natural-language features run entirely inside `server.ts`: `CustomChartBuilder.tsx`'s
chart assistant and the smart-query box each `POST` to a route that calls
`getGeminiClient()` — a lazily-constructed `@google/genai` `GoogleGenAI` client, active only
when `GEMINI_API_KEY` is set — requesting structured JSON from `gemini-3.5-flash` against an
explicit `responseSchema`. `/api/analyze-dataset` follows the same pattern for the AI-generated
executive summary. Every one of these calls is wrapped in `try/catch`: on a missing key or a
failed request, the route falls back to a deterministic, keyword-matched heuristic (with
canned domain-specific analyses for healthcare/SaaS/marketing/retail data), so the UI always
receives a response, flagged `isFallback: true` when it didn't come from the model. Expensive
results — Gemini analyses and DuckDB-style query/statistics computations from
`executeDuckDBQuery` — pass through `RedisCacheManager`, an in-process `Map` with manual TTL
eviction, before being returned.

Finally, `ExportReports.tsx` calls `printToPdf.ts`, which invokes the browser's native print
engine against the already-rendered `recharts` SVG output — producing a genuine vector PDF
with no server round trip, `html-to-image`/`jszip` used only for image/archive export
variants elsewhere in the UI. On the Python side, the loop closes with `pytest` (299 tests
across 20 suites) exercising every module named above, and `graphify update .` re-extracting
this project's own AST into `graphify-out/graph.json` after each commit, so the architecture
documented here stays checkable against the code that actually produced it.

---

## Author

**Bharath Paramasivan**
Master of Data Analytics — University of Niagara Falls Canada
DAMO-699 Capstone Project
