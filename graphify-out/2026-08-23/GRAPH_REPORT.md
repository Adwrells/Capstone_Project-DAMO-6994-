# Graph Report - Capstone_Project-DAMO-6994-  (2026-08-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1464 nodes · 2450 edges · 109 communities (91 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a9ff8b8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- model_diagnostics_service.py
- .diagnose
- dataset_explorer_api.py
- server.ts
- TestH2
- hypothesis_testing.py
- AnalyticsCore.tsx
- test_preprocessing.py
- statistics.py
- test_analytics.py
- weighted.py
- chi2_sf
- chi_square_test
- user_datasets.py
- test_dashboard.py
- FakeDB
- modelDiagnosticsService.ts
- DatabaseManager
- .get_kpis
- types.ts
- preprocessing_service.py
- APIRouter
- database_manager.py
- test_weighted_statistics.py
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
- TestH1
- .persist
- dependencies
- devDependencies
- dashboard.py
- datasets.py
- DataCleaning.tsx
- launch.py
- TestH4Module
- analytics_service.py
- weighted_mean
- architecture.py
- api/insights.py
- upload.py
- test_dependencies.py
- TestH2Module
- validate_schema
- model_diagnostics.py
- map_columns
- test_dashboard_services.py
- .get_recommendations
- .list_datasets
- package.json
- UserDatasetService
- descriptive.py
- run_preprocessing.py
- analytics/preprocessing/feature_engineering.py
- weighted_mann_whitney_u
- frontend/package.json
- App.tsx
- TestH1Module
- TestSeededCohortIsolation
- reports.py
- student_t_sf
- schemas.py
- detect_outlier_recommendations
- infer_sql_type
- userDatasetService.ts
- MetricCard.tsx
- ArchitecturePipelineCard.tsx
- DataTable.tsx
- ConsultantInsights.tsx
- TestH5Module
- dataset_service.py
- TestH3Module
- sqlite_loader.py
- APIRouter
- _betai
- html-to-image
- lucide-react
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

## God Nodes (most connected - your core abstractions)
1. `weighted_kruskal_wallis()` - 26 edges
2. `FakeDB` - 21 edges
3. `DatabaseManager` - 21 edges
4. `weighted_mann_whitney_u()` - 21 edges
5. `run_h1_test()` - 19 edges
6. `run_h4_test()` - 18 edges
7. `rows()` - 17 edges
8. `weighted_mean()` - 17 edges
9. `weighted_dunn_post_hoc()` - 17 edges
10. `TestH1` - 16 edges

## Surprising Connections (you probably didn't know these)
- `IsolationTestCase` --uses--> `DatabaseManager`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/database/database_manager.py
- `TempDBTestCase` --uses--> `DatabaseManager`  [INFERRED]
  tests/test_user_datasets.py → backend/database/database_manager.py
- `TestPersistence` --uses--> `UserDatasetService`  [INFERRED]
  tests/test_user_datasets.py → backend/services/user_dataset_service.py
- `TestOwnerScopedListing` --uses--> `UserDatasetService`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/services/user_dataset_service.py
- `TestOwnerScopedAccess` --uses--> `UserDatasetService`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/services/user_dataset_service.py

## Import Cycles
- None detected.

## Communities (109 total, 18 thin omitted)

### Community 0 - "model_diagnostics_service.py"
Cohesion: 0.06
Nodes (34): complexity_curve(), diagnose_fit(), _fold_slices(), k_fold_scores(), learning_curve(), mae(), polynomial_fit(), polynomial_predict() (+26 more)

### Community 1 - ".diagnose"
Cohesion: 0.08
Nodes (29): _extract_pairs(), _is_missing(), ModelDiagnosticsService, Any, Full overfitting / underfitting assessment for one feature-target pair. Returns…, True when a cleaned value represents absent data rather than a measurement., Coerce a cleaned-record value to float, rejecting imputation placeholders., Pull aligned numeric (feature, target) pairs, counting what was dropped and why. (+21 more)

