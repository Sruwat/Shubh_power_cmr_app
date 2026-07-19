from __future__ import annotations

import csv
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from backend.app.core.config import get_settings
from backend.scripts.common import ROOT, run


def source_path() -> Path:
    configured = Path(get_settings().station_source_csv)
    if configured.exists():
        return configured
    return ROOT.parent / "station-research" / "google-maps-verified" / "ALL_STATIONS_GOOGLE_MAPS_VERIFIED.csv"


def connector_types(value: str | None) -> list[str]:
    if not value:
        return []
    return sorted({part.strip().upper().replace("CCS", "CCS2") if part.strip().upper() == "CCS" else part.strip().upper() for part in value.replace(";", ",").replace("|", ",").split(",") if part.strip()})


async def main(db):
    path = source_path()
    now = datetime.now(UTC)
    report = {"source": str(path), "source_rows": 0, "imported_rows": 0, "skipped_rows": 0, "invalid_coordinates": 0, "connectors_created": 0, "demo_records_created": 0}
    if not path.exists():
        raise FileNotFoundError(path)
    with path.open(newline="", encoding="utf-8-sig") as handle:
        for index, row in enumerate(csv.DictReader(handle), start=1):
            report["source_rows"] += 1
            try:
                lat = float(row.get("latitude") or "")
                lon = float(row.get("longitude") or "")
                if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                    raise ValueError("coordinate out of range")
            except ValueError as exc:
                report["skipped_rows"] += 1
                report["invalid_coordinates"] += 1
                await db.data_quality_issues.insert_one({"issue_id": f"dq_{uuid4().hex[:12]}", "source_row": index, "issue_type": "invalid_coordinates", "message": str(exc), "raw_station_id": row.get("station_id"), "created_at": now})
                continue
            station_id = row.get("station_id") or f"research_{index}"
            brand = row.get("brand") or row.get("operator") or "Other / Unclassified"
            demo_enabled = False
            station_doc = {
                "station_id": station_id,
                "name": row.get("station_name") or row.get("normalized_station_name") or "EV charging station",
                "brand": brand,
                "operator_name": row.get("operator"),
                "operator_id": (row.get("operator") or brand).lower().replace(" ", "_")[:80],
                "host_name": row.get("host_name"),
                "address": row.get("full_address"),
                "city": row.get("city"),
                "state": row.get("state"),
                "location": {"type": "Point", "coordinates": [lon, lat]},
                "latitude": lat,
                "longitude": lon,
                "google_maps_url": row.get("exact_google_maps_url") or row.get("previous_maps_url") or row.get("google_maps_search_url"),
                "maps_url_type": row.get("maps_url_type") or "coordinate_or_search",
                "verification_status": row.get("confidence_level") or "checkpoint",
                "confidence": row.get("confidence_level"),
                "operational_status": row.get("operational_status") or "Operational status unknown",
                "access_type": row.get("public_private_classification") or "public research",
                "connector_types": connector_types(row.get("connector_types")),
                "max_power_kw": float(row["max_power_kw"]) if (row.get("max_power_kw") or "").replace(".", "", 1).isdigit() else None,
                "tariff_summary": row.get("tariff") or None,
                "source_url": row.get("primary_source") or row.get("official_locator_url"),
                "evidence_date": row.get("verification_date") or row.get("access_date"),
                "duplicate_group_id": row.get("duplicate_group_id"),
                "data_quality_notes": row.get("notes"),
                "demo_charging_enabled": demo_enabled,
                "demo_charger_id": None,
                "qr_value": None,
                "status_source": "research_import",
                "is_demo": demo_enabled,
                "environment": get_settings().app_env,
                "created_at": now,
                "updated_at": now,
                "version": 1,
            }
            await db.providers.update_one({"provider_key": brand.lower().replace(" ", "_")[:80]}, {"$setOnInsert": {"provider_key": brand.lower().replace(" ", "_")[:80], "name": brand, "created_at": now}}, upsert=True)
            await db.operators.update_one({"operator_id": station_doc["operator_id"]}, {"$setOnInsert": {"operator_id": station_doc["operator_id"], "name": row.get("operator") or brand, "created_at": now}}, upsert=True)
            await db.stations.update_one({"station_id": station_id}, {"$set": station_doc}, upsert=True)
            await db.station_verification_evidence.update_one({"station_id": station_id}, {"$set": {"station_id": station_id, "maps_url_type": station_doc["maps_url_type"], "google_maps_url": station_doc["google_maps_url"], "source_url": station_doc["source_url"], "updated_at": now}}, upsert=True)
            if demo_enabled:
                report["demo_records_created"] += 1
                evse_id = f"{station_id}-EVSE-1"
                connector_id = f"{station_id}-CCS2-1"
                await db.evses.update_one({"evse_id": evse_id}, {"$set": {"evse_id": evse_id, "station_id": station_id, "status": "available", "is_demo": True, "created_at": now, "updated_at": now}}, upsert=True)
                await db.connectors.update_one({"demo_charger_id": station_doc["demo_charger_id"]}, {"$set": {"connector_id": connector_id, "evse_id": evse_id, "station_id": station_id, "connector_type": "CCS2", "power_kw": station_doc["max_power_kw"], "status": "available", "demo_charger_id": station_doc["demo_charger_id"], "demo_charging_enabled": True, "is_demo": True, "created_at": now, "updated_at": now}}, upsert=True)
                report["connectors_created"] += 1
            report["imported_rows"] += 1
    await db.import_jobs.insert_one({"import_job_id": f"import_{uuid4().hex[:12]}", **report, "created_at": datetime.now(UTC)})
    print(report)


if __name__ == "__main__":
    run(main)
