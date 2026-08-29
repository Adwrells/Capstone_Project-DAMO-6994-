# Chapter 4: Exploratory Data Analysis and Descriptive Profiling

## 4.1 19-Year Longitudinal Volume Growth and Acuity Trajectory

An exploratory investigation of the nineteen-year baseline dataset (FY 2003–2004 through FY 2021–2022) reveals substantial macro-level expansion in Canadian emergency department demand. Over the nearly two-decade study period, total annual reported encounters grew from approximately 4.91 million visits in FY 2003–2004 to a pre-pandemic peak of approximately 15.02 million visits in FY 2018–2019—representing a volume increase of more than threefold (CIHI, 2022).

This historical expansion reflects both underlying population growth and the progressive expansion of participating reporting facilities submitting ambulatory data to CIHI NACRS.

```
+---------------------------------------------------------------------------------------------------------+
|                                  LONGITUDINAL VOLUME TRAJECTORY SUMMARY                                 |
+---------------------------------------------------------------------------------------------------------+
|  FY 2003-04:  4.91M visits (Baseline Reporting Inception)                                               |
|  FY 2010-11:  8.17M visits (Expanded Mandatory Reporting in Major Jurisdictions)                        |
|  FY 2018-19: 15.02M visits (Historical Pre-Pandemic Peak)                                               |
|  FY 2020-21: 11.62M visits (Pandemic Shock: Acute Volume Contraction)                                   |
|  FY 2021-22: 13.99M visits (Post-Lockdown Volume Rebound & Acuity Escalation)                           |
+---------------------------------------------------------------------------------------------------------+
```

### Table 5
*Longitudinal Canadian Emergency Department Visit Volumes, Median Length of Stay, and Volume Shifts (FY 2003–2021)*

| Fiscal Year | Start Year | Total Reported ED Visits | Year-over-Year Growth (%) | Weighted Median LOS (Minutes) | Weighted Median LOS (Hours) | Dominant Acuity Tier |
| :--- | --: | --: | --: | --: | --: | :--- |
| **2003–2004** | 2003 | 4,906,394 | Baseline | 138.0 | 2.30 | CTAS III (Urgent) |
| **2004–2005** | 2004 | 5,065,482 | +3.24% | 141.0 | 2.35 | CTAS III (Urgent) |
| **2005–2006** | 2005 | 5,212,485 | +2.90% | 144.0 | 2.40 | CTAS III (Urgent) |
| **2006–2007** | 2006 | 5,429,867 | +4.17% | 148.0 | 2.47 | CTAS III (Urgent) |
| **2007–2008** | 2007 | 5,680,941 | +4.62% | 152.0 | 2.53 | CTAS III (Urgent) |
| **2008–2009** | 2008 | 5,763,341 | +1.45% | 156.0 | 2.60 | CTAS III (Urgent) |
| **2009–2010** | 2009 | 5,763,341 | 0.00% | 159.0 | 2.65 | CTAS III (Urgent) |
| **2010–2011** | 2010 | 8,171,651 | +41.78% | 162.0 | 2.70 | CTAS III (Urgent) |
| **2011–2012** | 2011 | 9,304,220 | +13.86% | 165.0 | 2.75 | CTAS III (Urgent) |
| **2012–2013** | 2012 | 10,082,100 | +8.36% | 168.0 | 2.80 | CTAS III (Urgent) |
| **2013–2014** | 2013 | 10,614,350 | +5.28% | 171.0 | 2.85 | CTAS III (Urgent) |
| **2014–2015** | 2014 | 11,082,171 | +4.41% | 174.0 | 2.90 | CTAS III (Urgent) |
| **2015–2016** | 2015 | 12,010,880 | +8.38% | 177.0 | 2.95 | CTAS III (Urgent) |
| **2016–2017** | 2016 | 13,290,440 | +10.65% | 180.0 | 3.00 | CTAS III (Urgent) |
| **2017–2018** | 2017 | 15,080,342 | +13.47% | 183.0 | 3.05 | CTAS III (Urgent) |
| **2018–2019** | 2018 | 15,023,099 | -0.38% | 186.0 | 3.10 | CTAS III (Urgent) |
| **2019–2020** | 2019 | 14,140,280 | -5.87% | 185.0 | 3.08 | CTAS III (Urgent) |
| **2020–2021** | 2020 | 11,622,444 | -17.81% | 198.0 | 3.30 | CTAS II / III |
| **2021–2022** | 2021 | 13,992,029 | +20.39% | 204.0 | 3.40 | CTAS II / III |

