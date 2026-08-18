import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxCard, FxScreen, Pill, StatTile } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

const missions = [
  { title: "Charge 3 verified sessions", reward: "+30 Miles", progress: "2/3 complete" },
  { title: "Report a valid charger issue", reward: "+20 Miles", progress: "Done" },
  { title: "Try a new network", reward: "+15 Miles", progress: "1/2 complete" }
];

export default function Rewards() {
  return (
    <FxScreen>
      <TopChromeBar title="Rewards" subtitle="Miles, missions and rescue credits" />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <Text style={{ color: "#dbe7ff", fontSize: 11, fontWeight: "900", letterSpacing: 1.3 }}>SHUBH MILES</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Text style={{ color: "#fff", fontSize: 42, lineHeight: 48, fontWeight: "900" }}>240</Text>
          <Pressable onPress={() => router.push("/rescue")} style={{ backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>Redeem</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pill label="Gold Tier" tone="amber" selected />
          <Pill label="3 rescue credits" tone="teal" selected />
        </View>
      </EnergyCard>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <StatTile label="Sessions" value="18" tone="navy" />
        <StatTile label="Miles Earned" value="240" />
        <StatTile label="Rescue" value="3" tone="teal" />
      </View>

      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>MISSIONS</Text>
      {missions.map((mission) => (
        <FxCard key={mission.title}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontWeight: "900" }}>{mission.title}</Text>
              <Text style={{ color: fx.muted, fontSize: 12 }}>{mission.progress}</Text>
            </View>
            <Text style={{ color: fx.teal, fontWeight: "900" }}>{mission.reward}</Text>
          </View>
        </FxCard>
      ))}

      <Cta label="View Shubh Rescue" icon="medkit-outline" onPress={() => router.push("/rescue")} />
    </FxScreen>
  );
}
