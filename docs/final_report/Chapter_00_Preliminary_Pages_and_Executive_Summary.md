# Operational and Clinical Modelling of Emergency Department Length of Stay in Canada: A Data Analytics Capstone Project Using CIHI NACRS Aggregate Data

\
\
\

**A Capstone Project Report Submitted to the Faculty of Graduate Studies**  
**in Partial Fulfillment of the Requirements for the Degree of**  
**Master of Data Analytics**

\
\
\

**Course:** DAMO 699 — Capstone Project (DAMO-6994)  
**Academic Term:** Summer 2026  
**Institution:** University of Niagara Falls Canada  
**Faculty:** Department of Analytics and Technology  
**Location:** Niagara Falls, Ontario, Canada  

\
\
\

**Author / Candidate:**  
Bharath Paramasivan  
Master of Data Analytics Candidate  
Student Identification: DAMO-699-Team  
Email: bparamasivan@myunfc.ca  

\
\
\

**Faculty Advisor & Evaluation Committee:**  
Department of Analytics and Technology  
University of Niagara Falls Canada  

\
\
\

**Submission Date:** August 28, 2026  
**Document Version:** 2.0 (Final Submission Release)  
**APA Citation:** Paramasivan, B. (2026). *Operational and clinical modelling of emergency department length of stay in Canada: A data analytics capstone project using CIHI NACRS aggregate data* [Capstone Project Report, University of Niagara Falls Canada].

---

## Author Note

This capstone project report represents the culminating academic and applied research requirement for the degree of **Master of Data Analytics (MDA)** at the **University of Niagara Falls Canada (UNF)**.

The empirical investigation, statistical computational frameworks, and interactive clinical decision-support architectures documented herein were developed using secondary, publicly accessible aggregate healthcare databases disseminated by the **Canadian Institute for Health Information (CIHI)** under the *National Ambulatory Care Reporting System (NACRS) Supplementary Data Tables (2003–2022)*. 

The author expresses sincere gratitude to the faculty advisors, course instructors, and academic peers within the Department of Analytics and Technology for their constructive feedback, methodological guidance, and continuous support throughout the research lifecycle.

**Statement of Research Ethics and Data Governance:**  
All analytical procedures, inferential models, and time-series projections executed in this study operated exclusively on anonymized, pre-aggregated institutional reporting tables published by CIHI. No patient-identifiable microdata, individual electronic health records (EHR), or protected personal health information (PHI) were accessed, queried, or processed. In accordance with the Canadian Tri-Council Policy Statement: Ethical Conduct for Research Involving Humans (TCPS 2, Article 2.2), secondary analysis of publicly available, non-identifiable aggregate data does not require formal institutional research ethics board (REB) review.

**Data and Code Availability Statement:**  
The complete analytical platform—encompassing automated data extraction scripts, data cleaning routines, relational SQLite database build definitions, FastAPI analytical backend services, React 19 interactive dashboards, and unit/integration testing suites—is fully documented and accessible within the project's source repository. All statistical calculations are reproducible via the automated pipeline.

**Correspondence:**  
Correspondence concerning this report should be addressed to Bharath Paramasivan, Department of Analytics and Technology, University of Niagara Falls Canada, 4342 Queen Street, Niagara Falls, ON L2E 7J7, Canada. Electronic Mail: bparamasivan@myunfc.ca.

---

## Executive Summary

### Context and Problem Definition
Emergency departments (EDs) across Canada operate under persistent operational strain, characterized by prolonged patient wait times, acute treatment area overcrowding, and substantial variance in patient length of stay (LOS). As the primary point of unscheduled clinical access for acute illness and trauma, Canadian EDs register tens of millions of encounters annually. Length of stay—defined by the Canadian Institute for Health Information (CIHI) as the total elapsed duration from initial triage registration to physical departure from the emergency facility—serves as the preeminent operational metric for hospital throughput and emergency flow efficiency. Extended stays in the emergency department are consistently linked to diminished clinical outcomes, increased mortality among critically ill patients, elevated rates of patients leaving without being seen (LWBS), and severe systemic ambulance offload delays.

Despite the critical importance of emergency throughput, healthcare decision-makers and regional health authorities frequently lack access to structured, reproducible, aggregate-level analytical tools capable of synthesizing longitudinal trends across diverse clinical, demographic, and disposition cohorts. Unstratified aggregate reporting often masks critical clinical heterogeneity: high-acuity patients legitimately require resource-intensive interventions and extended observation, whereas non-urgent presentations should resolve rapidly. Without rigorous statistical modeling that accounts for distribution skewness and multi-cohort interactions, operational interventions risk misallocating scarce hospital resources. This capstone project addresses this operational and analytical deficit by executing a comprehensive data analytics lifecycle over nineteen fiscal years of national reporting data.

