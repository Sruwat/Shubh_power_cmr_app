from __future__ import annotations

import csv
import json
from pathlib import Path

from backend.app.models.domain import Station
from backend.app.repositories import mongo_repo
from backend.app.repositories.memory import store


def _split_connectors(value: str | None) -> list[str]:
    if not value:
        return []
    cleaned = value.replace(";", ",").replace("|", ",")
    return sorted({part.strip().upper().replace("CCS", "CCS2") if part.strip().upper() == "CCS" else part.strip() for part in cleaned.split(",") if part.strip()})


def station_from_row(row: dict, index: int) -> Station | None:
    try:
        lat = float(row.get("latitude") or "")
        lon = float(row.get("longitude") or "")
    except ValueError:
        return None
    station_id = row.get("station_id") or f"research_{index}"
    brand = row.get("brand") or row.get("operator") or "Other / Unclassified"
    connectors = _split_connectors(row.get("connector_types"))
    is_shubh = "shubh" in brand.lower() or "shubh" in (row.get("station_name") or "").lower()
    demo_enabled = is_shubh and index <= 4
    if demo_enabled and not connectors:
        connectors = ["CCS2", "TYPE2"]
    return Station(
        id=station_id,
        station_id=station_id,
        name=row.get("station_name") or row.get("normalized_station_name") or "EV charging station",
        brand=brand,
        operator=row.get("operator"),
        address=row.get("full_address"),
        city=row.get("city"),
        state=row.get("state"),
        latitude=lat,
        longitude=lon,
        location={"type": "Point", "coordinates": [lon, lat]},
        google_maps_url=row.get("exact_google_maps_url") or row.get("previous_maps_url") or row.get("google_maps_search_url"),
        maps_url_type=row.get("maps_url_type") or "coordinate_or_search",
        operational_status=row.get("operational_status") or "Operational status unknown",
        verification_confidence=row.get("confidence_level") or "checkpoint",
        connector_types=connectors,
        max_power_kw=float(row["max_power_kw"]) if (row.get("max_power_kw") or "").replace(".", "", 1).isdigit() else (60 if demo_enabled else None),
        tariff=row.get("tariff") or ("Demo tariff INR 18/kWh" if demo_enabled else None),
        demo_charging_enabled=demo_enabled,
        demo_charger_id=f"SP-DEMO-{index:03d}" if demo_enabled else None,
        data_freshness=row.get("verification_date") or row.get("access_date"),
        notes=row.get("notes"),
    )


def import_station_csv(path: str | Path) -> int:
    csv_path = Path(path)
    if not csv_path.exists():
        return seed_fallback_stations()
    count = 0
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        for index, row in enumerate(csv.DictReader(handle), start=1):
            station = station_from_row(row, index)
            if station is None:
                continue
            store.stations[station.id] = station
            count += 1
    if not any(station.demo_charging_enabled for station in store.stations.values()):
        seed_demo_station()
    return count


def _seed_path() -> Path:
    return Path(__file__).resolve().parents[3] / "database" / "stations_seed.json"


def _station_from_seed(doc: dict) -> Station | None:
    coords = doc.get("coordinates") or {}
    try:
        lat = float(coords.get("latitude") or doc.get("latitude") or "")
        lon = float(coords.get("longitude") or doc.get("longitude") or "")
    except (TypeError, ValueError):
        return None
    connectors = _split_connectors(",".join(doc.get("connector_types") or doc.get("connector_summary") or []))
    return Station(
        id=doc.get("id") or doc.get("station_id"),
        station_id=doc.get("station_id") or doc.get("id"),
        name=doc.get("name") or "EV charging station",
        brand=doc.get("brand") or "Other / Unclassified",
        operator=doc.get("operator") or doc.get("brand"),
        address=doc.get("address"),
        city=doc.get("city"),
        state=doc.get("state"),
        latitude=lat,
        longitude=lon,
        location={"type": "Point", "coordinates": [lon, lat]},
        google_maps_url=doc.get("google_maps_url"),
        maps_url_type=doc.get("maps_url_type") or "google_directions_coordinate_url",
        operational_status=doc.get("operational_status") or "Open Now",
        verification_confidence=doc.get("verification_status") or "High",
        connector_types=connectors,
        max_power_kw=doc.get("max_power_kw"),
        tariff=doc.get("tariff_summary"),
        demo_charging_enabled=bool(doc.get("demo_charging_enabled")),
        demo_charger_id=doc.get("demo_charger_id"),
        data_freshness=doc.get("data_freshness") or "2026-07-20",
        notes=doc.get("notes"),
    )


