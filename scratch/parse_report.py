import json
import re

with open('extracted_final_report.txt', 'r', encoding='utf-8') as f:
    raw_lines = [line.strip() for line in f if line.strip()]

chapters = []
current_chapter = None
current_paras = []

chapter_pattern = re.compile(r'^(Executive Summary|Chapter \d+:.*|References|Appendix [A-C]:.*|Appendix [A-C] —.*)')

for line in raw_lines:
    if chapter_pattern.match(line):
        if current_chapter:
            chapters.append({
                'title': current_chapter,
                'content': current_paras
            })
        current_chapter = line
        current_paras = []
    else:
        if current_chapter:
            current_paras.append(line)

if current_chapter:
    chapters.append({
        'title': current_chapter,
        'content': current_paras
    })

print(f"Parsed {len(chapters)} major sections:")
for i, c in enumerate(chapters):
    para_count = len(c['content'])
    word_count = sum(len(p.split()) for p in c['content'])
    print(f"{i+1}. {c['title']} ({para_count} paras, {word_count} words)")
