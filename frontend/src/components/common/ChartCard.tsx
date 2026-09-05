/**
 * ChartCard — Reusable container for analytical visualizations
 * Standardizes padding, borders, headers, statistical results, and takeaway slots.
 */
import React from 'react';

interface ChartCardProps {
  category?: string;              // e.g. "HYPOTHESIS H1 · KRUSKAL-WALLIS"
  title: string;                 // e.g. "LOS by Triage Acuity"
  subtitle?: string;              // Short description or interpretation
  badge?: React.ReactNode;        // Top-right status badge or decision
  headerRight?: React.ReactNode;  // Alternative right-side action/controls
  children: React.ReactNode;      // The chart/graph itself
  statRow?: React.ReactNode;      // Statistical result strip (p-value, effect size, test stat)
  takeaway?: React.ReactNode;    // Analytical takeaway / takeaway box
  className?: string;
  footer?: React.ReactNode;
}

export default function ChartCard({
  category,
  title,
  subtitle,
  badge,
  headerRight,
  children,
  statRow,
  takeaway,
  className = '',
  footer,
}: ChartCardProps) {
  return (
    <div className={`chart-card flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            {category && (
              <span className="section-label block">{category}</span>
            )}
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {(badge || headerRight) && (
            <div className="shrink-0 pt-0.5 flex items-center gap-2">
              {badge}
              {headerRight}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="px-5 py-2 flex-1 min-h-0">
        {children}
      </div>

      {/* Statistical Result Strip */}
      {statRow && (
        <div className="px-5 py-2.5 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]">
          {statRow}
        </div>
      )}

      {/* Analytical Takeaway */}
      {takeaway && (
        <div className="p-4 pt-2">
          {takeaway}
        </div>
      )}

      {/* Optional extra footer */}
      {footer && (
        <div className="p-4 border-t border-slate-100 dark:border-white/[0.06]">
          {footer}
        </div>
      )}
    </div>
  );
}
