from __future__ import annotations

import math
import re
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from backend.app.core.security import hash_token
from backend.app.db.mongo import get_db, mongo_state


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def mongo_ready() -> bool:
    return mongo_state.connected and get_db() is not None


def oidless(doc: dict | None) -> dict | None:
    if doc is None:
        return None
    clean = dict(doc)
    clean.pop("_id", None)
    return clean


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def re_search_shubh(value: str | None) -> bool:
    return bool(re.search(r"shu?bh", value or "", re.IGNORECASE))


async def store_otp(mobile_number: str, otp: str, expires_minutes: int = 5) -> None:
    db = get_db()
    await db.otp_requests.insert_one(
        {
            "otp_request_id": f"otp_{uuid4().hex[:12]}",
            "mobile_number": mobile_number,
            "otp_hash": hash_token(otp),
            "attempt_count": 0,
            "created_at": utc_now(),
            "expires_at": utc_now() + timedelta(minutes=expires_minutes),
            "environment": "development",
            "is_demo": True,
        }
    )


async def verify_otp(mobile_number: str, otp: str) -> bool:
    db = get_db()
    doc = await db.otp_requests.find_one({"mobile_number": mobile_number}, sort=[("created_at", -1)])
    if not doc or doc["expires_at"] < utc_now():
        return False
    await db.otp_requests.update_one({"_id": doc["_id"]}, {"$inc": {"attempt_count": 1}})
    return doc.get("otp_hash") == hash_token(otp) and doc.get("attempt_count", 0) < 5


async def upsert_user(mobile_number: str) -> dict:
    db = get_db()
    now = utc_now()
    await db.users.update_one(
        {"mobile_number": mobile_number},
        {
            "$setOnInsert": {
                "user_id": f"user_{uuid4().hex[:12]}",
                "mobile_number": mobile_number,
                "created_at": now,
                "environment": "development",
                "is_demo": True,
                "version": 1,
            },
            "$set": {"updated_at": now},
        },
        upsert=True,
    )
    user = oidless(await db.users.find_one({"mobile_number": mobile_number}))
    await db.wallets.update_one(
        {"user_id": user["user_id"]},
        {"$setOnInsert": {"wallet_id": f"wallet_{uuid4().hex[:12]}", "user_id": user["user_id"], "created_at": now, "currency": "INR", "is_demo": True}},
        upsert=True,
    )
    wallet = await db.wallets.find_one({"user_id": user["user_id"]})
    await db.wallet_ledger_entries.update_one(
        {"reference_id": f"welcome_{user['user_id']}"},
        {
            "$setOnInsert": {
                "ledger_entry_id": f"ledger_{uuid4().hex[:12]}",
                "wallet_id": wallet["wallet_id"],
                "user_id": user["user_id"],
                "amount_inr": 500.0,
                "direction": "credit",
                "reference_id": f"welcome_{user['user_id']}",
                "reason": "Demo welcome balance",
                "created_at": now,
                "is_demo": True,
            }
        },
        upsert=True,
    )
    return user


async def store_refresh_token(user_id: str, token: str, expires_days: int) -> None:
    db = get_db()
    await db.refresh_tokens.insert_one(
        {
            "refresh_token_id": f"rt_{uuid4().hex[:12]}",
            "user_id": user_id,
            "token_hash": hash_token(token),
            "created_at": utc_now(),
            "expires_at": utc_now() + timedelta(days=expires_days),
            "revoked_at": None,
        }
    )


async def revoke_refresh_token(token: str) -> None:
    db = get_db()
    await db.refresh_tokens.update_one({"token_hash": hash_token(token)}, {"$set": {"revoked_at": utc_now()}})


async def refresh_token_exists(token: str) -> bool:
    db = get_db()
    doc = await db.refresh_tokens.find_one({"token_hash": hash_token(token), "revoked_at": None})
    return bool(doc and doc["expires_at"] > utc_now())


async def user_by_id(user_id: str) -> dict | None:
    return oidless(await get_db().users.find_one({"user_id": user_id}))


async def update_user(user_id: str, payload: dict) -> dict:
    allowed = {k: v for k, v in payload.items() if k in {"name", "language", "email", "avatar_url", "notification_preferences", "consent_flags"}}
    allowed["updated_at"] = utc_now()
    await get_db().users.update_one({"user_id": user_id}, {"$set": allowed, "$inc": {"version": 1}})
    return await user_by_id(user_id)


async def add_vehicle(user_id: str, payload: dict) -> dict:
    now = utc_now()
    doc = {
        "vehicle_id": f"veh_{uuid4().hex[:12]}",
        "user_id": user_id,
        "name": payload.get("name") or "EV",
        "vehicle_type": payload.get("vehicle_type") or "Car",
        "brand": payload.get("brand"),
        "model": payload.get("model"),
        "registration_number": payload.get("registration_number"),
        "battery_kwh": payload.get("battery_kwh"),
        "connector_types": payload.get("connector_types") or ["CCS2"],
        "photo_url": payload.get("photo_url"),
        "rc_photo_url": payload.get("rc_photo_url"),
        "detection_status": payload.get("detection_status") or "manual_confirmed",
        "is_default": bool(payload.get("is_default", True)),
        "created_at": now,
        "updated_at": now,
        "is_demo": True,
        "version": 1,
    }
    if doc["is_default"]:
        await get_db().vehicles.update_many({"user_id": user_id}, {"$set": {"is_default": False, "updated_at": now}})
    await get_db().vehicles.insert_one(doc)
    return oidless(doc)


