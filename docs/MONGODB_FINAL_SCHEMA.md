# MongoDB Final Schema

Database: `shubh_power_ev`

Verified Atlas state: 40 collections, 84 indexes, 267 station documents, 3 selected demo-enabled Shubh stations.

Collections:

- Authentication: `users`, `otp_requests`, `refresh_tokens`, `device_sessions`, `user_preferences`, `notification_preferences`
- Vehicles: `vehicles`, `connector_preferences`
- Charging network: `providers`, `operators`, `stations`, `evses`, `connectors`, `tariffs`, `tariff_components`, `station_amenities`, `station_status_snapshots`, `station_verification_evidence`
- Charging operations: `charging_sessions`, `charging_session_events`, `session_meter_values`
- Payments: `wallets`, `wallet_ledger_entries`, `payments`, `payment_events`, `refunds`, `invoices`
- User activity: `saved_stations`, `recent_searches`, `issue_reports`, `support_tickets`, `support_messages`, `notifications`
- Platform management: `app_config`, `feature_flags`, `audit_logs`, `integration_logs`, `import_jobs`, `data_quality_issues`, `idempotency_records`

Stations use MongoDB GeoJSON:

```json
{
  "location": {
    "type": "Point",
    "coordinates": [77.391, 28.5355]
  }
}
```

Longitude is stored before latitude.
