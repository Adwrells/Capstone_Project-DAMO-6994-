import React from 'react';
import { Moon, Sun, Database, Activity, RefreshCw } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
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
  return (
    <div className="space-y-4">
      <PageHeader
        category="EXECUTIVE INTELLIGENCE · STAGE 5"
        title="Emergency Department Analytics Dashboard"
        subtitle="Operational and clinical modeling of emergency department wait times, triage acuity stratification, and longitudinal resource burden (CIHI NACRS)."
        contextPills={[
          { label: 'Dataset', value: datasetName || 'CIHI NACRS Aggregate', variant: 'blue' },
          { label: 'Active Scope', value: `${fmtNum(filteredCount)} / ${fmtNum(totalCount)} records`, variant: 'default' },
          { label: 'Attributes', value: `${fieldCount} columns`, variant: 'default' },
          { label: 'Engine', value: 'Live SQLite Analytical Engine', variant: 'success' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] text-xs font-semibold bg-white dark:bg-[#162040] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a2850] transition-colors cursor-pointer shadow-xs"
              title="Toggle color theme"
            >
              {isDarkMode ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-indigo-600" />}
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        }
      />
    </div>
  );
}
