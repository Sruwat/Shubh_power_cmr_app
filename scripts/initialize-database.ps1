$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
if (!(Test-Path "backend\.env")) {
  throw "backend\.env is missing. Copy backend\.env.example, set the Atlas password, then rerun."
}
.\.venv\Scripts\python.exe -m backend.scripts.init_database
if ($LASTEXITCODE -ne 0) { throw "init_database failed" }
.\.venv\Scripts\python.exe -m backend.scripts.import_station_data
if ($LASTEXITCODE -ne 0) { throw "import_station_data failed" }
.\.venv\Scripts\python.exe -m backend.scripts.seed_database
if ($LASTEXITCODE -ne 0) { throw "seed_database failed" }
.\.venv\Scripts\python.exe -m backend.scripts.verify_database
if ($LASTEXITCODE -ne 0) { throw "verify_database failed" }
