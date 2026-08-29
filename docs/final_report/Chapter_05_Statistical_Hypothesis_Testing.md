# Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference

## 5.1 Hypothesis 1: CTAS Triage Acuity and Length of Stay (Weighted Kruskal–Wallis)

### 5.1.1 Research Question and Formal Hypotheses
The primary clinical objective of emergency triage is prioritizing care based on illness severity. Hypothesis 1 investigates whether reported median emergency department length of stay differs systematically across the five clinical tiers of the Canadian Triage and Acuity Scale (CTAS I through V) in aggregate national data.

- **Null Hypothesis ($H_0$):** The distribution of reported median ED length of stay is identical across all five CTAS triage acuity levels ($\mu_{R_{\text{CTAS I}}} = \mu_{R_{\text{CTAS II}}} = \mu_{R_{\text{CTAS III}}} = \mu_{R_{\text{CTAS IV}}} = \mu_{R_{\text{CTAS V}}}$).
- **Alternative Hypothesis ($H_1$):** At least one CTAS triage level exhibits a statistically different reported median ED length of stay distribution.

### 5.1.2 Statistical Results and Effect Size
The omnibus test was executed on the `ctas_triage` table using the frequency-weighted Kruskal–Wallis $H$-test algorithm, where stratum visit counts (`ed_visits`) serve as frequency weights ($N = 174,207,395$ visits across 760 valid aggregate strata).

```
+---------------------------------------------------------------------------------------------------------+
|                                    HYPOTHESIS 1 OMNIBUS TEST SUMMARY                                    |
+---------------------------------------------------------------------------------------------------------+
|  Test Type: Weighted Kruskal-Wallis H-Test (Non-Parametric One-Way ANOVA on Ranks)                      |
|  Weighted Population Sample Size (N): 174,207,395 visits | Total Strata (k): 5 groups (760 rows)        |
|  Kruskal-Wallis Test Statistic (H): 126,319,368.24       | Degrees of Freedom (df): 4                   |
|  Asymptotic p-value: < .0001                             | Statistical Decision: REJECT NULL HYPOTHESIS |
|  Omnibus Effect Size (Epsilon-Squared, ε²): 0.7251        | Effect Magnitude: Exceptionally Large        |
+---------------------------------------------------------------------------------------------------------+
```

### Table 8
*Weighted Dunn Post-Hoc Pairwise Comparisons Across CTAS Acuity Tiers with Bonferroni Adjustment (H1)*

| Comparison Pair (Group A vs. Group B) | Group A Weighted Median (Min / Hours) | Group B Weighted Median (Min / Hours) | Standardized Test Statistic ($z$) | Unadjusted $p$-value | Bonferroni-Adjusted $p$-value ($p_{\text{adj}}$) | Statistical Decision |
| :--- | :--- | :--- | --: | :--- | :--- | :--- |
| **CTAS I vs. CTAS II** | 276.0 min (4.60 h) | 288.0 min (4.80 h) | -20.39 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS I vs. CTAS III** | 276.0 min (4.60 h) | 204.0 min (3.40 h) | 1,642.10 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS I vs. CTAS IV** | 276.0 min (4.60 h) | 114.0 min (1.90 h) | 3,105.42 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS I vs. CTAS V** | 276.0 min (4.60 h) | 80.0 min (1.33 h) | 4,210.90 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS II vs. CTAS III** | 288.0 min (4.80 h) | 204.0 min (3.40 h) | 4,218.65 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS II vs. CTAS IV** | 288.0 min (4.80 h) | 114.0 min (1.90 h) | 8,940.12 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS II vs. CTAS V** | 288.0 min (4.80 h) | 80.0 min (1.33 h) | 9,812.44 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS III vs. CTAS IV** | 204.0 min (3.40 h) | 114.0 min (1.90 h) | 7,654.30 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS III vs. CTAS V** | 204.0 min (3.40 h) | 80.0 min (1.33 h) | 9,120.78 | $< .0001$ | $< .0001$ | Statistically Significant |
| **CTAS IV vs. CTAS V** | 114.0 min (1.90 h) | 80.0 min (1.33 h) | 3,890.15 | $< .0001$ | $< .0001$ | Statistically Significant |

*Note.* All 10 pairwise comparisons ($m = 10$) are statistically significant at $p_{\text{adj}} < .0001$ following Bonferroni adjustment ($p_{\text{adj}} = \min(1.0, \, p \times 10)$).

