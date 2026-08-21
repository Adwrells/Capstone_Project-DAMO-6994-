-- Healthcare Analytics Platform - SQLite Database Schema
-- Defines tables for the 6 analysis-ready optimized datasets plus pipeline metadata.

DROP TABLE IF EXISTS ed_visits;
CREATE TABLE ed_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fiscal_year TEXT NOT NULL,
    triage_level TEXT,
    visit_disposition TEXT,
    main_problem TEXT,
    ed_visits INTEGER NOT NULL DEFAULT 0,
    median_length_of_stay_min REAL,
    fiscal_year_start INTEGER,
    length_of_stay_hours REAL,
    ctas_urgency_score INTEGER,
    is_admitted INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS ctas_triage;
CREATE TABLE ctas_triage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fiscal_year TEXT NOT NULL,
    sex TEXT NOT NULL,
    triage_level TEXT NOT NULL,
    age_group TEXT NOT NULL,
    ed_visits INTEGER NOT NULL DEFAULT 0,
    median_length_of_stay_min REAL,
    fiscal_year_start INTEGER,
    length_of_stay_hours REAL,
    ctas_urgency_score INTEGER,
    age_broad_category TEXT
);

DROP TABLE IF EXISTS visit_disposition;
CREATE TABLE visit_disposition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fiscal_year TEXT NOT NULL,
    sex TEXT NOT NULL,
    visit_disposition TEXT NOT NULL,
    age_group TEXT NOT NULL,
    ed_visits INTEGER NOT NULL DEFAULT 0,
    median_length_of_stay_min REAL,
    fiscal_year_start INTEGER,
    length_of_stay_hours REAL,
    age_broad_category TEXT,
    is_admitted INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS age_sex;
CREATE TABLE age_sex (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fiscal_year TEXT NOT NULL,
    sex TEXT NOT NULL,
    age_group TEXT NOT NULL,
    ed_visits INTEGER NOT NULL DEFAULT 0,
    median_length_of_stay_min REAL,
    fiscal_year_start INTEGER,
    length_of_stay_hours REAL,
    age_broad_category TEXT
);

DROP TABLE IF EXISTS main_problems;
CREATE TABLE main_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fiscal_year TEXT NOT NULL,
    sex TEXT NOT NULL,
    main_problem TEXT NOT NULL,
    age_group TEXT NOT NULL,
    ed_visits INTEGER NOT NULL DEFAULT 0,
    median_length_of_stay_min REAL,
    fiscal_year_start INTEGER,
    length_of_stay_hours REAL,
    age_broad_category TEXT
);

DROP TABLE IF EXISTS demographics;
CREATE TABLE demographics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    age_group TEXT NOT NULL,
    sex TEXT NOT NULL,
    total_visits INTEGER NOT NULL DEFAULT 0,
    avg_length_of_stay_min REAL,
    percentage REAL,
    length_of_stay_hours REAL,
    age_broad_category TEXT
);

DROP TABLE IF EXISTS metadata;
CREATE TABLE metadata (
    table_name TEXT PRIMARY KEY,
    csv_file TEXT NOT NULL,
    row_count INTEGER NOT NULL,
    column_count INTEGER NOT NULL,
    last_updated TEXT NOT NULL
);

-- Query Performance Indexes
CREATE INDEX IF NOT EXISTS idx_ed_visits_fiscal_year ON ed_visits (fiscal_year);
CREATE INDEX IF NOT EXISTS idx_ed_visits_triage ON ed_visits (triage_level);
CREATE INDEX IF NOT EXISTS idx_ctas_triage_lookup ON ctas_triage (fiscal_year, age_group, sex);
CREATE INDEX IF NOT EXISTS idx_visit_disp_lookup ON visit_disposition (fiscal_year, age_group, sex);
CREATE INDEX IF NOT EXISTS idx_age_sex_lookup ON age_sex (fiscal_year, age_group, sex);
CREATE INDEX IF NOT EXISTS idx_main_problems_lookup ON main_problems (fiscal_year, age_group, sex);
CREATE INDEX IF NOT EXISTS idx_demographics_lookup ON demographics (age_group, sex);

