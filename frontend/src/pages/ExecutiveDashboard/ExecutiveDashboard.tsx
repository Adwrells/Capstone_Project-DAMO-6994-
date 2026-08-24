/**
 * Healthcare Analytics Platform — Executive Dashboard
 * Emergency Department Wait Times & Resource Burden Analysis
 * University of Niagara Falls — DAMO-6994 Capstone
 *
 * Sections:
 *  1. Title Banner
 *  2. 8 Filters (Fiscal Year, Sex, Age Group, Population Category, CTAS Level, Visit Disposition + 2 custom)
 *  3. 5 KPI Cards
 *  4. 9 Charts — each with chart-type switcher + column dropdowns for X/Y axes
 *     Line×2 | Bar×3 | Column×2 | Area×1 | Funnel×1
 *  5. Descriptive Statistics — top 5 numeric columns
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,   Line,
  BarChart,    Bar,
  AreaChart,   Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, Cell,
} from 'recharts';
import {
  Activity, AlertCircle, BarChart2, ChevronDown, ChevronUp,
  Filter, RefreshCw, Settings, TrendingDown, TrendingUp,
  Users, Clock, Zap, BookOpen, X,
} from 'lucide-react';
import { KPIItem, CustomVisualization } from '../../utils/types';

// ─── palettes ──────────────────────────────────────────────────────────────────
const PALETTES: Record<string, string[]> = {
  clinical: ['#0F4C81','#118d95','#2E8B57','#f59e0b','#e11d48','#8b5cf6','#0ea5e9'],
  powerbi:  ['#f2c811','#118d95','#8064a2','#335c81','#1164b4','#ef5b34','#2ca02c'],
  tableau:  ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2'],
  emerald:  ['#10b981','#059669','#34d399','#047857','#065f46','#6ee7b7','#022c22'],
};

// ─── stat helpers ───────────────────────────────────────────────────────────────
const toNums = (arr: any[], col: string) =>
  arr.map(r => Number(r[col])).filter(v => !isNaN(v));

const calcMean   = (v: number[]) => v.length ? v.reduce((a,b) => a+b, 0)/v.length : 0;
const calcMedian = (v: number[]) => {
  if (!v.length) return 0;
  const s = [...v].sort((a,b) => a-b);
  const m = Math.floor(s.length/2);
  return s.length%2 ? s[m] : (s[m-1]+s[m])/2;
};
const calcStddev = (v: number[], m: number) =>
  v.length < 2 ? 0 : Math.sqrt(v.reduce((s,x) => s+(x-m)**2, 0)/(v.length-1));

/** Plain number formatter for tables / raw display */
const fmtNum = (n: number, dp=1) =>
  Number.isFinite(n) ? n.toLocaleString(undefined,{maximumFractionDigits:dp}) : '—';

