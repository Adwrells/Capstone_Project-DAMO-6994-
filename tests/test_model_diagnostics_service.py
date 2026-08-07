"""
Test Suite: Fit diagnostics service — underfitting, overfitting and good fit.

`tests/test_model_validation.py` covers the pure math. This suite covers the service that
composes it: whether a verdict reached through `diagnose()` is the right one for data with a
known relationship, and whether the guards behave when the data cannot support a split.

Deterministic throughout — the split is seeded, and every dataset is constructed rather than
sampled, so a verdict never depends on which rows happened to land in the holdout.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import math
import random
import unittest

from backend.services.model_diagnostics_service import (
    MIN_ROWS_FOR_DIAGNOSIS, ModelDiagnosticsService,
)


def rows(pairs, feature="x", target="y"):
    return [{feature: a, target: b} for a, b in pairs]


class TestUnderfittingDetection(unittest.TestCase):
    """Underfitting: the model explains almost nothing, on its own training data."""

    def test_pure_noise_target_is_underfitting(self):
        rng = random.Random(7)
        data = rows([(i, rng.gauss(0, 10)) for i in range(200)])
        result = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)

        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["diagnosis"]["verdict"], "Underfitting")

    def test_unrelated_predictor_is_underfitting(self):
        """Mirrors the real case: fiscal year does not predict triage acuity."""
        rng = random.Random(11)
        data = rows([(2003 + (i % 19), rng.choice([1, 2, 3, 4, 5])) for i in range(300)])
        result = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)

        self.assertEqual(result["diagnosis"]["verdict"], "Underfitting")
        self.assertLess(result["metrics"]["train"]["r2"], 0.30)

    def test_underfitting_reports_severity_and_recommendation(self):
        rng = random.Random(3)
        data = rows([(i, rng.gauss(0, 5)) for i in range(120)])
        d = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)["diagnosis"]

        self.assertIn(d["severity"], ("Moderate", "High"))
        self.assertIn("complexity", d["recommendation"].lower())

    def test_underfitting_wins_even_when_the_gap_is_large(self):
        """A model that failed on its own training data is underfit, not overfit —
        checking the gap first would mislabel it."""
        rng = random.Random(5)
        data = rows([(i, rng.gauss(0, 50)) for i in range(60)])
        d = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)["diagnosis"]

        if d["train_r2"] < 0.30:
            self.assertEqual(d["verdict"], "Underfitting")

    def test_a_straight_line_is_not_reported_as_underfitting(self):
        data = rows([(i, 3.0 * i + 2.0) for i in range(80)])
        self.assertEqual(
            ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)["diagnosis"]["verdict"],
            "Good Fit",
        )


def noisy_line(n, sd, seed=13, slope=5.0):
    """A real linear signal plus noise — the setting where model complexity decides the
    verdict. Few points and heavy noise let a high-degree polynomial chase the noise."""
    rng = random.Random(seed)
    return rows([(i, slope * i + rng.gauss(0, sd)) for i in range(n)])


class TestOverfittingDetection(unittest.TestCase):
    """Overfitting: fits the training rows well, then fails on data it has not seen.

    Parameters were measured rather than guessed. At n=20 with sd=15 a degree-6 polynomial
    scores train R2 0.91 against holdout 0.37 — a gap of 0.54, far clear of the 0.15
    threshold, so the assertion does not sit on a knife edge.
    """

    def test_high_degree_on_sparse_noisy_data_is_overfitting(self):
        d = ModelDiagnosticsService.diagnose(noisy_line(20, 15), "x", "y", degree=6)["diagnosis"]
        self.assertEqual(d["verdict"], "Overfitting")

    def test_overfitting_fits_training_well_but_generalises_poorly(self):
        m = ModelDiagnosticsService.diagnose(noisy_line(20, 15), "x", "y", degree=6)["metrics"]
        self.assertGreater(m["train"]["r2"], 0.80)
        self.assertLess(m["holdout"]["r2"], 0.60)

    def test_overfitting_reports_a_gap_beyond_the_threshold(self):
        d = ModelDiagnosticsService.diagnose(noisy_line(20, 15), "x", "y", degree=6)["diagnosis"]
        self.assertGreater(d["generalization_gap"], 0.15)

    def test_overfitting_recommends_reducing_complexity(self):
        d = ModelDiagnosticsService.diagnose(noisy_line(20, 15), "x", "y", degree=6)["diagnosis"]
        self.assertIn("reduce model complexity", d["recommendation"].lower())

    def test_the_same_data_is_a_good_fit_at_a_lower_degree(self):
        """Complexity, not the data, drives the verdict — the distinction the panel exists
        to make."""
        data = noisy_line(20, 15)
        low = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)["diagnosis"]["verdict"]
        high = ModelDiagnosticsService.diagnose(data, "x", "y", degree=6)["diagnosis"]["verdict"]

        self.assertEqual(low, "Good Fit")
        self.assertEqual(high, "Overfitting")

    def test_more_data_at_the_same_degree_stops_overfitting(self):
        """Overfitting is relative to sample size: the same degree-6 model on 40 rows
        instead of 20 generalises."""
        few = ModelDiagnosticsService.diagnose(noisy_line(20, 15), "x", "y", degree=6)["diagnosis"]
        many = ModelDiagnosticsService.diagnose(noisy_line(40, 15), "x", "y", degree=6)["diagnosis"]

        self.assertEqual(few["verdict"], "Overfitting")
        self.assertEqual(many["verdict"], "Good Fit")


class TestAllThreeVerdictsAreReachable(unittest.TestCase):
    """Guards against a classifier that has collapsed onto one answer."""

    def test_each_verdict_is_produced_by_the_appropriate_data(self):
        rng = random.Random(41)
        cases = {
            "Good Fit": (rows([(i, 4.0 * i + rng.gauss(0, 2)) for i in range(150)]), 1),
            "Overfitting": (noisy_line(20, 15), 6),
            "Underfitting": (rows([(i, random.Random(7).gauss(0, 10)) for i in range(200)]), 1),
        }
        for expected, (data, degree) in cases.items():
            with self.subTest(verdict=expected):
                result = ModelDiagnosticsService.diagnose(data, "x", "y", degree=degree)
                self.assertEqual(result["status"], "ok")
                self.assertEqual(result["diagnosis"]["verdict"], expected)

    def test_every_verdict_carries_an_explanation_and_a_recommendation(self):
        for data, degree in ((noisy_line(150, 2), 1), (noisy_line(20, 15), 6),
                             (rows([(i, random.Random(7).gauss(0, 10)) for i in range(200)]), 1)):
            d = ModelDiagnosticsService.diagnose(data, "x", "y", degree=degree)["diagnosis"]
            with self.subTest(verdict=d["verdict"]):
                self.assertTrue(d["explanation"].strip())
                self.assertTrue(d["recommendation"].strip())
                self.assertIn(d["severity"], ("None", "Moderate", "High"))


class TestGoodFit(unittest.TestCase):
    def test_linear_relationship_with_light_noise_is_a_good_fit(self):
        rng = random.Random(23)
        data = rows([(i, 4.0 * i + rng.gauss(0, 2)) for i in range(150)])
        d = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)["diagnosis"]

        self.assertEqual(d["verdict"], "Good Fit")
        self.assertGreater(d["train_r2"], 0.90)
        self.assertLess(abs(d["generalization_gap"]), 0.15)

    def test_a_good_fit_carries_both_curves_and_cross_validation(self):
        rng = random.Random(29)
        data = rows([(i, 4.0 * i + rng.gauss(0, 2)) for i in range(150)])
        result = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)

        self.assertGreater(len(result["learning_curve"]), 0)
        self.assertGreater(len(result["complexity_curve"]), 0)
        self.assertGreater(result["cross_validation"]["mean_r2"], 0.9)


class TestGuards(unittest.TestCase):
    def test_too_few_rows_is_reported_not_guessed(self):
        data = rows([(i, i * 2.0) for i in range(MIN_ROWS_FOR_DIAGNOSIS - 1)])
        result = ModelDiagnosticsService.diagnose(data, "x", "y")

        self.assertEqual(result["status"], "insufficient_data")
        self.assertIsNone(result["diagnosis"])
        self.assertIn(str(MIN_ROWS_FOR_DIAGNOSIS), result["message"])

    def test_exactly_the_minimum_row_count_is_accepted(self):
        data = rows([(i, i * 2.0) for i in range(MIN_ROWS_FOR_DIAGNOSIS)])
        self.assertEqual(ModelDiagnosticsService.diagnose(data, "x", "y")["status"], "ok")

    def test_imputation_placeholders_are_excluded_not_counted_as_zero(self):
        """A filled gap must never enter the fit as if it were an observation."""
        data = rows([(i, i * 2.0) for i in range(40)])
        for r in data[:10]:
            r["y"] = "Unknown"

        result = ModelDiagnosticsService.diagnose(data, "x", "y")
        q = result["data_quality"]

        self.assertEqual(q["usable_rows"], 30)
        self.assertEqual(q["dropped_missing"], 10)
        self.assertEqual(q["dropped_non_numeric"], 0)

    def test_non_numeric_values_are_counted_separately_from_missing(self):
        data = rows([(i, i * 2.0) for i in range(40)])
        for r in data[:8]:
            r["y"] = "chest pain"

        q = ModelDiagnosticsService.diagnose(data, "x", "y")["data_quality"]
        self.assertEqual(q["dropped_non_numeric"], 8)
        self.assertEqual(q["dropped_missing"], 0)

    def test_absent_columns_do_not_raise(self):
        result = ModelDiagnosticsService.diagnose(rows([(1, 2)]), "nope", "also_nope")
        self.assertEqual(result["status"], "insufficient_data")

    def test_a_verdict_is_reproducible_across_runs(self):
        rng = random.Random(31)
        data = rows([(i, 4.0 * i + rng.gauss(0, 3)) for i in range(120)])
        first = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)
        second = ModelDiagnosticsService.diagnose(data, "x", "y", degree=1)

        self.assertEqual(first["diagnosis"], second["diagnosis"])
        self.assertEqual(first["metrics"], second["metrics"])


class TestModelableColumns(unittest.TestCase):
    def test_numeric_columns_are_offered_and_text_columns_are_not(self):
        data = [{"visits": i, "los": i * 1.5, "problem": "Chest pain"} for i in range(30)]
        cols = ModelDiagnosticsService.numeric_columns(data)

        self.assertIn("visits", cols)
        self.assertIn("los", cols)
        self.assertNotIn("problem", cols)

    def test_a_mostly_placeholder_column_is_not_offered(self):
        data = [{"visits": i, "sparse": "Unknown" if i % 4 else i} for i in range(40)]
        self.assertNotIn("sparse", ModelDiagnosticsService.numeric_columns(data))


if __name__ == "__main__":
    unittest.main()
