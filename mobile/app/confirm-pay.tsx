import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { api } from "@/api/client";
import { BottomCta, fx, FxCard, FxScreen, ListRow } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function ConfirmPay() {
  const start = useMutation({
    mutationFn: async () => {
      const payment = await api.post("/api/v1/payments/intents", { amount_inr: 466, purpose: "charging_session", idempotency_key: `pay-${Date.now()}` });
      await api.post("/api/v1/payments/demo-complete", { payment_id: payment.data.payment_id, success: true });
      return payment.data;
    },
    onSuccess: () => router.push("/starting-session"),
    onError: () => {
      Alert.alert("Demo payment offline", "Continuing with the local demo charging flow.");
      router.push("/starting-session");
    }
  });

  return (
    <FxScreen>
      <TopChromeBar title="Authorize payment" subtitle="" />
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>2/3</Text>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>SHUBHPAY ZERO-WALLET</Text>
      <Text style={{ color: fx.ink, fontSize: 28, lineHeight: 32, fontWeight: "900" }}>Pay only for what you use</Text>
      <Text style={{ color: fx.muted, lineHeight: 22 }}>No wallet top-up. Unused authorized amount is released.</Text>
      <FxCard>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: fx.teal, marginTop: 5 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: fx.ink, fontWeight: "900" }}>CP01 - Shubh Power Hub, Sector 62</Text>
            <Text style={{ color: fx.muted }}>CCS2 - 50 kW DC - Ready to charge</Text>
          </View>
        </View>
        <View style={{ borderRadius: 12, backgroundColor: "#f4f7fb", padding: 12 }}>
          <Text style={{ color: fx.blue, fontWeight: "900" }}>Smart Cost Estimate</Text>
          <Text style={{ color: fx.muted, lineHeight: 21 }}>Based on your Nexon EV battery, estimated 20 kWh needed to reach 100%</Text>
        </View>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 17, fontWeight: "900" }}>Payment method</Text>
        <Row label="Energy (est. 20 kWh x Rs18)" value="Rs360" />
        <Row label="Platform Fee" value="Rs35" />
        <Row label="GST @ 18%" value="Rs71" />
        <Row label="Auth Deduction" value="Rs466" strong />
        <Text style={{ color: fx.faint, fontSize: 12 }}>₹600 will be temporarily authorized. Final capture happens after the session based on actual energy consumed.</Text>
      </FxCard>
      <Text style={{ color: fx.ink, fontWeight: "900" }}>Pay Via</Text>
      <FxCard>
        <ListRow icon="wallet-outline" title="Shubh Power Wallet" subtitle="Balance: Rs840" right={<Ionicons name="radio-button-on" size={23} color={fx.blue} />} />
        <ListRow icon="phone-portrait-outline" title="UPI" subtitle="rahul@okaxis" onPress={() => router.push("/pay-upi")} right={<Ionicons name="radio-button-off" size={23} color={fx.faint} />} />
        <ListRow icon="card-outline" title="Credit / Debit Card" subtitle="•••• 4242" onPress={() => router.push("/card-payment")} right={<Ionicons name="radio-button-off" size={23} color={fx.faint} />} />
      </FxCard>
      <BottomCta label="Authorize up to ₹600" onPress={() => start.mutate()} />
    </FxScreen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 }}><Text style={{ color: fx.muted, fontWeight: "700" }}>{label}</Text><Text style={{ color: strong ? fx.blue : fx.ink, fontWeight: "900", fontSize: strong ? 18 : 14 }}>{value}</Text></View>;
}
