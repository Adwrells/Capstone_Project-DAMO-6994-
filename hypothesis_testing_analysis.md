# Hypothesis Testing & Statistical Analysis
**DAMO-699 Capstone · H1–H5 · Weighted non-parametric tests · WLS regression · Mann-Kendall + SES · All results computed from SQLite-loaded data at the aggregate level.**

---

## Pipeline Telemetry
*Dynamic weighted statistical solvers · SQLite-loaded cohort · Aggregate-level analysis.*

| Metric | Value |
| :--- | :--- |
| **Status** | `COMPLETED` |
| **Runtime** | `1160 ms` |
| **Hypotheses** | `H1–H5 ✓` |
| **Solver Convergence** | `100%` |

---

## H1: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size

### Reported Median ED LOS Across CTAS Triage Levels
**Decision:** `Reject Null Hypothesis`

> **Research Question:**  
> *"How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?"*

#### Test Statistics & Metrics
- **H Statistic:** `455.696`
- **p-value:** `1.0000`
- **Effect Size ($\varepsilon^2$):** `0.0780`
- **Significant Pairwise Pairs:** `3 / 3`

#### Significant Pairwise Comparisons (Bonferroni-Adjusted)
- **Resuscitation vs. Emergent:** $p_{\text{adj}} < 0.0001$
- **Resuscitation vs. Urgent:** $p_{\text{adj}} < 0.0001$
- **Emergent vs. Urgent:** $p_{\text{adj}} < 0.0001$

#### Reported Median ED LOS by CTAS Level — Summary & Box Plot Distribution
- **Resuscitation:** Median = `3.30 hrs` ($n = 969$)
- **Emergent:** Median = `3.75 hrs` ($n = 1018$)
- **Urgent:** Median = `2.80 hrs` ($n = 2923$)
*(Box: IQR Q1–Q3 · Centre line: Median · Whiskers: 1.5×IQR)*

### Technical Details & Methodology
- **Statistical Finding:**  
  The weighted Kruskal–Wallis test yields $H = 455.696$ ($\text{df} = 2$, $p = 1.0000$). Effect size $\varepsilon^2 = 0.0780$ characterises the proportion of rank-variance explained by CTAS grouping. 3 of 3 pairwise comparisons remain significant after Bonferroni correction.
- **Clinical Workflow Context:**  
  Aggregate ED visit records exhibit a systematic gradient in reported median LOS across CTAS triage categories. Higher-acuity triage groups are associated with longer reported median stays at the aggregate level, consistent with the clinical intensity those categories represent across the full dataset.
- **Operational Implication:**  
  Triage-stratified aggregate LOS estimates support resource allocation modelling. Capacity planning frameworks can apply CTAS-specific LOS benchmarks to project hourly ED occupancy demand and align staffing levels with expected case-mix distributions across fiscal periods.

---

## H2: Weighted Mann–Whitney U Test (Two-Sided) · Rank-Biserial Correlation

### Reported Median ED LOS: Pandemic vs. Pre-Pandemic Fiscal Years
**Decision:** `Fail to Reject Null Hypothesis`

> **Research Question:**  
> *"Did reported median emergency department length of stay differ between the pandemic-affected fiscal year (2020–2021) and the preceding fiscal years?"*

#### Test Statistics & Metrics
- **U Statistic:** `361293.5`
- **p-value (two-sided):** `0.1395`
- **Effect Size ($r_b$):** `0.0412`
- **Median Difference:** `-0.100 hrs`

#### Reported Median LOS — Pandemic vs. Pre-Pandemic Distribution
- **Pre-Pandemic:** Median = `3.40 hrs` ($n = 608$)
- **FY 2020–21:** Median = `3.30 hrs` ($n = 289$)
*(Box: IQR Q1–Q3 · Centre line: Median · Whiskers: 1.5×IQR)*

### Technical Details & Methodology
- **Statistical Finding:**  
  Weighted Mann–Whitney $U = 361293.5$ ($p = 0.1395$, $r_b = 0.0412$, median difference = $-0.100\text{ hrs}$). Evidence is insufficient to reject the null hypothesis of equal rank-distributions at $\alpha = 0.05$. No directional assumption was made a priori.
- **Clinical Workflow Context:**  
  The comparison is conducted at the aggregate fiscal-year record level. Any observed difference in rank-distribution reflects changes in aggregate reporting patterns across the two time periods, not changes in individual-level care experiences. Both periods are compared as whole fiscal-year aggregate units.
