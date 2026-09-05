import os
import re

PATTERNS = [
    r"0\.3163",
    r"116\.5954",
    r"-116\.60",
    r"-1\.94",
    r"8\.33",
    r"4\.21",
    r"2\.89M",
    r"1\.25M",
    r"13\.62",
    r"1\.34x",
    r"15%",
    r"18%",
    r"2\.2 hours",
    r"65%",
    r"42%"
]

IGNORE_DIRS = {".git", ".venv", "node_modules", ".pytest_cache", "__pycache__", "dist"}

combined = re.compile("|".join(PATTERNS), re.IGNORECASE)

results = []
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
    for file in files:
        if file.endswith((".py", ".ts", ".tsx", ".md", ".json", ".sql", ".html")) and not file.startswith("transcript"):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    for i, line in enumerate(f, 1):
                        m = combined.search(line)
                        if m:
                            results.append((filepath, i, m.group(0), line.strip()[:100]))
            except Exception as e:
                pass

print(f"Total occurrences found: {len(results)}")
for r in results[:100]:
    print(f"{r[0]}:{r[1]} [{r[2]}] -> {r[3]}")
