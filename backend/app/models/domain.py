from __future__ import annotations

from datetime import UTC, datetime
from enum import StrEnum
from uuid import uuid4

from pydantic import BaseModel, Field


def now_utc() -> datetime:
    return datetime.now(UTC)


class SessionStatus(StrEnum):
    IDLE = "IDLE"
    VALIDATING_CHARGER = "VALIDATING_CHARGER"
    SELECTING_CONNECTOR = "SELECTING_CONNECTOR"
    AWAITING_PAYMENT = "AWAITING_PAYMENT"
    PAYMENT_AUTHORIZED = "PAYMENT_AUTHORIZED"
    START_REQUESTED = "START_REQUESTED"
    STARTING = "STARTING"
    CHARGING = "CHARGING"
    STOP_REQUESTED = "STOP_REQUESTED"
    STOPPING = "STOPPING"
    COMPLETED = "COMPLETED"
    VALIDATION_FAILED = "VALIDATION_FAILED"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    START_FAILED = "START_FAILED"
    CHARGER_UNREACHABLE = "CHARGER_UNREACHABLE"
    SESSION_INTERRUPTED = "SESSION_INTERRUPTED"
    STOP_FAILED = "STOP_FAILED"
    PAYMENT_SESSION_MISMATCH = "PAYMENT_SESSION_MISMATCH"
    REFUND_PENDING = "REFUND_PENDING"


class User(BaseModel):
    id: str = Field(default_factory=lambda: f"user_{uuid4().hex[:12]}")
    phone: str
    name: str | None = None
    email: str | None = None
    avatar_url: str | None = None
    language: str = "en"
    notification_preferences: dict = Field(default_factory=dict)
    consent_flags: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=now_utc)
    deleted_at: datetime | None = None


class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: f"veh_{uuid4().hex[:12]}")
    user_id: str
    name: str
    vehicle_type: str = "Car"
    brand: str | None = None
    model: str | None = None
    registration_number: str | None = None
    battery_kwh: float | None = None
    connector_types: list[str] = Field(default_factory=lambda: ["CCS2"])
    photo_url: str | None = None
    rc_photo_url: str | None = None
    detection_status: str = "manual_confirmed"
    is_default: bool = True
    created_at: datetime = Field(default_factory=now_utc)


class Station(BaseModel):
    id: str
    station_id: str
    name: str
    brand: str
    operator: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    latitude: float
    longitude: float
    location: dict = Field(default_factory=dict)
    google_maps_url: str | None = None
    maps_url_type: str = "coordinate_or_search"
    operational_status: str = "Operational status unknown"
    verification_confidence: str = "checkpoint"
    connector_types: list[str] = Field(default_factory=list)
    max_power_kw: float | None = None
    tariff: str | None = None
    demo_charging_enabled: bool = False
    demo_charger_id: str | None = None
    data_freshness: str | None = None
    notes: str | None = None


class ChargingSession(BaseModel):
    id: str = Field(default_factory=lambda: f"sess_{uuid4().hex[:12]}")
    user_id: str
    station_id: str
    connector_id: str
    charger_id: str
    status: SessionStatus = SessionStatus.CHARGING
    started_at: datetime = Field(default_factory=now_utc)
    stopped_at: datetime | None = None
    last_meter_at: datetime = Field(default_factory=now_utc)
    energy_kwh: float = 0
    power_kw: float = 30
    tariff_per_kwh: float = 18
    cost_inr: float = 0
    payment_id: str | None = None
    idempotency_key: str | None = None


class WalletLedgerEntry(BaseModel):
    id: str = Field(default_factory=lambda: f"ledger_{uuid4().hex[:12]}")
    user_id: str
    amount_inr: float
    direction: str
    reference_id: str
    reason: str
    created_at: datetime = Field(default_factory=now_utc)


class SupportTicket(BaseModel):
    id: str = Field(default_factory=lambda: f"ticket_{uuid4().hex[:12]}")
    user_id: str
    category: str
    message: str
    status: str = "open"
    session_id: str | None = None
    created_at: datetime = Field(default_factory=now_utc)
