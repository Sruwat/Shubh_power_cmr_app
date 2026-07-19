import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { api } from "@/api/client";
import { BackHeader, Cta, fx, FxCard, FxInput, FxScreen, Pill } from "@/components/Futuristic";

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
      <BackHeader title="Create Support Ticket" onBack={() => router.back()} />
      <Text style={{ color: fx.faint, fontWeight: "900" }}>ISSUE CATEGORY</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {["Charging Issue", "Payment Issue", "Booking Issue", "Hardware Fault", "App Problem", "Other"].map((label, index) => <Pill key={label} label={label} selected={index === 0} />)}
      </View>
      <Text style={{ color: fx.faint, fontWeight: "900" }}>RELATED SESSION (OPTIONAL)</Text>
      <FxInput placeholder="Select a charging session..." />
      <Text style={{ color: fx.faint, fontWeight: "900" }}>DESCRIBE THE ISSUE</Text>
      <FxCard><Text style={{ color: fx.faint, lineHeight: 22 }}>Describe what happened in detail. Include charger ID, time, error messages if any.</Text></FxCard>
      <Text style={{ color: fx.faint, fontWeight: "900" }}>PRIORITY</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {["Low", "Medium", "High"].map((label) => <View key={label} style={{ flex: 1 }}><Cta label={label} kind="secondary" onPress={() => undefined} /></View>)}
      </View>
      <Cta label="Submit Ticket" onPress={() => ticket.mutate()} />
    </FxScreen>
  );
}
