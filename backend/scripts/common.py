from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from backend.app.db.mongo import close_mongo, connect_mongo, require_db  # noqa: E402


async def with_database(task):
    env_path = ROOT / "backend" / ".env"
    if not env_path.exists() and not os.getenv("MONGODB_URI"):
        raise RuntimeError("backend/.env is missing and MONGODB_URI is not set. Copy backend/.env.example, set the Atlas password, then rerun.")
    os.environ["REQUIRE_MONGODB"] = "true"
    await connect_mongo()
    try:
        db = require_db()
        return await task(db)
    finally:
        await close_mongo()


def run(task) -> None:
    asyncio.run(with_database(task))
