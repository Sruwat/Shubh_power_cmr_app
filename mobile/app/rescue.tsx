import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function Rescue() {
  return (
    <FxScreen>
      <TopChromeBar title="Shubh Rescue" subtitle="Roadside and charger assistance" />
      <EnergyCard style={{ backgroundColor: fx.red }}>
        <Text style={{ color: "#ffe9e6", fontSize: 12, fontWeight: "900", letterSpacing: 1.2 }}>24/7 ASSISTANCE</Text>
        <Text style={{ color: "#fff", fontSize: 34, lineHeight: 40, fontWeight: "900" }}>Need help on the road?</Text>
        <Text style={{ color: "#ffe7e5", lineHeight: 21 }}>We can assist with charger faults, towing coordination, or booking rescue support.</Text>
      </EnergyCard>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Pill label="Tow support" tone="red" selected />
        <Pill label="Flat tyre" tone="amber" selected />
        <Pill label="Charging fault" tone="teal" selected />
      </View>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Fast actions</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Call rescue, share live location, or create a charger issue ticket that stays linked to the active session.</Text>
      </FxCard>
      <Cta label="Create Rescue Case" icon="medkit-outline" onPress={() => router.push("/support-ticket")} />
    </FxScreen>
  );
}