def load_seed_documents(path: str | Path | None = None) -> list[dict]:
    seed_file = Path(path) if path else _seed_path()
    if not seed_file.exists():
        return []
    payload = json.loads(seed_file.read_text(encoding="utf-8"))
    return payload.get("stations", [])


def import_station_seed_json(path: str | Path | None = None) -> int:
    docs = load_seed_documents(path)
    count = 0
    for doc in docs:
        station = _station_from_seed(doc)
        if station is None:
            continue
        store.stations[station.id] = station
        count += 1
    return count


async def upsert_station_seed_json(path: str | Path | None = None) -> int:
    if not mongo_repo.mongo_ready():
        return 0
    db = mongo_repo.get_db()
    docs = load_seed_documents(path)
    count = 0
    await db.connectors.update_many({"demo_charger_id": None}, {"$unset": {"demo_charger_id": ""}})
    for doc in docs:
        station = _station_from_seed(doc)
        if station is None:
            continue
        station_id = station.station_id
        mongo_doc = {
            **doc,
            "station_id": station_id,
            "id": station.id,
            "latitude": station.latitude,
            "longitude": station.longitude,
            "location": station.location,
            "connector_types": station.connector_types,
            "connector_summary": station.connector_types,
            "access_type": doc.get("access_type") or doc.get("stationCategory") or ("private" if doc.get("isPrivateHub") else "public"),
            "updated_at": mongo_repo.utc_now(),
            "seed_source": "subh power (1).xlsx",
        }
        await db.stations.update_one(
            {"station_id": station_id},
            {"$set": mongo_doc, "$setOnInsert": {"created_at": mongo_repo.utc_now()}},
            upsert=True,
        )
        connector_details = doc.get("connectorDetails") or []
        if not connector_details:
            connector_details = [{"id": f"CP{index + 1:02d}", "type": connector, "power": f"{station.max_power_kw or 22} kW", "status": "Ready to charge"} for index, connector in enumerate(station.connector_types)]
        for index, connector in enumerate(connector_details):
            connector_id = f"{station_id}_{connector.get('id') or index + 1}"
            set_doc = {
                "connector_id": connector_id,
                "station_id": station_id,
                "evse_id": f"{station_id}_EVSE",
                "connector_type": connector.get("type") or "CCS2",
                "status": connector.get("status") or "Ready to charge",
                "max_power_kw": mongo_doc.get("max_power_kw"),
                "seed_source": "subh power (1).xlsx",
                "updated_at": mongo_repo.utc_now(),
            }
            update_doc = {"$set": set_doc}
            if index == 0 and station.demo_charger_id:
                update_doc["$set"]["demo_charger_id"] = station.demo_charger_id
            else:
                update_doc["$unset"] = {"demo_charger_id": ""}
            await db.connectors.update_one({"connector_id": connector_id}, update_doc, upsert=True)
        count += 1
    return count


def seed_demo_station() -> None:
    station = Station(
        id="shubh_demo_noida",
        station_id="shubh_demo_noida",
        name="Shubh Power Demo Charging Hub",
        brand="Shubh Power",
        operator="Shubh Power Solutions",
        address="Demo location near Noida Sector 62",
        city="Noida",
        state="Uttar Pradesh",
        latitude=28.627,
        longitude=77.376,
        location={"type": "Point", "coordinates": [77.376, 28.627]},
        google_maps_url="https://www.google.com/maps/search/Shubh+Power+EV+charging+station",
        maps_url_type="search_url",
        operational_status="Demo simulated availability",
        verification_confidence="demo",
        connector_types=["CCS2", "TYPE2"],
        max_power_kw=60,
        tariff="Demo tariff INR 18/kWh",
        demo_charging_enabled=True,
        demo_charger_id="SP-DEMO-001",
        data_freshness="2026-07-18",
        notes="Demo-enabled station. Real charging integration pending.",
    )
    store.stations[station.id] = station


