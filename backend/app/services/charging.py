from datetime import UTC, datetime
from uuid import uuid4

from backend.app.models.domain import ChargingSession, SessionStatus, SupportTicket, WalletLedgerEntry
from backend.app.repositories import mongo_repo
from backend.app.repositories.memory import store


def tick_session(session: ChargingSession) -> ChargingSession:
    if session.status != SessionStatus.CHARGING:
        return session
    now = datetime.now(UTC)
    elapsed_hours = max(0, (now - session.last_meter_at).total_seconds() / 3600)
    session.energy_kwh = round(session.energy_kwh + elapsed_hours * session.power_kw, 3)
    session.cost_inr = round(session.energy_kwh * session.tariff_per_kwh, 2)
    session.last_meter_at = now
    store.sessions[session.id] = session
    return session


def tick_session_doc(session: dict) -> dict:
    if session.get("status") != SessionStatus.CHARGING:
        return session
    now = datetime.now(UTC).replace(tzinfo=None)
    last = session.get("last_meter_at") or session.get("started_at") or now
    elapsed_hours = max(0, (now - last).total_seconds() / 3600)
    energy = round(float(session.get("energy_kwh", 0)) + elapsed_hours * float(session.get("power_kw", 30)), 3)
    session["energy_kwh"] = energy
    session["cost_inr"] = round(energy * float(session.get("tariff_per_kwh", 18)), 2)
    session["last_meter_at"] = now
    session["updated_at"] = now
    return session


async def validate_charger(charger_id: str) -> dict:
    if mongo_repo.mongo_ready():
        station = await mongo_repo.get_db().stations.find_one({"demo_charger_id": charger_id, "demo_charging_enabled": True})
        if not station:
            connector = await mongo_repo.get_db().connectors.find_one({"demo_charger_id": charger_id, "demo_charging_enabled": True})
            station = await mongo_repo.get_db().stations.find_one({"station_id": connector["station_id"]}) if connector else None
        if not station:
            return {"valid": False, "reason": "Unsupported charger or not demo-enabled"}
        connectors = [mongo_repo.oidless(c) async for c in mongo_repo.get_db().connectors.find({"station_id": station["station_id"]})]
        return {
            "valid": True,
            "station_id": station["station_id"],
            "station_name": station["name"],
            "connectors": connectors
            or [{"connector_id": f"{charger_id}-CCS2", "id": f"{charger_id}-CCS2", "type": "CCS2", "connector_type": "CCS2", "power_kw": station.get("max_power_kw", 60), "status": "available"}],
            "tariff": {"currency": "INR", "price_per_kwh": 18, "simulated": True},
        }
    station = next((item for item in store.stations.values() if item.demo_charger_id == charger_id and item.demo_charging_enabled), None)
    if not station:
        return {"valid": False, "reason": "Unsupported charger or not demo-enabled"}
    return {
        "valid": True,
        "station_id": station.id,
        "station_name": station.name,
        "connectors": [{"id": f"{charger_id}-CCS2", "type": "CCS2", "power_kw": station.max_power_kw or 60, "status": "available"}],
        "tariff": {"currency": "INR", "price_per_kwh": 18, "simulated": True},
    }


async def start_session(user_id: str, charger_id: str, connector_id: str, payment_id: str | None, idempotency_key: str | None):
    if mongo_repo.mongo_ready():
        db = mongo_repo.get_db()
        if idempotency_key:
            existing = await db.charging_sessions.find_one({"idempotency_key": idempotency_key})
            if existing:
                return await update_session_doc(existing)
        validation = await validate_charger(charger_id)
        if not validation["valid"]:
            raise ValueError(validation["reason"])
        now = datetime.now(UTC).replace(tzinfo=None)
        doc = {
            "session_id": f"sess_{uuid4().hex[:12]}",
            "user_id": user_id,
            "station_id": validation["station_id"],
            "connector_id": connector_id,
            "charger_id": charger_id,
            "status": SessionStatus.CHARGING,
            "created_at": now,
            "updated_at": now,
            "started_at": now,
            "last_meter_at": now,
            "energy_kwh": 0.0,
            "power_kw": 30.0,
            "tariff_per_kwh": 18.0,
            "cost_inr": 0.0,
            "payment_id": payment_id,
            "is_demo": True,
            "version": 1,
        }
        if idempotency_key:
            doc["idempotency_key"] = idempotency_key
        await db.charging_sessions.insert_one(doc)
        await db.charging_session_events.insert_one({"event_id": f"event_{uuid4().hex[:12]}", "session_id": doc["session_id"], "status": SessionStatus.CHARGING, "created_at": now, "is_demo": True})
        clean = mongo_repo.oidless(doc)
        clean["id"] = clean["session_id"]
        return clean
    if idempotency_key:
        for session in store.sessions.values():
            if session.idempotency_key == idempotency_key:
                return tick_session(session)
    validation = await validate_charger(charger_id)
    if not validation["valid"]:
        raise ValueError(validation["reason"])
    session = ChargingSession(
        user_id=user_id,
        station_id=validation["station_id"],
        connector_id=connector_id,
        charger_id=charger_id,
        payment_id=payment_id,
        idempotency_key=idempotency_key,
    )
    store.sessions[session.id] = session
    return session


