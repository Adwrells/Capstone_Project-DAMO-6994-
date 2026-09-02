<div style="color: #000000; background-color: #ffffff; padding: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7;">

<h1 style="color: #000000; font-size: 28px; font-weight: 800; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 16px;">
  Healthcare Analytics Platform — System Workflow &amp; Button Directory
</h1>

<p style="color: #000000; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
  <strong>Project:</strong> Operational &amp; Clinical Modelling of Emergency Department Wait Times &amp; Resource Burden
</p>
<p style="color: #000000; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
  <strong>Institution:</strong> University of Niagara Falls — Master of Data Analytics (DAMO-6994 Capstone)
</p>
<p style="color: #000000; font-size: 14px; font-weight: 600; margin-bottom: 24px;">
  <strong>Author:</strong> Bharath Paramasivan
</p>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  1. Complete 7-Stage System Workflow
</h2>

<p style="color: #000000; font-size: 14px; margin-bottom: 16px;">
  The platform is engineered as a sequential, 7-stage clinical decision support pipeline. Each stage ingests, transforms, or visualizes data verified by the preceding stage:
</p>

<ol style="color: #000000; font-size: 14px; padding-left: 24px; margin-bottom: 24px;">
  <li style="margin-bottom: 8px;"><strong>Stage 1: About Project</strong> — Executive orientation, academic capstone parameters, CIHI dataset provenance, and H1–H5 hypothesis definitions.</li>
  <li style="margin-bottom: 8px;"><strong>Stage 2: Prep &amp; Quality Engine</strong> — 5-dimension data hygiene audit, automated missing value imputation, CTAS acuity harmonization, regression fit diagnostics, and frequency-weighted SQLite ingestion.</li>
  <li style="margin-bottom: 8px;"><strong>Stage 3: Dataset Explorer</strong> — Multi-worksheet tabular browser, column-level 5-number statistics, sorting, pagination, and multi-format dataset export (.csv, .xlsx, .zip).</li>
  <li style="margin-bottom: 8px;"><strong>Stage 4: Hypothesis Testing &amp; Statistical Analysis</strong> — Non-parametric inference engine (Weighted Kruskal-Wallis, Weighted Mann-Whitney U, Weighted Least Squares, Chi-Square), Natural Language Smart Query, and Custom Chart Builder.</li>
  <li style="margin-bottom: 8px;"><strong>Stage 5: Executive Dashboard</strong> — Provincial macro indicators, 5 multi-dimensional clinical filter bars, longitudinal visit volume &amp; LOS time-series trends, CTAS resource burden distributions, and custom visualization widgets.</li>
  <li style="margin-bottom: 8px;"><strong>Stage 6: Strategic Insights</strong> — Executive decision support briefings, throughput bottleneck identification (CTAS 3 friction, geriatric boarding), clinical action plans, and financial ROI models.</li>
  <li style="margin-bottom: 8px;"><strong>Stage 7: Reports &amp; Export</strong> — Formal executive PDF dossier generation, cleaned master Excel workbook downloads, raw CSV exports, and compliance audit logs.</li>
