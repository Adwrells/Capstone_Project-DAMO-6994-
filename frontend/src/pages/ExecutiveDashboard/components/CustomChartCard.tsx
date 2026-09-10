/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CustomChartCard Component
 * Displays user-committed custom visualizations on the Executive Dashboard.
 */

import React, { useMemo, useRef, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, ComposedChart, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, LabelList
} from 'recharts';
import { Trash2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { CustomVisualization } from '../../../utils/types';
import DownloadVisualButton from './DownloadVisualButton';

interface CustomChartCardProps {
  key?: React.Key;
  chart: CustomVisualization;
  data: any[];
  isDarkMode: boolean;
  onRemove: (id: string) => void;
}

const THEME_COLORS = [
  '#0F4C81', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6', '#6366F1'
];

/**
 * Clean column names into professional, human-readable titles.
 */
export const formatAxisTitle = (col?: string): string => {
  if (!col) return '';
  const c = col.trim();
  const lower = c.toLowerCase();

  const map: Record<string, string> = {
    'median_los_hours': 'Median LOS (Hours)',
    'median_length_of_stay_min': 'Median LOS (Minutes)',
    'length_of_stay': 'Length of Stay (Hours)',
    'length of stay (hours)': 'Length of Stay (Hours)',
    'los_hours': 'LOS (Hours)',
    'los_min': 'LOS (Minutes)',
    'ed_visits': 'ED Visits',
    'total_visits': 'Total ED Visits',
    'total ed minutes': 'Total ED Minutes',
    'visits': 'Visits',
    'visit count': 'Visit Count',
    'resource cost ($)': 'Resource Cost ($)',
    'triage_level': 'Triage Level (CTAS)',
    'ctas_level': 'CTAS Acuity Level',
    'ctas level': 'CTAS Acuity Level',
    'ctas': 'CTAS Level',
    'fiscal_year': 'Fiscal Year',
    'fiscal year': 'Fiscal Year',
    'fiscal_year_start': 'Fiscal Year',
    'year': 'Fiscal Year',
    'province': 'Province / Territory',
    'visit_disposition': 'Discharge Disposition',
    'visit disposition': 'Discharge Disposition',
    'disposition': 'Discharge Disposition',
    'age_group': 'Age Cohort',
    'age': 'Patient Age',
    'main_problem': 'Chief Complaint / Diagnosis',
    'admit_via_ambulance': 'Ambulance Arrival',
    'erbi_score': 'ERBI Burden Score',
    'burden_hours': 'Burden Hours'
  };

  if (map[lower]) return map[lower];
  if (!lower.includes('_') && /[A-Z]/.test(c)) return c;

  return c
    .split(/[_\s]+/)
    .map(word => {
      const wLower = word.toLowerCase();
      if (wLower === 'ed') return 'ED';
      if (wLower === 'los') return 'LOS';
      if (wLower === 'ctas') return 'CTAS';
      if (wLower === 'id') return 'ID';
      if (wLower === 'cihi') return 'CIHI';
      if (wLower === 'nacrs') return 'NACRS';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Format numbers with professional magnitude scaling (B, M, k, or standard decimals).
 */
export const formatYValue = (value: number, unitFormat?: CustomVisualization['unitFormat']): string => {
  if (value === 0) return '0';
  const abs = Math.abs(value);

  if (unitFormat === 'raw') {
    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }
  if (unitFormat === 'currency') {
    if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  if (unitFormat === 'percentage') {
    return `${value.toFixed(1)}%`;
  }
  if (unitFormat === 'billions') {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (unitFormat === 'millions') {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (unitFormat === 'thousands') {
    // Prevent awkward formats like 38000.0k by promoting to M
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return `${(value / 1_000).toFixed(1)}k`;
  }

  // Auto-scaling (default)
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(value / 1_000).toFixed(1)}k`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  if (Number.isInteger(value)) return value.toString();
  return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
};

export default function CustomChartCard({
  chart,
  data,
  isDarkMode,
  onRemove,
}: CustomChartCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [overrideTheme, setOverrideTheme] = useState<'light' | 'dark' | null>(null);
  const dark = overrideTheme !== null ? overrideTheme === 'dark' : isDarkMode;

  const chartColor = chart.chartColor || '#0F4C81';
  const showGridlines = chart.showGridlines !== false;
  const showLegend = chart.showLegend !== false;
  const showDataLabels = chart.showDataLabels !== false;
  const xAxisLabelRotation = chart.xAxisLabelRotation || 0;
  const fontSize = chart.fontSize || 9.5;
  const hasMultiSeries = Boolean(chart.enableTrendLine || chart.enableMovingAverage);

  // Group data by X Axis and apply Y Axis aggregation logic
  const chartData = useMemo(() => {
    if (!chart.xAxisColumn || !chart.yAxisColumn || data.length === 0) return [];

    const grouped: Record<string, number[]> = {};
    data.forEach(row => {
      const xKey = String(row[chart.xAxisColumn] !== null && row[chart.xAxisColumn] !== undefined ? row[chart.xAxisColumn] : 'Null/Missing');
      const yVal = Number(row[chart.yAxisColumn]) || 0;
      if (!grouped[xKey]) grouped[xKey] = [];
      grouped[xKey].push(yVal);
    });

    let rawList = Object.entries(grouped).map(([name, list]) => {
      let finalVal = 0;
      if (chart.aggregation === 'Sum') {
        finalVal = list.reduce((a, b) => a + b, 0);
      } else if (chart.aggregation === 'Average') {
        finalVal = list.length > 0 ? list.reduce((a, b) => a + b, 0) / list.length : 0;
      } else if (chart.aggregation === 'Count') {
        finalVal = list.length;
      } else if (chart.aggregation === 'Min') {
        finalVal = list.length > 0 ? Math.min(...list) : 0;
      } else if (chart.aggregation === 'Max') {
        finalVal = list.length > 0 ? Math.max(...list) : 0;
      } else if (chart.aggregation === 'Median') {
        const sorted = [...list].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        finalVal = sorted.length > 0 ? (sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2) : 0;
      }

      return {
        name,
        value: parseFloat(finalVal.toFixed(2))
      };
    });

    // Handle Top N filtering
    if (chart.topN && chart.topN > 0 && chart.topN < rawList.length) {
      rawList = rawList.sort((a, b) => b.value - a.value).slice(0, chart.topN);
    }

    // Chronological & Clinical sorting
    const isTemporal = /year|fiscal|date|month|period|time/i.test(chart.xAxisColumn);
    const isCtas = /triage|ctas|acuity/i.test(chart.xAxisColumn);

    if (isTemporal) {
      // Sort chronologically ascending (e.g. 2003-2004 -> 2021-2022)
      rawList = rawList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    } else if (isCtas) {
      const getCtasRank = (name: string): number => {
        const s = name.toLowerCase();
        if (s.includes('resuscitation') || s.includes('ctas i ') || s.includes('ctas 1') || s.includes('level 1') || s.startsWith('1')) return 1;
        if (s.includes('emergent') || s.includes('ctas ii ') || s.includes('ctas 2') || s.includes('level 2') || s.startsWith('2')) return 2;
        if (s.includes('urgent') && !s.includes('less') && !s.includes('non')) return 3;
        if (s.includes('ctas iii') || s.includes('ctas 3') || s.includes('level 3') || s.startsWith('3')) return 3;
        if (s.includes('less urgent') || s.includes('less-urgent') || s.includes('ctas iv') || s.includes('ctas 4') || s.includes('level 4') || s.startsWith('4')) return 4;
        if (s.includes('non-urgent') || s.includes('non urgent') || s.includes('ctas v') || s.includes('ctas 5') || s.includes('level 5') || s.startsWith('5')) return 5;
        if (s.includes('unknown') || s.includes('missing')) return 6;
        return 99;
      };
      rawList = rawList.sort((a, b) => getCtasRank(a.name) - getCtasRank(b.name));
    }

    return rawList;
  }, [data, chart.xAxisColumn, chart.yAxisColumn, chart.aggregation, chart.topN]);

  // Linear Regression for Trend Lines
  const trendLinePoints = useMemo(() => {
    if (!chart.enableTrendLine || chartData.length < 2) return [];
    const n = chartData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    chartData.forEach((d, idx) => {
      sumX += idx;
      sumY += d.value;
      sumXY += idx * d.value;
      sumXX += idx * idx;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return chartData.map((d, idx) => ({
      name: d.name,
      trendValue: parseFloat((slope * idx + intercept).toFixed(2))
    }));
  }, [chartData, chart.enableTrendLine]);

  // Moving Average Points (rolling average of last 3 items)
  const movingAveragePoints = useMemo(() => {
    if (!chart.enableMovingAverage || chartData.length === 0) return [];
    const windowSize = 3;
    return chartData.map((d, idx) => {
      const start = Math.max(0, idx - windowSize + 1);
      const slice = chartData.slice(start, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.value, 0) / slice.length;
      return {
        name: d.name,
        maValue: parseFloat(avg.toFixed(2))
      };
    });
  }, [chartData, chart.enableMovingAverage]);

  // Multi-series merged dataset
  const mergedChartData = useMemo(() => {
    return chartData.map((d, idx) => {
      const point: any = { ...d };
      if (chart.enableTrendLine && trendLinePoints[idx]) {
        point.trendValue = trendLinePoints[idx].trendValue;
      }
      if (chart.enableMovingAverage && movingAveragePoints[idx]) {
        point.maValue = movingAveragePoints[idx].maValue;
      }
      return point;
    });
  }, [chartData, chart.enableTrendLine, trendLinePoints, chart.enableMovingAverage, movingAveragePoints]);

  // Summary statistics
  const summary = useMemo(() => {
    if (chartData.length === 0) return null;
    const values = chartData.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const maxItem = chartData.find(d => d.value === maxVal);
    const minItem = chartData.find(d => d.value === minVal);

    return {
      sum,
      mean: parseFloat(mean.toFixed(2)),
      maxVal,
      minVal,
      maxName: maxItem ? maxItem.name : 'N/A',
      minName: minItem ? minItem.name : 'N/A',
      count: values.length,
      shareMax: sum > 0 ? parseFloat(((maxVal / sum) * 100).toFixed(1)) : 0
    };
  }, [chartData]);

  // Smart Data Label Renderer: perfectly centered horizontally and vertically positioned
  const renderSmartDataLabel = (props: any) => {
    const { x, y, width, value, index } = props;
    if (value === undefined || value === null) return null;
    if (!showDataLabels) return null;

    const totalPoints = chartData.length;
    // For series longer than 7 items, only display Peak, Trough, Start, and End to avoid congestion
    if (totalPoints > 7) {
      const isMax = summary && value === summary.maxVal;
      const isMin = summary && value === summary.minVal;
      const isLast = index === totalPoints - 1;
      const isFirst = index === 0;

      if (!isMax && !isMin && !isLast && !isFirst) {
        return null;
      }
    }

    const formatted = formatYValue(Number(value), chart.unitFormat);
    // When width is present (Bar/Column), center horizontally at x + width / 2; otherwise x is already the center point
    const posX = width !== undefined && width !== null ? x + width / 2 : x;
    const posY = y - 7;

    return (
      <text
        x={posX}
        y={posY}
        fill={dark ? '#f1f5f9' : '#1e293b'}
        fontSize={9}
        fontWeight={700}
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
      >
        {formatted}
      </text>
    );
  };

  // Smart Data Label Renderer for horizontal bar layouts
  const renderSmartVerticalBarLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    if (value === undefined || value === null) return null;
    if (!showDataLabels) return null;

    const totalPoints = chartData.length;
    if (totalPoints > 8) {
      const isMax = summary && value === summary.maxVal;
      const isMin = summary && value === summary.minVal;
      const isLast = index === totalPoints - 1;
      if (!isMax && !isMin && !isLast) return null;
    }

    const formatted = formatYValue(Number(value), chart.unitFormat);
    return (
      <text
        x={x + width + 6}
        y={y + height / 2 + 3.5}
        fill={dark ? '#f1f5f9' : '#1e293b'}
        fontSize={8.5}
        fontWeight={700}
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="start"
      >
        {formatted}
      </text>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      {/* ── Card Header ── */}
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-3 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] font-mono">
              Committed Visual · {chart.type}
            </span>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full font-mono ${
              dark ? 'bg-blue-950/40 border border-blue-800/40 text-blue-300' : 'bg-blue-50 border border-blue-100 text-blue-700'
            }`}>
              {chart.aggregation}
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white font-sans">
            {chart.title}
          </h4>
          {chart.subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light">
              {chart.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DownloadVisualButton
            cardRef={cardRef}
            visualTitle={chart.title.replace(/\s+/g, '_')}
            isDarkMode={dark}
            onSetTheme={async (theme) => {
              setOverrideTheme(theme);
              await new Promise((r) => setTimeout(r, 120));
            }}
            onResetTheme={() => setOverrideTheme(null)}
          />
          <button
            type="button"
            onClick={() => onRemove(chart.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800/60 cursor-pointer transition"
            title="Remove visual from dashboard"
            aria-label="Remove visual"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ── Chart Body ── */}
      <div className="py-4 min-h-[300px] flex items-center justify-center">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs">
            <AlertCircle size={24} className="mb-2 text-slate-400" />
            <span>No data available for {formatAxisTitle(chart.xAxisColumn)} × {formatAxisTitle(chart.yAxisColumn)}.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={290}>
            {chart.type === 'Column' ? (
              <ComposedChart data={mergedChartData} margin={{ left: 16, right: 20, top: hasMultiSeries ? 14 : 26, bottom: 42 }}>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#f1f5f9'} />}
                <XAxis
                  dataKey="name"
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  angle={xAxisLabelRotation !== 0 ? xAxisLabelRotation : (chartData.length > 5 ? -25 : 0)}
                  textAnchor={xAxisLabelRotation > 0 ? 'start' : (xAxisLabelRotation < 0 || chartData.length > 5 ? 'end' : 'middle')}
                  height={46}
                  interval={chartData.length > 14 ? 'preserveStartEnd' : 0}
                  tickMargin={6}
                  tickFormatter={(v: any) => {
                    const str = String(v ?? '');
                    return str.length > 18 ? str.substring(0, 16) + '…' : str;
                  }}
                  label={{
                    value: formatAxisTitle(chart.xAxisColumn),
                    position: 'insideBottom',
                    offset: -8,
                    fill: dark ? '#94a3b8' : '#64748b',
                    fontSize: 9.5,
                    fontWeight: 700,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
                <YAxis
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  tickFormatter={(v) => formatYValue(Number(v), chart.unitFormat)}
                  domain={[
                    0,
                    (dataMax: number) => {
                      if (!dataMax || !isFinite(dataMax) || dataMax <= 0) return 'auto';
                      const padding = dataMax * 0.15;
                      return Number((dataMax + (padding > 0.4 ? padding : 0.4)).toFixed(1));
                    }
                  ]}
                  width={68}
                  label={{
                    value: `${formatAxisTitle(chart.yAxisColumn)} (${chart.aggregation})`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 12,
                    style: {
                      textAnchor: 'middle',
                      fill: dark ? '#94a3b8' : '#64748b',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    let seriesName = formatAxisTitle(chart.yAxisColumn);
                    if (name === 'trendValue') seriesName = 'Regression Trend';
                    else if (name === 'maValue') seriesName = '3-Period Moving Avg';
                    return [formatYValue(Number(value), chart.unitFormat), seriesName];
                  }}
                  contentStyle={{
                    backgroundColor: dark ? '#1e293b' : '#ffffff',
                    border: dark ? '1px solid #334155' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '11px',
                    fontWeight: 500
                  }}
                />
                {showLegend && hasMultiSeries && (
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={24}
                    wrapperStyle={{
                      paddingBottom: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                )}
                <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]}>
                  {showDataLabels && (
                    <LabelList
                      dataKey="value"
                      content={renderSmartDataLabel}
                    />
                  )}
                </Bar>
                {chart.enableTrendLine && (
                  <Line type="monotone" dataKey="trendValue" stroke="#f43f5e" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Regression Trend" />
                )}
                {chart.enableMovingAverage && (
                  <Line type="monotone" dataKey="maValue" stroke="#3b82f6" strokeWidth={2} dot={false} name="3-Period Moving Avg" />
                )}
                {chart.targetValue !== undefined && (
                  <ReferenceLine y={chart.targetValue} stroke="#ea580c" strokeDasharray="3 3" label={{ value: 'TARGET', fill: '#ea580c', fontSize: 8 }} />
                )}
              </ComposedChart>
            ) : chart.type === 'Bar' ? (
              <ComposedChart data={mergedChartData} layout="vertical" margin={{ left: 16, right: 42, top: hasMultiSeries ? 14 : 26, bottom: 40 }}>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#f1f5f9'} />}
                <XAxis
                  type="number"
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  tickFormatter={(v) => formatYValue(Number(v), chart.unitFormat)}
                  domain={[
                    0,
                    (dataMax: number) => {
                      if (!dataMax || !isFinite(dataMax) || dataMax <= 0) return 'auto';
                      const padding = dataMax * 0.15;
                      return Number((dataMax + (padding > 0.4 ? padding : 0.4)).toFixed(1));
                    }
                  ]}
                  height={40}
                  label={{
                    value: `${formatAxisTitle(chart.yAxisColumn)} (${chart.aggregation})`,
                    position: 'insideBottom',
                    offset: -6,
                    fill: dark ? '#94a3b8' : '#64748b',
                    fontSize: 9.5,
                    fontWeight: 700,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  width={95}
                  tickMargin={6}
                  tickFormatter={(v: any) => {
                    const str = String(v ?? '');
                    return str.length > 18 ? str.substring(0, 16) + '…' : str;
                  }}
                  label={{
                    value: formatAxisTitle(chart.xAxisColumn),
                    angle: -90,
                    position: 'insideLeft',
                    offset: 12,
                    style: {
                      textAnchor: 'middle',
                      fill: dark ? '#94a3b8' : '#64748b',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    let seriesName = formatAxisTitle(chart.yAxisColumn);
                    if (name === 'trendValue') seriesName = 'Regression Trend';
                    else if (name === 'maValue') seriesName = '3-Period Moving Avg';
                    return [formatYValue(Number(value), chart.unitFormat), seriesName];
                  }}
                  contentStyle={{
                    backgroundColor: dark ? '#1e293b' : '#ffffff',
                    border: dark ? '1px solid #334155' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '11px',
                    fontWeight: 500
                  }}
                />
                {showLegend && hasMultiSeries && (
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={24}
                    wrapperStyle={{
                      paddingBottom: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                )}
                <Bar dataKey="value" fill={chartColor} radius={[0, 4, 4, 0]}>
                  {showDataLabels && (
                    <LabelList
                      dataKey="value"
                      content={renderSmartVerticalBarLabel}
                    />
                  )}
                </Bar>
                {chart.enableTrendLine && (
                  <Line type="monotone" dataKey="trendValue" stroke="#f43f5e" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Regression Trend" />
                )}
                {chart.enableMovingAverage && (
                  <Line type="monotone" dataKey="maValue" stroke="#3b82f6" strokeWidth={2} dot={false} name="3-Period Moving Avg" />
                )}
                {chart.targetValue !== undefined && (
                  <ReferenceLine x={chart.targetValue} stroke="#ea580c" strokeDasharray="3 3" label={{ value: 'TARGET', fill: '#ea580c', fontSize: 8, position: 'insideTop' }} />
                )}
              </ComposedChart>
            ) : chart.type === 'Line' ? (
              <ComposedChart data={mergedChartData} margin={{ left: 16, right: 20, top: hasMultiSeries ? 14 : 26, bottom: 42 }}>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#f1f5f9'} />}
                <XAxis
                  dataKey="name"
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  angle={xAxisLabelRotation !== 0 ? xAxisLabelRotation : (chartData.length > 5 ? -25 : 0)}
                  textAnchor={xAxisLabelRotation > 0 ? 'start' : (xAxisLabelRotation < 0 || chartData.length > 5 ? 'end' : 'middle')}
                  height={46}
                  interval={chartData.length > 14 ? 'preserveStartEnd' : 0}
                  tickMargin={6}
                  tickFormatter={(v: any) => {
                    const str = String(v ?? '');
                    return str.length > 18 ? str.substring(0, 16) + '…' : str;
                  }}
                  label={{
                    value: formatAxisTitle(chart.xAxisColumn),
                    position: 'insideBottom',
                    offset: -8,
                    fill: dark ? '#94a3b8' : '#64748b',
                    fontSize: 9.5,
                    fontWeight: 700,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
                <YAxis
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  tickFormatter={(v) => formatYValue(Number(v), chart.unitFormat)}
                  domain={[
                    0,
                    (dataMax: number) => {
                      if (!dataMax || !isFinite(dataMax) || dataMax <= 0) return 'auto';
                      const padding = dataMax * 0.15;
                      return Number((dataMax + (padding > 0.4 ? padding : 0.4)).toFixed(1));
                    }
                  ]}
                  width={68}
                  label={{
                    value: `${formatAxisTitle(chart.yAxisColumn)} (${chart.aggregation})`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 12,
                    style: {
                      textAnchor: 'middle',
                      fill: dark ? '#94a3b8' : '#64748b',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    let seriesName = formatAxisTitle(chart.yAxisColumn);
                    if (name === 'trendValue') seriesName = 'Regression Trend';
                    else if (name === 'maValue') seriesName = '3-Period Moving Avg';
                    return [formatYValue(Number(value), chart.unitFormat), seriesName];
                  }}
                  contentStyle={{
                    backgroundColor: dark ? '#1e293b' : '#ffffff',
                    border: dark ? '1px solid #334155' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '11px',
                    fontWeight: 500
                  }}
                />
                {showLegend && hasMultiSeries && (
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={24}
                    wrapperStyle={{
                      paddingBottom: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                )}
                <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2.5} dot={{ r: 3.5, fill: chartColor }}>
                  {showDataLabels && (
                    <LabelList
                      dataKey="value"
                      content={renderSmartDataLabel}
                    />
                  )}
                </Line>
                {chart.enableTrendLine && (
                  <Line type="monotone" dataKey="trendValue" stroke="#f43f5e" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Regression Trend" />
                )}
                {chart.enableMovingAverage && (
                  <Line type="monotone" dataKey="maValue" stroke="#3b82f6" strokeWidth={2} dot={false} name="3-Period Moving Avg" />
                )}
                {chart.targetValue !== undefined && (
                  <ReferenceLine y={chart.targetValue} stroke="#ea580c" strokeDasharray="3 3" label={{ value: 'TARGET', fill: '#ea580c', fontSize: 8 }} />
                )}
              </ComposedChart>
            ) : chart.type === 'Area' ? (
              <ComposedChart data={mergedChartData} margin={{ left: 16, right: 20, top: hasMultiSeries ? 14 : 26, bottom: 42 }}>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#f1f5f9'} />}
                <XAxis
                  dataKey="name"
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  angle={xAxisLabelRotation !== 0 ? xAxisLabelRotation : (chartData.length > 5 ? -25 : 0)}
                  textAnchor={xAxisLabelRotation > 0 ? 'start' : (xAxisLabelRotation < 0 || chartData.length > 5 ? 'end' : 'middle')}
                  height={46}
                  interval={chartData.length > 14 ? 'preserveStartEnd' : 0}
                  tickMargin={6}
                  tickFormatter={(v: any) => {
                    const str = String(v ?? '');
                    return str.length > 18 ? str.substring(0, 16) + '…' : str;
                  }}
                  label={{
                    value: formatAxisTitle(chart.xAxisColumn),
                    position: 'insideBottom',
                    offset: -8,
                    fill: dark ? '#94a3b8' : '#64748b',
                    fontSize: 9.5,
                    fontWeight: 700,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
                <YAxis
                  stroke={dark ? '#94a3b8' : '#64748b'}
                  fontSize={fontSize}
                  tickFormatter={(v) => formatYValue(Number(v), chart.unitFormat)}
                  domain={[
                    0,
                    (dataMax: number) => {
                      if (!dataMax || !isFinite(dataMax) || dataMax <= 0) return 'auto';
                      const padding = dataMax * 0.15;
                      return Number((dataMax + (padding > 0.4 ? padding : 0.4)).toFixed(1));
                    }
                  ]}
                  width={68}
                  label={{
                    value: `${formatAxisTitle(chart.yAxisColumn)} (${chart.aggregation})`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 12,
                    style: {
                      textAnchor: 'middle',
                      fill: dark ? '#94a3b8' : '#64748b',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    let seriesName = formatAxisTitle(chart.yAxisColumn);
                    if (name === 'trendValue') seriesName = 'Regression Trend';
                    else if (name === 'maValue') seriesName = '3-Period Moving Avg';
                    return [formatYValue(Number(value), chart.unitFormat), seriesName];
                  }}
                  contentStyle={{
                    backgroundColor: dark ? '#1e293b' : '#ffffff',
                    border: dark ? '1px solid #334155' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '11px',
                    fontWeight: 500
                  }}
                />
                {showLegend && hasMultiSeries && (
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={24}
                    wrapperStyle={{
                      paddingBottom: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                )}
                <Area type="monotone" dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.2}>
                  {showDataLabels && (
                    <LabelList
                      dataKey="value"
                      content={renderSmartDataLabel}
                    />
                  )}
                </Area>
                {chart.enableTrendLine && (
                  <Line type="monotone" dataKey="trendValue" stroke="#f43f5e" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Regression Trend" />
                )}
                {chart.enableMovingAverage && (
                  <Line type="monotone" dataKey="maValue" stroke="#3b82f6" strokeWidth={2} dot={false} name="3-Period Moving Avg" />
                )}
                {chart.targetValue !== undefined && (
                  <ReferenceLine y={chart.targetValue} stroke="#ea580c" strokeDasharray="3 3" label={{ value: 'TARGET', fill: '#ea580c', fontSize: 8 }} />
                )}
              </ComposedChart>
            ) : chart.type === 'Radar' ? (
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke={dark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="name" stroke={dark ? '#cbd5e1' : '#475569'} fontSize={fontSize} />
                <PolarRadiusAxis stroke={dark ? '#94a3b8' : '#64748b'} fontSize={8} tickFormatter={(v) => formatYValue(Number(v), chart.unitFormat)} />
                <Radar name={formatAxisTitle(chart.yAxisColumn)} dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.25} />
                <Tooltip formatter={(v) => formatYValue(Number(v), chart.unitFormat)} />
              </RadarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={chart.type === 'Donut' ? 50 : 0}
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatYValue(Number(value), chart.unitFormat), formatAxisTitle(chart.yAxisColumn)]} />
                {showLegend && <Legend verticalAlign="bottom" height={36} />}
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Card Footer with Insights & Summary ── */}
      {summary && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] font-mono">
          <div className="text-slate-500 dark:text-slate-400">
            Top Segment: <strong className="text-slate-800 dark:text-slate-200">{summary.maxName}</strong> ({formatYValue(summary.maxVal, chart.unitFormat)})
            <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
            Mean: <strong className="text-slate-800 dark:text-slate-200">{formatYValue(summary.mean, chart.unitFormat)}</strong>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            {formatAxisTitle(chart.xAxisColumn)} × {formatAxisTitle(chart.yAxisColumn)}
          </div>
        </div>
      )}
    </div>
  );
}
