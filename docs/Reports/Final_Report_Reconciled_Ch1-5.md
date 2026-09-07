<!--
RECONCILIATION NOTE (remove before final submission):
This file merges the team's own report text (verbatim, front matter through Chapter 5 —
the extent pasted for review) with the numeric corrections agreed in hypothesis_corrections.md.
No new analysis, argument, or interpretation has been added beyond the minimal wording needed
to keep a corrected sentence grammatical. Every changed number is marked [CORRECTED] with the
original value noted, so the team can verify each change against their own source data before
this goes anywhere near a submission. Chapters 6-9, References, and Appendices A-C were not
part of the pasted excerpt and are NOT included here yet.
-->

Explanatory and Predictive Analytics of Emergency Department
Length of Stay and Resource Utilization Trends in Canadian Hospitals

Course: DAMO 699 – Capstone Project
Program: Master of Data Analytics
Rajbharath P (NF1016766)
Suffyan Mohd (NF1017047)
Amit Raj Dev (NF1021076)
Group No: 5
Supervisor: Dr. Bilal El Toufaili
Institution: University of Niagara Falls
6th September 2026

## Table of Contents

Executive Summary
List of Tables
List of Figures
Glossary of Abbreviations
Chapter 1: Problem Analysis and Strategic Context
Chapter 2: Analytics Lifecycle and Project Methodology
Chapter 3: Data Collection, Inventory, and Preparation
Chapter 4: Exploratory Data Analysis and Descriptive Profiling
Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference
Chapter 6: Time-Series Trend Analysis and Throughput Forecasting *(not yet reconciled — pending)*
Chapter 7: Data Visualization and Decision Support Systems *(not yet reconciled — pending)*
Chapter 8: Findings, Synthesis, and Critical Discussion *(not yet reconciled — pending)*
Chapter 9: Strategic Recommendations and Implementation Roadmap *(not yet reconciled — pending)*
References *(not yet reconciled — pending)*
Appendix A: Automated Test Suite Validation Summary *(not yet reconciled — pending)*
Appendix B: Rubric Alignment Checklist *(not yet reconciled — pending)*
Appendix C: Analytics Lifecycle Evidence Log *(not yet reconciled — pending)*

---

## Executive Summary

Nearly 20 years ago, EDs began to receive an increasing number of patients, and length of stay has increased with the number of patients. Hospital and health-system executives who are tasked with handling this strain are often left to compare raw annual averages instead of defensible data, making it hard to discern throughput's impact on clinical acuity, inpatient bed access and patient population. This Capstone project does do that by using a complete data analytics lifecycle to an aggregated reporting data set published by the Canadian Institute for Health Information (CIHI) over the 19 fiscal years from FY 2003-2004 to FY 2021-2022 under the National Ambulatory Care Reporting System (NACRS). The compiled analytical data has 10,685 aggregate reporting rows, which correspond to about 175.8 million emergency department encounters.

Since the various figures in CIHI are published as pre-aggregated stratum summaries and due to the high right skew of the length of stay figures, the analysis used frequency weighted, non-parametric statistical methods instead of classical, parametric tests. Visit counts for each reporting stratum are used within custom mid-rank algorithms and thus each hypothesis test represents a true number of visits, not five hundred vs. 1.5 million.

The empirical work is based on five pre-registered hypotheses. The median length of stay varies significantly by the five levels of the Canadian Triage and Acuity Scale (CTAS) (H = 126,319,368.24, df = 4, p < .0001, ε² = 0.73): presentations in CTAS II (Emergent) category had the longest length of stay at 4.80 hours, followed closely by those in CTAS I (Resuscitation) at 4.60 hours. The most dramatic difference between admission status and any other is seen for inpatient admissions, who spend a weighted median of 10.60 hours in the ED as opposed to 2.50 hours for patients discharged or transferred (U ≈ 2.69 × 10¹², rb = 0.998) – this is nearly deterministic. An analysis of the standardized CTAS urgency score confirms that it is a significant predictor of median length of stay **[CORRECTED — was: "an independent predictor... (β₁ = −115.72 minutes per level, R² = 0.316)", the value CHANGELOG.md documents as an eliminated stale fallback]** (weighted least squares regression, N = 760 aggregate strata, weighted N = 174,207,395 visits; β₁ = −73.92 minutes per unit increase in urgency score [−1.232 hours], R² = 0.6256, F = 1266.65, p < .001, 95% CI [−78.00, −69.85] minutes), and a weighted Kruskal–Wallis test reveals that older adults (65 and older) have the highest median length of stay (4.17 hours, ε² = 0.72) among all age cohorts.

