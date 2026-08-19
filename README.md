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

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Recharts |
| Node server | Express (`server.ts`), port **3000** — serves Vite in middleware mode, handles uploads, Excel parsing and Gemini insight calls |
| Python backend | FastAPI (`backend/main.py`), port **8000** — 31 routes |
| Database | SQLite, schema in `backend/database/schema.sql` |
| Testing | pytest — 291 tests across 20 suites |

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

## Architecture

The full specification, including layer contracts and conformance checks, is documented in
[architecture.md](architecture.md).

### Analytical layering

The analytics core enforces a strict separation:

- `backend/analytics/statistics/` contains **pure computation only** — the frequency-weighted
  Kruskal-Wallis/Mann-Whitney/Dunn engine (`weighted.py`), chi-square, WLS regression, ANOVA,
  assumption checks. No business logic, no I/O.
- `backend/analytics/hypothesis/` holds the H1–H5 handlers, which compose the statistics
  layer and shape response payloads.
- `backend/services/` owns data access and business rules. API routers remain transport
  only, containing no SQL.

### Two data paths

The platform maintains two independent data flows, and the separation is deliberate.

**Path A — live session.** Cleaning executes client-side in the browser. Cleaned rows enter
React state, which fans out synchronously to the explorer, statistical analysis, dashboard,
insights and reporting pages. The cohort is also persisted to SQLite in its own isolated
table (`user_dataset_<id>`) so it survives a refresh.

**Path B — seeded store.** FastAPI analytics read the seeded tables, which are rebuilt
offline from the cleaned master workbook by `load_csv.py`.

A user's upload never writes the six seeded tables. This is what keeps the H1–H5 cohort
fixed, and the figures reported in the capstone reproducible, regardless of platform use.

### Concurrent users

Uploads are scoped by an opaque session identifier the browser generates on first load and
sends as an `X-Session-Id` header. Each session lists and reads only its own datasets; a
request for another session's dataset returns 404, which avoids confirming that the
identifier exists at all.

Concurrency was verified with two simultaneous uploads: both succeeded, each landed in its
own table with no cross-contamination, and the seeded cohort was unchanged.

> This is isolation, not authentication. The identifier is generated client-side and sent
> unverified, so it prevents users from encountering each other's data by accident rather
> than defending against a determined caller. Genuine confidentiality for clinical data
> requires authenticated identity and transport security.

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
| **H5** | Is patient sex associated with visit disposition? | Chi-square test of independence, visit-weighted contingency table |

Each hypothesis has a handler in `backend/analytics/hypothesis/`, a matching test suite, and
a companion notebook in `backend/hypothesis testing/` (`H1_testing.ipynb` … `H5_testing.ipynb`)
that derives the result independently and checks it against the running API for agreement.

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

One data issue is intentionally left uncorrected: `ctas_urgency_score` maps CTAS III,
`Less urgent`, `Non-urgent`, and `Unknown` all onto the value `3`, so H3's predictor cannot
separate the three lowest acuity levels. The `H3_testing.ipynb` notebook surfaces this with
a diagnostic before reporting the regression, since re-deriving the score changes H3's
substantive result — an analyst decision, not a cleaning one.

### Database provenance

The seeded database is committed to version control deliberately. Applying `schema.sql`
alone produces seven empty tables, so a fresh clone would otherwise render empty dashboards.

The database is fully reproducible from source. `load_csv.py` reads the cleaned master
workbook — the only source carrying all six datasets, including `Age_Sex`, which has no
standalone CSV export.

A rebuild produces **10,433 rows** across the six analytical tables:

