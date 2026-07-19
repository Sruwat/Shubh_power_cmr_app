# Station Data Import Report

Source: `station-research/google-maps-verified/ALL_STATIONS_GOOGLE_MAPS_VERIFIED.csv`

Rules preserved:

- Unknown operational status remains unknown.
- Likely operational is not converted into available now.
- Exact/search/coordinate map URL type is preserved.
- Demo connector/tariff data is only added for selected Shubh demo stations.
- Missing connector data stays unavailable.

The local memory import loaded the verified CSV for demo/test use. MongoDB import is prepared through the same parser and index strategy.