However, biological sex is statistically associated with admission status due to the very large sample size (χ² = 18,164.97, p < .0001), but the effect is essentially null (Cramér's V = 0.010) and would not be used to inform flow design.

Longitudinal analysis revealed a significant increase in the number of visits over the study period (Mann–Kendall z = 5.60, p < .0001; Simple Exponential Smoothing forecasted a five-year increase of visit volumes to a stable level of ~12.95 million visits per year with a 95% prediction interval of 5.9–20.0 million visits per year at five years out. A derived Estimated Resource Burden Index (ERBI) that accounted for both acuity and duration of visits also increased over the same time (τ = 0.977), suggesting an increase in strain on the system rather than just the number of visits.

In aggregate, the results suggest three structural factors that contribute to emergency throughput delay: complexity of diagnosis at CTAS II level; access to inpatient beds; and the disproportionate impact of older age. This report ends with a series of phased implementation ideas, fast-track pathways for low-acuity patients, inpatient discharge-flow ideas and ongoing analytics governance, which offer an evidence-based foundation for hospital and health-system leaders to begin reducing length of stay.

*(Chapter 6's forecast figures — z = 5.60, ~12.95M/year, τ = 0.977 — were not part of the pasted Chapter 5 excerpt reviewed here and have not been independently reconciled yet.)*

---

## Chapter 1: Problem Analysis and Strategic Context

### 1.1 The Canadian Emergency Care landscape

Emergency departments are a particularly vulnerable part of the Canadian publicly funded health care system. The Canada Health Act requires that all hospital emergency departments admit, treat and stabilize every person, whether or not they are able to afford the care or whether their presentation is complex. Approximately 15 million of these visits take place each year in the ten provinces and three territories, and this number has been increasing, despite a rapidly aging population, fewer primary care physicians and low hospital bed ratios compared to other developed health systems, among other factors (OECD 2023). This project is based on data from the Canadian Institute for Health Information (CIHI) which coordinates the resulting data via the National Ambulatory Care Reporting System (NACRS).

### 1.2 Access Block and Mechanics of Length of Stay

According to CIHI, the length of stay is the length of time between registration at triage and actual discharge from the ED. The single interval represents a collection of different clinical phases: waiting to be seen, physician evaluation and diagnostic investigation, disposition decision, and, when patients are admitted, the waiting for an inpatient bed. Overcrowding is not a problem within the ED per se, but rather a sign of a capacity issue in the hospital, and access block, where patients are accepted for admission but cannot leave the ED as no beds are available, is the main driver of overcrowding (Canadian Institute for Health Information, 2024; Affleck et al., 2013; Li et al., 2026). The downstream effects are documented in the health-services literature, and include increased mortality rates for boarded patients with time-sensitive diseases like sepsis, myocardial infarction or stroke; delayed antibiotic treatment and imaging; higher rates of patients leaving without care from which they will later deteriorate; and increased burn-out among emergency physicians and nurses from the delay in offloading ambulances (Pines et al., 2009; Singer et al., 2011; Carter et al., 2014). These impacts have been monitored using the national wait-time reporting system for over a decade but have not been addressed with a structural solution (Canadian Institute for Health Information, 2025). These impacts are not uniform in the system. Hospitals with a high proportion of high acuity and inpatients, or in larger urban areas, exhibit the worst boarding times and community and regional hospitals are more likely to have bottlenecks earlier in the visit due to staffing. There are two distinct patterns that are identified in the aggregate national data presented here, although the supplementary tables analyzed in this project lack facility identifiers to allow for the separation of these two patterns.

### 1.3 Problem Statement

Health administrators often use unweighted annual averages that mask the underlying case mix, although length of stay is important and is used to measure the operational importance of the service. Comparing a reporting stratum that spans just a few visits to a stratum that covers the entire annual volume of visits for a metropolitan area is not the same and doesn't provide a valid comparison across a range of acuity tiers, disposition categories, or age categories. If there is no consistent framework for measuring throughput, using a population-weighted analytical approach, planners will not be able to distinguish the effect of triage acuity from the effect of inpatient admission on throughput, nor be able to predict future capacity needs. This project constructs that framework from the published aggregate tables from CIHI, and tests a specific set of hypotheses, not just descriptive impressions.

### 1.4 Objectives and Scope

The goals of this work are to quantify the relationship between the acuity of triage and length of stay, isolate the impact of admission on total length of stay, test the ability of a numeric CTAS urgency score to predict length of stay, identify which age groups contribute to length of stay, determine whether there is a meaningful relationship between biological sex and the likelihood of admission, characterize the 19-year trend in demands, generate a 5-year forecast of demands, and build a composite index that accounts for cumulative resource utilization, not just the number of visits.

The analysis is limited to six CIHI NACRS supplementary tables that included approximately 175.8 million visits across FY 2003–2004 to FY 2021–2022, and does not include individual patient records, hospital-level or geographic identifiers, causal clinical inference, cost or staffing data, which are not included in the source tables. Each of the supplementary tables provides a summary of the stratum level data, not microdata for individual cases, so all of the statistical models in this report are explicitly frequency weighted by number of visits, and any conclusions drawn are made at the system level, not on a per-patient basis.

### 1.5 Canonical Hypothesis Registry

Before choosing statistical computing methods, five formal hypotheses (Table 1) were pre-registered to assess, so that the results of all the tests that are reported in Chapter 5 were not selected ad hoc after looking at the data.

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

The project is based on the following ten stages of the analytics lifecycle, which is similar to the one commonly used in the healthcare operations context (Provost & Fawcett, 2013): The phases encompass business and data understanding, ingestion, cleaning, pre-registration of the hypothesis, statistical computation, diagnostic validation, interpretation and governance and reproducibility. Each of the stages is summarized in Table 2 along with the primary activity and the product.

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

Classical inferential tests, the independent t-test, ordinary least squares regression, and one-way ANOVA, assume normally distributed, homoscedastic residuals (Field, 2018). The distribution of length of stay in the ED is highly right-skewed and the variance in length of stay varies by an order of magnitude from cases handled in the ED that are not urgent, to those that are admitted or critically ill. The size of reporting strata also differs widely, ranging from regional numbers to aggregates up to a million visits for the metros. Because of these considerations, distribution-free rank-based procedures were used, including a frequency-weighted Kruskal–Wallis H-test and Dunn post-hoc comparisons for three-or-more-group comparisons (H1 and H4); a frequency-weighted Mann–Whitney U-test with a rank-biserial correlation for two-group comparisons (H2); weighted least squares regression for H3, correcting for the heteroscedastic variance by weighting each stratum according to the number of visits; and Pearson's chi-square test with a Cramér's V effect size for the categorical association (H5) (Conover, 1999; Tomczak & Tomczak, 2014). Each non-parametric test is embedded in a custom mid-rank algorithm with an explicit frequency weight that is the stratum-level visit count. Then, for a pooled set of strata, a population midrank is assigned to each distinct length-of-stay (LOS) value that is equal to the cumulative weight for the strata that come before it plus half of the weight of the current stratum value, and group rank sums are calculated based on those weighted mid-ranks, where N is the total weighted sample size, k is the number of groups, Rⱼ is the weighted rank sum for group j, and nⱼ is the total weight of group j. So a stratum of 1.5 million visits will count proportionately more in the rank sums than, say, a stratum of five hundred, eliminating the aggregation-bias an unweighted test would introduce and allowing the statistics to reflect the population of about 175.8 million visits (not the number of rows reporting).

This weighting choice is a methodological dividend, in that if it were not used, then a five-year total for a rare presenting complaint for a sparse stratum, such as a rural facility, would have the same effect on a rank sum as a large stratum such as a metropolitan facility with more than a million encounters. The increase in the CIHI's reporting coverage over the study window also translates to an unweighted design, which will also implicitly give more weight to later years that are better reported than earlier years in all longitudinal comparisons in this report, thus favoring more recent years. This distortion is eliminated at the source by explicit frequency weighting, rather than being required to be corrected post hoc.

### 2.3 Protection from the ecological fallacy

Since CIHI does not report patient information as part of its summary publications, all findings reported in this document reflect system-level performance and are not clinical outcomes. A warning, pointed out by Robinson (1950), against the ecological fallacy that is, extrapolating an association on the level of the group to the level of the individuals: a stratum of older patients with a longer median stay does not mean that every older patient will have a longer stay than every younger patient.

There are three safeguards which keep the analysis in its appropriate epistemic limits. Firstly, the findings are reported at the cohort or stratum level and not at the individual level. Secondly, statistical models are considered as mere planning and resource allocation tools and not as aids for clinical decisions on any new patient who arrives. Third, each median reported in this report is followed by an interquartile range (IQR) to preserve information about variability within each group instead of obscuring it by merely reporting a point estimate.

---

## Chapter 3: Data Collection, Inventory and Preparation

### 3.1 Data Provenance

The empirical base for this project is a multi-sheet workbook of full-mandate reporting facilities, referred to as the CIHI NACRS Supplementary Data Tables for emergency department visits, 2003–2022, which focuses on emergency department visits in Ontario, Alberta and other reporting jurisdictions (Canadian Institute for Health Information, 2026). The two basic measures reported in each stratum in the source tables are: the number of registered emergency visits in a clinical/demographic category for a fiscal year, and the length of stay (in minutes) at the 50th percentile (or median) in that category over a fiscal year. A python pipeline is used to read each annual sheet, adjust the headers so that they are uniform format for over nineteen years of publication, and store the result in a relational SQLite database.

### 3.2 Database Structure

The final database contains 8,685 aggregate rows, in six tables, corresponding to approximately 175.8 million visits. The grain and scale of each table are summarized below in Table 3.

| Table | Observation Grain | Rows | Encounters |
|---|---|---:|---:|
| ed_visits | FY × CTAS × Disposition × Problem | 5,586 | 175,812,409 |
| ctas_triage | FY × Sex × CTAS × Age Group | 912 | 174,207,395 |
| visit_disposition | FY × Sex × Disposition × Age Group | 936 | 173,984,112 |
| age_sex | FY × Sex × Age Group | 152 | 175,812,409 |
| main_problems | FY × Sex × Main Problem × Age Group | 1,063 | 168,490,215 |
| demographics | Age Group × Sex (cross-sectional) | 36 | 175,812,409 |

### 3.3 Cleaning and Quality Control

The various types of data-quality problems had to be dealt with explicitly and documented in an auditable way, and these are covered in Table 4. Every query did not include a summary row, e.g., 'Total' or 'Any', because adding a summary row to a query with the rows that summarize it would result in double counting of the underlying population data. Numeric fields were cast to consistent types, but invalid values were not dropped but were assumed to be equal to zero. Cells suppressed for privacy to protect small counts were kept in the database but not in any denominator, thus eliminating division by zero problems in the weights and privacy violations. Inconsistencies in the age group labels between tables (one used a dash and the other a hyphen) were expanded to make cross-table joint possible without any silent error. Lastly, rows with missing or 'Not Stated' triage level or disposition were not used in the primary hypothesis comparisons because these types of rows do not represent a defined clinical group of rows.

| Issue Identified | Action Taken | Rationale |
|---|---|---|
| Roll-up rows ('Total', 'Any') | Excluded from every query | Prevents double-counting the population |
| Inconsistent header rows | Regex-based fiscal-year parser locates the data start | Reliable parsing across 19 years of formats |
| Mixed numeric types | Coerced to int64/float64; invalid values set to zero | Prevents silent computation failures |
| Suppressed small counts (n < 5) | Retained in the database; filtered from denominators | Preserves privacy without skewing weights |
| Inconsistent age-group encoding | Normalized dash and hyphen variants | Restores referential integrity across joins |
| 'Unknown' / 'Not Stated' categories | Excluded from H1, H2, and H4 comparisons | Preserves interpretability of pairwise tests |

### 3.4 Feature Engineering

The statistical models are derived from several derived fields. Each year label was converted to an integer for chronological ordering, which was done in the fiscal-year format. For ease in reading, median length of stay was converted from minutes to decimal hours. The bottom three CTAS levels were combined into one for the continuous predictor in the H3 regression, creating an urgency score of one (Resuscitation), two (Emergent), and three (Urgent, Less Urgent, Non-Urgent) which is discussed later as a limitation. For the H4 comparison detailed age groups were combined into four life-stage cohorts: 0-19 years; 20-44 years; 45-64 years; and aged 65 and above. A binary indicator is created for each disposition to designate whether it contains a substring 'admit.'. Finally, an Estimated Resource Burden Index (ERBI) aggregates acuity, visit volume and visit duration to a single per-visit capacity measure weighted by acuity, detailed in Chapter 6.

### 3.5 Data isolation and reproducibility

For the six baseline CIHI tables, they are loaded once at the beginning and do not change during the project; for this reason, all hypotheses' tests presented in this report can be reproduced using the same seed data for these six tables. A separate, session-specific upload pathway allows the user to be able to explore his or her own Excel or CSV file without ever touching the baseline tables, thus preserving the integrity of the research cohort. All the automated unit and integration tests of the cleaning pipeline and statistical solvers pass and are summarized in Appendix A, with approximately 300 tests.

---

## Chapter 4: Exploratory Data Analysis and Descriptive Profiling

### 4.1 Nineteen Years of Volume Growth

Annual visits increased from approximately 4.91 million in FY 2003-2004 to a peak of approximately 15.02 million in FY 2018-2019 (Table 5) before the pandemic hit, which represents over a triple in the number of annual visits within 15 years. Some of this growth is attributable to actual increases in demand and some to the growth in the number of facilities reporting to NACRS, the typical example being the dramatic jump from 5.8 million to 8.2 million visits in FY 2010-2011 which is actually driven by more facilities reporting to NACRS and not necessarily an increase in demand. There was a rise in median length of stay (LOS) as the volume of cases increased, from 2.30 hours in FY 2003-2004 to 3.10 hours in FY 2018-2019, suggesting that the capacity of the system did not rise in line with the volume of cases even before the pandemic. The COVID-19 period saw a transient downturn of 17.8% in FY 2020–2021 with a decrease in low acuity presentations, but a simultaneous increase in the mean length of stay to 3.30 hours due to the increased proportion of severe presentations and infection-control measures. In FY 2021–2022, the median stay was 3.40 hours, representing a 20% plus year-on-year recovery in visits, and the highest median stay on record. The relationship does not appear to be coincidental as the two series are correlated across all eight benchmark years as seen in Table 5: each year with an increase in volume has a corresponding increase in median stay, and each year with a decrease in volume has a corresponding decrease in median stay.

| Fiscal Year | Total ED Visits | Median LOS (Hours) |
|---|---:|---:|
| 2003–2004 | 4,906,394 | 2.30 |
| 2007–2008 | 5,680,941 | 2.53 |
| 2010–2011 | 8,171,651 | 2.70 |
| 2013–2014 | 10,614,350 | 2.85 |
| 2016–2017 | 13,290,440 | 3.00 |
| 2018–2019 | 15,023,099 | 3.10 |
| 2020–2021 | 11,622,444 | 3.30 |
| 2021–2022 | 13,992,029 | 3.40 |

### 4.2 Acuity and Admission Profiles

Table 6 shows length of stay by the 5 CTAS acuity levels for each of the reporting facilities reporting using the standardized clinical triage instrument (Beveridge et al., 1998). The pattern is not as straightforward as the sickest patients wait longest as is the case with CTAS I: CTAS II patients have a longer median stay of 4.80 hours compared to CTAS I patients (4.60 hours), due to the fact that CTAS I patients are quickly stabilized and transported to an intensive care unit, while CTAS II patients receive comprehensive medical evaluations, imaging, and specialist consultation before a disposition decision is made. The biggest single tier – just over 41% of classified visits – is CTAS III.

| CTAS Tier | Encounters | % of Volume | Median LOS (Hours) |
|---|---:|---:|---:|
| CTAS I — Resuscitation | 1,286,555 | 0.74% | 4.60 |
| CTAS II — Emergent | 26,742,361 | 15.35% | 4.80 |
| CTAS III — Urgent | 72,100,128 | 41.39% | 3.40 |
| CTAS IV — Less Urgent | 58,990,020 | 33.86% | 1.90 |
| CTAS V — Non-Urgent | 15,088,331 | 8.66% | 1.33 |
| Total | 174,207,395 | 100.00% | 2.90 |

This difference is even more pronounced if visits by final disposition are separated. The weighted median duration for patients admitted to inpatient beds (11.5% of total volume) is 10.60 hours, significantly longer than the weighted median duration for non-admitted visits (2.50 hours) and is responsible for more than a third of all cumulative stretcher time in the emergency-department.

### 4.3 Age and sex

Growth in the proportion of older adults visiting the hospital for surgical care (approximately 21%) is reflected in longer median length of stay (4.17 hours) than any other age group (2.05 hours for pediatric and youth patients), and their inpatient case rate (14.7 per 100,000) is nearly seven times higher than that for pediatric patients (2.2 per 100,000) (Table 7). However, there is a two-minute difference between the duration of male and female encounters, which is not operationally significant alone, but is compared to the admission status of the patient in Hypothesis 5.

| Age Category | Encounters | % of Volume | Median LOS (Hours) | Admission Rate |
|---|---:|---:|---:|---:|
| Pediatric / Youth (0–19) | 38,908,652 | 22.13% | 2.05 | 4.2% |
| Young Adults (20–44) | 57,965,791 | 32.97% | 2.53 | 6.8% |
| Middle Adults (45–64) | 41,674,805 | 23.71% | 2.87 | 14.5% |
| Older Adults (65+) | 37,213,696 | 21.17% | 4.17 | 28.6% |

### 4.4 Clinical Case Mix

Outline complaints into two general categories. High volume (low acuity) categories – such as minor musculoskeletal injury – resolve quickly (usually less than 2 hours) and often without admission. The second group, chest pain and other cardiac presentations, mental health and substance-use crises, and acute respiratory or septic presentations, is high-acuity, high-duration – with median stays ranging from 4.7 to 5.8 hours – and as a consequence extensive diagnostics were performed, or in the case of mental health presentations, there did not seem to be sufficient downstream psychiatric disposition options. The dual distribution is a motivator for the fast-track and case-mix recommendations presented in Chapter 9.

Table 8 presents six verified presenting-problem categories that were selected from the main_problems table, sorted by presenting-problem visit volume, and with the weighted mean length of stay in the table. Trauma has by far the largest number of visits, and a comparatively short mean stay, while Acute Myocardial Infarction has a much smaller number of visits, but a much longer mean stay. The categories displayed are a verified subset of categories which have been selected to compare high volume and high duration presentations and do not necessarily add up to the total volume reported.

| Presenting Problem | Aggregate Visits | Weighted Mean LOS (Min / Hours) |
|---|---:|---:|
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

In the hypothesis-testing phase, the main relationships found in the exploratory and methodological phases of the project are tested. The analysis relies on the processed aggregate dataset from CIHI in SQLite format and statistical methods that take into consideration the frequency in which each aggregate record represents. Each record represents an aggregate stratum of patients of interest and, when applicable, the number of emergency department visits per strata are included as analytic weights.

5 hypotheses were tested. H1 investigates if there is a difference in reported median emergency department length of stay (ED LOS) between the five Canadian Triage and Acuity Scale (CTAS) levels. H2 tests the hypothesis that reported median ED LOS is different for admitted vs non-admitted visits. H3 analyzes the predictive relationship of the CTAS urgency score to reported median ED LOS using weighted least squares (WLS) regression. H4 compares reported median ED LOS by large age groups of patients. H5 explores the possibility that there is a statistical relationship between patient sex and visit disposition.

The statistical computing platform feeds the results of the hypothesis directly from the dataset that has been processed using SQLite. The non-parametric comparisons are based on the aggregate visit counts, and the regression model is based on the visit-count weighting of the aggregate observations. Statistical significance will be measured at α = .05.

### 5.2 Hypothesis 1: Reported Median ED LOS Across CTAS Triage Levels

**5.2.1 Research Question**

The first hypothesis addresses the following research question:
"How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?"

The analysis evaluates all five clinical CTAS acuity tiers: CTAS I — Resuscitation, CTAS II — Emergent, CTAS III — Urgent, CTAS IV — Less Urgent, CTAS V — Non-Urgent.

**5.2.2 Hypothesis**

H₀: Reported median ED LOS is equal across all CTAS triage levels.
H₁: At least one CTAS level has a different reported median ED LOS.
The significance level is α = .05

**5.2.3 Statistical Method**

The omnibus test used is a weighted Kruskal–Wallis H test because the analysis involves comparing more than two independent groups and the sum of the ED LOS data do not meet the assumptions of conventional parametric tests.

A weighted Dunn post-hoc test is conducted for all pairwise comparisons of CTAS, following the analysis. A Bonferroni correction is used to prevent multiple comparisons to correct for the family wise error rate over the 10 comparisons.

The effect size is reported with the epsilon squared (ε²), where H is the Kruskal–Wallis statistic, k is number of groups, and N is the weighted sample size. For each aggregate record, the frequency weight is the number of ED visits.

**5.2.4 Results**

*[CORRECTED — table below replaces the original figures (H = 35,510,138.077, ε² = 0.7479), which did not match this report's own Executive Summary or the platform's tested output]*

| Statistic | Result |
|---|---|
| Kruskal–Wallis H | 126,319,368.24 |
| p-value | < 0.0001 |
| Effect size (ε²) | 0.7251 |
| Significant pairwise comparisons | 10 / 10 |

The very low p-value is highly suggestive that the null hypothesis is incorrect. The high ε² value (0.7251) suggests that there is a significant difference between the median ED LOS by CTAS level in the overall sample. The 10 out of 10 possible pairwise comparisons were statistically significant following Bonferroni correction.

**5.2.5 Pairwise Comparison**

*[NOT RECONCILED — the original table's Bonferroni-adjusted p-values were generated alongside the incorrect H-statistic above and should be re-pulled from the live platform's Dunn post-hoc output before this table is finalized, rather than assumed correct.]*

**5.2.6 Reported Median ED LOS by CTAS Level**

*[CORRECTED — table below replaces the original figures (Resuscitation 3.20h / Emergent 3.60h / Urgent 3.70h / Less Urgent 2.90h / Non-Urgent 2.00h), which contradicted this report's own Table 6 in Chapter 4.2 and its own Executive Summary]*

| CTAS Level | Reported Median ED LOS |
|---|---:|
| Resuscitation (CTAS I) | 4.60 hours |
| Emergent (CTAS II) | 4.80 hours |
| Urgent (CTAS III) | 3.40 hours |
| Less Urgent (CTAS IV) | 1.90 hours |
| Non-Urgent (CTAS V) | 1.33 hours |

*(IQR column not reconciled — pull from live platform output.)*

**5.2.7 Interpretation**

The findings show a statistically significant relationship between ED LOS and CTAS acuity. The large ε² value means that this is not just a statistically significant difference between the two groups caused by a large underlying population and that the grouping variable accounts for a significant amount of the variation in the aggregate comparison. **[CORRECTED sentence — was: "The Urgent and Emergent categories have especially high reported median stays while the Non-Urgent category has significantly shorter stays," written to match the incorrect 5.2.6 table]** CTAS II (Emergent) and CTAS I (Resuscitation) have the highest reported median stays, at 4.80 and 4.60 hours respectively, while CTAS V (Non-Urgent) is lowest at 1.33 hours. The finding also illustrates that acuity should not be assumed to be a linear relationship for which each increment of acuity corresponds to an increment of duration. As such, the null hypothesis is rejected: H₀ is rejected, H₁ is accepted.

### 5.3 Hypothesis 2: Reported Median ED LOS for Admitted vs. Non-Admitted Visits

**5.3.1 Research Question**

The second hypothesis examines whether inpatient admission status is associated with reported emergency department length of stay: "Does reported median emergency department length of stay differ significantly between admitted and non-admitted visits?" The analysis compares two cohorts — Admitted: visits resulting in inpatient hospital admission; Non-Admitted: discharged home, transferred, or otherwise departing prior to inpatient admission. Summary roll-up rows and non-informative Unknown categories are excluded.

**5.3.2 Hypotheses**

H₀: The distribution of reported median ED LOS is equal for admitted and non-admitted visits.
H₁: Reported median ED LOS differs significantly between admitted and non-admitted visits.
The significance level is α = .05

**5.3.3 Statistical Method**

A weighted Mann–Whitney U test is used because the analysis compares two independent groups using a non-parametric approach. The effect size is reported using rank-biserial correlation (rᵦ).

**5.3.4 Results**

*[CORRECTED — table below replaces the original figures (U = 1,124,848,860,923.5, rᵦ = 0.9846), which did not match this report's own Executive Summary or the platform's tested output]*

| Statistic | Result |
|---|---|
| Mann–Whitney U | 2.689 × 10¹² (z = 6,952.46) |
| p-value, two-sided | < 0.0001 |
| Rank-biserial correlation (rᵦ) | 0.9981 |
| Reported median difference | 8.10 hours |

**5.3.5 Reported Median ED LOS**

*[CORRECTED — table below replaces the original figures (Non-Admitted 2.80h / Admitted 6.10h)]*

| Visit Disposition | Reported Median ED LOS |
|---|---:|
| Non-Admitted | 2.50 hours |
| Admitted | 10.60 hours |

*(IQR column not reconciled — pull from live platform output.)*

**5.3.6 Interpretation**

Within the analysis there is strong evidence that admission status is associated with the reported ED LOS. **[CORRECTED — was "6.10 hours vs. 2.80 hours... rank-biserial correlation of 0.9846"]** The median ED LOS for patients seen in the ED who are admitted is 10.60 hours vs. 2.50 hours for those who are not admitted. This difference is based on an extremely large rank-biserial correlation of 0.9981. This discovery suggests that inpatient admissions are an operational dimension of ED throughput that is important when studying ED performance. The null hypothesis is thus rejected: H₁ is accepted and H₀ is rejected.

### 5.4 Hypothesis 3: Weighted Least Squares Regression of Reported Median ED LOS

*[CORRECTED SECTION — the original Chapter 5.4 described a different model (multivariate, 9 categorical predictors including visit disposition, Adjusted R² = 0.8837) than this report's own Executive Summary (a univariate model, R² = 0.316 — itself a stale value per the platform's own change log). Per team decision, this section is standardized on the platform's canonical univariate model, verified against 300 automated tests.]*

**5.4.1 Research Question**

The third hypothesis evaluates whether the CTAS urgency score is associated with reported median ED LOS: "Does the CTAS urgency score significantly predict reported median emergency department length of stay?"

**5.4.2 Regression Method**

The analysis uses Weighted Least Squares (WLS) regression at the aggregate level.
- **Dependent variable:** reported median ED LOS (minutes)
- **Independent variable:** standardized CTAS urgency score, a continuous predictor scored 1 (Resuscitation) through 5 (Non-Urgent)
- **Weights:** ED visit count per aggregate stratum
- **Sample:** N = 760 aggregate strata across five CTAS urgency levels (weighted N = 174,207,395 visits); `Unknown`/unclassified triage rows are excluded rather than assigned a default score

**5.4.3 Regression Results**

| Coefficient | B | 95% CI Low | 95% CI High | p-value |
|---|---|---|---|---|
| Intercept (β₀) | 430.9542 min (7.183 h) | *not reconciled* | *not reconciled* | < 0.0001 |
| CTAS urgency score (β₁) | −73.9240 min/unit (−1.232 h/unit) | −78.0016 min | −69.8465 min | < 0.0001 |

Model fit: R² = 0.6256, F(1, 758) = 1266.6521, p = 7.10 × 10⁻¹⁶⁴.

*(Standard errors for β₀ and β₁ not reconciled — pull from the live regression output before finalizing.)*

**5.4.4 Interpretation of the CTAS Coefficient**

Each one-unit increase in the standardized CTAS urgency score (i.e., moving one tier toward lower acuity) is associated with a 73.92-minute (1.232-hour) decrease in reported median ED LOS (95% CI [69.85, 78.00] minutes decrease), holding the weighting scheme constant. The relationship is highly significant (p < .0001) and the model explains 62.6% of the variance in reported median LOS at the aggregate level (R² = 0.6256).

**5.4.5 Model Interpretation**

The R² of 0.6256 indicates that a substantial share of aggregate-level variance in reported median ED LOS is explained by triage acuity alone. As with every other hypothesis in this report, the unit of interpretation is the aggregate reporting stratum, not the individual patient — the coefficient describes how strata with a given acuity level differ from strata with another, not a guarantee for any single visit. This result confirms the main difference found in H2 between admitted and non-admitted patients is captured separately under Hypothesis 2, and is not restated as part of the H3 regression.

### 5.5 Hypothesis 4: Reported Median ED LOS Across Broad Patient Age Categories

**5.5.1 Research Question**

The fourth hypothesis evaluates whether reported median ED LOS differs across broad demographic age categories: "Does reported median emergency department length of stay differ significantly across broad demographic age categories?" The platform compares four cohorts — Pediatric & Youth: 0–19, Young Adult: 20–44, Middle Adult: 45–64, Older Adult: 65+. Summary roll-up rows and unclassified Unknown records are excluded.

**5.5.2 Hypotheses**

H₀: Reported median ED LOS is equal across all broad age categories.
H₁: At least one age category has a different reported median ED LOS.
The significance level is α = .05

**5.5.3 Statistical Method**

A weighted Kruskal–Wallis H-test is used to evaluate differences across the four age categories, followed by a weighted Dunn post-hoc test with Bonferroni adjustment. The effect size is epsilon squared. The number of ED visits represented by each aggregate record is used as the frequency weight.

**5.5.4 Results**

| Statistic | Result |
|---|---|
| Kruskal–Wallis H | 126,863,835.837 |
| p-value | < 0.0001 |
| Effect size (ε²) | 0.7218 |
| Significant pairwise comparisons | 6 / 6 |

*(This subsection's statistics were already consistent with the platform's canonical value — no correction needed here.)*

**5.5.5 Pairwise Comparison**

| Age Comparison | Bonferroni-adjusted p-value |
|---|---|
| Pediatric & Youth vs. Young Adult | < 0.0001 |
| Pediatric & Youth vs. Middle Adult | < 0.0001 |
| Pediatric & Youth vs. Older Adult | < 0.0001 |
| Young Adult vs. Middle Adult | < 0.0001 |
| Young Adult vs. Older Adult | < 0.0001 |
| Middle Adult vs. Older Adult | < 0.0001 |

**5.5.6 Reported Median ED LOS by Age Category**

*[CORRECTED — "Older Adult" row below replaces the original 4.01 hours, which contradicted this report's own Table 7 in Chapter 4.3 and its own Executive Summary]*

| Age Category | Reported Median ED LOS |
|---|---:|
| Pediatric & Youth | 2.05 hours |
| Young Adult | 2.47 hours |
| Middle Adult | 2.73 hours |
| Older Adult | 4.17 hours |

**5.5.7 Interpretation**

The findings suggest a significant relationship between overall age range of patients and the reported median ED LOS. The gap is particularly stark for older people: the Pediatric & Youth cohort reported a median ED LOS of 2.05 hours compared to 4.17 hours for the Older Adult cohort. All 6 comparisons are significant, and the epsilon-squared effect size is 0.7218; within this aggregate analytical framework, the age-group relationship is not only statistically significant, but also large. Therefore: H₀ is not accepted and H₁ is accepted.

### 5.6 Hypothesis 5: Patient Sex and ED Visit Disposition Association

**5.6.1 Research Question**

The fifth hypothesis examines whether patient sex is statistically associated with emergency department visit disposition: "Is there a statistically significant association between patient sex and visit disposition (admitted vs. non-admitted) in Canadian NACRS aggregate data?" The analysis uses a 2 × 2 contingency table — Rows: Female, Male; Columns: Non-Admitted, Admitted. The total aggregate visits analyzed are 175,762,944. Summary rows and unclassified categories are excluded.

**5.6.2 Hypotheses**

H₀: Patient sex and visit disposition are statistically independent.
H₁: Patient sex and visit disposition are statistically associated.
The significance level is α = .05

**5.6.3 Statistical Method**

A Pearson Chi-Square Test of Independence is applied to the 2 × 2 contingency table. The effect size is measured using Cramér's V, where χ² is the chi-square statistic, N is the total sample size, and r and c represent the number of rows and columns.

**5.6.4 Results**

| Statistic | Result |
|---|---|
| Chi-square (χ²) | 18,164.97 |
| Degrees of freedom | 1 |
| p-value | < 0.0001 |
| Cramér's V | 0.0102 |

*(This subsection was already fully consistent with the Executive Summary and the platform's canonical value — no correction needed.)*

**5.6.5 Observed Contingency Table**

| Patient Sex | Non-Admitted | Admitted | Sex Total |
|---|---:|---:|---:|
| Female | 81,930,996 | 9,048,750 | 90,979,746 |
| Male | 75,827,728 | 8,955,470 | 84,783,198 |
| Total | 157,758,724 | 18,004,220 | 175,762,944 |

Female: Non-admitted 90.05%, Admitted 9.95%. Male: Non-admitted 89.44%, Admitted 10.56%. The difference in admission proportions is small despite the very large chi-square statistic.

**5.6.6 Interpretation**

The statistical test rejects the null hypothesis of complete independence because the p-value is below 0.0001. However, the magnitude of the association is extremely small, as demonstrated by Cramér's V value of 0.0102. This distinction is important because the dataset contains a very large number of ED visits — with very large samples, even small differences can generate extremely large chi-square statistics and very small p-values. The practical implication is therefore different from the statistical conclusion: although sex and disposition are statistically associated in the aggregate dataset, the strength of that relationship is too small to represent a meaningful operational driver of emergency department flow. Consequently: H₀ is rejected statistically, but the association has negligible practical significance. Patient sex should therefore not be treated as a major operational variable for ED flow-design decisions based on this analysis.

### 5.7 Comparative Synthesis of Hypothesis Results

*[CORRECTED — table below carries the corrected H1–H4 figures through; original repeated the same incorrect values from 5.2.4/5.3.4/5.4]*

| Hypothesis | Statistical Test | Main Result | Effect Size | Interpretation |
|---|---|---|---|---|
| H1 | Weighted Kruskal–Wallis + Dunn | H = 126,319,368.24, p < .0001 | ε² = 0.7251 | Large CTAS-related difference |
| H2 | Weighted Mann–Whitney U | U = 2.689 × 10¹², p < .0001 | rᵦ = 0.9981 | Very strong admission-related difference |
| H3 | Weighted Least Squares | β₁ = −73.92 min/unit, R² = 0.6256, p < .0001 | — | Strong aggregate model fit |
| H4 | Weighted Kruskal–Wallis + Dunn | H = 126,863,835.837, p < .0001 | ε² = 0.7218 | Large age-related difference |
| H5 | Pearson Chi-Square | χ² = 18,164.97, p < .0001 | V = 0.0102 | Statistically significant but negligible association |

Three findings stand out. First, CTAS category is strongly associated with reported ED LOS — the H1 analysis produces an epsilon-squared value of 0.7251, with every pairwise CTAS comparison reaching statistical significance. Second, visit disposition produces one of the clearest differences in reported ED LOS: the admitted cohort has a median of 10.60 hours compared with 2.50 hours for the non-admitted cohort, accompanied by a rank-biserial correlation of 0.9981. Third, age category has a substantial relationship with reported ED LOS — older adults have the highest reported median at 4.17 hours, compared with 2.05 hours for the Pediatric & Youth cohort, and all six age-group comparisons are statistically significant. In contrast, the H5 results illustrate why statistical significance must be interpreted together with effect size: the sex-disposition relationship is statistically significant because of the very large sample, but the Cramér's V value of 0.0102 indicates a negligible association.

### 5.8 Statistical and Operational Implications

The combined hypothesis results provide an evidence base for prioritizing operational interventions. The first major signal is acuity-related variation — the substantial differences among CTAS categories suggest that emergency departments should not evaluate throughput using a single overall LOS statistic alone. The second and particularly strong signal is visit disposition — the large difference between admitted and non-admitted visits demonstrates that admission status is closely associated with emergency department duration, providing an important analytical basis for examining inpatient capacity and patient-flow processes alongside emergency department operations. The third major signal is age-related variation — the substantially higher reported median for older adults suggests that demographic composition is relevant when planning emergency department capacity and patient-flow resources. Finally, sex should not be prioritized as an operational flow variable: although the chi-square test is statistically significant, the negligible Cramér's V demonstrates that statistical significance alone does not establish operational importance.

### 5.9 Conclusion

The hypothesis-testing stage provides statistical evidence for several important relationships in Canadian emergency department aggregate data. H1 demonstrates significant and large differences in reported median ED LOS across CTAS triage categories. H2 identifies a particularly strong difference between admitted and non-admitted visits. **[CORRECTED — was: "H3 demonstrates that CTAS and visit disposition contribute substantially...", restating the old multivariate framing; disposition's effect on LOS is H2's finding, not H3's]** H3 demonstrates that CTAS urgency score contributes substantially to explaining variation in aggregate reported median ED LOS within the WLS model. H4 establishes significant and large differences across broad patient age categories, with older adults showing the longest reported median stay. H5 identifies a statistically significant association between patient sex and disposition, but its negligible effect size indicates little practical operational relevance.

Overall, the findings suggest that clinical acuity, admission disposition, and patient age are substantially more important analytical dimensions for understanding emergency department throughput than patient sex.

Because the analysis is based on aggregate CIHI NACRS reporting strata rather than individual patient records, these findings are interpreted at the aggregate system level. The statistical results should therefore support capacity planning, operational analysis, and decision support rather than individual-level clinical decision-making.

---

## Note on figures

The PDF version of Chapter 5 includes box-plot and forest-plot figures for §5.2.6, §5.3.5, §5.4.3 (forest plot), and §5.5.6, generated from the same incorrect numbers corrected above. These figures need to be regenerated from the live platform against the corrected values — they cannot simply be relabeled, since the plotted distributions (whiskers, IQR boxes) reflect the original wrong data, not just the displayed medians.

---

*Chapters 6–9, References, and Appendices A–C were not part of either excerpt reviewed (paste or PDF) and are not included in this file. Send them to extend this reconciliation — Chapter 8 (Discussion) and Chapter 9 (Recommendations) are the most likely places for the same H1–H4 figures to resurface, and Appendix B is described in the Table of Contents as a "Rubric Alignment Checklist," directly relevant to the scoring exercise this file supports.*
