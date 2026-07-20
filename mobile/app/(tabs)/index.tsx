import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { StationMap } from "@/components/StationMap";
import { CircleButton, Cta, fx, FxScreen, HeaderLogoBadge, Pill, SearchBar } from "@/components/Futuristic";
import { stations as demoStations } from "@/data/experience";
import { useNearbyStations } from "@/features/useStations";
import { useStationFilters } from "@/store/stationFilters";
import { openGoogleMapsDirections } from "@/utils/maps";

export default function Home() {
  const { data, isLoading, isError, refetch, locationLabel, coords } = useNearbyStations();
  const filters = useStationFilters();
  const stations = useMemo(() => (data?.items?.length ? data.items : demoStations.filter((station) => stationMatchesMode(station, filters.mode))).slice(0, 12), [data?.items, filters.mode]);
  const [selectedId, setSelectedId] = useState(stations[0]?.id ?? demoStations[0].id);
  const selected = stations.find((station) => station.id === selectedId) ?? stations[0] ?? demoStations[0];

  return (
    <FxScreen scroll={false}>
      <View style={{ flex: 1 }}>
        <StationMap coords={coords} stations={stations} onSelect={(station) => setSelectedId(station.id)} />
        <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(242,247,252,0.16)" }} pointerEvents="none" />

        <View style={{ position: "absolute", top: 12, left: 16, right: 16, gap: 10, borderTopWidth: 2, borderTopColor: "rgba(89,210,254,0.56)", borderRadius: 18, paddingTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontSize: 29, lineHeight: 33, fontWeight: "900" }}>Find a charger</Text>
              <Text style={{ color: fx.muted, fontSize: 13, fontWeight: "800" }}>{locationLabel}</Text>
            </View>
            <HeaderLogoBadge compact />
            <CircleButton icon="menu-outline" label="Open menu" onPress={() => router.push("/menu")} />
            <CircleButton icon="notifications-outline" label="Notifications" onPress={() => router.push("/notifications")} />
          </View>

          <SearchBar onPress={() => router.push("/search")} rightOnPress={() => router.push("/filters")} placeholder="Search station or area..." />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
            <ModePill label="All EV" icon="layers-outline" selected={filters.mode === "all"} onPress={() => filters.setMode("all")} />
            <ModePill label="Shubh Power" icon="flash-outline" selected={filters.mode === "shubh"} onPress={() => filters.setMode("shubh")} />
            <ModePill label="Private Charging Hub" icon="business-outline" selected={filters.mode === "private"} onPress={() => filters.setMode("private")} />
            <Pill label="Available" selected={filters.availableOnly} onPress={filters.toggleAvailableOnly} />
            <Pill label={filters.connectorType} selected={filters.compatibleOnly} onPress={filters.toggleCompatibleOnly} />
            <Pill label="Filters" icon="options-outline" onPress={() => router.push("/filters")} />
          </ScrollView>
        </View>

        <View style={{ position: "absolute", right: 16, bottom: 252, gap: 10 }}>
          <CircleButton icon="locate-outline" label="Recenter" onPress={() => void refetch()} />
          <CircleButton icon="options-outline" label="Filters" onPress={() => router.push("/filters")} />
        </View>

        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: 12, backgroundColor: "#08223f", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(89,210,254,0.35)" }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.24)", alignSelf: "center", marginTop: 9, marginBottom: 12 }} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10 }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>{isLoading ? "Refreshing stations" : `${stations.length} stations nearby`}</Text>
            <Text style={{ color: isError ? fx.amber : "#9bdfff", fontSize: 12, fontWeight: "800" }}>sorted by {filters.sortMode}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 4 }}>
            {stations.map((station) => {
              const active = selected.id === station.id;
              const isShubh = station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`);
              return (
                <Pressable key={station.id} accessibilityRole="button" onPress={() => setSelectedId(station.id)} style={{ width: 286, borderRadius: 18, borderWidth: active ? 2 : 1, borderColor: active ? fx.sky : "rgba(255,255,255,0.16)", backgroundColor: active ? "#f7fdff" : "#ffffff", padding: 14, gap: 9, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        {isShubh ? <Image source={require("../../assets/shubh-power-mark.png")} resizeMode="contain" style={{ width: 22, height: 22 }} /> : null}
                        <Text numberOfLines={2} style={{ color: fx.ink, fontSize: 16, lineHeight: 20, fontWeight: "900", flex: 1 }}>{station.name}</Text>
                      </View>
                      <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "700" }}>{station.area || station.brand} - {station.distance_km?.toFixed(1) ?? "0.8"} km</Text>
                      {station.societyName ? <Text style={{ color: fx.teal, fontSize: 11, fontWeight: "900" }}>{station.societyName}</Text> : null}
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

function stationMatchesMode(station: { stationCategory?: string; isPrivateHub?: boolean; isShubhHub?: boolean; societyName?: string; brand?: string; name?: string }, mode: "shubh" | "all" | "private") {
  if (mode === "all") return true;
  if (mode === "private") return station.stationCategory === "private" || station.isPrivateHub || Boolean(station.societyName);
  return station.stationCategory === "shubh" || station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`);
}

function ModePill({ label, icon, selected, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ minHeight: 40, borderRadius: 20, borderWidth: 1, borderColor: selected ? fx.navy : "rgba(22,143,226,0.32)", backgroundColor: selected ? fx.navy : "rgba(255,255,255,0.92)", paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 7 }}>
      <Ionicons name={icon} size={16} color={selected ? "#fff" : fx.teal} />
      <Text style={{ color: selected ? "#fff" : fx.muted, fontSize: 13, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}
