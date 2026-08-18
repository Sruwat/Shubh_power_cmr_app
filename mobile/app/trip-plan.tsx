import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, FxCard, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function TripPlan() {
  return (
    <FxScreen>
      <TopChromeBar title="ShubhAI route plan" subtitle="" />
      <View style={{ alignItems: "center", paddingTop: 20, gap: 10 }}>
        <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: "#e7f2ff", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="options-outline" size={26} color="#176fe0" />
        </View>
        <Text style={{ color: "#176fe0", fontSize: 10, fontWeight: "900", letterSpacing: 2 }}>SHUBH POWER</Text>
        <Text style={{ color: "#13213b", fontSize: 28, lineHeight: 32, fontWeight: "500", textAlign: "center" }}>Plan A + Plan B</Text>
        <Text style={{ color: "#7c8496", fontSize: 11, textAlign: "center" }}>Delhi → Jaipur · Nexon EV · starting battery 68%</Text>
      </View>
      <FxCard style={{ gap: 14 }}>
        <PlanRow label="START" value="Delhi · 68%" />
        <PlanRow label="PLAN A" value="Behror · ChargeSure 96" sub="Charge 21% → 61% · 24 min" />
        <PlanRow label="DESTINATION" value="Jaipur · arrive 17%" />
        <View style={{ borderRadius: 14, backgroundColor: "#e9f8ed", paddingVertical: 10, paddingHorizontal: 12 }}>
          <Text style={{ color: "#149955", fontSize: 11, fontWeight: "800" }}>Backup charger included 5.8 km away</Text>
        </View>
      </FxCard>
      <View style={{ alignItems: "center", paddingTop: 8 }}>
        <Cta label="Build confident route" icon="arrow-forward" onPress={() => router.push("/navigation")} />
      </View>
    </FxScreen>
  );
}
function PlanRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: "#1d4aa7", fontSize: 10, fontWeight: "900", letterSpacing: 1.1 }}>{label}</Text>
      <Text style={{ color: "#13213b", fontSize: 15, fontWeight: "900" }}>{value}</Text>
      {sub ? <Text style={{ color: "#7c8496", fontSize: 10 }}>{sub}</Text> : null}
    </View>
  );
}
