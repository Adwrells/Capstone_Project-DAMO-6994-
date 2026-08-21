import pandas as pd
import numpy as np
from scipy.stats import friedmanchisquare, wilcoxon, kendalltau, theilslopes, rankdata
from itertools import combinations
from backend.database.database_manager import db_manager

# ----------------- H1 -----------------
ctas_df = db_manager.read_sql("SELECT * FROM ctas_triage WHERE ed_visits > 0")
VALID_CTAS_LEVELS = [
    "CTAS I - Resuscitation", "CTAS II - Emergent", "CTAS III - Urgent", "Less urgent", "Non-urgent"
]
def std_ctas(v):
    vl = str(v).strip().lower()
    if "ctas i" in vl and "resuscitation" in vl: return "CTAS I - Resuscitation"
    if "ctas ii" in vl and "emergent" in vl: return "CTAS II - Emergent"
    if "ctas iii" in vl and "urgent" in vl: return "CTAS III - Urgent"
    if "less urgent" in vl or "ctas iv" in vl: return "Less urgent"
    if "non-urgent" in vl or "non urgent" in vl or "ctas v" in vl: return "Non-urgent"
    return np.nan

ctas_df["triage_level_clean"] = ctas_df["triage_level"].apply(std_ctas)
ctas_clean = ctas_df[ctas_df["triage_level_clean"].isin(VALID_CTAS_LEVELS) & ctas_df["median_length_of_stay_min"].notna()].copy()
h1_pivot = ctas_clean.pivot(index=["fiscal_year_start", "sex", "age_group"], columns="triage_level_clean", values="median_length_of_stay_min")
h1_matrix = h1_pivot[VALID_CTAS_LEVELS].dropna()
h1_stat, h1_p = friedmanchisquare(*[h1_matrix[col].to_numpy() for col in VALID_CTAS_LEVELS])
h1_k = len(VALID_CTAS_LEVELS)
h1_n = len(h1_matrix)
h1_w = h1_stat / (h1_n * (h1_k - 1))
print("H1 Friedman stat:", h1_stat, "df:", h1_k - 1, "p:", h1_p, "Kendall W:", h1_w, "n_blocks:", h1_n)

# ----------------- H2 -----------------
ed_df = db_manager.read_sql("SELECT * FROM ed_visits WHERE ed_visits > 0")
if "admission_status" not in ed_df.columns:
    ed_df["admission_status"] = ed_df["is_admitted"].apply(lambda x: "Admitted" if x == 1 else "Non-Admitted")

H2_MATCH_COLS = ["triage_level", "visit_disposition", "main_problem", "admission_status"]
pre_df = ed_df[ed_df["fiscal_year_start"].isin([2017, 2018, 2019])].copy()
pan_df = ed_df[ed_df["fiscal_year_start"] == 2020].copy()
pre_base = pre_df.groupby(H2_MATCH_COLS, observed=True).agg(
    pre_pandemic_median_los=("median_length_of_stay_min", "median"),
    pre_pandemic_years=("fiscal_year_start", "nunique")
).reset_index()
pre_base = pre_base[pre_base["pre_pandemic_years"] == 3].copy()
h2_matched = pan_df.merge(pre_base, on=H2_MATCH_COLS, how="inner")
h2_matched = h2_matched.rename(columns={"median_length_of_stay_min": "pandemic_median_los"}).dropna(subset=["pre_pandemic_median_los", "pandemic_median_los"])
h2_stat, h2_p = wilcoxon(h2_matched["pandemic_median_los"], h2_matched["pre_pandemic_median_los"], alternative="two-sided", zero_method="wilcox", method="auto")
diffs = h2_matched["pandemic_median_los"] - h2_matched["pre_pandemic_median_los"]
nonzero = diffs[diffs != 0]
ranks = rankdata(np.abs(nonzero), method="average")
pos_r = ranks[nonzero.to_numpy() > 0].sum()
neg_r = ranks[nonzero.to_numpy() < 0].sum()
r_rb = (pos_r - neg_r) / (pos_r + neg_r) if (pos_r + neg_r) > 0 else 0.0
print("H2 Wilcoxon stat:", h2_stat, "p:", h2_p, "r_rb:", r_rb, "med_diff:", diffs.median(), "n_matched:", len(h2_matched))

