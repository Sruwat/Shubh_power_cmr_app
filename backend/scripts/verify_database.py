from __future__ import annotations

from backend.app.db.indexes import REQUIRED_COLLECTIONS
from backend.scripts.common import run


async def main(db):
    names = set(await db.list_collection_names())
    missing = [name for name in REQUIRED_COLLECTIONS if name not in names]
    if missing:
        raise SystemExit(f"Missing collections: {missing}")
    station_count = await db.stations.count_documents({})
    demo_count = await db.stations.count_documents({"demo_charging_enabled": True})
    connector_count = await db.connectors.count_documents({})
    cursor = await db.stations.aggregate(
        [
            {"$geoNear": {"near": {"type": "Point", "coordinates": [77.3910, 28.5355]}, "distanceField": "distance_m", "maxDistance": 80000, "spherical": True}},
            {"$limit": 5},
        ]
    )
    nearby = [row async for row in cursor]
    if station_count == 0 or not nearby:
        raise SystemExit("Station import/geospatial query verification failed")
    index_count = 0
    for name in REQUIRED_COLLECTIONS:
        if name in names:
            index_count += len(await db[name].index_information())
    print({"database": db.name, "collections": len(names), "indexes": index_count, "stations": station_count, "demo_stations": demo_count, "connectors": connector_count, "nearby_sample": len(nearby)})


if __name__ == "__main__":
    run(main)
