/**
 * Healthcare Analytics Platform - PDF Export Helper
 *
 * Exports a single on-screen panel as a real PDF by driving the browser's own print
 * engine ("Save as PDF" / "Microsoft Print to PDF" in the destination list).
 *
 * Why print rather than a generated file: a genuine PDF needs a full document structure —
 * xref table, object graph, embedded fonts. Writing text into a Blob typed
 * `application/pdf` produces a file that no reader can open. The print engine emits a
 * valid document and renders the Recharts SVGs as vector graphics, so charts stay sharp
 * at any zoom.
 *
 * Pairs with the `@media print` rules in styles/index.css.
 */

/** Marks the panel as the print target, prints, then restores the page. */
export function printPanelAsPdf(panelId: string, documentTitle?: string): void {
  const panel = document.getElementById(panelId);
  if (!panel) {
    console.warn(`printPanelAsPdf: no element with id "${panelId}"`);
    return;
  }

  const originalTitle = document.title;

  // The browser uses document.title as the suggested filename.
  if (documentTitle) document.title = documentTitle;

  panel.classList.add('print-target');
  document.documentElement.setAttribute('data-printing', panelId);

  const cleanup = () => {
    panel.classList.remove('print-target');
    document.documentElement.removeAttribute('data-printing');
    document.title = originalTitle;
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  try {
    window.print();
  } finally {
    // Safari and some mobile browsers never fire afterprint; this is the safety net.
    // Harmless when afterprint did fire — cleanup removes its own listener.
    window.setTimeout(cleanup, 1000);
  }
}

/** Filename-safe timestamp: 2026-08-06_1930 */
export function exportTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `_${pad(date.getHours())}${pad(date.getMinutes())}`
  );
}
