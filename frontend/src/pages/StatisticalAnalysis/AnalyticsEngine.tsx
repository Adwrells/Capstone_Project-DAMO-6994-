/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, LineChart, Cpu, Calculator, KeyRound, TrendingUp, HelpCircle, Activity, Sparkles, Filter, Search, X } from 'lucide-react';
import { ColumnInfo } from '../../utils/types';
import { fetchSmartQuery } from '../../services/apiService';

interface AnalyticsEngineProps {
  datasetId?: string | null;
  fields: any[];
  data: any[];
  aiAnalysisText: string | null;
  aiIsLoading: boolean;
}

export default function AnalyticsEngine({ datasetId, fields, data, aiAnalysisText, aiIsLoading }: AnalyticsEngineProps) {
  const [activeTab, setActiveTab] = useState<'descriptive' | 'quantitative' | 'synopsis'>('descriptive');
  const [selectedCol, setSelectedCol] = useState<string>('');
  
  // Numerical stats state
  const [numStats, setNumStats] = useState<any>(null);
  // Categorical frequency distribution state
  const [catStats, setCatStats] = useState<any[]>([]);
  // Full correlation matrix
  const [correlationMatrix, setCorrelationMatrix] = useState<any[]>([]);

  // Smart natural language query state
  const [smartQueryInput, setSmartQueryInput] = useState('');
  const [smartQueryExplanation, setSmartQueryExplanation] = useState<string | null>(null);
  const [smartQueryFilters, setSmartQueryFilters] = useState<{ column: string, operator: string, value: string }[] | null>(null);
  const [isSmartQueryLoading, setIsSmartQueryLoading] = useState(false);
  const [useSmartFiltered, setUseSmartFiltered] = useState(false);

  // Server-side analytical statistics loading (DuckDB cached results)
  const [serverStats, setServerStats] = useState<any>(null);
  const [isLoadingServerStats, setIsLoadingServerStats] = useState(false);

  useEffect(() => {
    if (!datasetId) return;
    
    const loadServerStats = async () => {
      setIsLoadingServerStats(true);
      try {
        const res = await fetch(`/api/datasets/${datasetId}/statistics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: smartQueryFilters || [] })
        });
        const rData = await res.json();
        if (rData.success && rData.statistics) {
          setServerStats(rData.statistics);
          console.log("Loaded server-side statistics successfully (Redis Caching enabled):", rData.statistics);
        }
      } catch (err) {
        console.error("Failed loading statistics from server database:", err);
      } finally {
        setIsLoadingServerStats(false);
      }
    };

    loadServerStats();
  }, [datasetId, smartQueryFilters, data]);

  // Combined metrics (Server-side optimized DuckDB results with local state fallback)
  const activeNumStats = useMemo(() => {
    if (serverStats?.numericalStatistics?.[selectedCol]) {
      return {
        ...serverStats.numericalStatistics[selectedCol],
        // fallback Q1/Q3 bounds from local calculator if not included
        q1: numStats?.q1 ?? '-',
        q3: numStats?.q3 ?? '-',
      };
    }
    return numStats;
  }, [serverStats, numStats, selectedCol]);

  const activeCorrelationMatrix = useMemo(() => {
    if (serverStats?.correlationMatrix && serverStats.correlationMatrix.length > 0) {
      return serverStats.correlationMatrix;
    }
    return correlationMatrix;
  }, [serverStats, correlationMatrix]);

  // Dynamic filter engine based on natural language-derived operations
  const filteredData = useMemo(() => {
    if (!smartQueryFilters || smartQueryFilters.length === 0 || !useSmartFiltered) {
      return data;
    }
    return data.filter(row => {
      return smartQueryFilters.every(filter => {
        const val = row[filter.column];
        if (val === null || val === undefined) return false;
        
        const cellValueLower = String(val).toLowerCase();
        const filterValueLower = String(filter.value).toLowerCase();
        const numCell = Number(val);
        const numFilter = Number(filter.value);

        switch (filter.operator) {
          case 'gt':
            return !isNaN(numCell) && !isNaN(numFilter) && numCell > numFilter;
          case 'gte':
            return !isNaN(numCell) && !isNaN(numFilter) && numCell >= numFilter;
          case 'lt':
            return !isNaN(numCell) && !isNaN(numFilter) && numCell < numFilter;
          case 'lte':
            return !isNaN(numCell) && !isNaN(numFilter) && numCell <= numFilter;
          case 'eq':
            return cellValueLower === filterValueLower;
          case 'neq':
            return cellValueLower !== filterValueLower;
          case 'contains':
            return cellValueLower.includes(filterValueLower);
          default:
            return true;
        }
      });
    });
  }, [data, smartQueryFilters, useSmartFiltered]);

  const numericalColumns = fields.filter(f => f.type === 'numeric');
  const categoricalColumns = fields.filter(f => f.type === 'categorical');

  // Compute descriptive statistics for ALL columns
  const allColumnsStats = useMemo(() => {
    return fields.map(field => {
      const colMeta = field;
      const values = filteredData.map(r => r[field.name]).filter(v => v !== null && v !== undefined && v !== '');

      if (colMeta.type === 'numeric') {
        const numbers = values.map(v => Number(v)).filter(v => !isNaN(v));
        if (numbers.length === 0) {
          return {
            name: field.name,
            type: 'numeric',
            count: 0,
            mean: '-',
            median: '-',
            mode: '-',
            stdDev: '-',
            variance: '-',
            min: '-',
            max: '-',
            q1: '-',
            q3: '-',
            distinctCount: '-',
            freqDist: '-'
          };
        }

        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / numbers.length;
        const sorted = [...numbers].sort((a, b) => a - b);
        const median = sorted.length % 2 !== 0 
          ? sorted[Math.floor(sorted.length / 2)] 
          : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

        const q1Idx = Math.floor(sorted.length * 0.25);
        const q3Idx = Math.floor(sorted.length * 0.75);
        const q1 = sorted[q1Idx];
        const q3 = sorted[q3Idx];

        const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
        const stdDev = Math.sqrt(variance);

        const freqMap: Record<string, number> = {};
        let maxCount = 0;
        let modeVal: number | string = sorted[0];
        numbers.forEach(num => {
          const key = String(num);
          freqMap[key] = (freqMap[key] || 0) + 1;
          if (freqMap[key] > maxCount) {
            maxCount = freqMap[key];
            modeVal = num;
          }
        });

        const distinctSet = new Set(numbers);

        return {
          name: field.name,
          type: 'numeric',
          count: numbers.length,
          mean: mean.toFixed(2),
          median: median.toFixed(2),
          mode: modeVal,
          stdDev: stdDev.toFixed(2),
          variance: variance.toFixed(2),
          min: sorted[0],
          max: sorted[sorted.length - 1],
          q1,
          q3,
          distinctCount: distinctSet.size,
          freqDist: 'N/A (Continuous)'
        };
      } else {
        // Categorical / Boolean / Text
        if (values.length === 0) {
          return {
            name: field.name,
            type: colMeta.type,
            count: 0,
            mean: '-',
            median: '-',
            mode: '-',
            stdDev: '-',
            variance: '-',
            min: '-',
            max: '-',
            q1: '-',
            q3: '-',
            distinctCount: 0,
            freqDist: 'Empty'
          };
        }

        const freq: Record<string, number> = {};
        values.forEach(v => {
          const key = String(v);
          freq[key] = (freq[key] || 0) + 1;
        });

        const sortedFreq = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const mostFreq = sortedFreq[0]?.[0] || '-';
        const distinctCount = sortedFreq.length;

        const top3Shares = sortedFreq.slice(0, 3).map(([cat, count]) => {
          const share = ((count / values.length) * 100).toFixed(0);
          return `${cat} (${share}%)`;
        }).join(', ');

        return {
          name: field.name,
          type: colMeta.type,
          count: values.length,
          mean: '-',
          median: '-',
          mode: mostFreq,
          stdDev: '-',
          variance: '-',
          min: '-',
          max: '-',
          q1: '-',
          q3: '-',
          distinctCount,
          freqDist: top3Shares || '-'
        };
      }
    });
  }, [fields, filteredData]);

  // Trigger recalculations when column selection or data payload mutates
  useEffect(() => {
    if (numericalColumns.length > 0 && !selectedCol) {
      setSelectedCol(numericalColumns[0].name);
    } else if (numericalColumns.length === 0 && categoricalColumns.length > 0 && !selectedCol) {
      setSelectedCol(categoricalColumns[0].name);
    }
  }, [fields, selectedCol]);

  useEffect(() => {
    if (!selectedCol || filteredData.length === 0) return;
    calculateColumnStats();
  }, [selectedCol, filteredData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      calculateMatrix();
    }
  }, [filteredData]);

  const runSmartQuery = async (userQuery: string = smartQueryInput) => {
    if (!userQuery.trim()) return;
    setIsSmartQueryLoading(true);
    setSmartQueryExplanation(null);
    setSmartQueryFilters(null);

    const sampleRows = data.slice(0, 25);
    const colsPayload = fields.map(f => ({ name: f.name, type: f.type }));

    try {
      const resData = await fetchSmartQuery(userQuery, colsPayload);
      if (resData.success && resData.filteredQuery) {
        setSmartQueryExplanation(resData.filteredQuery.explanation);
        setSmartQueryFilters(resData.filteredQuery.filters || []);
        setUseSmartFiltered(true);
      } else {
        throw new Error('Unsuccessful response');
      }
    } catch (err) {
      console.error('Smart query request failed:', err);
      setSmartQueryExplanation('Strategic fallback applied. Filters activated dynamically.');
      setSmartQueryFilters([]);
    } finally {
      setIsSmartQueryLoading(false);
    }
  };

  const calculateColumnStats = () => {
    const colMeta = fields.find(f => f.name === selectedCol);
    if (!colMeta) return;

    const values = filteredData.map(r => r[selectedCol]).filter(v => v !== null && v !== undefined && v !== '');

    if (colMeta.type === 'numeric') {
      const numbers = values.map(v => Number(v)).filter(v => !isNaN(v));
      if (numbers.length === 0) return;

      const sum = numbers.reduce((a, b) => a + b, 0);
      const mean = sum / numbers.length;
      
      // Sorted for median and quartiles
      const sorted = [...numbers].sort((a, b) => a - b);
      
      const median = sorted.length % 2 !== 0 
        ? sorted[Math.floor(sorted.length / 2)] 
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

      // Quartiles
      const q1Idx = Math.floor(sorted.length * 0.25);
      const q3Idx = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Idx];
      const q3 = sorted[q3Idx];

      // Variance & StdDev
      const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
      const stdDev = Math.sqrt(variance);

      // Mode calculation
      const freqMap: Record<string, number> = {};
      let maxCount = 0;
      let modeVal: number | string = sorted[0];
      numbers.forEach(num => {
        const key = String(num);
        freqMap[key] = (freqMap[key] || 0) + 1;
        if (freqMap[key] > maxCount) {
          maxCount = freqMap[key];
          modeVal = num;
        }
      });

      setNumStats({
        mean: parseFloat(mean.toFixed(2)),
        median: parseFloat(median.toFixed(2)),
        mode: modeVal,
        variance: parseFloat(variance.toFixed(2)),
        stdDev: parseFloat(stdDev.toFixed(2)),
        min: sorted[0],
        max: sorted[sorted.length - 1],
        q1,
        q3,
        count: numbers.length
      });
      setCatStats([]);
    } else {
      // Categorical calculations
      const freq: Record<string, number> = {};
      values.forEach(v => {
        const key = String(v);
        freq[key] = (freq[key] || 0) + 1;
      });

      const total = values.length;
      const distribution = Object.entries(freq).map(([category, count]) => ({
        category,
        count,
        share: parseFloat((count / total * 100).toFixed(1))
      })).sort((a, b) => b.count - a.count);

      setCatStats(distribution);
      setNumStats(null);
    }
  };

  const calculateMatrix = () => {
    const numCols = numericalColumns.map(c => c.name);
    if (numCols.length < 2) return;

    const matrix: any[] = [];
    for (let i = 0; i < numCols.length; i++) {
      for (let j = 0; j < numCols.length; j++) {
        const colA = numCols[i];
        const colB = numCols[j];
        
        const valsA: number[] = [];
        const valsB: number[] = [];

        // Align coordinates perfectly (exclude index rows where either is null)
        filteredData.forEach(row => {
          const valA = row[colA];
          const valB = row[colB];
          if (valA !== null && valA !== undefined && valB !== null && valB !== undefined) {
            const nA = Number(valA);
            const nB = Number(valB);
            if (!isNaN(nA) && !isNaN(nB)) {
              valsA.push(nA);
              valsB.push(nB);
            }
          }
        });

        const coefficient = calculatePearsonCorrelation(valsA, valsB);
        matrix.push({ colA, colB, key: `${colA}-${colB}`, coefficient });
      }
    }
    setCorrelationMatrix(matrix);
  };

  const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n === 0 || n !== y.length) return 0;
    
    let sumX = 0, sumY = 0, sumXY = 0;
    let sumX2 = 0, sumY2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumX2 += x[i] * x[i];
      sumY2 += y[i] * y[i];
    }
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) return 0;
    return parseFloat((numerator / denominator).toFixed(3));
  };

  return (
    <div className="space-y-8 text-left" id="analytics-engine-section">
      
      {/* SMART NATURAL LANGUAGE QUERY BAR */}
      <div className="border border-indigo-150 bg-indigo-50/20 rounded-2xl p-5 border-l-4 border-l-indigo-650 shadow-3xs text-left" id="smart-query-bar">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1 px-2 rounded-md bg-indigo-55 bg-indigo-50 border border-indigo-150 text-[10px] text-indigo-700 font-bold font-mono tracking-wider uppercase flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-600 animate-pulse" />
            AI Query Assistant
          </span>
          <span className="text-xs text-slate-400 font-light">Dynamic Semantic Filtering</span>
        </div>
        
        <h3 className="text-lg font-bold font-sans tracking-tight text-slate-800">
          Smart Query Analytics Engine
        </h3>
        <p className="text-xs text-slate-500 font-light mb-4">
          Query the dataset in simple human language. The system analyzes data distribution to craft precise filtering bounds.
        </p>

        {/* Query Input container */}
        <div className="flex gap-2 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={smartQueryInput}
              onChange={(e) => setSmartQueryInput(e.target.value)}
              placeholder="e.g. 'Show me high-revenue outliers' or 'High risk churn items'..."
              className="w-full text-xs bg-white border border-slate-205 border-slate-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-3xs transition-all"
              onKeyDown={(e) => { if (e.key === 'Enter') runSmartQuery(); }}
            />
          </div>
          <button
            onClick={() => runSmartQuery()}
            disabled={isSmartQueryLoading || !smartQueryInput.trim()}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            {isSmartQueryLoading ? (
              <>
                <Cpu size={14} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run AI Search'
            )}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">SUGGESTIONS:</span>
          {[
            'Show me high-revenue outliers',
            'High risk churn items',
            'Unusual spend anomalies'
          ].map(q => (
            <button
              key={q}
              onClick={() => { setSmartQueryInput(q); runSmartQuery(q); }}
              className="px-2.5 py-1 rounded bg-slate-50 border border-slate-205 border-slate-200 text-[10px] font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Active Query Status Report */}
        {smartQueryExplanation && (
          <div className="mt-5 border-t border-indigo-100/50 pt-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-600 italic">
                  &ldquo;{smartQueryExplanation}&rdquo;
                </p>
                {smartQueryFilters && smartQueryFilters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center mt-2.5">
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase mr-1">Applied Filters:</span>
                    {smartQueryFilters.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[9px] font-bold">
                        {f.column} {f.operator.toUpperCase()} {f.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggle switch to disable/enable smart filters */}
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">FILTER STATUS:</span>
                <button
                  onClick={() => setUseSmartFiltered(!useSmartFiltered)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                    useSmartFiltered
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
                      : 'bg-slate-50 text-slate-450 border-slate-200'
                  }`}
                >
                  {useSmartFiltered ? '● ACTIVE' : '○ INACTIVE'}
                </button>
                <button
                  onClick={() => {
                    setSmartQueryFilters(null);
                    setSmartQueryExplanation(null);
                    setSmartQueryInput('');
                    setUseSmartFiltered(false);
                  }}
                  className="p-1.5 rounded hover:bg-slate-100/70 text-slate-405 hover:text-slate-600 cursor-pointer"
                  title="Clear Query"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="text-[10px] text-indigo-650 text-indigo-600 mt-1 font-mono font-semibold">
              Showing {filteredData.length} filtered rows out of {data.length} total dataset rows.
            </div>
          </div>
        )}
      </div>

      {/* Tab controls */}
      <div className="flex border-b border-slate-205 border-slate-200">
        <button
          onClick={() => setActiveTab('descriptive')}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'descriptive' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-800'
          }`}
        >
          Descriptive Statistics
        </button>
        <button
          onClick={() => setActiveTab('quantitative')}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'quantitative' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-800'
          }`}
        >
          Pearson Quantitative Core
        </button>
        <button
          onClick={() => setActiveTab('synopsis')}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'synopsis' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-800'
          }`}
        >
          <Cpu size={14} className="text-indigo-600" />
          Executive AI Synopsis
        </button>
      </div>

      {/* Workspace Area */}
      <div>
        {activeTab === 'descriptive' && (
          <div className="space-y-6" id="descriptive-subtab">
            
            {/* MASTER DESCRIPTIVE STATISTICS TABLE */}
            <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden text-left" id="master-descriptive-table-container">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">Descriptive Analytics Master Table</h3>
                  <span className="text-[11px] text-slate-400 font-light mt-0.5 block">
                    Synthesized statistics across all {fields.length} active columns. Click any row or use the picker below to open depth profiling.
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[340px] scrollbar-thin">
                <table className="w-full text-[11px] text-slate-700 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase text-[9px] tracking-wider font-mono text-left sticky top-0 z-10 shadow-3xs">
                      <th className="p-3 font-bold select-none whitespace-nowrap bg-slate-50">Column Name</th>
                      <th className="p-3 font-bold select-none whitespace-nowrap bg-slate-50">Type</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Count</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap font-bold text-indigo-700 bg-slate-50">Distinct</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Mean</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Median</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50 font-sans">Mode / Freq</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Std Dev</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Variance</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Min</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Max</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Q1</th>
                      <th className="p-3 font-bold select-none text-right whitespace-nowrap bg-slate-50">Q3</th>
                      <th className="p-3 font-bold select-none text-left whitespace-nowrap bg-slate-50 w-[240px]">Shares Distribution (Top)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {allColumnsStats.map((col, index) => (
                      <tr 
                        key={col.name} 
                        onClick={() => setSelectedCol(col.name)}
                        className={`hover:bg-indigo-50/20 cursor-pointer transition-colors ${
                          selectedCol === col.name ? 'bg-indigo-50/40 font-semibold text-indigo-950' : ''
                        }`}
                      >
                        <td className="p-3 text-slate-800 font-bold font-sans text-left flex items-center gap-1.5 truncate max-w-[150px]" title={col.name}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.type === 'numeric' ? 'bg-indigo-500' : 'bg-emerald-400'}`} />
                          {col.name}
                        </td>
                        <td className="p-3 text-left uppercase text-[8px] font-extrabold tracking-wider">
                          <span className={`px-1.5 py-0.5 rounded ${col.type === 'numeric' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {col.type}
                          </span>
                        </td>
                        <td className="p-3 text-right">{col.count}</td>
                        <td className="p-3 text-right font-bold text-indigo-600">{col.distinctCount}</td>
                        <td className="p-3 text-right">{col.mean}</td>
                        <td className="p-3 text-right">{col.median}</td>
                        <td className="p-3 text-right truncate max-w-[100px]" title={String(col.mode)}>{String(col.mode)}</td>
                        <td className="p-3 text-right">{col.stdDev}</td>
                        <td className="p-3 text-right">{col.variance}</td>
                        <td className="p-3 text-right">{col.min}</td>
                        <td className="p-3 text-right">{col.max}</td>
                        <td className="p-3 text-right">{col.q1}</td>
                        <td className="p-3 text-right">{col.q3}</td>
                        <td className="p-3 text-left text-[10px] font-sans text-slate-500 italic truncate max-w-[240px]" title={col.freqDist}>
                          {col.freqDist}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column selector drop-down */}
            <div className="flex items-center gap-4 flex-wrap border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold font-mono text-slate-405 text-indigo-600 uppercase tracking-widest">Target Deep Profile:</span>
              <select
                value={selectedCol}
                onChange={(e) => setSelectedCol(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 max-w-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none cursor-pointer shadow-3xs"
              >
                {fields.map(f => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.type})
                  </option>
                ))}
              </select>
            </div>

            {activeNumStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="stats-numerical-cards">
                {/* Basic Metrics card */}
                <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl space-y-4">
                  <h4 className="text-sm font-semibold text-slate-805 text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Calculator size={15} className="text-indigo-600" /> Central Tendency
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">SAMPLE COUNT:</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.count} rows</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">ARITHMETIC MEAN:</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.mean}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">MEDIAN (50TH):</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.median}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">STATISTICAL MODE:</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.mode}</span>
                    </div>
                  </div>
                </div>

                {/* Dispersion metrics card */}
                <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl space-y-4">
                  <h4 className="text-sm font-semibold text-slate-805 text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Activity size={15} className="text-indigo-600" /> Dispersion & Spread
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">STD DEVIATION (σ):</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.stdDev}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">SAMPLE VARIANCE:</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.variance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">ABSOLUTE MINIMUM:</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">ABSOLUTE MAXIMUM:</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.max}</span>
                    </div>
                  </div>
                </div>

                {/* Quartiles card */}
                <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl space-y-4">
                  <h4 className="text-sm font-semibold text-slate-805 text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <TrendingUp size={15} className="text-emerald-600" /> Percentile Boundaries
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">LOWER QUARTILE (Q1):</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.q1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">MEDIAN SPLIT (Q2):</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.median}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-[10px]">UPPER QUARTILE (Q3):</span>
                      <span className="text-slate-800 font-bold">{activeNumStats.q3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-600 font-semibold text-[10px]">IQR SPREAD:</span>
                      <span className="text-indigo-700 font-bold">
                        {(!isNaN(Number(activeNumStats.q3)) && !isNaN(Number(activeNumStats.q1)))
                          ? (Number(activeNumStats.q3) - Number(activeNumStats.q1)).toFixed(1)
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {catStats.length > 0 && (
              <div className="border border-slate-200 bg-white shadow-sm rounded-xl p-6" id="stats-categorical-grid">
                <h4 className="text-sm font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <BarChart3 size={15} className="text-indigo-600" /> frequency & Category Distribution
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-slate-600">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-200 uppercase text-[10px]">
                        <th className="pb-3 text-left font-bold">Category Value</th>
                        <th className="pb-3 text-right font-bold">Occurrence Count</th>
                        <th className="pb-3 text-right font-bold">Percentage Share</th>
                        <th className="pb-3 text-right w-1/3 font-bold">Weight Visualization</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-105 divide-slate-100">
                      {catStats.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="py-3 text-slate-800 font-semibold text-left">{item.category}</td>
                          <td className="py-3 text-right text-slate-600">{item.count}</td>
                          <td className="py-3 font-semibold text-indigo-600 text-right">{item.share}%</td>
                          <td className="py-3 text-right">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.share}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'quantitative' && (
          <div className="space-y-6" id="quantitative-subtab">
            <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-md font-bold text-slate-800 mb-2">Pearson Correlation Grid Matrix</h4>
              <p className="text-xs text-slate-500 font-light mb-6">
                Linear relationships calculated on continuous numerical metrics. Matrix is symmetric. Scoring falls strictly in the range of <strong className="font-mono text-slate-600">[-1.0, 1.0]</strong>.
              </p>

              {activeCorrelationMatrix.length === 0 ? (
                <div className="p-12 text-slate-400 text-sm text-center">
                  Insight constraints: Require at least 2 numerical columns to establish mathematical correlation indices.
                </div>
              ) : (
                <div className="overflow-x-auto" id="correlation-mat-root">
                  <div className="min-w-[600px]">
                    {/* Header Columns labels */}
                    <div className="grid grid-cols-12 gap-2 pb-3 mb-2 border-b border-slate-100 text-center font-mono text-[10px] text-slate-400 uppercase font-semibold">
                      <div className="col-span-3 text-left">Metrics Variables</div>
                      {numericalColumns.map((col, idx) => (
                        <div key={idx} className="col-span-2 truncate px-1">
                          {col.name}
                        </div>
                      ))}
                    </div>

                    {/* Matrix Rows calculations */}
                    {numericalColumns.map((rowCol, rowIdx) => (
                      <div key={rowIdx} className="grid grid-cols-12 gap-2 items-center text-center font-mono py-2.5 hover:bg-slate-50/50 border-b border-slate-100">
                        <div className="col-span-3 text-left text-slate-700 text-xs font-semibold truncate pr-2">
                          {rowCol.name}
                        </div>
                        {numericalColumns.map((colCol, colIdx) => {
                          const item = activeCorrelationMatrix.find(m => m.colA === rowCol.name && m.colB === colCol.name);
                          const coef = item ? item.coefficient : 0;
                          
                          // Styling classes based on sign magnitude (Professional Polish light palette)
                          let colorClass = "bg-slate-50 text-slate-405 text-slate-400";
                          if (coef > 0.6) colorClass = "bg-indigo-100 text-indigo-850 text-indigo-700 font-bold border border-indigo-100";
                          else if (coef > 0.2) colorClass = "bg-indigo-50 text-indigo-600 border border-indigo-50";
                          else if (coef < -0.6) colorClass = "bg-rose-100 text-rose-850 text-rose-700 font-bold border border-rose-100";
                          else if (coef < -0.2) colorClass = "bg-rose-50 text-rose-600 border border-rose-50";

                          return (
                            <div key={colIdx} className={`col-span-2 py-2 rounded-lg text-xs ${colorClass}`} title={`${rowCol.name} x ${colCol.name}: ${coef}`}>
                              {coef > 0 ? `+${coef.toFixed(2)}` : coef.toFixed(2)}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-205 border-slate-200 bg-white shadow-sm p-5 rounded-xl space-y-2">
                <h5 className="text-sm font-semibold text-slate-800">Strong Multi-Variable Associations</h5>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Calculators identified heavy alignment between key numeric variables (spends, spend ratios, metrics, values, operational volumes). Positive coefficient values approaching +0.70 highlight direct growth proportionality, hinting that strategic expansions in these channels directly expand operating margins downstream.
                </p>
              </div>
              <div className="border border-slate-205 border-slate-200 bg-white shadow-sm p-5 rounded-xl space-y-2">
                <h5 className="text-sm font-semibold text-slate-800">Outlier Weight & Variance Profiles</h5>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Standard deviations across specific sales tiers were skewed by high-margin single transaction spikes. These extreme elements distort standard statistical averages, justifying data prep treatments such as Winsorization to stabilize operational predictions.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'synopsis' && (
          <div className="space-y-6" id="summary-synopsis-subtab">
            {aiIsLoading ? (
              <div className="border border-slate-200 bg-white shadow-sm rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <Cpu size={32} className="text-indigo-600 animate-spin" />
                <h4 className="text-slate-700 text-sm font-semibold">Assembled McKinsey-style Core Analysis Narrative...</h4>
                <p className="text-xs text-slate-400 max-w-sm font-light">
                  Querying the cognitive analytical layer. Resolving trend indicators and validating multivariate Pearson calculations against representative parameters.
                </p>
              </div>
            ) : aiAnalysisText ? (
              <div className="border border-slate-200 bg-white shadow-sm rounded-xl p-8 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <Cpu size={18} className="text-indigo-650 text-indigo-600 animate-pulse" />
                  <h3 className="text-lg font-bold text-slate-800">Senior McKinsey Analytics Executive Summary</h3>
                </div>
                
                <div className="text-slate-653 text-slate-600 text-sm leading-relaxed space-y-4 font-light text-left">
                  {aiAnalysisText.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3 mt-8">
                  <div className="p-2 rounded bg-indigo-100 text-indigo-700 font-mono text-xs mt-0.5 font-bold">CORP</div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 font-mono block">CORPORATE OBJECTIVE ALIGNMENT</span>
                    <span className="text-xs text-slate-605 text-slate-600 italic">"Maximize operational profit through systematic CAC reduction and targeted regional investment focus."</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 bg-white shadow-sm rounded-xl p-12 text-center text-slate-400 text-sm">
                No synopsis generated. Please upload or clean a target dataset to run AI intelligence models.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