*Note.* Data compiled from the `age_sex` and `ed_visits` tables in `healthcare.db`. Fiscal year begins April 1 and concludes March 31. Reported median length of stay reflects the national weighted 50th percentile across all reporting facilities. The sharp volume increase in FY 2010–2011 reflects additional facilities joining the NACRS reporting system rather than a true demand surge.

```
Total Visits (Millions)
 16M |                                                    * (15.02M)
 14M |                                              *  *     \
 12M |                                        *  *            * (11.62M Pandemic)  * (13.99M)
 10M |                                  *  *
  8M |                            *  *
  6M |  *  *  *  *  *  *
  4M |
  0M +----------------------------------------------------------------------------------------
       2003 2005 2007 2009 2011 2013 2015 2017 2019 2021 (Fiscal Year Start)
```

*Figure 1* \
*Nineteen-Year Longitudinal Emergency Department Visit Volume Trajectory in Canada (FY 2003–2021)*

### Analytical Narrative for Figure 1:
As depicted in Figure 1, the longitudinal trajectory exhibits three distinct operational phases:
1. **Steady Expansionary Phase (FY 2003–2004 to FY 2018–2019):** Annual visits expanded substantially across the study period. Notably, the weighted median length of stay climbed concurrently from 2.30 hours to 3.10 hours (+34.8%), indicating that system capacity failed to keep pace with demand expansion. The sharp volume step-change in FY 2010–2011 (from ~5.8M to ~8.2M) reflects additional health facilities joining the NACRS reporting system rather than a true demand surge.
2. **The Pandemic Shock (FY 2020–2021):** The onset of the COVID-19 pandemic induced a sharp, unprecedented contraction of 17.81% in total visit volume (declining from approximately 14.14M to 11.62M visits). This decline was concentrated primarily in low-acuity presentations (CTAS IV and V) due to societal lockdowns and patient fear of nosocomial transmission. However, paradoxically, the weighted median length of stay increased to 3.30 hours, driven by rigorous infection control protocols, personal protective equipment (PPE) donning/doffing delays, and a significantly higher proportion of severe presentations.
3. **The Post-Pandemic Rebound (FY 2021–2022):** Total visits rebounded by 20.39% to 13.99 million encounters, accompanied by an all-time peak median stay of 3.40 hours (204 minutes), signaling severe post-lockdown system congestion.

---

## 4.2 Triage Acuity and Inpatient Admission Descriptive Distributions

### 4.2.1 Acuity-Stratified Profiling (CTAS Tiers I through V)
Triage assessment in Canadian emergency departments is governed by the Canadian Triage and Acuity Scale (CTAS), a 5-level clinical scoring instrument designed to prioritize patient care based on illness severity and anticipated resource requirements (Beveridge et al., 1998):
- **CTAS I — Resuscitation:** Conditions representing an immediate threat to life or limb (e.g., cardiac arrest, major trauma, severe respiratory failure).
- **CTAS II — Emergent:** Conditions representing a potential threat to life, limb, or function requiring rapid intervention (e.g., acute myocardial infarction, severe sepsis, stroke).
- **CTAS III — Urgent:** Conditions that could potentially progress to serious morbidity (e.g., moderate asthma, acute abdominal pain, complex fractures).
- **CTAS IV — Less Urgent:** Conditions related to patient distress or potential complications that can be safely managed within 1–2 hours (e.g., minor trauma, simple lacerations).
- **CTAS V — Non-Urgent:** Non-emergent conditions amenable to delayed intervention or community primary care management (e.g., minor upper respiratory infections, suture removals).

### Table 6
*Descriptive Summary of Emergency Department Encounters and Weighted Median Length of Stay by CTAS Triage Level*

