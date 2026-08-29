# Chapter 2: Analytics Lifecycle and Project Methodology

## 2.1 Ten-Stage Analytics Lifecycle Framework Mapping

To ensure academic rigor, systematic execution, and organizational transparency, this capstone project adheres to a comprehensive ten-stage data analytics lifecycle. Rooted in established industry frameworks such as CRISP-DM (Cross-Industry Standard Process for Data Mining) and adapted for healthcare operations research, the lifecycle maps strategic business questions directly to empirical data engineering, statistical computing, predictive modeling, and executive decision-support mechanisms (Affleck et al., 2013; Provost & Fawcett, 2013).

```
+---------------------------------------------------------------------------------------------------------+
|                                    TEN-STAGE ANALYTICS LIFECYCLE MAP                                    |
+---------------------------------------------------------------------------------------------------------+
| [1. Business Understanding] ---> [2. Data Understanding]     ---> [3. Data Ingestion & Extraction]      |
|                                                                                                         |
| [6. Statistical Computing]  <--- [5. Pre-Registration / H1-5]<--- [4. Data Cleaning & Preparation]     |
|              |                                                                                          |
|              v                                                                                          |
| [7. Diagnostic Validation]  ---> [8. Visualization Portal]   ---> [9. Operational Synthesis]            |
|                                                                                 |                       |
|                                                                                 v                       |
|                                                                    [10. Governance & Monitoring]        |
+---------------------------------------------------------------------------------------------------------+
```

### Table 2
*Detailed Mapping of the Ten-Stage Capstone Data Analytics Lifecycle*

