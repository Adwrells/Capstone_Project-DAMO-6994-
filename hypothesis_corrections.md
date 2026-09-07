# Chapter 5 Corrections — Reconciled Against the Tested Platform

Purpose: your Executive Summary and Chapter 5 currently report different numbers for the same
hypothesis tests (H1, H2, H3, H4). This document gives the corrected replacement text for each
affected subsection, reconciled against the platform's tested, canonical values (`CHANGELOG.md`
[2.2.0], `HypothesisEvidenceHub.tsx`, `backend/analytics/`, 300-test suite). H5 already agrees
across your document and the platform — no change needed there.

**How to use this:** replace each numbered subsection below in the Word document with the
corrected version. Where a value is marked **[verify in app]**, it isn't something I have a
verified source for — open the live Statistical Analysis stage and copy the exact figure shown,
rather than trusting a number from either existing draft.

---

## Executive Summary — H3 sentence

**Replace:**
> An analysis of the standardized CTAS urgency score confirms that it is an independent predictor of median length of stay (β₁ = −115.72 minutes per level, R² = 0.316)

**With:**
> An analysis of the standardized CTAS urgency score confirms that it is a significant predictor of median length of stay (weighted least squares regression, N = 760 aggregate strata, weighted N = 174,207,395 visits; β₁ = −73.92 minutes per unit increase in urgency score [−1.232 hours], R² = 0.6256, F = 1266.65, p < .001, 95% CI [−78.00, −69.85] minutes)

(No other Executive Summary sentences need changing — H1, H2, H4, H5 already match the platform.)

---

## 5.2.4 Results (H1)

**Replace the table with:**

| Statistic | Result |
|---|---|
| Kruskal–Wallis H | 126,319,368.24 |
| p-value | < 0.0001 |
| Effect size (ε²) | 0.7251 |
| Significant pairwise comparisons | 10 / 10 |

*(Matches your Executive Summary exactly. Pairwise-significance count carried over unchanged — plausible given the effect size, but re-confirm the individual Bonferroni p-values in 5.2.5 against the live app rather than assuming.)*

## 5.2.5 Pairwise Comparison

**[verify in app]** — re-pull the ten Bonferroni-adjusted p-values from the live Dunn post-hoc output rather than keeping the current table, since the omnibus H-statistic it was generated alongside was wrong.

## 5.2.6 Reported Median ED LOS by CTAS Level

