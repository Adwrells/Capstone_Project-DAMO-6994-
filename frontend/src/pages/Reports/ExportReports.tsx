/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reports & Export Page - Executive Academic Dossier Studio
 * Features authentic page-by-page document viewer, justified content,
 * Microsoft Word typography, running headers/footers, and multi-format exports.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShieldCheck, Printer, Download, Check, RefreshCw, Sliders, Eye,
  Database, FileSpreadsheet, Sparkles, FileDown, BookOpen,
  Copy, Search, CheckCircle2, GraduationCap, Building2, User,
  FileCode, Layers, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  ZoomIn, ZoomOut, Maximize2, FileText, CheckSquare
} from 'lucide-react';
import { printPanelAsPdf } from '../../utils/printToPdf';
import PageHeader from '../../components/common/PageHeader';
import { fmtK } from '../../utils/formatters';
import { CAPSTONE_REPORT } from './capstoneReportData';
import { PAGINATED_REPORT_DATA, ReportPage, ChapterNav } from './paginatedReportData';
import AcademicPageSheet from './AcademicPageSheet';
import ReportContentRenderer from './ReportContentRenderer';

interface ExportReportsProps {
  datasetName: string;
  cleanedCount: number;
  qualityScore: number;
  fields?: any[];
  aiAnalysisText?: string | null;
  rawData?: any[];
  isDarkMode?: boolean;
}

