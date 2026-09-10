/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DownloadVisualButton Component
 * Allows downloading any dashboard visual as a high-resolution JPEG in either Night Mode or Light Mode.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Download, Sun, Moon, ChevronDown, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { toJpeg } from 'html-to-image';

interface DownloadVisualButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  visualTitle: string;
  isDarkMode: boolean;
  onSetTheme?: (theme: 'light' | 'dark') => Promise<void> | void;
  onResetTheme?: () => void;
  size?: 'sm' | 'xs';
}

export default function DownloadVisualButton({
  cardRef,
  visualTitle,
  isDarkMode,
  onSetTheme,
  onResetTheme,
  size = 'xs',
}: DownloadVisualButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = async (targetTheme: 'light' | 'dark') => {
    if (!cardRef.current || isExporting) return;
    setIsOpen(false);
    setIsExporting(true);

    try {
      // 1. Temporarily apply the requested theme if callback provided
      if (onSetTheme) {
        await onSetTheme(targetTheme);
        // Wait for React re-render and Recharts SVG repainting
        await new Promise((resolve) => setTimeout(resolve, 140));
      }

      const node = cardRef.current;
      if (!node) return;

      // 2. Capture high-resolution JPEG with html-to-image
      const bgColor = targetTheme === 'dark' ? '#111e35' : '#ffffff';
      const dataUrl = await toJpeg(node, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: bgColor,
        skipFonts: true,
        filter: (domNode) => {
          if (domNode instanceof HTMLElement) {
            // Exclude the download button from appearing inside the saved visual image
            if (domNode.classList.contains('export-exclude')) return false;
          }
          return true;
        },
      });

      // 3. Trigger immediate browser download
      const cleanTitle = visualTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${cleanTitle}_${targetTheme}_mode_${timestamp}.jpeg`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show brief success badge
      setExportSuccess(targetTheme === 'dark' ? 'Night JPEG' : 'Light JPEG');
      setTimeout(() => setExportSuccess(null), 2500);
    } catch (err) {
      console.error('Failed to export visual as JPEG:', err);
    } finally {
      // 4. Restore original theme
      if (onResetTheme) {
        onResetTheme();
      }
      setIsExporting(false);
    }
  };

  const btnPadding = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-2 py-1 text-[10.5px]';

  return (
    <div className="relative inline-block text-left export-exclude" ref={menuRef}>
      <button
        type="button"
        onClick={() => !isExporting && setIsOpen(!isOpen)}
        disabled={isExporting}
        title="Download visual as JPEG (Night or Light Mode)"
        className={`flex items-center gap-1.5 rounded-lg border font-mono font-semibold transition-all cursor-pointer select-none ${btnPadding} ${
          isDarkMode
            ? 'bg-[#182640] hover:bg-[#1e2f4f] text-slate-300 hover:text-white border-[#243555] hover:border-blue-500/50'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300'
        } ${isOpen ? 'ring-1 ring-blue-500' : ''}`}
      >
        {isExporting ? (
          <>
            <Loader2 size={12} className="animate-spin text-blue-500" />
            <span>Exporting...</span>
          </>
        ) : exportSuccess ? (
          <>
            <Check size={12} className="text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{exportSuccess} Saved</span>
          </>
        ) : (
          <>
            <Download size={12} className="text-slate-400 dark:text-slate-400" />
            <span>JPEG</span>
            <ChevronDown size={11} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-1.5 w-52 rounded-xl border shadow-xl z-50 py-1.5 backdrop-blur-md animate-fade-in ${
            isDarkMode
              ? 'bg-[#0f172a]/95 border-[#1e2d4a] text-slate-200'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Download as JPEG
            </span>
          </div>

          <div className="p-1 space-y-0.5">
            {/* Option 1: Light Mode JPEG */}
            <button
              type="button"
              onClick={() => handleExport('light')}
              className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-[#182640] transition cursor-pointer group"
            >
              <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-500 shrink-0 mt-0.5 border border-amber-200/50 dark:border-amber-800/40">
                <Sun size={13} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Light Mode JPEG
                </div>
                <div className="text-[9.5px] text-slate-400 dark:text-slate-400 font-light">
                  Clean white canvas &amp; dark text
                </div>
              </div>
            </button>

            {/* Option 2: Night Mode JPEG */}
            <button
              type="button"
              onClick={() => handleExport('dark')}
              className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-[#182640] transition cursor-pointer group"
            >
              <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-400 shrink-0 mt-0.5 border border-indigo-200/50 dark:border-indigo-800/40">
                <Moon size={13} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Night Mode JPEG
                </div>
                <div className="text-[9.5px] text-slate-400 dark:text-slate-400 font-light">
                  Dark navy canvas &amp; glowing accents
                </div>
              </div>
            </button>
          </div>

          <div className="px-3 py-1 border-t border-slate-100 dark:border-slate-800/80 text-[8.5px] text-slate-400 font-mono">
            2× High DPI · Publication Ready
          </div>
        </div>
      )}
    </div>
  );
}
