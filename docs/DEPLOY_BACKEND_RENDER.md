# Deploy Shubh Power Backend To Render

Recommended pilot backend host: Render Web Service with Docker. The repo now includes `render.yaml`, and the backend Dockerfile respects the host-provided `PORT`.

## Why Render For This Pilot

- It supports Docker web services and deploys from a linked Git repository.
- It gives the backend a public HTTPS URL for Expo preview and APK builds.
- It supports `render.yaml` blueprints, health checks, generated secrets, and environment variables.

Official docs:
- https://render.com/docs/web-services
- https://render.com/docs/blueprint-spec

## Before Deploying

1. Run the Mongo diagnosis locally:

   ```powershell
   cd C:\Users\shank\Documents\CRM\shubh-power-360-platform
   .\scripts\diagnose-mongodb.ps1
   ```

2. In MongoDB Atlas, open Network Access and allow the current public IP shown by the script. For a short investor demo only, `0.0.0.0/0` can be used temporarily, then removed after the demo.

3. Confirm the local backend health:

   ```powershell
   curl.exe http://127.0.0.1:8010/api/v1/health
   ```

   Expected for real DB mode:

   ```json
   {"status":"ok","database_connected":true}
   ```

## Deploy Steps

1. Push this repo to GitHub.
2. In Render Dashboard, choose New > Blueprint and select this repository.
3. Render will read `render.yaml` and create `shubh-power-360-api`.
4. Add the secret `MONGODB_URI` value in Render when prompted.
5. After deploy, open:

   ```text
   https://<your-render-service>.onrender.com/api/v1/health
   ```

6. It must show `database_connected: true`.

## Connect The Mobile App

After the Render URL is live, update `mobile/eas.json`:

```json
"EXPO_PUBLIC_API_URL": "https://<your-render-service>.onrender.com"
```

Then build a preview APK:

```powershell
cd C:\Users\shank\Documents\CRM\shubh-power-360-platform\mobile
npx eas build -p android --profile preview
```

## Production Notes

- Keep `REQUIRE_MONGODB=true` on hosted backend so deploys fail visibly if Atlas is unreachable.
- Keep `DEMO_MODE=true` for investor prototype; turn it off only after real OTP, payment, and charger/OCPP integrations are active.
- Do not commit `.env` or any Atlas password.
