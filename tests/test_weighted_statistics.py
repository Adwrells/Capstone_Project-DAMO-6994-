"""
Tests for the frequency-weighted non-parametric engine that backs H1/H2/H4.

Two things are pinned here:
  1. The special functions match SciPy to machine precision, so results do not depend
     on whether SciPy happens to be installed.
  2. Weights are treated as VISIT COUNTS. An aggregate row reporting 500,000 visits
     must move the test statistic 500,000 times as hard as a row reporting 1.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import math
import unittest

from backend.analytics.statistics.weighted import (
    chi2_sf,
    normal_sf,
    student_t_sf,
    weighted_dunn_post_hoc,
    weighted_kruskal_wallis,
    weighted_mann_whitney_u,
    weighted_mean,
    weighted_median,
    weighted_midranks,
)

try:
    from scipy import stats as _scipy_stats
    SCIPY = True
except ImportError:
    SCIPY = False


class TestSpecialFunctions(unittest.TestCase):
    """chi2_sf / normal_sf replace the logistic approximations the old engine used."""

    CASES = [(0.5, 1), (3.84, 1), (9.49, 4), (15.2, 7), (0.001, 2), (50.0, 3), (120.0, 10)]

    @unittest.skipUnless(SCIPY, "SciPy not installed")
    def test_chi2_sf_matches_scipy(self):
        for x, df in self.CASES:
            with self.subTest(x=x, df=df):
                self.assertAlmostEqual(chi2_sf(x, df), float(_scipy_stats.chi2.sf(x, df)), places=12)

    def test_chi2_sf_edges(self):
        self.assertEqual(chi2_sf(0.0, 3), 1.0)
        self.assertEqual(chi2_sf(-1.0, 3), 1.0)
        self.assertEqual(chi2_sf(10.0, 0), 1.0)

    def test_chi2_sf_underflows_to_zero_not_error(self):
        """Aggregate data yields H in the 1e8 range; exp() underflows and must return 0."""
        self.assertEqual(chi2_sf(1.26e8, 4), 0.0)

    def test_chi2_sf_is_monotone_decreasing(self):
        vals = [chi2_sf(x, 4) for x in (1.0, 5.0, 10.0, 20.0, 40.0)]
        self.assertEqual(vals, sorted(vals, reverse=True))

    def test_normal_sf(self):
        self.assertAlmostEqual(normal_sf(0.0), 0.5, places=12)
        self.assertAlmostEqual(normal_sf(1.959963985), 0.025, places=9)
        self.assertAlmostEqual(2 * normal_sf(2.575829304), 0.01, places=9)

    T_CASES = [(2.0, 10), (1.96, 1000), (0.5, 3), (4.5, 25), (12.0, 8), (-2.0, 10)]

    @unittest.skipUnless(SCIPY, "SciPy not installed")
    def test_student_t_sf_matches_scipy(self):
        for t, df in self.T_CASES:
            with self.subTest(t=t, df=df):
                self.assertAlmostEqual(student_t_sf(t, df), float(_scipy_stats.t.sf(t, df)), places=11)

    def test_student_t_sf_symmetry_and_centre(self):
        self.assertAlmostEqual(student_t_sf(0.0, 5), 0.5, places=12)
        for t, df in ((1.5, 7), (3.0, 20)):
            self.assertAlmostEqual(student_t_sf(t, df) + student_t_sf(-t, df), 1.0, places=12)

    def test_student_t_sf_depends_on_df(self):
        """The replaced approximation ignored df entirely; the exact tail must not."""
        self.assertGreater(student_t_sf(2.0, 3), student_t_sf(2.0, 500))


class TestWeightedDescriptives(unittest.TestCase):
    def test_weighted_mean_respects_counts(self):
        # 1 record at 10 vs 99 records at 20 -> mean must sit near 20, not near 15.
        self.assertAlmostEqual(weighted_mean([10.0, 20.0], [1, 99]), 19.9, places=9)

    def test_weighted_mean_equals_plain_mean_without_weights(self):
        self.assertAlmostEqual(weighted_mean([2.0, 4.0, 6.0]), 4.0, places=12)

    def test_weighted_median_shifts_with_weight(self):
        self.assertEqual(weighted_median([10.0, 20.0], [1, 99]), 20.0)
        self.assertEqual(weighted_median([10.0, 20.0], [99, 1]), 10.0)

    def test_zero_and_negative_weights_dropped(self):
        self.assertAlmostEqual(weighted_mean([10.0, 999.0], [5, 0]), 10.0, places=12)

    def test_non_integer_weight_rejected(self):
        with self.assertRaises(ValueError):
            weighted_mean([10.0, 20.0], [1.5, 2.0])


class TestWeightedMidranks(unittest.TestCase):
    def test_midranks_expand_by_weight(self):
        # Values 10,20 with weights 3,2 == population [10,10,10,20,20].
        # Ranks: 10 -> (1+2+3)/3 = 2 ; 20 -> (4+5)/2 = 4.5
        ranks, ties, n = weighted_midranks([10.0, 20.0], [3, 2])
        self.assertEqual(n, 5)
        self.assertEqual(ties, [3, 2])
        self.assertAlmostEqual(ranks[10.0], 2.0, places=12)
        self.assertAlmostEqual(ranks[20.0], 4.5, places=12)

    def test_duplicate_values_are_pooled(self):
        ranks, ties, n = weighted_midranks([5.0, 5.0, 9.0], [2, 3, 1])
        self.assertEqual(n, 6)
        self.assertEqual(ties, [5, 1])
        self.assertAlmostEqual(ranks[5.0], 3.0, places=12)


class TestWeightedKruskalWallis(unittest.TestCase):
    def test_unweighted_matches_scipy_kruskal(self):
        """With unit weights the engine must reduce to the textbook Kruskal-Wallis."""
        g1 = [10.0, 11.0, 10.5, 9.5, 10.2, 10.8]
        g2 = [20.0, 21.0, 19.5, 22.0, 20.4, 21.7]
        g3 = [30.0, 31.5, 29.0, 33.0, 30.2, 31.1]
        res = weighted_kruskal_wallis([g1, g2, g3], ["a", "b", "c"])
        if SCIPY:
            h_ref, p_ref = _scipy_stats.kruskal(g1, g2, g3)
            self.assertAlmostEqual(res["h_statistic"], float(h_ref), places=9)
            self.assertAlmostEqual(res["p_value"], float(p_ref), places=12)
        self.assertEqual(res["degrees_of_freedom"], 2)
        self.assertTrue(res["reject_null"])

    def test_unweighted_with_ties_matches_scipy(self):
        """SciPy tie-corrects; so must we, or the two diverge exactly where it matters."""
        g1 = [5.0, 5.0, 5.0, 7.0, 7.0]
        g2 = [7.0, 7.0, 9.0, 9.0, 9.0]
        res = weighted_kruskal_wallis([g1, g2], ["a", "b"])
        self.assertLess(res["tie_correction"], 1.0)
        if SCIPY:
            h_ref, p_ref = _scipy_stats.kruskal(g1, g2)
            self.assertAlmostEqual(res["h_statistic"], float(h_ref), places=9)
            self.assertAlmostEqual(res["p_value"], float(p_ref), places=12)

    def test_weights_equal_explicit_replication(self):
        """The whole point: weighting must equal physically repeating the rows."""
        vals_a, wts_a = [10.0, 12.0], [3, 2]
        vals_b, wts_b = [30.0, 31.0], [2, 4]
        weighted = weighted_kruskal_wallis([vals_a, vals_b], ["a", "b"], [wts_a, wts_b])

        expand = lambda v, w: [x for x, c in zip(v, w) for _ in range(c)]
        expanded = weighted_kruskal_wallis(
            [expand(vals_a, wts_a), expand(vals_b, wts_b)], ["a", "b"]
        )
        self.assertAlmostEqual(weighted["h_statistic"], expanded["h_statistic"], places=9)
        self.assertAlmostEqual(weighted["p_value"], expanded["p_value"], places=12)
        self.assertEqual(weighted["weighted_n"], 11)

    def test_weighting_changes_the_answer(self):
        """Guards the exact defect being fixed: ignoring weights must not be equivalent."""
        groups = [[10.0, 90.0], [11.0, 91.0]]
        weights = [[1000, 1], [1, 1000]]
        unweighted = weighted_kruskal_wallis(groups, ["a", "b"])
        weighted = weighted_kruskal_wallis(groups, ["a", "b"], weights)
        self.assertNotAlmostEqual(unweighted["h_statistic"], weighted["h_statistic"], places=3)
        self.assertGreater(weighted["weighted_n"], unweighted["weighted_n"])

    def test_tie_correction_never_exceeds_one(self):
        """A correction > 1 is impossible; the source notebook produced one via int64 overflow."""
        groups = [[420.0] * 40, [430.0] * 40]
        weights = [[8_000_000] * 40, [9_000_000] * 40]
        res = weighted_kruskal_wallis(groups, ["a", "b"], weights)
        self.assertLessEqual(res["tie_correction"], 1.0)
        self.assertGreater(res["tie_correction"], 0.0)

    def test_huge_weights_do_not_overflow(self):
        """Pure-Python ints must carry t**3 past the int64 ceiling without wrapping."""
        groups = [[100.0, 200.0], [300.0, 400.0]]
        weights = [[50_000_000, 40_000_000], [45_000_000, 39_000_000]]
        res = weighted_kruskal_wallis(groups, ["a", "b"], weights)
        self.assertEqual(res["weighted_n"], 174_000_000)
        self.assertGreater(res["h_statistic"], 0.0)
        self.assertTrue(math.isfinite(res["h_statistic"]))
        self.assertGreaterEqual(res["p_value"], 0.0)

    def test_epsilon_squared_bounded(self):
        res = weighted_kruskal_wallis([[1.0, 2.0, 3.0], [50.0, 60.0, 70.0]], ["a", "b"])
        self.assertGreaterEqual(res["epsilon_squared"], 0.0)
        self.assertLessEqual(res["epsilon_squared"], 1.0)

    def test_identical_groups_fail_to_reject(self):
        res = weighted_kruskal_wallis([[10.0, 20.0, 30.0], [10.0, 20.0, 30.0]], ["a", "b"])
        self.assertFalse(res["reject_null"])
        self.assertGreater(res["p_value"], 0.05)

    def test_insufficient_groups_returns_neutral_result(self):
        res = weighted_kruskal_wallis([[1.0, 2.0, 3.0]], ["only"])
        self.assertEqual(res["p_value"], 1.0)
        self.assertFalse(res["reject_null"])

    def test_group_statistics_reported_per_group(self):
        res = weighted_kruskal_wallis([[10.0, 12.0], [30.0, 33.0]], ["a", "b"], [[5, 5], [7, 3]])
        self.assertEqual([g["group"] for g in res["group_statistics"]], ["a", "b"])
        self.assertEqual(res["group_statistics"][0]["weighted_n"], 10)
        self.assertEqual(res["group_statistics"][1]["weighted_n"], 10)


class TestWeightedMannWhitneyU(unittest.TestCase):
    def test_unweighted_matches_scipy(self):
        a = [12.0, 15.0, 11.0, 19.0, 14.0, 13.0]
        b = [22.0, 25.0, 21.0, 29.0, 24.0, 23.0]
        res = weighted_mann_whitney_u(a, b)
        if SCIPY:
            u_ref, _ = _scipy_stats.mannwhitneyu(a, b, alternative="two-sided")
            self.assertAlmostEqual(res["u_statistic"], min(float(u_ref), len(a) * len(b) - float(u_ref)), places=9)
        self.assertTrue(res["reject_null"])

    def test_weights_equal_explicit_replication(self):
        a, wa = [10.0, 12.0], [4, 2]
        b, wb = [30.0, 31.0], [3, 3]
        expand = lambda v, w: [x for x, c in zip(v, w) for _ in range(c)]
        weighted = weighted_mann_whitney_u(a, b, wa, wb)
        expanded = weighted_mann_whitney_u(expand(a, wa), expand(b, wb))
        self.assertAlmostEqual(weighted["u_statistic"], expanded["u_statistic"], places=9)
        self.assertAlmostEqual(weighted["p_value"], expanded["p_value"], places=12)

    def test_rank_biserial_direction(self):
        """Fully separated groups give the maximal effect size."""
        res = weighted_mann_whitney_u([1.0, 2.0, 3.0], [90.0, 91.0, 92.0])
        self.assertAlmostEqual(abs(res["rank_biserial"]), 1.0, places=9)

    def test_empty_group_is_neutral(self):
        res = weighted_mann_whitney_u([], [1.0, 2.0])
        self.assertEqual(res["p_value"], 1.0)
        self.assertFalse(res["reject_null"])

    def test_group_labels_preserved(self):
        res = weighted_mann_whitney_u([1.0, 2.0], [3.0, 4.0], label_a="Admitted", label_b="Non-Admitted")
        self.assertEqual([g["group"] for g in res["group_statistics"]], ["Admitted", "Non-Admitted"])


class TestWeightedDunnPostHoc(unittest.TestCase):
    def test_returns_every_pair(self):
        res = weighted_dunn_post_hoc([[10.0, 11.0], [50.0, 55.0], [30.0, 32.0]], ["L1", "L2", "L3"])
        self.assertEqual(len(res), 3)
        self.assertEqual({(r["group_a"], r["group_b"]) for r in res},
                         {("L1", "L2"), ("L1", "L3"), ("L2", "L3")})

    def test_bonferroni_scales_by_comparison_count(self):
        res = weighted_dunn_post_hoc([[1.0, 2.0], [10.0, 11.0], [20.0, 21.0]], ["a", "b", "c"])
        for r in res:
            self.assertLessEqual(r["p_raw"], r["p_adj_bonferroni"])
            self.assertLessEqual(r["p_adj_bonferroni"], 1.0)

    def test_uses_pooled_ranks_not_pairwise_reranking(self):
        """Dunn shares one ranking across all groups; mean ranks must be global."""
        groups = [[1.0, 2.0], [3.0, 4.0], [100.0, 200.0]]
        res = weighted_dunn_post_hoc(groups, ["a", "b", "c"])
        by_pair = {(r["group_a"], r["group_b"]): r for r in res}
        # Global mean rank of "a" is identical in both pairs it appears in.
        self.assertAlmostEqual(by_pair[("a", "b")]["mean_rank_a"],
                               by_pair[("a", "c")]["mean_rank_a"], places=12)

    def test_weighted_pairs_detect_separation(self):
        res = weighted_dunn_post_hoc(
            [[10.0, 11.0], [500.0, 510.0]], ["low", "high"],
            [[10_000, 10_000], [10_000, 10_000]],
        )
        self.assertTrue(res[0]["significant"])

    def test_single_group_returns_empty(self):
        self.assertEqual(weighted_dunn_post_hoc([[1.0, 2.0]], ["a"]), [])


class TestDownstreamModulesUseExactTails(unittest.TestCase):
    """chi_square and linear_regression previously shipped invented p-value formulas."""

    def test_chi_square_p_value_is_a_real_chi_square_tail(self):
        from backend.analytics.statistics.chi_square import chi_square_test

        # Strong association: p must be far below the old 1/(1+chi2/df) floor.
        chi2, df, p = chi_square_test([[100, 10], [10, 100]])
        self.assertEqual(df, 1)
        self.assertLess(p, 1e-10)
        if SCIPY:
            self.assertAlmostEqual(p, float(_scipy_stats.chi2.sf(chi2, df)), places=12)

    def test_chi_square_independent_table_is_not_significant(self):
        from backend.analytics.statistics.chi_square import chi_square_test

        _, _, p = chi_square_test([[50, 50], [50, 50]])
        self.assertAlmostEqual(p, 1.0, places=9)

    def test_regression_p_value_uses_student_t(self):
        from backend.analytics.statistics.linear_regression import linear_regression

        x = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
        y = [2.1, 3.9, 6.2, 8.1, 9.8, 12.2, 13.9, 16.1]
        res = linear_regression(x, y)
        self.assertEqual(res["degrees_of_freedom"], 6)
        self.assertLess(res["p_value"], 1e-6)  # old formula floored at 1e-4
        expected = min(1.0, 2 * student_t_sf(abs(res["t_statistic"]), res["degrees_of_freedom"]))
        self.assertAlmostEqual(res["p_value"], expected, places=12)


if __name__ == "__main__":
    unittest.main()
