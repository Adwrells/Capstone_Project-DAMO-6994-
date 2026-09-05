/**
 * FilterChip — Reusable active filter badge with remove action
 */
import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  key?: React.Key;
  label: string;
  value: string;
  onRemove?: () => void;
  className?: string;
}


export default function FilterChip({
  label,
  value,
  onRemove,
  className = '',
}: FilterChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/25 text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-500/15 ${className}`}
    >
      <span className="text-slate-500 dark:text-slate-400 font-normal">{label}:</span>
      <span className="font-semibold">{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-blue-500/20 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          title={`Remove ${label} filter`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
