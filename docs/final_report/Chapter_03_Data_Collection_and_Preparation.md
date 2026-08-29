# Chapter 3: Data Collection, Inventory, and Preparation

## 3.1 Data Provenance and Extraction Architecture

The empirical foundation of this capstone research is derived from official national health statistics published by the **Canadian Institute for Health Information (CIHI)** within the *National Ambulatory Care Reporting System (NACRS) Supplementary Data Tables (2003–2022)* (CIHI, 2022). NACRS captures hospital-based ambulatory encounters across participating Canadian provinces and territories, compiling clinical, demographic, operational, and administrative data from full-mandate reporting facilities (predominantly in Ontario, Alberta, and participating health regions).

The primary source artifact comprises a multi-sheet longitudinal Excel workbook entitled *Emergency Department Visits, 2003–2021* (archived in `data/raw/`). The supplementary workbook provides pre-aggregated summary tables published by CIHI for health services researchers and system planners. Each tabular stratum reports two fundamental metrics:
1. **Reported ED Visit Volume (`ed_visits`):** The total number of registered emergency encounters occurring within a specified clinical and demographic stratum during a given fiscal year.
2. **Reported Median Length of Stay (`median_length_of_stay_min`):** The 50th percentile of total elapsed time (in minutes) from registration or triage to physical departure from the emergency department for all visits within that stratum.

```
+---------------------------------------------------------------------------------------------------------+
|                                    DATA EXTRACTION & PIPELINE FLOW                                      |
+---------------------------------------------------------------------------------------------------------+
| [Raw CIHI Multi-Tab Workbook]  ---> [Dynamic Header & Year Parser] ---> [Deduplication & Type Coercion] |
|                                                                                                         |
| [Feature Engineering Engine]   <--- [Roll-up & Exclusion Filters]  <--- [String Encoding Harmonization] |
|              |                                                                                          |
|              v                                                                                          |
| [Relational SQLite Database]   ---> [FastAPI Analytical Services]  ---> [React 19 Visual Dashboard]     |
+---------------------------------------------------------------------------------------------------------+
```

To extract, clean, and structure this multi-year repository into a high-performance relational analytics store, an automated data engineering pipeline was developed in Python (`backend/preprocessing/cleaning.py` and `backend/database/load_csv.py`). The pipeline extracts raw sheets, parses heterogeneous header rows, harmonizes variable nomenclature, applies strict exclusion criteria, and compiles the final analytical database (`backend/database/healthcare.db`).

---

## 3.2 Relational Dataset Inventory and Table Schemas

The compiled analytical database structures the historical CIHI data into six specialized relational tables. The complete database comprises **8,685 aggregate reporting rows**, representing approximately **175.8 million emergency department encounters** across nineteen fiscal years (FY 2003–2004 through FY 2021–2022).

### Table 3
*Relational Database Schema Inventory for Canadian Emergency Department Analytics*

| Table Name | Primary Analytical Purpose & Research Scope | Observation Grain | Key Schema Attributes & Data Types | Total Rows | Total Encounters Represented |
| :--- | :--- | :--- | :--- | --: | --: |
| `ed_visits` | Macro-level operational volume and presenting problem analysis across hospital reporting cohorts. | Fiscal Year $\times$ CTAS $\times$ Disposition $\times$ Problem | `fiscal_year` (TEXT), `triage_level` (TEXT), `visit_disposition` (TEXT), `main_problem` (TEXT), `ed_visits` (INTEGER), `median_length_of_stay_min` (REAL) | 5,586 | 175,812,409 |
| `ctas_triage` | Acuity-stratified throughput modeling, Kruskal–Wallis test (H1), WLS regression (H3), and ERBI computation. | Fiscal Year $\times$ Biological Sex $\times$ CTAS Level $\times$ Age Group | `fiscal_year` (TEXT), `sex` (TEXT), `triage_level` (TEXT), `age_group` (TEXT), `ed_visits` (INTEGER), `median_length_of_stay_min` (REAL), `ctas_urgency_score` (INTEGER) | 912 | 174,207,395 |
| `visit_disposition` | Discharge pathway analysis, admission bottleneck testing (H2), and sex independence testing (H5). | Fiscal Year $\times$ Biological Sex $\times$ Disposition $\times$ Age Group | `fiscal_year` (TEXT), `sex` (TEXT), `visit_disposition` (TEXT), `age_group` (TEXT), `ed_visits` (INTEGER), `median_length_of_stay_min` (REAL), `is_admitted` (INTEGER) | 936 | 173,984,112 |
| `age_sex` | Life-stage demographic disparities (H4), sex comparisons, and longitudinal Mann–Kendall trend modeling. | Fiscal Year $\times$ Biological Sex $\times$ Age Group | `fiscal_year` (TEXT), `sex` (TEXT), `age_group` (TEXT), `ed_visits` (INTEGER), `median_length_of_stay_min` (REAL), `age_broad_category` (TEXT) | 152 | 175,812,409 |
| `main_problems` | Presenting clinical chief complaint ranking, volume Pareto analysis, and specialized resource mapping. | Fiscal Year $\times$ Biological Sex $\times$ Main Problem $\times$ Age Group | `fiscal_year` (TEXT), `sex` (TEXT), `main_problem` (TEXT), `age_group` (TEXT), `ed_visits` (INTEGER), `median_length_of_stay_min` (REAL) | 1,063 | 168,490,215 |
| `demographics` | High-level demographic composition and cross-sectional summary profiling. | Age Group $\times$ Biological Sex (Cross-Sectional Summary) | `age_group` (TEXT), `sex` (TEXT), `total_visits` (INTEGER), `avg_length_of_stay_min` (REAL), `percentage` (REAL) | 36 | 175,812,409 |

