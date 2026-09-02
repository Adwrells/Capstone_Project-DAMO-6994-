# Security Report — Healthcare Analytics Platform

**Project:** DAMO-699 Capstone · Emergency Department Analytics
**Repository:** `Adwrells/Capstone_Project-DAMO-6994-`
**Report date:** 6 August 2026
**Scope:** Full repository — Python backend, Node server, React frontend, dependencies, CI

---

## 1. Posture at a Glance

| Scanner | Coverage | Result |
| :--- | :--- | :--- |
| **CodeQL** | Python + TypeScript/JavaScript | ⚙️ Daily 07:17 UTC + every push |
| **`npm audit`** | 304 Node packages | ✅ **0 vulnerabilities** |
| **`pip-audit`** | 17 Python distributions | ✅ **0 vulnerabilities** |
| **`bandit`** | 6,036 lines of Python | ⚠️ 14 medium / 2 low — **all triaged, none exploitable** |
| **Automated tests** | 317 tests, 23 suites | ✅ **316 / 316 pass (1 skipped)** |

| Risk area | Status |
| :--- | :--- |
| Reachable SQL injection | ✅ **0** (1 found, fixed) |
| Known-vulnerable dependencies | ✅ **0** (1 high found, fixed) |
| Dead code / obsolete SQL loaders | ✅ **0** (`sqlite_loader.py` removed) |
| Network exposure | ✅ Loopback by default |
| Secrets in repository | ✅ None — `.env*` gitignored |
| Credential handling | ✅ API keys read from environment only |

---

## 2. Findings Resolved

### 2.1 SQL injection — reachable from user input · **HIGH**

| | |
| :--- | :--- |
| **Location** | `backend/analytics/descriptive.py` |
| **Entry point** | `GET /api/statistics/summary?table_name=...` |
| **CWE** | CWE-89 |
| **Detected by** | `bandit` B608, confirmed by manual reachability tracing |
| **Status** | ✅ **Fixed** |

The `table_name` query parameter was interpolated directly into
`SELECT * FROM "{table_name}"` with no validation. The only check was `if df.empty` —
evaluated *after* the query had already executed.

**Fix.** The identifier is now allow-listed against `db_manager.get_tables()` before it
reaches SQL. A table name cannot be bound as a SQL parameter, so allow-listing is the
correct control here.

**Verification.** A `UNION SELECT * FROM sqlite_master` payload is rejected and never
queried. Locked in by `tests/test_dashboard_services.py::TestTableNameAllowListing`, which
asserts the payload is both rejected **and** never reaches a query.

### 2.2 Vulnerable dependency: `xlsx` (SheetJS) · **HIGH**

| | |
| :--- | :--- |
| **Package** | `xlsx` 0.18.5 |
| **Advisories** | Prototype Pollution `GHSA-4r6h-8v6p-xvw6`, ReDoS `GHSA-5pgg-2g8v-p4x9` |
| **Detected by** | `npm audit` |
| **Status** | ✅ **Fixed** — upgraded to 0.20.3 |

`npm audit` reported *"No fix available"* because SheetJS stopped publishing to the npm
registry after 0.18.5 and moved distribution to their own CDN. The registry copy is frozen
at the last vulnerable release, so `npm audit fix` could never have resolved it.

**Reachability at time of discovery:** limited. Both `XLSX.readFile` call sites
(`server.ts:818`, `server.ts:1075`) read repo-controlled paths, not uploads. The Python
upload endpoint parses Excel through pandas/`openpyxl`, a different library. Prototype
pollution requires attacker-controlled input.

**Fixed anyway**, because limited reach is not a fix — it would have become live the moment
an uploaded file was wired into `XLSX.readFile`.

```bash
npm i --save https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

Pinned to an explicit version rather than the drifting `xlsx-latest` alias.
`@types/xlsx` removed — 0.20.3 ships its own type definitions.

> ⚠️ **Do not run plain `npm i xlsx`** — it silently reverts to the vulnerable 0.18.5.

### 2.3 API bound to all network interfaces · **MEDIUM**

| | |
| :--- | :--- |
| **Location** | `backend/main.py` |
| **CWE** | CWE-605 |
| **Detected by** | `bandit` B104 |
| **Status** | ✅ **Fixed** |

The FastAPI server bound `host="0.0.0.0"`, publishing an API that serves the full clinical
dataset — with `allow_origins=["*"]` — to every device on the local network.

**Fix.** Defaults to `127.0.0.1`, overridable via `API_HOST` / `API_PORT` for containers.
The Dockerfile runs `npm start`, not FastAPI, so container behaviour is unaffected.

---

## 3. Findings Accepted — Triaged False Positives

`bandit -r backend -ll` reports **14 medium, 2 low**. Each has been individually verified as
non-exploitable. **Do not suppress these with `# nosec`** — the annotations below are the
record; suppression would hide a future real one.

