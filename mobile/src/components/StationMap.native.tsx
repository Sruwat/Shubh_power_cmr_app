import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Image, Pressable, Text, View, ViewStyle } from "react-native";
import { Station, customerStationStatus } from "@/api/client";
import { fx } from "@/components/Futuristic";

export function StationMap({ coords, stations, onSelect }: { coords: { latitude: number; longitude: number }; stations: Station[]; onSelect: (station: Station) => void }) {
  const safeStations = stations.slice(0, 9);
  return (
    <View style={{ flex: 1, backgroundColor: "#e7f2fb", overflow: "hidden" }}>
      <GridMapBackdrop />
      <View style={{ position: "absolute", left: "48%", top: "43%" }}>
        <LiveLocationMarker />
      </View>
      {safeStations.map((station, index) => {
        const position = stationPosition(station, coords, index);
        const isShubh = station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`);
        const isPrivate = station.stationCategory === "private" || station.isPrivateHub;
        return (
          <Pressable
            key={station.id}
            accessibilityRole="button"
            accessibilityLabel={`${station.name}, ${customerStationStatus(station).label}`}
            onPress={() => onSelect(station)}
            style={{ position: "absolute", left: `${position.left}%`, top: `${position.top}%`, alignItems: "center" }}
          >
            <View style={{ minWidth: 82, paddingHorizontal: 8, height: 30, borderRadius: 15, backgroundColor: isPrivate ? fx.navy : isShubh ? fx.teal : fx.blue, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 4, shadowColor: fx.navy, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 }}>
              {isShubh ? <Image source={require("../../assets/shubh-power-mark.png")} resizeMode="contain" style={{ width: 16, height: 16 }} /> : null}
              <Text numberOfLines={1} style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Rs {station.pricePerKwh ?? 18} - {station.availabilityLabel || "free"}</Text>
            </View>
            <View style={{ marginTop: 3, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: "#fff", backgroundColor: isPrivate ? fx.navy : isShubh ? fx.teal : fx.blue }} />
          </Pressable>
        );
      })}
      <Text style={{ position: "absolute", right: 10, bottom: 8, color: "rgba(22,22,63,0.56)", fontSize: 10, fontWeight: "800" }}>© OpenStreetMap contributors</Text>
    </View>
  );
}

function GridMapBackdrop() {
  const blocks: ViewStyle[] = [
    { left: "6%", top: "8%", width: "26%", height: "16%" },
    { left: "42%", top: "5%", width: "22%", height: "18%" },
    { left: "72%", top: "11%", width: "22%", height: "14%" },
    { left: "10%", top: "35%", width: "22%", height: "16%" },
    { left: "48%", top: "33%", width: "30%", height: "18%" },
    { left: "80%", top: "42%", width: "18%", height: "13%" },
    { left: "3%", top: "66%", width: "28%", height: "16%" },
    { left: "43%", top: "68%", width: "25%", height: "14%" },
    { left: "74%", top: "70%", width: "23%", height: "12%" }
  ];
  return (
    <View style={{ position: "absolute", inset: 0 }}>
      {[14, 31, 52, 72, 88].map((left) => <View key={`v-${left}`} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(176,207,230,0.65)" }} />)}
      {[17, 38, 58, 78].map((top) => <View key={`h-${top}`} style={{ position: "absolute", top: `${top}%`, left: 0, right: 0, height: 2, backgroundColor: "rgba(176,207,230,0.65)" }} />)}
      <View style={{ position: "absolute", left: "34%", top: "-8%", width: 22, height: "116%", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.86)", transform: [{ rotate: "4deg" }] }} />
      <View style={{ position: "absolute", left: "-4%", top: "48%", width: "108%", height: 20, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.86)", transform: [{ rotate: "-3deg" }] }} />
      <View style={{ position: "absolute", right: "22%", top: "0%", width: 20, height: "100%", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.86)", transform: [{ rotate: "2deg" }] }} />
      {blocks.map((block, index) => <View key={index} style={{ position: "absolute", borderRadius: 8, backgroundColor: "rgba(194,215,232,0.6)", ...block }} />)}
      <Text style={{ position: "absolute", left: "34%", top: "45%", color: "#98b1c8", fontSize: 13, fontWeight: "900" }}>NH-9 Noida Expressway</Text>
      <Text style={{ position: "absolute", left: "44%", top: "64%", color: "#98b1c8", fontSize: 12, fontWeight: "800" }}>Ring Road</Text>
    </View>
  );
}

function stationPosition(station: Station, coords: { latitude: number; longitude: number }, index: number) {
  const fallback = [
    { left: 12, top: 55 },
    { left: 62, top: 27 },
    { left: 77, top: 62 },
    { left: 20, top: 31 },
    { left: 52, top: 52 },
    { left: 83, top: 18 },
    { left: 38, top: 72 },
    { left: 8, top: 20 },
    { left: 69, top: 78 }
  ][index % 9];
  const latDelta = station.coordinates.latitude - coords.latitude;
  const lonDelta = station.coordinates.longitude - coords.longitude;
  if (!Number.isFinite(latDelta) || !Number.isFinite(lonDelta)) return fallback;
  return {
    left: clamp(49 + lonDelta * 260, 7, 82),
    top: clamp(44 - latDelta * 260, 13, 78)
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function LiveLocationMarker() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true })
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={{ width: 68, height: 68, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: "rgba(22,143,226,0.2)",
          opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.08] }),
          transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.15] }) }]
        }}
      />
      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: fx.blue, shadowOpacity: 0.42, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 6 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: fx.blue, borderWidth: 3, borderColor: "#bfe7ff" }} />
      </View>
    </View>
  );
}
