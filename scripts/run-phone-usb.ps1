$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Mobile = Join-Path $Root "mobile"
$BackendUrl = "http://127.0.0.1:8010"

& "$PSScriptRoot\stop-mobile-metro.ps1"
Start-Sleep -Seconds 2

try {
  Invoke-RestMethod -Uri "$BackendUrl/api/v1/health" -TimeoutSec 5 | Out-Null
} catch {
  Write-Host "Starting FastAPI backend at $BackendUrl"
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c","set REQUIRE_MONGODB=false&& `"$Root\.venv\Scripts\python.exe`" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8010" -WorkingDirectory $Root -WindowStyle Hidden
  Start-Sleep -Seconds 8
}

$adbCommand = Get-Command adb -ErrorAction SilentlyContinue
$adb = if ($adbCommand) { $adbCommand.Source } else { $null }
if (!$adb) {
  $candidateAdbPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    "$env:ANDROID_HOME\platform-tools\adb.exe",
    "$env:ANDROID_SDK_ROOT\platform-tools\adb.exe",
    "$env:ProgramFiles\Android\Android Studio\platform-tools\adb.exe"
  )
  $adb = $candidateAdbPaths | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
}
if (!$adb) {
  throw "adb was not found. Install Android platform-tools or use .\scripts\run-phone-stable.ps1 on the same Wi-Fi."
}

Write-Host "Using adb: $adb"
$deadline = (Get-Date).AddSeconds(120)
do {
  $devices = (& $adb devices) -join "`n"
  if ($devices -match "`tdevice") {
    break
  }
  Write-Host "Waiting for authorized Android device..."
  Write-Host $devices
  Write-Host "Connect USB, enable USB debugging, set USB mode to File transfer, and accept the RSA prompt."
  Start-Sleep -Seconds 5
} while ((Get-Date) -lt $deadline)

if ($devices -notmatch "`tdevice") {
  throw "No authorized Android device found after 120 seconds."
}

& $adb reverse tcp:8081 tcp:8081 | Out-Null
& $adb reverse tcp:8010 tcp:8010 | Out-Null
& $adb shell pm clear host.exp.exponent 2>$null | Out-Null

$env:EXPO_NO_DEPENDENCY_VALIDATION = "1"
$env:EXPO_OFFLINE = "1"
$env:EXPO_PUBLIC_API_BASE_URL = "http://127.0.0.1:8010"
$env:REACT_NATIVE_PACKAGER_HOSTNAME = "127.0.0.1"
$env:SHUBH_BACKEND_HOST = "127.0.0.1"
$env:SHUBH_BACKEND_PORT = "8010"

Set-Location $Mobile
Write-Host "Starting Expo over USB localhost."
Write-Host "This bypasses Wi-Fi, firewall, and ngrok remote-update download failures."
Write-Host "Expo Go cache was cleared over adb."
npx expo start --localhost --offline --clear --port 8081 --android --go
