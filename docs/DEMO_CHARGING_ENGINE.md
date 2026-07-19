# Demo Charging Engine

The backend validates demo charger IDs, creates sessions with idempotency keys, calculates energy/cost from server time, writes session events and meter values, and stops sessions with invoice generation.

Implemented states include:

- CHARGING
- COMPLETED

The domain enum also defines failure and intermediate states for production integration:

- VALIDATION_FAILED
- PAYMENT_FAILED
- START_FAILED
- CHARGER_UNREACHABLE
- SESSION_INTERRUPTED
- STOP_FAILED
- PAYMENT_SESSION_MISMATCH
- REFUND_PENDING
