import sys
sys.path.insert(0, '.')
from backend.analytics.hypothesis_testing import run_h1_test, run_h2_test, run_h4_test, run_h5_test
from backend.analytics.trend_analysis import run_ed_visits_trend_analysis
from backend.analytics.forecasting.core import run_ed_visits_forecasting
from backend.analytics.resource_burden import compute_resource_burden_metrics

import json

print("=== H1 TEST RESULTS ===")
h1 = run_h1_test()
print(f"H statistic: {h1.get('h_statistic')}")
print(f"p-value: {h1.get('p_value')}")
print(f"df: {h1.get('degrees_of_freedom')}")
print(f"weighted_n: {h1.get('weighted_n')}")
print(f"epsilon_squared: {h1.get('epsilon_squared')}")
print(f"effect_size_magnitude: {h1.get('effect_size_magnitude')}")
print(f"reject_null: {h1.get('reject_null')}")
print(f"decision: {h1.get('decision')}")
print("Group summaries:")
for g in h1.get('group_summaries', []):
    print(f"  {g}")
print("Dunn post-hoc (first 10):")
for d in h1.get('dunn_post_hoc', [])[:10]:
    print(f"  {d}")

print("\n=== H2 TEST RESULTS ===")
h2 = run_h2_test()
print(f"u_statistic: {h2.get('u_statistic')}")
print(f"z_score: {h2.get('z_score')}")
print(f"p_value: {h2.get('p_value')}")
print(f"weighted_n: {h2.get('weighted_n')}")
print(f"rank_biserial: {h2.get('rank_biserial')}")
print(f"reject_null: {h2.get('reject_null')}")
print(f"decision: {h2.get('decision')}")
for g in h2.get('group_summaries', []):
    print(f"  {g}")

print("\n=== H4 TEST RESULTS ===")
h4 = run_h4_test()
print(f"H statistic: {h4.get('h_statistic')}")
print(f"p-value: {h4.get('p_value')}")
print(f"df: {h4.get('degrees_of_freedom')}")
print(f"weighted_n: {h4.get('weighted_n')}")
print(f"epsilon_squared: {h4.get('epsilon_squared')}")
print(f"effect_size_magnitude: {h4.get('effect_size_magnitude')}")
print(f"reject_null: {h4.get('reject_null')}")
print(f"decision: {h4.get('decision')}")
for g in h4.get('group_summaries', []):
    print(f"  {g}")
print("Dunn post-hoc:")
for d in h4.get('dunn_post_hoc', []):
    print(f"  {d}")

print("\n=== H5 TEST RESULTS ===")
h5 = run_h5_test()
print(f"chi2_statistic: {h5.get('results', {}).get('chi2_statistic')}")
print(f"degrees_of_freedom: {h5.get('results', {}).get('degrees_of_freedom')}")
print(f"p_value: {h5.get('results', {}).get('p_value')}")
print(f"reject_null: {h5.get('results', {}).get('reject_null')}")
print(f"cramers_v: {h5.get('cramers_v')}")
print(f"effect_size_magnitude: {h5.get('effect_size_magnitude')}")
print(f"total_visits_analyzed: {h5.get('total_visits_analyzed')}")
print(f"contingency_table: {h5.get('contingency_table')}")

print("\n=== TREND ANALYSIS ===")
trend = run_ed_visits_trend_analysis()
mk = trend.get('mann_kendall_result', {})
print(f"n_periods: {mk.get('n_periods')}")
print(f"s_statistic: {mk.get('s_statistic')}")
print(f"z_score: {mk.get('z_score')}")
print(f"p_value: {mk.get('p_value')}")
print(f"sens_slope: {mk.get('sens_slope')}")
print(f"trend: {mk.get('trend')}")
print(f"reject_null: {mk.get('reject_null')}")

print("\n=== FORECASTING ===")
fc = run_ed_visits_forecasting(horizon=5)
print(f"historical_years: {fc.get('historical_years')}")
print(f"historical_visits: {fc.get('historical_visits')}")
print(f"forecast_years: {fc.get('forecast_years')}")
fc_res = fc.get('forecast_results', {})
print(f"alpha: {fc_res.get('alpha')}")
print(f"last_observed_value: {fc_res.get('last_observed_value')}")
print(f"last_level: {fc_res.get('last_level')}")
print(f"rmse: {fc_res.get('rmse')}")
print(f"point_forecasts: {fc_res.get('point_forecasts')}")
for ci in fc_res.get('confidence_intervals', []):
    print(f"  {ci}")

print("\n=== ERBI METRICS ===")
erbi = compute_resource_burden_metrics()
print(f"overall_erbi_score: {erbi.get('overall_erbi_score')}")
print(f"total_visits_analyzed: {erbi.get('total_visits_analyzed')}")
print("triage_level_erbi:")
for t in erbi.get('triage_level_erbi', []):
    print(f"  {t}")

print("DONE")
