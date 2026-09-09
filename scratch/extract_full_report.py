import zipfile
import xml.etree.ElementTree as ET
import json
import re

docx_path = r'C:\Users\bhara\OneDrive\Desktop\Final Report Capstone Project.docx'

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')

tree = ET.fromstring(xml_content)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
body = tree.find('.//w:body', ns)

def parse_paragraph(p):
    runs = []
    for r in p.findall('w:r', ns):
        t_nodes = r.findall('w:t', ns)
        text = ''.join(node.text for node in t_nodes if node.text)
        if not text:
            continue
        rPr = r.find('w:rPr', ns)
        is_bold = rPr is not None and (rPr.find('w:b', ns) is not None or rPr.find('w:bCs', ns) is not None)
        is_italic = rPr is not None and (rPr.find('w:i', ns) is not None or rPr.find('w:iCs', ns) is not None)
        runs.append({'text': text, 'bold': is_bold, 'italic': is_italic})
    
    full_text = ''.join(r['text'] for r in runs).strip()
    if not full_text:
        return None
    
    # Check if whole paragraph is bold
    all_bold = len(runs) > 0 and all(r['bold'] for r in runs if r['text'].strip())
    
    return {
        'type': 'p',
        'text': full_text,
        'runs': runs,
        'all_bold': all_bold
    }

def parse_table(tbl):
    rows = []
    for tr in tbl.findall('w:tr', ns):
        cells = []
        for tc in tr.findall('w:tc', ns):
            cell_texts = []
            for p in tc.findall('w:p', ns):
                p_obj = parse_paragraph(p)
                if p_obj:
                    cell_texts.append(p_obj['text'])
            cells.append(' '.join(cell_texts))
        if cells:
            rows.append(cells)
    return {
        'type': 'tbl',
        'rows': rows
    }

elements = []
for child in body:
    tag = child.tag.replace('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}', '')
    if tag == 'p':
        p_obj = parse_paragraph(child)
        if p_obj:
            elements.append(p_obj)
    elif tag == 'tbl':
        t_obj = parse_table(child)
        if t_obj and t_obj['rows']:
            elements.append(t_obj)

print(f"Total elements parsed: {len(elements)}")

# Group elements into chapters
chapters = []
current_chapter = None

# Title / preamble metadata
preamble = []

# Detect chapter boundary
chapter_titles = [
    ("exec-summary", "Executive Summary", "Executive Summary", "Executive summary of research findings and clinical throughput models"),
    ("ch1", "Chapter 1", "Chapter 1: Problem Analysis and Strategic Context", "Canadian ED landscape, access block mechanics, and hypothesis registry"),
    ("ch2", "Chapter 2", "Chapter 2: Analytics Lifecycle and Project Methodology", "Ten-stage analytics lifecycle, non-parametric methods, and governance"),
    ("ch3", "Chapter 3", "Chapter 3: Data Collection, Inventory and Preparation", "Data provenance, schema harmonization, cleaning rules, and reproducibility"),
    ("ch4", "Chapter 4", "Chapter 4: Exploratory Data Analysis and Descriptive Profiling", "19-year volume trends, triage acuity, admission patterns, and clinical case mix"),
    ("ch5", "Chapter 5", "Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference", "Formal testing of H1–H5 with effect sizes, WLS regression, and diagnostics"),
    ("ch6", "Chapter 6", "Chapter 6: Time-Series Trend Analysis and Throughput Forecasting", "Mann-Kendall test, Holt's linear exponential smoothing forecast, and ERBI"),
    ("ch7", "Chapter 7", "Chapter 7: Data Visualization and Decision Support Systems", "Executive dashboard architecture, interactive filters, and decision support"),
    ("ch8", "Chapter 8", "Chapter 8: Findings, Synthesis, and Critical Discussion", "Operational triad synthesis, literature comparison, strengths, and limitations"),
    ("ch9", "Chapter 9", "Chapter 9: Strategic Recommendations and Implementation Roadmap", "Tiered recommendations, fast-track pathways, inpatient flow, and roadmap"),
    ("references", "References", "References", "Peer-reviewed literature, CIHI reports, and statistical sources"),
    ("app-a", "Appendix A", "Appendix A: System Validation and Testing Evidence", "Automated solver tests, validation rules, and statistical verification"),
    ("app-b", "Appendix B", "Appendix B: Rubric Alignment Checklist", "Capstone academic rubric mapping and competency criteria"),
    ("app-c", "Appendix C", "Appendix C: Analytics Lifecycle Evidence Log", "Platform implementation log and audit trail across all lifecycle stages")
]

