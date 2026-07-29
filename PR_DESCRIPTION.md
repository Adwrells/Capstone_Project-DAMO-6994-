
Description:
Summary
- Adds a modular preprocessing package for healthcare data with cleaning, validation, transformations, and basic feature engineering.
- Includes an end-to-end test suite and logging for test runs.
- Updates project documentation and adds a progress tracker.

What changed
- Added/updated modules:
  - **cleaning.py** — duplicate removal, missing-value imputation
  - **validation.py** — schema checks, null ratio calculations
  - **transformations.py** — aggregation helpers
  - **feature_engineering.py** — year extraction, sex encoding
- Tests:
  - **test_preprocessing.py** — unit and integration tests covering the modules
- Documentation:
  - **README.md** — project overview, architecture link, and test usage instructions
  - **PROJECT_PROGRESS.md** — milestone and progress tracking
- Other:
  - Test run logging writes timestamped logs to logs during test execution

How to run and verify (copy to terminal)
- Run full test suite:
```bash
python -m pytest tests/ -v --tb=short
```
- Run a single test file:
```bash
python -m pytest tests/test_preprocessing.py -v
```
- Run a single test class or case:
```bash
python -m pytest tests/test_preprocessing.py::TestIntegration::test_full_cleaning_pipeline -v
```
- Run tests with coverage:
```bash
python -m pytest tests/ --cov=backend/preprocessing --cov-report=term-missing
```

Checklist
- [x] Code implemented for cleaning, validation, transformation, and feature engineering
- [x] Tests added covering units and integrations
- [x] README updated with test instructions
- [x] Progress tracker added to PROJECT_PROGRESS.md

