# Data Provenance & Quality Report — Healthcare Analytics Platform

**Project:** Operational & Clinical Modelling of Emergency Department Wait Times  
**Course:** DAMO-6994 Master's Capstone Project  
**Author:** Bharath Paramasivan  

---

## 1. Data Ingestion Architecture & Provenance

All clinical analytical data utilized by the platform originates from the Canadian Institute for Health Information (CIHI) National Ambulatory Care Reporting System (NACRS).

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             DATA PROVENANCE PIPELINE                             │
│                                                                                  │
│  [1. RAW CIHI EXCEL WORKBOOKS]                                                   │
│      data/raw/                                                                   │
│      • ED_Visits_and_Lengths_of_Stay_2017_2022.xlsx                              │
│      • Historical_ED_Statistics_2003_2022.xlsx                                   │
│      • Latest_ED_Statistics_2024_2026.xlsx                                       │
│                         │                                                        │
│                         ▼ (Cleaning, Normalization & Feature Engineering)        │
│  [2. JUPYTER CLEANING PIPELINE]                                                  │
│      data/Explorer Dataset/*.ipynb                                               │
│      • Deduplication, Missing Imputation, Schema Standardization                 │
│                         │                                                        │
│                         ▼ (Consolidation into Master Analytical Workbook)         │
│  [3. MASTER CLEANED WORKBOOK]                                                    │
│      data/cleaned dataset/Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx   │
│      Sheets: ED_Visits, CTAS_Triage, Visit_Disposition, Age_Sex,                 │
│              Main_Problems, Demographics                                         │
│                         │                                                        │
│                         ▼ (Automated Ingestion via backend/database/load_csv.py) │
│  [4. RELATIONAL SQLITE DATABASE (Single Source of Truth)]                        │
│      backend/database/healthcare.db                                              │
│      • WAL Mode • Schema-Enforced Tables • Indexed Primary/Foreign Keys          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dataset Schemas & Table Mapping Contract

The cleaning layer emits analyst-friendly column names (`median_los_minutes`, `population_category`), while `schema.sql` enforces relational database conventions (`median_length_of_stay_min`, `age_broad_category`).

The exact contract is governed by `backend/database/load_csv.py`:

| Cleaned Column (Analyst View) | SQLite Column (Database View) | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `median_los_minutes` | `median_length_of_stay_min` | `REAL` | Median emergency department duration (minutes) |
| `median_los_hours` | `length_of_stay_hours` | `REAL` | Derived length of stay in fractional hours |
| `population_category` | `age_broad_category` | `TEXT` | Demographic age classification (`0-19`, `20-44`, `45-64`, `65+`) |
| `admission_flag` | `is_admitted` | `INTEGER` | Binary indicator (1 = Admitted to Inpatient, 0 = Discharged) |
| `visit_percentage` | `percentage` | `REAL` | Proportion of total provincial ED volume (%) |
| `ed_visits` | `ed_visits` | `INTEGER` | Frequency weighting visit count |

---

## 3. Data Hygiene & Quality Validation Framework

The platform assesses dataset hygiene across **5 core dimensions**:

### 3.1 Completeness (Target: >98%)
* Null ratios are calculated per column.
* Critical identifiers (`fiscal_year`, `ed_visits`, `median_length_of_stay_min`) require 100% completeness; rows with non-positive visit counts or negative LOS values are purged.

### 3.2 Consistency & Standardization
* Fiscal years standardized to canonical `YYYY-YYYY` format (e.g. `2020-2021`).
* CTAS levels normalized to the standard 5-point scale:
  - `CTAS I - Resuscitation` (Score = 5)
  - `CTAS II - Emergent` (Score = 4)
  - `CTAS III - Urgent` (Score = 3)
  - `Less urgent` (Score = 2)
  - `Non-urgent` (Score = 1)
* Rollup totals (`Total`, `Grand Total`, `All Visits`, `Unknown`) are flagged and excluded from group variance hypothesis testing.

### 3.3 Validity & Outlier Control
* Length of stay values verified against clinical plausibility bounds (0 < LOS ≤ 72 hours).
* Interquartile Range (IQR) and Z-score outlier filtering prevents administrative recording errors from distorting statistical models.

### 3.4 Uniqueness
* Composite unique keys enforced across `(fiscal_year, jurisdiction, demographic_group, ctas_level)`.

### 3.5 Temporal Coverage
* Continuous longitudinal coverage spanning **2003 through 2022** across Canadian provincial reporting jurisdictions.

---

## 4. Reproducible Database Ingestion

To reproduce the database from clean source files at any time:

```bash
# Rebuild canonical SQLite database
python -m backend.database.load_csv

# Verify database without writing
python -m backend.database.load_csv --dry-run
```
