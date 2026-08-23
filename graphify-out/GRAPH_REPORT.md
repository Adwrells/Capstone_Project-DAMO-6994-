# Graph Report - Capstone_Project-DAMO-6994-  (2026-08-23)

## Corpus Check
- 134 files · ~111,940 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1605 nodes · 2580 edges · 119 communities (98 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a9ff8b8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_model_validation.py
- .diagnose
- dataset_explorer_api.py
- server.ts
- TestH1
- hypothesis_testing.py
- AnalyticsCore.tsx
- test_preprocessing.py
- get_statistics_dashboard
- test_analytics.py
- weighted_mean
- weighted.py
- chi_square_test
- user_datasets.py
- test_dashboard.py
- FakeDB
- modelDiagnosticsService.ts
- database_manager.py
- .get_kpis
- types.ts
- backend/preprocessing/feature_engineering.py
- Healthcare Analytics Platform — Architecture Specification & Roadmap
- run_ed_visits_forecasting
- weighted_mann_whitney_u
- weighted_kruskal_wallis
- DataExplorer.tsx
- compilerOptions
- linear_regression
- test_user_datasets.py
- ExecutiveDashboard.tsx
- dependencies
- biEngine.ts
- devDependencies
- kruskal.py
- Healthcare Analytics Platform
- .persist
- dependencies
- @vitejs/plugin-react
- dashboard.py
- datasets.py
- DataCleaning.tsx
- launch.py
- TestH4Module
- analytics_service.py
- weighted_dunn_post_hoc
- architecture.py
- api/insights.py
- upload.py
- test_dependencies.py
- TestH2Module
- preprocessing_service.py
- model_diagnostics.py
- map_columns
- test_dashboard_services.py
- .get_recommendations
- .list_datasets
- scripts
- STATISTICAL COMPUTING HUB
- statistics.py
- run_preprocessing.py
- model_diagnostics_service.py
- Healthcare Analytics Platform — Executive Dashboard Engineering Roadmap
- .process_dataset
- App.tsx
- TestH1Module
- TestSeededCohortIsolation
- reports.py
- noisy_line
- schemas.py
- detect_outlier_recommendations
- infer_sql_type
- userDatasetService.ts
- MetricCard.tsx
- ArchitecturePipelineCard.tsx
- DataTable.tsx
- ConsultantInsights.tsx
- polynomial_fit
- dataset_service.py
- apply_transformations
- sqlite_loader.py
- APIRouter
- diagnose_fit
- k_fold_scores
- train_test_split
- Layout.tsx
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
- tests/__init__.py
- init_database.py
- main.py
- APIRouter
- schema.sql
- package.json
- compute_erbi_metrics
- vite
- express
- motion
- react
- recharts
- @tailwindcss/vite

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
- `TempDBTestCase` --uses--> `DatabaseManager`  [INFERRED]
  tests/test_user_datasets.py → backend/database/database_manager.py
- `TestGuards` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestOverfittingDetection` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestUnderfittingDetection` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestOwnerScopedListing` --uses--> `UserDatasetService`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/services/user_dataset_service.py

## Import Cycles
- None detected.

## Communities (119 total, 21 thin omitted)

### Community 0 - "test_model_validation.py"
Cohesion: 0.12
Nodes (17): complexity_curve(), learning_curve(), mae(), polynomial_predict(), Any, r_squared(), Model validation primitives — train/test splitting, polynomial fitting, error…, Evaluate a polynomial (ascending coefficients) at each point via Horner's… (+9 more)

### Community 1 - ".diagnose"
Cohesion: 0.17
Nodes (8): Full overfitting / underfitting assessment for one feature-target pair. Returns…, A filled gap must never enter the fit as if it were an observation., Underfitting: the model explains almost nothing, on its own training data., Mirrors the real case: fiscal year does not predict triage acuity., A model that failed on its own training data is underfit, not overfit —…, rows(), TestGuards, TestUnderfittingDetection

### Community 2 - "dataset_explorer_api.py"
Cohesion: 0.07
Nodes (32): APIRouter, _generate_description(), get_data_dictionary(), get_dataset_correlation(), get_dataset_outliers(), get_dataset_sheet_data(), get_dataset_sheet_statistics(), get_dataset_sheets() (+24 more)

### Community 3 - "server.ts"
Cohesion: 0.07
Nodes (34): activeJobs, app, BackgroundJob, BetterSQLite3, cache, DATASET_TABLE_MAP, DB_PATH, DIRS (+26 more)

### Community 4 - "TestH1"
Cohesion: 0.06
Nodes (9): HypothesisResultContract, Resuscitation/Emergent should not rank below Non-urgent on LOS., Shared contract every hypothesis result must satisfy., weighted_n counts VISITS; n_records counts aggregate rows. They must differ., Must be in (0, 1]. The source notebook reported 1.0000001932 via int64 overflow., Anchored to backend/hypothesis testing/H1_testing.ipynb (N and effect size)., TestH1, TestH2 (+1 more)

### Community 5 - "hypothesis_testing.py"
Cohesion: 0.10
Nodes (27): _clean_frame(), _effect_label(), is_rollup_or_excluded(), Any, DataFrame, Healthcare Analytics Platform - Analytics: Hypothesis Testing Engine Executes…, Splits a frame into parallel value/name/weight lists, honouring a display order., Builds the per-group descriptive block returned to the API. (+19 more)

### Community 6 - "AnalyticsCore.tsx"
Cohesion: 0.10
Nodes (28): AnalyticsCore(), AnalyticsCoreProps, BoxGroup, boxStats(), chiSqP(), cleanPairs(), CTAS_PAL, FEntry (+20 more)

### Community 7 - "test_preprocessing.py"
Cohesion: 0.12
Nodes (22): add_los_columns(), add_population_category(), clean_missing_values(), normalize_age_group(), normalize_column_names(), _normalize_key(), normalize_population_category(), Any (+14 more)

### Community 8 - "get_statistics_dashboard"
Cohesion: 0.12
Nodes (24): get_hypothesis_h1(), get_hypothesis_h2(), get_hypothesis_h3(), get_hypothesis_h4(), get_hypothesis_h5(), get_linear_regression(), get_statistical_methods(), get_statistics_dashboard() (+16 more)

### Community 9 - "test_analytics.py"
Cohesion: 0.14
Nodes (16): linear_regression(), Any, Healthcare Analytics Platform - Analytics: Regression Engine Computes Weighted…, Computes ordinary least squares (OLS) linear regression helper., H3 Hypothesis Test: Performs Weighted Least Squares (WLS) linear regression…, run_h3_regression(), mann_kendall_test(), _norm_cdf() (+8 more)

### Community 10 - "weighted_mean"
Cohesion: 0.15
Nodes (20): Any, H1: does reported median ED LOS differ across CTAS triage levels? ``weights``…, run(), Any, H2: does reported median ED LOS differ between admitted and non-admitted…, run(), Any, H4: does reported median ED LOS differ across patient age groups? ``weights``… (+12 more)

### Community 11 - "weighted.py"
Cohesion: 0.10
Nodes (20): _betacf(), _betai(), chi2_sf(), _gamma_p_series(), _gamma_q_continued_fraction(), Healthcare Analytics Platform - Statistics: Frequency-Weighted Non-Parametric…, Continued fraction for the incomplete beta function (Lentz's method)., Regularized incomplete beta function I_x(a, b). (+12 more)

### Community 12 - "chi_square_test"
Cohesion: 0.12
Nodes (9): Any, run(), chi_square_summary(), chi_square_test(), Any, TestChiSquare, TestH5Module, chi_square and linear_regression previously shipped invented p-value formulas. (+1 more)

### Community 13 - "user_datasets.py"
Cohesion: 0.11
Nodes (18): APIRouter, BaseModel, delete_user_dataset(), get_user_dataset(), HTTPException, list_user_datasets(), persist_cleaned_dataset(), PersistRequest (+10 more)

### Community 14 - "test_dashboard.py"
Cohesion: 0.16
Nodes (13): generate_erbi_insight(), generate_executive_summary(), generate_hypothesis_summary(), generate_kpi_insight(), Any, compute_er_kpis(), compute_erbi(), compute_population_category() (+5 more)

### Community 15 - "FakeDB"
Cohesion: 0.14
Nodes (9): DatasetService, Reads dataset tables from the analytical database., Names of every table available for exploration., Rows for one dataset table, or None when the table does not exist. The name is…, FakeDB, Table names cannot be bound as SQL parameters, so every path that interpolates…, Minimal DatabaseManager stand-in. Matches queries by substring., TestDatasetService (+1 more)

### Community 16 - "modelDiagnosticsService.ts"
Cohesion: 0.13
Nodes (19): FitDiagnostics(), FitDiagnosticsProps, VERDICT_STYLES, ExportReports(), ExportReportsProps, assessModelFit(), ComplexityCurvePoint, CrossValidation (+11 more)

### Community 17 - "database_manager.py"
Cohesion: 0.08
Nodes (19): DatabaseManager, Any, DataFrame, Healthcare Analytics Platform - Database Manager Handles SQLite database…, Thread-safe SQLite Database Manager for Healthcare Analytics Platform., Establishes and returns an optimized SQLite connection. The caller owns the…, Yields a connection and always closes it on exit. `with sqlite3.connect(...) as…, Executes a SELECT query and returns the results as a Pandas DataFrame. (+11 more)

### Community 18 - ".get_kpis"
Cohesion: 0.15
Nodes (9): DashboardService, Any, Healthcare Analytics Platform - Dashboard Service Layer Owns the executive KPI…, First row's value for `key`, or `default` when absent, empty, or NULL., Computes executive KPIs and dataset metadata summaries., High-level executive KPIs derived from the seeded ED tables., Provenance rows from the metadata table: source file, row and column counts., _scalar() (+1 more)

### Community 19 - "types.ts"
Cohesion: 0.12
Nodes (16): CustomChartBuilderProps, ExecutiveDashboardProps, AnalyticsEngineProps, AggregationOption, AIAnalysisResult, AIKeyFinding, CategoricalMetrics, ColumnInfo (+8 more)

### Community 20 - "backend/preprocessing/feature_engineering.py"
Cohesion: 0.19
Nodes (12): add_feature_engineering(), classify_age_group(), encode_sex_category(), extract_year_from_period(), map_ctas_urgency(), DataFrame, Healthcare Analytics Platform - Preprocessing: Feature Engineering Module…, Extracts starting fiscal year or calendar year as integer from period string. (+4 more)

### Community 21 - "Healthcare Analytics Platform — Architecture Specification & Roadmap"
Cohesion: 0.04
Nodes (43): 1. Executive Overview, 2. System Architecture Diagram, 3.1 Frontend Architecture (`src/` & `frontend/`), 3.2 Backend Service Architecture (`backend/`), 3.3 Analytics & Intelligence Engine (`backend/analytics/`), 3.4 Data Directory Structure (`data/`), 3. Current Architecture Breakdown, 4. Data Ingestion & Transformation Flow (+35 more)

### Community 22 - "run_ed_visits_forecasting"
Cohesion: 0.29
Nodes (7): exponential_smoothing_forecast(), Any, Healthcare Analytics Platform - Analytics: Forecasting Engine Computes Simple…, Performs Simple Exponential Smoothing (SES) forecasting with 95% confidence…, Queries annual ED visit totals from SQLite and generates Simple Exponential…, run_ed_visits_forecasting(), Forecasting Submodule Re-exports the SES forecasting engine so `from…

### Community 23 - "weighted_mann_whitney_u"
Cohesion: 0.16
Nodes (10): normal_sf(), Standard normal survival function P(Z > z), exact via the error function., Midranks each unique value across the weight-expanded population. Returns…, Frequency-weighted Mann-Whitney U with tie-corrected normal approximation. The…, weighted_mann_whitney_u(), weighted_midranks(), Tests for the frequency-weighted non-parametric engine that backs H1/H2/H4. Two…, Fully separated groups give the maximal effect size. (+2 more)

### Community 24 - "weighted_kruskal_wallis"
Cohesion: 0.16
Nodes (9): Frequency-weighted Kruskal-Wallis H test with tie correction and exact p-value.…, weighted_kruskal_wallis(), With unit weights the engine must reduce to the textbook Kruskal-Wallis., SciPy tie-corrects; so must we, or the two diverge exactly where it matters., The whole point: weighting must equal physically repeating the rows., Guards the exact defect being fixed: ignoring weights must not be equivalent., A correction > 1 is impossible; the source notebook produced one via int64…, Pure-Python ints must carry t**3 past the int64 ceiling without wrapping. (+1 more)

### Community 25 - "DataExplorer.tsx"
Cohesion: 0.13
Nodes (13): apiFetch(), CHART_COLOURS, DataExplorer(), DataExplorerProps, DistributionChart(), Field, fmt(), formatCompact() (+5 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 27 - "linear_regression"
Cohesion: 0.18
Nodes (7): Any, run(), linear_regression(), Any, regression_summary(), TestH3Module, TestLinearRegression

### Community 28 - "test_user_datasets.py"
Cohesion: 0.18
Nodes (8): build_schema(), Healthcare Analytics Platform - User Dataset Persistence Persists a web user's…, Rewrites an arbitrary key into a safe SQL identifier. Column names come from a…, Ordered {safe_column: sql_type} derived from the record keys., sanitize_column(), Test Suite: User dataset persistence. Covers the Path A → SQLite write…, TestColumnSanitisation, TestSchemaBuilding

### Community 29 - "ExecutiveDashboard.tsx"
Cohesion: 0.19
Nodes (14): calcMean(), calcMedian(), calcStddev(), ChartCfg, ChartKind, defaultCfg(), ExecutiveDashboard(), fmtK() (+6 more)

### Community 30 - "dependencies"
Cohesion: 0.12
Nodes (17): better-sqlite3, dotenv, dependencies, better-sqlite3, dotenv, @google/genai, html-to-image, jszip (+9 more)

### Community 31 - "biEngine.ts"
Cohesion: 0.13
Nodes (11): AggregationType, ColumnRole, computeHistogramBins(), CoreStatsSummary, DateHierarchyNode, detectOutliersIndexes(), HistogramBin, RegressionResult (+3 more)

### Community 32 - "devDependencies"
Cohesion: 0.12
Nodes (17): autoprefixer, esbuild, devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/better-sqlite3 (+9 more)

### Community 33 - "kruskal.py"
Cohesion: 0.18
Nodes (8): kruskal_wallis(), mann_whitney_u(), Healthcare Analytics Platform - Statistics: Rank-Based Tests Thin adapters over…, Kruskal-Wallis H test. Returns ``(H, p)`` rounded for display., Mann-Whitney U test. Returns ``(U, p)`` rounded for display., TestDunnPostHoc, TestKruskalWallis, TestMannWhitneyU

### Community 34 - "Healthcare Analytics Platform"
Cohesion: 0.06
Nodes (33): A caution on polynomial degree, Additional commands, Analytical layering, Architecture, Author, Build and run, Column contract, Concurrent users (+25 more)

### Community 35 - ".persist"
Cohesion: 0.16
Nodes (9): Any, Stores and retrieves user-cleaned datasets in isolated tables., Creates the registry, and migrates one that predates session scoping. ALTER…, Writes cleaned records to a new isolated table and registers it. Returns the…, Rows for one persisted dataset, or None when the id is unknown or not owned.…, Drops a persisted dataset and its registry row. False when the id is unknown,…, UserDatasetService, TestOwnerScopedAccess (+1 more)

### Community 36 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @google/genai, html-to-image, jszip, lucide-react, motion, react, react-dom (+31 more)

### Community 38 - "dashboard.py"
Cohesion: 0.23
Nodes (9): get_dashboard_kpis(), get_dashboard_summary(), HTTPException, Any, Exception, get, Healthcare Analytics Platform - FastAPI Router: Executive Dashboard Analytics…, Returns high-level executive KPIs derived from real SQLite ED dataset tables. (+1 more)

### Community 39 - "datasets.py"
Cohesion: 0.16
Nodes (10): APIRouter, get_dataset_records(), get_datasets(), HTTPException, Any, Exception, get, Healthcare Analytics Platform - API Router: Datasets Management (+2 more)

### Community 40 - "DataCleaning.tsx"
Cohesion: 0.20
Nodes (10): DatasetState, DatasetUpload(), DatasetUploadProps, DataCleaning(), DataCleaningProps, RawDataset, sampleDatasets, CleaningAction (+2 more)

### Community 41 - "launch.py"
Cohesion: 0.24
Nodes (13): free_port(), in_container(), is_interactive(), main(), port_in_use(), preflight(), Healthcare Analytics Platform — one-shot launcher. Installs Node and Python…, Fails fast on the mistakes that produce confusing symptoms later. (+5 more)

### Community 42 - "TestH4Module"
Cohesion: 0.15
Nodes (3): Visit counts must actually drive the test, not merely decorate the output., The ordering constant must describe categories the database really stores., TestH4Module

### Community 43 - "analytics_service.py"
Cohesion: 0.24
Nodes (8): compute_er_kpis(), Any, Helper method for calculating summary KPIs from record lists., AnalyticsService, Any, Healthcare Analytics Platform - Analytics Service Layer Decouples API…, Reports readiness of each analytical pipeline stage. Backs GET…, test_pipeline_overview_reports_architecture_stages()

### Community 44 - "weighted_dunn_post_hoc"
Cohesion: 0.23
Nodes (7): _clean_pairs(), Any, Drops non-finite rows and non-positive weights, then coerces weights to counts., Dunn's test: pairwise mean-rank z-tests sharing the pooled rank variance. This…, weighted_dunn_post_hoc(), Dunn shares one ranking across all groups; mean ranks must be global., TestWeightedDunnPostHoc

### Community 45 - "architecture.py"
Cohesion: 0.25
Nodes (5): APIRouter, get_pipeline_overview(), Any, get, Architecture-oriented API endpoints for the platform pipeline overview.

### Community 46 - "api/insights.py"
Cohesion: 0.23
Nodes (10): get_insights_summary(), get_strategic_recommendations(), HTTPException, Any, Exception, get, post, Healthcare Analytics Platform - API Router: Strategic Insights Generates data-… (+2 more)

### Community 47 - "upload.py"
Cohesion: 0.20
Nodes (8): APIRouter, Any, post, Healthcare Analytics Platform - API Router: Dataset Ingestion & Uploads, Ingests uploaded clinical dataset CSV/XLSX file., upload_dataset(), upload_dataset_fallback(), UploadFile

### Community 48 - "test_dependencies.py"
Cohesion: 0.24
Nodes (8): collect_third_party_imports(), declared_distributions(), _iter_python_files(), Test Suite: Dependency declaration contract. Fails when a third-party module is…, Guards the packages that are never imported directly and so look prunable.…, Top-level third-party module names imported anywhere in the scanned trees., Lower-cased distribution names listed in requirements.txt., TestDependencyDeclarations

### Community 50 - "preprocessing_service.py"
Cohesion: 0.29
Nodes (7): calculate_null_ratios(), infer_column_types(), Any, run_health_check(), validate_schema(), Service layer for the architecture-aligned preprocessing pipeline., TestValidation

### Community 51 - "model_diagnostics.py"
Cohesion: 0.19
Nodes (11): APIRouter, assess_fit(), BaseModel, ColumnsRequest, DiagnosticsRequest, modelable_columns(), Any, post (+3 more)

### Community 52 - "map_columns"
Cohesion: 0.09
Nodes (19): align_to_table(), load_csv_datasets(), load_datasets(), main(), map_columns(), DataFrame, Path, Healthcare Analytics Platform - Analytical Database Loader Rebuilds… (+11 more)

### Community 53 - "test_dashboard_services.py"
Cohesion: 0.25
Nodes (6): detect_volume_recommendations(), DataFrame, Healthcare Analytics Platform - Strategic Insights Service Layer Owns the…, Flags the triage level carrying the largest share of visits., Test Suite: Dashboard, Insights and Dataset service layers. These exercise…, TestVolumeRecommendations

### Community 54 - ".get_recommendations"
Cohesion: 0.25
Nodes (6): InsightsService, Any, Derives strategic recommendations from the seeded analytical tables., Profiles every clinical table and returns the top-ranked recommendations., Row counts for every table in the analytical database., TestInsightsService

### Community 55 - ".list_datasets"
Cohesion: 0.18
Nodes (6): Registry entries, newest first. With `owner_id`, only that session's datasets…, An existing database predates the column. Adding it must not require a rebuild,…, Backward compatibility: an unscoped call still sees all rows., Rows persisted before scoping existed have owner_id NULL. A scoped caller must…, TestOwnerScopedListing, TestSchemaMigration

### Community 56 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, clean, dev, lint, start

### Community 57 - "STATISTICAL COMPUTING HUB"
Cohesion: 0.07
Nodes (29): H1: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size, H2: Weighted Mann–Whitney U Test (Two-Sided) · Rank-Biserial Correlation, H3: Weighted Least Squares (WLS) Regression · Visit-Count Weights · Forest Plot, H4: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size, H5: Mann–Kendall Trend Test · Simple Exponential Smoothing (FY+1, FY+2 Forecast), Mann–Kendall Trend & SES Forecast: Estimated Emergency Department Resource Burden Index (ERBI), Model Summary, Pipeline Telemetry (+21 more)

### Community 58 - "statistics.py"
Cohesion: 0.12
Nodes (18): calculate_five_number_summary(), calculate_mean(), calculate_std(), get_table_descriptive_metrics(), Any, Healthcare Analytics Platform - Analytics: Descriptive Statistics Engine…, Calculates min, Q1, median, Q3, and max summary stats., Calculates arithmetic mean of numeric sequence. (+10 more)

### Community 59 - "run_preprocessing.py"
Cohesion: 0.16
Nodes (16): clean_raw_datasets(), DataFrame, Path, Parses original CIHI supplementary data tables from raw Excel file and extracts…, execute_pipeline(), Healthcare Analytics Platform - Preprocessing Pipeline Runner Executes the…, Executes the entire data preprocessing pipeline sequentially: cleaning.py ->…, calculate_null_ratios() (+8 more)

### Community 60 - "model_diagnostics_service.py"
Cohesion: 0.16
Nodes (16): _extract_pairs(), _is_missing(), ModelDiagnosticsService, Any, Model Diagnostics Service — overfitting / underfitting assessment on the…, True when a cleaned value represents absent data rather than a measurement., Coerce a cleaned-record value to float, rejecting imputation placeholders., Pull aligned numeric (feature, target) pairs, counting what was dropped and why. (+8 more)

### Community 61 - "Healthcare Analytics Platform — Executive Dashboard Engineering Roadmap"
Cohesion: 0.12
Nodes (15): 1. Architectural Grounding & Context, 2. Current State Assessment & Technical Debt, 3. Phased Dashboard Implementation Roadmap, 4. Target Directory & Component Architecture, 5.1 Dashboard KPIs Contract (`GET /api/dashboard/kpis`), 5.2 ERBI Breakdown Contract (`POST /api/dashboard/erbi`), 5. API & Data Contract Specifications, 6. Verification & Quality Gate Plan (+7 more)

### Community 62 - ".process_dataset"
Cohesion: 0.21
Nodes (10): clean_missing_values(), Any, Healthcare Analytics Platform - Preprocessing: Cleaning Module Provides missing…, Deduplicates records based on dictionary equality., Fills empty or None values with a specified fallback representation., remove_duplicates(), PreprocessingService, Any (+2 more)

### Community 63 - "App.tsx"
Cohesion: 0.29
Nodes (7): App(), getStagePercentage(), SectionType, STAGES, AboutProject(), AboutProjectProps, buildSemanticModel()

### Community 64 - "TestH1Module"
Cohesion: 0.20
Nodes (3): Visit counts must actually drive the test, not merely decorate the output., Kruskal-Wallis is distribution-free; normality must not gate the result., TestH1Module

### Community 65 - "TestSeededCohortIsolation"
Cohesion: 0.20
Nodes (4): The guarantee that makes H1-H5 reproducible: uploads never touch the seeded…, schema.sql drops its tables; the registry must not be there or a rebuild would…, TempDBTestCase, TestSeededCohortIsolation

### Community 66 - "reports.py"
Cohesion: 0.22
Nodes (6): APIRouter, get_report_summary(), Any, get, Healthcare Analytics Platform - API Router: Report Exports & Audit Logging, Generates summary export metadata for PDF/CSV reports.

### Community 67 - "noisy_line"
Cohesion: 0.24
Nodes (6): noisy_line(), Complexity, not the data, drives the verdict — the distinction the panel exists…, Overfitting is relative to sample size: the same degree-6 model on 40 rows…, A real linear signal plus noise — the setting where model complexity decides…, Overfitting: fits the training rows well, then fails on data it has not seen.…, TestOverfittingDetection

### Community 68 - "schemas.py"
Cohesion: 0.28
Nodes (5): DatasetMeta, KPIResponse, Any, Healthcare Analytics Platform - Data Models & DTO Schemas, StatisticsRequest

### Community 69 - "detect_outlier_recommendations"
Cohesion: 0.36
Nodes (3): detect_outlier_recommendations(), Flags numeric columns whose Tukey-fence outlier share exceeds the alert…, TestOutlierRecommendations

### Community 70 - "infer_sql_type"
Cohesion: 0.36
Nodes (3): infer_sql_type(), INTEGER / REAL / TEXT from the observed non-null values., TestTypeInference

### Community 71 - "userDatasetService.ts"
Cohesion: 0.36
Nodes (8): deleteUserDataset(), fetchUserDataset(), getSessionId(), listUserDatasets(), persistCleanedDataset(), PersistResult, sessionHeaders(), UserDatasetEntry

### Community 72 - "MetricCard.tsx"
Cohesion: 0.25
Nodes (3): MetricCardProps, SIZE_STYLES, VARIANT_STYLES

### Community 73 - "ArchitecturePipelineCard.tsx"
Cohesion: 0.38
Nodes (5): ArchitecturePipelineCard(), ArchitecturePipelineCardProps, ArchitecturePipelineOverview, ArchitectureStageStatus, fetchArchitecturePipelineOverview()

### Community 75 - "DataTable.tsx"
Cohesion: 0.40
Nodes (4): DataTable(), DataTableProps, downloadCSV(), TableColumn

### Community 76 - "ConsultantInsights.tsx"
Cohesion: 0.40
Nodes (3): ConsultantInsights(), ConsultantInsightsProps, StrategicRecommendation

### Community 77 - "polynomial_fit"
Cohesion: 0.29
Nodes (5): polynomial_fit(), Gaussian elimination with partial pivoting. Returns [] if singular., Least-squares polynomial coefficients in ascending order: [c0, c1, ...…, _solve(), TestPolynomialFit

### Community 78 - "dataset_service.py"
Cohesion: 0.40
Nodes (4): Any, Healthcare Analytics Platform - Dataset Access Service Layer Owns table listing…, Coerces a row limit to a sane positive integer. The limit is interpolated into…, _safe_limit()

### Community 79 - "apply_transformations"
Cohesion: 0.22
Nodes (9): aggregate_by_group(), apply_transformations(), normalize_fiscal_year(), Any, DataFrame, Healthcare Analytics Platform - Preprocessing: Transformations Module Provides…, Aggregates numeric column sums grouped by categorical key., Normalizes fiscal year string representations (e.g., '2021–2022' to… (+1 more)

### Community 80 - "sqlite_loader.py"
Cohesion: 0.83
Nodes (3): load_all_explorer_datasets(), load_csv_to_sqlite(), Any

### Community 82 - "diagnose_fit"
Cohesion: 0.36
Nodes (3): diagnose_fit(), Classify a fitted model as Underfitting, Overfitting, or Good Fit. Underfitting…, TestDiagnoseFit

### Community 83 - "k_fold_scores"
Cohesion: 0.31
Nodes (5): _fold_slices(), k_fold_scores(), k-fold cross-validated R². A large std across folds means an unstable model., Contiguous (start, end) index ranges for k roughly equal folds., TestKFoldScores

### Community 84 - "train_test_split"
Cohesion: 0.39
Nodes (3): Shuffle-split paired samples into (x_train, y_train, x_test, y_test).…, train_test_split(), TestTrainTestSplit

### Community 106 - "init_database.py"
Cohesion: 0.50
Nodes (3): init_db(), Healthcare Analytics Platform - Database Schema Initializer Executes schema.sql…, Initializes SQLite database schema by executing schema.sql.

### Community 107 - "main.py"
Cohesion: 0.67
Nodes (3): health_check(), get, root()

### Community 109 - "schema.sql"
Cohesion: 0.25
Nodes (7): age_sex, ctas_triage, demographics, ed_visits, main_problems, metadata, visit_disposition

### Community 110 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 111 - "compute_erbi_metrics"
Cohesion: 0.50
Nodes (3): compute_erbi_metrics(), Healthcare Analytics Platform - Analytics: ERBI Engine Computes Estimated…, Computes Estimated Resource Burden Index (ERBI) per triage level and age…

### Community 113 - "vite"
Cohesion: 0.67
Nodes (3): vite, vite, vite

## Knowledge Gaps
- **240 isolated node(s):** `BaseModel`, `ed_visits`, `ctas_triage`, `visit_disposition`, `age_sex` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `weighted_kruskal_wallis()` connect `weighted_kruskal_wallis` to `kruskal.py`, `hypothesis_testing.py`, `weighted_mean`, `weighted.py`, `weighted_dunn_post_hoc`, `weighted_mann_whitney_u`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `weighted_mann_whitney_u()` connect `weighted_mann_whitney_u` to `kruskal.py`, `hypothesis_testing.py`, `weighted_mean`, `weighted.py`, `weighted_dunn_post_hoc`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `DatabaseManager` connect `database_manager.py` to `TestSeededCohortIsolation`, `map_columns`, `test_user_datasets.py`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `DatabaseManager` (e.g. with `TestDatabaseManager` and `IsolationTestCase`) actually correct?**
  _`DatabaseManager` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BaseModel`, `ed_visits`, `ctas_triage` to the rest of the system?**
  _240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_model_validation.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._
- **Should `dataset_explorer_api.py` be split into smaller, more focused modules?**
  _Cohesion score 0.07188160676532769 - nodes in this community are weakly interconnected._