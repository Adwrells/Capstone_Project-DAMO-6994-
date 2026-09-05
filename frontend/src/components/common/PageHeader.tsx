/**
 * PageHeader — Reusable executive-grade page header component
 * Used across all major pages to ensure consistent hierarchy.
 */
import React from 'react';

interface ContextPill {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'blue' | 'amber' | 'purple';
}

interface PageHeaderProps {
  category: string;            // e.g. "EXECUTIVE INTELLIGENCE"
  title: string;               // e.g. "Emergency Department Analytics"
  subtitle?: string;           // Short explanatory sentence
  contextPills?: ContextPill[];
  action?: React.ReactNode;    // Optional right-side action button
  className?: string;
}

const pillVariants: Record<string, string> = {
  default: 'bg-white/[0.05] border-white/[0.08] text-slate-400',
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  blue:    'bg-blue-500/10 border-blue-500/20 text-blue-400',
  amber:   'bg-amber-500/10 border-amber-500/20 text-amber-400',
  purple:  'bg-purple-500/10 border-purple-500/20 text-purple-400',
};


export default function PageHeader({
  category,
  title,
  subtitle,
  contextPills,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`page-header ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <span className="section-label">{category}</span>
          <h1 className="page-title truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0 pt-1">{action}</div>
        )}
      </div>

      {contextPills && contextPills.length > 0 && (
        <div className="page-header-meta mt-3">
          {contextPills.map((pill, i) => (
            <span
              key={i}
              className={`context-pill ${pillVariants[pill.variant ?? 'default']}`}
            >
              {pill.icon && <span className="shrink-0">{pill.icon}</span>}
              {pill.value ? (
                <>
                  <span className="text-slate-500 dark:text-slate-600">{pill.label}:</span>
                  <span className="font-semibold">{pill.value}</span>
                </>
              ) : (
                pill.label
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
