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
| Testing | pytest — 177 tests across 17 suites |

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

- `backend/analytics/statistics/` contains **pure computation only** — Kruskal-Wallis,
  chi-square, OLS regression, ANOVA, assumption checks. No business logic, no I/O.
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

---

## The Five Hypotheses

Length of stay in emergency department data is strongly right-skewed, so the platform
defaults to non-parametric methods rather than assuming normality.

| ID | Research question | Method |
| :-- | :--- | :--- |
| **H1** | Does LOS differ across CTAS triage levels? | Kruskal-Wallis with Dunn post-hoc (Bonferroni) |
| **H2** | Does LOS differ between admitted and discharged visits? | Mann-Whitney U |
| **H3** | Does CTAS urgency score predict LOS? | OLS linear regression |
| **H4** | Does LOS differ across patient age groups? | Kruskal-Wallis, four cohorts |
| **H5** | Is patient sex associated with visit disposition? | Chi-square test of independence |

Each hypothesis has a handler in `backend/analytics/hypothesis/` and a matching test suite.

---

## Data

### Sources

| Path | Contents |
| :--- | :--- |
| `data/Explorer Dataset/` | Cleaned CSVs and the notebooks that produced them |
| `data/cleaned dataset/` | Master workbook containing all six datasets as sheets |
| `backend/database/healthcare.db` | The seeded analytical database |

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

---

## Report Export

Reports export as genuine PDF documents through the browser's print engine rather than a
generated text file. Charts are rendered as vector graphics and remain sharp at any zoom
level. The approach requires no additional dependency; the operator selects **Save as PDF**
as the print destination.

---

## Testing

The platform ships **177 tests across 17 suites**.

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
| `test_model_validation.py` | 33 | Splitting, polynomial fitting, metrics, curves, fit verdict |
| `test_dashboard_services.py` | 29 | Dashboard, insights and dataset service layers |
| `test_user_datasets.py` | 28 | Cleaned-dataset persistence and cohort isolation |
| `test_data_loader.py` | 15 | Cleaned-dataset to schema column contract |
| `test_preprocessing.py` | 13 | Cleaning, feature engineering, validation |
| `test_h1.py`–`test_h5.py` | 37 | The five hypotheses and their statistical routines |
| `test_dashboard.py` | 8 | KPI aggregation, ERBI, insight generation |
| `test_analytics.py` | 5 | Analytics and statistics engine |
| `test_api.py` | 3 | FastAPI endpoint handlers |
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
│   └── database/          Schema, connection manager, loader, seeded database
├── data/                  Cleaned datasets and source workbooks
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
