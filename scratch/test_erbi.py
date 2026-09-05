from backend.analytics.resource_burden import compute_resource_burden_metrics
res = compute_resource_burden_metrics()
print("Overall ERBI Score:", res.get("overall_erbi_score"))
print("Total visits:", res.get("total_visits_analyzed"))
print("Total burden hours:", res.get("total_burden_hours"))
print("Triage level ERBI:")
for t in res.get("triage_level_erbi", []):
    print(" ", t)
print("Age category ERBI:")
for a in res.get("age_category_erbi", []):
    print(" ", a)
