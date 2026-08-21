## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

### Setup — every developer must do this once

The skill and hook config in `.claude/` are committed, but **the `graphify` binary is not**.
Until you install it, the `PreToolUse` hooks in `.claude/settings.json` fire a command that
does not exist on your machine, and every Bash, Grep, Read and Glob call in Claude Code
reports a failing hook.

graphify is a Python package. The package name is `graphifyy`; the command is `graphify`.

```bash
uv tool install --upgrade graphifyy
```

No `uv`? `pip install graphifyy` works too. Then confirm the command resolves on PATH —
this is what the hooks rely on, so an install that is not on PATH still leaves them broken:

```bash
graphify --version
```

That should print `graphify 0.9.48` or newer. If the command is not found, add your tool
directory (`uv tool dir`, or pipx's `~/.local/bin`) to PATH and reopen the terminal.

Finally, build the graph once, from the repo root inside Claude Code, by typing `/graphify .`
at the Claude prompt. It is a slash command, not a shell command: running it in cmd or
PowerShell only gets you "not recognized as an internal or external command".

`graphify-out/` is gitignored. The graph is generated, large, and would conflict on every
merge, so each developer builds their own rather than pulling one.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
