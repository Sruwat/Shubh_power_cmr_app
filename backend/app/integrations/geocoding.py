from __future__ import annotations

import time
from typing import Any

import httpx


class NominatimProvider:
    def __init__(self) -> None:
        self.cache: dict[str, tuple[float, Any]] = {}
        self.user_agent = "ShubhPowerDemo/0.1 contact:info@shubhpower.com"
        self.last_upstream_request_at = 0.0

    async def _wait_for_rate_limit(self) -> None:
        elapsed = time.monotonic() - self.last_upstream_request_at
        if elapsed < 1:
            import asyncio

            await asyncio.sleep(1 - elapsed)
        self.last_upstream_request_at = time.monotonic()

    async def search(self, query: str, limit: int = 5) -> list[dict]:
        query = query.strip()
        if len(query) < 3:
            return []
        key = f"search:{query.lower()}:{limit}"
        cached = self.cache.get(key)
        if cached and time.time() - cached[0] < 3600:
            return cached[1]
        await self._wait_for_rate_limit()
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": query, "format": "jsonv2", "limit": limit, "countrycodes": "in"},
                headers={"User-Agent": self.user_agent},
            )
            response.raise_for_status()
            rows = [
                {"label": item.get("display_name"), "latitude": float(item["lat"]), "longitude": float(item["lon"]), "provider": "nominatim"}
                for item in response.json()
                if item.get("lat") and item.get("lon")
            ]
        self.cache[key] = (time.time(), rows)
        return rows

    async def reverse(self, latitude: float, longitude: float) -> dict:
        key = f"reverse:{latitude:.5f}:{longitude:.5f}"
        cached = self.cache.get(key)
        if cached and time.time() - cached[0] < 3600:
            return cached[1]
        await self._wait_for_rate_limit()
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={"lat": latitude, "lon": longitude, "format": "jsonv2"},
                headers={"User-Agent": self.user_agent},
            )
            response.raise_for_status()
            item = response.json()
        result = {"label": item.get("display_name"), "latitude": latitude, "longitude": longitude, "provider": "nominatim"}
        self.cache[key] = (time.time(), result)
        return result


geocoding_provider = NominatimProvider()