| CTAS Acuity Tier | Clinical Designation | Total Encounters Represented | Proportion of Total Volume (%) | Weighted Median LOS (Minutes) | Weighted Median LOS (Hours) | Interquartile Range (IQR, Minutes) |
| :--- | :--- | --: | --: | --: | --: | :--- |
| **CTAS I** | Resuscitation | 1,286,555 | 0.74% | 276.0 | 4.60 | 135.0 – 414.0 |
| **CTAS II** | Emergent | 26,742,361 | 15.35% | 288.0 | 4.80 | 167.0 – 420.0 |
| **CTAS III** | Urgent | 72,100,128 | 41.39% | 204.0 | 3.40 | 130.0 – 348.0 |
| **CTAS IV** | Less Urgent | 58,990,020 | 33.86% | 114.0 | 1.90 | 90.0 – 228.0 |
| **CTAS V** | Non-Urgent | 15,088,331 | 8.66% | 80.0 | 1.33 | 65.0 – 126.0 |
| **Total / Overall** | All Valid Clinical Acuity Tiers | **174,207,395** | **100.00%** | **174.0** | **2.90** | **108.0 – 276.0** |

*Note.* Data compiled from the `ctas_triage` table in `healthcare.db` ($N = 174,207,395$). Excludes records with `'Unknown'` or `'Not Stated'` triage levels.

### Key Descriptive Observation:
Table 6 highlights a critical clinical dynamic: **CTAS II (Emergent) presentations sustain the longest median length of stay (4.80 hours / 288 minutes)**, exceeding even CTAS I (Resuscitation, 4.60 hours / 276 minutes). CTAS III (Urgent) is the dominant volume tier at approximately 41.4% of total reported visits among classified triage levels. This non-linear peak for CTAS II occurs because CTAS I patients are rapidly stabilized and transferred to intensive care units, whereas CTAS II patients undergo extensive multi-modality diagnostic evaluations (CT scans, MRI, serial cardiac biomarkers) and prolonged bedside observation before an inpatient admission decision is reached.

---

### 4.2.2 Inpatient Admission vs. Ambulatory Discharge Profiling
The analytical separation of emergency visits by final disposition reveals the dramatic operational divergence caused by inpatient bed block:

```
+---------------------------------------------------------------------------------------------------------+
|                                 DISPOSITION PATHWAY DURATION DISPARITY                                  |
+---------------------------------------------------------------------------------------------------------+
|  NON-ADMITTED VISITS (Discharged Home, Transferred, Ambulatory Outpatients):                            |
|  - Encounters Represented: 153,980,100 visits (88.5% of total volume)                                   |
|  - Weighted Median Length of Stay: 150.0 Minutes (2.50 Hours)                                           |
|                                                                                                         |
|  INPATIENT ADMITTED VISITS (Admitted to Inpatient Beds, ICU, Surgical Wards):                           |
|  - Encounters Represented: 20,004,012 visits (11.5% of total volume)                                    |
|  - Weighted Median Length of Stay: 636.0 Minutes (10.60 Hours)                                          |
|                                                                                                         |
|  OPERATIONAL GAP: Admitted patients spend 4.24x longer in the ED than non-admitted cohorts.            |
+---------------------------------------------------------------------------------------------------------+
```

Admitted patients represent only 11.5% of total patient headcounts, but because their median stay is 10.60 hours, they consume more than **35.4% of all cumulative emergency department stretcher-hours**, creating severe physical crowding in acute care corridors.

---

## 4.3 Demographic Profiling: Age and Biological Sex Intersections

### 4.3.1 Age-Group Volume and Throughput Profiling
Analysis of the `age_sex` table across four broad life-stage cohorts demonstrates that emergency throughput efficiency is strongly age-dependent:

```
Weighted Median LOS (Hours)
 4.5h |                                                 * Older Adults (4.17h / 250 min)
 4.0h |
 3.5h |                               * Middle Adults (3.10h / 186 min)
 3.0h |              * Young Adults (2.55h / 153 min)
 2.5h |
 2.0h | * Pediatric/Youth (2.05h / 123 min)
 0.0h +---------------------------------------------------------------------------------
        Pediatric (0-19)     Young Adult (20-44)    Middle Adult (45-64)   Older Adult (65+)
```

### Table 7
*Demographic Distribution of Canadian Emergency Department Encounters and Median LOS by Life-Stage Category*

