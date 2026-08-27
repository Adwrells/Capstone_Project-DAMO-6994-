"""
Healthcare Analytics Platform — one-shot launcher.

Installs Node and Python dependencies, verifies the analytical database, frees stale ports,
runs the test suite as a smoke check, then starts both servers:

    Node/Vite  → http://localhost:3000   (UI, and proxy to the API)
    FastAPI    → http://localhost:8000   (analytics, model diagnostics, dataset persistence)

Run from the repository root: python launch.py
"""

import os
import signal
import socket
import sys
import subprocess
import time
import webbrowser
import shutil

NODE_PORT = int(os.getenv("PORT", "3000"))
VITE_HMR_PORT = 24678
API_PORT = int(os.getenv("API_PORT", "8000"))

# Resolve everything against the script's own directory rather than the caller's cwd.
# Every backend module imports `backend.*`, which only resolves from the repository root,
# so the launcher moves there itself instead of requiring the caller to be in the right
# place. This is what makes `python /app/launch.py` behave identically to `python launch.py`.
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

IS_WINDOWS = sys.platform == "win32"


def in_container():
    """True when running inside Docker or another container runtime."""
    if os.path.exists("/.dockerenv"):
        return True
    if os.getenv("container"):
        return True
    try:
        with open("/proc/1/cgroup", "r", encoding="utf-8") as handle:
            return any(marker in handle.read() for marker in ("docker", "containerd", "kubepods"))
    except OSError:
        return False


def is_interactive():
    """False in Docker, CI, or any pipe — where prompting would hang or hit EOF."""
    if in_container() or os.getenv("CI"):
        return False
    try:
        return sys.stdin is not None and sys.stdin.isatty()
    except (AttributeError, ValueError):
        return False


def run_command(command, check=True):
    print(f"Running: {' '.join(command)}")
    # Use shell=True on Windows for commands like 'npm' to work seamlessly
    result = subprocess.run(command, shell=(sys.platform == 'win32'))
    if check and result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}: {' '.join(command)}")
        sys.exit(result.returncode)
    return result


