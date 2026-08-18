import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { selectedStation } from "@/data/experience";
import { TopChromeBar } from "@/components/ShubhShell";

export default function BookingConfirmed() {
  return (
    <FxScreen>
      <TopChromeBar title="Booking confirmed" subtitle="" />
      <EnergyCard style={{ backgroundColor: fx.teal, alignItems: "center", gap: 10 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark" size={34} color="#fff" />
        </View>
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900" }}>Booking Confirmed!</Text>
        <Text style={{ color: "#fff", textAlign: "center" }}>Your slot is reserved. Head over and start charging.</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <View style={{ borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Arrive by 9:55 AM</Text></View>
          <View style={{ borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Slot held for 15 min</Text></View>
        </View>
      </EnergyCard>
      <FxCard style={{ gap: 0, paddingVertical: 10 }}>
        <Text style={{ color: fx.ink, fontWeight: "900", paddingHorizontal: 2, paddingBottom: 6 }}>Booking Details</Text>
        <Row label="Station" value={selectedStation.name} />
        <Row label="Address" value="Plot 15, Sector 62, Noida" />
        <Row label="Connector" value="CCS2 - 50 kW DC" />
        <Row label="Date & Time" value="Today, 18 Jul - 10:00 AM" />
        <Row label="Amount Held" value="Rs466 (wallet)" />
      </FxCard>
      <FxCard style={{ backgroundColor: fx.cyan, gap: 10 }}>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>When You Arrive</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>1. Go to Charger CP01 at the station{"\n"}2. Tap Scan QR or enter charger ID{"\n"}3. Wait for connector unlock, then plug in</Text>
        <Pill label="Navigation ready" selected tone="teal" />
      </FxCard>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}><Cta label="Cancel" kind="secondary" onPress={() => router.back()} /></View>
        <View style={{ flex: 1 }}><Cta label="Navigate" icon="navigate-outline" onPress={() => router.push("/navigation")} /></View>
      </View>
    </FxScreen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 10 }}><Text style={{ color: fx.muted }}>{label}</Text><Text style={{ color: fx.ink, fontWeight: "900", flex: 1, textAlign: "right" }}>{value}</Text></View>;
}
