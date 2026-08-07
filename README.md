# Healthcare Analytics Platform

An enterprise-grade, full-stack healthcare analytics application designed for Emergency Department (ED) data analysis, clinical throughput optimization, statistical hypothesis testing, and strategic hospital planning.

---

## 🏗️ Architecture Overview

The application follows a clean, decoupled enterprise architecture with clear separation of concerns across frontend, backend, data storage, documentation, and automated tests:

```
healthcare-analytics-platform/
│
├── frontend/                     # React + TypeScript + Vite UI Application
│   ├── src/
│   │   ├── assets/               # Branding assets & images
│   │   ├── components/           # Reusable UI component library
│   │   │   ├── common/           # Shared UI elements (DatasetUpload)
│   │   │   ├── charts/           # Custom Recharts components (CustomChartBuilder)
│   │   │   ├── tables/           # Data tables & pagination controls
│   │   │   ├── cards/            # Summary & KPI card elements
│   │   │   └── layout/           # Page layout wrappers & navigation
│   │   ├── pages/                # Completed Application Workflow Pages
│   │   │   ├── AboutProject/     # Executive Overview & Architecture Info
│   │   │   ├── PrepQualityEngine/# ETL Data Cleaning & Quality Engine
│   │   │   ├── DatasetExplorer/  # Interactive Data Explorer & Visualizations
│   │   │   ├── StatisticalAnalysis/# Hypothesis Testing & Inferential Stats
│   │   │   ├── ExecutiveDashboard/# High-level KPI Analytics Dashboard
│   │   │   ├── StrategicInsights/# AI-powered Hospital & Policy Insights
│   │   │   └── Reports/          # Multi-format Report Generation & Exports
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── services/             # API client services & HTTP handlers
│   │   ├── utils/                # Utility helpers, types, and BI calculations
│   │   ├── styles/               # Global CSS & Tailwind stylesheets
│   │   ├── App.tsx               # Main Workflow Application Container
│   │   └── main.tsx              # Application Mounting Entry Point
│
├── backend/                      # Python FastAPI Enterprise Backend
│   ├── api/                      # Modular API Routers
│   │   ├── upload.py             # File ingestion & upload endpoints
│   │   ├── datasets.py           # Dataset metadata & query endpoints
│   │   ├── statistics.py         # Statistical analysis API endpoints
│   │   ├── dashboard.py          # Dashboard metric calculations
│   │   ├── insights.py           # Strategic recommendations API
│   │   └── reports.py            # Report export & audit logging API
│   ├── analytics/                # Analytical Calculation Engines
│   │   ├── statistics/           # PURE MATH ONLY - no domain logic
│   │   │   ├── kruskal.py        # Kruskal-Wallis, Mann-Whitney U, Dunn post-hoc
│   │   │   ├── chi_square.py     # Chi-square test of independence
│   │   │   ├── linear_regression.py # OLS regression & summaries
│   │   │   ├── anova.py          # One-way ANOVA
│   │   │   ├── assumptions.py    # Normality & variance checks
│   │   │   └── model_validation.py # Split, fit, metrics, over/underfit diagnosis
│   │   ├── hypothesis/           # H1-H5 business handlers (compose statistics/)
│   │   ├── preprocessing/        # Record-based cleaning, features, validation
│   │   ├── dashboard/            # KPI, ERBI & insight generation
│   │   ├── forecasting/          # Exponential smoothing (core.py)
│   │   ├── descriptive.py        # Descriptive statistics & summaries
│   │   ├── regression.py         # Linear regression & correlation
│   │   ├── trend_analysis.py     # CAGR, YoY & Mann-Kendall trend analysis
│   │   └── erbi.py               # Emergency Room BI operational metrics
│   ├── preprocessing/            # Data ETL & Cleaning Pipelines
│   │   ├── validation.py         # Data validation & schema checks
│   │   ├── cleaning.py           # Imputation & deduplication
│   │   ├── feature_engineering.py# Temporal & demographic encodings
│   │   └── transformations.py    # Aggregations & reshaping
│   ├── database/                 # SQLite Database Layer
│   │   ├── healthcare.db         # Seeded analytical database (COMMITTED)
│   │   ├── schema.sql            # Table definitions
│   │   ├── database_manager.py   # Connection lifecycle & query helpers
│   │   ├── init_database.py      # Schema initialization script
│   │   └── load_csv.py           # Rebuilds the DB from the cleaned workbook
│   ├── models/                   # Pydantic data schemas
│   ├── services/                 # Backend service orchestration
│   ├── utils/                    # Common backend helpers
│   └── main.py                   # FastAPI Application Entry Point
│
├── data/                         # Clinical Dataset Repository
│   ├── raw/                      # Original CIHI Excel (.xlsx) files
│   ├── Explorer Dataset/         # Cleaned CSVs + their cleaning notebooks
│   └── cleaned dataset/          # Master workbook (all 6 sheets) + notebook
│                                 #   ^ the source load_csv.py rebuilds from
│
├── docs/                         # Capstone Documentation & Artifacts
│   ├── Proposal/                 # Capstone proposal documents
│   ├── Literature/               # Literature review & platform methodology
│   ├── Reports/                  # Analytical methods markdown reports
│   └── Screenshots/              # Architecture & system diagrams
│
├── tests/                        # Automated Test Suites (pytest)
│   ├── test_api.py               # FastAPI endpoint & handler tests
│   ├── test_analytics.py         # Statistical engine tests
│   ├── test_architecture_services.py # Service-layer orchestration tests
│   ├── test_dashboard.py         # KPI, ERBI & insight generation tests
│   ├── test_database.py          # SQLite database manager tests
│   ├── test_h1.py                # H1: LOS across CTAS triage levels
│   ├── test_h2.py                # H2: LOS admitted vs discharged
│   ├── test_h3.py                # H3: CTAS urgency score predicting LOS
│   ├── test_h4.py                # H4: LOS across patient age groups
│   ├── test_h5.py                # H5: patient sex vs visit disposition
│   ├── test_model_validation.py  # Split, fit, metrics & over/underfit diagnosis
│   ├── test_data_loader.py       # Cleaned-dataset → schema column contract
│   ├── test_dashboard_services.py# Dashboard, insights & dataset services
│   └── test_preprocessing.py     # Cleaning, feature engineering & validation
│
├── requirements.txt              # Python Dependencies
├── package.json                  # Frontend & Node Server Dependencies
└── README.md                     # Platform Documentation
```

