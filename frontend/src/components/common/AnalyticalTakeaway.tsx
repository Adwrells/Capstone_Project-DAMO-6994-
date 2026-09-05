/**
 * AnalyticalTakeaway — Standardized bottom-of-chart / section insight panel
 * Displays amber or themed left border with clear executive takeaway copy.
 */
import React from 'react';
import { Lightbulb, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AnalyticalTakeawayProps {
  title?: string;
  variant?: 'warning' | 'info' | 'success' | 'amber';
  children: React.ReactNode;
  className?: string;
}

export default function AnalyticalTakeaway({
  title = 'ANALYTICAL TAKEAWAY',
  variant = 'amber',
  children,
  className = '',
}: AnalyticalTakeawayProps) {
  const borderColors: Record<string, string> = {
    amber: 'border-l-amber-500 bg-amber-500/[0.06] text-amber-900 dark:text-amber-100',
    warning: 'border-l-amber-500 bg-amber-500/[0.06] text-amber-900 dark:text-amber-100',
    info: 'border-l-blue-500 bg-blue-500/[0.06] text-blue-900 dark:text-blue-100',
    success: 'border-l-emerald-500 bg-emerald-500/[0.06] text-emerald-900 dark:text-emerald-100',
  };

  const labelColors: Record<string, string> = {
    amber: 'text-amber-600 dark:text-amber-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-emerald-600 dark:text-emerald-400',
  };

  const IconComponent = variant === 'success' ? CheckCircle2 : variant === 'info' ? Info : Lightbulb;

  return (
    <div
      className={`rounded-r-lg border-l-3 p-3.5 text-xs leading-relaxed transition-all ${
        borderColors[variant] || borderColors.amber
      } ${className}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${labelColors[variant] || labelColors.amber}`} />
        <span className={`text-[10px] font-bold tracking-wider uppercase font-mono ${labelColors[variant] || labelColors.amber}`}>
          {title}
        </span>
      </div>
      <div className="text-slate-600 dark:text-slate-300 font-sans">
        {children}
      </div>
    </div>
  );
}