| Lifecycle Stage | Core Stage Description & Operational Activity | Specific Technical Implementation & Output Artifacts | Primary Methodological Safeguard |
| :--- | :--- | :--- | :--- |
| **Stage 1: Business Problem Understanding** | Articulated the operational crisis of Canadian ED crowding, inpatient bed block, and unexplained length of stay (LOS) variance. | Documented problem statement, executive objectives, and decision matrix in Chapter 1. | Formal boundary setting between hospital-wide bed block and triage-specific flow. |
| **Stage 2: Data Understanding** | Audited the structural composition, grain, temporal span, and variable definitions of the CIHI NACRS supplementary tables. | Evaluated six reporting sheets, multi-year cross-sectional layouts, and suppression flags. | Confirmed that records represent pre-aggregated stratum summaries rather than microdata. |
| **Stage 3: Data Ingestion & Extraction** | Extracted multi-tab historical workbooks spanning FY 2003–2004 to FY 2021–2022 into standardized pandas DataFrames. | Python extraction scripts in `backend/preprocessing/cleaning.py::clean_raw_datasets()`. | Automated schema verification and column name harmonization across 19 fiscal years. |
| **Stage 4: Data Preparation & Engineering** | Filtered summary roll-up rows, normalized string categories, resolved missing data, and engineered derived metrics. | Ingested cleaned relational tables into SQLite database (`healthcare.db`) via `load_csv.py`. | Exclusion of summary roll-up rows (`Total`, `Any`) to eliminate population double-counting. |
| **Stage 5: Analytical & Hypothesis Design** | Formulated five canonical hypotheses (H1–H5), established directional/two-sided tests, and pre-registered alpha levels ($\alpha = .05$). | Canonical registry in `backend/analytics/hypotheses_registry.py` and modular handlers (`H1.py`–`H5.py`). | Strict pre-specification of statistical tests prior to model execution. |
| **Stage 6: Statistical Computing & Modeling** | Executed frequency-weighted non-parametric inferential tests, WLS regression, Mann–Kendall trend detection, and SES forecasting. | Computing engines in `backend/analytics/statistics/weighted.py` and `forecasting/core.py`. | Deployment of midrank frequency weighting algorithms using stratum visit counts. |
| **Stage 7: Model Diagnostics & Validation** | Assessed distributional skewness, homoscedasticity, multicollinearity, sample sizes, and residual properties. | Diagnostic modules in `statistics/assumptions.py` verified across 300+ automated test suites. | Non-parametric rank-based estimators chosen over parametric tests to accommodate severe skewness. |
| **Stage 8: Visualization & UI Portal** | Engineered an interactive, full-stack decision-support dashboard displaying publication-grade charts and KPI telemetry. | Built with React 19, TypeScript, Recharts, Vite, and FastAPI REST endpoints. | APA 7 visual guidelines: explicit titles, axis metrics, legends, and immediate textual interpretation. |
| **Stage 9: Interpretation & Decision Support** | Synthesized statistical outputs into actionable, evidence-proportionate operational strategies for hospital leadership. | Strategic Recommendations in Chapter 9, translated into short-, medium-, and long-term horizons. | Effect size interpretation ($\varepsilon^2$, $r_b$, Cramer's $V$) prioritizing clinical relevance over raw $p$-values. |
| **Stage 10: Governance, Monitoring & Reproducibility** | Established automated database seeding, isolated user upload pipelines, and reproducible build scripts. | Dual-path SQLite architecture (`user_dataset_<id>`) and `launch.py` environment bootstrap. | Read-only baseline cohort isolation ensuring uncompromised hypothesis reproducibility. |

---

## 2.2 Mathematical Foundations of Non-Parametric Inferential Methods

### 2.2.1 Violation of Classical Parametric Assumptions in Healthcare Duration Data
Classical parametric inferential methods—such as the two-sample Student's $t$-test, Ordinary Least Squares (OLS) regression, and One-Way Analysis of Variance (ANOVA)—rely on strict distributional assumptions, including normality of residuals, variance homogeneity (homoscedasticity), and independence of observations (Field, 2018). In healthcare operations and emergency medicine analytics, duration metrics such as length of stay violate these assumptions fundamentally:
1. **Severe Positive Skewness:** Emergency department durations exhibit severe right-skewness; the vast majority of patients depart within 2 to 4 hours, whereas a protracted tail of complex, admitted, or ICU-bound patients remain boarded for 24 to 48 hours or more. Arithmetic means and standard deviations are heavily distorted by extreme values, misrepresenting central tendency.
2. **Variance Heteroscedasticity:** Variances across acuity tiers and admission pathways differ by orders of magnitude (e.g., non-urgent variance $\sigma^2 \approx 0.8\text{ hrs}^2$ vs. admitted variance $\sigma^2 \approx 48.5\text{ hrs}^2$), violating Levene's test of homoscedasticity.
3. **Unequal Stratum Sample Sizes:** Aggregate reporting strata range from small regional cohorts ($n < 500$) to large metropolitan cohorts ($n > 2,000,000$).

Consequently, this project deploys distribution-free, rank-based non-parametric methods. Non-parametric methods evaluate the relative ordering (ranks) of observations rather than raw numeric values, providing robust inference resilient to outliers, heavy tails, and severe skewness (Conover, 1999).

```
+---------------------------------------------------------------------------------------------------------+
|                                    WHY NON-PARAMETRIC METHODS ARE CHOSEN                                 |
+---------------------------------------------------------------------------------------------------------+
|  PARAMETRIC ASSUMPTIONS (VIOLATED)          NON-PARAMETRIC REALITY (ROBUST & VALID)                     |
|  ----------------------------------------   ----------------------------------------------------------  |
|  - Assumes Normal Gaussian Distribution  -> Resilient to extreme right-skewed healthcare durations      |
|  - Assumes Homoscedasticity (Equal Var)  -> Operates on ordinal ranks across heterogeneous variances     |
|  - Distorted by Outliers & Long Tails    -> Evaluates medians and midranks without artificial trimming   |
|  - Requires Raw Microdata Rows           -> Adaptable to Frequency-Weighted Stratum Aggregates           |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.2.2 Mathematical Formulations of Analytical Solvers

#### 1. Weighted Kruskal–Wallis $H$-Test (Hypotheses H1 and H4)
The Kruskal–Wallis test is the non-parametric analog of one-way ANOVA. To accommodate aggregate healthcare strata, the test incorporates stratum visit weights ($w_i = \text{ed\_visits}_i$). 

Let $k$ represent the number of mutually exclusive comparison groups (e.g., $k = 5$ for CTAS triage levels in H1; $k = 4$ for age categories in H4). Let $N = \sum_{i=1}^M w_i$ represent the total population-weighted sample size across all $M$ aggregate rows. Each unique median LOS value is assigned a population-weighted midrank $R_i$. The weighted sum of ranks for group $j$ is denoted $R_j$, and its total weight is $n_j = \sum_{i \in j} w_i$.

The weighted omnibus $H$-statistic is formulated as:

$$H = \frac{12}{N(N + 1)} \sum_{j=1}^k \frac{R_j^2}{n_j} - 3(N + 1)$$

When ties occur in the ranked duration data, the $H$-statistic is corrected via the tie adjustment factor $C_{\text{ties}}$:

$$H_{\text{corrected}} = \frac{H}{1 - \frac{\sum_{t} (T_t^3 - T_t)}{N^3 - N}}$$

where $T_t$ represents the summed frequency weight of observations tied at rank $t$. Under the null hypothesis $H_0$, $H_{\text{corrected}}$ asymptotically follows a chi-square ($\chi^2$) distribution with $df = k - 1$ degrees of freedom.

#### Post-Hoc Pairwise Comparisons and Effect Size:
Following a statistically significant omnibus Kruskal–Wallis test ($p < .05$), post-hoc pairwise group differences are evaluated using Dunn’s $z$-test statistic:

$$z_{ij} = \frac{\bar{R}_i - \bar{R}_j}{\sqrt{\left( \frac{N(N + 1)}{12} - \frac{\sum (T_t^3 - T_t)}{12(N - 1)} \right) \left( \frac{1}{n_i} + \frac{1}{n_j} \right)}}$$

To control the family-wise error rate across all $m = \binom{k}{2}$ pairwise comparisons, $p$-values are adjusted using the conservative Bonferroni correction:

$$p_{\text{adj}} = \min\left(1.0, \, p_{\text{unadjusted}} \times m\right)$$

The practical magnitude of the omnibus group separation is quantified using the Epsilon-Squared ($\varepsilon^2$) effect size index (Tomczak & Tomczak, 2014):

$$\varepsilon^2 = \frac{H - k + 1}{N - k}$$

*Interpretation benchmark for $\varepsilon^2$:* $0.01 \le \varepsilon^2 < 0.06$ denotes a small effect; $0.06 \le \varepsilon^2 < 0.14$ denotes a moderate effect; $\varepsilon^2 \ge 0.14$ denotes a large operational effect.

---

#### 2. Weighted Mann–Whitney $U$-Test (Hypothesis H2)
The Mann–Whitney $U$-test is the non-parametric equivalent of the independent two-sample $t$-test. For Hypothesis H2, the comparison evaluates $k = 2$ independent groups: Admitted ($j = 1$) versus Non-Admitted ($j = 2$).

Let $n_1$ and $n_2$ denote the total visit-weighted sample sizes of the two cohorts, with $N = n_1 + n_2$. The weighted rank-sum for the admitted group is $R_1$. The $U_1$ test statistic is formulated as:

$$U_1 = R_1 - \frac{n_1(n_1 + 1)}{2}$$

Given the immense sample size ($N \approx 175.8\text{M}$ visits), the distribution of $U$ rapidly converges to normality. The standardized test statistic $z$ is computed as:

$$z = \frac{U_1 - \mu_U}{\sigma_U} = \frac{U_1 - \frac{n_1 n_2}{2}}{\sqrt{\frac{n_1 n_2 (N + 1)}{12} - \frac{n_1 n_2 \sum (T_t^3 - T_t)}{12 N (N - 1)}}}$$

The practical effect size is quantified using the Rank-Biserial Correlation ($r_b$), which measures the relative dominance of ranks between cohorts across the range $[-1.0, +1.0]$:

$$r_b = 1 - \frac{2 U_1}{n_1 n_2}$$

---

#### 3. Weighted Least Squares (WLS) Linear Regression (Hypothesis H3)
Hypothesis H3 evaluates the predictive relationship between standardized clinical CTAS urgency score ($X_i \in \{1, 2, 3\}$) and reported median length of stay in minutes ($Y_i$). Because each observation represents an aggregate stratum encompassing varying visit counts, ordinary least squares (OLS) regression violates the assumption of equal error variance ($\text{Var}(\epsilon_i) = \sigma^2 / w_i$).

To achieve Gauss–Markov efficiency, Weighted Least Squares (WLS) regression is deployed. Let $W$ represent an $M \times M$ diagonal weight matrix where $W_{ii} = \text{ed\_visits}_i$, $X$ denote the design matrix, and $Y$ denote the median LOS vector. The parameter vector $\beta = [\beta_0, \beta_1]^T$ is estimated as:

$$\hat{\beta} = \left( X^T W X \right)^{-1} X^T W Y$$

The weighted coefficient of determination ($R^2_{\text{weighted}}$) evaluates the proportion of aggregate variance explained by clinical urgency:

$$R^2_{\text{weighted}} = 1 - \frac{\sum_{i=1}^M w_i (Y_i - \hat{Y}_i)^2}{\sum_{i=1}^M w_i (Y_i - \bar{Y}_W)^2}$$

where $\bar{Y}_W = \frac{\sum w_i Y_i}{\sum w_i}$ represents the weighted grand mean of reported median LOS.

---

#### 4. Pearson's Chi-Square ($\chi^2$) Test of Independence (Hypothesis H5)
Hypothesis H5 evaluates whether patient biological sex (Male vs. Female) is statistically independent of final emergency disposition (Admitted vs. Non-Admitted) in a $2 \times 2$ contingency framework. The test statistic is calculated from observed cell counts ($O_{ij}$) and expected cell counts ($E_{ij}$):

$$\chi^2 = \sum_{i=1}^2 \sum_{j=1}^2 \frac{\left( O_{ij} - E_{ij} \right)^2}{E_{ij}}, \quad E_{ij} = \frac{R_i \cdot C_j}{N}$$

Because chi-square statistics scale linearly with massive sample sizes ($N > 170\text{M}$), minuscule, clinically meaningless divergences reject the null hypothesis at $p < .0001$. Therefore, the practical strength of association must be evaluated using Cramer’s $V$:

$$V = \sqrt{\frac{\chi^2}{N \cdot \min(r - 1, c - 1)}} = \sqrt{\frac{\chi^2}{N \cdot 1}}$$

*Interpretation benchmark for Cramer's $V$ ($df=1$):* $V < 0.10$ indicates a negligible association; $0.10 \le V < 0.30$ indicates a moderate association; $V \ge 0.50$ indicates a strong association.

---

## 2.3 Frequency-Weighting Mechanics and Ecological Fallacy Safeguards

### 2.3.1 Algorithmic Implementation of Frequency Midranks
A critical methodological requirement of this capstone is correctly processing pre-aggregated reporting tables. If an unweighted Kruskal–Wallis test were executed over the 912 aggregate rows of the `ctas_triage` table, the analysis would treat an aggregate stratum representing 500 visits identically to a major metropolitan stratum representing 1,500,000 visits, introducing catastrophic aggregation bias.

To resolve this, the analytical platform implements a custom midrank frequency-weighting engine (`backend/analytics/statistics/weighted.py`). The algorithm proceeds in four distinct computational stages:

```
+---------------------------------------------------------------------------------------------------------+
|                                  FREQUENCY MIDRANK COMPUTATION ENGINE                                   |
+---------------------------------------------------------------------------------------------------------+
|  Stage 1: Pool all aggregate rows across groups, extracting (Value_i, Weight_i) tuples                  |
|  Stage 2: Sort pooled records ascending by Value; aggregate duplicate values into unique value map      |
|  Stage 3: For each unique value v, compute population midrank:                                          |
|           Midrank(v) = Cumulative_Weight_Preceding + [Weight(v) + 1] / 2                                |
|  Stage 4: Project midranks back into group strata, computing weighted rank sums: R_j = sum(w_i * R_i)  |
+---------------------------------------------------------------------------------------------------------+
```

By computing midranks across the weighted cumulative frequency distribution, the resulting test statistics reflect the full population of 175.8 million emergency visits while preserving exact non-parametric rank properties.

### 2.3.2 Epistemological Boundaries and Ecological Fallacy Prevention
The **ecological fallacy** is a classical statistical error that occurs when aggregate-level population associations are inappropriately generalized to individual patients (Robinson, 1950; Subbaiah et al., 2020). For example, finding that aggregate strata with older average ages exhibit higher median LOS does not guarantee that every individual older patient will experience a longer emergency stay than a younger patient.

To preserve scientific validity, this report enforces three strict epistemological boundaries:
1. **Unit of Analysis Definition:** All statistical findings describe *system-level cohort performance* and *stratum-level throughput distributions*. 
2. **Clinical Decision Restrictions:** Analytical models and regression equations derived herein are decision-support planning proxies for facility sizing and resource allocation; they must never be deployed as individual clinical triage or diagnostic tools for specific incoming patients.
3. **Transparent Reporting of Dispersion:** All empirical findings report median values alongside interquartile ranges (IQR) and population-weighted confidence intervals, ensuring that internal cohort variance is transparently communicated to health system planners.
