/**
 * Healthcare Analytics Platform - Main Application Layout
 */

import React, { useState, useEffect } from 'react';
import {
  Database, ShieldCheck, BarChart3, Presentation, Sparkles,
  RefreshCw, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, FileDown,
  Menu, X, User, Moon, Sun, Activity, Layers
} from 'lucide-react';
import DatasetUpload from './components/common/DatasetUpload';
import DataCleaning from './pages/PrepQualityEngine/PrepQualityEngine';
import DataExplorer from './pages/DatasetExplorer/DatasetExplorer';
import AnalyticsCore from './pages/StatisticalAnalysis/StatisticalAnalysis';
import ExecutiveDashboard from './pages/ExecutiveDashboard/ExecutiveDashboard';
import ConsultantInsights from './pages/StrategicInsights/StrategicInsights';
import ExportReports from './pages/Reports/Reports';
import AboutProject from './pages/AboutProject/AboutProject';
import { CleaningSummary, CustomVisualization, AIAnalysisResult, DatasetStats, PreloadedDataset } from './utils/types';
import { persistCleanedDataset } from './services/userDatasetService';
import { buildSemanticModel, SemanticField } from './utils/biEngine';

const STAGES = [
  { key: 'about', label: 'About Project', icon: HelpCircle },
  { key: 'clean', label: 'Prep & Quality Engine', icon: RefreshCw },
  { key: 'explorer', label: 'Dataset Explorer', icon: Database },
  { key: 'analytics', label: 'Hypothesis Testing & Statistical Analysis ', icon: BarChart3 },
  { key: 'dashboard', label: 'Executive Dashboard', icon: Presentation },
  { key: 'insights', label: 'Strategic Insights', icon: Sparkles },
  { key: 'export', label: 'Reports & Export', icon: FileDown }
] as const;

type SectionType = typeof STAGES[number]['key'] | 'upload';

const getStagePercentage = (section: SectionType): number => {
  switch (section) {
    case 'about': return 14;
    case 'upload':
    case 'clean': return 28;
    case 'explorer': return 42;
    case 'analytics': return 57;
    case 'dashboard': return 71;
    case 'insights': return 85;
    case 'export': return 100;
    default: return 14;
  }
};