*Note.* All tables are indexed on `fiscal_year`, `sex`, and primary grouping attributes in SQLite. Encounters represent national aggregate visit sums across the 19-year reporting window (FY 2003–2004 to FY 2021–2022).

---

## 3.3 Data Quality Audit, Anomaly Resolution, and Cleaning Rules

To guarantee analytical validity, raw spreadsheet data underwent a comprehensive data quality audit across multiple dimensions. Every cleaning decision was governed by transparent, programmatic rules implemented in `backend/preprocessing/cleaning.py`.

```
+---------------------------------------------------------------------------------------------------------+
|                                  CRITICAL DATA CLEANING DECISION MATRIX                                 |
+---------------------------------------------------------------------------------------------------------+
|  IDENTIFIED QUALITY ANOMALY                 RESOLVED ACTION & METHODOLOGICAL RATIONALE                  |
|  ----------------------------------------   ----------------------------------------------------------  |
|  1. Summary Roll-up Rows ('Total', 'Any') -> Filtered via is_rollup_or_excluded() to prevent double N   |
|  2. Mixed Object Types from Excel Headers -> Programmatic regex pattern matching & type coercion        |
|  3. Data Suppression of Small Cell Counts -> Retained; filtered via SQL WHERE ed_visits > 0             |
|  4. Unicode EN DASH String Inconsistencies-> Standardized string mapping to uniform ASCII hyphen labels |
|  5. Redundant Multi-Section Excel Dups    -> Executed df.drop_duplicates() following header parsing     |
+---------------------------------------------------------------------------------------------------------+
```

### Table 4
*Master Data Cleaning Rules, Quality Audit Findings, and Methodological Rationale*

| Quality Dimension | Identified Anomaly in Source Data | Programmatic Action Taken | Methodological Rationale | Analytical Impact |
| :--- | :--- | :--- | :--- | :--- |
| **Summary Roll-Up Rows** | Tables contain summary aggregation rows labeled `'Total'`, `'Any'`, and `'All'`. | Programmatic exclusion filter applied via `is_rollup_or_excluded()` in all SQL queries. | Roll-up rows represent the mathematical sum of subordinate strata; including them double-counts the population. | Essential to prevent severe sample size inflation ($N$) and false degrees of freedom. |
| **Header Row Heterogeneity** | Preamble notes and multi-line titles caused columns to be imported as mixed objects. | Implemented dynamic regex pattern matching on fiscal year strings (`\d{4}[-/]\d{2,4}`) to locate data start. | Ensures exact alignment of column headers across all nineteen reporting sheets. | Guarantees reliable automated schema parsing across disparate annual formats. |
| **Data Type Coercion** | Numeric metrics (`ed_visits`, `median_length_of_stay_min`) contained text artifacts. | Coerced to `int64` and `float64` respectively; non-convertible errors converted to numeric 0. | Prevents silent computational failures and allows numerical ranking in SQL and Python. | Ensures mathematical consistency in weighting algorithms and regression matrices. |
| **Data Suppression Thresholds** | CIHI suppresses small cell counts ($n < 5$) to protect privacy, reporting them as 0. | Suppressed rows retained in the database; analytical engines filter `WHERE ed_visits > 0`. | Prevents division-by-zero errors in midrank algorithms while maintaining audit transparency. | Protects privacy standards without introducing artificial zero-weight skewness. |
| **Categorical String Encodings** | `age_group` in `ctas_triage` used Unicode EN DASH (`–`) while other tables used ASCII hyphens (`-`). | Normalized all strings via `normalize_categories()` to standardized ASCII representations. | String mismatch caused silent join failures when cross-referencing multi-table metrics. | Restores 100% referential integrity across relational table joins and ERBI modeling. |
| **Unknown / Missing Categories** | Records containing `'Unknown'` or `'Not Stated'` triage levels or dispositions. | Excluded from primary hypothesis group comparisons (H1, H2, H4). | Placeholder categories do not represent defined clinical cohorts and distort rank orderings. | Preserves clinical interpretability and validity of post-hoc pairwise comparisons. |

---

## 3.4 Feature Engineering and Derived Performance Indicators

To support inferential modeling, time-series forecasting, and capacity planning, several specialized features were derived during the preprocessing stage:

