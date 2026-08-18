import { router } from "expo-router";
import { Text, View } from "react-native";
import { EnergyCard, fx, FxCard, FxScreen, StatTile } from "@/components/Futuristic";
import { chargingHistory } from "@/data/experience";
import { TopChromeBar } from "@/components/ShubhShell";

export default function History() {
  return (
    <FxScreen>
      <TopChromeBar title="Charging history" subtitle="" />
      <EnergyCard style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatTile label="Sessions" value="12" tone="navy" />
          <StatTile label="Total kWh" value="142.3" />
          <StatTile label="CO2 Saved" value="51.2 kg" tone="teal" />
        </View>
      </EnergyCard>
      {chargingHistory.map((item, index) => (
        <FxCard key={`${item.station}-${item.time}`}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900" }}>{item.station}</Text>
              <Text style={{ color: fx.muted, fontSize: 12 }}>{item.time}</Text>
            </View>
            <Text style={{ color: item.status === "Failed" ? fx.red : fx.ink, fontSize: 17, fontWeight: "900" }}>{item.amount}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: fx.muted }}>{item.meta}</Text>
            <Text onPress={() => router.push("/session-detail")} style={{ color: index === 3 ? fx.red : fx.teal, fontWeight: "900" }}>{item.status}</Text>
          </View>
        </FxCard>
      ))}
    </FxScreen>
  );
}
