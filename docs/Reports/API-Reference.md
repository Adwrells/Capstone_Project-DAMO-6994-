# API Reference — Healthcare Analytics Platform

**Protocol:** HTTP/1.1 REST  
**Default Base URL:** `http://localhost:3000/api` (via Gateway Proxy) / `http://localhost:8000/api` (FastAPI)  
**Content-Type:** `application/json`  

---

## 1. Gateway & System Endpoints

### `GET /api/health`
Returns system health status for both the Node Gateway and Python analytics backend.
* **Response:**
  ```json
  {
    "status": "ok"
  }
  ```

### `GET /api/architecture/pipeline`
Returns live multi-tier pipeline topology, node health, and latency statistics.
* **Response:**
  ```json
  {
    "status": "healthy",
    "nodes": [
      { "id": "raw", "name": "Raw Ingestion", "status": "active" },
      { "id": "sqlite", "name": "SQLite Repository", "status": "active" },
      { "id": "analytics", "name": "FastAPI Analytics", "status": "active" },
      { "id": "ui", "name": "React Frontend", "status": "active" }
    ]
  }
  ```

---

## 2. Dataset Management Endpoints

### `GET /api/datasets`
Returns list of registered SQLite tables available for exploration.
* **Response:**
  ```json
  {
    "success": true,
    "count": 6,
    "datasets": ["ed_visits", "ctas_triage", "visit_disposition", "age_sex", "main_problems", "demographics"]
  }
  ```

### `GET /api/datasets/{dataset_name}`
Returns paginated/limited rows for a specific table.
* **Query Parameters:** `limit` (default: 1000, max: 10000)

### `GET /api/preload-datasets`
Returns all preloaded master CIHI worksheets with column types, row counts, and sample records.

### `GET /api/sqlite-status`
Returns live SQLite file existence, file size (KB), journal mode (WAL), and per-table row counts.

---

## 3. Dataset Explorer Endpoints

### `GET /api/dataset/sheets`
Returns list of worksheet keys present in the master analytical workbook.

### `GET /api/dataset/{sheet}`
Returns tabular records and column metadata for a given worksheet.

### `GET /api/dataset/statistics/{sheet}`
Computes 5-number summary, mean, mode, standard deviation, and null counts for numeric columns.

### `GET /api/dataset/correlation/{sheet}`
Returns Pearson correlation matrix across numeric features.

### `GET /api/dataset/outliers/{sheet}`
Identifies data points exceeding 1.5× IQR thresholds.

### `GET /api/dataset/download/export`
Generates custom export in `.xlsx`, `.csv`, or `.zip` format for selected sheets.

---

## 4. Statistical Analysis & Hypothesis Testing

### `GET /api/statistics/summary`
Calculates descriptive statistics for a specified database table or arbitrary numeric array.

### `GET /api/statistics/h1`
Executes frequency-weighted Kruskal-Wallis H-Test and Dunn Post-Hoc across CTAS Acuity Levels.

### `GET /api/statistics/h2`
Executes frequency-weighted Mann-Whitney U Test comparing Admitted vs Discharged visit durations.

### `GET /api/statistics/h3`
Executes Weighted Least Squares (WLS) linear regression modeling Length of Stay from CTAS Urgency Score.

### `GET /api/statistics/h4`
Executes frequency-weighted Kruskal-Wallis Test across demographic Age Cohorts (`0-19`, `20-44`, `45-64`, `65+`).

### `GET /api/statistics/h5`
Executes Pearson $\chi^2$ Test of Independence on Sex $\times$ Disposition contingency matrix.

### `GET /api/statistics/trends`
Executes Mann-Kendall monotonic trend test, Simple Exponential Smoothing forecast, and ERBI time-series.

### `GET /api/statistics/dashboard`
Returns consolidated synthesis of all 5 hypothesis test verdicts and evidence ratings.

### `GET /api/statistics/methods`
Returns technical mathematical specifications and literature citations for all analytical methods.

---

## 5. Executive Dashboard Endpoints

### `GET /api/dashboard/kpis`
Returns macro executive KPIs (Total Visits, Median Reported LOS, Overall Admission Rate, Overall ERBI, Hypothesis Count).

### `GET /api/dashboard/trends`
Returns longitudinal annual and monthly visit volume and length of stay time-series.

### `GET /api/dashboard/summary`
Returns comprehensive dashboard payload consolidating KPIs, distributions, and problem rankings.

---

## 6. Strategic Insights & Reports

### `GET /api/insights/strategic`
Returns Stage 6 Strategic Decision Support insights, bottleneck analyses, and operational recommendations.

### `GET /api/reports/export-summary`
Returns metadata and summaries for generating executive PDF and CSV report deliverables.

---

## 7. AI Assistant Endpoints (Node.js Gateway)

### `POST /api/smart-query`
Converts natural language queries (e.g. "show emergency visits longer than 5 hours") into structured table filters.

### `POST /api/assistant/chart-builder`
Generates recommended chart type, axis mappings, aggregations, and colors from a user prompt.

### `POST /api/analyze-dataset`
Performs comprehensive automated executive analysis and recommendation generation using Google Gemini.
