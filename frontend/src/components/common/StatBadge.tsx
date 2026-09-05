/**
 * StatBadge — Standardized statistical status and significance badge
 * e.g., "Reject H₀", "p < 0.001", "Large Effect", "Validated"
 */
import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export type StatBadgeVariant = 'reject' | 'fail_to_reject' | 'negligible' | 'info' | 'success' | 'warning' | 'purple';

interface StatBadgeProps {
  label: string;
  sublabel?: string;
  variant?: StatBadgeVariant;
  icon?: boolean;
  className?: string;
}

export default function StatBadge({
  label,
  sublabel,
  variant = 'reject',
  icon = true,
  className = '',
}: StatBadgeProps) {
  const variantStyles: Record<StatBadgeVariant, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    reject: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      icon: <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      icon: <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    },
    fail_to_reject: {
      bg: 'bg-slate-500/10 dark:bg-white/10',
      text: 'text-slate-600 dark:text-slate-300',
      border: 'border-slate-400/30',
      icon: <Info className="w-3 h-3 text-slate-500 shrink-0" />,
    },
    negligible: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/30',
      icon: <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/30',
      icon: <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />,
    },
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/15',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-500/30',
      icon: <Info className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />,
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/15',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-500/30',
      icon: <Info className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />,
    },
  };

  const style = variantStyles[variant] || variantStyles.reject;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-tight border font-sans ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      {icon && style.icon}
      <span>{label}</span>
      {sublabel && (
        <span className="opacity-75 font-mono text-[10px] pl-0.5 border-l border-current/20 ml-0.5">
          {sublabel}
        </span>
      )}
    </span>
  );
}