async def update_session_doc(session: dict) -> dict:
    db = mongo_repo.get_db()
    session = tick_session_doc(mongo_repo.oidless(session))
    session["id"] = session["session_id"]
    await db.charging_sessions.update_one({"session_id": session["session_id"]}, {"$set": {"energy_kwh": session["energy_kwh"], "cost_inr": session["cost_inr"], "last_meter_at": session["last_meter_at"], "updated_at": session["updated_at"]}})
    await db.session_meter_values.insert_one({"meter_value_id": f"meter_{uuid4().hex[:12]}", "session_id": session["session_id"], "energy_kwh": session["energy_kwh"], "power_kw": session["power_kw"], "cost_inr": session["cost_inr"], "recorded_at": datetime.now(UTC).replace(tzinfo=None), "is_demo": True})
    return session


async def active_session(user_id: str):
    if mongo_repo.mongo_ready():
        doc = await mongo_repo.get_db().charging_sessions.find_one({"user_id": user_id, "status": SessionStatus.CHARGING}, sort=[("created_at", -1)])
        return await update_session_doc(doc) if doc else None
    for session in store.sessions.values():
        if session.user_id == user_id and session.status == SessionStatus.CHARGING:
            return tick_session(session)
    return None


async def stop_session(user_id: str, session_id: str):
    if mongo_repo.mongo_ready():
        db = mongo_repo.get_db()
        doc = await db.charging_sessions.find_one({"session_id": session_id})
        if not doc:
            raise KeyError(session_id)
        if doc["user_id"] != user_id:
            raise PermissionError("Not your session")
        session = tick_session_doc(mongo_repo.oidless(doc))
        now = datetime.now(UTC).replace(tzinfo=None)
        session["status"] = SessionStatus.COMPLETED
        session["stopped_at"] = now
        session["updated_at"] = now
        await db.charging_sessions.update_one({"session_id": session_id}, {"$set": session})
        await db.charging_session_events.insert_one({"event_id": f"event_{uuid4().hex[:12]}", "session_id": session_id, "status": SessionStatus.COMPLETED, "created_at": now, "is_demo": True})
        invoice = {"invoice_id": f"inv_{uuid4().hex[:12]}", "session_id": session_id, "user_id": user_id, "amount_inr": session["cost_inr"], "status": "generated", "created_at": now, "is_demo": True}
        await db.invoices.insert_one(invoice)
        session["id"] = session["session_id"]
        return session
    session = store.sessions[session_id]
    if session.user_id != user_id:
        raise PermissionError("Not your session")
    tick_session(session)
    session.status = SessionStatus.COMPLETED
    session.stopped_at = datetime.now(UTC)
    store.sessions[session.id] = session
    return session


async def create_payment_intent(user_id: str, amount_inr: float, purpose: str, idempotency_key: str | None = None) -> dict:
    if mongo_repo.mongo_ready():
        db = mongo_repo.get_db()
        if idempotency_key:
            existing = await db.payments.find_one({"idempotency_key": idempotency_key})
            if existing:
                return mongo_repo.oidless(existing)
        now = datetime.now(UTC).replace(tzinfo=None)
        doc = {"payment_id": f"pay_{uuid4().hex[:12]}", "user_id": user_id, "status": "requires_demo_completion", "amount_inr": amount_inr, "purpose": purpose, "provider": "MockPaymentProvider", "created_at": now, "updated_at": now, "is_demo": True}
        if idempotency_key:
            doc["idempotency_key"] = idempotency_key
        await db.payments.insert_one(doc)
        await db.payment_events.insert_one({"payment_event_id": f"pe_{uuid4().hex[:12]}", "payment_id": doc["payment_id"], "status": doc["status"], "created_at": now, "is_demo": True})
        return mongo_repo.oidless(doc)
    payment_id = f"pay_{uuid4().hex[:12]}"
    return {"payment_id": payment_id, "status": "requires_demo_completion", "amount_inr": amount_inr, "purpose": purpose, "provider": "MockPaymentProvider"}


