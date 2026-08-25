# Healthcare Analytics Platform — Architecture Specification & Roadmap

**Project Title:** Operational & Clinical Modelling of Emergency Department Wait Times  
**Institution:** University of Niagara Falls — Master of Data Analytics (Capstone Project)  
**Author:** Bharath Paramasivan  
**Document Version:** 2.0  
**Target Evaluation Grade:** 9.8 – 10.0 / 10.0  

---

## 1. Executive Overview

The **Healthcare Analytics Platform** is a full-stack, enterprise-grade clinical decision support and operational forecasting platform built for Emergency Department (ED) performance monitoring. It synthesizes emergency department dataset records from the Canadian Institute for Health Information (CIHI) into actionable executive insights, rigorous statistical hypothesis validations, predictive throughput forecasts, and interactive patient flow visualizations.

### Core Architectural Principles
1. **Unidirectional Data Flow**: Data flows unidirectionally from Raw CIHI CSV files → Preprocessing Engine → SQLite Relational Database → Modular Analytics Core → FastAPI Service Layer → React Component Hierarchy.
2. **Strict Analytical Decoupling**: Pure mathematical computation routines (`statistics/`) are separated from business logic handlers (`hypothesis/`, `dashboard/`, `forecasting/`).
3. **Relational Source of Truth**: All runtime analytics read strictly from the SQLite database via a thread-safe Repository pattern—never reading raw CSVs directly inside frontend pages or API routes.
4. **Statistical Rigor for Skewed Clinical Data**: Length of Stay (LOS) distributions are predominantly right-skewed; thus, non-parametric statistical methods (Kruskal-Wallis, Mann-Whitney U, Dunn Post-Hoc with Bonferroni correction) are prioritized over naive parametric assumptions.

---

## 2. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 REACT FRONTEND                                   │
│    (Vite + React 18 + TypeScript + Tailwind CSS + Recharts + Lucide Icons)       │
│                                                                                  │
│   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐      │
│   │ Executive Dashboard│   │  Dataset Explorer  │   │ Hypothesis Testing │      │
│   └─────────┬──────────┘   └─────────┬──────────┘   └─────────┬──────────┘      │
└─────────────┼────────────────────────┼────────────────────────┼──────────────────┘
              │                        │                        │
              ▼                        ▼                        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               FASTAPI BACKEND API                                │
