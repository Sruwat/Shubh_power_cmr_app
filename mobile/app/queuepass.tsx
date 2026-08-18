import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function QueuePass() {
  return (
    <FxScreen>
      <TopChromeBar title="QueuePass" subtitle="Skip uncertainty at busy chargers" />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <Text style={{ color: "#dbe7ff", fontSize: 11, fontWeight: "900", letterSpacing: 1.3 }}>QUEUE STATUS</Text>
        <Text style={{ color: "#fff", fontSize: 38, lineHeight: 42, fontWeight: "900" }}>Queue #2</Text>
        <Text style={{ color: "#c9dbff", lineHeight: 21 }}>Statiq MLCP Noida Sec-18 is busy right now. Your pass keeps your place for 15 minutes.</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pill label="ETA 12 min" tone="teal" selected />
          <Pill label="15 min hold" tone="amber" selected />
        </View>
      </EnergyCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>How QueuePass works</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>1. Reserve your queue position{"\n"}2. Get notified when the connector opens{"\n"}3. Start charging immediately on arrival</Text>
      </FxCard>
      <Cta label="Join Queue" icon="time-outline" onPress={() => router.push("/station/sp-gurgaon-sector-22")} />
    </FxScreen>
  );
}
