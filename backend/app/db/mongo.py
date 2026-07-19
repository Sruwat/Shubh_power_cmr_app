from typing import Any

from backend.app.core.config import get_settings
from backend.app.db.indexes import INDEX_DEFINITIONS

try:
    import certifi
except Exception:  # pragma: no cover
    certifi = None

try:
    from pymongo import AsyncMongoClient
except Exception:  # pragma: no cover
    AsyncMongoClient = None


class MongoState:
    client: Any | None = None
    db: Any | None = None
    connected: bool = False
    last_error: str | None = None


mongo_state = MongoState()


async def connect_mongo() -> None:
    if AsyncMongoClient is None:
        mongo_state.last_error = "PyMongo AsyncMongoClient is unavailable"
        return
    settings = get_settings()
    try:
        client_kwargs: dict[str, Any] = {"serverSelectionTimeoutMS": 5000}
        if settings.mongodb_uri.startswith("mongodb+srv://") and certifi is not None:
            client_kwargs["tlsCAFile"] = certifi.where()
        mongo_state.client = AsyncMongoClient(settings.mongodb_uri, **client_kwargs)
        mongo_state.db = mongo_state.client[settings.mongodb_database]
        await mongo_state.client.admin.command("ping")
        mongo_state.connected = True
        mongo_state.last_error = None
        await ensure_indexes()
    except Exception as exc:
        mongo_state.connected = False
        mongo_state.last_error = f"{type(exc).__name__}: {exc}"
        if settings.require_mongodb:
            raise


async def close_mongo() -> None:
    if mongo_state.client:
        await mongo_state.client.close()
    mongo_state.connected = False


async def ensure_indexes() -> None:
    if mongo_state.db is None:
        return
    for collection_name, indexes in INDEX_DEFINITIONS.items():
        collection = mongo_state.db[collection_name]
        for index in indexes:
            kwargs = {k: v for k, v in index.items() if k != "keys"}
            await collection.create_index(index["keys"], **kwargs)


def get_db() -> Any:
    return mongo_state.db


def require_db() -> Any:
    if not mongo_state.connected or mongo_state.db is None:
        raise RuntimeError(mongo_state.last_error or "MongoDB is not connected")
    return mongo_state.db


def mask_mongo_error() -> str | None:
    if not mongo_state.last_error:
        return None
    settings = get_settings()
    return mongo_state.last_error.replace(settings.mongodb_uri, settings.masked_mongodb_uri)
