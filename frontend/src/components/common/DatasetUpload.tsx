/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Database, FileSpreadsheet, Sparkles, Check, ChevronRight, 
  Loader2, RefreshCw, ShieldCheck, Trash2, CheckCircle2, AlertTriangle, Info,
  HardDrive, Server, ArrowRight
} from 'lucide-react';
import { sampleDatasets } from '../../utils/mockDatasets';
import { PreloadedDataset } from '../../utils/types';

interface DatasetUploadProps {
  onDatasetSelected: (name: string, fields: any[], data: any[]) => void;
  isLoading: boolean;
  preloadedDatasets?: PreloadedDataset[];
  preloadStatus?: 'idle' | 'loading' | 'loaded' | 'error';
}

interface DatasetState {
  id: number;
  name: string;
  expectedName: string;
  description: string;
  uploaded: boolean;
  fileName: string | null;
  rows: number;
  cols: number;
  fileSize: string;
  missing: number;
  duplicates: number;
  dataTypes: string;
  validated: boolean;
  data: any[];
  fields: any[];
}

export default function DatasetUpload({ 
  onDatasetSelected, 
  isLoading,
  preloadedDatasets = [],
  preloadStatus = 'idle'
}: DatasetUploadProps) {
  const [datasets, setDatasets] = useState<DatasetState[]>([
    {
      id: 0,
      name: "Dataset 1",
      expectedName: "Top 10 Main Problems",
      description: "Top 10 chief complaints and main problems reported in emergency department visits across Canada.",
      uploaded: false,
      fileName: null,
      rows: 0, cols: 0,
      fileSize: "0 KB",
      missing: 0, duplicates: 0,
      dataTypes: "N/A",
      validated: false,
      data: [], fields: []
    },
    {
      id: 1,
      name: "Dataset 2",
      expectedName: "ED Visits from 2003 - 2021",
      description: "Longitudinal CIHI aggregate summaries mapping emergency department visit volumes, wait times, and triage distributions from 2003 to 2021.",
      uploaded: false,
      fileName: null,
      rows: 0, cols: 0,
      fileSize: "0 KB",
      missing: 0, duplicates: 0,
      dataTypes: "N/A",
      validated: false,
      data: [], fields: []
    },
    {
      id: 2,
      name: "Dataset 3",
      expectedName: "ED Visits by Month, Age and Sex, Participating Provinces",
      description: "Post-pandemic real-time emergency care visit records broken down by month, age group, and sex across participating Canadian provinces.",
      uploaded: false,
      fileName: null,
      rows: 0, cols: 0,
      fileSize: "0 KB",
      missing: 0, duplicates: 0,
      dataTypes: "N/A",
      validated: false,
      data: [], fields: []
    }
  ]);

  // Track which dataset cards were auto-loaded from the SQLite store
  const [sqliteLoaded, setSqliteLoaded] = useState<boolean[]>([false, false, false]);

  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<{
    isProcessing: boolean;
    percentage: number;
    message: string;
  }>({
    isProcessing: false,
    percentage: 0,
    message: ''
  });

  // ── AUTO-POPULATE FROM SQLITE ON MOUNT ────────────────────────────────────
  // When server preloaded datasets arrive (already imported into SQLite),
  // automatically fill all 3 cards so no manual upload is needed.
  useEffect(() => {
    if (preloadStatus !== 'loaded' || preloadedDatasets.length === 0) return;

    const keyOrder = ['dataset_1', 'dataset_2', 'dataset_3'];

    setDatasets(prev => prev.map((slot, idx) => {
      const serverDs = preloadedDatasets.find(d => d.key === keyOrder[idx]);
      if (!serverDs || serverDs.loadStatus !== 'success' || serverDs.data.length === 0) {
        return slot;
      }

      // Derive a clean filename from the absolute server file path
      const rawPath = serverDs.filePath || '';
      const fileName = rawPath.split('\\').pop() || rawPath.split('/').pop() || serverDs.name + '.xlsx';

      return {
        ...slot,
        uploaded: true,
        fileName,
        rows: serverDs.rows,
        cols: serverDs.cols,
        fileSize: serverDs.fileSize,
        missing: serverDs.missingValues,
        duplicates: serverDs.duplicates,
        dataTypes: (serverDs.dataTypes || []).slice(0, 3).join(', ') + ((serverDs.dataTypes || []).length > 3 ? '...' : ''),
        validated: true,
        data: serverDs.data,
        fields: serverDs.fields
      };
    }));

    setSqliteLoaded([true, true, true]);
  }, [preloadStatus, preloadedDatasets]);



  const triggerUploadFile = (id: number) => {
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  const loadDemoDataset = (id: number) => {
    const demo = sampleDatasets[id];
    if (!demo) return;

    setLoadingState({
      isProcessing: true,
      percentage: 0,
      message: `Loading demo dataset for ${demo.name}...`
    });

    let pct = 0;
    const interval = setInterval(() => {
      pct += 10;
      setLoadingState(prev => ({
        ...prev,
        percentage: pct,
        message: pct >= 80 ? "Verifying data structures..." : `Extracting records for ${demo.name}...`
      }));

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLoadingState({ isProcessing: false, percentage: 0, message: '' });
          
          // Deep clone data
          const dataClone = JSON.parse(JSON.stringify(demo.data));
          
          // Calculate missing & duplicates
          const numRows = dataClone.length;
          const numCols = demo.fields.length;
          const missingCount = dataClone.reduce((acc: number, r: any) => 
            acc + demo.fields.reduce((fAcc: number, f: any) => fAcc + (r[f.name] === null || r[f.name] === undefined ? 1 : 0), 0)
          , 0);

          // Find duplicates
          const seen = new Set();
          let dupCount = 0;
          dataClone.forEach((r: any) => {
            const keyStr = JSON.stringify(r);
            if (seen.has(keyStr)) {
              dupCount++;
            } else {
              seen.add(keyStr);
            }
          });

          setDatasets(prev => prev.map(d => {
            if (d.id === id) {
              const fileNames = [
                "ED_Visits_and_Lengths_of_Stay_2017_2022.xlsx",
                "Historical_ED_Statistics_2003_2022.xlsx",
                "Latest_ED_Statistics_2024_2026.xlsx"
              ];
              return {
                ...d,
                uploaded: true,
                fileName: fileNames[id] || `Dataset_${id + 1}_Source.xlsx`,
                rows: numRows,
                cols: numCols,
                fileSize: `${Math.round(JSON.stringify(dataClone).length / 1024)} KB`,
                missing: missingCount,
                duplicates: dupCount,
                dataTypes: demo.fields.map(f => `${f.name} (${f.type})`).slice(0, 3).join(', ') + '...',
                validated: true,
                data: dataClone,
                fields: demo.fields
              };
            }
            return d;
          }));
        }, 500);
      }
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeUploadId === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let data: Record<string, any>[] = [];
        let fields: { name: string; type: 'numeric' | 'categorical' | 'date' | 'boolean' | 'text' }[] = [];

        // Simple CSV parser
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error("Dataset contains too few rows.");

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          let inQuotes = false;
          let buffer = "";
          const rowValues: string[] = [];

          for (let c = 0; c < line.length; c++) {
            const char = line[c];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              rowValues.push(buffer.trim());
              buffer = "";
            } else {
              buffer += char;
            }
          }
          rowValues.push(buffer.trim());

          const rowObj: Record<string, any> = {};
          headers.forEach((header, index) => {
            let val: any = rowValues[index] || "";
            if (typeof val === 'string') {
              val = val.replace(/^["']|["']$/g, '');
              if (val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined' || val === '') {
                val = null;
              } else if (!isNaN(Number(val))) {
                val = Number(val);
              }
            }
            rowObj[header] = val;
          });
          data.push(rowObj);
        }

        // Infer fields
        const firstRow = data[0];
        fields = Object.keys(firstRow).map(key => {
          let hasNumeric = false;
          let hasDate = false;
          for (let k = 0; k < Math.min(data.length, 10); k++) {
            const val = data[k][key];
            if (val !== null && typeof val === 'number') hasNumeric = true;
            if (val !== null && String(val).includes('-') && !isNaN(Date.parse(String(val)))) hasDate = true;
          }
          const type = hasNumeric ? 'numeric' : (hasDate ? 'date' : 'categorical');
          return { name: key, type };
        });

        // Compute validation
        const missingCount = data.reduce((acc, r) => acc + fields.reduce((fAcc, f) => fAcc + (r[f.name] === null || r[f.name] === undefined ? 1 : 0), 0), 0);

        // Find duplicates
        const seenRows = new Set();
        let dupCount = 0;
        data.forEach(r => {
          const keyStr = JSON.stringify(r);
          if (seenRows.has(keyStr)) {
            dupCount++;
          } else {
            seenRows.add(keyStr);
          }
        });

        setDatasets(prev => prev.map(d => {
          if (d.id === activeUploadId) {
            return {
              ...d,
              uploaded: true,
              fileName: file.name,
              rows: data.length,
              cols: fields.length,
              fileSize: `${Math.round(file.size / 1024)} KB`,
              missing: missingCount,
              duplicates: dupCount,
              dataTypes: fields.map(f => `${f.name} (${f.type})`).slice(0, 3).join(', ') + '...',
              validated: true,
              data,
              fields
            };
          }
          return d;
        }));
        setError(null);
      } catch (err) {
        setError("Clinical File Parsing Error: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const removeDataset = (id: number) => {
    setDatasets(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          uploaded: false,
          fileName: null,
          rows: 0,
          cols: 0,
          fileSize: "0 KB",
          missing: 0,
          duplicates: 0,
          dataTypes: "N/A",
          validated: false,
          data: [],
          fields: []
        };
      }
      return d;
    }));
  };

  const validateDataset = (id: number) => {
    setLoadingState({
      isProcessing: true,
      percentage: 0,
      message: `Running validation schemas for Dataset ${id + 1}...`
    });

    let pct = 0;
    const interval = setInterval(() => {
      pct += 25;
      setLoadingState(prev => ({ ...prev, percentage: pct }));
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLoadingState({ isProcessing: false, percentage: 0, message: '' });
          setDatasets(prev => prev.map(d => {
            if (d.id === id) {
              return { ...d, validated: true };
            }
            return d;
          }));
        }, 300);
      }
    }, 80);
  };

  // Check if we can proceed
  const allUploaded = datasets.every(d => d.uploaded);
  const allValidated = datasets.every(d => d.validated);
  const canProceed = allUploaded && allValidated;

  const handleProceed = () => {
    if (!canProceed) return;

    // Merge datasets. Overlap columns and combine rows.
    // Concatenate Dataset 1, Dataset 2, and Dataset 3 to create a longitudinal study cohort.
    const mergedData: any[] = [];
    const fieldsMap = new Map<string, string>(); // name to type

    datasets.forEach(d => {
      d.fields.forEach(f => {
        fieldsMap.set(f.name, f.type);
      });
      d.data.forEach(row => {
        mergedData.push({ ...row });
      });
    });

    const mergedFields = Array.from(fieldsMap.entries()).map(([name, type]) => ({
      name,
      type: type as 'numeric' | 'categorical' | 'date' | 'boolean' | 'text'
    }));

    onDatasetSelected("CIHI NACRS Unified Cohort", mergedFields, mergedData);
  };

  if (loadingState.isProcessing) {
    return (
      <div className="max-w-lg mx-auto py-24 px-6 text-center select-none" id="dataset-upload-loading-view">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full" />
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Loader2 size={54} className="text-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Database size={18} className="text-emerald-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-white">CIHI Platform Core</h3>
              <p className="text-xs font-mono tracking-wider text-emerald-400 uppercase">
                {loadingState.message}
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${loadingState.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>SECURE PARSING PIPELINE</span>
                <span>{loadingState.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8" id="dataset-upload-component">
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        accept=".csv, .tsv, .json"
        onChange={handleFileChange}
      />

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-sm font-semibold flex items-center justify-between" id="upload-error-banner">
          <span className="flex items-center gap-2">⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-bold px-2 py-1">✕</button>
        </div>
      )}

      {/* Main banner block */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] border border-[#0F4C81]/20 dark:border-[#3B82F6]/20 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={12} /> NACRS CLINICAL INGRESS
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[#111827] dark:text-white leading-tight font-display">
          Upload Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto font-light">
          Load clinical administrative files representing the complete CIHI Emergency Care database. Unified schema validation runs automatically.
        </p>
      </div>

      {/* Three Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {datasets.map((d, index) => (
          <div 
            key={d.id} 
            className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl p-6 flex flex-col justify-between transition-shadow hover:shadow-md relative"
          >
            {/* Tag indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {sqliteLoaded[d.id] ? (
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200/20 dark:border-violet-800/40 flex items-center gap-1">
                  <HardDrive size={10} /> SQLite
                </span>
              ) : d.uploaded ? (
                <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                  d.validated 
                    ? 'bg-[#2E8B57]/10 text-[#2E8B57] dark:bg-[#2E8B57]/20 dark:text-[#50b17c]' 
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                }`}>
                  {d.validated ? 'Validated' : 'Pending Validation'}
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase text-slate-400 bg-slate-100 dark:bg-[#182640] dark:text-slate-400 px-2.5 py-1 rounded-full">
                  Empty
                </span>
              )}
            </div>

            <div className="space-y-4 mt-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider">Target Ingress Spot</span>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white leading-snug">
                  {d.uploaded ? (d.fileName || `Dataset_${d.id + 1}.xlsx`) : d.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                  {d.description}
                </p>
              </div>

              {/* Status and Parameters table */}
              <div className="p-4 rounded-lg bg-[#F7F9FC] dark:bg-[#182640] text-xs space-y-2.5 border border-[#E5E7EB] dark:border-[#1e2d4a]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Upload Status:</span>
                  {sqliteLoaded[d.id] ? (
                    <span className="text-violet-700 dark:text-violet-300 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" /> SQLite Database
                    </span>
                  ) : d.uploaded ? (
                    <span className="text-[#2E8B57] dark:text-[#50b17c] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] dark:bg-[#50b17c]" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-amber-500 font-bold animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> Waiting for Upload
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">File Size:</span>
                  <span className="text-[#111827] dark:text-slate-300 font-semibold">{d.uploaded ? d.fileSize : "0 KB"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Row Count:</span>
                  <span className="text-[#111827] dark:text-white font-bold">{d.uploaded ? d.rows.toLocaleString() : "0"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Column Count:</span>
                  <span className="text-[#111827] dark:text-white font-bold">{d.uploaded ? d.cols : "0"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Missing Values:</span>
                  <span className={`font-mono font-bold ${d.uploaded && d.missing > 0 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {d.uploaded ? d.missing.toLocaleString() : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Duplicate Records:</span>
                  <span className={`font-mono font-bold ${d.uploaded && d.duplicates > 0 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {d.uploaded ? d.duplicates.toLocaleString() : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Quality Score:</span>
                  <span className={`font-bold font-mono ${
                    !d.uploaded ? 'text-slate-700 dark:text-slate-300' :
                    Math.max(0, 100 - Math.round((d.missing * 3 + d.duplicates * 5) / Math.max(1, d.rows))) >= 90 ? 'text-[#2E8B57] dark:text-[#50b17c]' :
                    Math.max(0, 100 - Math.round((d.missing * 3 + d.duplicates * 5) / Math.max(1, d.rows))) >= 70 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {d.uploaded ? `${Math.max(0, 100 - Math.round((d.missing * 3 + d.duplicates * 5) / Math.max(1, d.rows)))}%` : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Validation Status:</span>
                  {d.uploaded ? (
                    d.validated ? (
                      <span className="text-[#2E8B57] dark:text-[#50b17c] font-bold uppercase text-[10px] px-1.5 py-0.5 rounded-md bg-[#2E8B57]/10 dark:bg-[#2E8B57]/20">
                        Validated
                      </span>
                    ) : (
                      <span className="text-amber-500 font-bold uppercase text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/20">
                        Pending Validation
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Not Validated
                    </span>
                  )}
                </div>

                {d.uploaded && (
                  <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1e2d4a] text-[10px] space-y-1">
                    <span className="text-slate-400 uppercase block">Sample Data Types:</span>
                    <span className="text-slate-500 dark:text-slate-400 truncate block">{d.dataTypes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ingress Buttons (STEP 8 & 9) */}
            <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#1e2d4a]">
              {!d.uploaded ? (
                <>
                  <button 
                    onClick={() => triggerUploadFile(d.id)}
                    className="h-12 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-semibold text-xs cursor-pointer shadow-3xs flex items-center justify-center gap-1.5 hover:shadow-md transition-all duration-200"
                  >
                    <Upload size={14} /> Upload
                  </button>
                  <button 
                    onClick={() => loadDemoDataset(d.id)}
                    className="h-12 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F9FC] dark:border-[#1e2d4a] dark:hover:bg-[#182640] text-[#0F4C81] dark:text-[#3B82F6] font-semibold text-xs cursor-pointer transition-colors duration-200"
                  >
                    Load Demo
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => triggerUploadFile(d.id)}
                    className="h-12 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F9FC] dark:border-[#1e2d4a] dark:hover:bg-[#182640] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer transition-colors duration-200"
                  >
                    Replace
                  </button>
                  <button 
                    onClick={() => removeDataset(d.id)}
                    className="h-12 rounded-lg border border-rose-200 hover:bg-rose-50/50 dark:border-rose-950/20 text-rose-600 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors duration-200"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                  <button 
                    onClick={() => validateDataset(d.id)}
                    disabled={d.validated}
                    className="col-span-2 h-12 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 mt-2 shadow-3xs hover:shadow-md transition-all duration-200"
                  >
                    {d.validated ? (
                      <>
                        <ShieldCheck size={14} className="text-[#2E8B57]" /> Validation Successful
                      </>
                    ) : (
                      'Validate Dataset'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Validation workflow alert */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] flex items-start gap-4 text-[#111827] dark:text-slate-100 max-w-4xl mx-auto shadow-xs">
        <Info size={18} className="text-[#0F4C81] dark:text-[#3B82F6] mt-0.5 shrink-0" />
        <div className="text-xs space-y-1 font-light leading-relaxed">
          <p className="font-bold text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider text-[11px]">Capstone Platform Pipeline Integration Constraint</p>
          <p className="text-slate-500 dark:text-slate-400">All three clinical files (Dataset 1, Dataset 2, Dataset 3) must be uploaded and successfully pass schema verification before data merging, clinical quality assessments, and analytical regressions can execute.</p>
        </div>
      </div>

      {/* Final Launch Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`h-10 px-6 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 select-none group ${
            canProceed 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer' 
              : 'bg-slate-200 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-white/[0.08]'
          }`}
        >
          <span>Validate All &amp; Proceed to Preparation Engine</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
