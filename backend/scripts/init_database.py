from __future__ import annotations

from datetime import UTC, datetime

from backend.app.db.indexes import INDEX_DEFINITIONS, REQUIRED_COLLECTIONS
from backend.scripts.common import run


VALIDATORS = {
    "stations": {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["station_id", "name", "brand", "location", "operational_status", "verification_status"],
            "properties": {
                "station_id": {"bsonType": "string"},
                "name": {"bsonType": "string"},
                "brand": {"bsonType": "string"},
                "location": {
                    "bsonType": "object",
                    "required": ["type", "coordinates"],
                    "properties": {
                        "type": {"enum": ["Point"]},
                        "coordinates": {"bsonType": "array", "minItems": 2, "maxItems": 2},
                    },
                },
            },
        }
    },
    "users": {"$jsonSchema": {"bsonType": "object", "required": ["user_id", "mobile_number"], "properties": {"user_id": {"bsonType": "string"}, "mobile_number": {"bsonType": "string"}}}},
    "wallet_ledger_entries": {"$jsonSchema": {"bsonType": "object", "required": ["ledger_entry_id", "wallet_id", "user_id", "amount_inr", "direction"], "properties": {"direction": {"enum": ["credit", "debit"]}}}},
}


async def main(db):
    existing = set(await db.list_collection_names())
    for name in REQUIRED_COLLECTIONS:
        if name not in existing:
            validator = VALIDATORS.get(name)
            if validator:
                await db.create_collection(name, validator=validator, validationLevel="moderate")
            else:
                await db.create_collection(name)
    for collection_name, indexes in INDEX_DEFINITIONS.items():
        collection = db[collection_name]
        for index in indexes:
            kwargs = {k: v for k, v in index.items() if k != "keys"}
            await collection.create_index(index["keys"], **kwargs)
    await db.app_config.update_one(
        {"config_key": "ranking_weights"},
        {
            "$set": {
                "config_key": "ranking_weights",
                "value": {"distance": 28, "compatibility": 22, "availability": 18, "verification": 12, "power": 6, "tariff": 8, "shubh_priority": 12},
                "updated_at": datetime.now(UTC),
            }
        },
        upsert=True,
    )
    print(f"Initialized {len(REQUIRED_COLLECTIONS)} collections and {sum(len(v) for v in INDEX_DEFINITIONS.values())} indexes.")


if __name__ == "__main__":
    run(main)
