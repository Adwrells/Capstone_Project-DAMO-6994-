"""
Model Diagnostics Service — overfitting / underfitting assessment on the cleaned dataset.

Runs immediately after the preprocessing pipeline: takes cleaned records, fits a model on a
train split, scores it on a held-out split, and reports whether the model generalises.

Composes backend/analytics/statistics/model_validation.py (pure math). All payload shaping
and domain vocabulary lives here, per the layering rule in architecture.md §1.
"""

from typing import Any, Dict, List, Optional, Sequence

try:
    from backend.analytics.statistics.model_validation import (
        complexity_curve, diagnose_fit, k_fold_scores, learning_curve,
        mae, polynomial_fit, polynomial_predict, r_squared, rmse, train_test_split,
    )
except ImportError:
    from analytics.statistics.model_validation import (
        complexity_curve, diagnose_fit, k_fold_scores, learning_curve,
        mae, polynomial_fit, polynomial_predict, r_squared, rmse, train_test_split,
    )

# Cap the scatter payload so a large cohort doesn't ship megabytes to the browser.
MAX_SCATTER_POINTS = 300

# Below this the split is noise, not evidence.
MIN_ROWS_FOR_DIAGNOSIS = 12


# Values the cleaning pipeline writes in place of a missing observation. These are absent
# data, not measurements, and must never reach a fit as if they were real.
MISSING_PLACEHOLDERS = {"", "unknown", "n/a", "na", "null", "none", "nan", "-"}


def _is_missing(value: Any) -> bool:
    """True when a cleaned value represents absent data rather than a measurement."""
    if value is None:
        return True
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return False
    return str(value).strip().lower() in MISSING_PLACEHOLDERS


def _to_float(value: Any) -> Optional[float]:
    """Coerce a cleaned-record value to float, rejecting imputation placeholders."""
    if _is_missing(value) or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(str(value).strip().replace(",", ""))
    except ValueError:
        return None


def _extract_pairs(
    records: Sequence[Dict[str, Any]],
    feature: str,
    target: str,
) -> Dict[str, Any]:
    """Pull aligned numeric (feature, target) pairs, counting what was dropped and why."""
    xs: List[float] = []
    ys: List[float] = []
    dropped_missing = 0
    dropped_non_numeric = 0

    for row in records:
        if feature not in row or target not in row:
            dropped_missing += 1
            continue
        raw_x, raw_y = row.get(feature), row.get(target)
        fx, fy = _to_float(raw_x), _to_float(raw_y)
        if fx is None or fy is None:
            if _is_missing(raw_x) or _is_missing(raw_y):
                dropped_missing += 1
            else:
                dropped_non_numeric += 1
            continue
        xs.append(fx)
        ys.append(fy)

    return {
        "x": xs,
        "y": ys,
        "usable_rows": len(xs),
        "dropped_missing": dropped_missing,
        "dropped_non_numeric": dropped_non_numeric,
    }


class ModelDiagnosticsService:
    """Assesses generalization of a model fitted on the post-cleaning dataset."""

    @staticmethod
    def numeric_columns(records: Sequence[Dict[str, Any]], min_ratio: float = 0.6) -> List[str]:
        """Columns whose values are numeric often enough to model. Used to populate the UI."""
        if not records:
            return []
        sample = records[:500]
        columns: List[str] = []
        for key in sample[0].keys():
            numeric = sum(1 for row in sample if _to_float(row.get(key)) is not None)
            if numeric / len(sample) >= min_ratio:
                columns.append(key)
        return columns

    @staticmethod
    def diagnose(
        records: Sequence[Dict[str, Any]],
        feature: str,
        target: str,
        degree: int = 1,
        test_ratio: float = 0.3,
        seed: int = 42,
    ) -> Dict[str, Any]:
        """Full overfitting / underfitting assessment for one feature-target pair.

        Returns a payload the Fit Diagnostics panel renders directly: the verdict, the
        train vs holdout metrics, a learning curve, a complexity curve, cross-validation
        stability, and scatter/residual points.
        """
        extracted = _extract_pairs(records, feature, target)
        x, y = extracted["x"], extracted["y"]

        data_quality = {
            "total_rows": len(records),
            "usable_rows": extracted["usable_rows"],
            "dropped_missing": extracted["dropped_missing"],
            "dropped_non_numeric": extracted["dropped_non_numeric"],
            "usable_ratio": round(extracted["usable_rows"] / len(records), 4) if records else 0.0,
        }

        if len(x) < MIN_ROWS_FOR_DIAGNOSIS:
            return {
                "status": "insufficient_data",
                "feature": feature,
                "target": target,
                "message": (
                    f"Only {len(x)} usable numeric rows after cleaning — at least "
                    f"{MIN_ROWS_FOR_DIAGNOSIS} are needed for a train/holdout split."
                ),
                "data_quality": data_quality,
                "diagnosis": None,
                "learning_curve": [],
                "complexity_curve": [],
                "cross_validation": {"fold_scores": [], "mean_r2": 0.0, "std_r2": 0.0, "k": 5},
                "scatter": [],
                "residuals": [],
            }

        x_train, y_train, x_test, y_test = train_test_split(x, y, test_ratio=test_ratio, seed=seed)
        coeffs = polynomial_fit(x_train, y_train, degree)

        train_pred = polynomial_predict(coeffs, x_train)
        test_pred = polynomial_predict(coeffs, x_test)

        train_r2 = r_squared(y_train, train_pred)
        test_r2 = r_squared(y_test, test_pred)
        diagnosis = diagnose_fit(train_r2, test_r2)

        curve = complexity_curve(x, y, degrees=[1, 2, 3, 4, 5, 6], test_ratio=test_ratio, seed=seed)
        best = max(curve, key=lambda p: p["validation_r2"]) if curve else None

        # Scatter + residuals, thinned for transport. Holdout points are flagged so the
        # chart can show where the model was actually tested.
        stride = max(1, len(x_train) // MAX_SCATTER_POINTS)
        scatter = [
            {"x": x_train[i], "actual": y_train[i], "predicted": round(train_pred[i], 4), "split": "train"}
            for i in range(0, len(x_train), stride)
        ]
        test_stride = max(1, len(x_test) // MAX_SCATTER_POINTS)
        scatter += [
            {"x": x_test[i], "actual": y_test[i], "predicted": round(test_pred[i], 4), "split": "holdout"}
            for i in range(0, len(x_test), test_stride)
        ]

        residuals = [
            {"predicted": p["predicted"], "residual": round(p["actual"] - p["predicted"], 4), "split": p["split"]}
            for p in scatter
        ]

        return {
            "status": "ok",
            "feature": feature,
            "target": target,
            "degree": degree,
            "test_ratio": test_ratio,
            "data_quality": data_quality,
            "diagnosis": diagnosis,
            "metrics": {
                "train": {
                    "n": len(x_train),
                    "r2": train_r2,
                    "rmse": rmse(y_train, train_pred),
                    "mae": mae(y_train, train_pred),
                },
                "holdout": {
                    "n": len(x_test),
                    "r2": test_r2,
                    "rmse": rmse(y_test, test_pred),
                    "mae": mae(y_test, test_pred),
                },
            },
            "learning_curve": learning_curve(x, y, degree=degree, steps=6, test_ratio=test_ratio, seed=seed),
            "complexity_curve": curve,
            "optimal_degree": best["degree"] if best else degree,
            "cross_validation": k_fold_scores(x, y, degree=degree, k=5, seed=seed),
            "scatter": scatter,
            "residuals": residuals,
        }


model_diagnostics_service = ModelDiagnosticsService()
