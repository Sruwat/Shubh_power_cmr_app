from backend.app.core.config import get_settings
from backend.app.core.security import create_token, decode_token
from backend.app.repositories import mongo_repo
from backend.app.repositories.memory import store


async def request_otp(phone: str) -> dict:
    settings = get_settings()
    otp = settings.demo_otp if settings.demo_mode else "pending-provider"
    if mongo_repo.mongo_ready():
        await mongo_repo.store_otp(phone, otp)
    else:
        store.otp_by_phone[phone] = otp
    return {"phone": phone, "cooldown_seconds": 30, "demo_mode": settings.demo_mode}


async def verify_otp(phone: str, otp: str) -> dict:
    if mongo_repo.mongo_ready():
        valid = await mongo_repo.verify_otp(phone, otp)
    else:
        valid = store.otp_by_phone.get(phone) == otp
    if not valid:
        raise ValueError("Invalid OTP")
    if mongo_repo.mongo_ready():
        user = await mongo_repo.upsert_user(phone)
        subject = user["user_id"]
    else:
        memory_user = store.upsert_user(phone)
        user = memory_user.model_dump(mode="json")
        subject = memory_user.id
    access = create_token(subject, "access", get_settings().access_token_minutes * 60)
    refresh = create_token(subject, "refresh", get_settings().refresh_token_days * 86400)
    if mongo_repo.mongo_ready():
        await mongo_repo.store_refresh_token(subject, refresh, get_settings().refresh_token_days)
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer", "user": user}


async def refresh_token(refresh: str) -> dict:
    payload = decode_token(refresh, "refresh")
    if mongo_repo.mongo_ready() and not await mongo_repo.refresh_token_exists(refresh):
        raise ValueError("Refresh token revoked or expired")
    access = create_token(payload["sub"], "access", get_settings().access_token_minutes * 60)
    return {"access_token": access, "token_type": "bearer"}


async def logout(refresh: str | None = None) -> dict:
    if refresh and mongo_repo.mongo_ready():
        await mongo_repo.revoke_refresh_token(refresh)
    return {"status": "logged_out"}
