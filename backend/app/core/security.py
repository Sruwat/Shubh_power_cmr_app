import base64
import hashlib
import hmac
import json
import time
from typing import Any

from fastapi import HTTPException, Request, status

from backend.app.core.config import get_settings


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _unb64(data: str) -> bytes:
    padded = data + "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(padded.encode())


def create_token(subject: str, token_type: str = "access", expires_in_seconds: int = 3600) -> str:
    settings = get_settings()
    payload = {
        "sub": subject,
        "typ": token_type,
        "iat": int(time.time()),
        "exp": int(time.time()) + expires_in_seconds,
    }
    body = _b64(json.dumps(payload, separators=(",", ":")).encode())
    secret = settings.refresh_secret_key if token_type == "refresh" else settings.secret_key
    signature = hmac.new(secret.get_secret_value().encode(), body.encode(), hashlib.sha256).digest()
    return f"{body}.{_b64(signature)}"


def decode_token(token: str, expected_type: str = "access") -> dict[str, Any]:
    settings = get_settings()
    try:
        body, signature = token.split(".", 1)
        secret = settings.refresh_secret_key if expected_type == "refresh" else settings.secret_key
        expected = _b64(hmac.new(secret.get_secret_value().encode(), body.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            raise ValueError("bad signature")
        payload = json.loads(_unb64(body))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    if payload.get("typ") != expected_type or payload.get("exp", 0) < time.time():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Expired token")
    return payload


def get_bearer_token(request: Request) -> str:
    auth = request.headers.get("authorization", "")
    if not auth.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    return auth.split(" ", 1)[1].strip()


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
