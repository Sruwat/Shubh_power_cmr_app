# Location Discovery Spec

The app asks for foreground location only after explaining value. If permission is denied, it uses manual default coordinates and lets the user continue.

Nearby query:

```text
GET /api/v1/stations/nearby?latitude=28.5355&longitude=77.3910&radius_km=20
```

Ranking is deterministic:

- Distance
- Connector compatibility
- Demo availability
- Verification confidence
- Power
- Tariff clarity
- Shubh Power preference

The MVP does not call ranking AI.
