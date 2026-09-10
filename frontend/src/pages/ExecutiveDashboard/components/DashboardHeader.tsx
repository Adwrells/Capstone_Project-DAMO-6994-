import React from 'react';
import { Database, Activity, RefreshCw, ShieldCheck } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import { fmtK, fmtNum } from './formatters';

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
        align="center"
        badgeIcon={<Activity size={12} className="text-blue-500 dark:text-blue-400" />}
        category="EXECUTIVE INTELLIGENCE · STAGE 5"
        title="Emergency Department Analytics Dashboard"
        subtitle="Operational and clinical modeling of emergency department wait times, triage acuity stratification, and longitudinal resource burden (CIHI NACRS)."
        contextPills={[
          { label: 'Dataset', value: datasetName || 'CIHI NACRS Aggregate', icon: <Database size={13} className="text-blue-500 dark:text-blue-400" />, variant: 'blue' },
          { label: 'Active Scope', value: `${fmtK(filteredCount)} / ${fmtK(totalCount)} records`, icon: <Activity size={13} className="text-slate-500 dark:text-slate-400" />, variant: 'default' },
          { label: 'Attributes', value: `${fieldCount} columns`, icon: <RefreshCw size={13} className="text-amber-500 dark:text-amber-400" />, variant: 'amber' },
          { label: 'Engine', value: 'Live SQLite Analytical Engine', icon: <ShieldCheck size={13} className="text-emerald-500 dark:text-emerald-400" />, variant: 'success' },
        ]}
      />
    </div>
  );
}
