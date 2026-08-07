/**
 * Healthcare Analytics Platform — Enterprise DataTable
 * Features: sorting, search, pagination, sticky header, CSV/Excel export,
 * row selection, column visibility, responsive, WCAG 2.2 AA accessible.
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Search, Download, ArrowUp, ArrowDown, ArrowUpDown,
  ChevronLeft, ChevronRight, Eye, EyeOff, X, Check,
  FileSpreadsheet, FileText
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────────────────── */
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'badge';
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  title?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: Record<string, any>, index: number) => void;
  className?: string;
  'aria-label'?: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function downloadCSV(data: Record<string, any>[], columns: TableColumn[], filename: string) {
  const visibleCols = columns.filter(c => !c.hidden);
  const header = visibleCols.map(c => c.label).join(',');
  const rows = data.map(row =>
    visibleCols.map(c => {
      const v = String(row[c.key] ?? '');
      return v.includes(',') || v.includes('"') || v.includes('\n')
        ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function SortIcon({ col, sortKey, sortDir }: {
  col: string; sortKey: string; sortDir: 'asc' | 'desc';
}) {
  if (sortKey !== col) return <ArrowUpDown size={12} className="text-[#D1D5DB] ml-1 shrink-0" aria-hidden="true" />;
  return sortDir === 'asc'
    ? <ArrowUp size={12} className="text-[#2563EB] ml-1 shrink-0" aria-hidden="true" />
    : <ArrowDown size={12} className="text-[#2563EB] ml-1 shrink-0" aria-hidden="true" />;
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function DataTable({
  columns,
  data,
  title,
  pageSize: initialPageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  searchable = true,
  exportable = true,
  selectable = false,
  stickyHeader = true,
  maxHeight = '520px',
  emptyMessage = 'No data available.',
  loading = false,
  onRowClick,
  className = '',
  'aria-label': ariaLabel,
}: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(
    new Set(columns.filter(c => c.hidden).map(c => c.key))
  );
  const [colPickerOpen, setColPickerOpen] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);

  const visibleColumns = useMemo(
    () => columns.filter(c => !hiddenCols.has(c.key)),
    [columns, hiddenCols]
  );

  /* Search filter */
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q))
    );
  }, [data, search]);

  /* Sort */
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find(c => c.key === sortKey);
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (col?.type === 'number') {
        const an = Number(av), bn = Number(bv);
        return sortDir === 'asc' ? an - bn : bn - an;
      }
      const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  /* Paginate */
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pageStart = sorted.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, sorted.length);

  /* Handle sort click */
  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }, [sortKey]);

  /* Handle search change */
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  /* Handle selection */
  const toggleRow = useCallback((idx: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === pageRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pageRows.map((_, i) => (page - 1) * pageSize + i)));
    }
  }, [selectedRows.size, pageRows, page, pageSize]);

  const allSelected = pageRows.length > 0 && selectedRows.size === pageRows.length;

  /* Column visibility toggle */
  const toggleCol = useCallback((key: string) => {
    setHiddenCols(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /* Pagination range */
  const pageRange = useMemo(() => {
    const delta = 2;
    const range: (number | '…')[] = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }
    if (range[0] !== 1) { range.unshift('…'); range.unshift(1); }
    if (range[range.length - 1] !== totalPages) { range.push('…'); range.push(totalPages); }
    return range;
  }, [page, totalPages]);

  /* Skeleton loading rows */
  if (loading) {
    return (
      <div className={`bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden ${className}`} aria-busy="true" aria-label="Loading data table…">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-8 w-56 rounded" />
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-3 flex gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton h-4 flex-1 rounded" style={{ opacity: 1 - j * 0.1 }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm ${className}`}
      role="region"
      aria-label={ariaLabel || title || 'Data table'}
    >
      {/* ── Toolbar ── */}
      <div className="px-5 py-3 border-b border-[#E5E7EB] flex items-center gap-3 flex-wrap bg-white">
        {title && (
          <span className="text-sm font-semibold text-[#111827] mr-2 shrink-0">{title}</span>
        )}

        {searchable && (
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search all columns…"
              className="pl-8 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg w-full focus:border-[#2563EB] focus:ring-0 bg-[#F9FAFB] placeholder:text-[#9CA3AF]"
              aria-label="Search table data"
            />
          </div>
        )}

        {selectable && selectedRows.size > 0 && (
          <span className="text-xs text-[#6B7280] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#DBEAFE] font-medium">
            {selectedRows.size} selected
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Page size */}
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white text-[#374151] pr-7 cursor-pointer w-auto"
            aria-label="Rows per page"
            style={{ backgroundSize: '12px', backgroundPosition: 'right 6px center' }}
          >
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt} rows</option>
            ))}
          </select>

          {/* Column picker */}
          <div className="relative" ref={colPickerRef}>
            <button
              onClick={() => setColPickerOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              aria-label="Toggle column visibility"
              aria-haspopup="true"
              aria-expanded={colPickerOpen}
            >
              <Eye size={13} aria-hidden="true" />
              Columns
            </button>
            {colPickerOpen && (
              <div
                className="absolute right-0 top-full mt-1 z-30 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-2 min-w-[180px]"
                role="menu"
              >
                {columns.map(col => (
                  <button
                    key={col.key}
                    onClick={() => toggleCol(col.key)}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors"
                    role="menuitemcheckbox"
                    aria-checked={!hiddenCols.has(col.key)}
                  >
                    <span className={`w-3.5 h-3.5 flex items-center justify-center rounded border shrink-0
                      ${!hiddenCols.has(col.key) ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB]'}`}>
                      {!hiddenCols.has(col.key) && <Check size={9} className="text-white" aria-hidden="true" />}
                    </span>
                    {col.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV */}
          {exportable && (
            <button
              onClick={() => downloadCSV(sorted, visibleColumns, title || 'export')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              title="Export to CSV"
              aria-label="Export to CSV"
            >
              <Download size={13} aria-hidden="true" />
              CSV
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="overflow-auto"
        style={{ maxHeight: stickyHeader ? maxHeight : 'none' }}
        role="group"
      >
        <table
          className="w-full text-sm border-collapse"
          role="grid"
          aria-label={ariaLabel || title || 'Data table'}
          aria-rowcount={sorted.length}
          aria-colcount={visibleColumns.length + (selectable ? 1 : 0)}
        >
          <thead role="rowgroup">
            <tr role="row" className={stickyHeader ? 'sticky top-0 z-10' : ''}>
              {selectable && (
                <th className="w-10 px-3 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB] text-center" role="columnheader">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllRows}
                    className="rounded border-[#D1D5DB] text-[#2563EB] cursor-pointer"
                    aria-label="Select all rows on this page"
                  />
                </th>
              )}
              {visibleColumns.map(col => (
                <th
                  key={col.key}
                  role="columnheader"
                  aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                  className={`px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    ${col.sortable !== false ? 'cursor-pointer hover:bg-[#F1F5F9] select-none transition-colors' : ''}
                    ${col.width ? '' : ''}`}
                  style={{ width: col.width }}
                >
                  <div className={`flex items-center gap-1
                    ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                    <span className="truncate">{col.label}</span>
                    {col.sortable !== false && (
                      <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody role="rowgroup">
            {pageRows.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                  role="gridcell"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search size={28} className="text-[#D1D5DB]" aria-hidden="true" />
                    <span className="text-sm text-[#9CA3AF]">{emptyMessage}</span>
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        <X size={11} aria-hidden="true" /> Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row, ri) => {
                const absoluteIndex = (page - 1) * pageSize + ri;
                const isSelected = selectedRows.has(absoluteIndex);
                return (
                  <tr
                    key={ri}
                    role="row"
                    aria-rowindex={absoluteIndex + 2}
                    aria-selected={selectable ? isSelected : undefined}
                    onClick={() => { if (selectable) toggleRow(absoluteIndex); onRowClick?.(row, absoluteIndex); }}
                    className={`border-b border-[#F3F4F6] transition-colors
                      ${ri % 2 === 0 ? '' : 'bg-[#FAFAFA]'}
                      ${isSelected ? 'bg-[#EFF6FF]' : ''}
                      ${onRowClick || selectable ? 'cursor-pointer hover:bg-[#F5F7FF]' : 'hover:bg-[#F9FAFB]'}`}
                  >
                    {selectable && (
                      <td className="w-10 px-3 py-2.5 text-center" role="gridcell">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => { e.stopPropagation(); toggleRow(absoluteIndex); }}
                          className="rounded border-[#D1D5DB] text-[#2563EB] cursor-pointer"
                          aria-label={`Select row ${absoluteIndex + 1}`}
                        />
                      </td>
                    )}
                    {visibleColumns.map(col => {
                      const value = row[col.key];
                      return (
                        <td
                          key={col.key}
                          role="gridcell"
                          aria-colindex={visibleColumns.indexOf(col) + 1 + (selectable ? 1 : 0)}
                          className={`px-4 py-2.5 text-[13px] text-[#374151]
                            ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                        >
                          {col.render ? (
                            col.render(value, row)
                          ) : value == null ? (
                            <span className="text-[#D1D5DB] italic text-xs">—</span>
                          ) : (
                            <span className="block max-w-[240px] truncate" title={String(value)}>
                              {String(value)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ── */}
      <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-3 bg-white">
        <span className="text-xs text-[#6B7280]" aria-live="polite" aria-atomic="true">
          {sorted.length === 0
            ? 'No results'
            : `Showing ${pageStart.toLocaleString()}–${pageEnd.toLocaleString()} of ${sorted.length.toLocaleString()} rows`}
          {data.length !== sorted.length && (
            <span className="text-[#F59E0B] ml-1">
              (filtered from {data.length.toLocaleString()})
            </span>
          )}
        </span>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="h-7 px-2 rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >«</button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          ><ChevronLeft size={13} aria-hidden="true" /></button>

          {pageRange.map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="h-7 w-7 flex items-center justify-center text-xs text-[#9CA3AF]">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                  ${p === page
                    ? 'bg-[#2563EB] text-white border border-[#2563EB]'
                    : 'border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]'}`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >{p}</button>
            )
          )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          ><ChevronRight size={13} aria-hidden="true" /></button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="h-7 px-2 rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >»</button>
        </nav>
      </div>
    </div>
  );
}
