# Security And Secrets

- MongoDB credentials live only in `backend/.env`.
- `backend/.env` is ignored by Git.
- Mobile env only contains public API base URL.
- MongoDB URI is masked in health/log style outputs.
- OTPs and tokens are not logged.
- Refresh tokens are stored as hashes.
- Demo OTP is only for `DEMO_MODE=true`.
- Wallet ledger entries are immutable.
- Payment events and session events are append-only.

The real Atlas credential is stored in `backend/.env`, which is ignored by Git. The root `.env.example` was sanitized back to placeholders after the secret-bearing value was copied into the ignored backend env file.