### Research Questions and Hypotheses
The primary objective of this investigation is to evaluate the clinical, operational, and demographic determinants of emergency department length of stay in Canada. Five formal, pre-registered statistical hypotheses guide the empirical investigation:
1. **Hypothesis 1 (Triage Acuity vs. Length of Stay):** Evaluates whether reported median ED length of stay differs significantly across the five clinical tiers of the Canadian Triage and Acuity Scale (CTAS I: Resuscitation through CTAS V: Non-Urgent).
2. **Hypothesis 2 (Admission Bottleneck Impact):** Investigates whether patients admitted to inpatient hospital beds experience significantly longer emergency department length of stay compared to patients discharged home or transferred.
3. **Hypothesis 3 (Predictive Acuity Modeling):** Evaluates whether a standardized numeric CTAS urgency score serves as a statistically viable linear predictor of reported median length of stay in a Weighted Least Squares (WLS) regression framework.
4. **Hypothesis 4 (Demographic Age Disparities):** Assesses whether reported median length of stay varies significantly across broad life-stage age categories (Pediatric/Youth, Young Adults, Middle Adults, and Older Adults).
5. **Hypothesis 5 (Sex and Admission Independence):** Tests whether an empirical association exists between patient biological sex and final emergency visit disposition (inpatient admission vs. non-admission).

In addition to cross-sectional hypothesis testing, the research investigates longitudinal demand dynamics through non-parametric monotonic trend detection, Simple Exponential Smoothing (SES) five-year forecasting, and the mathematical construction of an Estimated Resource Burden Index (ERBI).

### Analytical Methodology and Rigor
The research utilizes the CIHI National Ambulatory Care Reporting System (NACRS) supplementary data tables spanning nineteen fiscal years, from FY 2003–2004 through FY 2021–2022. The compiled dataset comprises 8,685 aggregate reporting rows representing approximately 175.8 million emergency department encounters across participating Canadian health jurisdictions. Data were ingested, cleaned, standardized, and structured into a relational SQLite analytical data store comprising six optimized tables (`ed_visits`, `ctas_triage`, `visit_disposition`, `age_sex`, `main_problems`, and `demographics`). Cleaning protocols eliminated summary roll-up rows to prevent population double-counting, standardized categorical string encodings, handled data suppression thresholds, and derived standardized temporal, acuity, and demographic features.

Because healthcare duration data exhibit pronounced positive skewness and aggregate strata represent varying cohort volumes, classical parametric assumptions (normality, homoscedasticity) are violated. To maintain statistical validity without introducing arbitrary distributional transformations, the analytical framework implements frequency-weighted non-parametric algorithms. Aggregate visit counts (`ed_visits`) serve as analytic frequency weights within midrank computing algorithms, expanding aggregate records to their true population equivalent ($N \approx 175.8\text{M}$ visits). Hypotheses H1 and H4 were tested via Weighted Kruskal–Wallis $H$-tests followed by Bonferroni-adjusted pairwise Dunn post-hoc tests and Epsilon-Squared ($\varepsilon^2$) effect size computations. Hypothesis H2 was evaluated using a two-sided Weighted Mann–Whitney $U$-test and Rank-Biserial Correlation ($r_b$). Hypothesis H3 was modeled via Weighted Least Squares (WLS) linear regression. Hypothesis H5 was evaluated via Pearson's Chi-Square ($\chi^2$) test of independence and Cramer's $V$. Longitudinal trends were evaluated using the Mann–Kendall monotonic trend test with Sen's slope estimator, and future visit demand was projected using Simple Exponential Smoothing ($\alpha = 0.30$) with 95% confidence intervals.

```
+---------------------------------------------------------------------------------------------------+
|                                 ANALYTICAL LIFECYCLE ARCHITECTURE                                 |
+---------------------------------------------------------------------------------------------------+
|  1. Ingestion: Raw CIHI NACRS Supplementary Tables (19 Fiscal Years, FY 2003-04 to 2021-22)      |
|  2. Preparation: Roll-up Filtering, Anomaly Resolution, SQLite Analytical Database Construction   |
|  3. Methodology: Frequency-Weighted Non-Parametric Inference & Time-Series Forecasting Engines    |
|  4. Synthesis: Interactive React 19 / FastAPI Decision Support System & Strategic Policy Roadmap   |
+---------------------------------------------------------------------------------------------------+
```