### Community 2 - "dataset_explorer_api.py"
Cohesion: 0.07
Nodes (32): APIRouter, _generate_description(), get_data_dictionary(), get_dataset_correlation(), get_dataset_outliers(), get_dataset_sheet_data(), get_dataset_sheet_statistics(), get_dataset_sheets() (+24 more)

### Community 3 - "server.ts"
Cohesion: 0.07
Nodes (34): activeJobs, app, BackgroundJob, BetterSQLite3, cache, DATASET_TABLE_MAP, DB_PATH, DIRS (+26 more)

### Community 4 - "TestH2"
Cohesion: 0.09
Nodes (5): HypothesisResultContract, Shared contract every hypothesis result must satisfy., weighted_n counts VISITS; n_records counts aggregate rows. They must differ., TestH2, TestH4

### Community 5 - "hypothesis_testing.py"
Cohesion: 0.10
Nodes (27): _clean_frame(), _effect_label(), is_rollup_or_excluded(), Any, DataFrame, Healthcare Analytics Platform - Analytics: Hypothesis Testing Engine Executes…, Splits a frame into parallel value/name/weight lists, honouring a display order., Builds the per-group descriptive block returned to the API. (+19 more)

### Community 6 - "AnalyticsCore.tsx"
Cohesion: 0.10
Nodes (28): AnalyticsCore(), AnalyticsCoreProps, BoxGroup, boxStats(), chiSqP(), cleanPairs(), CTAS_PAL, FEntry (+20 more)

### Community 7 - "test_preprocessing.py"
Cohesion: 0.19
Nodes (14): add_los_columns(), add_population_category(), clean_missing_values(), normalize_age_group(), normalize_column_names(), _normalize_key(), normalize_population_category(), Any (+6 more)

### Community 8 - "statistics.py"
Cohesion: 0.10
Nodes (31): compute_erbi_metrics(), Computes Estimated Resource Burden Index (ERBI) per triage level and age…, BaseModel, compute_trend_analysis(), get_hypothesis_h1(), get_hypothesis_h2(), get_hypothesis_h3(), get_hypothesis_h4() (+23 more)

### Community 9 - "test_analytics.py"
Cohesion: 0.13
Nodes (16): linear_regression(), Any, Healthcare Analytics Platform - Analytics: Regression Engine Computes Weighted…, Computes ordinary least squares (OLS) linear regression helper., H3 Hypothesis Test: Performs Weighted Least Squares (WLS) linear regression…, run_h3_regression(), mann_kendall_test(), _norm_cdf() (+8 more)

### Community 10 - "weighted.py"
Cohesion: 0.19
Nodes (17): Any, H1: does reported median ED LOS differ across CTAS triage levels? ``weights``…, run(), Any, H2: does reported median ED LOS differ between admitted and non-admitted…, run(), Any, H4: does reported median ED LOS differ across patient age groups? ``weights``… (+9 more)