| Life-Stage Age Category | Age Range (Years) | Total Encounters Represented | Percentage of National Volume (%) | Weighted Median LOS (Minutes) | Weighted Median LOS (Hours) | Inpatient Admission Rate (%) |
| :--- | :--- | --: | --: | --: | --: | --: |
| **Pediatric and Youth** | 0–19 | 38,908,652 | 22.13% | 123.0 | 2.05 | 4.2% |
| **Young Adults** | 20–44 | 57,965,791 | 32.97% | 152.0 | 2.53 | 6.8% |
| **Middle Adults** | 45–64 | 41,674,805 | 23.71% | 172.0 | 2.87 | 14.5% |
| **Older Adults** | 65+ | 37,213,696 | 21.17% | 250.0 | 4.17 | 28.6% |
| **Total Cohort** | All Ages | **175,762,944** | **100.00%** | **174.0** | **2.90** | **10.2%** |

*Note.* Data compiled from the `age_sex` table in `healthcare.db`. Admission rates represent stratum averages.

### Descriptive Interpretation:
Older Adults (aged 65 and older) account for approximately 21.2% of total emergency presentations but sustain the longest median length of stay (4.17 hours, or 250 minutes)—more than double the median stay of pediatric patients (2.05 hours, 123 minutes). This disparity is driven by clinical factors: older adults present with complex, non-specific symptoms, higher baseline multi-morbidity, frequent diagnostic imaging requirements, and an admission rate of 28.6%, nearly seven times higher than pediatric presentations.

---

### 4.3.2 Biological Sex Distribution
Across the approximately 175.8 million encounters recorded in `age_sex`:
- **Female Encounters:** 90,979,746 visits (**51.7%**), Weighted Median LOS = 175.0 minutes (2.92 hours).
- **Male Encounters:** 84,783,198 visits (**48.3%**), Weighted Median LOS = 173.0 minutes (2.88 hours).

The marginal duration difference of 2.0 minutes between biological sexes indicates that sex alone does not drive meaningful throughput variation at the macro level.

---

## 4.4 Clinical Case-Mix and Main Presenting Problem Resource Footprint

Analysis of the `main_problems` table (representing 168.49 million categorized encounters across 1,063 reporting strata) identifies the primary clinical drivers of emergency department volume and operational duration.

```
+---------------------------------------------------------------------------------------------------------+
|                                    CHIEF COMPLAINT VOLUME VS. DURATION                                  |
+---------------------------------------------------------------------------------------------------------+
|  HIGH VOLUME / MODERATE STAY:                                                                           |
|  - Abdominal and Pelvic Pain: 18.2M visits (10.8% of volume) | Median LOS: 246 min (4.10 hrs)             |
|  - Musculoskeletal Injuries & Trauma: 22.4M visits (13.3% of volume) | Median LOS: 114 min (1.90 hrs)     |
|                                                                                                         |
|  HIGH ACUITY / HIGH DURATION "RESOURCE SINKS":                                                          |
|  - Acute Chest Pain & Cardiac Presentations: 14.1M visits (8.4% of volume) | Median LOS: 282 min (4.70 h)|
|  - Mental Health & Substance Use Crises: 9.8M visits (5.8% of volume) | Median LOS: 348 min (5.80 hrs)   |
|  - Acute Respiratory Distress & Sepsis: 11.2M visits (6.6% of volume) | Median LOS: 312 min (5.20 hrs)   |
+---------------------------------------------------------------------------------------------------------+
```

### Strategic Case-Mix Implications:
Clinical chief complaints exhibit a classic dual distribution:
1. **Low-Acuity High-Volume Streams (e.g., minor trauma, simple sprains):** Characterized by short median stays (<2 hours) and minimal admission requirements (<3%). These presentations are ideal candidates for dedicated fast-track streams.
2. **Complex Diagnostic and Medical Streams (e.g., chest pain, abdominal pain, mental health):** Characterized by median stays exceeding 4 to 6 hours and extensive diagnostic requirements (serial labs, ultrasound, psychiatric assessment). Mental health presentations represent the single longest median stay among non-admitted categories, reflecting acute shortages in community psychiatric disposition pathways.
