# Capstone Project - DAMO-6994

This repository contains a Python-based healthcare analytics preprocessing pipeline designed to clean, validate, transform, and enrich raw healthcare data for downstream analytics and reporting.

The project focuses on building a modular preprocessing workflow for healthcare data with validation, transformation, and feature engineering support.

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

### Completed

- Implemented a modular preprocessing package under backend/preprocessing
- Added functions for cleaning, validation, aggregation, and feature engineering
- Added automated tests for the preprocessing workflow
- Added logging support for test execution
- Documented the project structure and workflow

### Next steps

- Extend the preprocessing pipeline for additional healthcare data scenarios
- Improve documentation and project tracking
- Add further data processing capabilities as the project grows

---

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

Create and activate a virtual environment:

```cmd
cd C:\Users\amitd\Downloads\Desktoppp\UNF\UNF Assignment _ Notes_Class Practise\Term 5\Capstone\Github\Capstone_Project-DAMO-6994-
python -m venv venv
venv\Scripts\activate
```

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

The project uses the logs directory to store run logs and progress notes.

Current tracking files:

- [logs/PROJECT_PROGRESS.md](logs/PROJECT_PROGRESS.md) — milestone and progress tracking log

Logging is also used during test execution to record test session activity.
