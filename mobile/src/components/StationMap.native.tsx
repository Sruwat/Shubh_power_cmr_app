import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Station, customerStationStatus } from "@/api/client";
import { fx } from "@/components/Futuristic";

export function StationMap({ coords, stations, onSelect }: { coords: { latitude: number; longitude: number }; stations: Station[]; onSelect: (station: Station) => void }) {
  return (
    <MapView style={{ flex: 1 }} initialRegion={{ ...coords, latitudeDelta: 0.12, longitudeDelta: 0.12 }} region={{ ...coords, latitudeDelta: 0.12, longitudeDelta: 0.12 }} mapType="standard" showsCompass={false} showsMyLocationButton={false} toolbarEnabled={false}>
      <Marker coordinate={coords} title="Your live location" description="Blinking marker follows your phone location" tracksViewChanges>
        <LiveLocationMarker />
      </Marker>
      {stations.map((station) => (
        <Marker
          key={station.id}
          coordinate={station.coordinates}
          title={station.name}
          description={customerStationStatus(station).label}
          onPress={() => onSelect(station)}
          tracksViewChanges={false}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: station.brand.toLowerCase().includes("subh") ? "rgba(35,196,181,0.22)" : "rgba(22,143,226,0.16)", alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: station.demo_charging_enabled ? fx.teal : fx.blue, borderWidth: 3, borderColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: fx.navy, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 }}>
                <Ionicons name="flash" size={14} color="#fff" />
              </View>
            </View>
          </View>
        </Marker>
      ))}
    </MapView>
  );
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
