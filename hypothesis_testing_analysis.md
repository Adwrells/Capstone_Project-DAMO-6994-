# STATISTICAL COMPUTING HUB
**Stage 4 Active · Hypothesis Testing & Statistical Analysis**  
*DAMO-699 Capstone · H1–H5 · Weighted non-parametric tests · WLS regression · Mann-Kendall + SES · All results computed from SQLite-loaded data at the aggregate level.*

---

## Pipeline Telemetry
*Dynamic weighted statistical solvers · SQLite-loaded cohort · Aggregate-level analysis.*

| Metric | Value |
| :--- | :--- |
| **Status** | `COMPLETED` |
| **Runtime** | `1130 ms` |
| **Hypotheses** | `H1–H5 ✓` |
| **Solver Convergence** | `100%` |

---

## H1: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size

### Reported Median ED LOS Across CTAS Triage Levels
**Decision:** `Reject Null Hypothesis`

> **Research Question:**  
> *"How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?"*

#### Test Statistics & Metrics
- **H Statistic:** `126,276,098.896`
- **p-value:** `< 0.0001`
- **Effect Size ($\varepsilon^2$):** `0.2848`
- **Significant Pairwise Pairs:** `3 / 3`

#### Significant Pairwise Comparisons (Bonferroni-Adjusted)
- **Resuscitation vs. Emergent:** $p_{\text{adj}} < 0.0001$
- **Resuscitation vs. Urgent:** $p_{\text{adj}} < 0.0001$
- **Emergent vs. Urgent:** $p_{\text{adj}} < 0.0001$

#### Reported Median ED LOS by CTAS Level — Distribution
- **Resuscitation:** Median = `3.30 hrs` ($n = 969$)
- **Emergent:** Median = `3.75 hrs` ($n = 1018$)
- **Urgent:** Median = `2.80 hrs` ($n = 2923$)
*(Box: IQR Q1–Q3 · Centre line: Median · Whiskers: 1.5×IQR)*

### Technical Details & Methodology
- **Omnibus Test:** Weighted Kruskal–Wallis H-Test (non-parametric one-way analysis of ranks)
- **Post-Hoc:** Weighted Dunn Test — all pairwise group comparisons
- **Correction:** Bonferroni: $p_{\text{adj}} = \min(1, p \times \text{number of comparisons})$
- **Effect Size:** Epsilon Squared ($\varepsilon^2$) = $(H - k + 1) / (N - k)$; $0 = \text{negligible}, 1 = \text{maximal}$
- **Weights:** Number of ED Visits per aggregate record used to expand group arrays
- **$H_0$:** Reported median ED LOS is equal across all CTAS triage levels
- **$H_1$:** At least one CTAS level has a different reported median ED LOS
- **$\alpha$:** $0.05$ (two-sided); **Data:** SQLite-loaded processed dataset


---

## H2: Weighted Mann–Whitney U Test (Two-Sided) · Rank-Biserial Correlation

### Reported Median ED LOS: Pandemic vs. Pre-Pandemic Fiscal Years
**Decision:** `Reject Null Hypothesis`

> **Research Question:**  
> *"Did reported median emergency department length of stay differ between the pandemic-affected fiscal year (2020–2021) and the preceding fiscal years?"*

#### Test Statistics & Metrics
- **U Statistic:** `905,919,210,631,107.0`
- **p-value (two-sided):** `< 0.0001`
- **Effect Size ($r_b$):** `0.0042`
- **Median Difference:** `0.100 hrs`

#### Reported Median LOS — Pandemic vs. Pre-Pandemic Distribution
- **Pre-Pandemic (FY 2019–20 & 2017–18):** Median = `3.40 hrs` ($n = 608$)
- **FY 2020–21:** Median = `3.30 hrs` ($n = 289$)
*(Box: IQR Q1–Q3 · Centre line: Median · Whiskers: 1.5×IQR)*

### Technical Details & Methodology
- **Test:** Weighted Mann–Whitney U Test (two-sided; no directional assumption)
- **Effect Size:** Rank-biserial correlation: $r_b = 1 - 2U / (n_1 \times n_2)$; range $[-1, +1]$
- **Weights:** Number of ED Visits per aggregate record
- **Pandemic Period:** FY 2020–2021
- **Pre-Pandemic:** FY 2019–2020 and FY 2017–2018
- **$H_0$:** The distribution of reported median ED LOS is equal in both periods
- **$H_1$:** The distributions differ (two-sided; direction not assumed a priori)
- **$\alpha$:** $0.05$; **Data:** SQLite-loaded processed dataset


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
- **Method:** Weighted Least Squares (WLS) regression on aggregate-level records
- **Dependent Variable:** Visit-weighted reported mean Median ED LOS (Hours) per aggregate group
- **Analytic Weights:** Number of ED Visits per aggregate record (visit-count weighting)
- **Predictors:** Age Group, CTAS Level, Disposition — one-hot encoded; first category = reference
- **Reference Groups:** Age: Unknown · CTAS: CTAS I - Resuscitation · Disposition: Admitted
- **Effect Measure:** WLS $\beta$ coefficient (hours) with 95% Wald CI and Wald p-value from t-distribution
- **Adj. $R^2$:** Weighted coefficient of determination adjusted for number of predictors
- **Interpretation Unit:** Aggregate age-group records only — no individual-level inference
- **Data Source:** SQLite-loaded processed dataset