def port_in_use(port):
    """True when something is already listening on the port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.5)
        return sock.connect_ex(("127.0.0.1", port)) == 0


def free_port(port, label):
    """Stops whatever holds the port, after asking.

    A stale server here is genuinely confusing rather than merely inconvenient:
    server.ts is not hot-reloaded, so an old process keeps serving old backend code while
    Vite hot-reloads the frontend. The UI then appears updated while API behaviour is not.
    """
    if not port_in_use(port):
        return True

    print(f"\n  Port {port} ({label}) is already in use.")
    print("  A previous server is still running. Because server.ts does not hot-reload,")
    print("  leaving it running would serve stale backend code against a fresh frontend.")

    if is_interactive():
        try:
            answer = input(f"  Stop the process holding port {port}? [Y/n] ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            answer = "n"
        if answer not in ("", "y", "yes"):
            print(f"  Leaving port {port} alone. Startup will fail with EADDRINUSE.")
            return False
    else:
        # Non-interactive (Docker, CI): prompting would hang or hit EOF, so reclaim the
        # port automatically. A container that cannot bind its port is useless anyway.
        print("  Non-interactive environment — reclaiming the port automatically.")

    # No shell anywhere below: arguments are passed as lists so nothing is re-parsed as a
    # shell command, and every PID is checked to be numeric before it reaches taskkill/kill.
    if sys.platform == "win32":
        found = subprocess.run(
            ["netstat", "-ano", "-p", "TCP"], capture_output=True, text=True
        )
        pids = {
            parts[-1]
            for line in found.stdout.splitlines()
            if f":{port} " in line and "LISTENING" in line
            for parts in [line.split()]
            if parts and parts[-1].isdigit()
        }
        for pid in pids:
            subprocess.run(["taskkill", "/PID", pid, "/F"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"  Stopped PID {pid}.")
    else:
        # node:20-slim ships neither lsof nor fuser, so try each and degrade gracefully
        # rather than crashing on a missing binary.
        pids = set()

        if shutil.which("lsof"):
            found = subprocess.run(["lsof", "-ti", f"tcp:{port}"],
                                   capture_output=True, text=True)
            pids.update(p for p in found.stdout.split() if p.isdigit())
        elif shutil.which("fuser"):
            found = subprocess.run(["fuser", f"{port}/tcp"],
                                   capture_output=True, text=True)
            pids.update(p for p in found.stdout.split() if p.isdigit())
        elif shutil.which("ss"):
            found = subprocess.run(["ss", "-lptnH", f"sport = :{port}"],
                                   capture_output=True, text=True)
            for chunk in found.stdout.split():
                if chunk.startswith("pid="):
                    candidate = chunk[4:].split(",")[0]
                    if candidate.isdigit():
                        pids.add(candidate)
        else:
            print("  No lsof, fuser or ss available to identify the process.")
            print(f"  Free port {port} manually, or set PORT to a different value.")
            return False

        for pid in pids:
            try:
                os.kill(int(pid), signal.SIGTERM)
                time.sleep(0.5)
                if port_in_use(port):
                    os.kill(int(pid), signal.SIGKILL)
                print(f"  Stopped PID {pid}.")
            except (ProcessLookupError, PermissionError) as exc:
                print(f"  Could not stop PID {pid}: {exc}")

    time.sleep(1)
    if port_in_use(port):
        print(f"  Port {port} is still held. Close it manually and retry.")
        return False

    print(f"  Port {port} is free.")
    return True

def preflight():
    """Fails fast on the mistakes that produce confusing symptoms later."""
    print("\n--- 0. Preflight ---")

    # Move to the repository root ourselves so the launcher works from any directory —
    # `python /app/launch.py` in a container behaves the same as `python launch.py` locally.
    os.chdir(PROJECT_ROOT)
    print(f"  Project root: {PROJECT_ROOT}")
    print(f"  Platform: {sys.platform}{' (container)' if in_container() else ''}")

    if not os.path.exists("package.json") or not os.path.isdir("backend"):
        print("  ERROR: package.json and backend/ were not found next to launch.py.")
        print(f"  Looked in: {PROJECT_ROOT}")
        sys.exit(1)

    if shutil.which("npm") is None:
        print("  ERROR: npm was not found on PATH. Install Node.js 20 or later.")
        sys.exit(1)

    if sys.version_info < (3, 10):
        print(f"  ERROR: Python 3.10+ required, found {sys.version.split()[0]}.")
        sys.exit(1)

    # The seeded database is committed; an empty schema means empty dashboards, which is
    # far easier to diagnose here than from a blank chart later.
    db_path = os.path.join("backend", "database", "healthcare.db")
    if os.path.exists(db_path):
        print(f"  Database present ({os.path.getsize(db_path) / 1024:.0f} KB).")
    else:
        print(f"  WARNING: {db_path} is missing. Dashboards will be empty.")
        print("  Rebuild it with: python -m backend.database.load_csv")

    # The preload reads this directory. It has silently pointed at a non-existent path
    # before, which left every dataset-gated page blank with no error shown.
    data_dir = os.path.join("data", "Explorer Dataset")
    if os.path.isdir(data_dir):
        csv_count = len([f for f in os.listdir(data_dir) if f.endswith(".csv")])
        print(f"  Preload datasets: {csv_count} CSV file(s) in {data_dir}.")
        if csv_count == 0:
            print("  WARNING: no CSVs found — the UI will start with no dataset loaded.")
    else:
        print(f"  WARNING: {data_dir} not found — the UI will start with no dataset loaded.")

    print("  Preflight OK.")


def main():
    print("=== Launching Healthcare Analytics Platform ===")

    preflight()

    print("\n--- 1. Checking and Installing Node Dependencies (npm install) ---")
    run_command(["npm", "install"])

    print("\n--- 2. Setting up Python Virtual Environment (.venv) ---")
    venv_dir = ".venv"
    is_windows = sys.platform == "win32"
    venv_python = os.path.join(venv_dir, "Scripts", "python.exe") if is_windows else os.path.join(venv_dir, "bin", "python")

    if os.path.exists(venv_dir):
        if os.path.exists(venv_python):
            try:
                # Test if the python executable actually works (it might be broken if moved/cloned)
                subprocess.check_call([venv_python, "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"Virtual environment '{venv_dir}' already exists and is valid.")
            except (subprocess.CalledProcessError, OSError):
                print(f"Virtual environment '{venv_dir}' is broken (e.g., copied from another machine). Recreating...")
                shutil.rmtree(venv_dir)
        else:
            print(f"Virtual environment '{venv_dir}' is missing python executable. Recreating...")
            shutil.rmtree(venv_dir)

    if not os.path.exists(venv_dir):
        print(f"Creating virtual environment in {venv_dir}...")
        run_command([sys.executable, "-m", "venv", venv_dir])
        
    if not os.path.exists(venv_python):
        print(f"Error: Could not find Python executable in virtual environment at {venv_python}")
        sys.exit(1)
        
    print("\n--- 3. Installing Python Requirements ---")
    if os.path.exists("requirements.txt"):
        run_command([venv_python, "-m", "pip", "install", "-r", "requirements.txt"])
    else:
        print("No requirements.txt found, skipping.")
        
    print("\n--- 4. Running Pytests ---")
    print("Checking tests...")
    # Quick import-check to detect broken venv packages (e.g. bad anyio install)
    # before running the full suite so we don't block startup with a noisy crash.
    import_check = subprocess.run(
        [venv_python, "-c", "import anyio, pytest"],
        capture_output=True, text=True
    )
    if import_check.returncode != 0:
        print("  WARNING: venv import check failed (likely broken anyio/pytest).")
        print("  Skipping venv pytest. Trying system Python...")
        sys_test = subprocess.run([sys.executable, "-m", "pytest", "--tb=short"], check=False)
        if sys_test.returncode != 0:
            print(f"  WARNING: pytest exited with code {sys_test.returncode}. Continuing startup.")
    else:
        test_proc = subprocess.run([venv_python, "-m", "pytest", "--tb=short"], check=False)
        if test_proc.returncode != 0:
            print(f"  WARNING: pytest exited with code {test_proc.returncode}. Continuing startup.")
    
    print("\n--- 5. Freeing Ports ---")
    # server.ts is NOT hot-reloaded. A leftover process keeps serving old backend code
    # while Vite hot-reloads the frontend, so the UI looks updated while the API is not.
    # That combination is genuinely hard to diagnose, hence clearing the ports up front.
    for port, label in ((NODE_PORT, "Node/Vite"), (VITE_HMR_PORT, "Vite HMR"), (API_PORT, "FastAPI")):
        if not free_port(port, label) and port == NODE_PORT:
            print("  Cannot start while port 3000 is occupied. Exiting.")
            sys.exit(1)
    print("  Ports ready.")

    print("\n--- 6. Starting the Application ---")

    processes = []

    # FastAPI first: the Node server proxies to it, and starting it first avoids a window
    # where the UI reports model diagnostics and dataset persistence as unavailable.
    print("Starting Python analytics backend... (python -m backend.main)")
    api_env = os.environ.copy()
    # Inside a container the API must bind all interfaces to be reachable from the host;
    # on a workstation it stays on loopback so the clinical dataset is not exposed to the LAN.
    api_env.setdefault("API_HOST", "0.0.0.0" if in_container() else "127.0.0.1")
    api_env.setdefault("API_PORT", str(API_PORT))
    
    # Try venv python first, fallback to sys.executable if needed
    py_exec = venv_python
    try:
        subprocess.check_call([py_exec, "-c", "import pandas"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        py_exec = sys.executable

    api_process = subprocess.Popen([py_exec, "-m", "backend.main"], env=api_env)
    processes.append(("FastAPI", api_process))

    # Wait for FastAPI to be ready before starting Node (avoids the race where
    # server.ts's ensurePythonBackendRunning() can't detect the port quickly
    # enough and launches a second conflicting uvicorn process).
    print("Waiting for FastAPI to become ready on port 8000...")
    for _ in range(40):
        time.sleep(0.5)
        if port_in_use(API_PORT):
            print(f"  FastAPI is up on http://localhost:{API_PORT}")
            break
    else:
        print(f"  WARNING: FastAPI did not open port {API_PORT} within 20s.")
        print("  The UI will start, but analytics features may be unavailable.")

    print("Starting Node/Vite server... (npm run dev)")
    # MANAGED_BY_LAUNCHER=1 tells server.ts to skip its own Python auto-starter;
    # launch.py already owns the FastAPI process and manages its lifecycle.
    # PYTHON_EXEC lets server.ts use the correct venv Python if it ever needs
    # to do anything Python-related (e.g. inline scripts, future features).
    node_env = os.environ.copy()
    node_env["MANAGED_BY_LAUNCHER"] = "1"
    node_env["PYTHON_EXEC"] = py_exec
    server_process = subprocess.Popen(["npm", "run", "dev"], shell=is_windows, env=node_env)
    processes.append(("Node/Vite", server_process))

    print("Waiting for Node/Vite server to start...")
    for _ in range(30):
        time.sleep(0.5)
        if port_in_use(NODE_PORT):
            break
    else:
        print("  WARNING: port 3000 did not open within 15s. Check the output above.")

    # Final status summary
    node_ok  = port_in_use(NODE_PORT)
    api_ok   = port_in_use(API_PORT)
    print("")
    print("  ┌────────────────────────────────────────────┐")
    print(f"  │  Node/Vite  http://localhost:{NODE_PORT}         {'✓ UP' if node_ok else '✗ DOWN'}  │")
    print(f"  │  FastAPI    http://localhost:{API_PORT}         {'✓ UP' if api_ok  else '✗ DOWN'}  │")
    print("  └────────────────────────────────────────────┘")
    if not api_ok:
        print("  WARNING: FastAPI is down. Analytics, ML, and statistics features will be unavailable.")

    url = f"http://localhost:{NODE_PORT}"
    if in_container() or os.getenv("NO_BROWSER"):
        # There is no browser inside a container, and webbrowser.open would either fail
        # silently or block. Print the URL for the host to open instead.
        print(f"\nApplication ready at {url}")
    else:
        print(f"\nOpening browser to {url} ...")
        try:
            webbrowser.open(url)
        except Exception as exc:
            print(f"  Could not open a browser ({exc}). Open {url} manually.")

    print("\nBoth servers are running. Press Ctrl+C to stop them.")
    try:
        # Exit as soon as either server dies, rather than leaving a half-running stack.
        while True:
            for name, proc in processes:
                if proc.poll() is not None:
                    print(f"\n{name} exited with code {proc.returncode}.")
                    raise KeyboardInterrupt
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\nStopping servers...")
        for name, proc in processes:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    print(f"  {name} did not stop in time; forcing.")
                    proc.kill()
                    proc.wait()
                print(f"  {name} stopped.")
        print("All servers stopped.")

if __name__ == "__main__":
    main()
