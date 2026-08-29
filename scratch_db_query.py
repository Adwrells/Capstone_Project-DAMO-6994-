import sqlite3
conn = sqlite3.connect('backend/database/healthcare.db')
cur = conn.cursor()

print('=== TABLE COUNTS ===')
for tbl in ['ed_visits','ctas_triage','visit_disposition','age_sex','main_problems','demographics']:
    cur.execute(f'SELECT COUNT(*) FROM {tbl}')
    print(f'{tbl}: {cur.fetchone()[0]} rows')

print('\n=== FISCAL YEAR RANGE (age_sex) ===')
cur.execute('SELECT MIN(fiscal_year_start), MAX(fiscal_year_start) FROM age_sex')
print(cur.fetchone())

print('\n=== TOTAL ED VISITS (age_sex unfiltered sum) ===')
cur.execute('SELECT SUM(ed_visits) FROM age_sex')
print(cur.fetchone())

print('\n=== CTAS TRIAGE LEVELS ===')
cur.execute('SELECT DISTINCT triage_level FROM ctas_triage ORDER BY triage_level')
for row in cur.fetchall(): print(row)

print('\n=== CTAS LOS STATS by triage level ===')
cur.execute('''SELECT triage_level, COUNT(*) as n, SUM(ed_visits) as total_visits, 
               AVG(median_length_of_stay_min) as avg_los_min, MIN(median_length_of_stay_min), MAX(median_length_of_stay_min)
               FROM ctas_triage WHERE ed_visits > 0 
               GROUP BY triage_level ORDER BY triage_level''')
for row in cur.fetchall(): print(row)

print('\n=== VISIT DISPOSITIONS ===')
cur.execute('SELECT DISTINCT visit_disposition FROM visit_disposition ORDER BY visit_disposition')
for row in cur.fetchall(): print(row)

print('\n=== AGE BROAD CATEGORIES ===')
cur.execute('SELECT DISTINCT age_broad_category FROM age_sex ORDER BY age_broad_category')
for row in cur.fetchall(): print(row)

print('\n=== ANNUAL ED VISITS TREND (age_sex) ===')
cur.execute('SELECT fiscal_year_start, SUM(ed_visits) as tv FROM age_sex GROUP BY fiscal_year_start ORDER BY fiscal_year_start')
for row in cur.fetchall(): print(row)

print('\n=== ADMITTED vs NON-ADMITTED LOS ===')
cur.execute('''SELECT is_admitted, COUNT(*), SUM(ed_visits), AVG(median_length_of_stay_min)
               FROM visit_disposition WHERE ed_visits > 0 AND is_admitted IS NOT NULL
               GROUP BY is_admitted''')
for row in cur.fetchall(): print(row)

print('\n=== H5 SEX x DISPOSITION CONTINGENCY ===')
cur.execute('''SELECT sex, is_admitted, SUM(ed_visits) as visit_count
               FROM visit_disposition
               WHERE sex NOT IN ('Total', 'Total visits', 'Unknown', 'Not Stated', 'Missing')
               AND is_admitted IS NOT NULL AND ed_visits > 0
               GROUP BY sex, is_admitted ORDER BY sex, is_admitted''')
for row in cur.fetchall(): print(row)

print('\n=== CTAS TRIAGE WEIGHTED N (H1) ===')
cur.execute('''SELECT SUM(ed_visits) FROM ctas_triage 
               WHERE triage_level NOT IN ('Total','TOTAL','Unknown','Not Stated','Any','ALL') 
               AND ed_visits > 0''')
print(cur.fetchone())

print('\n=== TOP MAIN PROBLEMS ===')
cur.execute('''SELECT main_problem, SUM(ed_visits) as tv FROM main_problems 
               WHERE main_problem NOT IN ('Any','Total','Unknown','Not Stated')
               AND ed_visits > 0 
               GROUP BY main_problem ORDER BY tv DESC LIMIT 10''')
for row in cur.fetchall(): print(row)

print('\n=== DEMOGRAPHICS SEX BREAKDOWN ===')
cur.execute('SELECT sex, SUM(total_visits) FROM demographics GROUP BY sex')
for row in cur.fetchall(): print(row)

conn.close()
print('DONE')
