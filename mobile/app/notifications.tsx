import { Ionicons } from "@expo/vector-icons";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppHeader, Card, Caption, Screen, SectionTitle } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { Text, View } from "react-native";

const notifications = [
  ["flash", "Charging Complete", "2 min ago", "Your Nexon EV at Sector 62 is fully charged. Session ended."],
  ["cash", "Refund Processed", "32 min ago", "Rs 123 refunded to your Shubh Power Wallet."],
  ["calendar", "Slot Reminder", "1 hr ago", "Your booking at DLF Mall starts in 30 minutes."],
  ["gift", "Offer Alert", "Yesterday", "Get Rs 50 cashback on your next 3 sessions. Valid till 31 Jul."]
] as const;

export default function Notifications() {
  return (
    <>
      <Screen scroll>
        <AppHeader title="Notifications" subtitle="Charging, wallet and station updates" />
        {notifications.map(([icon, title, time, body]) => (
          <Card key={title}>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <Ionicons name={`${icon}-outline` as any} size={24} color={colors.primary} />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: spacing.sm }}>
                  <SectionTitle>{title}</SectionTitle>
                  <Caption>{time}</Caption>
                </View>
                <Text style={{ color: colors.body, lineHeight: 22 }}>{body}</Text>
              </View>
            </View>
          </Card>
        ))}
      </Screen>
      <AppBottomNav active="profile" />
    </>
  );
}
