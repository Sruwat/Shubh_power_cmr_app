import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxCard, FxScreen, Pill, StatTile } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function ChargingComplete() {
  return (
    <FxScreen>
      <TopChromeBar title="Charging complete" subtitle="" />
      <EnergyCard style={{ backgroundColor: fx.teal, alignItems: "center", gap: 10 }}>
        <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark" size={34} color="#fff" />
        </View>
        <Text style={{ color: "#fff", fontSize: 25, fontWeight: "900" }}>Charging complete</Text>
        <Text style={{ color: "#fff", textAlign: "center" }}>Your Nexon EV session ended successfully.</Text>
        <Pill label="Finalized" selected />
      </EnergyCard>
      <FxCard style={{ gap: 8 }}>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Session Summary</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatTile label="Energy" value="14.2 kWh" />
          <StatTile label="Duration" value="31 min" />
          <StatTile label="Battery" value="35% > 72%" tone="teal" />
        </View>
        <Row label="Energy (14.2 kWh x Rs18)" value="Rs255.6" />
        <Row label="Platform Fee" value="Rs35" />
        <Row label="GST @18%" value="Rs52.6" />
        <Row label="Total Charged" value="Rs343" strong />
        <Text style={{ color: fx.teal, fontWeight: "900" }}>Refunded to Wallet +Rs123</Text>
      </FxCard>
      <FxCard style={{ backgroundColor: "#e0f6f2", gap: 6 }}>
        <Text style={{ color: fx.teal, fontWeight: "900" }}>You saved 5.9 kg CO2</Text>
        <Text style={{ color: fx.muted }}>Equivalent to planting 2 trees this month</Text>
      </FxCard>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}><Cta label="View Invoice" kind="secondary" onPress={() => router.push("/invoice")} /></View>
        <View style={{ flex: 1 }}><Cta label="Back to Home" onPress={() => router.replace("/(tabs)")} /></View>
      </View>
    </FxScreen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}><Text style={{ color: fx.muted }}>{label}</Text><Text style={{ color: strong ? fx.blue : fx.ink, fontWeight: "900", fontSize: strong ? 18 : 14 }}>{value}</Text></View>;
}
