param(
  [string]$LanIp = "",
  [string]$ApiUrl = "https://shubh-power-360-api.onrender.com",
  [switch]$UseLocalBackend
)

$ErrorActionPreference = "Stop"

function Get-ShubhLanIp {
  if ($LanIp) {
    return [PSCustomObject]@{
      IPAddress = $LanIp
      InterfaceAlias = "Manual override"
      Score = 0
    }
  }

  $wifiIpconfig = ipconfig |
    Select-String -Pattern "IPv4 Address.*: ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)" |
    ForEach-Object { $_.Matches[0].Groups[1].Value } |
    Where-Object { $_ -and $_ -notlike "127.*" -and $_ -notlike "169.254*" -and $_ -notlike "172.*" } |
    Select-Object -First 1

  if ($wifiIpconfig) {
    return [PSCustomObject]@{
      IPAddress = $wifiIpconfig
      InterfaceAlias = "Wi-Fi/ipconfig"
      Score = 0
    }
  }

  $excludedAliases = "Loopback|WSL|Docker|Hyper-V|vEthernet|VirtualBox|VMware|Bluetooth|Npcap|Tailscale|ZeroTier"
  $configs = Get-NetIPConfiguration |
    Where-Object {
      $_.NetAdapter.Status -eq "Up" -and
      $_.IPv4DefaultGateway -and
      $_.InterfaceAlias -notmatch $excludedAliases
    }

  $addresses = foreach ($config in $configs) {
    foreach ($ip in $config.IPv4Address) {
      if (
        $ip.IPAddress -and
        $ip.IPAddress -notlike "127.*" -and
        $ip.IPAddress -notlike "169.254*" -and
        $ip.IPAddress -notlike "172.17.*" -and
        $ip.IPAddress -notlike "172.18.*" -and
        $ip.IPAddress -notlike "172.19.*"
      ) {
        [PSCustomObject]@{
          IPAddress = $ip.IPAddress
          InterfaceAlias = $config.InterfaceAlias
          Score = if ($config.InterfaceAlias -match "Wi-Fi|Wireless|WLAN") { 0 } else { 1 }
        }
      }
    }
  }

  $selected = $addresses | Sort-Object Score, InterfaceAlias | Select-Object -First 1
  if (!$selected) {
    throw "Could not detect a valid LAN IPv4 address. Connect the laptop to the same Wi-Fi or hotspot as the phone."
  }
  return $selected
}

function Test-JsonHealth($url) {
  try {
    $response = Invoke-RestMethod -Uri $url -TimeoutSec 5
    return [PSCustomObject]@{ Ok = $true; Data = $response; Error = $null }
  } catch {
    return [PSCustomObject]@{ Ok = $false; Data = $null; Error = $_.Exception.Message }
  }
}

function Stop-PortListeners($port) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -and $_ -ne $PID } |
    ForEach-Object {
      $process = Get-Process -Id $_ -ErrorAction SilentlyContinue
      Write-Host "Stopping stale listener on port $port process $_ $($process.ProcessName)"
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
}

$Root = Split-Path -Parent $PSScriptRoot
$Mobile = Join-Path $Root "mobile"
$BackendLocal = "http://127.0.0.1:8010"
$BundleProbePath = "/index.bundle?platform=android&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1"
$UiRebuildMarker = "Figma-reference UI rebuild: active"

& "$PSScriptRoot\stop-mobile-metro.ps1"
Start-Sleep -Seconds 2

$cachePaths = @(
  (Join-Path $Mobile ".expo"),
  (Join-Path $Mobile "node_modules\.cache"),
  (Join-Path $env:TEMP "metro-cache")
)

foreach ($path in $cachePaths) {
  Remove-Item -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue
}

Get-ChildItem -LiteralPath $env:TEMP -Directory -Filter "haste-map-*" -ErrorAction SilentlyContinue |
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

$lan = Get-ShubhLanIp
$lanIp = $lan.IPAddress
$BackendLan = "http://$lanIp`:8010"

Write-Host "Shubh Power phone demo startup"
Write-Host $UiRebuildMarker
Write-Host ""
Write-Host "LAN IP: $lanIp ($($lan.InterfaceAlias))"

$connectionProfile = Get-NetConnectionProfile -ErrorAction SilentlyContinue |
  Where-Object { $_.InterfaceAlias -eq "Wi-Fi" -or $_.InterfaceAlias -eq $lan.InterfaceAlias } |
  Select-Object -First 1