</ol>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  2. Global Application Header &amp; Sidebar Navigation Controls
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">UI Control / Button</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Icon</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action &amp; Trigger</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">System Responsibility &amp; State Mutation</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Sidebar Toggle</td>
      <td style="padding: 10px; border: 1px solid #000000;">Menu / X</td>
      <td style="padding: 10px; border: 1px solid #000000;">Sidebar Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toggles sidebar width between expanded (280px) and collapsed (80px) mode. Updates <code>isSidebarCollapsed</code> state.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Stage Tabs (1 to 7)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Stage Icons</td>
      <td style="padding: 10px; border: 1px solid #000000;">Left Sidebar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Stage</td>
      <td style="padding: 10px; border: 1px solid #000000;">Navigates directly to target stage. If dataset is unverified, displays validation warning modal.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Theme Switcher</td>
      <td style="padding: 10px; border: 1px solid #000000;">Sun / Moon</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Header Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toggles Light / Dark mode class on HTML document root and switches Recharts themes.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Previous Stage</td>
      <td style="padding: 10px; border: 1px solid #000000;">ChevronLeft</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Navigates backward to the preceding stage in the 7-step sequence (<code>handlePrevStage</code>).</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Next Stage</td>
      <td style="padding: 10px; border: 1px solid #000000;">ChevronRight</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Advances to the next stage (<code>handleNextStage</code>). Blocked if Stage 2 data preparation is pending.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Reset Platform</td>
      <td style="padding: 10px; border: 1px solid #000000;">RotateCcw</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Header / About</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Clears all active filters, custom charts, and in-memory caches, returning user to Stage 1.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  3. Stage 1: About Project Controls (`AboutProject.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button Label</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Begin Data Preparation Pipeline →</td>
      <td style="padding: 10px; border: 1px solid #000000;">Hero Banner (Bottom)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Directly transitions user to <strong>Stage 2: Prep &amp; Quality Engine</strong> (<code>onBeginPrep</code>).</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Hypothesis Framework Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Central Tab Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Displays research questions, null/alternative hypotheses, variables, and clinical rationales for H1 to H5.</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Pipeline Architecture Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Central Tab Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Renders interactive 7-stage architectural data flow diagram detailing data lineage from CIHI Excel to SQLite.</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Technical System Stack Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Central Tab Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Displays full technical component inventory (React 19, FastAPI, SQLite WAL, Recharts, Tailwind CSS).</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  4. Stage 2: Prep &amp; Quality Engine Controls (`DataCleaning.tsx` &amp; `FitDiagnostics.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button / Control</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Preloaded Dataset Cards (6 Sheets)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Catalog Grid</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Card</td>
      <td style="padding: 10px; border: 1px solid #000000;">Selects master CIHI worksheet (ED_Visits, CTAS_Triage, Visit_Disposition, Age_Sex, Main_Problems, Demographics) for immediate cleaning.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/preload-datasets</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Upload Custom File Dropzone</td>
      <td style="padding: 10px; border: 1px solid #000000;">Custom Upload Area</td>
      <td style="padding: 10px; border: 1px solid #000000;">File Select / Drag &amp; Drop</td>
      <td style="padding: 10px; border: 1px solid #000000;">Accepts user <code>.csv</code> or <code>.xlsx</code> file, validates schema, and parses rows into raw memory cache.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>POST /api/upload</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Imputation Strategy Radio Group</td>
      <td style="padding: 10px; border: 1px solid #000000;">Configuration Panel</td>
      <td style="padding: 10px; border: 1px solid #000000;">Select Option</td>
      <td style="padding: 10px; border: 1px solid #000000;">Configures missing value algorithm: CTAS Group Mean, Linear Interpolation, or Record Omission.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local State)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Standardize CTAS Acuity Checkbox</td>
      <td style="padding: 10px; border: 1px solid #000000;">Configuration Panel</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toggle Check</td>
      <td style="padding: 10px; border: 1px solid #000000;">Maps heterogeneous acuity strings into canonical 5-point CTAS integer scale (1 = Non-Urgent to 5 = Resuscitation).</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local State)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Run Automated Preparation Pipeline</td>
      <td style="padding: 10px; border: 1px solid #000000;">Center Action Button</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;"><strong>Core Execution Trigger</strong>: Executes cleaning rules, computes 5-dimension quality score (94/100), derives analytical features, and unlocks Stages 3 to 7.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local Engine)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Save &amp; Persist Cleaned Cohort to SQLite</td>
      <td style="padding: 10px; border: 1px solid #000000;">Quality Results Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Writes active cleaned cohort into dedicated SQLite table in <code>healthcare.db</code> for thread-safe session persistence.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>POST /api/user-datasets</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Fit Diagnostics Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Quality Sub-header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Evaluates statistical model assumptions (Q-Q residual plot, Breusch-Pagan homoscedasticity test, VIF multi-collinearity).</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>POST /api/model-diagnostics/assess</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Proceed to Dataset Explorer →</td>
      <td style="padding: 10px; border: 1px solid #000000;">Bottom Navigation</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Advances user to <strong>Stage 3: Dataset Explorer</strong>.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  5. Stage 3: Dataset Explorer Controls (`DataExplorer.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button / Control</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Worksheet Selector Tabs</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Tab Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Switches active table between ED_Visits, CTAS_Triage, Visit_Disposition, Age_Sex, Main_Problems, and Demographics.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/{sheet}</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">View Mode (Grid / Columns / Charts)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toolbar Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Toggle</td>
      <td style="padding: 10px; border: 1px solid #000000;">Switches view between paginated tabular rows, column 5-number descriptive cards, and visual distribution histograms.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/statistics/{sheet}</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Search Box &amp; Clear (X)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Table Toolbar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Type / Click X</td>
      <td style="padding: 10px; border: 1px solid #000000;">Performs real-time full-text substring filtering across all columns in active sheet.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Column Header Sort Toggles</td>
      <td style="padding: 10px; border: 1px solid #000000;">Grid Header Cells</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toggles Ascending (▲) and Descending (▼) order for selected numeric or text column.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Pagination Buttons (&lt;&lt;, &lt;, &gt;, &gt;&gt;)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Grid Footer</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Navigates first, previous, next, or last page of dataset records.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Page Size Dropdown (10, 20, 50, 100)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Grid Footer</td>
      <td style="padding: 10px; border: 1px solid #000000;">Select Number</td>
      <td style="padding: 10px; border: 1px solid #000000;">Sets number of rows rendered per page.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Export Sheet CSV</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toolbar Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Downloads currently viewed active worksheet as a clean <code>.csv</code> file.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/download/csv/{sheet}</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Export Master XLSX</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toolbar Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Downloads full multi-tabbed clinical workbook (<code>Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx</code>).</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/download/raw-xlsx</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Data Dictionary Drawer Button</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toolbar Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Opens sliding panel with variable definitions, data types, permitted ranges, and clinical notes.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/dictionary/{sheet}</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Proceed to Hypothesis Testing →</td>
      <td style="padding: 10px; border: 1px solid #000000;">Bottom Navigation</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Advances user to <strong>Stage 4: Hypothesis Testing &amp; Statistical Analysis</strong>.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  6. Stage 4: Hypothesis Testing &amp; Chart Builder Controls (`AnalyticsCore.tsx`, `CustomChartBuilder.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button / Control</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Hypothesis Tabs (H1 to H5)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Tab Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Loads specific hypothesis model: H1 (CTAS vs LOS), H2 (Admission vs LOS), H3 (Urgency WLS), H4 (Age vs LOS), H5 (Sex vs Admission).</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/statistics/h1</code> ... <code>/h5</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Re-evaluate Test Button</td>
      <td style="padding: 10px; border: 1px solid #000000;">Hypothesis Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Re-executes mathematical test directly against SQLite database, updating test statistics and p-values.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/statistics/{h}</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Assumption Checks Accordion</td>
      <td style="padding: 10px; border: 1px solid #000000;">Hypothesis Card</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Expands verification panels for Shapiro-Wilk normality, Levene variance homogeneity, and sample size adequacy.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/statistics/methods</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Execute AI Smart Query</td>
      <td style="padding: 10px; border: 1px solid #000000;">Smart Query Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Enter Query &amp; Submit</td>
      <td style="padding: 10px; border: 1px solid #000000;">Translates natural language questions into structured SQL/table filter parameters via Google Gemini.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>POST /api/smart-query</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Chart Type Buttons (8 types)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Chart Builder Panel</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Type</td>
      <td style="padding: 10px; border: 1px solid #000000;">Selects rendering format: Column, Bar, Line, Area, Pie, Donut, Radar, or Heatmap.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">X / Y Axis Field Selectors</td>
      <td style="padding: 10px; border: 1px solid #000000;">Chart Builder Controls</td>
      <td style="padding: 10px; border: 1px solid #000000;">Select Column</td>
      <td style="padding: 10px; border: 1px solid #000000;">Binds dataset variables to horizontal categories and vertical numerical metrics.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Aggregation Function Selector</td>
      <td style="padding: 10px; border: 1px solid #000000;">Chart Builder Controls</td>
      <td style="padding: 10px; border: 1px solid #000000;">Select Function</td>
      <td style="padding: 10px; border: 1px solid #000000;">Applies aggregation algorithm: Sum, Average, Count, Min, Max, or Median.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Generate Chart with AI Prompt</td>
      <td style="padding: 10px; border: 1px solid #000000;">Chart Assistant Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Enter Goal &amp; Submit</td>
      <td style="padding: 10px; border: 1px solid #000000;">AI analyzes dataset columns and auto-selects the optimal chart type, axis mapping, and color palette.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>POST /api/assistant/chart-builder</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Add Chart to Executive Dashboard</td>
      <td style="padding: 10px; border: 1px solid #000000;">Chart Builder Footer</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Pins created custom visualization widget to <strong>Stage 5: Executive Dashboard</strong> (<code>handleAddChart</code>).</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Global State)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Proceed to Executive Dashboard →</td>
      <td style="padding: 10px; border: 1px solid #000000;">Bottom Navigation</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Advances user to <strong>Stage 5: Executive Dashboard</strong>.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  7. Stage 5: Executive Dashboard Controls (`ExecutiveDashboard.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button / Control</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">5 Filter Dropdowns (Year, Sex, Age, CTAS, Disposition)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Central Filter Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Select Criteria</td>
      <td style="padding: 10px; border: 1px solid #000000;">Slices macro KPIs, time-series volume charts, and distributions across clinical sub-populations in real time.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dashboard/kpis</code>, <code>GET /api/dashboard/trends</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Reset All Filters Button</td>
      <td style="padding: 10px; border: 1px solid #000000;">Filter Bar Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Resets all 5 filter dimensions to default baseline (<code>All</code>), restoring macro provincial figures.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dashboard/kpis</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Trend View Switcher (Volume vs LOS)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Trend Section Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Toggle</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toggles primary time-series chart between Total Visit Volumes (2003–2021) and Median Reported Length of Stay.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Operational View Switcher (CTAS vs Problems)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Operational Header</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Toggle</td>
      <td style="padding: 10px; border: 1px solid #000000;">Toggles between CTAS Acuity Resource Burden Distribution and Top 10 Presenting Patient Complaints.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Custom Widget Delete Button</td>
      <td style="padding: 10px; border: 1px solid #000000;">Widget Card Top Right</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Trash</td>
      <td style="padding: 10px; border: 1px solid #000000;">Removes a user-saved custom chart widget from the dashboard (<code>handleRemoveChart</code>).</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Global State)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Print / Save Dashboard PDF</td>
      <td style="padding: 10px; border: 1px solid #000000;">Dashboard Header / Footer</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Invokes browser print rendering engine to generate a high-resolution PDF snapshot of the active dashboard.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Browser Print API)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Proceed to Strategic Insights →</td>
      <td style="padding: 10px; border: 1px solid #000000;">Bottom Navigation</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Advances user to <strong>Stage 6: Strategic Insights</strong>.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  8. Stage 6: Strategic Insights Controls (`ConsultantInsights.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button / Control</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Insight Dimension Tabs (4 Tabs)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Top Tab Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Tab</td>
      <td style="padding: 10px; border: 1px solid #000000;">Switches view between Executive Briefing, Throughput Bottlenecks, Clinical Staffing Plans, and Financial ROI Models.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/insights/strategic</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Priority Filter Pills (All, High, Med, Low)</td>
      <td style="padding: 10px; border: 1px solid #000000;">Filter Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click Pill</td>
      <td style="padding: 10px; border: 1px solid #000000;">Filters operational recommendation cards by clinical urgency and implementation priority.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Generate AI Executive Narrative</td>
      <td style="padding: 10px; border: 1px solid #000000;">Header Action Button</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Triggers Gemini AI synthesis to generate an automated executive briefing summarizing statistical anomalies and hospital bottleneck risks.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>POST /api/analyze-dataset</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Proceed to Reports &amp; Export →</td>
      <td style="padding: 10px; border: 1px solid #000000;">Bottom Navigation</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Advances user to final <strong>Stage 7: Reports &amp; Export</strong>.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Local)</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  9. Stage 7: Reports &amp; Export Controls (`ExportReports.tsx`)
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px; margin-bottom: 28px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button / Control</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Location</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">User Action</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Functional Responsibility &amp; Outcome</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">API Route</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Download Cleaned CSV</td>
      <td style="padding: 10px; border: 1px solid #000000;">Export Action Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Generates and downloads a Comma-Separated Values (<code>.csv</code>) file of the active cleaned dataset.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Client-side Blob)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Download Master XLSX</td>
      <td style="padding: 10px; border: 1px solid #000000;">Export Action Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Downloads complete multi-worksheet analytical Excel workbook (<code>Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx</code>).</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/download/raw-xlsx</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Download ZIP Bundle</td>
      <td style="padding: 10px; border: 1px solid #000000;">Export Action Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Downloads compressed archive containing all individual CSV worksheets, data dictionary, and metadata reports.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/dataset/download/export?format=csv</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Print Formal PDF Report</td>
      <td style="padding: 10px; border: 1px solid #000000;">Export Action Bar</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Formats the document using print stylesheets to generate a publication-grade multi-page PDF briefing document.</td>
      <td style="padding: 10px; border: 1px solid #000000;">None (Browser Print API)</td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 10px; border: 1px solid #000000; font-weight: bold;">Export Audit Log CSV</td>
      <td style="padding: 10px; border: 1px solid #000000;">Audit Trail Section</td>
      <td style="padding: 10px; border: 1px solid #000000;">Click</td>
      <td style="padding: 10px; border: 1px solid #000000;">Downloads platform governance event log containing timestamps, user IDs, cleaning actions, and database transactions.</td>
      <td style="padding: 10px; border: 1px solid #000000;"><code>GET /api/reports/export-summary</code></td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #000000; margin: 24px 0;" />

