# Graph Report - Capstone_Project-DAMO-6994-  (2026-08-24)

## Corpus Check
- 154 files · ~127,911 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1727 nodes · 2687 edges · 130 communities (101 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25f61879`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Healthcare Analytics Platform — Architecture Specification & Roadmap
- hypothesis_testing.py
- dataset_explorer_api.py
- server.ts
- dependencies
- TestH1
- AnalyticsCore.tsx
- Healthcare Analytics Platform
- test_preprocessing.py
- skipUnless
- test_model_validation.py
- chi_square_test
- STATISTICAL COMPUTING HUB
- get_statistics_dashboard
- What You Must Do When Invoked
- user_datasets.py
- Backend Statistics — Study Notes
- test_dashboard.py
- FakeDB
- .diagnose
- modelDiagnosticsService.ts
- test_weighted_statistics.py
- linear_regression
- statistics.py
- .get_kpis
- model_diagnostics_service.py
- types.ts
- weighted_kruskal_wallis
- .persist
- DataExplorer.tsx
- compilerOptions
- run_ed_visits_forecasting
- ExecutiveDashboard.tsx
- devDependencies
- DatabaseManager
- dependencies
- biEngine.ts
- weighted_median
- Healthcare Analytics Platform — Executive Dashboard Engineering Roadmap
- dashboard.py
- datasets.py
- infer_sql_type
- DataCleaning.tsx
- launch.py
- TestSeededCohortIsolation
- TestAPIEndpoints
- TestH4Module
- sqlite_loader.py
- weighted.py
- main.py
- api/insights.py
- upload.py
- APIRouter
- test_dependencies.py
- TestH2Module
- noisy_line
- model_diagnostics.py
- APIRouter
- run_preprocessing.py
- test_dashboard_services.py
- .get_recommendations
- polynomial_fit
- weighted_dunn_post_hoc
- map_columns
- database_manager.py
- schema.sql
- App.tsx
- TestH1Module
- mann_kendall_test
- userDatasetService.ts
- diagnose_fit
- k_fold_scores
- init_database.py
- recharts
- reports.py
- schemas.py
- detect_outlier_recommendations
- graphify reference: extra exports and benchmark
- lucide-react
- train_test_split
- TestLoaderConfiguration
- MetricCard.tsx
- ArchitecturePipelineCard.tsx
- xlsx
- graphify reference: query, path, explain
- DataTable.tsx
- kruskal.py
- scripts
- tsx
- dataset_service.py
- package.json
- UserDatasetService
- graphify
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- Project Notes
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- Layout.tsx
- vite
- rules/graphify.md
- workflows/graphify.md
- analytics/__init__.py
- analytics/preprocessing/__init__.py
- api/__init__.py
- database/__init__.py
- backend/__init__.py
- models/__init__.py
- backend/preprocessing/__init__.py
- services/__init__.py
- config.py
- utils/__init__.py
- extraction-spec.md
- copilot-instructions.md
- tests/__init__.py
- express

## God Nodes (most connected - your core abstractions)
1. `weighted_kruskal_wallis()` - 26 edges
2. `weighted_mann_whitney_u()` - 21 edges
3. `DatabaseManager` - 21 edges
4. `FakeDB` - 21 edges
5. `run_h1_test()` - 19 edges
6. `run_h4_test()` - 18 edges
7. `weighted_mean()` - 17 edges
8. `weighted_dunn_post_hoc()` - 17 edges
9. `rows()` - 17 edges
10. `learning_curve()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `IsolationTestCase` --uses--> `DatabaseManager`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/database/database_manager.py
- `TestGuards` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestOverfittingDetection` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestUnderfittingDetection` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestOwnerScopedAccess` --uses--> `UserDatasetService`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/services/user_dataset_service.py

## Import Cycles
- None detected.

## Communities (130 total, 29 thin omitted)

### Community 0 - "Healthcare Analytics Platform — Architecture Specification & Roadmap"
Cohesion: 0.04
Nodes (43): 1. Executive Overview, 2. System Architecture Diagram, 3.1 Frontend Architecture (`src/` & `frontend/`), 3.2 Backend Service Architecture (`backend/`), 3.3 Analytics & Intelligence Engine (`backend/analytics/`), 3.4 Data Directory Structure (`data/`), 3. Current Architecture Breakdown, 4. Data Ingestion & Transformation Flow (+35 more)

### Community 1 - "hypothesis_testing.py"
Cohesion: 0.11
Nodes (26): compute_erbi_metrics(), Healthcare Analytics Platform - Analytics: ERBI Engine Computes Estimated…, Computes Estimated Resource Burden Index (ERBI) per triage level and age…, _clean_frame(), _effect_label(), Any, DataFrame, Healthcare Analytics Platform - Analytics: Hypothesis Testing Engine Executes… (+18 more)

### Community 2 - "dataset_explorer_api.py"
Cohesion: 0.07
Nodes (32): APIRouter, _generate_description(), get_data_dictionary(), get_dataset_correlation(), get_dataset_outliers(), get_dataset_sheet_data(), get_dataset_sheet_statistics(), get_dataset_sheets() (+24 more)

### Community 3 - "server.ts"
Cohesion: 0.07
Nodes (34): activeJobs, app, BackgroundJob, BetterSQLite3, cache, DATASET_TABLE_MAP, DB_PATH, DIRS (+26 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @google/genai, html-to-image, jszip, lucide-react, motion, react, react-dom (+31 more)

### Community 5 - "TestH1"
Cohesion: 0.06
Nodes (9): HypothesisResultContract, Resuscitation/Emergent should not rank below Non-urgent on LOS., Shared contract every hypothesis result must satisfy., weighted_n counts VISITS; n_records counts aggregate rows. They must differ., Must be in (0, 1]. The source notebook reported 1.0000001932 via int64 overflow., Anchored to backend/hypothesis testing/H1_testing.ipynb (N and effect size)., TestH1, TestH2 (+1 more)

### Community 6 - "AnalyticsCore.tsx"
Cohesion: 0.10
Nodes (28): AnalyticsCore(), AnalyticsCoreProps, BoxGroup, boxStats(), chiSqP(), cleanPairs(), CTAS_PAL, FEntry (+20 more)

### Community 7 - "Healthcare Analytics Platform"
Cohesion: 0.05
Nodes (41): A caution on polynomial degree, Additional commands, AI assistance (Gemini), Analytical layering, Architecture, Author, Build and run, Codebase knowledge graph (graphify) (+33 more)

### Community 8 - "test_preprocessing.py"
Cohesion: 0.05
Nodes (49): compute_er_kpis(), Any, Helper method for calculating summary KPIs from record lists., add_los_columns(), add_population_category(), clean_missing_values(), normalize_age_group(), normalize_column_names() (+41 more)

### Community 9 - "skipUnless"
Cohesion: 0.16
Nodes (7): skipUnless, No sampling, no capping - the same data must give bit-identical results., Task 01 Acceptance Criteria: Asserts rollup categories are filtered out…, Task 07: Live query reconciliation & staleness validation guard. Verifies that…, TestDeterminism, TestRollupCategoryFiltering, TestStalenessAndLiveQueryReconciliation

### Community 10 - "test_model_validation.py"
Cohesion: 0.12
Nodes (17): complexity_curve(), learning_curve(), mae(), polynomial_predict(), Any, r_squared(), Model validation primitives — train/test splitting, polynomial fitting, error…, Evaluate a polynomial (ascending coefficients) at each point via Horner's… (+9 more)

### Community 11 - "chi_square_test"
Cohesion: 0.05
Nodes (23): Any, run(), Any, run(), chi_square_summary(), chi_square_test(), Any, linear_regression() (+15 more)

### Community 12 - "STATISTICAL COMPUTING HUB"
Cohesion: 0.07
Nodes (29): H1: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size, H2: Weighted Mann–Whitney U Test (Two-Sided) · Rank-Biserial Correlation, H3: Weighted Least Squares (WLS) Regression · Visit-Count Weights · Forest Plot, H4: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size, H5: Mann–Kendall Trend Test · Simple Exponential Smoothing (FY+1, FY+2 Forecast), Mann–Kendall Trend & SES Forecast: Estimated Emergency Department Resource Burden Index (ERBI), Model Summary, Pipeline Telemetry (+21 more)

### Community 13 - "get_statistics_dashboard"
Cohesion: 0.14
Nodes (22): compute_trend_analysis(), get_hypothesis_h1(), get_hypothesis_h2(), get_hypothesis_h3(), get_hypothesis_h4(), get_hypothesis_h5(), get_statistical_methods(), get_statistics_dashboard() (+14 more)

### Community 14 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 15 - "user_datasets.py"
Cohesion: 0.11
Nodes (18): APIRouter, BaseModel, delete_user_dataset(), get_user_dataset(), HTTPException, list_user_datasets(), persist_cleaned_dataset(), PersistRequest (+10 more)

### Community 16 - "Backend Statistics — Study Notes"
Cohesion: 0.07
Nodes (27): 0. Why everything here is *weighted*, 10. Model validation — over/underfitting diagnostics (`model_validation.py`), 11. Mann-Kendall trend test + Sen's slope (`trend_analysis.py`), 12. Simple Exponential Smoothing forecast (`forecasting/core.py`), 13. Estimated Resource Burden Index — ERBI (`erbi.py`), 14. Quick reference — what backs each hypothesis, and what actually runs live, 1. The special functions (no SciPy required), 2. Weighted descriptive statistics (+19 more)

### Community 17 - "test_dashboard.py"
Cohesion: 0.16
Nodes (13): generate_erbi_insight(), generate_executive_summary(), generate_hypothesis_summary(), generate_kpi_insight(), Any, compute_er_kpis(), compute_erbi(), compute_population_category() (+5 more)

### Community 18 - "FakeDB"
Cohesion: 0.14
Nodes (9): DatasetService, Reads dataset tables from the analytical database., Names of every table available for exploration., Rows for one dataset table, or None when the table does not exist. The name is…, FakeDB, Table names cannot be bound as SQL parameters, so every path that interpolates…, Minimal DatabaseManager stand-in. Matches queries by substring., TestDatasetService (+1 more)

### Community 19 - ".diagnose"
Cohesion: 0.17
Nodes (8): Full overfitting / underfitting assessment for one feature-target pair. Returns…, A filled gap must never enter the fit as if it were an observation., Underfitting: the model explains almost nothing, on its own training data., Mirrors the real case: fiscal year does not predict triage acuity., A model that failed on its own training data is underfit, not overfit —…, rows(), TestGuards, TestUnderfittingDetection

### Community 20 - "modelDiagnosticsService.ts"
Cohesion: 0.13
Nodes (19): FitDiagnostics(), FitDiagnosticsProps, VERDICT_STYLES, ExportReports(), ExportReportsProps, assessModelFit(), ComplexityCurvePoint, CrossValidation (+11 more)

### Community 21 - "test_weighted_statistics.py"
Cohesion: 0.21
Nodes (6): Midranks each unique value across the weight-expanded population. Returns…, weighted_mean(), weighted_midranks(), Tests for the frequency-weighted non-parametric engine that backs H1/H2/H4. Two…, TestWeightedDescriptives, TestWeightedMidranks

### Community 22 - "linear_regression"
Cohesion: 0.22
Nodes (6): linear_regression(), Computes ordinary least squares (OLS) linear regression helper., get_linear_regression(), post, Computes OLS linear regression between two numeric arrays., TestAnalyticsEngine

### Community 23 - "statistics.py"
Cohesion: 0.14
Nodes (15): calculate_five_number_summary(), calculate_mean(), calculate_std(), get_table_descriptive_metrics(), Any, Healthcare Analytics Platform - Analytics: Descriptive Statistics Engine…, Calculates min, Q1, median, Q3, and max summary stats., Calculates arithmetic mean of numeric sequence. (+7 more)

### Community 24 - ".get_kpis"
Cohesion: 0.15
Nodes (9): DashboardService, Any, Healthcare Analytics Platform - Dashboard Service Layer Owns the executive KPI…, First row's value for `key`, or `default` when absent, empty, or NULL., Computes executive KPIs and dataset metadata summaries., High-level executive KPIs derived from the seeded ED tables., Provenance rows from the metadata table: source file, row and column counts., _scalar() (+1 more)

### Community 25 - "model_diagnostics_service.py"
Cohesion: 0.16
Nodes (16): _extract_pairs(), _is_missing(), ModelDiagnosticsService, Any, Model Diagnostics Service — overfitting / underfitting assessment on the…, True when a cleaned value represents absent data rather than a measurement., Coerce a cleaned-record value to float, rejecting imputation placeholders., Pull aligned numeric (feature, target) pairs, counting what was dropped and why. (+8 more)

### Community 26 - "types.ts"
Cohesion: 0.14
Nodes (15): CustomChartBuilderProps, ExecutiveDashboardProps, AggregationOption, AIAnalysisResult, AIKeyFinding, CategoricalMetrics, ColumnInfo, ColumnType (+7 more)

### Community 27 - "weighted_kruskal_wallis"
Cohesion: 0.16
Nodes (9): Frequency-weighted Kruskal-Wallis H test with tie correction and exact p-value.…, weighted_kruskal_wallis(), With unit weights the engine must reduce to the textbook Kruskal-Wallis., SciPy tie-corrects; so must we, or the two diverge exactly where it matters., The whole point: weighting must equal physically repeating the rows., Guards the exact defect being fixed: ignoring weights must not be equivalent., A correction > 1 is impossible; the source notebook produced one via int64…, Pure-Python ints must carry t**3 past the int64 ceiling without wrapping. (+1 more)

### Community 28 - ".persist"
Cohesion: 0.16
Nodes (7): Any, Creates the registry, and migrates one that predates session scoping. ALTER…, Writes cleaned records to a new isolated table and registers it. Returns the…, Rows for one persisted dataset, or None when the id is unknown or not owned.…, Drops a persisted dataset and its registry row. False when the id is unknown,…, TestOwnerScopedAccess, TestPersistence

### Community 29 - "DataExplorer.tsx"
Cohesion: 0.13
Nodes (13): apiFetch(), CHART_COLOURS, DataExplorer(), DataExplorerProps, DistributionChart(), Field, fmt(), formatCompact() (+5 more)

### Community 30 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 31 - "run_ed_visits_forecasting"
Cohesion: 0.33
Nodes (7): exponential_smoothing_forecast(), Any, Healthcare Analytics Platform - Analytics: Forecasting Engine Computes Simple…, Performs Simple Exponential Smoothing (SES) forecasting with 95% confidence…, Queries annual ED visit totals from SQLite and generates Simple Exponential…, run_ed_visits_forecasting(), Forecasting Submodule Re-exports the SES forecasting engine so `from…

### Community 32 - "ExecutiveDashboard.tsx"
Cohesion: 0.19
Nodes (14): calcMean(), calcMedian(), calcStddev(), ChartCfg, ChartKind, defaultCfg(), ExecutiveDashboard(), fmtK() (+6 more)

### Community 33 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, esbuild, jsdom, devDependencies, autoprefixer, esbuild, jsdom, tailwindcss (+15 more)

### Community 34 - "DatabaseManager"
Cohesion: 0.09
Nodes (15): DatabaseManager, Any, DataFrame, Thread-safe SQLite Database Manager for Healthcare Analytics Platform., Establishes and returns an optimized SQLite connection. The caller owns the…, Yields a connection and always closes it on exit. `with sqlite3.connect(...) as…, Executes a SELECT query and returns the results as a Pandas DataFrame., Executes a SELECT query and returns rows as dictionaries. (+7 more)

### Community 35 - "dependencies"
Cohesion: 0.10
Nodes (21): better-sqlite3, dotenv, dependencies, better-sqlite3, dotenv, @google/genai, html-to-image, jszip (+13 more)

### Community 36 - "biEngine.ts"
Cohesion: 0.14
Nodes (13): AggregationType, calculateAdvancedStats(), calculateLinearRegression(), ColumnRole, computeHistogramBins(), CoreStatsSummary, DateHierarchyNode, detectOutliersIndexes() (+5 more)

### Community 37 - "weighted_median"
Cohesion: 0.18
Nodes (20): Any, H1: does reported median ED LOS differ across CTAS triage levels? ``weights``…, run(), Any, H2: does reported median ED LOS differ between admitted and non-admitted…, run(), Any, H4: does reported median ED LOS differ across patient age groups? ``weights``… (+12 more)

### Community 38 - "Healthcare Analytics Platform — Executive Dashboard Engineering Roadmap"
Cohesion: 0.12
Nodes (15): 1. Architectural Grounding & Context, 2. Current State Assessment & Technical Debt, 3. Phased Dashboard Implementation Roadmap, 4. Target Directory & Component Architecture, 5.1 Dashboard KPIs Contract (`GET /api/dashboard/kpis`), 5.2 ERBI Breakdown Contract (`POST /api/dashboard/erbi`), 5. API & Data Contract Specifications, 6. Verification & Quality Gate Plan (+7 more)

### Community 39 - "dashboard.py"
Cohesion: 0.17
Nodes (10): APIRouter, get_dashboard_kpis(), get_dashboard_summary(), HTTPException, Any, Exception, get, Healthcare Analytics Platform - FastAPI Router: Executive Dashboard Analytics… (+2 more)

### Community 40 - "datasets.py"
Cohesion: 0.16
Nodes (10): APIRouter, get_dataset_records(), get_datasets(), HTTPException, Any, Exception, get, Healthcare Analytics Platform - API Router: Datasets Management (+2 more)

### Community 41 - "infer_sql_type"
Cohesion: 0.36
Nodes (3): infer_sql_type(), INTEGER / REAL / TEXT from the observed non-null values., TestTypeInference

### Community 42 - "DataCleaning.tsx"
Cohesion: 0.20
Nodes (10): DatasetState, DatasetUpload(), DatasetUploadProps, DataCleaning(), DataCleaningProps, RawDataset, sampleDatasets, CleaningAction (+2 more)

### Community 43 - "launch.py"
Cohesion: 0.24
Nodes (13): free_port(), in_container(), is_interactive(), main(), port_in_use(), preflight(), Healthcare Analytics Platform — one-shot launcher. Installs Node and Python…, Fails fast on the mistakes that produce confusing symptoms later. (+5 more)

### Community 44 - "TestSeededCohortIsolation"
Cohesion: 0.29
Nodes (3): The guarantee that makes H1-H5 reproducible: uploads never touch the seeded…, schema.sql drops its tables; the registry must not be there or a rebuild would…, TestSeededCohortIsolation

### Community 46 - "TestH4Module"
Cohesion: 0.15
Nodes (3): Visit counts must actually drive the test, not merely decorate the output., The ordering constant must describe categories the database really stores., TestH4Module

### Community 47 - "sqlite_loader.py"
Cohesion: 0.83
Nodes (3): load_all_explorer_datasets(), load_csv_to_sqlite(), Any

### Community 48 - "weighted.py"
Cohesion: 0.10
Nodes (21): _betacf(), _betai(), chi2_sf(), _clean_pairs(), _gamma_p_series(), _gamma_q_continued_fraction(), normal_sf(), Healthcare Analytics Platform - Statistics: Frequency-Weighted Non-Parametric… (+13 more)

### Community 49 - "main.py"
Cohesion: 0.18
Nodes (8): APIRouter, get_pipeline_overview(), Any, get, Architecture-oriented API endpoints for the platform pipeline overview., health_check(), get, root()

### Community 50 - "api/insights.py"
Cohesion: 0.23
Nodes (10): get_insights_summary(), get_strategic_recommendations(), HTTPException, Any, Exception, get, post, Healthcare Analytics Platform - API Router: Strategic Insights Generates data-… (+2 more)

### Community 51 - "upload.py"
Cohesion: 0.20
Nodes (8): APIRouter, Any, post, Healthcare Analytics Platform - API Router: Dataset Ingestion & Uploads, Ingests uploaded clinical dataset CSV/XLSX file., upload_dataset(), upload_dataset_fallback(), UploadFile

### Community 53 - "test_dependencies.py"
Cohesion: 0.24
Nodes (8): collect_third_party_imports(), declared_distributions(), _iter_python_files(), Test Suite: Dependency declaration contract. Fails when a third-party module is…, Guards the packages that are never imported directly and so look prunable.…, Top-level third-party module names imported anywhere in the scanned trees., Lower-cased distribution names listed in requirements.txt., TestDependencyDeclarations

### Community 55 - "noisy_line"
Cohesion: 0.24
Nodes (6): noisy_line(), Complexity, not the data, drives the verdict — the distinction the panel exists…, Overfitting is relative to sample size: the same degree-6 model on 40 rows…, A real linear signal plus noise — the setting where model complexity decides…, Overfitting: fits the training rows well, then fails on data it has not seen.…, TestOverfittingDetection

### Community 56 - "model_diagnostics.py"
Cohesion: 0.29
Nodes (10): assess_fit(), BaseModel, ColumnsRequest, DiagnosticsRequest, modelable_columns(), Any, post, Overfitting / underfitting diagnostics for the post-cleaning dataset. (+2 more)

### Community 58 - "run_preprocessing.py"
Cohesion: 0.07
Nodes (36): load_csv_datasets(), clean_raw_datasets(), DataFrame, Path, Parses original CIHI supplementary data tables from raw Excel file and extracts…, add_feature_engineering(), classify_age_group(), extract_year_from_period() (+28 more)

### Community 59 - "test_dashboard_services.py"
Cohesion: 0.25
Nodes (6): detect_volume_recommendations(), DataFrame, Healthcare Analytics Platform - Strategic Insights Service Layer Owns the…, Flags the triage level carrying the largest share of visits., Test Suite: Dashboard, Insights and Dataset service layers. These exercise…, TestVolumeRecommendations

### Community 60 - ".get_recommendations"
Cohesion: 0.25
Nodes (6): InsightsService, Any, Derives strategic recommendations from the seeded analytical tables., Profiles every clinical table and returns the top-ranked recommendations., Row counts for every table in the analytical database., TestInsightsService

### Community 61 - "polynomial_fit"
Cohesion: 0.29
Nodes (5): polynomial_fit(), Gaussian elimination with partial pivoting. Returns [] if singular., Least-squares polynomial coefficients in ascending order: [c0, c1, ...…, _solve(), TestPolynomialFit

### Community 62 - "weighted_dunn_post_hoc"
Cohesion: 0.29
Nodes (5): Any, Dunn's test: pairwise mean-rank z-tests sharing the pooled rank variance. This…, weighted_dunn_post_hoc(), Dunn shares one ranking across all groups; mean ranks must be global., TestWeightedDunnPostHoc

### Community 63 - "map_columns"
Cohesion: 0.11
Nodes (17): align_to_table(), load_datasets(), main(), map_columns(), DataFrame, Path, Healthcare Analytics Platform - Analytical Database Loader Rebuilds…, Initializes the schema and loads every cleaned dataset. Returns rows per table. (+9 more)

### Community 64 - "database_manager.py"
Cohesion: 0.13
Nodes (9): Healthcare Analytics Platform - Database Manager Handles SQLite database…, build_schema(), Healthcare Analytics Platform - User Dataset Persistence Persists a web user's…, Rewrites an arbitrary key into a safe SQL identifier. Column names come from a…, Ordered {safe_column: sql_type} derived from the record keys., sanitize_column(), Test Suite: User dataset persistence. Covers the Path A → SQLite write…, TestColumnSanitisation (+1 more)

### Community 65 - "schema.sql"
Cohesion: 0.25
Nodes (7): age_sex, ctas_triage, demographics, ed_visits, main_problems, metadata, visit_disposition

### Community 66 - "App.tsx"
Cohesion: 0.17
Nodes (10): App(), getStagePercentage(), SectionType, STAGES, AboutProject(), AboutProjectProps, ConsultantInsights(), ConsultantInsightsProps (+2 more)

### Community 67 - "TestH1Module"
Cohesion: 0.20
Nodes (3): Visit counts must actually drive the test, not merely decorate the output., Kruskal-Wallis is distribution-free; normality must not gate the result., TestH1Module

### Community 68 - "mann_kendall_test"
Cohesion: 0.31
Nodes (8): mann_kendall_test(), _norm_cdf(), Any, Healthcare Analytics Platform - Analytics: Trend Analysis Engine Computes Mann-…, Queries annual ED visit volumes from SQLite database and performs Mann-Kendall…, Standard normal CDF approximation if scipy is not installed., Performs the Mann-Kendall Non-Parametric Trend Test on a time series sequence.…, run_ed_visits_trend_analysis()

### Community 69 - "userDatasetService.ts"
Cohesion: 0.36
Nodes (8): deleteUserDataset(), fetchUserDataset(), getSessionId(), listUserDatasets(), persistCleanedDataset(), PersistResult, sessionHeaders(), UserDatasetEntry

### Community 70 - "diagnose_fit"
Cohesion: 0.36
Nodes (3): diagnose_fit(), Classify a fitted model as Underfitting, Overfitting, or Good Fit. Underfitting…, TestDiagnoseFit

### Community 71 - "k_fold_scores"
Cohesion: 0.31
Nodes (5): _fold_slices(), k_fold_scores(), k-fold cross-validated R². A large std across folds means an unstable model., Contiguous (start, end) index ranges for k roughly equal folds., TestKFoldScores

### Community 72 - "init_database.py"
Cohesion: 0.50
Nodes (3): init_db(), Healthcare Analytics Platform - Database Schema Initializer Executes schema.sql…, Initializes SQLite database schema by executing schema.sql.

### Community 74 - "reports.py"
Cohesion: 0.22
Nodes (6): APIRouter, get_report_summary(), Any, get, Healthcare Analytics Platform - API Router: Report Exports & Audit Logging, Generates summary export metadata for PDF/CSV reports.

### Community 75 - "schemas.py"
Cohesion: 0.28
Nodes (5): DatasetMeta, KPIResponse, Any, Healthcare Analytics Platform - Data Models & DTO Schemas, StatisticsRequest

### Community 76 - "detect_outlier_recommendations"
Cohesion: 0.36
Nodes (3): detect_outlier_recommendations(), Flags numeric columns whose Tukey-fence outlier share exceeds the alert…, TestOutlierRecommendations

### Community 77 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 79 - "train_test_split"
Cohesion: 0.39
Nodes (3): Shuffle-split paired samples into (x_train, y_train, x_test, y_test).…, train_test_split(), TestTrainTestSplit

### Community 81 - "MetricCard.tsx"
Cohesion: 0.25
Nodes (3): MetricCardProps, SIZE_STYLES, VARIANT_STYLES

### Community 82 - "ArchitecturePipelineCard.tsx"
Cohesion: 0.38
Nodes (5): ArchitecturePipelineCard(), ArchitecturePipelineCardProps, ArchitecturePipelineOverview, ArchitectureStageStatus, fetchArchitecturePipelineOverview()

### Community 85 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 86 - "DataTable.tsx"
Cohesion: 0.40
Nodes (4): DataTable(), DataTableProps, downloadCSV(), TableColumn

### Community 87 - "kruskal.py"
Cohesion: 0.18
Nodes (8): kruskal_wallis(), mann_whitney_u(), Healthcare Analytics Platform - Statistics: Rank-Based Tests Thin adapters over…, Kruskal-Wallis H test. Returns ``(H, p)`` rounded for display., Mann-Whitney U test. Returns ``(U, p)`` rounded for display., TestDunnPostHoc, TestKruskalWallis, TestMannWhitneyU

### Community 88 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, clean, dev, lint, start, test

### Community 90 - "dataset_service.py"
Cohesion: 0.40
Nodes (4): Any, Healthcare Analytics Platform - Dataset Access Service Layer Owns table listing…, Coerces a row limit to a sane positive integer. The limit is interpolated into…, _safe_limit()

### Community 91 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 95 - "UserDatasetService"
Cohesion: 0.14
Nodes (12): Stores and retrieves user-cleaned datasets in isolated tables., Registry entries, newest first. With `owner_id`, only that session's datasets…, UserDatasetService, IsolationTestCase, Test Suite: Session-scoped isolation of user datasets. Two people using the…, An existing database predates the column. Adding it must not require a rebuild,…, H1-H5 must stay identical for everyone — that is the point of the seeded store., Backward compatibility: an unscoped call still sees all rows. (+4 more)

### Community 99 - "graphify"
Cohesion: 0.50
Nodes (3): After every commit, graphify, Setup — every developer must do this once

### Community 100 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 101 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 102 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 108 - "vite"
Cohesion: 0.67
Nodes (3): vite, vite, vite

## Knowledge Gaps
- **320 isolated node(s):** `BaseModel`, `ed_visits`, `ctas_triage`, `visit_disposition`, `age_sex` (+315 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `weighted_kruskal_wallis()` connect `weighted_kruskal_wallis` to `hypothesis_testing.py`, `weighted_median`, `weighted.py`, `test_weighted_statistics.py`, `kruskal.py`, `weighted_dunn_post_hoc`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `weighted_mann_whitney_u()` connect `weighted.py` to `hypothesis_testing.py`, `weighted_median`, `test_weighted_statistics.py`, `kruskal.py`, `weighted_dunn_post_hoc`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `DatabaseManager` connect `DatabaseManager` to `database_manager.py`, `UserDatasetService`, `map_columns`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `DatabaseManager` (e.g. with `TestDatabaseManager` and `IsolationTestCase`) actually correct?**
  _`DatabaseManager` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BaseModel`, `ed_visits`, `ctas_triage` to the rest of the system?**
  _320 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Healthcare Analytics Platform — Architecture Specification & Roadmap` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `hypothesis_testing.py` be split into smaller, more focused modules?**
  _Cohesion score 0.10984848484848485 - nodes in this community are weakly interconnected._