if ($connectionProfile -and $connectionProfile.NetworkCategory -ne "Private") {
  Write-Host ""
  Write-Host "IMPORTANT: Your Wi-Fi network is marked '$($connectionProfile.NetworkCategory)'."
  Write-Host "Expo Go phones usually cannot download Metro bundles from a Public Windows network."
  Write-Host "Fix in Windows: Settings > Network & internet > Wi-Fi > $($connectionProfile.Name) > Network profile type > Private"
  Write-Host "Or run PowerShell as Administrator:"
  Write-Host "  Set-NetConnectionProfile -InterfaceAlias `"$($connectionProfile.InterfaceAlias)`" -NetworkCategory Private"
  Write-Host ""
}

if ($UseLocalBackend) {
  $localHealth = Test-JsonHealth "$BackendLocal/api/v1/health"
  if (!$localHealth.Ok) {
    Write-Host "Backend local: Not running"
    if ($localHealth.Error) {
      Write-Host "Backend local reason: $($localHealth.Error)"
    }
    Stop-PortListeners 8010
    Start-Sleep -Seconds 2
    Write-Host "Starting FastAPI on 0.0.0.0:8010"
    $backendLog = Join-Path $Root "backend-phone-8010.log"
    $backendErrLog = Join-Path $Root "backend-phone-8010.err.log"
    Remove-Item -LiteralPath $backendLog, $backendErrLog -Force -ErrorAction SilentlyContinue
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c","set REQUIRE_MONGODB=false&& `"$Root\.venv\Scripts\python.exe`" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8010 > `"$backendLog`" 2> `"$backendErrLog`"" -WorkingDirectory $Root -WindowStyle Hidden
    Start-Sleep -Seconds 8
    $localHealth = Test-JsonHealth "$BackendLocal/api/v1/health"
  }

  if (!$localHealth.Ok) {
    $backendErrLog = Join-Path $Root "backend-phone-8010.err.log"
    if (Test-Path $backendErrLog) {
      Write-Host "Backend startup error log:"
      Get-Content -LiteralPath $backendErrLog -Tail 40
    }
    throw "Backend local: FAILED. Start it manually with: uvicorn backend.app.main:app --host 0.0.0.0 --port 8010"
  }

  $mongoStatus = if ($localHealth.Data.database_connected) { "Connected" } else { "Disconnected" }
  $ApiUrl = "auto"

  Write-Host "Backend local: OK"
  Write-Host "Backend phone route: Metro proxy /api -> $BackendLocal"
  Write-Host "MongoDB Atlas: $mongoStatus"
  Write-Host "Station count: $($localHealth.Data.station_count)"

  $listeners = Get-NetTCPConnection -LocalPort 8010 -State Listen -ErrorAction SilentlyContinue
  if ($listeners) {
    Write-Host "Port 8010 listener: OK"
  } else {
    Write-Host "Port 8010 listener: Not detected"
  }
} else {
  $renderHealth = Test-JsonHealth "$ApiUrl/api/v1/health"
  if (!$renderHealth.Ok) {
    throw "Render backend is not reachable from this laptop: $ApiUrl/api/v1/health. Error: $($renderHealth.Error)"
  }
  $mongoStatus = if ($renderHealth.Data.database_connected) { "Connected" } else { "Disconnected" }
  Write-Host "Backend public: OK"
  Write-Host "Backend URL for phone: $ApiUrl"
  Write-Host "MongoDB Atlas: $mongoStatus"
  Write-Host "Station count: $($renderHealth.Data.station_count)"
}

Remove-Item Env:EXPO_OFFLINE -ErrorAction SilentlyContinue

$env:EXPO_NO_DEPENDENCY_VALIDATION = "1"
$env:EXPO_PACKAGER_HOSTNAME = "$lanIp"
$env:REACT_NATIVE_PACKAGER_HOSTNAME = "$lanIp"
$env:EXPO_PUBLIC_API_BASE_URL = $ApiUrl
$env:SHUBH_BACKEND_HOST = "127.0.0.1"
$env:SHUBH_BACKEND_PORT = "8010"

Write-Host ""
Write-Host "API URL for phone: $ApiUrl"
Write-Host "Metro status URL: http://$lanIp`:8081/status"
Write-Host "Metro bundle test after Metro starts: http://$lanIp`:8081$BundleProbePath"
if ($UseLocalBackend) {
  Write-Host "Metro API proxy test after Metro starts: http://$lanIp`:8081/api/v1/health"
}
Write-Host ""
Write-Host "Before scanning, open this on the PHONE browser:"
Write-Host "  http://$lanIp`:8081/status"
Write-Host "It must show: packager-status:running"
Write-Host "Then open this on the PHONE browser. It should download/show bundle text, not fail:"
Write-Host "  http://$lanIp`:8081$BundleProbePath"
Write-Host ""
Write-Host "If phone browser cannot open the Metro URLs, run this as Administrator:"
Write-Host "  cd $Root"
Write-Host "  .\scripts\fix-phone-firewall-admin.ps1"
Write-Host ""
Write-Host "Starting Expo LAN..."
Write-Host "Metro is pinned to $lanIp`:8081. Do not accept a different port."
Write-Host "Scan the QR with Expo Go. Keep this terminal open."

Set-Location $Mobile
npx expo start --lan --clear --port 8081 --go

$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
  throw "Expo Metro exited unexpectedly with code $exitCode."
}
