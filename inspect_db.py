import sqlite3

conn = sqlite3.connect('backend/database/healthcare.db')
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print('TABLES:', tables)

for t in tables:
    cursor.execute(f'PRAGMA table_info({t})')
    cols = [(r[1], r[2]) for r in cursor.fetchall()]
    cursor.execute(f'SELECT COUNT(*) FROM {t}')
    cnt = cursor.fetchone()[0]
    print(f'\n--- {t} ({cnt} rows) ---')
    for c in cols:
        print(f'  {c[0]} ({c[1]})')

# Check distinct values in visit_disposition
print('\n--- visit_disposition distinct values ---')
cursor.execute("SELECT DISTINCT visit_disposition FROM visit_disposition ORDER BY visit_disposition")
for r in cursor.fetchall():
    print(' ', r[0])

# Check distinct sex values in visit_disposition
print('\n--- visit_disposition sex values ---')
cursor.execute("SELECT DISTINCT sex FROM visit_disposition ORDER BY sex")
for r in cursor.fetchall():
    print(' ', r[0])

# Check if sex + disposition co-occur
print('\n--- visit_disposition sex x is_admitted ---')
cursor.execute("SELECT sex, is_admitted, COUNT(*), SUM(ed_visits) FROM visit_disposition WHERE sex NOT IN ('Total','Total visits','Unknown') AND is_admitted IS NOT NULL GROUP BY sex, is_admitted ORDER BY sex, is_admitted")
for r in cursor.fetchall():
    print(f'  sex={r[0]}, is_admitted={r[1]}, rows={r[2]}, visits={r[3]}')

# Check ctas_triage sex values
print('\n--- ctas_triage distinct sex values ---')
cursor.execute("SELECT DISTINCT sex FROM ctas_triage ORDER BY sex")
for r in cursor.fetchall():
    print(' ', r[0])

# Check distinct triage levels
print('\n--- ctas_triage distinct triage_level ---')
cursor.execute("SELECT DISTINCT triage_level FROM ctas_triage ORDER BY triage_level")
for r in cursor.fetchall():
    print(' ', r[0])

# Check age_sex distinct age_broad_category
print('\n--- age_sex distinct age_broad_category ---')
cursor.execute("SELECT DISTINCT age_broad_category FROM age_sex ORDER BY age_broad_category")
for r in cursor.fetchall():
    print(' ', r[0])

# Check sex in age_sex
print('\n--- age_sex distinct sex ---')
cursor.execute("SELECT DISTINCT sex FROM age_sex ORDER BY sex")
for r in cursor.fetchall():
    print(' ', r[0])

# Sample row from ed_visits
print('\n--- ed_visits sample (5 rows) ---')
cursor.execute("SELECT * FROM ed_visits LIMIT 5")
rows = cursor.fetchall()
cols = [d[0] for d in cursor.description]
print(' ', cols)
for r in rows:
    print(' ', r)

conn.close()