```
ed_visits           7,296     ctas_triage           912
visit_disposition     936     age_sex               190
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
| `CTAS_Triage` | CTAS urgency → LOS hours | 912 | 0.424 | 0.318 | **Good Fit** |
| `ED_Visits` | admission flag → LOS hours | 7,296 | 0.219 | 0.204 | Underfitting |
| `Main_Problems` | ED visits → LOS hours | 1,063 | 0.094 | 0.094 | Underfitting |
| `ED_Visits` | CTAS urgency → LOS hours | 7,296 | 0.008 | 0.011 | Underfitting |
| `ED_Visits` | ED visits → LOS hours | 7,296 | 0.000 | −0.000 | Underfitting |

**Two relationships hold.** Admission status explains roughly 64% of the variance in length
of stay, and holdout R² slightly *exceeds* training R² — the model generalises cleanly, with
no sign of memorisation. CTAS urgency explains around 42%. Both are clinically expected:
admitted patients occupy beds longer, and higher-acuity presentations take longer to
resolve. These support H2 and H3 respectively.

**Most other pairings explain almost nothing**, and the platform says so rather than
presenting a weak model as a finding. Volume (`ED visits`) does not predict length of stay
at all — R² of 0.000 — which is itself a defensible negative result.

**Aggregation level decides whether the CTAS signal is visible.** The same predictor scores
0.424 in `CTAS_Triage` but 0.008 in `ED_Visits`. `ED_Visits` is disaggregated by main problem
and disposition, so case-mix variation swamps the acuity effect. The relationship is real;
it is only detectable once the data is aggregated to the level at which acuity is the
dominant driver. Any claim about CTAS and length of stay should state the aggregation it was
measured at.

### A caution on polynomial degree

The complexity curve for CTAS urgency shows why degree should not be raised casually:

```
degree 1   train R²  0.4243   validation R²  0.3177
degree 2   train R²  0.5454   validation R²  0.4325   ← optimal
degree 3+  train R² -2.9129   validation R² -3.6682
```

`ctas_urgency_score` takes only five distinct values, so a polynomial above degree 2 is
unidentifiable and the fit collapses — the negative R² means it predicts worse than the
mean. R² is deliberately not clamped at zero, because that collapse is a real signal and
hiding it would misrepresent the model. Five-fold cross-validation gives 0.380 ± 0.064,
consistent with the holdout result.

---

## Report Export

Reports export as genuine PDF documents through the browser's print engine rather than a
generated text file. Charts are rendered as vector graphics and remain sharp at any zoom
level. The approach requires no additional dependency; the operator selects **Save as PDF**
as the print destination.

---

## Testing

The platform ships **291 tests across 20 suites**.

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
| `test_hypothesis_pipeline.py` | 26 | H1/H2/H4 against the seeded database, incl. a notebook-anchored parity check |
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

---

## Project Structure

```
├── frontend/src/          React application — pages, components, services, utilities
├── backend/
│   ├── api/               FastAPI routers (transport only)
│   ├── analytics/
│   │   ├── statistics/    Pure mathematical routines
│   │   ├── hypothesis/    H1–H5 business handlers
│   │   ├── dashboard/     KPI and ERBI computation
│   │   └── forecasting/   Exponential smoothing
│   ├── services/          Business logic and data access
│   ├── database/          Schema, connection manager, loader, seeded database
│   └── hypothesis testing/  H1–H5 notebooks, each verified against the running API
├── data/
│   ├── Explorer Dataset/  Raw CSV exports, cleaning notebook, and cleaned/ output
│   └── cleaned dataset/   Master workbook (all six datasets as sheets)
├── docs/                  Capstone documentation
├── tests/                 Automated test suites
├── server.ts              Express server
├── Dockerfile             Container image — Node 20 with Python 3
└── launch.py              One-shot bootstrap
```

---

## Docker Deployment

A `Dockerfile` builds a self-contained image carrying both runtimes, so neither Node nor
Python needs to be installed on the host.

### Build and run

```bash
docker build -t healthcare-analytics .
```

```bash
docker run -p 3000:3000 healthcare-analytics
```

The application is then available at `http://localhost:3000`.

### What the image contains

| Stage | Detail |
| :--- | :--- |
| Base | `node:20-slim` |
| System packages | `python3`, `python3-pip`, `python3-venv`, with apt caches cleared to keep the layer small |
| Node dependencies | `npm install` against the copied `package*.json` |
| Python environment | Virtual environment at `/opt/venv`, placed on `PATH`, populated from `requirements.txt` |
| Build | `npm run build` — Vite compiles the frontend, esbuild bundles the server to `dist/server.cjs` |
| Runtime | `npm start`, exposing port 3000 |

Dependency files are copied before the application source, so Docker's layer cache reuses
the dependency install whenever only application code has changed.

`.dockerignore` keeps `node_modules/`, `.venv/`, `__pycache__/`, `dist/`, `uploads/` and
`.git/` out of the build context. Host artefacts therefore cannot leak into the image, and
the build stays fast.

### Persisting uploads

The container creates `uploads/` at build time, but its contents are lost when the container
is removed. Mount a volume to retain them:

```bash
docker run -p 3000:3000 -v ${PWD}/uploads:/app/uploads healthcare-analytics
```

### Scope of the container

> The image runs the **Node server only**. Model fit diagnostics and cleaned-dataset
> persistence proxy to the FastAPI backend on port 8000, and report as unavailable unless
> that service also runs. Data cleaning, exploration, dashboards, hypothesis views and
> report export all function normally.
>
> To include the analytics backend, run FastAPI alongside the container and point the server
> at it with the `PYTHON_API_URL` environment variable, or extend the image with a process
> manager that supervises both services.

---

## Author

**Bharath Paramasivan**
Master of Data Analytics — University of Niagara Falls Canada
DAMO-699 Capstone Project
