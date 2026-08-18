import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StationMap } from "@/components/StationMap";
import { fx, FxScreen } from "@/components/Futuristic";
import { stations as demoStations } from "@/data/experience";
import { useNearbyStations } from "@/features/useStations";
import { useStationFilters } from "@/store/stationFilters";
import { TopChromeBar } from "@/components/ShubhShell";

export default function MapScreen() {
  const { data } = useNearbyStations();
  const filters = useStationFilters();
  const referenceStationName = "Statiq MLCP Noida Sec-18 Charging Hub";
  const referenceStationMeta = "Near DLF Mall of India, Sector 18, Noida · 1.2 km";
  const displayCoords = { latitude: 28.567, longitude: 77.321 };
  const stations = useMemo(() => (data?.items?.length ? data.items : demoStations.filter((station) => stationMatchesMode(station, filters.mode))).slice(0, 15), [data?.items, filters.mode]);
  const [selectedId, setSelectedId] = useState(stations[0]?.id ?? demoStations[0].id);
  const featured = stations.find((station) => station.id === selectedId) ?? stations[0] ?? demoStations[0];

  return (
    <FxScreen scroll={false} style={{ backgroundColor: "#f7f9fd" }}>
      <View style={{ flex: 1 }}>
        <TopChromeBar title="15 stations around Noida" subtitle="" showBack={true} />

        <View style={styles.searchRow}>
          <Pressable accessibilityRole="button" onPress={() => router.push("/search")} style={styles.searchMain}>
            <Ionicons name="search-outline" size={19} color="#8d99ab" />
            <Text style={styles.searchText}>Search this area</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Open filters" onPress={() => router.push("/filters")} style={styles.searchFilterButton}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.mapWrap}>
          <StationMap
            coords={displayCoords}
            stations={stations}
            onSelect={(station) => setSelectedId(station.id)}
            onLocate={() => setSelectedId(stations[0]?.id ?? demoStations[0].id)}
            onOpenFilters={() => router.push("/filters")}
          />

          <View style={styles.stationCardWrap}>
            <Pressable accessibilityRole="button" onPress={() => router.push(`/station/${featured.id}`)} style={styles.stationCard}>
              <View style={styles.stationBadge}>
                <Text style={styles.stationBadgeText}>S</Text>
              </View>
              <View style={{ flex: 1, gap: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text numberOfLines={1} style={styles.stationName}>{referenceStationName}</Text>
                </View>
                <Text numberOfLines={1} style={styles.stationMeta}>{referenceStationMeta}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={styles.metaPill}>
                    <Ionicons name="flash-outline" size={12} color="#2b3444" />
                    <Text style={styles.metaPillText}>60 kW</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaPillText}>₹18.25/kWh</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={styles.chargeSurePill}>
                    <Text style={styles.chargeSureText}>96 ChargeSure</Text>
                  </View>
                  <View style={styles.stationArrow}>
                    <Ionicons name="chevron-forward" size={20} color="#146ddf" />
                  </View>
                </View>
                <View style={styles.stationStatsRow}>
                  <StatItem icon="checkmark-circle-outline" label="4/6 available" selected />
                </View>
              </View>
            </Pressable>
          </View>
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

function StatItem({ icon, label, selected = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; selected?: boolean }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={13} color={selected ? "#17a95a" : "#2d3444"} />
      <Text style={[styles.statItemText, selected && { color: "#17a95a" }]}>{label}</Text>
    </View>
  );
}

const styles = {
  searchRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  searchMain: {
    flex: 1,
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#d6e1ec",
    backgroundColor: "#fff",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingHorizontal: 14
  },
  searchText: {
    color: "#6f7b8d",
    fontSize: 13,
    fontWeight: "500" as const
  },
  searchFilterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: fx.blue,
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  mapWrap: {
    flex: 1,
    marginTop: 4,
    marginHorizontal: 0,
    position: "relative" as const
  },
  stationCardWrap: {
    position: "absolute" as const,
    left: 12,
    right: 12,
    bottom: 10
  },
  stationCard: {
    minHeight: 102,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dde6ef",
    padding: 12,
    flexDirection: "row" as const,
    gap: 10,
    shadowColor: "#0b1b33",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  stationBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#7a4df0",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  stationBadgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900" as const
  },
  stationName: {
    color: fx.ink,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "900" as const
  },
  stationMeta: {
    color: "#8c96a9",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700" as const
  },
  metaPill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4
  },
  metaPillText: {
    color: "#2b3444",
    fontSize: 11,
    fontWeight: "700" as const
  },
  chargeSurePill: {
    backgroundColor: "#e6fbef",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start" as const,
    marginTop: 1
  },
  chargeSureText: {
    color: "#11a85b",
    fontSize: 10,
    fontWeight: "900" as const
  },
  stationArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef6ff",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  stationStatsRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
    flexWrap: "wrap" as const
  },
  statItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4
  },
  statItemText: {
    color: "#2b3444",
    fontSize: 11,
    fontWeight: "700" as const
  }
};
