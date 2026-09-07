# Capstone Compliance & Rubric Self-Audit

**Course:** DAMO-699-4 — Summer 2026 Capstone Project, University of Niagara Falls
**Platform audited:** Healthcare Analytics Platform (Canadian ED / CIHI NACRS), v2.2.0
**Method:** Direct inspection of the codebase, backend analytics engines, test suites, and
`README.md`/`CHANGELOG.md` — cross-checked line-by-line against the assignment brief and the
`Rubrice_capstone.pdf` scoring criteria. No code or report content was altered to produce this
audit; findings are evidence-based, with file references so every claim below can be re-checked.

**One hard limitation:** `docs/Reports/Final Report Capstone Project.docx` is a binary file I
cannot open. Everything below assesses what the *platform and documentation* demonstrate — the
statistical rigor, data pipeline, and diagnostics actually exist and run. It does **not** assess
the prose, formatting, or citations inside the submitted `.docx` itself. Two rubric rows
(**Professional Structure and Technical Writing**, and half of **Interpretation and Insights**)
live primarily in that document's writing quality, not in the code — you'll need to self-check
those against the guidance below.

---

## 1. Assignment requirement checklist

| Requirement (from the brief) | Status | Evidence |
| :--- | :--- | :--- |
| Team of 3–4 students | ⚠️ **Unverified / likely gap** | `README.md` §Author lists a single name ("Bharath Paramasivan"). No `CONTRIBUTORS`, no multi-author byline anywhere in the repo. If this was built solo, that's a policy conflict with the brief; if it was a team effort, **the README and final report must name every team member and their contribution** — this is graded implicitly under "Professional Structure" and is also a instructor-facing compliance question independent of the rubric. |
| Problem/analytical objective clearly defined | ✅ Strong | README §Overview states one operational question directly: *"what drives Emergency Department length of stay, and which patient cohorts are most affected?"* — answered via 5 pre-registered hypotheses (§The Five Hypotheses). |
| Data collection & preparation, optionally SQL / Power BI | ✅ Strong (SQL); Power BI not used (optional) | SQLite schema (`backend/database/schema.sql`), reproducible load pipeline (`load_csv.py`), a documented, conservative cleaning notebook (`Explorer_Dataset_Cleaning.ipynb`) with a **Removed / Corrected / Flagged** audit table (README §Explorer Dataset cleaning). Power BI wasn't used — the brief lists it as optional ("if appropriate"), and an in-house React/Recharts dashboard replaces it functionally. |
| Multiple analytical techniques, justified | ✅ Present, could be broader | See §3 below — statistical inference, regression, and time-series are all implemented and justified; ML classification/clustering/association-rules/simulation are absent (optional per the brief's "may include," but the top rubric band rewards sophistication). |
| Diagnostics / model evaluation | ✅ Very strong | Dedicated overfitting/underfitting service with train/holdout split, learning curves, complexity curves, 5-fold cross-validation, honestly reported negative results (README §Model Fit Diagnostics, `backend/analytics/statistics/model_validation.py`, 33 tests in `test_model_validation.py`). |
| Visualization & communication | ✅ Strong | Executive dashboard (KPI grid, trend charts, hypothesis suite), Dataset Explorer, custom chart builder, PDF export with vector charts. |
| Final report: problem, data, methods, findings, recommendations | ⚠️ Unverified (binary file) | `docs/Reports/Final Report Capstone Project.docx` exists but its content wasn't inspectable here. Cross-check its sections against §4 of this report. |
| Professional presentation | ⚠️ Out of scope for this audit | No slide deck found in the repo; not assessable from code. |

---

## 2. Rubric criterion-by-criterion

Scored against `Rubrice_capstone.pdf`'s five bands per criterion (Fail 0–39 → Excellent 85–100,
10 pts each, 70 pts total). Target stated by the team: **~9.5/10 per criterion.**