---

## ⚡ Quick Start

### Frontend & Server Execution
```bash
# 1. Install Node.js dependencies
npm install

# 2. Run TypeScript type check
npm run lint

# 3. Start Development Server
npm run dev
```

### Python FastAPI Backend Execution
```bash
# 1. Install Python dependencies (includes pytest and python-multipart)
pip install -r requirements.txt

# 2. OPTIONAL - rebuild SQLite from the cleaned datasets.
#    The seeded database is committed, so a fresh clone works without this.
#    Preview first with --dry-run; this overwrites the six analytical tables.
python -m backend.database.load_csv --dry-run

# 3. Launch FastAPI server (port 8000)
python -m backend.main
```

Both servers are needed for the full platform: `npm run dev` serves the UI on **port 3000**
and proxies `/api/model-diagnostics/*` through to FastAPI on **port 8000**.

---

## 🔐 Security Scanning (CodeQL)

> **Full findings, triage and controls: [docs/Reports/Security-Report.md](docs/Reports/Security-Report.md)**
> — `npm audit` 0 · `pip-audit` 0 · `bandit` 9 medium (all triaged non-exploitable) ·
> 0 reachable injection vectors.

[`.github/workflows/codeql.yml`](.github/workflows/codeql.yml) runs GitHub's CodeQL static
analyser over the TypeScript/JavaScript and Python sources.

| Trigger | When |
| --- | --- |
| `schedule` | **Daily, 07:17 UTC** |
| `push` / `pull_request` | Every change targeting `main` |
| `workflow_dispatch` | On demand |

Findings appear under the repository's **Security → Code scanning** tab.

