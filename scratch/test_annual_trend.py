import sqlite3
import pandas as pd

conn = sqlite3.connect('backend/database/healthcare.db')
query = """
SELECT 
    fiscal_year,
    SUM(ed_visits) as ed_visits,
    ROUND(SUM(ed_visits * median_length_of_stay_min) / SUM(ed_visits), 1) as weighted_los_min,
    ROUND(SUM(ed_visits * length_of_stay_hours) / SUM(ed_visits), 2) as weighted_los_hours
FROM age_sex
GROUP BY fiscal_year
ORDER BY fiscal_year_start ASC
"""
df = pd.read_sql(query, conn)
print("--- age_sex annual trend (canonical) ---")
print(df)
print("Total ed_visits:", df['ed_visits'].sum())
