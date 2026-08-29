"""Compile all chapter files into Master_Capstone_Final_Report.md and report.md"""
import pathlib

FINAL_REPORT_DIR = pathlib.Path(r"c:\Users\bhara\OneDrive\Desktop\Capstone_Project-DAMO-6994-\Capstone_Project-DAMO-6994-\Capstone_Project-DAMO-6994-\docs\final_report")
MASTER_OUT = FINAL_REPORT_DIR / "Master_Capstone_Final_Report.md"
ROOT_REPORT_OUT = pathlib.Path(r"c:\Users\bhara\OneDrive\Desktop\Capstone_Project-DAMO-6994-\Capstone_Project-DAMO-6994-\Capstone_Project-DAMO-6994-\report.md")

chapter_files = [
    "Chapter_00_Preliminary_Pages_and_Executive_Summary.md",
    "Chapter_01_Problem_Analysis_and_Context.md",
    "Chapter_02_Analytics_Lifecycle_and_Methodology.md",
    "Chapter_03_Data_Collection_and_Preparation.md",
    "Chapter_04_Exploratory_Data_Analysis.md",
    "Chapter_05_Statistical_Hypothesis_Testing.md",
    "Chapter_06_Trend_Analysis_and_Forecasting.md",
    "Chapter_07_Data_Visualization_and_Dashboard.md",
    "Chapter_08_Findings_and_Discussion.md",
    "Chapter_09_Conclusion_and_Recommendations.md",
    "Chapter_10_References_and_Appendices.md"
]

combined_text = []
for fname in chapter_files:
    fpath = FINAL_REPORT_DIR / fname
    if fpath.exists():
        text = fpath.read_text(encoding="utf-8")
        combined_text.append(text)

full_content = "\n\n---\n\n".join(combined_text)

MASTER_OUT.write_text(full_content, encoding="utf-8")
ROOT_REPORT_OUT.write_text(full_content, encoding="utf-8")
print(f"Master report created with {len(full_content)} characters / {len(full_content.split())} words.")
