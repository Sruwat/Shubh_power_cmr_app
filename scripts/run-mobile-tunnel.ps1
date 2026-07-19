$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "Tunnel mode has been disabled for this project because ngrok drops cause:"
Write-Host "  java.io.IOException: Failed to download remote update"
Write-Host ""
Write-Host "Starting the stable LAN runner instead."
Write-Host "If LAN is blocked on your Wi-Fi, connect the phone by USB and run:"
Write-Host "  .\scripts\run-phone-usb.ps1"
Write-Host ""

& "$Root\scripts\run-phone-stable.ps1"
