# Public Backend Deployment

Recommended demo path:

1. Copy `backend/.env.example` to `backend/.env`.
2. Set the real Atlas password in `MONGODB_URI`.
3. Set strong JWT secrets.
4. Run `scripts/initialize-database.ps1`.
5. Deploy FastAPI to Render, Railway, Fly.io, EC2 or a Docker VPS.
6. Configure HTTPS.
7. Set CORS to the mobile/public origin.
8. Set `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env`.
9. Build the EAS preview APK.

No public backend URL exists yet.
