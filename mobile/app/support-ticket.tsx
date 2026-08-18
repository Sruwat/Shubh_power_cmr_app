import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { api } from "@/api/client";
import { Cta, fx, FxCard, FxInput, FxScreen, Pill } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function SupportTicket() {
  const ticket = useMutation({
    mutationFn: async () => (await api.post("/api/v1/support/tickets", { category: "charging", message: "Charging issue reported from app." })).data,
    onSuccess: (data) => router.replace(`/ticket/${data.ticket_id ?? "TKT-001"}`),
    onError: () => {
      Alert.alert("Demo ticket created", "Opening TKT-001 conversation.");
      router.replace("/ticket/TKT-001");
    }
  });
  return (
    <FxScreen>
      <TopChromeBar title="Create support ticket" subtitle="" />
      <FxCard style={{ backgroundColor: fx.red, gap: 10 }}>
        <Text style={{ color: "#ffe9e6", fontSize: 11, fontWeight: "900", letterSpacing: 1.3 }}>24/7 SUPPORT</Text>
        <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32, fontWeight: "900" }}>Tell us what happened.</Text>
        <Text style={{ color: "#ffe7e5", lineHeight: 21 }}>We’ll keep the case linked to your active charging session and move it to the right team.</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pill label="Fast response" selected />
          <Pill label="Session linked" />
          <Pill label="Live support" />
        </View>
      </FxCard>
      <Text style={{ color: fx.faint, fontWeight: "900" }}>ISSUE CATEGORY</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {["Charging Issue", "Payment Issue", "Booking Issue", "Hardware Fault", "App Problem", "Other"].map((label, index) => <Pill key={label} label={label} selected={index === 0} />)}
      </View>
      <Text style={{ color: fx.faint, fontWeight: "900" }}>RELATED SESSION (OPTIONAL)</Text>
      <FxInput placeholder="Select a charging session..." />
      <Text style={{ color: fx.faint, fontWeight: "900" }}>DESCRIBE THE ISSUE</Text>
      <FxCard style={{ gap: 8 }}>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>What to include</Text>
        <Text style={{ color: fx.faint, lineHeight: 22 }}>Describe what happened in detail. Include charger ID, time, error messages, and whether the payment succeeded or failed.</Text>
      </FxCard>
      <Text style={{ color: fx.faint, fontWeight: "900" }}>PRIORITY</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {["Low", "Medium", "High"].map((label) => <View key={label} style={{ flex: 1 }}><Cta label={label} kind="secondary" onPress={() => undefined} /></View>)}
      </View>
      <Cta label="Submit Ticket" onPress={() => ticket.mutate()} />
    </FxScreen>
  );
}
