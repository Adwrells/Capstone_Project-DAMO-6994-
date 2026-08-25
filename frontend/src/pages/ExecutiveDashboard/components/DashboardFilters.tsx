import React, { useState } from 'react';
import { Filter, RefreshCw, X, ChevronDown, Check } from 'lucide-react';
import { FilterState } from './types';

interface DashboardFiltersProps {
  filterOptions: {
    years: string[];
    sexes: string[];
    ageGroups: string[];
    ctasLevels: string[];
    dispositions: string[];
  };
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, values: string[]) => void;
  onResetFilters: () => void;
  isDarkMode: boolean;
}

function MultiSelectDropdown({
  id,
  label,
  options,
  selectedValues,
  onChange,
  isDarkMode,
  openDropdownId,
  setOpenDropdownId,
}: {
  id: string;
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  isDarkMode: boolean;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
}) {
  const isOpen = openDropdownId === id;
  const dark = isDarkMode;

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div className="relative inline-block text-left flex-1 min-w-[130px]">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setOpenDropdownId(isOpen ? null : id);
        }}
        className={`w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition select-none shadow-2xs ${
          selectedValues.length > 0
            ? dark
              ? 'bg-[#0F4C81]/30 border-[#3B82F6] text-[#3B82F6]'
              : 'bg-[#0F4C81]/10 border-[#0F4C81] text-[#0F4C81]'
            : dark
            ? 'bg-[#182640] border-[#1e2d4a] text-slate-300 hover:bg-[#1f3152]'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
      >
        <span className="truncate">
          {label}
          {selectedValues.length > 0 && ` (${selectedValues.length})`}
        </span>
        <ChevronDown size={12} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className={`absolute left-0 mt-1.5 w-56 max-h-60 overflow-y-auto rounded-xl border shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 ${
            dark ? 'bg-[#101b30] border-[#1e2d4a] text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-[10px] text-slate-400 italic">No options available</div>
          ) : (
            options.map(opt => {
              const checked = selectedValues.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleOption(opt)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition ${
                    checked
                      ? dark
                        ? 'bg-[#0F4C81]/40 text-[#3B82F6] font-bold'
                        : 'bg-blue-50 text-[#0F4C81] font-bold'
                      : dark
                      ? 'hover:bg-[#182640] text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {checked && <Check size={12} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 ml-1.5" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardFilters({
  filterOptions,
  filters,
  onFilterChange,
  onResetFilters,
  isDarkMode,
}: DashboardFiltersProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dark = isDarkMode;

  const totalActive =
    filters.years.length +
    filters.sex.length +
    filters.ageGroups.length +
    filters.ctasLevels.length +
    filters.dispositions.length;

  return (
    <div
      onClick={() => setOpenDropdownId(null)}
      className={`rounded-2xl border px-4 py-3 shadow-sm space-y-2.5 transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left Filter Bar Label & Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={13} className={dark ? 'text-[#3B82F6]' : 'text-[#0F4C81]'} />
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              Filter Scope
            </span>
            {totalActive > 0 && (
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  dark ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30' : 'bg-blue-100 text-[#0F4C81]'
                }`}
              >
                {totalActive} Active
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-wrap gap-2 min-w-0">
            <MultiSelectDropdown
              id="fy"
              label="Fiscal Year"
              options={filterOptions.years}
              selectedValues={filters.years}
              onChange={vals => onFilterChange('years', vals)}
              isDarkMode={dark}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
            />
            <MultiSelectDropdown
              id="sex"
              label="Patient Sex"
              options={filterOptions.sexes}
              selectedValues={filters.sex}
              onChange={vals => onFilterChange('sex', vals)}
              isDarkMode={dark}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
            />
            <MultiSelectDropdown
              id="age"
              label="Age Cohort"
              options={filterOptions.ageGroups}
              selectedValues={filters.ageGroups}
              onChange={vals => onFilterChange('ageGroups', vals)}
              isDarkMode={dark}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
            />
            <MultiSelectDropdown
              id="ctas"
              label="CTAS Acuity"
              options={filterOptions.ctasLevels}
              selectedValues={filters.ctasLevels}
              onChange={vals => onFilterChange('ctasLevels', vals)}
              isDarkMode={dark}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
            />
            <MultiSelectDropdown
              id="disp"
              label="Disposition"
              options={filterOptions.dispositions}
              selectedValues={filters.dispositions}
              onChange={vals => onFilterChange('dispositions', vals)}
              isDarkMode={dark}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
            />
          </div>
        </div>

        {/* Reset Filters Action */}
        {totalActive > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-bold text-rose-500 border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer transition shrink-0"
          >
            <RefreshCw size={11} /> Reset Filters
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {totalActive > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-[#1e2d4a]">
          {[
            { list: filters.years, key: 'years' as keyof FilterState, prefix: 'FY' },
            { list: filters.sex, key: 'sex' as keyof FilterState, prefix: 'Sex' },
            { list: filters.ageGroups, key: 'ageGroups' as keyof FilterState, prefix: 'Age' },
            { list: filters.ctasLevels, key: 'ctasLevels' as keyof FilterState, prefix: 'CTAS' },
            { list: filters.dispositions, key: 'dispositions' as keyof FilterState, prefix: 'Disp' },
          ].flatMap(({ list, key, prefix }) =>
            list.map(v => (
              <span
                key={`${prefix}-${v}`}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                  dark
                    ? 'bg-[#0F4C81]/30 text-[#3B82F6] border border-[#3B82F6]/30'
                    : 'bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20'
                }`}
              >
                <span className="opacity-70">{prefix}:</span> {v}
                <button
                  type="button"
                  onClick={() => onFilterChange(key, list.filter(item => item !== v))}
                  className="ml-1 hover:text-rose-500 cursor-pointer"
                >
                  <X size={9} />
                </button>
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}
