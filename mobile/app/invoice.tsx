import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, Cta, fx, FxCard, FxScreen } from "@/components/Futuristic";

export default function Invoice() {
  return (
    <FxScreen>
      <BackHeader title="Invoice" onBack={() => router.back()} right={<Text style={{ color: fx.blue, fontWeight: "900" }}><Ionicons name="download-outline" /> Download</Text>} />
      <FxCard style={{ padding: 0, overflow: "hidden" }}>
        <View style={{ backgroundColor: fx.blue2, padding: 18, flexDirection: "row", justifyContent: "space-between" }}>
          <View><Text style={{ color: "#fff", fontWeight: "900" }}>Shubh Power EV</Text><Text style={{ color: "#dbe7ff" }}>Tax Invoice</Text></View>
          <View style={{ alignItems: "flex-end" }}><Text style={{ color: "#fff", fontSize: 12, fontWeight: "900" }}>INV-SP-20240718-0042</Text><Text style={{ color: "#dbe7ff" }}>18 Jul 2024</Text></View>
        </View>
        <View style={{ padding: 18, gap: 10 }}>
          <Row label="From" value="Shubh Power Technologies Pvt. Ltd." />
          <Row label="To" value="Rahul Sharma" />
          <Row label="Station" value="Shubh Power EV Hub, Sec 62" />
          <Row label="Charger" value="CP01 - CCS2 - 50 kW" />
          <Row label="Duration" value="31 minutes" />
          <Row label="Energy Delivered" value="14.2 kWh" />
          <Row label="Energy Charges" value="Rs255.60" />
          <Row label="Platform Fee" value="Rs35.00" />
          <Row label="CGST @ 9%" value="Rs26.15" />
          <Row label="SGST @ 9%" value="Rs26.15" />
          <Row label="Total" value="Rs342.90" strong />
          <Text style={{ color: fx.teal, fontWeight: "900" }}>Paid via Shubh Power Wallet</Text>
        </View>
      </FxCard>
      <Cta label="Raise Issue with this Invoice" kind="secondary" onPress={() => router.push("/support-ticket")} />
    </FxScreen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 14, borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 6 }}><Text style={{ color: fx.muted }}>{label}</Text><Text style={{ color: strong ? fx.blue : fx.ink, fontWeight: "900", flex: 1, textAlign: "right" }}>{value}</Text></View>;
}
