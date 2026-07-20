import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Station, distanceLabel } from "@/api/client";
import { StationMap } from "@/components/StationMap";
import { CircleButton, Cta, fx, Pill, SearchBar } from "@/components/Futuristic";
import { stations as demoStations } from "@/data/experience";
import { useNearbyStations } from "@/features/useStations";
import { openGoogleMapsDirections } from "@/utils/maps";

export default function MapScreen() {
  const { data, coords, filters } = useNearbyStations();
  const stations = useMemo(() => (data?.items?.length ? data.items : demoStations.filter((station) => stationMatchesMode(station, filters.mode))).slice(0, 40), [data?.items, filters.mode]);
  const [selected, setSelected] = useState<Station | null>(stations[0] ?? null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!selected && stations.length > 0) setSelected(stations[0]);
  }, [selected, stations]);

  return (
    <View style={{ flex: 1, backgroundColor: fx.bg }}>
      <StationMap coords={coords} stations={stations} onSelect={setSelected} />

      <View style={{ position: "absolute", top: 18, left: 16, right: 16, gap: 10 }}>
        <SearchBar placeholder="Search this area" onPress={() => router.push("/search")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
          <Pill label="Map" icon="map-outline" selected={!showList} onPress={() => setShowList(false)} />
          <Pill label="List" icon="list-outline" selected={showList} onPress={() => setShowList(true)} />
          <ModePill label="All EV" icon="layers-outline" selected={filters.mode === "all"} onPress={() => filters.setMode("all")} />
          <ModePill label="Shubh Power" icon="flash-outline" selected={filters.mode === "shubh"} onPress={() => filters.setMode("shubh")} />
          <ModePill label="Private Hub" icon="business-outline" selected={filters.mode === "private"} onPress={() => filters.setMode("private")} />
          <Pill label="Fast DC" icon="flash-outline" selected={filters.minPowerKw >= 25} />
          <Pill label={filters.connectorType} selected={filters.compatibleOnly} onPress={filters.toggleCompatibleOnly} />
          <Pill label="Filters" icon="options-outline" onPress={() => router.push("/filters")} />
        </ScrollView>
        <Pressable accessibilityRole="button" onPress={() => router.push("/charging/SP-DEMO-LIVE")} style={{ backgroundColor: fx.navy, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="warning" size={13} color="#c7d2fe" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 13 }}>Charging - Live Session</Text>
            <Text style={{ color: "#dce6ff", fontSize: 11 }}>Shubh Power Hub - CP01 - 14.2 kWh - Rs 291</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={{ position: "absolute", right: 16, bottom: selected ? 255 : 112, gap: 10 }}>
        <CircleButton icon="locate-outline" label="Recenter" onPress={() => setSelected(stations[0] ?? null)} />
        <CircleButton icon="layers-outline" label="Layers" onPress={() => setShowList((value) => !value)} />
      </View>

      {showList ? (
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: 360, backgroundColor: "#08223f", borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 16, gap: 10, borderWidth: 1, borderColor: "rgba(89,210,254,0.35)" }}>
          <View style={{ width: 42, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.24)", alignSelf: "center" }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>{stations.length} stations nearby</Text>
            <Pressable onPress={() => setShowList(false)}><Text style={{ color: fx.blue, fontWeight: "900" }}>Map view</Text></Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {stations.slice(0, 5).map((station) => (
              <Pressable key={station.id} onPress={() => { setSelected(station); setShowList(false); }} style={{ width: 230, borderRadius: 16, borderWidth: 1, borderColor: "rgba(89,210,254,0.35)", backgroundColor: "#fff", padding: 14, gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}>
                    {station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`) ? <Image source={require("../../assets/shubh-power-mark.png")} resizeMode="contain" style={{ width: 20, height: 20 }} /> : null}
                    <Text numberOfLines={2} style={{ color: fx.ink, fontWeight: "900", flex: 1 }}>{station.name}</Text>
                  </View>
                  <Text style={{ color: fx.blue, fontWeight: "900" }}>Rs {station.pricePerKwh ?? 18}</Text>
                </View>
                <Text style={{ color: fx.muted, fontSize: 12 }}>{station.area || station.brand}</Text>
                <View style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}>
                  {(station.connectorDetails?.slice(0, 2) ?? []).map((item) => <Pill key={item.id} label={item.type} selected />)}
                  <Pill label={station.availabilityLabel || "4 free"} tone="teal" selected />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : selected ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 18, backgroundColor: "#fff", borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: fx.sky }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontSize: 20, lineHeight: 24, fontWeight: "900" }} numberOfLines={2}>{selected.name}</Text>
              <Text style={{ color: fx.muted, fontWeight: "800" }}>{selected.brand} - {distanceLabel(selected)}</Text>
            </View>
            <View style={{ borderRadius: 999, borderWidth: 1, borderColor: fx.teal, backgroundColor: `${fx.teal}13`, paddingHorizontal: 10, paddingVertical: 7, alignSelf: "flex-start" }}>
              <Text style={{ color: fx.teal, fontWeight: "900", fontSize: 12 }}>{selected.availabilityLabel || "Charging available"}</Text>
            </View>
          </View>
          <Text style={{ color: fx.ink, fontWeight: "900" }}>Connector details updating - Tariff updates at station</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Cta label="Details" onPress={() => router.push(`/station/${selected.id}`)} />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Open maps" onPress={() => void openGoogleMapsDirections(selected)} style={{ width: 58, height: 52, borderRadius: 15, borderWidth: 1, borderColor: fx.blue, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="navigate-outline" size={24} color={fx.blue} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function stationMatchesMode(station: { stationCategory?: string; isPrivateHub?: boolean; isShubhHub?: boolean; societyName?: string; brand?: string; name?: string }, mode: "shubh" | "all" | "private") {
  if (mode === "all") return true;
  if (mode === "private") return station.stationCategory === "private" || station.isPrivateHub || Boolean(station.societyName);
  return station.stationCategory === "shubh" || station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`);
}

function ModePill({ label, icon, selected, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ minHeight: 36, borderRadius: 18, borderWidth: 1, borderColor: selected ? fx.navy : "rgba(22,143,226,0.32)", backgroundColor: selected ? fx.navy : "rgba(255,255,255,0.92)", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Ionicons name={icon} size={15} color={selected ? "#fff" : fx.teal} />
      <Text style={{ color: selected ? "#fff" : fx.muted, fontSize: 13, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}
