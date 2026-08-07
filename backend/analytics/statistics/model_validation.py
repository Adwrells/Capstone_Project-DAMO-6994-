"""
Model validation primitives — train/test splitting, polynomial fitting, error metrics,
learning curves, and overfitting / underfitting diagnosis.

Pure computation only: no I/O, no database access, no domain vocabulary. Business handlers
compose these (see backend/services/model_diagnostics_service.py).

Stdlib only, matching the rest of backend/analytics/statistics/.
"""

import math
import random
from typing import Any, Dict, List, Sequence, Tuple

# A model needs at least this many rows before a train/validation split says anything.
MIN_ROWS_FOR_CURVE = 10

# train_r2 below this means the model has not learned the signal at all.
UNDERFIT_R2_THRESHOLD = 0.30

# train_r2 - test_r2 above this means the model memorised the training rows.
OVERFIT_GAP_THRESHOLD = 0.15


# ─────────────────────────────────────────────────────────────────────────────
# Splitting
# ─────────────────────────────────────────────────────────────────────────────

def train_test_split(
    x: Sequence[float],
    y: Sequence[float],
    test_ratio: float = 0.3,
    seed: int = 42,
) -> Tuple[List[float], List[float], List[float], List[float]]:
    """Shuffle-split paired samples into (x_train, y_train, x_test, y_test).

    Deterministic for a given seed so a reported diagnosis is reproducible.
    """
    n = min(len(x), len(y))
    if n == 0:
        return [], [], [], []

    indices = list(range(n))
    random.Random(seed).shuffle(indices)

    n_test = int(n * test_ratio)
    test_idx, train_idx = indices[:n_test], indices[n_test:]

    return (
        [float(x[i]) for i in train_idx],
        [float(y[i]) for i in train_idx],
        [float(x[i]) for i in test_idx],
        [float(y[i]) for i in test_idx],
    )


def _fold_slices(n: int, k: int) -> List[Tuple[int, int]]:
    """Contiguous (start, end) index ranges for k roughly equal folds."""
    size, remainder, start, slices = n // k, n % k, 0, []
    for i in range(k):
        end = start + size + (1 if i < remainder else 0)
        slices.append((start, end))
        start = end
    return slices


# ─────────────────────────────────────────────────────────────────────────────
# Polynomial least squares
# ─────────────────────────────────────────────────────────────────────────────

def _solve(matrix: List[List[float]], rhs: List[float]) -> List[float]:
    """Gaussian elimination with partial pivoting. Returns [] if singular."""
    n = len(matrix)
    aug = [row[:] + [rhs[i]] for i, row in enumerate(matrix)]

    for col in range(n):
        pivot = max(range(col, n), key=lambda r: abs(aug[r][col]))
        if abs(aug[pivot][col]) < 1e-12:
            return []
        aug[col], aug[pivot] = aug[pivot], aug[col]

        for row in range(col + 1, n):
            factor = aug[row][col] / aug[col][col]
            for c in range(col, n + 1):
                aug[row][c] -= factor * aug[col][c]

    solution = [0.0] * n
    for row in range(n - 1, -1, -1):
        total = aug[row][n] - sum(aug[row][c] * solution[c] for c in range(row + 1, n))
        solution[row] = total / aug[row][row]
    return solution


def polynomial_fit(x: Sequence[float], y: Sequence[float], degree: int = 1) -> List[float]:
    """Least-squares polynomial coefficients in ascending order: [c0, c1, ... c_degree].

    Returns all-zero coefficients when the system is underdetermined or singular
    (fewer points than parameters, or zero variance in x).
    """
    n = min(len(x), len(y))
    degree = max(0, int(degree))
    if n < degree + 1:
        return [0.0] * (degree + 1)

    xs = [float(v) for v in x[:n]]
    ys = [float(v) for v in y[:n]]

    # Normal equations: (VᵀV)c = Vᵀy, built from power sums of x.
    power_sums = [sum(xi ** p for xi in xs) for p in range(2 * degree + 1)]
    matrix = [[power_sums[i + j] for j in range(degree + 1)] for i in range(degree + 1)]
    rhs = [sum(ys[i] * xs[i] ** p for i in range(n)) for p in range(degree + 1)]

    coeffs = _solve(matrix, rhs)
    return coeffs if coeffs else [0.0] * (degree + 1)


def polynomial_predict(coeffs: Sequence[float], x: Sequence[float]) -> List[float]:
    """Evaluate a polynomial (ascending coefficients) at each point via Horner's method."""
    if not coeffs:
        return [0.0] * len(x)
    out = []
    for xi in x:
        acc = 0.0
        for c in reversed(coeffs):
            acc = acc * float(xi) + c
        out.append(acc)
    return out


