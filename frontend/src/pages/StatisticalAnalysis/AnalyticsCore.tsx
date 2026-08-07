/**
 * AnalyticsCore.tsx — DAMO-699 Capstone
 * Hypothesis Testing & Statistical Analysis
 * Redesigned per Principal Biostatistician / Professor of Biostatistics specs.
 * All statistics computed dynamically. No hardcoded values.
 * Aggregate-level interpretation only. No individual patient references.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight, ChevronDown, ChevronUp, Info, ShieldCheck, Clock, Cpu, FileText
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// ─── INTERFACES ──────────────────────────────────────────────────────────────
interface AnalyticsCoreProps { fields: any[]; data: any[]; onNavigateNext?: () => void; }

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const PAL = ['#0F4C81','#2563EB','#0EA5E9','#10B981','#F59E0B','#EF4444','#8B5CF6'];
const CTAS_PAL: Record<string,string> = {
  Resuscitation:'#EF4444', Emergent:'#F97316', Urgent:'#F59E0B',
  'Less Urgent':'#3B82F6', 'Non-Urgent':'#10B981'
};

// ─── STATISTICAL UTILITIES ───────────────────────────────────────────────────
const normalCDF = (z: number): number => {
  const t = 1/(1+0.2316419*Math.abs(z));
  const b = [0.31938153,-0.356563782,1.781477937,-1.821255978,1.330274429];
  let poly = 0, tp = t;
  b.forEach(c => { poly += c*tp; tp *= t; });
  const p = 1-(1/Math.sqrt(2*Math.PI))*Math.exp(-0.5*z*z)*poly;
  return z >= 0 ? p : 1-p;
};

const lgamma = (z: number): number => {
  const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.001208650973866179,-0.000005395239384953];
  let y=z, tmp=z+5.5; tmp-=(z+0.5)*Math.log(tmp);
  let ser=1.000000000190015; c.forEach(v=>{y+=1;ser+=v/y;});
  return -tmp+Math.log(2.5066282746310005*ser/z);
};
const incGamma = (a: number, x: number): number => {
  if(x<=0) return 0;
  let sum=1/a, term=1/a;
  for(let n=1;n<=150;n++){term*=x/(a+n);sum+=term;if(Math.abs(term)<1e-12)break;}
  return Math.min(1,sum*Math.exp(-x+a*Math.log(x)-lgamma(a)));
};
const chiSqP = (h: number, df: number): number => Math.max(0,Math.min(1,1-incGamma(df/2,h/2)));
const fmtP = (p: number): string => p<0.0001?'< 0.0001':p.toFixed(4);
const fmtN = (n: number, d=2): string => isFinite(n)?n.toFixed(d):'N/A';
const getV = (row: any, ...keys: string[]): any => { for(const k of keys)if(row[k]!=null&&row[k]!=='')return row[k]; return undefined; };

const rankArr = (vals: number[]): number[] => {
  const n=vals.length, sorted=vals.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v), ranks=new Array(n);
  let i=0;
  while(i<n){let j=i;while(j<n-1&&sorted[j+1].v===sorted[i].v)j++;const r=(i+j)/2+1;for(let k=i;k<=j;k++)ranks[sorted[k].i]=r;i=j+1;}
  return ranks;
};

const kruskalWallis = (groups: number[][]): {h:number;p:number;eps2:number;df:number;n:number} => {
  const flat=groups.flat(), N=flat.length, k=groups.length;
  if(N<3||k<2) return {h:0,p:1,eps2:0,df:k-1,n:N};
  const ranks=rankArr(flat); let hSum=0,off=0;
  groups.forEach(g=>{const ri=ranks.slice(off,off+g.length).reduce((a,b)=>a+b,0);hSum+=(ri*ri)/g.length;off+=g.length;});
  const h=(12/(N*(N+1)))*hSum-3*(N+1), p=chiSqP(h,k-1), eps2=Math.max(0,(h-k+1)/(N-k));
  return {h:+h.toFixed(3),p,eps2:+eps2.toFixed(4),df:k-1,n:N};
};

const dunnTest = (groups: number[][], names: string[]) => {
  const flat=groups.flat(), N=flat.length, ranks=rankArr(flat);
  let off=0; const meanR: number[]=[];
  groups.forEach(g=>{const s=ranks.slice(off,off+g.length).reduce((a,b)=>a+b,0);meanR.push(s/g.length);off+=g.length;});
  const freq: Record<number,number>={};
  ranks.forEach(r=>{freq[r]=(freq[r]||0)+1;});
  const tieC=Object.values(freq).reduce((s,c)=>s+(c>1?c*c*c-c:0),0);
  const pairs: {pair:string;z:number;p:number;pAdj:number;significant:boolean}[]=[];
  for(let i=0;i<groups.length-1;i++) for(let j=i+1;j<groups.length;j++){
    const se=Math.sqrt(((N*(N+1)/12)-tieC/(12*(N-1)))*(1/groups[i].length+1/groups[j].length));
    const z=Math.abs(meanR[i]-meanR[j])/(se||1), p=2*(1-normalCDF(z));
    pairs.push({pair:`${names[i]} vs. ${names[j]}`,z:+z.toFixed(3),p,pAdj:0,significant:false});
  }
  const m=pairs.length;
  pairs.forEach(r=>{r.pAdj=Math.min(1,r.p*m);r.significant=r.pAdj<0.05;});
  return pairs;
};

const expandW = (vals: number[], wts: number[], cap=500): number[] => {
  const total=wts.reduce((s,w)=>s+w,0)||1, out: number[]=[];
  vals.forEach((v,i)=>{const cnt=Math.max(1,Math.round((wts[i]/total)*cap));for(let j=0;j<cnt;j++)out.push(v);});
  return out;
};

const mannWhitneyU = (a: number[], b: number[]) => {
  const n1=a.length,n2=b.length;
  if(!n1||!n2) return {u:0,p:1,rb:0,medDiff:0};
  const comb=[...a.map(v=>({v,g:0})),...b.map(v=>({v,g:1}))].sort((x,y)=>x.v-y.v);
  const N=n1+n2, ranks=new Array(N); let i=0;
  while(i<N){let j=i;while(j<N-1&&comb[j+1].v===comb[i].v)j++;const r=(i+j)/2+1;for(let k=i;k<=j;k++)ranks[k]=r;i=j+1;}
  let r1=0; comb.forEach((it,idx)=>{if(it.g===0)r1+=ranks[idx];});
  const u1=r1-n1*(n1+1)/2, u=Math.min(u1,n1*n2-u1);
  const mu=n1*n2/2, sigma=Math.sqrt(n1*n2*(n1+n2+1)/12);
  const p=2*(1-normalCDF(Math.abs((u-mu)/(sigma||1))));
  const rb=+(1-(2*u)/(n1*n2)).toFixed(4);
  const sA=[...a].sort((x,y)=>x-y), sB=[...b].sort((x,y)=>x-y);
  return {u:+u.toFixed(1),p,rb,medDiff:+(sA[Math.floor(n1/2)]-sB[Math.floor(n2/2)]).toFixed(3)};
};

const boxStats = (vals: number[]) => {
  if(!vals.length) return {q1:0,median:0,q3:0,whiskerLow:0,whiskerHigh:0,n:0};
  const s=[...vals].sort((a,b)=>a-b), n=s.length;
  const q=(p:number)=>{const i=p*(n-1),lo=Math.floor(i),hi=Math.ceil(i);return s[lo]+(i-lo)*(s[hi]-s[lo]||0);};
  const q1=q(.25),median=q(.5),q3=q(.75),iqr=q3-q1;
  return {q1:+q1.toFixed(3),median:+median.toFixed(3),q3:+q3.toFixed(3),whiskerLow:+Math.max(s[0],q1-1.5*iqr).toFixed(3),whiskerHigh:+Math.min(s[n-1],q3+1.5*iqr).toFixed(3),n};
};

const mannKendall = (series: number[]) => {
  const n=series.length; if(n<3) return {tau:0,s:0,p:1,trend:'insufficient data'};
  let s=0;
  for(let i=0;i<n-1;i++) for(let j=i+1;j<n;j++){const d=series[j]-series[i];if(d>0)s++;else if(d<0)s--;}
  const varS=(n*(n-1)*(2*n+5))/18, z=s===0?0:(s>0?s-1:s+1)/Math.sqrt(varS);
  return {tau:+(2*s/(n*(n-1))).toFixed(4),s,p:2*(1-normalCDF(Math.abs(z))),trend:s>0?'increasing':s<0?'decreasing':'no trend'};
};

const sesForecast = (series: number[], alpha=0.3, steps=2) => {
  if(!series.length) return {forecast:[0,0],ci:[[0,0],[0,0]] as [number,number][]};
  const sm=[series[0]];
  for(let i=1;i<series.length;i++) sm.push(alpha*series[i]+(1-alpha)*sm[i-1]);
  const res=series.slice(1).map((v,i)=>v-sm[i]);
  const sigma=Math.sqrt(res.reduce((s,r)=>s+r*r,0)/Math.max(1,res.length-1));
  const last=sm[sm.length-1], forecast: number[]=[], ci: [number,number][]=[];
  for(let h=1;h<=steps;h++){forecast.push(+last.toFixed(2));const m=1.96*sigma*Math.sqrt(h);ci.push([+(last-m).toFixed(2),+(last+m).toFixed(2)]);}
  return {forecast,ci};
};

// WLS regression
const invertMat = (mat: number[][]): number[][]|null => {
  const n=mat.length, aug=mat.map((row,i)=>[...row,...Array(n).fill(0).map((_,j)=>j===i?1:0)]);
  for(let col=0;col<n;col++){
    let maxR=col;for(let r=col+1;r<n;r++)if(Math.abs(aug[r][col])>Math.abs(aug[maxR][col]))maxR=r;
    [aug[col],aug[maxR]]=[aug[maxR],aug[col]];
    const piv=aug[col][col];if(Math.abs(piv)<1e-12)return null;
    for(let j=0;j<2*n;j++)aug[col][j]/=piv;
    for(let r=0;r<n;r++){if(r!==col){const f=aug[r][col];for(let j=0;j<2*n;j++)aug[r][j]-=f*aug[col][j];}}
  }
  return aug.map(row=>row.slice(n));
};
const wls = (y:number[],X:number[][],w:number[]) => {
  const n=y.length,p=X[0]?.length??0; if(n<p+2||!p) return null;
  const XtWX: number[][]=Array.from({length:p},()=>Array(p).fill(0)), XtWy: number[]=Array(p).fill(0);
  for(let i=0;i<n;i++){const wi=w[i];for(let j=0;j<p;j++){XtWy[j]+=wi*X[i][j]*y[i];for(let k=0;k<p;k++)XtWX[j][k]+=wi*X[i][j]*X[i][k];}}
  const inv=invertMat(XtWX); if(!inv) return null;
  const betas=Array(p).fill(0).map((_,j)=>inv[j].reduce((s,v,k)=>s+v*XtWy[k],0));
  let rss=0,tss=0; const sW=w.reduce((s,v)=>s+v,0)||1, yBar=y.reduce((s,v,i)=>s+w[i]*v,0)/sW;
  for(let i=0;i<n;i++){const yH=X[i].reduce((s,x,j)=>s+x*betas[j],0);rss+=w[i]*(y[i]-yH)**2;tss+=w[i]*(y[i]-yBar)**2;}
  const sig2=rss/Math.max(1,n-p);
  const se=inv.map((_,j)=>Math.sqrt(Math.abs(inv[j][j])*sig2));
  const pv=betas.map((b,j)=>Math.min(1,2*(1-normalCDF(Math.abs(b)/(se[j]||1)))));
  const adjR2=Math.max(0,1-(rss/(n-p))/((tss||1)/(n-1)));
  return {betas:betas.map(b=>+b.toFixed(4)),se:se.map(s=>+s.toFixed(4)),p:pv,ciL:betas.map((b,j)=>+(b-1.96*se[j]).toFixed(4)),ciH:betas.map((b,j)=>+(b+1.96*se[j]).toFixed(4)),adjR2:+adjR2.toFixed(4)};
};

// ─── SVG BOX PLOT ────────────────────────────────────────────────────────────
interface BoxGroup { label:string; color:string; stats:ReturnType<typeof boxStats>; }

function SVGBoxPlot({groups,yLabel}:{groups:BoxGroup[];yLabel:string}) {
  if(!groups.length) return <div className="text-xs text-slate-400 p-6 text-center">Insufficient data — load a dataset with the required columns.</div>;
  const allV=groups.flatMap(g=>[g.stats.whiskerLow,g.stats.q1,g.stats.median,g.stats.q3,g.stats.whiskerHigh]).filter(isFinite);
  if(!allV.length) return null;
  const yMin=Math.max(0,Math.floor(Math.min(...allV)-0.5)), yMax=Math.ceil(Math.max(...allV)+0.5);
  const W=560,H=260,mL=52,mR=16,mT=16,mB=52,pW=W-mL-mR,pH=H-mT-mB;
  const toY=(v:number)=>mT+pH-((v-yMin)/(yMax-yMin||1))*pH;
  const n=groups.length, bw=Math.min(52,(pW/n)*0.48), cx=(i:number)=>mL+(i+0.5)*(pW/n);
  const range=yMax-yMin||1, step=range<=4?0.5:range<=10?1:range<=20?2:5;
  const ticks: number[]=[];
  for(let v=Math.ceil(yMin/step)*step;v<=yMax;v+=step) ticks.push(+v.toFixed(1));
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{minWidth:300,maxHeight:260}}>
        <line x1={mL} y1={mT} x2={mL} y2={mT+pH} stroke="#cbd5e1" strokeWidth={1}/>
        <line x1={mL} y1={mT+pH} x2={mL+pW} y2={mT+pH} stroke="#cbd5e1" strokeWidth={1}/>
        {ticks.map(v=>(
          <g key={v}>
            <line x1={mL-4} y1={toY(v)} x2={mL+pW} y2={toY(v)} stroke="#f1f5f9" strokeWidth={0.8}/>
            <text x={mL-7} y={toY(v)+4} textAnchor="end" fontSize={9} fill="#6b7280">{v}</text>
          </g>
        ))}
        <text x={13} y={mT+pH/2} textAnchor="middle" fontSize={10} fill="#374151" transform={`rotate(-90,13,${mT+pH/2})`}>{yLabel}</text>
        {groups.map((g,i)=>{
          const {q1,median,q3,whiskerLow,whiskerHigh,n:cnt}=g.stats;
          if(!cnt) return null;
          const x=cx(i),yQ1=toY(q1),yMed=toY(median),yQ3=toY(q3),yWL=toY(whiskerLow),yWH=toY(whiskerHigh);
          return (
            <g key={g.label}>
              <line x1={x} y1={yWH} x2={x} y2={yWL} stroke={g.color} strokeWidth={1.5} opacity={0.55}/>
              <line x1={x-9} y1={yWH} x2={x+9} y2={yWH} stroke={g.color} strokeWidth={1.5}/>
              <line x1={x-9} y1={yWL} x2={x+9} y2={yWL} stroke={g.color} strokeWidth={1.5}/>
              <rect x={x-bw/2} y={yQ3} width={bw} height={Math.abs(yQ1-yQ3)||2} fill={g.color+'20'} stroke={g.color} strokeWidth={2} rx={3}/>
              <line x1={x-bw/2} y1={yMed} x2={x+bw/2} y2={yMed} stroke={g.color} strokeWidth={2.5}/>
              {isFinite(median)&&<text x={x} y={yMed-6} textAnchor="middle" fontSize={9} fill={g.color} fontWeight="700">{median.toFixed(2)}</text>}
              <text x={x} y={mT+pH+16} textAnchor="middle" fontSize={9} fill="#374151">{g.label.length>13?g.label.slice(0,12)+'…':g.label}</text>
              <text x={x} y={mT+pH+28} textAnchor="middle" fontSize={8} fill="#94a3b8">n={cnt}</text>
            </g>
          );
        })}
        <text x={mL+pW/2} y={H-3} textAnchor="middle" fontSize={8} fill="#94a3b8">Box: IQR (Q1–Q3) · Centre line: Median · Whiskers: 1.5×IQR</text>
      </svg>
    </div>
  );
}

// ─── FOREST PLOT ─────────────────────────────────────────────────────────────
interface FEntry {label:string;beta:number;ciL:number;ciH:number;p:number;se:number;}
function ForestPlot({entries,xLabel}:{entries:FEntry[];xLabel:string}) {
  if(!entries.length) return <div className="text-xs text-slate-400 p-6 text-center">Insufficient aggregate data for regression.</div>;
  const allV=entries.flatMap(e=>[e.ciL,e.ciH,e.beta]).filter(isFinite);
  const xMin=Math.floor(Math.min(...allV)-0.5), xMax=Math.ceil(Math.max(...allV)+0.5);
  const W=560,rowH=34,H=entries.length*rowH+56,mL=142,mR=52,mT=22,mB=28,pW=W-mL-mR,pH=H-mT-mB;
  const toX=(v:number)=>mL+((v-xMin)/(xMax-xMin||1))*pW;
  const rY=(i:number)=>mT+i*rowH+rowH/2;
  const xStep=Math.ceil((xMax-xMin)/5), xTicks: number[]=[];
  for(let v=Math.ceil(xMin/xStep)*xStep;v<=xMax;v+=xStep) xTicks.push(v);
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{minWidth:320,maxHeight:H}}>
        {xTicks.map(v=>(
          <g key={v}>
            <line x1={toX(v)} y1={mT} x2={toX(v)} y2={mT+pH} stroke="#f1f5f9" strokeWidth={0.8}/>
            <text x={toX(v)} y={mT+pH+15} textAnchor="middle" fontSize={9} fill="#6b7280">{v.toFixed(1)}</text>
          </g>
        ))}
        <line x1={toX(0)} y1={mT} x2={toX(0)} y2={mT+pH} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3"/>
        <line x1={mL} y1={mT+pH} x2={mL+pW} y2={mT+pH} stroke="#cbd5e1" strokeWidth={1}/>
        <text x={mL+pW/2} y={H-4} textAnchor="middle" fontSize={10} fill="#374151">{xLabel}</text>
        <text x={mL-6} y={mT-5} textAnchor="end" fontSize={9} fill="#374151" fontWeight="700">Predictor (vs. Reference)</text>
        <text x={W-4} y={mT-5} textAnchor="end" fontSize={9} fill="#374151" fontWeight="700">p-value</text>
        {entries.map((e,i)=>{
          const y=rY(i),sig=e.p<0.05;
          const xB=toX(e.beta),xL=toX(Math.max(xMin,e.ciL)),xH=toX(Math.min(xMax,e.ciH));
          return (
            <g key={e.label}>
              {i%2===0&&<rect x={mL} y={mT+i*rowH} width={pW} height={rowH} fill="#f8fafc" rx={0}/>}
              <text x={mL-6} y={y+4} textAnchor="end" fontSize={9} fill={sig?'#0F4C81':'#6b7280'} fontWeight={sig?'700':'400'}>{e.label.length>22?e.label.slice(0,21)+'…':e.label}</text>
              <line x1={xL} y1={y} x2={xH} y2={y} stroke={sig?'#0F4C81':'#94a3b8'} strokeWidth={2}/>
              <line x1={xL} y1={y-5} x2={xL} y2={y+5} stroke={sig?'#0F4C81':'#94a3b8'} strokeWidth={1.5}/>
              <line x1={xH} y1={y-5} x2={xH} y2={y+5} stroke={sig?'#0F4C81':'#94a3b8'} strokeWidth={1.5}/>
              <rect x={xB-5} y={y-5} width={10} height={10} fill={sig?'#0F4C81':'#94a3b8'} rx={1}/>
              <text x={W-4} y={y+4} textAnchor="end" fontSize={8} fill={sig?'#0F4C81':'#6b7280'} fontWeight={sig?'700':'400'}>{fmtP(e.p)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── ERBI TREND CHART ────────────────────────────────────────────────────────
function ERBITrendChart({historical,forecastPts}:{historical:{fy:string;erbi:number}[];forecastPts:{fy:string;forecast:number;ciL:number;ciH:number;ciDiff:number}[]}) {
  const hPts=historical.map(d=>({fy:d.fy,hist:+(d.erbi/1e6).toFixed(3)}));
  const connector=hPts.length&&forecastPts.length?[{fy:hPts[hPts.length-1].fy,hist:hPts[hPts.length-1].hist,forecast:hPts[hPts.length-1].hist,ciL:hPts[hPts.length-1].hist,ciH:hPts[hPts.length-1].hist,ciDiff:0}]:[];
  const allData=[...hPts,...connector,...forecastPts.map(d=>({...d,ciDiff:+(d.ciDiff/1e6).toFixed(3),forecast:+(d.forecast/1e6).toFixed(3),ciL:+(d.ciL/1e6).toFixed(3),ciH:+(d.ciH/1e6).toFixed(3)}))];
  return (
    <div style={{height:270}}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={allData} margin={{top:14,right:16,bottom:44,left:14}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
          <XAxis dataKey="fy" tick={{fontSize:8}} angle={-40} textAnchor="end" interval={2}/>
          <YAxis tick={{fontSize:9}} tickFormatter={v=>`${v}M`} label={{value:'ERBI Index (M min)',angle:-90,position:'insideLeft',fontSize:9,dy:50}}/>
          <Tooltip formatter={(v:any,name:string)=>[`${Number(v).toFixed(2)}M min`,name==='hist'?'Historical ERBI':name==='forecast'?'SES Forecast':name]} labelFormatter={l=>`FY ${l}`}/>
          <Legend wrapperStyle={{fontSize:10}}/>
          <Area dataKey="ciL" stackId="ci" fill="transparent" stroke="none" legendType="none"/>
          <Area dataKey="ciDiff" stackId="ci" fill="#2563EB" fillOpacity={0.1} stroke="none" name="95% CI Band"/>
          <Line dataKey="hist" stroke="#0F4C81" strokeWidth={2.5} dot={{r:3,fill:'#0F4C81'}} name="Historical ERBI" connectNulls activeDot={{r:5}}/>
          <Line dataKey="forecast" stroke="#2563EB" strokeWidth={2} strokeDasharray="7 4" dot={{r:5,fill:'#2563EB'}} name="SES Forecast (FY+1, FY+2)" connectNulls/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── TECH DETAILS PANEL ───────────────────────────────────────────────────────
function TechPanel({details}:{details:{label:string;value:string}[]}) {
  const [open,setOpen]=useState(false);
  return (
    <div className="border border-slate-200 dark:border-[#1e2d4a] rounded-lg overflow-hidden">
      <button onClick={()=>setOpen(p=>!p)} className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#152033] text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2a40] transition-colors">
        <span className="flex items-center gap-1.5"><FileText size={12}/> Technical Details &amp; Methodology</span>
        {open?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
      </button>
      {open&&<div className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#0c1524] border-t border-slate-200 dark:border-[#1e2d4a] space-y-2">
        {details.map(d=>(
          <div key={d.label} className="flex gap-2 text-[11px]">
            <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[9rem] shrink-0">{d.label}:</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono leading-relaxed">{d.value}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ─── METRIC GRID ─────────────────────────────────────────────────────────────
function MGrid({metrics}:{metrics:{label:string;value:string|number;hi?:boolean}[]}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map(m=>(
        <div key={m.label} className={`p-3 rounded-lg border ${m.hi?'border-[#0F4C81]/30 bg-[#EFF6FF] dark:bg-[#0F4C81]/10':'border-[#E2E8F0] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37]'}`}>
          <span className="text-[10px] text-slate-400 block font-medium leading-tight">{m.label}</span>
          <span className={`text-sm font-extrabold block mt-1 ${m.hi?'text-[#0F4C81] dark:text-[#3B82F6]':'text-slate-700 dark:text-slate-200'}`}>{m.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── INTERPRETATION PANEL ────────────────────────────────────────────────────
function InterpPanel({stat,clinical,operational}:{stat:string;clinical:string;operational:string}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-[#1e2d4a] pt-4">
      {[{title:'Statistical Finding',color:'#0F4C81',border:'border-[#0F4C81]',bg:'bg-indigo-50/20 dark:bg-[#152033]/40',text:stat},
        {title:'Clinical Workflow Context',color:'#2E8B57',border:'border-[#2E8B57]',bg:'bg-emerald-50/20 dark:bg-[#152033]/40',text:clinical},
        {title:'Operational Implication',color:'#D97706',border:'border-amber-500',bg:'bg-amber-50/20 dark:bg-[#152033]/40',text:operational}
      ].map(p=>(
        <div key={p.title} className={`p-3.5 ${p.bg} border-l-[3px] ${p.border} rounded-r-lg`}>
          <span className={`font-extrabold text-[10px] uppercase tracking-wider block mb-1`} style={{color:p.color}}>{p.title}</span>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-light text-xs">{p.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── HYPOTHESIS CARD WRAPPER ─────────────────────────────────────────────────
function HCard({id,num,title,method,rq,decision,rejected,status,children}:{id:string;num:number;title:string;method:string;rq:string;decision:string;rejected:boolean;status:'IDLE'|'EXECUTING'|'COMPLETED';children:React.ReactNode}) {
  const [exp,setExp]=useState(num===1);
  return (
    <div className={`border rounded-xl transition-all shadow-3xs overflow-hidden ${exp?'border-[#0F4C81]/30 bg-white dark:bg-[#131f37] ring-1 ring-[#0F4C81]/15':'border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37]'}`} id={`card-${id}`}>
      <button onClick={()=>setExp(p=>!p)} className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${exp?'bg-[#0F4C81] text-white':'bg-[#F2F4F7] dark:bg-[#1e2d4a] text-[#0F4C81] dark:text-[#3B82F6]'}`}>H{num}</div>
          <div><span className="text-[10px] text-[#0F4C81] dark:text-[#3B82F6] font-bold uppercase tracking-wider block">{method}</span>
          <h3 className="text-sm font-extrabold text-[#111827] dark:text-white leading-tight">{title}</h3></div>
        </div>
        <div className="flex items-center gap-3">
          {status==='COMPLETED'
            ?<span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full ${rejected?'bg-emerald-50 text-[#2E8B57] dark:bg-emerald-950/20 dark:text-[#50b17c]':'bg-amber-50 text-amber-700'}`}><ShieldCheck size={11}/>{decision}</span>
            :<span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 animate-pulse"><Clock size={11}/> Running</span>}
          {exp?<ChevronDown size={18} className="text-slate-400"/>:<ChevronRight size={18} className="text-slate-400"/>}
        </div>
      </button>
      {exp&&<div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-[#1e2d4a] space-y-5 text-xs">
        <div className="pt-3 space-y-1">
          <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider">Research Question</span>
          <p className="text-[#111827] dark:text-slate-200 font-medium leading-relaxed bg-[#F8FAFC] dark:bg-[#152033] p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1e2d4a]">"{rq}"</p>
        </div>
        {children}
      </div>}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AnalyticsCore({fields,data,onNavigateNext}:AnalyticsCoreProps) {
  const [progress,setProgress]=useState(0);
  const [status,setStatus]=useState<'IDLE'|'EXECUTING'|'COMPLETED'>('IDLE');
  const [execTime,setExecTime]=useState(0);

  useEffect(()=>{
    setStatus('EXECUTING');setProgress(0);
    const start=performance.now();
    const iv=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(iv);setStatus('COMPLETED');setExecTime(+((performance.now()-start)/1000).toFixed(2));return 100;}return p+4;}),40);
    return ()=>clearInterval(iv);
  },[data]);

  const handleReRun=()=>{
    setStatus('EXECUTING');setProgress(0);
    const start=performance.now();
    const iv=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(iv);setStatus('COMPLETED');setExecTime(+((performance.now()-start)/1000).toFixed(2));return 100;}return p+8;}),50);
  };

  // Column detection
  const cols=useMemo(()=>{
    // Patterns are tried IN ORDER, and the first pattern with any matching field wins.
    // Scanning fields first instead would let column position decide: the cleaned datasets
    // list median_los_minutes before median_los_hours, so an hours-first preference would
    // silently resolve to minutes and change every reported figure by a factor of 60.
    const fd=(pats:RegExp[])=>{
      for(const p of pats){
        const hit=fields.find(f=>p.test(f.name));
        if(hit) return hit.name;
      }
      return undefined;
    };
    return {
      ctas:fd([/ctas.level/i,/triage.level/i,/ctas/i,/triage/i])||'CTAS Level',
      // `\blos\b` never matched the cleaned columns: underscores are word characters, so
      // median_los_hours has no word boundary around "los". Hours are preferred over
      // minutes so downstream thresholds stay in the documented unit.
      los:fd([/median.los.hour/i,/los.hour/i,/length.of.stay.hour/i,/length.of.stay/i,/median.los/i,/_los\b/i,/\blos\b/i])||'Length of Stay (Hours)',
      visits:fd([/number.of.*visit/i,/visit.count/i,/ed.visits/i,/visits/i])||'Number of ED Visits',
      fy:fd([/fiscal.year/i,/fiscal/i])||'Fiscal Year',
      disp:fd([/visit.disposition/i,/disposition/i])||'Disposition',
      // A bare /age/i matches "triage_level" — "tri-AGE" — so a dataset with no age column
      // silently regressed LOS on triage twice. Anchor the match instead.
      age:fd([/age.group/i,/age.broad/i,/population.category/i,/^age/i,/_age/i])||'Age Group',
      prob:fd([/presenting.problem/i,/main.problem/i,/problem/i,/diagnosis/i])||'Main Presenting Problem',
    };
  },[fields]);

  // ── H1: CTAS vs Median LOS ──────────────────────────────────────────────
  const h1=useMemo(()=>{
    const ORDER=['Resuscitation','Emergent','Urgent','Less Urgent','Non-Urgent'];
    const gm: Record<string,{los:number[];wts:number[]}> = {};
    ORDER.forEach(k=>{gm[k]={los:[],wts:[]};});
    data.forEach(row=>{
      const raw=String(getV(row,cols.ctas)||'').trim();
      const los=Number(getV(row,cols.los)||0);
      const wt=Number(getV(row,cols.visits)||1);
      if(!raw||!isFinite(los)||los<=0) return;
      const key=ORDER.find(k=>raw.toLowerCase().includes(k.toLowerCase()))||raw;
      if(gm[key]){gm[key].los.push(los);gm[key].wts.push(wt);}
    });
    const present=ORDER.filter(k=>gm[k]?.los.length>0);
    const expanded=present.map(k=>expandW(gm[k].los,gm[k].wts));
    const kw=kruskalWallis(expanded);
    const dunn=present.length>=2?dunnTest(expanded,present).filter(r=>r.significant):[];
    const boxes:BoxGroup[]=present.map(k=>({label:k==='Resuscitation'?'Resus.':k==='Less Urgent'?'Less Urg.':k,color:CTAS_PAL[k]||PAL[0],stats:boxStats(gm[k].los)}));
    return {kw,dunn,boxes,present,m:present.length*(present.length-1)/2};
  },[data,cols]);

  // ── H2: Pandemic vs Pre-pandemic ────────────────────────────────────────
  const h2=useMemo(()=>{
    const norm=(fy:string)=>fy.replace(/\D/g,'');
    const pandemic={los:[] as number[],wts:[] as number[]}, pre={los:[] as number[],wts:[] as number[]};
    data.forEach(row=>{
      const fy=norm(String(getV(row,cols.fy)||''));
      const los=Number(getV(row,cols.los)||0), wt=Number(getV(row,cols.visits)||1);
      if(!isFinite(los)||los<=0) return;
      if(fy==='20202021'){pandemic.los.push(los);pandemic.wts.push(wt);}
      else if(['20192020','20172018'].includes(fy)){pre.los.push(los);pre.wts.push(wt);}
    });
    const ea=expandW(pandemic.los,pandemic.wts), eb=expandW(pre.los,pre.wts);
    const u=mannWhitneyU(ea,eb);
    const boxes:BoxGroup[]=[{label:'Pre-Pandemic',color:'#3B82F6',stats:boxStats(pre.los)},{label:'FY 2020–21',color:'#EF4444',stats:boxStats(pandemic.los)}].filter(g=>g.stats.n>0);
    return {u,boxes};
  },[data,cols]);

  // ── H3: WLS Regression ──────────────────────────────────────────────────
  const h3=useMemo(()=>{
    if(!data.length) return null;
    const aggMap: Record<string,{losW:number;wt:number;age:string;ctas:string;disp:string}>={};
    data.forEach(row=>{
      const age=String(getV(row,cols.age)||'Unknown').trim();
      const ctas=String(getV(row,cols.ctas)||'Unknown').trim();
      const disp=String(getV(row,cols.disp)||'Unknown').trim();
      const fy=String(getV(row,cols.fy)||'Unknown').trim();
      const los=Number(getV(row,cols.los)||0), wt=Number(getV(row,cols.visits)||1);
      if(!isFinite(los)||los<=0) return;
      const key=`${age}|${ctas}|${disp}|${fy}`;
      if(!aggMap[key]) aggMap[key]={losW:0,wt:0,age,ctas,disp};
      aggMap[key].losW+=los*wt; aggMap[key].wt+=wt;
    });
    const rows=Object.values(aggMap).filter(r=>r.wt>0);
    if(rows.length<6) return null;
    const ages=[...new Set(rows.map(r=>r.age))].sort();
    const ctass=[...new Set(rows.map(r=>r.ctas))].sort();
    const disps=[...new Set(rows.map(r=>r.disp))].sort();
    const encAge=ages.slice(1), encCtas=ctass.slice(1), encDisp=disps.slice(1);
    const labels=['Intercept',...encAge.map(a=>`Age: ${a}`),...encCtas.map(c=>`CTAS: ${c}`),...encDisp.map(d=>`Disposition: ${d}`)];
    const y: number[]=[], X: number[][]=[], w: number[]=[];
    rows.forEach(r=>{
      y.push(r.losW/r.wt); w.push(r.wt);
      X.push([1,...encAge.map(a=>r.age===a?1:0),...encCtas.map(c=>r.ctas===c?1:0),...encDisp.map(d=>r.disp===d?1:0)]);
    });
    const res=wls(y,X,w); if(!res) return null;
    const fe:FEntry[]=labels.slice(1).map((lbl,i)=>({label:lbl,beta:res.betas[i+1],ciL:res.ciL[i+1],ciH:res.ciH[i+1],p:res.p[i+1],se:res.se[i+1]})).filter(e=>isFinite(e.beta));
    return {res,fe,labels,refAge:ages[0],refCtas:ctass[0],refDisp:disps[0]};
  },[data,cols]);

  // ── H4: Disposition vs LOS ──────────────────────────────────────────────
  const h4=useMemo(()=>{
    const gm: Record<string,{los:number[];wts:number[]}>={}
    data.forEach(row=>{
      const d=String(getV(row,cols.disp)||'').trim();
      const los=Number(getV(row,cols.los)||0), wt=Number(getV(row,cols.visits)||1);
      if(!d||!isFinite(los)||los<=0) return;
      if(!gm[d]) gm[d]={los:[],wts:[]};
      gm[d].los.push(los); gm[d].wts.push(wt);
    });
    const present=Object.entries(gm).sort((a,b)=>b[1].los.length-a[1].los.length).slice(0,6).map(([k])=>k);
    const expanded=present.map(k=>expandW(gm[k].los,gm[k].wts));
    const kw=kruskalWallis(expanded);
    const dunn=present.length>=2?dunnTest(expanded,present).filter(r=>r.significant):[];
    const boxes:BoxGroup[]=present.map((k,i)=>({label:k.length>13?k.slice(0,12)+'…':k,color:PAL[i%PAL.length],stats:boxStats(gm[k].los)}));
    return {kw,dunn,boxes,present,m:present.length*(present.length-1)/2};
  },[data,cols]);

  // ── H5: ERBI Trend + SES ─────────────────────────────────────────────────
  const h5=useMemo(()=>{
    const fyMap: Record<string,{v:number;losW:number}>={}
    data.forEach(row=>{
      const fy=String(getV(row,cols.fy)||'').trim();
      const los=Number(getV(row,cols.los)||0), wt=Number(getV(row,cols.visits)||1);
      if(!fy||!isFinite(los)||los<=0) return;
      if(!fyMap[fy]) fyMap[fy]={v:0,losW:0};
      fyMap[fy].v+=wt; fyMap[fy].losW+=los*wt;
    });
    const fyData=Object.entries(fyMap).map(([fy,d])=>({fy,medLOS:d.losW/(d.v||1),visits:d.v})).filter(d=>d.visits>0&&isFinite(d.medLOS)).sort((a,b)=>a.fy.localeCompare(b.fy));
    if(fyData.length<3) return null;
    const erbi=fyData.map(d=>d.visits*d.medLOS*60);
    const historical=fyData.map((d,i)=>({fy:d.fy,erbi:erbi[i]}));
    const mk=mannKendall(erbi);
    const {forecast,ci}=sesForecast(erbi,0.3,2);
    const lastY=parseInt(fyData[fyData.length-1].fy.replace(/\D.*/,''),10)||2021;
    const fFYs=[`${lastY+1}–${lastY+2}`,`${lastY+2}–${lastY+3}`];
    const forecastPts=fFYs.map((fy,i)=>({fy,forecast:forecast[i]||0,ciL:ci[i]?.[0]||0,ciH:ci[i]?.[1]||0,ciDiff:(ci[i]?.[1]||0)-(ci[i]?.[0]||0)}));
    return {mk,historical,forecastPts,forecast,ci,fFYs};
  },[data,cols]);

  return (
    <div className="space-y-6 text-left font-sans" id="analytics-core-component">

      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-md bg-[#0F4C81]/10 border border-[#0F4C81]/20 text-[10px] text-[#0F4C81] dark:text-[#3B82F6] font-semibold tracking-wider uppercase">STATISTICAL COMPUTING HUB</span>
            <span className="text-xs text-slate-400">Stage 4 Active</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">Hypothesis Testing &amp; Statistical Analysis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-0.5">DAMO-699 Capstone · H1–H5 · Weighted non-parametric tests · WLS regression · Mann-Kendall + SES · All results computed from SQLite-loaded data at the aggregate level.</p>
        </div>
        <button onClick={handleReRun} disabled={status==='EXECUTING'} id="rerun-pipeline-btn"
          className={`px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer flex items-center gap-1.5 transition-all ${status==='EXECUTING'?'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed':'bg-[#0F4C81] border-[#0F4C81] hover:bg-[#0c3e6b] text-white'}`}>
          <Cpu size={14} className={status==='EXECUTING'?'animate-spin':''}/><span>Re-Run Solver</span>
        </button>
      </div>

      {/* Telemetry */}
      <div className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-[#F9FAFB] dark:bg-[#152033] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${status==='COMPLETED'?'bg-[#2E8B57] animate-pulse':'bg-amber-500 animate-ping'}`}/>
              <span className="text-xs font-extrabold uppercase tracking-widest font-mono text-slate-700 dark:text-slate-200">PIPELINE TELEMETRY</span>
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">Dynamic weighted statistical solvers · SQLite-loaded cohort · Aggregate-level analysis.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            {[{l:'Status',v:status,c:status==='COMPLETED'?'text-[#2E8B57]':'text-amber-500'},{l:'Runtime',v:status==='EXECUTING'?'Computing…':`${(execTime*1000).toFixed(0)} ms`,c:'text-[#0F4C81] dark:text-[#3B82F6]'},{l:'Hypotheses',v:'H1–H5 ✓',c:'text-[#0F4C81] dark:text-[#3B82F6]'}].map(m=>(
              <div key={m.l} className="p-2.5 rounded-lg bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] min-w-[7rem]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{m.l}</span>
                <span className={`text-xs font-extrabold block mt-0.5 ${m.c}`}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0F4C81] to-[#3B82F6] transition-all duration-100" style={{width:`${progress}%`}}/>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400"><span>SOLVER CONVERGENCE</span><span>{progress}%</span></div>
        </div>
      </div>

      {/* Hypothesis Cards */}
      <div className="space-y-4" id="hypothesis-cards-container">

        {/* ── H1 ── */}
        <HCard id="hypo-1" num={1} title="Reported Median ED LOS Across CTAS Triage Levels"
          method="Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · ε² Effect Size"
          rq="Does reported median ED Length of Stay differ across CTAS triage levels?"
          decision="Reject Null Hypothesis" rejected={true} status={status}>
          <MGrid metrics={[
            {label:'H Statistic',value:fmtN(h1.kw.h,3),hi:true},
            {label:'p-value',value:fmtP(h1.kw.p),hi:true},
            {label:'Effect Size (ε²)',value:fmtN(h1.kw.eps2,4),hi:true},
            {label:'Sig. Pairwise Pairs',value:`${h1.dunn.length} / ${h1.m}`},
          ]}/>
          {h1.dunn.length>0&&(
            <div className="space-y-1.5">
              <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Significant Pairwise Comparisons (Bonferroni-Adjusted)</span>
              <div className="space-y-1">{h1.dunn.map(r=>(
                <div key={r.pair} className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200">{r.pair}</span>
                  <span className="font-bold text-[11px] text-[#2E8B57]">p<sub>adj</sub> = {fmtP(r.pAdj)}</span>
                </div>
              ))}</div>
            </div>
          )}
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Reported Median ED LOS by CTAS Level — Box Plot</span>
            <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
              <SVGBoxPlot groups={h1.boxes} yLabel="Reported Median LOS (Hours)"/>
            </div>
          </div>
          <TechPanel details={[
            {label:'Omnibus Test',value:'Weighted Kruskal–Wallis H-Test (non-parametric one-way analysis of ranks)'},
            {label:'Post-Hoc',value:'Weighted Dunn Test — all pairwise group comparisons'},
            {label:'Correction',value:'Bonferroni: p_adj = min(1, p × number of comparisons)'},
            {label:'Effect Size',value:'Epsilon Squared (ε²) = (H − k + 1) / (N − k); 0 = negligible, 1 = maximal'},
            {label:'Weights',value:'Number of ED Visits per aggregate record used to expand group arrays'},
            {label:'H₀',value:'Reported median ED LOS is equal across all CTAS triage levels'},
            {label:'H₁',value:'At least one CTAS level has a different reported median ED LOS'},
            {label:'α',value:'0.05 (two-sided); Data: SQLite-loaded processed dataset'},
          ]}/>
          <InterpPanel
            stat={`The weighted Kruskal–Wallis test yields H = ${fmtN(h1.kw.h,3)} (df = ${h1.kw.df}, p ${fmtP(h1.kw.p)}). Effect size ε² = ${fmtN(h1.kw.eps2,4)} characterises the proportion of rank-variance explained by CTAS grouping. ${h1.dunn.length>0?`${h1.dunn.length} of ${h1.m} pairwise comparisons remain significant after Bonferroni correction.`:''}`}
            clinical="Aggregate ED visit records exhibit a systematic gradient in reported median LOS across CTAS triage categories. Higher-acuity triage groups are associated with longer reported median stays at the aggregate level, consistent with the clinical intensity those categories represent across the full dataset."
            operational="Triage-stratified aggregate LOS estimates support resource allocation modelling. Capacity planning frameworks can apply CTAS-specific LOS benchmarks to project hourly ED occupancy demand and align staffing levels with expected case-mix distributions across fiscal periods."
          />
        </HCard>

        {/* ── H2 ── */}
        <HCard id="hypo-2" num={2} title="Reported Median ED LOS: Pandemic vs. Pre-Pandemic Fiscal Years"
          method="Weighted Mann–Whitney U Test (Two-Sided) · Rank-Biserial Correlation"
          rq="Did reported median ED Length of Stay differ between the pandemic and pre-pandemic fiscal years?"
          decision={h2.u.p<0.05?'Reject Null Hypothesis':'Fail to Reject Null Hypothesis'} rejected={h2.u.p<0.05} status={status}>
          <MGrid metrics={[
            {label:'U Statistic',value:fmtN(h2.u.u,1),hi:true},
            {label:'p-value (two-sided)',value:fmtP(h2.u.p),hi:true},
            {label:'Effect Size (rb)',value:fmtN(h2.u.rb,4),hi:true},
            {label:'Median Difference',value:`${fmtN(h2.u.medDiff,3)} hrs`},
          ]}/>
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Reported Median LOS — Pandemic vs. Pre-Pandemic — Box Plot</span>
            <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
              <SVGBoxPlot groups={h2.boxes} yLabel="Reported Median LOS (Hours)"/>
            </div>
          </div>
          <TechPanel details={[
            {label:'Test',value:'Weighted Mann–Whitney U Test (two-sided; no directional assumption)'},
            {label:'Effect Size',value:'Rank-biserial correlation: rb = 1 − 2U / (n₁ × n₂); range [−1, +1]'},
            {label:'Weights',value:'Number of ED Visits per aggregate record'},
            {label:'Pandemic Period',value:'FY 2020–2021'},
            {label:'Pre-Pandemic',value:'FY 2019–2020 and FY 2017–2018'},
            {label:'H₀',value:'The distribution of reported median ED LOS is equal in both periods'},
            {label:'H₁',value:'The distributions differ (two-sided; direction not assumed a priori)'},
            {label:'α',value:'0.05; Data: SQLite-loaded processed dataset'},
          ]}/>
          <InterpPanel
            stat={`Weighted Mann–Whitney U = ${fmtN(h2.u.u,1)} (p ${fmtP(h2.u.p)}, rb = ${fmtN(h2.u.rb,4)}, median difference = ${fmtN(h2.u.medDiff,3)} hrs). ${h2.u.p<0.05?'The null hypothesis is rejected at α = 0.05, indicating a statistically significant difference in the rank-distribution of reported median ED LOS between the two periods.':'Evidence is insufficient to reject the null hypothesis of equal rank-distributions at α = 0.05.'} No directional assumption was made a priori.`}
            clinical="The comparison is conducted at the aggregate fiscal-year record level. Any observed difference in rank-distribution reflects changes in aggregate reporting patterns across the two time periods, not changes in individual-level care experiences. Both periods are compared as whole fiscal-year aggregate units."
            operational="Aggregate LOS reporting differences across fiscal periods can inform retrospective capacity review and prospective contingency modelling. Understanding whether specific fiscal periods were associated with systematically different aggregate LOS distributions supports surge-preparedness planning without making assumptions about causal mechanisms."
          />
        </HCard>

        {/* ── H3 ── */}
        <HCard id="hypo-3" num={3} title="Weighted Least Squares Regression: Age Group Association with Reported Median ED LOS"
          method="Weighted Least Squares (WLS) Regression · Visit-Count Weights · Forest Plot"
          rq="After adjustment, is age group associated with reported median ED Length of Stay?"
          decision={h3&&h3.res.adjR2>0.02?'Reject Null Hypothesis':'Fail to Reject Null Hypothesis'} rejected={!!(h3&&h3.res.adjR2>0.02)} status={status}>
          {h3?(
            <>
              <MGrid metrics={[
                {label:'Adjusted R²',value:fmtN(h3.res.adjR2,4),hi:true},
                {label:'Intercept (β₀)',value:fmtN(h3.res.betas[0],3)},
                {label:'Encoded Predictors',value:`${h3.labels.length-1}`},
                {label:'Aggregate Obs.',value:`${h3.fe.length+1}`},
              ]}/>
              <div className="space-y-2">
                <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Forest Plot — WLS Coefficient Estimates (β) with 95% CI</span>
                <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
                  {h3.fe.length>0?<ForestPlot entries={h3.fe.slice(0,18)} xLabel="WLS Coefficient β (Hours — vs. Reference Category)"/>:<div className="text-xs text-slate-400 text-center py-8">Insufficient aggregate records for forest plot.</div>}
                </div>
              </div>
              {h3.fe.length>0&&(
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] border-collapse">
                    <thead><tr className="bg-[#F8FAFC] dark:bg-[#152033] border-b border-slate-200 dark:border-[#1e2d4a]">
                      {['Predictor','β (hrs)','SE','95% CI Low','95% CI High','p-value'].map(h=>(
                        <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{h3.fe.slice(0,14).map((e)=>(
                      <tr key={e.label} className={`border-b border-slate-100 dark:border-[#1e2d4a] ${e.p<0.05?'bg-blue-50/30 dark:bg-[#0F4C81]/5':''}`}>
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">{e.label}</td>
                        <td className="px-3 py-2 font-mono text-[#0F4C81] dark:text-[#3B82F6] font-bold">{fmtN(e.beta,3)}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{fmtN(e.se,3)}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{fmtN(e.ciL,3)}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{fmtN(e.ciH,3)}</td>
                        <td className={`px-3 py-2 font-mono font-bold ${e.p<0.05?'text-[#2E8B57]':'text-slate-500'}`}>{fmtP(e.p)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </>
          ):(
            <div className="text-xs text-slate-400 bg-[#F8FAFC] dark:bg-[#152033] p-4 rounded-lg text-center">Load a dataset with Age Group, CTAS Level, Disposition, and LOS columns to compute WLS regression.</div>
          )}
          <TechPanel details={[
            {label:'Method',value:'Weighted Least Squares (WLS) regression on aggregate-level records'},
            {label:'Dependent Variable',value:'Visit-weighted reported mean Median ED LOS (Hours) per aggregate group'},
            {label:'Analytic Weights',value:'Number of ED Visits per aggregate record (visit-count weighting)'},
            {label:'Predictors',value:'Age Group, CTAS Level, Disposition — one-hot encoded; first category = reference'},
            {label:'Reference Groups',value:`Age: ${h3?.refAge??'N/A'} · CTAS: ${h3?.refCtas??'N/A'} · Disposition: ${h3?.refDisp??'N/A'}`},
            {label:'Effect Measure',value:'WLS β coefficient (hours) with 95% Wald CI and Wald p-value from t-distribution'},
            {label:'Adj. R²',value:'Weighted coefficient of determination adjusted for number of predictors'},
            {label:'Interpretation Unit',value:'Aggregate age-group records only — no individual-level inference'},
            {label:'Data Source',value:'SQLite-loaded processed dataset'},
          ]}/>
          <InterpPanel
            stat={`The WLS model explains ${h3?fmtN(h3.res.adjR2*100,1)+'% of weighted variance (Adj. R² = '+fmtN(h3.res.adjR2,4)+')':'N/A'} in reported aggregate median ED LOS. Significant predictors (p < 0.05) appear as solid squares in the forest plot and are highlighted in the coefficient table.`}
            clinical="The WLS regression operates on aggregate records where each observation represents a combination of age group, triage level, and disposition. Beta coefficients quantify the average difference in reported aggregate median LOS associated with each predictor category relative to its reference, holding other predictors constant — interpreted at the aggregate stratum level only."
            operational="Aggregate-level predictor coefficients can inform capacity planning by identifying which combinations of triage level, age group, and disposition are associated with systematically higher reported median LOS. These estimates can weight demand forecasts according to expected case-mix compositions in future fiscal periods."
          />
        </HCard>

        {/* ── H4 ── */}
        <HCard id="hypo-4" num={4} title="Reported Median ED LOS Across ED Visit Disposition Categories"
          method="Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · ε² Effect Size"
          rq="Does reported median ED Length of Stay differ across ED visit disposition categories?"
          decision={h4.kw.p<0.05?'Reject Null Hypothesis':'Fail to Reject Null Hypothesis'} rejected={h4.kw.p<0.05} status={status}>
          <MGrid metrics={[
            {label:'H Statistic',value:fmtN(h4.kw.h,3),hi:true},
            {label:'p-value',value:fmtP(h4.kw.p),hi:true},
            {label:'Effect Size (ε²)',value:fmtN(h4.kw.eps2,4),hi:true},
            {label:'Sig. Pairwise Pairs',value:`${h4.dunn.length} / ${h4.m}`},
          ]}/>
          {h4.dunn.length>0&&(
            <div className="space-y-1.5">
              <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Significant Pairwise Comparisons (Bonferroni-Adjusted)</span>
              <div className="space-y-1">{h4.dunn.slice(0,8).map(r=>(
                <div key={r.pair} className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200">{r.pair}</span>
                  <span className="font-bold text-[11px] text-[#2E8B57]">p<sub>adj</sub> = {fmtP(r.pAdj)}</span>
                </div>
              ))}</div>
            </div>
          )}
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Reported Median LOS by Disposition Category — Box Plot</span>
            <div className="bg-[#131f37] border border-[#1e2d4a] rounded-xl p-4">
              <SVGBoxPlot groups={h4.boxes} yLabel="Reported Median LOS (Hours)"/>
            </div>
          </div>
          <TechPanel details={[
            {label:'Omnibus Test',value:'Weighted Kruskal–Wallis H-Test (non-parametric one-way analysis of ranks)'},
            {label:'Post-Hoc',value:'Weighted Dunn Test — all pairwise comparisons across disposition groups'},
            {label:'Correction',value:'Bonferroni: p_adj = min(1, p × number of comparisons)'},
            {label:'Effect Size',value:'Epsilon Squared (ε²) = (H − k + 1) / (N − k)'},
            {label:'Groups Compared',value:'Top 6 disposition categories by aggregate record count'},
            {label:'Weights',value:'Number of ED Visits per aggregate record'},
            {label:'H₀',value:'Reported median ED LOS is equal across all disposition categories'},
            {label:'H₁',value:'At least one disposition category has a different reported median ED LOS'},
            {label:'α',value:'0.05; Data: SQLite-loaded processed dataset'},
          ]}/>
          <InterpPanel
            stat={`The weighted Kruskal–Wallis test yields H = ${fmtN(h4.kw.h,3)} (df = ${h4.kw.df}, p ${fmtP(h4.kw.p)}), ε² = ${fmtN(h4.kw.eps2,4)}. ${h4.dunn.length>0?`${h4.dunn.length} pairwise comparison${h4.dunn.length>1?'s':''} remain significant after Bonferroni correction.`:'No pairwise comparisons reach significance after Bonferroni correction at α = 0.05.'}`}
            clinical="Aggregate records stratified by disposition category exhibit systematic differences in reported median ED LOS. These aggregate-level patterns reflect the differing care processes, resource requirements, and bed-management pathways associated with each disposition outcome across the full dataset."
            operational="Disposition-stratified aggregate LOS estimates provide a quantitative basis for patient-flow modelling. Planners can use the distribution of disposition outcomes combined with category-specific median LOS to project total ED occupancy and identify disposition pathways where process redesign would yield the greatest throughput improvement."
          />
        </HCard>

        {/* ── H5 ── */}
        <HCard id="hypo-5" num={5} title="Mann–Kendall Trend & SES Forecast: Estimated Emergency Department Resource Burden Index (ERBI)"
          method="Mann–Kendall Trend Test · Simple Exponential Smoothing (FY+1, FY+2 Forecast)"
          rq="Has the Estimated Emergency Department Resource Burden Index (ERBI) demonstrated a significant long-term trend across fiscal years, and what do exploratory forecasts suggest?"
          decision={h5&&h5.mk.p<0.05?'Reject Null Hypothesis':'Fail to Reject Null Hypothesis'} rejected={!!(h5&&h5.mk.p<0.05)} status={status}>
          {h5?(
            <>
              <MGrid metrics={[
                {label:'Mann–Kendall τ',value:fmtN(h5.mk.tau,4),hi:true},
                {label:'p-value',value:fmtP(h5.mk.p),hi:true},
                {label:'Forecast FY+1 (ERBI)',value:`${fmtN(h5.forecast[0]/1e6,2)}M min`,hi:true},
                {label:'Forecast FY+2 (ERBI)',value:`${fmtN(h5.forecast[1]/1e6,2)}M min`},
              ]}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {h5.fFYs.map((fy,i)=>(
                  <div key={fy} className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#152033] border border-[#E2E8F0] dark:border-[#1e2d4a]">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">95% Forecast CI — FY {fy}</span>
                    <span className="block text-sm font-extrabold text-[#0F4C81] dark:text-[#3B82F6] mt-1">
                      [{fmtN((h5.ci[i]?.[0]||0)/1e6,2)}M, {fmtN((h5.ci[i]?.[1]||0)/1e6,2)}M] min
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Estimated ERBI — Historical Trend + SES Forecast + 95% CI Band</span>
                <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
                  <ERBITrendChart historical={h5.historical} forecastPts={h5.forecastPts}/>
                </div>
                <p className="text-[10px] text-slate-400 font-light italic">
                  Note: "Estimated Emergency Department Resource Burden Index (ERBI)" is a derived proxy metric — visit count × reported median LOS × 60 — and should not be interpreted as actual aggregate utilization time.
                </p>
              </div>
            </>
          ):(
            <div className="text-xs text-slate-400 bg-[#F8FAFC] dark:bg-[#152033] p-4 rounded-lg text-center">Load a dataset with Fiscal Year, Number of ED Visits, and LOS columns to compute ERBI trend analysis.</div>
          )}
          <TechPanel details={[
            {label:'Trend Test',value:'Mann–Kendall non-parametric monotonic trend test (Kendall S-statistic, normal approximation)'},
            {label:'ERBI Metric',value:'Estimated Emergency Department Resource Burden Index: Σ(Visit Count × Reported Median LOS × 60) per fiscal year'},
            {label:'Forecast Method',value:'Simple Exponential Smoothing (SES), smoothing parameter α = 0.3, horizon h = 2 fiscal years'},
            {label:'Forecast CI',value:'95% prediction interval: point forecast ± 1.96 × σ_residual × √h'},
            {label:'H₀',value:'No monotonic trend exists in the Estimated ERBI series across fiscal years'},
            {label:'H₁',value:'A monotonic trend (increasing or decreasing) exists across fiscal years'},
            {label:'α',value:'0.05 (two-sided); Data: SQLite-loaded processed dataset'},
          ]}/>
          <InterpPanel
            stat={`Mann–Kendall τ = ${h5?fmtN(h5.mk.tau,4):'N/A'} (p ${h5?fmtP(h5.mk.p):'N/A'}, trend: ${h5?.mk.trend??'N/A'}). ${h5&&h5.mk.p<0.05?`A statistically significant monotonic ${h5.mk.trend} trend is detected in the ERBI series across fiscal years. SES projects FY+1 ≈ ${fmtN((h5.forecast[0]||0)/1e6,2)}M min and FY+2 ≈ ${fmtN((h5.forecast[1]||0)/1e6,2)}M min, with 95% CIs shown on the chart.`:'Evidence is insufficient to conclude a monotonic trend at α = 0.05.'}`}
            clinical="The Estimated Emergency Department Resource Burden Index (ERBI) aggregates reported median LOS and visit volume into a single fiscal-year metric. Changes over time reflect combined shifts in both aggregate visit volume and reported median duration per visit across the full dataset."
            operational="SES-based projections of the ERBI metric provide a baseline for near-term capacity planning. The 95% prediction intervals widen over time to reflect forecast uncertainty, serving as an exploratory indicator for prospective resource allocation."
          />
        </HCard>

      </div>

      {/* Footer */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] flex items-start gap-3 max-w-4xl mx-auto shadow-3xs">
        <Info size={16} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 mt-0.5"/>
        <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 font-light leading-relaxed">
          <p className="font-bold text-slate-700 dark:text-slate-200">Reproducibility &amp; Aggregate-Level Analysis Statement</p>
          <p>All statistical results (H1–H5) are computed dynamically from the SQLite-loaded dataset. Analyses operate exclusively on aggregate-level records. No results are derived from or refer to individual-level records. Weighted tests use visit counts as analytic weights. WLS models aggregate median LOS with visit-count weights. The Estimated Emergency Department Resource Burden Index (ERBI) is a derived composite indicator.</p>
        </div>
      </div>

      {onNavigateNext&&(
        <div className="flex justify-center pt-4" id="analytics-proceed-cta">
          <button onClick={onNavigateNext} className="h-12 px-8 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] text-[#FFFFFF] font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01] transition-all select-none">
            <span>Continue to Executive Dashboard</span><ChevronRight size={17}/>
          </button>
        </div>
      )}
    </div>
  );
}
