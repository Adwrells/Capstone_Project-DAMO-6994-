/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RawDataset {
  name: string;
  description: string;
  defaultTitle: string;
  fields: { name: string; type: 'numeric' | 'categorical' | 'date' | 'boolean' | 'text' }[];
  data: Record<string, any>[];
}

export const sampleDatasets: RawDataset[] = [
  {
    name: "Dataset 1: Emergency Department Visits & Length of Stay (2017–2022)",
    description: "Granular administrative visit-level NACRS clinical metadata including triage level (CTAS), duration of stay, resource utilization, demographics, and disposition parameters.",
    defaultTitle: "Emergency Department Visits & Length of Stay (2017–2022)",
    fields: [
      { name: "Visit ID", type: "text" },
      { name: "Date", type: "date" },
      { name: "Fiscal Year", type: "categorical" },
      { name: "Province", type: "categorical" },
      { name: "CTAS Level", type: "categorical" }, // e.g., '1-Resuscitation', '2-Emergent', 'Level 3', etc. (Needs CTAS standardizing)
      { name: "Length of Stay (Hours)", type: "numeric" },
      { name: "Total ED Minutes", type: "numeric" }, // Some values missing, some text
      { name: "Age", type: "numeric" },
      { name: "Gender", type: "categorical" },
      { name: "Visit Disposition", type: "categorical" }, // Admitted, Discharged, Left Without Being Seen
      { name: "Visit Count", type: "numeric" }, // Frequency weights (WLS weights)
      { name: "Resource Cost ($)", type: "numeric" }
    ],
    data: [
      { "Visit ID": "ED-2017-001", "Date": "2017-04-12", "Fiscal Year": "2017", "Province": "ON", "CTAS Level": "1-Resuscitation", "Length of Stay (Hours)": 8.5, "Total ED Minutes": 510, "Age": 72, "Gender": "Male", "Visit Disposition": "Admitted", "Visit Count": 12, "Resource Cost ($)": 1450 },
      { "Visit ID": "ED-2017-002", "Date": "2017-08-15", "Fiscal Year": "2017", "Province": "AB", "CTAS Level": "2-Emergent", "Length of Stay (Hours)": 4.2, "Total ED Minutes": 252, "Age": 28, "Gender": "Female", "Visit Disposition": "Discharged", "Visit Count": 8, "Resource Cost ($)": 620 },
      { "Visit ID": "ED-2017-003", "Date": "2017-11-22", "Fiscal Year": "2017", "Province": "BC", "CTAS Level": "3-Urgent", "Length of Stay (Hours)": 5.1, "Total ED Minutes": 306, "Age": 45, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 15, "Resource Cost ($)": 510 },
      { "Visit ID": "ED-2017-003", "Date": "2017-11-22", "Fiscal Year": "2017", "Province": "BC", "CTAS Level": "3-Urgent", "Length of Stay (Hours)": 5.1, "Total ED Minutes": 306, "Age": 45, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 15, "Resource Cost ($)": 510 }, // Duplicate
      { "Visit ID": "ED-2018-001", "Date": "2018-02-14", "Fiscal Year": "2017", "Province": "QC", "CTAS Level": "Level 4 - Less Urgent", "Length of Stay (Hours)": 2.5, "Total ED Minutes": 150, "Age": 6, "Gender": "Female", "Visit Disposition": "Discharged", "Visit Count": 22, "Resource Cost ($)": 320 },
      { "Visit ID": "ED-2018-002", "Date": "2018-06-18", "Fiscal Year": "2018", "Province": "ON", "CTAS Level": "5-Non Urgent", "Length of Stay (Hours)": 1.8, "Total ED Minutes": 108, "Age": 34, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 30, "Resource Cost ($)": 220 },
      { "Visit ID": "ED-2018-003", "Date": "2018-10-05", "Fiscal Year": "2018", "Province": "AB", "CTAS Level": "Level 2 - Emergent", "Length of Stay (Hours)": 14.5, "Total ED Minutes": 870, "Age": 82, "Gender": "Female", "Visit Disposition": "Admitted", "Visit Count": 5, "Resource Cost ($)": 2800 }, // High Outlier LOS
      { "Visit ID": "ED-2019-001", "Date": "2019-01-20", "Fiscal Year": "2018", "Province": "BC", "CTAS Level": "3-Urgent", "Length of Stay (Hours)": null, "Total ED Minutes": null, "Age": 55, "Gender": "Male", "Visit Disposition": "Left Without Being Seen", "Visit Count": 3, "Resource Cost ($)": 150 }, // Missing values
      { "Visit ID": "ED-2019-002", "Date": "2019-05-14", "Fiscal Year": "2019", "Province": "ON", "CTAS Level": "2-Emergent", "Length of Stay (Hours)": 6.8, "Total ED Minutes": 408, "Age": 59, "Gender": "Female", "Visit Disposition": "Admitted", "Visit Count": 14, "Resource Cost ($)": 1200 },
      { "Visit ID": "ED-2019-003", "Date": "2019-09-22", "Fiscal Year": "2019", "Province": "QC", "CTAS Level": "3-Urgent", "Length of Stay (Hours)": 4.5, "Total ED Minutes": 270, "Age": 41, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 18, "Resource Cost ($)": 480 },
      { "Visit ID": "ED-2020-001", "Date": "2020-04-10", "Fiscal Year": "2020", "Province": "ON", "CTAS Level": "1-Resuscitation", "Length of Stay (Hours)": 9.2, "Total ED Minutes": 552, "Age": 68, "Gender": "Male", "Visit Disposition": "Admitted", "Visit Count": 10, "Resource Cost ($)": 1600 }, // Pandemic year
      { "Visit ID": "ED-2020-002", "Date": "2020-08-25", "Fiscal Year": "2020", "Province": "AB", "CTAS Level": "2-Emergent", "Length of Stay (Hours)": 5.8, "Total ED Minutes": 348, "Age": 49, "Gender": "Female", "Visit Disposition": "Admitted", "Visit Count": 12, "Resource Cost ($)": 950 },
      { "Visit ID": "ED-2021-001", "Date": "2021-02-18", "Fiscal Year": "2020", "Province": "BC", "CTAS Level": "3-Urgent", "Length of Stay (Hours)": 6.1, "Total ED Minutes": 366, "Age": 38, "Gender": "Female", "Visit Disposition": "Discharged", "Visit Count": 16, "Resource Cost ($)": 520 },
      { "Visit ID": "ED-2021-002", "Date": "2021-07-05", "Fiscal Year": "2021", "Province": "ON", "CTAS Level": "4-Less Urgent", "Length of Stay (Hours)": 3.0, "Total ED Minutes": 180, "Age": 15, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 25, "Resource Cost ($)": 340 },
      { "Visit ID": "ED-2022-001", "Date": "2022-01-12", "Fiscal Year": "2021", "Province": "QC", "CTAS Level": "1-Resuscitation", "Length of Stay (Hours)": 11.4, "Total ED Minutes": 684, "Age": 85, "Gender": "Female", "Visit Disposition": "Admitted", "Visit Count": 6, "Resource Cost ($)": 2100 },
      { "Visit ID": "ED-2022-002", "Date": "2022-05-30", "Fiscal Year": "2022", "Province": "ON", "CTAS Level": "2-Emergent", "Length of Stay (Hours)": 5.4, "Total ED Minutes": 324, "Age": 53, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 20, "Resource Cost ($)": 710 },
      { "Visit ID": "ED-2022-003", "Date": "2022-10-14", "Fiscal Year": "2022", "Province": "BC", "CTAS Level": "3-Urgent", "Length of Stay (Hours)": 4.8, "Total ED Minutes": 288, "Age": 62, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 17, "Resource Cost ($)": 490 }
    ]
  },
  {
    name: "Dataset 2: Historical Emergency Department Statistics (2003–2022)",
    description: "Longitudinal aggregate CIHI summaries mapping historical emergency wait statistics, admit rates, and triage distribution trends.",
    defaultTitle: "Historical Emergency Department Statistics (2003–2022)",
    fields: [
      { name: "Fiscal Year", type: "categorical" },
      { name: "Province", type: "categorical" },
      { name: "CTAS Level", type: "categorical" },
      { name: "Length of Stay (Hours)", type: "numeric" },
      { name: "Total ED Minutes", type: "numeric" },
      { name: "Age", type: "numeric" },
      { name: "Gender", type: "categorical" },
      { name: "Visit Disposition", type: "categorical" },
      { name: "Visit Count", type: "numeric" },
      { name: "Resource Cost ($)", type: "numeric" }
    ],
    data: [
      { "Fiscal Year": "2003", "Province": "ON", "CTAS Level": "Level 1", "Length of Stay (Hours)": 7.1, "Total ED Minutes": 426, "Age": 65, "Gender": "Male", "Visit Disposition": "Admitted", "Visit Count": 5, "Resource Cost ($)": 1100 },
      { "Fiscal Year": "2005", "Province": "ON", "CTAS Level": "Level 2", "Length of Stay (Hours)": 3.8, "Total ED Minutes": 228, "Age": 48, "Gender": "Female", "Visit Disposition": "Discharged", "Visit Count": 10, "Resource Cost ($)": 550 },
      { "Fiscal Year": "2010", "Province": "AB", "CTAS Level": "Level 3", "Length of Stay (Hours)": 4.5, "Total ED Minutes": 270, "Age": 39, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 15, "Resource Cost ($)": 450 },
      { "Fiscal Year": "2015", "Province": "BC", "CTAS Level": "Level 4", "Length of Stay (Hours)": 2.8, "Total ED Minutes": 168, "Age": 22, "Gender": "Female", "Visit Disposition": "Discharged", "Visit Count": 25, "Resource Cost ($)": 310 }
    ]
  },
  {
    name: "Dataset 3: Latest Emergency Department Statistics (2024–2026)",
    description: "Post-pandemic real-time emergency care wait records and modern operational KPI baselines.",
    defaultTitle: "Latest Emergency Department Statistics (2024–2026)",
    fields: [
      { name: "Fiscal Year", type: "categorical" },
      { name: "Province", type: "categorical" },
      { name: "CTAS Level", type: "categorical" },
      { name: "Length of Stay (Hours)", type: "numeric" },
      { name: "Total ED Minutes", type: "numeric" },
      { name: "Age", type: "numeric" },
      { name: "Gender", type: "categorical" },
      { name: "Visit Disposition", type: "categorical" },
      { name: "Visit Count", type: "numeric" },
      { name: "Resource Cost ($)", type: "numeric" }
    ],
    data: [
      { "Fiscal Year": "2024", "Province": "ON", "CTAS Level": "Level 1", "Length of Stay (Hours)": 10.2, "Total ED Minutes": 612, "Age": 74, "Gender": "Male", "Visit Disposition": "Admitted", "Visit Count": 15, "Resource Cost ($)": 1850 },
      { "Fiscal Year": "2025", "Province": "AB", "CTAS Level": "Level 2", "Length of Stay (Hours)": 6.5, "Total ED Minutes": 390, "Age": 51, "Gender": "Female", "Visit Disposition": "Admitted", "Visit Count": 18, "Resource Cost ($)": 1150 },
      { "Fiscal Year": "2026", "Province": "BC", "CTAS Level": "Level 3", "Length of Stay (Hours)": 5.9, "Total ED Minutes": 354, "Age": 42, "Gender": "Male", "Visit Disposition": "Discharged", "Visit Count": 22, "Resource Cost ($)": 680 }
    ]
  }
];