def _rescale(values: Sequence[float]) -> List[float]:
    """Map x onto [-1, 1] to keep high-degree normal equations well conditioned.

    Used internally by the curve helpers, which report metrics rather than coefficients —
    an affine reparametrisation of x does not change what a degree-d polynomial can fit.
    """
    if not values:
        return []
    lo, hi = min(values), max(values)
    if hi - lo < 1e-12:
        return [0.0] * len(values)
    return [2.0 * (float(v) - lo) / (hi - lo) - 1.0 for v in values]


# ─────────────────────────────────────────────────────────────────────────────
# Error metrics
# ─────────────────────────────────────────────────────────────────────────────

def rmse(actual: Sequence[float], predicted: Sequence[float]) -> float:
    n = min(len(actual), len(predicted))
    if n == 0:
        return 0.0
    return round(math.sqrt(sum((actual[i] - predicted[i]) ** 2 for i in range(n)) / n), 6)


def mae(actual: Sequence[float], predicted: Sequence[float]) -> float:
    n = min(len(actual), len(predicted))
    if n == 0:
        return 0.0
    return round(sum(abs(actual[i] - predicted[i]) for i in range(n)) / n, 6)


def r_squared(actual: Sequence[float], predicted: Sequence[float]) -> float:
    """Coefficient of determination. Returns 0.0 for empty input or zero-variance actuals.

    Can be negative when the model predicts worse than the mean — that is a real signal,
    so it is not clamped.
    """
    n = min(len(actual), len(predicted))
    if n == 0:
        return 0.0
    mean_actual = sum(actual[:n]) / n
    ss_tot = sum((actual[i] - mean_actual) ** 2 for i in range(n))
    if ss_tot < 1e-12:
        return 0.0
    ss_res = sum((actual[i] - predicted[i]) ** 2 for i in range(n))
    return round(1.0 - ss_res / ss_tot, 6)


# ─────────────────────────────────────────────────────────────────────────────
# Diagnosis
# ─────────────────────────────────────────────────────────────────────────────

def diagnose_fit(
    train_r2: float,
    test_r2: float,
    gap_threshold: float = OVERFIT_GAP_THRESHOLD,
    underfit_threshold: float = UNDERFIT_R2_THRESHOLD,
) -> Dict[str, Any]:
    """Classify a fitted model as Underfitting, Overfitting, or Good Fit.

    Underfitting is checked first: a model that never learned the training signal is
    underfit regardless of how its (equally poor) scores happen to differ.
    """
    gap = round(train_r2 - test_r2, 6)

    if train_r2 < underfit_threshold:
        severity = "High" if train_r2 < underfit_threshold / 2 else "Moderate"
        return {
            "verdict": "Underfitting",
            "severity": severity,
            "train_r2": round(train_r2, 6),
            "test_r2": round(test_r2, 6),
            "generalization_gap": gap,
            "explanation": (
                f"The model explains only {train_r2:.1%} of variance on the data it was "
                f"trained on. It is too simple for the signal, or the predictor carries "
                f"little information about the target."
            ),
            "recommendation": (
                "Increase model complexity (higher polynomial degree), add informative "
                "predictors, or revisit whether the cleaned feature actually relates to "
                "the target."
            ),
        }

    if gap > gap_threshold:
        severity = "High" if gap > gap_threshold * 3 else "Moderate"
        return {
            "verdict": "Overfitting",
            "severity": severity,
            "train_r2": round(train_r2, 6),
            "test_r2": round(test_r2, 6),
            "generalization_gap": gap,
            "explanation": (
                f"Training R² of {train_r2:.3f} drops to {test_r2:.3f} on held-out data — "
                f"a generalization gap of {gap:.3f}. The model is fitting noise specific "
                f"to the training rows."
            ),
            "recommendation": (
                "Reduce model complexity (lower polynomial degree), add regularisation, "
                "or increase the training sample. Check that cleaning did not introduce "
                "leakage between the split halves."
            ),
        }

    return {
        "verdict": "Good Fit",
        "severity": "None",
        "train_r2": round(train_r2, 6),
        "test_r2": round(test_r2, 6),
        "generalization_gap": gap,
        "explanation": (
            f"Training R² of {train_r2:.3f} and held-out R² of {test_r2:.3f} agree within "
            f"{abs(gap):.3f}. The model generalises to data it has not seen."
        ),
        "recommendation": "No corrective action needed. Re-check after any change to the cleaning pipeline.",
    }


# ─────────────────────────────────────────────────────────────────────────────
# Curves
# ─────────────────────────────────────────────────────────────────────────────

