import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandLogo, fx, ListRow } from "@/components/Futuristic";
import { DrawerProvider, useDrawer } from "@/components/drawerContext";
import { useAuthStore } from "@/store/auth";

export function AppDrawerProvider({ children }: { children: ReactNode }) {
  return <DrawerProvider>{children}</DrawerProvider>;
}

export function useAppDrawer() {
  return useDrawer();
}

export function AppDrawerOverlay() {
  const { isDrawerOpen, closeDrawer } = useAppDrawer();
  const x = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    Animated.timing(x, { toValue: isDrawerOpen ? 1 : 0, duration: 210, useNativeDriver: true }).start();
  }, [isDrawerOpen, x]);

  return (
    <Modal transparent visible={isDrawerOpen} animationType="none" onRequestClose={closeDrawer}>
      <View style={{ flex: 1 }}>
        <Pressable onPress={closeDrawer} style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(7,18,38,0.38)" }} />
        <Animated.View style={{ width: Math.min(width * 0.86, 328), flex: 1, backgroundColor: "#fff", transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-340, 0] }) }], shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 2, height: 0 }, shadowRadius: 18, elevation: 22 }}>
          <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <BrandLogo variant="wordmark" width={126} />
              <Pressable onPress={closeDrawer} style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: "#eef3f8", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="close" size={18} color={fx.ink} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 18 }}>
              <Pressable onPress={() => navigateAndClose(closeDrawer, "/profile")} style={{ borderRadius: 16, backgroundColor: "#e9f1ff", padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#1060c7", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "900" }}>SS</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: fx.ink, fontSize: 14, fontWeight: "900" }}>Shankaranand</Text>
                  <Text style={{ color: fx.muted, fontSize: 10, fontWeight: "700" }}>Tata Nexon EV · 68%</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={fx.ink} />
              </Pressable>

              <Pressable onPress={() => navigateAndClose(closeDrawer, "/rescue")} style={{ marginTop: 10, borderRadius: 16, backgroundColor: "#fff1f1", paddingHorizontal: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="medkit-outline" size={20} color="#df3550" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#df3550", fontSize: 13, fontWeight: "900" }}>Need urgent charging help?</Text>
                  <Text style={{ color: "#df3550", fontSize: 10 }}>Open Shubh Rescue</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#df3550" />
              </Pressable>

              <DrawerSection title="CHARGE" items={[
                ["map-outline", "Find chargers", "/(tabs)"],
                ["qr-code-outline", "Scan charger", "/(tabs)/scan"],
                ["map-outline", "Plan a trip", "/trip-plan"],
                ["time-outline", "QueuePass", "/queuepass"],
                ["heart-outline", "Saved stations", "/saved"]
              ]} closeDrawer={closeDrawer} />
              <DrawerSection title="ACTIVITY" items={[
                ["time-outline", "Charging history", "/history"],
                ["document-text-outline", "Shubh OneBill", "/onebill"],
                ["star-outline", "Rewards", "/rewards"],
                ["car-sport-outline", "My vehicles", "/vehicles"],
                ["card-outline", "Payment methods", "/payments"]
              ]} closeDrawer={closeDrawer} />
              <DrawerSection title="HELP & ACCOUNT" items={[
                ["medkit-outline", "Shubh Rescue", "/rescue"],
                ["headset-outline", "Help & support", "/support"],
                ["notifications-outline", "Notifications", "/notifications"],
                ["settings-outline", "Settings", "/settings"],
                ["information-circle-outline", "About Shubh Power", "/about"]
              ]} closeDrawer={closeDrawer} />
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function TopChromeBar({ title, subtitle: _subtitle, showBack = true }: { title?: string; subtitle?: string; showBack?: boolean }) {
  const { openDrawer } = useAppDrawer();
  const profileName = useAuthStore((state) => state.profileName);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const displayName = (profileName?.trim() || "Shankar").split(/\s+/)[0];
  const greeting = `${partOfDay(now)} ${displayName}`;
  const label = title ?? greeting;
  const initials = (profileName?.trim() || "SS")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#ebf1f6" }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Open menu" onPress={openDrawer} style={topButtonStyle}>
        <Ionicons name="menu-outline" size={21} color={fx.ink} />
      </Pressable>
      {showBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={topButtonStyle}>
          <Ionicons name="chevron-back" size={21} color={fx.ink} />
        </Pressable>
      ) : (
        <View style={topButtonStyle}>
          <Ionicons name="chevron-back" size={21} color="transparent" />
        </View>
      )}
      <BrandLogo variant="wordmark" width={88} />
      <View style={{ flex: 1, minWidth: 0, alignItems: "center", paddingHorizontal: 6 }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: fx.muted, fontSize: 11, fontWeight: "800", textAlign: "center" }}>
          {label}
        </Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Profile" onPress={() => router.push("/profile")} style={avatarButtonStyle}>
        <Text style={avatarTextStyle}>{initials}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push("/notifications")} style={topButtonStyle}>
        <Ionicons name="notifications-outline" size={19} color={fx.ink} />
      </Pressable>
    </View>
  );
}

function partOfDay(now: Date) {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return "Good morning,";
  if (hour >= 12 && hour < 17) return "Good afternoon,";
  if (hour >= 17 && hour < 21) return "Good evening,";
  return "Good night,";
}

function DrawerSection({ title, items, closeDrawer }: { title: string; items: Array<[keyof typeof Ionicons.glyphMap, string, string]>; closeDrawer: () => void }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ color: "#a4afc1", fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginBottom: 8 }}>{title}</Text>
      <View style={{ borderRadius: 16, paddingVertical: 4 }}>
        {items.map(([icon, label, href]) => (
          <ListRow key={label} icon={icon} title={label} onPress={() => navigateAndClose(closeDrawer, href)} />
        ))}
      </View>
    </View>
  );
}

function navigateAndClose(closeDrawer: () => void, href: string) {
  closeDrawer();
  requestAnimationFrame(() => router.push(href as never));
}

const topButtonStyle = { width: 39, height: 39, borderRadius: 13, backgroundColor: "#f4f8fb", borderWidth: 1, borderColor: "#e2ebf4", alignItems: "center", justifyContent: "center" } as const;
const avatarButtonStyle = { width: 39, height: 39, borderRadius: 19.5, backgroundColor: fx.blue2, alignItems: "center", justifyContent: "center" } as const;
const avatarTextStyle = { color: "#fff", fontSize: 14, fontWeight: "900" as const };
