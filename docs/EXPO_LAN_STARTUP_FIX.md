# Expo LAN Startup Fix

## Root Cause

`scripts/run-phone-stable.ps1` was starting Expo with conflicting SDK 54 flags:

```powershell
npx expo start --lan --offline --clear --port 8081 --go
```

The same script also set `EXPO_OFFLINE=1`. Expo SDK 54 accepts only one host/startup mode at a time, so `--offline` conflicts with `--lan` and throws:

```text
CommandError: Specify at most one of: --offline, --host, --tunnel, --lan, --localhost
```

No conflicting host flags were found in `mobile/package.json`, `mobile/app.json`, or `mobile/.env`.

## Files Changed

- `scripts/run-phone-stable.ps1`
- `docs/EXPO_LAN_STARTUP_FIX.md`

## Final Command

The Wi-Fi phone workflow now starts Expo with exactly one host mode:

```powershell
npx expo start --lan --clear
```

The script clears these environment variables before starting Expo:

```powershell
EXPO_OFFLINE
EXPO_PACKAGER_HOSTNAME
REACT_NATIVE_PACKAGER_HOSTNAME
```

For physical-phone LAN mode, the mobile runtime receives:

```powershell
EXPO_PUBLIC_API_BASE_URL=http://<LAN_IP>:8010
```

No MongoDB credentials are sent to the mobile app.

## Verification Result

Validation performed:

- PowerShell syntax check for `run-phone-stable.ps1`: passed.
- Controlled `run-phone-stable.ps1` run: passed; the process stayed active until stopped by the verifier.
- LAN IP detected during verification: `10.133.204.139` on `Wi-Fi`.
- Backend local health: OK at `http://127.0.0.1:8010/api/v1/health`.
- Backend LAN health: OK at `http://10.133.204.139:8010/api/v1/health`.
- MongoDB Atlas status from backend health: Disconnected.
- Station count from backend health: 264.
- Port listeners detected: `0.0.0.0:8010` and `*:8081`.
- Metro local status: `packager-status:running`.
- Expo Android export: passed.
- Mobile TypeScript: passed.
- Mobile Jest tests: passed.
- Backend tests with `REQUIRE_MONGODB=false`: passed.

Runtime verification expectation:

```text
Metro waiting on exp://<LAN_IP>:8081
```

Before scanning the QR, verify from the phone browser:

```text
http://<LAN_IP>:8010/api/v1/health
http://<LAN_IP>:8081/status
```

If either phone URL fails, allow these ports through Windows Firewall on Private networks:

```cmd
netsh advfirewall firewall add rule name="Shubh Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081 profile=private
netsh advfirewall firewall add rule name="Shubh FastAPI 8010" dir=in action=allow protocol=TCP localport=8010 profile=private
```

## Remaining Limitation

A live MongoDB-required backend test failed because the Atlas TLS handshake returned `TLSV1_ALERT_INTERNAL_ERROR`. That is not caused by Expo LAN startup. The Wi-Fi demo runner reports this as `MongoDB Atlas: Disconnected` and continues only because the current backend is available in fallback mode.
