import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { BackHeader, fx, FxCard, FxScreen, ListRow, Pill } from "@/components/Futuristic";
import { StationCard } from "@/components/StationCard";
import { stations } from "@/data/experience";
import { useStationFilters } from "@/store/stationFilters";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const filters = useStationFilters();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stations
      .filter((station) => {
        if (filters.mode === "all") return true;
        if (filters.mode === "private") return station.stationCategory === "private" || station.isPrivateHub || Boolean(station.societyName);
        return station.stationCategory === "shubh" || station.isShubhHub || station.brand.toLowerCase().includes("shubh") || station.name.toLowerCase().includes("shubh");
      })
      .filter((station) => !filters.compatibleOnly || station.connector_summary.join(" ").toLowerCase().includes(filters.connectorType.toLowerCase()))
      .filter((station) => !filters.availableOnly || !station.availabilityLabel.toLowerCase().includes("busy"))
      .filter((station) => !q || `${station.name} ${station.area} ${station.brand} ${station.societyName ?? ""}`.toLowerCase().includes(q));
  }, [filters.availableOnly, filters.compatibleOnly, filters.connectorType, filters.mode, query]);

  return (
    <FxScreen>
      <BackHeader title="Search" onBack={() => router.back()} />
      <View style={{ minHeight: 54, borderRadius: 15, borderWidth: 1, borderColor: fx.blue, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingHorizontal: 13, gap: 10 }}>
        <Ionicons name="search-outline" size={19} color={fx.faint} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search station, address, area..." placeholderTextColor={fx.faint} autoFocus style={{ flex: 1, color: fx.ink, fontWeight: "800" }} />
      </View>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>RECENT SEARCHES</Text>
      <FxCard>
        {["Sector 62, Noida", "DLF Mall, Noida", "Cyber Hub, Gurugram"].map((item) => <ListRow key={item} icon="time-outline" title={item} onPress={() => setQuery(item)} />)}
      </FxCard>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>ALL NEARBY STATIONS</Text>
      <View style={{ flexDirection: "row", gap: 9, flexWrap: "wrap" }}>
        <Pill label="Shubh only" selected={filters.mode === "shubh"} tone="teal" onPress={() => filters.setMode("shubh")} />
        <Pill label="All stations" selected={filters.mode === "all"} onPress={() => filters.setMode("all")} />
        <Pill label="Private hubs" selected={filters.mode === "private"} tone="violet" onPress={() => filters.setMode("private")} />
        <Pill label={filters.connectorType} selected={filters.compatibleOnly} onPress={filters.toggleCompatibleOnly} />
        <Pill label="Available" selected={filters.availableOnly} onPress={filters.toggleAvailableOnly} />
      </View>
      {results.map((station) => <StationCard key={station.id} station={station} compact />)}
      {results.length === 0 ? <Text style={{ color: fx.muted, textAlign: "center" }}>No station matched this search.</Text> : null}
      <View style={{ flexDirection: "row", gap: 9, flexWrap: "wrap" }}>
        <Pill label="Filters" icon="options-outline" onPress={() => router.push("/filters")} />
        <Pill label="Sort by distance" icon="swap-vertical-outline" />
      </View>
    </FxScreen>
  );
}
