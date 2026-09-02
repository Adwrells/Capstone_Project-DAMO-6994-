# Healthcare Analytics Platform — Documentation Hub

**Project:** Operational & Clinical Modelling of Emergency Department Wait Times & Resource Burden  
**Institution:** University of Niagara Falls — Master of Data Analytics (DAMO-6994 Capstone)  
**Author:** Bharath Paramasivan  

---

## Documentation Structure & Index

This directory contains the formal academic, clinical, technical, and architectural documentation for the Healthcare Analytics Platform.

```
docs/
├── README.md                                    # Documentation Hub & Navigation (this document)
└── Reports/                                     # Formal Capstone & Operational Reports
    ├── Security-Report.md                       # Security posture, scanner coverage, and resolved CWE vulnerabilities
    ├── Statistical-Methodology-Report.md        # Mathematical derivations, weighting frameworks, and H1–H5 models
    ├── Executive-Clinical-Report.md             # Clinical insights, operational bottlenecks, and ROI forecasts
    ├── Data-Provenance-and-Quality-Report.md   # CIHI NACRS dataset lineage, schema mappings, and validation metrics
    └── API-Reference.md                         # Complete FastAPI & Gateway REST API reference
```

---

## Document Summaries

### 1. [Security Report](file:///c:/Users/bhara/OneDrive/Desktop/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/docs/Reports/Security-Report.md)
* **Scope:** Full-stack security posture analysis (CodeQL, `npm audit`, `pip-audit`, `bandit`).
* **Highlights:** 0 reachable SQL injections, 0 vulnerable dependencies, loopback network binding, strict environment credential isolation.

### 2. [Statistical Methodology Report](file:///c:/Users/bhara/OneDrive/Desktop/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/docs/Reports/Statistical-Methodology-Report.md)
* **Scope:** Rigorous mathematical specifications of all non-parametric and parametric models.
* **Highlights:** Frequency-weighted Kruskal-Wallis H-test, Mann-Whitney U test, Dunn post-hoc with Bonferroni correction, Weighted Least Squares (WLS) regression, Mann-Kendall trend tests, and ERBI formulation.

### 3. [Executive Clinical Report](file:///c:/Users/bhara/OneDrive/Desktop/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/docs/Reports/Executive-Clinical-Report.md)
* **Scope:** Clinical and operational decision support synthesis for Emergency Department leadership.
* **Highlights:** CTAS Level 3 triage bottlenecks, geriatric boarding delays (65+), admission boarding reduction protocols, Rapid Assessment Zone (RAZ) operational models, and quantifiable impact forecasts.

### 4. [Data Provenance & Quality Report](file:///c:/Users/bhara/OneDrive/Desktop/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/docs/Reports/Data-Provenance-and-Quality-Report.md)
* **Scope:** End-to-end data lineage from raw CIHI Excel workbooks to the relational SQLite database.
* **Highlights:** 5 validation dimensions, data cleaning rules, column name contracts (`COLUMN_MAP`), and reproducible loader pipeline (`load_csv.py`).

### 5. [API Reference](file:///c:/Users/bhara/OneDrive/Desktop/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/docs/Reports/API-Reference.md)
* **Scope:** REST API endpoint documentation across all 10 controller modules.
* **Highlights:** Request/response schemas, query parameters, error codes, and reverse-proxy routing topology.
