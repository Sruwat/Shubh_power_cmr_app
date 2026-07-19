# Demo Deployment Guide

## Recommended Demo Stack

- FastAPI backend on Render, Railway, Fly.io, EC2 or Docker VPS.
- MongoDB Atlas for managed database.
- Expo EAS preview APK configured to call the public HTTPS API.

## Steps

1. Create MongoDB Atlas cluster.
2. Create database user.
3. Add network allowlist for backend provider.
4. Set environment variables from `.env.example`.
5. Deploy backend container.
6. Run station import/seed script.
7. Verify `/api/v1/health`.
8. Set `EXPO_PUBLIC_API_URL` to public HTTPS backend.
9. Build EAS preview APK.

No public backend URL is included until deployment is actually performed.
