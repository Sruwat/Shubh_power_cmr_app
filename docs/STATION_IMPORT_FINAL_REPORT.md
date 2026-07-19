# Station Import Final Report

Importer: `backend/scripts/import_station_data.py`

Source default:

`../station-research/google-maps-verified/ALL_STATIONS_GOOGLE_MAPS_VERIFIED.csv`

Preserved fields include station ID, name, brand, operator, host, address, city, state, latitude, longitude, Google Maps URL, URL type, confidence, operational status, access type, connector metadata, power, tariff, source URL, evidence date, duplicate group and notes.

Invalid coordinate rows are skipped and recorded in `data_quality_issues`.

Public research rows remain research rows. Demo charging is enabled only for selected Shubh stations.

Final Atlas import result:

- Source rows: 265
- Imported rows: 264
- Skipped rows: 1
- Invalid coordinates: 1
- Research connectors fabricated: 0
- Demo records from import: 0

Demo charging is created only by `backend/scripts/seed_database.py`.