### 5.1.3 Clinical and Operational Interpretation
The omnibus test and post-hoc pairwise analyses decisively reject the null hypothesis, demonstrating that clinical acuity exerts an exceptionally powerful influence on emergency length of stay ($\varepsilon^2 = 0.7251$). 

Crucially, the post-hoc matrix reveals a notable clinical dynamic: **CTAS II (Emergent) presentations sustain the longest median length of stay (288.0 minutes / 4.80 hours)**, significantly exceeding CTAS I (Resuscitation, 276.0 minutes / 4.60 hours). This occurs because CTAS I patients undergo immediate, rapid resuscitation leading to swift ICU admission, whereas CTAS II patients undergo extensive diagnostic workups (CT scans, serial bloodwork, specialty consults) in emergency stretchers prior to admission. CTAS I vs. CTAS II is the comparison with the smallest absolute z-score (|z| = 20.39), confirming that adjacent acuity tiers remain statistically distinct. Conversely, CTAS V (Non-Urgent) visits resolve in a median of 80.0 minutes (1.33 hours), confirming their viability for rapid assessment streams.

---

## 5.2 Hypothesis 2: Inpatient Admission Status Bottleneck Impact (Weighted Mann–Whitney U)

### 5.2.1 Research Question and Formal Hypotheses
Hypothesis 2 evaluates the operational impact of inpatient bed block by testing whether emergency department length of stay differs between patients admitted to inpatient hospital beds and those discharged home or transferred.

- **Null Hypothesis ($H_0$):** The distribution of reported median ED length of stay is equal between admitted and non-admitted visits.
- **Alternative Hypothesis ($H_1$):** Admitted visits exhibit a statistically different median length of stay distribution compared to non-admitted visits.

### 5.2.2 Statistical Results and Effect Size
The test was conducted on the `visit_disposition` table using the frequency-weighted two-sided Mann–Whitney $U$-test ($N = 175,619,773$ visits across 860 valid strata).

```
+---------------------------------------------------------------------------------------------------------+
|                                    HYPOTHESIS 2 OMNIBUS TEST SUMMARY                                    |
+---------------------------------------------------------------------------------------------------------+
|  Test Type: Weighted Mann-Whitney U Test (Two-Sided Independent Two-Group Rank Test)                     |
|  Population Sizes: Non-Admitted (n1) = 157,615,553 visits | Admitted (n2) = 18,004,220 visits           |
|  Mann-Whitney U Statistic: 2,689,068,488,900.00          | Asymptotic z-score: 6,952.46                 |
|  Two-Sided p-value: < .0001                              | Statistical Decision: REJECT NULL HYPOTHESIS |
|  Effect Size (Rank-Biserial Correlation, r_b): 0.9981    | Effect Magnitude: Near-Deterministic / Huge  |
+---------------------------------------------------------------------------------------------------------+
```

### Table 9
*Weighted Median Length of Stay and Distributional Metrics by Inpatient Admission Status (H2)*

| Disposition Cohort | Encounters Represented | Percentage of Volume (%) | Weighted Median LOS (Minutes) | Weighted Median LOS (Hours) | Interquartile Range (IQR, Minutes) |
| :--- | --: | --: | --: | --: | :--- |
| **Non-Admitted (Discharged / Outpatients)** | 157,615,553 | 89.75% | 150.0 | 2.50 | 90.0 – 228.0 |
| **Inpatient Admitted (Inpatient / ICU Wards)** | 18,004,220 | 10.25% | 636.0 | 10.60 | 420.0 – 912.0 |
| **Total Analytical Sample** | **175,619,773** | **100.00%** | **174.0** | **2.90** | **108.0 – 276.0** |

*Note.* $z = 6,952.46$, $p < .0001$, $r_b = 0.9981$.

### 5.2.3 Operational Interpretation: The Access Block Crisis
The statistical results confirm an extreme, near-deterministic operational divide ($r_b = 0.9981$). Admitted patients experience a weighted median emergency stay of **636.0 minutes (10.60 hours)**, compared to **150.0 minutes (2.50 hours)** for non-admitted patients—an absolute median gap of **8.10 hours (486.0 minutes)**. Admitted visits represent approximately 10.25% of total visit volume yet drive fundamentally different throughput requirements.

Because clinical stabilization rarely requires more than 3 to 4 hours, the remaining 6 to 7 hours represent pure **inpatient boarding delay** (access block), where admitted patients occupy emergency stretchers solely because staffed hospital beds on medical/surgical floors are full.

---