async def complete_demo_payment(user_id: str, payment_id: str, success: bool = True) -> dict:
    if mongo_repo.mongo_ready():
        status = "succeeded" if success else "failed"
        now = datetime.now(UTC).replace(tzinfo=None)
        await mongo_repo.get_db().payments.update_one({"payment_id": payment_id, "user_id": user_id}, {"$set": {"status": status, "updated_at": now}})
        await mongo_repo.get_db().payment_events.insert_one({"payment_event_id": f"pe_{uuid4().hex[:12]}", "payment_id": payment_id, "status": status, "created_at": now, "is_demo": True})
        return {"payment_id": payment_id, "status": status, "simulated": True}
    return {"payment_id": payment_id, "status": "succeeded" if success else "failed", "simulated": True}


async def wallet_balance(user_id: str) -> dict:
    if mongo_repo.mongo_ready():
        return await mongo_repo.wallet_balance(user_id)
    balance = sum(entry.amount_inr if entry.direction == "credit" else -entry.amount_inr for entry in store.wallet_ledger if entry.user_id == user_id)
    return {"balance_inr": round(balance, 2), "currency": "INR"}


async def top_up_wallet(user_id: str, amount_inr: float, idempotency_key: str | None = None) -> dict:
    if mongo_repo.mongo_ready():
        db = mongo_repo.get_db()
        if idempotency_key:
            existing = await db.wallet_ledger_entries.find_one({"idempotency_key": idempotency_key})
            if existing:
                return {"entry": mongo_repo.oidless(existing), "wallet": await wallet_balance(user_id)}
        wallet = await db.wallets.find_one({"user_id": user_id})
        if not wallet:
            await mongo_repo.upsert_user((await db.users.find_one({"user_id": user_id}))["mobile_number"])
            wallet = await db.wallets.find_one({"user_id": user_id})
        entry = {"ledger_entry_id": f"ledger_{uuid4().hex[:12]}", "wallet_id": wallet["wallet_id"], "user_id": user_id, "amount_inr": amount_inr, "direction": "credit", "reference_id": f"topup_{uuid4().hex[:12]}", "reason": "Demo wallet top-up", "created_at": datetime.now(UTC).replace(tzinfo=None), "is_demo": True}
        if idempotency_key:
            entry["idempotency_key"] = idempotency_key
        await db.wallet_ledger_entries.insert_one(entry)
        return {"entry": mongo_repo.oidless(entry), "wallet": await wallet_balance(user_id)}
    entry = WalletLedgerEntry(user_id=user_id, amount_inr=amount_inr, direction="credit", reference_id=f"topup_{uuid4().hex[:12]}", reason="Demo wallet top-up")
    store.wallet_ledger.append(entry)
    return {"entry": entry.model_dump(mode="json"), "wallet": await wallet_balance(user_id)}


async def create_ticket(user_id: str, category: str, message: str, session_id: str | None = None, station_id: str | None = None, payment_id: str | None = None):
    if mongo_repo.mongo_ready():
        now = datetime.now(UTC).replace(tzinfo=None)
        doc = {"ticket_id": f"ticket_{uuid4().hex[:12]}", "user_id": user_id, "category": category, "message": message, "description": message, "status": "open", "priority": "normal", "session_id": session_id, "station_id": station_id, "payment_id": payment_id, "timeline": [{"status": "open", "at": now}], "created_at": now, "updated_at": now, "is_demo": True}
        await mongo_repo.get_db().support_tickets.insert_one(doc)
        return mongo_repo.oidless(doc)
    ticket = SupportTicket(user_id=user_id, category=category, message=message, session_id=session_id)
    store.tickets[ticket.id] = ticket
    return ticket
