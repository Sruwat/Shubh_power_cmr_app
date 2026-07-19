import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, Cta, EnergyCard, fx, FxCard, FxScreen, StatTile } from "@/components/Futuristic";

export default function SessionDetail() {
  return (
    <FxScreen>
      <BackHeader title="Session Detail" onBack={() => router.back()} />
      <EnergyCard style={{ backgroundColor: fx.teal }}>
        <Text style={{ color: "#dff", fontWeight: "800" }}>Session ID</Text>
        <Text style={{ color: "#fff", fontSize: 17, fontWeight: "900" }}>SP-S-20240718-01847</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatTile label="Energy" value="14.2 kWh" /><StatTile label="Duration" value="31 min" /><StatTile label="Cost" value="Rs343" />
        </View>
      </EnergyCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Charging Details</Text>
        {["Station|Shubh Power EV Hub, Sector 62", "Charger|CP01 - CCS2 - 50 kW", "Start|10:00 AM - 18 Jul 2024", "End|10:31 AM - 18 Jul 2024", "Peak Speed|49.8 kW", "Avg Speed|27.5 kW", "Start SOC|35%", "End SOC|72%"].map((line) => {
          const [label, value] = line.split("|");
          return <Row key={line} label={label} value={value} />;
        })}
      </FxCard>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}><Cta label="Invoice" kind="secondary" onPress={() => router.push("/invoice")} /></View>
        <View style={{ flex: 1 }}><Cta label="Report Issue" kind="secondary" onPress={() => router.push("/support-ticket")} /></View>
      </View>
    </FxScreen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 8 }}><Text style={{ color: fx.muted }}>{label}</Text><Text style={{ color: fx.ink, fontWeight: "900", flex: 1, textAlign: "right" }}>{value}</Text></View>;
}
