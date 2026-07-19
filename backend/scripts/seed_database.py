from __future__ import annotations

from datetime import UTC, datetime

from backend.scripts.common import run


DEMO_STATIONS = [
    ("SHUBH-NOIDA-DEMO-001", "Shubh Power Noida Demo Hub 1", 28.5355, 77.3910, "SHUBH-NOIDA-001"),
    ("SHUBH-NOIDA-DEMO-002", "Shubh Power Noida Demo Hub 2", 28.57, 77.32, "SHUBH-NOIDA-002"),
    ("SHUBH-GGN-DEMO-001", "Shubh Power Gurugram Demo Hub", 28.4595, 77.0266, "SHUBH-GGN-001"),
]


async def main(db):
    now = datetime.now(UTC)
    demo_station_ids = [station_id for station_id, *_ in DEMO_STATIONS]
    await db.stations.update_many(
        {"station_id": {"$nin": demo_station_ids}, "demo_charging_enabled": True},
        {"$set": {"demo_charging_enabled": False, "available_now": False, "status_source": "research_import", "is_demo": False, "updated_at": now}, "$unset": {"demo_charger_id": "", "qr_value": ""}},
    )
    await db.connectors.delete_many({"station_id": {"$nin": demo_station_ids}, "is_demo": True})
    await db.evses.delete_many({"station_id": {"$nin": demo_station_ids}, "is_demo": True})
    for station_id, name, lat, lon, charger_id in DEMO_STATIONS:
        await db.stations.update_one(
            {"station_id": station_id},
            {
                "$set": {
                    "station_id": station_id,
                    "name": name,
                    "brand": "Shubh Power",
                    "operator_id": "shubh_power",
                    "operator_name": "Shubh Power Solutions",
                    "address": "Demo-enabled NCR charging location",
                    "city": "Noida" if "NOIDA" in station_id else "Gurugram",
                    "state": "Uttar Pradesh" if "NOIDA" in station_id else "Haryana",
                    "location": {"type": "Point", "coordinates": [lon, lat]},
                    "latitude": lat,
                    "longitude": lon,
                    "verification_status": "demo",
                    "confidence": "demo",
                    "operational_status": "Demo simulated availability",
                    "available_now": True,
                    "access_type": "demo-enabled",
                    "connector_types": ["CCS2", "TYPE2"],
                    "max_power_kw": 60,
                    "tariff_summary": "Demo tariff INR 18/kWh",
                    "demo_charging_enabled": True,
                    "demo_charger_id": charger_id,
                    "qr_value": f"shubhpower://charge/{charger_id}",
                    "status_source": "demo_simulator",
                    "is_demo": True,
                    "created_at": now,
                    "updated_at": now,
                    "version": 1,
                }
            },
            upsert=True,
        )
        evse_id = f"{station_id}-EVSE-1"
        await db.evses.update_one({"evse_id": evse_id}, {"$set": {"evse_id": evse_id, "station_id": station_id, "status": "available", "is_demo": True, "created_at": now, "updated_at": now}}, upsert=True)
        await db.connectors.update_one({"demo_charger_id": charger_id}, {"$set": {"connector_id": f"{station_id}-CCS2-1", "evse_id": evse_id, "station_id": station_id, "connector_type": "CCS2", "power_kw": 60, "status": "available", "demo_charger_id": charger_id, "demo_charging_enabled": True, "is_demo": True, "created_at": now, "updated_at": now}}, upsert=True)
    await db.feature_flags.update_one({"flag_key": "demo_charging"}, {"$set": {"flag_key": "demo_charging", "enabled": True, "updated_at": now}}, upsert=True)
    print(f"Seeded {len(DEMO_STATIONS)} demo-enabled Shubh stations.")


if __name__ == "__main__":
    run(main)
