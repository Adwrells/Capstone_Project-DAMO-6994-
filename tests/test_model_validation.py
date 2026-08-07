import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.statistics.model_validation import (
    train_test_split, polynomial_fit, polynomial_predict,
    rmse, mae, r_squared, diagnose_fit, learning_curve, complexity_curve, k_fold_scores,
)


class TestTrainTestSplit(unittest.TestCase):
    def test_split_partitions_all_rows(self):
        x = list(range(100))
        y = [v * 2.0 for v in x]
        xtr, ytr, xte, yte = train_test_split(x, y, test_ratio=0.3, seed=42)
        self.assertEqual(len(xtr) + len(xte), 100)
        self.assertEqual(len(ytr) + len(yte), 100)

    def test_split_respects_test_ratio(self):
        x = list(range(100))
        xtr, _, xte, _ = train_test_split(x, [float(v) for v in x], test_ratio=0.25, seed=42)
        self.assertEqual(len(xte), 25)
        self.assertEqual(len(xtr), 75)

    def test_split_is_deterministic_for_same_seed(self):
        x = list(range(50))
        y = [float(v) for v in x]
        a = train_test_split(x, y, test_ratio=0.3, seed=7)
        b = train_test_split(x, y, test_ratio=0.3, seed=7)
        self.assertEqual(a[0], b[0])
        self.assertEqual(a[2], b[2])

    def test_split_keeps_pairs_aligned(self):
        x = list(range(40))
        y = [v * 3.0 for v in x]
        xtr, ytr, xte, yte = train_test_split(x, y, test_ratio=0.25, seed=1)
        for xi, yi in list(zip(xtr, ytr)) + list(zip(xte, yte)):
            self.assertAlmostEqual(yi, xi * 3.0, places=6)

    def test_split_insufficient_data_returns_empty_test_set(self):
        xtr, ytr, xte, yte = train_test_split([1.0], [2.0], test_ratio=0.3)
        self.assertEqual(len(xte), 0)
        self.assertEqual(len(xtr), 1)


class TestPolynomialFit(unittest.TestCase):
    def test_degree_one_recovers_known_line(self):
        coeffs = polynomial_fit([1, 2, 3, 4, 5], [3.0, 5.0, 7.0, 9.0, 11.0], degree=1)
        self.assertAlmostEqual(coeffs[0], 1.0, places=3)
        self.assertAlmostEqual(coeffs[1], 2.0, places=3)

    def test_degree_two_recovers_known_parabola(self):
        x = [-3, -2, -1, 0, 1, 2, 3]
        y = [float(v * v) for v in x]
        coeffs = polynomial_fit(x, y, degree=2)
        self.assertAlmostEqual(coeffs[2], 1.0, places=3)

    def test_predict_matches_fitted_line(self):
        coeffs = polynomial_fit([1, 2, 3], [2.0, 4.0, 6.0], degree=1)
        preds = polynomial_predict(coeffs, [4.0])
        self.assertAlmostEqual(preds[0], 8.0, places=3)

    def test_fit_insufficient_data_returns_zero_coeffs(self):
        self.assertEqual(polynomial_fit([1.0], [2.0], degree=3), [0.0, 0.0, 0.0, 0.0])

    def test_fit_zero_variance_x_does_not_crash(self):
        coeffs = polynomial_fit([5.0, 5.0, 5.0], [1.0, 2.0, 3.0], degree=1)
        self.assertEqual(len(coeffs), 2)


class TestMetrics(unittest.TestCase):
    def test_rmse_of_perfect_prediction_is_zero(self):
        self.assertAlmostEqual(rmse([1.0, 2.0, 3.0], [1.0, 2.0, 3.0]), 0.0, places=6)

    def test_rmse_known_value(self):
        self.assertAlmostEqual(rmse([0.0, 0.0], [3.0, 4.0]), 3.5355, places=3)

    def test_mae_known_value(self):
        self.assertAlmostEqual(mae([0.0, 0.0], [3.0, 5.0]), 4.0, places=6)

    def test_r_squared_of_perfect_prediction_is_one(self):
        self.assertAlmostEqual(r_squared([1.0, 2.0, 3.0, 4.0], [1.0, 2.0, 3.0, 4.0]), 1.0, places=6)

    def test_r_squared_of_mean_prediction_is_zero(self):
        self.assertAlmostEqual(r_squared([1.0, 2.0, 3.0], [2.0, 2.0, 2.0]), 0.0, places=6)

    def test_metrics_on_empty_input_return_zero(self):
        self.assertEqual(rmse([], []), 0.0)
        self.assertEqual(mae([], []), 0.0)
        self.assertEqual(r_squared([], []), 0.0)


