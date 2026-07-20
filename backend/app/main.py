from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.router import router
from backend.app.core.config import get_settings
from backend.app.db.mongo import close_mongo, connect_mongo, mongo_state
from backend.app.repositories.memory import store
from backend.app.services.stations import import_station_csv, import_station_seed_json, upsert_station_seed_json


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not store.stations:
        imported = import_station_seed_json()
        if imported == 0:
            import_station_csv(get_settings().station_source_csv)
    await connect_mongo()
    if mongo_state.connected:
        await upsert_station_seed_json()
    yield
    await close_mongo()


app = FastAPI(
    title="Shubh Power 360 EV Charging Platform API",
    version="0.1.0",
    description="Demo backend for the Shubh Power consumer EV charging app. Real OCPP, SMS and payments are pending integrations.",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def correlation_id(request: Request, call_next):
    response = await call_next(request)
    response.headers["x-correlation-id"] = request.headers.get("x-correlation-id", "local-demo")
    return response


@app.get("/")
async def root() -> dict:
    return {"service": "shubh-power-360", "database_connected": mongo_state.connected, "docs": "/docs"}


app.include_router(router)
