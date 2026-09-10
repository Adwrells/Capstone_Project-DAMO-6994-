/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Paginated Capstone Report Data
 * Source: "Final Report Capstone Project.docx"
 * Direct extraction using Microsoft Word page boundaries and styles
 */

export interface Run {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export interface ParagraphElement {
  type: 'p';
  text: string;
  align: 'left' | 'center' | 'right' | 'justify';
  runs: Run[];
  is_h1?: boolean;
  is_h2?: boolean;
  is_h3?: boolean;
}

export interface TableElement {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export type PageElement = ParagraphElement | TableElement;

export interface ReportPage {
  pageNumber: number;
  chapter: string;
  isCover: boolean;
  elements: PageElement[];
}

export interface ChapterNav {
  id: string;
  name: string;
  startPage: number;
  pageCount: number;
}

export interface CapstonePaginatedData {
  metadata: {
    title: string;
    subtitle: string;
    course: string;
    program: string;
    group: string;
    institution: string;
    date: string;
    supervisor: string;
    authors: { name: string; id: string }[];
  };
  totalPages: number;
  chapters: ChapterNav[];
  pages: ReportPage[];
}

export const PAGINATED_REPORT_DATA: CapstonePaginatedData = {
  "metadata": {
    "title": "Length of Stay and Resource Utilization Trends in Canadian Hospitals",
    "subtitle": "A Frequency-Weighted Biostatistical and Time-Series Analysis of 175.8 Million CIHI NACRS Emergency Department Encounters (2003–2022)",
    "course": "DAMO 699 – Capstone Project",
    "program": "Master of Data Analytics",
    "group": "Group No: 5",
    "institution": "University of Niagara Falls",
    "date": "September 6, 2026",
    "supervisor": "Dr. Bilal El Toufaili",
    "authors": [
      {
        "name": "Rajbharath P",
        "id": "NF1016766"
      },
      {
        "name": "Sufyaan Khan Mohammed",
        "id": "NF1017047"
      },
      {
        "name": "Amit Raj Dev",
        "id": "NF1021076"
      }
    ]
  },
  "totalPages": 69,
  "chapters": [
    {
      "id": "cover-page",
      "name": "Cover Page",
      "startPage": 1,
      "pageCount": 1
    },
    {
      "id": "table-of-contents",
      "name": "Table of Contents",
      "startPage": 2,
      "pageCount": 2
    },
    {
      "id": "executive-summary",
      "name": "Executive Summary",
      "startPage": 4,
      "pageCount": 2
    },
    {
      "id": "chapter-1",
      "name": "Chapter 1",
      "startPage": 6,
      "pageCount": 3
    },
    {
      "id": "chapter-2",
      "name": "Chapter 2",
      "startPage": 9,
      "pageCount": 2
    },
    {
      "id": "chapter-3",
      "name": "Chapter 3",
      "startPage": 11,
      "pageCount": 3
    },
    {
      "id": "chapter-4",
      "name": "Chapter 4",
      "startPage": 14,
      "pageCount": 4
    },
    {
      "id": "chapter-5",
      "name": "Chapter 5",
      "startPage": 18,
      "pageCount": 13
    },
    {
      "id": "chapter-6",
      "name": "Chapter 6",
      "startPage": 31,
      "pageCount": 7
    },
    {
      "id": "chapter-7",
      "name": "Chapter 7",
      "startPage": 38,
      "pageCount": 12
    },
    {
      "id": "chapter-8",
      "name": "Chapter 8",
      "startPage": 50,
      "pageCount": 5
    },
    {
      "id": "chapter-9",
      "name": "Chapter 9",
      "startPage": 55,
      "pageCount": 5
    },
    {
      "id": "references",
      "name": "References",
      "startPage": 60,
      "pageCount": 3
    },
    {
      "id": "appendix-a",
      "name": "Appendix A",
      "startPage": 63,
      "pageCount": 3
    },
    {
      "id": "appendix-b",
      "name": "Appendix B",
      "startPage": 66,
      "pageCount": 1
    },
    {
      "id": "appendix-c",
      "name": "Appendix C",
      "startPage": 67,
      "pageCount": 3
    }
  ],
  "pages": [
    {
      "pageNumber": 1,
      "chapter": "Cover Page",
      "isCover": true,
      "elements": [
        {
          "type": "p",
          "text": "Explanatory and Predictive Analytics of Emergency Department",
          "align": "center",
          "runs": [
            {
              "text": "Explanatory and Predictive Analytics of Emergency Department",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Length of Stay and Resource Utilization Trends in Canadian Hospitals",
          "align": "center",
          "runs": [
            {
              "text": "Length of Stay and Resource Utilization Trends in Canadian Hospitals",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Course: DAMO 699 – Capstone Project",
          "align": "center",
          "runs": [
            {
              "text": "Course: DAMO 699 – Capstone Project",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Program: Master of Data Analytics",
          "align": "center",
          "runs": [
            {
              "text": "Program: Master of Data Analytics",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Rajbharath P (NF1016766)",
          "align": "center",
          "runs": [
            {
              "text": "Rajbharath P (NF1016766)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Sufyaan Khan Mohammed (NF1017047)",
          "align": "center",
          "runs": [
            {
              "text": "Sufyaan",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Khan ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Moh",
              "bold": true,
              "italic": false
            },
            {
              "text": "ammed",
              "bold": true,
              "italic": false
            },
            {
              "text": " (NF101704",
              "bold": true,
              "italic": false
            },
            {
              "text": "7",
              "bold": true,
              "italic": false
            },
            {
              "text": ")",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Amit Raj Dev (NF1021076)",
          "align": "center",
          "runs": [
            {
              "text": "Amit Raj Dev (NF1021076)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Group No: 5",
          "align": "center",
          "runs": [
            {
              "text": "Group No: 5",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Supervisor: Dr. Bilal El Toufaili",
          "align": "center",
          "runs": [
            {
              "text": "Supervisor: Dr. Bilal El ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Toufaili",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Institution: University of Niagara Falls",
          "align": "center",
          "runs": [
            {
              "text": "Institution: University of Niagara Falls",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "6th September 2026",
          "align": "center",
          "runs": [
            {
              "text": "6",
              "bold": true,
              "italic": false
            },
            {
              "text": "th",
              "bold": true,
              "italic": false
            },
            {
              "text": " September 2026",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 2,
      "chapter": "Table of Contents",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Table of Contents",
          "align": "center",
          "runs": [
            {
              "text": "Table of Contents",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 3,
      "chapter": "Table of Contents",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Executive Summary ..................................................................................................................... 4Chapter 1: Problem Analysis and Strategic Context ................................................................ 61.1 The Canadian Emergency Care Landscape ............................................................................. 61.2 Access Block and Mechanics of Length of Stay ..................................................................... 61.3 Problem Statement ................................................................................................................... 71.4 Objectives and Scope ............................................................................................................... 71.5 Canonical Hypothesis Registry ................................................................................................ 8Chapter 2: Analytics Lifecycle and Project Methodology ....................................................... 92.1 A Ten-Stage Analytics Lifecycle ............................................................................................. 92.2 Why Non-Parametric Methods .............................................................................................. 102.3 Protection from the Ecological Fallacy .................................................................................. 11Chapter 3: Data Collection, Inventory and Preparation ....................................................... 123.1 Data Provenance .................................................................................................................... 123.2 Database Structure ................................................................................................................. 123.3 Cleaning and Quality Control ................................................................................................ 123.4 Feature Engineering ............................................................................................................... 133.5 Data Isolation and Reproducibility ........................................................................................ 14Chapter 4: Exploratory Data Analysis and Descriptive Profiling …………………………. 154.1 Nineteen Years of Volume Growth ....................................................................................... 154.2 Acuity and Admission Profiles .............................................................................................. 164.3 Age and Sex ........................................................................................................................... 164.4 Clinical Case Mix .................................................................................................................. 17Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference………………………. 195.1 Overview of the Hypothesis Testing Framework .................................................................. 195.2 Hypothesis 1: Reported Median ED LOS Across CTAS Triage Levels…………………… 195.3 Hypothesis 2: Reported Median ED LOS for Admitted vs. Non-Admitted Visits…………. 225.4 Hypothesis 3: Weighted Least Squares Regression of Reported Median ED LOS………… 245.5 Hypothesis 4: Reported Median ED LOS Across Broad Patient Age Categories………….. 275.6 Hypothesis 5: Patient Sex and ED Visit Disposition Association………………………….. 305.8 Statistical and Operational Implications ................................................................................ 335.9 Conclusion ............................................................................................................................. 34Chapter 6: Time-Series Trend Analysis and Throughput Forecasting……………………. 356.2 Simple Exponential Smoothing (SES) Forecast ..................................................................... 366.3 Estimated Resource Burden Index ......................................................................................... 37Chapter 7: Data Visualization and Decision Support Systems .............................................. 417.1 Dashboard Architecture ......................................................................................................... 417.2 Hypothesis Testing Dashboard Views .................................................................................. 427.3 Resource-Burden and Presenting-Problem Views ................................................................ 467.4 Dashboard Audiences and Interaction Modes ....................................................................... 517.5 Interactive Filtering and Decision Support ............................................................................ 517.6 Interactive Visual Studio and AI-Assisted Chart Design ………………………………….. 52Chapter 8: Findings, Synthesis, and Critical Discussion ....................................................... 558.1 An Operational Triad ............................................................................................................. 558.2 Comparison with Existing Literature ..................................................................................... 568.3 Methodological Strengths ...................................................................................................... 578.4 Limitations ............................................................................................................................. 58Chapter 9: Strategic Recommendations and Implementation Roadmap………………….. 599.1 Restating the Core Findings ................................................................................................... 599.2 Tiered Recommendations ...................................................................................................... 609.3 Strategic Implementation Roadmap ....................................................................................... 639.4 Measuring Implementation Success ...................................................................................... 649.5 Closing Note .......................................................................................................................... 64References .................................................................................................................................... 66Appendix A: System Validation and Testing Evidence .............................................................. 69Appendix B: Rubric Alignment Checklist ................................................................................... 72Appendix C: Analytics Lifecycle Evidence Log ......................................................................... 73",
          "align": "justify",
          "runs": [
            {
              "text": "Executive Summary ..................................................................",
              "bold": true,
              "italic": false
            },
            {
              "text": "...................................................",
              "bold": true,
              "italic": false
            },
            {
              "text": " 4",
              "bold": true,
              "italic": false
            },
            {
              "text": "Chapter 1: Problem Analysis and Strategic Context ..................",
              "bold": true,
              "italic": false
            },
            {
              "text": "..............................................",
              "bold": true,
              "italic": false
            },
            {
              "text": " 6",
              "bold": true,
              "italic": false
            },
            {
              "text": "1.1 The Canadian Emergency Care Landscape ...................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 6",
              "bold": false,
              "italic": false
            },
            {
              "text": "1.2 Access Block and Mechanics of Length of Stay .............",
              "bold": false,
              "italic": false
            },
            {
              "text": "........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 6",
              "bold": false,
              "italic": false
            },
            {
              "text": "1.3 Problem Statement ....................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 7",
              "bold": false,
              "italic": false
            },
            {
              "text": "1.4 Objectives and Scope ................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 7",
              "bold": false,
              "italic": false
            },
            {
              "text": "1.5 Canonical Hypothesis Registry ....................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 8",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 2: Analytics Lifecycle and Project Methodology ............",
              "bold": true,
              "italic": false
            },
            {
              "text": "...........................................",
              "bold": true,
              "italic": false
            },
            {
              "text": " 9",
              "bold": true,
              "italic": false
            },
            {
              "text": "2.1 A Ten-Stage Analytics Lifecycle ..................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 9",
              "bold": false,
              "italic": false
            },
            {
              "text": "2.2 Why Non-Parametric Methods ..................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 10",
              "bold": false,
              "italic": false
            },
            {
              "text": "2.3 Protection from the Ecological Fallacy ........................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 11",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 3: Data Collection, Inventory and Preparation ............",
              "bold": true,
              "italic": false
            },
            {
              "text": "...........................................",
              "bold": true,
              "italic": false
            },
            {
              "text": " 12",
              "bold": true,
              "italic": false
            },
            {
              "text": "3.1 Data Provenance .....................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 12",
              "bold": false,
              "italic": false
            },
            {
              "text": "3.2 Database Structure ..................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 12",
              "bold": false,
              "italic": false
            },
            {
              "text": "3.3 Cleaning and Quality Control ....................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 12",
              "bold": false,
              "italic": false
            },
            {
              "text": "3.4 Feature Engineering .................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 13",
              "bold": false,
              "italic": false
            },
            {
              "text": "3.5 Data Isolation and Reproducibility .............................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 14",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 4: Exploratory Data Analysis and Descriptive Profiling ",
              "bold": true,
              "italic": false
            },
            {
              "text": "………………………….",
              "bold": true,
              "italic": false
            },
            {
              "text": " 15",
              "bold": true,
              "italic": false
            },
            {
              "text": "4.1 Nineteen Years of Volume Growth .............................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 15",
              "bold": false,
              "italic": false
            },
            {
              "text": "4.2 Acuity and Admission Profiles ...................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 16",
              "bold": false,
              "italic": false
            },
            {
              "text": "4.3 Age and Sex ............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 16",
              "bold": false,
              "italic": false
            },
            {
              "text": "4.4 Clinical Case Mix ......................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 17",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference",
              "bold": true,
              "italic": false
            },
            {
              "text": "……………………….",
              "bold": true,
              "italic": false
            },
            {
              "text": " 19",
              "bold": true,
              "italic": false
            },
            {
              "text": "5.1 Overview of the Hypothesis Testing Framework ..........",
              "bold": false,
              "italic": false
            },
            {
              "text": "........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 19",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.2 Hypothesis 1: Reported Median ED LOS Across CTAS Triage Levels",
              "bold": false,
              "italic": false
            },
            {
              "text": "……………………",
              "bold": false,
              "italic": false
            },
            {
              "text": " 19",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.3 Hypothesis 2: Reported Median ED LOS for Admitted vs. Non-Admitted Visits",
              "bold": false,
              "italic": false
            },
            {
              "text": "………….",
              "bold": false,
              "italic": false
            },
            {
              "text": " 22",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.4 Hypothesis 3: Weighted Least Squares Regression of Reported Median ED LOS",
              "bold": false,
              "italic": false
            },
            {
              "text": "…………",
              "bold": false,
              "italic": false
            },
            {
              "text": " 24",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.5 Hypothesis 4: Reported Median ED LOS Across Broad Patient Age Categories",
              "bold": false,
              "italic": false
            },
            {
              "text": "………",
              "bold": false,
              "italic": false
            },
            {
              "text": "…..",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "27",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.6 Hypothesis 5: Patient Sex and ED Visit Disposition Association",
              "bold": false,
              "italic": false
            },
            {
              "text": "………………………",
              "bold": false,
              "italic": false
            },
            {
              "text": "…..",
              "bold": false,
              "italic": false
            },
            {
              "text": " 30",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.8 Statistical and Operational Implications .....................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 33",
              "bold": false,
              "italic": false
            },
            {
              "text": "5.9 Conclusion .............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "................................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 34",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 6: Time-Series Trend Analysis and Throughput Forecasting",
              "bold": true,
              "italic": false
            },
            {
              "text": "…………………….",
              "bold": true,
              "italic": false
            },
            {
              "text": " 35",
              "bold": true,
              "italic": false
            },
            {
              "text": "6.2 Simple Exponential Smoothing (SES) Forecast ............",
              "bold": false,
              "italic": false
            },
            {
              "text": ".........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 36",
              "bold": false,
              "italic": false
            },
            {
              "text": "6.3 Estimated Resource Burden Index ..............................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 37",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 7: Data Visualization and Decision Support Systems .....",
              "bold": true,
              "italic": false
            },
            {
              "text": ".......................................",
              "bold": true,
              "italic": false
            },
            {
              "text": "..",
              "bold": true,
              "italic": false
            },
            {
              "text": " 41",
              "bold": true,
              "italic": false
            },
            {
              "text": "7.1 Dashboard Architecture ...........................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".",
              "bold": false,
              "italic": false
            },
            {
              "text": " 41",
              "bold": false,
              "italic": false
            },
            {
              "text": "7.2 Hypothesis Testing Dashboard Views .........................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 42",
              "bold": false,
              "italic": false
            },
            {
              "text": "7.3 Resource-Burden and Presenting-Problem Views ..........",
              "bold": false,
              "italic": false
            },
            {
              "text": "......................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 46",
              "bold": false,
              "italic": false
            },
            {
              "text": "7.4 Dashboard Audiences and Interaction Modes ...............",
              "bold": false,
              "italic": false
            },
            {
              "text": "........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 51",
              "bold": false,
              "italic": false
            },
            {
              "text": "7.5 Interactive Filtering and Decision Support ................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".. 51",
              "bold": false,
              "italic": false
            },
            {
              "text": "7.6 Interactive Visual Studio and AI-Assisted Chart Design ",
              "bold": false,
              "italic": false
            },
            {
              "text": "………………………………",
              "bold": false,
              "italic": false
            },
            {
              "text": "…",
              "bold": false,
              "italic": false
            },
            {
              "text": ".",
              "bold": false,
              "italic": false
            },
            {
              "text": ".",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "52",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 8: Findings, Synthesis, and Critical Discussion ...........",
              "bold": true,
              "italic": false
            },
            {
              "text": "...........................................",
              "bold": true,
              "italic": false
            },
            {
              "text": ". 55",
              "bold": true,
              "italic": false
            },
            {
              "text": "8.1 An Operational Triad .............................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ". 55",
              "bold": false,
              "italic": false
            },
            {
              "text": "8.2 Comparison with Existing Literature .......................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".... 56",
              "bold": false,
              "italic": false
            },
            {
              "text": "8.3 Methodological Strengths ......................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".. 57",
              "bold": false,
              "italic": false
            },
            {
              "text": "8.4 Limitations ..............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 58",
              "bold": false,
              "italic": false
            },
            {
              "text": "Chapter 9: Strategic Recommendations and Implementation Roadmap",
              "bold": true,
              "italic": false
            },
            {
              "text": "………………",
              "bold": true,
              "italic": false
            },
            {
              "text": "…..",
              "bold": true,
              "italic": false
            },
            {
              "text": " 59",
              "bold": true,
              "italic": false
            },
            {
              "text": "9.1 Restating the Core Findings .....................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 59",
              "bold": false,
              "italic": false
            },
            {
              "text": "9.2 Tiered Recommendations .........................................",
              "bold": false,
              "italic": false
            },
            {
              "text": ".............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 60",
              "bold": false,
              "italic": false
            },
            {
              "text": "9.3 Strategic Implementation Roadmap ............................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 63",
              "bold": false,
              "italic": false
            },
            {
              "text": "9.4 Measuring Implementation Success ...........................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 64",
              "bold": false,
              "italic": false
            },
            {
              "text": "9.5 Closing Note ...........................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "...............................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 64",
              "bold": false,
              "italic": false
            },
            {
              "text": "References ..............................................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "......................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 66",
              "bold": false,
              "italic": false
            },
            {
              "text": "Appendix A: System Validation and Testing Evidence ................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..............................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 69",
              "bold": false,
              "italic": false
            },
            {
              "text": "Appendix B: Rubric Alignment Checklist ...................................",
              "bold": false,
              "italic": false
            },
            {
              "text": "................................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 72",
              "bold": false,
              "italic": false
            },
            {
              "text": "Appendix C: Analytics Lifecycle Evidence Log ...........................",
              "bold": false,
              "italic": false
            },
            {
              "text": "..............................................",
              "bold": false,
              "italic": false
            },
            {
              "text": " 73",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 4,
      "chapter": "Executive Summary",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Executive Summary",
          "align": "center",
          "runs": [
            {
              "text": "Executive Summary",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Nearly 20 years ago, EDs began to receive an increasing number of patients, and length of stay has increased with the number of patients. Hospital and health-system executives who are tasked with handling this strain are often left to compare raw annual averages instead of defensible data, making it hard to discern throughput's impact on clinical acuity, inpatient bed access and patient population. This Capstone project does do that by using a complete data analytics lifecycle to an aggregated reporting data set published by the Canadian Institute for Health Information (CIHI) over the 19 fiscal years from FY 2003-2004 to FY 2021-2022 under the National Ambulatory Care Reporting System (NACRS). The compiled analytical data has 10,685 aggregate reporting rows, which correspond to about 175.8 million emergency department encounters.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Nearly 20 years ago, EDs began to receive an increasing number of patients, and length of stay has increased with the number of patients. Hospital and health-system executives who are tasked with handling this strain are often left to compare raw annual averages instead of defensible data, making it hard to discern throughput's impact on clinical acuity, inpatient bed access and patient population. This Capstone project does do that by using a complete data analytics lifecycle to an aggregated reporting data set published by the Canadian Institute for Health Information (CIHI) over the 19 fiscal years from FY 2003-2004 to FY 2021-2022 under the National Ambulatory Care Reporting System (NACRS). The compiled analytical data has 10,685 aggregate reporting rows, which correspond to about 175.8 million emergency department encounters.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Since the various figures in CIHI are published as pre-aggregated stratum summaries and due to the high right skew of the length of stay figures, the analysis used frequency weighted, non-parametric statistical methods instead of classical, parametric tests. Visit counts for each reporting stratum are used within custom mid-rank algorithms and thus each hypothesis test represents a true number of visits, not five hundred vs. 1.5 million.",
          "align": "justify",
          "runs": [
            {
              "text": "Since the various figures in CIHI are published as pre-aggregated stratum summaries and due to the high right skew of the length of stay figures, the analysis used frequency weighted, non-parametric statistical methods instead of classical, parametric tests. Visit counts for each reporting stratum are used within custom mid",
              "bold": false,
              "italic": false
            },
            {
              "text": "-",
              "bold": false,
              "italic": false
            },
            {
              "text": "rank algorithms and thus each hypothesis test represents a true number of visits, not five hundred vs. 1.5 million.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The empirical work is based on five pre-registered hypotheses. The median length of stay varies significantly by the five levels of the Canadian Triage and Acuity Scale (CTAS) (H = 126,319,368.24, df = 4, p < .0001, ε² = 0.73): presentations in CTAS II (Emergent) category had the longest length of stay at 4.80 hours, followed closely by those in CTAS I (Resuscitation) at 4.60 hours. The most dramatic difference between admission status and any other is seen for inpatient admissions, who spend a weighted median of 10.60 hours in the ED as opposed to 2.50 hours for patients discharged or transferred (U ≈ 2.69 × 10¹², rb = 0.998) – this is nearly deterministic. An analysis of the standardized CTAS urgency score confirms that it is an independent predictor of median length of stay (β₁ = −115.72 minutes per level, R² = 0.316), and a weighted Kruskal–Wallis test reveals that older adults (65 and older) have the highest median length of stay (4.17 hours, ε² = 0.72) among all age cohorts.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The empirical work is based on five pre-registered hypotheses. The median length of stay varies significantly by the five levels of the Canadian Triage and Acuity Scale ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(CTAS) (H = 126,319,368.24, ",
              "bold": true,
              "italic": false
            },
            {
              "text": "df",
              "bold": true,
              "italic": false
            },
            {
              "text": " = 4, p < .0001, ε² = 0.73)",
              "bold": true,
              "italic": false
            },
            {
              "text": ": presentations in CTAS II (Emergent) category had the longest length of stay at 4.80 hours, followed closely by those in CTAS I (Resuscitation) at 4.60 hours. The most dramatic difference between admission status and any other is seen for inpatient admissions, who spend a weighted median of 10.60 hours in the ED as opposed to 2.50 hours for patients discharged or transferred ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(U ≈ 2.69 × 10¹², ",
              "bold": true,
              "italic": false
            },
            {
              "text": "rb",
              "bold": true,
              "italic": false
            },
            {
              "text": " = 0.998)",
              "bold": true,
              "italic": false
            },
            {
              "text": " – this is nearly deterministic. An analysis of the standardized CTAS urgency score confirms that it is an independent predictor of median length of stay ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(β₁ = −115.72 minutes per level, R² = 0.316),",
              "bold": true,
              "italic": false
            },
            {
              "text": " and a weighted Kruskal–",
              "bold": false,
              "italic": false
            },
            {
              "text": "Wallis",
              "bold": false,
              "italic": false
            },
            {
              "text": " test reveals that older adults (65 and older) have the highest median length of stay ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(4.17 hours, ε² = 0.72)",
              "bold": true,
              "italic": false
            },
            {
              "text": " among all age cohorts. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "However, biological sex is statistically associated with admission status due to the very large sample size (χ² = 18,164.97, p < .0001), but the effect is essentially null (Cramér's V = 0.010) and would not be used to inform flow design.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "However, biological sex is statistically associated with admission status due to the very large sample size ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(χ² = 18,164.97, p < .0001),",
              "bold": true,
              "italic": false
            },
            {
              "text": " but the effect is essentially null ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(Cramér's V = 0.010",
              "bold": true,
              "italic": false
            },
            {
              "text": ") and",
              "bold": true,
              "italic": false
            },
            {
              "text": " would not be used to inform flow design.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 5,
      "chapter": "Executive Summary",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Longitudinal analysis revealed a significant increase in the number of visits over the study period (Mann–Kendall z = 5.60, p < .0001; Simple Exponential Smoothing forecasted a five-year increase of visit volumes to a stable level of ~12.95 million visits per year with a 95% prediction interval of 5.9–20.0 million visits per year at five years out. A derived Estimated Resource Burden Index (ERBI) that accounted for both acuity and duration of visits also increased over the same time (τ = 0.977), suggesting an increase in strain on the system rather than just the number of visits.",
          "align": "justify",
          "runs": [
            {
              "text": "Longitudinal analysis revealed a significant increase in the number of visits over the study period (",
              "bold": false,
              "italic": false
            },
            {
              "text": "Mann–Kendall z = 5.60, p < .0001",
              "bold": true,
              "italic": false
            },
            {
              "text": "; Simple Exponential Smoothing forecasted a five-year ",
              "bold": false,
              "italic": false
            },
            {
              "text": "increase of visit volumes to a stable level of ~12.95 million visits per year with a 95% prediction interval of 5.9–20.0 million visits per year at five years out. A derived Estimated Resource Burden Index (ERBI) that accounted for both acuity and duration of visits also increased over the same time ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(τ = 0.977),",
              "bold": true,
              "italic": false
            },
            {
              "text": " suggesting an increase in strain on the system rather than just the number of visits.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In aggregate, the results suggest three structural factors that contribute to emergency throughput delay: complexity of diagnosis at CTAS II level; access to inpatient beds; and the disproportionate impact of older age. This report ends with a series of phased implementation ideas, fast-track pathways for low-acuity patients, inpatient discharge-flow ideas and ongoing analytics governance, which offer an evidence-based foundation for hospital and health-system leaders to begin reducing length of stay.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "In aggregate, the results suggest three structural factors that contribute to emergency throughput delay: complexity of diagnosis at CTAS II level; access to inpatient beds; and the disproportionate impact of older age. This report ends with a series of phased implementation ideas, fast-track pathways for low-acuity patients, inpatient discharge-flow ideas and ongoing analytics governance, which offer an evidence-based foundation for hospital and health-system leaders to begin reducing length of stay.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 6,
      "chapter": "Chapter 1",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 1: Problem Analysis and Strategic Context",
          "align": "center",
          "runs": [
            {
              "text": "Chapter 1: Problem Analysis and Strategic Context",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "1.1 The Canadian Emergency Care landscape",
          "align": "justify",
          "runs": [
            {
              "text": "1.1 The Canadian Emergency Care landscape",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Emergency departments are a particularly vulnerable part of the Canadian publicly funded health care system. The Canada Health Act requires that all hospital emergency departments admit, treat and stabilize every person, whether they are able to afford the care or whether their presentation is complex. Approximately 15 million of these visits take place each year in the ten provinces and three territories, and this number has been increasing, despite a rapidly aging population, fewer primary care physicians and low hospital bed ratios compared to other developed health systems, among other factors (OECD 2023). This project is based on data from the Canadian Institute for Health Information (CIHI) which coordinates the resulting data via the National Ambulatory Care Reporting System (NACRS).",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Emergency departments are a particularly vulnerable part of the Canadian publicly funded health care system. The Canada Health Act requires that all hospital emergency departments admit, treat and stabilize every person, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "whether",
              "bold": false,
              "italic": false
            },
            {
              "text": " they ",
              "bold": false,
              "italic": false
            },
            {
              "text": "are able to",
              "bold": false,
              "italic": false
            },
            {
              "text": " afford the care or whether their presentation is complex. Approximately 15 million of these visits take place each year in the ten provinces and three territories, and this number has been increasing, despite a rapidly aging population, fewer primary care physicians and low hospital bed ratios compared to other developed health systems, among other factors (OECD 2023). This project is based on data from the Canadian Institute for Health Information (CIHI) which coordinates the resulting data via the National Ambulatory Care Reporting System (NACRS).",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "1.2 Access Block and Mechanics of Length of Stay",
          "align": "justify",
          "runs": [
            {
              "text": "1.2 ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Access Block and Mechanics of Length of Stay",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 7,
      "chapter": "Chapter 1",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "According to CIHI, the length of stay is the length of time between registration at triage and actual discharge from the ED. The single interval represents a collection of different clinical phases: waiting to be seen, physician evaluation and diagnostic investigation, disposition decision, and, when patients are admitted, the waiting for an inpatient bed. Overcrowding is not a problem within the ED per se, but rather a sign of a capacity issue in the hospital, and access block, where patients are accepted for admission but cannot leave the ED as no beds are available, is the main driver of overcrowding (Canadian Institute for Health Information, 2024; Affleck et al., 2013; Li et al., 2026). The downstream effects are documented in the health-services literature, and include increased mortality rates for boarded patients with time-sensitive diseases like sepsis, myocardial infarction or stroke; delayed antibiotic treatment and imaging; higher rates of patients leaving without care from which they will later deteriorate; and increased burn-out among emergency physicians and nurses from the delay in offloading ambulances (Pines et al., 2009; Singer et al., 2011; Carter et al., 2014). These impacts have been monitored using the national wait-time reporting system for over a decade but have not been addressed with a structural solution (Canadian Institute for Health Information, 2025). These impacts are not uniform in the system. Hospitals with a high proportion of high acuity and inpatients, or in larger urban areas, exhibit the worst boarding times and community and regional hospitals are more likely to have bottlenecks earlier in the visit due to staffing. There are two distinct patterns that are identified in the aggregate national data presented here, although the supplementary tables analyzed in this project lack facility identifiers to allow for the separation of these two patterns.",
          "align": "justify",
          "runs": [
            {
              "text": "          According to CIHI, the length of stay is the length of time between registration at triage and actual discharge from the ED. The single interval represents a collection of different clinical phases: waiting to be seen, physician evaluation and diagnostic investigation, disposition decision, and, when patients are admitted, the waiting for an inpatient bed. Overcrowding is not a problem within the ED per se, but rather a sign of a capacity issue in the hospital, and access block, where patients are accepted for admission but cannot leave the ED as no beds are available, is the main driver of overcrowding ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(Canadian Institute for Health Information, 2024; Affleck et al., 2013; Li et al., 2026).",
              "bold": true,
              "italic": false
            },
            {
              "text": " The downstream effects are documented in the health-services literature, and include increased mortality rates for boarded patients with time-sensitive diseases like sepsis, myocardial infarction or stroke; delayed antibiotic treatment and imaging; higher rates of patients leaving without care from which they will later deteriorate; and increased burn-out among emergency physicians and nurses from the delay in offloading ambulances ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(Pines et al., 2009; Singer et al., 2011; Carter et al., 2014).",
              "bold": true,
              "italic": false
            },
            {
              "text": " These impacts have been monitored using the national wait-time reporting system for over a decade but have not been addressed with a structural solution ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(Canadian Institute for Health Information, 2025).",
              "bold": true,
              "italic": false
            },
            {
              "text": " These impacts are not uniform in the system. Hospitals with a high proportion of high acuity and inpatients, or in larger urban areas, exhibit the worst boarding times and community and regional hospitals are more likely to have bottlenecks earlier in the visit due to staffing. There are two distinct patterns that are identified in ",
              "bold": false,
              "italic": false
            },
            {
              "text": "the aggregate national data presented here, although the supplementary tables analyzed in this project lack facility identifiers to allow for the separation of these two patterns.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "1.3 Problem Statement",
          "align": "justify",
          "runs": [
            {
              "text": "1.3 Problem Statement",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Health administrators often use unweighted annual averages that mask the underlying case mix, although length of stay is important and is used to measure the operational importance of the service. Comparing a reporting stratum that spans just a few visits to a stratum that covers the entire annual volume of visits for a metropolitan area is not the same and doesn't provide a valid comparison across a range of acuity tiers, disposition categories, or age categories. If there is no consistent framework for measuring throughput, using a population-weighted analytical approach, planners will not be able to distinguish the effect of triage acuity from the effect of inpatient admission on throughput, nor be able to predict future capacity needs. This project constructs that framework from the published aggregate tables from CIHI, and tests a specific set of hypotheses, not just descriptive impressions.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Health administrators often use unweighted annual averages that mask the underlying case mix, although length of stay is important and is used to measure the operational importance of the service. Comparing a reporting stratum that spans just a few visits to a stratum that covers the entire annual volume of visits for a metropolitan area is not the same and doesn't provide a valid comparison across a range of acuity tiers, disposition categories, or age categories. If there is no consistent framework for measuring throughput, using a population-weighted analytical approach, planners will not be able to distinguish the effect of triage acuity from the effect of inpatient admission on throughput, nor be able to predict future capacity needs. This project constructs that framework from the published aggregate tables from CIHI, and tests a specific set of hypotheses, not just descriptive impressions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "1.4 Objectives and Scope",
          "align": "justify",
          "runs": [
            {
              "text": "1.4 Objectives and Scope",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The goals of this work are to quantify the relationship between the acuity of triage and length of stay, isolate the impact of admission on total length of stay, test the ability of a numeric CTAS urgency score to predict length of stay, identify which age groups contribute to length of stay, determine whether there is a meaningful relationship between biological sex and the likelihood of admission, characterize the 19-year trend in demands, generate a 5-year forecast of demands, and build a composite index that accounts for cumulative resource utilization, not just the number of visits.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The goals of this work are to quantify the relationship between the acuity of triage and length of stay, isolate the impact of admission on total length of stay, test the ability of a numeric CTAS urgency score to predict length of stay, identify which age groups contribute to length of stay, determine whether there is a meaningful relationship between biological sex and the likelihood of admission, characterize the 19-year trend in demands, generate a 5-year forecast of demands, and build a composite index that accounts for cumulative resource utilization, not just the number of visits. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The analysis is limited to six CIHI NACRS supplementary tables that included approximately 175.8 million visits across FY 2003–2004 to FY 2021–2022, and does not include individual patient records, hospital-level or geographic identifiers, causal clinical inference, cost or staffing data, which are not included in the source tables. Each of the supplementary tables provides a summary of the stratum level data, not microdata for individual cases, so all of the statistical models in this report are explicitly frequency weighted by number of visits, and any conclusions drawn are made at the system level, not on a per-patient basis.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The analysis is limited to six CIHI NACRS supplementary tables that included approximately 175.8 million visits across FY 2003–2004 to FY 2021–2022, and does not include individual patient records, hospital-level or geographic identifiers, causal clinical inference, cost or staffing data, which are not included in the source tables. Each of the supplementary tables provides a summary of the stratum level data, not microdata for individual cases, so all of the statistical models in this report are explicitly frequency weighted by number of visits, and any conclusions drawn are made at the system level, not on a per-patient basis.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 8,
      "chapter": "Chapter 1",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "1.5 Canonical Hypothesis Registry",
          "align": "justify",
          "runs": [
            {
              "text": "1.5 Canonical Hypothesis Registry",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Before choosing statistical computing methods, five formal hypotheses (Table 1) were pre-registered to assess, so that the results of all the tests that are reported in Chapter 5 were not selected ad hoc after looking at the data.",
          "align": "justify",
          "runs": [
            {
              "text": "Before choosing statistical computing methods, five formal hypotheses (Table 1) were pre-registered to assess, so that the results of all the tests that are reported in Chapter 5 were not selected ad hoc after looking at the data.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "ID",
            "Research Question",
            "Null Hypothesis",
            "Method"
          ],
          "rows": [
            [
              "H1",
              "CTAS acuity tier vs. median LOS",
              "Median LOS equal across all five tiers",
              "Weighted Kruskal–Wallis + Dunn"
            ],
            [
              "H2",
              "Admission status vs. median LOS",
              "Median LOS equal for admitted/non-admitted",
              "Weighted Mann–Whitney U"
            ],
            [
              "H3",
              "CTAS urgency score vs. median LOS",
              "Regression slope β₁ = 0",
              "Weighted Least Squares regression"
            ],
            [
              "H4",
              "Age cohort vs. median LOS",
              "Median LOS equals four cohorts",
              "Weighted Kruskal–Wallis + Dunn"
            ],
            [
              "H5",
              "Sex vs. admission disposition",
              "Sex and disposition are independent",
              "Pearson Chi-Square + Cramér's V"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 9,
      "chapter": "Chapter 2",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 2: Analytics Lifecycle and Project Methodology",
          "align": "center",
          "runs": [
            {
              "text": "Chapter 2: ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Analytics Lifecycle and Project Methodology",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "2.1 A Ten-Stage Analytics Lifecycle",
          "align": "justify",
          "runs": [
            {
              "text": "2.1 A Ten-Stage Analytics Lifecycle",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The project is based on the following ten stages of the analytics lifecycle, which is similar to the one commonly used in the healthcare operations context (Provost & Fawcett, 2013): The phases encompass business and data understanding, ingestion, cleaning, pre-registration of the hypothesis, statistical computation, diagnostic validation, interpretation and governance and reproducibility. Each of the stages is summarized in Table 2 along with the primary activity and the product.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The project is based on the following ten stages of the analytics lifecycle, which is similar to the one commonly used in the healthcare operations context (Provost & Fawcett, 2013): The phases encompass business and data understanding, ingestion, cleaning, pre-registration of the hypothesis, statistical computation, diagnostic validation, interpretation and governance and reproducibility. Each of the stages is ",
              "bold": false,
              "italic": false
            },
            {
              "text": "summarized",
              "bold": false,
              "italic": false
            },
            {
              "text": " in Table 2 along with the primary activity and the product.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Stage",
            "Core Activity",
            "Primary Output"
          ],
          "rows": [
            [
              "1. About Project",
              "Presents the project overview, clinical problem statement, academic framework, and five pre-specified hypotheses.",
              "Project overview, problem statement, and hypothesis framework"
            ],
            [
              "2. Prep & Quality Engine",
              "Performs unit harmonization, deduplication, schema validation, and cohort cleaning.",
              "Cleaned and validated analytical dataset"
            ],
            [
              "3. Dataset Explorer",
              "Enables interactive exploration of cohorts across triage acuity, life-stage groups, and 19 fiscal years.",
              "Interactive cohort and dataset exploration"
            ],
            [
              "4. Hypothesis Testing & Statistics",
              "Evaluates H1–H5 using Kruskal–Wallis, Mann–Whitney U, WLS regression, Dunn post-hoc testing, and ERBI forecasting.",
              "Statistical results, effect sizes, and forecasting outputs"
            ],
            [
              "5. Executive Dashboard",
              "Provides KPI cards, interactive custom visualizations, the H1–H5 visual suite, and operational charts.",
              "Interactive decision-support dashboard"
            ],
            [
              "6. Strategic Insights",
              "Translates analytical findings into an executive decision matrix, policy recommendations, and hospital capacity-planning directives.",
              "Strategic recommendations and decision matrix"
            ],
            [
              "7. Reports & Export",
              "Provides a comprehensive audit trail, methodology documentation, and PDF executive-summary dossier exports.",
              "Audit documentation, methodology reports, and PDF executive summary"
            ]
          ]
        },
        {
          "type": "p",
          "text": "2.2 Why Non-Parametric Methods",
          "align": "justify",
          "runs": [
            {
              "text": "2.2 Why Non-Parametric Methods",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Classical inferential tests, the independent t-test, ordinary least squares regression, and one-way ANOVA, assume normally distributed, homoscedastic residuals (Field, 2018). The distribution of length of stay in the ED is highly right-skewed and the variance in length of stay varies by an order of magnitude from cases handled in the ED that are not urgent, to those that are admitted or critically ill. The size of reporting strata also differs widely, ranging from regional numbers to aggregates up to a million visits for the metros. Because of these considerations, distribution-free rank-based procedures were used, including a frequency-weighted Kruskal–Wallis H-test and Dunn post-hoc comparisons for three-or-more-group comparisons (H1 and H4); a frequency-weighted Mann–Whitney U-test with a rank-biserial correlation for two-group comparisons (H2); weighted least squares regression for H3, correcting for the heteroscedastic variance by weighting each stratum according to the number of visits; and Pearson's chi-square test with a Cramér's V effect size for the categorical association (H5) (Conover, 1999; Tomczak & Tomczak, 2014). Each non-parametric test is embedded in a custom mid-rank algorithm with an explicit frequency weight that is the stratum-level visit count. Then, for a pooled set of strata, a population midrank is assigned to each distinct length-of-stay (LOS) value that is equal to the cumulative weight for the strata that come before it plus half of the weight of the current stratum value, and group rank sums are calculated based on those weighted mid-ranks:",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Classical inferential tests, the independent t-test, ordinary least squares regression, and one-way ANOVA, assume normally distributed, homoscedastic residuals (Field, 2018). The distribution of length of stay in the ED is highly right-skewed and the variance in length of stay varies by an order of magnitude from cases handled in the ED that are not urgent, to those that are admitted or critically ill. The size of reporting strata also differs widely, ranging from regional numbers to aggregates up to a ",
              "bold": false,
              "italic": false
            },
            {
              "text": "million",
              "bold": false,
              "italic": false
            },
            {
              "text": " visits for the metros.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Because of these considerations, distribution-free rank-based procedures were used, including a frequency-weighted Kruskal–Wallis H-test and Dunn post-hoc comparisons for three-or-more-group comparisons (H1 and H4); a frequency-weighted Mann–Whitney U-test with a rank-biserial correlation for two-group comparisons (H2); weighted least squares regression for H3, correcting for the heteroscedastic variance by weighting each stratum according to the number of visits; and Pearson's chi-square test with a Cramér's V effect size for the categorical association (H5) (Conover, 1999; Tomczak & Tomczak, 2014).",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Each non-parametric test is embedded in a custom mid",
              "bold": false,
              "italic": false
            },
            {
              "text": "-",
              "bold": false,
              "italic": false
            },
            {
              "text": "rank algorithm with an explicit frequency weight that is the stratum-level visit count. Then, for a pooled set of strata, a population ",
              "bold": false,
              "italic": false
            },
            {
              "text": "midrank",
              "bold": false,
              "italic": false
            },
            {
              "text": " is assigned to each distinct length-of-stay (LOS) value that is equal to the cumulative weight for the strata that come before it plus half of the weight of the current stratum value, and group rank sums are calculated based on those weighted mid",
              "bold": false,
              "italic": false
            },
            {
              "text": "-",
              "bold": false,
              "italic": false
            },
            {
              "text": "ranks:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "where N is the total weighted sample size, k is the number of groups, Rⱼ is the weighted rank sum for group j, and nⱼ is the total weight of group j. So a stratum of 1.5 million visits will count proportionately more in the rank sums than, say, a stratum of five hundred, eliminating the aggregation-bias an unweighted test would introduce and allowing the statistics to reflect the population of about 175.8 million visits (not the number of rows reporting).",
          "align": "justify",
          "runs": [
            {
              "text": "where N is the total weighted sample size, k is the number of groups, Rⱼ is the weighted rank sum for group j, and nⱼ is the total weight of group j. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "So",
              "bold": false,
              "italic": false
            },
            {
              "text": " a stratum of 1.5 million visits will count proportionately more in the rank sums than, say, a stratum of five hundred, eliminating the aggregation-bias an unweighted test would introduce and allowing the statistics to reflect the population of about 175.8 million visits (not the number of rows reporting).",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 10,
      "chapter": "Chapter 2",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "This weighting choice is a methodological dividend, in that if it were not used, then a five-year total for a rare presenting complaint for a sparse stratum, such as a rural facility, would have the same effect on a rank sum as a large stratum such as a metropolitan facility with more than a million encounters. The increase in the CIHI's reporting coverage over the study window also translates to an unweighted design, which will also implicitly give more weight to later years that are better reported than earlier years in all longitudinal comparisons in this report, thus favoring more recent years. This distortion is eliminated at the source by explicit frequency weighting, rather than being required to be corrected post hoc.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "This weighting choice is a methodological dividend, in that if it were not used, then a five-year total for a rare presenting complaint for a sparse stratum, such as a rural facility, would have the same effect on a rank sum as a large stratum such as a metropolitan facility with more than a million encounters. The increase in the CIHI's reporting coverage over the study window also ",
              "bold": false,
              "italic": false
            },
            {
              "text": "translates to an unweighted design, which will also implicitly give more weight to later years that are better reported than earlier years in all longitudinal comparisons in this report, thus ",
              "bold": false,
              "italic": false
            },
            {
              "text": "favoring",
              "bold": false,
              "italic": false
            },
            {
              "text": " more recent years. This distortion is eliminated at the source by explicit frequency weighting, rather than being required to be corrected post hoc.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "2.3 Protection from the ecological fallacy",
          "align": "justify",
          "runs": [
            {
              "text": "2.3 Protection from the ecological fallacy",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Since CIHI does not report patient information as part of its summary publications, all findings reported in this document reflect system-level performance and are not clinical outcomes. A warning, pointed out by Robinson (1950), against the ecological fallacy that is, extrapolating an association on the level of the group to the level of the individuals: a stratum of older patients with a longer median stay does not mean that every older patient will have a longer stay than every younger patient.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Since CIHI does not report patient information as part of its summary publications, all findings reported in this document reflect system-level performance and are not clinical outcomes. A warning, pointed out by Robinson (1950), against the ecological fallacy",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "that is, extrapolating an association on the level of the group to the level of the individuals: a stratum of older patients with a longer median stay does not mean that every older patient will have a longer stay than every younger patient.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "There are three safeguards which keep the analysis in its appropriate epistemic limits. Firstly, the findings are reported at the cohort or stratum level and not at the individual level. Secondly, statistical models are considered as mere planning and resource allocation tools and not as aids for clinical decisions on any new patient who arrives. Third, each median reported in this report is followed by an interquartile range (IQR) to preserve information about variability within each group instead of obscuring it by merely reporting a point estimate.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "There are three safeguards which keep the analysis ",
              "bold": false,
              "italic": false
            },
            {
              "text": "in",
              "bold": false,
              "italic": false
            },
            {
              "text": " its appropriate epistemic limits. Firstly, the findings are reported at the cohort or stratum level and not at the individual level. Secondly, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "statistical",
              "bold": false,
              "italic": false
            },
            {
              "text": " models are considered as mere planning and resource allocation tools and not as aids for clinical decisions on any ",
              "bold": false,
              "italic": false
            },
            {
              "text": "new",
              "bold": false,
              "italic": false
            },
            {
              "text": " patient who arrives. Third, each median reported in this report is followed by an interquartile range (IQR) to preserve information about variability within each group instead of obscuring it by merely reporting a point estimate.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 11,
      "chapter": "Chapter 3",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 3: Data Collection, Inventory and Preparation",
          "align": "center",
          "runs": [
            {
              "text": "Chapter 3: ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Data Collection, Inventory and Preparation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "3.1 Data Provenance",
          "align": "justify",
          "runs": [
            {
              "text": "3.1 Data Provenance",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The empirical base for this project is a multi-sheet workbook of full-mandate reporting facilities, referred to as the CIHI NACRS Supplementary Data Tables for emergency department visits, 2003–2022, which focuses on emergency department visits in Ontario, Alberta and other reporting jurisdictions (Canadian Institute for Health Information, 2026). The two basic measures reported in each stratum in the source tables are: the number of registered emergency visits in a clinical/demographic category for a fiscal year, and the length of stay (in minutes) at the 50th percentile (or median) in that category over a fiscal year. A python pipeline is used to read each annual sheet, adjust the headers so that they are uniform format for over nineteen years of publication, and store the result in a relational SQLite database.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The empirical base for this project is a multi-sheet workbook of full-mandate reporting facilities, referred to as the CIHI NACRS Supplementary Data Tables for emergency department visits, 2003–2022, which focuses on emergency department visits in Ontario, Alberta and other reporting jurisdictions ",
              "bold": false,
              "italic": false
            },
            {
              "text": "(",
              "bold": true,
              "italic": false
            },
            {
              "text": "Canadian",
              "bold": true,
              "italic": false
            },
            {
              "text": " Institute for Health Information, 2026).",
              "bold": true,
              "italic": false
            },
            {
              "text": " The two basic measures reported in each stratum in the source tables are: the number of registered emergency visits in a clinical/demographic category for a fiscal year, and the length of stay (in minutes) at the 50th percentile (or median) in that category over a fiscal year. A python pipeline is used to read each annual sheet, adjust the headers so that they are uniform ",
              "bold": false,
              "italic": false
            },
            {
              "text": "format for",
              "bold": false,
              "italic": false
            },
            {
              "text": " over nineteen years of publication, and store the result in a relational ",
              "bold": false,
              "italic": false
            },
            {
              "text": "SQLite",
              "bold": false,
              "italic": false
            },
            {
              "text": " database.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "3.2 Database Structure",
          "align": "justify",
          "runs": [
            {
              "text": "3.2 Database Structure",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The final database contains 8,685 aggregate rows, in six tables, corresponding to approximately 175.8 million visits. The grain and scale of each table are summarized below in Table 3.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The final database contains ",
              "bold": false,
              "italic": false
            },
            {
              "text": "8,6",
              "bold": false,
              "italic": false
            },
            {
              "text": "85 aggregate rows, in six tables, corresponding to approximately 175.8 million visits. The grain and scale of each table are summarized below in Table 3.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Table",
            "Observation Grain",
            "Rows",
            "Encounters"
          ],
          "rows": [
            [
              "ed_visits",
              "FY × CTAS × Disposition × Problem",
              "5,586",
              "175,812,409"
            ],
            [
              "ctas_triage",
              "FY × Sex × CTAS × Age Group",
              "912",
              "174,207,395"
            ],
            [
              "visit_disposition",
              "FY × Sex × Disposition × Age Group",
              "936",
              "173,984,112"
            ],
            [
              "age_sex",
              "FY × Sex × Age Group",
              "152",
              "175,812,409"
            ],
            [
              "main_problems",
              "FY × Sex × Main Problem × Age Group",
              "1,063",
              "168,490,215"
            ],
            [
              "demographics",
              "Age Group × Sex (cross-sectional)",
              "36",
              "175,812,409"
            ]
          ]
        },
        {
          "type": "p",
          "text": "3.3 Cleaning and Quality Control",
          "align": "justify",
          "runs": [
            {
              "text": "3.3 Cleaning and Quality Control",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 12,
      "chapter": "Chapter 3",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The various types of data-quality problems had to be dealt with explicitly and documented in an auditable way, and these are covered in Table 4. Every query did not include a summary row, e.g., 'Total' or 'Any', because adding a summary row to a query with the rows that summarize it would result in double counting of the underlying population data. Numeric fields were cast to consistent types, but invalid values were not dropped but were assumed to be equal to zero. Cells suppressed for privacy to protect small counts were kept in the database but not in any denominator, thus eliminating division by zero problems in the weights and privacy violations. Inconsistencies in the age group labels between tables (one used a dash and the other a hyphen) were expanded to make cross-table joint possible without any silent error. Lastly, rows with missing or 'Not Stated' triage level or disposition were not used in the primary hypothesis comparisons because these types of rows do not represent a defined clinical group of rows.",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The various types of data-quality problems had to be dealt with explicitly and documented in an ",
              "bold": false,
              "italic": false
            },
            {
              "text": "auditable",
              "bold": false,
              "italic": false
            },
            {
              "text": " way, and these are covered in Table 4. Every query did not include a summary row, e.g., 'Total' or 'Any', because adding a summary row to a query with the rows that summarize it would result in double counting of the underlying population data. Numeric fields were cast ",
              "bold": false,
              "italic": false
            },
            {
              "text": "to",
              "bold": false,
              "italic": false
            },
            {
              "text": " consistent types, but invalid values were not dropped but were assumed to be equal to zero. Cells suppressed for privacy to protect small counts were kept in the database but not in any denominator, thus eliminating division by zero problems in the weights and privacy violations. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Inconsistencies in the age group labels between tables (one used a",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "dash and the other a hyphen) were expanded to make cross-table ",
              "bold": false,
              "italic": false
            },
            {
              "text": "joint",
              "bold": false,
              "italic": false
            },
            {
              "text": " possible without any silent error. Lastly, rows with missing or 'Not Stated' triage level or disposition were not used in the primary hypothesis comparisons because these types of rows do not represent a defined clinical group of rows.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Issue Identified",
            "Action Taken",
            "Rationale"
          ],
          "rows": [
            [
              "Roll-up rows ('Total', 'Any')",
              "Excluded from every query",
              "Prevents double-counting the population"
            ],
            [
              "Inconsistent header rows",
              "Regex-based fiscal-year parser locates the data start",
              "Reliable parsing across 19 years of formats"
            ],
            [
              "Mixed numeric types",
              "Coerced to int64/float64; invalid values set to zero",
              "Prevents silent computation failures"
            ],
            [
              "Suppressed small counts (n < 5)",
              "Retained in the database; filtered from denominators",
              "Preserves privacy without skewing weights"
            ],
            [
              "Inconsistent age-group encoding",
              "Normalized dash and hyphen variants",
              "Restores referential integrity across joins"
            ],
            [
              "'Unknown' / 'Not Stated' categories",
              "Excluded from H1, H2, and H4 comparisons",
              "Preserves interpretability of pairwise tests"
            ]
          ]
        },
        {
          "type": "p",
          "text": "3.4 Feature Engineering",
          "align": "justify",
          "runs": [
            {
              "text": "3.4 Feature Engineering",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The statistical models are derived from several derived fields. Each year label was converted to an integer for chronological ordering, which was done in the fiscal-year format. Each",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The statistical models are derived from several derived fields. Each year label was converted to an integer for chronological ordering, which was done in the fiscal-year format.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Each",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "year label was converted to an integer, allowing chronological ordering, in the fiscal-year format. For ease in reading, median length of stay was converted from minutes to decimal hours. The bottom three CTAS levels were combined into one for the continuous predictor in the H3 regression, creating an urgency score of one (Resuscitation), two (Emergent), and three (Urgent, Less Urgent, Non-Urgent) which is discussed later as a limitation. For the H4 comparison detailed age groups were combined into four life-stage cohorts: 0-19 years; 20-44 years; 45-64 years; and aged 65 and above. A binary indicator is created for each disposition to designate whether it contains a substring 'admit.'. Finally, an Estimated Resource Burden Index (ERBI) aggregates acuity, visit volume and visit duration to a single per-visit capacity measure weighted by acuity, detailed in Chapter 6.",
          "align": "justify",
          "runs": [
            {
              "text": "year label was converted to an integer, allowing chronological ordering, in the fiscal-year format. For ease in reading, median length of stay was converted from minutes to decimal hours. The bottom three CTAS levels were combined into one for the continuous predictor in the H3 regression, creating an urgency score of one (Resuscitation), two (Emergent), and three (Urgent, Less Urgent, Non-Urgent) which is discussed later as a limitation. For the H4 comparison detailed age groups were combined into four life-stage cohorts: 0-19 years; 20-44 years; 45-64 years; and aged 65 and above. A binary indicator is created for each disposition to designate whether it contains a substring 'admit.'. Finally, an Estimated Resource Burden Index (ERBI) aggregates acuity, visit volume and visit duration to a single per-visit capacity measure weighted by acuity, detailed in Chapter 6.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 13,
      "chapter": "Chapter 3",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "3.5 Data isolation and reproducibility.",
          "align": "justify",
          "runs": [
            {
              "text": "3.5 Data isolation and reproducibility.",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "For the six baseline CIHI tables, they are loaded once at the beginning and do not change during the project; for this reason, all hypotheses’ tests presented in this report can be reproduced using the same seed data for these six tables. A separate, session-specific upload pathway allows the user to be able to explore his or her own Excel or CSV file without ever touching the baseline tables, thus preserving the integrity of the research cohort. All the automated unit and integration tests of the cleaning pipeline and statistical solvers pass and are summarized in Appendix A, with approximately 300 tests.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "For the six baseline CIHI tables, they are loaded once at the beginning and do not change during the project; for this ",
              "bold": false,
              "italic": false
            },
            {
              "text": "reason,",
              "bold": false,
              "italic": false
            },
            {
              "text": " all ",
              "bold": false,
              "italic": false
            },
            {
              "text": "hypotheses’",
              "bold": false,
              "italic": false
            },
            {
              "text": " tests presented in this report can ",
              "bold": false,
              "italic": false
            },
            {
              "text": "be",
              "bold": false,
              "italic": false
            },
            {
              "text": " reproduced using the same seed data for these six tables. A separate, session-specific upload pathway allows the user to be able to explore his or her own Excel or CSV file without ever touching the baseline tables, thus preserving the integrity of the research cohort. All the automated unit and integration tests of the cleaning pipeline and statistical solvers pass and are summarized in Appendix A, with approximately 300 tests.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 14,
      "chapter": "Chapter 4",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 4: Exploratory Data Analysis and Descriptive Profiling",
          "align": "center",
          "runs": [
            {
              "text": "Chapter 4: Exploratory Data Analysis and Descriptive Profiling",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "4.1 Nineteen Years of Volume Growth",
          "align": "justify",
          "runs": [
            {
              "text": "4.1 Nineteen Years of Volume Growth ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Annual visits increased from approximately 4.91 million in FY 2003-2004 to a peak of approximately 15.02 million in FY 2018-2019 (Table 5) before the pandemic hit, which represents over a triple in the number of annual visits within 15 years. Some of this growth is attributable to actual increases in demand and some to the growth in the number of facilities reporting to NACRS, the typical example being the dramatic jump from 5.8 million to 8.2 million visits in FY 2010-2011 which is actually driven by more facilities reporting to NACRS and not necessarily an increase in demand. There was a rise in median length of stay (LOS) as the volume of cases increased, from 2.30 hours in FY 2003-2004 to 3.10 hours in FY 2018-2019, suggesting that the capacity of the system did not rise in line with the volume of cases even before the pandemic. The COVID-19 period saw a transient downturn of 17.8% in FY 2020–2021 with a decrease in low acuity presentations, but a simultaneous increase in the mean length of stay to 3.30 hours due to the increased proportion of severe presentations and infection-control measures. In FY 2021–2022, the median stay was 3.40 hours, representing a 20% plus year-on-year recovery in visits, and the highest median stay on record. The relationship does not appear to be coincidental as the two series are correlated across all eight benchmark years as seen in Table 5: each year with an increase in volume has a corresponding increase in median stay, and each year with a decrease in volume has a corresponding decrease in median stay. When the two series are compared over the eight benchmark years, it can be seen that each year with an increase in volume is accompanied by a corresponding increase in median stay, and each year with a decrease in volume, there is a corresponding decrease in median stay (Table 5), which is consistent with having an increase in the volume of more acute cases, not just congestion.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Annual visits increased from approximately 4.91 million in FY 2003-2004 to a peak of approximately 15.02 million in FY 2018-2019 (Table 5) before the pandemic hit, which represents over a triple in the number of annual visits within 15 years. Some of this growth is attributable to actual increases in demand and some to the growth in the number of facilities reporting to NACRS, the typical example being the dramatic jump from 5.8 million to 8.2 million visits in FY 2010-2011 which is actually driven by more facilities reporting to NACRS and not necessarily an increase in demand. There was a rise in median length of stay (LOS) as the volume of cases increased, from 2.30 hours in FY 2003-2004 to 3.10 hours in FY 2018-2019, suggesting that the capacity of the system did not rise in line with the volume of cases even before the pandemic. The COVID-19 period saw a transient downturn of 17.8% in FY 2020–2021 with a decrease in low acuity presentations, but a simultaneous increase in the mean length of stay to 3.30 hours due to the increased proportion of severe presentations and infection-control measures. In FY 2021–2022, the median stay was 3.40 hours, representing a 20% plus year-on-year recovery in visits, and the highest median stay on record. The relationship does not appear to be coincidental as the two series are correlated across all eight benchmark years as seen in Table 5: each year with an increase in volume has a corresponding increase in median stay, and each year with a decrease in volume has a corresponding decrease in median stay.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "When the two series are compared over the eight benchmark years, it can be seen that each year with an increase in volume is accompanied by a corresponding increase in median stay, and each year with a decrease in volume, there is a corresponding decrease in median stay (Table 5), which is consistent with having an increase in the volume of more acute cases, not just congestion.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Fiscal Year",
            "Total ED Visits",
            "Median LOS (Hours)"
          ],
          "rows": [
            [
              "2003–2004",
              "4,906,394",
              "2.30"
            ],
            [
              "2007–2008",
              "5,680,941",
              "2.53"
            ],
            [
              "2010–2011",
              "8,171,651",
              "2.70"
            ],
            [
              "2013–2014",
              "10,614,350",
              "2.85"
            ],
            [
              "2016–2017",
              "13,290,440",
              "3.00"
            ],
            [
              "2018–2019",
              "15,023,099",
              "3.10"
            ],
            [
              "2020–2021",
              "11,622,444",
              "3.30"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 15,
      "chapter": "Chapter 4",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Fiscal Year",
            "Total ED Visits",
            "Median LOS (Hours)"
          ],
          "rows": [
            [
              "2021–2022",
              "13,992,029",
              "3.40"
            ]
          ]
        },
        {
          "type": "p",
          "text": "4.2 Acuity and Admission Profiles",
          "align": "justify",
          "runs": [
            {
              "text": "4.2 Acuity and Admission Profiles ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Table 6 shows length of stay by the 5 CTAS acuity levels for each of the reporting facilities reporting using the standardized clinical triage instrument (Beveridge et al., 1998). The pattern is not as straightforward as the sickest patients wait longest as is the case with CTAS I: CTAS II patients have a longer median stay of 4.80 hours compared to CTAS I patients (4.60 hours), due to the fact that CTAS I patients are quickly stabilized and transported to an intensive care unit, while CTAS II patients receive comprehensive medical evaluations, imaging, and specialist consultation before a disposition decision is made. The biggest single tier – just over 41% of classified visits – is CTAS III.",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Table 6 shows length of stay by the 5 CTAS acuity levels for each of the reporting facilities reporting using the standardized clinical triage instrument (Beveridge et al., 1998). The pattern is not as straightforward as the sickest patients wait longest as is the case with CTAS I: CTAS II patients have a longer median stay of 4.80 hours compared to CTAS I patients (4.60 hours), due to the fact that CTAS I patients are quickly stabilized and transported to an intensive care unit, while CTAS II patients receive comprehensive medical evaluations, imaging, and specialist consultation before a disposition decision is made. The biggest single tier – just over 41% of classified visits – is CTAS III.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "CTAS Tier",
            "Encounters",
            "% of Volume",
            "Median LOS (Hours)"
          ],
          "rows": [
            [
              "CTAS I — Resuscitation",
              "1,286,555",
              "0.74%",
              "4.60"
            ],
            [
              "CTAS II — Emergent",
              "26,742,361",
              "15.35%",
              "4.80"
            ],
            [
              "CTAS III — Urgent",
              "72,100,128",
              "41.39%",
              "3.40"
            ],
            [
              "CTAS IV — Less Urgent",
              "58,990,020",
              "33.86%",
              "1.90"
            ],
            [
              "CTAS V — Non-Urgent",
              "15,088,331",
              "8.66%",
              "1.33"
            ],
            [
              "Total",
              "174,207,395",
              "100.00%",
              "2.90"
            ]
          ]
        },
        {
          "type": "p",
          "text": "This difference is even more pronounced if visits by final disposition are separated. The weighted median duration for patients admitted to inpatient beds (11.5% of total volume) is 10.60 hours, significantly longer than the weighted median duration for non-admitted visits (2.50 hours) and is responsible for more than a third of all cumulative stretcher time in the emergency-department.",
          "align": "justify",
          "runs": [
            {
              "text": "This difference is even more pronounced if visits by final disposition are separated. The weighted median duration for patients admitted to inpatient beds (11.5% of total volume) is 10.60 hours, significantly longer than the weighted median duration for non-admitted visits (2.50 hours) and is responsible for more than a third of all cumulative stretcher time in the emergency-department.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "4.3 Age and sex",
          "align": "justify",
          "runs": [
            {
              "text": "4.3 Age and sex",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Growth in the proportion of older adults visiting the hospital for surgical care (approximately 21%) is reflected in longer median length of stay (4.17 hours) than any other age group (2.05 hours for pediatric and youth patients), and their inpatient case rate (14.7 per 100,000) is nearly seven times higher than that for pediatric patients (2.2 per 100,000) (Table 7). However, there is a two-minute difference between the duration of male and female encounters, which is not operationally significant alone, but is compared to the admission status of the patient in Hypothesis 5.4.4 Clinical Case Mix.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Growth in the proportion of older adults visiting the hospital for surgical care (approximately 21%) is reflected in longer median length of stay (4.17 hours) than any other age group (2.05 hours for pediatric and youth patients), and their inpatient case rate (14.7 per 100,000) is nearly seven times higher than that for pediatric patients (2.2 per 100,000) (Table 7). However, there is a two-minute difference between the duration of male and female encounters, which is not operationally significant alone, but is compared to the admission status of the patient in Hypothesis 5.4.4 Clinical Case Mix.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 16,
      "chapter": "Chapter 4",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Age Category",
            "Encounters",
            "% of Volume",
            "Median LOS (Hours)",
            "Admission Rate"
          ],
          "rows": [
            [
              "Pediatric / Youth (0–19)",
              "38,908,652",
              "22.13%",
              "2.05",
              "4.2%"
            ],
            [
              "Young Adults (20–44)",
              "57,965,791",
              "32.97%",
              "2.53",
              "6.8%"
            ],
            [
              "Middle Adults (45–64)",
              "41,674,805",
              "23.71%",
              "2.87",
              "14.5%"
            ],
            [
              "Older Adults (65+)",
              "37,213,696",
              "21.17%",
              "4.17",
              "28.6%"
            ]
          ]
        },
        {
          "type": "p",
          "text": "4.4 Clinical Case Mix",
          "align": "justify",
          "runs": [
            {
              "text": "4.4 Clinical Case Mix",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Outline complaints into two general categories. High volume (low acuity) categories – such as minor musculoskeletal injury – resolve quickly (usually less than 2 hours) and often without admission. The second group, chest pain and other cardiac presentations, mental health and substance-use crises, and acute respiratory or septic presentations, is high-acuity, high-duration – with median stays ranging from 4.7 to 5.8 hours – and as a consequence extensive diagnostics were performed, or in the case of mental health presentations, there did not seem to be sufficient downstream psychiatric disposition options. The dual distribution is a motivator for the fast-track and case-mix recommendations presented in Chapter 9.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Outline complaints into two general categories. High volume (low acuity) categories – such as minor musculoskeletal injury – resolve quickly (usually less than 2 hours) and often without admission. The second group, chest pain and other cardiac presentations, mental health and substance-use crises, and acute respiratory or septic presentations, is high-acuity, high-duration – with median stays ranging from 4.7 to 5.8 hours – and as a consequence extensive diagnostics were performed, or in the case of mental health presentations, there did not seem to be sufficient downstream psychiatric disposition options. The dual distribution is a motivator for the fast-track and case-mix recommendations presented in Chapter 9. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Table 8 presents six verified presenting-problem categories that were selected from the main_problems table, sorted by presenting-problem visit volume, and with the weighted mean length of stay in the table. Note. This is a comparison that illustrates why the number of visits alone cannot be used to measure operational burden: Trauma has by far the largest number of visits, and a comparatively short mean stay, while Acute Myocardial Infarction has a much smaller number of visits, but a much longer mean stay. The categories displayed are a verified subset of categories which have been selected to compare high volume and high duration presentations and do not necessarily add up to the total volume reported.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Table 8 presents six verified presenting-problem categories that were selected from the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "main_problems",
              "bold": false,
              "italic": false
            },
            {
              "text": " table, sorted by presenting-problem visit volume, and with the weighted mean length of stay in the table. Note. This is a comparison that illustrates why the number of visits alone cannot be used to measure operational burden: Trauma has by far the largest number of visits, and a comparatively short mean stay, while Acute Myocardial Infarction has a much smaller number of visits, but a much longer mean stay. The categories displayed are a verified subset of categories which have been selected to compare high volume and high duration presentations and do not necessarily add up to the total volume reported.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 17,
      "chapter": "Chapter 4",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Presenting Problem",
            "Aggregate Visits",
            "Weighted Mean LOS (Min / Hours)"
          ],
          "rows": [
            [
              "Trauma",
              "31.50M",
              "131.4 min / 2.19 h"
            ],
            [
              "Unintentional Falls",
              "10.03M",
              "161.1 min / 2.68 h"
            ],
            [
              "Motor Vehicle Collisions",
              "2.73M",
              "150.1 min / 2.50 h"
            ],
            [
              "Pneumonia",
              "1.82M",
              "256.9 min / 4.28 h"
            ],
            [
              "Asthma",
              "1.22M",
              "160.9 min / 2.68 h"
            ],
            [
              "Acute Myocardial Infarction",
              "0.40M",
              "338.2 min / 5.64 h"
            ]
          ]
        },
        {
          "type": "p",
          "text": "CIHI NACRS aggregate data (main_problems table); weighted project analysis.",
          "align": "center",
          "runs": [
            {
              "text": "CIHI NACRS aggregate data (",
              "bold": true,
              "italic": false
            },
            {
              "text": "main_problems",
              "bold": true,
              "italic": false
            },
            {
              "text": " table); weighted project analysis.",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 18,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 5: Statistical Hypothesis Testing and Diagnostic Inference",
          "align": "center",
          "runs": [
            {
              "text": "Chapter 5: ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Statistical Hypothesis Testing and Diagnostic Inference",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.1 Overview of the Hypothesis Testing Framework",
          "align": "justify",
          "runs": [
            {
              "text": "5.1 Overview of the Hypothesis Testing Framework",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In the hypothesis-testing phase, the main relationships found in the exploratory and methodological phases of the project are tested. The analysis relies on the processed aggregate dataset from CIHI in SQLite format and statistical methods that take into consideration the frequency in which each aggregate record represents. Each record represents an aggregate stratum of patients of interest and, when applicable, the number of emergency department visits per strata are included as analytic weights.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "In the hypothesis-testing phase, the main relationships found in the exploratory and methodological phases of the project are tested. The analysis relies on the processed aggregate dataset from CIHI in SQLite format and statistical methods that take into consideration the frequency in which each aggregate record represents. Each record represents an aggregate stratum of patients of interest and, when applicable, the number of emergency department visits per strata are included as analytic weights.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5 hypotheses were tested. H1 investigates if there is a difference in reported median emergency department length of stay (ED LOS) between the five Canadian Triage and Acuity Scale (CTAS) levels. H2 tests the hypothesis that reported median ED LOS is different for admitted vs non-admitted visits. H3 analyzes the predictive relationship of the CTAS level, age group and visit disposition to reported median ED LOS using weighted least squares (WLS) regression. H4 compares reported median ED LOS by large age groups of patients. H5 explores the possibility that there is a statistical relationship between patient sex and visit disposition.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "5 hypotheses were tested. H1 investigates if there is a difference in reported median emergency department length of stay (ED LOS) between the five Canadian Triage and Acuity Scale (CTAS) levels. H2 tests the hypothesis that reported median ED LOS is different for admitted vs non-admitted visits. H3 analyzes the predictive relationship of the CTAS level, age group and visit disposition to reported median ED LOS using weighted least squares (WLS) regression. H4 compares reported median ED LOS by large age groups of patients. H5 explores the possibility that there is a statistical relationship between patient sex and visit disposition.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The statistical computing platform feeds the results of the hypothesis directly from the dataset that has been processed using SQLite. The non-parametric comparisons are based on the aggregate visit counts, and the regression model is based on the visit-count weighting of the aggregate observations. Statistical significance will be measured at α = .05.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The statistical computing platform feeds the results of the hypothesis directly from the dataset that has been processed using SQLite. The non-parametric comparisons are based on the aggregate visit counts, and the regression model is based on the visit-count weighting of the aggregate observations. Statistical significance will be measured at α = .05.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.2 Hypothesis 1: Reported Median ED LOS Across CTAS Triage Levels",
          "align": "justify",
          "runs": [
            {
              "text": "5.2 Hypothesis 1: Reported Median ED LOS Across CTAS Triage Levels",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.2.1 Research Question",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.1 Research Question ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The first hypothesis addresses the following research question:",
          "align": "justify",
          "runs": [
            {
              "text": "The first hypothesis addresses the following research question: ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "“How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?”",
          "align": "justify",
          "runs": [
            {
              "text": "“",
              "bold": false,
              "italic": false
            },
            {
              "text": "How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?",
              "bold": false,
              "italic": false
            },
            {
              "text": "”",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The analysis evaluates all five clinical CTAS acuity tiers:",
          "align": "justify",
          "runs": [
            {
              "text": "The ",
              "bold": false,
              "italic": false
            },
            {
              "text": "analysis evaluates all five clinical CTAS acuity tiers:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS I — Resuscitation",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS I — Resuscitation ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS II — Emergent",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS II — Emergent ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS III — Urgent",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS III — Urgent ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS IV — Less Urgent",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS IV — Less Urgent ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS V — Non-Urgent",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS V — Non-Urgent",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 19,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "5.2.2 Hypothesis",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.2 Hypothesis",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "H₀: Reported median ED LOS is equal across all CTAS triage levels.",
          "align": "justify",
          "runs": [
            {
              "text": "H₀:",
              "bold": true,
              "italic": false
            },
            {
              "text": " Reported median ED LOS is equal across all CTAS triage levels.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "H₁: At least one CTAS level has a different reported median ED LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "H₁:",
              "bold": true,
              "italic": false
            },
            {
              "text": " At least one CTAS level has a different reported median ED LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The significance level is α = .05",
          "align": "justify",
          "runs": [
            {
              "text": "The significance level is",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "α = .05",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.2.3 Statistical Method",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.3 Statistical Method",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The omnibus test used is a weighted Kruskal–Wallis H test because the analysis involves comparing more than two independent groups and the sum of the ED LOS data do not meet the assumptions of conventional parametric tests.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The omnibus test used is a weighted Kruskal–Wallis H test because the analysis involves comparing more than two independent groups and the sum of the ED LOS data do not meet the assumptions of conventional parametric tests.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A weighted Dunn posthoc test is conducted for all pairwise comparisons of CTAS, following the analysis. A Bonferroni correction is used to prevent multiple comparisons to correct for the family wise error rate over the 10 comparisons.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "A weighted Dunn ",
              "bold": false,
              "italic": false
            },
            {
              "text": "posthoc",
              "bold": false,
              "italic": false
            },
            {
              "text": " test is conducted for all pairwise comparisons of CTAS, following the analysis. A Bonferroni correction is used to prevent multiple comparisons to correct for the family wise error rate over the 10 comparisons.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The effect size is reported with the epsilon squared (ε²):",
          "align": "justify",
          "runs": [
            {
              "text": "The effect size is reported with the epsilon squared (ε²):",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "where H is the Kruskal–Wallis statistic, k is number of groups, and N is the weighted sample size.",
          "align": "justify",
          "runs": [
            {
              "text": "where H is the Kruskal–",
              "bold": false,
              "italic": false
            },
            {
              "text": "Wallis",
              "bold": false,
              "italic": false
            },
            {
              "text": " statistic, k is number of groups, and N is the weighted sample size.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "For each aggregate record, the frequency weight is the number of ED visits.",
          "align": "justify",
          "runs": [
            {
              "text": "For each aggregate record, the frequency weight is the number of ED visits.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.2.4 Results",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.4 Results",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Statistic",
            "Result"
          ],
          "rows": [
            [
              "Kruskal–Wallis H",
              "126,319,368.24"
            ],
            [
              "p-value",
              "< 0.0001"
            ],
            [
              "Effect size (ε²)",
              "0.7251"
            ],
            [
              "Significant pairwise comparisons",
              "10 / 10"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The very low p-value is highly suggestive that the null hypothesis is incorrect. The high ε² value (0.7251) suggests that there is a significant difference between the median ED LOS by CTAS level in the overall sample. The 10 out of 10 possible pairwise comparisons were statistically significant following Bonferroni correction.",
          "align": "justify",
          "runs": [
            {
              "text": "The very low p-value is highly suggestive that the null hypothesis is incorrect. The high ε² value (0.7251) suggests that there is a significant difference between the median ED LOS by CTAS level in the overall sample. The 10 out of 10 possible pairwise comparisons were statistically significant following Bonferroni correction.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.2.5 Pairwise Comparison",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.5 Pairwise Comparison",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "CTAS Comparison",
            "Bonferroni-adjusted p-value"
          ],
          "rows": [
            [
              "Resuscitation vs.  Non-Urgent",
              "< 0.0001"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 20,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "CTAS Comparison",
            "Bonferroni-adjusted p-value"
          ],
          "rows": [
            [
              "Emergent vs. Urgent",
              "< 0.0001"
            ],
            [
              "Emergent vs. Less Urgent",
              "< 0.0001"
            ],
            [
              "Emergent vs.  Non-Urgent",
              "< 0.0001"
            ],
            [
              "Urgent vs. Less Urgent",
              "< 0.0001"
            ],
            [
              "Urgent vs.  Non-Urgent",
              "< 0.0001"
            ],
            [
              "Less Urgent vs. Non-Urgent",
              "< 0.0001"
            ],
            [
              "Remaining CTAS pairwise contrasts",
              "< 0.0001"
            ]
          ]
        },
        {
          "type": "p",
          "text": "5.2.6 Reported Median ED LOS by CTAS Level",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.6 Reported Median ED LOS by CTAS Level",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "CTAS Level",
            "Reported Median ED LOS",
            "IQR"
          ],
          "rows": [
            [
              "Resuscitation",
              "3.20 hours",
              "2.0–4.3 hours"
            ],
            [
              "Emergent",
              "3.60 hours",
              "2.9–5.0 hours"
            ],
            [
              "Urgent",
              "3.70 hours",
              "2.7–5.5 hours"
            ],
            [
              "Less Urgent",
              "2.90 hours",
              "2.0–4.5 hours"
            ],
            [
              "Non-Urgent",
              "2.00 hours",
              "1.5–3.5 hours"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The box plot shows that the Urgent CTAS III category has the longest reported median ED LOS (3.70 hours), with the CTAS II Emergent category coming in at 3.60 hours. The least reported median is for CTAS V Non-Urgent at 2.00 hours.",
          "align": "justify",
          "runs": [
            {
              "text": "The box plot shows that the Urgent CTAS III category has the longest reported median ED LOS (3.70 hours), with the CTAS II Emergent category coming in at 3.60 hours. The least reported median is for CTAS V Non-Urgent at 2.00 hours.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.2.7 Interpretation",
          "align": "justify",
          "runs": [
            {
              "text": "5.2.7 Interpretation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The findings show a statistically significant relationship between ED LOS and CTAS acuity. The large ε2 value means that this is not just a statistically significant difference between the two groups caused by a large underlying population and that the grouping variable accounts for a significant amount of the variation in the aggregate comparison. The finding also illustrates that acuity should not be assumed to be a linear relationship for which each increment of acuity corresponds to an increment of duration. The Urgent and Emergent categories have especially high reported median stays while the Non-Urgent category has significantly shorter stays. As such, the null hypothesis is rejected: H₀ is rejected, H₁ is accepted.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The findings show a statistically significant relationship between ED LOS and CTAS acuity. The large ε2 value means that this is not just a statistically significant difference between the two groups caused by a large underlying population and that the grouping variable accounts for a significant amount of the variation in the aggregate comparison. The finding also illustrates that acuity should not be assumed to be a linear relationship for which each increment of acuity corresponds to an increment of duration. The Urgent and Emergent categories have especially high reported ",
              "bold": false,
              "italic": false
            },
            {
              "text": "median",
              "bold": false,
              "italic": false
            },
            {
              "text": " stays while the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Non-Urgent",
              "bold": false,
              "italic": false
            },
            {
              "text": " category has significantly shorter stays. As such, the null hypothesis is rejected: H₀ is rejected, H₁ is accepted.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.3 Hypothesis 2: Reported Median ED LOS for Admitted vs. Non-Admitted Visits",
          "align": "justify",
          "runs": [
            {
              "text": "5.3 Hypothesis 2:",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Reported Median ED LOS for Admitted vs. Non-Admitted Visits",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.3.1 Research Question",
          "align": "justify",
          "runs": [
            {
              "text": "5.3.1 Research Question",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The second hypothesis examines whether inpatient admission status is associated with reported emergency department length of stay.",
          "align": "justify",
          "runs": [
            {
              "text": "The second hypothesis examines whether inpatient admission status is associated with reported emergency department length of stay.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The research question is:",
          "align": "justify",
          "runs": [
            {
              "text": "The research question is:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "“Does reported median emergency department length of stay differ significantly between admitted and non-admitted visits?”",
          "align": "justify",
          "runs": [
            {
              "text": "“Does reported median emergency department length of stay differ significantly between admitted and non-admitted visits?”",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The analysis compares two cohorts:",
          "align": "justify",
          "runs": [
            {
              "text": "The analysis compares two cohorts:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Admitted: visits resulting in inpatient hospital admission.",
          "align": "justify",
          "runs": [
            {
              "text": "Admitted:",
              "bold": true,
              "italic": false
            },
            {
              "text": " visits resulting in inpatient hospital admission. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Non-Admitted: discharged home, transferred, or otherwise departing prior to inpatient admission.",
          "align": "justify",
          "runs": [
            {
              "text": "Non-Admitted:",
              "bold": true,
              "italic": false
            },
            {
              "text": " discharged home, transferred, or otherwise departing prior to inpatient admission. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Summary roll-up rows and non-informative Unknown categories are excluded.",
          "align": "justify",
          "runs": [
            {
              "text": "Summary roll-up rows and non-informative Unknown categories are excluded.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.3.2 Hypotheses",
          "align": "justify",
          "runs": [
            {
              "text": "5.3.2 Hypotheses",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "H₀: The distribution of reported median ED LOS is equal for admitted and non-admitted visits.",
          "align": "justify",
          "runs": [
            {
              "text": "H₀:",
              "bold": true,
              "italic": false
            },
            {
              "text": " The distribution of reported median ED LOS is equal for admitted and non-admitted visits.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "H₁: Reported median ED LOS differs significantly between admitted and non-admitted visits.",
          "align": "justify",
          "runs": [
            {
              "text": "H₁:",
              "bold": true,
              "italic": false
            },
            {
              "text": " Reported median ED LOS differs significantly between admitted and non-admitted visits.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The significance level is α = .05",
          "align": "justify",
          "runs": [
            {
              "text": "The significance level is",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "α = .05",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.3.3 Statistical Method",
          "align": "justify",
          "runs": [
            {
              "text": "5.3.3 Statistical Method",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "A weighted Mann–Whitney U test is used because the analysis compares two independent groups using a non-parametric approach.",
          "align": "justify",
          "runs": [
            {
              "text": "A ",
              "bold": false,
              "italic": false
            },
            {
              "text": "weighted Mann–Whitney U test",
              "bold": true,
              "italic": false
            },
            {
              "text": " is used because the analysis compares two independent groups using a non-parametric approach.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The effect size is reported using rank-biserial correlation (rᵦ):",
          "align": "justify",
          "runs": [
            {
              "text": "The effect size is reported using ",
              "bold": false,
              "italic": false
            },
            {
              "text": "rank-biserial correlation (rᵦ)",
              "bold": true,
              "italic": false
            },
            {
              "text": ":",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.3.4 Results",
          "align": "justify",
          "runs": [
            {
              "text": "5.3.4 Results",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Statistic",
            "Result"
          ],
          "rows": [
            [
              "Mann–Whitney U",
              "2.69 × 10¹²"
            ],
            [
              "p-value, two-sided",
              "< 0.0001"
            ],
            [
              "Rank-biserial correlation (rᵦ)",
              "0.9981"
            ],
            [
              "Reported median difference",
              "6.100 hours"
            ]
          ]
        },
        {
          "type": "p",
          "text": "5.3.5 Reported Median ED LOS",
          "align": "justify",
          "runs": [
            {
              "text": "5.3.5 Reported Median ED LOS",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Visit Disposition",
            "Reported Median ED LOS",
            "IQR"
          ],
          "rows": [
            [
              "Non-Admitted",
              "2.50 hours",
              "1.9–3.8 hours"
            ],
            [
              "Admitted",
              "10.60 hours",
              "4.1–8.3 hours"
            ]
          ]
        },
        {
          "type": "p",
          "text": "5.3.6 Interpretation",
          "align": "justify",
          "runs": [
            {
              "text": "5.3.6 Interpretation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "Within the analysis there is strong evidence that admission status is associated with the reported ED LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Within the analysis there is strong evidence that admission status is associated with the reported ED LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The median ED LOS for patients seen in the ED who are admitted is 10.60 hours vs. 2.50 hours for those who are not admitted. This difference is based on an extremely large rank-biserial correlation of 0.9981.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The median ED LOS for patients seen in the ED who are admitted is 10.60 hours vs. 2.50 hours for those who are not admitted. This difference is based on an extremely large rank-biserial correlation of 0.9981.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 21,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "This discovery suggests that inpatient admissions are an operational dimension of ED throughput that is important when studying EDP. The length of an aggregate record for a patient discharged from an ED with an inpatient admission is significantly longer than for those that don't lead onto an inpatient admission.  The null hypothesis is thus rejected: H₁ is accepted and H₀ is rejected.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "This discovery suggests that inpatient admissions are an operational dimension of ED throughput that is important when studying EDP. The length of an aggregate record for a patient discharged from an ED with an inpatient admission is significantly longer than for those that don't ",
              "bold": false,
              "italic": false
            },
            {
              "text": "lead onto an inpatient admission",
              "bold": false,
              "italic": false
            },
            {
              "text": ".  ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The null hypothesis is thus rejected: H₁ is accepted and H₀ is rejected.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.4 Hypothesis 3: Weighted Least Squares Regression of Reported Median ED LOS",
          "align": "justify",
          "runs": [
            {
              "text": "5.4 Hypothesis 3:",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Weighted Least Squares Regression of Reported Median ED LOS",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.4.1 Research Question",
          "align": "justify",
          "runs": [
            {
              "text": "5.4.1 Research Question",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The third hypothesis moves beyond individual group comparisons and evaluates whether multiple categorical predictors are associated with reported median ED LOS simultaneously.",
          "align": "justify",
          "runs": [
            {
              "text": "The third hypothesis moves beyond individual group comparisons and evaluates whether multiple categorical predictors are associated with reported median ED LOS simultaneously.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The platform defines the research question as:",
          "align": "justify",
          "runs": [
            {
              "text": "The platform defines the research question as:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "“Do CTAS urgency score, age group, and visit disposition significantly predict reported median emergency department length of stay?”",
          "align": "justify",
          "runs": [
            {
              "text": "“Do CTAS urgency score, age group, and visit disposition significantly predict reported median emergency department length of stay?”",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The regression model uses aggregate-level observations and incorporates the number of ED visits represented by each observation as an analytic weight.",
          "align": "justify",
          "runs": [
            {
              "text": "The regression model uses aggregate-level observations and incorporates the number of ED visits represented by each observation as an analytic weight.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.4.2 Regression Method",
          "align": "justify",
          "runs": [
            {
              "text": "5.4.2 Regression Method",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The analysis is based on Weighted Least Squares (WLS) regression at the aggregate level.",
          "align": "justify",
          "runs": [
            {
              "text": "The analysis is based on Weighted Least Squares (WLS) regression at the aggregate level.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The dependent variable is:",
          "align": "justify",
          "runs": [
            {
              "text": "The dependent variable is:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Aggregate group visit-weighted reported mean median ED LOS (Hours)",
          "align": "justify",
          "runs": [
            {
              "text": "Aggregate group visit-weighted reported mean median ED LOS (Hours)",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The predictors are encoded categorically. The platform defines the reference groups as follows:",
          "align": "justify",
          "runs": [
            {
              "text": "The predictors are encoded categorically. The platform defines the reference groups as follows:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Age: Reference Cohort",
          "align": "justify",
          "runs": [
            {
              "text": "Age: Reference Cohort",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS: CTAS I — Resuscitation",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS: CTAS I — Resuscitation",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Disposition: Admitted",
          "align": "justify",
          "runs": [
            {
              "text": "Disposition: Admitted",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The model has a total of 9 predictors encoded into 10 observations.",
          "align": "justify",
          "runs": [
            {
              "text": "The model has a total of 9 predictors encoded into 10 observations.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The platform shows you that the coefficient of determination is: Adjusted R-square – 0.8837",
          "align": "justify",
          "runs": [
            {
              "text": "The platform shows you that the coefficient of determination is:",
              "bold": false,
              "italic": false
            },
            {
              "text": " Adjusted R-square – 0.8837",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.4.3 Regression Results",
          "align": "justify",
          "runs": [
            {
              "text": "5.4.3 ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Regression ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Results",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Predictor",
            "B (Hours)",
            "SE",
            "95% CI Low",
            "95% CI High",
            "p-value"
          ],
          "rows": [
            [
              "CTAS: CTAS II – Emergent",
              "2.184",
              "0.202",
              "1.789",
              "2.579",
              "< 0.0001"
            ],
            [
              "CTAS: CTAS III – Urgent",
              "1.660",
              "0.196",
              "1.276",
              "2.044",
              "< 0.0001"
            ],
            [
              "CTAS: Less Urgent",
              "1.030",
              "0.197",
              "0.644",
              "1.415",
              "< 0.0001"
            ],
            [
              "CTAS: Non-Urgent",
              "0.680",
              "0.213",
              "0.262",
              "1.098",
              "0.0014"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 22,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Predictor",
            "B (Hours)",
            "SE",
            "95% CI Low",
            "95% CI High",
            "p-value"
          ],
          "rows": [
            [
              "Disposition: Death",
              "−5.251",
              "0.836",
              "−6.889",
              "−3.613",
              "< 0.0001"
            ],
            [
              "Disposition: Discharged Home",
              "−5.326",
              "0.088",
              "−5.498",
              "−5.154",
              "< 0.0001"
            ],
            [
              "Disposition: Intra-Facility Transfer",
              "−4.700",
              "0.433",
              "−5.548",
              "−3.853",
              "< 0.0001"
            ],
            [
              "Disposition: Not Seen  Or  Left",
              "−5.371",
              "0.157",
              "−5.678",
              "−5.064",
              "< 0.0001"
            ],
            [
              "Disposition: Transferred",
              "−3.892",
              "0.173",
              "−4.231",
              "−3.553",
              "< 0.0001"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The intercept reported by the platform is β₀ = 6.177 hours",
          "align": "justify",
          "runs": [
            {
              "text": "The intercept reported by the platform is",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "β₀ = 6.177 hours",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The model's adjusted R² is 0.8837",
          "align": "justify",
          "runs": [
            {
              "text": "The model's adjusted R² is",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "0.8837",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.4.4 Interpretation of CTAS Coefficients",
          "align": "justify",
          "runs": [
            {
              "text": "5.4.4 Interpretation of CTAS Coefficients",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "With CTAS I : Resuscitation as the reference group, the estimated coefficients for the other CTAS groups are all positive.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "With CTAS ",
              "bold": false,
              "italic": false
            },
            {
              "text": "I ",
              "bold": false,
              "italic": false
            },
            {
              "text": ":",
              "bold": false,
              "italic": false
            },
            {
              "text": " Resuscitation as the reference group, the estimated coefficients for the other CTAS groups are all positive.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The example of CTAS II (Emergent) is +2.184 hours with 95% CI (1.789, 2.579) hours and p<0.0001.",
          "align": "justify",
          "runs": [
            {
              "text": "The example of CTAS II (Emergent) is +2.184 hours with 95% CI (1.789, 2.579) hours and p<0.0001.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Similarly:",
          "align": "justify",
          "runs": [
            {
              "text": "Similarly:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS III — Urgent: +1.660 hours",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS III — Urgent: +1.660 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS IV — Less Urgent: +1.030 hours",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS IV — Less Urgent: +1.030 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS V — Non-Urgent: +0.680 hours",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS V — Non-Urgent: +0.680 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "All the CTAS coefficients have significant p value.",
          "align": "justify",
          "runs": [
            {
              "text": "All the CTAS coefficients have ",
              "bold": false,
              "italic": false
            },
            {
              "text": "significant",
              "bold": false,
              "italic": false
            },
            {
              "text": " p value.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The results here show that the various values of the CTAS categories differ significantly from each other for their reported median ED LOS values, within the fitted aggregate model, and relative to the CTAS I reference category.",
          "align": "justify",
          "runs": [
            {
              "text": "The results here show that the various values of the CTAS categories differ significantly from each other for their reported median ED LOS values, within the fitted aggregate model, and relative to the CTAS I reference category.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Discuss how the word \"disposition\" is interpreted in relation to the meaning of coefficients.",
          "align": "justify",
          "runs": [
            {
              "text": "Discuss how the word \"disposition\" is interpreted in relation to the meaning of coefficients.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The disposition coefficients are negative because Admitted is the reference disposition.",
          "align": "justify",
          "runs": [
            {
              "text": "The disposition coefficients are negative because Admitted is the reference disposition.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The following categories have a lower predicted reported median ED LOS when compared to admitted visits:",
          "align": "justify",
          "runs": [
            {
              "text": "The following categories have a lower predicted reported median ED LOS when compared to admitted visits:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Death: −5.251 hours",
          "align": "justify",
          "runs": [
            {
              "text": "Death: −5.251 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 23,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Discharged Home: −5.326 hours",
          "align": "justify",
          "runs": [
            {
              "text": "Discharged Home: −5.326 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Intra-Facility Transfer: −4.700 hours",
          "align": "justify",
          "runs": [
            {
              "text": "Intra-Facility Transfer: −4.700 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Not seen Or left, −5.371 hours",
          "align": "justify",
          "runs": [
            {
              "text": "Not seen ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Or",
              "bold": false,
              "italic": false
            },
            {
              "text": " left, −5.371 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Transferred: −3.892 hours",
          "align": "justify",
          "runs": [
            {
              "text": "Transferred: −3.892 hours",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The p-value for all disposition coefficients is < 0.0001.",
          "align": "justify",
          "runs": [
            {
              "text": "The p-value for all disposition coefficients is < 0.0001.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Results confirm the main difference found in H2 between those who were admitted and non-admitted patients: admission status is significantly related to ED stay duration.",
          "align": "justify",
          "runs": [
            {
              "text": "Results confirm the main difference found in H2 between those who were admitted and non",
              "bold": false,
              "italic": false
            },
            {
              "text": "-",
              "bold": false,
              "italic": false
            },
            {
              "text": "admitted patients: admission status is significantly related to ED stay duration.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.4.6 Model Interpretation",
          "align": "justify",
          "runs": [
            {
              "text": "5.4.6 Model Interpretation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The adjusted R², which is 0.8837, suggests that the fitted model can account for a significant amount of the variance in the outcome at the aggregate level.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The adjusted R², which is 0.8837, suggests that the fitted model ",
              "bold": false,
              "italic": false
            },
            {
              "text": "can",
              "bold": false,
              "italic": false
            },
            {
              "text": " account for a significant amount of the variance in the outcome at the aggregate level.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "But the platform is very clear about the interpretation unit being:",
          "align": "justify",
          "runs": [
            {
              "text": "But the platform is very clear about the interpretation unit being:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Only aggregate strata records are captured and not inferences from individuals.",
          "align": "justify",
          "runs": [
            {
              "text": "Only aggregate strata records are captured and not inferences from individuals.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The regression coefficients are therefore to be interpreted as relationships within the sum of the reporting structure, not as estimates of the patient-level effect.",
          "align": "justify",
          "runs": [
            {
              "text": "The regression coefficients are therefore to be interpreted as relationships within the sum of the reporting structure, not as estimates of the patient-level effect.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The model is evidence that at the aggregate level, CTAS category and visit disposition are important predictors of reported median ED LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "The model is evidence that at the aggregate level, CTAS category and visit disposition are important predictors of reported median ED LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 24,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "5.5 Hypothesis 4: Reported Median ED LOS Across Broad Patient Age Categories",
          "align": "justify",
          "runs": [
            {
              "text": "5.5",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Hypothesis 4: Reported Median ED LOS Across Broad Patient Age Categories",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.1 Research Question",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.1 Research Question",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The fourth hypothesis evaluates whether reported median ED LOS differs across broad demographic age categories.",
          "align": "justify",
          "runs": [
            {
              "text": "The fourth hypothesis evaluates whether reported median ED LOS differs across broad demographic age categories.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The research question is:",
          "align": "justify",
          "runs": [
            {
              "text": "The research question is:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "“Does reported median emergency department length of stay differ significantly across broad demographic age categories?”",
          "align": "justify",
          "runs": [
            {
              "text": "“Does reported median emergency department length of stay differ significantly across broad demographic age categories?”",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The platform compares four cohorts:",
          "align": "justify",
          "runs": [
            {
              "text": "The platform compares four cohorts:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Pediatric & Youth: 0–19",
          "align": "justify",
          "runs": [
            {
              "text": "Pediatric & Youth: 0–19 ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Young Adult: 20–44",
          "align": "justify",
          "runs": [
            {
              "text": "Young Adult: 20–44 ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Middle Adult: 45–64",
          "align": "justify",
          "runs": [
            {
              "text": "Middle Adult: 45–64 ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Older Adult: 65+",
          "align": "justify",
          "runs": [
            {
              "text": "Older Adult: 65+ ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Summary roll-up rows and unclassified Unknown records are excluded.",
          "align": "justify",
          "runs": [
            {
              "text": "Summary roll-up rows and unclassified Unknown records are excluded.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.2 Hypotheses",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.2 Hypotheses",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "H₀: Reported median ED LOS is equal across all broad age categories.",
          "align": "justify",
          "runs": [
            {
              "text": "H₀:",
              "bold": true,
              "italic": false
            },
            {
              "text": " Reported median ED LOS is equal across all broad age categories.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "H₁: At least one age category has a different reported median ED LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "H₁:",
              "bold": true,
              "italic": false
            },
            {
              "text": " At least one age category has a different reported median ED LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The significance level is α = .05",
          "align": "justify",
          "runs": [
            {
              "text": "The significance level is",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "α = .05",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.3 Statistical Method",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.3 Statistical Method",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "A weighted Kruskal–Wallis H-test is used to evaluate differences across the four age categories.",
          "align": "justify",
          "runs": [
            {
              "text": "A weighted Kruskal–Wallis H-test is used to evaluate differences across the four age categories.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The omnibus test is followed by a weighted Dunn post-hoc test with Bonferroni adjustment.",
          "align": "justify",
          "runs": [
            {
              "text": "The omnibus test is followed by a weighted Dunn post-hoc test with Bonferroni adjustment.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The effect size is epsilon squared:",
          "align": "justify",
          "runs": [
            {
              "text": "The effect size is epsilon squared: ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The number of ED visits represented by each aggregate record is used as the frequency weight.",
          "align": "justify",
          "runs": [
            {
              "text": "The number of ED visits represented by each aggregate record is used as the frequency weight.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.4 Results",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.4 Results",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Statistic",
            "Result"
          ],
          "rows": [
            [
              "Kruskal–Wallis H",
              "126,863,835.837"
            ],
            [
              "p-value",
              "< 0.0001"
            ],
            [
              "Effect size (ε²)",
              "0.7218"
            ],
            [
              "Significant pairwise comparisons",
              "6 / 6"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 25,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The very small p-value indicates a statistically significant difference in reported median ED LOS among the age cohorts.",
          "align": "justify",
          "runs": [
            {
              "text": "The very small p-value indicates a statistically significant difference in reported median ED LOS among the age cohorts.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The epsilon-squared value of 0.7218 indicates a large effect.",
          "align": "justify",
          "runs": [
            {
              "text": "The epsilon-squared value of ",
              "bold": false,
              "italic": false
            },
            {
              "text": "0.7218",
              "bold": true,
              "italic": false
            },
            {
              "text": " indicates a large effect.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.5 Pairwise Comparison",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.5 Pairwise Comparison",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Age Comparison",
            "Bonferroni-adjusted p-value"
          ],
          "rows": [
            [
              "Pediatric & Youth vs. Young Adult",
              "< 0.0001"
            ],
            [
              "Pediatric & Youth vs. Middle Adult",
              "< 0.0001"
            ],
            [
              "Pediatric & Youth vs. Older Adult",
              "< 0.0001"
            ],
            [
              "Young Adult vs. Middle Adult",
              "< 0.0001"
            ],
            [
              "Young Adult vs. Older Adult",
              "< 0.0001"
            ],
            [
              "Middle Adult vs. Older Adult",
              "< 0.0001"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Therefore, every broad age category differs significantly from every other category in the aggregate analysis.",
          "align": "justify",
          "runs": [
            {
              "text": "Therefore, every broad age category differs significantly from every other category in the aggregate analysis.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.6 Reported Median ED LOS by Age Category",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.6 Reported Median ED LOS by Age Category",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Age Category",
            "Reported Median ED LOS",
            "IQR"
          ],
          "rows": [
            [
              "Pediatric & Youth",
              "2.05 hours",
              "1.9–2.1 hours"
            ],
            [
              "Young Adult",
              "2.47 hours",
              "2.3–2.7 hours"
            ],
            [
              "Middle Adult",
              "2.73 hours",
              "2.6–3.0 hours"
            ],
            [
              "Older Adult",
              "4.17 hours",
              "3.7–4.2 hours"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 26,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The box plot of the platform shows that there is a clear trend of increasing from younger to older age groups.",
          "align": "justify",
          "runs": [
            {
              "text": "The box plot of the platform shows that there is a clear trend of increasing from younger to older age groups.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The median ED LOS for Older Adult is 4.17 hours and the median ED LOS for Pediatric & Youth is 2.05 hours.",
          "align": "justify",
          "runs": [
            {
              "text": "The median ED LOS for Older Adult is 4.17 hours and the median ED LOS for Pediatric & Youth is 2.05 hours.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.5.7 Interpretation",
          "align": "justify",
          "runs": [
            {
              "text": "5.5.7 Interpretation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The findings suggest a significant relationship between overall age range of patients and the reported median ED LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The findings suggest a significant relationship between overall age range of patients and the reported median ED LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The gap is particularly stark for older people. The Pediatric & Youth cohort reported a median ED LOS of 2.05 hours compared to a reported median of 4.17 hours in the Older Adult cohort.",
          "align": "justify",
          "runs": [
            {
              "text": "The gap is particularly stark for older people. The Pediatric & Youth cohort reported a median ED LOS of 2.05 hours compared to a reported median of 4.17 hours in the Older Adult cohort.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "All 6 comparisons are significant, and the epsilon-squared effect size is 0.7218; within this aggregate analytical framework, the age-group relationship is, not only statistically significant, but also large.",
          "align": "justify",
          "runs": [
            {
              "text": "All 6 comparisons are significant, and the epsilon-squared effect size is 0.7218; within this aggregate analytical framework, the age-group relationship is, not only statistically significant, but also large.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Therefore: H₀ is not accepted and H₁ is accepted.",
          "align": "justify",
          "runs": [
            {
              "text": "Therefore:",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "H₀ is not accepted and H₁ is accepted.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.6 Hypothesis 5: Patient Sex and ED Visit Disposition Association",
          "align": "justify",
          "runs": [
            {
              "text": "5.6 Hypothesis 5:",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Patient Sex and ED Visit Disposition Association",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.6.1 Research Question",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.1 Research Question",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The fifth hypothesis examines whether patient sex is statistically associated with emergency department visit disposition.",
          "align": "justify",
          "runs": [
            {
              "text": "The fifth hypothesis examines whether patient sex is statistically associated with emergency department visit disposition.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The research question is:",
          "align": "justify",
          "runs": [
            {
              "text": "The research question is:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "“Is there a statistically significant association between patient sex and visit disposition (admitted vs. non-admitted) in Canadian NACRS aggregate data?”",
          "align": "justify",
          "runs": [
            {
              "text": "“Is there a statistically significant association between patient sex and visit disposition (admitted vs. non-admitted) in Canadian NACRS aggregate data?”",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The analysis uses a 2 × 2 contingency table:",
          "align": "justify",
          "runs": [
            {
              "text": "The analysis uses a 2 × 2 contingency table:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Rows: Female, Male",
          "align": "justify",
          "runs": [
            {
              "text": "Rows: Female, Male ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Columns: Non-Admitted, Admitted",
          "align": "justify",
          "runs": [
            {
              "text": "Columns: Non-Admitted, Admitted ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The total aggregate visits analyzed are:",
          "align": "justify",
          "runs": [
            {
              "text": "The total aggregate visits analyzed are:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "175,762,944",
          "align": "justify",
          "runs": [
            {
              "text": "175,762,944",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Summary rows and unclassified categories are excluded.",
          "align": "justify",
          "runs": [
            {
              "text": "Summary rows and unclassified categories are excluded.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.6.2 Hypotheses",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.2 Hypotheses",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "H₀: Patient sex and visit disposition are statistically independent.",
          "align": "justify",
          "runs": [
            {
              "text": "H₀:",
              "bold": true,
              "italic": false
            },
            {
              "text": " Patient sex and visit disposition are statistically independent.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "H₁: Patient sex and visit disposition are statistically associated.",
          "align": "justify",
          "runs": [
            {
              "text": "H₁:",
              "bold": true,
              "italic": false
            },
            {
              "text": " Patient sex and visit disposition are statistically associated.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The significance level is α = .05",
          "align": "justify",
          "runs": [
            {
              "text": "The significance level is",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "α = .05",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 27,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "5.6.3 Statistical Method",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.3 Statistical Method",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "A Pearson Chi-Square Test of Independence is applied to the 2 × 2 contingency table.",
          "align": "justify",
          "runs": [
            {
              "text": "A ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Pearson Chi-Square Test of Independence",
              "bold": true,
              "italic": false
            },
            {
              "text": " is applied to the 2 × 2 contingency table.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The effect size is measured using Cramér's V:",
          "align": "justify",
          "runs": [
            {
              "text": "The effect size is measured using ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Cramér's V",
              "bold": true,
              "italic": false
            },
            {
              "text": ": ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "where χ² is the chi-square statistic, N is the total sample size, and r and c represent the number of rows and columns.",
          "align": "justify",
          "runs": [
            {
              "text": "where χ² is the chi-square statistic, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "N",
              "bold": false,
              "italic": true
            },
            {
              "text": " is the total sample size, and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "r",
              "bold": false,
              "italic": true
            },
            {
              "text": " and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "c",
              "bold": false,
              "italic": true
            },
            {
              "text": " represent the number of rows and columns.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.6.4 Results",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.4 Results ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "table",
          "headers": [
            "Statistic",
            "Result"
          ],
          "rows": [
            [
              "Chi-square (χ²)",
              "18,164.97"
            ],
            [
              "Degrees of freedom",
              "1"
            ],
            [
              "p-value",
              "< 0.0001"
            ],
            [
              "Cramér's V",
              "0.0102"
            ]
          ]
        },
        {
          "type": "p",
          "text": "5.6.5: observed Contingency Table",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.5: observed Contingency Table",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Patient Sex",
            "Non-Admitted",
            "Admitted",
            "Sex Total"
          ],
          "rows": [
            [
              "Female",
              "81,930,996",
              "9,048,750",
              "90,979,746"
            ],
            [
              "Male",
              "75,827,728",
              "8,955,470",
              "84,783,198"
            ],
            [
              "Total",
              "157,758,724",
              "18,004,220",
              "175,762,944"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The platform reports the following proportions:",
          "align": "justify",
          "runs": [
            {
              "text": "The platform reports the following proportions:",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Female",
          "align": "justify",
          "runs": [
            {
              "text": "Female",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Non-admitted: 90.05%",
          "align": "justify",
          "runs": [
            {
              "text": "Non-admitted: 90.05% ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Admitted: 9.95%",
          "align": "justify",
          "runs": [
            {
              "text": "Admitted: 9.95% ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 28,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Male",
          "align": "justify",
          "runs": [
            {
              "text": "Male",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Non-admitted: 89.44%",
          "align": "justify",
          "runs": [
            {
              "text": "Non-admitted: 89.44% ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Admitted: 10.56%",
          "align": "justify",
          "runs": [
            {
              "text": "Admitted: 10.56% ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Thus, the difference in admission proportions is small despite the very large chi-square statistics.",
          "align": "justify",
          "runs": [
            {
              "text": "Thus, the difference in admission proportions is small despite the very large chi-square statistics.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.6.6 Interpretation",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.6 Interpretation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The statistical test rejects the null hypothesis of complete independence because the p-value is below 0.0001.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The statistical test rejects the null hypothesis of complete independence because the p-value is below 0.0001.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "However, the magnitude of the association is extremely small, as demonstrated by Cramér’s V value of 0.0102.",
          "align": "justify",
          "runs": [
            {
              "text": "However, the magnitude of the association is extremely small, as demonstrated by Cramér’s V value of 0.0102.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This distinction is important because the dataset contains a very large number of ED visits. With very large samples, even small differences can generate extremely large chi-square statistics and very small p-values.",
          "align": "justify",
          "runs": [
            {
              "text": "This distinction is important because the dataset contains a very large number of ED visits. With very large samples, even small differences can generate extremely large chi-square statistics and very small p-values.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The practical implication is therefore different from the statistical conclusion. Although sex and disposition are statistically associated in the aggregate dataset, the strength of that relationship is too small to represent a meaningful operational driver of emergency department flow.",
          "align": "justify",
          "runs": [
            {
              "text": "The practical implication is therefore different from the statistical conclusion. Although sex and disposition are statistically associated in the aggregate dataset, the strength of that relationship is too small to represent a meaningful operational driver of emergency department flow.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Consequently:",
          "align": "justify",
          "runs": [
            {
              "text": "Consequently:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "H₀ is rejected statistically, but the association has negligible practical significance.",
          "align": "justify",
          "runs": [
            {
              "text": "H₀ is rejected statistically, but the association has negligible practical significance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Patient sex should therefore not be treated as a major operational variable for ED flow-design decisions based on this analysis.",
          "align": "justify",
          "runs": [
            {
              "text": "Patient sex should therefore not be treated as a major operational variable for ED flow-design decisions based on this analysis.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.6.7 Comparative Synthesis of Hypothesis Results",
          "align": "justify",
          "runs": [
            {
              "text": "5.6.7 Comparative Synthesis of Hypothesis Results ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": true
        },
        {
          "type": "p",
          "text": "The five hypothesis tests collectively identify several important relationships within the aggregate CIHI NACRS dataset.",
          "align": "justify",
          "runs": [
            {
              "text": "The five hypothesis tests collectively identify several important relationships within the aggregate CIHI NACRS dataset.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Hypothesis",
            "Statistical Test",
            "Main Result",
            "Effect Size",
            "Interpretation"
          ],
          "rows": [
            [
              "H1",
              "Weighted Kruskal–Wallis + Dunn",
              "H = 126,319,368.24, p < .0001",
              "ε² = 0.7251",
              "Large CTAS-related difference"
            ],
            [
              "H2",
              "Weighted Mann–Whitney U",
              "U = 1.125 × 10¹², p < .0001",
              "rᵦ = 0.9981",
              "Very strong admission-related difference"
            ],
            [
              "H3",
              "Weighted Least Squares",
              "Adjusted R² = 0.8837",
              "—",
              "Strong aggregate model fit"
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 29,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Hypothesis",
            "Statistical Test",
            "Main Result",
            "Effect Size",
            "Interpretation"
          ],
          "rows": [
            [
              "H4",
              "Weighted Kruskal–Wallis + Dunn",
              "H = 126,863,835.837, p < .0001",
              "ε² = 0.7218",
              "Large age-related difference"
            ],
            [
              "H5",
              "Pearson Chi-Square",
              "χ² = 18,164.97, p < .0001",
              "V = 0.0102",
              "Statistically significant but negligible association"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Three findings stand out.",
          "align": "justify",
          "runs": [
            {
              "text": "Three findings stand out.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "First, CTAS category is strongly associated with reported ED LOS. The H1 analysis produces an epsilon-squared value of 0.7251, with every pairwise CTAS comparison reaching statistical significance.",
          "align": "justify",
          "runs": [
            {
              "text": "First, CTAS category is strongly associated with reported ED LOS. The H1 analysis produces an epsilon-squared value of 0.7251, with every pairwise CTAS comparison reaching statistical significance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Second, visit disposition produces one of the clearest differences in reported ED LOS. The admitted cohort has a median of 10.60 hours compared with 2.50 hours for the non-admitted cohort, accompanied by a rank-biserial correlation of 0.9981.",
          "align": "justify",
          "runs": [
            {
              "text": "Second, visit disposition produces one of the clearest differences in reported ED LOS. The admitted cohort has a median of 10.60 hours compared with 2.50 hours for the non-admitted cohort, accompanied by a rank-biserial correlation of 0.9981.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Third, age category has a substantial relationship with reported ED LOS. Older adults have the highest reported median at 4.17 hours, compared with 2.05 hours for the Pediatric & Youth cohort, and all six age-group comparisons are statistically significant.",
          "align": "justify",
          "runs": [
            {
              "text": "Third, age category has a substantial relationship with reported ED LOS. Older adults have the highest reported median at 4.17 hours, compared with 2.05 hours for the Pediatric & Youth cohort, and all six age-group comparisons are statistically significant.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In contrast, the H5 results illustrate why statistical significance must be interpreted together with effect size. The sex-disposition relationship is statistically significant because of the very large sample, but the Cramér's V value of 0.0102 indicates a negligible association.",
          "align": "justify",
          "runs": [
            {
              "text": "In contrast, the H5 results illustrate why statistical significance must be interpreted together with effect size. The sex-disposition relationship is statistically significant because of the very large sample, but the Cramér's V value of 0.0102 indicates a negligible association.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.7 Statistical and Operational Implications",
          "align": "justify",
          "runs": [
            {
              "text": "5.",
              "bold": true,
              "italic": false
            },
            {
              "text": "7",
              "bold": true,
              "italic": false
            },
            {
              "text": " Statistical and Operational Implications",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The combined hypothesis results provide an evidence base for prioritizing operational interventions.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The combined hypothesis results provide an evidence base for prioritizing operational interventions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The first major signal is acuity-related variation. The substantial differences among CTAS categories suggest that emergency departments should not evaluate throughput using a single overall LOS statistic alone. Different acuity groups experience materially different reported durations.",
          "align": "justify",
          "runs": [
            {
              "text": "The first major signal is acuity-related variation. The substantial differences among CTAS categories suggest that emergency departments should not evaluate throughput using a single overall LOS statistic alone. Different acuity groups experience materially different reported durations.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The second and particularly strong signal is visiting disposition. The large difference between admitted and non-admitted visits demonstrates that admission status is closely associated with emergency department duration. This provides an important analytical basis for examining inpatient capacity and patient-flow processes alongside emergency department operations.",
          "align": "justify",
          "runs": [
            {
              "text": "The second and particularly strong signal is visiting disposition. The large difference between admitted and non-admitted visits demonstrates that admission status is closely associated with emergency department duration. This provides an important analytical basis for examining inpatient capacity and patient-flow processes alongside emergency department operations.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 30,
      "chapter": "Chapter 5",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The third major signal is age-related variation. The substantially higher reported median for older adults suggests that demographic composition is relevant when planning emergency department capacity and patient-flow resources.",
          "align": "justify",
          "runs": [
            {
              "text": "The third major signal is age-related variation. The substantially higher reported median for older adults suggests that demographic composition is relevant when planning emergency department capacity and patient-flow resources.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Finally, sex should not be prioritized as an operational flow variable. Although the chi-square test is statistically significant, the negligible Cramér's V demonstrates that statistical significance alone does not establish operational importance.",
          "align": "justify",
          "runs": [
            {
              "text": "Finally, sex should not be prioritized as an operational flow variable. Although the chi-square test is statistically significant, the negligible Cramér's V demonstrates that statistical significance alone does not establish operational importance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "5.8 Conclusion",
          "align": "justify",
          "runs": [
            {
              "text": "5.",
              "bold": true,
              "italic": false
            },
            {
              "text": "8",
              "bold": true,
              "italic": false
            },
            {
              "text": " Conclusion",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The hypothesis-testing stage provides statistical evidence for several important relationships in Canadian emergency department aggregate data.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The hypothesis-testing stage provides statistical evidence for several important relationships in Canadian emergency department aggregate data.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "H1 demonstrates significant and large differences in reported median ED LOS across CTAS triage categories. H2 identifies a particularly strong difference between admitted and non-admitted visits. H3 demonstrates that CTAS and visit disposition contribute substantially to explaining variation in aggregate reported median ED LOS within the WLS model. H4 establishes significant and large differences across broad patient age categories, with older adults showing the longest reported median stay. H5 identifies a statistically significant association between patient sex and disposition, but its negligible effect size indicates little practical operational relevance.",
          "align": "justify",
          "runs": [
            {
              "text": "H1 demonstrates significant and large differences in reported median ED LOS across CTAS triage categories. H2 identifies a particularly strong difference between admitted and non-admitted visits. H3 demonstrates that CTAS and visit disposition contribute substantially to explaining variation in aggregate reported median ED LOS within the WLS model. H4 establishes significant and large differences across broad patient age categories, with older adults showing the longest reported median stay. H5 identifies a statistically significant association between patient sex and disposition, but its negligible effect size indicates little practical operational relevance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Overall, the findings suggest that clinical acuity, admission disposition, and patient age are substantially more important analytical dimensions for understanding emergency department throughput than patient sex.",
          "align": "justify",
          "runs": [
            {
              "text": "Overall, the findings suggest that clinical acuity, admission disposition, and patient age are substantially more important analytical dimensions for understanding emergency department throughput than patient sex.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Because the analysis is based on aggregate CIHI NACRS reporting strata rather than individual patient records, these findings are interpreted at the aggregate system level. The statistical results should therefore support capacity planning, operational analysis, and decision support rather than individual-level clinical decision-making.",
          "align": "justify",
          "runs": [
            {
              "text": "Because the analysis is based on aggregate CIHI NACRS reporting strata rather than individual patient records, these findings are interpreted at the aggregate system level. The statistical results should therefore support capacity planning, operational analysis, and decision support rather than individual-level clinical decision-making.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 31,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 6: Time-Series Trend Analysis and Throughput Forecasting",
          "align": "justify",
          "runs": [
            {
              "text": "      ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Chapter 6: Time-Series Trend Analysis and Throughput Forecasting",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This chapter focuses on time-series trend analysis and throughput forecasting. This chapter deals with the time-series trend analysis and throughput forecasting.",
          "align": "justify",
          "runs": [
            {
              "text": "This chapter focuses on time-series trend analysis and throughput forecasting. This chapter deals with the time-series trend analysis and throughput forecasting.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The longitudinal analysis looks at the Estimated Emergency Department Resource Burden Index (ERBI) over the nineteen-fiscal-year period of the CIHI NACRS study (FY 2003–2004 to FY 2021–2022). The aim is to assess if the emergency department resource burden has a statistically significant trend over time and to estimate the future burden for the coming fiscal years.",
          "align": "justify",
          "runs": [
            {
              "text": "The longitudinal analysis looks at the Estimated Emergency Department Resource Burden Index (ERBI) over the nineteen-fiscal-year period of the CIHI NACRS study (FY 2003–2004 to FY 2021–2022). The aim is to assess if the emergency department resource burden has a statistically significant trend over time and to estimate the future burden for the coming fiscal years. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The Mann–Kendall non-parametric trend test was chosen because it is not based on the assumption of a normally distributed pattern of the historical series and can detect monotonic changes over time. The test does not rely on any specific functional form of the relationships between the observations but rather assesses the ordering of the observations relative to one another, across fiscal years. The resulting Kendall correlation is τ = 0.9766, and the p value is < .0001, which is statistically significant and positive monotonic trend in the ERBI series.",
          "align": "justify",
          "runs": [
            {
              "text": "The Mann–Kendall non-parametric trend test was chosen because it is not based on the assumption of a normally distributed pattern of the historical series and can detect monotonic changes over time. The test does not rely on any specific functional form of the relationships between the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "observations but",
              "bold": false,
              "italic": false
            },
            {
              "text": " rather assesses the ordering of the observations relative to one another, across fiscal years. The resulting Kendall correlation is τ = 0.9766, and the p value is < .0001, which is statistically significant and positive monotonic trend in the ERBI series.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Table 15",
          "align": "justify",
          "runs": [
            {
              "text": "Table 15",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Mann–Kendall Trend Analysis of the ERBI Series",
          "align": "justify",
          "runs": [
            {
              "text": "Mann–Kendall Trend Analysis of the ERBI Series",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Parameter",
            "Value",
            "Interpretation"
          ],
          "rows": [
            [
              "Historical period",
              "FY 2003–2004 to FY 2021–2022",
              "19 fiscal years"
            ],
            [
              "Kendall's τ",
              "0.9766",
              "Very strong positive monotonic association"
            ],
            [
              "p-value",
              "< .0001",
              "Statistically significant upward trend"
            ],
            [
              "FY  2003-2004 ERBI",
              "5.21",
              "Beginning of observed series"
            ],
            [
              "FY  2021-2022 ERBI",
              "9.32",
              "End of observed series"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The trend seen in the platform reveals a consistent rise in estimated resource burden over the study period. ERBI starts at about 5.21 in FY 2003-2004 and grows steadily along the historical time series up to about 9.32 in FY 2021-2022. There is year-to-year variation in the series, but it is clearly rising and picked up some pace in the pandemic years.",
          "align": "justify",
          "runs": [
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The trend seen in the platform reveals a consistent rise in estimated resource burden over the study period. ERBI starts at about 5.21 in FY 2003-2004 and grows steadily along the historical time series up to about 9.32 in FY 2021-2022. There is year-to-year variation in the series, but it is clearly rising and picked up some pace in the pandemic years.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 32,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The importance of the Kendall statistics is that the magnitude shows that it is not only a single or two fiscal years that were responsible for the increase. On the contrary, the time series of the historical data is very clearly trending upwards. The Mann–Kendall result thus gives statistical evidence that the resource burden associated with the ERBI has increased significantly over the nineteen-year period of observation. The platform then associates this ERBI series with a statistically significant monotonic increase. This discovery indicates that there has been a significant strain on ED resources over the study period and indicates a need for forward-looking forecasting to be used in capacity and resource planning.",
          "align": "justify",
          "runs": [
            {
              "text": "The importance of the Kendall ",
              "bold": false,
              "italic": false
            },
            {
              "text": "statistics",
              "bold": false,
              "italic": false
            },
            {
              "text": " is that the magnitude shows that it is not only a single or two fiscal years that were responsible for the increase. On the contrary, the time series of the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "historical data is very clearly trending upwards. The Mann–Kendall result thus gives statistical evidence that the resource burden associated with the ERBI has increased significantly over the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "nineteen-year",
              "bold": false,
              "italic": false
            },
            {
              "text": " period of observation. The platform then associates this ERBI series with a statistically significant monotonic increase. This discovery indicates that there has been a significant strain on ED resources over the study period and indicates a need for forward-looking forecasting to be used in capacity and resource planning.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "6.2 Simple Exponential Smoothing (SES) Forecast",
          "align": "justify",
          "runs": [
            {
              "text": "6.2 Simple Exponential Smoothing (SES) Forecast ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The ERBI series was also subjected to Simple Exponential Smoothing (SES) method for short term forecasts in order to complement the historical trend analysis. the SES method models the underlying level of the time series without an explicit trend component, providing a stable near-term forecast that anchors on the most recently observed values rather than extrapolating the historical slope indefinitely. The forecasting capability builds on the nineteen-year ERBI series observed and projects them forward by two fiscal years. The resulting forecast holds close to the most recently observed level of emergency department resource burden following FY 2021-2022, consistent with the flat point-forecast behavior of the SES method.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The ERBI series was also subjected to ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Simple Exponential Smoothing (SES)",
              "bold": false,
              "italic": false
            },
            {
              "text": " method for short term ",
              "bold": false,
              "italic": false
            },
            {
              "text": "forecasts",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "in order to",
              "bold": false,
              "italic": false
            },
            {
              "text": " complement the historical trend analysis. the SES method models the underlying level of the time series without an explicit trend component, providing a stable near-term forecast that anchors on the most recently observed values rather than extrapolating the historical slope indefinitely. The forecasting capability builds on the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "nineteen-year",
              "bold": false,
              "italic": false
            },
            {
              "text": " ERBI series observed and projects them forward by two fiscal years. The resulting forecast holds close to the most recently observed level of emergency department resource burden following FY 2021-2022, consistent with the flat point-forecast behavior of the SES method.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Table 16",
          "align": "justify",
          "runs": [
            {
              "text": "Table 16",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Fiscal Year",
            "Forecast ERBI",
            "95% Prediction Interval"
          ],
          "rows": [
            [
              "FY 2022–2023",
              "9.32",
              "6.91–10.39"
            ],
            [
              "FY 2023–2024",
              "9.32",
              "6.84–11.12"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The platform generates a forecast of 9.32 ERBI units for FY 2022 - 2023 and 9.32 ERBI units for FY 2023 - 2024. The forecast presents 95% prediction intervals, reflecting the uncertainty of predicting the historical pattern into the future fiscal years. Note. Forecast values are planning estimates based on the models and should be updated as new CIHI aggregate data becomes available. The historical observations and forecast period are clearly distinguished in the platform, with a clear forecast boundary.",
          "align": "justify",
          "runs": [
            {
              "text": "        ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The platform generates a forecast of 9.32 ERBI units for FY 2022 - 2023 and 9.32 ERBI units for FY 2023 - 2024. The forecast ",
              "bold": false,
              "italic": false
            },
            {
              "text": "presents",
              "bold": false,
              "italic": false
            },
            {
              "text": " 95% prediction intervals, reflecting the uncertainty of predicting the historical pattern into the future fiscal years. Note. Forecast values are planning estimates based on the models and should be updated as new CIHI aggregate data ",
              "bold": false,
              "italic": false
            },
            {
              "text": "becomes",
              "bold": false,
              "italic": false
            },
            {
              "text": " available. The historical observations and forecast period are clearly distinguished in the platform, with a clear forecast boundary. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 33,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The solid line is the actual ERBI data for FY 2003 – 2004 to FY 2021 – 2022, and dashed lines indicate the forecasted ERBI data for FY 2022 – 2023 and FY 2023 – 2024. The Mann–Kendall trend analysis confirms that the underlying upward trend is statistically significant, and the SES forecast holds the index near its most recently observed level in the near term. ERBI is forecast to remain at approximately 9.32 in FY 2021–2022, FY 2022–2023, and FY 2023–2024, consistent with a simple exponential smoothing model, which carries the latest observed value forward as its point forecast.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The solid line is the actual ERBI data for FY 2003 – 2004 to FY 2021 – 2022, and dashed lines indicate the forecasted ERBI data for FY 2022 – 2023 and FY 2023 – 2024. The Mann–Kendall trend analysis shows that the trend in upward movement is likely to persist in the coming ",
              "bold": false,
              "italic": false
            },
            {
              "text": "years. ERBI increases from 9.32 in FY 2021–2022 to 9.32 in FY 2022–2023, followed by a further projected increase to 9.32 in FY 2023–2024. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This offers a forward-looking indicator for health-system leaders doing the ED capacity planning. Importantly, the values are not to be interpreted as exact forecasts of actual future uses. ERBI is an analytical measure that is derived from the aggregate of visit volume, reported median length of stay and acuity weighting. It is important to note that the forecast is an analytical planning estimate and not an observed clinical or financial measure.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "This offers a forward-looking indicator for health-system leaders doing the ED capacity planning. Importantly, the values are not to be interpreted as exact forecasts of actual future uses. ERBI is an analytical measure that is derived from the aggregate of visit volume, reported median length of stay and acuity weighting. It is important to note that the forecast is an analytical planning estimate and not an observed clinical or financial measure.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "6.3 Estimated Resource Burden Index",
          "align": "justify",
          "runs": [
            {
              "text": "6.3 Estimated Resource Burden Index",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Volume of ED visits does not necessarily reflect operational pressure since a single ED visit may consume significantly different resources, including time from staff, space, diagnostic testing and clinical resources. It is possible, therefore, that a larger number of short low acuity encounters can be a heavier operational load than a smaller number of high acuity encounters with considerably longer duration. In order to reflect this, the project relies upon the Estimated Emergency Department Resource Burden Index (ERBI). The metric is a combination of the reported median length of stay, an urgency weighting and the number of visits for each reporting stratum. It is \"normalized\" by the total number of visits to give an acuity-weighted patient-hour measure. The ERBI is calculated as:",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Volume of ED visits does not necessarily reflect operational pressure since a single ED visit may consume significantly different resources, including time from staff, space, diagnostic testing and clinical resources. It is possible, therefore, that a larger number of short low acuity encounters can be a heavier operational load than a smaller number of high acuity encounters with considerably longer duration. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "In order to",
              "bold": false,
              "italic": false
            },
            {
              "text": " reflect this, the project relies upon the Estimated Emergency Department Resource Burden Index (ERBI). The metric is a combination of the reported median length of stay, an urgency weighting and the number of visits for each reporting stratum. It is \"normalized\" by the total number of visits to give an acuity-weighted patient-hour measure. The ERBI is calculated as:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "where represents the implemented CTAS urgency weighting, represents the reported median emergency department length of stay in hours, and represents the number of emergency department visits associated with the reporting stratum.",
          "align": "justify",
          "runs": [
            {
              "text": "where ",
              "bold": false,
              "italic": false
            },
            {
              "text": "represents the implemented CTAS urgency weighting, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "represents the reported median emergency department length of stay in hours, and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "represents the number of emergency department visits associated with the reporting stratum.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 34,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The time series of historical ERB demonstrates significant growth in the last nineteen years. The platform reports an ERBI value of 5.21 in FY 2003–2004, increasing progressively to 9.32 in FY 2021–2022. The Mann–Kendall analysis also reveals that this historical increase is statistically significant with the value of τ = 0.9766 and a p value of < .0001. The increase in the resource burden indicated by the project-specific index over time is this pattern. The rise is significant in a planning context as it reflects the need to consider raw numbers of visits as just one component of emergency department pressure.",
          "align": "justify",
          "runs": [
            {
              "text": "The time series of historical ERB demonstrates significant growth in the last nineteen years. The platform reports an ERBI value of 5.21 in FY 2003–2004, increasing progressively to 9.32 in FY 2021–2022. The Mann–Kendall analysis also reveals that this historical increase is statistically significant with the value of τ = 0.9766 and a p value of < .0001. The increase in the resource burden indicated by the project-specific index over time is this pattern. The rise is significant in a ",
              "bold": false,
              "italic": false
            },
            {
              "text": "planning context as it reflects the need to consider raw numbers of visits as just one component of emergency department pressure. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The addition of visit duration and acuity gives a further dimension to the measure of cumulative burden on the ED capacity. The platform's longitudinal visualization allows you to see the whole history and the two-year forecast. The historic data series shows the long-term growth of ERBI, and the forecast holds this elevated level steady for the next two years, through FY 2023-2024.",
          "align": "justify",
          "runs": [
            {
              "text": "The addition of visit duration and acuity gives a further dimension to the measure of cumulative burden on the ED capacity. The platform's longitudinal visualization allows you to see the whole history and the two-year forecast. The historic data series shows the long-term growth of ",
              "bold": false,
              "italic": false
            },
            {
              "text": "ERBI",
              "bold": false,
              "italic": false
            },
            {
              "text": " and the forecast indicates a continuation of this upward trend for the next two years, FY 2023-2024.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 9",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 9",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Estimated Resource Burden Over Time (19-Year Trend + 2-Year Forecast)",
          "align": "justify",
          "runs": [
            {
              "text": "Estimated Resource Burden Over Time (19-Year Trend + 2-Year Forecast)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Note. Source: CIHI NACRS aggregate data and derived ERBI calculations implemented in the project analytics platform. Historical series covers FY 2003–2004 through FY 2021–2022; forecast covers FY 2022–2023 and FY 2023–2024. The shaded region represents the 95% prediction interval. ERBI is a derived analytical planning proxy and should not be interpreted as actual financial cost, staffing headcount, or validated clinical severity.",
          "align": "justify",
          "runs": [
            {
              "text": "Note. Source",
              "bold": true,
              "italic": false
            },
            {
              "text": ": CIHI NACRS aggregate data and derived ERBI calculations implemented in the project analytics platform. Historical series covers FY 2003–2004 through FY 2021–2022; forecast covers FY 2022–2023 and FY 2023–2024. The shaded region represents the 95% prediction interval. ERBI is a derived analytical planning proxy and should not be interpreted as actual financial cost, staffing headcount, or validated clinical severity.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The distribution of resource burden among the CTAS cohorts offers another indication regarding where there is overall burden. The analysis indicates that CTAS III — Urgent has the highest percentage of the derived burden, due to the number of visits served and the length of stay reported. So, it is not always the case that the most operationally demanding cohort is the most acutely demanding cohort.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The distribution of resource burden among the CTAS cohorts offers another indication regarding where there is overall burden. The analysis indicates that CTAS III — Urgent has the highest percentage of the derived burden, due to the number of visits served and the length of stay reported. So, it is not always the case that the most operationally demanding cohort is the most acutely demanding cohort. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 35,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "This is a distinction that is important especially for capacity planning. The clinical urgency of the patient is not the only criterion for the determination of the number of required resources in an ED. The total burden is further determined by the number of patients in each acuity category, as well as the duration of stay for the patients. Incorporate an interpretation and planning implication into this work. Add interpretation and planning implications to this work. The findings of the longitudinal data have three key implications for the planning for emergency departments.",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "This is a distinction that is important especially for capacity planning. The clinical urgency of the patient is not the only criterion for the determination of the number of required resources in ",
              "bold": false,
              "italic": false
            },
            {
              "text": "an ED. The total burden is further determined by the number of patients in each acuity category, as well as the duration of stay for the patients. Incorporate an interpretation and planning implication into this work. Add interpretation and planning ",
              "bold": false,
              "italic": false
            },
            {
              "text": "implications",
              "bold": false,
              "italic": false
            },
            {
              "text": " to this work. The findings of the longitudinal data have three key implications for the planning for emergency departments. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "First, the Mann–Kendall test is used to determine if there is a statistically significant upward trend in the ERBI series. The historical pattern is strongly consistent with an increase in the burden of resources over the nineteen-year observation period with τ = 0.9766 and p < .0001.",
          "align": "justify",
          "runs": [
            {
              "text": "First, the Mann–Kendall test is used to determine if there is a statistically significant upward trend in the ERBI series. The historical pattern is strongly consistent with an increase in the burden of resources over the nineteen-year observation period with τ = 0.9766 and p < .0001.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Secondly, the SES forecast carries the historical trend's most recent level into the near future. ERBI is projected to remain near the observed 9.32 in FY 2021–2022 through FY 2022–2023 and FY 2023–2024. Such estimates suggest that the pressure reflected by the index is not likely to ease immediately after the historical study period.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Secondly, the SES forecast carries the historical trend's most recent level into the near future. ERBI is projected to remain near the observed 9.32 in FY 2021–2022 through FY 2022–2023 and FY 2023–2024. Such estimates suggest that the pressure reflected by the index is not likely to ease immediately after the historical study period. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Third, ERBI showcases the benefits of using the combination of volume, acuity and duration, rather than emergency department visit counts. Two years of the same number of visits could have very different operational needs if there is a significant shift in acuity mix or length of stay. The forecasts should be regarded as planning estimates and not deterministic forecasts. The data underlying the CIHI are aggregated data and ERBI is an analytical proxy that is specific to the project.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Third, ERBI showcases the benefits of using the combination of volume, acuity and duration, rather than emergency department visit counts. Two years of the same number of visits could have very different operational needs if there is a significant shift in acuity mix or length of stay. The forecasts should be regarded as planning estimates and not deterministic forecasts. The data underlying the CIHI are aggregated data and ERBI is an analytical proxy that is specific to the project. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Therefore, it should be used to aid capacity discussions, trend monitoring and resource-planning decisions, but not to measure staffing needs or clinical severity. The site also clearly states the requirement for continuous model updates. The forecasting model should be updated when new CIHI aggregate data are added. This will maintain alignment of planning decisions to changes in the demand, mix of cases and reported length of stay at the ED.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Therefore, it should be used to aid capacity discussions, trend monitoring and resource-planning decisions, but not to measure staffing needs or clinical severity. The site also clearly states the requirement for continuous model updates. The forecasting model should be updated when new CIHI aggregate data are added. This will maintain alignment of planning decisions to changes in the demand, mix of cases and reported length of stay at the ED. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The overall trend in the longitudinal analysis shows a gradual and statistically significant rise in the burden of resources in the ED, and the short-term SES forecast suggests that this elevated burden will persist after FY 2021-2022. The findings support this project's overall conclusion:",
          "align": "justify",
          "runs": [
            {
              "text": "The overall trend in the longitudinal analysis shows a gradual and statistically significant rise in the burden of resources in the ED, and the short-term SES forecast suggests that this elevated burden will persist after FY 2021-2022. The findings support this project's overall ",
              "bold": false,
              "italic": false
            },
            {
              "text": "conclusion",
              "bold": false,
              "italic": false
            },
            {
              "text": ": ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 36,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The number of patients who are presented to the emergency department is not the only factor for capacity planning; the acuity level of the patient and the emergency department resource they occupy are also factors to consider. Additional insight into the distribution of resource burden across the groups of CTAS can be gained by observing resource burden across the cohort. CTAS III – Urgent has the highest contribution to the burden derived from the analysis, due to the high number of visits and high reported LOS. So the most acutely ill people are not the ones that are causing the most operational burden.",
          "align": "justify",
          "runs": [
            {
              "text": "T",
              "bold": false,
              "italic": false
            },
            {
              "text": "he number of patients who ",
              "bold": false,
              "italic": false
            },
            {
              "text": "are presented",
              "bold": false,
              "italic": false
            },
            {
              "text": " to the emergency department is not the only factor for capacity planning; the acuity level of the patient and the emergency department resource they occupy are also factors to consider. Additional insight into the distribution of resource burden across the groups of CTAS can be gained by observing resource burden across the cohort. CTAS III – Urgent has the highest contribution to the burden derived ",
              "bold": false,
              "italic": false
            },
            {
              "text": "from the analysis, due to the high number of visits and high reported LOS. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "So",
              "bold": false,
              "italic": false
            },
            {
              "text": " the most acutely ill people are not the ones that are causing the most operational burden. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This is especially important for capacity planning. It is not possible to identify the most clinically urgent patients at the time of admission to the ED and determine the resources needed based on that. The overall burden is also influenced by the number of patients in each acuity category and the duration of stay in the emergency department of those patients. 6.4 Interpretations and planning implications",
          "align": "justify",
          "runs": [
            {
              "text": "This is especially important for capacity planning. It is not possible to identify the most clinically urgent patients at the time of admission to the ED and determine the resources needed based on that. The overall burden is also influenced by the number of patients in each acuity category and the duration of stay in the emergency department of those patients. 6.4 Interpretations and planning implications ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "There are three major implications for planning in EDs from the longitudinal results. The Mann–Kendall test is used to determine the presence of a statistically significant upward trend in the ERBI series.",
          "align": "justify",
          "runs": [
            {
              "text": "There are three major implications for planning in EDs from the longitudinal results. The Mann–Kendall test is used to determine the presence of a statistically significant upward trend in the ERBI series. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The historical pattern is highly consistent with increasing resource burdens for the nineteen years over which the data were collected (τ = 0.9766, p < .0001). Second, the elevated level reached by this upward trend is projected to persist into the near term by the SES forecast. ERBI is projected to remain near the observed 9.32 in FY 2021–2022 through FY 2022–2023 and FY 2023–2024.",
          "align": "justify",
          "runs": [
            {
              "text": "The historical pattern is highly consistent with increasing resource burdens for the nineteen years over which the data were collected (τ = 0.9766, p < .0001). Second, the elevated level reached by this upward trend is projected to persist into the near term by the SES forecast. ERBI is projected to remain near the observed 9.32 in FY 2021–2022 through FY 2022–2023 and FY 2023–2024.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "These estimates suggest that the pressure from the index is unlikely to vanish right after the period of history they study. Thirdly, ERBI illustrates the importance of adding volume, acuity and duration and not just the number of visits to the emergency department. If there is a significant change in acuity mix or significant change in length of stay between two successive years of similar visit volume, it can lead to significantly different operational needs. The forecasts should be interpreted as planning estimates (not deterministic results).",
          "align": "justify",
          "runs": [
            {
              "text": "These estimates suggest that the pressure from the index is unlikely to vanish right after the period of history they study. Thirdly, ERBI illustrates the importance of adding volume, acuity and duration and not just the number of visits to the emergency department. If there is a significant change in acuity mix or significant change in length of stay between two successive years of similar visit volume, it can lead to significantly different operational needs. The forecasts should be interpreted as planning estimates (not deterministic results). ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The underlying population-level data used in the CIHI are not individual-level data and the ERBI is an analytical proxy for a project. It should not be used as a staffing or clinical severity measure but is to be used to assist in capacity discussions, trend monitoring and resource planning decisions. The platform also clearly points to the need for model to refresh over time.",
          "align": "justify",
          "runs": [
            {
              "text": "The underlying population-level data used in the CIHI are not individual-level data and the ERBI is an analytical proxy for a project. It should not be used as a staffing or clinical severity measure but is to be used to assist in capacity discussions, trend monitoring and resource planning decisions. The platform also clearly points to the need for ",
              "bold": false,
              "italic": false
            },
            {
              "text": "model",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "to refresh",
              "bold": false,
              "italic": false
            },
            {
              "text": " over time. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 37,
      "chapter": "Chapter 6",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Once new CIHI aggregate data is available, the series should be extended, and the forecasting model should be recalculated. This allows planning decisions to be responsive to changes in the demand for emergency services, case mix and reported length of stay for services at emergency departments. Overall, the longitudinal analysis suggests that the burden on ED has been on an upward trend for many years and statistically significant, and the short-term SES analysis suggests that this elevated load will persist after FY 21-22.",
          "align": "justify",
          "runs": [
            {
              "text": "Once new CIHI aggregate data is available, the series should be ",
              "bold": false,
              "italic": false
            },
            {
              "text": "extended,",
              "bold": false,
              "italic": false
            },
            {
              "text": " and the forecasting model should be recalculated. This allows planning decisions to be responsive to changes in the demand for emergency services, case mix and reported length of stay for services at emergency departments. Overall, the longitudinal analysis suggests that the burden on ",
              "bold": false,
              "italic": false
            },
            {
              "text": "ED",
              "bold": false,
              "italic": false
            },
            {
              "text": " has been on an upward trend for many years and statistically significant, and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "the short-term SES analysis suggests that this elevated load will persist after FY 21-22. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The results support the overall finding of this project: When planning for emergency department capacity, the number of patients presenting is not the only factor to take into account; the acuity of the presenting patient and how much time they take up in the emergency department resources should also be taken into account.",
          "align": "justify",
          "runs": [
            {
              "text": "The results support the overall finding of this project: When planning for emergency department capacity, the number of patients presenting is not the only factor to take into account; the acuity of the presenting patient and how much time they take up in the emergency department resources should also be taken into account.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 38,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 7: Data Visualization and Decision Support Systems",
          "align": "justify",
          "runs": [
            {
              "text": " ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Chapter 7: Data Visualization and Decision Support Systems",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "7.1 Dashboard Architecture",
          "align": "justify",
          "runs": [
            {
              "text": "7.1 Dashboard Architecture",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In addition, the statistical output in this report is presented in an interactive decision-support dashboard, created as a fully functional web application, for easy consumption by both technical and non-technical audiences. The front end developed with React 19, TypeScript and Recharts for charting and Vite for building pipelines. The application is linked to a Fast API backend that exposes thirty-one REST endpoints on the same SQLite database that is used for the analytical report.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "In addition, the statistical output in this report is presented in an interactive decision-support dashboard, created as a fully functional web application, for easy consumption by both technical and non-technical audiences. The front end developed with React 19, TypeScript and Recharts for charting and Vite for building ",
              "bold": false,
              "italic": false
            },
            {
              "text": "pipelines",
              "bold": false,
              "italic": false
            },
            {
              "text": ". The application is linked to a Fast API backend that exposes thirty-one REST endpoints on the same SQLite database that is used for the analytical report. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "These endpoints consist of individual routes for all the various hypothesis tests, the Mann–Kendall trend engine, the forecasting service, and the ERBI aggregation service. The architecture is decoupled, allowing queries to be completed within 100 milliseconds or less and importantly ensuring that no data from the read-only baseline research group is mixed with any additional data uploaded by a user for exploratory analysis. This design is both reproducible for the results reported and very flexible when interacting with the analytical system (Munzner, 2014; Few, 2012). There are separate views on the dashboard for each of the five hypothesis tests, longitudinal trend analysis, forecasting and resource-burden analysis. The numbers below are from the actual running code and do not represent conceptual mockups.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "These endpoints consist of individual routes for all the various hypothesis tests, the Mann–Kendall trend engine, the forecasting service, and the ERBI aggregation service. The architecture is decoupled, allowing queries to be completed within 100 milliseconds or less and importantly ensuring that no data from the read-only baseline research group is mixed with any additional data uploaded by a user for exploratory analysis. This design is both reproducible for the results reported and very flexible when interacting with the analytical system (",
              "bold": false,
              "italic": false
            },
            {
              "text": "Munzner",
              "bold": false,
              "italic": false
            },
            {
              "text": ", 2014; Few, 2012). There are separate views on the dashboard for each of the five hypothesis tests, longitudinal trend analysis, forecasting and resource-burden analysis. The numbers below are from the actual running code and do not represent conceptual mockups.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "7.2 Hypothesis Testing Dashboard Views",
          "align": "justify",
          "runs": [
            {
              "text": "7.2 Hypothesis Testing Dashboard Views",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 11",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 11",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: Reported Median LOS Across CTAS Triage Levels (H1)",
          "align": "center",
          "runs": [
            {
              "text": "Dashboard View: Reported Median LOS Across CTAS Triage Levels (H1)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 39,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The H1 dashboard view is a weighted Kruskal–Wallis analysis as in Chapter 5. The visualization shows that emergency department length of stay for reported median times is not linearly related to clinical acuity. The highest reported median LOS is with CTAS II – Emergent at 4.80 hours followed closely by CTAS I – Resuscitation at 4.60 hours. The median then falls in CTAS III-IV-V.",
          "align": "justify",
          "runs": [
            {
              "text": "The H1 dashboard view is a weighted Kruskal–",
              "bold": false,
              "italic": false
            },
            {
              "text": "Wallis",
              "bold": false,
              "italic": false
            },
            {
              "text": " analysis as in Chapter 5. The visualization shows that emergency department length of stay for reported median times is not linearly related to clinical acuity. The highest reported median LOS is with CTAS II – Emergent at 4.80 hours followed closely by CTAS I – Resuscitation at 4.60 hours. The ",
              "bold": false,
              "italic": false
            },
            {
              "text": "median",
              "bold": false,
              "italic": false
            },
            {
              "text": " then falls in CTAS III-IV-V. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The live dashboard reports an effect size of around ε² = 0.725, which is in line with the large effect size that was reported in the statistical analysis. After Bonferroni adjustment, none of the 10 pairwise comparisons between different CTAS are not significant. This visualization thus gives a quick visual indication of the high correlation between triage category and reported length of stay.",
          "align": "justify",
          "runs": [
            {
              "text": "The live dashboard reports an effect size of around ε² = 0.725, which is in line with the large effect size that was reported in the statistical analysis. After Bonferroni adjustment, none of the 10 pairwise comparisons between different CTAS are not significant. This visualization thus gives a quick visual indication of the high correlation between triage category and reported length of stay.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 12",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 12",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: Admission Status vs. Reported LOS (H2)",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: Admission Status vs. Reported LOS (H2)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 40,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The H2 visualization is a comparison of Emergency Department (ED) visits that were admitted and those which were not admitted. There is significant separation between the two cohorts in the platform. The reported median difference between the LOS for admitted patients and non-admitted patients is 8.10 hours, with the admitted patients having a median LOS of about 10.60 hours and the non-admitted patients having a median LOS of 2.50 hours. The separation of the two distributions is very large, with rank-biserial effect size rᵦ = 0.998. This visualization clearly shows the admission bottleneck and confirms the finding from the hypothesis-testing analysis that the bottleneck in the admission process is the strongest structural cause for the throughput delay found.",
          "align": "justify",
          "runs": [
            {
              "text": "The H2 visualization is a comparison of Emergency Department (ED) visits that were admitted and those which were not admitted. There is significant separation between the two cohorts in the platform. The reported median difference between the LOS for admitted patients and non-admitted patients is 8.10 hours, with the admitted patients having a median LOS of about 10.60 hours and the non-admitted patients having a median LOS of 2.50 hours. The separation of the two ",
              "bold": false,
              "italic": false
            },
            {
              "text": "distributions is very large, with rank-biserial effect size rᵦ = 0.998. This visualization clearly shows the admission bottleneck and confirms the finding from the hypothesis-testing analysis that the bottleneck in the admission process is the strongest structural cause for the throughput delay found.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 13",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 13",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: CTAS Urgency Score Predicting Reported LOS (H3)",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: CTAS Urgency Score Predicting Reported LOS (H3)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The H3 dashboard view shows the weighted least-squares regression analysis of the relationship between the implemented CTAS urgency score and reported median Emergency Department length of stay. Fitted Relationship and bubble size used to symbolize the quantity of visits to the aggregates is included in the visualization. The visual distribution highlights the fact that the volume component of the dataset with the most data is Urgent (CTAS III). During this time, the regression also shows that the urgency score does not account for most of the variation in reported LOS in the corresponding model, having an R² of 0.316. Visualization thus complements the statistical result with the visual accentuation of the acuity relationship and the fact that other operational factors are of significant importance.",
          "align": "justify",
          "runs": [
            {
              "text": "The H3 dashboard view shows the weighted least-squares regression analysis of the relationship between the implemented CTAS urgency score and reported median Emergency Department length of stay. Fitted Relationship and bubble size used to symbolize the quantity of visits to the aggregates is included in the visualization. The visual distribution highlights the fact that the volume component of the dataset with the most data is Urgent (CTAS III). During this time, the regression also shows that the urgency score does not account for most of the variation in reported LOS in the corresponding model, having an R² of 0.316. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Visualization",
              "bold": false,
              "italic": false
            },
            {
              "text": " thus complements the statistical result with the visual accentuation of the acuity relationship and the fact that other operational factors ",
              "bold": false,
              "italic": false
            },
            {
              "text": "are of significant importance",
              "bold": false,
              "italic": false
            },
            {
              "text": ".",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 41,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Figure 14",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 14",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: Age Group vs. Reported Length of Stay (H4)",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: Age Group vs. Reported Length of Stay (H4)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In the H4 visualization a clear rise in the reported median LOS across the wide age groups can be seen. The platform shows around 2.05 hours for Pediatric & Youth, 2.53 hours for Young Adults, 2.87 hours for Middle Adults and 4.17 hours for Older Adults. The dashboard's real-time calculation of effect-size yields ε² ~ 0.722, which indicates that the differences among the age groups can be considered a large effect, rather than a correlation only because of the very large overall sample. The visualization serves as an empirical ground for the geriatric emergency-management recommendation that is formulated later in the report.",
          "align": "justify",
          "runs": [
            {
              "text": "In the H4 visualization a clear rise in the reported median LOS across the wide age groups can be seen. The platform shows around 2.05 hours for Pediatric & Youth, 2.53 hours for Young Adults, 2.87 hours for Middle Adults and 4.17 hours for Older Adults. The dashboard's real-time calculation of effect-size yields ε² ~ 0.722, which indicates that the differences among the age groups can be considered a large effect, rather than a correlation only because of the very large overall sample. The visualization serves as an empirical ground for the geriatric emergency-management recommendation that is formulated later in the report.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 42,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Figure 15",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 15",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: Patient Sex vs. Visit Disposition (H5)",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: Patient Sex vs. Visit Disposition (H5)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The H5 dashboard explores the link between patient sex and disposition in the ED. The observed proportions of admissions vary slightly, around 9.9% of the patients are females and 10.6% are males. The difference is statistically measurable, because of the very large number of observations, but there is very little of it in practice, as the dashboard reports a Cramér's V of around 0.010. For this reason, it is not meaningful to design for emergency flows based on biological sex. This visualization further highlights the difference between statistical significance and operational significance as called out throughout the report.",
          "align": "justify",
          "runs": [
            {
              "text": "The H5 dashboard explores the link between patient sex and disposition in the ED. The observed proportions of admissions vary slightly, around 9.9% of the patients are females and 10.6% are males. The difference is statistically measurable, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "because of",
              "bold": false,
              "italic": false
            },
            {
              "text": " the very large number of observations, but there is very little of it in practice, as the dashboard reports a Cramér's V of around 0.010. For this reason, it is not meaningful to design for emergency flows based on biological sex. This visualization further highlights the difference between statistical significance and operational significance as called out throughout the report.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 43,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "7.3 Resource-Burden and Presenting-Problem Views",
          "align": "justify",
          "runs": [
            {
              "text": "7.3 Resource-Burden and Presenting-Problem Views",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 16",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 16",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: Estimated Resource Burden by CTAS Triage Cohort",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: Estimated Resource Burden by CTAS Triage Cohort",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The ERBI visualization looks at the distribution of derived resource burden by CTAS cohorts. The derived burden generated by the Urgent (CTAS III) is about 52.3%, due to the very large number of visits and also the significant length of stay reported. By contrast, the highest-acuity category (CTAS I) accounts for less than one percent of the total derived burden, but has a relatively small number of visits. The visualization therefore illustrates one important difference between the acuity of individual patients and the operational burden of these patients.",
          "align": "justify",
          "runs": [
            {
              "text": "The ERBI visualization looks at the distribution of derived resource burden by CTAS cohorts. The derived burden generated by the Urgent (CTAS III) is about 52.3%, due to the very large number of visits ",
              "bold": false,
              "italic": false
            },
            {
              "text": "and also",
              "bold": false,
              "italic": false
            },
            {
              "text": " the significant length of stay reported. By contrast, the highest-acuity category (CTAS I) accounts for less than one percent of the total derived ",
              "bold": false,
              "italic": false
            },
            {
              "text": "burden, but",
              "bold": false,
              "italic": false
            },
            {
              "text": " has a relatively small number of visits. The visualization therefore illustrates one important difference between the acuity of individual patients and the operational burden of these patients.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 44,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Figure 17",
          "align": "justify",
          "runs": [
            {
              "text": "F",
              "bold": true,
              "italic": false
            },
            {
              "text": "igure 17",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: Top Main Presenting Problems by Visit Volume",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: Top Main Presenting Problems by Visit Volume",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The presenting problem view is the same as the case-mix analysis given in Chapter 4. There are significant differences between the volume of presentations to the ED and the length of stay reported for each presenting complaint, with trauma and unintentional falls accounting for a large proportion of ED volume, and less frequent presentations like acute myocardial infarction having longer reported lengths of stay. This visualization illustrates the limitations of volume rankings to fully capture operational burden. There can be relatively few encounters with a presenting problem, but the time spent in the ED can be significant due to the length of the diagnostic or treatment process.",
          "align": "justify",
          "runs": [
            {
              "text": "The ",
              "bold": false,
              "italic": false
            },
            {
              "text": "presenting problem",
              "bold": false,
              "italic": false
            },
            {
              "text": " view is the same as the case-mix analysis given in Chapter 4. There are significant differences between the volume of presentations to the ED and the length of stay reported for each presenting complaint, with trauma and unintentional falls accounting for a large proportion of ED volume, and less frequent presentations like acute myocardial infarction having longer reported lengths of stay. This visualization illustrates the limitations of volume rankings to fully capture operational burden. There can be relatively few encounters with a presenting ",
              "bold": false,
              "italic": false
            },
            {
              "text": "problem,",
              "bold": false,
              "italic": false
            },
            {
              "text": " but the time spent in the ED can be significant due to the length of the diagnostic or treatment process.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 45,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Figure 18",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 18",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard View: ED Visit Volume by Fiscal Year (2003/04–2021/22)",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard View: ",
              "bold": true,
              "italic": false
            },
            {
              "text": "ED Visit Volume by Fiscal Year (2003/04–2021/22)",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Note. Aggregate ED visits over 19 years for all Canadians across Canadian hospitals (CIHI NACRS) interactive platform visualization.",
          "align": "justify",
          "runs": [
            {
              "text": "Note. Aggregate ED visits over 19 years for all Canadians across Canadian hospitals (CIHI NACRS) interactive platform visualization.",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The trend of visualization shows the number of visits to EDs has steadily risen over the 19-year observation period. There was an overall increase of approximately 185.2% in the number of annual ED visits, rising from 4.91 million in FY 2003/04 to 13.99 million in FY 2021/22. The peak annual volume recorded in FY 2018/19 with an estimated of around 15.08 million ED visits. There is a temporary dip to be seen in FY 2019/20 and in FY 2020/21 and an increase in FY 2021/22. This dip in the overall upward trend is in line with the marked disruptions in health care utilization during the COVID-19 pandemic.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The trend of ",
              "bold": false,
              "italic": false
            },
            {
              "text": "visualization",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "shows",
              "bold": false,
              "italic": false
            },
            {
              "text": " the number of visits to EDs has steadily risen over the 19-year observation period. There was an overall increase of approximately 185.2% in the number of annual ED visits, rising from 4.91 million in FY 2003/04 to 13.99 million in FY 2021/22. The peak annual volume recorded in FY 2018/19 with an estimated of around 15.08 million ED visits. There is a temporary dip to be seen in FY 2019/20 and in FY 2020/21 and an increase in FY 2021/22. This dip in the overall upward trend is in line with the marked disruptions in health care utilization during the COVID-19 pandemic.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This visualization is useful for identifying the longitudinal pattern, in addition to being useful as a description of individual yearly changes. The Mann-Kendall trend statistic (Z = 5.5977, p < 0.001) confirmed that the trend of the aggregate ED visit volume was statistically significant and increasing. The annual rate of increase is estimated by the corresponding value of Sen's slope (around 550.9 thousand visits per year).",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "This visualization is useful for identifying the longitudinal pattern, in addition to being useful as a description of individual yearly changes. The Mann-Kendall trend ",
              "bold": false,
              "italic": false
            },
            {
              "text": "statistic",
              "bold": false,
              "italic": false
            },
            {
              "text": " (Z = 5.5977, p < 0.001) confirmed that the trend of the aggregate ED visit volume was statistically significant and increasing. The annual rate of increase is estimated by the corresponding value of Sen's slope (around 550.9 thousand visits per year).",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "As a support of a decision, the visualization illustrates the benefits of a longitudinal monitoring in the analytics platform. This continued increase in ED utilization should be considered in the context of capacity planning, staffing, infrastructure needs, and resource allocation. The temporary drop in cases during the pandemic period also shows that a historical trend analysis is not about to ignore significant events, such as the pandemic-driven drop, that do not fit the pattern.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "As a support of a decision, the visualization illustrates the benefits of ",
              "bold": false,
              "italic": false
            },
            {
              "text": "a longitudinal",
              "bold": false,
              "italic": false
            },
            {
              "text": " monitoring in the analytics platform. This continued increase in ED utilization should be considered in the context of capacity planning, staffing, infrastructure needs, and resource allocation. The temporary drop in cases during the pandemic period also shows that a historical trend analysis is not about to ignore significant events, such as the pandemic-driven drop, that do not fit the pattern.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 46,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The data in Figure 18 highlights the following key insights:",
          "align": "justify",
          "runs": [
            {
              "text": "The data in Figure ",
              "bold": true,
              "italic": false
            },
            {
              "text": "18",
              "bold": true,
              "italic": false
            },
            {
              "text": " highlights the following key insights:",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The overall increase was around 185.2% for annual ED visits from 4.91 million to 13.99 million between FY 2003/04 and FY 2021/22.",
          "align": "justify",
          "runs": [
            {
              "text": "The overall increase was around 185.2% for annual ED visits from 4.91 million to 13.99 million between FY 2003/04 and FY 2021/22.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "FY 2018/19 saw the largest number of ED visits observed, which were 15.08 million.",
          "align": "justify",
          "runs": [
            {
              "text": "FY 2018/19 saw the largest number of ED visits observed, which were 15.08 million.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The number of ED visits slightly dropped in FY 2019/20 and FY 2020/21, then rose again in FY 2021/22.",
          "align": "justify",
          "runs": [
            {
              "text": "The number of ED visits slightly dropped in FY 2019/20 and FY 2020/21, then rose again in FY 2021/22.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The long-term upward trend is statistically significant with the Mann–Kendall Z statistic of 5.5977 (p < 0.001).",
          "align": "justify",
          "runs": [
            {
              "text": "The long-term upward trend is statistically significant with the Mann–Kendall Z statistic of 5.5977 (p < 0.001).",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Sen's slope of around 550.9 thousand visits per year suggests that the trend in aggregate ED use is strong.",
          "align": "justify",
          "runs": [
            {
              "text": "Sen's slope of around 550.9 thousand visits per year suggests that the trend in aggregate ED use is strong.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The on-going rise in ED demand demonstrates the need for ongoing capacity planning, workforce planning, and allocation of resources in emergency health-care systems.",
          "align": "justify",
          "runs": [
            {
              "text": "The on-going rise in ED demand demonstrates the need for ongoing capacity planning, workforce planning, and allocation of resources in emergency health-care systems.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 19",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 19",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard view: Reported Median Length of Stay by Fiscal Year",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard view: ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Reported Median Length of Stay by Fiscal Year",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Note. Interactive visualization of platform data on the length of stay (LOS) reported for the median ED visit for the past 19 years by comparison to the 6.0-hour aggregate reference threshold (CIHI NACRS).",
          "align": "justify",
          "runs": [
            {
              "text": "Note. Interactive visualization of platform data on the length of stay (LOS) reported for the median ED visit for the past 19 years by comparison to the 6.0-hour aggregate reference threshold (CIHI NACRS).",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Median ED LOS (days) is generally increasing across the study period as indicated in the visualization. Overall, the median value rose from c. 2.75 hours in FY 2003/04 to c. 4.17 hours in FY 2021/22, an increase of c. 51.6%. The overall trend suggests a slight rise in the reported median of ED duration with time, although there are periods of relative stability, and some minor fluctuations.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Median ED LOS (days) is generally increasing across the study period as indicated in the visualization. Overall, the median value rose from c. 2.75 hours in FY 2003/04 to c. 4.17 hours in FY 2021/22, an increase of c. 51.6%. The overall trend suggests a slight rise in the reported median of ED duration with time, although there are periods of relative stability, and some minor fluctuations.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The current medians reported for FY 2021/22 (4.17 hours) are below the 6.0-hour reference line shown in the visualization. Comparing with the benchmark offers a very easy means for the decision-maker to see if the aggregate level of the departmental cohort is still in the benchmark and to note the underlying trend of the cohort over time.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The current medians reported for FY 2021/22 (4.17 hours) are below the 6.0-hour reference line shown in the visualization. Comparing with the benchmark offers a very easy means for the decision-maker to see if the aggregate level of the departmental cohort is still in the benchmark and to note the underlying trend of the cohort over time.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 47,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The visualization also illustrates the value of a dashboard design that is based on benchmarks. The platform does not just show the annual LOS values, but also the path of the LOS value and a well-defined reference line. This enables the user to see the direction of change and the distance from the benchmark without having to perform extra calculations. However, the upward trend in median LOS suggests that there should be a greater focus on the pressures experienced by EDs and system capacity over time.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The visualization also illustrates the value of a dashboard design that is based on benchmarks. The platform does not just show the annual LOS values, but also the path of the LOS value and a well-defined reference line. This enables the user to see the direction of change and the distance from the benchmark without having to perform extra calculations. However, the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "upward trend in median LOS suggests that there should be a greater focus on the pressures experienced by EDs and system capacity over time.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The data in Figure 18 highlights the following key insights:",
          "align": "justify",
          "runs": [
            {
              "text": "The data in Figure ",
              "bold": true,
              "italic": false
            },
            {
              "text": "18",
              "bold": true,
              "italic": false
            },
            {
              "text": " highlights the following key insights:",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Reported median ED LOS increased from 2.75 hours in FY 2003/04 to 4.17 hours in FY 2021/22.",
          "align": "justify",
          "runs": [
            {
              "text": "Reported median ED LOS increased from 2.75 hours in FY 2003/04 to 4.17 hours in FY 2021/22.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This is a cumulative 51.6% increase over 19 years.",
          "align": "justify",
          "runs": [
            {
              "text": "This is a cumulative 51.6% increase over 19 years.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The overall trend of the curve is mostly upward, with some fluctuations and plateaus over the years.",
          "align": "justify",
          "runs": [
            {
              "text": "The overall trend of the curve is mostly upward, with some fluctuations and plateaus over the years.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The current reported median LOS is 4.17 hours, which is below the aggregate reference LOS of 6.0 hours.",
          "align": "justify",
          "runs": [
            {
              "text": "The current reported median LOS is 4.17 hours, which is below the aggregate reference LOS of 6.0 hours.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The benchmark comparison will offer a user-friendly decision support tool to track the duration of the ED in relation to the reference.",
          "align": "justify",
          "runs": [
            {
              "text": "The benchmark comparison will offer a user-friendly decision support tool to track the duration of the ED in relation to the reference.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Continued monitoring for throughput, capacity planning and operational resource management are important, as evidenced by the reported increase in the median LOS over the long-term.",
          "align": "justify",
          "runs": [
            {
              "text": "Continued monitoring for throughput, capacity planning and operational resource management are important, as evidenced by the reported increase in the median LOS over the long-term.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "7.4 Dashboard Audiences and Interaction Modes",
          "align": "justify",
          "runs": [
            {
              "text": "7.4 Dashboard Audiences and Interaction Modes",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The dashboard caters to three main user groups: executive decision makers, clinical operations & bed management team, data analysts.",
          "align": "justify",
          "runs": [
            {
              "text": "The dashboard caters to three main user groups: executive decision makers, clinical operations & bed management team, data analysts.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Executive Users:",
          "align": "justify",
          "runs": [
            {
              "text": "Executive Users: ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "High level KPI cards, a one-click export capability for board level reporting and an ERBI capacity gauge are provided for executive users. The features enable the leadership to track the trend of the pressure in the entire ED without needing to interpret the statistical output.",
          "align": "justify",
          "runs": [
            {
              "text": "High level KPI cards, a one-click export capability for board level ",
              "bold": false,
              "italic": false
            },
            {
              "text": "reporting",
              "bold": false,
              "italic": false
            },
            {
              "text": " and an ERBI capacity gauge are provided for executive users. The features enable the leadership to track the trend of the pressure in the entire ED without needing to interpret the statistical output. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Clinical Operations and Bed Management:",
          "align": "justify",
          "runs": [
            {
              "text": "Clinical Operations and Bed ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Management",
              "bold": true,
              "italic": false
            },
            {
              "text": ":",
              "bold": true,
              "italic": false
            },
            {
              "text": " ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Clinical operations users are presented with more detailed operational information, such as an acuity-flow matrix, presenting complaints ranked by duration, and an alert on boarded admissions that last longer than eight hours. The operational monitoring tools are based on these views, which represent a translation of the statistical findings.",
          "align": "justify",
          "runs": [
            {
              "text": "Clinical operations users are presented with more detailed operational information, such as an acuity-flow matrix, presenting complaints ranked by duration, and an alert on boarded admissions that last longer than eight hours. The operational monitoring tools are based on these views, which represent a translation of the statistical findings. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Data Analysts:",
          "align": "justify",
          "runs": [
            {
              "text": "Data ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Analysts",
              "bold": true,
              "italic": false
            },
            {
              "text": ":",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 48,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The live hypothesis-testing suite, forecasting sandbox and session-isolated upload portal allow data analysts to access the data. The forecasting sandbox allows users to play with the value of the Simple Exponential Smoothing parameter, and the isolated upload lets regional data or other data be explored without changing the baseline.",
          "align": "justify",
          "runs": [
            {
              "text": "The live hypothesis-testing suite, forecasting sandbox and session-isolated upload portal allow data analysts to access the data. The forecasting sandbox allows users to play with the value of the ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Simple Exponential Smoothing parameter, and the isolated upload lets regional data or other data be explored without changing the baseline.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "7.5 Interactive Filtering and Decision Support:",
          "align": "justify",
          "runs": [
            {
              "text": "7.5 Interactive Filtering and Decision ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Support",
              "bold": true,
              "italic": false
            },
            {
              "text": ":",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The visualization layer of the dashboard is identical to the analytical calculations presented in Chapters 4-6. It contains the nineteen-year time series of visit volumes, comparison with CTAS, comparison with admission status, WLS regression, forecasting view and ERBI trajectory.",
          "align": "justify",
          "runs": [
            {
              "text": "The visualization layer of the dashboard is identical to the analytical calculations presented in Chapters 4-6. It contains the nineteen-year time series of visit volumes, comparison with CTAS, comparison with admission status, WLS regression, forecasting view and ERBI trajectory. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Every visualization includes a description name, labeled axis, legend (when needed) and hover level information that lets users explore individual reporting strata. This design makes the dashboard more than just a set of static charts, but an interactive analytical environment that is directly connected to the database.",
          "align": "justify",
          "runs": [
            {
              "text": "Every visualization includes a description name, labeled axis, legend (when needed) and hover level information that lets users explore individual reporting strata. This design makes the dashboard more than just a set of static charts, but ",
              "bold": false,
              "italic": false
            },
            {
              "text": "an",
              "bold": false,
              "italic": false
            },
            {
              "text": " interactive analytical environment that is directly connected to the database.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Figure 18",
          "align": "justify",
          "runs": [
            {
              "text": "Figure 18",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dashboard Filter Scope Panel",
          "align": "justify",
          "runs": [
            {
              "text": "Dashboard Filter Scope Panel",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The active dataset can be limited by the filter-scope panel on five dimensions: Fiscal Year Patient Sex Age Cohort CTAS Acuity Disposition It is possible to use these filters alone or in combination prior to creating a visualization. The seven dashboard figures shown above in this chapter are therefore only a selection of the confirmed views on the system which the platform can produce. The need for visualization as a decision-support layer. The need for visualization as a decision-support layer.",
          "align": "justify",
          "runs": [
            {
              "text": "The active dataset can be limited by the filter-scope panel on five dimensions: Fiscal Year Patient Sex Age Cohort CTAS Acuity Disposition It is possible to use these filters alone or in combination prior to creating a visualization. The seven dashboard figures shown above in this chapter are therefore only a selection of the confirmed views on the system which the platform can produce. The need for visualization as a decision-support layer.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The need for visualization as a decision-support layer. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "7.6 Interactive Visual Studio and AI-Assisted Chart Design",
          "align": "justify",
          "runs": [
            {
              "text": "7.6 ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Interactive Visual Studio and AI-Assisted Chart Design",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "It features the Interactive Visual Studio and AI Chart Designer to assist in creating personalized analytical visuals to support the development of customizable healthcare and ED reports. By offering the users a guided environment to choose chart types, set analytical dimensions and measures, add visualization overlays and preview the visualization before adding it to the dashboard, the component will make it easier for them to reach these goals.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "It features the Interactive Visual Studio and AI Chart Designer to assist in creating personalized analytical visuals to support the development of customizable healthcare and ED reports. By offering the users a guided environment to choose chart types, set analytical dimensions and measures, add visualization overlays and preview the visualization before adding it to the dashboard, the component will make it easier for them to reach these goals.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The visual studio makes a few suggestions depending on the variables you have for analysis. These include the visualizations of the five hypothesis tests, the volume of ED visits over time, estimated resource burden, clinical profiling and demographic analysis. This recommendation layer supports the user's decision in choosing the visualization formats, depending on the analysis question and not just manually configuring the chart.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The visual studio makes a few suggestions depending on the variables you have for analysis. These include the visualizations of the five hypothesis tests, the volume of ED visits over time, estimated resource burden, clinical profiling and demographic analysis. This recommendation layer supports the user's decision in choosing the visualization formats, depending on the analysis question and not just manually configuring the chart.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 49,
      "chapter": "Chapter 7",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The interface offers chart-design options such as chart title, subtitle and clinical scope, chart layout, X-axis dimension and Y-axis measure which are all configurable. The available layouts are column, bar, line, area, pie, donut, radar, tree map, funnel, waterfall, heatmap, gauge, box plot and Sankey visualizations. Flexibility enables the same data set to be analyzed through various ways of operation and provides a consistent analytical workflow.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The interface offers chart-design options such as chart title, subtitle and clinical scope, chart layout, X-axis dimension and Y-axis measure which are all configurable. The available layouts are ",
              "bold": false,
              "italic": false
            },
            {
              "text": "column, bar, line, area, pie, donut, radar, tree map, funnel, waterfall, heatmap, gauge, box plot and Sankey visualizations. Flexibility enables the same data set to be analyzed through various ways of operation and provides a consistent analytical workflow.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In longitudinal analysis, it is recommended to perform a line-based visualization since the progression of time is best reflected by a continuous line. In the example shown, the X-axis dimension is fiscal year, and the measure is ED visits. The resulting preview shows the annual ED visit trajectory, along with a regression trend line, which allows users to evaluate the trajectory of their visits to the ED and the general direction of change.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "In longitudinal analysis, it is recommended to perform a line-based visualization since the progression of time is best reflected by a continuous line. In the example shown, the X-axis dimension is fiscal year, and the measure is ED visits. The resulting preview shows the annual ED visit trajectory, along with a regression trend line, which allows users to evaluate the trajectory of their visits to the ED and the general direction of change.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The AI-assisted feature also delivers explainable analytical insights along with the visualization that is generated. The example shown here is a system that is used to determine the fiscal-year cluster that has the greatest fiscal-year visit volume and return a proportion of the overall data set for that cluster. It also shows the reliability of the generated visualization, to enhance transparency in the automated recommendation process.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The AI-assisted feature also delivers explainable analytical insights along with the visualization that is generated. The example shown here is a system that is used to determine the fiscal-year cluster that has the greatest fiscal-year visit volume and return a proportion of the overall data set for that cluster. It also shows the reliability of the generated visualization, to enhance transparency in the automated recommendation process.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "An extra layer of validation is added by a separate AI Visual Quality Assessment Scorecard. The configuration that is shown is reviewed as A+, and it has a quality index of 98% and the analysis method has been selected appropriately, as well as accessibility requirements, number of categories, contrast and ease of reading the layout. The interface also claims to be compliant with healthcare analytics reporting standards and WCAG AA accessibility concerns.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "An extra layer of validation is added by a separate AI Visual Quality Assessment Scorecard. The configuration that is shown is reviewed as A+, and it has a quality index of ",
              "bold": false,
              "italic": false
            },
            {
              "text": "98%",
              "bold": false,
              "italic": false
            },
            {
              "text": " and the analysis method has been selected appropriately, as well as accessibility requirements, number of categories, contrast and ease of reading the layout. The interface also claims to be compliant with healthcare analytics reporting standards and WCAG AA accessibility concerns.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The Interactive Visual Studio is an extension of the static dashboard reporting available with Visual Studio, and enables users to build, test and tweak analytical visualizations on the fly. AI recommendations for charts, customizable visualization settings, insights explained, and automatic quality assessment gives a flexible mechanism for how to explore healthcare operational data to make decisions.",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The Interactive Visual Studio is an extension of the static dashboard reporting available with Visual Studio, and enables users to build, test and tweak analytical visualizations on the fly. AI recommendations for charts, customizable visualization settings, insights explained, and automatic quality assessment gives a flexible mechanism for how to explore healthcare operational data to make decisions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This interactive visual studio forms an excellent way for the students to become acquainted with key insights:",
          "align": "justify",
          "runs": [
            {
              "text": "This interactive visual studio forms an excellent way for the students to become acquainted with key insights",
              "bold": true,
              "italic": false
            },
            {
              "text": ":",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The platform offers recommendations, powered by artificial intelligence, for the choice of visualization for analytical questions.",
          "align": "justify",
          "runs": [
            {
              "text": "The platform offers recommendations, powered by artificial intelligence, for the choice of visualization for analytical questions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The user may set the title, clinical scope, layouts, dimensions and measures before publishing a visualization to the dashboard.",
          "align": "justify",
          "runs": [
            {
              "text": "The user may set the title, clinical scope, layouts, dimensions and measures before publishing a visualization to the dashboard.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A line-based trajectory is used to represent the longitudinal ED visit analysis, suitable for analyzing changes over fiscal years.",
          "align": "justify",
          "runs": [
            {
              "text": "A line-based trajectory is used to represent the longitudinal ED visit analysis, suitable for analyzing changes over fiscal years.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 50,
      "chapter": "Chapter 8",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The system can augment visualizations with meaningful analysis and trend overlays.",
          "align": "justify",
          "runs": [
            {
              "text": "The system can augment visualizations ",
              "bold": false,
              "italic": false
            },
            {
              "text": "with",
              "bold": false,
              "italic": false
            },
            {
              "text": " meaningful analysis and trend overlays.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The demonstrated quality assessment has an A+ review grade and 98% quality index.",
          "align": "justify",
          "runs": [
            {
              "text": "The demonstrated quality assessment has an A+ review grade and 98% quality index.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The visual-quality assessment includes accessibility, readability, contrast and analytical-method suitability.",
          "align": "justify",
          "runs": [
            {
              "text": "The visual-quality assessment includes accessibility, readability, contrast and analytical-method suitability.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The component also enhances the platform's ability to be an interactive decision-making platform instead of a reporting dashboard.",
          "align": "justify",
          "runs": [
            {
              "text": "The component also enhances the platform's ability to be an interactive decision-making platform instead of a reporting dashboard.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Chapter 8: Findings, Synthesis, and Critical Discussion",
          "align": "center",
          "runs": [
            {
              "text": "Chapter 8: Findings, Synthesis, and Critical Discussion",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "8.1 An Operational Triad",
          "align": "justify",
          "runs": [
            {
              "text": "8.1 An Operational Triad ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In all five hypothesis tests and in all five longitudinal analyses, three of the structural factors are consistently the most significant contributors to the variation in the length of stay (LOS) at the ED, namely: diagnostic complexity, clinical complexity, and age of the patient. The H1 analysis shows that the median emergency department length of stay (LOS) is significantly different between the five CTAS acuity levels. Median LOS values for the live platform are 3.20 hours for CTAS I — Resuscitation; 3.60 hours for CTAS II — Emergent; 3.70 hours for CTAS III — Urgent; 2.90 hours for CTAS IV — Less Urgent; and 2.00 hours for CTAS V — Non-Urgent. The results of all ten pairwise comparisons remain statistically significant upon Bonferroni correction and have a live ε2 ~ 0.748.",
          "align": "justify",
          "runs": [
            {
              "text": "         ",
              "bold": false,
              "italic": false
            },
            {
              "text": "In all five hypothesis tests and in all five longitudinal analyses, three of the structural factors are consistently the most significant contributors to the variation in the length of stay (LOS) at the ED, namely: diagnostic complexity, clinical complexity, and age of the patient. The H1 analysis shows that the median emergency department length of stay (LOS) is significantly different between the five CTAS acuity levels. Median LOS values for the live platform are 3.20 hours for CTAS I — Resuscitation; 3.60 hours for CTAS II — Emergent; 3.70 hours for CTAS III — Urgent; 2.90 hours for CTAS IV — Less Urgent; and 2.00 hours for CTAS V — Non-Urgent. The results of all ten pairwise comparisons remain statistically significant upon ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Bonferroni",
              "bold": false,
              "italic": false
            },
            {
              "text": " correction and have a live ε2 ~ 0.748. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The pattern suggests that there is not a linear relationship between throughput and acuity: the CTAS II and III groups had the longest reported lengths of stay in the dashboard cohort. The platform's H1 result thus indicates the significance of the patients who must go through extensive diagnostic and treatment procedures but do not necessarily fall in the smallest and most critical patient category for resuscitation. The clearest separation is found in H2 where the status for admission is directly compared. The platform gives a median difference of 10.60 hours for the difference in median time between the admitted and non-admitted visits, and an rᵦ effect size of 0.9981, with a median LOS of around 2.50 hours for the non-admitted visits and 10.60 hours for the admitted visits.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The pattern suggests that there is not a linear relationship between throughput and acuity: the CTAS II and III groups had the longest reported lengths of stay in the dashboard cohort. The platform's H1 result thus indicates the significance of the patients who ",
              "bold": false,
              "italic": false
            },
            {
              "text": "must",
              "bold": false,
              "italic": false
            },
            {
              "text": " go through extensive diagnostic and treatment procedures but do not necessarily fall ",
              "bold": false,
              "italic": false
            },
            {
              "text": "in",
              "bold": false,
              "italic": false
            },
            {
              "text": " the smallest and most critical patient category for resuscitation. The clearest separation is found in H2 where the status for admission is directly compared. The platform gives a median difference of 10.60 hours for the difference in median time between the admitted and non-admitted visits, and an rᵦ effect size of 0.9981, with a median LOS of around 2.50 hours for the non-admitted visits and 10.60 hours for the admitted visits. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 51,
      "chapter": "Chapter 8",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The very high effect size means that inpatient admission is highly related to longer emergency department stay. This supports the interpretation that emergency department throughput is not a problem entirely internal to the ED, but that inpatient bed availability and downstream hospital capacity are central factors to the problem. The H4 analysis adds to this structural picture the dimension of demographics. The platform indicates the median LOS for Pediatric & Youth is 2.05 hours, for Young Adults it is 2.47 hours, for Middle Adults it is 2.73 hours and for Older Adults it is 4.17 hours. The weighted Kruskal-Walli’s test results in an effect size of ε2 = 0.7218 and all 6 pairwise comparisons are statistically significant following Bonferroni.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The very high effect size means that inpatient admission is highly related to longer emergency department stay. This supports the interpretation that emergency department throughput is not a problem entirely internal to the ED, but that inpatient bed availability and downstream hospital capacity are central factors to the problem. The H4 analysis adds to this structural picture the dimension of demographics. The platform indicates the median LOS for ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Pediatric & Youth is 2.05 hours, for Young Adults it is 2.47 hours, for Middle Adults it is 2.73 hours and for Older Adults it is 4.17 hours. The weighted Kruskal-",
              "bold": false,
              "italic": false
            },
            {
              "text": "Walli’s",
              "bold": false,
              "italic": false
            },
            {
              "text": " test results in an effect size of ε2 = 0.7218 and all 6 pairwise comparisons are statistically significant following Bonferroni. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Older people are therefore an important operational group as their reported median stay is significantly higher than other age groups. The results in this study must not be viewed as three separate causes of congestion in the ED. Instead, there are various aspects of a single capacity battle at the system level. Higher complexity patients will need more diagnostic and clinical resources, admitted patients will be in the ED while awaiting downstream placement, and older patients may need more complex assessment and disposition planning.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Older people are therefore an important operational group as their reported median stay is significantly higher than other age groups. The results in this study must not be viewed as three separate causes of congestion in the ED. Instead, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "there",
              "bold": false,
              "italic": false
            },
            {
              "text": " are various aspects of a single capacity battle at the system level. Higher complexity patients will need more diagnostic and clinical resources, admitted patients will be in the ED while awaiting downstream placement, and older patients may need more complex assessment and disposition planning. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The results of the H3 regression again confirm that LOS is a multi-dimensional phenomenon. The platform's WLS model is more complex than the simpler CTAS-only relationship, with the addition of predictors for CTAS level, age group and visit disposition, resulting in nine encoded predictors with 10 aggregate observations and an adjusted R² of 0.8837. The platform reports positive coefficients on the non-reference CTAS categories as compared to the reference categories, and the disposition coefficients are significantly negative as compared to the admitted reference group.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The results of the H3 regression again confirm that LOS is a multi-dimensional phenomenon. The platform's WLS model is more complex than the simpler CTAS-only relationship, with the addition of predictors for CTAS level, age group and visit disposition, resulting in nine encoded predictors with 10 aggregate observations and an adjusted R² of 0.8837. The platform reports positive coefficients on the non-reference CTAS categories as compared to the reference categories, and the disposition coefficients are significantly negative as compared to the admitted reference group. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This corroborates the H2 finding that disposition status is a particularly salient aspect of the reported LOS, when all the variables are taken together. Last but not least, H5 shows the importance of separating statistical significance from operational significance. The Pearson chi-square test produces χ² = 18,164.97, df = 1, p < .0001, but the platform reports Cramér's V = 0.0102. The average rates of admission observed for female and male patients, respectively, are about 9.95% and 10.56%, with a difference of about 0.62 percentage point. This means that statistically, there is a significant association between sex, but of little practical importance for emergency-flow design purposes in the very large data set.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "This corroborates the H2 finding that disposition status is a particularly salient aspect of the reported LOS, when all the variables are taken together. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Last but not least",
              "bold": false,
              "italic": false
            },
            {
              "text": ", H5 shows the importance of separating statistical significance from operational significance. The Pearson chi-square test produces χ² = 18,164.97, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "df",
              "bold": false,
              "italic": false
            },
            {
              "text": " = 1, p < .0001, but the platform reports Cramér's V = 0.0102. The average rates of admission observed for female and male patients, respectively, are about 9.95% and 10.56%, with a difference of about 0.62 percentage point. This means that statistically, there is a significant association between sex, but of little practical importance for emergency-flow design purposes in the very large data set.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "8.2 Comparison with Existing Literature",
          "align": "justify",
          "runs": [
            {
              "text": "8.2 Comparison with Existing Literature",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 52,
      "chapter": "Chapter 8",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "These findings are like those in the Canadian emergency-care literature, especially the literature reporting on the issue of emergency department overcrowding as a problem of the health system, not just the emergency department (ED). Previous studies conducted in Canada have pointed to access block and delayed inpatient placement as key factors associated with ED crowding (Affleck et al., 2013; Li et al., 2026). This is reinforced by the present analysis that shows a large separation between admitted and non-admitted visits in the H2 analysis.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "These findings are ",
              "bold": false,
              "italic": false
            },
            {
              "text": "like",
              "bold": false,
              "italic": false
            },
            {
              "text": " those in the Canadian emergency-care literature, especially the literature reporting on the issue of emergency department overcrowding as a problem of the health system, not just the emergency department (ED). Previous studies conducted in Canada have pointed to access block and delayed inpatient placement as key factors associated with ED ",
              "bold": false,
              "italic": false
            },
            {
              "text": "crowding (Affleck et al., 2013; Li et al., 2026). This is reinforced by the present analysis that shows a large separation between admitted and non-admitted visits in the H2 analysis. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The rᵦ of 0.9981 for this platform suggests that the separation is not just statistically significant because of the large dataset, but also a significant separation in the reported LOS distributions. The age results are also generally consistent with previous studies that have documented the extra demands on the operational aspects of older populations attending A&E departments. The Older Adult cohort reports a median LOS of 4.17 hours, whereas Pediatric & Youth reports 2.05 hours. This difference is large, not just a function of sample size, based on the large H4 effect size in the aggregate reporting data.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The rᵦ of 0.9981 for this platform suggests that the separation is not just statistically significant ",
              "bold": false,
              "italic": false
            },
            {
              "text": "because of",
              "bold": false,
              "italic": false
            },
            {
              "text": " the large dataset, but also a significant separation in the reported LOS distributions. The age results are also generally consistent with previous studies that have documented the extra demands on the operational aspects of older populations attending A&E departments. The Older Adult cohort reports a median LOS of 4.17 hours, whereas Pediatric & Youth reports 2.05 hours. This difference is large, not just a function of sample size, based on the large H4 effect size in the aggregate reporting data. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The H1 results give another operating perspective. The median LOS for the platform is the longest for the CTAS III — Urgent (3.70 hours) and is close to 3.60 hours for the CTAS II — Emergent. This shows that the highest clinical acuity category doesn't always correspond to the highest aggregate throughput burden. Very high-quality patients may be stabilized and disposed immediately, while many patients who are urgent and emergent can be kept in the department to be investigated, consulted, treated and dispositioned.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The H1 results give another operating perspective. The median LOS for the platform is the longest for the CTAS III — Urgent (3.70 hours",
              "bold": false,
              "italic": false
            },
            {
              "text": ") and",
              "bold": false,
              "italic": false
            },
            {
              "text": " is close to 3.60 hours for the CTAS II — Emergent. This shows that the highest clinical acuity category doesn't always correspond to the highest aggregate throughput burden. Very ",
              "bold": false,
              "italic": false
            },
            {
              "text": "high-quality",
              "bold": false,
              "italic": false
            },
            {
              "text": " patients may be stabilized and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "disposed",
              "bold": false,
              "italic": false
            },
            {
              "text": " immediately, while many patients who are urgent and emergent can be kept in the department to be investigated, consulted, treated and dispositioned. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The H5 result illustrates the difference between statistical and substantive significance. It is possible to obtain very small P-values for differences with little operational significance in large health care databases. The significance of the results (p < .0001) and the effect size (Cramér's V = 0.0102) indicate why effect-size measures are essential to interpret large administrative data sets.",
          "align": "justify",
          "runs": [
            {
              "text": "The H5 result illustrates the difference between statistical and substantive significance. It is possible to obtain very small P-values for differences with little operational significance in large health care databases. The significance of the results (p < .0001) and the effect size (Cramér's V = 0.0102) indicate why effect-size measures are essential to interpret large administrative data sets.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "8.3 Methodological Strengths",
          "align": "justify",
          "runs": [
            {
              "text": "8.3 Methodological Strengths",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The analysis was reliable and repeatable due to several methodological strengths. First, the analysis treats every visit-count observation as a valid data point, instead of treating each aggregate reporting row as an equal observation. This helps to avoid the small reporting stratum being represented by the same statistical influence as a stratum with a significantly higher number of visits to the emergency department. The resulting estimates are then closer to the actual population that the CIHI aggregate data represent.",
          "align": "justify",
          "runs": [
            {
              "text": "The analysis was reliable and repeatable due to several methodological strengths. First, the analysis treats every visit-count observation as a valid data point, instead of treating each aggregate reporting row as an equal observation. This helps to avoid the small reporting stratum being represented by the same statistical influence as a stratum with a significantly higher number of visits to the emergency ",
              "bold": false,
              "italic": false
            },
            {
              "text": "department. The",
              "bold": false,
              "italic": false
            },
            {
              "text": " resulting estimates are then closer to the actual population that the CIHI aggregate data represent. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The use of non-parametric methods is justified in the context of emergency department LOS data, due to the lack of normality assumptions. The aggregate distributions of LOS are more appropriate compared with weighted Kruskal-Wallis and Mann-Whitney procedures and effect-size measures are used to describe information beyond simply determining statistical significance.",
          "align": "justify",
          "runs": [
            {
              "text": "The ",
              "bold": false,
              "italic": false
            },
            {
              "text": "use of non-parametric methods is justified in the context of emergency department LOS data, due to the lack of normality assumptions. The aggregate distributions of LOS are more ",
              "bold": false,
              "italic": false
            },
            {
              "text": "appropriate",
              "bold": false,
              "italic": false
            },
            {
              "text": " compared with weighted Kruskal-Wallis and Mann-Whitney procedures and effect-size measures are used to describe information beyond simply determining statistical significance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 53,
      "chapter": "Chapter 8",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The H3 analysis goes beyond a one-variable comparison. Both the CTAS level and age group are considered along with the disposition in the platform's WLS model. The adjusted R² of 0.8837 for the model implemented at the aggregate level shows that the model explains a significant amount of the variance observed in the ten observations for that model.",
          "align": "justify",
          "runs": [
            {
              "text": "T",
              "bold": false,
              "italic": false
            },
            {
              "text": "he H3 analysis goes beyond a one-variable comparison. Both the CTAS level and age group are ",
              "bold": false,
              "italic": false
            },
            {
              "text": "considered",
              "bold": false,
              "italic": false
            },
            {
              "text": " along with the disposition in the platform's WLS model. The adjusted R² of 0.8837 for the model implemented at the aggregate level shows that the model explains a significant amount of the variance observed in the ten observations for that model. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The entire analytical process is programmed and repeatable, from the preparation of the source data to the creation of the database and computation of statistics. The project also involves around three hundred automated tests, which also constitute a layer of computational validation. Finally, the platform architecture distinguishes between a baseline research cohort and user uploaded datasets that are read-only. This enables exploratory analysis without changing the data set that the reported research results are based on, safeguarding the repeatability of the research outcomes.",
          "align": "justify",
          "runs": [
            {
              "text": "T",
              "bold": false,
              "italic": false
            },
            {
              "text": "he entire analytical process is programmed and repeatable, from the preparation of the source data to the creation of the database and computation of statistics. The project also involves around three hundred automated tests, which also constitute a layer of computational validation. Finally, the platform architecture distinguishes between a baseline research cohort and user uploaded datasets that are read-only. This enables exploratory analysis without changing the data set that the reported research results are based on, safeguarding the repeatability of the research outcomes.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "8.4 Limitations",
          "align": "justify",
          "runs": [
            {
              "text": "8.4 Limitations ",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The findings are limited by several factors. The greatest constraint is that the data in the underlying CIHI are aggregate stratum-level data, not observations of patients. Frequency weighting will improve population representation but won't transform aggregate records to individual patient records. Thus, these results should not be interpreted as representing the typical LOS of any given patient. The source tables also lack identifiers at the hospital or geographic level that can be used to model variation between hospitals or by geography.",
          "align": "justify",
          "runs": [
            {
              "text": "The findings are limited by several factors. The greatest constraint is that the data in the underlying CIHI are aggregate stratum-level data, not observations of patients. Frequency weighting will improve population representation but won't transform aggregate records to individual patient records. Thus, these results should not be interpreted as representing the typical LOS of any given patient. The source tables also lack identifiers at the hospital or geographic level that can be used to model variation between hospitals or by geography. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Thus, the analysis does not allow for conclusions to be drawn as to which facility types, provinces or individual hospitals are responsible for which patterns in the overall results. The analysis is descriptive in nature. The statistically significant relationships found in H1–H5 show association but not causation.",
          "align": "justify",
          "runs": [
            {
              "text": "Thus, the analysis does not allow for conclusions to be drawn as to which facility types, provinces or individual hospitals are responsible for which patterns in the overall results. The analysis is descriptive in nature. The statistically significant relationships found in H1–H5 show association but not causation. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "For instance, the admitted/non-admitted visit difference is very large and provides for a very good correlation between disposition and LOS, but the overall analysis will not be able to independently establish each of the mechanisms for that difference. An important structural limitation of the H3 regression is also the same. The model applies the categorical representation of clinical complexity implemented via CTAS, age, and disposition, not a full patient-level representation.",
          "align": "justify",
          "runs": [
            {
              "text": "For instance, the admitted/non-admitted visit difference is very large and provides for a very good correlation between disposition and LOS, but the overall analysis will not be able to independently establish each of the mechanisms for that difference. An important structural limitation of the H3 regression is also the same. The model applies the categorical representation of clinical complexity implemented via CTAS, age, and disposition, not a full patient-level representation. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 54,
      "chapter": "Chapter 8",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Thus, the CTAS representation is a planning level predictor, rather than a full clinical model. The results should only be interpreted as relationships in the overall data set, and not as a clinical prediction model. The source tables are also not populated with outcomes like mortality, readmission or ICU transfer. The project does, therefore, not measure the clinical outcomes directly, but instead assesses throughput, LOS, admission and resource burden. Another drawback is the limited period over which the observations were made (nineteen years).",
          "align": "justify",
          "runs": [
            {
              "text": "Thus, the CTAS representation is a planning level predictor, rather than a full clinical model. The results should only be interpreted as relationships in the overall data set, and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "not as a clinical prediction model. The source tables are also not populated with outcomes like mortality, readmission or ICU transfer. The project does, therefore, not measure the clinical outcomes directly, but instead assesses throughput, LOS, admission and resource burden. Another drawback is the limited period over which the observations were made (nineteen years). ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Observed changes in the number of visits over time may be due to changes in the coverage of the NACRS and participation by facilities. The preparation pipeline standardizes the source tables and filters out summary roll-up data, but it is not possible to fully differentiate between changes in national demand and changes in reporting coverage within the analysis. Lastly, the Estimated Resource Burden Index (ERBI) is not a clinical or financial metric but rather an analytical proxy used to project the burden of a project. It is appropriate to compare the relative change in acuity-weighted burden within this project, but should not be regarded as absolute staffing needs, cost or clinically validated burden.",
          "align": "justify",
          "runs": [
            {
              "text": "Observed changes in the number of visits over time may be due to changes in the coverage of the NACRS and participation by facilities. The preparation pipeline standardizes the source tables and filters out summary roll-up data, but it is not possible to fully differentiate between changes in national demand and changes in reporting coverage within the analysis. Lastly, the Estimated Resource Burden Index (ERBI) is not a clinical or financial metric but rather an analytical proxy used to project the burden of a project. It is appropriate to compare the relative change in acuity-weighted burden within this project, but should not be regarded as absolute staffing needs, cost or clinically validated burden. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Overall, these restrictions do not undermine the results but indicate the level of interpretation that should be made. The evidence is strongest for use as a system level planning and decision support process, and not as a single clinical prediction system.",
          "align": "justify",
          "runs": [
            {
              "text": "Overall, these restrictions do not undermine the results but indicate the level of interpretation that should be made. The evidence is strongest for use as a system level planning and decision support process, and not as a single clinical prediction system. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 55,
      "chapter": "Chapter 9",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Chapter 9: Strategic Recommendations and Implementation Roadmap",
          "align": "justify",
          "runs": [
            {
              "text": "     ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Chapter 9: Strategic Recommendations and Implementation Roadmap",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "9.1 Restating the Core Findings",
          "align": "justify",
          "runs": [
            {
              "text": "9.1 Restating the Core Findings",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The findings highlight three key operational levers that hospital and health-system executives can deploy:",
          "align": "justify",
          "runs": [
            {
              "text": "The findings highlight three key operational levers that hospital and health-system executives can deploy: ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Clinical and diagnostic complexity, admissions and downstream capacity, and the disproportionate throughput demands of older adults.",
          "align": "justify",
          "runs": [
            {
              "text": "C",
              "bold": false,
              "italic": false
            },
            {
              "text": "linical and diagnostic complexity, admissions and downstream capacity, and the disproportionate throughput demands of older adults. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The results of the H1 analysis reveal that there are significant differences in the reported median length of stay reported by the different levels of CTAS acuity, and that the groups with the longest reported median length of stay are those in CTAS III — Urgent at 3.70 hours, and CTAS II — Emergent at 3.60 hours. The effect size (ε²) of 50.0 is large and suggests that category of acuity has a significant association with ED throughput.",
          "align": "justify",
          "runs": [
            {
              "text": "The results of the H1 analysis reveal that there are significant differences in the reported median length of stay reported by the different levels of CTAS acuity, and that the groups with the longest reported median length of stay are those in CTAS III — Urgent at 3.70 hours, and CTAS II — Emergent at 3.60 hours. The effect size (ε²) of 50.0 is large and suggests that category of acuity has a significant association with ED throughput. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The H2 analysis reflects an even greater operational split in admitted vs. non-admitted patients. The platform has a large LOS difference and a rank-biserial correlation of 0.9981, suggesting that prolonged ED occupation is strongly related to admission status. This discovery highlights the need to consider hospital-wide bed availability and downstream flow but not solely in relation to the emergency department.",
          "align": "justify",
          "runs": [
            {
              "text": "The H2 analysis reflects an even greater operational split in admitted vs. non-admitted patients. The platform has a large LOS difference and a rank-biserial correlation of 0.9981, suggesting that prolonged ED occupation is strongly related to admission status. This discovery highlights the need to consider hospital-wide bed availability and downstream flow but not solely in relation to the emergency department. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "In addition, the H4 analysis classifies older adults as an important population for intervention. The platform reports median LOS of 4.17 hours for Older Adults and 2.05 hours for Pediatric & Youth, resulting in a large effect size of about ε² = 0.7218. In contrast, H5 shows that biological sex does not operate as a concept in practice. The association is statistically significant due to the large size of the sample, but Cramér's V = 0.0102 showing that the effect is very small.",
          "align": "justify",
          "runs": [
            {
              "text": "In addition, the H4 analysis classifies older adults as an important population for intervention. The platform reports median LOS of 4.17 hours for Older Adults and 2.05 hours for Pediatric & Youth, resulting in a large effect size of about ε² = 0.7218. In contrast, H5 shows that biological sex does not operate as a concept in practice. The association is statistically significant due to the large size of the sample, but Cramér's V = 0.0102 showing that the effect is very small. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "It's an additional planning signal in the longitudinal analysis. ERBI increased from 5.21 in FY 2003–2004 to 9.32 in FY 2021–2022, with a Mann–Kendall τ = 0.9766 and p < .0001. The ERBI values for FY 2022–2023 and FY 2023–2024 are then both estimated at 9.32 using Simple Exponential Smoothing (SES), which carries the latest observed value forward as its point forecast.",
          "align": "justify",
          "runs": [
            {
              "text": "It's an additional planning signal in the longitudinal analysis. ERBI increased from 5.21 in FY 2003–2004 to 9.32 in FY 2021–2022, with a Mann–Kendall τ = 0.9766 and p < .0001. The ERBI values for FY 2022–2023 and FY 2023–2024 are then both estimated at 9.32 using Simple Exponential Smoothing (SES), which carries the latest observed value forward as its point forecast. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "These results all suggest that the level of pressure in an ED is a multidimensional system problem. The recommendations presented are thus grouped by implementation time frame, starting with interventions that can be taken relatively soon, and then moving towards longer-term structural and analytical governance.",
          "align": "justify",
          "runs": [
            {
              "text": "These results all suggest that the level of pressure in an ED is a multidimensional system problem. The recommendations presented are thus grouped by implementation time frame, starting with interventions that can be taken relatively soon, and then moving towards longer-term structural and analytical governance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 56,
      "chapter": "Chapter 9",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "9.2 Tiered Recommendations",
          "align": "center",
          "runs": [
            {
              "text": "9.2 Tiered Recommendations",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Fast-Track Pathways for Low-Acuity Presentations — Months 1–6",
          "align": "justify",
          "runs": [
            {
              "text": "Fast-Track Pathways for Low-Acuity Presentations — Months 1–6",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Patients in the CTAS IV and V groups make up a significant percentage of ED use but reported median LOS is significantly shorter than the higher acuity groups. Having specific pathways for rapid assessment at high points of arrival may enable lower-level presentations to be assessed and sorted and not use the same resources that are allocated for cases of high acuity.",
          "align": "justify",
          "runs": [
            {
              "text": "Patients in the CTAS IV and V groups make up a significant percentage of ED use but reported median LOS is significantly shorter than the higher acuity groups. Having specific pathways for rapid assessment at high points of arrival may enable ",
              "bold": false,
              "italic": false
            },
            {
              "text": "lower-level",
              "bold": false,
              "italic": false
            },
            {
              "text": " presentations to be assessed and ",
              "bold": false,
              "italic": false
            },
            {
              "text": "sorted and",
              "bold": false,
              "italic": false
            },
            {
              "text": " not use the same resources that are allocated for cases of high acuity.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Potential interventions include Rapid assessment areas dedicated to CTAS IV and V presentations. Nurse-initiated assessment protocols. Complaint process: consistent procedures for routine common complaints. Immediate referral to community or ambulatory services as appropriate, when clinically indicated. Ongoing tracking of LOS and patients who are missing.",
          "align": "justify",
          "runs": [
            {
              "text": "Potential interventions ",
              "bold": false,
              "italic": false
            },
            {
              "text": "include",
              "bold": false,
              "italic": false
            },
            {
              "text": " Rapid assessment areas dedicated to CTAS IV and V presentations. Nurse-initiated assessment protocols. Complaint process: consistent procedures for routine common complaints. Immediate referral to community or ambulatory services as appropriate, when clinically indicated. Ongoing tracking of LOS and patients who are ",
              "bold": false,
              "italic": false
            },
            {
              "text": "missing",
              "bold": false,
              "italic": false
            },
            {
              "text": ".",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The aim is not to compromise the quality of care given to patients with lower acuity, but to ensure that the care pathway is right for the patient's clinical needs and not unnecessarily competing for acute-care resources.",
          "align": "justify",
          "runs": [
            {
              "text": "The aim is not to compromise the quality of care given to patients with lower acuity, but to ensure that the care pathway is right for the patient's clinical needs and not unnecessarily competing for acute-care resources.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Implementations of Bed-Management Reform within inpatient services (Months 6–18)",
          "align": "justify",
          "runs": [
            {
              "text": "Implementations of Bed-Management Reform within inpatient services ",
              "bold": true,
              "italic": false
            },
            {
              "text": "(",
              "bold": true,
              "italic": false
            },
            {
              "text": "Months 6–18",
              "bold": true,
              "italic": false
            },
            {
              "text": ")",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Admission status is one of the strongest relationships with ED LOS as identified by the H2 findings. Therefore, interventions beyond the emergency department are needed to reduce the number of people being boarded in the ED.",
          "align": "justify",
          "runs": [
            {
              "text": "Admission status is one of the strongest relationships with ED LOS as identified by the H2 findings. Therefore, interventions beyond the emergency department are needed to reduce the number of people being boarded in the ED.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Potential interventions include:",
          "align": "justify",
          "runs": [
            {
              "text": "Potential interventions include:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Setting targets for discharge from hospital each day.",
          "align": "justify",
          "runs": [
            {
              "text": "Setting targets for discharge from hospital each day.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "To ramp up proportion of discharges completed in the morning.",
          "align": "justify",
          "runs": [
            {
              "text": "To ramp up proportion of discharges completed in the morning.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Establishing a stable patient discharge lounge that is staffed with a nurse.",
          "align": "justify",
          "runs": [
            {
              "text": "Establishing a stable patient discharge lounge that is staffed with a nurse.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Real-time monitoring of inpatient bed availability.",
          "align": "justify",
          "runs": [
            {
              "text": "Real-time monitoring of ",
              "bold": false,
              "italic": false
            },
            {
              "text": "inpatient",
              "bold": false,
              "italic": false
            },
            {
              "text": " bed availability.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Setting up automatic alerts for long hospital stay in the emergency department. Creating automated escalation alerts for extended hospital stays in the emergency department.",
          "align": "justify",
          "runs": [
            {
              "text": "Setting up automatic alerts for long hospital stay in the emergency department. Creating automated escalation alerts for extended hospital stays in the emergency department.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Planning for emergency and in-patient flow, based on known peaks of admissions.",
          "align": "justify",
          "runs": [
            {
              "text": "Planning for emergency and in-patient flow, based on known peaks of admissions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "One target for a morning discharge might aim for 30% of planned discharges to be completed before 11:00 a.m. This would increase available inpatient bed space prior to the time of year when admission demand to the ED is likely to peak. The overall goal is to decrease the length of time after clinical determination of admission that admitted patients spend in emergency department spaces.",
          "align": "justify",
          "runs": [
            {
              "text": "One target for a morning discharge might aim for 30% of planned discharges to be completed before 11:00 a.m. This would increase available inpatient bed space prior to the time of year when admission demand to the ED is likely to peak. The overall goal is to decrease the length of time after clinical determination of admission that admitted patients spend in emergency department spaces.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 57,
      "chapter": "Chapter 9",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Automated Bed-Tracking and Boarding Alerts (Months 12–18)",
          "align": "justify",
          "runs": [
            {
              "text": "Automated Bed-Tracking and Boarding Alerts ",
              "bold": true,
              "italic": false
            },
            {
              "text": "(",
              "bold": true,
              "italic": false
            },
            {
              "text": "Months 12–18",
              "bold": true,
              "italic": false
            },
            {
              "text": ")",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The statistical results show a need for real-time operational visibility to support downstream capacity. A specific bed-management component could merge the inpatient capacity data with boarding data from the ED.",
          "align": "justify",
          "runs": [
            {
              "text": "The statistical results show a need for real-time operational visibility to support downstream capacity. A specific bed-management component could merge the inpatient capacity data with boarding data from the ED.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The proposed system would:",
          "align": "justify",
          "runs": [
            {
              "text": "The proposed system would:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Find patients who have completed admission decision.",
          "align": "justify",
          "runs": [
            {
              "text": "Find patients who have completed admission decision.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Monitor the length of stay in the Emergency Department.",
          "align": "justify",
          "runs": [
            {
              "text": "Monitor the length of stay in the Emergency Department.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Post current inpatient bed availability.",
          "align": "justify",
          "runs": [
            {
              "text": "Post current inpatient bed availability.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Refer long boarding cases to appropriate flow coordinator.",
          "align": "justify",
          "runs": [
            {
              "text": "Refer long boarding cases to appropriate flow coordinator.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Report on aggregate boarding data to the operational level.",
          "align": "justify",
          "runs": [
            {
              "text": "Report on aggregate boarding data to the operational level.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The escalation could be set to four hours and further escalation if the time reaches six hours. Thereafter, thresholds should be evaluated based on observed operational performance.",
          "align": "justify",
          "runs": [
            {
              "text": "The escalation could be set to four hours and further escalation if the time reaches six hours. Thereafter, thresholds should be evaluated based on observed operational performance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This intervention would transform the analytical finding in terms of admission related LOS to a continuous operational monitoring process.",
          "align": "justify",
          "runs": [
            {
              "text": "This intervention would transform the analytical finding in terms of admission related LOS to a continuous operational monitoring process.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Geriatric Emergency Management (Months 18–36)",
          "align": "justify",
          "runs": [
            {
              "text": "Geriatric Emergency Management ",
              "bold": true,
              "italic": false
            },
            {
              "text": "(",
              "bold": true,
              "italic": false
            },
            {
              "text": "Months 18–36",
              "bold": true,
              "italic": false
            },
            {
              "text": ")",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The H4 analysis categorizes older people as a population that is of special interest in terms of emergency department flow management. The platform records a median LOS of 4.17 hours for Older Adults, significantly longer than the median LOS of 2.05 hours for Pediatric & Youth and has a large effect size.",
          "align": "justify",
          "runs": [
            {
              "text": "The H4 analysis ",
              "bold": false,
              "italic": false
            },
            {
              "text": "categorizes",
              "bold": false,
              "italic": false
            },
            {
              "text": " older people as a population that is of special interest in terms of emergency department flow management. The platform records a median LOS of 4.17 hours for Older Adults, significantly longer than the median LOS of 2.05 hours for Pediatric & ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Youth and",
              "bold": false,
              "italic": false
            },
            {
              "text": " has a large effect size. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A dedicated Geriatric Emergency Management pathway may comprise of the following:",
          "align": "justify",
          "runs": [
            {
              "text": "A dedicated Geriatric Emergency Management pathway may comprise of the following:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Comprehensive geriatric assessment carried out in a short time.",
          "align": "justify",
          "runs": [
            {
              "text": "Comprehensive geriatric assessment carried out in a short time.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Geriatric liaison services by a nurse.",
          "align": "justify",
          "runs": [
            {
              "text": "Geriatric liaison services by a nurse.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Early recognition of functional and social-care needs.",
          "align": "justify",
          "runs": [
            {
              "text": "Early recognition of functional and social-care needs.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Direct referral to community or sub-acute services.",
          "align": "justify",
          "runs": [
            {
              "text": "Direct referral to community or ",
              "bold": false,
              "italic": false
            },
            {
              "text": "sub-acute",
              "bold": false,
              "italic": false
            },
            {
              "text": " services.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Optimized diagnostic pathways when clinically appropriate.",
          "align": "justify",
          "runs": [
            {
              "text": "Optimized",
              "bold": false,
              "italic": false
            },
            {
              "text": " diagnostic pathways when clinically appropriate.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Early coordination of inpatient and community care providers.",
          "align": "justify",
          "runs": [
            {
              "text": "Early coordination of inpatient and community care providers.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Review of potentially avoidable admissions.",
          "align": "justify",
          "runs": [
            {
              "text": "Review of potentially avoidable admissions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The goal would be to cut down on unneeded delays but still to provide the proper assessment and disposition planning for the older patient.",
          "align": "justify",
          "runs": [
            {
              "text": "The goal would be to cut down on unneeded delays but still to provide the proper assessment and disposition planning for the older patient.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 58,
      "chapter": "Chapter 9",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Ongoing Analytics Governance",
          "align": "justify",
          "runs": [
            {
              "text": "Ongoing Analytics Governance",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The historical ERBI analysis shows that burden of emergency department resources is variable over time. The platform can be used for ongoing monitoring, then, instead of one-time monitoring. Future governance will involve regular monitoring of:",
          "align": "justify",
          "runs": [
            {
              "text": "The historical ERBI analysis shows that burden of emergency department resources is variable over time. The platform can be used for ongoing monitoring, then, instead of one-time monitoring. Future governance will involve regular monitoring of:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Median hospital visit length of stay in the emergency department.",
          "align": "justify",
          "runs": [
            {
              "text": "Median hospital visit length of stay in the emergency department.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Higher-percentile LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "Higher-percentile LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Admission-related boarding duration.",
          "align": "justify",
          "runs": [
            {
              "text": "Admission-related boarding duration.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS-specific LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS-specific LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Age-specific LOS.",
          "align": "justify",
          "runs": [
            {
              "text": "Age-specific LOS.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Patients walking out without being encountered.",
          "align": "justify",
          "runs": [
            {
              "text": "Patients walking out without being encountered.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Patients walking away without being seen.",
          "align": "justify",
          "runs": [
            {
              "text": "Patients walking away without being seen.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "ERBI.",
          "align": "justify",
          "runs": [
            {
              "text": "ERBI.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Forecast accuracy.",
          "align": "justify",
          "runs": [
            {
              "text": "Forecast accuracy.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Variability in the numbers attending the ED.",
          "align": "justify",
          "runs": [
            {
              "text": "Variability in the numbers attending the ED.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The ERBI should be updated as new CIHI data are available and the forecasting model should be updated to reflect the longer historical time series. As ERBI is a project-specific planning proxy, governance should also ensure that it is read in conjunction with the conventional operational measures, and not in isolation to the measures of the hospital performance.",
          "align": "justify",
          "runs": [
            {
              "text": "The ERBI should be updated as new CIHI data are ",
              "bold": false,
              "italic": false
            },
            {
              "text": "available",
              "bold": false,
              "italic": false
            },
            {
              "text": " and the forecasting model should be updated to reflect the longer historical time series. As ERBI is a project-specific planning proxy, governance should also ensure that it is read in conjunction with the conventional operational measures, and not in isolation to the measures of the hospital performance.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "9.3 Strategic Implementation Roadmap",
          "align": "justify",
          "runs": [
            {
              "text": "9.3 Strategic Implementation Roadmap",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Phase",
            "Timeline",
            "Intervention",
            "Primary Success Measure",
            "Responsible Role"
          ],
          "rows": [
            [
              "1",
              "Months 1–6",
              "Rapid-assessment zones for CTAS IV/V",
              "Reduction in non-urgent median LOS",
              "Clinical Director, Emergency Medicine"
            ],
            [
              "2",
              "Months 6–18",
              "Discharge lounge and morning discharge target",
              "≥30% planned discharges before 11:00 a.m.; reduced boarding",
              "VP Clinical Operations / CMO"
            ],
            [
              "3",
              "Months 12–18",
              "Automated bed tracking and boarding alerts",
              "Real-time bed visibility; prolonged boarding escalated",
              "CIO / Flow Coordinator"
            ],
            [
              "4",
              "Months 18–36",
              "Geriatric Emergency Management pathways",
              "Reduction in older-adult median LOS",
              "Director, Geriatric & Emergency Medicine"
            ],
            [
              "5",
              "Ongoing",
              "Enterprise ERBI monitoring and forecasting",
              "Forecast performance and continuous burden monitoring",
              "Lead Data Scientist / Quality Committee"
            ]
          ]
        },
        {
          "type": "p",
          "text": "The roadmap is intentionally designed to allow for relatively simple operational interventions to commence before the more complicated infrastructure of organizations and analysis is fully developed. The first phase is dedicated to making a distinction between low acuity demand and the resources for acute care. Both the second and third phases solve the downstream inpatient-flow problem that was stressed most by H2. The fourth phase aims for the older-adult population targeted by H4. The final phase is used to set up continuous measurement and forecasting to see if the interventions lead to sustained improvement.",
          "align": "justify",
          "runs": [
            {
              "text": "The roadmap is intentionally designed to allow for relatively simple operational interventions to commence before the more complicated infrastructure of organizations and analysis is fully developed. The first phase is dedicated to making a distinction between low acuity demand and the resources for acute care. Both the second and third phases solve the downstream inpatient-flow problem that was stressed most by H2. The fourth phase aims for the older-adult population targeted by H4. The final phase is used to set up continuous measurement and forecasting to see if the interventions lead to sustained improvement.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "9.4 Measuring Implementation Success",
          "align": "justify",
          "runs": [
            {
              "text": "9.4 Measuring Implementation Success",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Measurement of the implementation should be based on operational measures that are measurable rather than simply based on the introduction of the intervention. The major measures for low-acuity pathways should be median LOS for CTAS IV and V patients, time to initial assessment, and percent of patients leaving without being assessed.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Measurement of the implementation should be based on operational measures that are measurable rather than simply based on the introduction of the intervention. The major measures for low-acuity pathways should be median LOS for CTAS IV and V patients, time to initial assessment, and percent of patients leaving without being assessed. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The key performance measures for inpatient-flow interventions should be: median time to admit discharge (before the morning discharge target); percentage of planned discharges completed prior to the morning admit discharge target; percentage of time emergency department (ED) beds filled by admitted patients; and number of boarding cases above ascending levels of escalation thresholds.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The key performance measures for inpatient-flow interventions should ",
              "bold": false,
              "italic": false
            },
            {
              "text": "be:",
              "bold": false,
              "italic": false
            },
            {
              "text": " median time to admit discharge (before the morning discharge target); percentage of planned discharges completed prior to the morning admit discharge target; percentage of time emergency department (ED) beds filled by admitted patients; and number of boarding cases above ascending levels of escalation thresholds. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Geriatric interventions should be assessed by older adult median LOS, time to assessment, admission rates, and appropriate post discharge or sub-acute referrals. At the enterprise level, the ERBI should give an added longitudinal sense of a desired direction of the overall resource burden. The performance of forecasts should also be assessed from the rear in order to adjust forecasting parameters for future forecasts in the light of new observations.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Geriatric interventions should be assessed by older adult median LOS, time to assessment, admission rates, and appropriate post discharge or sub-acute referrals. At the enterprise level, the ERBI should give an added longitudinal sense of a desired direction ",
              "bold": false,
              "italic": false
            },
            {
              "text": "of",
              "bold": false,
              "italic": false
            },
            {
              "text": " the overall resource burden. The performance of forecasts should also be assessed from the rear ",
              "bold": false,
              "italic": false
            },
            {
              "text": "in order to",
              "bold": false,
              "italic": false
            },
            {
              "text": " adjust forecasting parameters for future forecasts in the light of new observations.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "9.5 Closing Note",
          "align": "justify",
          "runs": [
            {
              "text": "9.5 Closing Note",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": true,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Collectively, this project highlights that, over 19 years of CIHI NACRS aggregate health data, an analytical framework that is reproducible and has been applied across a range of frequencies can shift the focus of emergency department planning from a descriptive to an evidence-based approach.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Collectively, this project highlights that, over 19 years of CIHI NACRS aggregate health data, an analytical framework that is reproducible and has been applied across a range of frequencies can shift the focus of emergency department planning from a descriptive to an evidence-based approach. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 59,
      "chapter": "Chapter 9",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "The findings highlight multiple operational priorities, which are interdependent but distinct. More complex clinical and diagnostic presentations are associated with longer lengths of stay; boarding due to lack of inpatient capacity and admission-related boarding is a significant downstream problem; and older adults have significantly longer reported lengths of stay than younger age groups.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The findings highlight multiple operational priorities, which are interdependent but distinct. More complex clinical and diagnostic presentations are associated with longer lengths of stay; boarding due to lack of inpatient capacity and admission-related boarding is a significant ",
              "bold": false,
              "italic": false
            },
            {
              "text": "downstream problem; and older adults have significantly longer reported lengths of stay than younger age groups. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Concurrently, the fact that the effect of biological sex is small, further indicates that not every statistically significant relationship will be an operation priority. The longitudinal analysis provides a much-needed forward-looking perspective. The ERBI rose from 5.21 to 9.32 during the period observed; a very strong positive trend (τ = 0.9766, p < .0001) was detected by the Mann–Kendall test.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Concurrently, the fact that the effect of biological sex is small, further indicates that not every statistically significant relationship will be an operation priority. The longitudinal analysis provides a much-needed forward-looking perspective. The ERBI rose from 5.21 to 9.32 during the period observed; a very strong positive trend (τ = 0.9766, p < .0001) was detected by the Mann–Kendall test. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The platform's forecasts for the next two fiscal years are ERBI of 9.32 and 9.32. These findings further highlight the importance of having a capacity planning process that considers the acuity and length of emergency department visits as well as the number of visits. The implementation roadmap for the proposed solution is thus composed of a series of quick assessment pathways, the reform of inpatient flow, automatic boarding monitoring, geriatric emergency management and continuous analytics governance. These interventions create a safe, systematic plan for turning statistical results from this project into measurable operational action.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The platform's forecasts for the next two fiscal years are ERBI of 9.32 and 9.32. These findings further highlight the importance of having a capacity planning process that ",
              "bold": false,
              "italic": false
            },
            {
              "text": "considers",
              "bold": false,
              "italic": false
            },
            {
              "text": " the acuity and length of emergency department visits as well as the number of visits. The implementation roadmap for the proposed solution is thus composed of a series of quick assessment pathways, the reform of inpatient flow, automatic boarding monitoring, geriatric emergency management and continuous analytics governance. These interventions create a safe, systematic plan for turning statistical results from this project into measurable operational action.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 60,
      "chapter": "References",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "References",
          "align": "justify",
          "runs": [
            {
              "text": "        ",
              "bold": true,
              "italic": false
            },
            {
              "text": "References",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Affleck, A., Parks, P., Drummond, A., Unger, B., & Ovens, H. (2013). Emergency department overcrowding and access block. Canadian Journal of Emergency Medicine, 15(6), 359–370. https://doi.org/10.2310/8000.2013.130954",
          "align": "justify",
          "runs": [
            {
              "text": "Affleck, A., Parks, P., Drummond, A., Unger, B., & Ovens, H. (2013). Emergency department overcrowding and access block. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Canadian Journal of Emergency Medicine, 15",
              "bold": false,
              "italic": true
            },
            {
              "text": "(6), 359–370. https://doi.org/10.2310/8000.2013.130954",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Alnahari, A., & A'aqoulah, A. (2024). Influence of demographic factors on prolonged length of stay in an emergency department. PLOS ONE, 19(3), e0298598. https://doi.org/10.1371/journal.pone.0298598",
          "align": "justify",
          "runs": [
            {
              "text": "Alnahari",
              "bold": false,
              "italic": false
            },
            {
              "text": ", A., & ",
              "bold": false,
              "italic": false
            },
            {
              "text": "A'aqoulah",
              "bold": false,
              "italic": false
            },
            {
              "text": ", A. (2024). Influence of demographic factors on prolonged length of stay in an emergency department. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "PLOS ONE, 19",
              "bold": false,
              "italic": true
            },
            {
              "text": "(3), e0298598. https://doi.org/10.1371/journal.pone.0298598",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Beveridge, R., Clarke, B., Janes, L., Savage, N., Thompson, J., Dodd, G., Murray, M., Jordan, S., Warren, D., & Vadeboncoeur, A. (1998). Canadian Emergency Department Triage and Acuity Scale: Implementation guidelines. Canadian Journal of Emergency Medicine, 1(3, Suppl.).",
          "align": "justify",
          "runs": [
            {
              "text": "Beveridge, R., Clarke, B., Janes, L., Savage, N., Thompson, J., Dodd, G., Murray, M., Jordan, S., Warren, D., & Vadeboncoeur, A. (1998). Canadian Emergency Department Triage and Acuity Scale: Implementation guidelines. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Canadian Journal of Emergency Medicine, 1",
              "bold": false,
              "italic": true
            },
            {
              "text": "(3, Suppl.).",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Canadian Institute for Health Information. (2024). Emergency department crowding: Beyond primary care access. CIHI.",
          "align": "justify",
          "runs": [
            {
              "text": "Canadian Institute for Health Information. (2024). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Emergency department crowding: Beyond primary care access",
              "bold": false,
              "italic": true
            },
            {
              "text": ". CIHI.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Canadian Institute for Health Information. (2025). Emergency department wait time for physician initial assessment. CIHI.",
          "align": "justify",
          "runs": [
            {
              "text": "Canadian Institute for Health Information. (2025). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Emergency department wait time for physician initial assessment",
              "bold": false,
              "italic": true
            },
            {
              "text": ". CIHI.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Canadian Institute for Health Information. (2026). National Ambulatory Care Reporting System (NACRS): Emergency department supplementary data tables, 2003–2022 [Data set]. CIHI.",
          "align": "justify",
          "runs": [
            {
              "text": "Canadian Institute for Health Information. (2026). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "National Ambulatory Care Reporting System (NACRS): Emergency department supplementary data tables, 2003–2022",
              "bold": false,
              "italic": true
            },
            {
              "text": " [Data set]. CIHI. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Carter, E. J., Pouch, S. M., & Larson, E. L. (2014). The relationship between emergency department crowding and patient outcomes: A systematic review. Journal of Nursing Scholarship, 46(2), 106–115. https://doi.org/10.1111/jnu.12055",
          "align": "justify",
          "runs": [
            {
              "text": "Carter, E. J., Pouch, S. M., & Larson, E. L. (2014). The relationship between emergency department crowding and patient outcomes: A systematic review. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Journal of Nursing Scholarship, 46",
              "bold": false,
              "italic": true
            },
            {
              "text": "(2), 106–115. https://doi.org/10.1111/jnu.12055",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Cevik, M., Kavaklioglu, C., Razak, F., Verma, A., & Basar, A. (2023). Assessing the impact of emergency department short stay units using length-of-stay prediction and discrete event simulation (arXiv:2308.02730). arXiv. https://doi.org/10.48550/arXiv.2308.02730",
          "align": "justify",
          "runs": [
            {
              "text": "Cevik",
              "bold": false,
              "italic": false
            },
            {
              "text": ", M., ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Kavaklioglu",
              "bold": false,
              "italic": false
            },
            {
              "text": ", C., Razak, F., Verma, A., & Basar, A. (2023). Assessing the impact of emergency department short stay units using length-of-stay prediction and discrete event simulation (arXiv:2308.02730). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "arXiv",
              "bold": false,
              "italic": true
            },
            {
              "text": ". https://doi.org/10.48550/arXiv.2308.02730",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Conover, W. J. (1999). Practical nonparametric statistics (3rd ed.). John Wiley & Sons.",
          "align": "justify",
          "runs": [
            {
              "text": "Conover, W. J. (1999). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Practical nonparametric statistics",
              "bold": false,
              "italic": true
            },
            {
              "text": " (3rd ed.). John Wiley & Sons.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Field, A. (2018). Discovering statistics using IBM SPSS statistics (5th ed.). SAGE Publications.",
          "align": "justify",
          "runs": [
            {
              "text": "Field, A. (2018). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Discovering statistics using IBM SPSS statistics",
              "bold": false,
              "italic": true
            },
            {
              "text": " (5th ed.). SAGE Publications.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Few, S. (2012). Show me the numbers: Designing tables and graphs to enlighten (2nd ed.). Analytics Press.",
          "align": "justify",
          "runs": [
            {
              "text": "Few, S. (2012). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Show me the numbers: Designing tables and graphs to enlighten",
              "bold": false,
              "italic": true
            },
            {
              "text": " (2nd ed.). Analytics Press.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 61,
      "chapter": "References",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Gilbert, R. O. (1987). Statistical methods for environmental pollution monitoring. Van Nostrand Reinhold.",
          "align": "justify",
          "runs": [
            {
              "text": "Gilbert, R. O. (1987). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Statistical methods for environmental pollution monitoring",
              "bold": false,
              "italic": true
            },
            {
              "text": ". Van Nostrand Reinhold.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Hyndman, R. J., & Athanasopoulos, G. (2018). Forecasting: Principles and practice (2nd ed.). OTexts.",
          "align": "justify",
          "runs": [
            {
              "text": "Hyndman, R. J., & Athanasopoulos, G. (2018). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Forecasting: Principles and practice",
              "bold": false,
              "italic": true
            },
            {
              "text": " (2nd ed.). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "OTexts",
              "bold": false,
              "italic": false
            },
            {
              "text": ". ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Kendall, M. G. (1975). Rank correlation methods (4th ed.). Charles Griffin.",
          "align": "justify",
          "runs": [
            {
              "text": "Kendall, M. G. (1975). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Rank correlation methods",
              "bold": false,
              "italic": true
            },
            {
              "text": " (4th ed.). Charles Griffin.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Li, M. K., McLeod, S. L., Affleck, A., Bhate, T., Innes, G., Parks, P., Petrie, D. A., Rowe, B. H., Snider, C., Worrall, J. C., Mackay, F., & Ovens, H. (2026). Emergency department overcrowding [CAEP position statement update]. Canadian Association of Emergency Physicians. https://caep.ca/position-statements/emergency-department-overcrowding",
          "align": "justify",
          "runs": [
            {
              "text": "Li, M. K., McLeod, S. L., Affleck, A., Bhate, T., Innes, G., Parks, P., Petrie, D. A., Rowe, B. H., Snider, C., Worrall, J. C., Mackay, F., & Ovens, H. (2026). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Emergency department overcrowding",
              "bold": false,
              "italic": true
            },
            {
              "text": " [CAEP position statement update]. Canadian Association of Emergency Physicians. https://caep.ca/position-statements/emergency-department-overcrowding",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Lin, M., Lucas, H. C., Jr., & Shmueli, G. (2013). Research commentary—Too big to fail: Large samples and the p-value problem. Information Systems Research, 24(4), 906–917.",
          "align": "justify",
          "runs": [
            {
              "text": "Lin, M., Lucas, H. C., Jr., & Shmueli, G. (2013). Research commentary—Too big to fail: Large samples and the p-value problem. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Information Systems Research, 24",
              "bold": false,
              "italic": true
            },
            {
              "text": "(4), 906–917. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Mirzadeh, P., Kuk, J. L., Wharton, S., Reid, R. A., & Ardern, C. I. (2024). Healthcare outcomes and dispositions in persons with obesity within emergency departments in Ontario, Canada: A cross-sectional analysis of the National Ambulatory Care Reporting System (NACRS), 2018–2022. PLOS ONE, 19(9), e0311190. https://doi.org/10.1371/journal.pone.0311190",
          "align": "justify",
          "runs": [
            {
              "text": "Mirzadeh, P., Kuk, J. L., Wharton, S., Reid, R. A., & Ardern, C. I. (2024). Healthcare outcomes and dispositions in persons with obesity within emergency departments in Ontario, Canada: A cross-sectional analysis of the National Ambulatory Care Reporting System (NACRS), 2018–2022. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "PLOS ONE, 19",
              "bold": false,
              "italic": true
            },
            {
              "text": "(9), e0311190. https://doi.org/10.1371/journal.pone.0311190",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Munzner, T. (2014). Visualization analysis and design. CRC Press.",
          "align": "justify",
          "runs": [
            {
              "text": "Munzner, T. (2014). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Visualization analysis and design",
              "bold": false,
              "italic": true
            },
            {
              "text": ". CRC Press.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "OECD. (2023). Health at a glance 2023: OECD indicators. OECD Publishing.",
          "align": "justify",
          "runs": [
            {
              "text": "OECD. (2023). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Health ",
              "bold": false,
              "italic": true
            },
            {
              "text": "at a glance",
              "bold": false,
              "italic": true
            },
            {
              "text": " 2023: OECD indicators",
              "bold": false,
              "italic": true
            },
            {
              "text": ". OECD Publishing. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Pines, J. M., Pollack, C. V., Diercks, D. B., Chang, A. M., Shofer, F. S., & Hollander, J. E. (2009). The association between emergency department crowding and adverse cardiovascular outcomes in patients with chest pain. Academic Emergency Medicine, 16(7), 617–625. https://doi.org/10.1111/j.1553-2712.2009.00456.x",
          "align": "justify",
          "runs": [
            {
              "text": "Pines, J. M., Pollack, C. V., Diercks, D. B., Chang, A. M., ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Shofer",
              "bold": false,
              "italic": false
            },
            {
              "text": ", F. S., & Hollander, J. E. (2009). The association between emergency department crowding and adverse cardiovascular outcomes in patients with chest pain. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Academic Emergency Medicine, 16",
              "bold": false,
              "italic": true
            },
            {
              "text": "(7), 617–625. https://doi.org/10.1111/j.1553-2712.2009.00456.x",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Provost, F., & Fawcett, T. (2013). Data science for business: What you need to know about data mining and data-analytic thinking. O'Reilly Media.",
          "align": "justify",
          "runs": [
            {
              "text": "Provost, F., & Fawcett, T. (2013). ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Data science for business: What you need to know about data mining and data-analytic thinking",
              "bold": false,
              "italic": true
            },
            {
              "text": ". O'Reilly Media.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Robinson, W. S. (1950). Ecological correlations and the behavior of individuals. American Sociological Review, 15(3), 351–357.",
          "align": "justify",
          "runs": [
            {
              "text": "Robinson, W. S. (1950). Ecological correlations and the behavior of individuals. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "American Sociological Review, 15",
              "bold": false,
              "italic": true
            },
            {
              "text": "(3), 351–357. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Singer, A. J., Thode, H. C., Jr., Viccellio, P., & Pines, J. M. (2011). The association between length of emergency department boarding and mortality. Academic Emergency Medicine, 18(12), 1324–1329. https://doi.org/10.1111/j.1553-2712.2011.01236.x",
          "align": "justify",
          "runs": [
            {
              "text": "Singer, A. J., Thode, H. C., Jr., ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Viccellio",
              "bold": false,
              "italic": false
            },
            {
              "text": ", P., & Pines, J. M. (2011). The association between length of emergency department boarding and mortality. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Academic Emergency Medicine, 18",
              "bold": false,
              "italic": true
            },
            {
              "text": "(12), 1324–1329. https://doi.org/10.1111/j.1553-2712.2011.01236.x",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 62,
      "chapter": "References",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Tomczak, M., & Tomczak, E. (2014). The need to report effect size estimates revisited: An overview of some recommended measures of effect size. Trends in Sport Sciences, 21(1), 19–25.",
          "align": "justify",
          "runs": [
            {
              "text": "Tomczak, M., & Tomczak, E. (2014). The need to report effect size estimates revisited: An overview of some recommended measures of effect size. ",
              "bold": false,
              "italic": false
            },
            {
              "text": "Trends in Sport Sciences, 21",
              "bold": false,
              "italic": true
            },
            {
              "text": "(1), 19–25. ",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 63,
      "chapter": "Appendix A",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Appendix A: System Validation and Testing Evidence",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Appendix A: System Validation and Testing Evidence",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A.1 Purpose of System Validation",
          "align": "justify",
          "runs": [
            {
              "text": "A.1 Purpose of System Validation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "To evaluate the reliability of the performance of the developed EDA platform in conducting the analytical, visualization and reporting functions, system validation was conducted. The validation process primarily centered on the accuracy of the analytical outputs, consistency of the results between platform modules, usability of interactive dashboards, and separating the analytical workflows from the underlying baseline dataset.",
          "align": "justify",
          "runs": [
            {
              "text": "           ",
              "bold": false,
              "italic": false
            },
            {
              "text": "To evaluate the reliability of the performance of the developed EDA platform in conducting the analytical, visualization and reporting functions, system validation was conducted. The validation process primarily centered on the accuracy of the analytical outputs, consistency of the results between platform modules, usability of interactive dashboards, and separating the analytical workflows from the underlying baseline dataset.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The validation approach was structured with the key analytical elements already available in the platform, such as data preparation, exploratory analysis, hypothesis testing, trend analysis, forecasting, dashboard visualization, strategic interpretation and export of reports.",
          "align": "justify",
          "runs": [
            {
              "text": "          ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The validation approach was structured with the key analytical elements already available in the platform, such as data preparation, ",
              "bold": false,
              "italic": false
            },
            {
              "text": "exploratory",
              "bold": false,
              "italic": false
            },
            {
              "text": " analysis, hypothesis testing, trend analysis, forecasting, dashboard visualization, strategic interpretation and export of reports.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A.2 Analytical Validation",
          "align": "justify",
          "runs": [
            {
              "text": "A.2 Analytical Validation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The statistical presentation of the platform was checked against the analytical methods mentioned in the methodology. The validation of the main elements related to hypothesis testing are as follows: The outputs have been consistently applied in the interpretation given in Chapter 5 and 6.",
          "align": "justify",
          "runs": [
            {
              "text": "The statistical presentation of the platform was checked against the analytical methods mentioned in the methodology. The validation of the main elements related to hypothesis testing are as follows: The outputs have been consistently applied in the interpretation given in Chapter 5 and 6.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Analytical Component",
            "Statistical Method",
            "Key Validation Output"
          ],
          "rows": [
            [
              "H1 — CTAS and ED length of stay",
              "Kruskal– Wallis  test with post-hoc pairwise comparisons",
              "Significant differences across CTAS categories; ε² ≈ 0.748"
            ],
            [
              "H2 — Admission and ED length of stay",
              "Mann–Whitney U test with rank-biserial correlation",
              "Strong separation between admitted and non-admitted groups; rank-biserial correlation = 0.9981"
            ],
            [
              "H3 — Multivariable length-of-stay model",
              "Multiple regression",
              "Adjusted R² = 0.8837"
            ],
            [
              "H4 — Age and ED length of stay",
              "Kruskal– Wallis  test with post-hoc comparisons",
              "Significant differences across age cohorts; ε² ≈ 0.7218"
            ],
            [
              "H5 — Sex and disposition",
              "Chi-square test with Cramér’s V",
              "χ² = 18,164.97,  df  = 1, p < .0001; Cramér’s V ≈ 0.0102"
            ],
            [
              "Long-term throughput trend",
              "Kendall’s tau",
              "τ = 0.9766, p < .0001"
            ],
            [
              "Two-year throughput forecast",
              "Simple Exponential Smoothing (SES)",
              "FY+1 = 9.32; FY+2 = 9.32"
            ]
          ]
        },
        {
          "type": "p",
          "text": "A.3 Dashboard and Visualization Validation",
          "align": "justify",
          "runs": [
            {
              "text": "A.3 Dashboard and Visualization Validation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This dashboard layer was examined to make sure the analytical results would be conveyed by interactive visual elements, and not only by statistical tables.",
          "align": "justify",
          "runs": [
            {
              "text": "This dashboard layer was examined to make sure the analytical results would be conveyed by interactive visual elements, and not only by statistical tables.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "It offers filtering and exploring capabilities by the following dimensions:",
          "align": "justify",
          "runs": [
            {
              "text": "It offers filtering and exploring capabilities ",
              "bold": false,
              "italic": false
            },
            {
              "text": "by",
              "bold": false,
              "italic": false
            },
            {
              "text": " the following dimensions:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 64,
      "chapter": "Appendix A",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Fiscal Year",
          "align": "justify",
          "runs": [
            {
              "text": "Fiscal Year",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Sex",
          "align": "justify",
          "runs": [
            {
              "text": "Sex",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Age Cohort",
          "align": "justify",
          "runs": [
            {
              "text": "Age Cohort",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "CTAS",
          "align": "justify",
          "runs": [
            {
              "text": "CTAS",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Disposition",
          "align": "justify",
          "runs": [
            {
              "text": "Disposition",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The visualization layer displays statistical results using chart, summary card, trend visualization and analytical comparison. This will enable users to shift from general descriptive data to hypothesis-testing results and strategic conclusions.",
          "align": "justify",
          "runs": [
            {
              "text": "The visualization layer displays statistical results using chart, summary card, trend visualization and analytical comparison. This will enable users to shift from general descriptive data to hypothesis-testing results and strategic conclusions.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A.4 Forecast Validation",
          "align": "justify",
          "runs": [
            {
              "text": "A.4 Forecast Validation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The forecasting component was assessed based upon the historical emergency-resource burden index (ERBI) series of the past 20 years from FY2003-04 to FY2021-22. The historical series rose from around 5.21 to 9.32 in FY2021–22 from FY2003–04. Mann–Kendall analysis showed a significant (p value < .0001) strong positive trend (τ = 0.9766).",
          "align": "justify",
          "runs": [
            {
              "text": "The forecasting component was assessed based upon the historical emergency-resource burden index (ERBI) series of the past 20 years from FY2003-04 to FY2021-22.",
              "bold": false,
              "italic": false
            },
            {
              "text": " ",
              "bold": false,
              "italic": false
            },
            {
              "text": "The historical series rose from around 5.21 to 9.32 in FY2021–22 from FY2003–04. Mann–Kendall analysis showed a significant (p value < .0001) strong positive trend (τ = 0.9766).",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The two-year forward projection was then created using Simple Exponential Smoothing (SES). The subsequent forecast held steady at 9.32 for both FY+1 and FY+2, suggesting that the elevated level of resource pressure is likely to persist, assuming the historical trend remains unchanged.",
          "align": "justify",
          "runs": [
            {
              "text": "The two-year forward projection was then created using Simple Exponential Smoothing (SES). The subsequent forecast held steady at 9.32 for both FY+1 and FY+2, suggesting that the elevated level of resource pressure is likely to persist, assuming the historical trend remains unchanged.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "A.5 Functional Validation",
          "align": "justify",
          "runs": [
            {
              "text": "A.5 Functional Validation",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The platform was also tested for functionality to ensure that all the main modules worked as a coherent analytical workflow. The platform structure implemented is composed of 7 stages:",
          "align": "justify",
          "runs": [
            {
              "text": "The platform was also tested for functionality to ensure that all the main modules worked as a coherent analytical workflow. The platform structure implemented is composed of 7 stages:",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "About Project",
          "align": "justify",
          "runs": [
            {
              "text": "About Project",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Prep & Quality",
          "align": "justify",
          "runs": [
            {
              "text": "Prep & Quality",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Dataset Explorer",
          "align": "justify",
          "runs": [
            {
              "text": "Dataset Explorer",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Hypothesis Testing",
          "align": "justify",
          "runs": [
            {
              "text": "Hypothesis Testing",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Executive Dashboard",
          "align": "justify",
          "runs": [
            {
              "text": "Executive Dashboard",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Strategic Insights",
          "align": "justify",
          "runs": [
            {
              "text": "Strategic Insights",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "Reports & Export",
          "align": "justify",
          "runs": [
            {
              "text": "Reports & Export",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This framework offers a sequence of data-quality awareness, statistical analysis, and interpretation by executives, culminating in a report.",
          "align": "justify",
          "runs": [
            {
              "text": "This framework offers a sequence of data-quality awareness, statistical analysis, and interpretation by executives, culminating in a report.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 65,
      "chapter": "Appendix A",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "A.6 Validation Summary",
          "align": "justify",
          "runs": [
            {
              "text": "A.6 Validation Summary",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "All in all, the validation evidence shows that the platform merges descriptive analytics, statistical inference, regression modelling, longitudinal trend analysis, forecasting and interactive visualization into a holistic decision support environment. The results reported in the rest of the report are derived from the outputs of the analytical functions put in place in the platform and form the basis for the recommendations of the strategic plan developed in Chapter 9.",
          "align": "justify",
          "runs": [
            {
              "text": "All in all, the validation evidence shows that the platform merges descriptive analytics, statistical inference, regression modelling, longitudinal trend analysis, forecasting and interactive visualization into a holistic decision support environment. The results reported in the rest of the report are derived from the outputs of the analytical functions put in place in the platform and form the basis for the recommendations of the strategic plan developed in Chapter 9.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        }
      ]
    },
    {
      "pageNumber": 66,
      "chapter": "Appendix B",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Appendix B: Rubric Alignment Checklist",
          "align": "justify",
          "runs": [
            {
              "text": "   ",
              "bold": true,
              "italic": false
            },
            {
              "text": "Appendix B: Rubric Alignment Checklist",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "This appendix correlates the key assessment criteria of the capstone with the sections of the report in which the evidence is found. This mapping illustrates how the project meets the analytical, methodological, technical, interpretive and communication needs of the capstone.",
          "align": "justify",
          "runs": [
            {
              "text": "This appendix correlates the key assessment criteria of the capstone with the sections of the report in which the evidence is found. This mapping illustrates how the project meets the analytical, methodological, technical, interpretive and communication needs of the capstone.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Rubric Criterion",
            "Evidence in This Report"
          ],
          "rows": [
            [
              "Problem Analysis and Context",
              "Chapter 1 defines the emergency-department operational problem, healthcare context, project objectives, and decision framework. Chapter 2 establishes the analytical methodology and project workflow."
            ],
            [
              "Data Collection and Preparation",
              "Chapter 3 documents the CIHI NACRS data source, dataset structure, temporal coverage, data-grain considerations, weighting rationale, cleaning procedures, feature engineering, and data governance."
            ],
            [
              "Analytical Methods and Implementation",
              "Chapters 2 and 5 explain and implement the statistical methodology, including frequency-weighted analysis, non-parametric testing, regression modelling, and the five hypothesis tests (H1–H5)."
            ],
            [
              "Interpretation and Insights",
              "Chapters 5, 6, and 8 interpret statistical findings using effect sizes and practical significance rather than relying solely on p-values."
            ],
            [
              "Application of the Analytics Lifecycle",
              "Chapter 2 describes the project's seven-stage platform workflow, while Appendix C provides evidence of the technical implementation, outputs, and methodological safeguards associated with each stage."
            ],
            [
              "Data Visualization and Communication",
              "Chapter 7 documents the interactive decision-support platform, while the embedded analytical figures and dashboard screenshots demonstrate how statistical results are communicated to decision-makers."
            ],
            [
              "Professional Structure and Technical Writing",
              "The report incorporates an executive summary, numbered chapters and subsections, tables, figures, equations, methodological discussion, limitations, references, and appendices using a formal academic structure."
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 67,
      "chapter": "Appendix C",
      "isCover": false,
      "elements": [
        {
          "type": "p",
          "text": "Appendix C — Analytics Lifecycle Evidence Log",
          "align": "center",
          "runs": [
            {
              "text": "Appendix C — Analytics Lifecycle Evidence Log",
              "bold": true,
              "italic": false
            }
          ],
          "is_h1": true,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "p",
          "text": "The project was carried out as an integrated analytics workflow instead of as stand-alone analyses. The following evidence log translates the seven stages evident in the developed analytics platform into the key activities, technical outputs and methodological safeguards.",
          "align": "justify",
          "runs": [
            {
              "text": "The project was carried out as an integrated analytics workflow instead of as stand-alone analyses. The following evidence log translates the seven stages evident in the developed analytics platform into the key activities, technical outputs and methodological safeguards.",
              "bold": false,
              "italic": false
            }
          ],
          "is_h1": false,
          "is_h2": false,
          "is_h3": false
        },
        {
          "type": "table",
          "headers": [
            "Platform Stage",
            "Core Activity",
            "Technical Implementation & Output",
            "Methodological Safeguard"
          ],
          "rows": [
            [
              "1. About Project",
              "Established the healthcare problem, project objectives, analytical scope, and decision context.",
              "Project overview, objectives, problem definition, and analytical context presented within the platform.",
              "Clearly defined project boundaries and distinguished the analytical focus from broader hospital-system issues."
            ],
            [
              "2. Prep & Quality",
              "Prepared and assessed the historical CIHI NACRS data before analysis.",
              "Data-cleaning and preparation workflow; standardized analytical dataset and quality checks.",
              "Removed inappropriate aggregate roll-up records, harmonized categories, and addressed data-quality issues before statistical analysis."
            ],
            [
              "3. Dataset Explorer",
              "Enabled structured exploration of the prepared dataset across important dimensions.",
              "Interactive dataset exploration using fiscal year, sex, age cohort, CTAS, and disposition filters.",
              "Maintained the distinction between aggregate reporting strata and patient-level observations when interpreting results."
            ],
            [
              "4. Hypothesis Testing",
              "Tested the five predefined research hypotheses concerning length of stay, admission, demographics, and disposition.",
              "H1–H5 statistical analysis modules and associated result visualizations.",
              "Applied appropriate non-parametric and categorical methods to account for skewed distributions and the structure of the aggregate data."
            ],
            [
              "5. Executive Dashboard",
              "Consolidated major analytical findings into an accessible decision-support interface.",
              "Interactive KPI cards, statistical charts, trend visualizations, and filter controls.",
              "Presented statistical measures alongside visual context to reduce reliance on isolated p-values or single summary statistics."
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 68,
      "chapter": "Appendix C",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Platform Stage",
            "Core Activity",
            "Technical Implementation & Output",
            "Methodological Safeguard"
          ],
          "rows": [
            [
              "6. Strategic Insights",
              "Translated analytical findings into operationally relevant conclusions and recommendations.",
              "Strategic findings and implementation-oriented recommendations derived from H1–H5  and longitudinal analysis.",
              "Used effect sizes and practical interpretation to distinguish statistically detectable relationships from  operationally meaningful findings."
            ]
          ]
        }
      ]
    },
    {
      "pageNumber": 69,
      "chapter": "Appendix C",
      "isCover": false,
      "elements": [
        {
          "type": "table",
          "headers": [
            "Platform Stage",
            "Core Activity",
            "Technical Implementation & Output",
            "Methodological Safeguard"
          ],
          "rows": [
            [
              "7. Reports & Export",
              "Converted analytical outputs into formal reporting and reusable deliverables.",
              "Report-ready analytical outputs and export functionality.",
              "Preserved consistency between platform results and the documented capstone findings."
            ]
          ]
        }
      ]
    }
  ]
};
