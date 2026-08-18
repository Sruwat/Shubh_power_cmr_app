import { Pressable, Text, View } from "react-native";
import { Station } from "@/api/client";
import { colors } from "@/design-system/tokens";

export function StationMap({
  selectedStationId,
  stations,
  onSelect,
  onLocate,
  onOpenFilters
}: {
  coords: { latitude: number; longitude: number };
  stations: Station[];
  selectedStationId?: string;
  onSelect: (station: Station) => void;
  onLocate?: () => void;
  onOpenFilters?: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: "#dff1f5", overflow: "hidden" }}>
      <View style={{ position: "absolute", left: -40, right: -40, top: 180, height: 22, backgroundColor: "#9db4c7", transform: [{ rotate: "-18deg" }] }} />
      <View style={{ position: "absolute", left: 70, right: 20, top: 350, height: 18, backgroundColor: "#b8c7d3", transform: [{ rotate: "22deg" }] }} />
      <View style={{ position: "absolute", left: 35, top: 170 }}><FakeMarker color={colors.primary} /></View>
      {stations.slice(0, 8).map((station, index) => (
        <Pressable key={station.id} onPress={() => onSelect(station)} style={{ position: "absolute", left: 80 + (index % 3) * 82, top: 230 + Math.floor(index / 3) * 78 }}>
          <FakeMarker color={station.demo_charging_enabled ? colors.secondary : colors.unknown} />
        </Pressable>
      ))}
      <View style={{ position: "absolute", right: 12, top: 16, gap: 10 }}>
        <MapButton label="Center" onPress={onLocate} />
        <MapButton label="Filters" onPress={onOpenFilters} />
      </View>
    </View>
  );
}

function MapButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: "#dce8f5", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.primary, fontSize: 10, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}

function FakeMarker({ color }: { color: string }) {
  return <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: color, borderWidth: 4, borderColor: "#fff" }} />;
}