<h2 style="color: #000000; font-size: 22px; font-weight: 700; margin-top: 28px; margin-bottom: 12px;">
  10. Master Summary Table of Key System Buttons
</h2>

<table style="width: 100%; border-collapse: collapse; color: #000000; font-size: 13px;">
  <thead>
    <tr style="background-color: #f2f2f2; border: 1px solid #000000;">
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Button Name</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Stage / Component</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Primary Objective</th>
      <th style="padding: 10px; border: 1px solid #000000; text-align: left;">Technical Handler</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Begin Pipeline →</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 1 (AboutProject)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Advance to data cleaning</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>onBeginPrep()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Run Prep Pipeline</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 2 (DataCleaning)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Execute cleaning &amp; validation rules</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>runPreparationPipeline()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Persist to SQLite</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 2 (DataCleaning)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Save cohort into database table</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>handlePersistCohort()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Export Sheet CSV</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 3 (DataExplorer)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Download current sheet as CSV</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>GET /api/dataset/download/csv</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Re-evaluate Test</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 4 (AnalyticsCore)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Re-calculate hypothesis test statistics</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>GET /api/statistics/{h}</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Run AI Smart Query</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 4 (AnalyticsEngine)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Filter clinical rows via natural language</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>fetchSmartQuery()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Add Chart to Dashboard</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 4 (CustomChartBuilder)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Pin custom visual widget</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>onAddChart()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Reset All Filters</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 5 (ExecutiveDashboard)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Restore provincial macro KPIs</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>handleResetFilters()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Generate AI Narrative</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 6 (ConsultantInsights)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Synthesize executive clinical recommendations</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>fetchAnalyzeDataset()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Download Master XLSX</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 7 (ExportReports)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Export full multi-sheet Excel file</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>onDownloadXLSX()</code></td>
    </tr>
    <tr style="border: 1px solid #000000;">
      <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">Print Formal PDF</td>
      <td style="padding: 8px; border: 1px solid #000000;">Stage 7 (ExportReports)</td>
      <td style="padding: 8px; border: 1px solid #000000;">Export multi-page executive PDF</td>
      <td style="padding: 8px; border: 1px solid #000000;"><code>window.print()</code></td>
    </tr>
  </tbody>
</table>

</div>
