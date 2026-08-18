import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { fx, FxCard, FxScreen, ListRow } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";
import { useAuthStore } from "@/store/auth";

export default function Profile() {
  const localName = useAuthStore((state) => state.profileName);
  const localPhone = useAuthStore((state) => state.profilePhone);
  const displayName = localName ?? "Shubh Power user";
  const phone = localPhone ?? "9876543210";
  const initials = displayName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase() || "SP";

  return (
    <FxScreen>
      <TopChromeBar title="" subtitle="" />
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.vehicleLine}>+91 {phone} · Tata Nexon EV</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push("/profile-edit")} style={styles.editButton}>
            <Text style={styles.editText}>Edit profile</Text>
          </Pressable>
        </View>

        <View style={styles.statsStrip}>
          <ProfileStat value="18" label="Sessions" />
          <ProfileStat value="268 kWh" label="Energy" />
          <ProfileStat value="41 kg" label="CO2 saved" />
        </View>

        <FxCard style={{ gap: 0, padding: 0 }}>
          <ProfileRow icon="car-sport-outline" title="My vehicles" subtitle="Compatibility & range" onPress={() => router.push("/vehicles")} />
          <ProfileRow icon="time-outline" title="Charging history" subtitle="All networks in one place" onPress={() => router.push("/history")} />
          <ProfileRow icon="document-text-outline" title="Shubh OneBill" subtitle="Invoices & monthly summary" onPress={() => router.push("/onebill")} />
          <ProfileRow icon="star-outline" title="Rewards" subtitle="Miles & Rescue Credits" onPress={() => router.push("/rewards")} />
          <ProfileRow icon="chatbubble-outline" title="Help & support" subtitle="Tickets & live assistance" onPress={() => router.push("/support")} />
          <ProfileRow icon="settings-outline" title="Settings" subtitle="Preferences & privacy" onPress={() => router.push("/settings")} />
        </FxCard>
      </View>
    </FxScreen>
  );
}

function ProfileRow({ icon, title, subtitle, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return (
    <ListRow
      icon={icon}
      title={title}
      subtitle={subtitle}
      onPress={onPress}
    />
  );
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = {
  avatarCard: {
    alignItems: "center" as const,
    paddingTop: 14,
    paddingBottom: 2,
    gap: 5
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1060c7",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  avatarText: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "900" as const
  },
  name: {
    color: fx.ink,
    fontSize: 18,
    fontWeight: "900" as const
  },
  vehicleLine: {
    color: fx.muted,
    fontSize: 10,
    fontWeight: "700" as const
  },
  editButton: {
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  editText: {
    color: fx.blue,
    fontSize: 11,
    fontWeight: "900" as const
  },
  statsStrip: {
    flexDirection: "row" as const,
    borderWidth: 1,
    borderColor: "#dde6ef",
    borderRadius: 14,
    backgroundColor: "#fff",
    overflow: "hidden" as const,
    marginTop: 2
  },
  statCell: {
    flex: 1,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#dde6ef"
  },
  statValue: {
    color: fx.ink,
    fontSize: 16,
    fontWeight: "900" as const
  },
  statLabel: {
    color: fx.muted,
    fontSize: 10,
    fontWeight: "700" as const
  }
};
