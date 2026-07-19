# Research And Architecture Audit

## Sources Reviewed

- Shubh Power official website and existing captured brand audit.
- Existing Shubh Power Vite prototype and design tokens.
- Competitive intelligence reports for Tata Power EZ Charge, Statiq, Jio-bp Pulse, ChargeZone, Bolt.Earth, Kazam, Zeon and TruePower.
- Google Maps verification workbooks and station CSV/GeoJSON outputs.
- Expo official documentation for TypeScript, Expo Router and EAS Build.
- MongoDB official documentation for FastAPI integration, GeoJSON and 2dsphere geospatial indexes.
- FastAPI current architecture guidance through the official framework patterns and Pydantic v2 model separation.

## Product Patterns Worth Adopting

- Location-first start screen with manual fallback.
- Clear compatibility, power and tariff summary before navigation.
- Explicit verification and data freshness labels.
- QR start with manual charger ID fallback.
- Session recovery as a first-class flow.
- Wallet ledger and invoice history rather than opaque payment status.

## UX Patterns To Avoid

- Claiming live availability for research-only station records.
- Hiding pricing until after start.
- Requiring camera or location permission before explaining value.
- Treating Home and Map as identical screens.
- Decorative green-energy styling that does not match Shubh Power's verified blue/teal brand.

## Technical Decisions

- Mobile: React Native Expo with Expo Router and TypeScript.
- Server state: TanStack Query.
- Client state: Zustand for auth/session state.
- Forms: React Hook Form plus Zod.
- Backend: FastAPI with service/repository separation.
- Database: MongoDB with GeoJSON Point and 2dsphere index for station discovery.
- Authentication: mobile OTP demo mode, signed access/refresh tokens, SecureStore on mobile.
- Payments: mock provider and immutable wallet ledger.
- Charging sessions: backend-controlled state machine with polling.
- Maps: map-provider abstraction starts with React Native Maps and API station coordinates.
- Offline: cache-ready architecture; no offline session start.

## Known Limitations

- Real OCPP charger control is not implemented.
- Real payment gateway and SMS provider are not implemented.
- The station registry is checkpoint-quality research data.
- Public deployment and APK build need user credentials and public HTTPS backend.