chapter_regexes = [
    (0, re.compile(r'^Executive Summary$', re.IGNORECASE)),
    (1, re.compile(r'^Chapter 1:\s*Problem Analysis', re.IGNORECASE)),
    (2, re.compile(r'^Chapter 2:\s*Analytics Lifecycle', re.IGNORECASE)),
    (3, re.compile(r'^Chapter 3:\s*Data Collection', re.IGNORECASE)),
    (4, re.compile(r'^Chapter 4:\s*Exploratory Data Analysis', re.IGNORECASE)),
    (5, re.compile(r'^Chapter 5:\s*Statistical Hypothesis', re.IGNORECASE)),
    (6, re.compile(r'^Chapter 6:\s*Time-Series Trend', re.IGNORECASE)),
    (7, re.compile(r'^Chapter 7:\s*Data Visualization', re.IGNORECASE)),
    (8, re.compile(r'^Chapter 8:\s*Findings,\s*Synthesis', re.IGNORECASE)),
    (9, re.compile(r'^Chapter 9:\s*Strategic Recommendations', re.IGNORECASE)),
    (10, re.compile(r'^References$', re.IGNORECASE)),
    (11, re.compile(r'^Appendix A:\s*System Validation', re.IGNORECASE)),
    (12, re.compile(r'^Appendix B:\s*Rubric Alignment', re.IGNORECASE)),
    (13, re.compile(r'^Appendix C\s*[—:]\s*Analytics Lifecycle', re.IGNORECASE)),
]

def find_chapter_match(text):
    clean = text.strip()
    if '...' in clean:
        return None
    for idx, reg in chapter_regexes:
        if reg.match(clean):
            return idx
    return None

curr_idx = -1
chapter_elements = {i: [] for i in range(len(chapter_titles))}

for el in elements:
    if el['type'] == 'p':
        matched_idx = find_chapter_match(el['text'])
        if matched_idx is not None:
            curr_idx = matched_idx
            continue
    if curr_idx >= 0:
        chapter_elements[curr_idx].append(el)
    else:
        preamble.append(el)

print(f"Preamble elements: {len(preamble)}")
for i, (cid, short, full, desc) in enumerate(chapter_titles):
    print(f"Chapter {i} ({short}): {len(chapter_elements[i])} elements")

# Convert elements to Markdown
def table_to_md(tbl):
    rows = tbl['rows']
    if not rows:
        return ""
    # Normalize col count
    max_cols = max(len(r) for r in rows)
    padded = [r + [''] * (max_cols - len(r)) for r in rows]
    
    # Escape pipe characters in cell content
    clean_rows = [[c.replace('|', '\\|').strip() for c in r] for r in padded]
    
    md_lines = []
    # Header
    md_lines.append("| " + " | ".join(clean_rows[0]) + " |")
    md_lines.append("| " + " | ".join(["---"] * max_cols) + " |")
    for r in clean_rows[1:]:
        md_lines.append("| " + " | ".join(r) + " |")
    return "\n".join(md_lines) + "\n\n"

def element_to_md(el):
    if el['type'] == 'tbl':
        return table_to_md(el)
    text = el['text'].strip()
    if not text:
        return ""
    # Check if heading
    if re.match(r'^\d+\.\d+(\.\d+)?\s+', text):
        depth = text.count('.')
        prefix = "### " if depth >= 2 else "## "
        return f"{prefix}{text}\n\n"
    elif el['all_bold'] and len(text) < 120 and not text.endswith('.'):
        return f"### {text}\n\n"
    elif text.startswith("Table ") or text.startswith("Figure "):
        return f"*{text}*\n\n"
    else:
        return f"{text}\n\n"

parsed_chapters = []
for i, (cid, short, full, desc) in enumerate(chapter_titles):
    els = chapter_elements[i]
    md_content = f"# {full}\n\n"
    for el in els:
        md_content += element_to_md(el)
    
    parsed_chapters.append({
        'id': cid,
        'number': i,
        'shortTitle': short,
        'title': full,
        'description': desc,
        'markdown': md_content.strip(),
        'elementCount': len(els),
        'wordCount': len(md_content.split())
    })

output_data = {
    'metadata': {
        'title': 'Length of Stay and Resource Utilization Trends in Canadian Hospitals',
        'subtitle': 'A Frequency-Weighted Biostatistical and Time-Series Analysis of 175.8 Million CIHI NACRS Emergency Department Encounters (2003–2022)',
        'course': 'DAMO 699 – Capstone Project',
        'program': 'Master of Data Analytics',
        'group': 'Group No: 5',
        'institution': 'University of Niagara Falls',
        'date': 'September 6, 2026',
        'supervisor': 'Dr. Bilal El Toufaili',
        'authors': [
            {'name': 'Rajbharath P', 'id': 'NF1016766'},
            {'name': 'Sufyaan Khan Mohammed', 'id': 'NF1017047'},
            {'name': 'Amit Raj Dev', 'id': 'NF1021076'}
        ]
    },
    'chapters': parsed_chapters
}

out_path = r'frontend\src\pages\Reports\capstoneReportData.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {out_path} with {len(parsed_chapters)} chapters!")
