import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { api } from "@/api/client";
import { Cta, EnergyCard, fx, FxCard, FxScreen, StatTile } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function ChargingSession() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const session = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => (await api.get(`/api/v1/charging/sessions/${sessionId}`)).data,
    refetchInterval: 5000,
    retry: false
  });
  const stop = useMutation({
    mutationFn: async () => (await api.post(`/api/v1/charging/sessions/${sessionId}/stop`)).data,
    onSettled: () => router.push("/charging-complete")
  });
  const energy = session.data?.energy_kwh ?? 14.2;
  const cost = session.data?.cost_inr ?? 291;

  return (
    <FxScreen>
      <TopChromeBar title="Live charging" subtitle="" />
      <EnergyCard style={{ alignItems: "center", gap: 12 }}>
        <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: "rgba(35,196,181,0.22)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="flash" size={46} color={fx.teal} />
        </View>
        <Text style={{ color: "#fff", fontSize: 40, lineHeight: 46, fontWeight: "900" }}>{energy} kWh</Text>
        <Text style={{ color: "#dbe7ff", fontWeight: "800" }}>Charging in progress - CP01 CCS2</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          <View style={{ borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Live session</Text></View>
          <View style={{ borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Auto updates on</Text></View>
        </View>
        <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
          <StatTile label="Power" value={`${session.data?.power_kw ?? 49.8} kW`} />
          <StatTile label="Cost" value={`Rs ${cost}`} tone="teal" />
          <StatTile label="Battery" value="72%" tone="navy" />
        </View>
      </EnergyCard>
      <FxCard style={{ gap: 8 }}>
        <Text style={{ color: fx.ink, fontSize: 20, fontWeight: "900" }}>Session controls</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Keep the vehicle connected until you stop the session or the charger completes charging.</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}><Cta label="Invoice" kind="secondary" onPress={() => router.push("/invoice")} /></View>
          <View style={{ flex: 1 }}><Cta label="Support" kind="secondary" onPress={() => router.push("/support-ticket")} /></View>
        </View>
      </FxCard>
      <Pressable accessibilityRole="button" onPress={() => stop.mutate()} style={{ backgroundColor: fx.red, borderRadius: 18, padding: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 9 }}>
        <Ionicons name="stop-circle-outline" size={20} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "900" }}>Stop Session</Text>
      </Pressable>
    </FxScreen>
  );
}