# ----------------- H3 -----------------
age_df = db_manager.read_sql("SELECT * FROM age_sex WHERE ed_visits > 0")
AGE_GROUPS = ["Pediatric & Youth", "Young Adult", "Middle Adult", "Older Adult"]
def std_age(v):
    vl = str(v).strip().lower()
    if "0-19" in vl or "0–19" in vl or "pediatric" in vl or "youth" in vl or "0-17" in vl or "0–17" in vl or "0-4" in vl or "5-19" in vl:
        return "Pediatric & Youth"
    if "20-44" in vl or "20–44" in vl or "young adult" in vl or "18-34" in vl or "18–34" in vl:
        return "Young Adult"
    if "45-64" in vl or "45–64" in vl or "middle adult" in vl or "35-49" in vl or "35–49" in vl or "50-64" in vl or "50–64" in vl or "adult" in vl or "pre-senior" in vl:
        return "Middle Adult"
    if "65+" in vl or "65 +" in vl or "older adult" in vl or "65-85" in vl or "65–85" in vl or "geriatric" in vl:
        return "Older Adult"
    return np.nan

age_df["age_group_clean"] = age_df["age_group"].apply(std_age)
age_clean = age_df[age_df["age_group_clean"].isin(AGE_GROUPS) & age_df["median_length_of_stay_min"].notna()].copy()
h3_grp = age_clean.groupby(["fiscal_year", "fiscal_year_start", "age_group_clean"], observed=True).agg(
    median_los_minutes=("median_length_of_stay_min", "median"),
    ed_visits=("ed_visits", "sum")
).reset_index()
h3_pivot = h3_grp.pivot(index=["fiscal_year", "fiscal_year_start"], columns="age_group_clean", values="median_los_minutes")
h3_matrix = h3_pivot[AGE_GROUPS].dropna()
h3_stat, h3_p = friedmanchisquare(*[h3_matrix[col].to_numpy() for col in AGE_GROUPS])
h3_k = len(AGE_GROUPS)
h3_n = len(h3_matrix)
h3_w = h3_stat / (h3_n * (h3_k - 1))
print("H3 Friedman stat:", h3_stat, "df:", h3_k - 1, "p:", h3_p, "Kendall W:", h3_w, "n_blocks:", h3_n)

# ----------------- H4 -----------------
disp_df = db_manager.read_sql("SELECT * FROM visit_disposition WHERE ed_visits > 0")
DISP_LEVELS = ["Admitted", "Death", "Discharged", "Intra-Facility Transfer", "Left Without Being Seen", "Transferred"]
def std_disp(v):
    vl = str(v).strip().lower()
    if "admitted" in vl: return "Admitted"
    if vl == "death" or "death" in vl: return "Death"
    if "discharged" in vl: return "Discharged"
    if "intra-facility" in vl or "intra facility" in vl: return "Intra-Facility Transfer"
    if "left without being seen" in vl or "not seen" in vl or "lwbs" in vl: return "Left Without Being Seen"
    if "transferred" in vl: return "Transferred"
    return np.nan

disp_df["disp_clean"] = disp_df["visit_disposition"].apply(std_disp)
disp_clean = disp_df[disp_df["disp_clean"].isin(DISP_LEVELS) & disp_df["median_length_of_stay_min"].notna()].copy()
h4_pivot = disp_clean.pivot(index=["fiscal_year_start", "sex", "age_group"], columns="disp_clean", values="median_length_of_stay_min")
h4_matrix = h4_pivot[DISP_LEVELS].dropna()
h4_stat, h4_p = friedmanchisquare(*[h4_matrix[col].to_numpy() for col in DISP_LEVELS])
h4_k = len(DISP_LEVELS)
h4_n = len(h4_matrix)
h4_w = h4_stat / (h4_n * (h4_k - 1))
print("H4 Friedman stat:", h4_stat, "df:", h4_k - 1, "p:", h4_p, "Kendall W:", h4_w, "n_blocks:", h4_n)

# ----------------- H5 -----------------
h5_df = age_df.dropna(subset=["fiscal_year_start", "ed_visits", "median_length_of_stay_min"]).copy()
h5_annual = h5_df.groupby("fiscal_year_start", observed=True).agg(
    Annual_ED_Visits=("ed_visits", "sum"),
    Annual_Median_LOS=("median_length_of_stay_min", "median")
).reset_index().sort_values("fiscal_year_start")
h5_annual["Annual_ERBI"] = h5_annual["Annual_ED_Visits"] * h5_annual["Annual_Median_LOS"]
years = h5_annual["fiscal_year_start"].to_numpy().astype(int)
erbi_vals = h5_annual["Annual_ERBI"].to_numpy().astype(float)
h5_tau, h5_p = kendalltau(years, erbi_vals, alternative="two-sided")
sen_res = theilslopes(erbi_vals, years, alpha=0.95)
print("H5 Kendall Tau:", h5_tau, "p:", h5_p, "Sen slope:", sen_res.slope, "lower:", sen_res.low_slope, "upper:", sen_res.high_slope, "n_years:", len(years))
