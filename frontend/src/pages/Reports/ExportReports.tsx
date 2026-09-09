/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reports & Export Page — Academic Dossier Studio
 * Continuous page-based document viewer, chapter filtering,
 * and DOCX / PDF / MD export.
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck, Download, RefreshCw, Sliders,
  FileDown, BookOpen, GraduationCap, Building2, User,
  ChevronRight, CheckCircle2, FileText, Filter,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { fmtK } from '../../utils/formatters';
import { CAPSTONE_REPORT } from './capstoneReportData';
import { PAGINATED_REPORT_DATA } from './paginatedReportData';
import AcademicPageSheet from './AcademicPageSheet';

interface ExportReportsProps {
  datasetName: string;
  cleanedCount: number;
  qualityScore: number;
  fields?: any[];
  aiAnalysisText?: string | null;
  rawData?: any[];
  isDarkMode?: boolean;
}

type ExportFormat = 'PDF' | 'Markdown' | 'DOCX';

export default function ExportReports({
  cleanedCount,
}: ExportReportsProps) {
  const [reportName, setReportName] = useState<string>('University_of_Niagara_Falls_Capstone_Final_Report_Group5');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('PDF');

  // Chapter selection (default: all)
  const allChapterIds = useMemo(() => CAPSTONE_REPORT.chapters.map((c) => c.id), []);
  const [selectedIds, setSelectedIds] = useState<string[]>(allChapterIds);

  // Export status
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = PAGINATED_REPORT_DATA.totalPages;
  const chaptersNav = PAGINATED_REPORT_DATA.chapters;

  // Chapter toggle helpers
  const handleSelectAll = () => setSelectedIds(allChapterIds);
  const handleClearSelection = () => setSelectedIds([]);

  const toggleChapter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selected chapters list
  const selectedChapters = useMemo(
    () => CAPSTONE_REPORT.chapters.filter((c) => selectedIds.includes(c.id)),
    [selectedIds]
  );

  // Filter paginated pages according to selected chapters
  const visiblePages = useMemo(() => {
    if (selectedIds.length === allChapterIds.length) {
      return PAGINATED_REPORT_DATA.pages;
    }
    return PAGINATED_REPORT_DATA.pages.filter((p) => {
      if (p.isCover) return true;
      const chName = p.chapter.toLowerCase();
      return selectedChapters.some(
        (sc) =>
          chName.includes(sc.shortTitle.toLowerCase()) ||
          sc.title.toLowerCase().includes(chName) ||
          (p.chapter === 'Executive Summary' && sc.id === 'exec-summary') ||
          p.chapter === 'Table of Contents' ||
          (p.chapter.startsWith('Appendix') && sc.id.startsWith('app'))
      );
    });
  }, [selectedIds, allChapterIds.length, selectedChapters]);

  // Compile Markdown for export
  const compiledMarkdown = useMemo(() => {
    const meta = CAPSTONE_REPORT.metadata;
    let text = '';
    text += `# ${meta.title}\n\n`;
    text += `**${meta.subtitle}**\n\n`;
    text += `| Academic Metadata | Specification |\n|---|---|\n`;
    text += `| **Institution** | ${meta.institution} |\n`;
    text += `| **Course & Program** | ${meta.course} · ${meta.program} |\n`;
    text += `| **Faculty Supervisor** | ${meta.supervisor} |\n`;
    text += `| **Group & Cohort** | ${meta.group} |\n`;
    text += `| **Authors & Student IDs** | ${meta.authors.map((a) => `${a.name} (${a.id})`).join(', ')} |\n`;
    text += `| **Submission Date** | ${meta.date} |\n`;
    text += `| **Audited Cohort** | ${cleanedCount ? fmtK(cleanedCount) : '175.8M'} CIHI NACRS Records |\n\n`;
    text += `---\n\n`;
    selectedChapters.forEach((chapter) => {
      text += `${chapter.markdown}\n\n---\n\n`;
    });
    text += `*End of Capstone Final Report Dossier · Group 5 · University of Niagara Falls Canada*\n`;
    return text;
  }, [selectedChapters, cleanedCount]);

  // Export handler
  const handleExportReport = () => {
    if (selectedFormat === 'PDF') {
      // Print-to-PDF via browser dialog
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setShowSuccessToast('Pop-up blocked. Please allow pop-ups and try again.');
        setTimeout(() => setShowSuccessToast(null), 4000);
        return;
      }
      const sheetEl = document.getElementById('report-preview-sheet');
      const htmlContent = sheetEl ? sheetEl.innerHTML : '';
      printWindow.document.write(`<!DOCTYPE html><html><head>
        <meta charset="utf-8"/>
        <title>${reportName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; font-family: "Times New Roman", Times, serif; }
          .academic-page-sheet {
            page-break-after: always; break-after: page;
            box-shadow: none !important; border: none !important;
            margin: 0 auto; width: 816px;
          }
          @media print {
            @page { size: letter; margin: 0; }
            .academic-page-sheet { page-break-after: always; }
          }
        </style>
      </head><body>${htmlContent}</body></html>`);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
      setShowSuccessToast("Browser print dialog opened! Choose 'Save as PDF'.");
      setTimeout(() => setShowSuccessToast(null), 4000);
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      let blob: Blob;

      if (selectedFormat === 'Markdown') {
        blob = new Blob([compiledMarkdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setShowSuccessToast(`Exported '${reportName}.md' successfully!`);
        setTimeout(() => setShowSuccessToast(null), 4000);
        return;
      }

      if (selectedFormat === 'DOCX') {
        // Generate a basic RTF/DOCX-like HTML-wrapped file
        const meta = CAPSTONE_REPORT.metadata;
        const docHtml = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
          <head><meta charset="utf-8"/>
          <title>${reportName}</title>
          <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View>
          <w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
          <style>
            body { font-family: "Times New Roman", Times, serif; font-size: 12pt; color: #000; margin: 2.54cm; }
            h1 { font-size: 18pt; font-weight: bold; text-align: center; page-break-before: always; }
            h2 { font-size: 14pt; font-weight: bold; }
            h3 { font-size: 12pt; font-weight: bold; }
            p { text-align: justify; line-height: 1.5; margin-bottom: 6pt; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #000; padding: 4pt 6pt; font-size: 10pt; }
            th { font-weight: bold; background: #f0f0f0; }
            @page { size: 8.5in 11in; margin: 1in; }
          </style></head><body>
          <h1 style="page-break-before:avoid;">${meta.title}</h1>
          <p style="text-align:center;"><em>${meta.subtitle}</em></p>
          <br/>
          <table><tr><th>Field</th><th>Value</th></tr>
          <tr><td>Institution</td><td>${meta.institution}</td></tr>
          <tr><td>Course & Program</td><td>${meta.course} · ${meta.program}</td></tr>
          <tr><td>Supervisor</td><td>${meta.supervisor}</td></tr>
          <tr><td>Group</td><td>${meta.group}</td></tr>
          <tr><td>Authors</td><td>${meta.authors.map((a) => `${a.name} (${a.id})`).join(', ')}</td></tr>
          <tr><td>Date</td><td>${meta.date}</td></tr>
          </table>
          ${selectedChapters.map((ch) => {
            // Convert markdown to simple HTML
            const lines = ch.markdown.split('\n');
            return lines.map((line) => {
              if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
              if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
              if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
              if (line.startsWith('---')) return `<hr/>`;
              if (line.trim() === '') return `<br/>`;
              // Bold/italic
              line = line.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
              line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
              return `<p>${line}</p>`;
            }).join('');
          }).join('<br/>')}
          </body></html>`;

        blob = new Blob([docHtml], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setShowSuccessToast(`Exported '${reportName}.docx' successfully!`);
        setTimeout(() => setShowSuccessToast(null), 4000);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-slide-up border border-emerald-500">
          <CheckCircle2 size={18} className="text-white shrink-0" />
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

      {/* Academic Info Banner */}
      <div className="p-3.5 px-4 rounded-xl border border-blue-900/30 bg-blue-950/20 text-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/30 border border-blue-800/40">
            <Building2 size={15} className="text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 text-[10px] block">Institution</span>
              <span className="font-bold text-white">University of Niagara Falls Canada</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/30 border border-blue-800/40">
            <GraduationCap size={15} className="text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 text-[10px] block">Degree & Course</span>
              <span className="font-bold text-white">MDA · DAMO 699</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/30 border border-blue-800/40">
            <User size={15} className="text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 text-[10px] block">Research Team</span>
              <span className="font-bold text-white">Group 5 (Rajbharath, Sufyaan, Amit)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/30 border border-blue-800/40">
            <ShieldCheck size={15} className="text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 text-[10px] block">Supervisor</span>
              <span className="font-bold text-amber-300">Dr. Bilal El Toufaili</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─────────── Left Panel: Config & Chapter Filter ─────────── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Export Configuration */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders size={15} className="text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Export Settings
              </h3>
            </div>

            {/* File name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                File Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Format selector — DOCX / PDF / MD only */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['PDF', 'DOCX', 'Markdown'] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                      selectedFormat === fmt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#131f37] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {fmt === 'Markdown' ? 'MD' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Single Download As button */}
            <button
              onClick={handleExportReport}
              disabled={isExporting || selectedIds.length === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Preparing…</span>
                </>
              ) : (
                <>
                  <Download size={13} />
                  <span>
                    Download as {selectedFormat === 'Markdown' ? '.md' : `.${selectedFormat.toLowerCase()}`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Chapter Filter */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Chapter Filter
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                {selectedIds.length}/{allChapterIds.length}
              </span>
            </div>

            {/* Quick select */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition cursor-pointer"
              >
                All
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition cursor-pointer"
              >
                None
              </button>
            </div>

            {/* Chapter list */}
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-0.5">
              {CAPSTONE_REPORT.chapters.map((chapter) => {
                const isChecked = selectedIds.includes(chapter.id);
                const matchNav = chaptersNav.find(
                  (cn) =>
                    chapter.title.toLowerCase().includes(cn.name.toLowerCase()) ||
                    cn.name.toLowerCase().includes(chapter.shortTitle.toLowerCase())
                );

                return (
                  <div
                    key={chapter.id}
                    onClick={() => toggleChapter(chapter.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition cursor-pointer ${
                      isChecked
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60'
                        : 'bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate text-[11px]">
                          <span className="text-[9px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 mr-1">
                            {chapter.id === 'exec-summary'
                              ? 'EXEC'
                              : chapter.id.startsWith('app')
                              ? chapter.id.toUpperCase()
                              : `CH${chapter.number}`}
                          </span>
                          {chapter.shortTitle}
                        </div>
                        {matchNav && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            p. {matchNav.startPage}
                          </div>
                        )}
                      </div>
                    </div>
                    {matchNav && (
                      <ChevronRight size={12} className="text-slate-400 shrink-0 ml-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Academic integrity note */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-start gap-1.5">
              <ShieldCheck size={11} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>
                DAMO 699 Final Report · University of Niagara Falls Canada · Supervisor: Dr. Bilal El Toufaili
              </span>
            </div>
          </div>
        </div>

        {/* ─────────── Right Panel: Continuous Document Pages ─────────── */}
        <div className="lg:col-span-9 space-y-3">

          {/* Toolbar: page count info */}
          <div className="p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <BookOpen size={14} className="text-blue-500" />
              <span className="font-semibold text-slate-800 dark:text-white">
                {visiblePages.length}
              </span>
              <span>of {totalPages} pages displayed</span>
              {selectedIds.length < allChapterIds.length && (
                <span className="ml-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-semibold text-[10px] border border-amber-200 dark:border-amber-800">
                  {allChapterIds.length - selectedIds.length} chapter(s) filtered out
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <FileText size={12} />
              <span>{selectedChapters.reduce((s, c) => s + (c.wordCount || 0), 0).toLocaleString()} words</span>
            </div>
          </div>

          {/* Reading Canvas — Continuous Sheets */}
          <div
            ref={containerRef}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-[#d1d5db] dark:bg-[#070b16] p-6 md:p-10 overflow-y-auto flex flex-col items-center shadow-inner select-text"
            style={{ minHeight: '860px', maxHeight: '90vh' }}
          >
            {/* Print target */}
            <div id="report-preview-sheet" className="w-full flex flex-col items-center">

              {/* Print styles */}
              <style>{`
                @media print {
                  body * { visibility: hidden !important; }
                  #report-preview-sheet, #report-preview-sheet * { visibility: visible !important; }
                  #report-preview-sheet {
                    position: absolute !important;
                    left: 0 !important; top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important; padding: 0 !important;
                    background: #fff !important;
                  }
                  .academic-page-sheet {
                    page-break-after: always !important;
                    break-after: page !important;
                    box-shadow: none !important;
                    border: none !important;
                    margin: 0 auto !important;
                    width: 100% !important;
                    min-height: 100vh !important;
                  }
                }
              `}</style>

              {/* Continuous pages stack */}
              <div className="space-y-8 py-2 w-full flex flex-col items-center">
                {visiblePages.length === 0 ? (
                  <div className="text-slate-400 dark:text-slate-600 text-sm py-20 text-center">
                    <Filter size={32} className="mx-auto mb-3 opacity-40" />
                    <p>No chapters selected. Use the filter panel to select chapters.</p>
                  </div>
                ) : (
                  visiblePages.map((page) => (
                    <AcademicPageSheet
                      key={page.pageNumber}
                      page={page}
                      totalPages={totalPages}
                      zoom={100}
                      searchQuery=""
                    />
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
