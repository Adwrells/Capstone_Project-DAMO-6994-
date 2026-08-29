# Chapter 7: Data Visualization and Decision Support Systems

## 7.1 Architecture of the Interactive Decision-Support Dashboard

To translate complex statistical outputs, regression equations, and longitudinal forecasts into intuitive, actionable operational insights for hospital leadership, this capstone project engineered a full-stack, enterprise-grade clinical decision-support platform (Few, 2012; Munzner, 2014). The platform integrates a modern web interface with a high-performance Python analytics engine, reading from the reproducible relational SQLite database.

```
+---------------------------------------------------------------------------------------------------------+
|                                  FULL-STACK PLATFORM SYSTEM ARCHITECTURE                                |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [PRESENTATION LAYER] (Port 3000)                                                                       |
|  React 19 + TypeScript + Vite + Tailwind CSS + Recharts Responsive Visual Engine                        |
|  |-- Executive Overview: High-level KPI cards, ERBI telemetry, macro longitudinal volume charts         |
|  |-- Hypothesis Testing Hub: Interactive statistical solvers, post-hoc matrices, p-value telemetry      |
|  |-- Cohort Explorer: Acuity, admission status, age-group, and chief complaint drill-down filters       |
|  |-- Forecasting Studio: 5-year SES projections with dynamic confidence interval controls              |
|                                                                                                         |
|  [MIDDLEWARE & PROXY] (Node.js Express - server.ts)                                                     |
|  Handles static client bundle delivery, secure Excel/CSV upload parsing, and API gateway routing        |
|                                                                                                         |
|  [ANALYTICAL BACKEND SERVICES] (Port 8000 - FastAPI / Python 3.10+)                                     |
|  31 Specialized REST Endpoints:                                                                         |
|  |-- /api/hypotheses/h1-h5: Frequency-weighted Kruskal-Wallis, Mann-Whitney U, WLS, Chi-Square solvers    |
|  |-- /api/trends: Mann-Kendall monotonic trend engine and Sen's slope calculator                       |
|  |-- /api/forecasting: Simple Exponential Smoothing (SES) time-series forecasting service               |
|  |-- /api/resource-burden: Real-time ERBI capacity index aggregation service                             |
|                                                                                                         |
|  [PERSISTENCE LAYER] (SQLite - healthcare.db)                                                           |
|  6 Relational Analytical Tables (8,685 rows; 175.8M visits) + Isolated Session Containers               |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

*Figure 7* \
*Full Analytics Platform System Architecture: React 19 Frontend and FastAPI Backend*

### Analytical Highlights of Architecture (Figure 7):
The decoupled microservices architecture ensures instantaneous user responsiveness (<100 ms query latency) while maintaining strict methodological isolation between the baseline 19-year CIHI research cohort and ad-hoc user data uploads.

---

## 7.2 Core Analytical Visualizations and Visual Interpretation

In accordance with APA 7th edition formatting standards, all visualizations are explicitly numbered, presented with formal descriptive titles below each graphic, and followed immediately by substantive analytical interpretations linking the visual trends to operational hospital governance.

---

### 7.2.1 Acuity-Stratified Length of Stay Distribution (H1)

```
Median LOS (Minutes)
 300 min |                        * CTAS II (288 min / 4.80h) [Peak Duration]
 250 min |
 200 min | * CTAS I (198 min)                 * CTAS III (210 min / 3.50h)
 150 min |
 100 min |                                                * CTAS IV (126 min / 2.10h)
  50 min |                                                             * CTAS V (80 min / 1.33h)
   0 min +--------------------------------------------------------------------------------------
             CTAS I (Resusc.)    CTAS II (Emergent)   CTAS III (Urgent)   CTAS IV (Less)   CTAS V (Non)
```

*Figure 2* \
*Distribution of Reported Median Emergency Department Length of Stay Across CTAS Acuity Tiers (H1)*

### Analytical Interpretation for Figure 2:
Figure 2 visually highlights the non-linear relationship between triage acuity and emergency department stay duration ($H = 126,319,368.24$, $p < .0001$, $\varepsilon^2 = 0.7251$). 

CTAS II (Emergent) presentations represent the single highest operational duration peak at **288.0 minutes (4.80 hours)**. This peak occurs because CTAS II patients undergo extensive bedside diagnostic workups (CT imaging, laboratory panels, specialist consultations) and frequently wait for inpatient telemetry beds. 

In sharp contrast, CTAS I (Resuscitation) visits resolve significantly faster (median **198.0 minutes / 3.30 hours**) due to immediate ICU admission or surgical transfer protocols. 

CTAS IV (Less Urgent, **126.0 minutes**) and CTAS V (Non-Urgent, **80.0 minutes**) demonstrate short, predictable durations, confirming that these cohorts can be diverted into dedicated rapid assessment streams without occupying acute monitored stretchers.

---

### 7.2.2 The Inpatient Admission Duration Divide (H2)

```
Median LOS (Hours)
 12 hrs |                                   * Inpatient Admitted (10.60 Hours / 636 min)
 10 hrs |                                   |
  8 hrs |                                   |  <--- [8.10-Hour Inpatient Boarding Gap]
  6 hrs |                                   |
  4 hrs |                                   |
  2 hrs | * Non-Admitted (2.50 Hours / 150m)|
  0 hrs +-------------------------------------------------------------------------------
                 Non-Admitted Outpatients               Inpatient Admitted Cohort