### Community 11 - "chi2_sf"
Cohesion: 0.17
Nodes (10): chi2_sf(), _gamma_p_series(), _gamma_q_continued_fraction(), Regularized lower incomplete gamma P(a, x) by series expansion (x < a + 1)., Regularized upper incomplete gamma Q(a, x) by Lentz continued fraction (x >= a…, Chi-square survival function P(X > x). Equivalent to scipy.stats.chi2.sf., skipUnless, chi2_sf / normal_sf replace the logistic approximations the old engine used. (+2 more)

### Community 12 - "chi_square_test"
Cohesion: 0.28
Nodes (6): Any, run(), chi_square_summary(), chi_square_test(), Any, TestChiSquare

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

### Community 17 - "DatabaseManager"
Cohesion: 0.10
Nodes (14): DatabaseManager, Any, DataFrame, Thread-safe SQLite Database Manager for Healthcare Analytics Platform., Establishes and returns an optimized SQLite connection. The caller owns the…, Yields a connection and always closes it on exit. `with sqlite3.connect(...) as…, Executes a SELECT query and returns the results as a Pandas DataFrame., Executes a SELECT query and returns rows as dictionaries. (+6 more)

### Community 18 - ".get_kpis"
Cohesion: 0.15
Nodes (9): DashboardService, Any, Healthcare Analytics Platform - Dashboard Service Layer Owns the executive KPI…, First row's value for `key`, or `default` when absent, empty, or NULL., Computes executive KPIs and dataset metadata summaries., High-level executive KPIs derived from the seeded ED tables., Provenance rows from the metadata table: source file, row and column counts., _scalar() (+1 more)

### Community 19 - "types.ts"
Cohesion: 0.12
Nodes (16): CustomChartBuilderProps, ExecutiveDashboardProps, AnalyticsEngineProps, AggregationOption, AIAnalysisResult, AIKeyFinding, CategoricalMetrics, ColumnInfo (+8 more)

### Community 20 - "preprocessing_service.py"
Cohesion: 0.11
Nodes (23): clean_missing_values(), Any, Healthcare Analytics Platform - Preprocessing: Cleaning Module Provides missing…, Deduplicates records based on dictionary equality., Fills empty or None values with a specified fallback representation., remove_duplicates(), add_feature_engineering(), classify_age_group() (+15 more)

### Community 22 - "database_manager.py"
Cohesion: 0.15
Nodes (9): Healthcare Analytics Platform - Analytics: ERBI Engine Computes Estimated…, exponential_smoothing_forecast(), Any, Healthcare Analytics Platform - Analytics: Forecasting Engine Computes Simple…, Performs Simple Exponential Smoothing (SES) forecasting with 95% confidence…, Queries annual ED visit totals from SQLite and generates Simple Exponential…, run_ed_visits_forecasting(), Forecasting Submodule Re-exports the SES forecasting engine so `from… (+1 more)

### Community 23 - "test_weighted_statistics.py"
Cohesion: 0.16
Nodes (10): normal_sf(), Standard normal survival function P(Z > z), exact via the error function., Midranks each unique value across the weight-expanded population. Returns…, Dunn's test: pairwise mean-rank z-tests sharing the pooled rank variance. This…, weighted_dunn_post_hoc(), weighted_midranks(), Tests for the frequency-weighted non-parametric engine that backs H1/H2/H4. Two…, Dunn shares one ranking across all groups; mean ranks must be global. (+2 more)

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
Cohesion: 0.28
Nodes (6): Any, run(), linear_regression(), Any, regression_summary(), TestLinearRegression

### Community 28 - "test_user_datasets.py"
Cohesion: 0.18
Nodes (8): build_schema(), Healthcare Analytics Platform - User Dataset Persistence Persists a web user's…, Rewrites an arbitrary key into a safe SQL identifier. Column names come from a…, Ordered {safe_column: sql_type} derived from the record keys., sanitize_column(), Test Suite: User dataset persistence. Covers the Path A → SQLite write…, TestColumnSanitisation, TestSchemaBuilding

### Community 29 - "ExecutiveDashboard.tsx"
Cohesion: 0.19
Nodes (14): calcMean(), calcMedian(), calcStddev(), ChartCfg, ChartKind, defaultCfg(), ExecutiveDashboard(), fmtK() (+6 more)

### Community 30 - "dependencies"
Cohesion: 0.12
Nodes (17): better-sqlite3, dotenv, express, dependencies, better-sqlite3, dotenv, express, jszip (+9 more)

### Community 31 - "biEngine.ts"
Cohesion: 0.13
Nodes (11): AggregationType, ColumnRole, computeHistogramBins(), CoreStatsSummary, DateHierarchyNode, detectOutliersIndexes(), HistogramBin, RegressionResult (+3 more)

### Community 32 - "devDependencies"
Cohesion: 0.12
Nodes (16): autoprefixer, esbuild, vite, devDependencies, autoprefixer, esbuild, tailwindcss, tsx (+8 more)

### Community 33 - "kruskal.py"
Cohesion: 0.17
Nodes (10): dunn_post_hoc(), kruskal_wallis(), mann_whitney_u(), Healthcare Analytics Platform - Statistics: Rank-Based Tests Thin adapters over…, Kruskal-Wallis H test. Returns ``(H, p)`` rounded for display., Dunn's post-hoc test with Bonferroni-adjusted p-values. This is now the genuine…, Mann-Whitney U test. Returns ``(U, p)`` rounded for display., TestDunnPostHoc (+2 more)

### Community 34 - "TestH1"
Cohesion: 0.13
Nodes (4): Resuscitation/Emergent should not rank below Non-urgent on LOS., Must be in (0, 1]. The source notebook reported 1.0000001932 via int64 overflow., Anchored to backend/hypothesis testing/H1_testing.ipynb (N and effect size)., TestH1

### Community 35 - ".persist"
Cohesion: 0.16
Nodes (7): Any, Creates the registry, and migrates one that predates session scoping. ALTER…, Writes cleaned records to a new isolated table and registers it. Returns the…, Rows for one persisted dataset, or None when the id is unknown or not owned.…, Drops a persisted dataset and its registry row. False when the id is unknown,…, TestOwnerScopedAccess, TestPersistence

### Community 36 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @google/genai, jszip, motion, react, react-dom, recharts, jszip (+8 more)

### Community 37 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, vite (+8 more)

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

### Community 44 - "weighted_mean"
Cohesion: 0.31
Nodes (4): _clean_pairs(), Drops non-finite rows and non-positive weights, then coerces weights to counts., weighted_mean(), TestWeightedDescriptives

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

### Community 50 - "validate_schema"
Cohesion: 0.35
Nodes (6): calculate_null_ratios(), infer_column_types(), Any, run_health_check(), validate_schema(), TestValidation

### Community 51 - "model_diagnostics.py"
Cohesion: 0.19
Nodes (11): APIRouter, assess_fit(), BaseModel, ColumnsRequest, DiagnosticsRequest, modelable_columns(), Any, post (+3 more)

### Community 52 - "map_columns"
Cohesion: 0.09
Nodes (18): align_to_table(), load_datasets(), main(), map_columns(), DataFrame, Path, Healthcare Analytics Platform - Analytical Database Loader Rebuilds…, Initializes the schema and loads every cleaned dataset. Returns rows per table. (+10 more)

### Community 53 - "test_dashboard_services.py"
Cohesion: 0.25
Nodes (6): detect_volume_recommendations(), DataFrame, Healthcare Analytics Platform - Strategic Insights Service Layer Owns the…, Flags the triage level carrying the largest share of visits., Test Suite: Dashboard, Insights and Dataset service layers. These exercise…, TestVolumeRecommendations

### Community 54 - ".get_recommendations"
Cohesion: 0.25
Nodes (6): InsightsService, Any, Derives strategic recommendations from the seeded analytical tables., Profiles every clinical table and returns the top-ranked recommendations., Row counts for every table in the analytical database., TestInsightsService

### Community 55 - ".list_datasets"
Cohesion: 0.27
Nodes (4): Registry entries, newest first. With `owner_id`, only that session's datasets…, Backward compatibility: an unscoped call still sees all rows., Rows persisted before scoping existed have owner_id NULL. A scoped caller must…, TestOwnerScopedListing

### Community 56 - "package.json"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, clean, dev, lint, start (+2 more)

### Community 57 - "UserDatasetService"
Cohesion: 0.19
Nodes (8): Stores and retrieves user-cleaned datasets in isolated tables., UserDatasetService, IsolationTestCase, Test Suite: Session-scoped isolation of user datasets. Two people using the…, An existing database predates the column. Adding it must not require a rebuild,…, H1-H5 must stay identical for everyone — that is the point of the seeded store., TestSchemaMigration, TestSeededCohortStillShared

### Community 58 - "descriptive.py"
Cohesion: 0.19
Nodes (12): calculate_five_number_summary(), calculate_mean(), calculate_std(), get_table_descriptive_metrics(), Any, Healthcare Analytics Platform - Analytics: Descriptive Statistics Engine…, Calculates min, Q1, median, Q3, and max summary stats., Calculates arithmetic mean of numeric sequence. (+4 more)

### Community 59 - "run_preprocessing.py"
Cohesion: 0.10
Nodes (26): load_csv_datasets(), clean_raw_datasets(), DataFrame, Path, Parses original CIHI supplementary data tables from raw Excel file and extracts…, execute_pipeline(), Healthcare Analytics Platform - Preprocessing Pipeline Runner Executes the…, Executes the entire data preprocessing pipeline sequentially: cleaning.py ->… (+18 more)

### Community 60 - "analytics/preprocessing/feature_engineering.py"
Cohesion: 0.26
Nodes (8): add_admission_status(), add_ctas_urgency_score(), encode_admission_flag(), encode_sex_category(), enrich_records(), extract_fiscal_year(), Any, TestFeatureEngineering

### Community 61 - "weighted_mann_whitney_u"
Cohesion: 0.23
Nodes (7): Any, 1 - sum(t^3 - t) / (N^3 - N). Returns 1.0 when the correction is undefined., Frequency-weighted Mann-Whitney U with tie-corrected normal approximation. The…, _tie_correction(), weighted_mann_whitney_u(), Fully separated groups give the maximal effect size., TestWeightedMannWhitneyU

### Community 62 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

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

### Community 67 - "student_t_sf"
Cohesion: 0.20
Nodes (5): Student-t survival function P(T > t). Equivalent to scipy.stats.t.sf. Replaces…, student_t_sf(), chi_square and linear_regression previously shipped invented p-value formulas., The replaced approximation ignored df entirely; the exact tail must not., TestDownstreamModulesUseExactTails

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

### Community 78 - "dataset_service.py"
Cohesion: 0.40
Nodes (4): Any, Healthcare Analytics Platform - Dataset Access Service Layer Owns table listing…, Coerces a row limit to a sane positive integer. The limit is interpolated into…, _safe_limit()

### Community 80 - "sqlite_loader.py"
Cohesion: 0.83
Nodes (3): load_all_explorer_datasets(), load_csv_to_sqlite(), Any

### Community 82 - "_betai"
Cohesion: 0.50
Nodes (4): _betacf(), _betai(), Continued fraction for the incomplete beta function (Lentz's method)., Regularized incomplete beta function I_x(a, b).

### Community 83 - "html-to-image"
Cohesion: 0.67
Nodes (3): html-to-image, html-to-image, html-to-image

### Community 84 - "lucide-react"
Cohesion: 0.67
Nodes (3): lucide-react, lucide-react, lucide-react

### Community 106 - "init_database.py"
Cohesion: 0.50
Nodes (3): init_db(), Healthcare Analytics Platform - Database Schema Initializer Executes schema.sql…, Initializes SQLite database schema by executing schema.sql.

### Community 107 - "main.py"
Cohesion: 0.67
Nodes (3): health_check(), get, root()

## Knowledge Gaps
- **131 isolated node(s):** `FitDiagnosticsProps`, `ExportReportsProps`, `ComplexityCurvePoint`, `CrossValidation`, `DataQuality` (+126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TestH1` connect `TestH1` to `TestH2`, `hypothesis_testing.py`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `weighted_kruskal_wallis()` connect `weighted_kruskal_wallis` to `kruskal.py`, `hypothesis_testing.py`, `weighted.py`, `chi2_sf`, `weighted_mean`, `test_weighted_statistics.py`, `weighted_mann_whitney_u`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `load_csv_datasets()` connect `run_preprocessing.py` to `map_columns`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `DatabaseManager` (e.g. with `TestDatabaseManager` and `IsolationTestCase`) actually correct?**
  _`DatabaseManager` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `FitDiagnosticsProps`, `ExportReportsProps`, `ComplexityCurvePoint` to the rest of the system?**
  _131 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `model_diagnostics_service.py` be split into smaller, more focused modules?**
  _Cohesion score 0.060455486542443065 - nodes in this community are weakly interconnected._
- **Should `.diagnose` be split into smaller, more focused modules?**
  _Cohesion score 0.07609427609427609 - nodes in this community are weakly interconnected._