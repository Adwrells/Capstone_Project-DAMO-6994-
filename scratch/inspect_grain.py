import sqlite3
import pandas as pd

conn = sqlite3.connect('backend/database/healthcare.db')
print("--- ed_visits schema & sample ---")
df_ed = pd.read_sql("SELECT * FROM ed_visits LIMIT 5", conn)
print(df_ed.columns.tolist())
print(df_ed.head(3))

print("\n--- age_sex schema & sample ---")
df_as = pd.read_sql("SELECT * FROM age_sex LIMIT 5", conn)
print(df_as.columns.tolist())
print(df_as.head(3))

print("\n--- ed_visits unique dimensions ---")
cursor = conn.cursor()
for col in ['reporting_facility', 'facility_type', 'age_group', 'sex', 'visit_disposition', 'triage_level']:
    if col in df_ed.columns:
        cnt = cursor.execute(f"SELECT COUNT(DISTINCT {col}) FROM ed_visits").fetchone()[0]
        print(f"ed_visits distinct {col}: {cnt}")

print("\n--- Check what ed_visits actually contains ---")
res = pd.read_sql("SELECT fiscal_year, SUM(ed_visits) as v, COUNT(*) as rows FROM ed_visits GROUP BY fiscal_year ORDER BY fiscal_year", conn)
print("ed_visits by year:")
print(res)

res_as = pd.read_sql("SELECT fiscal_year_start, SUM(ed_visits) as v, COUNT(*) as rows FROM age_sex GROUP BY fiscal_year_start ORDER BY fiscal_year_start", conn)
print("\nage_sex by year:")
print(res_as)