- **Operational Implication:**  
  Aggregate LOS reporting differences across fiscal periods can inform retrospective capacity review and prospective contingency modelling. Understanding whether specific fiscal periods were associated with systematically different aggregate LOS distributions supports surge-preparedness planning without making assumptions about causal mechanisms.

---

## H3: Weighted Least Squares (WLS) Regression · Visit-Count Weights · Forest Plot

### Weighted Least Squares Regression: Age Group Association with Reported Median ED LOS
**Decision:** `Reject Null Hypothesis`

> **Research Question:**  
> *"Does reported median emergency department length of stay differ across age groups?"*

#### Model Summary
- **Adjusted $R^2$:** `0.8800`
- **Intercept ($\beta_0$):** `8.921`
- **Encoded Predictors:** `12`
- **Aggregate Observations:** `13`

#### WLS Coefficient Estimates ($\beta$) with 95% CI

| Predictor (vs. Reference) | Coefficient ($\beta$) | Std. Error | 95% CI Lower | 95% CI Upper | p-value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CTAS: CTAS II - Emergent** | `1.405` | `0.271` | `0.873` | `1.936` | `< 0.0001` |
| **CTAS: CTAS III - Urgent** | `0.454` | `0.268` | `-0.071` | `0.979` | `0.0902` |
| **CTAS: Less urgent** | `-0.722` | `0.269` | `-1.249` | `-0.195` | `0.0072` |
| **CTAS: Non-urgent** | `-1.248` | `0.278` | `-1.793` | `-0.704` | `< 0.0001` |
| **CTAS: Unknown** | `-1.652` | `0.365` | `-2.368` | `-0.937` | `< 0.0001` |
| **Disposition: Death** | `-7.534` | `1.042` | `-9.577` | `-5.491` | `< 0.0001` |
| **Disposition: Discharged Home** | `-6.351` | `0.111` | `-6.569` | `-6.134` | `< 0.0001` |
| **Disposition: Intra-Facility Transfer** | `-6.552` | `0.478` | `-7.489` | `-5.614` | `< 0.0001` |
| **Disposition: Not Seen Or Left** | `-6.476` | `0.185` | `-6.839` | `-6.113` | `< 0.0001` |
| **Disposition: Total** | `-6.094` | `0.110` | `-6.308` | `-5.879` | `< 0.0001` |
| **Disposition: Transferred** | `-4.995` | `0.266` | `-5.517` | `-4.473` | `< 0.0001` |
| **Disposition: Unknown** | `-7.413` | `1.096` | `-9.562` | `-5.264` | `< 0.0001` |

### Technical Details & Methodology
- **Statistical Finding:**  
  The WLS model explains 88.0% of weighted variance ($\text{Adj. } R^2 = 0.8800$) in reported aggregate median ED LOS. Significant predictors ($p < 0.05$) appear as solid squares in the forest plot and are highlighted in the coefficient table.
- **Clinical Workflow Context:**  
  The WLS regression operates on aggregate records where each observation represents a combination of age group, triage level, and disposition. Beta coefficients quantify the average difference in reported aggregate median LOS associated with each predictor category relative to its reference, holding other predictors constant — interpreted at the aggregate stratum level only.
- **Operational Implication:**  
  Aggregate-level predictor coefficients can inform capacity planning by identifying which combinations of triage level, age group, and disposition are associated with systematically higher reported median LOS. These estimates can weight demand forecasts according to expected case-mix compositions in future fiscal periods.

---

## H4: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size

### Reported Median ED LOS Across ED Visit Disposition Categories
**Decision:** `Fail to Reject Null Hypothesis`

> **Research Question:**  
> *"Does reported median emergency department length of stay differ across visit disposition categories?"*

#### Test Statistics & Metrics
- **H Statistic:** `2570.925`
- **p-value:** `1.0000`
- **Effect Size ($\varepsilon^2$):** `0.3728`
- **Significant Pairwise Pairs:** `13 / 15`

