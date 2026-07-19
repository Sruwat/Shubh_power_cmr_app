import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StationMap } from "@/components/StationMap";
import { CircleButton, Cta, fx, FxScreen, Pill, SearchBar } from "@/components/Futuristic";
import { stations as demoStations } from "@/data/experience";
import { useNearbyStations } from "@/features/useStations";
import { useStationFilters } from "@/store/stationFilters";
import { openGoogleMapsDirections } from "@/utils/maps";

export default function Home() {
  const { data, isLoading, isError, refetch, locationLabel, coords } = useNearbyStations();
  const filters = useStationFilters();
  const stations = useMemo(() => (data?.items?.length ? data.items : demoStations).slice(0, 12), [data?.items]);
  const [selectedId, setSelectedId] = useState(stations[0]?.id ?? demoStations[0].id);
  const selected = stations.find((station) => station.id === selectedId) ?? stations[0] ?? demoStations[0];

  return (
    <FxScreen scroll={false}>
      <View style={{ flex: 1 }}>
        <StationMap coords={coords} stations={stations} onSelect={(station) => setSelectedId(station.id)} />
        <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(242,247,252,0.16)" }} pointerEvents="none" />

        <View style={{ position: "absolute", top: 16, left: 16, right: 16, gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontSize: 29, lineHeight: 33, fontWeight: "900" }}>Find a charger</Text>
              <Text style={{ color: fx.muted, fontSize: 13, fontWeight: "800" }}>{locationLabel}</Text>
            </View>
            <CircleButton icon="menu-outline" label="Open menu" onPress={() => router.push("/menu")} />
            <CircleButton icon="notifications-outline" label="Notifications" onPress={() => router.push("/notifications")} />
          </View>

          <SearchBar onPress={() => router.push("/search")} placeholder="Search station or area..." />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
            <Pill label="Shubh EV Charging Points" icon="flash-outline" selected={filters.mode === "shubh"} onPress={() => filters.setMode("shubh")} tone="teal" />
            <Pill label="All Integrated Stations" icon="layers-outline" selected={filters.mode === "all"} onPress={() => filters.setMode("all")} />
            <Pill label="Available" selected={filters.availableOnly} onPress={filters.toggleAvailableOnly} />
            <Pill label={filters.connectorType} selected={filters.compatibleOnly} onPress={filters.toggleCompatibleOnly} />
            <Pill label="Filters" icon="options-outline" onPress={() => router.push("/filters")} />
          </ScrollView>

          <Pressable accessibilityRole="button" onPress={() => router.push("/charging/SP-DEMO-LIVE")} style={{ backgroundColor: fx.navy, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, shadowColor: fx.navy, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="flash" size={15} color={fx.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 13 }}>Charging - Live Session</Text>
              <Text style={{ color: "#dce6ff", fontSize: 11 }}>Shubh Power Hub - CP01 - 14.2 kWh - Rs 291</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Pressable>
        </View>

        <View style={{ position: "absolute", right: 16, bottom: 252, gap: 10 }}>
          <CircleButton icon="locate-outline" label="Recenter" onPress={() => void refetch()} />
          <CircleButton icon="options-outline" label="Filters" onPress={() => router.push("/filters")} />
        </View>

        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: 12, backgroundColor: "rgba(255,255,255,0.94)", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: fx.line }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: fx.line, alignSelf: "center", marginTop: 9, marginBottom: 12 }} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10 }}>
            <Text style={{ color: fx.ink, fontWeight: "900" }}>{isLoading ? "Refreshing stations" : `${stations.length} stations nearby`}</Text>
            <Text style={{ color: isError ? fx.amber : fx.faint, fontSize: 12, fontWeight: "800" }}>sorted by {filters.sortMode}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 4 }}>
            {stations.map((station) => {
              const active = selected.id === station.id;
              return (
                <Pressable key={station.id} accessibilityRole="button" onPress={() => setSelectedId(station.id)} style={{ width: 286, borderRadius: 18, borderWidth: active ? 2 : 1, borderColor: active ? fx.blue : fx.line, backgroundColor: "#fff", padding: 14, gap: 9, shadowColor: "#0b1b33", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={2} style={{ color: fx.ink, fontSize: 16, lineHeight: 20, fontWeight: "900" }}>{station.name}</Text>
                      <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "700" }}>{station.area || station.brand} - {station.distance_km?.toFixed(1) ?? "0.8"} km</Text>
                    </View>
                    <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>Rs {station.pricePerKwh ?? 18}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}>
                    {(station.connectorDetails?.slice(0, 2) ?? []).map((item) => <Pill key={item.id} label={item.type} selected />)}
                    <Pill label={station.availabilityLabel || "4 free"} tone="teal" selected />
                  </View>
                  <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Cta label="View details" icon="chevron-forward" onPress={() => router.push(`/station/${station.id}`)} />
                    </View>
                    <Pressable accessibilityRole="button" onPress={() => void openGoogleMapsDirections(station)} style={{ width: 52, height: 52, borderRadius: 16, borderWidth: 1, borderColor: fx.blue, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="navigate-outline" size={22} color={fx.blue} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </FxScreen>
  );
}
