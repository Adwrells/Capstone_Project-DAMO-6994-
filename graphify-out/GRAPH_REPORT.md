# Graph Report - Capstone_Project-DAMO-6994-  (2026-09-03)

## Corpus Check
- 156 files · ~138,552 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1796 nodes · 3048 edges · 135 communities (116 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9e54063e`
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
- statistics.py
- components/formatters.ts
- weighted.py
- chi2_sf
- chi_square_test
- user_datasets.py
- test_dashboard.py
- FakeDB
- modelDiagnosticsService.ts
- DatabaseManager
- .get_kpis
- CustomChartBuilder.tsx
- backend/preprocessing/feature_engineering.py
- Healthcare Analytics Platform — Architecture Specification & Roadmap
- domain.ts
- weighted_mann_whitney_u
- weighted_kruskal_wallis
- DataExplorer.tsx
- compilerOptions
- student_t_sf
- test_user_datasets.py
- ExecutiveDashboard.tsx
- dependencies
- biEngine.ts
- devDependencies
- test_h1.py
- Healthcare Analytics Platform
- .persist
- dependencies
- DashboardService
- dashboard.py
- datasets.py
- DataCleaning.tsx
- launch.py
- TestH4Module
- analytics_service.py
- is_rollup_or_excluded
- architecture.py
- strategic_synthesis_service.py
- upload.py
- test_dependencies.py
- TestH2Module
- preprocessing_service.py
- model_diagnostics.py
- load_csv.py
- auth.py
- test_dashboard_services.py
- .list_datasets
- scripts
- .connection
- [2.0.0] — 2026-08-27
- analytics/preprocessing/feature_engineering.py
- model_diagnostics_service.py
- ExcelDatasetService
- .process_dataset
- App.tsx
- TestH1Module
- TestSeededCohortIsolation
- reports.py
- noisy_line
- main.py
- detect_outlier_recommendations
- infer_sql_type
- userDatasetService.ts
- MetricCard.tsx
- ArchitecturePipelineCard.tsx
- apiService.ts
- DataTable.tsx
- DescriptiveStatsTable.tsx
- polynomial_fit
- fmtK
- transformations.py
- test_user_dataset_isolation.py
- map_columns
- diagnose_fit
- k_fold_scores
- train_test_split
- Layout.tsx
- analytics/__init__.py
- analytics/preprocessing/__init__.py
- api/__init__.py
- database/__init__.py
- backend/__init__.py
- UserDatasetService
- ExecutiveKPIGrid.tsx
- services/__init__.py
- align_to_table
- Architecture
- tests/__init__.py
- APIRouter
- database_manager.py
- TestH5Module
- schema.sql
- weighted_mean
- package.json
- 6. Professional Architecture Enhancements & Recommendations
- Docker Deployment
- vite
- express
- TestH3Module
- 4A. Runtime Data Flow — Cleaning → Visualization → Reports
- 4C. Data Flow & Architecture Conformance Checks
- H3UrgencyRegression.tsx
- ResourceBurdenTrend.tsx
- Data
- TestLoaderConfiguration
- APIRouter
- Model Fit Diagnostics
- test_proxy.py
- TestDownstreamModulesUseExactTails
- Codebase knowledge graph (graphify)
- Installation
- xlsx
- vitest
- ConsultantInsights.tsx
- react

## God Nodes (most connected - your core abstractions)
1. `weighted_kruskal_wallis()` - 26 edges
2. `run_h1_test()` - 24 edges
3. `run_h4_test()` - 23 edges
4. `weighted_mann_whitney_u()` - 21 edges
5. `DatabaseManager` - 21 edges
6. `FakeDB` - 21 edges
7. `weighted_mean()` - 20 edges
8. `run_h2_test()` - 19 edges
9. `weighted_dunn_post_hoc()` - 17 edges
10. `rows()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `IsolationTestCase` --uses--> `DatabaseManager`  [INFERRED]
  tests/test_user_dataset_isolation.py → backend/database/database_manager.py
- `TempDBTestCase` --uses--> `DatabaseManager`  [INFERRED]
  tests/test_user_datasets.py → backend/database/database_manager.py
- `TestDashboardServiceKPIs` --uses--> `DashboardService`  [INFERRED]
  tests/test_dashboard_services.py → backend/services/dashboard_service.py
- `TestGuards` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py
- `TestOverfittingDetection` --uses--> `ModelDiagnosticsService`  [INFERRED]
  tests/test_model_diagnostics_service.py → backend/services/model_diagnostics_service.py

## Import Cycles
- None detected.

## Communities (135 total, 19 thin omitted)

### Community 0 - "test_model_validation.py"
Cohesion: 0.12
Nodes (17): complexity_curve(), learning_curve(), mae(), polynomial_predict(), Any, r_squared(), Model validation primitives — train/test splitting, polynomial fitting, error…, Evaluate a polynomial (ascending coefficients) at each point via Horner's… (+9 more)

### Community 1 - ".diagnose"
Cohesion: 0.17
Nodes (8): Full overfitting / underfitting assessment for one feature-target pair. Returns…, A filled gap must never enter the fit as if it were an observation., Underfitting: the model explains almost nothing, on its own training data., Mirrors the real case: fiscal year does not predict triage acuity., A model that failed on its own training data is underfit, not overfit —…, rows(), TestGuards, TestUnderfittingDetection

### Community 2 - "dataset_explorer_api.py"
Cohesion: 0.09
Nodes (30): APIRouter, download_custom_export(), download_raw_xlsx(), download_sheet_csv(), FileResponse, _generate_description(), get_data_dictionary(), get_dataset_correlation() (+22 more)

### Community 3 - "server.ts"
Cohesion: 0.07
Nodes (35): activeJobs, app, BackgroundJob, BetterSQLite3, cache, DATASET_TABLE_MAP, DB_PATH, DIRS (+27 more)

### Community 4 - "TestH1"
Cohesion: 0.06
Nodes (9): HypothesisResultContract, Resuscitation/Emergent should not rank below Non-urgent on LOS., Shared contract every hypothesis result must satisfy., weighted_n counts VISITS; n_records counts aggregate rows. They must differ., Must be in (0, 1]. The source notebook reported 1.0000001932 via int64 overflow., Anchored to backend/hypothesis testing/H1_testing.ipynb (N and effect size)., TestH1, TestH2 (+1 more)

### Community 5 - "hypothesis_testing.py"
Cohesion: 0.11
Nodes (29): _clean_frame(), _cramers_v(), _effect_label(), Any, DataFrame, Healthcare Analytics Platform - Analytics: Hypothesis Testing Engine Executes…, Splits a frame into parallel value/name/weight lists, honouring a display order., Builds the per-group descriptive block returned to the API. (+21 more)

### Community 6 - "AnalyticsCore.tsx"
Cohesion: 0.09
Nodes (30): AnalyticsCore(), AnalyticsCoreProps, BoxGroup, boxStats(), CANONICAL_AGE_SEX_STRATA, chiSqP(), ChiSquareResult, chiSquareTest() (+22 more)

### Community 7 - "test_preprocessing.py"
Cohesion: 0.20
Nodes (12): add_los_columns(), add_population_category(), clean_missing_values(), normalize_column_names(), _normalize_key(), normalize_population_category(), Any, # NOTE: this is NOT the vocabulary used by healthcare.db. The cleaned master… (+4 more)

### Community 8 - "statistics.py"
Cohesion: 0.05
Nodes (53): calculate_five_number_summary(), calculate_mean(), calculate_std(), get_table_descriptive_metrics(), Any, Healthcare Analytics Platform - Analytics: Descriptive Statistics Engine…, Calculates min, Q1, median, Q3, and max summary stats., Calculates arithmetic mean of numeric sequence. (+45 more)

### Community 9 - "components/formatters.ts"
Cohesion: 0.14
Nodes (21): CTAS_ORDERED_DATA, H1CTASLOS(), H1CTASLOSProps, DISPOSITION_DATA, H2AdmissionLOS(), H2AdmissionLOSProps, AGE_ORDERED_DATA, H4AgeLOS() (+13 more)

### Community 10 - "weighted.py"
Cohesion: 0.13
Nodes (26): Any, H1: does reported median ED LOS differ across CTAS triage levels? ``weights``…, run(), Any, H2: does reported median ED LOS differ between admitted and non-admitted…, run(), Any, run() (+18 more)

### Community 11 - "chi2_sf"
Cohesion: 0.14
Nodes (11): chi2_sf(), _gamma_p_series(), _gamma_q_continued_fraction(), Chi-square survival function P(X > x). Equivalent to scipy.stats.chi2.sf., Regularized lower incomplete gamma P(a, x) by series expansion (x < a + 1)., Regularized upper incomplete gamma Q(a, x) by Lentz continued fraction (x >= a…, skipUnless, chi2_sf / normal_sf replace the logistic approximations the old engine used. (+3 more)

### Community 12 - "chi_square_test"
Cohesion: 0.28
Nodes (6): Any, run(), chi_square_summary(), chi_square_test(), Any, TestChiSquare

### Community 13 - "user_datasets.py"
Cohesion: 0.11
Nodes (18): APIRouter, BaseModel, delete_user_dataset(), get_user_dataset(), HTTPException, list_user_datasets(), persist_cleaned_dataset(), PersistRequest (+10 more)

### Community 14 - "test_dashboard.py"
Cohesion: 0.11
Nodes (19): generate_erbi_insight(), generate_executive_summary(), generate_hypothesis_summary(), generate_kpi_insight(), Any, compute_er_kpis(), compute_population_category(), compute_problem_rank() (+11 more)

### Community 15 - "FakeDB"
Cohesion: 0.11
Nodes (13): DatasetService, Any, Healthcare Analytics Platform - Dataset Access Service Layer Owns table listing…, Coerces a row limit to a sane positive integer. The limit is interpolated into…, Reads dataset tables from the analytical database., Names of every table available for exploration., Rows for one dataset table, or None when the table does not exist. The name is…, _safe_limit() (+5 more)

### Community 16 - "modelDiagnosticsService.ts"
Cohesion: 0.13
Nodes (19): FitDiagnostics(), FitDiagnosticsProps, VERDICT_STYLES, ExportReports(), ExportReportsProps, assessModelFit(), ComplexityCurvePoint, CrossValidation (+11 more)

### Community 17 - "DatabaseManager"
Cohesion: 0.18
Nodes (7): DatabaseManager, Any, Returns list of user tables in the SQLite database., Thread-safe SQLite Database Manager for Healthcare Analytics Platform., Executes a SELECT query and returns rows as dictionaries., Healthcare Analytics Platform - Test Suite: Database Manager, TestDatabaseManager

### Community 18 - ".get_kpis"
Cohesion: 0.26
Nodes (4): First row's value for `key`, or `default` when absent, empty, or NULL., Five Executive KPIs derived from authoritative SQLite ED tables., _scalar(), TestDashboardServiceKPIs

### Community 19 - "CustomChartBuilder.tsx"
Cohesion: 0.29
Nodes (9): CLINICAL_RECOMMENDATIONS, ClinicalRecommendation, CustomChartBuilder(), CustomChartBuilderProps, ExecutiveDashboardProps, fetchChartBuilderAssistant(), AggregationOption, CustomVisualization (+1 more)

### Community 20 - "backend/preprocessing/feature_engineering.py"
Cohesion: 0.19
Nodes (12): add_feature_engineering(), classify_age_group(), encode_sex_category(), extract_year_from_period(), map_ctas_urgency(), DataFrame, Healthcare Analytics Platform - Preprocessing: Feature Engineering Module…, Extracts starting fiscal year or calendar year as integer from period string. (+4 more)

### Community 21 - "Healthcare Analytics Platform — Architecture Specification & Roadmap"
Cohesion: 0.12
Nodes (15): 1. Executive Overview, 2. System Architecture Diagram, 3.1 Frontend Architecture (`frontend/src/`), 3.2 Backend Service Architecture (`backend/`), 3.3 Analytics & Intelligence Engine (`backend/analytics/`), 3.4 Data Directory Structure (`data/`), 3. Current Architecture Breakdown, 4. Data Ingestion & Transformation Flow (+7 more)

### Community 22 - "domain.ts"
Cohesion: 0.08
Nodes (22): AIKeyFinding, ArchitecturePipelineOverview, ArchitectureStageStatus, CategoricalMetrics, ColumnInfo, ColumnType, ComplexityCurvePoint, FitDiagnosis (+14 more)

### Community 23 - "weighted_mann_whitney_u"
Cohesion: 0.10
Nodes (17): normal_sf(), Any, Standard normal survival function P(Z > z), exact via the error function., Midranks each unique value across the weight-expanded population. Returns…, 1 - sum(t^3 - t) / (N^3 - N). Returns 1.0 when the correction is undefined., Frequency-weighted Mann-Whitney U with tie-corrected normal approximation. The…, Dunn's test: pairwise mean-rank z-tests sharing the pooled rank variance. This…, _tie_correction() (+9 more)

### Community 24 - "weighted_kruskal_wallis"
Cohesion: 0.16
Nodes (9): Frequency-weighted Kruskal-Wallis H test with tie correction and exact p-value.…, weighted_kruskal_wallis(), With unit weights the engine must reduce to the textbook Kruskal-Wallis., SciPy tie-corrects; so must we, or the two diverge exactly where it matters., The whole point: weighting must equal physically repeating the rows., Guards the exact defect being fixed: ignoring weights must not be equivalent., A correction > 1 is impossible; the source notebook produced one via int64…, Pure-Python ints must carry t**3 past the int64 ceiling without wrapping. (+1 more)

### Community 25 - "DataExplorer.tsx"
Cohesion: 0.12
Nodes (15): apiFetch(), CHART_COLOURS, computeClientStats(), DataExplorer(), DataExplorerProps, DistributionChart(), FALLBACK_SHEET_DATA, Field (+7 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 27 - "student_t_sf"
Cohesion: 0.27
Nodes (7): linear_regression(), Any, regression_summary(), weighted_linear_regression(), Student-t survival function P(T > t). Equivalent to scipy.stats.t.sf. Replaces…, student_t_sf(), TestLinearRegression

### Community 28 - "test_user_datasets.py"
Cohesion: 0.18
Nodes (8): build_schema(), Healthcare Analytics Platform - User Dataset Persistence Persists a web user's…, Rewrites an arbitrary key into a safe SQL identifier. Column names come from a…, Ordered {safe_column: sql_type} derived from the record keys., sanitize_column(), Test Suite: User dataset persistence. Covers the Path A → SQLite write…, TestColumnSanitisation, TestSchemaBuilding

### Community 29 - "ExecutiveDashboard.tsx"
Cohesion: 0.18
Nodes (12): DashboardFilters(), DashboardFiltersProps, HYPOTHESIS_CARDS, HypothesisEvidenceHub(), HypothesisEvidenceHubProps, LOSTrend(), LOSTrendProps, VisitVolumeTrendProps (+4 more)

### Community 30 - "dependencies"
Cohesion: 0.10
Nodes (21): better-sqlite3, dependencies, better-sqlite3, @google/genai, html-to-image, jszip, lucide-react, motion (+13 more)

### Community 31 - "biEngine.ts"
Cohesion: 0.14
Nodes (13): AggregationType, calculateAdvancedStats(), calculateLinearRegression(), ColumnRole, computeHistogramBins(), CoreStatsSummary, DateHierarchyNode, detectOutliersIndexes() (+5 more)

### Community 32 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, esbuild, jsdom, devDependencies, autoprefixer, esbuild, jsdom, tailwindcss (+15 more)

### Community 33 - "test_h1.py"
Cohesion: 0.20
Nodes (7): kruskal_wallis(), mann_whitney_u(), Kruskal-Wallis H test. Returns ``(H, p)`` rounded for display., Mann-Whitney U test. Returns ``(U, p)`` rounded for display., TestDunnPostHoc, TestKruskalWallis, TestMannWhitneyU

### Community 34 - "Healthcare Analytics Platform"
Cohesion: 0.13
Nodes (15): Additional commands, Author, End-to-End Program Flow, Every row is an aggregate, not an observation, File-by-file reference, Frontend tests (Vitest), Healthcare Analytics Platform, Overview (+7 more)

### Community 35 - ".persist"
Cohesion: 0.23
Nodes (3): Writes cleaned records to a new isolated table and registers it. Returns the…, Rows for one persisted dataset, or None when the id is unknown or not owned.…, TestPersistence

### Community 36 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @google/genai, html-to-image, jszip, lucide-react, motion, react, react-dom (+31 more)

### Community 37 - "DashboardService"
Cohesion: 0.13
Nodes (12): DashboardService, Any, Longitudinal trends in Visit Volume, Reported LOS, and ERBI across 19 fiscal…, H1 CTAS Acuity vs Length of Stay analysis., H2 Admission Status vs Length of Stay analysis., H3 CTAS Urgency Score WLS Regression analysis., H4 Age Category vs Length of Stay analysis., H5 Sex vs Visit Disposition Chi-Square analysis. (+4 more)

### Community 38 - "dashboard.py"
Cohesion: 0.10
Nodes (27): get_dashboard_ctas(), get_dashboard_demographics(), get_dashboard_disposition(), get_dashboard_hypotheses(), get_dashboard_kpis(), get_dashboard_main_problems(), get_dashboard_regression(), get_dashboard_resource_burden() (+19 more)

### Community 39 - "datasets.py"
Cohesion: 0.24
Nodes (9): get_dataset_records(), get_datasets(), HTTPException, Any, Exception, get, Healthcare Analytics Platform - API Router: Datasets Management, Returns list of preloaded SQLite dataset tables. (+1 more)

### Community 40 - "DataCleaning.tsx"
Cohesion: 0.18
Nodes (11): DatasetState, DatasetUpload(), DatasetUploadProps, DataCleaning(), DataCleaningProps, fetchSqliteStatus(), CleaningAction, CleaningSummary (+3 more)

### Community 41 - "launch.py"
Cohesion: 0.24
Nodes (13): free_port(), in_container(), is_interactive(), main(), port_in_use(), preflight(), Healthcare Analytics Platform — one-shot launcher. Installs Node and Python…, Fails fast on the mistakes that produce confusing symptoms later. (+5 more)

### Community 42 - "TestH4Module"
Cohesion: 0.15
Nodes (3): Visit counts must actually drive the test, not merely decorate the output., The ordering constant must describe categories the database really stores., TestH4Module

### Community 43 - "analytics_service.py"
Cohesion: 0.24
Nodes (8): compute_er_kpis(), Any, Helper method for calculating summary KPIs from record lists., AnalyticsService, Any, Healthcare Analytics Platform - Analytics Service Layer Decouples API…, Reports readiness of each analytical pipeline stage. Backs GET…, test_pipeline_overview_reports_architecture_stages()

### Community 44 - "is_rollup_or_excluded"
Cohesion: 0.14
Nodes (9): is_rollup_or_excluded(), Case-insensitive exact match against rollup labels and missing placeholders.…, skipUnless, No sampling, no capping - the same data must give bit-identical results., Task 01 Acceptance Criteria: Asserts rollup categories are filtered out…, Task 07: Live query reconciliation & staleness validation guard. Verifies that…, TestDeterminism, TestRollupCategoryFiltering (+1 more)

### Community 45 - "architecture.py"
Cohesion: 0.25
Nodes (5): APIRouter, get_pipeline_overview(), Any, get, Architecture-oriented API endpoints for the platform pipeline overview.

### Community 46 - "strategic_synthesis_service.py"
Cohesion: 0.06
Nodes (48): exponential_smoothing_forecast(), Any, Healthcare Analytics Platform - Analytics: Forecasting Engine Computes Simple…, Performs Simple Exponential Smoothing (SES) forecasting with 95% confidence…, Queries annual ED visit totals from SQLite and generates Simple Exponential…, run_ed_visits_forecasting(), Forecasting Submodule Re-exports the SES forecasting engine so `from…, get_hypothesis() (+40 more)

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

### Community 52 - "load_csv.py"
Cohesion: 0.23
Nodes (11): load_csv_datasets(), load_datasets(), main(), DataFrame, Path, Healthcare Analytics Platform - Analytical Database Loader Rebuilds…, Initializes the schema and loads every cleaned dataset. Returns rows per table., Returns the CSV to read for a dataset: the cleaned copy if present, else raw. (+3 more)

### Community 53 - "auth.py"
Cohesion: 0.17
Nodes (13): HTTPException, login(), Exception, post, Healthcare Analytics Platform - API Router: Auth, Issues a bearer token for the platform's single seeded account. Rate-limited to…, authenticate(), create_access_token() (+5 more)

### Community 54 - "test_dashboard_services.py"
Cohesion: 0.15
Nodes (11): detect_volume_recommendations(), InsightsService, Any, Healthcare Analytics Platform - Strategic Insights Service Layer Owns the…, Derives strategic recommendations from the seeded analytical tables., Profiles every clinical table and returns the top-ranked recommendations., Row counts for every table in the analytical database., Flags the triage level carrying the largest share of visits. (+3 more)

### Community 55 - ".list_datasets"
Cohesion: 0.24
Nodes (4): Registry entries, newest first. With `owner_id`, only that session's datasets…, Backward compatibility: an unscoped call still sees all rows., Rows persisted before scoping existed have owner_id NULL. A scoped caller must…, TestOwnerScopedListing

### Community 56 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, clean, dev, lint, start, test

### Community 57 - ".connection"
Cohesion: 0.16
Nodes (9): _preview(), DataFrame, Executes a multi-statement SQL DDL/DML script., Trims a SQL statement for logging so a large script doesn't flood the log., Checks out a pooled SQLite connection. The caller owns the connection and must…, Yields a pooled connection and returns it to the pool on exit. Unlike…, Executes a SELECT query and returns the results as a Pandas DataFrame., Executes an INSERT, UPDATE, or DELETE command and returns affected row count. (+1 more)

### Community 58 - "[2.0.0] — 2026-08-27"
Cohesion: 0.14
Nodes (13): [2.0.0] — 2026-08-27, [2.1.0] — 2026-09-02, Added, Added, Added, Changed, Changed, Changed (+5 more)

### Community 59 - "analytics/preprocessing/feature_engineering.py"
Cohesion: 0.26
Nodes (8): add_admission_status(), add_ctas_urgency_score(), encode_admission_flag(), encode_sex_category(), enrich_records(), extract_fiscal_year(), Any, TestFeatureEngineering

### Community 60 - "model_diagnostics_service.py"
Cohesion: 0.16
Nodes (16): _extract_pairs(), _is_missing(), ModelDiagnosticsService, Any, Model Diagnostics Service — overfitting / underfitting assessment on the…, True when a cleaned value represents absent data rather than a measurement., Coerce a cleaned-record value to float, rejecting imputation placeholders., Pull aligned numeric (feature, target) pairs, counting what was dropped and why. (+8 more)

### Community 61 - "ExcelDatasetService"
Cohesion: 0.21
Nodes (8): ExcelDatasetService, Any, DataFrame, Path, Thread-safe Excel dataset service for Healthcare Analytics Platform., Loads all six worksheets from the target Excel workbook using Pandas., Returns list of worksheet keys present in the workbook., Returns JSON-serializable rows and fields metadata for a selected worksheet.

### Community 62 - ".process_dataset"
Cohesion: 0.33
Nodes (6): extract_year_from_period(), Extracts starting fiscal year or calendar year as integer from period string., PreprocessingService, Any, Orchestrates cleaning, validation, and feature engineering for raw records., test_preprocessing_pipeline_builds_cleaned_dataset_summary()

### Community 63 - "App.tsx"
Cohesion: 0.31
Nodes (8): App(), getStagePercentage(), SectionType, STAGES, fetchAnalyzeDataset(), fetchPreloadedDatasets(), DatasetStats, buildSemanticModel()

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

### Community 68 - "main.py"
Cohesion: 0.23
Nodes (9): get_current_user(), Healthcare Analytics Platform - Auth dependency `get_current_user` is wired…, Healthcare Analytics Platform - Rate limiting for auth endpoints In-memory only…, decode_access_token(), Returns the subject claim, or None if the token is missing/invalid/expired., health_check(), get, root() (+1 more)

### Community 69 - "detect_outlier_recommendations"
Cohesion: 0.31
Nodes (4): detect_outlier_recommendations(), DataFrame, Flags numeric columns whose Tukey-fence outlier share exceeds the alert…, TestOutlierRecommendations

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
Cohesion: 0.29
Nodes (7): ArchitecturePipelineCard(), ArchitecturePipelineCardProps, AboutProject(), AboutProjectProps, ArchitecturePipelineOverview, ArchitectureStageStatus, fetchArchitecturePipelineOverview()

### Community 74 - "apiService.ts"
Cohesion: 0.11
Nodes (4): ExecutiveDashboard(), fetchDashboardKPIs(), fetchDashboardTrends(), AIAnalysisResult

### Community 75 - "DataTable.tsx"
Cohesion: 0.40
Nodes (4): DataTable(), DataTableProps, downloadCSV(), TableColumn

### Community 76 - "DescriptiveStatsTable.tsx"
Cohesion: 0.26
Nodes (10): DashboardHeader(), DashboardHeaderProps, calcMean(), calcMedian(), calcStddev(), DescriptiveStatsTable(), DescriptiveStatsTableProps, toNums() (+2 more)

### Community 77 - "polynomial_fit"
Cohesion: 0.29
Nodes (5): polynomial_fit(), Gaussian elimination with partial pivoting. Returns [] if singular., Least-squares polynomial coefficients in ascending order: [c0, c1, ...…, _solve(), TestPolynomialFit

### Community 78 - "fmtK"
Cohesion: 0.20
Nodes (8): BURDEN_RANKED_DATA, ResourceBurdenByCTAS(), ResourceBurdenByCTASProps, MAIN_PROBLEMS_DATA, TopMainProblems(), TopMainProblemsProps, VisitVolumeTrend(), fmtK()

### Community 79 - "transformations.py"
Cohesion: 0.19
Nodes (13): normalize_age_group(), Maps any observed age_group spelling onto a canonical band. Returns the…, aggregate_by_group(), apply_transformations(), normalize_fiscal_year(), Any, DataFrame, Healthcare Analytics Platform - Preprocessing: Transformations Module Provides… (+5 more)

### Community 80 - "test_user_dataset_isolation.py"
Cohesion: 0.22
Nodes (6): IsolationTestCase, Test Suite: Session-scoped isolation of user datasets. Two people using the…, An existing database predates the column. Adding it must not require a rebuild,…, H1-H5 must stay identical for everyone — that is the point of the seeded store., TestSchemaMigration, TestSeededCohortStillShared

### Community 81 - "map_columns"
Cohesion: 0.33
Nodes (3): map_columns(), Renames cleaned columns to schema names and drops analyst-only extras., TestColumnMapping

### Community 82 - "diagnose_fit"
Cohesion: 0.36
Nodes (3): diagnose_fit(), Classify a fitted model as Underfitting, Overfitting, or Good Fit. Underfitting…, TestDiagnoseFit

### Community 83 - "k_fold_scores"
Cohesion: 0.31
Nodes (5): _fold_slices(), k_fold_scores(), k-fold cross-validated R². A large std across folds means an unstable model., Contiguous (start, end) index ranges for k roughly equal folds., TestKFoldScores

### Community 84 - "train_test_split"
Cohesion: 0.39
Nodes (3): Shuffle-split paired samples into (x_train, y_train, x_test, y_test).…, train_test_split(), TestTrainTestSplit

### Community 92 - "UserDatasetService"
Cohesion: 0.29
Nodes (6): Any, Stores and retrieves user-cleaned datasets in isolated tables., Creates the registry, and migrates one that predates session scoping. ALTER…, Drops a persisted dataset and its registry row. False when the id is unknown,…, UserDatasetService, TestOwnerScopedAccess

### Community 93 - "ExecutiveKPIGrid.tsx"
Cohesion: 0.24
Nodes (7): ExecutiveKPIGrid(), ExecutiveKPIGridProps, H5SexDisposition(), H5SexDispositionProps, SEX_DISP_STACKED_DATA, DashboardKPIs, fmtPct()

### Community 95 - "align_to_table"
Cohesion: 0.33
Nodes (4): align_to_table(), Keeps only columns the target table actually declares, preserving table order., Test Suite: Cleaned-dataset loader column contract. Guards the mapping between…, TestAlignToTable

### Community 96 - "Architecture"
Cohesion: 0.25
Nodes (8): AI assistance (Gemini), Analytical layering, Architecture, Authentication, Concurrent users, Connection pooling & concurrency, Runtime topology, Three data paths

### Community 103 - "APIRouter"
Cohesion: 0.27
Nodes (3): APIRouter, dotenv, dotenv

### Community 106 - "database_manager.py"
Cohesion: 0.20
Nodes (7): Healthcare Analytics Platform - Database Manager Handles SQLite database…, get_engine(), Healthcare Analytics Platform - SQLAlchemy connection pools Only the pool is…, init_db(), Healthcare Analytics Platform - Database Schema Initializer Executes schema.sql…, Initializes SQLite database schema by executing schema.sql., Engine

### Community 108 - "schema.sql"
Cohesion: 0.25
Nodes (7): age_sex, ctas_triage, demographics, ed_visits, main_problems, metadata, visit_disposition

### Community 109 - "weighted_mean"
Cohesion: 0.16
Nodes (12): _clean_pairs(), Drops non-finite rows and non-positive weights, then coerces weights to counts., Frequency-weighted quantile: the value at which the cumulative weight first…, Frequency-weighted sample variance (Bessel-corrected over the expanded…, The value carrying the largest total frequency weight., weighted_mean(), weighted_mode(), weighted_quantile() (+4 more)

### Community 110 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 111 - "6. Professional Architecture Enhancements & Recommendations"
Cohesion: 0.33
Nodes (6): 6.1 Architectural Decoupling & Modularization, 6.2 Performance & Caching Strategy, 6.3 Deployment & Infrastructure Readiness, 6.4 Security & Governance Hardening, 6.5 Quality Assurance & Test Coverage Expansion, 6. Professional Architecture Enhancements & Recommendations

### Community 112 - "Docker Deployment"
Cohesion: 0.33
Nodes (6): Docker Deployment, Persisting uploads, Quick start (recommended — via Compose), Running the image directly (without Compose), Scope of the container, What the image contains

### Community 113 - "vite"
Cohesion: 0.67
Nodes (3): vite, vite, vite

### Community 116 - "4A. Runtime Data Flow — Cleaning → Visualization → Reports"
Cohesion: 0.40
Nodes (5): 4A. Runtime Data Flow — Cleaning → Visualization → Reports, Path A — Live session flow (dynamic, per user, in-memory), Path B — Seeded analytical store (static, shared, on disk), Session-scoped isolation, Why both exist

### Community 117 - "4C. Data Flow & Architecture Conformance Checks"
Cohesion: 0.40
Nodes (5): 4C. Data Flow & Architecture Conformance Checks, Current conformance status, Data flow checks (§4A), Layer boundary checks, Loader & schema contract checks (§4B)

### Community 118 - "H3UrgencyRegression.tsx"
Cohesion: 0.40
Nodes (3): H3UrgencyRegression(), H3UrgencyRegressionProps, SCATTER_BUBBLE_DATA

### Community 119 - "ResourceBurdenTrend.tsx"
Cohesion: 0.40
Nodes (3): ERBI_LONGITUDINAL_DATA, ResourceBurdenTrend(), ResourceBurdenTrendProps

### Community 120 - "Data"
Cohesion: 0.40
Nodes (5): Column contract, Data, Database provenance, Explorer Dataset cleaning, Sources

### Community 123 - "Model Fit Diagnostics"
Cohesion: 0.50
Nodes (4): A caution on polynomial degree, Model Fit Diagnostics, Running the diagnostics, What these datasets actually show

### Community 126 - "Codebase knowledge graph (graphify)"
Cohesion: 0.67
Nodes (3): Codebase knowledge graph (graphify), Everyday use, One-time setup

### Community 127 - "Installation"
Cohesion: 0.67
Nodes (3): Installation, Option 1 — Bootstrap script (recommended), Option 2 — Manual setup

### Community 130 - "ConsultantInsights.tsx"
Cohesion: 0.18
Nodes (11): ConsultantInsights(), ConsultantInsightsProps, DashboardInsightItem, EvidenceStrength, ExecutiveTakeaway, Priority, PriorityRecommendation, ScorecardItem (+3 more)

## Knowledge Gaps
- **266 isolated node(s):** `BaseModel`, `ed_visits`, `ctas_triage`, `visit_disposition`, `age_sex` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `xlsx`, `APIRouter`, `react`, `package.json`, `vite`, `express`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `dotenv` connect `APIRouter` to `dependencies`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `DatabaseManager` (e.g. with `TestDatabaseManager` and `IsolationTestCase`) actually correct?**
  _`DatabaseManager` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BaseModel`, `ed_visits`, `ctas_triage` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_model_validation.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._
- **Should `dataset_explorer_api.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0945945945945946 - nodes in this community are weakly interconnected._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._