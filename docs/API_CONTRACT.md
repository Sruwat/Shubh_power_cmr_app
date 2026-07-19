# API Contract

Base path: `/api/v1`

## Authentication

- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/refresh`
- `POST /auth/logout`

## Users And Vehicles

- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`
- `GET /vehicles`
- `POST /vehicles`
- `PATCH /vehicles/{id}`
- `DELETE /vehicles/{id}`

## Stations

- `GET /stations/nearby`
- `GET /stations/search`
- `GET /stations/map-bounds`
- `GET /stations/{id}`
- `POST /stations/{id}/save`
- `DELETE /stations/{id}/save`
- `GET /stations/filter-options`

Nearby supports `latitude`, `longitude`, `radius_km`, `brand`, `connector_type`, `min_power_kw`, `access_type`, `demo_enabled_only`, `verified_only` and `limit`.

## Locations

- `GET /locations/search`
- `GET /locations/reverse-geocode`

The demo provider is Nominatim via FastAPI with OpenStreetMap attribution.

## Charging

- `POST /charging/validate`
- `POST /charging/sessions`
- `GET /charging/sessions/active`
- `GET /charging/sessions/{id}`
- `POST /charging/sessions/{id}/stop`
- `GET /charging/sessions`

## Payments And Wallet

- `POST /payments/intents`
- `POST /payments/demo-complete`
- `GET /payments/{id}`
- `GET /wallet`
- `POST /wallet/top-up`
- `GET /wallet/ledger`
- `GET /refunds/{id}`
- `GET /invoices/{id}`

## Support And Admin

- `POST /issues`
- `GET /support/tickets`
- `POST /support/tickets`
- `GET /support/tickets/{id}`
- `POST /support/tickets/{id}/messages`
- `GET /config/mobile`
- `GET /config/feature-flags`
- `GET /admin/stations`
- `PATCH /admin/stations/{id}/demo-status`
- `GET /admin/sessions`
- `GET /admin/data-quality`
