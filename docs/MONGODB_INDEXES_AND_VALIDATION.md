# MongoDB Indexes And Validation

Implemented in `backend/app/db/indexes.py` and initialized by:

```powershell
.\.venv\Scripts\python.exe -m backend.scripts.init_database
```

Key indexes include:

- `users.mobile_number` unique
- `users.email` unique sparse
- `otp_requests.mobile_number + created_at`
- `otp_requests.expires_at` TTL
- `refresh_tokens.token_hash` unique
- `refresh_tokens.expires_at` TTL
- `stations.location` 2dsphere
- `stations.station_id` unique
- `stations.brand + city`
- `stations.demo_charging_enabled + operational_status`
- `evses.evse_id` unique
- `connectors.connector_id` unique
- `connectors.demo_charger_id` unique sparse
- `charging_sessions.session_id` unique
- `charging_sessions.idempotency_key` unique sparse
- `wallet_ledger_entries.ledger_entry_id` unique
- `wallet_ledger_entries.idempotency_key` unique sparse
- `payments.payment_id` unique
- `payments.idempotency_key` unique sparse
- `support_tickets.ticket_id` unique

Schema validators are included for core collections such as `stations`, `users`, and `wallet_ledger_entries`.
