import React from 'react';
import { Activity, Moon, Sun, Database, ShieldCheck } from 'lucide-react';
import { fmtNum } from './formatters';

interface DashboardHeaderProps {
  datasetName: string;
  filteredCount: number;
  totalCount: number;
  fieldCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function DashboardHeader({
  datasetName,
  filteredCount,
  totalCount,
  fieldCount,
  isDarkMode,
  onToggleDarkMode,
}: DashboardHeaderProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      {/* Top Clinical Gradient Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0F4C81] via-[#118d95] to-[#2E8B57]" />

      <div className="p-6 text-center space-y-3">
        {/* Capstone Metadata Badges */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          <span
            className={`text-[10px] font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded-md border ${
              dark
                ? 'bg-[#0F4C81]/25 border-[#0F4C81]/50 text-[#3B82F6]'
                : 'bg-[#0F4C81]/10 border-[#0F4C81]/20 text-[#0F4C81]'
            }`}
          >
            DAMO-6994 ▸ Master's Capstone
          </span>

          <span
            className={`text-[10px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              dark
                ? 'bg-[#182640] border-[#1e2d4a] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Database size={11} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            CIHI NACRS Database (SQLite)
          </span>

          <div
            className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-md border ${
              dark
                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <Activity size={12} className="animate-pulse text-emerald-500" />
            <span>Analytical Engine Active</span>
          </div>
        </div>

        {/* Main Title & Executive Subtitle */}
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              dark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Emergency Department Analytics Dashboard
          </h1>
          <p
            className={`text-xs sm:text-sm mt-1 max-w-3xl mx-auto font-normal leading-relaxed ${
              dark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Operational &amp; Clinical Modelling of ED Wait Times, Acuity Stratification, and Resource Burden — University of Niagara Falls
          </p>
        </div>

        {/* Stats Summary & Theme Toggle */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 pt-2">
          <span
            className={`text-[10px] px-3 py-1 rounded-lg border font-semibold ${
              dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Active Scope: <strong className="font-mono text-[#0F4C81] dark:text-[#3B82F6]">{fmtNum(filteredCount)}</strong> / {fmtNum(totalCount)} records
          </span>

          <span
            className={`text-[10px] px-3 py-1 rounded-lg border font-semibold ${
              dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Attributes: <strong className="font-mono">{fieldCount} columns</strong>
          </span>

          <button
            onClick={onToggleDarkMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition shadow-xs ${
              dark
                ? 'bg-[#182640] border-[#1e2d4a] text-amber-300 hover:bg-[#1c2c49]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle theme mode"
          >
            {dark ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-indigo-600" />}
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
