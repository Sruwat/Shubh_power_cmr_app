import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { api } from "@/api/client";
import { Cta, EnergyCard, fx, FxCard, FxHeader, FxScreen, Pill } from "@/components/Futuristic";
import { walletTransactions } from "@/data/experience";

export default function Wallet() {
  const queryClient = useQueryClient();
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: async () => (await api.get("/api/v1/wallet")).data, retry: false });
  const topUp = useMutation({
    mutationFn: async (amount: number) => (await api.post("/api/v1/wallet/top-up", { amount_inr: amount, idempotency_key: `topup-${Date.now()}` })).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      Alert.alert("Money added", "Wallet balance has been updated.");
    },
    onError: () => Alert.alert("Demo wallet", "Backend is offline, so this top-up is shown in demo mode.")
  });

  return (
    <FxScreen>
      <FxHeader title="Wallet" subtitle="Balance, bookings and payments" menuPress={() => router.push("/menu")} />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ color: "#dbe7ff", fontWeight: "800" }}>Wallet Balance</Text>
            <Text style={{ color: "#fff", fontSize: 38, lineHeight: 44, fontWeight: "900" }}>Rs {wallet.data?.balance_inr ?? 840}</Text>
          </View>
          <View style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="card-outline" size={24} color="#fff" />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pill label="Active" tone="teal" selected />
          <Pill label="Auto top-up: OFF" />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}><Cta label="+ Add Money" kind="secondary" onPress={() => router.push("/add-money")} /></View>
          <View style={{ flex: 1 }}><Cta label="Transfer" kind="teal" onPress={() => router.push("/payments")} /></View>
        </View>
      </EnergyCard>

      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>QUICK ADD</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {[100, 200, 500, 1000].map((amount) => (
          <View key={amount} style={{ flex: 1 }}>
            <Cta label={`Rs${amount}`} kind="secondary" onPress={() => topUp.mutate(amount)} />
          </View>
        ))}
      </View>

      <FxCard style={{ backgroundColor: "#f6f2e8" }}>
        <Text style={{ color: "#8a6500", fontWeight: "800" }}>Keep Rs200 wallet balance for uninterrupted charging</Text>
      </FxCard>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>TRANSACTIONS</Text>
        <Text onPress={() => router.push("/history")} style={{ color: fx.blue, fontWeight: "900" }}>View All</Text>
      </View>
      <FxCard style={{ paddingVertical: 6 }}>
        {walletTransactions.map((item) => (
          <View key={`${item.title}-${item.time}`} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: fx.line }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: item.amount.startsWith("+") ? "#e3f8f4" : fx.cyan, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={item.amount.startsWith("+") ? "arrow-down" : "flash"} size={18} color={item.amount.startsWith("+") ? fx.teal : fx.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontWeight: "900" }}>{item.title}</Text>
              <Text style={{ color: fx.faint, fontSize: 12 }}>{item.time}</Text>
            </View>
            <Text style={{ color: item.amount.startsWith("+") ? fx.teal : fx.ink, fontWeight: "900" }}>{item.amount}</Text>
          </View>
        ))}
      </FxCard>
    </FxScreen>
  );
}
