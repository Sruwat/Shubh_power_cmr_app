import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { fx, FxCard, FxScreen } from "@/components/Futuristic";
import { walletTransactions } from "@/data/experience";
import { TopChromeBar } from "@/components/ShubhShell";

export default function Wallet() {
  return (
    <FxScreen>
      <TopChromeBar subtitle="" />
      <View style={styles.topPad}>
        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>SHUBHPAY</Text>
          <Text style={styles.heroTitle}>No recharge. No wallet.{`\n`}Just charge.</Text>
          <Text style={styles.heroSub}>Authorize once, then pay the exact final amount.</Text>
          <View style={styles.heroPill}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#fff" />
            <Text style={styles.heroPillText}>₹1,834 saved from being trapped in top-up wallets</Text>
          </View>
        </View>

        <View style={styles.tilesRow}>
          <ActionTile icon="card-outline" title="Payment methods" subtitle="UPI & cards" onPress={() => router.push("/payments")} />
          <ActionTile icon="document-text-outline" title="OneBill" subtitle="All invoices" onPress={() => router.push("/onebill")} />
          <ActionTile icon="star-outline" title="Rewards" subtitle="240 Miles" onPress={() => router.push("/rewards")} />
        </View>

        <FxCard style={styles.paymentsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader}>Recent payments</Text>
            <Text onPress={() => router.push("/history")} style={styles.viewAll}>View all</Text>
          </View>
          {walletTransactions.slice(0, 3).map((item, index) => (
            <View key={`${item.title}-${item.time}`} style={[styles.paymentRow, index === 2 && { borderBottomWidth: 0 }]}>
              <View style={styles.paymentAvatar}>
                <Text style={styles.paymentAvatarText}>{item.title[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentTitle}>{item.title}</Text>
                <Text style={styles.paymentMeta}>{item.time} · Exact paid</Text>
              </View>
              <Text style={styles.paymentAmount}>{item.amount.replace("+", "₹")}</Text>
            </View>
          ))}
        </FxCard>
      </View>
    </FxScreen>
  );
}

function ActionTile({ icon, title, subtitle, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionTile, pressed && { opacity: 0.88 }]}>
      <FxCard style={styles.actionTileInner}>
        <Ionicons name={icon} size={22} color={fx.blue} />
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </FxCard>
    </Pressable>
  );
}

const styles = {
  topPad: {
    paddingHorizontal: 16,
    gap: 12
  },
  heroCard: {
    borderRadius: 18,
    backgroundColor: "#0a67d1",
    padding: 16,
    gap: 8,
    shadowColor: "#0b1b33",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  heroKicker: {
    color: "#d4f0ff",
    fontSize: 11,
    fontWeight: "900" as const,
    letterSpacing: 1.3
  },
  heroTitle: {
    color: "#fff",
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "500" as const
  },
  heroSub: {
    color: "#cfe6ff",
    fontSize: 11,
    fontWeight: "700" as const
  },
  heroPill: {
    marginTop: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6
  },
  heroPillText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800" as const
  },
  tilesRow: {
    flexDirection: "row" as const,
    gap: 10
  },
  actionTile: {
    flex: 1,
    minHeight: 88
  },
  actionTileInner: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 88,
    paddingVertical: 14,
    gap: 5
  },
  actionTitle: {
    color: fx.ink,
    fontSize: 12,
    fontWeight: "900" as const,
    textAlign: "center" as const
  },
  actionSubtitle: {
    color: fx.muted,
    fontSize: 10,
    fontWeight: "700" as const,
    textAlign: "center" as const
  },
  paymentsCard: {
    gap: 0,
    paddingVertical: 14
  },
  cardHeaderRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 2,
    paddingBottom: 10
  },
  cardHeader: {
    color: fx.ink,
    fontSize: 16,
    fontWeight: "900" as const
  },
  viewAll: {
    color: fx.blue,
    fontSize: 12,
    fontWeight: "900" as const
  },
  paymentRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: fx.line
  },
  paymentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eaf2ff",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  paymentAvatarText: {
    color: fx.blue,
    fontWeight: "900" as const
  },
  paymentTitle: {
    color: fx.ink,
    fontSize: 13,
    fontWeight: "900" as const
  },
  paymentMeta: {
    color: "#8b94a7",
    fontSize: 10,
    fontWeight: "700" as const
  },
  paymentAmount: {
    color: fx.ink,
    fontSize: 13,
    fontWeight: "900" as const
  }
};
