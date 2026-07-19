# Charging State Machine

Implemented happy path:

```text
VALIDATING_CHARGER -> AWAITING_PAYMENT -> PAYMENT_AUTHORIZED -> STARTING -> CHARGING -> STOPPING -> COMPLETED
```

Defined error states:

- VALIDATION_FAILED
- PAYMENT_FAILED
- START_FAILED
- CHARGER_UNREACHABLE
- SESSION_INTERRUPTED
- STOP_FAILED
- PAYMENT_SESSION_MISMATCH
- REFUND_PENDING

Backend time is the source of truth. Energy and cost are recalculated when the session is fetched or stopped.
