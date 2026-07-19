import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, Cta, fx, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { useStationFilters } from "@/store/stationFilters";

const connectors = ["CCS2", "Type 2", "CHAdeMO", "Bharat AC001", "Bharat DC001", "15A Socket"];
const ratings = ["3+", "3.5+", "4+", "4.5+"];

export default function Filters() {
  const filters = useStationFilters();
  return (
    <FxScreen>
      <BackHeader title="Filters" onBack={() => router.back()} />
      <FxCard>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: fx.ink, fontWeight: "900" }}>Max Distance</Text><Text style={{ color: fx.blue, fontWeight: "900" }}>{filters.radiusKm} km</Text></View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{[5, 8, 15, 30].map((km) => <Pill key={km} label={`${km} km`} selected={filters.radiusKm === km} onPress={() => filters.setRadiusKm(km)} />)}</View>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Station Network</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Pill label="Shubh EV Charging Points" selected={filters.mode === "shubh"} tone="teal" onPress={() => filters.setMode("shubh")} />
          <Pill label="All Integrated Stations" selected={filters.mode === "all"} onPress={() => filters.setMode("all")} />
        </View>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Availability</Text>
        <Pill label="Available Now" selected={filters.availableOnly} onPress={filters.toggleAvailableOnly} />
        <Pill label={`Compatible with My Car - Tata Nexon EV (${filters.connectorType})`} selected={filters.compatibleOnly} tone="teal" onPress={filters.toggleCompatibleOnly} />
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Connector Type</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{connectors.map((item) => <Pill key={item} label={item} selected={filters.connectorType === item} onPress={() => filters.setConnectorType(item)} />)}</View>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Minimum Rating</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>{ratings.map((item) => <View key={item} style={{ flex: 1 }}><Pill label={item} selected={`${filters.minRating}+` === item} onPress={() => filters.setMinRating(Number(item.replace("+", "")))} /></View>)}</View>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Sort By</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["distance", "availability", "price", "rating", "speed"] as const).map((item) => <Pill key={item} label={item[0].toUpperCase() + item.slice(1)} selected={filters.sortMode === item} onPress={() => filters.setSortMode(item)} />)}
        </View>
      </FxCard>
      <Cta label="Apply Filters" onPress={() => router.replace("/(tabs)")} />
    </FxScreen>
  );
}
