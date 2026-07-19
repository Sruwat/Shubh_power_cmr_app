# Security Architecture

## Implemented

- Signed access and refresh tokens.
- SecureStore for mobile token storage.
- CORS allowlist.
- Environment-driven settings.
- Input validation with Pydantic and Zod.
- Correlation ID response header.
- No payment card storage.
- Demo OTP only when `DEMO_MODE=true`.

## Production Requirements

- Replace signed demo tokens with audited JWT/key rotation.
- Add rate limiting for OTP and auth endpoints.
- Add real SMS provider.
- Use HTTPS only.
- Store secrets in managed secret storage.
- Add audit log persistence.
- Add production-safe exception handling and structured logging sink.
