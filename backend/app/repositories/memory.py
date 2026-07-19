from __future__ import annotations

import math
from dataclasses import dataclass, field

from backend.app.models.domain import ChargingSession, Station, SupportTicket, User, Vehicle, WalletLedgerEntry


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


@dataclass
class MemoryStore:
    users: dict[str, User] = field(default_factory=dict)
    users_by_phone: dict[str, str] = field(default_factory=dict)
    otp_by_phone: dict[str, str] = field(default_factory=dict)
    vehicles: dict[str, Vehicle] = field(default_factory=dict)
    stations: dict[str, Station] = field(default_factory=dict)
    sessions: dict[str, ChargingSession] = field(default_factory=dict)
    wallet_ledger: list[WalletLedgerEntry] = field(default_factory=list)
    tickets: dict[str, SupportTicket] = field(default_factory=dict)
    saved: set[tuple[str, str]] = field(default_factory=set)

    def upsert_user(self, phone: str) -> User:
        existing = self.users_by_phone.get(phone)
        if existing:
            return self.users[existing]
        user = User(phone=phone)
        self.users[user.id] = user
        self.users_by_phone[phone] = user.id
        self.wallet_ledger.append(
            WalletLedgerEntry(user_id=user.id, amount_inr=500, direction="credit", reference_id=f"welcome_{user.id}", reason="Demo welcome balance")
        )
        return user

    def nearby(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        brand: str | None = None,
        connector_type: str | None = None,
        available_only: bool = False,
        verified_only: bool = False,
    ) -> list[dict]:
        rows = []
        for station in self.stations.values():
            if brand and brand.lower() not in station.brand.lower():
                continue
            if connector_type and connector_type not in station.connector_types:
                continue
            if available_only and not station.demo_charging_enabled:
                continue
            if verified_only and station.verification_confidence.lower() in {"low", "evidence unavailable"}:
                continue
            km = distance_km(latitude, longitude, station.latitude, station.longitude)
            if km > radius_km:
                continue
            score = max(0, 40 - km) + (18 if station.demo_charging_enabled else 0) + (12 if "Shubh" in station.brand else 0)
            if connector_type and connector_type in station.connector_types:
                score += 22
            rows.append({"station": station, "distance_km": round(km, 2), "recommendation_score": round(score, 2)})
        return sorted(rows, key=lambda row: (-row["recommendation_score"], row["distance_km"]))


store = MemoryStore()
