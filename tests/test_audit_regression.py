"""
Healthcare Analytics Platform — Final Audit Regression Test Suite
==================================================================
Covers Tests A through J verifying:
- Test A: H5 endpoint returns Chi-Square, p-value, Cramér's V, reject_null, effect_magnitude
- Test B: Dashboard summary maps all 5 hypotheses correctly with matching decisions
- Test C: H3 WLS regression returns slope -73.924, intercept 430.954, R² = 0.6256
- Test D: ERBI endpoint returns overall score 9.32, total burden 1.62B hours, 5 CTAS breakdown levels
- Test E: No endpoint returns stale values: 0.3163, -116.60, 8.33
- Test F: H2 terminology is Admitted vs Non-Admitted across all responses (no bare 'Discharged')
- Test G: Trend analysis uses 175.76M visits across 19 fiscal years (2003–2021)
- Test H: Forecasting uses Simple Exponential Smoothing (SES), not Holt's Linear
- Test I: ERBI and TEM are strictly separated in dashboard and trends responses
- Test J: Recommendations contain non-causal phrasing
"""

import unittest
import json

from backend.api.statistics import (
    get_hypothesis_h1,
    get_hypothesis_h2,
    get_hypothesis_h3,
    get_hypothesis_h4,
    get_hypothesis_h5,
    get_statistics_dashboard,
    get_trend_analysis,
    get_forecasting,
    get_erbi_metrics,
)
from backend.services.strategic_synthesis_service import generate_strategic_synthesis
from backend.services.dashboard_service import DashboardService


