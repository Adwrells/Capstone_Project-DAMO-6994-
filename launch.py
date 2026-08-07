import os
import sys
import subprocess
import time
import webbrowser
import shutil
def run_command(command, check=True):
    print(f"Running: {' '.join(command)}")
    # Use shell=True on Windows for commands like 'npm' to work seamlessly
    result = subprocess.run(command, shell=(sys.platform == 'win32'))
    if check and result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}: {' '.join(command)}")
        sys.exit(result.returncode)
    return result

def main():
    print("=== Launching Healthcare Analytics Platform ===")
    
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
    # Running pytest through the virtual environment's python.
    # We set check=False so that if tests fail, we still have the option to start the app (you can change this to True if you want a strict block).
    run_command([venv_python, "-m", "pytest"], check=False)
    
    print("\n--- 5. Starting the Application ---")
    print("Starting server... (npm run dev)")
    
    # Start the dev server in a non-blocking way
    server_process = subprocess.Popen(["npm", "run", "dev"], shell=is_windows)
    
    # Wait a few seconds for the server to spin up before opening the browser
    print("Waiting 3 seconds for the server to start...")
    time.sleep(3)
    
    url = "http://localhost:3000"
    print(f"\nOpening browser to {url} ...")
    webbrowser.open(url)
    
    print("\nPress Ctrl+C to stop the server.")
    try:
        # Keep the script running to keep the server process alive and in the foreground
        server_process.wait()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server_process.terminate()
        server_process.wait()
        print("Server stopped.")

if __name__ == "__main__":
    main()
