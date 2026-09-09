import React from 'react';
import { Sparkles } from 'lucide-react';

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
  align?: 'left' | 'center';
  badgeIcon?: React.ReactNode;
}

const pillVariants: Record<string, string> = {
  default: 'bg-slate-100/90 dark:bg-white/[0.06] border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300',
  success: 'bg-emerald-50/90 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  blue:    'bg-blue-50/90 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300',
  amber:   'bg-amber-50/90 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300',
  purple:  'bg-purple-50/90 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300',
};

export default function PageHeader({
  category,
  title,
  subtitle,
  contextPills,
  action,
  className = '',
  align = 'left',
  badgeIcon,
}: PageHeaderProps) {
  if (align === 'center') {
    return (
      <div className={`relative text-center flex flex-col items-center justify-center py-6 sm:py-8 overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/[0.07] bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 dark:from-[#111e35]/80 dark:via-[#0c1628]/95 dark:to-[#091120] shadow-xs px-4 sm:px-8 ${className}`}>
        {/* Ambient Radial Lighting Cones */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-cyan-500/15 dark:from-blue-600/20 dark:via-cyan-500/15 dark:to-indigo-600/20 blur-3xl rounded-full -z-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] dark:opacity-[0.06] -z-0" />

        {/* Category Pill / Eyebrow */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10.5px] font-mono font-bold tracking-widest uppercase border border-blue-500/25 bg-blue-500/10 text-[#0F4C81] dark:text-blue-400 shadow-2xs mb-3 backdrop-blur-md">
          {badgeIcon ?? <Sparkles size={12} className="text-blue-500 dark:text-blue-400 animate-pulse" />}
          <span>{category}</span>
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-50 dark:to-slate-200 max-w-4xl leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="relative z-10 text-sm sm:text-base text-slate-600 dark:text-slate-300/90 max-w-3xl mx-auto leading-relaxed mt-3 font-normal">
            {subtitle}
          </p>
        )}

        {/* Action (if any) */}
        {action && <div className="relative z-10 mt-4">{action}</div>}

        {/* Context Pills */}
        {contextPills && contextPills.length > 0 && (
          <div className="relative z-10 flex items-center justify-center flex-wrap gap-2.5 mt-6">
            {contextPills.map((pill, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border shadow-2xs backdrop-blur-md transition-all hover:scale-[1.02] ${
                  pillVariants[pill.variant ?? 'default']
                }`}
              >
                {pill.icon && <span className="shrink-0">{pill.icon}</span>}
                {pill.value ? (
                  <>
                    <span className="opacity-75 font-normal">{pill.label}:</span>
                    <span className="font-bold">{pill.value}</span>
                  </>
                ) : (
                  <span className="font-semibold">{pill.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

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
