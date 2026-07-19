$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Mobile = Join-Path $Root "mobile"

Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -and (
      ($_.CommandLine.Contains($Mobile) -and ($_.CommandLine -like "*expo*" -or $_.CommandLine -like "*metro*" -or $_.CommandLine -like "*node_modules*")) -or
      ($_.CommandLine -like "*expo start*" -and $_.CommandLine -like "*shubh-power*")
    )
  } |
  ForEach-Object {
    Write-Host "Stopping stale mobile server process $($_.ProcessId)"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }

$ports = 8081, 8082, 19000, 19001, 19002
foreach ($port in $ports) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -and $_ -ne $PID } |
    ForEach-Object {
      Write-Host "Stopping stale listener on port $port process $_"
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
}
