/**
 * Healthcare Analytics Platform — Enterprise MetricCard
 * Features: animated number transitions, trend arrows, sparklines,
 * context badges, WCAG 2.2 AA accessible, responsive.
 */

import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

/* ─── Types ───────────────────────────────────────────────────────────────── */
export interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  sparklineData?: number[];
  trendLabel?: string;
  trendPct?: number;        // positive = up, negative = down (override computed)
  variant?: 'default' | 'highlight' | 'danger' | 'warning' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  tooltip?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  prefix?: string;
}

/* ─── Animated Number ─────────────────────────────────────────────────────── */
function AnimatedNumber({ target, duration = 800 }: { target: number; duration?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const end = target;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevTarget.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return <>{displayed.toLocaleString()}</>;
}

/* ─── Trend Badge ─────────────────────────────────────────────────────────── */
function TrendBadge({ pct, label }: { pct: number; label?: string }) {
  const isUp = pct > 0;
  const isFlat = pct === 0;

  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const colour = isFlat
    ? 'text-[#6B7280] bg-[#F3F4F6] dark:text-slate-400 dark:bg-slate-800'
    : isUp
    ? 'text-[#16A34A] bg-[#F0FDF4] dark:text-emerald-400 dark:bg-emerald-950/30'
    : 'text-[#DC2626] bg-[#FEF2F2] dark:text-rose-400 dark:bg-rose-950/30';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${colour}`}
      aria-label={`${isUp ? 'Up' : isFlat ? 'Unchanged' : 'Down'} ${Math.abs(pct).toFixed(1)}%${label ? `: ${label}` : ''}`}>
      <Icon size={11} aria-hidden="true" />
      {isFlat ? 'No change' : `${Math.abs(pct).toFixed(1)}%`}
      {label && <span className="font-normal opacity-80">{label}</span>}
    </div>
  );
}

/* ─── Mini Sparkline ──────────────────────────────────────────────────────── */
function Sparkline({ data, colour = '#2563EB' }: { data: number[]; colour?: string }) {
  if (!data || data.length < 2) return null;
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="w-full h-10" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={colour}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Tooltip
            contentStyle={{ display: 'none' }}
            wrapperStyle={{ display: 'none' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Variant Styles ──────────────────────────────────────────────────────── */
const VARIANT_STYLES = {
  default: {
    card:    'bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800',
    title:   'text-[#6B7280] dark:text-slate-400',
    value:   'text-[#111827] dark:text-white',
    icon:    'bg-[#F3F4F6] text-[#374151] dark:bg-slate-800 dark:text-slate-300',
    sparkline: '#2563EB',
  },
  highlight: {
    card:    'bg-white dark:bg-slate-900 border border-[#DBEAFE] dark:border-blue-900/50',
    title:   'text-[#2563EB] dark:text-blue-400',
    value:   'text-[#1D4ED8] dark:text-blue-300',
    icon:    'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/30 dark:text-blue-400',
    sparkline: '#2563EB',
  },
  success: {
    card:    'bg-white dark:bg-slate-900 border border-[#BBF7D0] dark:border-emerald-900/50',
    title:   'text-[#166534] dark:text-emerald-400',
    value:   'text-[#15803D] dark:text-emerald-300',
    icon:    'bg-[#F0FDF4] text-[#16A34A] dark:bg-emerald-950/30 dark:text-emerald-400',
    sparkline: '#22C55E',
  },
  warning: {
    card:    'bg-white dark:bg-slate-900 border border-[#FDE68A] dark:border-amber-900/50',
    title:   'text-[#92400E] dark:text-amber-400',
    value:   'text-[#B45309] dark:text-amber-300',
    icon:    'bg-[#FFFBEB] text-[#D97706] dark:bg-amber-950/30 dark:text-amber-400',
    sparkline: '#F59E0B',
  },
  danger: {
    card:    'bg-white dark:bg-slate-900 border border-[#FECACA] dark:border-rose-900/50',
    title:   'text-[#991B1B] dark:text-rose-400',
    value:   'text-[#DC2626] dark:text-rose-300',
    icon:    'bg-[#FEF2F2] text-[#EF4444] dark:bg-rose-950/30 dark:text-rose-400',
    sparkline: '#EF4444',
  },
  gradient: {
    card:    'bg-gradient-to-br from-[#2563EB] to-[#0D9488] border-0 text-white',
    title:   'text-blue-100',
    value:   'text-white',
    icon:    'bg-white/20 text-white',
    sparkline: 'rgba(255,255,255,0.7)',
  },
};

const SIZE_STYLES = {
  sm: { padding: 'p-4', title: 'text-xs', value: 'text-xl', icon: 'w-7 h-7 text-sm' },
  md: { padding: 'p-5', title: 'text-xs', value: 'text-2xl', icon: 'w-9 h-9 text-base' },
  lg: { padding: 'p-6', title: 'text-sm', value: 'text-3xl', icon: 'w-11 h-11 text-lg' },
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function MetricCard({
  title,
  value,
  previousValue,
  unit,
  description,
  icon,
  sparklineData,
  trendLabel,
  trendPct,
  variant = 'default',
  size = 'md',
  loading = false,
  tooltip,
  href,
  onClick,
  className = '',
  prefix,
}: MetricCardProps) {
  const styles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];

  // Compute trend percentage if not provided but previousValue is available
  const computedTrendPct = trendPct !== undefined
    ? trendPct
    : (previousValue != null && !isNaN(Number(previousValue)) && Number(previousValue) !== 0)
      ? ((Number(value) - Number(previousValue)) / Math.abs(Number(previousValue))) * 100
      : null;

  // Is value a pure number? (for animation)
  const numericValue = typeof value === 'number' ? value : (
    typeof value === 'string' && !isNaN(Number(value.replace(/[,$%]/g, '')))
      ? Number(value.replace(/[,$%]/g, ''))
      : null
  );

  const [showTooltip, setShowTooltip] = useState(false);

  if (loading) {
    return (
      <div className={`rounded-2xl border border-[#E5E7EB] dark:border-slate-800 ${sizeStyles.padding} ${className}`} aria-busy="true" aria-label={`Loading ${title}`}>
        <div className="skeleton h-3 w-24 rounded mb-3" />
        <div className="skeleton h-7 w-32 rounded mb-2" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
    );
  }

  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const interactiveProps = href
    ? { href, target: '_blank' as const, rel: 'noopener noreferrer' }
    : onClick
    ? { onClick, type: 'button' as const }
    : {};

  return (
    <Tag
      {...interactiveProps}
      className={`relative block rounded-2xl shadow-sm transition-all duration-200 overflow-hidden
        ${styles.card}
        ${sizeStyles.padding}
        ${onClick || href ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
        ${className}`}
      aria-label={`${title}: ${String(value)}${unit ? ` ${unit}` : ''}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`block text-[11px] font-semibold uppercase tracking-wider truncate ${styles.title} ${sizeStyles.title}`}>
              {title}
            </span>
            {tooltip && (
              <div className="relative">
                <button
                  className="text-[#9CA3AF] hover:text-[#6B7280] dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  aria-label={`Info: ${tooltip}`}
                  tabIndex={0}
                >
                  <Info size={11} aria-hidden="true" />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 w-44 bg-[#1F2937] text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-normal">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1F2937]" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {icon && (
          <div className={`shrink-0 flex items-center justify-center rounded-xl ${styles.icon} ${sizeStyles.icon}`}
            aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className={`font-bold tracking-tight leading-none mb-1.5 ${styles.value} ${sizeStyles.value}`}>
        {prefix && <span className="opacity-70 text-[75%] mr-0.5">{prefix}</span>}
        {numericValue !== null
          ? <AnimatedNumber target={numericValue} />
          : String(value)
        }
        {unit && <span className={`opacity-70 text-[60%] ml-1 font-medium`}>{unit}</span>}
      </div>

      {/* Trend + sparkline row */}
      <div className="flex items-end justify-between gap-2 mt-2">
        <div className="flex flex-col gap-1">
          {computedTrendPct !== null && (
            <TrendBadge pct={computedTrendPct} label={trendLabel} />
          )}
          {description && (
            <p className={`text-[11px] ${variant === 'gradient' ? 'text-blue-100' : 'text-[#9CA3AF] dark:text-slate-500'} leading-tight`}>
              {description}
            </p>
          )}
        </div>

        {sparklineData && sparklineData.length >= 2 && (
          <div className="flex-1 max-w-[90px]">
            <Sparkline data={sparklineData} colour={styles.sparkline} />
          </div>
        )}
      </div>

      {/* Gradient accent stripe (for default/highlight) */}
      {variant !== 'gradient' && (
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
          style={{ backgroundColor: variant === 'danger' ? '#EF4444'
            : variant === 'warning' ? '#F59E0B'
            : variant === 'success' ? '#22C55E'
            : variant === 'highlight' ? '#2563EB'
            : '#E5E7EB' }}
          aria-hidden="true"
        />
      )}
    </Tag>
  );
}