class TestDiagnoseFit(unittest.TestCase):
    def test_large_train_test_gap_is_overfitting(self):
        res = diagnose_fit(train_r2=0.98, test_r2=0.41)
        self.assertEqual(res["verdict"], "Overfitting")

    def test_both_scores_low_is_underfitting(self):
        res = diagnose_fit(train_r2=0.12, test_r2=0.09)
        self.assertEqual(res["verdict"], "Underfitting")

    def test_close_and_high_scores_are_good_fit(self):
        res = diagnose_fit(train_r2=0.82, test_r2=0.79)
        self.assertEqual(res["verdict"], "Good Fit")

    def test_verdict_includes_generalization_gap(self):
        res = diagnose_fit(train_r2=0.90, test_r2=0.60)
        self.assertAlmostEqual(res["generalization_gap"], 0.30, places=6)

    def test_verdict_includes_severity_and_recommendation(self):
        res = diagnose_fit(train_r2=0.99, test_r2=0.20)
        self.assertIn("severity", res)
        self.assertIn("recommendation", res)

    def test_underfitting_takes_precedence_over_gap(self):
        res = diagnose_fit(train_r2=0.20, test_r2=0.02)
        self.assertEqual(res["verdict"], "Underfitting")


class TestLearningCurve(unittest.TestCase):
    def test_learning_curve_returns_requested_number_of_points(self):
        x = list(range(60))
        y = [v * 2.0 + (v % 5) for v in x]
        curve = learning_curve(x, y, degree=1, steps=5)
        self.assertEqual(len(curve), 5)

    def test_learning_curve_points_carry_both_errors(self):
        x = list(range(60))
        y = [v * 2.0 for v in x]
        point = learning_curve(x, y, degree=1, steps=4)[0]
        self.assertIn("train_size", point)
        self.assertIn("train_rmse", point)
        self.assertIn("validation_rmse", point)

    def test_learning_curve_train_size_increases(self):
        x = list(range(80))
        y = [float(v) for v in x]
        curve = learning_curve(x, y, degree=1, steps=5)
        sizes = [p["train_size"] for p in curve]
        self.assertEqual(sizes, sorted(sizes))

    def test_learning_curve_insufficient_data_returns_empty(self):
        self.assertEqual(learning_curve([1.0, 2.0], [1.0, 2.0], degree=1, steps=5), [])


class TestComplexityCurve(unittest.TestCase):
    def test_complexity_curve_covers_requested_degrees(self):
        x = list(range(60))
        y = [v * 2.0 for v in x]
        curve = complexity_curve(x, y, degrees=[1, 2, 3])
        self.assertEqual([p["degree"] for p in curve], [1, 2, 3])

    def test_complexity_curve_points_carry_both_r2(self):
        x = list(range(60))
        y = [v * 1.5 for v in x]
        point = complexity_curve(x, y, degrees=[1, 2])[0]
        self.assertIn("train_r2", point)
        self.assertIn("validation_r2", point)

    def test_complexity_curve_insufficient_data_returns_empty(self):
        self.assertEqual(complexity_curve([1.0], [1.0], degrees=[1, 2]), [])


class TestKFoldScores(unittest.TestCase):
    def test_k_fold_returns_one_score_per_fold(self):
        x = list(range(50))
        y = [v * 2.0 for v in x]
        res = k_fold_scores(x, y, degree=1, k=5)
        self.assertEqual(len(res["fold_scores"]), 5)

    def test_k_fold_reports_mean_and_std(self):
        x = list(range(50))
        y = [v * 2.0 for v in x]
        res = k_fold_scores(x, y, degree=1, k=5)
        self.assertIn("mean_r2", res)
        self.assertIn("std_r2", res)

    def test_k_fold_on_linear_data_scores_near_one(self):
        x = list(range(60))
        y = [v * 3.0 + 1.0 for v in x]
        res = k_fold_scores(x, y, degree=1, k=4)
        self.assertGreater(res["mean_r2"], 0.95)

    def test_k_fold_insufficient_data_returns_empty_scores(self):
        res = k_fold_scores([1.0, 2.0], [1.0, 2.0], degree=1, k=5)
        self.assertEqual(res["fold_scores"], [])


if __name__ == "__main__":
    unittest.main()