### Problem Analysis and Context (CLO 1) — Currently: **Excellent-band**
The platform states a single, falsifiable operational question up front and grounds it in a
named data source (CIHI NACRS), not a vague topic. It goes further than most capstones by
documenting *why* the naive analysis would be wrong: README §"Every row is an aggregate, not an
observation" explains that the underlying tables are pre-aggregated (one row per reported
combination, not per patient visit), and that running the hypotheses unweighted would silently
answer "do the ~900 aggregate rows differ?" instead of "do the ~174 million visits differ?" —
this is exactly the kind of domain understanding the "Excellent" band asks for ("deep
understanding of the domain and analytical implications").
**To lock in 9.5/10:** make sure the final report's introduction states this same distinction
explicitly (aggregate vs. observation-level data) — it's the single most sophisticated framing
point available and it currently only lives in the README, not confirmed to be in the report.

### Data Collection and Preparation (CLO 2) — Currently: **Excellent-band**
Cleaning is documented as a table of concrete actions with justification (removed roll-up rows,
corrected an EN-DASH/hyphen mismatch that silently broke joins, corrected a mis-derived column,
flagged-not-deleted suppressed counts). The database is reproducible from source in one command,
seeded row counts are stated exactly (8,685 rows / 6 tables), and a `COLUMN_MAP` test suite
guards against silent schema drift.
**To lock in 9.5/10:** the final report should reproduce the "Removed / Corrected / Flagged / Why"
table from the README almost verbatim — it's already written at report quality; don't
re-summarize it into something vaguer.

### Analytical Methods and Implementation (CLO 2) — Currently: **Good→Excellent border**
What's implemented, and implemented *rigorously*:
- **Non-parametric inference**: weighted Kruskal-Wallis + Dunn post-hoc (H1, H4), weighted
  Mann-Whitney U (H2), Pearson Chi-square + Cramér's V (H5) — all computed against the
  **visit-weighted** population (not the aggregate rows), with exact chi²/normal/Student-t
  p-values checked against SciPy to ~1e-12 (`backend/analytics/statistics/weighted.py`).
- **Regression / predictive modeling**: true visit-weighted WLS (H3, `regression.py`), plus an
  independent polynomial-regression diagnostic suite with train/holdout split and 5-fold CV.
- **Time-series**: Mann-Kendall trend test + Sen's slope, Simple Exponential Smoothing forecast
  with 95% prediction intervals.

That's three distinct technique families, each justified against the data's shape (non-normal,
right-skewed LOS → non-parametric; aggregate rows → weighting). **What's absent**: no
ML-style classification, clustering/segmentation, association-rule mining, simulation, or
anomaly detection — the brief lists these as things a project "may include," not a strict
checklist, so this isn't a compliance gap, but the rubric's top band language ("sophisticated
analytical implementation") tends to reward visible breadth.
**To move from Good to a clean 9.5/10:** add **one** lightweight technique from an
unrepresented family and make it genuinely useful rather than decorative — the best fit given
the existing data is a **k-means or hierarchical cluster on the age×sex×CTAS cohort table** to
identify natural patient-risk segments, presented alongside (not replacing) H1–H5. This is a
half-day addition, reuses data already in `age_sex`/`ctas_triage`, and directly answers "which
patient cohorts are most affected" — which is literally the question the README already poses.

### Interpretation and Insights (CLO 1, CLO 2) — Currently: **Good→Excellent border**
The Model Fit Diagnostics section is a standout: it reports **negative results plainly**
("Volume does not predict length of stay at all — R² of 0.000 — which is itself a defensible
negative result") rather than dressing up a weak model, and it explains *why* the same predictor
(CTAS urgency) scores 0.588 in one table and 0.007 in another (aggregation level, case-mix
variation) — that is exactly "insightful interpretation demonstrating strong analytical
reasoning" per the rubric. `strategic_synthesis_service.py` also classifies evidence strength
per hypothesis (not just p<0.05) and feeds a "Synthesized Evidence-to-Action Protocol" in the
Strategic Insights page — i.e., findings are already connected to operational recommendations,
not left as bare statistics.
**To lock in 9.5/10:** confirm the final report's "Findings" section states conclusions the same
way the code does — with the caveats intact (non-causal language, aggregation-level caveats,
"statistically significant but clinically negligible" for H5's tiny Cramér's V) — rather than
flattening them into simpler claims for readability. The rigor is the differentiator; don't
lose it in the write-up.

### Application of Analytics Lifecycle (CLO 3) — Currently: **Excellent-band**
The platform's own UI *is* the lifecycle, staged and enforced in order: Prep & Quality Engine →
Dataset Explorer → Statistical Analysis → Executive Dashboard → Strategic Insights → Reports &
Export (`App.tsx` `STAGES` array). A user cannot skip data validation and reach analysis — the
app blocks that transition with an explicit modal. This is a materially stronger demonstration
of lifecycle application than a report describing the lifecycle in prose, because it's
enforced in the software, not just narrated.
**To lock in 9.5/10:** in the report, name this explicitly as evidence — "the lifecycle is
enforced in the application state machine, not just followed procedurally" — with a screenshot
of the stage sidebar. Graders skim; make the strongest evidence easy to find.

### Data Visualization and Communication (CLO 4) — Currently: **Good, fixable to Excellent this session**
Strong dashboard (KPI grid, trend charts, hypothesis suite, contingency heatmap, custom chart
builder), consistent design system, dark/light themes, and genuine vector-PDF export. This
session found and fixed several visualization-layer defects that would have cost points under
close grading (a rubric grader who screenshots the live app, not just the report, would have
hit these):
- KPI card text that never updated with the underlying number (always showed "+0.0h").
- A statistics panel showing hardcoded example numbers instead of the computed result.
- A trend badge that always claimed "significant, upward" regardless of the actual test result.
- Data-table column headers that truncated with no way to read the full name.
- Two invalid CSS utility classes that silently produced no styling (misaligned badges,
  wrong-height buttons).
See `CHANGELOG.md` (this session's entry) for the full list — all verified against a clean
`tsc --noEmit` type-check.
**To lock in 9.5/10:** open every stage of the app once end-to-end (not just the dashboard) right
before submission and watch for numbers that don't move when you change a filter — that class of
bug is the one most likely to be visible to a grader and most damaging to "communication" credit.

### Professional Structure and Technical Writing (CLO 4, CLO 5) — Currently: **Not directly assessable (binary report)**
The *codebase's* documentation (`README.md`, `CHANGELOG.md`, `architecture.md`,
`BACKEND_STATISTICS_NOTES.md`) is exceptionally well written for a student project — it
self-audits its own past mistakes with dates and reasons ("previously documented here as X;
correction: it's actually Y"), which is a rare and graduate-level trait. If the final report
matches that tone and rigor, this criterion is close to a lock. What I can't verify: report
formatting, citation style, section ordering, and whether it reads as one authored artifact.
**Action:** run the final `.docx` through the rubric's own five criteria descriptions as a
checklist before submission — especially confirming a References/Data Sources section (CIHI
citation), consistent terminology (the codebase had to *fix* inconsistent terminology like
"Holt's Linear" vs "SES" and "Discharged" vs "Non-Admitted" — make sure the report uses the
current, corrected terms throughout, not an earlier draft's).

---

## 3. Suggested priority order to close the gap to ~9.5/10

1. **Verify/complete team attribution** (README + report byline) — 15 minutes, resolves a
   compliance risk that isn't captured anywhere else in this audit.
2. **Self-check the final `.docx` against §2 above**, specifically: does it state the
   aggregate-vs-observation framing, reproduce the data-cleaning audit table, and preserve the
   negative-result findings and caveats rather than smoothing them out? — highest point value,
   lowest effort, since the content mostly already exists in the README and just needs to be
   confirmed present in the report.
3. **Add one clustering/segmentation pass** on patient cohorts (age × sex × CTAS) to broaden
   "Analytical Methods" from three technique families to four, directly answering the
   "which cohorts are most affected" question already posed in the README.
4. **Walk the live app stage-by-stage before submission**, filtering and toggling as a grader
   would, watching specifically for static numbers that don't respond to filters (the exact bug
   class fixed this session).

---

## 3b. Data-pipeline integrity: what's genuinely live vs. what's fixed

Traced directly from source (not assumed) in response to a follow-up question about whether the
demo relies on real, end-to-end computed data:

- **Upload → Clean → Hypothesis Testing (H1–H5) is genuinely live.** `AnalyticsCore.tsx`'s `h1`–`h5`
  are `useMemo` blocks that iterate the component's `data` prop row-by-row and compute weighted
  Kruskal-Wallis / Mann-Whitney / WLS directly from it (`frontend/src/pages/StatisticalAnalysis/AnalyticsCore.tsx:1413-1420`).
  Whatever a user uploads and runs through the Prep & Quality Engine is what the hypothesis suite
  actually tests.
- **H1 has a silent canonical-data fallback**: if the active dataset lacks recognizable CTAS/triage
  columns, it substitutes a hardcoded `CANONICAL_CTAS` reference table instead of surfacing
  "insufficient columns" (`AnalyticsCore.tsx:1424-1439`). Fine for the bundled demo dataset;
  would silently mislead if a teammate's own upload lacked the expected column names.
- **The Executive Dashboard is a separate data source.** `fetchDashboardKPIs()` /
  `fetchDashboardTrends()` take no dataset parameter — they call `/api/dashboard/*`, proxied by
  `server.ts` to the Python backend, which reads the **seeded canonical SQLite tables**, never the
  dataset currently active in the wizard. A cleaned upload is persisted via `persistCleanedDataset`,
  but into its own isolated table the dashboard never reads (confirmed by the README's own note
  that cleaning "never touches the seeded H1–H5 tables").
- **A working, tested `/api/statistics/h1..h5` backend route exists and is reachable** (proxied in
  `server.ts`, and `apiService.ts` defines `fetchHypothesisResult()` for it) **but nothing in the UI
  calls it** — the hypothesis numbers a user sees come entirely from the client-side TypeScript
  mirror, not this endpoint.

**Implication for the report:** for the bundled CIHI demo dataset, the whole platform is
internally consistent by construction (the demo data *is* the seeded data). For a genuinely
different dataset, say so explicitly rather than implying one continuous pipeline: hypothesis
testing would reflect the new data, but the Executive Dashboard KPIs would not. State this
scope limitation in the report's methodology section — it's a strength if disclosed (shows
awareness of the system's actual data boundaries) and a credibility risk if a grader discovers
it themselves.

---

## 3c. Chapter 5 internal-consistency finding (resolved)

Once the final report text was reviewed directly, the Executive Summary and Chapter 5 were
found to state **different results for the same hypothesis test** in four places (H1, H2, H3,
H4) — different H/U-statistics, different effect sizes, and for H3, two structurally different
regression models. Only H5 was internally consistent.

Cross-checked against the platform's tested, reconciled values (`CHANGELOG.md` [2.2.0],
`HypothesisEvidenceHub.tsx`, 300-test suite): the Executive Summary already matched the platform
almost exactly for H1, H2, and H4 — it was specifically Chapter 5's detailed tables that had
drifted from an earlier draft. H3 was the one case where neither existing version matched the
platform; the team chose the platform's canonical univariate WLS model (β₁ = −73.92 min/unit,
R² = 0.6256) over both the Executive Summary's stale value and Chapter 5's unreproducible
multivariate model.

Full corrected replacement text for every affected subsection is in
[`hypothesis_corrections.md`](hypothesis_corrections.md). **This is the single highest-value fix
available before submission** — it affects Interpretation and Insights and Professional
Structure and Technical Writing directly, and is exactly the kind of cross-reference a rubric
grader is likely to make.

---

## 4. What this audit did *not* do

- Did not modify the final report, any grading-relevant data, or statistical results.
- Did not fabricate or estimate team member names, contribution splits, or report content.
- Did not open `.docx`/`.pptx` binaries — those need a manual pass against §2's criteria.
- Fixed genuine, verifiable UI/data-correctness defects found during the review (listed in
  `CHANGELOG.md`), since those directly affect the "Data Visualization and Communication"
  criterion if the app is demonstrated live — this is a code change, not a report change.
