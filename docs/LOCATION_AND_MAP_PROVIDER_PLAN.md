# Location And Map Provider Plan

## Free In Demo

- Device location: `expo-location`.
- Nearby station search: MongoDB Atlas geospatial `$geoNear`.
- Manual address search and reverse geocoding: Nominatim through FastAPI.

## Requires Key Or Production Account

- Google Maps native SDK for distributable builds may require a valid Google Maps Platform key.
- Mapbox, Geoapify, HERE and Google geocoding require provider credentials.

## Nominatim Rules

- Calls are routed through FastAPI.
- User-Agent identifies the Shubh Power demo.
- Results are cached in a bounded in-process cache.
- No bulk geocoding.
- Attribution: OpenStreetMap contributors.

Endpoints:

- `GET /api/v1/locations/search`
- `GET /api/v1/locations/reverse-geocode`

Production recommendation: use Google Maps Platform or Mapbox with quota, billing, monitoring and server-side key protection.
