from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field

from backend.app.core.security import decode_token, get_bearer_token
from backend.app.db.mongo import mask_mongo_error, mongo_state
from backend.app.integrations.geocoding import geocoding_provider
from backend.app.models.domain import Vehicle
from backend.app.repositories import mongo_repo
from backend.app.repositories.memory import store
from backend.app.services import auth as auth_service
from backend.app.services import charging as charging_service
from backend.app.services.stations import serialize_station

router = APIRouter(prefix="/api/v1")


def current_user_id(request: Request) -> str:
    return decode_token(get_bearer_token(request), "access")["sub"]


class PhoneOtpRequest(BaseModel):
    phone: str = Field(min_length=10)


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str


class RefreshRequest(BaseModel):
    refresh_token: str


class VehicleRequest(BaseModel):
    name: str
    connector_types: list[str] = ["CCS2"]
    vehicle_type: str = "Car"
    brand: str | None = None
    model: str | None = None
    registration_number: str | None = None
    battery_kwh: float | None = None
    photo_url: str | None = None
    rc_photo_url: str | None = None
    detection_status: str = "manual_confirmed"
    is_default: bool = True


class ChargerValidateRequest(BaseModel):
    charger_id: str


class StartSessionRequest(BaseModel):
    charger_id: str
    connector_id: str
    payment_id: str | None = None
    idempotency_key: str | None = None


class PaymentIntentRequest(BaseModel):
    amount_inr: float = 200
    purpose: str = "charging_session"
    idempotency_key: str | None = None


class PaymentCompleteRequest(BaseModel):
    payment_id: str
    success: bool = True


class WalletTopUpRequest(BaseModel):
    amount_inr: float = 500
    idempotency_key: str | None = None


class TicketRequest(BaseModel):
    category: str
    message: str
    session_id: str | None = None
    station_id: str | None = None
    payment_id: str | None = None


@router.get("/health")
async def health() -> dict:
    if mongo_repo.mongo_ready():
        try:
            station_count = await mongo_repo.get_db().stations.count_documents({})
        except Exception as exc:
            mongo_state.connected = False
            mongo_state.last_error = f"{type(exc).__name__}: {exc}"
            station_count = len(store.stations)
    else:
        station_count = len(store.stations)
    return {"status": "ok", "database_connected": mongo_state.connected, "database_error": mask_mongo_error(), "station_count": station_count}


@router.post("/auth/request-otp")
async def request_otp(payload: PhoneOtpRequest) -> dict:
    return await auth_service.request_otp(payload.phone)


@router.post("/auth/verify-otp")
async def verify_otp(payload: VerifyOtpRequest) -> dict:
    try:
        return await auth_service.verify_otp(payload.phone, payload.otp)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/auth/refresh")