## 5.3 Hypothesis 3: Predictive Acuity Regression (Weighted Least Squares)

### 5.3.1 Research Question and Formal Hypotheses
Hypothesis 3 evaluates whether a standardized numeric CTAS urgency score linearly predicts reported median emergency department length of stay within an aggregate Weighted Least Squares (WLS) regression framework.

- **Null Hypothesis ($H_0$):** The linear regression slope between CTAS urgency score and median LOS is zero ($\beta_1 = 0$; no linear relationship).
- **Alternative Hypothesis ($H_1$):** The linear regression slope is significantly different from zero ($\beta_1 \neq 0$).

### 5.3.2 Model Parameter Estimates and Goodness-of-Fit
WLS regression was executed on `ctas_triage` ($n = 760$ aggregate strata) using `ed_visits` as analytic diagonal weights ($W_{ii} = \text{ed\_visits}_i$).

$$\hat{Y}_i = \hat{\beta}_0 + \hat{\beta}_1 \cdot \text{CTAS\_Urgency\_Score}_i$$

```
+---------------------------------------------------------------------------------------------------------+
|                                    HYPOTHESIS 3 WLS REGRESSION SUMMARY                                  |
+---------------------------------------------------------------------------------------------------------+
|  Model Formula: Median_LOS_Min = 511.47 - 115.72 * CTAS_Urgency_Score                                   |
|  Slope Estimate (β1): -115.72 min / level | Standard Error (SE): 6.18 min | t-statistic: -18.72         |
|  Intercept Estimate (β0): 511.47 min      | Standard Error (SE): 14.85 min| t-statistic: 27.21          |
|  Weighted R-Squared (R²): 0.3162          | Adjusted R-Squared: 0.3153    | F-Statistic: 350.4 (p<.0001)|
|  Total Aggregate Strata (n): 760          | Total Weighted Visits (N): 174,207,395                      |
+---------------------------------------------------------------------------------------------------------+
```

### Table 10
*WLS Regression Model Parameter Estimates for Predicting Median ED LOS from CTAS Urgency Score (H3)*

| Model Parameter | Unstandardized Coefficient ($\beta$) | Standard Error ($SE$) | 95% Confidence Interval | $t$-Statistic | $p$-value |
| :--- | --: | --: | :--- | --: | :--- |
| **Intercept ($\beta_0$)** | 511.47 | 14.85 | [482.31, 540.63] | 27.21 | $< .0001$ |
| **CTAS Urgency Score ($\beta_1$)** | -115.72 | 6.18 | [-127.85, -103.59] | -18.72 | $< .0001$ |

*Note.* Dependent variable: `median_length_of_stay_min`. Predictor variable: `ctas_urgency_score` (1=Resuscitation, 2=Emergent, 3=Urgent/Less Urgent/Non-Urgent). $R^2 = 0.3162$, $F(1, 758) = 350.40$, $p < .0001$.

### 5.3.3 Analytical and Methodological Evaluation
The model confirms a highly significant inverse linear relationship ($t = -18.72$, $p < .0001$). For each 1-unit increase in the CTAS numerical score (representing a decrease in clinical urgency), the reported median emergency length of stay decreases by **115.72 minutes ($\approx 1.93$ hours)**. The model accounts for **31.62% of aggregate length of stay variance ($R^2 = 0.3162$)**.

*Methodological Limitation Note:* Because the feature mapping collapses CTAS III, IV, and V into score level 3, the linear predictor distinguishes only three discrete acuity levels. This creates slight residual clustering at score level 3, which is addressed in practice by using the full non-parametric Kruskal–Wallis model (H1) for operational planning.

---

## 5.4 Hypothesis 4: Demographic Age Cohort Disparities (Weighted Kruskal–Wallis)

### 5.4.1 Research Question and Formal Hypotheses
Hypothesis 4 investigates whether reported median emergency department length of stay varies significantly across broad life-stage age cohorts.

- **Null Hypothesis ($H_0$):** Median ED length of stay is identical across all four broad age groups ($\mu_{R_{\text{Ped}}} = \mu_{R_{\text{Young}}} = \mu_{R_{\text{Middle}}} = \mu_{R_{\text{Old}}}$).
- **Alternative Hypothesis ($H_1$):** At least one age category exhibits a statistically different median length of stay distribution.

### 5.4.2 Statistical Results and Post-Hoc Comparisons
The weighted Kruskal–Wallis test was conducted on `age_sex` across 152 aggregate strata representing $N = 175,762,944$ encounters.

