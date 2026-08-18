import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, type } from "@/design-system/tokens";

type TabKey = "home" | "map" | "scan" | "activity" | "profile";

const tabs: Array<{ key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; href: string }> = [
  { key: "home", label: "Home", icon: "home-outline", href: "/(tabs)" },
  { key: "map", label: "Map", icon: "map-outline", href: "/(tabs)/map" },
  { key: "scan", label: "Scan", icon: "qr-code-outline", href: "/(tabs)/scan" },
  { key: "activity", label: "Pay", icon: "card-outline", href: "/(tabs)/activity" },
  { key: "profile", label: "Profile", icon: "person-outline", href: "/(tabs)/profile" }
];

export function AppBottomNav({ active }: { active: TabKey }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable key={tab.key} accessibilityRole="button" accessibilityLabel={tab.label} onPress={() => router.replace(tab.href as never)} style={styles.item}>
            <Ionicons name={tab.icon} size={24} color={selected ? colors.primary : colors.body} />
            <Text style={[styles.label, selected && styles.labelSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#d7eefb",
    backgroundColor: "rgba(255,255,255,0.98)",
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    shadowColor: "#0b1b33",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 18
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2, minHeight: 54 },
  label: { color: colors.body, fontSize: type.tab, fontWeight: "800" },
  labelSelected: { color: colors.primary }
});
