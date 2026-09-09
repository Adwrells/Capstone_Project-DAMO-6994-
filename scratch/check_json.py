import json

with open(r'frontend\src\pages\Reports\capstoneReportData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

total_tables = 0
total_words = 0
for ch in data['chapters']:
    tables_in_ch = ch['markdown'].count('| --- |')
    total_tables += tables_in_ch
    total_words += ch['wordCount']
    print(f"{ch['shortTitle']}: {ch['elementCount']} elements, {ch['wordCount']} words, {tables_in_ch} tables")

print(f"\nTOTAL: {total_words} words, {total_tables} tables")