```
+---------------------------------------------------------------------------------------------------------+
|                                    HYPOTHESIS 4 OMNIBUS TEST SUMMARY                                    |
+---------------------------------------------------------------------------------------------------------+
|  Test Type: Weighted Kruskal-Wallis H-Test across 4 Life-Stage Cohorts                                  |
|  Population Sample Size (N): 175,762,944 visits          | Total Strata (k): 4 groups (152 rows)        |
|  Kruskal-Wallis Test Statistic (H): 126,863,835.84       | Degrees of Freedom (df): 3                   |
|  Asymptotic p-value: < .0001                             | Statistical Decision: REJECT NULL HYPOTHESIS |
|  Omnibus Effect Size (Epsilon-Squared, ε²): 0.7218        | Effect Magnitude: Exceptionally Large        |
+---------------------------------------------------------------------------------------------------------+
```

### Table 11
*Weighted Dunn Post-Hoc Pairwise Comparisons Across Age Categories with Bonferroni Adjustment (H4)*

| Comparison Pair (Age Group A vs. Age Group B) | Group A Weighted Median | Group B Weighted Median | Standardized $z$-score | Adjusted $p$-value ($p_{\text{adj}}$) | Statistical Decision |
| :--- | :--- | :--- | --: | :--- | :--- |
| **Pediatric (0–19) vs. Young Adult (20–44)** | 123.0 min (2.05 h) | 152.0 min (2.53 h) | -3,140.22 | $< .0001$ | Statistically Significant |
| **Pediatric (0–19) vs. Middle Adult (45–64)** | 123.0 min (2.05 h) | 172.0 min (2.87 h) | -6,820.45 | $< .0001$ | Statistically Significant |
| **Pediatric (0–19) vs. Older Adult (65+)** | 123.0 min (2.05 h) | 250.0 min (4.17 h) | -10,888.76 | $< .0001$ | Statistically Significant |
| **Young Adult (20–44) vs. Middle Adult (45–64)** | 152.0 min (2.53 h) | 172.0 min (2.87 h) | -4,210.15 | $< .0001$ | Statistically Significant |
| **Young Adult (20–44) vs. Older Adult (65+)** | 152.0 min (2.53 h) | 250.0 min (4.17 h) | -9,450.30 | $< .0001$ | Statistically Significant |
| **Middle Adult (45–64) vs. Older Adult (65+)** | 172.0 min (2.87 h) | 250.0 min (4.17 h) | -5,890.62 | $< .0001$ | Statistically Significant |

*Note.* All 6 pairwise comparisons ($m = 6$) are statistically significant at $p_{\text{adj}} < .0001$ following Bonferroni correction ($p_{\text{adj}} = \min(1.0, \, p \times 6)$).

### 5.4.3 Operational Interpretation: The Geriatric Throughput Penalty
The analysis demonstrates an exceptionally large demographic effect ($\varepsilon^2 = 0.7218$). Older adults (65+) experience a weighted median emergency stay of **250.0 minutes (4.17 hours)**—more than double that of pediatric patients (123.0 minutes / 2.05 hours). Young Adults record 152.0 minutes (2.53 hours) and Middle Adults 172.0 minutes (2.87 hours). This prolonged duration reflects the clinical reality of geriatric emergency care: atypical symptom presentations, extensive cognitive and functional evaluations, and higher rates of diagnostic imaging.

---

## 5.5 Hypothesis 5: Sex vs. Admission Disposition Independence (Pearson Chi-Square)

### 5.5.1 Research Question and Formal Hypotheses
Hypothesis 5 evaluates whether an empirical association exists between patient biological sex and final emergency visit disposition (inpatient admission vs. non-admission).

- **Null Hypothesis ($H_0$):** Patient biological sex and visit disposition are statistically independent ($O_{ij} = E_{ij}$).
- **Alternative Hypothesis ($H_1$):** Patient biological sex and visit disposition are statistically dependent.

### 5.5.2 Contingency Analysis and Effect Size
The test was conducted on `visit_disposition` cross-tabulating biological sex against admission status ($N = 175,762,944$ encounters).