**Why daily rather than only on push.** CodeQL's query packs are updated continuously. Code
that scanned clean last week can be flagged this week without a single line changing —
because the rules moved, not the code. A push-only trigger never re-examines untouched code,
which is most of the repository most of the time.

> **Licensing.** CodeQL is free on **public** repositories. On a private repo it needs GitHub
> Advanced Security; without it the workflow fails with a licensing error. That failure means
> billing, not a code defect.

### Running it manually

**Option 1 — trigger the workflow from the CLI**

```bash
gh workflow run codeql.yml --ref main
```

Check progress and read the findings without leaving the terminal:

```bash
gh run list --workflow=codeql.yml --limit 5
```

```bash
gh api repos/BharathJD06/DAMO-699-Capstone-Project-Unofficial-/code-scanning/alerts --jq '.[] | "\(.rule.security_severity_level // .rule.severity)\t\(.rule.id)\t\(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)"'
```

**Option 2 — trigger from the browser**

Actions → **CodeQL** → *Run workflow* → branch `main` → *Run workflow*.

**Option 3 — no workflow file at all (GitHub default setup)**

Repository → **Settings** → **Code security** → *Code scanning* → **Set up** → *Default*.
GitHub then manages the schedule itself. Use this only if you delete `codeql.yml` — running
both duplicates every alert.

**Option 4 — run CodeQL locally, before you push**