/** Compact k / M / B formatter for axes, labels, tooltips */
const fmtK = (n: number): string => {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n/1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000)     return `${(n/1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)         return `${(n/1_000).toFixed(1)}k`;
  return n.toFixed(abs < 10 ? 2 : 1);
};

// ─── chart types ────────────────────────────────────────────────────────────────
type ChartKind = 'line'|'bar'|'column'|'area'|'funnel';

interface ChartCfg {
  kind:        ChartKind;
  xCol:        string;
  yCol:        string;
  agg:         'sum'|'median'|'mean'|'count';
  color:       string;
  strokeWidth: number;
  showGrid:    boolean;
  showLegend:  boolean;
  showLabels:  boolean;
  smooth:      boolean;
  refLine:     boolean;
  yMin:        string;
  yMax:        string;
}

// defaults per chart slot  (labels ON by default)
const defaultCfg = (kind: ChartKind, xCol='', yCol='', color='#0F4C81'): ChartCfg => ({
  kind, xCol, yCol, agg:'sum', color,
  strokeWidth:2, showGrid:true, showLegend:false,
  showLabels:true, smooth:true, refLine:false,
  yMin:'', yMax:'',
});

// ─── Custom k/M/B label rendered as SVG <text> ───────────────────────────────────────
// `position` determines offset direction: 'top' shifts Y up, 'right' shifts X right
function KLabel(props: any) {
  const { x=0, y=0, value, width=0, height=0, fill='#94a3b8', position='top' } = props;
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  const label = fmtK(num);
  // place text above the bar/point (top) or to the right of horizontal bars
  const tx = position === 'right' ? x + (width ?? 0) + 6 : x + (width ?? 0) / 2;
  const ty = position === 'top'   ? y - 5                 : y + (height ?? 0) / 2 + 1;
  return (
    <text x={tx} y={ty} fill={fill} fontSize={8} fontWeight={600}
      textAnchor={position === 'right' ? 'start' : 'middle'}
      dominantBaseline={position === 'right' ? 'middle' : 'auto'}>
      {label}
    </text>
  );
}

// ─── Funnel component ───────────────────────────────────────────────────────────
function FunnelViz({ data, colors, dark }: { data:{name:string;value:number}[]; colors:string[]; dark:boolean }) {
  if (!data.length) return <div className="h-full flex items-center justify-center text-xs text-slate-400">No data</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col gap-2 h-full justify-center px-6 py-2">
      {data.map((d, i) => {
        const pct = (d.value/max)*100;
        return (
          <div key={d.name} className="flex items-center gap-3">
            <span className={`text-[10px] font-semibold w-32 text-right shrink-0 ${dark?'text-slate-300':'text-slate-600'}`}>
              {d.name}
            </span>
            <div className="flex-1 relative h-7 flex items-center justify-center">
              <div
                style={{ width:`${pct}%`, backgroundColor: colors[i%colors.length] }}
                className="absolute h-full left-0 rounded transition-all duration-500"
              />
              <span className="relative z-10 text-white text-[9px] font-bold drop-shadow">
                {fmtK(d.value)}
              </span>
            </div>
            <span className={`text-[9px] w-10 text-right shrink-0 ${dark?'text-slate-400':'text-slate-500'}`}>
              {pct.toFixed(0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── universal chart renderer ───────────────────────────────────────────────────
function UniversalChart({
  id, cfg, data, filtered, colors, dark, catCols, numCols,
  defaultTitle,
}: {
  id: string;
  cfg: ChartCfg;
  data: any[];          // full dataset (unused here, just for reference)
  filtered: any[];      // filtered dataset to render from
  colors: string[];
  dark: boolean;
  catCols: string[];
  numCols: string[];
  defaultTitle: string;
}) {
  // aggregate data from filtered
  const chartData = useMemo(() => {
    if (!cfg.xCol || !cfg.yCol) return [];
    const map: Record<string,number[]> = {};
    filtered.forEach(r => {
      const k = String(r[cfg.xCol] ?? 'Unknown');
      const v = Number(r[cfg.yCol] ?? 0);
      if (!map[k]) map[k] = [];
      if (!isNaN(v)) map[k].push(v);
    });
    return Object.entries(map).map(([name, vals]) => {
      let value = 0;
      if      (cfg.agg === 'sum')    value = vals.reduce((a,b)=>a+b,0);
      else if (cfg.agg === 'mean')   value = calcMean(vals);
      else if (cfg.agg === 'median') value = calcMedian(vals);
      else                           value = vals.length;
      return { name, value: parseFloat(value.toFixed(2)) };
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [filtered, cfg.xCol, cfg.yCol, cfg.agg]);

  const tipStyle = {
    backgroundColor: dark?'#1e293b':'#fff',
    border: dark?'1px solid #334155':'1px solid #e2e8f0',
    borderRadius:8, fontSize:11,
  };
  const gridStroke = dark?'#334155':'#f1f5f9';
  const axisStroke = dark?'#94a3b8':'#64748b';
  const domain: [number|string, number|string] = [
    cfg.yMin !== '' ? Number(cfg.yMin) : 'auto',
    cfg.yMax !== '' ? Number(cfg.yMax) : 'auto',
  ];
  const avgV = calcMean(chartData.map(d=>d.value));
  const labelFill = dark ? '#e2e8f0' : '#334155';

  if (cfg.kind === 'funnel') {
    return <FunnelViz data={chartData} colors={colors} dark={dark} />;
  }

  if (!cfg.xCol || !cfg.yCol) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">Select X &amp; Y columns above</div>;
  }

  if (chartData.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No data for selected columns</div>;
  }

  if (cfg.kind === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{left:0,right:16,top:22,bottom:5}}>
          {cfg.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>}
          <XAxis dataKey="name" stroke={axisStroke} fontSize={9} angle={-20} textAnchor="end" height={38}/>
          <YAxis stroke={axisStroke} fontSize={9} domain={domain} tickFormatter={fmtK}/>
          <Tooltip contentStyle={tipStyle} formatter={(v:number)=>[fmtK(v), cfg.yCol]}/>
          {cfg.showLegend && <Legend wrapperStyle={{fontSize:10}}/>}
          {cfg.refLine && <ReferenceLine y={avgV} stroke="#f43f5e" strokeDasharray="4 4" label={{value:'Avg',fontSize:8,fill:'#f43f5e'}}/>}
          <Line
            type={cfg.smooth?'monotone':'linear'}
            dataKey="value" name={cfg.yCol}
            stroke={cfg.color} strokeWidth={cfg.strokeWidth}
            dot={{r:3,fill:cfg.color}}
            label={cfg.showLabels
              ? (p:any) => <KLabel {...p} fill={labelFill} position="top"/>
              : false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (cfg.kind === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{left:0,right:16,top:22,bottom:5}}>
          <defs>
            <linearGradient id={`ag-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={cfg.color} stopOpacity={0.35}/>
              <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          {cfg.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>}
          <XAxis dataKey="name" stroke={axisStroke} fontSize={9} angle={-20} textAnchor="end" height={38}/>
          <YAxis stroke={axisStroke} fontSize={9} domain={domain} tickFormatter={fmtK}/>
          <Tooltip contentStyle={tipStyle} formatter={(v:number)=>[fmtK(v), cfg.yCol]}/>
          {cfg.showLegend && <Legend wrapperStyle={{fontSize:10}}/>}
          {cfg.refLine && <ReferenceLine y={avgV} stroke="#f43f5e" strokeDasharray="4 4" label={{value:'Avg',fontSize:8,fill:'#f43f5e'}}/>}
          <Area type={cfg.smooth?'monotone':'linear'} dataKey="value" name={cfg.yCol}
            stroke={cfg.color} strokeWidth={cfg.strokeWidth} fill={`url(#ag-${id})`}
            label={cfg.showLabels
              ? (p:any) => <KLabel {...p} fill={labelFill} position="top"/>
              : false}/>
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (cfg.kind === 'bar') {
    // horizontal bar
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{left:10,right:50,top:5,bottom:5}}>
          {cfg.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>}
          <XAxis type="number" stroke={axisStroke} fontSize={9} domain={domain} tickFormatter={fmtK}/>
          <YAxis dataKey="name" type="category" stroke={axisStroke} fontSize={9} width={110}/>
          <Tooltip contentStyle={tipStyle} formatter={(v:number)=>[fmtK(v), cfg.yCol]}/>
          {cfg.showLegend && <Legend wrapperStyle={{fontSize:10}}/>}
          {cfg.refLine && <ReferenceLine x={avgV} stroke="#f43f5e" strokeDasharray="4 4" label={{value:'Avg',fontSize:8,fill:'#f43f5e'}}/>}
          <Bar dataKey="value" name={cfg.yCol} fill={cfg.color} radius={[0,4,4,0]}
            label={cfg.showLabels
              ? (p:any) => <KLabel {...p} fill={labelFill} position="right"/>
              : false}>
            {chartData.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // column (vertical bar)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{left:0,right:10,top:22,bottom:5}}>
        {cfg.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>}
        <XAxis dataKey="name" stroke={axisStroke} fontSize={9} angle={-15} textAnchor="end" height={42}/>
        <YAxis stroke={axisStroke} fontSize={9} domain={domain} tickFormatter={fmtK}/>
        <Tooltip contentStyle={tipStyle} formatter={(v:number)=>[fmtK(v), cfg.yCol]}/>
        {cfg.showLegend && <Legend wrapperStyle={{fontSize:10}}/>}
        {cfg.refLine && <ReferenceLine y={avgV} stroke="#f43f5e" strokeDasharray="4 4" label={{value:'Avg',fontSize:8,fill:'#f43f5e'}}/>}
        <Bar dataKey="value" name={cfg.yCol} fill={cfg.color} radius={[4,4,0,0]}
          label={cfg.showLabels
            ? (p:any) => <KLabel {...p} fill={labelFill} position="top"/>
            : false}>
          {chartData.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── per-chart customisation panel ────────────────────────────────────────────
function ChartConfig({
  cfg, onChange, catCols, numCols, dark, allowFunnel,
}: {
  cfg: ChartCfg;
  onChange: (c: ChartCfg) => void;
  catCols: string[];
  numCols: string[];
  dark: boolean;
  allowFunnel?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const sel = `text-[10px] rounded border px-2 py-1 w-full cursor-pointer
    ${dark?'bg-[#0f1d33] border-[#1e2d4a] text-slate-200':'bg-white border-slate-200 text-slate-700'}`;
  const inp = `text-[10px] rounded border px-2 py-1 w-full
    ${dark?'bg-[#0f1d33] border-[#1e2d4a] text-slate-200':'bg-white border-slate-200 text-slate-700'}`;

  const kinds: ChartKind[] = allowFunnel
    ? ['line','column','bar','area','funnel']
    : ['line','column','bar','area'];

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold cursor-pointer transition
          ${dark?'bg-[#182640] border-[#1e2d4a] text-slate-300 hover:bg-[#1e2d4a]'
               :'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
        <Settings size={11}/>
        Customise
        {open ? <ChevronUp size={10}/> : <ChevronDown size={10}/>}
      </button>

      {open && (
        <div className={`absolute right-0 top-9 z-50 w-72 p-4 rounded-2xl border shadow-2xl space-y-3
          ${dark?'bg-[#0f1d33] border-[#1e2d4a]':'bg-white border-slate-200'}`}>
          {/* header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1e2d4a]">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Chart Settings</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X size={12}/>
            </button>
          </div>

          {/* Chart type */}
          <div>
            <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Chart Type</label>
            <div className="grid grid-cols-5 gap-1">
              {kinds.map(k => (
                <button key={k}
                  onClick={() => onChange({...cfg, kind:k})}
                  className={`py-1 px-1 rounded text-[9px] font-bold uppercase cursor-pointer transition
                    ${cfg.kind===k
                      ? 'bg-[#0F4C81] text-white shadow'
                      : dark?'bg-[#182640] text-slate-400 hover:text-slate-200'
                           :'bg-slate-100 text-slate-500 hover:text-slate-700'}`}>
                  {k==='column'?'Col':k==='funnel'?'Fnel':k.charAt(0).toUpperCase()+k.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* X-axis column dropdown */}
          {cfg.kind !== 'funnel' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">X-Axis (Group By)</label>
                <select value={cfg.xCol} onChange={e => onChange({...cfg, xCol:e.target.value})} className={sel}>
                  <option value="">— select column —</option>
                  <optgroup label="Categorical">
                    {catCols.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Numeric (as label)">
                    {numCols.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Y-Axis (Measure)</label>
                <select value={cfg.yCol} onChange={e => onChange({...cfg, yCol:e.target.value})} className={sel}>
                  <option value="">— select column —</option>
                  {numCols.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Aggregation */}
          {cfg.kind !== 'funnel' && (
            <div>
              <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Aggregation</label>
              <select value={cfg.agg} onChange={e => onChange({...cfg, agg:e.target.value as any})} className={sel}>
                <option value="sum">Sum</option>
                <option value="mean">Mean (Average)</option>
                <option value="median">Median</option>
                <option value="count">Count</option>
              </select>
            </div>
          )}

          {/* Y min / max */}
          {cfg.kind !== 'funnel' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Y Min</label>
                <input type="number" value={cfg.yMin} placeholder="auto"
                  onChange={e => onChange({...cfg, yMin:e.target.value})} className={inp}/>
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Y Max</label>
                <input type="number" value={cfg.yMax} placeholder="auto"
                  onChange={e => onChange({...cfg, yMax:e.target.value})} className={inp}/>
              </div>
            </div>
          )}

          {/* colour + stroke */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Colour</label>
              <input type="color" value={cfg.color}
                onChange={e => onChange({...cfg, color:e.target.value})}
                className="w-full h-7 rounded border border-slate-200 cursor-pointer"/>
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 mb-1 uppercase font-bold">Stroke Width</label>
              <select value={cfg.strokeWidth} onChange={e => onChange({...cfg, strokeWidth:Number(e.target.value)})} className={sel}>
                {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}px</option>)}
              </select>
            </div>
          </div>

          {/* toggles */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
            {([
              ['showGrid','Grid'],['showLegend','Legend'],['showLabels','Labels'],
              ['smooth','Smooth'],['refLine','Avg Line'],
            ] as [keyof ChartCfg, string][]).map(([k,label]) => (
              <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={!!cfg[k]}
                  onChange={e => onChange({...cfg, [k]:e.target.checked})}
                  className="rounded text-[#0F4C81]"/>
                <span className={`text-[10px] ${dark?'text-slate-300':'text-slate-600'}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── chart card wrapper ─────────────────────────────────────────────────────────
function ChartCard({
  id, title, subtitle, dark, height='h-64', children, right,
}: {
  id:string; title:string; subtitle?:string; dark:boolean;
  height?:string; children:React.ReactNode; right?:React.ReactNode;
}) {
  return (
    <div id={id}
      className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow
        ${dark?'bg-[#131f37] border-[#1e2d4a]':'bg-white border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h4 className={`text-[11px] font-bold uppercase tracking-wider truncate
            ${dark?'text-[#3B82F6]':'text-[#0F4C81]'}`}>{title}</h4>
          {subtitle && (
            <p className="text-[9px] text-slate-400 mt-0.5 italic leading-snug">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
      <div className={height}>{children}</div>
    </div>
  );
}

// ─── multi-select dropdown ──────────────────────────────────────────────────────
function MultiSelect({ id, label, options, value, onChange, dark, openId, setOpenId }: {
  id:string; label:string; options:string[]; value:string[];
  onChange:(v:string[])=>void; dark:boolean;
  openId:string|null; setOpenId:(v:string|null)=>void;
}) {
  const isOpen = openId === id;
  const toggle = (v:string) =>
    onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value, v]);

  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpenId(isOpen ? null : id); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition shrink-0
          ${dark?'bg-[#182640] border-[#1e2d4a] text-slate-200 hover:bg-[#1c2c49]'
               :'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}
          ${value.length?dark?'border-[#3B82F6] text-[#3B82F6]':'border-[#0F4C81] text-[#0F4C81]':''}`}>
        {label}
        {value.length > 0 && (
          <span className={`text-[9px] font-bold px-1 rounded
            ${dark?'bg-[#3B82F6]/20':'bg-[#0F4C81]/10'}`}>{value.length}</span>
        )}
        {isOpen ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
      </button>

      {isOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className={`absolute left-0 top-9 z-50 min-w-[190px] rounded-xl border shadow-xl p-2
            ${dark?'bg-[#131f37] border-[#1e2d4a]':'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-200 dark:border-[#1e2d4a]">
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">{label}</span>
            <button onClick={() => { onChange([]); setOpenId(null); }}
              className="text-[9px] text-blue-500 hover:underline cursor-pointer">Reset</button>
          </div>
          {options.length === 0
            ? <p className="text-[10px] text-slate-400 px-2 py-2">Column not detected in dataset</p>
            : <div className="max-h-44 overflow-y-auto space-y-0.5">
                {options.map(opt => (
                  <label key={opt}
                    className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-[11px]
                      ${dark?'text-slate-300 hover:bg-[#1e2d4a]':'text-slate-700 hover:bg-slate-50'}`}>
                    <input type="checkbox" checked={value.includes(opt)}
                      onChange={() => toggle(opt)} className="rounded text-[#0F4C81]"/>
                    {opt}
                  </label>
                ))}
              </div>}
        </div>
      )}
    </div>
  );
}

// ─── props ──────────────────────────────────────────────────────────────────────
interface ExecutiveDashboardProps {
  datasetName: string;
  fields: any[];
  data: any[];
  aiKPIs: KPIItem[] | null;
  customCharts: CustomVisualization[];
  onAddChart: (c: CustomVisualization) => void;
  onRemoveChart: (id: string) => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (v: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function ExecutiveDashboard({
  datasetName, fields, data,
  isDarkMode=false, setIsDarkMode,
}: ExecutiveDashboardProps) {

  const dark = isDarkMode;

  // ── palette ───────────────────────────────────────────────────────────────────
  const [palette, setPalette] = useState<keyof typeof PALETTES>('clinical');
  const colors = PALETTES[palette];

  // ── column lists ──────────────────────────────────────────────────────────────
  const catCols = useMemo(
    () => fields.filter(f=>f.type==='categorical'||f.type==='text'||f.type==='boolean').map(f=>f.name as string),
    [fields]
  );
  const numCols = useMemo(
    () => fields.filter(f=>f.type==='numeric').map(f=>f.name as string),
    [fields]
  );
  const allCols = useMemo(() => fields.map(f=>f.name as string), [fields]);

  // ── detect key columns by keyword ─────────────────────────────────────────────
  const findCol = (...kws: string[]) =>
    allCols.find(c => kws.some(k => c.toLowerCase().includes(k.toLowerCase()))) ?? '';

  const COL = useMemo(() => ({
    year:        findCol('fiscal year','fiscal_year','year'),
    sex:         findCol('sex','gender'),
    ageGroup:    findCol('age group','age_group'),
    popCat:      findCol('population category','population_category','pop_cat','age_broad'),
    ctas:        findCol('ctas','triage level','triage_level'),
    disposition: findCol('visit disposition','disposition','admission_status'),
    los:         findCol('length of stay','los','length_of_stay','median_length'),
    visits:      findCol('ed visits','ed_visits','visit_count','total_ed_visits'),
    problem:     findCol('main problem','main_problem','problem','condition'),
  }), [allCols]); // eslint-disable-line

  // ── distinct values per filter col (always return array, empty if col missing) ─
  const distinct = (col: string) =>
    col ? [...new Set(data.map(r=>String(r[col]??'')).filter(Boolean))].sort() : [];

  const OPT_YEAR  = useMemo(() => distinct(COL.year),        [data, COL.year]);
  const OPT_SEX   = useMemo(() => distinct(COL.sex),         [data, COL.sex]);
  const OPT_AGE   = useMemo(() => distinct(COL.ageGroup),    [data, COL.ageGroup]);
  const OPT_POP   = useMemo(() => distinct(COL.popCat),      [data, COL.popCat]);
  const OPT_CTAS  = useMemo(() => distinct(COL.ctas),        [data, COL.ctas]);
  const OPT_DISP  = useMemo(() => distinct(COL.disposition), [data, COL.disposition]);

  // ── filter state ──────────────────────────────────────────────────────────────
  const [fYear, setFYear]   = useState<string[]>([]);
  const [fSex,  setFSex]    = useState<string[]>([]);
  const [fAge,  setFAge]    = useState<string[]>([]);
  const [fPop,  setFPop]    = useState<string[]>([]);
  const [fCtas, setFCtas]   = useState<string[]>([]);
  const [fDisp, setFDisp]   = useState<string[]>([]);
  const [openDrop, setOpenDrop] = useState<string|null>(null);

  const clearAll = () => { setFYear([]); setFSex([]); setFAge([]); setFPop([]); setFCtas([]); setFDisp([]); };
  const activeCount = fYear.length+fSex.length+fAge.length+fPop.length+fCtas.length+fDisp.length;

  // ── filtered dataset ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => data.filter(r => {
    if (fYear.length && COL.year        && !fYear.includes(String(r[COL.year]??'')))        return false;
    if (fSex.length  && COL.sex         && !fSex.includes(String(r[COL.sex]??'')))          return false;
    if (fAge.length  && COL.ageGroup    && !fAge.includes(String(r[COL.ageGroup]??'')))     return false;
    if (fPop.length  && COL.popCat      && !fPop.includes(String(r[COL.popCat]??'')))       return false;
    if (fCtas.length && COL.ctas        && !fCtas.includes(String(r[COL.ctas]??'')))        return false;
    if (fDisp.length && COL.disposition && !fDisp.includes(String(r[COL.disposition]??''))) return false;
    return true;
  }), [data, fYear, fSex, fAge, fPop, fCtas, fDisp, COL]);

  // ── chart configs ─────────────────────────────────────────────────────────────
  // We store all 9 chart configs in one state object keyed by slot id
  const [chartCfgs, setChartCfgs] = useState<Record<string, ChartCfg>>(() => {
    const yCol = (kws: string[]) => kws.find(c => numCols.some(n => n.toLowerCase().includes(c))) ?? numCols[0] ?? '';
    const xCol = (kws: string[]) => kws.find(c => catCols.some(n => n.toLowerCase().includes(c))) ?? catCols[0] ?? '';
    return {
      'line-1': defaultCfg('line',   '',  '', colors[0]),
      'line-2': defaultCfg('line',   '',  '', colors[1]),
      'bar-1':  defaultCfg('bar',    '',  '', colors[2]),
      'bar-2':  defaultCfg('bar',    '',  '', colors[3]),
      'bar-3':  defaultCfg('bar',    '',  '', colors[4]),
      'col-1':  defaultCfg('column', '',  '', colors[0]),
      'col-2':  defaultCfg('column', '',  '', colors[1]),
      'area-1': defaultCfg('area',   '',  '', colors[2]),
      'funnel': defaultCfg('funnel', '',  '', colors[0]),
    };
  });

  // Initialise default columns once fields load
  React.useEffect(() => {
    if (!fields.length) return;
    const c = COL;
    setChartCfgs(prev => {
      const next = {...prev};
      // Line 1: year vs visits
      if (!prev['line-1'].xCol && c.year)    next['line-1'] = {...prev['line-1'], xCol:c.year, yCol:c.visits||numCols[0]||''};
      // Line 2: year vs LOS
      if (!prev['line-2'].xCol && c.year)    next['line-2'] = {...prev['line-2'], xCol:c.year, yCol:c.los||numCols[0]||'', agg:'median'};
      // Bar 1: age group vs visits
      if (!prev['bar-1'].xCol)               next['bar-1']  = {...prev['bar-1'],  xCol:c.ageGroup||catCols[0]||'', yCol:c.visits||numCols[0]||''};
      // Bar 2: disposition vs LOS
      if (!prev['bar-2'].xCol)               next['bar-2']  = {...prev['bar-2'],  xCol:c.disposition||catCols[1]||'', yCol:c.los||numCols[0]||'', agg:'median'};
      // Bar 3: problem vs visits
      if (!prev['bar-3'].xCol)               next['bar-3']  = {...prev['bar-3'],  xCol:c.problem||catCols[2]||'', yCol:c.visits||numCols[0]||''};
      // Col 1: ctas vs visits
      if (!prev['col-1'].xCol)               next['col-1']  = {...prev['col-1'],  xCol:c.ctas||catCols[0]||'', yCol:c.visits||numCols[0]||''};
      // Col 2: popcat vs visits
      if (!prev['col-2'].xCol)               next['col-2']  = {...prev['col-2'],  xCol:c.popCat||catCols[1]||'', yCol:c.visits||numCols[0]||''};
      // Area: year vs visits
      if (!prev['area-1'].xCol && c.year)    next['area-1'] = {...prev['area-1'], xCol:c.year, yCol:c.visits||numCols[0]||''};
      // Funnel: ctas vs visits
      if (!prev['funnel'].xCol)              next['funnel'] = {...prev['funnel'], xCol:c.ctas||catCols[0]||'', yCol:c.visits||numCols[0]||''};
      return next;
    });
  }, [fields.length]); // eslint-disable-line

  const setCfg = (id: string) => (c: ChartCfg) =>
    setChartCfgs(prev => ({...prev, [id]: c}));

  // ── KPIs ──────────────────────────────────────────────────────────────────────
  const kpiData = useMemo(() => {
    const losVals    = toNums(filtered, COL.los);
    const visitVals  = toNums(filtered, COL.visits);
    const totalVisits = visitVals.length ? visitVals.reduce((a,b)=>a+b,0) : filtered.length;
    const medLOS     = calcMedian(losVals);

    // Highest LOS group
    const groupCol = COL.ctas || COL.ageGroup || COL.popCat;
    let highestLOSGroup = '—';
    if (groupCol) {
      const gm: Record<string,number[]> = {};
      filtered.forEach(r => {
        const g = String(r[groupCol]??'Unknown');
        const v = Number(r[COL.los]??0);
        if (!gm[g]) gm[g] = [];
        if (!isNaN(v) && v>0) gm[g].push(v);
      });
      const best = Object.entries(gm).sort((a,b)=>calcMedian(b[1])-calcMedian(a[1]))[0];
      if (best) highestLOSGroup = best[0];
    }

    // Highest resource burden (ERBI)
    // Canonical formula: ctas_urgency_score × los_hours × visits
    const bMap: Record<string, { totalBurden: number; totalVisits: number }> = {};
    const burdenGroupCol = COL.ctas || COL.popCat || COL.ageGroup;
    if (burdenGroupCol) {
      filtered.forEach(r => {
        let urg = Number(r.ctas_urgency_score ?? 0);
        if (!urg || isNaN(urg)) {
          const rawCtas = String(r[COL.ctas] ?? '');
          const match = rawCtas.match(/[1-5]/);
          urg = match ? parseInt(match[0], 10) : 3;
        }
        const rawLOS = Number(r[COL.los] ?? 0);
        const losHours = rawLOS > 24 ? rawLOS / 60.0 : rawLOS; // convert minutes to hours if > 24
        const v = Number(r[COL.visits] ?? 1);
        const key = String(r[burdenGroupCol] ?? 'Unknown');
        if (key !== 'Unknown' && !['total', 'all'].includes(key.toLowerCase())) {
          if (!bMap[key]) bMap[key] = { totalBurden: 0, totalVisits: 0 };
          bMap[key].totalBurden += urg * losHours * v;
          bMap[key].totalVisits += v;
        }
      });
    }
    const bestBurden = Object.entries(bMap).sort((a, b) => {
      const erbiA = a[1].totalVisits > 0 ? a[1].totalBurden / a[1].totalVisits : 0;
      const erbiB = b[1].totalVisits > 0 ? b[1].totalBurden / b[1].totalVisits : 0;
      return erbiB - erbiA;
    })[0];
    const maxBurdenGroup = bestBurden ? bestBurden[0] : '—';

    const keyFinding = medLOS > 6
      ? `Median LOS ${medLOS.toFixed(1)}h exceeds 6h CIHI benchmark`
      : medLOS > 0
        ? `Median LOS ${medLOS.toFixed(1)}h is within the CIHI 6h target`
        : 'Load a clinical dataset to view insights';

    return { totalVisits, medLOS, highestLOSGroup, maxBurdenGroup, keyFinding };
  }, [filtered, COL]);

  // ── descriptive stats ─────────────────────────────────────────────────────────
  const descStats = useMemo(() =>
    numCols.slice(0,5).map(col => {
      const v = toNums(filtered, col).sort((a,b)=>a-b);
      const m = calcMean(v);
      const med = calcMedian(v);
      const sd  = calcStddev(v, m);
      const q1  = v[Math.floor(v.length*0.25)]??0;
      const q3  = v[Math.floor(v.length*0.75)]??0;
      return { col, n:v.length, mean:m, median:med, stddev:sd,
               min:v[0]??0, max:v[v.length-1]??0, q1, q3,
               iqr:q3-q1, skew: sd>0 ? ((m-med)/sd)*3 : 0 };
    }), [filtered, numCols]);

  // ── common chart props ────────────────────────────────────────────────────────
  const chartCommon = { filtered, data, colors, dark, catCols, numCols };

  // ── slot title helper ─────────────────────────────────────────────────────────
  const slotTitle = (cfg: ChartCfg, fallback: string) => {
    if (cfg.xCol && cfg.yCol)
      return `${cfg.yCol} by ${cfg.xCol}`;
    return fallback;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div
      className={`space-y-6 p-6 rounded-3xl select-none
        ${dark?'bg-[#0C1524] text-slate-100':'bg-slate-50 text-slate-800'}`}
      id="executive-dashboard-root"
      onClick={() => setOpenDrop(null)}>

      {/* ══ 1. TITLE BANNER ══════════════════════════════════════════════════ */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden
        ${dark?'bg-[#131f37] border-[#1e2d4a]':'bg-white border-slate-200'}`}>
        {/* gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0F4C81] via-[#118d95] to-[#2E8B57]"/>
        <div className="p-6 text-center">
          {/* badges row */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded border
              ${dark?'bg-[#0F4C81]/20 border-[#0F4C81]/40 text-[#3B82F6]'
                    :'bg-[#0F4C81]/10 border-[#0F4C81]/20 text-[#0F4C81]'}`}>
              DAMO-6994 ▸ CAPSTONE
            </span>
            <span className="text-[9px] font-mono text-slate-400 truncate max-w-[240px]">{datasetName}</span>
            <div className={`flex items-center gap-1 text-[10px] font-mono ${dark?'text-emerald-400':'text-emerald-600'}`}>
              <Activity size={11} className="animate-pulse"/><span>Live</span>
            </div>
          </div>
          {/* main title */}
          <h1 className={`text-2xl font-extrabold tracking-tight ${dark?'text-white':'text-slate-900'}`}>
            Emergency Department Analytics
          </h1>
          <p className={`text-sm mt-1 font-light ${dark?'text-slate-400':'text-slate-500'}`}>
            Operational &amp; Clinical Modelling of ED Wait Times — University of Niagara Falls
          </p>
          {/* stats + controls row */}
          <div className="flex items-center justify-center flex-wrap gap-3 mt-4">
            {[
              ['Filtered', fmtNum(filtered.length,0)],
              ['Total',    fmtNum(data.length,0)],
              ['Columns',  String(fields.length)],
            ].map(([lbl,val]) => (
              <span key={lbl} className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold
                ${dark?'bg-[#182640] border-[#1e2d4a] text-slate-300':'bg-slate-50 border-slate-200 text-slate-600'}`}>
                {lbl}: <strong>{val}</strong>
              </span>
            ))}
            <button onClick={() => setIsDarkMode&&setIsDarkMode(!dark)}
              className={`px-3 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition
                ${dark?'bg-[#182640] border-[#1e2d4a] text-amber-300 hover:bg-[#1c2c49]'
                     :'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              {dark?'☀ Light':'🌙 Dark'}
            </button>
          </div>
        </div>
      </div>


      {/* ══ 2. FILTER BAR ════════════════════════════════════════════════════ */}
      <div
        className={`rounded-2xl border px-4 py-3 shadow-sm
          ${dark?'bg-[#131f37] border-[#1e2d4a]':'bg-white border-slate-200'}`}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-3 flex-wrap">
          {/* label */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={12} className={dark?'text-[#3B82F6]':'text-[#0F4C81]'}/>
            <span className={`text-[10px] font-bold uppercase tracking-widest
              ${dark?'text-slate-300':'text-slate-500'}`}>Filters</span>
            {activeCount > 0 && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full
                ${dark?'bg-[#3B82F6]/20 text-[#3B82F6]':'bg-[#0F4C81]/10 text-[#0F4C81]'}`}>
                {activeCount}
              </span>
            )}
          </div>
          {/* 6 filter pills — grow equally */}
          <div className="flex flex-1 flex-wrap gap-2 min-w-0">
            <MultiSelect id="fy"   label="Fiscal Year"         options={OPT_YEAR}  value={fYear} onChange={setFYear} dark={dark} openId={openDrop} setOpenId={setOpenDrop}/>
            <MultiSelect id="sex"  label="Sex"                 options={OPT_SEX}   value={fSex}  onChange={setFSex}  dark={dark} openId={openDrop} setOpenId={setOpenDrop}/>
            <MultiSelect id="age"  label="Age Group"           options={OPT_AGE}   value={fAge}  onChange={setFAge}  dark={dark} openId={openDrop} setOpenId={setOpenDrop}/>
            <MultiSelect id="pop"  label="Population Category" options={OPT_POP}   value={fPop}  onChange={setFPop}  dark={dark} openId={openDrop} setOpenId={setOpenDrop}/>
            <MultiSelect id="ctas" label="CTAS Level"          options={OPT_CTAS}  value={fCtas} onChange={setFCtas} dark={dark} openId={openDrop} setOpenId={setOpenDrop}/>
            <MultiSelect id="disp" label="Visit Disposition"   options={OPT_DISP}  value={fDisp} onChange={setFDisp} dark={dark} openId={openDrop} setOpenId={setOpenDrop}/>
          </div>
          {/* clear */}
          {activeCount > 0 && (
            <button onClick={clearAll}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold text-rose-500 border-rose-200 bg-rose-50 cursor-pointer hover:bg-rose-100 transition shrink-0">
              <RefreshCw size={10}/> Clear
            </button>
          )}
        </div>

        {/* active pills */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-slate-200 dark:border-[#1e2d4a]">
            {([ [fYear,setFYear,'FY'],[fSex,setFSex,'Sex'],[fAge,setFAge,'Age'],
                [fPop,setFPop,'Pop'],[fCtas,setFCtas,'CTAS'],[fDisp,setFDisp,'Disp'],
              ] as [string[], React.Dispatch<React.SetStateAction<string[]>>, string][])
              .flatMap(([vals,setter,pfx]) =>
                (vals as string[]).map(v => (
                  <span key={`${pfx}-${v}`}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold
                      ${dark?'bg-[#0F4C81]/30 text-[#3B82F6] border border-[#3B82F6]/30'
                            :'bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20'}`}>
                    <span className="opacity-60">{pfx}:</span> {v}
                    <button onClick={() => setter(p => p.filter(x=>x!==v))}
                      className="ml-0.5 hover:text-rose-500 cursor-pointer"><X size={8}/></button>
                  </span>
                ))
              )}
          </div>
        )}
      </div>

      {/* ══ 3. KPI CARDS ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {([
          {
            icon:<Users size={20} className="text-white"/>,
            iconGrad:'from-[#0F4C81] to-[#118d95]',
            badge:'LIVE', badgeStyle:'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            label:'Total ED Visits',
            value:fmtK(kpiData.totalVisits),
            sub:`of ${fmtK(data.length)} total records`,
            foot:<span className="flex items-center justify-center gap-1 text-emerald-400"><TrendingUp size={10}/> Active filter scope</span>,
          },{
            icon:<Clock size={20} className="text-white"/>,
            iconGrad:'from-amber-500 to-orange-500',
            badge:kpiData.medLOS>6?'ABOVE':'TARGET',
            badgeStyle:kpiData.medLOS>6?'bg-rose-500/20 text-rose-400 border-rose-500/30':'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            label:'Median LOS',
            value:kpiData.medLOS>0?`${kpiData.medLOS.toFixed(1)}h`:'—',
            sub:'CIHI Target: ≤ 6h',
            foot:<span className={`flex items-center justify-center gap-1 ${kpiData.medLOS>6?'text-rose-400':'text-emerald-400'}`}>
              {kpiData.medLOS>6?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
              {kpiData.medLOS>6?`+${(kpiData.medLOS-6).toFixed(1)}h over`:'Within benchmark'}
            </span>,
          },{
            icon:<BarChart2 size={20} className="text-white"/>,
            iconGrad:'from-purple-600 to-violet-500',
            badge:'GROUP', badgeStyle:'bg-purple-500/20 text-purple-400 border-purple-500/30',
            label:'Highest LOS Group',
            value:kpiData.highestLOSGroup,
            sub:'Longest median stay',
            foot:<span className="flex justify-center text-purple-400">Triage / Age stratified</span>,
          },{
            icon:<Zap size={20} className="text-white"/>,
            iconGrad:'from-rose-600 to-pink-500',
            badge:'ERBI', badgeStyle:'bg-rose-500/20 text-rose-400 border-rose-500/30',
            label:'Highest Resource Burden',
            value:kpiData.maxBurdenGroup,
            sub:'Urgency × LOS × Visits',
            foot:<span className="flex items-center justify-center gap-1 text-rose-400"><AlertCircle size={10}/> Acuity-weighted</span>,
          },{
            icon:<BookOpen size={20} className="text-white"/>,
            iconGrad:'from-teal-600 to-cyan-500',
            badge:'INSIGHT', badgeStyle:'bg-teal-500/20 text-teal-400 border-teal-500/30',
            label:'Key Finding',
            value:null,
            valueText:kpiData.keyFinding,
            sub:'Statistical analysis',
            foot:<span className="flex justify-center text-teal-400">Auto-generated</span>,
          },
        ]).map((kpi, i) => (
          <div key={i} className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all
            ${dark?'bg-[#0f1a2e] border-[#1e2d4a]':'bg-white border-slate-200'}`}>
            {/* icon header with gradient */}
            <div className={`bg-gradient-to-br ${kpi.iconGrad} px-4 pt-5 pb-4 flex flex-col items-center gap-2`}>
              <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur">{kpi.icon}</div>
              <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${kpi.badgeStyle}`}>
                {kpi.badge}
              </span>
            </div>
            {/* body — center aligned */}
            <div className="px-4 py-4 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">{kpi.label}</p>
              {kpi.value !== null && kpi.value !== undefined
                ? <p className={`text-3xl font-extrabold tracking-tight leading-none ${dark?'text-white':'text-slate-900'}`}>{kpi.value}</p>
                : <p className={`text-xs font-semibold leading-snug ${dark?'text-slate-100':'text-slate-800'}`}>{(kpi as any).valueText}</p>}
              <p className="text-[9px] text-slate-500 mt-1.5">{kpi.sub}</p>
              <div className={`mt-3 pt-3 border-t text-[9px] font-semibold ${dark?'border-[#1e2d4a]':'border-slate-100'}`}>
                {kpi.foot}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ 4. CHARTS ════════════════════════════════════════════════════════ */}

      {/* Row A — 2 Line Charts (full-width, stacked) */}
      <div className="flex flex-col gap-6">
        {/* LINE 1 */}
        <ChartCard id="chart-line-1" dark={dark} height="h-72"
          title={slotTitle(chartCfgs['line-1'], 'Line Chart 1 — ED Visit Trend')}
          subtitle="Longitudinal trend — configure X/Y columns via Customise"
          right={<ChartConfig cfg={chartCfgs['line-1']} onChange={setCfg('line-1')} catCols={catCols} numCols={numCols} dark={dark}/>}>
          <UniversalChart id="line-1" cfg={chartCfgs['line-1']} defaultTitle="Line 1" {...chartCommon}/>
        </ChartCard>

        {/* LINE 2 */}
        <ChartCard id="chart-line-2" dark={dark} height="h-72"
          title={slotTitle(chartCfgs['line-2'], 'Line Chart 2 — Median LOS Trend')}
          subtitle="Year-over-year median LOS — CIHI 6h reference visible when LOS is Y-axis"
          right={<ChartConfig cfg={chartCfgs['line-2']} onChange={setCfg('line-2')} catCols={catCols} numCols={numCols} dark={dark}/>}>
          <UniversalChart id="line-2" cfg={chartCfgs['line-2']} defaultTitle="Line 2" {...chartCommon}/>
        </ChartCard>
      </div>

      {/* Row B — Bar 1 full-width, Bar 2 + Bar 3 side by side below */}
      <div className="flex flex-col gap-6">

        {/* BAR 1 — full width */}
        <ChartCard id="chart-bar-1" dark={dark} height="h-72"
          title={slotTitle(chartCfgs['bar-1'], 'Bar Chart 1 — ED Visits by Fiscal Year')}
          subtitle="Full-width horizontal bar — configure X/Y columns via Customise"
          right={<ChartConfig cfg={chartCfgs['bar-1']} onChange={setCfg('bar-1')} catCols={catCols} numCols={numCols} dark={dark}/>}>
          <UniversalChart id="bar-1" cfg={chartCfgs['bar-1']} defaultTitle="Bar 1" {...chartCommon}/>
        </ChartCard>

        {/* BAR 2 + BAR 3 — side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* BAR 2 */}
          <ChartCard id="chart-bar-2" dark={dark}
            title={slotTitle(chartCfgs['bar-2'], 'Bar Chart 2 — Disposition LOS')}
            subtitle="Median LOS by visit disposition outcome"
            right={<ChartConfig cfg={chartCfgs['bar-2']} onChange={setCfg('bar-2')} catCols={catCols} numCols={numCols} dark={dark}/>}>
            <UniversalChart id="bar-2" cfg={chartCfgs['bar-2']} defaultTitle="Bar 2" {...chartCommon}/>
          </ChartCard>

          {/* BAR 3 */}
          <ChartCard id="chart-bar-3" dark={dark}
            title={slotTitle(chartCfgs['bar-3'], 'Bar Chart 3 — Top Problems')}
            subtitle="Highest-volume diagnostic main problems"
            right={<ChartConfig cfg={chartCfgs['bar-3']} onChange={setCfg('bar-3')} catCols={catCols} numCols={numCols} dark={dark}/>}>
            <UniversalChart id="bar-3" cfg={chartCfgs['bar-3']} defaultTitle="Bar 3" {...chartCommon}/>
          </ChartCard>
        </div>

      </div>


      {/* Row C — 2 Column Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* COL 1 */}
        <ChartCard id="chart-col-1" dark={dark}
          title={slotTitle(chartCfgs['col-1'], 'Column Chart 1 — CTAS Level')}
          subtitle="ED visits by triage acuity level (1=Resuscitation → 5=Non-Urgent)"
          right={<ChartConfig cfg={chartCfgs['col-1']} onChange={setCfg('col-1')} catCols={catCols} numCols={numCols} dark={dark}/>}>
          <UniversalChart id="col-1" cfg={chartCfgs['col-1']} defaultTitle="Col 1" {...chartCommon}/>
        </ChartCard>

        {/* COL 2 */}
        <ChartCard id="chart-col-2" dark={dark}
          title={slotTitle(chartCfgs['col-2'], 'Column Chart 2 — Population Category')}
          subtitle="Standardised age brackets — Pediatric, Young Adult, Middle Adult, Older Adult"
          right={<ChartConfig cfg={chartCfgs['col-2']} onChange={setCfg('col-2')} catCols={catCols} numCols={numCols} dark={dark}/>}>
          <UniversalChart id="col-2" cfg={chartCfgs['col-2']} defaultTitle="Col 2" {...chartCommon}/>
        </ChartCard>
      </div>

      {/* Row D — Area + Funnel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AREA */}
        <ChartCard id="chart-area-1" dark={dark}
          title={slotTitle(chartCfgs['area-1'], 'Area Chart — Cumulative Growth')}
          subtitle="Volume area with gradient fill — switch type via Customise"
          right={<ChartConfig cfg={chartCfgs['area-1']} onChange={setCfg('area-1')} catCols={catCols} numCols={numCols} dark={dark}/>}>
          <UniversalChart id="area-1" cfg={chartCfgs['area-1']} defaultTitle="Area" {...chartCommon}/>
        </ChartCard>

        {/* FUNNEL */}
        <ChartCard id="chart-funnel" dark={dark}
          title={slotTitle(chartCfgs['funnel'], 'Funnel Chart — Patient Flow by CTAS')}
          subtitle="Volume tapering from most urgent (L1) to least urgent (L5)"
          right={<ChartConfig cfg={chartCfgs['funnel']} onChange={setCfg('funnel')} catCols={catCols} numCols={numCols} dark={dark} allowFunnel/>}>
          <UniversalChart id="funnel" cfg={chartCfgs['funnel']} defaultTitle="Funnel" {...chartCommon}/>
        </ChartCard>
      </div>

      {/* ══ 5. DESCRIPTIVE STATISTICS ═════════════════════════════════════════ */}
      <div className={`rounded-2xl border p-6 shadow-sm
        ${dark?'bg-[#131f37] border-[#1e2d4a]':'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider
              ${dark?'text-[#3B82F6]':'text-[#0F4C81]'}`}>
              Descriptive Statistics — Top 5 Numeric Variables
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 italic">
              Mean, Median, Std Dev, Min, Max, Q1, Q3, IQR and Pearson skewness for active filter scope
            </p>
          </div>
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded border font-mono
            ${dark?'bg-[#182640] border-[#1e2d4a] text-slate-300':'bg-slate-50 border-slate-200 text-slate-600'}`}>
            n = {fmtNum(filtered.length,0)} records
          </span>
        </div>

        {descStats.length === 0
          ? <p className="text-center py-10 text-xs text-slate-400">No numeric columns detected in the active dataset.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className={dark?'bg-[#182640]':'bg-slate-50'}>
                    {['Column','N','Mean','Median','Std Dev','Min','Max','Q1','Q3','IQR','Skewness'].map(h=>(
                      <th key={h} className={`px-3 py-2 text-left text-[9px] font-bold uppercase tracking-wider border-b
                        ${dark?'border-[#1e2d4a] text-slate-400':'border-slate-200 text-slate-500'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {descStats.map((row,i) => (
                    <tr key={row.col}
                      className={`transition hover:opacity-80
                        ${i%2===0
                          ? dark?'bg-[#0f1d33]':'bg-white'
                          : dark?'bg-[#131f37]':'bg-slate-50/50'}`}>
                      <td className={`px-3 py-2.5 font-semibold border-b max-w-[140px] truncate
                        ${dark?'border-[#1e2d4a] text-slate-200':'border-slate-100 text-slate-800'}`}>
                        {row.col}
                      </td>
                      {[fmtNum(row.n,0),fmtNum(row.mean,2),fmtNum(row.median,2),
                        fmtNum(row.stddev,2),fmtNum(row.min,2),fmtNum(row.max,2),
                        fmtNum(row.q1,2),fmtNum(row.q3,2),fmtNum(row.iqr,2)].map((v,j) => (
                        <td key={j} className={`px-3 py-2.5 font-mono border-b
                          ${dark?'border-[#1e2d4a] text-slate-300':'border-slate-100 text-slate-700'}`}>{v}</td>
                      ))}
                      <td className={`px-3 py-2.5 font-mono border-b font-bold
                        ${dark?'border-[#1e2d4a]':'border-slate-100'}
                        ${Math.abs(row.skew)>1?'text-amber-500':dark?'text-slate-300':'text-slate-700'}`}>
                        {fmtNum(row.skew,3)}
                        {Math.abs(row.skew)>1 && (
                          <span className="ml-1 text-[8px]">{row.skew>0?'▲ Right':'▼ Left'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <div className={`mt-4 p-3 rounded-xl border text-[10px] leading-relaxed
          ${dark?'bg-[#182640] border-[#1e2d4a] text-slate-400':'bg-amber-50 border-amber-100 text-amber-700'}`}>
          <strong>Clinical Note:</strong> LOS distributions are right-skewed (skewness &gt; 0.5).
          Non-parametric methods (Kruskal-Wallis, Mann-Whitney U, Dunn's post-hoc) are used throughout
          hypothesis testing to respect this property. Values with |skewness| &gt; 1 are highlighted in amber.
        </div>
      </div>

      {/* footer */}
      <p className={`text-center text-[10px] font-mono py-1
        ${dark?'text-slate-700':'text-slate-400'}`}>
        Emergency Department Analytics · DAMO-6994 · University of Niagara Falls
        · {fmtNum(filtered.length,0)} / {fmtNum(data.length,0)} records
      </p>

    </div>
  );
}
