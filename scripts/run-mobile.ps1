$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
& "$PSScriptRoot\stop-mobile-metro.ps1"
Start-Sleep -Seconds 2
Set-Location (Join-Path $Root "mobile")
$env:EXPO_NO_DEPENDENCY_VALIDATION = "1"
$lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1 -ExpandProperty IPAddress)
if (!$lanIp) {
  $lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254*" -and $_.InterfaceAlias -notlike "*WSL*" } | Select-Object -First 1 -ExpandProperty IPAddress)
}
if (!$lanIp) { throw "Could not detect LAN IP. Connect to Wi-Fi or set EXPO_PUBLIC_API_BASE_URL manually." }
$env:EXPO_PUBLIC_API_BASE_URL = "http://$lanIp`:8010"
$env:EXPO_PACKAGER_HOSTNAME = $lanIp
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $lanIp
Write-Host "Expo mobile API URL: $env:EXPO_PUBLIC_API_BASE_URL"
Write-Host "Expo packager host: $env:REACT_NATIVE_PACKAGER_HOSTNAME"
npx expo start --lan --clear --port 8081 --go
