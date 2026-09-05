import sqlite3
import pandas as pd

conn = sqlite3.connect('backend/database/healthcare.db')
for t in ['age_sex', 'ctas_triage', 'visit_disposition']:
    cols = [c[1] for c in conn.cursor().execute(f"PRAGMA table_info({t})").fetchall()]
    fy_col = 'fiscal_year_start' if 'fiscal_year_start' in cols else 'fiscal_year'
    df = pd.read_sql(f"SELECT {fy_col} as fy, SUM(ed_visits) as v FROM {t} GROUP BY {fy_col} ORDER BY {fy_col}", conn)
    print(f"--- {t} by {fy_col} ---")
    print(df.head(3))
    print(df.tail(3))
    print("Total:", df['v'].sum())
