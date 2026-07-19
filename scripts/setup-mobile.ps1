$ErrorActionPreference = "Stop"
Set-Location (Join-Path (Split-Path -Parent $PSScriptRoot) "mobile")
npm install
Write-Host "Mobile dependencies installed."
