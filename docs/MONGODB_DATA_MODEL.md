# MongoDB Data Model

## Authentication

- users
- otp_requests
- refresh_tokens
- user_sessions
- user_preferences
- notification_preferences

## Charging Network

- providers
- operators
- stations
- evses
- connectors
- station_status_snapshots
- station_verification_evidence
- tariffs
- amenities

Stations use:

```json
{
  "location": {
    "type": "Point",
    "coordinates": [77.391, 28.5355]
  }
}
```

Coordinates are longitude first, latitude second.

## Charging

- charging_sessions
- session_events
- session_meter_values

Session events and meter values are append-only.

## Payments

- wallets
- wallet_ledger_entries
- payments
- payment_events
- refunds
- invoices

Wallet balance is derived from immutable ledger entries.

## Support

- saved_stations
- issue_reports
- support_tickets
- support_messages
- notifications
- recent_searches

## System

- app_config
- feature_flags
- audit_logs
- integration_logs
- import_jobs
- data_quality_issues
