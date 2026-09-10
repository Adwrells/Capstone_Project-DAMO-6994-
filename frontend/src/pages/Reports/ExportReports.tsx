/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reports & Export Page — Academic Dossier Studio
 * Continuous page-based document viewer, chapter filtering,
 * and DOCX / PDF export with a report-type chooser modal.
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck, Download, Sliders, RefreshCw,
  FileDown,
  CheckCircle2, Filter, X, FileText,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

// ─── Executive Report (MD content provided by user) ──────────────────────────
const EXECUTIVE_REPORT_MD = `# Explanatory and Predictive Analytics of Emergency Department Length of Stay and Resource Utilization Trends in Canadian Hospitals

**DAMO 699 – Capstone Project | Master of Data Analytics**
Rajbharath P (NF1016766) · Sufyaan Khan Mohammed (NF1017047) · Amit Raj Dev (NF1021076)
Group 5 | Supervisor: Dr. Bilal El Toufaili
University of Niagara Falls Canada | September 2026

---

## Executive Summary

Canadian emergency departments (EDs) operate under sustained pressure from increasing patient volumes, prolonged length of stay (LOS), admission-related boarding, and changing patient demographics. These pressures are not exclusively internal to the ED; they are also influenced by clinical acuity, diagnostic complexity, inpatient capacity, and the characteristics of the population being served. This project develops an evidence-based analytics framework for examining these pressures using 19 years of aggregate Canadian Institute for Health Information (CIHI) National Ambulatory Care Reporting System (NACRS) emergency-department data covering FY 2003/04–FY 2021/22.

The analytical dataset contains 10,685 aggregate reporting rows representing approximately 175.8 million ED encounters. Because the source is aggregate rather than patient-level data and LOS is strongly non-normal, the analysis uses frequency-weighted non-parametric procedures and aggregate-level weighted least squares (WLS) regression. Five pre-specified hypotheses examine relationships between LOS and CTAS acuity, admission status, age, and sex/disposition.

The results identify three major operational signals. First, clinical acuity is strongly associated with reported LOS. The weighted Kruskal–Wallis analysis for CTAS produced H = 126,319,368.24, p < .0001, ε² = 0.7251, with all 10 Bonferroni-adjusted pairwise comparisons significant. Median LOS was highest for CTAS II (4.80 hours) and CTAS I (4.60 hours), followed by CTAS III (3.40 hours), CTAS IV (1.90 hours), and CTAS V (1.33 hours).

Second, admission status is the strongest operational separation observed. Admitted visits had a reported median LOS of 10.60 hours, compared with 2.50 hours for non-admitted visits, with a rank-biserial correlation of 0.9981. This result supports the interpretation that ED throughput is closely connected to downstream inpatient capacity and patient flow.

Third, age is materially associated with LOS. Reported median LOS rises from 2.05 hours for Pediatric & Youth to 4.17 hours for Older Adults, with ε² = 0.7218 and all six pairwise age comparisons significant after Bonferroni adjustment. By contrast, sex and disposition are statistically associated because of the very large dataset, but the practical effect is negligible (χ² = 18,164.97, p < .0001, Cramér's V = 0.0102).

Longitudinal analysis also demonstrates sustained system pressure. Annual ED visits increased from approximately 4.91 million in FY 2003/04 to 13.99 million in FY 2021/22, reaching approximately 15.02 million in FY 2018/19. The Mann–Kendall test indicates a significant upward trend (Z = 5.5977, p < .001) with a Sen's slope of approximately 550.9 thousand visits per year. The project-specific Estimated Emergency Department Resource Burden Index (ERBI) increased from 5.21 to 9.32, with Kendall's τ = 0.9766, p < .0001. Simple Exponential Smoothing (SES) projects ERBI values of 9.32 for FY 2022/23 and 9.32 for FY 2023/24.

The project translates these findings into an interactive decision-support platform and a phased implementation roadmap focused on low-acuity fast-track pathways, inpatient-flow reform, boarding monitoring, geriatric emergency pathways, and continuous analytics governance. The findings are intended for system-level planning and decision support, not individual clinical prediction.

## 1. Research Problem, Objectives, and Questions

### 1.1 Problem Context

ED overcrowding and prolonged LOS are symptoms of broader healthcare-system capacity constraints. ED LOS includes multiple stages of care, including registration, assessment, diagnostic investigation, treatment, disposition, and, for admitted patients, waiting for an inpatient bed. Consequently, a meaningful analysis of ED throughput must consider both conditions within the department and downstream hospital capacity.

**Problem statement:** How can long-term aggregate ED data be transformed into statistically defensible, interpretable, and actionable evidence for understanding LOS, throughput, and resource-utilization pressure in Canadian hospitals?

### 1.2 Objectives

1. Quantify longitudinal changes in ED visit volume and reported LOS.
2. Identify important relationships between LOS and CTAS acuity, admission status, age, and sex/disposition.
3. Develop an aggregate-level predictive model and a forward-looking resource-burden forecast.
4. Translate analytical findings into an interactive decision-support system and operational recommendations.

### 1.3 Hypothesis Framework

| Hypothesis | Research Question | Method |
|---|---|---|
| H1 | Does CTAS acuity significantly affect reported ED LOS? | Weighted Kruskal–Wallis + Dunn |
| H2 | Do admitted visits have longer reported ED LOS than non-admitted visits? | Weighted Mann–Whitney U |
| H3 | Do CTAS, age group, and disposition predict reported median ED LOS? | Weighted Least Squares regression |
| H4 | Do broad age cohorts differ in reported ED LOS? | Weighted Kruskal–Wallis + Dunn |
| H5 | Is patient sex associated with ED disposition? | Pearson Chi-square + Cramér's V |

Significance threshold: α = .05. Effect sizes were emphasized alongside p-values.

## 2. Data and Analytical Methodology

### 2.1 Data Description

The empirical foundation is the CIHI NACRS supplementary emergency-department data for 2003–2022. The compiled analytical dataset represents approximately 175.8 million ED encounters over 19 fiscal years. Source records are aggregate reporting strata rather than individual patient observations.

### 2.2 Statistical Approach

- **H1 and H4:** frequency-weighted Kruskal–Wallis tests followed by Dunn pairwise comparisons with Bonferroni correction.
- **H2:** frequency-weighted Mann–Whitney U test with rank-biserial correlation.
- **H3:** aggregate-level WLS regression incorporating CTAS, age group, and disposition.
- **H5:** Pearson chi-square test with Cramér's V.
- **Longitudinal trend:** Mann–Kendall trend test and Sen's slope.
- **Resource forecasting:** Simple Exponential Smoothing (SES) applied to the ERBI series.

## 3. Key Findings

### 3.1 CTAS Acuity and Length of Stay — H1

| CTAS Level | Median LOS |
|---|---|
| CTAS I — Resuscitation | 4.60 h |
| CTAS II — Emergent | 4.80 h |
| CTAS III — Urgent | 3.40 h |
| CTAS IV — Less Urgent | 1.90 h |
| CTAS V — Non-Urgent | 1.33 h |

Weighted Kruskal–Wallis: H = 126,319,368.24, p < .0001, ε² = 0.7251. All 10 pairwise comparisons significant (Bonferroni adjusted).

### 3.2 Admission Status and Length of Stay — H2

Admitted visits: median LOS 10.60 h vs. non-admitted: 2.50 h. Rank-biserial correlation = 0.9981.

### 3.3 Multivariable LOS Model — H3

WLS model adjusted R² = 0.8837. CTAS category and disposition contribute substantially to explaining aggregate variation in reported median LOS.

### 3.4 Age and Length of Stay — H4

| Age Cohort | Median LOS |
|---|---|
| Pediatric & Youth | 2.02 h |
| Young Adult | 2.47 h |
| Middle Adult | 2.73 h |
| Older Adult | 4.01 h |

Weighted Kruskal–Wallis: ε² = 0.7218. All six pairwise comparisons significant.

### 3.5 Sex and Disposition — H5

χ² = 18,164.97, df = 1, p < .0001, Cramér's V = 0.0102 (negligible practical effect). Admission rates: female ~9.95%, male ~10.56%.

## 4. Longitudinal Throughput and Resource Burden

ERBI increased from 5.21 (FY 2003/04) to 9.32 (FY 2021/22). Kendall's τ = 0.9766, p < .0001.

| Fiscal Year | ERBI Forecast | 95% Prediction Interval |
|---|---|---|
| FY 2022/23 | 9.32 | 6.91–10.39 |
| FY 2023/24 | 9.32 | 6.84–11.12 |

## 5. Decision-Support Platform

The analytical results were implemented as an interactive web-based decision-support platform using React 19, TypeScript, Recharts, Vite, and a FastAPI backend with 31 REST endpoints.

## 6. Strategic Recommendations

1. **Fast-Track Low-Acuity Care** (Months 1–6) — Rapid-assessment pathways for CTAS IV/V patients.
2. **Inpatient Flow Reform** (Months 6–18) — Early discharges, discharge lounges, real-time bed visibility.
3. **Automated Boarding Monitoring** (Months 12–18) — Real-time monitoring with escalation thresholds.
4. **Geriatric Emergency Pathways** (Months 18–36) — Targeted pathways for older adults.
5. **Continuous Analytics Governance** (Ongoing) — ERBI monitoring, CIHI data refreshes.

## 7. Limitations and Future Research

The principal limitation is the aggregate nature of the CIHI NACRS data. Results should not be interpreted as the expected LOS of an individual patient. Future research should incorporate patient-level data, richer clinical variables, inpatient/outcome linkages, hospital/geographic identifiers, and machine-learning approaches.

## 8. Conclusion

Canadian ED throughput is a multidimensional system-level problem. CTAS acuity, admission status, and age are the three operationally important dimensions. The longitudinal ERBI trend and two-year forecast provide a forward-looking planning signal. Results support capacity planning, operational analysis, and system-level decision support—not individual clinical decision-making.

## References

Affleck, A., Parks, P., Drummond, A., Unger, B., & Ovens, H. (2013). Emergency department overcrowding and access block. *Canadian Journal of Emergency Medicine, 15*(6), 359–370.

Canadian Institute for Health Information. (2026). *National Ambulatory Care Reporting System (NACRS): Emergency department supplementary data tables, 2003–2022* [Data set]. CIHI.

Hyndman, R. J., & Athanasopoulos, G. (2018). *Forecasting: Principles and practice* (2nd ed.). OTexts.

Li, M. K., McLeod, S. L., et al. (2026). Emergency department overcrowding [CAEP position statement update]. Canadian Association of Emergency Physicians.

Lin, M., Lucas, H. C., Jr., & Shmueli, G. (2013). Research commentary—Too big to fail. *Information Systems Research, 24*(4), 906–917.

OECD. (2023). *Health at a glance 2023*. OECD Publishing.
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type ReportType = 'final' | 'executive' | 'both';

interface ExportReportsProps {
  datasetName: string;
  cleanedCount: number;
  qualityScore: number;
  fields?: any[];
  aiAnalysisText?: string | null;
  rawData?: any[];
  isDarkMode?: boolean;
}

// ─── Download Modal (PDF format only) ─────────────────────────────────────────
interface DownloadModalProps {
  onClose: () => void;
  onDownload: (reportType: ReportType) => void;
  isExporting: boolean;
}

function DownloadModal({ onClose, onDownload, isExporting }: DownloadModalProps) {
  const reportOptions: { id: ReportType; label: string; desc: string; badge: string; isPrimary?: boolean }[] = [
    {
      id: 'final',
      label: 'Final Report (PDF)',
      desc: 'Official 70-page academic capstone report (Final Report Capstone Project.pdf)',
      badge: '1.6 MB · PDF',
      isPrimary: true,
    },
    {
      id: 'executive',
      label: 'Executive Report (PDF)',
      desc: 'Concise summary: biostatistical findings, models, and strategic recommendations in printable PDF',
      badge: 'PDF',
    },
    {
      id: 'both',
      label: 'Both Reports (PDF)',
      desc: 'Download both the Final Report PDF (1.6 MB) and Executive Report PDF',
      badge: '2 PDFs',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Download Report (PDF Format)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300">
            <FileText size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Reports are downloaded exclusively in <strong>PDF format</strong>.</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {reportOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={isExporting}
                onClick={() => onDownload(opt.id)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition cursor-pointer group disabled:opacity-60 ${
                  opt.isPrimary
                    ? 'border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-600 dark:hover:border-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0 group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition mt-0.5">
                  {isExporting ? (
                    <RefreshCw size={16} className="text-red-600 dark:text-red-400 animate-spin" />
                  ) : (
                    <FileText size={18} className="text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      {opt.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
// ─── Executive Report section parser ─────────────────────────────────────────
interface ExecSection {
  id: string;
  heading: string;
  level: number; // 1 = #, 2 = ##, 3 = ###
  lines: string[];
}

function parseExecSections(md: string): ExecSection[] {
  const rawLines = md.split('\n');
  const sections: ExecSection[] = [];
  let current: ExecSection | null = null;

  for (const line of rawLines) {
    const h1 = line.match(/^# (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h1 || h2) {
      if (current) sections.push(current);
      const heading = (h1 || h2)![1];
      current = {
        id: heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40),
        heading,
        level: h1 ? 1 : 2,
        lines: [],
      };
    } else if (h3 && current) {
      current.lines.push(line);
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

const ALL_EXEC_SECTIONS = parseExecSections(EXECUTIVE_REPORT_MD);

// ─── Markdown line renderer ───────────────────────────────────────────────────
function renderMdLine(line: string, idx: number): React.ReactNode {
  if (!line.trim()) return <div key={idx} className="h-3" />;
  if (line.startsWith('---')) return <hr key={idx} style={{ borderColor: '#cbd5e1', margin: '12px 0' }} />;

  // Table row
  if (line.startsWith('|') && !line.match(/^\|[-: ]+\|/)) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    const isHeader = idx === 0 || false;
    return (
      <tr key={idx}>
        {cells.map((cell, ci) => (
          <td key={ci} style={{
            border: '1px solid #94a3b8', padding: '4px 8px',
            fontWeight: isHeader ? 'bold' : 'normal',
            color: '#0f172a', fontSize: '11px',
          }}>{cell}</td>
        ))}
      </tr>
    );
  }
  if (line.match(/^\|[-: ]+\|/)) return null;

  // Headings
  if (line.startsWith('### ')) {
    return <h3 key={idx} style={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold', marginTop: '14px', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>{line.slice(4)}</h3>;
  }
  if (line.startsWith('## ')) {
    return <h2 key={idx} style={{ color: '#0f172a', fontSize: '14px', fontWeight: 'bold', marginTop: '20px', marginBottom: '6px', fontFamily: 'Georgia, serif', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>{line.slice(3)}</h2>;
  }

  // Bullet
  if (line.startsWith('- ') || line.startsWith('* ')) {
    const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <li key={idx} style={{ color: '#0f172a', fontSize: '12px', marginBottom: '3px', lineHeight: 1.6, fontFamily: 'Georgia, serif' }} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  // Numbered list
  if (line.match(/^\d+\. /)) {
    const content = line.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <li key={idx} style={{ color: '#0f172a', fontSize: '12px', marginBottom: '3px', lineHeight: 1.6, fontFamily: 'Georgia, serif', listStyleType: 'decimal' }} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Normal paragraph — bold/italic inline
  const html = line
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#1d4ed8">$1</a>');
  return (
    <p key={idx} style={{
      color: '#0f172a', fontSize: '12px', lineHeight: 1.7,
      textAlign: 'justify', marginBottom: '8px',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function renderSection(section: ExecSection): React.ReactNode {
  // Gather lines, detect table blocks
  const blocks: React.ReactNode[] = [];
  let tableLines: string[] = [];
  let inTable = false;
  let listLines: { line: string; idx: number }[] = [];
  let inList = false;

  const flushTable = (key: string) => {
    if (!tableLines.length) return;
    const rows = tableLines.filter((l) => !l.match(/^\|[-: ]+\|/));
    const [headerRow, ...dataRows] = rows;
    const parseRow = (l: string) => l.split('|').slice(1, -1).map((c) => c.trim());
    blocks.push(
      <div key={key} style={{ overflowX: 'auto', margin: '10px 0' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px' }}>
          <thead>
            <tr>{parseRow(headerRow || '').map((h, i) => (
              <th key={i} style={{ border: '1px solid #0f172a', padding: '5px 8px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left', fontWeight: 'bold' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} style={{ backgroundColor: ri % 2 === 1 ? '#f8fafc' : '#fff' }}>
                {parseRow(row).map((cell, ci) => (
                  <td key={ci} style={{ border: '1px solid #cbd5e1', padding: '4px 8px', color: '#0f172a' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
    inTable = false;
  };

  const flushList = (key: string) => {
    if (!listLines.length) return;
    blocks.push(
      <ul key={key} style={{ paddingLeft: '20px', margin: '6px 0' }}>
        {listLines.map(({ line, idx }) => renderMdLine(line, idx))}
      </ul>
    );
    listLines = [];
    inList = false;
  };

  section.lines.forEach((line, idx) => {
    if (line.startsWith('|')) {
      if (inList) flushList(`list-${idx}`);
      inTable = true;
      tableLines.push(line);
    } else if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\. /)) {
      if (inTable) flushTable(`tbl-${idx}`);
      inList = true;
      listLines.push({ line, idx });
    } else {
      if (inTable) flushTable(`tbl-${idx}`);
      if (inList) flushList(`list-${idx}`);
      const node = renderMdLine(line, idx);
      if (node !== null) blocks.push(node);
    }
  });
  if (inTable) flushTable('tbl-end');
  if (inList) flushList('list-end');

  return blocks;
}

export default function ExportReports(_props: ExportReportsProps) {
  // Executive report section filter
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>(
    ALL_EXEC_SECTIONS.map((s) => s.id)
  );

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) =>
    setSelectedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const visibleSections = useMemo(
    () => ALL_EXEC_SECTIONS.filter((s) => selectedSectionIds.includes(s.id) && s.level !== 1),
    [selectedSectionIds]
  );

  const handleSelectAll = () => {
    setSelectedSectionIds(ALL_EXEC_SECTIONS.map((s) => s.id));
  };
  const handleClearSelection = () => {
    setSelectedSectionIds([]);
  };

  // ── Helpers to build exportable content ────────────────────────────────────
  const buildExecutivePdfHtml = (title: string, mdContent: string) => {
    const lines = mdContent.split('\n');
    const body = lines
      .map((line) => {
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
        if (line.startsWith('---')) return `<hr/>`;
        if (line.trim() === '') return `<br/>`;
        // table row
        if (line.startsWith('|')) {
          const cells = line.split('|').slice(1, -1).map((c) => c.trim());
          return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
        }
        line = line.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
        return `<p>${line}</p>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>${title}</title>