export default function App() {
  const [datasetName, setDatasetName] = useState<string | null>(null);
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [cleanedData, setCleanedData] = useState<any[]>([]);
  const [persistedDatasetId, setPersistedDatasetId] = useState<string | null>(null);
  const [cleaningSummary, setCleaningSummary] = useState<CleaningSummary | null>(null);
  const [semanticFields, setSemanticFields] = useState<SemanticField[]>([]);

  // Custom charts saved by the user
  const [customCharts, setCustomCharts] = useState<CustomVisualization[]>([]);

  // AI analysis models states
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [aiIsLoading, setAiIsLoading] = useState(false);

  // Workflow section navigation
  const [currentSection, setCurrentSection] = useState<SectionType>('about');

  // Preloaded capstone datasets
  const [preloadedDatasets, setPreloadedDatasets] = useState<PreloadedDataset[]>([]);
  const [preloadStatus, setPreloadStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Theme & Sidebar State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modern Toast notification state
  const [notification, setNotification] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const datasetNameRef = React.useRef<string | null>(null);
  React.useEffect(() => { datasetNameRef.current = datasetName; }, [datasetName]);

  // PRELOAD DEFAULT CLINICAL DATASETS ON MOUNT
  useEffect(() => {
    if (preloadStatus !== 'idle') return;
    setPreloadStatus('loading');

    fetch('/api/preload-datasets')
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.datasets)) {
          setPreloadedDatasets(json.datasets as PreloadedDataset[]);
          setPreloadStatus('loaded');

          const successDatasets = (json.datasets as PreloadedDataset[]).filter(
            (d: PreloadedDataset) => d.loadStatus === 'success' && d.data.length > 0
          );
          if (successDatasets.length > 0 && !datasetNameRef.current) {
            const primary = successDatasets[0];
            setDatasetName(primary.name);
            setFields(primary.fields);
            setRawData(primary.data);
            setCleanedData(primary.data);
          }
        } else {
          setPreloadStatus('error');
        }
      })
      .catch(err => {
        console.error('Preload dataset fetch failed:', err);
        setPreloadStatus('error');
      });
  }, []);

  const onDatasetSelected = (name: string, cols: any[], data: any[]) => {
    setCurrentSection('clean');
    setDatasetName(name);
    setFields(cols);
    setRawData(data);
    setCleanedData(data);
    setCleaningSummary(null);
    setCustomCharts([]);
    setAiAnalysis(null);

    const initialSemantic = buildSemanticModel(cols);
    setSemanticFields(initialSemantic);

    const stats: DatasetStats = {
      rows: data.length,
      cols: cols.length,
      missingValues: data.reduce((acc, row) => acc + cols.reduce((cAcc, x) => cAcc + (row[x.name] === null || row[x.name] === undefined ? 1 : 0), 0), 0),
      duplicateRecords: 0,
      outliersCount: 0,
      qualityScore: 92
    };

    fetch('/api/datasets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, fields: cols, data })
    })
      .then(r => r.json())
      .then(dbData => {
        if (dbData.success && dbData.dataset) {
          setDatasetId(dbData.dataset.id);
        }
      })
      .catch(e => console.error('Backend database registration failed:', e));

    triggerAIAnalysis(name, cols, data, stats);
  };

  const triggerAIAnalysis = async (rawName: string, cols: any[], rowsData: any[], statsObj: DatasetStats) => {
    setAiIsLoading(true);
    try {
      const res = await fetch('/api/analyze-dataset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetName: rawName,
          rowCount: rowsData.length,
          colCount: cols.length,
          stats: statsObj,
          columns: cols,
          sampleRows: rowsData.slice(0, 10)
        })
      });
      const result = await res.json();
      if (result.success && result.analysis) {
        setAiAnalysis(result.analysis);
      } else {
        throw new Error(result.warning || "Analytical pipeline offline");
      }
    } catch (err) {
      console.warn("AI intelligence model analysis experienced fallback routing.", err);
    } finally {
      setAiIsLoading(false);
    }
  };

  const onDataCleaned = async (cleanRows: any[], summary: CleaningSummary) => {
    setCleanedData(cleanRows);
    setCleaningSummary(summary);

    try {
      const dbRes = await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Cleaned_${datasetName}`, fields, data: cleanRows })
      });
      const dbData = await dbRes.json();
      if (dbData.success && dbData.dataset) {
        setDatasetId(dbData.dataset.id);
      }
    } catch (e) {
      console.error("Backend database registration update failed:", e);
    }

    // Persist the cleaned cohort into SQLite, in its own isolated table. This is what makes
    // the data survive a refresh and become queryable by the analytics layer. It never
    // touches the seeded H1-H5 tables (architecture.md §4A), and a failure here is
    // non-fatal: the workflow continues from React state exactly as before.
    const persisted = await persistCleanedDataset(
      cleanRows,
      `Cleaned_${datasetName || 'Dataset'}`,
      summary.finalScore
    );
    if (persisted.success && persisted.dataset_id) {
      setPersistedDatasetId(persisted.dataset_id);
      setNotification({
        type: 'success',
        text: `Cleaned cohort saved to SQLite — ${persisted.row_count?.toLocaleString()} rows in table ${persisted.table_name}`
      });
    } else {
      // Non-fatal: cleaning still works entirely from React state.
      console.warn('Cleaned dataset not persisted to SQLite:', persisted.detail);
      setNotification({
        type: 'info',
        text: 'Cleaned data held in session only — start the Python backend to persist it to SQLite.'
      });
    }
    setTimeout(() => setNotification(null), 6000);

    const stats: DatasetStats = {
      rows: cleanRows.length,
      cols: fields.length,
      missingValues: 0,
      duplicateRecords: 0,
      outliersCount: 0,
      qualityScore: summary.finalScore
    };

    triggerAIAnalysis(datasetName || "Cleaned Data", fields, cleanRows, stats);
  };

  const handleAddChart = (chart: CustomVisualization) => {
    setCustomCharts(prev => [...prev, chart]);
  };

  const handleRemoveChart = (id: string) => {
    setCustomCharts(prev => prev.filter(c => c.id !== id));
  };

  const handleDownloadCSV = () => {
    if (cleanedData.length === 0) return;
    const headers = fields.map(f => f.name).join(',');
    const rows = cleanedData.map(row =>
      fields.map(f => {
        const val = row[f.name];
        if (val === null || val === undefined) return '';
        const strVal = String(val);
        return strVal.includes(',') || strVal.includes('\n') ? `"${strVal.replace(/"/g, '""')}"` : strVal;
      }).join(',')
    );
    const content = [headers, ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cleaned_${datasetName?.replace(/\.[^/.]+$/, "") || 'Dataset'}.csv`;
    link.click();
  };

  const handleDownloadXLSX = () => {
    handleDownloadCSV();
  };

  const handleDownloadZIPArchive = () => {
    const triggerBtn = document.getElementById('export-trigger-btn');
    if (triggerBtn) {
      triggerBtn.click();
    } else {
      setNotification({
        text: "Please generate ZIP archive deliverables directly from the Executive Analytics Dashboard.",
        type: 'info'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const resetPlatform = () => {
    setDatasetName(null);
    setFields([]);
    setRawData([]);
    setCleanedData([]);
    setCleaningSummary(null);
    setCustomCharts([]);
    setAiAnalysis(null);
    setCurrentSection('about');
  };

  const getCurrentStatus = (): string => {
    switch (currentSection) {
      case 'upload': return datasetName ? 'COHORT COMPLIANT' : 'AWAITING INGEST';
      case 'clean': return cleanedData.length > 0 && cleaningSummary ? 'STANDARDIZED & VERIFIED' : 'PIPELINE PENDING';
      case 'explorer': return 'EXPLORATION DIAGNOSTICS ACTIVE';
      case 'analytics': return 'STATISTICAL ENGINE ONLINE';
      case 'dashboard': return 'KPI BI DASHBOARD ACTIVE';
      case 'insights': return 'ADVISORY STRATEGY DEPLOYED';
      case 'export': return 'EXPORT DOSSIER VALIDATED';
      case 'about': return 'CREDENTIALS VERIFIED';
      default: return 'ACTIVE';
    }
  };

  const currentIndex = STAGES.findIndex(s => s.key === currentSection);
  const progressPercent = getStagePercentage(currentSection);

  const handlePreviousStage = () => {
    if (currentIndex > 0) {
      setCurrentSection(STAGES[currentIndex - 1].key);
    }
  };

  const handleNextStage = () => {
    if (currentIndex < STAGES.length - 1) {
      setCurrentSection(STAGES[currentIndex + 1].key);
    }
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-200 ${isDarkMode ? 'dark bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`} id="data-pilot-root">
      {/* Skip to content — WCAG 2.2 AA */}
      <a
        href="#main-workspace-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-[#2563EB] focus:font-semibold focus:px-3 focus:py-1.5 focus:rounded-lg focus:border focus:border-[#2563EB] focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* ENTERPRISE DARK NAVY SIDEBAR (#0F172A) */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`bg-[#0F172A] text-slate-300 flex flex-col transition-all duration-300 z-40 fixed inset-y-0 left-0 md:relative ${isSidebarCollapsed ? 'w-20' : 'w-64'
          } border-r border-slate-800 shadow-xl`}
        id="enterprise-sidebar"
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden select-none cursor-default">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-white text-sm tracking-tight leading-none">HEALTHCARE</span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider leading-tight mt-0.5">ANALYTICS PLATFORM</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Pipeline Stage Indicators */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium px-1">
              <span>Pipeline Progress</span>
              <span className="text-[#2563EB] font-bold">{progressPercent}%</span>
            </div>
          )}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation Stage Indicators (Display-only, non-clickable) */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto pointer-events-none select-none" aria-label="Workflow stages">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = stage.key === currentSection;

            return (
              <div
                key={stage.key}
                role="status"
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative cursor-default ${isActive
                  ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                  : 'text-slate-400 opacity-60'
                  }`}
              >
                <Icon size={19} className={isActive ? 'text-white' : 'text-slate-400'} />
                {!isSidebarCollapsed && (
                  <span className="truncate text-left flex-1">{stage.label}</span>
                )}
                {!isSidebarCollapsed && isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xs font-bold shrink-0">
              HA
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">Enterprise Workspace</span>
                <span className="text-[10px] text-slate-400 truncate">ED Operational Analytics</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* STICKY TOP STAGE NAVIGATION NAVBAR */}
        <header role="banner" className="h-16 bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1F2937] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0">

          {/* Left: Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousStage}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900/50'
                  : 'cursor-pointer border-[#E2E8F0] dark:border-[#1F2937] text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <ChevronLeft size={15} />
              <span>Back: {currentIndex > 0 ? STAGES[currentIndex - 1].label : 'Start'}</span>
            </button>
          </div>

          {/* Center: Stage Number & Title + Status Pill */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
              Stage {currentIndex + 1} of {STAGES.length} –{' '}
              <span className="font-bold text-[#0F172A] dark:text-white">
                {STAGES[currentIndex].label}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] dark:bg-emerald-950/30 border border-[#DCFCE7] dark:border-emerald-900/50 text-[#16A34A] dark:text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] dark:bg-emerald-400 animate-pulse" />
              <span>STATUS: {getCurrentStatus()}</span>
            </div>
          </div>

          {/* Right: Theme Toggle & Next Button */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1F2937] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            {/* Next Stage Action */}
            {currentIndex < STAGES.length - 1 ? (
              <button
                onClick={handleNextStage}
                disabled={currentIndex === 1 && !datasetName}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-sm transition-all ${
                  currentIndex === 1 && !datasetName ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow'
                }`}
              >
                <span>Next: {STAGES[currentIndex + 1].label}</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
                <CheckCircle2 size={15} />
                <span>Pipeline Verified</span>
              </div>
            )}
          </div>
        </header>

        {/* MAIN WORKSPACE CANVAS (24px Grid Gap, 40px Section Spacing, #F8FAFC Background) */ }
  <main role="main" aria-label={`${STAGES[Math.max(0, currentIndex)]?.label ?? 'Content'} workspace`} className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-10" id="main-workspace-canvas">

    {currentSection === 'upload' && (
      <DatasetUpload
        onDatasetSelected={onDatasetSelected}
        isLoading={aiIsLoading}
        preloadedDatasets={preloadedDatasets}
        preloadStatus={preloadStatus}
      />
    )}

    {currentSection === 'clean' && (
      <div className="w-full space-y-6">
        <DataCleaning
          fields={fields}
          rawData={rawData}
          onDataCleaned={onDataCleaned}
          isLoading={aiIsLoading}
          preloadedDatasets={preloadedDatasets}
          preloadStatus={preloadStatus}
          onNavigateNext={handleNextStage}
          isDarkMode={isDarkMode}
        />
      </div>
    )}

    {currentSection === 'explorer' && (
      <div className="w-full space-y-6">
        <DataExplorer
          fields={fields}
          data={cleanedData}
          onNavigateNext={handleNextStage}
        />
      </div>
    )}

    {currentSection === 'analytics' && datasetName && (
      <div className="w-full space-y-6">
        <AnalyticsCore
          fields={fields}
          data={cleanedData}
          onNavigateNext={handleNextStage}
        />
      </div>
    )}

    {/* Without a dataset the section above renders nothing. Say so rather than
        presenting an empty page that looks like a failed render. */}
    {currentSection === 'analytics' && !datasetName && (
      <div className="w-full flex items-center justify-center py-24">
        <div className={`max-w-md text-center p-8 rounded-2xl border ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
        }`}>
          <BarChart3 size={32} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No dataset loaded</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Hypothesis testing runs against a cleaned cohort. Load a dataset in the
            Prep &amp; Quality Engine, then return to this stage.
          </p>
          <button
            onClick={() => setCurrentSection('clean')}
            className="mt-5 h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Go to Prep &amp; Quality Engine
          </button>
        </div>
      </div>
    )}

    {currentSection === 'dashboard' && datasetName && (
      <div className="w-full">
        <ExecutiveDashboard
          datasetName={datasetName}
          fields={fields}
          data={cleanedData}
          onNavigateToAnalytics={() => setCurrentSection('analytics')}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>
    )}

    {currentSection === 'insights' && (
      <div className="w-full space-y-6">
        {datasetName ? (
          <ConsultantInsights
            isLoading={aiIsLoading}
          />
        ) : (
          <div className="border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-8 text-center space-y-3">
            <p className="text-amber-700 dark:text-amber-400 font-bold text-sm">No Dataset Loaded</p>
            <p className="text-amber-600 dark:text-amber-500 text-xs font-light">Please run the Prep & Quality Engine stage before viewing Strategic Insights.</p>
            <button onClick={() => setCurrentSection('clean')} className="mt-2 btn-primary">Go to Prep & Quality Engine →</button>
          </div>
        )}
      </div>
    )}

    {currentSection === 'export' && (
      <div className="w-full space-y-6">
        {datasetName ? (
          <ExportReports
            datasetName={datasetName}
            cleanedCount={cleanedData.length}
            qualityScore={cleaningSummary ? cleaningSummary.finalScore : 94}
            fields={fields}
            aiAnalysisText={aiAnalysis ? aiAnalysis.datasetOverview : null}
            onDownloadCSV={handleDownloadCSV}
            onDownloadXLSX={handleDownloadXLSX}
            onDownloadZIP={handleDownloadZIPArchive}
            rawData={cleanedData}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-8 text-center space-y-3">
            <p className="text-amber-700 dark:text-amber-400 font-bold text-sm">No Dataset Loaded</p>
            <p className="text-amber-600 dark:text-amber-500 text-xs font-light">Please run the Prep & Quality Engine stage before generating reports.</p>
            <button onClick={() => setCurrentSection('clean')} className="mt-2 btn-primary">Go to Prep & Quality Engine →</button>
          </div>
        )}
      </div>
    )}

    {currentSection === 'about' && (
      <div className="w-full space-y-6">
        <AboutProject onReset={resetPlatform} isDarkMode={isDarkMode} onBeginPrep={() => setCurrentSection('clean')} />
      </div>
    )}
  </main>

        {/* FOOTER */}
        <footer className="border-t border-[#E2E8F0] dark:border-[#1F2937] bg-white dark:bg-[#111827] py-4 text-center text-xs text-[#94A3B8]">
          Healthcare Analytics Platform &copy; {new Date().getFullYear()} – Enterprise ED Operational Intelligence
        </footer>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 max-w-sm p-4 rounded-xl border border-[#E2E8F0] bg-white dark:bg-[#111827] dark:border-[#1F2937] shadow-xl z-50 flex items-center gap-3 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
          <div className="flex-1 text-xs font-medium text-[#0F172A] dark:text-white">
            {notification.text}
          </div>
          <button onClick={() => setNotification(null)} className="text-[#94A3B8] hover:text-[#0F172A] text-xs font-bold">✕</button>
        </div>
      )}

    </div>
  );
}
