import csv
from pathlib import Path
from typing import List, Dict, Any, Optional
from backend.database.database_manager import db_manager

EXPLORER_DIR = Path(__file__).parent.parent.parent.parent / "data" / "explorer"

def load_csv_to_sqlite(csv_path: str, table_name: str, drop_if_exists: bool = True) -> Dict[str, Any]:
    path = Path(csv_path)
    if not path.exists():
        return {"error": f"CSV file not found: {csv_path}", "rows_loaded": 0}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = [row for row in reader]
    if not rows:
        return {"error": f"CSV file is empty: {csv_path}", "rows_loaded": 0}
    columns = list(rows[0].keys())
    if drop_if_exists:
        db_manager.execute_command(f'DROP TABLE IF EXISTS "{table_name}"')
    def infer_type(col: str) -> str:
        for r in rows:
            val = r.get(col, "").strip()
            if not val or val.lower() in ("null", "none", "nan", "n/a"):
                continue
            try:
                int(val)
                return "INTEGER"
            except ValueError:
                try:
                    float(val)
                    return "REAL"
                except ValueError:
                    return "TEXT"
        return "TEXT"

    col_defs = ", ".join(f'"{col}" {infer_type(col)}' for col in columns)
    db_manager.execute_command(f'CREATE TABLE IF NOT EXISTS "{table_name}" ({col_defs})')
    placeholders = ", ".join("?" * len(columns))
    insert_sql = f'INSERT INTO "{table_name}" ({", ".join(f"{chr(34)}{c}{chr(34)}" for c in columns)}) VALUES ({placeholders})'
    with db_manager.get_connection() as conn:
        cursor = conn.cursor()
        for row in rows:
            vals = [None if row.get(col, "").strip().lower() in ("null", "none", "nan", "n/a", "") else row.get(col, "").strip() for col in columns]
            cursor.execute(insert_sql, vals)
        conn.commit()
    return {"status": "success", "table_name": table_name, "rows_loaded": len(rows), "columns": columns}

def load_all_explorer_datasets(explorer_dir: Optional[str] = None) -> List[Dict[str, Any]]:
    target_dir = Path(explorer_dir) if explorer_dir else EXPLORER_DIR
    if not target_dir.exists():
        return [{"error": f"Explorer directory not found: {target_dir}"}]
    results = []
    for csv_file in sorted(target_dir.glob("*.csv")):
        table_name = csv_file.stem.lower().replace(" ", "_").replace("-", "_")
        results.append(load_csv_to_sqlite(str(csv_file), table_name))
    return results
