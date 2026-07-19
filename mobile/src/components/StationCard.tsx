import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import { customerStationStatus, distanceLabel, Station } from "@/api/client";
import { fx } from "@/components/Futuristic";

export function StationCard({ station, compact = false }: { station: Station; compact?: boolean }) {
  const connectors = [...new Set(station.connectorDetails?.map((item) => item.type) ?? ["CCS2"])].slice(0, 3);
  const isBusy = (station.availabilityLabel || "").toLowerCase().includes("busy") || (station.availabilityLabel || "").toLowerCase().includes("full");
  const status = customerStationStatus(station);
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push(`/station/${station.id}`)} style={{ backgroundColor: fx.card, borderRadius: 16, borderWidth: 1, borderColor: fx.line, padding: 16, gap: 10, shadowColor: "#0b1b33", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={{ color: fx.ink, fontSize: 17, lineHeight: 21, fontWeight: "900" }} numberOfLines={2}>{station.name}</Text>
          <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "700" }} numberOfLines={1}>{station.area || station.brand}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 3 }}>
          <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>Rs {station.pricePerKwh ?? 18}<Text style={{ fontSize: 11, color: fx.muted }}>/kWh</Text></Text>
          <Text style={{ color: fx.blue, fontSize: 12, fontWeight: "900" }}>{distanceLabel(station)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
        {connectors.map((connector, index) => <Pill key={connector} label={connector} tone={index === 1 ? "violet" : index === 2 ? "teal" : "blue"} />)}
        <Pill label={station.powerLabel || "50 kW DC"} tone="neutral" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Meta color={isBusy ? fx.red : fx.teal} icon={isBusy ? "close-circle" : "flash"} label={station.availabilityLabel || "4/8 free"} />
        <Meta color={fx.teal} icon="checkmark-circle" label={status.label} />
        <Meta color={fx.amber} icon="star" label={`${station.rating ?? 4.6} (${station.reviewCount ?? 312})`} />
      </View>

      {!compact && (
        <>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable accessibilityRole="button" onPress={() => router.push(`/station/${station.id}`)} style={{ flex: 1, height: 46, borderRadius: 14, backgroundColor: fx.blue, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
              <Text style={{ color: "#fff", fontWeight: "900" }}>View details</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Open maps" onPress={() => station.google_maps_url ? void Linking.openURL(station.google_maps_url) : router.push("/navigation")} style={{ width: 52, height: 46, borderRadius: 14, borderWidth: 1, borderColor: fx.blue, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="navigate-outline" size={22} color={fx.blue} />
            </Pressable>
          </View>
        </>
      )}
    </Pressable>
  );
}

function Meta({ icon, label, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={{ color, fontWeight: "900", fontSize: 11 }}>{label}</Text>
    </View>
  );
}

function Pill({ label, tone }: { label: string; tone: "blue" | "teal" | "violet" | "neutral" }) {
  const color = tone === "teal" ? fx.teal : tone === "violet" ? fx.violet : tone === "neutral" ? fx.muted : fx.blue;
  return (
    <View style={{ borderRadius: 999, backgroundColor: `${color}14`, paddingHorizontal: 8, paddingVertical: 5 }}>
      <Text style={{ color, fontWeight: "900", fontSize: 10 }}>{label}</Text>
    </View>
  );
}