#### Significant Pairwise Comparisons (Bonferroni-Adjusted)
- **Total vs. Discharged Home:** $p_{\text{adj}} = 0.0012$
- **Total vs. Admitted:** $p_{\text{adj}} < 0.0001$
- **Total vs. Transferred:** $p_{\text{adj}} < 0.0001$
- **Total vs. Not Seen Or Left:** $p_{\text{adj}} < 0.0001$
- **Total vs. Intra-Facility Transfer:** $p_{\text{adj}} < 0.0001$
- **Discharged Home vs. Admitted:** $p_{\text{adj}} < 0.0001$
- **Discharged Home vs. Transferred:** $p_{\text{adj}} < 0.0001$
- **Discharged Home vs. Not Seen Or Left:** $p_{\text{adj}} = 0.0492$

#### Reported Median LOS by Disposition Category — Summary & Distribution
- **Total:** Median = `2.67 hrs` ($n = 890$)
- **Discharged Home:** Median = `2.58 hrs` ($n = 848$)
- **Admitted:** Median = `6.17 hrs` ($n = 840$)
- **Transferred:** Median = `3.50 hrs` ($n = 797$)
- **Not Seen Or Left:** Median = `2.32 hrs` ($n = 790$)
- **Intra-Facility Transfer:** Median = `2.80 hrs` ($n = 667$)
*(Box: IQR Q1–Q3 · Centre line: Median · Whiskers: 1.5×IQR)*

### Technical Details & Methodology
- **Statistical Finding:**  
  The weighted Kruskal–Wallis test yields $H = 2570.925$ ($\text{df} = 5$, $p = 1.0000$), $\varepsilon^2 = 0.3728$. 13 pairwise comparisons remain significant after Bonferroni correction.
- **Clinical Workflow Context:**  
  Aggregate records stratified by disposition category exhibit systematic differences in reported median ED LOS. These aggregate-level patterns reflect the differing care processes, resource requirements, and bed-management pathways associated with each disposition outcome across the full dataset.
- **Operational Implication:**  
  Disposition-stratified aggregate LOS estimates provide a quantitative basis for patient-flow modelling. Planners can use the distribution of disposition outcomes combined with category-specific median LOS to project total ED occupancy and identify disposition pathways where process redesign would yield the greatest throughput improvement.

---

## H5: Mann–Kendall Trend Test · Simple Exponential Smoothing (FY+1, FY+2 Forecast)

### Mann–Kendall Trend & SES Forecast: Estimated Emergency Department Resource Burden Index (ERBI)
**Decision:** `Reject Null Hypothesis`

> **Research Question:**  
> *"What long-term trends are observed in emergency department visit volume, reported median length of stay, and the Estimated Resource Burden Index (ERBI)?"*

#### Test Statistics & Metrics
- **Mann–Kendall $\tau$:** `0.9766`
- **p-value:** `< 0.0001`
- **Forecast FY+1 (ERBI):** `6592.41M min`
- **Forecast FY+2 (ERBI):** `6592.41M min`
- **95% Forecast CI — FY 2022–2023:** `[4287.56M, 8897.27M] min`
- **95% Forecast CI — FY 2023–2024:** `[3332.86M, 9851.97M] min`

> **Note:**  
> *"Estimated Emergency Department Resource Burden Index (ERBI)" is a derived proxy metric — visit count × reported median LOS × 60 — and should not be interpreted as actual aggregate utilization time.*

### Technical Details & Methodology
- **Statistical Finding:**  
  Mann–Kendall $\tau = 0.9766$ ($p < 0.0001$, trend: increasing). A statistically significant monotonic increasing trend is detected in the ERBI series across fiscal years. SES projects FY+1 $\approx$ 6592.41M min and FY+2 $\approx$ 6592.41M min, with 95% CIs shown on the chart.
- **Clinical Workflow Context:**  
  The Estimated Emergency Department Resource Burden Index (ERBI) aggregates reported median LOS and visit volume into a single fiscal-year metric. Changes over time reflect combined shifts in both aggregate visit volume and reported median duration per visit across the full dataset.
- **Operational Implication:**  
  SES-based projections of the ERBI metric provide a baseline for near-term capacity planning. The 95% prediction intervals widen over time to reflect forecast uncertainty, serving as an exploratory indicator for prospective resource allocation.

---

## Reproducibility & Aggregate-Level Analysis Statement

All statistical results (H1–H5) are computed dynamically from the SQLite-loaded dataset. Analyses operate exclusively on aggregate-level records. No results are derived from or refer to individual-level records. Weighted tests use visit counts as analytic weights. WLS models aggregate median LOS with visit-count weights. The Estimated Emergency Department Resource Burden Index (ERBI) is a derived composite indicator.