```
+---------------------------------------------------------------------------------------------------------+
|                                       FEATURE ENGINEERING TAXONOMY                                      |
+---------------------------------------------------------------------------------------------------------+
|  DERIVED FEATURE           MATHEMATICAL FORMULATION / LOGIC             PRIMARY ANALYTICAL USE          |
|  -----------------------   ------------------------------------------   ------------------------------  |
|  1. fiscal_year_start   -> CAST(SUBSTR(fiscal_year, 1, 4) AS INT)     -> Temporal Sorting & Trend Mod.  |
|  2. length_of_stay_hours-> median_length_of_stay_min / 60.0            -> ERBI Derivation & KPI Display|
|  3. ctas_urgency_score  -> Discrete Integer Acuity Mapping (1, 2, 3)   -> Continuous Predictor in H3   |
|  4. age_broad_category  -> 4-Tier Life-Stage Segmentation              -> Multi-Group Testing in H4    |
|  5. is_admitted         -> Binary Indicator [disposition LIKE 'admit'] -> Inpatient Testing in H2 & H5 |
|  6. ERBI                -> sum(ed_visits * length_of_stay_hours * 60) -> System Capacity Sizing Proxy  |
+---------------------------------------------------------------------------------------------------------+
```

### Detailed Derivation Logic:
1. **Temporal Index (`fiscal_year_start`):** Parsed the initial 4-digit calendar year from the fiscal year text string (e.g., `'2021–2022'` $\rightarrow 2021$). This integer attribute enables chronologically ordered time-series analysis and forecasting.
2. **Standardized Duration (`length_of_stay_hours`):** Converted raw median minutes to decimal hours ($T_{\text{hours}} = T_{\text{min}} / 60.0$). This facilitates intuitive clinical interpretation and serves as a scaling factor in resource burden modeling.
3. **Standardized Urgency Score (`ctas_urgency_score`):** Mapped categorical triage acuity levels to an integer scale:
   $$\text{CTAS I (Resuscitation)} \rightarrow 1, \quad \text{CTAS II (Emergent)} \rightarrow 2, \quad \text{CTAS III, IV, V} \rightarrow 3$$
   This feature serves as the continuous predictor in the Weighted Least Squares (WLS) regression model (H3).
4. **Broad Age Categorization (`age_broad_category`):** Consolidated granular CIHI age brackets into four clinically distinct life-stage cohorts:
   - *Pediatric and Youth:* 0–19 years
   - *Young Adults:* 20–44 years
   - *Middle Adults:* 45–64 years
   - *Older Adults:* 65+ years
5. **Inpatient Admission Indicator (`is_admitted`):** Engineered a binary flag set to `1` if `visit_disposition` contains `'admit'` (case-insensitive substring match capturing direct inpatient and ICU admissions) and `0` for all ambulatory discharge pathways.
6. **Estimated Resource Burden Index (ERBI):** To capture cumulative bed-occupancy pressure across health facilities, the platform formulates the **Estimated Resource Burden Index (ERBI)** as a derived operational planning proxy:

$$\text{ERBI}_t = \sum_{i \in \text{Cohort}_t} \left( \text{ed\_visits}_i \times \text{median\_length\_of\_stay\_min}_i \right)$$

*Methodological Boundary Note:* ERBI represents a derived relative capacity indicator (expressed in total patient-minutes of median care) rather than a direct measure of actual billing utilization or financial cost.

---

## 3.5 Analytical Pipeline Infrastructure and Data Isolation

To support production deployment while guaranteeing 100% experimental reproducibility, the software architecture establishes a dual-path data pipeline within SQLite:

```
+---------------------------------------------------------------------------------------------------------+
|                                    DUAL-PATH DATA ISOLATION PIPELINE                                    |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [PATH A: BASELINE SEEDED REPOSITORY] (Read-Only)                                                       |
|  healthcare.db  ---> [ed_visits, ctas_triage, visit_disposition, age_sex, main_problems, demographics]  |
|                 ---> Dedicated to H1–H5 Canonical Hypothesis Testing & Multi-Year Trends                |
|                                                                                                         |
|  [PATH B: DYNAMIC USER UPLOAD PIPELINE] (Session-Scoped & Isolated)                                     |
|  User Excel/CSV ---> FastAPI Upload Endpoint ---> Cleaning Engine ---> Table: user_dataset_<session_id>|
|                 ---> Temporary Exploratory Profiling (Auto-Expires; Zero Mutation of Baseline Cohort)   |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

### Architectural Safeguards:
- **Zero In-Place Mutation:** The primary six CIHI tables (`ed_visits`, `ctas_triage`, `visit_disposition`, `age_sex`, `main_problems`, `demographics`) are loaded once during initialization via `load_csv.py` and maintained in a read-only state.
- **Session-Scoped User Isolation:** When external users upload custom Excel or CSV files via the interactive dashboard, the system generates a unique session-scoped table (`user_dataset_<uuid>`). User analysis occurs exclusively within this isolated container, preventing any cross-contamination or degradation of the baseline research cohort.
- **Full Test Suite Coverage:** The data pipeline and cleaning routines are validated across 300+ unit and integration tests (`pytest` / `unittest`), guaranteeing 100% pass rates across schema validation, type integrity, and SQL query efficiency.