<style>
  @page { size: 8.5in 11in; margin: 1in; }
  body { font-family: "Times New Roman", Times, Georgia, serif; font-size: 11pt; color: #0f172a; margin: 0; line-height: 1.6; }
  h1 { font-size: 16pt; text-align: center; margin-bottom: 12pt; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 8pt; }
  h2 { font-size: 13pt; margin-top: 16pt; margin-bottom: 6pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt; }
  h3 { font-size: 11.5pt; margin-top: 12pt; margin-bottom: 4pt; }
  p  { text-align: justify; margin-bottom: 6pt; }
  table { border-collapse: collapse; width: 100%; margin: 10pt 0; font-size: 9.5pt; }
  td, th { border: 1px solid #94a3b8; padding: 5pt 7pt; }
  th { font-weight: bold; background: #f1f5f9; text-align: left; }
  hr { border: none; border-top: 1px solid #cbd5e1; margin: 16pt 0; }
  @media print {
    body { margin: 0; }
  }
</style></head><body>${body}</body></html>`;
  };

  const handleDownload = (reportType: ReportType) => {
    setIsExporting(true);

    setTimeout(() => {
      // 1. Download official Final Report Capstone Project.pdf
      const downloadFinalReportPdf = () => {
        const link = document.createElement('a');
        link.href = '/reports/Final Report Capstone Project.pdf';
        link.download = 'Final Report Capstone Project.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowSuccessToast('Downloaded Final Report Capstone Project.pdf (1.6 MB Complete Academic Report)');
      };

      // 2. Download / Print Executive Report PDF
      const downloadExecutiveReportPdf = () => {
        const pw = window.open('', '_blank');
        if (pw) {
          pw.document.write(
            buildExecutivePdfHtml(
              'Executive Report — Length of Stay & Resource Utilization in Canadian Hospitals',
              EXECUTIVE_REPORT_MD
            )
          );
          pw.document.close();
          setTimeout(() => pw.print(), 500);
        }
        setShowSuccessToast('Print dialog opened — save Executive Report as PDF.');
      };

      if (reportType === 'final') {
        downloadFinalReportPdf();
      } else if (reportType === 'executive') {
        downloadExecutiveReportPdf();
      } else {
        // Both reports
        downloadFinalReportPdf();
        setTimeout(() => {
          downloadExecutiveReportPdf();
        }, 800);
      }

      setIsExporting(false);
      setShowModal(false);
      setTimeout(() => setShowSuccessToast(null), 5000);
    }, 300);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* Download Modal */}
      {showModal && (
        <DownloadModal
          onClose={() => setShowModal(false)}
          onDownload={handleDownload}
          isExporting={isExporting}
        />
      )}

      {/* Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500">
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="text-sm font-semibold">{showSuccessToast}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        category="Stage 7/7 · Reports & Export"
        title="Final Capstone Report & Executive Dossier"
        subtitle="DAMO 699 Capstone Project · Comprehensive Biostatistical & Operational Modeling Publication Dossier"
        badgeIcon={<FileDown className="w-3.5 h-3.5 text-blue-500" />}
        contextPills={[
          { label: 'Status', value: 'EXPORT DOSSIER VALIDATED', variant: 'success' },
          { label: 'Institution', value: 'University of Niagara Falls Canada', variant: 'blue' },
          { label: 'Course', value: 'DAMO 699', variant: 'default' },
          { label: 'Supervisor', value: 'Dr. Bilal El Toufaili', variant: 'amber' },
        ]}
      />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Panel */}
        <div className="lg:col-span-3 space-y-4">

          {/* Download Button */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders size={15} className="text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Export (PDF)</h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <Download size={15} />
              <span>Download Report (PDF)…</span>
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
              PDF format only · Final Report (1.6 MB) or Executive Report
            </p>
          </div>

          {/* Section Filter */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Section Filter</h3>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                {visibleSections.length}/{ALL_EXEC_SECTIONS.filter((s) => s.level !== 1).length}
              </span>
            </div>

            <div className="flex gap-1.5">
              <button type="button" onClick={handleSelectAll}
                className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer">
                All
              </button>
              <button type="button" onClick={handleClearSelection}
                className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 transition cursor-pointer">
                None
              </button>
            </div>

            <div className="space-y-1 max-h-[420px] overflow-y-auto pr-0.5">
              {ALL_EXEC_SECTIONS.filter((s) => s.level !== 1).map((section) => {
                const isChecked = selectedSectionIds.includes(section.id);
                return (
                  <div
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition cursor-pointer ${
                      isChecked
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60'
                        : 'border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                    }`}
                  >
                    <input type="checkbox" checked={isChecked} onChange={() => {}}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer shrink-0" />
                    <span
                      className={`truncate font-semibold text-[11px] ${
                        section.level === 1
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 pl-1'
                      }`}
                    >
                      {section.level === 2 && <span className="text-[9px] mr-1 opacity-50">└</span>}
                      {section.heading.length > 42 ? section.heading.slice(0, 42) + '…' : section.heading}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
              <ShieldCheck size={11} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>DAMO 699 · University of Niagara Falls Canada · Dr. Bilal El Toufaili</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-9 space-y-3">

          {/* Toolbar */}
          <div className="p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs">
                <FileText size={13} />
                <span>Executive Report</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-white">{visibleSections.length}</span>
              <span> of {ALL_EXEC_SECTIONS.filter((s) => s.level !== 1).length} sections</span>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={containerRef}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-[#d1d5db] dark:bg-[#070b16] p-6 md:p-10 overflow-y-auto flex flex-col items-center shadow-inner select-text"
            style={{ minHeight: '860px', maxHeight: '90vh' }}
          >
            <div id="report-preview-sheet" className="w-full flex flex-col items-center">
              <style>{`
                @media print {
                  body * { visibility: hidden !important; }
                  #report-preview-sheet, #report-preview-sheet * { visibility: visible !important; }
                  #report-preview-sheet { position:absolute !important; left:0 !important; top:0 !important; width:100% !important; margin:0 !important; padding:0 !important; background:#fff !important; }
                  .academic-page-sheet { page-break-after:always !important; break-after:page !important; box-shadow:none !important; border:none !important; margin:0 auto !important; width:100% !important; }
                }
              `}</style>

              {/* ── Executive Report View ── */}
              <div
                className="w-full"
                style={{ maxWidth: '816px' }}
              >
                {/* Cover sheet */}
                <div
                  className="bg-white mx-auto mb-8 shadow-2xl border border-slate-300/90"
                  style={{
                    width: '816px', minHeight: '200px',
                    padding: '52px 58px 40px',
                    fontFamily: '"Times New Roman", Times, Georgia, serif',
                    color: '#0f172a',
                  }}
                >
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1d4ed8', marginBottom: '6px' }}>
                      University of Niagara Falls Canada
                    </div>
                    <div style={{ fontSize: '10px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                      Master of Data Analytics · DAMO 699 – Capstone Project
                    </div>
                  </div>
                  <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'extrabold', textTransform: 'uppercase', color: '#0f172a', lineHeight: 1.3, marginBottom: '10px' }}>
                    Explanatory and Predictive Analytics of Emergency Department Length of Stay and Resource Utilization Trends in Canadian Hospitals
                  </h1>
                  <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '12px', color: '#334155', marginBottom: '24px' }}>
                    A Frequency-Weighted Biostatistical and Time-Series Analysis of 175.8 Million CIHI NACRS ED Encounters (2003–2022)
                  </p>
                  <div style={{ borderTop: '2px solid #0f172a', paddingTop: '16px', textAlign: 'center', fontFamily: 'sans-serif', fontSize: '11px', color: '#475569' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Group 5:</strong> Rajbharath P (NF1016766) · Sufyaan Khan Mohammed (NF1017047) · Amit Raj Dev (NF1021076)</div>
                    <div><strong>Supervisor:</strong> Dr. Bilal El Toufaili &nbsp;|&nbsp; September 2026</div>
                  </div>
                </div>

                {/* Sections */}
                {visibleSections.length === 0 ? (
                  <div className="text-slate-400 dark:text-slate-600 text-sm py-20 text-center">
                    <Filter size={32} className="mx-auto mb-3 opacity-40" />
                    <p>No sections selected.</p>
                  </div>
                ) : (
                  visibleSections.map((section) => (
                    <div
                      key={section.id}
                      id={`exec-section-${section.id}`}
                      className="bg-white mx-auto mb-6 shadow-2xl border border-slate-300/90"
                      style={{
                        width: '816px',
                        padding: '44px 58px',
                        fontFamily: '"Times New Roman", Times, Georgia, serif',
                        color: '#0f172a',
                      }}
                    >
                      {/* Running header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '20px', fontFamily: 'sans-serif', userSelect: 'none' }}>
                        <span>University of Niagara Falls Canada · Master of Data Analytics | DAMO 699</span>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>Executive Report</span>
                      </div>

                      {/* Section heading */}
                      {section.level === 1 ? (
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #0f172a', fontFamily: 'Georgia, serif' }}>
                          {section.heading}
                        </h1>
                      ) : (
                        <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0', fontFamily: 'Georgia, serif' }}>
                          {section.heading}
                        </h2>
                      )}

                      {/* Section content */}
                      <div>{renderSection(section)}</div>

                      {/* Running footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: '20px', fontFamily: 'sans-serif', userSelect: 'none' }}>
                        <span>Length of Stay & Resource Utilization in Canadian Hospitals (CIHI NACRS)</span>
                        <span style={{ color: '#0f172a', fontWeight: 600, fontFamily: 'monospace' }}>Executive Report · Group 5</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
