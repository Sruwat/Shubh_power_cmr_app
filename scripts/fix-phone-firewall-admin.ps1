$ErrorActionPreference = "Stop"

Write-Host "Configuring Windows network/firewall for Shubh Power Expo phone preview..."

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (!$isAdmin) {
  Write-Host ""
  Write-Host "This script must be run in PowerShell as Administrator."
  Write-Host "Right-click PowerShell > Run as administrator, then run:"
  Write-Host "  cd C:\Users\shank\Documents\CRM\shubh-power-360-platform"
  Write-Host "  .\scripts\fix-phone-firewall-admin.ps1"
  exit 1
}

$wifiIp = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -and $_.IPAddress -notlike "169.254*" } |
  Select-Object -First 1 -ExpandProperty IPAddress

try {
  Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private -ErrorAction Stop
  $profile = Get-NetConnectionProfile -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue
  if ($profile.NetworkCategory -eq "Private") {
    Write-Host "Wi-Fi network profile set to Private."
  } else {
    Write-Host "Wi-Fi profile is still $($profile.NetworkCategory). Firewall allow rules below are still useful."
  }
} catch {
  Write-Host "Could not switch Wi-Fi profile automatically: $($_.Exception.Message)"
  Write-Host "You can also do it manually: Settings > Network & internet > Wi-Fi > current network > Private."
}

netsh advfirewall firewall delete rule name="Shubh Expo Metro 8081" | Out-Null
netsh advfirewall firewall delete rule name="Shubh FastAPI 8010" | Out-Null
netsh advfirewall firewall delete rule name="Shubh Expo Node Program" | Out-Null

netsh advfirewall firewall add rule name="Shubh Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081 profile=private,public | Out-Null
netsh advfirewall firewall add rule name="Shubh FastAPI 8010" dir=in action=allow protocol=TCP localport=8010 profile=private,public | Out-Null

$nodePath = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
if ($nodePath) {
  netsh advfirewall firewall add rule name="Shubh Expo Node Program" dir=in action=allow program="$nodePath" enable=yes profile=private,public | Out-Null
  Write-Host "Firewall rules added for TCP 8081, TCP 8010, and Node.js: $nodePath"
} else {
  Write-Host "Firewall rules added for TCP 8081 and 8010. Node.js was not found on PATH, so no program rule was added."
}

Write-Host "Now run from normal PowerShell:"
Write-Host "  cd C:\Users\shank\Documents\CRM\shubh-power-360-platform"
if ($wifiIp) {
  Write-Host "  .\scripts\run-phone-stable.ps1 -LanIp $wifiIp"
} else {
  Write-Host "  .\scripts\run-phone-stable.ps1"
}
