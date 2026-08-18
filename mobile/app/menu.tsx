import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { fx, FxScreen, ListRow } from "@/components/Futuristic";
import { BrandLogo } from "@/components/Futuristic";

export default function Menu() {
  return (
    <FxScreen>
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <BrandLogo variant="wordmark" width={126} />
        <Pressable onPress={() => router.back()} style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: "#eef3f8", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>X</Text>
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 12, gap: 12 }}>
        <View style={{ borderRadius: 16, backgroundColor: "#e9f1ff", padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#1060c7", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>SS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: fx.ink, fontWeight: "900" }}>Shankaranand</Text>
            <Text style={{ color: fx.muted, fontSize: 10 }}>Tata Nexon EV · 68%</Text>
          </View>
          <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>›</Text>
        </View>
        <View style={{ borderRadius: 16, backgroundColor: "#fff1f1", paddingHorizontal: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "#df3550", fontSize: 18 }}>⊙</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#df3550", fontWeight: "900", fontSize: 13 }}>Need urgent charging help?</Text>
            <Text style={{ color: "#df3550", fontSize: 10 }}>Open Shubh Rescue</Text>
          </View>
          <Text style={{ color: "#df3550", fontSize: 18, fontWeight: "900" }}>›</Text>
        </View>
        <Section title="CHARGE" items={[
          ["map-outline", "Find chargers", "/(tabs)"],
          ["qr-code-outline", "Scan charger", "/(tabs)/scan"],
          ["map-outline", "Plan a trip", "/trip-plan"],
          ["time-outline", "QueuePass", "/queuepass"],
          ["heart-outline", "Saved stations", "/saved"]
        ]} />
        <Section title="ACTIVITY" items={[
          ["time-outline", "Charging history", "/history"],
          ["document-text-outline", "Shubh OneBill", "/onebill"],
          ["star-outline", "Rewards", "/rewards"],
          ["car-sport-outline", "My vehicles", "/vehicles"],
          ["card-outline", "Payment methods", "/payments"]
        ]} />
        <Section title="HELP & ACCOUNT" items={[
          ["medkit-outline", "Shubh Rescue", "/rescue"],
          ["headset-outline", "Help & support", "/support"],
          ["notifications-outline", "Notifications", "/notifications"],
          ["settings-outline", "Settings", "/settings"],
          ["information-circle-outline", "About Shubh Power", "/about"]
        ]} />
      </View>
    </FxScreen>
  );
}

function Section({ title, items }: { title: string; items: Array<[keyof typeof Ionicons.glyphMap, string, string]> }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: "#a4afc1", fontSize: 10, fontWeight: "900", letterSpacing: 1.2 }}>{title}</Text>
      {items.map(([icon, label, href]) => (
        <ListRow key={label} icon={icon} title={label} onPress={() => router.push(href as never)} />
      ))}
    </View>
  );
}
