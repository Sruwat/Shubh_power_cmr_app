# Shubh Power 360 EV Charging Platform

Consumer-first EV charging platform monorepo for Shubh Power.

## What Is Implemented

- React Native Expo mobile app with Expo Router, TypeScript, TanStack Query and Zustand.
- FastAPI backend with demo OTP, JWT-style signed tokens, station discovery, charging session simulation, wallet/payment simulation and support tickets.
- MongoDB-ready data model, indexes and seed/import scripts.
- Station import pipeline using the verified CSV generated in `station-research/google-maps-verified`.
- Docker Compose for MongoDB and backend.
- EAS preview APK configuration.

This is a working demo platform. Public research stations are shown honestly as research/checkpoint data. Only explicitly demo-enabled Shubh stations can start a simulated charging session.

## Quick Start

```powershell
cd C:\Users\shank\Documents\CRM\shubh-power-360-platform
python -m venv .venv
.\.venv\Scripts\python -m pip install -r backend\requirements.txt
.\.venv\Scripts\python scripts\seed_demo_data.py
.\.venv\Scripts\python -m uvicorn backend.app.main:app --reload --port 8000
```

Mobile:

```powershell
cd C:\Users\shank\Documents\CRM\shubh-power-360-platform\mobile
npm install
npm run typecheck
npm start
```

Android emulator API URL: `http://10.0.2.2:8000`.

Physical phone API URL: set `EXPO_PUBLIC_API_URL` to the LAN/public HTTPS backend.

## Demo Login

- Phone: any 10 digit Indian mobile number.
- OTP: `1234` when `DEMO_MODE=true`.

## Key Paths

- Backend: `backend/app`
- Mobile app: `mobile`
- Data model docs: `docs/MONGODB_DATA_MODEL.md`
- API contract: `docs/API_CONTRACT.md`
- Final implementation report: `docs/FINAL_IMPLEMENTATION_REPORT.md`

## Important Limitations

- No real OCPP charger integration is present.
- No real payment gateway is present.
- No real SMS provider is configured.
- No public backend URL or APK is claimed until those are actually generated.
- Google Maps verification data is checkpoint-quality and not a live station registry.
