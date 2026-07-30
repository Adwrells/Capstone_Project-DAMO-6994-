# Capstone Project - DAMO-6994

This repository contains a Python-based healthcare analytics preprocessing pipeline designed to clean, validate, transform, and enrich raw healthcare data for downstream analytics and reporting.

The project is currently focused on building a modular, testable backend foundation for data preprocessing with strong logging and architecture documentation.

---

## Project Overview

The goal of this capstone project is to create a reliable preprocessing workflow that can:

- ingest raw healthcare-style records,
- remove duplicates and handle missing values,
- validate schema and data quality,
- engineer useful features such as year extraction and sex category encoding,
- aggregate data for analytic use cases.

This work is documented in the architecture guide and supported by automated tests.

---

## Current Project Status

### Completed so far

- Built a modular preprocessing package under backend/preprocessing
- Implemented core functions for:
  - cleaning and null handling
  - schema validation
  - null ratio calculation
  - data aggregation
  - feature engineering
- Added a test suite covering the main preprocessing workflow
- Added logging support for test runs in the logs directory
- Created an architecture document describing the system design and pipeline flow

### In progress

- Expanding the preprocessing pipeline for more real-world healthcare scenarios
- Improving documentation and project tracking
- Preparing for future integration with larger ETL or analytics workflows

### Planned next steps

- Add data ingestion support for Excel/CSV-based sources
- Introduce more advanced feature engineering
- Add a reusable pipeline runner and configuration layer
- Extend logging and monitoring for production-style execution

---

## Architecture

The project architecture is documented in [ARCHITECTURE.md](ARCHITECTURE.md).

It describes:

- the preprocessing module structure,
- the data flow through cleaning, validation, transformation, and feature engineering,
- the testing and logging strategy,
- the overall design principles for the platform.

---

## Project Structure

```text
Capstone_Project-DAMO-6994-/
├── backend/
│   └── preprocessing/
│       ├── cleaning.py
│       ├── feature_engineering.py
│       ├── transformations.py
│       └── validation.py
├── tests/
│   ├── conftest.py
│   └── test_preprocessing.py
├── logs/
├── ARCHITECTURE.md
└── README.md
```

---

## Core Modules

### Cleaning

The cleaning module handles:

- duplicate removal
- replacement of empty or missing values with a configurable default

### Validation

The validation module handles:

- required column checks
- row count reporting
- null ratio calculations

### Transformations

The transformations module handles:

- grouping and aggregation of numeric values
- basic rollup operations for analysis-ready datasets

### Feature Engineering

The feature engineering module handles:

- extracting years from period strings
- standardizing sex categories into consistent labels

---

## Testing

The project includes automated tests for the preprocessing modules.

### Setup

Install the required Python packages:

```bash
python -m pip install -r requirements.txt
```

If your system uses a different Python interpreter, use the same interpreter for both install and test commands. In this workspace, the verified command is:

```bash
C:/Users/amitd/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m pip install -r requirements.txt
```

### How to run tests

Run the complete test suite:

```bash
C:/Users/amitd/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m pytest tests/ -v --tb=short
```

Run a specific test file:

```bash
C:/Users/amitd/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m pytest tests/test_preprocessing.py -v
```

Run one test class or one test case:

```bash
C:/Users/amitd/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m pytest tests/test_preprocessing.py::TestCleanMissingValues -v
C:/Users/amitd/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m pytest tests/test_preprocessing.py::TestIntegration::test_full_cleaning_pipeline -v
```

Run with coverage output:

```bash
C:/Users/amitd/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m pytest tests/ --cov=backend/preprocessing --cov-report=term-missing
```

Current testing focus includes:

- unit tests for each preprocessing function,
- integration tests for end-to-end preprocessing behavior,
- validation of edge cases such as missing values and malformed input.

---

## Logging and Progress Tracking

The project uses the logs directory to store run logs and project progress notes.

Current tracking files:

- [logs/PROJECT_PROGRESS.md](logs/PROJECT_PROGRESS.md) — milestone and progress tracking log

Logging is also used during test execution to record test session activity.

---

## Development Notes

This repository is being developed as a modular, maintainable foundation for healthcare data preprocessing. The emphasis is on:

- clear separation of responsibilities,
- reliable validation,
- reproducible testing,
- transparent documentation,
- dependable progress tracking.

This README will continue to be updated as the project evolves.
