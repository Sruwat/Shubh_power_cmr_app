from __future__ import annotations

from backend.scripts.common import run


async def main(db):
    for name in await db.list_collection_names():
        await db[name].delete_many({"is_demo": True})
    print("Deleted demo documents only. Research/imported non-demo records were preserved.")


if __name__ == "__main__":
    run(main)
