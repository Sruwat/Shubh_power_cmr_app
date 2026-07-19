import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, Cta, fx, FxCard, FxScreen } from "@/components/Futuristic";

export default function PaymentFailed() {
  return (
    <FxScreen>
      <BackHeader title="Payment Failed" onBack={() => router.back()} />
      <View style={{ alignItems: "center", gap: 14, marginTop: 60 }}>
        <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: "#ffe5e2", alignItems: "center", justifyContent: "center" }}><Ionicons name="card-outline" size={36} color={fx.red} /></View>
        <Text style={{ color: fx.ink, fontSize: 22, fontWeight: "900" }}>Payment Failed</Text>
        <Text style={{ color: fx.muted, textAlign: "center", lineHeight: 21 }}>Your UPI payment of Rs466 failed. No amount was deducted.</Text>
      </View>
      <FxCard><Row label="Transaction Ref" value="SP-TXN-2407181047" /><Row label="Status" value="Failed" red /><Row label="Refund Status" value="N/A (not deducted)" green /></FxCard>
      <Cta label="Retry with Same UPI" onPress={() => router.push("/pay-upi")} />
      <Cta label="Pay via Wallet" kind="secondary" onPress={() => router.push("/confirm-pay")} />
      <Text onPress={() => router.push("/support")} style={{ color: fx.muted, textAlign: "center", fontWeight: "900" }}>Contact Support</Text>
    </FxScreen>
  );
}

function Row({ label, value, red, green }: { label: string; value: string; red?: boolean; green?: boolean }) {
  return <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}><Text style={{ color: fx.muted }}>{label}</Text><Text style={{ color: red ? fx.red : green ? fx.teal : fx.ink, fontWeight: "900" }}>{value}</Text></View>;
}
