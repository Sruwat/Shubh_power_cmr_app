$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
if (!(Test-Path "backend\.env")) {
  Write-Warning "backend\.env is missing. Copy backend\.env.example and set MONGODB_URI before Atlas verification."
}
$env:REQUIRE_MONGODB = "false"
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8010
