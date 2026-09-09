/**
 * Healthcare Analytics Platform - Main Application Layout
 */

import React, { useState, useEffect } from 'react';
import {
  Database, ShieldCheck, BarChart3, Presentation, Sparkles,
  RefreshCw, CheckCircle2, ChevronLeft, HelpCircle, FileDown,
  Menu, X, User, Moon, Sun, Activity, AlertTriangle, PlaySquare, ArrowRight
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
import { fetchPreloadedDatasets, fetchAnalyzeDataset } from './services/apiService';

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
  const [currentSection, setCurrentSection] = useState<SectionType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get('stage') as SectionType;
      if (stageParam && STAGES.some(s => s.key === stageParam)) {
        return stageParam;
      }
    }
    return 'about';
  });

  // Preloaded capstone datasets
  const [preloadedDatasets, setPreloadedDatasets] = useState<PreloadedDataset[]>([]);
  const [preloadStatus, setPreloadStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Theme & Sidebar State — persistent light/dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get('theme');
      if (themeParam === 'light') return false;
      if (themeParam === 'dark') return true;
      const stored = localStorage.getItem('theme');
      if (stored === 'light') return false;
      if (stored === 'dark') return true;
    }
    return false;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Synchronize documentElement theme attributes and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [isDarkMode]);

  // Modern Toast notification state
  const [notification, setNotification] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  // Validation warning modal state
  const [showValidationWarningModal, setShowValidationWarningModal] = useState<boolean>(false);

  const datasetNameRef = React.useRef<string | null>(null);
  React.useEffect(() => { datasetNameRef.current = datasetName; }, [datasetName]);

  // PRELOAD DEFAULT CLINICAL DATASETS ON MOUNT
  useEffect(() => {
    if (preloadStatus !== 'idle') return;
    setPreloadStatus('loading');

    fetchPreloadedDatasets()
      .then(json => {
        if (json.success && Array.isArray(json.datasets)) {
          setPreloadedDatasets(json.datasets as PreloadedDataset[]);
          setPreloadStatus('loaded');

          const successDatasets = (json.datasets as PreloadedDataset[]).filter(
            (d: PreloadedDataset) => d.loadStatus === 'success' && d.data.length > 0
          );
          if (successDatasets.length > 0 && !datasetNameRef.current) {
            const primary = successDatasets.find(
              (d: PreloadedDataset) => d.key === 'ED_Visits' || d.sheetName === 'ED_Visits' || d.name.toLowerCase().includes('ed visit')
            ) || successDatasets[0];
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

    triggerAIAnalysis(name, cols, data, stats);
  };

  const handleSelectActiveCohort = (name: string, cols: any[], data: any[]) => {
    setDatasetName(name);
    setFields(cols);
    setRawData(data);
    setCleanedData(data);
    const initialSemantic = buildSemanticModel(cols);
    setSemanticFields(initialSemantic);
    setNotification({
      text: `Active analysis cohort updated to "${name}" (${data.length} records).`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const triggerAIAnalysis = async (rawName: string, cols: any[], rowsData: any[], statsObj: DatasetStats) => {
    setAiIsLoading(true);
    try {
      const result = await fetchAnalyzeDataset({
        datasetName: rawName,
        rowCount: rowsData.length,
        colCount: cols.length,
        stats: statsObj,
        columns: cols,
        sampleRows: rowsData.slice(0, 10)
      });
      if (result.success && result.analysis) {
        setAiAnalysis(result.analysis);
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
    if (currentIndex === 1 && !cleaningSummary) {
      setShowValidationWarningModal(true);
      return;
    }
    if (currentIndex < STAGES.length - 1) {
      setCurrentSection(STAGES[currentIndex + 1].key);
    }
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-[#080E1C] text-slate-100' : 'bg-[#F1F5FB] text-[#0F172A]'
      }`} id="data-pilot-root">
      {/* Skip to content — WCAG 2.2 AA */}
      <a
        href="#main-workspace-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-[#2563EB] focus:font-semibold focus:px-3 focus:py-1.5 focus:rounded-lg focus:border focus:border-[#2563EB] focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Mobile nav backdrop — dismisses the drawer, sits below the sidebar's z-40 */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-[35] bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ══ ENTERPRISE SIDEBAR ══════════════════════════════════════ */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`flex flex-col transition-all duration-300 z-40 fixed inset-y-0 left-0 md:sticky md:top-0 md:h-screen md:self-start ${
          isSidebarCollapsed ? 'w-[72px]' : 'w-64'
        } ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl ${
          isDarkMode
            ? 'bg-[#080E1C] text-slate-300 border-r border-white/[0.06]'
            : 'bg-white text-slate-700 border-r border-slate-200'
        }`}
        id="enterprise-sidebar"
      >
        {/* Brand Header */}
        <div className={`h-[60px] px-4 flex items-center justify-between shrink-0 border-b ${
          isDarkMode ? 'border-white/[0.06]' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden select-none cursor-default">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#0891B2] flex items-center justify-center text-white shrink-0 shadow-md">
              <Activity size={17} strokeWidth={2.5} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className={`font-extrabold text-[12.5px] tracking-tight leading-none ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>ED Analytics</span>
                <span className={`text-[9.5px] font-medium tracking-wider leading-tight mt-0.5 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>DAMO-6994 Capstone</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (window.matchMedia('(max-width: 767px)').matches) {
                setIsMobileNavOpen(false);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDarkMode
                ? 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isMobileNavOpen ? <X size={16} className="md:hidden" /> : null}
            <Menu size={16} className={isMobileNavOpen ? 'hidden md:block' : ''} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={`px-4 py-3 shrink-0 border-b ${
          isDarkMode ? 'border-white/[0.04]' : 'border-slate-100'
        }`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[10px] mb-2 font-semibold">
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Analysis Pipeline</span>
              <span className={isDarkMode ? 'text-[#60A5FA]' : 'text-[#2563EB]'} style={{fontWeight:700}}>{progressPercent}%</span>
            </div>
          )}
          <div className={`w-full h-[4px] rounded-full overflow-hidden ${
            isDarkMode ? 'bg-white/[0.08]' : 'bg-slate-200'
          }`}>
            <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#22D3EE] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto" aria-label="Workflow stages">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = stage.key === currentSection;
            const isCompleted = STAGES.findIndex(s => s.key === currentSection) > idx;

            return (
              <div
                key={stage.key}
                aria-current={isActive ? 'step' : undefined}
                title={isSidebarCollapsed ? stage.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl font-medium text-[13px] transition-all duration-150 relative text-left select-none cursor-default ${
                  isSidebarCollapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? isDarkMode
                      ? 'bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/25'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                    : isCompleted
                    ? isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    : isDarkMode
                      ? 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isActive && !isSidebarCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#3B82F6]" />
                )}
                <Icon
                  size={17}
                  className={`shrink-0 ${
                    isActive
                      ? isDarkMode ? 'text-[#60A5FA]' : 'text-blue-600'
                      : isCompleted
                      ? isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      : isDarkMode ? 'text-slate-600' : 'text-slate-400'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate text-left flex-1 text-[12.5px]">{stage.label}</span>
                )}
                {!isSidebarCollapsed && isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isDarkMode ? 'bg-[#60A5FA]' : 'bg-blue-500'
                  }`} />
                )}
                {!isSidebarCollapsed && isCompleted && (
                  <CheckCircle2 size={12} className="shrink-0 text-emerald-500/60" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-3 shrink-0 border-t ${
          isDarkMode
            ? 'border-white/[0.06] bg-black/20'
            : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center text-[9px] font-extrabold shrink-0">
              HA
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className={`text-[11.5px] font-semibold truncate ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>Enterprise Workspace</span>
                <span className={`text-[9.5px] truncate ${
                  isDarkMode ? 'text-slate-600' : 'text-slate-400'
                }`}>CIHI NACRS Analytics</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* ══ STICKY TOP NAVBAR ══════════════════════════════════════ */}
        <header
          role="banner"
          className={`h-[52px] px-5 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md shrink-0 ${
            isDarkMode
              ? 'bg-[#0D1528] border-b border-white/[0.06]'
              : 'bg-white border-b border-slate-200'
          }`}
        >
          {/* Left: Mobile toggle + Back */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className={`md:hidden p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Open navigation"
              aria-label="Open navigation menu"
            >
              <Menu size={15} />
            </button>
            <button
              onClick={handlePreviousStage}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11.5px] font-semibold transition-all ${
                currentIndex === 0
                  ? isDarkMode
                    ? 'opacity-30 cursor-not-allowed border-white/10 text-slate-500'
                    : 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
                  : isDarkMode
                    ? 'cursor-pointer border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white hover:border-white/15'
                    : 'cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <ChevronLeft size={13} />
              <span className="hidden sm:inline">{currentIndex > 0 ? STAGES[currentIndex - 1].label : 'Start'}</span>
            </button>
          </div>

          {/* Center: Stage breadcrumb + dataset pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <span className={`font-medium hidden sm:inline ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>Stage {currentIndex + 1}/{STAGES.length}</span>
              <span className={`hidden sm:inline ${
                isDarkMode ? 'text-slate-600' : 'text-slate-300'
              }`}>·</span>
              <span className={`font-semibold ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>{STAGES[currentIndex].label}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9.5px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{getCurrentStatus()}</span>
            </div>
          </div>

          {/* Right: Theme toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
            </button>
          </div>
        </header>

        {/* ══ MAIN WORKSPACE CANVAS ═══════════════════════════════════ */}
        <main
          role="main"
          aria-label={`${STAGES[Math.max(0, currentIndex)]?.label ?? 'Content'} workspace`}
          className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-[1400px] mx-auto w-full space-y-8"
          id="main-workspace-canvas"
        >

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
          onSelectActiveCohort={handleSelectActiveCohort}
          activeDatasetName={datasetName}
          isDarkMode={isDarkMode}
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
          customCharts={customCharts}
          onAddChart={handleAddChart}
          onRemoveChart={handleRemoveChart}
          onNavigateToAnalytics={() => setCurrentSection('analytics')}
          onNavigateNext={handleNextStage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>
    )}

    {currentSection === 'dashboard' && !datasetName && (
      <div className="w-full flex items-center justify-center py-24">
        <div className={`max-w-md text-center p-8 rounded-2xl border ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
        }`}>
          <Presentation size={32} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No dataset loaded</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The Executive Dashboard displays metrics from a cleaned cohort. Load a dataset in the
            Prep &amp; Quality Engine first.
          </p>
          <button
            onClick={() => setCurrentSection('clean')}
            className="mt-5 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Go to Prep &amp; Quality Engine
          </button>
        </div>
      </div>
    )}

    {currentSection === 'insights' && (
      <div className="w-full space-y-6">
        {datasetName ? (
          <ConsultantInsights
            isLoading={aiIsLoading}
            onNavigateNext={handleNextStage}
          />
        ) : (
          <div className="border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-8 text-center space-y-3">
            <p className="text-amber-700 dark:text-amber-400 font-bold text-sm">No Dataset Loaded</p>
            <p className="text-amber-600 dark:text-amber-500 text-xs font-light">Please run the Prep &amp; Quality Engine stage before viewing Strategic Insights.</p>
            <button
              onClick={() => setCurrentSection('clean')}
              className="mt-2 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer select-none group"
            >
              <span>Go to Prep &amp; Quality Engine</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
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
            rawData={cleanedData}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-8 text-center space-y-3">
            <p className="text-amber-700 dark:text-amber-400 font-bold text-sm">No Dataset Loaded</p>
            <p className="text-amber-600 dark:text-amber-500 text-xs font-light">Please run the Prep &amp; Quality Engine stage before generating reports.</p>
            <button
              onClick={() => setCurrentSection('clean')}
              className="mt-2 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer select-none group"
            >
              <span>Go to Prep &amp; Quality Engine</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
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
        <footer className={`py-3 text-center text-[10.5px] border-t ${
          isDarkMode
            ? 'border-white/[0.05] bg-[#080E1C]/80 text-slate-600'
            : 'border-slate-200 bg-slate-50 text-slate-400'
        }`}>
          Canadian ED Analytics Platform · DAMO-6994 · University of Niagara Falls · CIHI NACRS &copy; {new Date().getFullYear()}
        </footer>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 max-w-sm animate-fade-in z-50">
          <div className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border ${
            isDarkMode
              ? 'border-white/[0.08] bg-[#111E35]'
              : 'border-slate-200 bg-white'
          }`}>
            <div className={`w-2 h-2 rounded-full mt-0.5 shrink-0 animate-pulse ${
              notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
            }`} />
            <div className={`flex-1 text-[12px] font-medium leading-relaxed ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {notification.text}
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`text-xs font-bold leading-none mt-0.5 cursor-pointer transition-colors ${
                isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label="Dismiss notification"
            >✕</button>
          </div>
        </div>
      )}

      {/* ── STAGE 2 VALIDATION WARNING POP-UP MODAL ───────────────────────── */}
      {showValidationWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#111c30] border border-amber-300 dark:border-amber-700/80 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-left font-sans animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle size={22} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    Data Validation Required
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Run Preparation Pipeline First
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowValidationWarningModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              <p>
                You cannot advance to <strong className="font-semibold text-slate-800 dark:text-slate-100">Stage 3: Dataset Explorer</strong> without running the automated data preparation and quality validation pipeline.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block font-mono text-[11px] uppercase tracking-wider">
                  Required Pipeline Operations:
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside text-[11px]">
                  <li>Column schema standardization to snake_case</li>
                  <li>Unit harmonization to Total ED-Minutes (TEM)</li>
                  <li>Validation across 5 dimensions (Completeness, Consistency, Validity, Uniqueness, Coverage)</li>
                  <li>Persistence and caching in SQLite analytical store</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowValidationWarningModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel / Stay on Stage 2
              </button>
              <button
                onClick={() => {
                  setShowValidationWarningModal(false);
                  const el = document.getElementById('run-prep-pipeline-btn');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                      (el as HTMLElement).click();
                    }, 400);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlaySquare size={15} />
                <span>Run Data Validation Pipeline Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