```
+---------------------------------------------------------------------------------------------------------+
|                                    HYPOTHESIS 5 CHI-SQUARE TEST SUMMARY                                 |
+---------------------------------------------------------------------------------------------------------+
|  Test Type: Pearson's Chi-Square Test of Independence (2x2 Contingency Matrix)                          |
|  Total Encounters Analyzed (N): 175,762,944 visits       | Degrees of Freedom (df): 1                   |
|  Pearson Chi-Square Statistic (χ²): 18,164.97            | Asymptotic p-value: < .0001                  |
|  Effect Size (Cramér's V): 0.0102                        | Effect Magnitude: NEGLIGIBLE / TRIVIAL       |
|  Statistical Decision: REJECT NULL HYPOTHESIS            | Operational Decision: NO PRACTICAL EFFECT    |
+---------------------------------------------------------------------------------------------------------+
```

### Table 12
*Cross-Tabulation Contingency Matrix of Biological Sex by Admission Disposition (H5)*

| Biological Sex | Non-Admitted Encounters ($n$, %) | Inpatient Admitted Encounters ($n$, %) | Total Encounters Represented | Observed Admission Rate (%) |
| :--- | --: | --: | --: | --: |
| **Female Encounters** | 81,930,996 (90.1%) | 9,048,750 (9.9%) | 90,979,746 | 9.94% |
| **Male Encounters** | 75,827,728 (89.4%) | 8,955,470 (10.6%) | 84,783,198 | 10.56% |
| **Total Population** | **157,758,724 (89.8%)** | **18,004,220 (10.2%)** | **175,762,944** | **10.24%** |

*Note.* $\chi^2(1, N = 175,762,944) = 18,164.97$, $p < .0001$, Cramér's $V = 0.0102$.

### 5.5.3 Statistical Significance vs. Practical Significance
Hypothesis 5 represents a textbook illustration of **sample size-induced statistical significance** (Lin et al., 2013). Because the sample size encompasses approximately 175.8 million encounters, the chi-square test detects trivial proportional differences ($9.94\%$ female admission rate vs. $10.56\%$ male admission rate) as statistically significant at $p < .0001$. 

However, the effect size is completely negligible (**Cramér's $V = 0.0102$**, far below the 0.10 threshold for a weak effect). The absolute difference in admission rates is approximately 0.62 percentage points—within the range of reporting variation and demographic confounds. From a health administration standpoint, **biological sex is not an operationally meaningful determinant of emergency admission**. Healthcare planners should not allocate flow pathways based on sex.

---

## 5.6 Synthesis of Empirical Hypothesis Results

### Table 13
*Master Synthesis of Empirical Statistical Hypothesis Testing Results (H1–H5)*

| ID | Focus Area | Statistical Method | Test Statistic & $df$ | $p$-value | Effect Size Metric | Effect Magnitude | Statistical Decision | Practical / Clinical Implication |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1** | Triage Acuity vs. LOS | Weighted Kruskal–Wallis & Dunn-Bonferroni | $H = 126,319,368.24$, $df=4$ | $< .0001$ | $\varepsilon^2 = 0.7251$ | Large | Reject $H_0$ | CTAS II exhibits peak stay (4.80 h); CTAS I is 4.60 h; CTAS IV/V suitable for rapid fast-track streams. |
| **H2** | Inpatient Admission Bottleneck | Weighted Mann–Whitney $U$ Test | $U = 2.69 \times 10^{12}$, $z = 6,952.46$ | $< .0001$ | $r_b = 0.9981$ | Near-Deterministic | Reject $H_0$ | Admitted stays (10.60 h) are 4.24x non-admitted stays (2.50 h); bed block is the primary system bottleneck. |
| **H3** | Acuity Predictive Regression | Weighted Least Squares (WLS) Regression | $\beta_1 = -115.72$, $t = -18.72$ | $< .0001$ | $R^2 = 0.3162$ | Moderate ($31.6\%$ variance) | Reject $H_0$ | Each 1-unit decrease in urgency reduces median stay by 1.93 hours; valid macro planning proxy. |
| **H4** | Age Cohort Disparities | Weighted Kruskal–Wallis & Dunn-Bonferroni | $H = 126,863,835.84$, $df=3$ | $< .0001$ | $\varepsilon^2 = 0.7218$ | Large | Reject $H_0$ | Older adults sustain longest stays (4.17 h); demands dedicated geriatric emergency protocols. |
| **H5** | Biological Sex vs. Admission | Pearson Chi-Square ($\chi^2$) Test | $\chi^2 = 18,164.97$, $df=1$ | $< .0001$ | Cramér's $V = 0.0102$ | Negligible / Trivial | Reject $H_0$ | Statistically significant due to massive $N$; no practical operational relevance for flow design. |

*Note.* All analyses executed on SQLite `healthcare.db` using visit-count analytic frequency weights ($N \approx 175.8\text{M}$).
