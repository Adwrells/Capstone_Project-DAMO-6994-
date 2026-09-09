/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Fit Diagnostics — post-cleaning overfitting / underfitting assessment.
 *
 * Renders after the cleaning pipeline completes: fits a model on a train split of the
 * cleaned cohort, scores it on a held-out split, and visualises whether it generalises.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Activity, AlertTriangle, CheckCircle2, TrendingDown, Loader2,
  ServerCrash, PlaySquare, Info, Layers, Target, GitCompare, FileDown
} from 'lucide-react';
import {
  assessModelFit, fetchModelableColumns,
  FitDiagnosticsResult, FitVerdict
} from '../../services/modelDiagnosticsService';
import { printPanelAsPdf, exportTimestamp } from '../../utils/printToPdf';

interface FitDiagnosticsProps {
  cleanedData: any[];
  isDarkMode?: boolean;
}

const VERDICT_STYLES: Record<FitVerdict, { color: string; bg: string; border: string; Icon: any }> = {
  'Good Fit': {
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/60',
    Icon: CheckCircle2
  },
  'Overfitting': {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-900/60',
    Icon: AlertTriangle
  },
  'Underfitting': {
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-900/60',
    Icon: TrendingDown
  }
};

export default function FitDiagnostics({ cleanedData, isDarkMode = false }: FitDiagnosticsProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const [feature, setFeature] = useState('');
  const [target, setTarget] = useState('');
  const [degree, setDegree] = useState(1);
  const [result, setResult] = useState<FitDiagnosticsResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const gridStroke = isDarkMode ? '#1e293b' : '#e2e8f0';
  const axisStroke = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '0.75rem',
    fontSize: '12px'
  };

  // Discover which cleaned columns are numeric enough to model
  useEffect(() => {
    if (!cleanedData?.length) return;
    fetchModelableColumns(cleanedData.slice(0, 500)).then(cols => {
      setColumns(cols);
      if (cols.length >= 2) {
        setFeature(prev => prev || cols[0]);
        setTarget(prev => prev || cols[1]);
      }
    }).catch(() => setColumns([]));
  }, [cleanedData]);

  const runDiagnostics = useCallback(async () => {
    if (!feature || !target) return;
    setIsRunning(true);
    try {
      setResult(await assessModelFit(cleanedData, feature, target, degree));
    } catch (err: any) {
      setResult({
        success: false,
        status: 'backend_offline',
        message: 'Could not reach the diagnostics endpoint. Start the Python backend with: python -m backend.main'
      });
    } finally {
      setIsRunning(false);
    }
  }, [cleanedData, feature, target, degree]);

  // Declared before the early return below — hooks must run in the same order on every
  // render, so no hook may sit after a conditional return.
  const exportPdf = useCallback(() => {
    const stamp = exportTimestamp();
    printPanelAsPdf(
      'fit-diagnostics-panel',
      `Fit-Diagnostics_${feature}-vs-${target}_${stamp}`
    );
  }, [feature, target]);

  if (!cleanedData?.length) return null;

  const verdict = result?.diagnosis?.verdict;
  const style = verdict ? VERDICT_STYLES[verdict] : null;
  const VerdictIcon = style?.Icon ?? Activity;

  return (
    <div className="space-y-6" id="fit-diagnostics-panel">

      {/* ── PRINT-ONLY REPORT HEADER ──────────────────────────────────────── */}
      <div className="print-only" style={{ marginBottom: '1rem', borderBottom: '2px solid #0f172a', paddingBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '16pt', fontWeight: 700, margin: 0 }}>
          Model Fit Diagnostics — Overfitting &amp; Underfitting Assessment
        </h1>
        <p style={{ fontSize: '9pt', margin: '0.25rem 0 0' }}>
          Healthcare Analytics Platform · Emergency Department Capstone ·{' '}
          {new Date().toLocaleString()}
        </p>
        {result?.status === 'ok' && (
          <p style={{ fontSize: '9pt', margin: '0.15rem 0 0' }}>
            Predictor <strong>{result.feature}</strong> → Target <strong>{result.target}</strong>
            {' · '}Polynomial degree {result.degree}
            {' · '}{Math.round((1 - (result.test_ratio ?? 0.3)) * 100)}/
            {Math.round((result.test_ratio ?? 0.3) * 100)} train/holdout split
          </p>
        )}
      </div>

      {/* ── HEADER & CONTROLS ─────────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-sm print-hide">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider font-mono bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
              <GitCompare size={15} />
              <span>Post-Cleaning Model Validation</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Overfitting &amp; Underfitting Diagnostics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light max-w-2xl">
              Fits a model on 70% of the cleaned cohort and scores it on a held-out 30%.
              A large gap between the two means the model memorised noise; uniformly low
              scores mean it never learned the signal.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Predictor</span>
              <select
                value={feature}
                onChange={e => setFeature(e.target.value)}
                className="h-10 px-3 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 cursor-pointer font-sans"
                id="fit-feature-select"
              >
                {columns.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{c}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Target</span>
              <select
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="h-10 px-3 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 cursor-pointer font-sans"
                id="fit-target-select"
              >
                {columns.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{c}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Degree</span>
              <select
                value={degree}
                onChange={e => setDegree(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 cursor-pointer font-sans"
                id="fit-degree-select"
              >
                {[1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{d}</option>)}
              </select>
            </label>

            <button
              onClick={runDiagnostics}
              disabled={isRunning || !feature || !target}
              className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer select-none"
              id="run-fit-diagnostics-btn"
            >
              {isRunning ? <Loader2 size={15} className="animate-spin" /> : <PlaySquare size={15} />}
              <span>{isRunning ? 'Evaluating…' : 'Run Diagnostics'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BACKEND OFFLINE / INSUFFICIENT DATA ───────────────────────────── */}
      {result && result.status !== 'ok' && (
        <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 flex items-start gap-3">
          <ServerCrash size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {result.status === 'insufficient_data' ? 'Not enough usable rows' : 'Diagnostics unavailable'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{result.message}</p>
          </div>
        </div>
      )}

      {result?.status === 'ok' && result.diagnosis && style && (
        <>
          {/* ── VERDICT BANNER ──────────────────────────────────────────────── */}
          <div className={`p-6 rounded-2xl border shadow-sm print-block ${style.bg} ${style.border}`} id="fit-verdict-banner">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <VerdictIcon size={28} className={`${style.color} shrink-0`} />
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className={`text-xl font-bold ${style.color}`}>{verdict}</h3>
                  {result.diagnosis.severity !== 'None' && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.border} ${style.color}`}>
                      {result.diagnosis.severity} severity
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{result.diagnosis.explanation}</p>
                <div className="flex items-start gap-2 pt-1">
                  <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">{result.diagnosis.recommendation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── METRIC CARDS ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Training R²', value: result.metrics!.train.r2.toFixed(3), sub: `n = ${result.metrics!.train.n}`, Icon: Layers },
              { label: 'Holdout R²', value: result.metrics!.holdout.r2.toFixed(3), sub: `n = ${result.metrics!.holdout.n}`, Icon: Target },
              { label: 'Generalization Gap', value: result.diagnosis.generalization_gap.toFixed(3), sub: 'train − holdout', Icon: GitCompare },
              { label: '5-Fold CV R²', value: result.cross_validation!.mean_r2.toFixed(3), sub: `± ${result.cross_validation!.std_r2.toFixed(3)}`, Icon: Activity }
            ].map(card => (
              <div key={card.label} className="p-4 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] shadow-xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <card.Icon size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">{card.label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{card.value}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* ── LEARNING CURVE + COMPLEXITY CURVE ───────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-sm print-block">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">Learning Curve</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                Error against training sample size. Curves that converge high = underfitting;
                a persistent gap = overfitting.
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={result.learning_curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="train_size" stroke={axisStroke} fontSize={11}
                    label={{ value: 'Training samples', position: 'insideBottom', offset: -4, fontSize: 10, fill: axisStroke }} />
                  <YAxis stroke={axisStroke} fontSize={11}
                    label={{ value: 'RMSE', angle: -90, position: 'insideLeft', fontSize: 10, fill: axisStroke }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="train_rmse" name="Training error" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="validation_rmse" name="Validation error" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-sm print-block">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                Model Complexity Curve
                {result.optimal_degree != null && (
                  <span className="ml-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                    best validation at degree {result.optimal_degree}
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                R² against polynomial degree. Where validation peaks and then falls away from
                training is the onset of overfitting.
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={result.complexity_curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="degree" stroke={axisStroke} fontSize={11}
                    label={{ value: 'Polynomial degree', position: 'insideBottom', offset: -4, fontSize: 10, fill: axisStroke }} />
                  <YAxis stroke={axisStroke} fontSize={11} domain={[0, 1]}
                    label={{ value: 'R²', angle: -90, position: 'insideLeft', fontSize: 10, fill: axisStroke }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {result.optimal_degree != null && (
                    <ReferenceLine x={result.optimal_degree} stroke="#10b981" strokeDasharray="4 4" />
                  )}
                  <Line type="monotone" dataKey="train_r2" name="Training R²" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="validation_r2" name="Validation R²" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── PREDICTED VS ACTUAL + RESIDUALS ─────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-sm print-block">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">Predicted vs Actual</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                Holdout points scattering further from the diagonal than training points is
                the signature of overfitting.
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis type="number" dataKey="actual" name="Actual" stroke={axisStroke} fontSize={11} />
                  <YAxis type="number" dataKey="predicted" name="Predicted" stroke={axisStroke} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Scatter name="Training" data={result.scatter!.filter(p => p.split === 'train')} fill="#3b82f6" fillOpacity={0.6} />
                  <Scatter name="Holdout" data={result.scatter!.filter(p => p.split === 'holdout')} fill="#f59e0b" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-sm print-block">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">Residual Plot</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                Residuals should scatter randomly around zero. Visible curvature means the
                model is too simple for the relationship.
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis type="number" dataKey="predicted" name="Predicted" stroke={axisStroke} fontSize={11} />
                  <YAxis type="number" dataKey="residual" name="Residual" stroke={axisStroke} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <ReferenceLine y={0} stroke="#10b981" strokeWidth={1.5} />
                  <Scatter name="Training" data={result.residuals!.filter(p => p.split === 'train')} fill="#3b82f6" fillOpacity={0.6} />
                  <Scatter name="Holdout" data={result.residuals!.filter(p => p.split === 'holdout')} fill="#f59e0b" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── DATA QUALITY FOOTNOTE ───────────────────────────────────────── */}
          {result.data_quality && (
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] text-[11px] flex flex-wrap gap-x-6 gap-y-2 print-block text-slate-600 dark:text-slate-400">
              <span><strong className="text-slate-900 dark:text-slate-100">{result.data_quality.usable_rows}</strong> usable rows of {result.data_quality.total_rows}</span>
              <span><strong className="text-slate-900 dark:text-slate-100">{result.data_quality.dropped_missing}</strong> dropped — missing or imputed</span>
              <span><strong className="text-slate-900 dark:text-slate-100">{result.data_quality.dropped_non_numeric}</strong> dropped — non-numeric</span>
              <span>Imputed placeholders are excluded from the fit so they cannot pass as observations.</span>
            </div>
          )}

          {/* Printed footer — screen-hidden */}
          <div className="print-only" style={{ marginTop: '1rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.4rem', fontSize: '8pt' }}>
            Verdict: <strong>{result.diagnosis.verdict}</strong> · Training R²{' '}
            {result.metrics!.train.r2.toFixed(3)} · Holdout R²{' '}
            {result.metrics!.holdout.r2.toFixed(3)} · Generalization gap{' '}
            {result.diagnosis.generalization_gap.toFixed(3)} · 5-fold CV R²{' '}
            {result.cross_validation!.mean_r2.toFixed(3)} ± {result.cross_validation!.std_r2.toFixed(3)}
          </div>
        </>
      )}
    </div>
  );
}
