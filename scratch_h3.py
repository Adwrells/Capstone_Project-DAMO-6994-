import sys
sys.path.insert(0, '.')
import sqlite3
conn = sqlite3.connect('backend/database/healthcare.db')
import pandas as pd
query = """
SELECT ctas_urgency_score, median_length_of_stay_min, ed_visits 
FROM ctas_triage 
WHERE ed_visits > 0 AND ctas_urgency_score IS NOT NULL 
AND triage_level NOT IN ('Total','TOTAL','Unknown','Not Stated','Any','ALL')
"""
df = pd.read_sql(query, conn)
print('H3 data shape:', df.shape)
print('CTAS scores:', sorted(df.ctas_urgency_score.unique().tolist()))
from backend.analytics.statistics.linear_regression import regression_summary
ctas = df['ctas_urgency_score'].tolist()
los = df['median_length_of_stay_min'].tolist()
wts = df['ed_visits'].tolist()
res = regression_summary(ctas, los, 'CTAS Urgency Score', 'Median LOS (min)', weights=wts)
print('slope:', res['slope'])
print('intercept:', res['intercept'])
print('r_squared:', res['r_squared'])
print('correlation:', res['correlation'])
print('p_value:', res['p_value'])
print('t_statistic:', res['t_statistic'])
print('reject_null:', res['reject_null'])
print('n:', res['n'])
conn.close()
print('DONE_H3')