### Key Empirical Findings
The empirical results provide robust, statistically significant evidence regarding the primary operational drivers of Canadian emergency department throughput:
- **Acuity Stratification (H1 Supported):** Reported median length of stay differs significantly across CTAS acuity tiers ($H = 126,319,368.24$, $df = 4$, $p < .0001$). The omnibus effect size is exceptionally large ($\varepsilon^2 = 0.7251$), with all pairwise post-hoc comparisons significant at $p_{\text{adj}} < .0001$. CTAS II (Emergent) presentations exhibit the highest weighted median length of stay at 288 minutes (4.80 hours), whereas CTAS V (Non-Urgent) visits average 80 minutes (1.33 hours).
- **The Inpatient Admission Bottleneck (H2 Supported):** Inpatient admission represents the single most severe operational divergence in emergency duration ($U = 2,689,068,488,900.00$, $p < .0001$). The rank-biserial correlation demonstrates a near-deterministic effect size ($r_b = 0.998$). Admitted patients experience a weighted median emergency stay of 636 minutes (10.60 hours), compared to 150 minutes (2.50 hours) for non-admitted patients—a more than fourfold duration disparity driven primarily by inpatient bed shortages and boarding delays.
- **Predictive Acuity Modeling (H3 Supported):** Weighted Least Squares regression confirms a statistically significant inverse linear relationship between CTAS urgency score and median LOS ($\beta = -115.72$ minutes per score level, $SE = 6.18$, $t = -18.72$, $p < .0001$, $R^2 = 0.3162$). For each unit decrease in clinical urgency (higher numerical score), median emergency stay decreases by approximately 1.93 hours.
- **Geriatric Length of Stay Elevation (H4 Supported):** Patient age cohort is strongly associated with emergency stay duration ($H = 126,863,835.84$, $df = 3$, $p < .0001$, $\varepsilon^2 = 0.7218$). Older Adults (aged 65+) sustain the longest weighted median stays at 250 minutes (4.17 hours), compared to 123 minutes (2.05 hours) for Pediatric and Youth cohorts, reflecting higher multi-morbidity and complex diagnostic pathways.
- **Sex and Disposition Association (H5 Supported with Negligible Effect):** While Pearson's chi-square test confirms a statistically significant association between patient sex and admission status ($\chi^2 = 18,164.97$, $df = 1$, $p < .0001$), the practical effect size is negligible (Cramer's $V = 0.0102$). This finding cautions healthcare leaders against implementing sex-differentiated flow pathways.
- **Longitudinal Growth and Forecasting:** A Mann–Kendall test confirms a statistically significant, monotonic upward trend in annual Canadian ED visits over the 19-year baseline ($S = 161$, $z = 5.60$, $p = 2.17 \times 10^{-8}$, Sen's slope $\approx +550,907$ visits per fiscal year). Simple Exponential Smoothing projects annual visit volumes stabilizing near 12.95 million encounters, with 95% forecast intervals spanning 9.05 million to 16.85 million visits at horizon $FY+1$.
- **Resource Burden Modeling:** Longitudinal analysis of the Estimated Resource Burden Index (ERBI)—a composite index integrating visit volume and acuity duration—reveals a significant monotonic upward trajectory ($\tau = 0.9766$, $p < .0001$), highlighting that cumulative clinical bed-occupancy pressure expands faster than simple visit headcounts.

### Strategic Recommendations and Implementation Roadmap
Based on empirical findings and quantitative modeling, this report establishes a prioritized, evidence-based operational roadmap for hospital executives, clinical directors, and health system planners:
1. **Tier 1: Targeted Fast-Track Pathways for Low-Acuity Presentations (Immediate Horizon, Months 1–6):** Establish dedicated physician-led rapid assessment zones (RAZ) and nurse-initiated fast-track streams for CTAS IV and V cohorts. Removing non-urgent volume from main acute treatment zones reduces low-acuity LOS by an estimated 20–30% and decompresses waiting corridors.
2. **Tier 2: Inpatient Bed-Management and Discharge Lounge Protocols (Medium Horizon, Months 6–18):** Address the catastrophic 10.6-hour admission bottleneck by deploying morning discharge quotas, active bed-tracking systems, and transitional discharge lounges on inpatient wards to eliminate emergency boarding hours.
3. **Tier 3: Specialized Geriatric Emergency Management (GEM) Protocols (Long-Term Horizon, Months 18–36):** Implement comprehensive geriatric assessment units within emergency departments to streamline complex multi-morbid care, minimize redundant diagnostics, and accelerate specialized disposition.
4. **Tier 4: Enterprise Analytics and Continuous KPI Monitoring (Ongoing):** Institutionalize an automated analytics dashboard architecture tracking median LOS, 90th percentile wait times, boarding durations, and ERBI capacity metrics to enable proactive operational load-balancing.

---

## Table of Contents

- **Preliminary Pages**
  - Title Page & Author Note .................................................................... Page 1
  - Executive Summary ............................................................................ Page 2
  - Table of Contents ............................................................................ Page 4
  - List of Tables ............................................................................... Page 5
  - List of Figures .............................................................................. Page 6
  - Glossary of Acronyms and Abbreviations ....................................................... Page 7
- **Chapter 1: Problem Analysis and Strategic Context** .......................................... Page 8
  - 1.1 Canadian Emergency Healthcare System Landscape
  - 1.2 Operational Bottlenecks, Crowding, and Bed-Block Mechanics
  - 1.3 Problem Statement and Analytical Decision Framework
  - 1.4 Project Objectives and Research Scope
  - 1.5 Canonical Hypotheses Registry (H1–H5)
- **Chapter 2: Analytics Lifecycle and Project Methodology** ...................................... Page 13
  - 2.1 Ten-Stage Analytics Lifecycle Framework Mapping
  - 2.2 Mathematical Foundations of Non-Parametric Inferential Methods
  - 2.3 Frequency-Weighting Algorithms and Ecological Inference Boundaries
- **Chapter 3: Data Collection, Inventory, and Preparation** ..................................... Page 18
  - 3.1 Data Provenance and Extraction Architecture
  - 3.2 Relational Dataset Inventory and Table Schemas
  - 3.3 Data Quality Audit, Anomaly Resolution, and Filtering Rules
  - 3.4 Feature Engineering and Derived Performance Indicators
  - 3.5 Analytical Pipeline Infrastructure and Data Isolation
- **Chapter 4: Exploratory Data Analysis and Descriptive Profiling** .............................. Page 24
  - 4.1 19-Year Longitudinal Volume Growth and Acuity Distribution
  - 4.2 Triage Acuity and Inpatient Admission Descriptive Distributions
  - 4.3 Demographic Profiling: Age and Biological Sex Intersections
  - 4.4 Clinical Case-Mix and Main Presenting Problem Resource Footprint
- **Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference** ......................... Page 30
  - 5.1 Hypothesis 1: CTAS Triage Acuity and Length of Stay (Weighted Kruskal–Wallis)
  - 5.2 Hypothesis 2: Inpatient Admission Status Bottleneck Impact (Weighted Mann–Whitney U)
  - 5.3 Hypothesis 3: Predictive Acuity Regression (Weighted Least Squares)
  - 5.4 Hypothesis 4: Demographic Age Cohort Disparities (Weighted Kruskal–Wallis)
  - 5.5 Hypothesis 5: Sex vs. Admission Disposition Independence (Pearson Chi-Square)
  - 5.6 Synthesis of Empirical Hypothesis Results
- **Chapter 6: Time-Series Trend Analysis and Demand Forecasting** ............................... Page 38
  - 6.1 Longitudinal Monotonic Trend Detection (Mann–Kendall Test & Sen's Slope)
  - 6.2 Simple Exponential Smoothing (SES) Volume Forecasting Model
  - 6.3 Multi-Year Demand Horizon Projections (FY+1 to FY+5) with 95% CIs
  - 6.4 Estimated Resource Burden Index (ERBI) Capacity Modeling
- **Chapter 7: Data Visualization and Decision Support Systems** ................................. Page 44
  - 7.1 Architecture of the Interactive Decision-Support Dashboard
  - 7.2 Core Analytical Visualizations and Visual Interpretation
  - 7.3 Decision-Maker Interaction Modes and Self-Service Exploration
- **Chapter 8: Findings, Synthesis, and Critical Discussion** .................................... Page 48
  - 8.1 Empirical Synthesis: The Triad of Acuity, Bed Block, and Age
  - 8.2 Benchmarking Findings Against Canadian Health Services Literature
  - 8.3 Methodological Strengths and Governance Rigor
  - 8.4 Critical Analytical Limitations and Boundary Constraints
- **Chapter 9: Strategic Recommendations and Implementation Roadmap** ........................... Page 53
  - 9.1 Evidence-Driven Operational and Clinical Recommendations
  - 9.2 Implementation Matrix: Prioritization, Feasibility, and Cost-Impact
  - 9.3 Governance Framework, Risk Mitigation, and KPI Monitoring Plan
- **Chapter 10: References and Technical Appendices** ............................................ Page 58
  - References (APA 7th Edition)
  - Appendix A: Relational Database Schema DDL and Data Dictionary
  - Appendix B: Full Statistical Output Tables and Assumption Diagnostics

---

## List of Tables

*Table 1* \
*Summary Inventory of the CIHI NACRS Relational Database Tables* ............................. Page 20

*Table 2* \
*Data Cleaning Rules, Anomaly Resolutions, and Methodological Rationale* ...................... Page 22

*Table 3* \
*Longitudinal Canadian Emergency Department Visit Volumes and Reported Median LOS (FY 2003–2021)* .. Page 25

*Table 4* \
*Weighted Median Length of Stay and Volume by CTAS Triage Acuity Level* ....................... Page 27

*Table 5* \
*Weighted Dunn Post-Hoc Pairwise Acuity Comparisons with Bonferroni Correction (H1)* ........... Page 32

*Table 6* \
*Weighted Mann–Whitney U Test Results for Inpatient Admission Status (H2)* ..................... Page 33

*Table 7* \
*Weighted Least Squares (WLS) Regression Model Summary and Coefficient Estimates (H3)* ......... Page 35

*Table 8* \
*Weighted Dunn Post-Hoc Pairwise Age Cohort Comparisons with Bonferroni Correction (H4)* ........ Page 36

*Table 9* \
*Contingency Matrix and Chi-Square Test of Independence for Sex vs. Admission (H5)* ............. Page 37

*Table 10* \
*Master Synthesis of Pre-Registered Hypotheses Testing Results (H1–H5)* ......................... Page 38

*Table 11* \
*Mann–Kendall Trend Test and Sen's Slope Parameter Estimates* .................................. Page 40

*Table 12* \
*Five-Year Simple Exponential Smoothing (SES) Volume Projections with 95% CIs* .................. Page 42

*Table 13* \
*Strategic Operational Implementation Matrix: Milestones, Feasibility, and Governance* .......... Page 56

---

## List of Figures

*Figure 1* \
*Nineteen-Year Longitudinal Emergency Department Visit Volume Trajectory in Canada (FY 2003–2021)* .. Page 26

*Figure 2* \
*Distribution of Reported Median ED Length of Stay Across CTAS Acuity Tiers (H1)* ............... Page 45

*Figure 3* \
*Comparative Median Length of Stay Distribution: Inpatient Admitted vs. Non-Admitted Visits (H2)* .. Page 46

*Figure 4* \
*Weighted Least Squares Regression Fit: CTAS Urgency Score vs. Reported Median LOS (H3)* ........ Page 47

*Figure 5* \
*Five-Year SES Demand Forecast Horizon with Expanding 95% Confidence Intervals* ................ Page 48

*Figure 6* \
*Longitudinal Trajectory of the Estimated Resource Burden Index (ERBI, 2003–2021)* ............... Page 49

*Figure 7* \
*Full Analytics Platform System Architecture: React 19 Frontend and FastAPI Backend* ........... Page 51

---

## Glossary of Acronyms and Abbreviations

| Acronym / Abbreviation | Full Definition and Contextual Meaning |
| :--- | :--- |
| **APA** | American Psychological Association (7th Edition Academic Documentation Standard) |
| **CAEP** | Canadian Association of Emergency Physicians |
| **CI** | Confidence Interval (typically estimated at the 95% nominal level) |
| **CIHI** | Canadian Institute for Health Information |
| **CLO** | Course Learning Outcome |
| **CTAS** | Canadian Triage and Acuity Scale (5-level standardized clinical triage tool) |
| **ED** | Emergency Department |
| **EHR** | Electronic Health Record |
| **ERBI** | Estimated Resource Burden Index ($\text{Visits} \times \text{Median LOS}_{\text{hrs}} \times 60$) |
| **FY** | Fiscal Year (e.g., FY 2021–22 spans April 1, 2021 through March 31, 2022) |
| **GEM** | Geriatric Emergency Management |
| **IQR** | Interquartile Range ($Q_3 - Q_1$) |
| **LOS** | Length of Stay (total elapsed time from registration to departure, in minutes or hours) |
| **LWBS** | Left Without Being Seen |
| **MDA** | Master of Data Analytics |
| **NACRS** | National Ambulatory Care Reporting System (CIHI national reporting standard) |
| **PHI** | Protected Personal Health Information |
| **RAZ** | Rapid Assessment Zone |
| **REB** | Research Ethics Board |
| **SD** | Standard Deviation |
| **SE** | Standard Error |
| **SES** | Simple Exponential Smoothing (time-series forecasting method) |
| **TCPS 2** | Tri-Council Policy Statement: Ethical Conduct for Research Involving Humans |
| **UNF** | University of Niagara Falls Canada |
| **WLS** | Weighted Least Squares (regression algorithm incorporating analytic stratum weights) |