def learning_curve(
    x: Sequence[float],
    y: Sequence[float],
    degree: int = 1,
    steps: int = 5,
    test_ratio: float = 0.3,
    seed: int = 42,
) -> List[Dict[str, Any]]:
    """Train and validation error as the training sample grows.

    Converging curves at high error indicate underfitting; a persistent gap between a low
    training error and a high validation error indicates overfitting.
    """
    n = min(len(x), len(y))
    if n < MIN_ROWS_FOR_CURVE or steps < 1:
        return []

    x_train, y_train, x_val, y_val = train_test_split(x, y, test_ratio=test_ratio, seed=seed)
    if not x_val or len(x_train) < degree + 2:
        return []

    scale = _rescale(list(x_train) + list(x_val))
    x_train_s, x_val_s = scale[:len(x_train)], scale[len(x_train):]

    smallest = max(degree + 2, len(x_train) // steps)
    points: List[Dict[str, Any]] = []

    for step in range(1, steps + 1):
        size = min(len(x_train), int(smallest + (len(x_train) - smallest) * (step - 1) / max(1, steps - 1)))
        if size < degree + 2:
            continue

        xs, ys = x_train_s[:size], y_train[:size]
        coeffs = polynomial_fit(xs, ys, degree)

        points.append({
            "train_size": size,
            "train_rmse": rmse(ys, polynomial_predict(coeffs, xs)),
            "validation_rmse": rmse(y_val, polynomial_predict(coeffs, x_val_s)),
            "train_r2": r_squared(ys, polynomial_predict(coeffs, xs)),
            "validation_r2": r_squared(y_val, polynomial_predict(coeffs, x_val_s)),
        })

    return points


def complexity_curve(
    x: Sequence[float],
    y: Sequence[float],
    degrees: Sequence[int] = (1, 2, 3, 4, 5, 6),
    test_ratio: float = 0.3,
    seed: int = 42,
) -> List[Dict[str, Any]]:
    """Train and validation R² across model complexity.

    The degree where validation R² peaks and then falls away from training R² is the
    onset of overfitting.
    """
    n = min(len(x), len(y))
    if n < MIN_ROWS_FOR_CURVE:
        return []

    x_train, y_train, x_val, y_val = train_test_split(x, y, test_ratio=test_ratio, seed=seed)
    if not x_val:
        return []

    scale = _rescale(list(x_train) + list(x_val))
    x_train_s, x_val_s = scale[:len(x_train)], scale[len(x_train):]

    points: List[Dict[str, Any]] = []
    for degree in degrees:
        if len(x_train_s) < degree + 2:
            continue
        coeffs = polynomial_fit(x_train_s, y_train, degree)
        train_r2 = r_squared(y_train, polynomial_predict(coeffs, x_train_s))
        val_r2 = r_squared(y_val, polynomial_predict(coeffs, x_val_s))
        points.append({
            "degree": degree,
            "train_r2": train_r2,
            "validation_r2": val_r2,
            "train_rmse": rmse(y_train, polynomial_predict(coeffs, x_train_s)),
            "validation_rmse": rmse(y_val, polynomial_predict(coeffs, x_val_s)),
            "gap": round(train_r2 - val_r2, 6),
        })

    return points


def k_fold_scores(
    x: Sequence[float],
    y: Sequence[float],
    degree: int = 1,
    k: int = 5,
    seed: int = 42,
) -> Dict[str, Any]:
    """k-fold cross-validated R². A large std across folds means an unstable model."""
    n = min(len(x), len(y))
    if n < k * 2 or k < 2:
        return {"fold_scores": [], "mean_r2": 0.0, "std_r2": 0.0, "k": k}

    indices = list(range(n))
    random.Random(seed).shuffle(indices)
    xs = _rescale([float(x[i]) for i in indices])
    ys = [float(y[i]) for i in indices]

    scores: List[float] = []
    for start, end in _fold_slices(n, k):
        x_val, y_val = xs[start:end], ys[start:end]
        x_train = xs[:start] + xs[end:]
        y_train = ys[:start] + ys[end:]
        if len(x_train) < degree + 2 or not x_val:
            continue
        coeffs = polynomial_fit(x_train, y_train, degree)
        scores.append(r_squared(y_val, polynomial_predict(coeffs, x_val)))

    if not scores:
        return {"fold_scores": [], "mean_r2": 0.0, "std_r2": 0.0, "k": k}

    mean_r2 = sum(scores) / len(scores)
    variance = sum((s - mean_r2) ** 2 for s in scores) / len(scores)

    return {
        "fold_scores": [round(s, 6) for s in scores],
        "mean_r2": round(mean_r2, 6),
        "std_r2": round(math.sqrt(variance), 6),
        "k": k,
    }