def seed_fallback_stations() -> int:
    seed_demo_station()
    return 1


def serialize_station(row: dict) -> dict:
    station = row["station"]
    if isinstance(station, dict):
        connectors = row.get("connectors") or []
        connector_types = station.get("connector_types") or [c.get("connector_type") for c in connectors if c.get("connector_type")]
        coordinates = station.get("location", {}).get("coordinates") or [station.get("longitude"), station.get("latitude")]
        return {
            "id": station.get("station_id") or station.get("id"),
            "station_id": station.get("station_id") or station.get("id"),
            "name": station.get("name") or station.get("station_name"),
            "brand": station.get("brand"),
            "address": station.get("address"),
            "distance_km": row.get("distance_km"),
            "recommendation_score": row.get("recommendation_score"),
            "verification_status": station.get("verification_status") or station.get("verification_confidence"),
            "confidence": station.get("confidence"),
            "operational_status": station.get("operational_status"),
            "available_now": bool(station.get("demo_charging_enabled")),
            "demo_charging_enabled": bool(station.get("demo_charging_enabled")),
            "demo_charger_id": station.get("demo_charger_id"),
            "connector_summary": sorted(set(connector_types)),
            "max_power_kw": station.get("max_power_kw"),
            "power_summary": station.get("max_power_kw"),
            "tariff_summary": station.get("tariff_summary") or station.get("tariff"),
            "access_type": station.get("access_type") or ("demo-enabled" if station.get("demo_charging_enabled") else "public research"),
            "stationCategory": station.get("stationCategory") or station.get("station_category"),
            "isPrivateHub": bool(station.get("isPrivateHub") or station.get("is_private_hub")),
            "isShubhHub": bool(station.get("isShubhHub") or station.get("is_shubh_hub")),
            "societyName": station.get("societyName") or station.get("society_name"),
            "area": station.get("area"),
            "city": station.get("city"),
            "state": station.get("state"),
            "pricePerKwh": station.get("pricePerKwh") or station.get("price_per_kwh"),
            "powerLabel": station.get("powerLabel") or station.get("power_label"),
            "availabilityLabel": station.get("availabilityLabel") or station.get("availability_label"),
            "trustScore": station.get("trustScore") or station.get("trust_score"),
            "rating": station.get("rating"),
            "reviewCount": station.get("reviewCount") or station.get("review_count"),
            "etaMin": station.get("etaMin") or station.get("eta_min"),
            "amenities": station.get("amenities") or [],
            "connectorDetails": station.get("connectorDetails") or [
                {
                    "id": c.get("connector_id"),
                    "type": c.get("connector_type"),
                    "power": f"{c.get('max_power_kw') or station.get('max_power_kw') or 22} kW",
                    "status": c.get("status") or "Ready to charge",
                }
                for c in connectors
            ],
            "reviews": station.get("reviews") or [],
            "google_maps_url": station.get("google_maps_url"),
            "maps_url_type": station.get("maps_url_type"),
            "data_freshness": station.get("data_freshness") or station.get("evidence_date"),
            "coordinates": {"latitude": coordinates[1], "longitude": coordinates[0]},
        }
    return {
        "id": station.id,
        "station_id": station.station_id,
        "name": station.name,
        "brand": station.brand,
        "distance_km": row.get("distance_km"),
        "recommendation_score": row.get("recommendation_score"),
        "verification_status": station.verification_confidence,
        "operational_status": station.operational_status,
        "demo_charging_enabled": station.demo_charging_enabled,
        "demo_charger_id": station.demo_charger_id,
        "connector_summary": station.connector_types,
        "max_power_kw": station.max_power_kw,
        "power_summary": station.max_power_kw,
        "tariff_summary": station.tariff,
        "access_type": "public research" if not station.demo_charging_enabled else "demo-enabled",
        "google_maps_url": station.google_maps_url,
        "maps_url_type": station.maps_url_type,
        "data_freshness": station.data_freshness,
        "coordinates": {"latitude": station.latitude, "longitude": station.longitude},
    }
