# Capstone Final Report

## Explanatory and Predictive Analytics of Emergency Department Length of Stay and Resource Utilization Trends in Canadian Hospitals

**Course:** DAMO 699 – Capstone Project
**Program:** Master of Data Analytics

**Rajbharath P** (NF1016766)
**Sufyaan Khan Mohammed** (NF1017047)
**Amit Raj Dev** (NF1021076)

**Group No:** 5
**Supervisor:** Dr. Bilal El Toufaili
**Institution:** University of Niagara Falls
**Date:** 6th September 2026

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Chapter 1: Problem Analysis and Strategic Context](#chapter-1-problem-analysis-and-strategic-context)
- [Chapter 2: Analytics Lifecycle and Project Methodology](#chapter-2-analytics-lifecycle-and-project-methodology)
- [Chapter 3: Data Collection, Inventory and Preparation](#chapter-3-data-collection-inventory-and-preparation)
- [Chapter 4: Exploratory Data Analysis and Descriptive Profiling](#chapter-4-exploratory-data-analysis-and-descriptive-profiling)
- [Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference](#chapter-5-statistical-hypothesis-testing-and-diagnostic-inference)
- [Chapter 6: Time-Series Trend Analysis and Throughput Forecasting](#chapter-6-time-series-trend-analysis-and-throughput-forecasting)
- [Chapter 7: Data Visualization and Decision Support Systems](#chapter-7-data-visualization-and-decision-support-systems)
- [Chapter 8: Findings, Synthesis, and Critical Discussion](#chapter-8-findings-synthesis-and-critical-discussion)
- [Chapter 9: Strategic Recommendations and Implementation Roadmap](#chapter-9-strategic-recommendations-and-implementation-roadmap)
- [References](#references)
- [Appendix A: System Validation and Testing Evidence](#appendix-a-system-validation-and-testing-evidence)
- [Appendix B: Rubric Alignment Checklist](#appendix-b-rubric-alignment-checklist)
- [Appendix C: Analytics Lifecycle Evidence Log](#appendix-c-analytics-lifecycle-evidence-log)

---

## Executive Summary

Nearly 20 years ago, EDs began to receive an increasing number of patients, and length of stay has increased with the number of patients. Hospital and health-system executives who are tasked with handling this strain are often left to compare raw annual averages instead of defensible data, making it hard to discern throughput's impact on clinical acuity, inpatient bed access and patient population. This Capstone project does do that by using a complete data analytics lifecycle to an aggregated reporting data set published by the Canadian Institute for Health Information (CIHI) over the 19 fiscal years from FY 2003-2004 to FY 2021-2022 under the National Ambulatory Care Reporting System (NACRS). The compiled analytical data has 10,685 aggregate reporting rows, which correspond to about 175.8 million emergency department encounters.

Since the various figures in CIHI are published as pre-aggregated stratum summaries and due to the high right skew of the length of stay figures, the analysis used frequency weighted, non-parametric statistical methods instead of classical, parametric tests. Visit counts for each reporting stratum are used within custom mid-rank algorithms and thus each hypothesis test represents a true number of visits, not five hundred vs. 1.5 million.

The empirical work is based on five pre-registered hypotheses. The median length of stay varies significantly by the five levels of the Canadian Triage and Acuity Scale (CTAS) (H = 126,319,368.24, df = 4, p < .0001, ε² = 0.73): presentations in CTAS II (Emergent) category had the longest length of stay at 4.80 hours, followed closely by those in CTAS I (Resuscitation) at 4.60 hours. The most dramatic difference between admission status and any other is seen for inpatient admissions, who spend a weighted median of 10.60 hours in the ED as opposed to 2.50 hours for patients discharged or transferred (U ≈ 2.69 × 10¹², rb = 0.998) — this is nearly deterministic. An analysis of the standardized CTAS urgency score confirms that it is an independent predictor of median length of stay (β₁ = −115.72 minutes per level, R² = 0.316), and a weighted Kruskal–Wallis test reveals that older adults (65 and older) have the highest median length of stay (4.17 hours, ε² = 0.72) among all age cohorts.

However, biological sex is statistically associated with admission status due to the very large sample size (χ² = 18,164.97, p < .0001), but the effect is essentially null (Cramér's V = 0.010) and would not be used to inform flow design.

Longitudinal analysis revealed a significant increase in the number of visits over the study period (Mann–Kendall z = 5.60, p < .0001; Simple Exponential Smoothing forecasted a five-year increase of visit volumes to a stable level of ~12.95 million visits per year with a 95% prediction interval of 5.9–20.0 million visits per year at five years out). A derived Estimated Resource Burden Index (ERBI) that accounted for both acuity and duration of visits also increased over the same time (τ = 0.977), suggesting an increase in strain on the system rather than just the number of visits.

In aggregate, the results suggest three structural factors that contribute to emergency throughput delay: complexity of diagnosis at CTAS II level; access to inpatient beds; and the disproportionate impact of older age. This report ends with a series of phased implementation ideas, fast-track pathways for low-acuity patients, inpatient discharge-flow ideas and ongoing analytics governance, which offer an evidence-based foundation for hospital and health-system leaders to begin reducing length of stay.

---

## Chapter 1: Problem Analysis and Strategic Context

### 1.1 The Canadian Emergency Care Landscape

Emergency departments are a particularly vulnerable part of the Canadian publicly funded health care system. The Canada Health Act requires that all hospital emergency departments admit, treat and stabilize every person, whether they are able to afford the care or whether their presentation is complex. Approximately 15 million of these visits take place each year in the ten provinces and three territories, and this number has been increasing, despite a rapidly aging population, fewer primary care physicians and low hospital bed ratios compared to other developed health systems, among other factors (OECD 2023). This project is based on data from the Canadian Institute for Health Information (CIHI) which coordinates the resulting data via the National Ambulatory Care Reporting System (NACRS).

### 1.2 Access Block and Mechanics of Length of Stay

According to CIHI, the length of stay is the length of time between registration at triage and actual discharge from the ED. The single interval represents a collection of different clinical phases: waiting to be seen, physician evaluation and diagnostic investigation, disposition decision, and, when patients are admitted, the waiting for an inpatient bed. Overcrowding is not a problem within the ED per se, but rather a sign of a capacity issue in the hospital, and access block — where patients are accepted for admission but cannot leave the ED as no beds are available — is the main driver of overcrowding (Canadian Institute for Health Information, 2024; Affleck et al., 2013; Li et al., 2026). The downstream effects are documented in the health-services literature, and include increased mortality rates for boarded patients with time-sensitive diseases like sepsis, myocardial infarction or stroke; delayed antibiotic treatment and imaging; higher rates of patients leaving without care from which they will later deteriorate; and increased burn-out among emergency physicians and nurses from the delay in offloading ambulances (Pines et al., 2009; Singer et al., 2011; Carter et al., 2014). These impacts have been monitored using the national wait-time reporting system for over a decade but have not been addressed with a structural solution (Canadian Institute for Health Information, 2025). These impacts are not uniform in the system. Hospitals with a high proportion of high acuity and inpatients, or in larger urban areas, exhibit the worst boarding times and community and regional hospitals are more likely to have bottlenecks earlier in the visit due to staffing. There are two distinct patterns that are identified in the aggregate national data presented here, although the supplementary tables analyzed in this project lack facility identifiers to allow for the separation of these two patterns.

### 1.3 Problem Statement

Health administrators often use unweighted annual averages that mask the underlying case mix, although length of stay is important and is used to measure the operational importance of the service. Comparing a reporting stratum that spans just a few visits to a stratum that covers the entire annual volume of visits for a metropolitan area is not the same and doesn't provide a valid comparison across a range of acuity tiers, disposition categories, or age categories. If there is no consistent framework for measuring throughput using a population-weighted analytical approach, planners will not be able to distinguish the effect of triage acuity from the effect of inpatient admission on throughput, nor be able to predict future capacity needs. This project constructs that framework from the published aggregate tables from CIHI, and tests a specific set of hypotheses, not just descriptive impressions.

### 1.4 Objectives and Scope

The goals of this work are to quantify the relationship between the acuity of triage and length of stay, isolate the impact of admission on total length of stay, test the ability of a numeric CTAS urgency score to predict length of stay, identify which age groups contribute to length of stay, determine whether there is a meaningful relationship between biological sex and the likelihood of admission, characterize the 19-year trend in demands, generate a 5-year forecast of demands, and build a composite index that accounts for cumulative resource utilization, not just the number of visits.

The analysis is limited to six CIHI NACRS supplementary tables that included approximately 175.8 million visits across FY 2003–2004 to FY 2021–2022, and does not include individual patient records, hospital-level or geographic identifiers, causal clinical inference, cost or staffing data, which are not included in the source tables. Each of the supplementary tables provides a summary of the stratum level data, not microdata for individual cases, so all of the statistical models in this report are explicitly frequency weighted by number of visits, and any conclusions drawn are made at the system level, not on a per-patient basis.

### 1.5 Canonical Hypothesis Registry

Before choosing statistical computing methods, five formal hypotheses (Table 1) were pre-registered to assess, so that the results of all the tests reported in Chapter 5 were not selected ad hoc after looking at the data.

**Table 1 — Canonical Hypothesis Registry**

| ID | Research Question | Null Hypothesis | Method |
|---|---|---|---|
| H1 | CTAS acuity tier vs. median LOS | Median LOS equal across all five tiers | Weighted Kruskal–Wallis + Dunn |
| H2 | Admission status vs. median LOS | Median LOS equal for admitted/non-admitted | Weighted Mann–Whitney U |
| H3 | CTAS urgency score vs. median LOS | Regression slope β₁ = 0 | Weighted Least Squares regression |
| H4 | Age cohort vs. median LOS | Median LOS equals four cohorts | Weighted Kruskal–Wallis + Dunn |
| H5 | Sex vs. admission disposition | Sex and disposition are independent | Pearson Chi-Square + Cramér's V |

---

## Chapter 2: Analytics Lifecycle and Project Methodology

### 2.1 A Ten-Stage Analytics Lifecycle

The project is based on the following ten stages of the analytics lifecycle, which is similar to the one commonly used in the healthcare operations context (Provost & Fawcett, 2013): the phases encompass business and data understanding, ingestion, cleaning, pre-registration of the hypothesis, statistical computation, diagnostic validation, interpretation and governance and reproducibility. Each of the stages is summarized in Table 2 along with the primary activity and the product.

**Table 2 — Analytics Lifecycle Stages**

| Stage | Core Activity | Primary Output |
|---|---|---|
| 1. About Project | Presents the project overview, clinical problem statement, academic framework, and five pre-specified hypotheses. | Project overview, problem statement, and hypothesis framework |
| 2. Prep & Quality Engine | Performs unit harmonization, deduplication, schema validation, and cohort cleaning. | Cleaned and validated analytical dataset |
| 3. Dataset Explorer | Enables interactive exploration of cohorts across triage acuity, life-stage groups, and 19 fiscal years. | Interactive cohort and dataset exploration |
| 4. Hypothesis Testing & Statistics | Evaluates H1–H5 using Kruskal–Wallis, Mann–Whitney U, WLS regression, Dunn post-hoc testing, and ERBI forecasting. | Statistical results, effect sizes, and forecasting outputs |
| 5. Executive Dashboard | Provides KPI cards, interactive custom visualizations, the H1–H5 visual suite, and operational charts. | Interactive decision-support dashboard |
| 6. Strategic Insights | Translates analytical findings into an executive decision matrix, policy recommendations, and hospital capacity-planning directives. | Strategic recommendations and decision matrix |
| 7. Reports & Export | Provides a comprehensive audit trail, methodology documentation, and PDF executive-summary dossier exports. | Audit documentation, methodology reports, and PDF executive summary |

### 2.2 Why Non-Parametric Methods

Classical inferential tests — the independent t-test, ordinary least squares regression, and one-way ANOVA — assume normally distributed, homoscedastic residuals (Field, 2018). The distribution of length of stay in the ED is highly right-skewed and the variance in length of stay varies by an order of magnitude from cases handled in the ED that are not urgent, to those that are admitted or critically ill. The size of reporting strata also differs widely, ranging from regional numbers to aggregates up to a million visits for the metros. Because of these considerations, distribution-free rank-based procedures were used, including a frequency-weighted Kruskal–Wallis H-test and Dunn post-hoc comparisons for three-or-more-group comparisons (H1 and H4); a frequency-weighted Mann–Whitney U-test with a rank-biserial correlation for two-group comparisons (H2); weighted least squares regression for H3, correcting for heteroscedastic variance by weighting each stratum according to the number of visits; and Pearson's chi-square test with a Cramér's V effect size for the categorical association (H5) (Conover, 1999; Tomczak & Tomczak, 2014). Each non-parametric test is embedded in a custom mid-rank algorithm with an explicit frequency weight equal to the stratum-level visit count. For a pooled set of strata, a population mid-rank is assigned to each distinct length-of-stay (LOS) value equal to the cumulative weight for the strata that come before it plus half of the weight of the current stratum value, and group rank sums are calculated based on those weighted mid-ranks:

```
H = [12 / (N(N+1))] · Σⱼ (Rⱼ² / nⱼ) − 3(N + 1)
```

where N is the total weighted sample size, k is the number of groups, Rⱼ is the weighted rank sum for group j, and nⱼ is the total weight of group j. A stratum of 1.5 million visits will count proportionately more in the rank sums than, say, a stratum of five hundred, eliminating the aggregation bias an unweighted test would introduce and allowing the statistics to reflect the population of about 175.8 million visits (not the number of rows reporting).

This weighting choice is a methodological dividend: if it were not used, a five-year total for a rare presenting complaint in a sparse stratum (such as a rural facility) would have the same effect on a rank sum as a large stratum such as a metropolitan facility with more than a million encounters. The increase in CIHI's reporting coverage over the study window also translates to an unweighted design implicitly giving more weight to later years that are better reported than earlier years in all longitudinal comparisons in this report, thus favoring more recent years. This distortion is eliminated at the source by explicit frequency weighting, rather than being corrected post hoc.

### 2.3 Protection from the Ecological Fallacy

Since CIHI does not report patient information as part of its summary publications, all findings reported in this document reflect system-level performance and are not clinical outcomes. A warning, pointed out by Robinson (1950), against the ecological fallacy — that is, extrapolating an association at the level of the group to the level of the individuals — applies here: a stratum of older patients with a longer median stay does not mean that every older patient will have a longer stay than every younger patient.

There are three safeguards which keep the analysis in its appropriate epistemic limits. First, the findings are reported at the cohort or stratum level and not at the individual level. Second, statistical models are treated as planning and resource-allocation tools, not as aids for clinical decisions on any new patient who arrives. Third, each median reported in this report is followed by an interquartile range (IQR) to preserve information about variability within each group instead of obscuring it by merely reporting a point estimate.

---

## Chapter 3: Data Collection, Inventory and Preparation

### 3.1 Data Provenance

The empirical base for this project is a multi-sheet workbook of full-mandate reporting facilities, referred to as the CIHI NACRS Supplementary Data Tables for emergency department visits, 2003–2022, which focuses on emergency department visits in Ontario, Alberta and other reporting jurisdictions (Canadian Institute for Health Information, 2026). The two basic measures reported in each stratum in the source tables are: the number of registered emergency visits in a clinical/demographic category for a fiscal year, and the length of stay (in minutes) at the 50th percentile (median) in that category over a fiscal year. A Python pipeline reads each annual sheet, adjusts the headers to a uniform format across nineteen years of publication, and stores the result in a relational SQLite database.

### 3.2 Database Structure

The final database contains 8,685 aggregate rows in six tables, corresponding to approximately 175.8 million visits. The grain and scale of each table are summarized in Table 3.

**Table 3 — Database Structure**

| Table | Observation Grain | Rows | Encounters |
|---|---|---|---|
| ed_visits | FY × CTAS × Disposition × Problem | 5,586 | 175,812,409 |
| ctas_triage | FY × Sex × CTAS × Age Group | 912 | 174,207,395 |
| visit_disposition | FY × Sex × Disposition × Age Group | 936 | 173,984,112 |
| age_sex | FY × Sex × Age Group | 152 | 175,812,409 |
| main_problems | FY × Sex × Main Problem × Age Group | 1,063 | 168,490,215 |
| demographics | Age Group × Sex (cross-sectional) | 36 | 175,812,409 |

### 3.3 Cleaning and Quality Control

The various types of data-quality problems had to be dealt with explicitly and documented in an auditable way, covered in Table 4. Every query excluded summary rows (e.g. "Total" or "Any"), because including a summary row alongside the rows that compose it would double-count the underlying population. Numeric fields were cast to consistent types, but invalid values were not dropped — they were assumed to be equal to zero. Cells suppressed for privacy to protect small counts were kept in the database but excluded from any denominator, eliminating division-by-zero problems in the weights and preserving privacy.

Inconsistencies in the age-group labels between tables (one used a dash and the other a hyphen) were normalized to make cross-table joins possible without silent error. Rows with missing or "Not Stated" triage level or disposition were excluded from the primary hypothesis comparisons, because these rows do not represent a defined clinical group.

**Table 4 — Data-Quality Issues and Remediation**

| Issue Identified | Action Taken | Rationale |
|---|---|---|
| Roll-up rows ('Total', 'Any') | Excluded from every query | Prevents double-counting the population |
| Inconsistent header rows | Regex-based fiscal-year parser locates the data start | Reliable parsing across 19 years of formats |
| Mixed numeric types | Coerced to int64/float64; invalid values set to zero | Prevents silent computation failures |
| Suppressed small counts (n < 5) | Retained in the database; filtered from denominators | Preserves privacy without skewing weights |
| Inconsistent age-group encoding | Normalized dash and hyphen variants | Restores referential integrity across joins |
| 'Unknown' / 'Not Stated' categories | Excluded from H1, H2, and H4 comparisons | Preserves interpretability of pairwise tests |

### 3.4 Feature Engineering

The statistical models are derived from several engineered fields. Each fiscal-year label was converted to an integer for chronological ordering. Median length of stay was converted from minutes to decimal hours for readability. The bottom three CTAS levels were combined into one for the continuous predictor in the H3 regression, creating an urgency score of one (Resuscitation), two (Emergent), and three (Urgent, Less Urgent, Non-Urgent) — discussed later as a limitation. For the H4 comparison, detailed age groups were combined into four life-stage cohorts: 0–19 years, 20–44 years, 45–64 years, and 65 and above. A binary indicator was created for each disposition to flag whether it contains the substring "admit." Finally, an Estimated Resource Burden Index (ERBI) aggregates acuity, visit volume and visit duration into a single per-visit capacity measure weighted by acuity, detailed in Chapter 6.

### 3.5 Data Isolation and Reproducibility

The six baseline CIHI tables are loaded once at the start of the project and do not change during the project; for this reason, all hypothesis tests presented in this report can be reproduced using the same seed data for these six tables. A separate, session-specific upload pathway allows a user to explore their own Excel or CSV file without ever touching the baseline tables, preserving the integrity of the research cohort. All automated unit and integration tests of the cleaning pipeline and statistical solvers pass and are summarized in Appendix A, with approximately 300 tests.

---

## Chapter 4: Exploratory Data Analysis and Descriptive Profiling

### 4.1 Nineteen Years of Volume Growth

Annual visits increased from approximately 4.91 million in FY 2003-2004 to a peak of approximately 15.02 million in FY 2018-2019 (Table 5) before the pandemic hit — over a tripling of annual visits within 15 years. Some of this growth is attributable to actual increases in demand and some to growth in the number of facilities reporting to NACRS; the dramatic jump from 5.8 million to 8.2 million visits in FY 2010-2011 is actually driven by more facilities reporting to NACRS, not necessarily an increase in demand. Median length of stay (LOS) rose alongside the volume of cases, from 2.30 hours in FY 2003-2004 to 3.10 hours in FY 2018-2019, suggesting that system capacity did not rise in line with case volume even before the pandemic. The COVID-19 period saw a transient downturn of 17.8% in FY 2020–2021, with a decrease in low-acuity presentations but a simultaneous increase in median length of stay to 3.30 hours due to the increased proportion of severe presentations and infection-control measures. In FY 2021–2022, the median stay was 3.40 hours, representing a 20%+ year-on-year recovery in visits and the highest median stay on record. The relationship does not appear coincidental — each year with an increase in volume has a corresponding increase in median stay, and each year with a decrease in volume has a corresponding decrease in median stay (Table 5), consistent with an increase in the volume of more acute cases, not just congestion.

**Table 5 — ED Visit Volume and Median LOS by Benchmark Fiscal Year**

| Fiscal Year | Total ED Visits | Median LOS (Hours) |
|---|---|---|
| 2003–2004 | 4,906,394 | 2.30 |
| 2007–2008 | 5,680,941 | 2.53 |
| 2010–2011 | 8,171,651 | 2.70 |
| 2013–2014 | 10,614,350 | 2.85 |
| 2016–2017 | 13,290,440 | 3.00 |
| 2018–2019 | 15,023,099 | 3.10 |
| 2020–2021 | 11,622,444 | 3.30 |
| 2021–2022 | 13,992,029 | 3.40 |

### 4.2 Acuity and Admission Profiles

Table 6 shows length of stay by the 5 CTAS acuity levels using the standardized clinical triage instrument (Beveridge et al., 1998). The pattern is not as straightforward as "the sickest patients wait longest," as is the case with CTAS I: CTAS II patients have a longer median stay (4.80 hours) than CTAS I patients (4.60 hours), because CTAS I patients are quickly stabilized and transported to an intensive care unit, while CTAS II patients receive comprehensive medical evaluations, imaging, and specialist consultation before a disposition decision is made. The largest single tier — just over 41% of classified visits — is CTAS III.

**Table 6 — Length of Stay by CTAS Tier**

| CTAS Tier | Encounters | % of Volume | Median LOS (Hours) |
|---|---|---|---|
| CTAS I — Resuscitation | 1,286,555 | 0.74% | 4.60 |
| CTAS II — Emergent | 26,742,361 | 15.35% | 4.80 |
| CTAS III — Urgent | 72,100,128 | 41.39% | 3.40 |
| CTAS IV — Less Urgent | 58,990,020 | 33.86% | 1.90 |
| CTAS V — Non-Urgent | 15,088,331 | 8.66% | 1.33 |
| **Total** | **174,207,395** | **100.00%** | **2.90** |

This difference is even more pronounced when visits are separated by final disposition. The weighted median duration for patients admitted to inpatient beds (11.5% of total volume) is 10.60 hours, significantly longer than the weighted median duration for non-admitted visits (2.50 hours), and is responsible for more than a third of all cumulative stretcher time in the emergency department.

### 4.3 Age and Sex

Growth in the proportion of older adults visiting the hospital for surgical care (approximately 21%) is reflected in a longer median length of stay (4.17 hours) than any other age group (2.05 hours for pediatric and youth patients), and their inpatient case rate (14.7 per 100,000) is nearly seven times higher than that for pediatric patients (2.2 per 100,000) (Table 7). There is a two-minute difference between the duration of male and female encounters, which is not operationally significant alone but is compared against the admission status of the patient in Hypothesis 5.

**Table 7 — Length of Stay and Admission Rate by Age Category**

| Age Category | Encounters | % of Volume | Median LOS (Hours) | Admission Rate |
|---|---|---|---|---|
| Pediatric / Youth (0–19) | 38,908,652 | 22.13% | 2.05 | 4.2% |
| Young Adults (20–44) | 57,965,791 | 32.97% | 2.53 | 6.8% |
| Middle Adults (45–64) | 41,674,805 | 23.71% | 2.87 | 14.5% |
| Older Adults (65+) | 37,213,696 | 21.17% | 4.17 | 28.6% |

### 4.4 Clinical Case Mix

Presenting complaints fall into two general categories. High-volume, low-acuity categories — such as minor musculoskeletal injury — resolve quickly (usually less than 2 hours) and often without admission. The second group — chest pain and other cardiac presentations, mental health and substance-use crises, and acute respiratory or septic presentations — is high-acuity, high-duration, with median stays ranging from 4.7 to 5.8 hours, reflecting extensive diagnostics or, for mental health presentations, insufficient downstream psychiatric disposition options. This dual distribution motivates the fast-track and case-mix recommendations presented in Chapter 9.

Table 8 presents six verified presenting-problem categories selected from the `main_problems` table, sorted by presenting-problem visit volume, with weighted mean length of stay. This comparison illustrates why visit volume alone cannot measure operational burden: Trauma has by far the largest number of visits and a comparatively short mean stay, while Acute Myocardial Infarction has a much smaller number of visits but a much longer mean stay. The categories shown are a verified subset selected to compare high-volume and high-duration presentations and do not necessarily sum to the total reported volume.

**Table 8 — Presenting Problem Volume and Mean Length of Stay**

| Presenting Problem | Aggregate Visits | Weighted Mean LOS (Min / Hours) |
|---|---|---|
| Trauma | 31.50M | 131.4 min / 2.19 h |
| Unintentional Falls | 10.03M | 161.1 min / 2.68 h |
| Motor Vehicle Collisions | 2.73M | 150.1 min / 2.50 h |
| Pneumonia | 1.82M | 256.9 min / 4.28 h |
| Asthma | 1.22M | 160.9 min / 2.68 h |
| Acute Myocardial Infarction | 0.40M | 338.2 min / 5.64 h |

*Source: CIHI NACRS aggregate data (main_problems table); weighted project analysis.*

---

## Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference

### 5.1 Overview of the Hypothesis Testing Framework

In the hypothesis-testing phase, the main relationships found in the exploratory and methodological phases of the project are tested. The analysis relies on the processed aggregate dataset from CIHI in SQLite format and statistical methods that account for the frequency each aggregate record represents. Each record represents an aggregate stratum of patients and, where applicable, the number of emergency department visits per stratum is included as an analytic weight.

Five hypotheses were tested. H1 investigates whether reported median ED length of stay (ED LOS) differs across the five CTAS levels. H2 tests whether reported median ED LOS differs for admitted vs. non-admitted visits. H3 analyzes the predictive relationship of CTAS level, age group and visit disposition to reported median ED LOS using weighted least squares (WLS) regression. H4 compares reported median ED LOS across broad age groups. H5 explores whether there is a statistical relationship between patient sex and visit disposition. Statistical significance is measured at α = .05.

### 5.2 Hypothesis 1: Reported Median ED LOS Across CTAS Triage Levels

**Research Question:** *"How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?"*

The analysis evaluates all five clinical CTAS acuity tiers: CTAS I — Resuscitation, CTAS II — Emergent, CTAS III — Urgent, CTAS IV — Less Urgent, CTAS V — Non-Urgent.

**Hypotheses:**
- H₀: Reported median ED LOS is equal across all CTAS triage levels.
- H₁: At least one CTAS level has a different reported median ED LOS.
- α = .05

**Statistical Method:** The omnibus test is a weighted Kruskal–Wallis H test, since the analysis compares more than two independent groups and the LOS data do not meet classical parametric assumptions. A weighted Dunn post-hoc test follows, with Bonferroni correction over the 10 pairwise comparisons. Effect size is reported as epsilon-squared: ε² = (H − k + 1) / (N − k), where H is the Kruskal–Wallis statistic, k is the number of groups, and N is the weighted sample size. The frequency weight for each record is the number of ED visits.

**Results:**

| Statistic | Result |
|---|---|
| Kruskal–Wallis H | 35,510,138.077 |
| p-value | < 0.0001 |
| Effect size (ε²) | 0.7479 |
| Significant pairwise comparisons | 10 / 10 |

All 10 pairwise CTAS comparisons were statistically significant following Bonferroni correction.

**Reported Median ED LOS by CTAS Level:**

| CTAS Level | Reported Median ED LOS | IQR |
|---|---|---|
| Resuscitation | 3.20 hours | 2.0–4.3 hours |
| Emergent | 3.60 hours | 2.9–5.0 hours |
| Urgent | 3.70 hours | 2.7–5.5 hours |
| Less Urgent | 2.90 hours | 2.0–4.5 hours |
| Non-Urgent | 2.00 hours | 1.5–3.5 hours |

**Interpretation:** The findings show a statistically significant relationship between ED LOS and CTAS acuity. The large ε² value means this is not merely a statistically significant difference driven by a large underlying population — the grouping variable accounts for a substantial share of variation in the aggregate comparison. Acuity is not linearly related to duration: Urgent and Emergent categories have especially high reported median stays, while Non-Urgent stays are significantly shorter. **H₀ is rejected; H₁ is accepted.**

### 5.3 Hypothesis 2: Reported Median ED LOS for Admitted vs. Non-Admitted Visits

**Research Question:** *"Does reported median emergency department length of stay differ significantly between admitted and non-admitted visits?"*

The analysis compares two cohorts: **Admitted** (visits resulting in inpatient hospital admission) and **Non-Admitted** (discharged home, transferred, or otherwise departing prior to inpatient admission). Summary roll-up rows and non-informative Unknown categories are excluded.

**Hypotheses:**
- H₀: The distribution of reported median ED LOS is equal for admitted and non-admitted visits.
- H₁: Reported median ED LOS differs significantly between admitted and non-admitted visits.
- α = .05

**Statistical Method:** A weighted Mann–Whitney U test is used, since the analysis compares two independent groups with a non-parametric approach. Effect size is reported via rank-biserial correlation: rᵦ = 1 − 2U / (n₁n₂).

**Results:**

| Statistic | Result |
|---|---|
| Mann–Whitney U | 1,124,848,860,923.5 |
| p-value, two-sided | < 0.0001 |
| Rank-biserial correlation (rᵦ) | 0.9846 |
| Reported median difference | 6.100 hours |

**Reported Median ED LOS:**

| Visit Disposition | Reported Median ED LOS | IQR |
|---|---|---|
| Non-Admitted | 2.80 hours | 1.9–3.8 hours |
| Admitted | 6.10 hours | 4.1–8.3 hours |

**Interpretation:** There is strong evidence that admission status is associated with reported ED LOS. Median ED LOS for admitted patients is 6.10 hours vs. 2.80 hours for those not admitted — an extremely large rank-biserial correlation of 0.9846. This suggests inpatient admission is an operationally central dimension of ED throughput. **H₀ is rejected; H₁ is accepted.**

### 5.4 Hypothesis 3: Weighted Least Squares Regression of Reported Median ED LOS

**Research Question:** *"Do CTAS urgency score, age group, and visit disposition significantly predict reported median emergency department length of stay?"*

The regression model uses aggregate-level observations and incorporates the number of ED visits represented by each observation as an analytic weight. The dependent variable is aggregate group visit-weighted reported mean median ED LOS (hours). Predictors are encoded categorically, with reference groups: Age = Reference Cohort, CTAS = CTAS I — Resuscitation, Disposition = Admitted. The model has 9 predictors encoded into 10 observations. Adjusted R² = 0.8837.

**Regression Results:**

| Predictor | B (Hours) | SE | 95% CI Low | 95% CI High | p-value |
|---|---|---|---|---|---|
| CTAS: CTAS II – Emergent | 2.184 | 0.202 | 1.789 | 2.579 | < 0.0001 |
| CTAS: CTAS III – Urgent | 1.660 | 0.196 | 1.276 | 2.044 | < 0.0001 |
| CTAS: Less Urgent | 1.030 | 0.197 | 0.644 | 1.415 | < 0.0001 |
| CTAS: Non-Urgent | 0.680 | 0.213 | 0.262 | 1.098 | 0.0014 |
| Disposition: Death | −5.251 | 0.836 | −6.889 | −3.613 | < 0.0001 |
| Disposition: Discharged Home | −5.326 | 0.088 | −5.498 | −5.154 | < 0.0001 |
| Disposition: Intra-Facility Transfer | −4.700 | 0.433 | −5.548 | −3.853 | < 0.0001 |
| Disposition: Not Seen Or Left | −5.371 | 0.157 | −5.678 | −5.064 | < 0.0001 |
| Disposition: Transferred | −3.892 | 0.173 | −4.231 | −3.553 | < 0.0001 |

Intercept β₀ = 6.177 hours. Model's adjusted R² = 0.8837.

**Interpretation of CTAS Coefficients:** With CTAS I — Resuscitation as the reference group, all other CTAS coefficients are positive and significant: CTAS III — Urgent (+1.660 h), CTAS IV — Less Urgent (+1.030 h), CTAS V — Non-Urgent (+0.680 h). The disposition coefficients are negative because Admitted is the reference disposition: Death (−5.251 h), Discharged Home (−5.326 h), Intra-Facility Transfer (−4.700 h), Not Seen Or Left (−5.371 h), Transferred (−3.892 h) — all p < 0.0001, confirming the H2 finding that admission status is significantly related to ED stay duration.

**Model Interpretation:** The adjusted R² of 0.8837 indicates the fitted model accounts for a significant share of variance in the outcome at the aggregate level. Only aggregate strata records are captured, not individual-level inferences — regression coefficients describe relationships within the reporting structure, not patient-level effects. The model is evidence that, at the aggregate level, CTAS category and visit disposition are important predictors of reported median ED LOS.

### 5.5 Hypothesis 4: Reported Median ED LOS Across Broad Patient Age Categories

**Research Question:** *"Does reported median emergency department length of stay differ significantly across broad demographic age categories?"*

The platform compares four cohorts: Pediatric & Youth (0–19), Young Adult (20–44), Middle Adult (45–64), Older Adult (65+). Summary roll-up rows and unclassified Unknown records are excluded.

**Hypotheses:**
- H₀: Reported median ED LOS is equal across all broad age categories.
- H₁: At least one age category has a different reported median ED LOS.
- α = .05

**Statistical Method:** Weighted Kruskal–Wallis H-test followed by a weighted Dunn post-hoc test with Bonferroni adjustment. Effect size: epsilon-squared.

**Results:**

| Statistic | Result |
|---|---|
| Kruskal–Wallis H | 126,863,835.837 |
| p-value | < 0.0001 |
| Effect size (ε²) | 0.7218 |
| Significant pairwise comparisons | 6 / 6 |

**Reported Median ED LOS by Age Category:**

| Age Category | Reported Median ED LOS | IQR |
|---|---|---|
| Pediatric & Youth | 2.02 hours | 1.9–2.1 hours |
| Young Adult | 2.47 hours | 2.3–2.7 hours |
| Middle Adult | 2.73 hours | 2.6–3.0 hours |
| Older Adult | 4.01 hours | 3.7–4.2 hours |

**Interpretation:** The gap is particularly stark for older adults — median ED LOS of 4.01 hours vs. 2.02 hours for Pediatric & Youth. All 6 pairwise comparisons are significant, and ε² = 0.7218 indicates the age-group relationship is not only statistically significant but large. **H₀ is not accepted; H₁ is accepted.**

### 5.6 Hypothesis 5: Patient Sex and ED Visit Disposition Association

**Research Question:** *"Is there a statistically significant association between patient sex and visit disposition (admitted vs. non-admitted) in Canadian NACRS aggregate data?"*

The analysis uses a 2 × 2 contingency table (Rows: Female, Male; Columns: Non-Admitted, Admitted). Total aggregate visits analyzed: 175,762,944. Summary rows and unclassified categories are excluded.

**Hypotheses:**
- H₀: Patient sex and visit disposition are statistically independent.
- H₁: Patient sex and visit disposition are statistically associated.
- α = .05

**Statistical Method:** Pearson Chi-Square Test of Independence, with Cramér's V effect size: φc = √(χ² / (N × min(r−1, c−1))).

**Results:**

| Statistic | Result |
|---|---|
| Chi-square (χ²) | 18,164.97 |
| Degrees of freedom | 1 |
| p-value | < 0.0001 |
| Cramér's V | 0.0102 |

**Observed Contingency Table:**

| Patient Sex | Non-Admitted | Admitted | Sex Total |
|---|---|---|---|
| Female | 81,930,996 | 9,048,750 | 90,979,746 |
| Male | 75,827,728 | 8,955,470 | 84,783,198 |
| **Total** | **157,758,724** | **18,004,220** | **175,762,944** |

Female: 90.05% non-admitted, 9.95% admitted. Male: 89.44% non-admitted, 10.56% admitted. The difference in admission proportions is small despite the very large chi-square statistic.

**Interpretation:** The test rejects the null hypothesis of complete independence (p < 0.0001), but the magnitude of the association is extremely small (Cramér's V = 0.0102). With very large samples, even small differences can generate extremely large chi-square statistics and very small p-values. **H₀ is rejected statistically, but the association has negligible practical significance.** Patient sex should not be treated as a major operational variable for ED flow-design decisions based on this analysis.

### 5.7 Comparative Synthesis of Hypothesis Results

| Hypothesis | Statistical Test | Main Result | Effect Size | Interpretation |
|---|---|---|---|---|
| H1 | Weighted Kruskal–Wallis + Dunn | H = 35,510,138.077, p < .0001 | ε² = 0.7479 | Large CTAS-related difference |
| H2 | Weighted Mann–Whitney U | U = 1.125 × 10¹², p < .0001 | rᵦ = 0.9846 | Very strong admission-related difference |
| H3 | Weighted Least Squares | Adjusted R² = 0.8837 | — | Strong aggregate model fit |
| H4 | Weighted Kruskal–Wallis + Dunn | H = 126,863,835.837, p < .0001 | ε² = 0.7218 | Large age-related difference |
| H5 | Pearson Chi-Square | χ² = 18,164.97, p < .0001 | V = 0.0102 | Statistically significant but negligible association |

Three findings stand out. First, CTAS category is strongly associated with reported ED LOS (ε² = 0.7479, all pairwise comparisons significant). Second, visit disposition produces one of the clearest differences in reported ED LOS (median 6.10 h admitted vs. 2.80 h non-admitted, rᵦ = 0.9846). Third, age category has a substantial relationship with reported ED LOS (older adults 4.01 h vs. Pediatric & Youth 2.02 h, all six comparisons significant). In contrast, H5 illustrates why statistical significance must be interpreted alongside effect size — significant because of sample size, but Cramér's V = 0.0102 indicates a negligible association.

### 5.8 Statistical and Operational Implications

The combined hypothesis results provide an evidence base for prioritizing operational interventions. The first major signal is acuity-related variation — EDs should not evaluate throughput using a single overall LOS statistic alone. The second, particularly strong signal is visit disposition — the large admitted/non-admitted difference demonstrates that admission status is closely associated with ED duration, providing an analytical basis for examining inpatient capacity and patient-flow processes alongside ED operations. The third major signal is age-related variation — demographic composition is relevant when planning ED capacity and patient-flow resources. Finally, sex should not be prioritized as an operational flow variable — statistical significance alone does not establish operational importance.

### 5.9 Conclusion

The hypothesis-testing stage provides statistical evidence for several important relationships in Canadian emergency department aggregate data. H1 demonstrates significant and large differences in reported median ED LOS across CTAS triage categories. H2 identifies a particularly strong difference between admitted and non-admitted visits. H3 demonstrates that CTAS and visit disposition contribute substantially to explaining variation in aggregate reported median ED LOS within the WLS model. H4 establishes significant and large differences across broad patient age categories, with older adults showing the longest reported median stay. H5 identifies a statistically significant association between patient sex and disposition, but its negligible effect size indicates little practical operational relevance.

Overall, clinical acuity, admission disposition, and patient age are substantially more important analytical dimensions for understanding emergency department throughput than patient sex. Because the analysis is based on aggregate CIHI NACRS reporting strata rather than individual patient records, these findings are interpreted at the aggregate system level and should support capacity planning, operational analysis, and decision support rather than individual-level clinical decision-making.

---

## Chapter 6: Time-Series Trend Analysis and Throughput Forecasting

The longitudinal analysis looks at the Estimated Emergency Department Resource Burden Index (ERBI) over the nineteen-fiscal-year period of the CIHI NACRS study (FY 2003–2004 to FY 2021–2022). The aim is to assess whether the ED resource burden has a statistically significant trend over time and to estimate the future burden for coming fiscal years.

The Mann–Kendall non-parametric trend test was chosen because it does not assume a normally distributed pattern in the historical series and can detect monotonic changes over time without relying on a specific functional form. The resulting Kendall correlation is τ = 0.9766, p < .0001 — a statistically significant, strong positive monotonic trend in the ERBI series.

**Table 15 — Mann–Kendall Trend Analysis of the ERBI Series**

| Parameter | Value | Interpretation |
|---|---|---|
| Historical period | FY 2003–2004 to FY 2021–2022 | 19 fiscal years |
| Kendall's τ | 0.9766 | Very strong positive monotonic association |
| p-value | < .0001 | Statistically significant upward trend |
| FY 2003-2004 ERBI | 4.21 | Beginning of observed series |
| FY 2021-2022 ERBI | 8.33 | End of observed series |

ERBI grows steadily from about 4.21 in FY 2003-2004 to about 8.33 in FY 2021-2022, with year-to-year variation but a clearly rising trend that picked up pace during the pandemic years. The magnitude of the Kendall statistic shows this is not driven by one or two fiscal years but reflects a consistent, long-run upward trend, indicating a need for forward-looking forecasting in capacity and resource planning.

### 6.2 Holt's Linear Exponential Smoothing Forecast

The ERBI series was also subjected to Holt's Linear Exponential Smoothing for short-term forecasts, since it captures both the level and trend of the series (appropriate given the persistent directional movement observed, versus a simple level-only model). The forecast projects the nineteen-year ERBI series forward by two fiscal years.

**Table 16 — Two-Year ERBI Forecast**

| Fiscal Year | Forecast ERBI | 95% Prediction Interval |
|---|---|---|
| FY 2022–2023 | 8.65 | 6.91–10.39 |
| FY 2023–2024 | 8.98 | 6.84–11.12 |

Forecast values are planning estimates and should be updated as new CIHI aggregate data becomes available. ERBI increases from 8.33 in FY 2021–2022 to 8.65 in FY 2022–2023, with a further projected increase to 8.98 in FY 2023–2024, offering a forward-looking indicator for health-system leaders doing ED capacity planning. Importantly, these values are analytical planning estimates, not exact forecasts of actual future resource use.

### 6.3 Estimated Resource Burden Index

Visit volume alone does not necessarily reflect operational pressure, since a single visit may consume very different amounts of staff time, space, diagnostics and clinical resources — a larger number of short, low-acuity encounters can be a heavier operational load than a smaller number of high-acuity encounters with much longer duration. The Estimated Emergency Department Resource Burden Index (ERBI) combines reported median length of stay, an urgency weighting, and visit counts per reporting stratum, normalized by total visits to give an acuity-weighted patient-hour measure:

```
ERBIₜ = Σᵢ(urgencyᵢ × LOShours,ᵢ × visitsᵢ) / Σᵢ visitsᵢ
```

where `urgencyᵢ` is the implemented CTAS urgency weighting, `LOShours,ᵢ` is the reported median ED length of stay in hours, and `visitsᵢ` is the number of ED visits associated with the reporting stratum.

The historical ERBI series demonstrates significant growth over the last nineteen years, rising from 4.21 (FY 2003–2004) to 8.33 (FY 2021–2022), statistically significant per the Mann–Kendall analysis (τ = 0.9766, p < .0001). The distribution of resource burden among CTAS cohorts shows CTAS III — Urgent has the highest percentage of derived burden, due to the combination of visit volume and length of stay — illustrating that the most operationally demanding cohort is not necessarily the most acutely ill cohort, an important distinction for capacity planning.

### 6.4 Interpretations and Planning Implications

Three key implications follow from the longitudinal results:

1. **Statistically significant upward trend.** The Mann–Kendall test confirms a highly consistent increase in resource burden over the nineteen-year observation period (τ = 0.9766, p < .0001).
2. **The Holt forecast projects continuation.** ERBI is projected to rise from 8.33 (FY 2021–2022) to 8.65 (FY 2022–2023) and 8.98 (FY 2023–2024), suggesting pressure will not vanish immediately after the historical study period.
3. **ERBI captures more than visit counts.** Combining volume, acuity and duration reveals that two years with similar visit volume can have very different operational needs if acuity mix or length of stay shifts. Forecasts are planning estimates, not deterministic results, and ERBI is a project-specific analytical proxy — not a staffing or clinical-severity measure.

Governance implications: once new CIHI aggregate data is available, the series should be extended and the forecasting model recalculated, so planning decisions stay responsive to changes in ED demand, case mix, and reported length of stay.

---

## Chapter 7: Data Visualization and Decision Support Systems

### 7.1 Dashboard Architecture

The statistical output in this report is also presented in an interactive decision-support dashboard — a fully functional web application for both technical and non-technical audiences. The front end is built with React 19, TypeScript and Recharts for charting, and Vite for the build pipeline. The application is linked to a FastAPI backend exposing thirty-one REST endpoints on the same SQLite database used for the analytical report.

These endpoints include individual routes for each hypothesis test, the Mann–Kendall trend engine, the forecasting service, and the ERBI aggregation service. The architecture is decoupled, allowing queries to complete within 100 milliseconds or less, and ensures no data from the read-only baseline research cohort is mixed with any additional data uploaded by a user for exploratory analysis. There are separate dashboard views for each of the five hypothesis tests, longitudinal trend analysis, forecasting, and resource-burden analysis.

**Project Repository:** [github.com/Adwrells/Capstone_Project-DAMO-6994-](https://github.com/Adwrells/Capstone_Project-DAMO-6994-.git)

### 7.2 Hypothesis Testing Dashboard Views

**H1 — Reported Median LOS Across CTAS Triage Levels.** A weighted Kruskal–Wallis analysis as in Chapter 5. The live dashboard reports an effect size of around ε² = 0.725, in line with the large effect size reported in the statistical analysis; none of the 10 pairwise comparisons are non-significant after Bonferroni adjustment.

**H2 — Admission Status vs. Reported LOS.** The reported median difference between admitted and non-admitted LOS is 8.10 hours in the live view (admitted ≈ 10.60 h, non-admitted ≈ 2.50 h), with rank-biserial effect size rᵦ = 0.998 — confirming the admission bottleneck as the strongest structural cause of throughput delay found.

**H3 — CTAS Urgency Score Predicting Reported LOS.** A weighted least-squares regression view with bubble size symbolizing aggregate visit volume. The urgency score explains R² = 0.316 of the variation in reported LOS, showing acuity is significant but not the sole driver of duration.

**H4 — Age Group vs. Reported Length of Stay.** Live effect size ε² ≈ 0.722, indicating the age-group differences represent a large effect rather than an artifact of sample size, forming the empirical ground for the geriatric emergency-management recommendation in Chapter 9.

**H5 — Patient Sex vs. Visit Disposition.** The live dashboard reports admission proportions of ~9.9% (female) and ~10.6% (male) with Cramér's V ≈ 0.010, reinforcing that biological sex is not a meaningful basis for emergency-flow design.

### 7.3 Resource-Burden and Presenting-Problem Views

The ERBI visualization shows CTAS III — Urgent contributing about 52.3% of derived resource burden, driven by very large visit volume combined with significant length of stay, while the highest-acuity category (CTAS I) accounts for less than one percent of total derived burden despite its clinical urgency. The presenting-problem view echoes the Chapter 4 case-mix analysis: trauma and unintentional falls dominate ED volume, while less frequent presentations like acute myocardial infarction carry longer reported lengths of stay — illustrating the limits of volume rankings alone for capturing operational burden.

The ED Visit Volume by Fiscal Year view shows an overall increase of approximately 185.2% in annual visits (4.91M in FY 2003/04 to 13.99M in FY 2021/22), peaking at 15.08M in FY 2018/19, with a Mann–Kendall Z = 5.5977 (p < 0.001) and Sen's slope of ~550.9 thousand visits/year. The Reported Median LOS by Fiscal Year view shows a cumulative 51.6% increase (2.75 h in FY 2003/04 to 4.17 h in FY 2021/22), currently below the platform's 6.0-hour aggregate reference threshold.

### 7.4 Dashboard Audiences and Interaction Modes

The dashboard serves three main user groups. **Executive Users** get high-level KPI cards, a one-click export capability for board-level reporting, and an ERBI capacity gauge. **Clinical Operations and Bed Management** users see an acuity-flow matrix, presenting complaints ranked by duration, and alerts on boarded admissions exceeding eight hours. **Data Analysts** get the live hypothesis-testing suite, a forecasting sandbox (adjustable smoothing parameters), and a session-isolated upload portal for exploring additional data without touching the baseline.

### 7.5 Interactive Filtering and Decision Support

The visualization layer mirrors the analytical calculations in Chapters 4–6: the nineteen-year time series, CTAS and admission-status comparisons, WLS regression, forecasting view, and ERBI trajectory. Every visualization includes a description, labeled axes, a legend where needed, and hover-level detail down to individual reporting strata. A filter-scope panel lets the active dataset be limited by five dimensions — Fiscal Year, Patient Sex, Age Cohort, CTAS Acuity, and Disposition — alone or in combination, prior to creating a visualization.

### 7.6 Interactive Visual Studio and AI-Assisted Chart Design

The Interactive Visual Studio and AI Chart Designer assists users in building personalized analytical visuals for customizable healthcare and ED reports — choosing chart types, setting analytical dimensions and measures, adding overlays, and previewing before publishing to the dashboard. It recommends visualizations for the five hypothesis tests, ED visit volume over time, estimated resource burden, clinical profiling, and demographic analysis, and supports fourteen chart layouts (column, bar, line, area, pie, donut, radar, tree map, funnel, waterfall, heatmap, gauge, box plot, Sankey). It also generates explainable analytical insights alongside each visualization (e.g. identifying the fiscal-year cluster with the greatest visit volume) and a separate AI Visual Quality Assessment Scorecard evaluating color contrast, layout readability, category counts, and accessibility (WCAG AA) — a demonstrated configuration scored A+ with a 98% quality index.

---

## Chapter 8: Findings, Synthesis, and Critical Discussion

### 8.1 An Operational Triad

Across all five hypothesis tests and the longitudinal analyses, three structural factors are consistently the most significant contributors to variation in ED length of stay: diagnostic/clinical complexity, admission and downstream inpatient capacity, and patient age. H1 shows CTAS II and III groups have the longest reported stays (not the smallest, most critical resuscitation category), reflecting patients who undergo extensive diagnostic and treatment procedures. H2 shows the clearest separation of all — admitted patients spend a median of 6.10 hours vs. 2.80 hours for non-admitted patients (rᵦ = 0.9846) — supporting the interpretation that ED throughput is not a problem entirely internal to the ED, but that inpatient bed availability and downstream hospital capacity are central. H4 adds the demographic dimension: older adults have a significantly higher reported median stay (4.01 h) than any other age group, with ε² = 0.7218.

These are not three separate causes of ED congestion but different aspects of a single, system-level capacity battle: higher-complexity patients need more diagnostic and clinical resources, admitted patients occupy ED space while awaiting downstream placement, and older patients often need more complex assessment and disposition planning. The H3 regression reinforces this: combining CTAS, age group and disposition as predictors yields an adjusted R² of 0.8837, with disposition coefficients confirming H2's finding that admission status is a particularly salient driver of reported LOS. Finally, H5 illustrates the importance of separating statistical from operational significance — a highly significant chi-square result (χ² = 18,164.97) paired with a negligible effect size (Cramér's V = 0.0102) meaning sex has little practical importance for emergency-flow design in this very large dataset.

### 8.2 Comparison with Existing Literature

These findings align with the Canadian emergency-care literature, which frames ED overcrowding as a health-system problem rather than one internal to the ED alone. Prior Canadian studies point to access block and delayed inpatient placement as key crowding factors (Affleck et al., 2013; Li et al., 2026), reinforced here by the large H2 separation (rᵦ = 0.9846). The age findings are consistent with documented extra operational demands from older ED populations (median LOS 4.01 h vs. 2.02 h for Pediatric & Youth — a large effect, not a sample-size artifact). The H1 results add a further nuance: the highest clinical-acuity category does not always correspond to the highest aggregate throughput burden, since very high-acuity patients may be stabilized and disposed of quickly, while urgent/emergent patients often remain for extended investigation, consultation, and treatment. The H5 result is a textbook illustration of why very large administrative datasets require effect-size measures — a highly significant p-value can coexist with a practically negligible relationship (Lin, Lucas & Shmueli, 2013).

### 8.3 Methodological Strengths

The analysis benefits from several methodological strengths: (1) every visit-count observation is treated as a valid data point via frequency weighting, avoiding small strata being given the same statistical influence as large ones, keeping estimates closer to the true underlying population; (2) non-parametric methods (weighted Kruskal-Wallis, Mann-Whitney) are appropriate given the non-normal LOS distributions, with effect sizes reported alongside significance; (3) the H3 WLS model goes beyond a single-variable comparison, jointly modeling CTAS, age group and disposition with an adjusted R² of 0.8837; (4) the entire analytical process — from source-data preparation through database construction to statistical computation — is programmed and reproducible, backed by roughly 300 automated tests; and (5) the platform architecture strictly separates the read-only baseline research cohort from user-uploaded exploratory datasets, preserving the repeatability of the reported research results.

### 8.4 Limitations

The findings are limited by several factors. The greatest constraint is that the underlying CIHI data are aggregate stratum-level records, not individual patient observations — frequency weighting improves population representation but cannot convert aggregate records into patient-level records, so results should not be read as describing any given patient's typical LOS. The source tables also lack hospital-level or geographic identifiers, so the analysis cannot attribute patterns to specific facility types, provinces, or individual hospitals. The analysis is descriptive in nature: statistically significant relationships in H1–H5 show association, not causation — the admitted/non-admitted difference correlates strongly with LOS but cannot independently establish the mechanism behind it. The H3 regression similarly represents clinical complexity through categorical CTAS, age, and disposition variables rather than a full patient-level clinical model, and the source tables contain no outcome measures like mortality, readmission, or ICU transfer — the project measures throughput, LOS, admission, and resource burden, not clinical outcomes directly. The nineteen-year observation window may also reflect changing NACRS reporting coverage and facility participation alongside genuine demand changes, which the analysis cannot fully disentangle. Finally, the Estimated Resource Burden Index (ERBI) is an analytical planning proxy, not a validated clinical or financial metric, and should not be read as absolute staffing needs, cost, or clinically validated burden. None of these restrictions undermine the results, but they define the appropriate level of interpretation: the evidence is strongest as a system-level planning and decision-support process, not a single clinical prediction system.

---

## Chapter 9: Strategic Recommendations and Implementation Roadmap

### 9.1 Restating the Core Findings

The findings highlight three key operational levers hospital and health-system executives can deploy: clinical/diagnostic complexity, admissions and downstream capacity, and the disproportionate throughput demands of older adults. H1 shows CTAS III — Urgent (3.70 h) and CTAS II — Emergent (3.60 h) carry the longest reported median stays (ε² large). H2 shows a sharp operational split between admitted and non-admitted patients (rᵦ = 0.9846). H4 identifies older adults as a key intervention population (median LOS 4.01 h vs. 2.02 h for Pediatric & Youth, ε² = 0.7218). H5 shows sex is not operationally meaningful despite statistical significance (Cramér's V = 0.0102). The longitudinal ERBI signal (4.21 → 8.33, τ = 0.9766, p < .0001; forecast 8.65 and 8.98 for the next two fiscal years) reinforces that ED pressure is a multidimensional system problem. Recommendations are grouped by implementation time frame, from near-term operational interventions to longer-term structural and analytical governance.

### 9.2 Tiered Recommendations

**Fast-Track Pathways for Low-Acuity Presentations (Months 1–6).** CTAS IV/V patients make up a significant share of ED use but have significantly shorter reported LOS than higher-acuity groups. Potential interventions: dedicated rapid-assessment areas for CTAS IV/V; nurse-initiated assessment protocols; standardized procedures for common routine complaints; immediate referral to community/ambulatory services where clinically indicated; ongoing tracking of LOS and patients who leave without being seen. The aim is not to compromise care quality for lower-acuity patients, but to route them onto a pathway matched to their clinical needs instead of competing for acute-care resources.

**Bed-Management Reform within Inpatient Services (Months 6–18).** Since admission status is one of the strongest predictors of ED LOS (H2), interventions beyond the ED itself are needed. Potential interventions: daily hospital-discharge targets; a higher proportion of morning discharges (e.g. 30% of planned discharges completed before 11:00 a.m.); a staffed discharge lounge; real-time monitoring of inpatient bed availability; automated escalation alerts for extended ED boarding; admission-peak-aware flow planning. Goal: reduce the time admitted patients spend in ED spaces after the admission decision is made.

**Automated Bed-Tracking and Boarding Alerts (Months 12–18).** A bed-management component merging inpatient capacity data with ED boarding data — flagging patients who have completed the admission decision, monitoring their ED LOS, posting current inpatient bed availability, escalating long-boarding cases to a flow coordinator, and reporting aggregate boarding data operationally. Suggested escalation at four hours, further escalation at six hours, with thresholds refined based on observed performance.

**Geriatric Emergency Management (Months 18–36).** Given H4's finding that older adults have a significantly longer median LOS (4.01 h vs. 2.02 h), a dedicated pathway could include: rapid comprehensive geriatric assessment; nurse-led geriatric liaison services; early identification of functional and social-care needs; direct referral to community or sub-acute services; optimized diagnostic pathways where appropriate; early coordination between inpatient and community care providers; and review of potentially avoidable admissions.

**Ongoing Analytics Governance.** Since resource burden (ERBI) varies over time, governance should include regular monitoring of: median and higher-percentile ED LOS; admission-related boarding duration; CTAS-specific and age-specific LOS; patients leaving without being seen; ERBI and forecast accuracy; and variability in ED attendance. ERBI should be refreshed as new CIHI data becomes available, and always read alongside conventional operational measures rather than in isolation.

### 9.3 Strategic Implementation Roadmap

| Phase | Timeline | Intervention | Primary Success Measure | Responsible Role |
|---|---|---|---|---|
| 1 | Months 1–6 | Rapid-assessment zones for CTAS IV/V | Reduction in non-urgent median LOS | Clinical Director, Emergency Medicine |
| 2 | Months 6–18 | Discharge lounge and morning discharge target | ≥30% planned discharges before 11:00 a.m.; reduced boarding | VP Clinical Operations / CMO |
| 3 | Months 12–18 | Automated bed tracking and boarding alerts | Real-time bed visibility; prolonged boarding escalated | CIO / Flow Coordinator |
| 4 | Months 18–36 | Geriatric Emergency Management pathways | Reduction in older-adult median LOS | Director, Geriatric & Emergency Medicine |
| 5 | Ongoing | Enterprise ERBI monitoring and forecasting | Forecast performance and continuous burden monitoring | Lead Data Scientist / Quality Committee |

The roadmap intentionally sequences relatively simple operational interventions before more complex infrastructure work: Phase 1 separates low-acuity demand from acute-care resources; Phases 2–3 address the downstream inpatient-flow problem H2 identified as most severe; Phase 4 targets the older-adult population identified by H4; Phase 5 establishes continuous measurement and forecasting to confirm sustained improvement.

### 9.4 Measuring Implementation Success

Low-acuity pathways: median LOS for CTAS IV/V patients, time to initial assessment, percent of patients leaving without being seen. Inpatient-flow interventions: median time to admit-discharge, percentage of planned discharges completed before the morning target, percentage of ED beds occupied by admitted patients, and count of boarding cases above escalation thresholds. Geriatric interventions: older-adult median LOS, time to assessment, admission rates, and appropriate post-discharge/sub-acute referral rates. At the enterprise level, ERBI should track the desired direction of overall resource burden, with forecast performance reviewed retrospectively to refine future parameters.

### 9.5 Closing Note

Collectively, this project demonstrates that a reproducible analytical framework applied across nineteen years of CIHI NACRS aggregate health data can shift ED planning from a descriptive to an evidence-based approach. More complex clinical/diagnostic presentations are associated with longer stays; admission-related boarding due to limited inpatient capacity is a significant downstream problem; older adults have significantly longer reported stays than younger age groups; and biological sex, despite statistical significance, is not an operational priority. The longitudinal ERBI trend (4.21 → 8.33, τ = 0.9766, p < .0001; forecast 8.65 and 8.98 for the next two fiscal years) adds a forward-looking dimension, reinforcing that capacity planning must weigh acuity and duration alongside raw visit counts. The proposed roadmap — fast-track pathways, inpatient-flow reform, automated boarding monitoring, geriatric emergency management, and continuous analytics governance — offers a systematic plan for turning these statistical results into measurable operational action.

---

## References

- Affleck, A., Parks, P., Drummond, A., Unger, B., & Ovens, H. (2013). Emergency department overcrowding and access block. *Canadian Journal of Emergency Medicine, 15*(6), 359–370. https://doi.org/10.2310/8000.2013.130954
- Alnahari, A., & A'aqoulah, A. (2024). Influence of demographic factors on prolonged length of stay in an emergency department. *PLOS ONE, 19*(3), e0298598. https://doi.org/10.1371/journal.pone.0298598
- Beveridge, R., Clarke, B., Janes, L., Savage, N., Thompson, J., Dodd, G., Murray, M., Jordan, S., Warren, D., & Vadeboncoeur, A. (1998). Canadian Emergency Department Triage and Acuity Scale: Implementation guidelines. *Canadian Journal of Emergency Medicine, 1*(3, Suppl.).
- Canadian Institute for Health Information. (2024). *Emergency department crowding: Beyond primary care access.* CIHI.
- Canadian Institute for Health Information. (2025). *Emergency department wait time for physician initial assessment.* CIHI.
- Canadian Institute for Health Information. (2026). *National Ambulatory Care Reporting System (NACRS): Emergency department supplementary data tables, 2003–2022* [Data set]. CIHI.
- Carter, E. J., Pouch, S. M., & Larson, E. L. (2014). The relationship between emergency department crowding and patient outcomes: A systematic review. *Journal of Nursing Scholarship, 46*(2), 106–115. https://doi.org/10.1111/jnu.12055
- Cevik, M., Kavaklioglu, C., Razak, F., Verma, A., & Basar, A. (2023). Assessing the impact of emergency department short stay units using length-of-stay prediction and discrete event simulation (arXiv:2308.02730). *arXiv.* https://doi.org/10.48550/arXiv.2308.02730
- Conover, W. J. (1999). *Practical nonparametric statistics* (3rd ed.). John Wiley & Sons.
- Field, A. (2018). *Discovering statistics using IBM SPSS statistics* (5th ed.). SAGE Publications.
- Few, S. (2012). *Show me the numbers: Designing tables and graphs to enlighten* (2nd ed.). Analytics Press.
- Gilbert, R. O. (1987). *Statistical methods for environmental pollution monitoring.* Van Nostrand Reinhold.
- Hyndman, R. J., & Athanasopoulos, G. (2018). *Forecasting: Principles and practice* (2nd ed.). OTexts. https://otexts.com/fpp2/
- Kendall, M. G. (1975). *Rank correlation methods* (4th ed.). Charles Griffin.
- Li, M. K., McLeod, S. L., Affleck, A., Bhate, T., Innes, G., Parks, P., Petrie, D. A., Rowe, B. H., Snider, C., Worrall, J. C., Mackay, F., & Ovens, H. (2026). *Emergency department overcrowding* [CAEP position statement update]. Canadian Association of Emergency Physicians. https://caep.ca/position-statements/emergency-department-overcrowding
- Lin, M., Lucas, H. C., Jr., & Shmueli, G. (2013). Research commentary—Too big to fail: Large samples and the p-value problem. *Information Systems Research, 24*(4), 906–917. https://doi.org/10.1287/isre.2013.0480
- Mirzadeh, P., Kuk, J. L., Wharton, S., Reid, R. A., & Ardern, C. I. (2024). Healthcare outcomes and dispositions in persons with obesity within emergency departments in Ontario, Canada: A cross-sectional analysis of the National Ambulatory Care Reporting System (NACRS), 2018–2022. *PLOS ONE, 19*(9), e0311190. https://doi.org/10.1371/journal.pone.0311190
- Munzner, T. (2014). *Visualization analysis and design.* CRC Press.
- OECD. (2023). *Health at a glance 2023: OECD indicators.* OECD Publishing. https://doi.org/10.1787/7a7afb35-en
- Pines, J. M., Pollack, C. V., Diercks, D. B., Chang, A. M., Shofer, F. S., & Hollander, J. E. (2009). The association between emergency department crowding and adverse cardiovascular outcomes in patients with chest pain. *Academic Emergency Medicine, 16*(7), 617–625. https://doi.org/10.1111/j.1553-2712.2009.00456.x
- Provost, F., & Fawcett, T. (2013). *Data science for business: What you need to know about data mining and data-analytic thinking.* O'Reilly Media.
- Robinson, W. S. (1950). Ecological correlations and the behavior of individuals. *American Sociological Review, 15*(3), 351–357. https://doi.org/10.2307/2087176
- Singer, A. J., Thode, H. C., Jr., Viccellio, P., & Pines, J. M. (2011). The association between length of emergency department boarding and mortality. *Academic Emergency Medicine, 18*(12), 1324–1329. https://doi.org/10.1111/j.1553-2712.2011.01236.x
- Tomczak, M., & Tomczak, E. (2014). The need to report effect size estimates revisited: An overview of some recommended measures of effect size. *Trends in Sport Sciences, 21*(1), 19–25.

---

## Appendix A: System Validation and Testing Evidence

### A.1 Purpose of System Validation

System validation evaluated the reliability of the developed analytics platform's analytical, visualization and reporting functions — centered on accuracy of analytical outputs, consistency of results across platform modules, usability of interactive dashboards, and separation of analytical workflows from the underlying baseline dataset.

### A.2 Analytical Validation

| Analytical Component | Statistical Method | Key Validation Output |
|---|---|---|
| H1 — CTAS and ED length of stay | Kruskal–Wallis test with post-hoc pairwise comparisons | Significant differences across CTAS categories; ε² ≈ 0.748 |
| H2 — Admission and ED length of stay | Mann–Whitney U test with rank-biserial correlation | Strong separation between admitted and non-admitted groups; rank-biserial correlation = 0.9846 |
| H3 — Multivariable length-of-stay model | Multiple regression | Adjusted R² = 0.8837 |
| H4 — Age and ED length of stay | Kruskal–Wallis test with post-hoc comparisons | Significant differences across age cohorts; ε² ≈ 0.7218 |
| H5 — Sex and disposition | Chi-square test with Cramér's V | χ² = 18,164.97, df = 1, p < .0001; Cramér's V ≈ 0.0102 |
| Long-term throughput trend | Kendall's tau | τ = 0.9766, p < .0001 |
| Two-year throughput forecast | Holt's Linear Exponential Smoothing | FY+1 = 8.65; FY+2 = 8.98 |

### A.3 Dashboard and Visualization Validation

The dashboard layer was examined to confirm analytical results are conveyed via interactive visual elements, not only statistical tables. It offers filtering and exploration across Fiscal Year, Sex, Age Cohort, CTAS, and Disposition, with charts, summary cards, trend visualizations, and analytical comparisons that let users move from descriptive data to hypothesis-testing results and strategic conclusions.

### A.4 Forecast Validation

The forecasting component was assessed against the historical ERBI series (FY2003-04 to FY2021-22), rising from ~4.21 to ~8.33, with Mann–Kendall confirming a significant (p < .0001), strong positive trend (τ = 0.9766). The two-year Holt's Linear Exponential Smoothing forecast rose from 8.65 to 8.98 for FY+2, suggesting the upward pressure trend is likely to continue if the historical pattern holds.

### A.5 Functional Validation

The platform structure implements 7 stages — About Project, Prep & Quality, Dataset Explorer, Hypothesis Testing, Executive Dashboard, Strategic Insights, Reports & Export — offering a sequence of data-quality awareness, statistical analysis, and executive interpretation culminating in a report.

### A.6 Validation Summary

The validation evidence shows the platform merges descriptive analytics, statistical inference, regression modelling, longitudinal trend analysis, forecasting and interactive visualization into a holistic decision-support environment. The results reported throughout this report are derived from the outputs of these analytical functions and form the basis for the strategic recommendations in Chapter 9.

---

## Appendix B: Rubric Alignment Checklist

| Rubric Criterion | Evidence in This Report |
|---|---|
| Problem Analysis and Context | Chapter 1 defines the ED operational problem, healthcare context, project objectives, and decision framework. Chapter 2 establishes the analytical methodology and project workflow. |
| Data Collection and Preparation | Chapter 3 documents the CIHI NACRS data source, dataset structure, temporal coverage, data-grain considerations, weighting rationale, cleaning procedures, feature engineering, and data governance. |
| Analytical Methods and Implementation | Chapters 2 and 5 explain and implement the statistical methodology, including frequency-weighted analysis, non-parametric testing, regression modelling, and the five hypothesis tests (H1–H5). |
| Interpretation and Insights | Chapters 5, 6, and 8 interpret statistical findings using effect sizes and practical significance rather than relying solely on p-values. |
| Application of the Analytics Lifecycle | Chapter 2 describes the project's seven-stage platform workflow, while Appendix C provides evidence of the technical implementation, outputs, and methodological safeguards associated with each stage. |
| Data Visualization and Communication | Chapter 7 documents the interactive decision-support platform, while the embedded analytical figures and dashboard screenshots demonstrate how statistical results are communicated to decision-makers. |
| Professional Structure and Technical Writing | The report incorporates an executive summary, numbered chapters and subsections, tables, figures, equations, methodological discussion, limitations, references, and appendices using a formal academic structure. |

---

## Appendix C: Analytics Lifecycle Evidence Log

| Platform Stage | Core Activity | Technical Implementation & Output | Methodological Safeguard |
|---|---|---|---|
| 1. About Project | Established the healthcare problem, project objectives, analytical scope, and decision context. | Project overview, objectives, problem definition, and analytical context presented within the platform. | Clearly defined project boundaries and distinguished the analytical focus from broader hospital-system issues. |
| 2. Prep & Quality | Prepared and assessed the historical CIHI NACRS data before analysis. | Data-cleaning and preparation workflow; standardized analytical dataset and quality checks. | Removed inappropriate aggregate roll-up records, harmonized categories, and addressed data-quality issues before statistical analysis. |
| 3. Dataset Explorer | Enabled structured exploration of the prepared dataset across important dimensions. | Interactive dataset exploration using fiscal year, sex, age cohort, CTAS, and disposition filters. | Maintained the distinction between aggregate reporting strata and patient-level observations when interpreting results. |
| 4. Hypothesis Testing | Tested the five predefined research hypotheses concerning length of stay, admission, demographics, and disposition. | H1–H5 statistical analysis modules and associated result visualizations. | Applied appropriate non-parametric and categorical methods to account for skewed distributions and the structure of the aggregate data. |
| 5. Executive Dashboard | Consolidated major analytical findings into an accessible decision-support interface. | Interactive KPI cards, statistical charts, trend visualizations, and filter controls. | Presented statistical measures alongside visual context to reduce reliance on isolated p-values or single summary statistics. |
| 6. Strategic Insights | Translated analytical findings into operationally relevant conclusions and recommendations. | Strategic findings and implementation-oriented recommendations derived from H1–H5 and longitudinal analysis. | Used effect sizes and practical interpretation to distinguish statistically detectable relationships from operationally meaningful findings. |
| 7. Reports & Export | Converted analytical outputs into formal reporting and reusable deliverables. | Report-ready analytical outputs and export functionality. | Preserved consistency between platform results and the documented capstone findings. |
