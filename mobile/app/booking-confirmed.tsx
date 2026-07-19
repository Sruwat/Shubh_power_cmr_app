import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, Cta, EnergyCard, fx, FxCard, FxScreen } from "@/components/Futuristic";
import { selectedStation } from "@/data/experience";

export default function BookingConfirmed() {
  return (
    <FxScreen>
      <BackHeader title="Booking Confirmed" onBack={() => router.back()} />
      <EnergyCard style={{ backgroundColor: fx.teal, alignItems: "center" }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark" size={34} color="#fff" />
        </View>
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900" }}>Booking Confirmed!</Text>
        <Text style={{ color: "#fff", textAlign: "center" }}>Your slot is reserved. Head over and start charging.</Text>
      </EnergyCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Booking Details</Text>
        <Row label="Station" value={selectedStation.name} />
        <Row label="Address" value="Plot 15, Sector 62, Noida" />
        <Row label="Connector" value="CCS2 - 50 kW DC" />
        <Row label="Date & Time" value="Today, 18 Jul - 10:00 AM" />
        <Row label="Amount Held" value="Rs466 (wallet)" />
      </FxCard>
      <FxCard style={{ backgroundColor: fx.cyan }}>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>When You Arrive</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>1. Go to Charger CP01 at the station{"\n"}2. Tap Scan QR or enter charger ID{"\n"}3. Wait for connector unlock, then plug in</Text>
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