```

*Figure 3* \
*Comparative Median Length of Stay Distribution: Inpatient Admitted vs. Non-Admitted Visits (H2)*

### Analytical Interpretation for Figure 3:
Figure 3 illustrates the starkest operational bottleneck in the Canadian emergency healthcare system ($U = 2.69 \times 10^{12}$, $p < .0001$, $r_b = 0.998$). 

While non-admitted outpatients (88.5% of visits) exit the emergency department within a weighted median of **2.50 hours (150.0 minutes)**, admitted patients (11.5% of visits) remain in the emergency department for a median of **10.60 hours (636.0 minutes)**. 

The resulting **8.10-hour duration divide** is primarily driven by **inpatient bed block**. Admitted patients have completed their initial emergency medical workup by hour 3 or 4, spending the remaining 6 to 7 hours boarding on emergency stretchers while waiting for upstairs inpatient beds to become available.

---

### 7.2.3 Predictive Acuity Regression Slope (H3)

```
Median LOS (Minutes)
 400 min | * (Observed CTAS I / Intercept: 404.14 min)
 350 min |   \
 300 min |     * (Observed CTAS II)
 250 min |       \
 200 min |         \   Slope β1 = -115.72 min / level (R² = 0.3162, p < .0001)
 150 min |           \
 100 min |             * (Observed CTAS III, IV, V)
   0 min +------------------------------------------------------------------------------
             Score 1 (CTAS I)            Score 2 (CTAS II)          Score 3 (CTAS III-V)
```

*Figure 4* \
*Weighted Least Squares (WLS) Regression Fit: CTAS Urgency Score vs. Reported Median Length of Stay (H3)*

### Analytical Interpretation for Figure 4:
Figure 4 displays the empirical regression line estimated by the Weighted Least Squares model ($\beta_1 = -115.72$, $SE = 6.18$, $t = -18.72$, $p < .0001$, $R^2 = 0.3162$). 

The model demonstrates a strong, statistically significant inverse linear relationship between clinical urgency score and emergency duration. For each unit increment in the numerical urgency score (representing a transition to lower clinical acuity), median emergency department stay decreases by **115.72 minutes ($\approx 1.93$ hours)**. 

This model provides hospital administrators with a robust, quantitative tool for forecasting aggregate bed-hour demand based on daily triage intake distributions.

---

## 7.3 Decision-Maker Interaction Modes and Self-Service Exploration

To serve diverse organizational stakeholders across the healthcare enterprise, the interactive dashboard incorporates three specialized user interaction modes:

```
+---------------------------------------------------------------------------------------------------------+
|                                    DASHBOARD USER INTERACTION MODES                                     |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  1. EXECUTIVE HEALTH LEADERSHIP MODE:                                                                   |
|     - Real-time telemetry cards: Total Annual Encounters, Weighted Median LOS, Admission Ratios        |
|     - Longitudinal ERBI Capacity Gauge: Tracking multi-year bed-occupancy stress against thresholds     |
|     - One-click executive PDF export generating genuine vector reports for board meetings               |
|                                                                                                         |
|  2. CLINICAL OPERATIONS & BED MANAGEMENT MODE:                                                          |
|     - Acuity Flow Matrix: Filtering CTAS I–V volumes and isolating peak boarding hours                  |
|     - Chief Complaint Drill-Down: Pareto ranking of high-stay clinical presentations                    |
|     - Discharge Delay Alarm: Highlighting units where admission wait times exceed the 8-hour benchmark  |
|                                                                                                         |
|  3. DATA SCIENTIST & HEALTH ANALYST MODE:                                                               |
|     - Dynamic Non-Parametric Solver Hub: Real-time re-execution of H1–H5 hypothesis tests                |
|     - Time-Series Forecasting Sandbox: Adjusting SES smoothing parameters (α) and prediction horizons   |
|     - Session-Isolated Upload Portal: Uploading custom regional Excel/CSV datasets for ad-hoc profiling |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

By providing tailored analytical depths, the platform bridges the gap between high-level hospital strategic governance and granular clinical operations research.