│                     (Async REST API Endpoints & Route Handlers)                  │
│                                                                                  │
│   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐      │
│   │  /api/dashboard/*  │   │   /api/datasets/*  │   │  /api/statistics/* │      │
│   └─────────┬──────────┘   └─────────┬──────────┘   └─────────┬──────────┘      │
└─────────────┼────────────────────────┼────────────────────────┼──────────────────┘
              │                        │                        │
              ▼                        ▼                        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              MODULAR ANALYTICS CORE                              │
│                                                                                  │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐  │
│  │   preprocessing/      │ │     statistics/       │ │      hypothesis/      │  │
│  │ Cleaning, Validation, │ │ Kruskal, ANOVA, OLS,  │ │ H1: CTAS vs LOS       │  │
│  │ Feature Eng, Ingestion│ │ Chi-Square, Normality │ │ H2: Admit vs Disch    │  │
│  └──────────┬────────────┘ └──────────┬────────────┘ │ H3: CTAS Predicts LOS │  │
│             │                         │              │ H4: Age vs LOS        │  │
│             │                         │              │ H5: Sex vs Disposition│  │
│             │                         │              └──────────┬────────────┘  │
│             │                         │                         │               │
│             │              ┌──────────┴────────────┐            │               │
│             │              │     forecasting/      │            │               │
│             │              │  SES, Mann-Kendall,   │            │               │
│             │              │  YoY, CAGR Trends     │            │               │
│             │              └──────────┬────────────┘            │               │
│             │                         │                         │               │
│             │              ┌──────────┴────────────┐            │               │
│             │              │      dashboard/       │            │               │
│             │              │ ERBI Burden, Ranking, │            │               │
│             │              │ Executive Summaries   │            │               │
│             │              └──────────┬────────────┘            │               │
└─────────────┼─────────────────────────┼─────────────────────────┼────────────────┘
              │                         │                         │
              ▼                         ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           PERSISTENCE & STORAGE LAYER                            │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                 SQLite Database (backend/database/healthcare.db)        │   │
│   │                 WAL Mode • Thread-Safe Repository Layer                  │   │
│   │  Tables: age_sex, ctas_triage, visit_disposition, main_problems, etc.    │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Current Architecture Breakdown

### 3.1 Frontend Architecture (`frontend/src/`)
- **Framework**: React 18 with Vite fast build tooling and TypeScript static typing.
- **UI & Layout**: Tailwind CSS for responsive styling; Lucide React for consistent clinical iconography.
- **Data Visualization**: Recharts engine rendering interactive line graphs, stacked bar charts, scatter plots, and volume heatmaps.
- **Module & Component Taxonomy**:
  - `pages/`:
    - `ExecutiveDashboard/`: Executive KPIs, patient volume trends, ERBI resource burden, hypothesis evidence hub.
    - `StatisticalAnalysis/`: `AnalyticsCore.tsx`, `AnalyticsEngine.tsx` for granular analytical breakdowns.
    - `StrategicInsights/`: `ConsultantInsights.tsx` clinical and operational recommendations.
    - `PrepQualityEngine/`: `DataCleaning.tsx`, `FitDiagnostics.tsx` for data hygiene and ML model fit validation.
    - `DatasetExplorer/`: `DataExplorer.tsx` tabular browsing, summary metrics, and custom visual charts.
    - `Reports/`: `ExportReports.tsx` PDF executive summaries, audit logs, and CSV data exports.
    - `AboutProject/`: Academic capstone specifications, data limitations, and clinical problem statement.
  - `components/`: Modular reusable UI components (`cards/MetricCard.tsx`, `charts/CustomChartBuilder.tsx`, `tables/DataTable.tsx`, `common/DatasetUpload.tsx`, `architecture/ArchitecturePipelineCard.tsx`).
  - `services/`: Typed API client interfaces (`apiService.ts`, `architectureService.ts`, `modelDiagnosticsService.ts`, `userDatasetService.ts`).
  - `utils/`: Centralized business utilities (`formatters.ts`, `biEngine.ts`, `printToPdf.ts`, `mockDatasets.ts`).
  - `types/`: Canonical domain contracts and schemas (`types/domain.ts`, `types/index.ts`).

### 3.2 Backend Service Architecture (`backend/`)
- **Framework**: FastAPI high-performance ASGI server with Pydantic schema validation.
- **Layering Pattern**:
  - `backend/api/`: REST route endpoints mapping web requests to analytical services.
  - `backend/services/`: Orchestrates data fetching, business rule application, and responses.
  - `backend/config/settings.py`: Centralized configuration (file paths, server options, significance thresholds, forecast constants).
  - `backend/database/database_manager.py`: SQLite connection manager using Write-Ahead Logging (WAL) and automated schema initialization.

### 3.3 Analytics & Intelligence Engine (`backend/analytics/`)
Organized into 5 isolated submodules:

1. **`preprocessing/`**:
   - `cleaning.py`: Deduplication, missing value imputation, `snake_case` normalization.
   - `feature_engineering.py`: Derived fiscal years, standardized age groups, binary admission flags.
   - `validation.py`: Schema completeness validation, null ratio calculation, dataset health scoring (0–100).
   - `sqlite_loader.py`: Ingests cleaned CSV datasets directly into SQLite tables.

2. **`statistics/`**:
   - `kruskal.py`: Non-parametric Kruskal-Wallis H-test, Mann-Whitney U test, Dunn's post-hoc with Bonferroni correction.
   - `anova.py`: One-way Analysis of Variance.
   - `chi_square.py`: Pearson Chi-Square test of independence with contingency matrix processing.
   - `linear_regression.py`: Ordinary Least Squares (OLS) regression engine yielding slope, intercept, $R^2$, Pearson correlation, and $p$-value.
   - `assumptions.py`: Shapiro-Wilk normality approximations, Levene variance homogeneity, and sample size adequacy checks.

3. **`hypothesis/`**:
   - `H1.py`: Tests if Length of Stay (LOS) differs across CTAS Triage Levels (Kruskal-Wallis + Dunn).
   - `H2.py`: Tests if LOS differs between Admitted vs Discharged visits (Mann-Whitney U).
   - `H3.py`: Evaluates if CTAS Urgency Score predicts LOS (OLS Linear Regression).
   - `H4.py`: Tests if LOS differs across Patient Age Groups (Kruskal-Wallis + Dunn).
   - `H5.py`: Evaluates association between Patient Sex and Visit Disposition (Chi-Square).

4. **`forecasting/`**:
   - `linear_forecast.py`: Simple Exponential Smoothing (SES) with 95%/99% Confidence Intervals & OLS trend projection.
   - `trend_analysis.py`: Compound Annual Growth Rate (CAGR), Year-over-Year (YoY) growth, and Mann-Kendall non-parametric monotonic trend test.

5. **`dashboard/`**:
   - `kpis.py`: Calculates Estimated Resource Burden Index (ERBI), overall admission rates, and dynamic problem ranking.
   - `insights.py`: Generates executive narratives and operational recommendations.

### 3.4 Data Directory Structure (`data/`)

**As implemented** (verified against the working tree):

- `data/raw/`: Original CIHI raw datasets (3 `.xlsx` files).
- `data/Explorer Dataset/`: Cleaned, platform-ready CSVs plus their cleaning notebooks —
  `ED_Visits.csv`, `CTAS_Triage.csv`, `Visit_Disposition.csv`, `Main_Problems.csv`,
  `Demographics.csv`.
- `data/cleaned dataset/`: Final merged analytical dataset and notebook.
- `backend/database/healthcare.db`: The SQLite database. It lives **beside the database
  layer, not under `data/`** — `DatabaseManager.DEFAULT_DB_PATH` resolves to
  `backend/database/healthcare.db`.

> **Documentation drift — resolved.** Earlier revisions of this section described
> `data/optimized/`, `data/explorer/`, `data/sqlite/`, and `data/exports/`. None of those
> directories exist. The paths above are the real ones.
>
> This drift is not cosmetic: `backend/database/load_csv.py` and `server.ts` still read from
> `data/optimized/`, so **database seeding is currently broken** and every table is skipped
> with "CSV not found". The committed `healthcare.db` is therefore the only copy of the
> ~17,200 analytical rows. See README.md → "Database & Data Provenance".

---

## 4. Data Ingestion & Transformation Flow

```
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐
│ Raw CIHI CSVs   │ ──► │ Cleaning & Feature   │ ──► │ Explorer Datasets     │
│ (data/raw/)     │     │ Engineering          │     │ (data/Explorer Dataset/)│
└─────────────────┘     └──────────────────────┘     └──────────┬────────────┘
                                                                │
                                                                ▼
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐
│ React UI /      │ ◄── │ FastAPI Routes &     │ ◄── │ SQLite Database       │
│ Recharts Charts │     │ Analytical Submodules│     │ (backend/database/*.db)│
└─────────────────┘     └──────────────────────┘     └───────────────────────┘
```

---

## 4A. Runtime Data Flow — Cleaning → Visualization → Reports

The platform runs **two distinct data paths**. Conflating them is the most common source of
confusion about "where the data lives", so they are separated explicitly here.

### Path A — Live session flow (dynamic, per user, in-memory)

This is what happens when a user works in the browser. It is fully dynamic: cleaned data
propagates to every downstream stage without a database round-trip.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  1. UPLOAD / SELECT          DatasetUpload.tsx                                 │
│         │                    user file or preloaded CIHI dataset               │
│         ▼                                                                      │
│  2. CLEANING ENGINE          PrepQualityEngine/DataCleaning.tsx                │
│         │                    runs CLIENT-SIDE in the browser (TypeScript):     │
│         │                    dedupe → impute → normalise → feature-engineer    │
│         ▼                                                                      │
│  3. onDataCleaned(rows)  ──► App.tsx:  setCleanedData(rows)                    │
│         │                    ◄── THE SINGLE LIVE SPINE (React state) ──►       │
│         │                                                                      │
│         ├──────────────► POST /api/datasets  (Express, audit copy)             │
│         │                 writes uploads/original/{id}.json                    │
│         │                        uploads/parquet/{id}.parquet.json             │
│         │                 registers in uploads/metadata.db.json                │
│         │                                                                      │
│         ├──────────────► POST /api/user-datasets  (FastAPI, PERSISTENCE)       │
│         │                 CREATE TABLE user_dataset_<id>  ← isolated           │
│         │                 registers in the user_datasets registry              │
│         │                 ⚠ NEVER writes the six seeded H1-H5 tables           │
│         ▼                                                                      │
│  4. FAN-OUT AS PROPS — every consumer reads the same cleaned state             │
│         ├─► DatasetExplorer      interactive tables & charts                   │
│         ├─► StatisticalAnalysis  hypothesis testing views                      │
│         ├─► ExecutiveDashboard   KPI cards & ERBI                              │
│         ├─► FitDiagnostics ──► POST /api/model-diagnostics/assess              │
│         │                       (FastAPI, stateless compute, returns verdict)  │
│         ├─► StrategicInsights   Gemini-backed recommendations                  │
│         └─► ExportReports  ──► PDF via browser print engine (printToPdf.ts)    │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Properties of Path A**

| Property | Behaviour |
| --- | --- |
| In-session propagation | Synchronous — a change to `cleanedData` re-renders every downstream page immediately. |
| Persistence | **Isolated tables.** Each cleaning run creates `user_dataset_<id>` and a `user_datasets` registry row, so the cohort survives a refresh and is queryable by SQL. |
| Isolation | The six seeded H1–H5 tables are **never** written. One user's upload cannot change another's results, or the capstone's reported figures. |
| Failure mode | Non-fatal. If the Python backend is down, persistence is skipped and the workflow continues entirely from React state, as it did before. |
| Side-effect copy | JSON audit files under `uploads/` (gitignored, rebuilt on demand). |

**Why isolated tables rather than overwriting the analytical tables.** Writing a user's
upload into `ed_visits`/`ctas_triage`/… would make H1–H5 results depend on whoever uploaded
last, and the figures quoted in the capstone report would stop being reproducible. The
registry pattern gives dynamic persistence *and* a fixed baseline.

**The registry is created lazily by the service, not declared in `schema.sql`.** `schema.sql`
drops and recreates its tables, so declaring `user_datasets` there would make every
`load_csv` rebuild silently destroy user uploads. `tests/test_user_datasets.py` asserts the
registry is absent from `schema.sql`.

### Session-scoped isolation

Concurrent users are isolated by an opaque session identifier the browser generates on first
load and stores in `localStorage`. It travels as an `X-Session-Id` header, is forwarded by
the Express proxy, and is recorded in `user_datasets.owner_id`.

```
browser (localStorage uuid) ──X-Session-Id──► Express proxy ──► FastAPI ──► owner_id
```

| Operation | Scoped behaviour |
| --- | --- |
| `POST /api/user-datasets` | Stamps the caller's session as `owner_id` |
| `GET /api/user-datasets` | Returns only that session's datasets |
| `GET /api/user-datasets/{id}` | **404** when the dataset belongs to another session |
| `DELETE /api/user-datasets/{id}` | **404**; one session cannot destroy another's data |

**404 rather than 403 is deliberate.** Confirming that an id exists but belongs to someone
else would leak the existence of other users' data.

**Omitting the header returns everything.** Offline scripts and administrative callers keep
working, and rows created before scoping existed (`owner_id IS NULL`) remain reachable that
way — but they are *not* inherited by the first scoped session to arrive, which would
otherwise adopt everyone's history.

**Migration is additive.** `_ensure_registry()` issues `ALTER TABLE ADD COLUMN` when
`owner_id` is absent, rather than recreating the registry — a rebuild would orphan every
persisted upload.

> ### This is isolation, not authentication
>
> The session id is generated client-side and sent unverified, so anyone can forge it with
> `curl`. It reliably prevents users from seeing each other's uploads **by accident**; it is
> not a defence against a determined caller, and it is not a confidentiality control for
> real clinical data.
>
> Genuine multi-tenancy needs authenticated identity, transport security, and per-request
> authorisation. Tracked in §6.4.

`tests/test_user_dataset_isolation.py` (12 tests) covers cross-session read, delete, listing,
the legacy-row rule, and the additive migration.

| Endpoint | Purpose |
| --- | --- |
| `POST /api/user-datasets` | Persist cleaned rows into a new isolated table |
| `GET /api/user-datasets` | List persisted datasets, newest first |
| `GET /api/user-datasets/{id}` | Rows for one dataset (bounded limit) |
| `DELETE /api/user-datasets/{id}` | Drop the table and its registry row |

Column names come from spreadsheet headers and cannot be bound as SQL parameters, so they
are **rewritten** rather than validated — anything outside `[0-9a-zA-Z_]` is replaced, a
leading digit is prefixed, collisions are suffixed, length is capped at 64. Table names are
generated (`user_dataset_<uuid>`), never taken from input, and reads resolve the table name
*from the registry* rather than from the caller.

### Path B — Seeded analytical store (static, shared, on disk)

FastAPI's analytical endpoints (`/api/statistics/*`, `/api/dashboard/*`) read from SQLite,
which is seeded **offline** from the cleaned datasets:

```
data/raw/*.xlsx
      │  cleaning notebooks (data/Explorer Dataset/*.ipynb)
      ▼
data/cleaned dataset/Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx
      │  python -m backend.database.load_csv
      ▼
backend/database/healthcare.db   ──►  DatabaseManager  ──►  analytics/  ──►  FastAPI
```

**Path B is not written to at runtime.** Nothing a user does in the browser modifies
`healthcare.db`. It is regenerated deliberately by running the loader.

### Why both exist

Path A gives each user an isolated, responsive session over their own upload. Path B gives
every user the same reproducible baseline cohort for the H1–H5 capstone hypotheses. Keeping
them separate is what stops one user's upload from mutating the shared analytical record.

---

## 4B. Rebuilding the Analytical Database

`backend/database/load_csv.py` rebuilds SQLite from the **cleaned master workbook**, which
is the only source carrying all six datasets (`data/Explorer Dataset/` has no `Age_Sex.csv`).

```bash
python -m backend.database.load_csv
```

| Command | Purpose |
| --- | --- |
| `python -m backend.database.load_csv` | Rebuild `backend/database/healthcare.db` in place |
| `python -m backend.database.load_csv --dry-run` | Report row counts, write nothing |
| `python -m backend.database.load_csv --db /tmp/test.db` | Build a throwaway copy for verification |
| `python -m backend.database.init_database` | Apply `schema.sql` only (empty tables) |

**Column contract.** The cleaning notebooks emit analyst-facing names; `schema.sql` declares
database-facing names. `COLUMN_MAP` in the loader is the bridge:

| Cleaned (notebook) | Schema (database) |
| --- | --- |
| `median_los_minutes` | `median_length_of_stay_min` |
| `median_los_hours` | `length_of_stay_hours` |
| `population_category` | `age_broad_category` |
| `admission_flag` | `is_admitted` |
| `visit_percentage` | `percentage` |

`erbi`, `admission_status`, and `population_category.1` are analyst-only and dropped on load.
Change the mapping in the loader — never by renaming columns in the notebooks, which would
silently break the other direction. `tests/test_data_loader.py` (15 tests) guards this
contract.

**Rebuild output:**

```
ed_visits           7,296     ctas_triage           912
visit_disposition     936     age_sex               190
main_problems       1,063     demographics           36
                                        Total: 10,433 rows
```

`schema.sql` drops and recreates only these seven tables. The three legacy raw-import tables
(`top_10_main_problems`, `ed_visits_2003_2021`, `ed_visits_month_age_sex`) and
`_ingestion_meta` are untouched by a rebuild.

---

## 4C. Data Flow & Architecture Conformance Checks

The invariants below are what make §1 and §4A true in code rather than only on paper. Each
is mechanically verifiable. Run them before a submission, after adding a route, service,
analytics module or page, and after any change to the cleaning or loading pipeline.

Each check below states how to verify it, so the list can be worked through manually or
scripted.

### Layer boundary checks

| # | Invariant | Verify by | Why it matters |
| :-: | :--- | :--- | :--- |
| C1 | `analytics/statistics/` imports nothing from `database/`, `api/`, `services/`, or `hypothesis/`, and performs no I/O | grep imports in `backend/analytics/statistics/*.py` | Pure math stays unit-testable and reusable; §1 principle 2 |
| C2 | `backend/api/*` routers contain no raw SQL, `read_csv`, `read_excel`, or file handles | grep those tokens in `backend/api/*.py` | Routers must delegate to `services/`; §1 principle 3 |
| C3 | `sqlite3.connect` appears only under `backend/database/` | grep the whole backend | Centralised connection lifecycle |
| C4 | Every `backend/api/*.py` exposing `router` is included in `backend/main.py` | compare `api/` filenames against `include_router` calls | An unregistered router is a silently dead endpoint |
| C5 | No `foo.py` sits beside a `foo/` package | for each module, test whether a directory of the same stem exists | Shadowing makes **both** names unimportable and has already taken the app down |
| C6 | `DatabaseManager.connection()` is used rather than a bare `get_connection()` in a `with` | grep `with .*get_connection` | `with sqlite3.connect(...)` commits but never closes — leaks handles, locks the file |

### Data flow checks (§4A)

| # | Invariant | Verify by | Why it matters |
| :-: | :--- | :--- | :--- |
| C7 | **Path A never writes the six seeded tables.** Runtime writes are confined to `user_dataset_*` tables and the `user_datasets` registry; no handler writes `ed_visits`, `ctas_triage`, `visit_disposition`, `age_sex`, `main_problems` or `demographics` | `tests/test_user_datasets.py::TestSeededCohortIsolation`, plus grep for the seeded names outside `backend/database/` | A write to a seeded table lets one user's upload mutate the shared H1–H5 cohort and breaks reproducibility of the reported figures |
| C8 | Cleaned rows reach every consumer from `App.tsx` state, not by re-fetching | grep consumer pages for `fetch(` against dataset endpoints | State is the single live spine; a second source can disagree with the first |
| C9 | `POST /api/datasets` writes only audit copies under `uploads/` | read the handler in `server.ts` | Audit trail must not double as the analytical store |
| C10 | The only writer to the **seeded tables** is `backend/database/load_csv.py`. `user_dataset_service.py` writes only its own namespace | grep write verbs across the backend and check the target table | Path B is rebuilt deliberately, never incidentally |
| C15 | The `user_datasets` registry is **not** declared in `schema.sql` | grep `schema.sql` | `schema.sql` drops its tables — declaring the registry there would make every rebuild destroy user uploads |

### Loader & schema contract checks (§4B)

| # | Invariant | Verify by | Why it matters |
| :-: | :--- | :--- | :--- |
| C11 | Every `COLUMN_MAP` target exists in `schema.sql` | substring check per target | A missing target loads **NULLs silently** — no exception is raised |
| C12 | Every `SOURCES` table is declared in `schema.sql` | check `CREATE TABLE <name>` per entry | Undeclared table means the load is skipped |
| C13 | Configured source paths exist on disk | `Path.exists()` per source | The previous loader pointed at a non-existent `data/optimized/` and silently skipped every table |
| C14 | Every directory or file named in this document exists | `Path.exists()` per documented path | Documentation drift precedes code drift |

### Current conformance status

Audited against the working tree:

| Check | Status |
| :--- | :--- |
| C1 statistics/ purity | ✅ PASS |
| C2 router thinness | ✅ PASS |
| C3 connection isolation | ✅ PASS |
| C4 router registration | ✅ PASS — all 9 routers registered |
| C5 module shadowing | ✅ PASS |
| C6 connection context manager | ✅ PASS |
| C7 seeded-table write isolation | ✅ PASS — test-enforced |
| C10 single seeded-DB writer | ✅ PASS |
| C11 `COLUMN_MAP` targets | ✅ PASS — 5/5 |
| C12 `SOURCES` tables declared | ✅ PASS — 6/6 |
| C13 source paths exist | ✅ PASS |
| C14 documented paths exist | ✅ PASS |
| C15 registry absent from schema.sql | ✅ PASS — test-enforced |

> **C2 — resolved.** Nine raw SQL statements previously sat inside
> `backend/api/dashboard.py`, `datasets.py`, and `insights.py`. They now live in
> `DashboardService`, `DatasetService`, and `InsightsService`; the routers are transport
> only. This closes the "Service Layer Formalization" item in §6.1.
>
> Each service takes an **optional `manager` argument** defaulting to the shared
> `db_manager`. That injection point is the payoff: `tests/test_dashboard_services.py`
> (27 tests) exercises KPI arithmetic, outlier detection, and volume ranking against a stub
> — no SQLite file, no seeded data. The same logic was untestable while it lived in routers.
>
> The two detection rules in `insights_service.py` are exposed as **pure functions**
> (`detect_outlier_recommendations`, `detect_volume_recommendations`) taking a DataFrame, so
> Tukey-fence thresholds can be tested directly on fixture data.

**On table names in SQL.** A table name cannot be bound as a SQL parameter, so
`DatasetService.get_records` validates the requested name against the live `get_tables()`
list *before* it reaches the statement, and returns `None` on a miss. `InsightsService`
iterates names that come from `get_tables()` itself. Neither path accepts free text.
`_safe_limit()` coerces the row limit to a bounded positive integer, falling back to the
default rather than raising — a malformed query string must not surface as a 500.

`backend/analytics/preprocessing/sqlite_loader.py` contains write verbs but is **imported by
nothing** — dead code, not a C10 violation. Remove it or wire it in deliberately.

---

## 5. Key Domain & Statistical Formulations

### 5.1 Estimated Resource Burden Index (ERBI)
Reflects the weighted operational burden imposed on emergency departments by combining clinical urgency, stay duration, and volume:
$$\text{ERBI} = \frac{\sum \left( \text{CTAS Urgency Score} \times \text{LOS (hours)} \times \text{ED Visits} \right)}{\sum \text{ED Visits}}$$
- **CTAS Urgency Score Mapping**: Inverted scale where Level 1 (Resuscitation) = 5, Level 5 (Non-Urgent) = 1.

### 5.2 Population Category Standardization
Standardized across all analysis modules:
$$\begin{aligned}
\text{0–19 Years} &\longrightarrow \text{Pediatric \& Youth} \\
\text{20–44 Years} &\longrightarrow \text{Young Adult} \\
\text{45–64 Years} &\longrightarrow \text{Middle Adult} \\
\text{65+ Years} &\longrightarrow \text{Older Adult}
\end{aligned}$$

---

## 6. Professional Architecture Enhancements & Recommendations

To transition this platform from an 8.7/10 to a **9.8 – 10.0 / 10.0 Capstone Rating**, the following non-disruptive enhancements are recommended:

### 6.1 Architectural Decoupling & Modularization
- [ ] **Service Layer Formalization**: Wrap database query calls inside specialized service classes (e.g., `DashboardService`, `HypothesisService`, `ExplorerService`) to completely separate database execution from API routes.
- [ ] **Pydantic Model Enforcements**: Define strict Pydantic response models for all analytical outputs (`H1ResponseModel`, `ERBIResponseModel`, `ForecastResponseModel`) to ensure strict API contract enforcement.

### 6.2 Performance & Caching Strategy
- [ ] **In-Memory Analytical Caching**: Implement `@lru_cache` or Redis-backed caching for heavy statistical computations (Kruskal-Wallis post-hoc matrices and Mann-Kendall trend tests) to reduce compute overhead on static datasets.
- [ ] **Database Indexing**: Add explicit SQLite indices on high-cardinality query columns:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_age_sex_year ON age_sex(fiscal_year_start, age_group);
  CREATE INDEX IF NOT EXISTS idx_ctas_level ON ctas_triage(triage_level);
  CREATE INDEX IF NOT EXISTS idx_disposition ON visit_disposition(admission_status);
  ```

### 6.3 Deployment & Infrastructure Readiness
- [ ] **Docker Containerization**: Add a multi-stage `Dockerfile` and `docker-compose.yml` for unified single-command spin-up:
  ```yaml
  version: '3.8'
  services:
    backend:
      build: ./backend
      ports: ["8000:8000"]
      environment:
        - HOST=0.0.0.0
        - PORT=8000
    frontend:
      build: ./frontend
      ports: ["3000:80"]
  ```
- [ ] **Production Nginx Reverse Proxy**: Configure Nginx as an edge proxy with gzip compression, HTTP/2 termination, and static asset caching.

### 6.4 Security & Governance Hardening

> **Current posture: [docs/Reports/Security-Report.md](docs/Reports/Security-Report.md)** —
> full findings, triage, controls, and reproduction commands.
>
> `npm audit` 0 · `pip-audit` 0 · `bandit` 9 medium (all triaged non-exploitable) ·
> CodeQL daily · **0 reachable injection vectors**.

**Completed**

- [x] **SQL identifier allow-listing.** Every dynamic-table query validates the name against
      `get_tables()` before it reaches SQL. A table name cannot be a bound parameter, so this
      is the correct control. Enforced by `TestTableNameAllowListing` — removing the
      allow-list fails the suite.
- [x] **Network binding.** FastAPI defaults to `127.0.0.1` (was `0.0.0.0`, which published
      the full clinical dataset to the LAN). Override with `API_HOST`.
- [x] **Dependency scanning.** `npm audit` + `pip-audit`, plus
      `tests/test_dependencies.py` failing the suite on undeclared imports.
- [x] **Static analysis in CI.** CodeQL, `security-extended`, daily 07:17 UTC —
      `.github/workflows/codeql.yml`.
- [x] **Vulnerable dependency removed.** `xlsx` 0.18.5 → 0.20.3 from the SheetJS CDN
      (prototype pollution + ReDoS; npm had no fix path).
- [x] **Session-scoped dataset isolation.** Uploads are owned by an `X-Session-Id` and are
      invisible to other sessions (§4A). Closes accidental cross-user visibility — a
      verified gap where `GET /api/user-datasets` previously returned every user's data to
      every caller.

**Outstanding**

- [ ] **Branch protection on `main`** — highest-value remaining item. Nothing currently gates
      a direct push, so a future change can bypass every control above.
- [ ] **Authenticated identity.** Session scoping (§4A) prevents *accidental* cross-user
      visibility, but the identifier is client-generated and unverified, so it can be
      forged. Real confidentiality for clinical data needs authentication, transport
      security, and per-request authorisation.
- [ ] **Restrict CORS.** `allow_origins=["*"]` is acceptable locally, not for a deployed instance.
- [ ] **Delete `analytics/preprocessing/sqlite_loader.py`** — dead code containing raw SQL writes.
- [ ] **API Rate Limiting**: Integrate `slowapi` to prevent API denial-of-service on resource-heavy statistical endpoints.
- [ ] **Input Sanitization**: Validate file upload extensions and mime-types prior to SQLite table creation.

### 6.5 Quality Assurance & Test Coverage Expansion
- [ ] **Automated CI/CD Pipeline**: Setup a GitHub Actions workflow (`.github/workflows/ci.yml`) to run pytest and frontend type-checking on every commit.
- [ ] **End-to-End Visual Testing**: Integrate Playwright or Cypress tests verifying dashboard card rendering and chart interaction.

---
## 7.  Directory Structure 

```
DAMO-699-Capstone-Project/
├── backend/
│   ├── api/                  # FastAPI route controllers
│   ├── analytics/            # Modular statistical core
│   │   ├── preprocessing/    # Cleaning, validation, feature engineering, SQLite loader
│   │   ├── statistics/       # Kruskal, ANOVA, Chi-Square, OLS Regression, Assumptions
│   │   ├── hypothesis/       # H1 - H5 hypothesis modules
│   │   ├── forecasting/      # SES forecasting, trend analysis
│   │   └── dashboard/        # ERBI calculations, executive insights
│   ├── database/             # SQLite connection & repository layer
│   ├── services/             # Business logic orchestration
│   ├── models/               # Pydantic request/response schemas
│   ├── config/               # Centralized settings & path configuration
│   └── main.py               # FastAPI entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/    # Executive Dashboard components
│   │   │   ├── explorer/     # Dataset Explorer components
│   │   │   ├── hypothesis/   # Hypothesis testing pages
│   │   │   ├── upload/       # File upload & ingestion wizard
│   │   │   └── shared/       # Navbar, Cards, Loaders, Modals
│   │   ├── pages/            # Top-level page views
│   │   ├── services/         # Axios API HTTP client
│   │   └── types/            # TypeScript interface definitions
├── data/
│   ├── raw/                  # Original CIHI datasets (.xlsx)
│   ├── Explorer Dataset/     # Cleaned CSVs + cleaning notebooks
│   └── cleaned dataset/      # Final merged analytical dataset
├── docs/                     # Capstone deliverables & literature
└── tests/                    # Automated pytest suite (102 tests)
```

> The SQLite database is **not** under `data/` — it sits at
> `backend/database/healthcare.db`, alongside the database layer that owns it. It is
> committed to version control deliberately; see README.md → "Database & Data Provenance".

---
*Document produced as part of the DAMO-699 Capstone Project Architecture Deliverable.*
