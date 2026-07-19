$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
Write-Host "Checking backend dependencies..."
if (!(Test-Path ".venv")) {
  & "$PSScriptRoot\setup-backend.ps1"
}
$lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1 -ExpandProperty IPAddress)
if (!$lanIp) {
  $lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254*" -and $_.InterfaceAlias -notlike "*WSL*" } | Select-Object -First 1 -ExpandProperty IPAddress)
}
if (!$lanIp) { throw "Could not detect LAN IP. Connect to Wi-Fi or set EXPO_PUBLIC_API_BASE_URL manually." }
Write-Host "Starting FastAPI at http://$lanIp`:8010"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c","set REQUIRE_MONGODB=false&& `"$Root\.venv\Scripts\python.exe`" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8010" -WorkingDirectory $Root -WindowStyle Hidden
Start-Sleep -Seconds 4
Write-Host "Starting Expo LAN at http://$lanIp`:8081"
Set-Location "$Root\mobile"
$env:EXPO_NO_DEPENDENCY_VALIDATION = "1"
$env:EXPO_PUBLIC_API_BASE_URL = "http://$lanIp`:8010"
$env:EXPO_PACKAGER_HOSTNAME = $lanIp
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $lanIp
Start-Process -FilePath "cmd.exe" -ArgumentList "/c","set EXPO_NO_DEPENDENCY_VALIDATION=1&& set EXPO_PUBLIC_API_BASE_URL=http://$lanIp`:8010&& set EXPO_PACKAGER_HOSTNAME=$lanIp&& set REACT_NATIVE_PACKAGER_HOSTNAME=$lanIp&& npx expo start --lan --clear --port 8081 --go" -WorkingDirectory "$Root\mobile" -WindowStyle Hidden
Write-Host "Backend: http://127.0.0.1:8010"
Write-Host "Backend LAN: http://$lanIp`:8010"
Write-Host "Swagger: http://127.0.0.1:8010/docs"
Write-Host "Expo Metro LAN: http://$lanIp`:8081"
Write-Host "No secrets printed."
