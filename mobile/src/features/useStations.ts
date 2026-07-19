import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Station } from "@/api/client";
import { withPresentation } from "@/data/presentation";
import { useStationFilters } from "@/store/stationFilters";

export function useNearbyStations() {
  const [coords, setCoords] = useState({ latitude: 28.5355, longitude: 77.391 });
  const [locationLabel, setLocationLabel] = useState("Manual: Noida");
  const filters = useStationFilters();

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;
    const startLocation = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;
      if (permission.status === "granted") {
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationLabel("Live location");
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 25, timeInterval: 8000 },
          (positionUpdate) => {
            setCoords({ latitude: positionUpdate.coords.latitude, longitude: positionUpdate.coords.longitude });
            setLocationLabel("Live location");
          }
        );
      } else {
        setLocationLabel("Manual: Noida");
      }
    };
    void startLocation().catch(() => setLocationLabel("Manual: Noida"));
    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  const query = useQuery({
    queryKey: ["nearby", coords, filters.mode, filters.connectorType, filters.availableOnly, filters.radiusKm, filters.minPowerKw, filters.sortMode],
    queryFn: async () => {
      const response = await api.get<{ items: Station[]; count: number }>("/api/v1/stations/nearby", {
        params: {
          ...coords,
          radius_km: Math.max(filters.radiusKm, 20),
          brand: filters.mode === "shubh" ? "Shubh Power" : undefined,
          connector_type: filters.compatibleOnly ? filters.connectorType : undefined,
          min_power_kw: filters.minPowerKw,
          available_only: filters.availableOnly,
          shubh_only: filters.mode === "shubh"
        }
      });
      const items = response.data.items
        .map((station, index) => withPresentation(station, index))
        .filter((station) => filters.mode === "all" || /shu?bh/i.test(`${station.brand} ${station.name}`))
        .filter((station) => !filters.compatibleOnly || station.connector_summary.join(" ").toLowerCase().includes(filters.connectorType.toLowerCase()) || station.connectorDetails?.some((item) => item.type.toLowerCase() === filters.connectorType.toLowerCase()))
        .filter((station) => !filters.availableOnly || station.demo_charging_enabled || !(station.availabilityLabel || "").toLowerCase().includes("busy"))
        .sort((a, b) => {
          if (filters.sortMode === "price") return (a.pricePerKwh ?? 999) - (b.pricePerKwh ?? 999);
          if (filters.sortMode === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
          if (filters.sortMode === "speed") return (b.max_power_kw ?? 0) - (a.max_power_kw ?? 0);
          if (filters.sortMode === "availability") return Number(b.demo_charging_enabled) - Number(a.demo_charging_enabled);
          return (a.distance_km ?? 999) - (b.distance_km ?? 999);
        });
      return { ...response.data, items };
    }
  });

  return { ...query, coords, setCoords, locationLabel, filters };
}
