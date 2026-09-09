/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * High-fidelity Academic Report Content Renderer
 * Formats Markdown, Tables, Equations, Callouts, and Academic Headers
 * Guarantees high-contrast readable dark text with justified paragraphs.
 */

import React, { useMemo } from 'react';

interface ReportContentRendererProps {
  content: string;
  searchQuery?: string;
  fontSize?: 'sm' | 'md' | 'lg';
  isPrintView?: boolean;
}

interface TableBlock {
  type: 'table';
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
}

interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
}

interface ParagraphBlock {
  type: 'paragraph';
  text: string;
  isCallout?: boolean;
  calloutType?: 'info' | 'hypothesis' | 'recommendation' | 'stat';
}

type Block = TableBlock | HeadingBlock | ParagraphBlock;

export default function ReportContentRenderer({
  content,
  searchQuery = '',
  fontSize = 'md',
  isPrintView = false,
}: ReportContentRendererProps) {
  // Parse markdown into blocks
  const blocks = useMemo(() => {
    const rawLines = content.split('\n');
    const result: Block[] = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // Check for Table
      if (line.startsWith('|') && line.endsWith('|')) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const splitRow = (r: string) =>
            r
              .slice(1, -1)
              .split('|')
              .map((c) => c.trim());

          const headers = splitRow(tableLines[0]);
          const sepLine = tableLines[1];
          const sepCells = splitRow(sepLine);

          const alignments: ('left' | 'center' | 'right')[] = sepCells.map((cell) => {
            if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
            if (cell.endsWith(':')) return 'right';
            return 'left';
          });

          const rows: string[][] = [];
          for (let k = 2; k < tableLines.length; k++) {
            rows.push(splitRow(tableLines[k]));
          }

          result.push({
            type: 'table',
            headers,
            alignments,
            rows,
          });
          continue;
        }
      }

      // Check for Headings
      if (line.startsWith('# ')) {
        result.push({
          type: 'heading',
          level: 1,
          text: line.replace(/^#\s+/, ''),
        });
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        result.push({
          type: 'heading',
          level: 2,
          text: line.replace(/^##\s+/, ''),
        });
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        result.push({
          type: 'heading',
          level: 3,
          text: line.replace(/^###\s+/, ''),
        });
        i++;
        continue;
      }

      // Paragraph / Callout
      let isCallout = false;
      let calloutType: 'info' | 'hypothesis' | 'recommendation' | 'stat' = 'info';

      if (line.includes('**Hypothesis') || line.includes('Null Hypothesis') || line.startsWith('H1:') || line.startsWith('H2:') || line.startsWith('H3:') || line.startsWith('H4:') || line.startsWith('H5:')) {
        isCallout = true;
        calloutType = 'hypothesis';
      } else if (line.startsWith('> ') || line.includes('**Strategic Recommendation') || line.includes('**Recommendation')) {
        isCallout = true;
        calloutType = 'recommendation';
      } else if (line.includes('χ²') || line.includes('p < 0.001') || line.includes('Kruskal–Wallis') || line.includes('WLS Regression') || line.includes('Mann-Whitney')) {
        isCallout = true;
        calloutType = 'stat';
      }

      const cleanText = line.startsWith('> ') ? line.replace(/^>\s*/, '') : line;

      result.push({
        type: 'paragraph',
        text: cleanText,
        isCallout,
        calloutType,
      });
      i++;
    }

    return result;
  }, [content]);

  // Helper to render inline markdown: **bold**, *italic*, `code`, and search highlights
  const renderInline = (text: string): React.ReactNode => {
    const query = searchQuery.trim().toLowerCase();
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const tokens = text.split(regex);

    tokens.forEach((token, index) => {
      if (!token) return;

      let element: React.ReactNode = token;

      if (token.startsWith('**') && token.endsWith('**')) {
        element = (
          <strong key={index} className="font-bold text-slate-950">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        element = (
          <em key={index} className="italic text-slate-900">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        element = (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-blue-900 font-medium border border-slate-200"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      // If text string and searchQuery matches, highlight
      if (typeof element === 'string' && query.length > 1 && element.toLowerCase().includes(query)) {
        const subRegex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const subParts = element.split(subRegex);
        element = (
          <span key={index}>
            {subParts.map((sp, sIdx) =>
              sp.toLowerCase() === query ? (
                <mark key={sIdx} className="bg-amber-200 text-slate-950 px-0.5 rounded font-semibold">
                  {sp}
                </mark>
              ) : (
                sp
              )
            )}
          </span>
        );
      }

      parts.push(element);
    });

    return parts;
  };

  const textSizeClass =
    fontSize === 'sm'
      ? 'text-xs leading-relaxed'
      : fontSize === 'lg'
      ? 'text-base leading-loose'
      : 'text-[13px] leading-relaxed';

  return (
    <div className={`space-y-4 ${textSizeClass} text-slate-900 font-serif`}>
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <div
                key={idx}
                className="pt-6 pb-2 border-b-2 border-slate-900 print-page-break print-block"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-50 text-[#0F4C81] border border-blue-200 font-sans">
                    Capstone Section
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 font-serif uppercase">
                  {renderInline(block.text)}
                </h1>
              </div>
            );
          }
          if (block.level === 2) {
            return (
              <div
                key={idx}
                className="pt-4 pb-1 border-l-3 border-[#0F4C81] pl-3 my-3 print-block"
              >
                <h2 className="text-base font-bold text-slate-950 tracking-tight font-serif">
                  {renderInline(block.text)}
                </h2>
              </div>
            );
          }
          if (block.level === 3) {
            return (
              <h3 key={idx} className="text-sm font-bold text-slate-900 pt-2 print-block font-serif">
                {renderInline(block.text)}
              </h3>
            );
          }
        }

        if (block.type === 'table') {
          return (
            <div
              key={idx}
              className="my-4 overflow-x-auto border-t-2 border-b-2 border-slate-900 bg-white print-block"
            >
              <table className="w-full text-left border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-400 text-slate-950 font-bold">
                    {block.headers.map((h, hIdx) => {
                      const align = block.alignments[hIdx] || 'left';
                      const alignClass =
                        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
                      return (
                        <th key={hIdx} className={`py-2 px-2.5 uppercase tracking-wider text-[10px] text-slate-900 ${alignClass}`}>
                          {renderInline(h)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-slate-900">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/50"
                    >
                      {row.map((cell, cIdx) => {
                        const align = block.alignments[cIdx] || 'left';
                        const alignClass =
                          align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
                        return (
                          <td key={cIdx} className={`py-1.5 px-2.5 text-slate-900 ${alignClass}`}>
                            {renderInline(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'paragraph') {
          if (block.isCallout && block.calloutType === 'hypothesis') {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-blue-300 bg-blue-50/80 text-slate-900 print-block my-2"
              >
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                  Statistical Hypothesis Formulation
                </div>
                <p
                  style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                  className="leading-relaxed font-serif text-slate-900"
                >
                  {renderInline(block.text)}
                </p>
              </div>
            );
          }

          if (block.isCallout && block.calloutType === 'recommendation') {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/80 text-slate-900 print-block my-2"
              >
                <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                  Strategic Recommendation & Impact
                </div>
                <p
                  style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                  className="leading-relaxed italic font-serif text-slate-900"
                >
                  {renderInline(block.text)}
                </p>
              </div>
            );
          }

          if (block.isCallout && block.calloutType === 'stat') {
            return (
              <div
                key={idx}
                className="p-3 rounded-md border-l-4 border-[#0F4C81] bg-slate-50 text-slate-900 print-block my-2 text-xs border border-slate-200"
              >
                <p
                  style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                  className="leading-relaxed font-sans text-slate-900"
                >
                  {renderInline(block.text)}
                </p>
              </div>
            );
          }

          return (
            <p
              key={idx}
              style={{ textAlign: 'justify', textJustify: 'inter-word' }}
              className="leading-relaxed font-serif text-slate-900 print-block mb-3"
            >
              {renderInline(block.text)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
