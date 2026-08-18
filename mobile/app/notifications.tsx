import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Cta, FxCard, FxScreen, fx } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

const notifications = [
  ["flash", "Charging Complete", "2 min ago", "Your Nexon EV at Sector 62 is fully charged. Session ended."],
  ["cash", "Refund Processed", "32 min ago", "Rs 123 refunded to your Shubh Power Wallet."],
  ["calendar", "Slot Reminder", "1 hr ago", "Your booking at DLF Mall starts in 30 minutes."],
  ["gift", "Offer Alert", "Yesterday", "Get Rs 50 cashback on your next 3 sessions. Valid till 31 Jul."]
] as const;

const notificationIcons = {
  flash: "flash-outline",
  cash: "cash-outline",
  calendar: "calendar-outline",
  gift: "gift-outline"
} as const;

export default function Notifications() {
  return (
    <FxScreen>
      <TopChromeBar title="Notifications" subtitle="Charging, wallet and station updates" />
      <FxCard style={{ backgroundColor: fx.blue2 }}>
        <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32, fontWeight: "900" }}>Stay on top of every charge</Text>
        <Text style={{ color: "#dbe7ff", marginTop: 6, lineHeight: 22, fontWeight: "700" }}>Live updates from charging sessions, wallet activity, bookings and support replies appear here.</Text>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Cta label="Mark all read" kind="secondary" onPress={() => {}} />
          </View>
          <View style={{ flex: 1 }}>
            <Cta label="Open support" kind="teal" onPress={() => router.push("/support")} />
          </View>
        </View>
      </FxCard>

      {notifications.map(([icon, title, time, body]) => (
        <FxCard key={title}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: "#e6f6ff", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={notificationIcons[icon]} size={22} color={fx.blue} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900", flex: 1 }}>{title}</Text>
                <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "800" }}>{time}</Text>
              </View>
              <Text style={{ color: fx.muted, lineHeight: 22, fontWeight: "700" }}>{body}</Text>
            </View>
          </View>
        </FxCard>
      ))}
    </FxScreen>
  );
}
