import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import { Image, Pressable, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { Station, customerStationStatus } from "@/api/client";
import { fx } from "@/components/Futuristic";
import shubhMark from "../../assets/shubh-power-mark.png";

export function StationMap({
  coords,
  stations,
  onSelect,
  onLocate,
  onOpenFilters
}: {
  coords: { latitude: number; longitude: number };
  stations: Station[];
  onSelect: (station: Station) => void;
  onLocate?: () => void;
  onOpenFilters?: () => void;
}) {
  const mapRef = useRef<MapView | null>(null);
  const region = useMemo<Region>(
    () => ({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.11,
      longitudeDelta: 0.11
    }),
    [coords.latitude, coords.longitude]
  );

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 260);
  }, [region]);

  const visibleStations = stations.slice(0, 9);

  return (
    <View style={{ flex: 1, backgroundColor: "#dff1f5", overflow: "hidden" }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={region}
        customMapStyle={mapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
      >
        <Marker coordinate={coords} title="You are here" description="Live location">
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(35,196,181,0.24)", alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: fx.teal, borderWidth: 3, borderColor: "#fff" }} />
          </View>
        </Marker>

        {visibleStations.map((station, index) => {
          const status = customerStationStatus(station);
          const markerMeta = brandMarker(station, index);
          return (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.coordinates.latitude,
                longitude: station.coordinates.longitude
              }}
              title={station.name}
              description={status.label}
              onPress={() => onSelect(station)}
            >
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: markerMeta.indexColor, alignItems: "center", justifyContent: "center", marginBottom: -2, zIndex: 2, borderWidth: 2, borderColor: "#fff" }}>
                  <Text style={{ color: "#fff", fontSize: 9, lineHeight: 9, fontWeight: "900" }}>{markerMeta.rank}</Text>
                </View>
                <View style={{ minWidth: 44, height: 44, borderRadius: 22, backgroundColor: markerMeta.color, alignItems: "center", justifyContent: "center", shadowColor: fx.navy, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4, borderWidth: 3, borderColor: "#fff" }}>
                  {markerMeta.logoUri ? (
                    <Image
                      source={markerMeta.logoUri === "local" ? shubhMark : { uri: markerMeta.logoUri }}
                      resizeMode="contain"
                      style={{ width: markerMeta.logoUri === "local" ? 18 : 24, height: markerMeta.logoUri === "local" ? 18 : 24 }}
                    />
                  ) : (
                    <Text style={{ color: "#fff", fontSize: markerMeta.textSize, fontWeight: "900" }}>{markerMeta.label}</Text>
                  )}
                </View>
                <View style={{ marginTop: 3, maxWidth: 64, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#dce8f5" }}>
                  <Text numberOfLines={1} style={{ color: fx.ink, fontSize: 7, fontWeight: "900", textAlign: "center" }}>
                    {markerMeta.tag}
                  </Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View pointerEvents="none" style={{ position: "absolute", left: 14, top: 14, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#dce8f5" }}>
        <Text style={{ color: fx.ink, fontSize: 12, fontWeight: "900" }}>{stations.length} verified locations</Text>
        <Text style={{ color: fx.muted, fontSize: 11, fontWeight: "700" }}>Demo availability</Text>
      </View>

      <View style={{ position: "absolute", right: 14, top: 20, gap: 10 }}>
        <RoundIcon icon="locate" onPress={onLocate} label="Center map" />
        <RoundIcon icon="options" onPress={onOpenFilters} label="Open filters" />
      </View>
    </View>
  );
}

function RoundIcon({ icon, onPress, label }: { icon: keyof typeof Ionicons.glyphMap; onPress?: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: "#dce8f5", alignItems: "center", justifyContent: "center", shadowColor: "#0b1b33", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}
    >
      <Ionicons name={icon} size={20} color={fx.blue} />
    </Pressable>
  );
}

function brandMarker(station: Station, index: number) {
  const brand = `${station.brand ?? station.name ?? ""}`.toLowerCase();
  if (/shubh/.test(brand)) return { label: "SP", tag: "Shubh Power", color: fx.teal, indexColor: "#13a45a", rank: "S", textSize: 14, logoUri: "local" as const };
  if (/tata/.test(brand)) return { label: "T", tag: "Tata Power", color: "#1862cf", indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 16, logoUri: "https://logo.clearbit.com/tatapower.com" };
  if (/statiq/.test(brand)) return { label: "S", tag: "Statiq", color: "#7a4df0", indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 16, logoUri: "https://logo.clearbit.com/statiq.in" };
  if (/jio-bp|jio bp|jio/.test(brand)) return { label: "J", tag: "Jio-bp", color: "#10a8ff", indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 16, logoUri: "https://logo.clearbit.com/jiobp.com" };
  if (/adani/.test(brand)) return { label: "A", tag: "Adani", color: "#f24d6b", indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 16, logoUri: "https://logo.clearbit.com/adani.com" };
  if (/eesl/.test(brand)) return { label: "E", tag: "EESL", color: "#1a68d8", indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 16, logoUri: "https://logo.clearbit.com/eeslindia.org" };
  if (/sun/.test(brand)) return { label: "U", tag: "SUN Mobility", color: "#ff9a1f", indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 16, logoUri: "https://logo.clearbit.com/sunmobility.com" };
  return { label: "Rs", tag: station.name ?? "Station", color: fx.violet, indexColor: "#18a75a", rank: String((index % 5) + 1), textSize: 13 };
}

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f4f5f2" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6c7380" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f4f5f2" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#eadfcb" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbeaf8" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] }
];