export default function ExportReports({
  datasetName,
  cleanedCount,
  qualityScore,
  rawData,
  isDarkMode = false,
}: ExportReportsProps) {
  const [reportName, setReportName] = useState<string>("University_of_Niagara_Falls_Capstone_Final_Report_Group5");
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'Markdown' | 'CSV' | 'JSON'>('PDF');
  
  // Chapter selection state (default: all chapters selected)
  const allChapterIds = useMemo(() => CAPSTONE_REPORT.chapters.map((c) => c.id), []);
  const [selectedIds, setSelectedIds] = useState<string[]>(allChapterIds);
  
  // View mode: 'pages' (Single Page) or 'continuous' (Continuous Pages Stack)
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('single');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);

  // Reader tools: Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Action status states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = PAGINATED_REPORT_DATA.totalPages;
  const chaptersNav = PAGINATED_REPORT_DATA.chapters;

  // Quick selection helpers
  const handleSelectAll = () => setSelectedIds(allChapterIds);
  const handleSelectCore = () =>
    setSelectedIds(allChapterIds.filter((id) => id.startsWith('ch') || id === 'exec-summary'));
  const handleSelectExecOnly = () => setSelectedIds(['exec-summary']);
  const handleClearSelection = () => setSelectedIds([]);

  const toggleChapter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selected chapters list from CAPSTONE_REPORT
  const selectedChapters = useMemo(() => {
    return CAPSTONE_REPORT.chapters.filter((c) => selectedIds.includes(c.id));
  }, [selectedIds]);

  // Filter paginated pages according to selected chapters
  const visiblePages = useMemo(() => {
    if (selectedIds.length === allChapterIds.length) {
      return PAGINATED_REPORT_DATA.pages;
    }
    // Map selected chapter names/ids
    return PAGINATED_REPORT_DATA.pages.filter((p) => {
      if (p.isCover) return true;
      const chName = p.chapter.toLowerCase();
      return selectedChapters.some(
        (sc) =>
          chName.includes(sc.shortTitle.toLowerCase()) ||
          sc.title.toLowerCase().includes(chName) ||
          (p.chapter === 'Executive Summary' && sc.id === 'exec-summary') ||
          (p.chapter === 'Table of Contents') ||
          (p.chapter.startsWith('Appendix') && sc.id.startsWith('app'))
      );
    });
  }, [selectedIds, allChapterIds.length, selectedChapters]);

  // Current active page object
  const activePageObj = useMemo(() => {
    return PAGINATED_REPORT_DATA.pages.find((p) => p.pageNumber === currentPage) || PAGINATED_REPORT_DATA.pages[0];
  }, [currentPage]);

  // Word count and stats
  const stats = useMemo(() => {
    let words = 0;
    let tables = 0;
    selectedChapters.forEach((c) => {
      words += c.wordCount || 0;
      const tCount = (c.markdown.match(/\| ---/g) || []).length;
      tables += tCount;
    });
    return { words, tables };
  }, [selectedChapters]);

  // Count search query matches across all pages
  const searchMatchCount = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return 0;
    const q = searchQuery.toLowerCase();
    let count = 0;
    PAGINATED_REPORT_DATA.pages.forEach((p) => {
      p.elements.forEach((el) => {
        if (el.type === 'p' && el.text.toLowerCase().includes(q)) {
          count++;
        }
      });
    });
    return count;
  }, [searchQuery]);

  // Jump to specific chapter
  const handleJumpToChapter = (startPage: number) => {
    setCurrentPage(startPage);
    if (viewMode === 'continuous') {
      const el = document.getElementById(`report-page-${startPage}`);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll to active page in continuous view
  useEffect(() => {
    if (viewMode === 'continuous') {
      const el = document.getElementById(`report-page-${currentPage}`);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage, viewMode]);

  // Generate dynamic Markdown report content based on selections
  const compiledMarkdown = useMemo(() => {
    const meta = CAPSTONE_REPORT.metadata;
    let text = "";

    // Official Title Page Header
    text += `# ${meta.title}\n\n`;
    text += `**${meta.subtitle}**\n\n`;
    text += `| Academic Metadata | Specification |\n|---|---|\n`;
    text += `| **Institution** | ${meta.institution} |\n`;
    text += `| **Course & Program** | ${meta.course} · ${meta.program} |\n`;
    text += `| **Faculty Supervisor** | ${meta.supervisor} |\n`;
    text += `| **Group & Cohort** | ${meta.group} |\n`;
    text += `| **Authors & Student IDs** | ${meta.authors.map((a) => `${a.name} (${a.id})`).join(', ')} |\n`;
    text += `| **Submission Date** | ${meta.date} |\n`;
    text += `| **Audited Cohort** | ${cleanedCount ? fmtK(cleanedCount) : '175.8M'} CIHI NACRS Records |\n`;
    text += `| **Ethical Exemption** | Tri-Council Policy Statement (TCPS 2) Art. 2.2 / Grade AAA |\n\n`;
    text += `---\n\n`;

    // Append each selected chapter
    selectedChapters.forEach((chapter) => {
      text += `${chapter.markdown}\n\n---\n\n`;
    });

    text += `*End of Capstone Final Report Dossier · Group 5 · University of Niagara Falls Canada*\n`;
    return text;
  }, [selectedChapters, cleanedCount]);

  // Execute export action
  const handleExportReport = () => {
    if (selectedFormat === 'PDF') {
      printPanelAsPdf('report-preview-sheet', reportName);
      setShowSuccessToast("Browser print dialog opened! Choose 'Save as PDF' to generate the official document.");
      setTimeout(() => setShowSuccessToast(null), 4000);
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      let blobType = "text/plain;charset=utf-8;";
      let extension = "txt";
      let payload = compiledMarkdown;

      if (selectedFormat === 'Markdown') {
        blobType = "text/markdown;charset=utf-8;";
        extension = "md";
      } else if (selectedFormat === 'CSV') {
        blobType = "text/csv;charset=utf-8;";
        extension = "csv";
        if (rawData && rawData.length > 0) {
          const headers = Object.keys(rawData[0]);
          let csv = headers.join(",") + "\n";
          rawData.forEach((row) => {
            csv += headers
              .map((h) => {
                let cell = String(row[h] || "");
                if (cell.includes(",") || cell.includes("\n") || cell.includes('"')) {
                  cell = `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
              })
              .join(",") + "\n";
          });
          payload = csv;
        } else {
          payload = "Section,Chapter,Table_Title,Metric_Type,Status\n";
          selectedChapters.forEach((c) => {
            payload += `"${c.id}","${c.title}","${c.shortTitle}","${c.wordCount} words","Validated"\n`;
          });
        }
      } else if (selectedFormat === 'JSON') {
        blobType = "application/json;charset=utf-8;";
        extension = "json";
        payload = JSON.stringify(
          {
            metadata: CAPSTONE_REPORT.metadata,
            totalPages: PAGINATED_REPORT_DATA.totalPages,
            selectedChapters: selectedChapters.map((c) => ({
              id: c.id,
              number: c.number,
              title: c.title,
              wordCount: c.wordCount,
              markdown: c.markdown,
            })),
            generatedAt: new Date().toISOString(),
          },
          null,
          2
        );
      }

      const blob = new Blob([payload], { type: blobType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setShowSuccessToast(`Exported '${reportName}.${extension}' successfully!`);
      setTimeout(() => setShowSuccessToast(null), 4000);
    }, 600);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(compiledMarkdown);
    setShowSuccessToast("Complete Dossier Markdown copied to clipboard!");
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
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

      {/* Official Academic Banner */}
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
        
        {/* Left Column: Dossier Configuration (4-cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm text-left space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Dossier Configuration
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                {selectedChapters.length} of {allChapterIds.length} Selected
              </span>
            </div>

            {/* Export File Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Export File Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Target Export Format */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Export Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="PDF">PDF Document (Formatted Publication Sheet)</option>
                <option value="Markdown">Academic Markdown (.md)</option>
                <option value="CSV">Statistical Tables CSV (.csv)</option>
                <option value="JSON">Structured Metadata JSON (.json)</option>
              </select>
            </div>

            {/* Chapter Selection Header & Quick Filters */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Report Chapters & Appendices
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {fmtK(stats.words)} words · {stats.tables} tables
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
                >
                  All 14
                </button>
                <button
                  type="button"
                  onClick={handleSelectCore}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
                >
                  Core (1–9)
                </button>
                <button
                  type="button"
                  onClick={handleSelectExecOnly}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
                >
                  Summary
                </button>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* Scrollable Chapter List */}
              <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1 border border-slate-100 dark:border-slate-800/80 p-1.5 rounded-xl bg-slate-50/50 dark:bg-[#0b1322]">
                {CAPSTONE_REPORT.chapters.map((chapter) => {
                  const isChecked = selectedIds.includes(chapter.id);
                  // Find corresponding starting page
                  const matchNav = chaptersNav.find((cn) =>
                    chapter.title.toLowerCase().includes(cn.name.toLowerCase()) ||
                    cn.name.toLowerCase().includes(chapter.shortTitle.toLowerCase())
                  );

                  return (
                    <div
                      key={chapter.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs transition cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60'
                          : 'bg-white dark:bg-[#101b31]/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                      onClick={() => toggleChapter(chapter.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">
                            <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 mr-1.5">
                              {chapter.id === 'exec-summary'
                                ? 'EXEC'
                                : chapter.id.startsWith('app')
                                ? chapter.id.toUpperCase()
                                : `CH ${chapter.number}`}
                            </span>
                            {chapter.shortTitle}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans truncate">
                            {chapter.wordCount} words · {matchNav ? `p. ${matchNav.startPage}` : 'Section'}
                          </div>
                        </div>
                      </div>

                      {matchNav && (
                        <button
                          type="button"
                          title={`Jump to page ${matchNav.startPage}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJumpToChapter(matchNav.startPage);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 transition"
                        >
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export and Print Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleExportReport}
                disabled={isExporting || selectedIds.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Compiling Report...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>
                      {selectedFormat === 'PDF'
                        ? 'Generate Official PDF Dossier'
                        : `Export as .${selectedFormat.toLowerCase()}`}
                    </span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => printPanelAsPdf('report-preview-sheet', reportName)}
                  disabled={selectedIds.length === 0}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer bg-slate-50/50 dark:bg-[#131f37]/70"
                >
                  <Printer size={13} />
                  <span>Direct Print</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer bg-slate-50/50 dark:bg-[#131f37]/70"
                >
                  <Copy size={13} />
                  <span>Copy Markdown</span>
                </button>
              </div>
            </div>
          </div>

          {/* Academic Integrity & Ethics Card */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#131f37]/40 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Academic Integrity & Governance</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              This dossier represents the completed Final Report for <strong>DAMO 699</strong> at the <strong>University of Niagara Falls Canada</strong>. Formatted strictly as academic pages per the uploaded Word document.
            </p>
            <div className="pt-1 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
              <span>Supervisor: Dr. Bilal El Toufaili</span>
              <span>Group 5 · Sept 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Page Document Viewer (8-cols) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Executive Document Toolbar */}
          <div className="p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Left: View Mode Tabs & Navigation */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-[#131f37] p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'single'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText size={13} />
                  <span>Single Page</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('continuous')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'continuous'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>Continuous Sheets</span>
                </button>
              </div>

              {/* Page Flipping Controls */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#131f37] px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <button
                  type="button"
                  title="First Page"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1 rounded text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  type="button"
                  title="Previous Page"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="flex items-center gap-1 font-mono text-[11px] px-1 font-semibold text-slate-800 dark:text-white">
                  <span>Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                      }
                    }}
                    className="w-10 text-center py-0.5 rounded bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold focus:outline-hidden"
                  />
                  <span>of {totalPages}</span>
                </div>

                <button
                  type="button"
                  title="Next Page"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  title="Last Page"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1 rounded text-slate-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>

            {/* Center: Jump to Section Dropdown */}
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-slate-400 shrink-0" />
              <select
                value={activePageObj.chapter}
                onChange={(e) => {
                  const targetCh = chaptersNav.find((cn) => cn.name === e.target.value);
                  if (targetCh) {
                    handleJumpToChapter(targetCh.startPage);
                  }
                }}
                className="py-1 px-2 rounded-lg bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-white max-w-[210px] truncate focus:outline-hidden cursor-pointer"
              >
                {chaptersNav.map((cn) => (
                  <option key={cn.id} value={cn.name}>
                    p. {cn.startPage} — {cn.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: Search & Zoom Controls */}
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in doc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-28 sm:w-36 pl-7 pr-2 py-1 rounded-lg bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-700 text-[11px] text-slate-800 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
                {searchMatchCount > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-amber-200 text-slate-900 px-1 rounded-full">
                    {searchMatchCount}
                  </span>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-50 dark:bg-[#131f37] rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  title="Zoom Out"
                  disabled={zoom <= 75}
                  onClick={() => setZoom((z) => Math.max(75, z - 10))}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[10px] font-mono px-1.5 font-bold">{zoom}%</span>
                <button
                  type="button"
                  title="Zoom In"
                  disabled={zoom >= 125}
                  onClick={() => setZoom((z) => Math.min(125, z + 10))}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ZoomIn size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Reading Desk Canvas — Authentic Document Paper Sheets */}
          <div
            ref={containerRef}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-[#e2e8f0]/80 dark:bg-[#070b16] p-4 md:p-8 min-h-[840px] max-h-[860px] overflow-y-auto flex flex-col items-center shadow-inner select-text transition-colors"
          >
            {/* Print Target Sheet Container */}
            <div id="report-preview-sheet" className="w-full flex flex-col items-center">
              
              {/* Print Only Styles */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #report-preview-sheet, #report-preview-sheet * {
                    visibility: visible !important;
                  }
                  #report-preview-sheet {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #ffffff !important;
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

              {viewMode === 'single' ? (
                // Single Page Mode: Focused Page View
                <div className="py-2 animate-fade-in">
                  <AcademicPageSheet
                    page={activePageObj}
                    totalPages={totalPages}
                    zoom={zoom}
                    searchQuery={searchQuery}
                  />
                </div>
              ) : (
                // Continuous Sheets Mode: Realistic Stack of Academic Pages
                <div className="space-y-8 py-2 w-full flex flex-col items-center">
                  {visiblePages.map((page) => (
                    <AcademicPageSheet
                      key={page.pageNumber}
                      page={page}
                      totalPages={totalPages}
                      zoom={zoom}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