**Replace the table with** (matches Chapter 4.2's own table and the Executive Summary):

| CTAS Level | Reported Median ED LOS |
|---|---|
| Resuscitation (CTAS I) | 4.60 hours |
| Emergent (CTAS II) | 4.80 hours |
| Urgent (CTAS III) | 3.40 hours |
| Less Urgent (CTAS IV) | 1.90 hours |
| Non-Urgent (CTAS V) | 1.33 hours |

**[verify in app]** for the IQR column — pull the exact bounds from the live platform; I don't have a verified source for those.

## 5.2.7 Interpretation

The current prose ("Urgent and Emergent categories have especially high reported median stays") was written to match the old, wrong 5.2.6 table. Change the sentence identifying the highest tiers to: *"CTAS II (Emergent) and CTAS I (Resuscitation) have the highest reported median stays, at 4.80 and 4.60 hours respectively, while CTAS V (Non-Urgent) is lowest at 1.33 hours."*

---

## 5.3.4 Results (H2)

**Replace the table with:**

| Statistic | Result |
|---|---|
| Mann–Whitney U | 2.689 × 10¹² (z = 6,952.46) |
| p-value, two-sided | < 0.0001 |
| Rank-biserial correlation (rᵦ) | 0.9981 |
| Reported median difference | 8.10 hours |

## 5.3.5 Reported Median ED LOS

**Replace the table with:**

| Visit Disposition | Reported Median ED LOS |
|---|---|
| Non-Admitted | 2.50 hours |
| Admitted | 10.60 hours |

**[verify in app]** for the IQR column.

## 5.3.6 Interpretation

Update the two LOS figures quoted in prose from "6.10 hours vs. 2.80 hours" to **"10.60 hours vs. 2.50 hours."** The rank-biserial correlation quoted (0.9846) becomes **0.9981**; the qualitative conclusion ("very strong evidence... admission status is associated with reported ED LOS") is unaffected and needs no rewording.

---

## 5.4 — H3 (full section rewrite)

Your Chapter 5.4 currently describes a **different model** than your Executive Summary (a
9-predictor multivariate regression vs. a univariate one). Per your decision, standardize on the
platform's canonical univariate model. Replace all of 5.4.2–5.4.6 with the following:

### 5.4.2 Regression Method

The analysis uses Weighted Least Squares (WLS) regression at the aggregate level.

- **Dependent variable:** reported median ED LOS (minutes)
- **Independent variable:** standardized CTAS urgency score, a continuous predictor scored 1
  (Resuscitation) through 5 (Non-Urgent)
- **Weights:** ED visit count per aggregate stratum
- **Sample:** N = 760 aggregate strata across five CTAS urgency levels (weighted N = 174,207,395
  visits); `Unknown`/unclassified triage rows are excluded rather than assigned a default score

### 5.4.3 Regression Results

| Coefficient | B | 95% CI Low | 95% CI High | p-value |
|---|---|---|---|---|
| Intercept (β₀) | 430.9542 min (7.183 h) | **[verify in app]** | **[verify in app]** | < 0.0001 |
| CTAS urgency score (β₁) | −73.9240 min/unit (−1.232 h/unit) | −78.0016 min | −69.8465 min | < 0.0001 |

Model fit: **R² = 0.6256**, F(1, 758) = 1266.6521, p = 7.10 × 10⁻¹⁶⁴.

*(Standard errors for β₀ and β₁ aren't in my verified source set — pull them from the live
regression output or `backend/analytics/regression.py`'s result object before finalizing.)*

### 5.4.4 Interpretation of the CTAS Coefficient

Each one-unit increase in the standardized CTAS urgency score (i.e., moving one tier toward
lower acuity) is associated with a **73.92-minute (1.232-hour) decrease** in reported median ED
LOS (95% CI [69.85, 78.00] minutes decrease), holding the weighting scheme constant. The
relationship is highly significant (p < .0001) and the model explains **62.6%** of the variance
in reported median LOS at the aggregate level (R² = 0.6256) — a substantially stronger fit than
the platform's earlier draft model achieved.

*(Delete the former 5.4.5 "disposition coefficients" subsection entirely — that discussion
belonged to the multivariate model and no longer applies. If you want to retain the
disposition-vs-LOS relationship as its own finding, present it as evidence already covered under
H2, not restated inside H3.)*

### 5.4.5 Model Interpretation

The R² of 0.6256 indicates that a substantial share of aggregate-level variance in reported
median ED LOS is explained by triage acuity alone. As with every other hypothesis in this
report, the unit of interpretation is the aggregate reporting stratum, not the individual
patient — the coefficient describes how strata with a given acuity level differ from strata with
another, not a guarantee for any single visit.

---

## 5.5.6 Reported Median ED LOS by Age Category (H4)

**Replace the "Older Adult" row's median from 4.01 hours to 4.17 hours** (matches your own
Executive Summary and Chapter 4.3 table). If your Pediatric & Youth figure of 2.02 hours came
from the same re-run that produced 4.01 hours, also re-check it against 2.05 hours (the figure
used elsewhere in your report/platform) before finalizing. The H-statistic (126,863,835.837) and
ε² (0.7218) in this section are consistent with the platform's rounded canonical value (≈1.27×10⁸)
and do **not** need to change.

---

## 5.7 Comparative Synthesis Table (§5.6.7 in your document)

Update the summary table to carry the corrected H1–H4 figures through:

| Hypothesis | Main Result | Effect Size |
|---|---|---|
| H1 | H = 126,319,368.24, p < .0001 | ε² = 0.7251 |
| H2 | U = 2.689 × 10¹², p < .0001 | rᵦ = 0.9981 |
| H3 | β₁ = −73.92 min/unit, R² = 0.6256, p < .0001 | — |
| H4 | H = 126,863,835.837, p < .0001 | ε² = 0.7218 |
| H5 | χ² = 18,164.97, p < .0001 | V = 0.0102 |

---

## Still needed before this is fully closed out

1. **Chapters 6–9, References, Appendices A–C weren't in the excerpt I reviewed** — if any of
   them restate H1/H2/H3/H4 statistics (Chapter 8's discussion and Chapter 9's recommendations
   are the most likely spots), they need the same correction pass. Send them and I'll check.
2. The **[verify in app]** items above (IQRs, regression standard errors) should come from the
   live platform's own output, not be re-typed from either existing draft.
3. Once corrected, it's worth a final pass checking that every number in the Executive Summary
   still matches its counterpart in Chapter 5 — that symmetry is what broke originally, so it's
   the thing most likely to break again during editing.