async def list_vehicles(user_id: str) -> list[dict]:
    return [oidless(doc) async for doc in get_db().vehicles.find({"user_id": user_id})]


async def update_vehicle(user_id: str, vehicle_id: str, payload: dict) -> dict | None:
    allowed = {
        k: v
        for k, v in payload.items()
        if k in {"name", "vehicle_type", "brand", "model", "registration_number", "battery_kwh", "connector_types", "photo_url", "rc_photo_url", "detection_status", "is_default"}
    }
    allowed["updated_at"] = utc_now()
    if allowed.get("is_default"):
        await get_db().vehicles.update_many({"user_id": user_id}, {"$set": {"is_default": False, "updated_at": allowed["updated_at"]}})
    result = await get_db().vehicles.update_one({"user_id": user_id, "$or": [{"vehicle_id": vehicle_id}, {"id": vehicle_id}]}, {"$set": allowed, "$inc": {"version": 1}})
    if result.matched_count == 0:
        return None
    return oidless(await get_db().vehicles.find_one({"user_id": user_id, "$or": [{"vehicle_id": vehicle_id}, {"id": vehicle_id}]}))


async def nearby_stations(
    latitude: float,
    longitude: float,
    radius_km: float,
    brand: str | None,
    connector_type: str | None,
    min_power_kw: float | None,
    access_type: str | None,
    demo_enabled_only: bool,
    verified_only: bool,
    limit: int,
    shubh_only: bool = False,
) -> list[dict]:
    db = get_db()
    query: dict[str, Any] = {}
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if shubh_only:
        query["$or"] = [{"brand": {"$regex": "shu?bh", "$options": "i"}}, {"name": {"$regex": "shu?bh", "$options": "i"}}]
    if access_type:
        query["access_type"] = access_type
    if demo_enabled_only:
        query["demo_charging_enabled"] = True
    if verified_only:
        query["verification_status"] = {"$nin": ["Evidence unavailable", "unknown"]}
    if min_power_kw is not None:
        query["max_power_kw"] = {"$gte": min_power_kw}
    pipeline: list[dict[str, Any]] = [
        {
            "$geoNear": {
                "near": {"type": "Point", "coordinates": [longitude, latitude]},
                "distanceField": "distance_m",
                "maxDistance": radius_km * 1000,
                "spherical": True,
                "query": query,
            }
        },
        {"$limit": limit},
    ]
    rows = []
    cursor = await db.stations.aggregate(pipeline)
    async for doc in cursor:
        connectors = [oidless(c) async for c in db.connectors.find({"station_id": doc["station_id"]})]
        if connector_type and connector_type.upper() not in {c.get("connector_type", "").upper() for c in connectors}:
            continue
        km = round(doc["distance_m"] / 1000, 2)
        score = max(0, 40 - km) + (18 if doc.get("demo_charging_enabled") else 0) + (12 if re_search_shubh(doc.get("brand", "")) else 0)
        rows.append({"station": oidless(doc), "connectors": connectors, "distance_km": km, "recommendation_score": round(score, 2)})
    return sorted(rows, key=lambda row: (-row["recommendation_score"], row["distance_km"]))


async def station_by_id(station_id: str) -> dict | None:
    db = get_db()
    station = oidless(await db.stations.find_one({"station_id": station_id}))
    if not station:
        station = oidless(await db.stations.find_one({"id": station_id}))
    if station:
        station["connectors"] = [oidless(c) async for c in db.connectors.find({"station_id": station["station_id"]})]
    return station


async def search_stations(query: str, limit: int) -> list[dict]:
    db = get_db()
    regex = {"$regex": query, "$options": "i"}
    rows = []
    async for doc in db.stations.find({"$or": [{"name": regex}, {"brand": regex}, {"city": regex}]}).limit(limit):
        rows.append({"station": oidless(doc), "connectors": [], "distance_km": None, "recommendation_score": 0})
    return rows


async def save_station(user_id: str, station_id: str) -> None:
    await get_db().saved_stations.update_one(
        {"user_id": user_id, "station_id": station_id},
        {"$setOnInsert": {"saved_station_id": f"saved_{uuid4().hex[:12]}", "user_id": user_id, "station_id": station_id, "created_at": utc_now()}},
        upsert=True,
    )


async def unsave_station(user_id: str, station_id: str) -> None:
    await get_db().saved_stations.delete_one({"user_id": user_id, "station_id": station_id})


async def wallet_balance(user_id: str) -> dict:
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {"_id": "$user_id", "credits": {"$sum": {"$cond": [{"$eq": ["$direction", "credit"]}, "$amount_inr", 0]}}, "debits": {"$sum": {"$cond": [{"$eq": ["$direction", "debit"]}, "$amount_inr", 0]}}}},
    ]
    cursor = await get_db().wallet_ledger_entries.aggregate(pipeline)
    rows = [row async for row in cursor]
    balance = (rows[0]["credits"] - rows[0]["debits"]) if rows else 0
    return {"balance_inr": round(balance, 2), "currency": "INR"}