async def refresh(payload: RefreshRequest) -> dict:
    try:
        return await auth_service.refresh_token(payload.refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


@router.post("/auth/logout")
async def logout(payload: RefreshRequest | None = None, _: str = Depends(current_user_id)) -> dict:
    return await auth_service.logout(payload.refresh_token if payload else None)


@router.get("/users/me")
async def me(user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        user = await mongo_repo.user_by_id(user_id)
        if not user:
            raise HTTPException(404, "User not found")
        return user
    return store.users[user_id].model_dump(mode="json")


@router.patch("/users/me")
async def update_me(payload: dict, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        return await mongo_repo.update_user(user_id, payload)
    user = store.users[user_id]
    user.name = payload.get("name", user.name)
    user.language = payload.get("language", user.language)
    user.email = payload.get("email", user.email)
    user.avatar_url = payload.get("avatar_url", user.avatar_url)
    user.notification_preferences = payload.get("notification_preferences", user.notification_preferences)
    user.consent_flags = payload.get("consent_flags", user.consent_flags)
    store.users[user_id] = user
    return user.model_dump(mode="json")


@router.delete("/users/me")
async def delete_me(user_id: str = Depends(current_user_id)) -> dict:
    user = store.users[user_id]
    user.deleted_at = None
    return {"status": "account_deletion_requested"}


@router.get("/vehicles")
async def vehicles(user_id: str = Depends(current_user_id)) -> list[dict]:
    if mongo_repo.mongo_ready():
        return await mongo_repo.list_vehicles(user_id)
    return [vehicle.model_dump(mode="json") for vehicle in store.vehicles.values() if vehicle.user_id == user_id]


@router.post("/vehicles")
async def add_vehicle(payload: VehicleRequest, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        return await mongo_repo.add_vehicle(user_id, payload.model_dump())
    vehicle = Vehicle(user_id=user_id, **payload.model_dump())
    store.vehicles[vehicle.id] = vehicle
    return vehicle.model_dump(mode="json")


@router.patch("/vehicles/{vehicle_id}")
async def update_vehicle(vehicle_id: str, payload: VehicleRequest, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        vehicle = await mongo_repo.update_vehicle(user_id, vehicle_id, payload.model_dump())
        if not vehicle:
            raise HTTPException(404, "Vehicle not found")
        return vehicle
    vehicle = store.vehicles[vehicle_id]
    if vehicle.user_id != user_id:
        raise HTTPException(403, "Forbidden")
    for key, value in payload.model_dump().items():
        setattr(vehicle, key, value)
    return vehicle.model_dump(mode="json")


@router.post("/vehicles/photo-detect")
async def vehicle_photo_detect(payload: dict, _: str = Depends(current_user_id)) -> dict:
    return {
        "status": "manual_confirmation_required",
        "confidence": 0.72,
        "suggestion": {
            "brand": payload.get("brand") or "Tata",
            "model": payload.get("model") or "Nexon EV",
            "battery_kwh": payload.get("battery_kwh") or 40,
            "connector_types": payload.get("connector_types") or ["CCS2"],
        },
        "message": "Prototype detection returns a safe suggestion. User confirmation is required before saving.",
    }


@router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, user_id: str = Depends(current_user_id)) -> dict:
    vehicle = store.vehicles.get(vehicle_id)
    if vehicle and vehicle.user_id == user_id:
        del store.vehicles[vehicle_id]
    return {"status": "deleted"}


@router.get("/stations/nearby")
async def nearby(
    latitude: float,
    longitude: float,
    radius_km: float = Query(default=20, ge=1, le=200),
    brand: str | None = None,
    connector_type: str | None = None,
    min_power_kw: float | None = None,
    access_type: str | None = None,
    available_only: bool = False,
    demo_enabled_only: bool = False,
    shubh_only: bool = False,
    verified_only: bool = False,
    limit: int = Query(default=50, ge=1, le=200),
) -> dict:
    if mongo_repo.mongo_ready():
        rows = await mongo_repo.nearby_stations(latitude, longitude, radius_km, brand, connector_type, min_power_kw, access_type, demo_enabled_only or available_only, verified_only, limit, shubh_only)
        return {"items": [serialize_station(row) for row in rows], "count": len(rows), "ranking": "mongodb-geonear-deterministic-v1"}
    rows = store.nearby(latitude, longitude, radius_km, brand, connector_type, available_only, verified_only)
    return {"items": [serialize_station(row) for row in rows], "count": len(rows), "ranking": "deterministic-demo-v1"}


@router.get("/stations/search")
async def station_search(q: str = "", limit: int = 25) -> dict:
    if mongo_repo.mongo_ready():
        rows = await mongo_repo.search_stations(q, limit)
        return {"items": [serialize_station(row) for row in rows], "count": len(rows)}
    ql = q.lower()
    rows = [
        {"station": s, "distance_km": None, "recommendation_score": 0}
        for s in store.stations.values()
        if ql in s.name.lower() or ql in s.brand.lower() or ql in (s.city or "").lower()
    ][:limit]
    return {"items": [serialize_station(row) for row in rows], "count": len(rows)}


@router.get("/stations/map-bounds")
async def map_bounds(north: float, south: float, east: float, west: float) -> dict:
    if mongo_repo.mongo_ready():
        rows = []
        async for station in mongo_repo.get_db().stations.find({"latitude": {"$gte": south, "$lte": north}, "longitude": {"$gte": west, "$lte": east}}).limit(500):
            rows.append(serialize_station({"station": mongo_repo.oidless(station), "distance_km": None, "recommendation_score": 0}))
        return {"items": rows, "count": len(rows), "attribution": "OpenStreetMap contributors"}
    rows = [
        {"station": s, "distance_km": None, "recommendation_score": 0}
        for s in store.stations.values()
        if south <= s.latitude <= north and west <= s.longitude <= east
    ]
    return {"items": [serialize_station(row) for row in rows], "count": len(rows)}


@router.get("/stations/filter-options")
async def filter_options() -> dict:
    if mongo_repo.mongo_ready():
        db = mongo_repo.get_db()
        return {
            "brands": sorted(await db.stations.distinct("brand")),
            "connector_types": sorted(await db.connectors.distinct("connector_type")),
            "statuses": sorted(await db.stations.distinct("operational_status")),
        }
    return {
        "brands": sorted({station.brand for station in store.stations.values()}),
        "connector_types": sorted({connector for station in store.stations.values() for connector in station.connector_types}),
        "statuses": sorted({station.operational_status for station in store.stations.values()}),
    }


@router.get("/locations/search")
async def location_search(q: str, limit: int = Query(default=5, ge=1, le=10)) -> dict:
    return {"items": await geocoding_provider.search(q, limit), "provider": "nominatim", "attribution": "OpenStreetMap contributors"}


@router.get("/locations/reverse-geocode")
async def reverse_geocode(latitude: float, longitude: float) -> dict:
    return {"result": await geocoding_provider.reverse(latitude, longitude), "provider": "nominatim", "attribution": "OpenStreetMap contributors"}


@router.get("/stations/{station_id}")
async def station_detail(station_id: str) -> dict:
    if mongo_repo.mongo_ready():
        station = await mongo_repo.station_by_id(station_id)
        if not station:
            raise HTTPException(404, "Station not found")
        return serialize_station({"station": station, "connectors": station.get("connectors", []), "distance_km": None, "recommendation_score": 0})
    station = store.stations.get(station_id)
    if not station:
        raise HTTPException(404, "Station not found")
    return serialize_station({"station": station, "distance_km": None, "recommendation_score": 0})


@router.post("/stations/{station_id}/save")
async def save_station(station_id: str, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        await mongo_repo.save_station(user_id, station_id)
        return {"saved": True}
    store.saved.add((user_id, station_id))
    return {"saved": True}


@router.delete("/stations/{station_id}/save")
async def unsave_station(station_id: str, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        await mongo_repo.unsave_station(user_id, station_id)
        return {"saved": False}
    store.saved.discard((user_id, station_id))
    return {"saved": False}


@router.post("/charging/validate")
async def validate_charger(payload: ChargerValidateRequest, _: str = Depends(current_user_id)) -> dict:
    return await charging_service.validate_charger(payload.charger_id)


@router.post("/charging/sessions")
async def start_session(payload: StartSessionRequest, user_id: str = Depends(current_user_id)) -> dict:
    try:
        session = await charging_service.start_session(user_id, payload.charger_id, payload.connector_id, payload.payment_id, payload.idempotency_key)
        return session if isinstance(session, dict) else session.model_dump(mode="json")
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@router.get("/charging/sessions/active")
async def active_session(user_id: str = Depends(current_user_id)) -> dict:
    session = await charging_service.active_session(user_id)
    return {"session": session if isinstance(session, dict) or session is None else session.model_dump(mode="json")}


@router.get("/charging/sessions/{session_id}")
async def get_session(session_id: str, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        doc = await mongo_repo.get_db().charging_sessions.find_one({"session_id": session_id})
        if not doc:
            raise HTTPException(404, "Session not found")
        if doc["user_id"] != user_id:
            raise HTTPException(403, "Forbidden")
        return await charging_service.update_session_doc(doc)
    session = store.sessions[session_id]
    if session.user_id != user_id:
        raise HTTPException(403, "Forbidden")
    return charging_service.tick_session(session).model_dump(mode="json")


@router.post("/charging/sessions/{session_id}/stop")
async def stop_session(session_id: str, user_id: str = Depends(current_user_id)) -> dict:
    stopped = await charging_service.stop_session(user_id, session_id)
    return stopped if isinstance(stopped, dict) else stopped.model_dump(mode="json")


@router.get("/charging/sessions")
async def session_history(user_id: str = Depends(current_user_id)) -> list[dict]:
    if mongo_repo.mongo_ready():
        rows = []
        async for doc in mongo_repo.get_db().charging_sessions.find({"user_id": user_id}).sort("created_at", -1):
            rows.append(await charging_service.update_session_doc(doc))
        return rows
    return [charging_service.tick_session(s).model_dump(mode="json") for s in store.sessions.values() if s.user_id == user_id]


@router.post("/payments/intents")
async def payment_intent(payload: PaymentIntentRequest, user_id: str = Depends(current_user_id)) -> dict:
    return await charging_service.create_payment_intent(user_id, payload.amount_inr, payload.purpose, payload.idempotency_key)


@router.post("/payments/demo-complete")
async def payment_complete(payload: PaymentCompleteRequest, user_id: str = Depends(current_user_id)) -> dict:
    return await charging_service.complete_demo_payment(user_id, payload.payment_id, payload.success)


@router.get("/payments/{payment_id}")
async def payment(payment_id: str, _: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        payment_doc = await mongo_repo.get_db().payments.find_one({"payment_id": payment_id})
        if payment_doc:
            return mongo_repo.oidless(payment_doc)
    return {"payment_id": payment_id, "status": "succeeded", "simulated": True}


@router.get("/wallet")
async def wallet(user_id: str = Depends(current_user_id)) -> dict:
    return await charging_service.wallet_balance(user_id)


@router.post("/wallet/top-up")
async def wallet_top_up(payload: WalletTopUpRequest, user_id: str = Depends(current_user_id)) -> dict:
    return await charging_service.top_up_wallet(user_id, payload.amount_inr, payload.idempotency_key)


@router.get("/wallet/ledger")
async def wallet_ledger(user_id: str = Depends(current_user_id)) -> list[dict]:
    if mongo_repo.mongo_ready():
        return [mongo_repo.oidless(entry) async for entry in mongo_repo.get_db().wallet_ledger_entries.find({"user_id": user_id}).sort("created_at", -1)]
    return [entry.model_dump(mode="json") for entry in store.wallet_ledger if entry.user_id == user_id]


@router.get("/refunds/{refund_id}")
async def refund(refund_id: str, _: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        refund_doc = await mongo_repo.get_db().refunds.find_one({"refund_id": refund_id})
        if refund_doc:
            return mongo_repo.oidless(refund_doc)
    return {"refund_id": refund_id, "status": "refund_pending", "simulated": True}


@router.get("/invoices/{invoice_id}")
async def invoice(invoice_id: str, _: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        invoice_doc = await mongo_repo.get_db().invoices.find_one({"invoice_id": invoice_id})
        if invoice_doc:
            return mongo_repo.oidless(invoice_doc)
    return {"invoice_id": invoice_id, "status": "generated", "download_url": None, "simulated": True}


@router.post("/issues")
async def issue(payload: TicketRequest, user_id: str = Depends(current_user_id)) -> dict:
    ticket = await charging_service.create_ticket(user_id, payload.category, payload.message, payload.session_id, payload.station_id, payload.payment_id)
    return ticket if isinstance(ticket, dict) else ticket.model_dump(mode="json")


@router.get("/support/tickets")
async def tickets(user_id: str = Depends(current_user_id)) -> list[dict]:
    if mongo_repo.mongo_ready():
        return [mongo_repo.oidless(ticket) async for ticket in mongo_repo.get_db().support_tickets.find({"user_id": user_id}).sort("created_at", -1)]
    return [ticket.model_dump(mode="json") for ticket in store.tickets.values() if ticket.user_id == user_id]


@router.post("/support/tickets")
async def create_ticket(payload: TicketRequest, user_id: str = Depends(current_user_id)) -> dict:
    ticket = await charging_service.create_ticket(user_id, payload.category, payload.message, payload.session_id, payload.station_id, payload.payment_id)
    return ticket if isinstance(ticket, dict) else ticket.model_dump(mode="json")


@router.get("/support/tickets/{ticket_id}")
async def ticket_detail(ticket_id: str, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        ticket = await mongo_repo.get_db().support_tickets.find_one({"ticket_id": ticket_id})
        if not ticket:
            raise HTTPException(404, "Ticket not found")
        if ticket["user_id"] != user_id:
            raise HTTPException(403, "Forbidden")
        return mongo_repo.oidless(ticket)
    ticket = store.tickets[ticket_id]
    if ticket.user_id != user_id:
        raise HTTPException(403, "Forbidden")
    return ticket.model_dump(mode="json")


@router.post("/support/tickets/{ticket_id}/messages")
async def ticket_message(ticket_id: str, payload: dict, user_id: str = Depends(current_user_id)) -> dict:
    if mongo_repo.mongo_ready():
        now = mongo_repo.utc_now()
        message_doc = {"support_message_id": f"msg_{ticket_id}_{now.timestamp()}", "ticket_id": ticket_id, "user_id": user_id, "message": payload.get("message"), "created_at": now, "is_demo": True}
        await mongo_repo.get_db().support_messages.insert_one(message_doc)
        await mongo_repo.get_db().support_tickets.update_one({"ticket_id": ticket_id, "user_id": user_id}, {"$set": {"updated_at": now}, "$push": {"timeline": {"status": "message_added", "at": now}}})
        return {"ticket_id": ticket_id, "message": payload.get("message"), "status": "added"}
    ticket = store.tickets[ticket_id]
    if ticket.user_id != user_id:
        raise HTTPException(403, "Forbidden")
    return {"ticket_id": ticket_id, "message": payload.get("message"), "status": "added"}


@router.get("/config/mobile")
async def mobile_config() -> dict:
    if mongo_repo.mongo_ready():
        demo_ids = await mongo_repo.get_db().stations.distinct("demo_charger_id", {"demo_charging_enabled": True, "demo_charger_id": {"$ne": None}})
        config = await mongo_repo.get_db().app_config.find_one({"config_key": "ranking_weights"})
        return {
            "ranking_weights": (config or {}).get("value") or {"distance": 28, "compatibility": 22, "availability": 18, "verification": 12, "power": 6, "tariff": 8},
            "demo_charger_ids": sorted(demo_ids),
            "support_languages": ["en", "hi"],
        }
    return {
        "ranking_weights": {"distance": 28, "compatibility": 22, "availability": 18, "verification": 12, "power": 6, "tariff": 8},
        "demo_charger_ids": [s.demo_charger_id for s in store.stations.values() if s.demo_charger_id],
        "support_languages": ["en", "hi"],
    }


@router.get("/config/feature-flags")
async def feature_flags() -> dict:
    return {"demo_charging": True, "real_payments": False, "ocpp": False, "ocpi_roaming": False}


@router.get("/admin/stations")
async def admin_stations() -> dict:
    if mongo_repo.mongo_ready():
        rows = []
        async for station in mongo_repo.get_db().stations.find({}).limit(500):
            rows.append(serialize_station({"station": mongo_repo.oidless(station)}))
        return {"items": rows, "count": await mongo_repo.get_db().stations.count_documents({})}
    return {"items": [serialize_station({"station": s}) for s in store.stations.values()], "count": len(store.stations)}


@router.patch("/admin/stations/{station_id}/demo-status")
async def admin_demo_status(station_id: str, payload: dict) -> dict:
    if mongo_repo.mongo_ready():
        await mongo_repo.get_db().stations.update_one({"station_id": station_id}, {"$set": {"demo_charging_enabled": bool(payload.get("demo_charging_enabled")), "updated_at": mongo_repo.utc_now()}})
        station = await mongo_repo.station_by_id(station_id)
        return serialize_station({"station": station, "connectors": station.get("connectors", [])})
    station = store.stations[station_id]
    station.demo_charging_enabled = bool(payload.get("demo_charging_enabled"))
    if station.demo_charging_enabled and not station.demo_charger_id:
        station.demo_charger_id = f"SP-DEMO-{station_id[-4:]}"
    return serialize_station({"station": station})


@router.get("/admin/sessions")
async def admin_sessions() -> dict:
    if mongo_repo.mongo_ready():
        rows = [mongo_repo.oidless(session) async for session in mongo_repo.get_db().charging_sessions.find({}).sort("created_at", -1).limit(500)]
        return {"items": rows, "count": await mongo_repo.get_db().charging_sessions.count_documents({})}
    return {"items": [session.model_dump(mode="json") for session in store.sessions.values()], "count": len(store.sessions)}


@router.get("/admin/data-quality")
async def admin_data_quality() -> dict:
    if mongo_repo.mongo_ready():
        db = mongo_repo.get_db()
        unknown = await db.stations.count_documents({"operational_status": {"$regex": "unknown", "$options": "i"}})
        demo = await db.stations.count_documents({"demo_charging_enabled": True})
        issues = await db.data_quality_issues.count_documents({})
        return {"unknown_operational_status": unknown, "demo_enabled_stations": demo, "data_quality_issues": issues, "exact_google_place_gap": "Exact place listing data remains unavailable for most rows."}
    unknown = sum(1 for s in store.stations.values() if "unknown" in s.operational_status.lower())
    demo = sum(1 for s in store.stations.values() if s.demo_charging_enabled)
    return {"unknown_operational_status": unknown, "demo_enabled_stations": demo, "exact_google_place_gap": "Exact place listing data remains unavailable for most rows."}
