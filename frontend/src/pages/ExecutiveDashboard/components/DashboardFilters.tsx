import React, { useState } from 'react';
import { Filter, RefreshCw, ChevronDown, Check, PlusCircle } from 'lucide-react';
import { FilterState } from './types';
import FilterChip from '../../../components/common/FilterChip';

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
  onCreateVisual?: () => void;
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
        className={`w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition select-none shadow-2xs ${
          selectedValues.length > 0
            ? dark
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
              : 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
            : dark
            ? 'bg-[#162040] border-white/[0.08] text-slate-300 hover:bg-[#1a2850]'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
      >
        <span className="truncate">
          {label}
          {selectedValues.length > 0 && ` (${selectedValues.length})`}
        </span>
        <ChevronDown size={13} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className={`absolute left-0 mt-1.5 w-56 max-h-60 overflow-y-auto rounded-xl border shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 ${
            dark ? 'bg-[#101b30] border-white/[0.1] text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 italic">No options available</div>
          ) : (
            options.map(opt => {
              const checked = selectedValues.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleOption(opt)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                    checked
                      ? dark
                        ? 'bg-blue-500/20 text-blue-400 font-semibold'
                        : 'bg-blue-50 text-blue-700 font-semibold'
                      : dark
                      ? 'hover:bg-white/[0.05] text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {checked && <Check size={13} className="text-blue-500 shrink-0" />}
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
  onCreateVisual,
  isDarkMode,
}: DashboardFiltersProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dark = isDarkMode;

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutside = () => setOpenDropdownId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  const totalActive =
    filters.years.length +
    filters.sex.length +
    filters.ageGroups.length +
    filters.ctasLevels.length +
    filters.dispositions.length;

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3 transition-colors shadow-xs ${
        dark ? 'bg-[#111e35] border-white/[0.08]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Label and Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="flex items-center gap-1.5 mr-1 text-slate-400">
            <Filter size={14} className="text-blue-500" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Analysis Controls
            </span>
            {totalActive > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {totalActive} active
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[200px]">
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

        {/* Actions: Create Visual & Reset Filters */}
        <div className="flex items-center gap-2 shrink-0">
          {onCreateVisual && (
            <button
              type="button"
              onClick={onCreateVisual}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-xs cursor-pointer transition select-none"
            >
              <PlusCircle size={13} className="shrink-0" />
              <span>Create Visual</span>
            </button>
          )}

          {totalActive > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold text-rose-500 border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer transition shrink-0"
            >
              <RefreshCw size={11} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {totalActive > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
          {[
            { list: filters.years, key: 'years' as keyof FilterState, prefix: 'FY' },
            { list: filters.sex, key: 'sex' as keyof FilterState, prefix: 'Sex' },
            { list: filters.ageGroups, key: 'ageGroups' as keyof FilterState, prefix: 'Age' },
            { list: filters.ctasLevels, key: 'ctasLevels' as keyof FilterState, prefix: 'CTAS' },
            { list: filters.dispositions, key: 'dispositions' as keyof FilterState, prefix: 'Disposition' },
          ].flatMap(({ list, key, prefix }) =>
            list.map(v => (
              <FilterChip
                key={`${prefix}-${v}`}
                label={prefix}
                value={v}
                onRemove={() => onFilterChange(key, list.filter(item => item !== v))}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