| # | Rule | Location | Why it is not exploitable |
| :-: | :--- | :--- | :--- |
| 1 | B608 | `services/dataset_service.py:63` | Table name allow-listed against `get_tables()` before the query; `_safe_limit()` coerces the row limit to a bounded integer |
| 2 | B608 | `services/insights_service.py:124` | Iterates names returned by `get_tables()` — never user input |
| 3 | B608 | `services/insights_service.py:145` | Same as above |
| 4 | B608 | `services/analytics_service.py:22` | Guarded by `if table_name not in tables: return error` |
| 5 | B608 | `analytics/descriptive.py:58` | Allow-listed as of §2.1 |
| 6 | B608 | `database/load_csv.py:144` | Table names come from the hardcoded `SOURCES` map |
| 7 | B608 | `services/user_dataset_service.py:161,174,216,219,240,255,273,283` | Table names and IDs generated via internal UUID/prefix; dataset registry queries parameterized |
| 8 | B104 | `config/settings.py:13` | Configuration constant (`API_HOST`), default is loopback `127.0.0.1` |
| 9 | B104 | `main.py:84` | Local dev server execution block |

**Why B608 fires so often.** A table or column name **cannot** be passed as a bound SQL
parameter — only values can. Any dynamic table selection must therefore build the identifier
into the string, and `bandit` flags the pattern without evaluating the guard. The correct
control is an allow-list, which every site above has.

**This is enforced, not merely asserted.** `TestTableNameAllowListing` fails the suite if the
allow-list is removed — at which point these stop being false positives.

---

## 4. Controls in Place

| Control | Implementation |
| :--- | :--- |
| **Static analysis (CI)** | CodeQL, `security-extended` suite, Python + TS/JS, daily 07:17 UTC and on every push/PR to `main` |
| **Static analysis (local)** | `bandit -r backend -ll` |
| **Dependency scanning** | `npm audit` (Node), `pip-audit` (Python) |
| **Dependency drift** | `tests/test_dependencies.py` fails the suite if an import is undeclared |
| **SQL identifier safety** | Allow-list validation at every dynamic-table site, test-enforced |
| **Row limit safety** | `_safe_limit()` — bounded positive integer, falls back to default rather than raising |
| **Imputation integrity** | Placeholders (`Unknown`, `N/A`) excluded from model fitting and counted separately |
| **Database write isolation** | Only `load_csv.py` writes the seeded database; no request handler does |
| **Secret management** | `.env*` gitignored; Gemini API key read from `process.env` only |
| **Network binding** | Loopback default |

---

## 5. Reproducing This Report

All commands run from the repository root. On Windows use `.venv\Scripts\python.exe`.

**Dependency vulnerabilities**

```bash
npm audit --audit-level=moderate
```

```bash
.venv\Scripts\python.exe -m pip_audit -r requirements.txt
```

**Python static analysis**

```bash
.venv\Scripts\python.exe -m bandit -r backend -ll
```

With file and line for each finding:

```bash
.venv\Scripts\python.exe -m bandit -r backend -ll -f custom --msg-template "{severity} {test_id} {relpath}:{line} {msg}"
```

**CodeQL**

```bash
gh workflow run codeql.yml --ref main
```

```bash
gh api repos/Adwrells/Capstone_Project-DAMO-6994-/code-scanning/alerts --jq '.[] | "\(.rule.security_severity_level // .rule.severity)\t\(.rule.id)\t\(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)"'
```

**Regression suite**

```bash
.venv\Scripts\python.exe -m pytest tests -q
```

### Expected baseline

Anything beyond this is new and warrants investigation:

| Scanner | Expected |
| :--- | :--- |
| `npm audit` | 0 vulnerabilities |
| `pip-audit` | No known vulnerabilities |
| `bandit` | 14 medium, 2 low — matching §3 exactly |
| `pytest` | 316 passed, 1 skipped |


## 6. Outstanding Recommendations

| # | Recommendation | Priority | Rationale |
| :-: | :--- | :---: | :--- |
| 1 | Enable branch protection on `main` | **High** | Nothing currently gates a direct push to the default branch |
| 2 | Confirm repository visibility | **High** | CodeQL is free only on public repos; on a private repo it fails with a **licensing** error, which reads as a broken build |
| 3 | Add `npm audit` + `pip-audit` to CI | Medium | Currently manual; a vulnerable dependency could land unnoticed between runs |
| 4 | Enable secret scanning + push protection | Medium | Native GitHub feature, one settings toggle |
| 5 | Delete `analytics/preprocessing/sqlite_loader.py` | ✅ Completed | Dead code containing raw SQL writes — deleted in architecture cleanup |
| 6 | Restrict CORS from `allow_origins=["*"]` | Medium | Acceptable for local development, not for any deployed instance |
| 7 | Add API rate limiting (`slowapi`) | Low | architecture.md §6.4; statistical endpoints are compute-heavy |
| 8 | Validate upload extension and MIME type | Low | architecture.md §6.4 |
| 9 | Add Dependabot | Low | Automates recommendation 3 |

---

## 7. Assessment

No exploitable vulnerability is currently present in the codebase. Both high-severity
findings were identified, fixed, and locked in with regression tests rather than being
suppressed or accepted.

The most significant residual risk is **process, not code**: `main` has no branch
protection, so a future change can bypass every control listed in §4. Recommendation 1
should be addressed before submission.

The `bandit` findings in §3 are recorded rather than silenced deliberately. Suppressing them
with `# nosec` would clear the report and simultaneously destroy the signal that catches the
next genuine one.

---

*Architecture conformance checks are in [architecture.md](../../architecture.md) §4C.
Setup and test commands are in [README.md](../../README.md).*