import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { api } from "@/api/client";
import { BottomCta, fx, FxCard, FxScreen, ListRow, Pill } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function AddMoney() {
  const queryClient = useQueryClient();
  const topUp = useMutation({
    mutationFn: async () => (await api.post("/api/v1/wallet/top-up", { amount_inr: 500, idempotency_key: `topup-${Date.now()}` })).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      router.back();
    },
    onError: () => Alert.alert("Demo top-up", "Backend is offline; the screen remains ready for Mongo-backed top-up.")
  });
  return (
    <FxScreen>
      <TopChromeBar title="Add money" subtitle="" />
      <FxCard>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>ENTER AMOUNT</Text>
        <Text style={{ color: fx.ink, fontSize: 36, fontWeight: "900" }}>Rs 500</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {[100, 200, 500, 1000, 2000].map((amount) => <Pill key={amount} label={`Rs${amount}`} selected={amount === 500} />)}
        </View>
      </FxCard>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>PAYMENT METHOD</Text>
      <FxCard>
        <ListRow icon="phone-portrait-outline" title="UPI" subtitle="rahul@okaxis, GPay, PhonePe" right={<Ionicons name="radio-button-on" size={23} color={fx.blue} />} onPress={() => router.push("/pay-upi")} />
        <ListRow icon="card-outline" title="Credit / Debit Card" subtitle="Visa, Mastercard, RuPay" right={<Ionicons name="radio-button-off" size={23} color={fx.faint} />} onPress={() => router.push("/card-payment")} />
        <ListRow icon="business-outline" title="Net Banking" subtitle="SBI, HDFC, ICICI + 50 more" right={<Ionicons name="radio-button-off" size={23} color={fx.faint} />} />
      </FxCard>
      <FxCard>
        <ListRow title="Auto Top-up" subtitle="Auto-add Rs500 when balance falls below Rs100" right={<Ionicons name="toggle" size={32} color={fx.line} />} />
      </FxCard>
      <BottomCta label="Add Rs500 to Wallet" onPress={() => topUp.mutate()} />
    </FxScreen>
  );
}
