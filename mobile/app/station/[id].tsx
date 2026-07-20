import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { api, distanceLabel, Station } from "@/api/client";
import { BackHeader, Cta, EnergyCard, fx, FxCard, FxScreen, Pill, SectionLabel, StatTile } from "@/components/Futuristic";
import { selectedStation, stations } from "@/data/experience";
import { withPresentation } from "@/data/presentation";
import { openGoogleMapsDirections } from "@/utils/maps";

export default function StationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [preference, setPreference] = useState<"time" | "amount" | "units">("time");
  const fallback = stations.find((station) => station.id === id) ?? selectedStation;
  const station = useQuery({
    queryKey: ["station", id],
    queryFn: async () => withPresentation((await api.get<Station>(`/api/v1/stations/${id}`)).data, 0),
    retry: false
  });
  const item = station.data ?? fallback;
  const isShubh = item.isShubhHub || /shu?bh/i.test(`${item.brand} ${item.name}`);
  const saveStation = useMutation({
    mutationFn: async () => (await api.post(`/api/v1/stations/${id}/save`)).data,
    onSuccess: () => Alert.alert("Station saved", "This charger has been added to your saved stations."),
    onError: () => Alert.alert("Saved locally", "This demo station is marked as saved for this session.")
  });
  const reportIssue = useMutation({
    mutationFn: async () => (await api.post("/api/v1/support/tickets", { category: "station", message: "User reported an issue from station details.", station_id: id })).data,
    onSettled: () => router.push("/support-ticket")
  });

  return (
    <FxScreen>
      <BackHeader title="Station details" onBack={() => router.back()} right={<Pressable onPress={() => saveStation.mutate()} style={{ padding: 8 }}><Ionicons name="heart-outline" size={25} color={fx.ink} /></Pressable>} />

      <EnergyCard>
        <View style={{ alignSelf: "flex-start", borderRadius: 999, backgroundColor: fx.cyan, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text style={{ color: fx.teal, fontWeight: "900" }}>Charging available</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {isShubh ? <Image source={require("../../assets/shubh-power-mark.png")} resizeMode="contain" style={{ width: 38, height: 38 }} /> : null}
          <Text style={{ color: "#fff", fontSize: 30, lineHeight: 36, fontWeight: "900", flex: 1 }}>{item.name}</Text>
        </View>
        <Text style={{ color: "#dbe7ff", fontSize: 16, fontWeight: "700" }}>{item.brand} - {distanceLabel(item)}</Text>
        {item.societyName ? <Text style={{ color: fx.sky, fontSize: 13, fontWeight: "900" }}>Private hub: {item.societyName}</Text> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pill label="Connector details updating" selected />
          <Pill label="Tariff updates at station" />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}><Cta label="Navigate" icon="navigate-outline" kind="secondary" onPress={() => void openGoogleMapsDirections(item)} /></View>
          <View style={{ flex: 1 }}><Cta label="Scan QR" icon="qr-code-outline" onPress={() => router.push("/(tabs)/scan")} /></View>
        </View>
      </EnergyCard>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pill label="Info" selected />
        <Pill label="Chargers" />
        <Pill label="Reviews" />
      </View>

      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Charging options</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <StatTile label="Power" value={item.powerLabel || "50 kW"} />
          <StatTile label="Tariff" value={`Rs ${item.pricePerKwh ?? 18}`} tone="teal" />
        </View>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Charging available. Connector and price details may be updated by the station before charging starts.</Text>
        <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900" }}>Charging preference</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <PreferenceButton label="By time" value="30 min" selected={preference === "time"} onPress={() => setPreference("time")} />
          <PreferenceButton label="By amount" value="Rs 500" selected={preference === "amount"} onPress={() => setPreference("amount")} />
          <PreferenceButton label="By units" value="20 kWh" selected={preference === "units"} onPress={() => setPreference("units")} />
        </View>
        <Cta label="Select Connector" icon="flash-outline" onPress={() => router.push("/select-connector")} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Location and access</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Navigation is available for this station.</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["Parking nearby", "Support available", "Public access"].map((label) => <Pill key={label} label={label} />)}
        </View>
        <Cta label="Open maps" icon="navigate-outline" kind="secondary" onPress={() => void openGoogleMapsDirections(item)} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Tariff breakdown</Text>
        <PriceRow label="Energy Rate" value={`Rs ${item.pricePerKwh}/kWh`} />
        <PriceRow label="Platform Fee" value={`Rs ${item.platformFee} flat`} />
        <PriceRow label="GST (18%)" value="Incl. in above" />
        <PriceRow label="Idle Fee" value={item.idleFee} />
        <PriceRow label="Parking" value={item.parkingFee} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Before you start</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Confirm connector availability at the station, review tariff information and keep your payment method ready.</Text>
        <Cta label="Book Charging Slot" icon="calendar-outline" onPress={() => router.push("/book-slot")} />
        <Pressable accessibilityRole="button" onPress={() => reportIssue.mutate()} style={{ alignItems: "center", paddingVertical: 8 }}>
          <Text style={{ color: fx.blue, fontWeight: "900" }}>Report an issue</Text>
        </Pressable>
      </FxCard>

      <SectionLabel>Compatible with Tata Nexon EV, MG ZS EV, BYD Atto 3, fleet vehicles</SectionLabel>
    </FxScreen>
  );
}

function PreferenceButton({ label, value, selected, onPress }: { label: string; value: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ flex: 1, minHeight: 78, borderRadius: 15, borderWidth: 1.5, borderColor: selected ? fx.blue : fx.line, backgroundColor: selected ? "#e7f7ff" : "#fff", padding: 10, justifyContent: "center", gap: 4 }}>
      <Text style={{ color: selected ? fx.blue : fx.muted, fontSize: 11, fontWeight: "900" }}>{label}</Text>
      <Text style={{ color: fx.ink, fontSize: 14, fontWeight: "900" }}>{value}</Text>
    </Pressable>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 9 }}>
      <Text style={{ color: fx.muted, fontWeight: "800" }}>{label}</Text>
      <Text style={{ color: fx.ink, fontWeight: "900", flexShrink: 1, textAlign: "right" }}>{value}</Text>
    </View>
  );
}
