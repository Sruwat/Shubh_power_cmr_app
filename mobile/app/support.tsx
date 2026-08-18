import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { api } from "@/api/client";
import { Cta, EnergyCard, fx, FxCard, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";
import { supportTickets } from "@/data/experience";

export default function Support() {
  const ticket = useMutation({
    mutationFn: async () => (await api.post("/api/v1/support/tickets", { category: "support", message: "Support requested from app." })).data,
    onSuccess: (data) => router.push(`/ticket/${data.ticket_id ?? "TKT-001"}`),
    onError: () => Alert.alert("Demo support", "Opening the local ticket form.")
  });
  return (
    <FxScreen>
      <TopChromeBar title="Help & support" subtitle="" />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900" }}>Need help?</Text>
        <Text style={{ color: "#dbe7ff", lineHeight: 21 }}>Our support team is available 24/7 for charging issues.</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}><Cta label="Call Now" icon="call-outline" kind="secondary" onPress={() => undefined} /></View>
          <View style={{ flex: 1 }}><Cta label="Live Chat" icon="chatbubble-outline" kind="secondary" onPress={() => router.push("/ticket/TKT-001")} /></View>
        </View>
      </EnergyCard>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>QUICK HELP</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {[
          ["Charging Issue", "flash"],
          ["Payment Issue", "wallet"],
          ["Booking Issue", "calendar"],
          ["Connector Problem", "hardware-chip"]
        ].map(([label, icon]) => (
          <Pressable key={label} onPress={() => router.push("/support-ticket")} style={{ width: "47%", minHeight: 88, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: fx.line, alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name={`${icon}-outline` as keyof typeof Ionicons.glyphMap} size={24} color={fx.blue} />
            <Text style={{ color: fx.ink, fontWeight: "800" }}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <FxCard style={{ gap: 0, paddingVertical: 10 }}>
        <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900", paddingHorizontal: 2, paddingBottom: 10 }}>My tickets</Text>
        {supportTickets.slice(0, 2).map((item) => (
          <Pressable key={item.id} onPress={() => router.push(`/ticket/${item.id}`)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: fx.line, paddingVertical: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: fx.ink, fontWeight: "900" }}>{item.title}</Text>
              <Text style={{ color: fx.muted, fontSize: 11 }}>{item.meta}</Text>
            </View>
            <Text style={{ color: item.status === "Open" ? fx.blue : fx.teal, fontWeight: "900" }}>{item.status}</Text>
          </Pressable>
        ))}
      </FxCard>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>MY TICKETS</Text>
        <Text onPress={() => ticket.mutate()} style={{ color: fx.blue, fontWeight: "900" }}>+ New Ticket</Text>
      </View>
      {supportTickets.map((item) => (
        <FxCard key={item.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: fx.faint, fontWeight: "900" }}>{item.id}</Text>
            <Text style={{ color: item.status === "Open" ? fx.blue : fx.teal, fontWeight: "900" }}>{item.status}</Text>
          </View>
          <Text onPress={() => router.push(`/ticket/${item.id}`)} style={{ color: fx.ink, fontWeight: "900" }}>{item.title}</Text>
          <Text style={{ color: fx.faint }}>{item.meta}</Text>
        </FxCard>
      ))}
    </FxScreen>
  );
}