---

## H4: Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · $\varepsilon^2$ Effect Size

### Reported Median ED LOS Across ED Visit Disposition Categories
**Decision:** `Reject Null Hypothesis`

> **Research Question:**  
> *"Does reported median emergency department length of stay differ across visit disposition categories?"*

#### Test Statistics & Metrics
- **H Statistic:** `76,181,576.530`
- **p-value:** `< 0.0001`
- **Effect Size ($\varepsilon^2$):** `0.1706`
- **Significant Pairwise Pairs:** `15 / 15`

#### Significant Pairwise Comparisons (Bonferroni-Adjusted)
- **Total vs. Discharged Home:** $p_{\text{adj}} < 0.0001$
- **Total vs. Admitted:** $p_{\text{adj}} < 0.0001$
- **Total vs. Transferred:** $p_{\text{adj}} < 0.0001$
- **Total vs. Not Seen Or Left:** $p_{\text{adj}} < 0.0001$
- **Total vs. Intra-Facility Transfer:** $p_{\text{adj}} < 0.0001$
- **Discharged Home vs. Admitted:** $p_{\text{adj}} < 0.0001$
- **Discharged Home vs. Transferred:** $p_{\text{adj}} < 0.0001$
- **Discharged Home vs. Not Seen Or Left:** $p_{\text{adj}} < 0.0001$

#### Reported Median LOS by Disposition Category — Distribution
- **Total:** Median = `2.67 hrs` ($n = 890$)
- **Discharged Home:** Median = `2.58 hrs` ($n = 848$)
- **Admitted:** Median = `6.17 hrs` ($n = 840$)
- **Transferred:** Median = `3.50 hrs` ($n = 797$)
- **Not Seen Or Left:** Median = `2.32 hrs` ($n = 790$)
- **Intra-Facility Transfer:** Median = `2.80 hrs` ($n = 667$)
*(Box: IQR Q1–Q3 · Centre line: Median · Whiskers: 1.5×IQR)*

### Technical Details & Methodology
- **Omnibus Test:** Weighted Kruskal–Wallis H-Test (non-parametric one-way analysis of ranks)
- **Post-Hoc:** Weighted Dunn Test — all pairwise comparisons across disposition groups
- **Correction:** Bonferroni: $p_{\text{adj}} = \min(1, p \times \text{number of comparisons})$
- **Effect Size:** Epsilon Squared ($\varepsilon^2$) = $(H - k + 1) / (N - k)$
- **Groups Compared:** Top 6 disposition categories by aggregate record count
- **Weights:** Number of ED Visits per aggregate record
- **$H_0$:** Reported median ED LOS is equal across all disposition categories
- **$H_1$:** At least one disposition category has a different reported median ED LOS
- **$\alpha$:** $0.05$; **Data:** SQLite-loaded processed dataset


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
- **Trend Test:** Mann–Kendall non-parametric monotonic trend test (Kendall S-statistic, normal approximation)
- **ERBI Metric:** Estimated Emergency Department Resource Burden Index: $\sum(\text{Visit Count} \times \text{Reported Median LOS} \times 60)$ per fiscal year
- **Forecast Method:** Simple Exponential Smoothing (SES), smoothing parameter $\alpha = 0.3$, horizon $h = 2$ fiscal years
- **Forecast CI:** 95% prediction interval: point forecast $\pm 1.96 \times \sigma_{\text{residual}} \times \sqrt{h}$
- **$H_0$:** No monotonic trend exists in the Estimated ERBI series across fiscal years
- **$H_1$:** A monotonic trend (increasing or decreasing) exists across fiscal years
- **$\alpha$:** $0.05$ (two-sided); **Data:** SQLite-loaded processed dataset


---

## Reproducibility & Aggregate-Level Analysis Statement

All statistical results (H1–H5) are computed dynamically from the SQLite-loaded dataset. Analyses operate exclusively on aggregate-level records. No results are derived from or refer to individual-level records. Weighted tests use visit counts as analytic weights. WLS models aggregate median LOS with visit-count weights. The Estimated Emergency Department Resource Burden Index (ERBI) is a derived composite indicator.
