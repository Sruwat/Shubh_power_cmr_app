$ErrorActionPreference = "Continue"

$Root = Split-Path -Parent $PSScriptRoot
$Python = Join-Path $Root ".venv\Scripts\python.exe"
if (!(Test-Path $Python)) {
  $Python = "python"
}

Write-Host "Shubh Power MongoDB Atlas diagnosis"
Write-Host ""

try {
  $publicIp = (Invoke-RestMethod -Uri "https://api.ipify.org?format=json" -TimeoutSec 10).ip
  Write-Host "Current public IP: $publicIp"
} catch {
  $publicIp = $null
  Write-Host "Current public IP: unavailable ($($_.Exception.Message))"
}

$diagnostic = @'
import asyncio
import os
import sys
from urllib.parse import urlsplit

try:
    import certifi
    import dns.resolver
    from pymongo import AsyncMongoClient
except Exception as exc:
    print(f"Python dependency error: {type(exc).__name__}: {exc}")
    sys.exit(2)

from backend.app.core.config import get_settings

settings = get_settings()
uri = settings.mongodb_uri
masked = settings.masked_mongodb_uri
parts = urlsplit(uri)
host = parts.hostname or ""

print(f"Database name: {settings.mongodb_database}")
print(f"Mongo URI: {masked}")
print(f"SRV host: {host or 'not mongodb+srv'}")
print(f"Require MongoDB: {settings.require_mongodb}")
print("")

if host and uri.startswith("mongodb+srv://"):
    try:
        srv_records = dns.resolver.resolve(f"_mongodb._tcp.{host}", "SRV")
        print("Atlas shard hosts from SRV:")
        for record in srv_records:
            print(f"  - {str(record.target).rstrip('.')}:{record.port}")
    except Exception as exc:
        print(f"SRV DNS check failed: {type(exc).__name__}: {exc}")
print("")

async def main():
    kwargs = {"serverSelectionTimeoutMS": 8000}
    if uri.startswith("mongodb+srv://"):
        kwargs["tlsCAFile"] = certifi.where()
    client = AsyncMongoClient(uri, **kwargs)
    try:
        result = await client.admin.command("ping")
        count = await client[settings.mongodb_database].stations.count_documents({})
        print("MongoDB ping: OK")
        print(f"Stations in Atlas: {count}")
        print(f"Ping result: {result}")
    except Exception as exc:
        text = str(exc).replace(uri, masked)
        print("MongoDB ping: FAILED")
        print(f"{type(exc).__name__}: {text}")
        lower = text.lower()
        print("")
        print("Likely fixes:")
        print("  1. In MongoDB Atlas > Network Access, add this laptop/hotspot public IP.")
        print("  2. If this is only an investor demo, temporarily allow 0.0.0.0/0, then remove it after demo.")
        print("  3. If the error contains TLS handshake/internal error even after IP allowlisting, switch away from the phone hotspot or deploy the backend to Render/Railway; some mobile carriers break Atlas TLS on port 27017.")
        print("  4. Confirm backend/.env has the real MONGODB_URI and no placeholder password.")
        sys.exit(1)
    finally:
        await client.close()

asyncio.run(main())
'@

$env:REQUIRE_MONGODB = "true"
Push-Location $Root
try {
  $diagnostic | & $Python -
} finally {
  Pop-Location
}

Write-Host ""
if ($publicIp) {
  Write-Host "Atlas Network Access value to add now: $publicIp/32"
}
