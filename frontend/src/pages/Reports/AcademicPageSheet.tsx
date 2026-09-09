/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Academic Page Sheet Component
 * Faithfully mirrors Microsoft Word Document page geometry, margins,
 * justified typography, running headers/footers, and high-contrast styling.
 */

import React from 'react';
import { Building2, Award, Users } from 'lucide-react';
import { ReportPage, PageElement, ParagraphElement, TableElement, Run } from './paginatedReportData';

interface AcademicPageSheetProps {
  page: ReportPage;
  totalPages: number;
  zoom?: number;
  searchQuery?: string;
  isPrintView?: boolean;
}

export const AcademicPageSheet: React.FC<AcademicPageSheetProps> = ({
  page,
  totalPages,
  zoom = 100,
  searchQuery = '',
  isPrintView = false,
}) => {
  const scale = zoom / 100;
  const baseWidth = 816; // 8.5 inches at 96 DPI (Standard US Letter)
  const baseHeight = 1056; // 11.0 inches at 96 DPI
  const padV = Math.round(52 * scale);
  const padH = Math.round(58 * scale);
  const fontSizePx = Math.max(10, Math.round(13 * scale));

  // Helper to render text runs with search highlight
  const renderRuns = (runs: Run[]) => {
    const query = searchQuery.trim().toLowerCase();

    return runs.map((run, rIdx) => {
      let node: React.ReactNode = run.text;

      // Handle bold / italic
      if (run.bold && run.italic) {
        node = <strong className="font-bold italic text-slate-950">{node}</strong>;
      } else if (run.bold) {
        node = <strong className="font-bold text-slate-950">{node}</strong>;
      } else if (run.italic) {
        node = <em className="italic text-slate-900">{node}</em>;
      }

      // Handle search query highlight
      if (query.length > 1 && run.text.toLowerCase().includes(query)) {
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = run.text.split(regex);
        node = (
          <span>
            {parts.map((part, pIdx) =>
              part.toLowerCase() === query ? (
                <mark
                  key={pIdx}
                  className="bg-amber-200 text-slate-950 font-bold px-0.5 rounded"
                  style={{ color: '#0f172a' }}
                >
                  {part}
                </mark>
              ) : (
                part
              )
            )}
          </span>
        );
        if (run.bold && run.italic) {
          node = <strong className="font-bold italic text-slate-950">{node}</strong>;
        } else if (run.bold) {
          node = <strong className="font-bold text-slate-950">{node}</strong>;
        } else if (run.italic) {
          node = <em className="italic text-slate-900">{node}</em>;
        }
      }

      return <React.Fragment key={rIdx}>{node}</React.Fragment>;
    });
  };

  // Render a paragraph element with academic justification
  const renderParagraph = (el: ParagraphElement, idx: number) => {
    const isCenter = el.align === 'center';
    const isRight = el.align === 'right';
    const textAlign = isCenter ? 'center' : isRight ? 'right' : 'justify';

    if (el.is_h1) {
      return (
        <div key={idx} className="pt-3 pb-2 mb-4 border-b-2 border-slate-900">
          <h1
            style={{ textAlign }}
            className="font-serif text-lg md:text-xl font-extrabold uppercase tracking-tight text-slate-950 leading-snug"
          >
            {renderRuns(el.runs)}
          </h1>
        </div>
      );
    }

    if (el.is_h2) {
      return (
        <div key={idx} className="pt-3 pb-1 mb-2">
          <h2
            style={{ textAlign: isCenter ? 'center' : 'left' }}
            className="font-serif text-sm md:text-base font-bold text-slate-950 tracking-tight"
          >
            {renderRuns(el.runs)}
          </h2>
        </div>
      );
    }

    if (el.is_h3) {
      return (
        <h3
          key={idx}
          style={{ textAlign: isCenter ? 'center' : 'left' }}
          className="font-serif text-xs md:text-sm font-bold text-slate-900 pt-2 pb-1 mb-1.5"
        >
          {renderRuns(el.runs)}
        </h3>
      );
    }

    return (
      <p
        key={idx}
        style={{
          textAlign,
          textJustify: 'inter-word',
        }}
        className="font-serif text-slate-900 leading-relaxed mb-3.5"
      >
        {renderRuns(el.runs)}
      </p>
    );
  };

  // Render an academic table
  const renderTable = (el: TableElement, idx: number) => {
    return (
      <div
        key={idx}
        className="my-4 overflow-x-auto border-t-2 border-b-2 border-slate-900 bg-white"
      >
        <table className="w-full text-left border-collapse text-[11px] font-sans">
          <thead>
            <tr className="border-b border-slate-400 bg-slate-50 text-slate-950 font-bold">
              {el.headers.map((h, hIdx) => (
                <th
                  key={hIdx}
                  className="py-2 px-2.5 uppercase tracking-wider text-[10px] text-slate-900 border-r border-slate-200 last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 text-[11px]">
            {el.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/40"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="py-1.5 px-2.5 text-slate-900 border-r border-slate-200/60 last:border-r-0 align-top"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // If this is the Official Cover Page (Page 1)
  if (page.isCover) {
    return (
      <div
        id={`report-page-${page.pageNumber}`}
        className="academic-page-sheet relative bg-white text-slate-900 mx-auto shadow-2xl border border-slate-300/90 rounded-xs select-text overflow-hidden transition-all duration-150 flex flex-col justify-between"
        style={{
          width: `${Math.round(baseWidth * scale)}px`,
          minHeight: `${Math.round(baseHeight * scale)}px`,
          padding: `${padV}px ${padH}px`,
          fontSize: `${fontSizePx}px`,
          lineHeight: 1.65,
          fontFamily: '"Times New Roman", Times, Georgia, serif',
          color: '#0f172a',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Institutional Header */}
        <div className="text-center pt-4 pb-8 border-b-2 border-slate-900 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F4C81] font-sans">
            <Building2 size={16} />
            <span>University of Niagara Falls Canada</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-slate-600 font-sans font-semibold">
            Master of Data Analytics · DAMO 699 – Capstone Project
          </div>
        </div>

        {/* Central Title Block */}
        <div className="text-center py-10 space-y-6 max-w-xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0F4C81] font-sans text-xs font-bold tracking-wider uppercase mb-2">
            Final Capstone Research Report
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-950 leading-tight">
            Length of Stay and Resource Utilization Trends in Canadian Hospitals
          </h1>
          <p className="font-serif text-sm md:text-base italic text-slate-800 leading-relaxed max-w-lg mx-auto">
            A Frequency-Weighted Biostatistical and Time-Series Analysis of 175.8 Million CIHI NACRS Emergency Department Encounters (2003–2022)
          </p>
        </div>

        {/* Authors, Supervisor, and Governance Credentials */}
        <div className="pt-8 border-t-2 border-slate-900 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto font-sans">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-900">Rajbharath P</div>
              <div className="text-[10px] text-slate-500 font-mono">ID: NF1016766</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-900">Sufyaan Khan Mohammed</div>
              <div className="text-[10px] text-slate-500 font-mono">ID: NF1017047</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-900">Amit Raj Dev</div>
              <div className="text-[10px] text-slate-500 font-mono">ID: NF1021076</div>
            </div>
          </div>

          <div className="text-center text-xs space-y-1 font-sans text-slate-700">
            <div>
              <span className="font-bold text-slate-900">Faculty Supervisor: </span>
              <span>Dr. Bilal El Toufaili</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Group No: 5 · Submission Date: September 6, 2026
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-sans uppercase tracking-wider pt-2 border-t border-slate-200">
            Presented in Partial Fulfillment of the Requirements for the Degree of Master of Data Analytics
          </div>
        </div>
      </div>
    );
  }

  // Standard Document Pages (Pages 2 to 69)
  return (
    <div
      id={`report-page-${page.pageNumber}`}
      className="academic-page-sheet relative bg-white text-slate-900 mx-auto shadow-2xl border border-slate-300/90 rounded-xs select-text overflow-hidden transition-all duration-150 flex flex-col justify-between"
      style={{
        width: `${Math.round(baseWidth * scale)}px`,
        minHeight: `${Math.round(baseHeight * scale)}px`,
        padding: `${padV}px ${padH}px`,
        fontSize: `${fontSizePx}px`,
        lineHeight: 1.65,
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        color: '#0f172a',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Running Academic Header */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider pb-2 mb-4 border-b border-slate-300 font-sans select-none shrink-0">
        <span className="truncate max-w-[340px]">
          University of Niagara Falls Canada · Master of Data Analytics | DAMO 699
        </span>
        <span className="font-semibold text-slate-800 truncate max-w-[280px]">
          {page.chapter}
        </span>
      </div>

      {/* Page Body Elements */}
      <div className="grow space-y-1">
        {page.elements.map((el, idx) => {
          if (el.type === 'p') {
            return renderParagraph(el, idx);
          }
          if (el.type === 'table') {
            return renderTable(el, idx);
          }
          return null;
        })}
      </div>

      {/* Running Academic Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 mt-6 border-t border-slate-300 font-sans select-none shrink-0">
        <span className="truncate max-w-[380px]">
          Length of Stay & Resource Utilization in Canadian Hospitals (CIHI NACRS)
        </span>
        <span className="font-semibold text-slate-800 font-mono">
          Page {page.pageNumber} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default AcademicPageSheet;