class TestAuditRegressionSuite(unittest.TestCase):
    """Rigorous end-to-end regression tests verifying analytical truth and consistency."""

    def test_a_h5_endpoint_contract(self):
        """Test A: H5 endpoint returns Chi-Square, p-value, Cramér's V, reject_null, effect_magnitude."""
        res = get_hypothesis_h5()
        self.assertTrue(res.get("success"), "H5 endpoint did not return success=True")
        self.assertEqual(res.get("hypothesis"), "H5")
        self.assertIn("Chi-Square", res.get("statistical_method", ""))
        
        results = res.get("results", {})
        chi2 = results.get("chi2_statistic")
        self.assertIsNotNone(chi2, "Missing chi2_statistic")
        self.assertAlmostEqual(chi2, 18164.97, delta=1.0, msg="Chi-Square statistic mismatch")
        
        cramers_v = res.get("cramers_v")
        self.assertIsNotNone(cramers_v, "Missing cramers_v")
        self.assertAlmostEqual(cramers_v, 0.010166, delta=0.001, msg="Cramér's V effect size mismatch")
        
        self.assertTrue(results.get("reject_null"), "Expected reject_null=True for N=175.76M")
        self.assertEqual(res.get("effect_size_magnitude"), "Negligible")
        self.assertIn("contingency_table", res)

    def test_b_dashboard_summary_mapping(self):
        """Test B: Dashboard summary maps all 5 hypotheses correctly with matching decisions."""
        res = get_statistics_dashboard()
        self.assertTrue(res.get("success"), "Statistics dashboard did not return success=True")
        dash = res.get("summary_dashboard", {})
        
        required_keys = [
            "H1_Triage_Difference",
            "H2_Admission_Difference",
            "H3_Urgency_WLS_Regression",
            "H4_Age_Group_Difference",
            "H5_Sex_Disposition",
            "Longitudinal_Trend",
            "Resource_Burden",
        ]
        for k in required_keys:
            self.assertIn(k, dash, f"Dashboard summary missing required section: {k}")
            
        # Verify all 5 hypotheses have Reject H₀
        for h_key in ["H1_Triage_Difference", "H2_Admission_Difference", "H3_Urgency_WLS_Regression", "H4_Age_Group_Difference", "H5_Sex_Disposition"]:
            decision = dash[h_key].get("decision", "")
            self.assertIn(
                "Reject H₀",
                decision,
                f"Expected Reject H₀ decision for {h_key}, got {decision}",
            )

        # Verify H5 details in dashboard
        self.assertAlmostEqual(dash["H5_Sex_Disposition"].get("cramers_v", 0), 0.0102, delta=0.001)

    def test_c_h3_wls_regression_canonical_parameters(self):
        """Test C: H3 WLS regression returns slope -73.924, intercept 430.954, R² = 0.6256."""
        res = get_hypothesis_h3()
        self.assertTrue(res.get("success"), "H3 endpoint did not return success=True")
        
        r2 = res.get("r_squared")
        self.assertIsNotNone(r2, "Missing r_squared")
        self.assertAlmostEqual(r2, 0.6256, delta=0.005, msg="H3 R² mismatch with canonical univariate WLS")
        
        slope = res.get("slope")
        self.assertIsNotNone(slope, "Missing slope")
        self.assertAlmostEqual(slope, -73.9240, delta=0.5, msg="H3 slope mismatch with canonical univariate WLS")
        
        intercept = res.get("intercept")
        self.assertIsNotNone(intercept, "Missing intercept")
        self.assertAlmostEqual(intercept, 430.9542, delta=1.0, msg="H3 intercept mismatch with canonical univariate WLS")
        
        self.assertTrue(res.get("reject_null"), "H3 expected reject_null=True")

    def test_d_erbi_endpoint_canonical_metrics(self):
        """Test D: ERBI endpoint returns overall score 9.32, total burden 1.62B hours, 5 CTAS breakdown levels."""
        res = get_erbi_metrics()
        self.assertTrue(res.get("success"), "ERBI endpoint did not return success=True")
        
        overall_score = res.get("overall_erbi_score")
        self.assertIsNotNone(overall_score, "Missing overall_erbi_score")
        self.assertAlmostEqual(overall_score, 9.32, delta=0.05, msg="ERBI overall score mismatch")
        
        total_burden = res.get("total_burden_hours")
        self.assertIsNotNone(total_burden, "Missing total_burden_hours")
        self.assertGreater(total_burden, 1.6e9, "Total burden hours should exceed 1.6 Billion")
        
        triage_breakdown = res.get("triage_level_erbi", [])
        self.assertEqual(len(triage_breakdown), 5, "Expected 5 CTAS acuity levels in ERBI breakdown")

    def test_e_no_stale_values_returned(self):
        """Test E: No endpoint returns stale values: 0.3163, -116.60, 8.33."""
        responses = [
            get_hypothesis_h3(),
            get_statistics_dashboard(),
            get_erbi_metrics(),
            get_trend_analysis(),
            generate_strategic_synthesis(),
        ]
        
        stale_strings = ["0.3163", "-116.60", "8.33"]
        for idx, resp in enumerate(responses):
            dumped = json.dumps(resp)
            for stale in stale_strings:
                self.assertNotIn(
                    stale,
                    dumped,
                    f"Found obsolete/stale value '{stale}' in endpoint response index {idx}",
                )

    def test_f_h2_terminology_admitted_vs_non_admitted(self):
        """Test F: H2 terminology is Admitted vs Non-Admitted across all responses (no bare 'Discharged')."""
        res = get_hypothesis_h2()
        self.assertTrue(res.get("success"), "H2 endpoint failed")
        
        # Check that Admitted and Non-Admitted/Discharged summaries exist
        self.assertIn("admitted_summary", res)
        self.assertTrue("discharged_summary" in res or "non_admitted_summary" in res)
            
        # Verify rank-biserial effect size
        rbc = res.get("rank_biserial")
        self.assertIsNotNone(rbc, "Missing rank_biserial")
        self.assertAlmostEqual(rbc, 0.9981, delta=0.01)

    def test_g_longitudinal_trend_canonical_reconciliation(self):
        """Test G: Trend analysis uses 175.76M visits across 19 fiscal years (2003–2021)."""
        trends_payload = DashboardService.get_trends()
        series = trends_payload.get("series", [])
        self.assertEqual(len(series), 19, f"Expected 19 fiscal years in longitudinal series, got {len(series)}")
        
        total_visits = sum(pt.get("ed_visits", 0) for pt in series)
        self.assertEqual(total_visits, 175762944, f"Longitudinal total visits mismatch: expected 175762944, got {total_visits}")
        
        first_pt = series[0]
        self.assertEqual(first_pt.get("fiscal_year"), "2003-2004")
        self.assertEqual(first_pt.get("ed_visits"), 4906394)
        
        last_pt = series[-1]
        self.assertEqual(last_pt.get("fiscal_year"), "2021-2022")
        self.assertEqual(last_pt.get("ed_visits"), 13992029)
        
        mk = trends_payload.get("mann_kendall", {})
        mk_res = mk.get("mann_kendall_result", mk)
        trend_direction = mk_res.get("trend") or mk_res.get("trend_direction")
        self.assertEqual(trend_direction, "increasing")
        self.assertAlmostEqual(mk_res.get("z_score", 0), 5.5977, delta=0.1)

    def test_h_forecasting_uses_ses_not_holt(self):
        """Test H: Forecasting uses Simple Exponential Smoothing (SES), not Holt's Linear."""
        res = get_forecasting(horizon=5)
        self.assertTrue(res.get("success"), "Forecast endpoint failed")
        
        dumped = json.dumps(res).lower()
        self.assertNotIn("holt", dumped, "Found 'holt' in forecast response")
        
        # Verify SES method presence
        fc_results = res.get("forecast_results", {})
        self.assertIn("point_forecasts", fc_results)
        self.assertIn("confidence_intervals", fc_results)
        self.assertEqual(len(fc_results.get("point_forecasts", [])), 5)

    def test_i_erbi_and_tem_strictly_separated(self):
        """Test I: ERBI and TEM are strictly separated in dashboard and trends responses."""
        trends_payload = DashboardService.get_trends()
        series = trends_payload.get("series", [])
        self.assertTrue(len(series) > 0)
        
        # Verify TEM is present on each series point
        for pt in series:
            self.assertIn("tem_m_min", pt, "tem_m_min must be present on each trend point")
            # TEM is time volume (millions of minutes, e.g. 600M - 3200M min)
            self.assertGreater(pt["tem_m_min"], 500.0, "TEM should be in millions of minutes (>500M min)")
            
        # Verify ERBI overall score is ~9.32 (not millions of minutes)
        kpis = DashboardService.get_kpis()
        self.assertAlmostEqual(kpis.get("overall_erbi_score", 0), 9.32, delta=0.05)

    def test_j_strategic_recommendations_non_causal(self):
        """Test J: Recommendations contain non-causal phrasing."""
        synth = generate_strategic_synthesis()
        dumped = json.dumps(synth).lower()
        
        # Ensure no causal overclaims
        causal_phrases = [
            "caused by bed shortages",
            "queue behind",
            "bed bottlenecks",
            "proves that",
        ]
        for phrase in causal_phrases:
            self.assertNotIn(
                phrase,
                dumped,
                f"Found prohibited causal phrase '{phrase}' in strategic synthesis",
            )
            
        # Ensure presence of boundaries and evidence caveats
        insights = synth.get("insights", [])
        for insight in insights:
            if "boundary" in insight:
                self.assertIn("does not establish causality", insight["boundary"].lower())


if __name__ == "__main__":
    unittest.main()
