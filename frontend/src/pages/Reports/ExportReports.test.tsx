/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CAPSTONE_REPORT } from './capstoneReportData';
import { PAGINATED_REPORT_DATA } from './paginatedReportData';
import ReportContentRenderer from './ReportContentRenderer';
import AcademicPageSheet from './AcademicPageSheet';
import ExportReports from './ExportReports';

describe('Capstone Report Data and Integration', () => {
  it('loads authentic Capstone metadata and all 14 chapters', () => {
    expect(CAPSTONE_REPORT.metadata.institution).toContain('University of Niagara Falls');
    expect(CAPSTONE_REPORT.metadata.course).toBe('DAMO 699 – Capstone Project');
    expect(CAPSTONE_REPORT.metadata.program).toBe('Master of Data Analytics');
    expect(CAPSTONE_REPORT.metadata.supervisor).toBe('Dr. Bilal El Toufaili');
    expect(CAPSTONE_REPORT.metadata.group).toContain('5');
    expect(CAPSTONE_REPORT.metadata.authors).toHaveLength(3);
    expect(CAPSTONE_REPORT.metadata.authors[0].name).toBe('Rajbharath P');
    expect(CAPSTONE_REPORT.chapters).toHaveLength(14);
  });

  it('loads 69 authentic paginated pages directly extracted from Word doc', () => {
    expect(PAGINATED_REPORT_DATA.totalPages).toBe(69);
    expect(PAGINATED_REPORT_DATA.pages).toHaveLength(69);
    expect(PAGINATED_REPORT_DATA.chapters.length).toBeGreaterThan(10);
    
    // Page 1 is the official Cover Page
    const page1 = PAGINATED_REPORT_DATA.pages[0];
    expect(page1.isCover).toBe(true);
    expect(page1.chapter).toBe('Cover Page');
    
    // Page 4 is Executive Summary
    const page4 = PAGINATED_REPORT_DATA.pages[3];
    expect(page4.chapter).toBe('Executive Summary');

    // Page 6 is Chapter 1
    const page6 = PAGINATED_REPORT_DATA.pages[5];
    expect(page6.chapter).toContain('Chapter 1');
  });

  it('renders markdown tables and headers in ReportContentRenderer', () => {
    const sampleMarkdown = `
# Chapter 1: Test Heading
## 1.1 Test Subheading
| Metric | Value |
| --- | --- |
| Kruskal-Wallis H | 126,319,368.24 |
| p-value | < 0.001 |
**Hypothesis H1:** Median LOS varies significantly by CTAS.
`;
    const { container } = render(<ReportContentRenderer content={sampleMarkdown} />);

    expect(screen.getByText('Chapter 1: Test Heading')).toBeDefined();
    expect(screen.getByText('1.1 Test Subheading')).toBeDefined();
    expect(container.querySelector('table')).not.toBeNull();
    expect(screen.getByText('126,319,368.24')).toBeDefined();
  });

  it('renders AcademicPageSheet with justified paragraphs, running header, and footer', () => {
    const samplePage = PAGINATED_REPORT_DATA.pages[5]; // Chapter 1
    const { container } = render(
      <AcademicPageSheet
        page={samplePage}
        totalPages={69}
        zoom={100}
      />
    );

    // Running Header
    expect(screen.getByText(/University of Niagara Falls Canada · Master of Data Analytics/)).toBeDefined();
    // Running Footer
    expect(screen.getByText('Page 6 of 69')).toBeDefined();
    // Justified paragraph
    const p = container.querySelector('p');
    expect(p).not.toBeNull();
    expect(p?.style.textAlign).toBe('justify');
  });

  it('renders ExportReports component as an executive-report-only view with a single export button', () => {
    const { container } = render(
      <ExportReports
        datasetName="CIHI NACRS (2003-2026)"
        cleanedCount={175800000}
        qualityScore={98}
      />
    );

    // Verify Title and University Header
    expect(screen.getByText('Final Capstone Report & Executive Dossier')).toBeDefined();
    expect(screen.getAllByText('University of Niagara Falls Canada').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dr. Bilal El Toufaili').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rajbharath P/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sufyaan Khan Mohammed/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Amit Raj Dev/).length).toBeGreaterThan(0);

    // The Executive Report is the only in-app view — no Final Report tab/toggle,
    // no embedded Final Report PDF iframe, and no way to switch to viewing it.
    expect(screen.queryByRole('button', { name: /Final Report \(Official PDF\)/i })).toBeNull();
    expect(container.querySelector('iframe[title="Final Report Capstone Project PDF"]')).toBeNull();
    expect(screen.getAllByText(/Executive Report/i).length).toBeGreaterThan(0);

    // Verify preview sheet container exists
    const previewSheet = container.querySelector('#report-preview-sheet');
    expect(previewSheet).not.toBeNull();

    // Exactly one export/download button on the page, opening a modal with all
    // three format choices — no standalone Markdown button, no Academic Dossier
    // panel, and no secondary "Download PDF"/"Open in Tab" buttons elsewhere.
    const exportBtn = screen.getByRole('button', { name: /Download Report \(PDF\)/i });
    expect(exportBtn).toBeDefined();
    expect(screen.queryByRole('button', { name: /Download Report \(Markdown/i })).toBeNull();
    expect(screen.queryByText('Academic Dossier')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Download PDF$/i })).toBeNull();

    fireEvent.click(exportBtn);
    expect(screen.getByText('Download Report (PDF Format)')).toBeDefined();
    expect(screen.getByText(/Reports are downloaded exclusively in/i)).toBeDefined();

    // All three download options are present: Executive, Final, Both
    expect(screen.getByText('Executive Report (PDF)')).toBeDefined();
    expect(screen.getByText('Final Report (PDF)')).toBeDefined();
    expect(screen.getByText('Both Reports (PDF)')).toBeDefined();
    expect(screen.getAllByText(/Final Report Capstone Project\.pdf/i).length).toBeGreaterThan(0);

    // Verify no Word or DOCX format option exists
    expect(screen.queryByText(/\.docx/i)).toBeNull();
  });
});
