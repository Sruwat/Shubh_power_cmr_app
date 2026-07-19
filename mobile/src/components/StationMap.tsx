import { Pressable, View } from "react-native";
import { Station } from "@/api/client";
import { colors } from "@/design-system/tokens";

export function StationMap({ stations, onSelect }: { coords: { latitude: number; longitude: number }; stations: Station[]; onSelect: (station: Station) => void }) {
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
    </View>
  );
}

function FakeMarker({ color }: { color: string }) {
  return <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: color, borderWidth: 4, borderColor: "#fff" }} />;
}
