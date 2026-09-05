/**
 * SectionHeader — Reusable analytical section divider with category label
 */
import React from 'react';

interface SectionHeaderProps {
  category?: string;
  title: string;
  subtitle?: string;
  metadata?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  category,
  title,
  subtitle,
  metadata,
  right,
  className = '',
}: SectionHeaderProps) {
  const rightContent = right || metadata;
  return (
    <div className={`section-header ${className}`}>
      <div className="section-header-left">
        {category && <span className="section-label">{category}</span>}
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {rightContent && (
        <div className="shrink-0 text-[10.5px] font-mono text-slate-500 dark:text-slate-400 self-end pb-0.5">
          {rightContent}
        </div>
      )}
    </div>
  );
}
