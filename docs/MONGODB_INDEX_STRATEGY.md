# MongoDB Index Strategy

Implemented definitions live in `backend/app/db/indexes.py` and `database/indexes.js`.

## Critical Indexes

- `stations.location`: `2dsphere`
- `stations.station_id`: unique
- `stations.brand, stations.city`
- `connectors.demo_charger_id`: unique sparse
- `charging_sessions.user_id, charging_sessions.status`
- `charging_sessions.session_id`: unique
- `wallet_ledger_entries.reference_id`: unique
- `payments.payment_id`: unique
- `support_tickets.user_id, support_tickets.created_at`

## Rationale

Nearby discovery is the primary read path. Charging sessions, wallet entries and payments need idempotency and audit-safe lookup patterns.