Download the [CodeQL CLI bundle](https://github.com/github/codeql-action/releases) and put
`codeql` on your `PATH`. Then, from the repository root:

```bash
codeql database create .codeql-db-python --language=python --source-root=. --overwrite
```

```bash
codeql database analyze .codeql-db-python codeql/python-queries:codeql-suites/python-security-extended.qls --format=sarif-latest --output=codeql-python.sarif
```

For the frontend and Node server:

```bash
codeql database create .codeql-db-ts --language=javascript-typescript --source-root=. --overwrite
```

```bash
codeql database analyze .codeql-db-ts codeql/javascript-queries:codeql-suites/javascript-security-extended.qls --format=sarif-latest --output=codeql-ts.sarif
```

Read the results without a SARIF viewer:

```bash
python -c "import json;d=json.load(open('codeql-python.sarif'));[print(f\"{r['ruleId']}: {r['message']['text']}\") for run in d['runs'] for r in run['results']] or print('No findings')"
```

Add `.codeql-db-*/` and `*.sarif` to `.gitignore` if you scan locally — the databases are
large and are build artifacts.

### Complementary checks (already available, no setup)

```bash
npm audit --audit-level=moderate
```

```bash
pip-audit -r requirements.txt
```

CodeQL finds vulnerable *code patterns*; these two find vulnerable *dependencies*. They do
not overlap — run both.

---

## 🗄️ Database & Data Provenance

### The two databases

| Database | Engine | In git? | Lifecycle |
| --- | --- | --- | --- |
| `backend/database/healthcare.db` | Python `sqlite3` | ✅ **committed on purpose** | Seeded offline. Reproducible via `load_csv` — see below |
| `uploads/healthcare_analytics.db` | Node `better-sqlite3` | ❌ ignored | Genuinely dynamic — recreated at runtime on dataset upload |

### Why `healthcare.db` is committed

SQLite creates the *file* automatically on first connection, so an empty database needs no
seeding — but `schema.sql` alone yields **seven empty tables**. Committing the seeded file
means a fresh clone has working dashboards before anyone runs the loader. The committed file
holds roughly **17,200 rows**:

| Table | Rows |
| --- | --- |
| `ed_visits` | 8,512 |
| `ed_visits_2003_2021` | 1,994 |
| `main_problems` | 1,994 |
| `visit_disposition` | 1,755 |
| `ctas_triage` | 1,710 |
| `age_sex` | 1,083 |
| `ed_visits_month_age_sex` | 96 |
| `demographics` | 57 |
| `top_10_main_problems` | 10 |
| `metadata` | 6 |

**Do not delete this file and do not add it to `.gitignore`.** `.gitignore` ignores `*.db`
globally and then re-includes this one path explicitly, so the intent survives future edits.

### Rebuilding the database from the cleaned datasets

The database **is reproducible from source**. `load_csv.py` reads the cleaned master
workbook — the only source carrying all six datasets, including `Age_Sex`, which has no
standalone CSV.

```bash
python -m backend.database.load_csv
```

| Command | Purpose |
| --- | --- |
| `python -m backend.database.load_csv` | Rebuild `backend/database/healthcare.db` in place |
| `python -m backend.database.load_csv --dry-run` | Report row counts without writing anything |
| `python -m backend.database.load_csv --db /tmp/test.db` | Build a throwaway copy to verify first |
| `python -m backend.database.init_database` | Apply `schema.sql` only — creates empty tables |

Source priority: `data/cleaned dataset/Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx`
first, falling back per-dataset to `data/Explorer Dataset/*.csv`. The fallback cannot supply
`age_sex` — that sheet exists only in the workbook.

A rebuild yields **10,433 rows** across the six analytical tables:

```
ed_visits           7,296     ctas_triage           912
visit_disposition     936     age_sex               190
main_problems       1,063     demographics           36
```

Verified after rebuild: **zero nulls** in every analytic key column
(`triage_level`, `ctas_urgency_score`, `length_of_stay_hours`, `age_broad_category`,
`is_admitted`, `ed_visits`), and LOS by triage level produces the expected clinical
gradient — CTAS II Emergent 4.57 h down to Non-urgent 1.37 h.

> **Row counts differ from the committed database** (10,433 vs 15,111). The committed file
> was seeded from an earlier, pre-deduplication export. The rebuild reflects the *current*
> cleaning notebooks. Rebuilding will therefore change the figures in dashboards and
> hypothesis output — re-check any numbers quoted in the capstone report afterwards.

`schema.sql` drops and recreates only its seven tables. The three legacy raw-import tables
(`top_10_main_problems`, `ed_visits_2003_2021`, `ed_visits_month_age_sex`) and
`_ingestion_meta` survive a rebuild untouched — no script in the repo creates them, so they
exist only in the committed file.

### Column contract between cleaning and schema

The cleaning notebooks emit analyst-facing column names; `schema.sql` declares
database-facing names. `COLUMN_MAP` in `load_csv.py` is the bridge:

| Cleaned (notebook) | Schema (database) |
| --- | --- |
| `median_los_minutes` | `median_length_of_stay_min` |
| `median_los_hours` | `length_of_stay_hours` |
| `population_category` | `age_broad_category` |
| `admission_flag` | `is_admitted` |
| `visit_percentage` | `percentage` |

`erbi`, `admission_status`, and `population_category.1` are analyst-only and dropped on
load. Change the mapping in the loader, never by renaming columns in the notebooks.
`tests/test_data_loader.py` (15 tests) guards this contract — a silent drift would load
NULLs into analytic columns without raising.

### How cleaned data reaches the charts and reports

Cleaning in the web UI runs **client-side**, and the cleaned rows propagate through React
state — not through SQLite:

```
DataCleaning.tsx  →  App.tsx setCleanedData()  →  DatasetExplorer
   (browser)              (live spine)          →  StatisticalAnalysis
                               │                →  ExecutiveDashboard
                               │                →  FitDiagnostics → FastAPI (stateless)
                               │                →  StrategicInsights
                               │                →  ExportReports → PDF
                               └──► POST /api/datasets → uploads/*.json (audit copy only)
```

A user's cleaning session **never writes to `healthcare.db`**. That database is the shared,
reproducible baseline for the H1–H5 hypotheses and is regenerated only by running the
loader. See architecture.md §4A for the full diagram.

### Minimal file set to run the project

Required:

```
index.html  server.ts  vite.config.ts  tsconfig.json
package.json  package-lock.json  requirements.txt  launch.py
frontend/src/  backend/  backend/database/healthcare.db
data/Explorer Dataset/  data/cleaned dataset/
```

Not required at runtime — though `tests/`, `docs/`, and `architecture.md` belong in an
academic submission:

```
tests/  docs/  architecture.md  data/raw/        (recommended, not required)
src/  bun.lock  metadata.json  Code.md           (legacy / unused)
Dockerfile  .dockerignore                        (deployment only)
pyrightconfig.json  pyrefly.toml                 (dev tooling only)
```

Root `src/` is superseded by `frontend/src/` — `index.html` loads
`/frontend/src/main.tsx`, so nothing in root `src/` executes. `metadata.json` is imported by
no module.

---

## 📉 Post-Cleaning Fit Diagnostics (Overfitting / Underfitting)

After the Data Preparation & Quality Engine finishes cleaning, the **Fit Diagnostics** panel
assesses whether a model trained on the cleaned cohort actually generalises — or has simply
memorised it.

### How the verdict is reached

The cleaned dataset is split 70 / 30 into a training and a held-out set. A polynomial model
of the chosen degree is fitted on the training half only, then scored on both:

| Signal | Verdict |
| --- | --- |
| Training R² < 0.30 | **Underfitting** — the model never learned the signal |
| Training R² − holdout R² > 0.15 | **Overfitting** — it fitted noise specific to the training rows |
| Otherwise | **Good Fit** — performance holds on unseen data |

Underfitting is checked first: a model that failed on its own training data is underfit
regardless of how its equally poor scores happen to differ.

Imputation placeholders written by the cleaning stage (`Unknown`, `N/A`, `null`, …) are
excluded from the fit and reported separately, so a filled gap can never pass as a real
observation.

### Visuals

| Chart | Reads as |
| --- | --- |
| **Learning curve** — RMSE vs training sample size | Curves converging at high error = underfitting; a persistent gap = overfitting |
| **Complexity curve** — R² vs polynomial degree | Where validation R² peaks then falls away from training R² is the onset of overfitting |
| **Predicted vs actual** scatter, train vs holdout | Holdout points scattering further from the diagonal than training points is the overfitting signature |
| **Residual plot** with a zero reference line | Residuals should scatter randomly; visible curvature means the model is too simple |

Four metric cards accompany them: training R², holdout R², the generalization gap, and
5-fold cross-validated R² with its standard deviation across folds.

### Where it lives

| Layer | File |
| --- | --- |
| Pure math | `backend/analytics/statistics/model_validation.py` |
| Business logic | `backend/services/model_diagnostics_service.py` |
| API | `backend/api/model_diagnostics.py` — `POST /api/model-diagnostics/assess`, `POST /api/model-diagnostics/columns` |
| Express proxy | `server.ts` — forwards `/api/model-diagnostics/*` to FastAPI |
| UI | `frontend/src/pages/PrepQualityEngine/FitDiagnostics.tsx` |
| Tests | `tests/test_model_validation.py` (33 tests) |

**Both servers must be running.** The diagnostics compute in FastAPI; the Express dev server
proxies to it. If the Python backend is down the panel says so explicitly rather than
failing silently. Override the target with the `PYTHON_API_URL` environment variable.

```bash
python -m backend.main
```

### PDF export

An **Export as PDF** button sits at the end of the diagnostics panel. It produces a
print-ready report containing the verdict, all four metric cards, all four charts, the data
quality footnote, and a timestamped header — suitable for the capstone appendix. Choose
**Save as PDF** as the destination in the print dialog.

The same helper backs the **Report & Export Center**. Both use
`printPanelAsPdf()` in `frontend/src/utils/printToPdf.ts`, which drives the browser's own
print engine via the `@media print` rules in `frontend/src/styles/index.css`.

Why print rather than a generated file: a valid PDF requires an xref table, object graph,
and embedded fonts. The previous implementation wrote plain text into a Blob typed
`application/pdf`, producing a `.pdf` no reader could open — that is now fixed. The print
engine emits a genuine document and renders the Recharts SVGs as **vector** graphics, so
charts stay sharp at any zoom. It also needs no new dependency.

---

## 🧪 Testing Guide (pytest)

The platform ships **177 automated tests across 17 suites**. All tests are written against
`unittest.TestCase` (plus plain `pytest` functions in `test_architecture_services.py`), so
**pytest runs every one of them** — it is the recommended runner.

### 0. Test Prerequisites

`pytest` is not part of `requirements.txt`, so install the test tooling once:

```bash
pip install pytest pytest-cov
```

> **Important:** always run pytest **from the repository root**. Every suite imports
> `backend.*` modules, which only resolve when the project root is the working directory.

### 1. Run Everything At Once (recommended)

```bash
python -m pytest tests
```

| Part of the command | What it does |
| --- | --- |
| `python -m pytest` | Runs pytest through the current interpreter so the repo root lands on `sys.path` (safer than the bare `pytest` command). |
| `tests` | Limits collection to the `tests/` package, so pytest never wanders into `.venv/`, `node_modules/`, or the skills folders. |

Same run, but with a readable verbose report of every single test name:

```bash
python -m pytest tests -v
```

One-line-per-file summary with short tracebacks — the fastest full-suite view:

```bash
python -m pytest tests -q --tb=short
```

Run everything **and** produce a coverage report for the Python backend:

```bash
python -m pytest tests --cov=backend --cov-report=term-missing
```

Run everything and stop the moment the first test fails (useful while fixing a regression):

```bash
python -m pytest tests -x
```

Run everything, print the 10 slowest tests, and show local variables on failure:

```bash
python -m pytest tests --durations=10 -l
```

### 2. Run One Suite At A Time

Every command below is run from the repository root.

| # | Command | Suite | Tests | What it verifies |
| --- | --- | --- | --- | --- |
| 1 | `python -m pytest tests/test_analytics.py -v` | Analytics & statistics engine | 5 | Descriptive stats, linear regression, H1/H2/H4 test runners, Mann-Kendall trend analysis, exponential-smoothing forecasting, and ERBI metric computation. |
| 2 | `python -m pytest tests/test_api.py -v` | FastAPI endpoints | 3 | The `/statistics` hypothesis endpoints (H1–H5), the statistics dashboard endpoint, and the dashboard KPI/summary endpoints. Falls back to direct handler calls when `fastapi.testclient` is unavailable. |
| 3 | `python -m pytest tests/test_architecture_services.py -v` | Service orchestration layer | 2 | `PreprocessingService.process_dataset` end-to-end (row counts, quality score, sex normalisation, missing-age handling, duplicate flags) and `AnalyticsService.get_pipeline_overview` stage readiness. |
| 4 | `python -m pytest tests/test_dashboard.py -v` | Dashboard KPIs & insights | 8 | ER KPI aggregation (empty and populated), problem ranking, population-category mapping, ERBI scoring, and narrative KPI/hypothesis insight generation. |
| 5 | `python -m pytest tests/test_database.py -v` | SQLite database manager | 1 | `DatabaseManager` against a throwaway temp database: schema scripts, INSERT affected-row counts, and dict-shaped SELECT results. |
| 6 | `python -m pytest tests/test_h1.py -v` | **H1** — LOS across CTAS triage levels | 8 | Kruskal-Wallis (difference detected, insufficient data, no difference), Mann-Whitney U, Dunn post-hoc, and the `H1.run` wrapper. |
| 7 | `python -m pytest tests/test_h2.py -v` | **H2** — LOS admitted vs discharged | 5 | `H2.run` rejects/fails-to-reject the null correctly, returns both group summaries, carries the required response fields, and keeps the U statistic non-negative. |
| 8 | `python -m pytest tests/test_h3.py -v` | **H3** — CTAS urgency score predicts LOS | 8 | `linear_regression` slope/R² on known data, insufficient-data and no-relationship guards, `regression_summary` shape, and the `H3.run` wrapper. |
| 9 | `python -m pytest tests/test_h4.py -v` | **H4** — LOS across patient age groups | 6 | Four-group Kruskal-Wallis across Pediatric/Young/Middle/Older Adult cohorts, group summaries, and post-hoc output. |
| 10 | `python -m pytest tests/test_h5.py -v` | **H5** — patient sex vs visit disposition | 10 | Chi-square independence/association, empty-table defaults, `chi_square_summary` shape, and `H5.run` decisions on strong vs absent association. |
| 11 | `python -m pytest tests/test_model_validation.py -v` | Model validation & fit diagnostics | 33 | Deterministic train/test splitting, polynomial least-squares fitting, RMSE/MAE/R², learning and complexity curves, k-fold cross-validation, and the overfitting / underfitting verdict logic. |
| 12 | `python -m pytest tests/test_dashboard_services.py -v` | Dashboard, insights & dataset service layers | 27 | KPI arithmetic, NULL-aggregate fallbacks, Tukey-fence outlier detection, triage volume ranking, and dataset allow-listing — all against a stubbed database. |
| 12 | `python -m pytest tests/test_preprocessing.py -v` | ETL preprocessing pipeline | 13 | Deduplication, missing-value cleaning, column-name normalisation, population category & LOS columns, fiscal-year extraction, sex/admission encodings, schema validation, null ratios, and the health check. |

### 3. Run A Single Class Or A Single Test

```bash
python -m pytest tests/test_h5.py::TestChiSquare -v
```

```bash
python -m pytest tests/test_h5.py::TestChiSquare::test_chi_square_detects_association -v
```

Select tests by name pattern instead of by path — this runs every hypothesis test that
touches Kruskal-Wallis, wherever it lives:

```bash
python -m pytest tests -k "kruskal" -v
```

Combine patterns with `and` / `or` / `not` — here, every regression test except the
insufficient-data guard:

```bash
python -m pytest tests -k "regression and not insufficient" -v
```

### 4. Run A Group Of Related Suites

All five hypothesis suites (H1–H5) in one command:

```bash
python -m pytest tests/test_h1.py tests/test_h2.py tests/test_h3.py tests/test_h4.py tests/test_h5.py -v
```

Data pipeline only — preprocessing plus the service layer:

```bash
python -m pytest tests/test_preprocessing.py tests/test_architecture_services.py -v
```

API and dashboard layers only:

```bash
python -m pytest tests/test_api.py tests/test_dashboard.py tests/test_database.py -v
```

### 5. Useful Flags Reference

| Flag | Meaning |
| --- | --- |
| `-v` | Verbose — prints every test id and its PASS/FAIL status. |
| `-q` | Quiet — one character per test plus a summary line. |
| `-x` | Exit on the first failure. |
| `--maxfail=3` | Stop after 3 failures instead of running the whole suite. |
| `-k "expr"` | Run only tests whose name matches the expression. |
| `--tb=short` \| `--tb=line` \| `--tb=no` | Control traceback verbosity on failure. |
| `-l` | Show local variable values in tracebacks. |
| `--durations=10` | Report the 10 slowest tests. |
| `--collect-only` | List what would run without executing anything. |
| `-p no:cacheprovider` | Don't write a `.pytest_cache` directory. |
| `--cov=backend --cov-report=term-missing` | Coverage for `backend/`, listing uncovered line numbers (needs `pytest-cov`). |
| `--cov=backend --cov-report=html` | Write a browsable HTML coverage report to `htmlcov/index.html`. |

### 6. Preview The Test Inventory

List all 177 tests without running them — handy for verifying collection works before a full run:

```bash
python -m pytest tests --collect-only -q
```

### 7. Suite Status

**177 passed, 0 failed.**

Three real defects were fixed once `pytest` was installed and the full suite could finally
run — they had been hidden behind a collection error, because the stdlib `unittest` runner
cannot collect the plain pytest functions in `test_architecture_services.py`:

| Defect | Fix |
| --- | --- |
| `PreprocessingService` imported `validate_schema` from `backend.preprocessing.validation` (pandas signature `(df, dataset_name, required_columns)`) but called it with `(records, required_columns)` — `TypeError` on every call | Import from `backend.analytics.preprocessing.validation`, the record-based package |
| `AnalyticsService.get_pipeline_overview` did not exist though `backend/api/architecture.py` calls it, and that router was never registered | Implemented the method with live database-reachability checks; registered the router in `backend/main.py` |
| `DatabaseManager.get_connection()` used `with sqlite3.connect(...)`, which commits the transaction but **never closes the connection** — leaking a handle per query and locking the file | Added a `connection()` context manager using `contextlib.closing()` |

### 8. Legacy unittest Runner

The suites remain compatible with the standard library runner if pytest is unavailable:

```bash
python -m unittest discover tests
```

```bash
python -m unittest tests.test_h5 -v
```
