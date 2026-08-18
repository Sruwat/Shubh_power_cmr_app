import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, fx, FxCard, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function ChargingFailed() {
  return (
    <FxScreen>
      <TopChromeBar title="Charging failed" subtitle="" />
      <View style={{ alignItems: "center", gap: 14, marginTop: 44 }}>
        <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: "#ffe5e2", alignItems: "center", justifyContent: "center" }}><Ionicons name="alert-circle-outline" size={36} color={fx.red} /></View>
        <Text style={{ color: fx.ink, fontSize: 22, fontWeight: "900" }}>Session Could Not Start</Text>
        <Text style={{ color: fx.muted, textAlign: "center", lineHeight: 21 }}>The charger did not respond. Your payment has NOT been deducted.</Text>
      </View>
      <Cta label="Try Again - Same Charger" onPress={() => router.push("/starting-session")} />
      <Cta label="Switch to Another Connector" kind="secondary" onPress={() => router.push("/select-connector")} />
      <Cta label="Raise Support Ticket" kind="secondary" onPress={() => router.push("/support-ticket")} />
      <FxCard style={{ backgroundColor: "#fff2f0", gap: 6 }}><Text style={{ color: fx.red, fontWeight: "900" }}>Rescue Mode Active</Text><Text style={{ color: fx.muted }}>If this issue persists, our field team is notified automatically.</Text></FxCard>
    </FxScreen>
  );
}
