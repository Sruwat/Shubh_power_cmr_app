import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { EnergyCard, fx, FxCard, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function OneBill() {
  return (
    <FxScreen>
      <TopChromeBar title="Shubh OneBill" subtitle="One statement for every charge" />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <Text style={{ color: "#dbe7ff", fontSize: 11, fontWeight: "900", letterSpacing: 1.3 }}>SHUBHPAY</Text>
        <Text style={{ color: "#fff", fontSize: 34, lineHeight: 40, fontWeight: "900" }}>No recharge. No wallet.{`\n`}Just charge.</Text>
        <Text style={{ color: "#c7d4ff", lineHeight: 21 }}>Authorize once, then pay the exact final amount.</Text>
        <View style={{ borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 12, paddingVertical: 10 }}>
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "900" }}>₹1,834 saved from being trapped in top-up wallets</Text>
        </View>
      </EnergyCard>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <FxCard style={{ flex: 1, alignItems: "center", paddingVertical: 18, gap: 6 }}>
          <Ionicons name="card-outline" size={22} color={fx.blue} />
          <Text style={{ color: fx.ink, fontSize: 12, fontWeight: "900", textAlign: "center" }}>Payment methods</Text>
          <Text style={{ color: fx.muted, fontSize: 10 }}>UPI & cards</Text>
        </FxCard>
        <FxCard style={{ flex: 1, alignItems: "center", paddingVertical: 18, gap: 6 }}>
          <Ionicons name="document-text-outline" size={22} color={fx.blue} />
          <Text style={{ color: fx.ink, fontSize: 12, fontWeight: "900", textAlign: "center" }}>OneBill</Text>
          <Text style={{ color: fx.muted, fontSize: 10 }}>All invoices</Text>
        </FxCard>
        <FxCard style={{ flex: 1, alignItems: "center", paddingVertical: 18, gap: 6 }}>
          <Ionicons name="star-outline" size={22} color={fx.blue} />
          <Text style={{ color: fx.ink, fontSize: 12, fontWeight: "900", textAlign: "center" }}>Rewards</Text>
          <Text style={{ color: fx.muted, fontSize: 10 }}>240 Miles</Text>
        </FxCard>
      </View>
      <FxCard style={{ gap: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10 }}>
          <Text style={{ color: fx.ink, fontWeight: "900" }}>Recent payments</Text>
          <Text style={{ color: fx.blue, fontWeight: "900" }}>View all</Text>
        </View>
        {[
          ["Statiq MLCP Sec-18", "Today · 10:24 AM · Exact paid", "₹489.60"],
          ["GILDA DLF Mall", "12 Aug · 6:18 PM · Exact paid", "₹322.40"],
          ["Jo-bp pulse Dwarka", "10 Aug · 3:40 PM · Exact paid", "₹690.20"]
        ].map(([title, meta, amount], index) => (
          <View key={title} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderTopWidth: index === 0 ? 1 : 0, borderTopColor: fx.line, borderBottomWidth: index < 2 ? 1 : 0, borderBottomColor: fx.line }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#eaf2ff", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: fx.blue, fontWeight: "900" }}>{title[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fx.ink, fontWeight: "900" }}>{title}</Text>
              <Text style={{ color: fx.muted, fontSize: 11 }}>{meta}</Text>
            </View>
            <Text style={{ color: fx.ink, fontWeight: "900" }}>{amount}</Text>
          </View>
        ))}
      </FxCard>
    </FxScreen>
  );
}
