import React, { useEffect, useState } from 'react';
import { Activity, DatabaseZap, Sparkles, BarChart3 } from 'lucide-react';
import { fetchArchitecturePipelineOverview } from '../../services/architectureService';

interface ArchitecturePipelineCardProps {
  isDarkMode?: boolean;
}

export default function ArchitecturePipelineCard({ isDarkMode = false }: ArchitecturePipelineCardProps) {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    fetchArchitecturePipelineOverview()
      .then(setOverview)
      .catch(() => setOverview({ status: 'offline', stages: {} }));
  }, []);

  const stages = overview?.stages || {};

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? 'border-slate-800 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Architecture Status</p>
          <h3 className="text-xl font-semibold">End-to-end pipeline ready</h3>
        </div>
        <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-500">
          <Activity size={18} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          { key: 'cleaning', label: 'Cleaning', icon: DatabaseZap },
          { key: 'processing', label: 'Processing', icon: Sparkles },
          { key: 'visualization', label: 'Visualization', icon: BarChart3 },
        ].map(({ key, label, icon: Icon }) => {
          const stage = stages[key] || {};
          return (
            <div key={key} className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-indigo-500" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stage.description || 'Awaiting backend status'}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">{stage.status || 'pending'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
