"""
Test Suite: Dependency declaration contract.

Fails when a third-party module is imported by backend/ or tests/ but not declared in
requirements.txt. That drift does not break anything on a developer machine where the
package is already installed — it breaks on a fresh clone, which is exactly where it is
most expensive to discover.

Scans the AST rather than running the imports, so it stays fast and needs nothing installed.
"""

import ast
import sys
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
SCANNED = ("backend", "tests")

# Import name -> distribution name on PyPI, where they differ.
IMPORT_TO_DISTRIBUTION = {
    "sklearn": "scikit-learn",
    "yaml": "pyyaml",
    "dateutil": "python-dateutil",
    "PIL": "pillow",
    "multipart": "python-multipart",
    "dotenv": "python-dotenv",
    "pip_audit": "pip-audit",
    "jose": "python-jose",
}

# First-party packages — resolved from the repository, never installed.
LOCAL_PACKAGES = {
    "backend", "tests", "api", "database", "services", "analytics",
    "preprocessing", "models", "utils", "config", "auth",
}


def _iter_python_files():
    for base in SCANNED:
        for path in (PROJECT_ROOT / base).rglob("*.py"):
            if "__pycache__" not in path.parts:
                yield path


def collect_third_party_imports():
    """Top-level third-party module names imported anywhere in the scanned trees."""
    stdlib = set(sys.stdlib_module_names)
    found = {}

    for path in _iter_python_files():
        try:
            tree = ast.parse(path.read_text(encoding="utf-8"))
        except SyntaxError:  # pragma: no cover - a broken file is another suite's problem
            continue

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                names = [alias.name for alias in node.names]
            elif isinstance(node, ast.ImportFrom) and node.module and node.level == 0:
                names = [node.module]
            else:
                continue

            for name in names:
                root = name.split(".")[0]
                if root not in stdlib and root not in LOCAL_PACKAGES:
                    found.setdefault(root, set()).add(str(path.relative_to(PROJECT_ROOT)))

    return found


def declared_distributions():
    """Lower-cased distribution names listed in requirements.txt."""
    text = (PROJECT_ROOT / "requirements.txt").read_text(encoding="utf-8")
    names = set()

    for line in text.splitlines():
        line = line.split("#")[0].strip()
        if not line or line.startswith("-"):
            continue
        for separator in (">=", "<=", "==", "~=", ">", "<", "["):
            line = line.split(separator)[0]
        names.add(line.strip().lower())

    return names


class TestDependencyDeclarations(unittest.TestCase):
    def test_every_third_party_import_is_declared(self):
        declared = declared_distributions()
        imports = collect_third_party_imports()

        undeclared = {
            module: sorted(files)
            for module, files in imports.items()
            if IMPORT_TO_DISTRIBUTION.get(module, module).lower() not in declared
        }

        self.assertEqual(
            undeclared,
            {},
            "Imported but missing from requirements.txt — a fresh clone would fail:\n"
            + "\n".join(f"  {m}: {', '.join(f)}" for m, f in sorted(undeclared.items())),
        )

    def test_requirements_file_is_parseable_and_non_empty(self):
        declared = declared_distributions()
        self.assertGreater(len(declared), 5)
        for name in declared:
            self.assertNotIn(" ", name, f"Malformed requirement entry: {name!r}")

    def test_core_runtime_packages_are_declared(self):
        """Guards the packages that are never imported directly and so look prunable.

        openpyxl is pandas' .xlsx engine (load_csv reads the cleaned workbook through it),
        python-multipart backs FastAPI form uploads, and pytest-cov supplies --cov.
        Removing any of them breaks a fresh install with no import to point at.
        """
        declared = declared_distributions()
        for name in ("openpyxl", "python-multipart", "pytest-cov", "fastapi", "pandas"):
            self.assertIn(name, declared, f"{name} must stay in requirements.txt")


if __name__ == "__main__":
    unittest.main()
