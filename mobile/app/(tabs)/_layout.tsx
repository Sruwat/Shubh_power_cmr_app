import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/design-system/tokens";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#53657b",
        headerShown: false,
        tabBarStyle: {
          marginHorizontal: 4,
          marginBottom: Math.max(insets.bottom, 4),
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 0,
          borderRadius: 22,
          backgroundColor: "#fff",
          shadowColor: "#0b1b33",
          shadowOpacity: 0.1,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 12
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "900" },
        tabBarItemStyle: { borderRadius: 16, marginHorizontal: 2, paddingTop: 2 }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="scan" options={{ title: "Scan", tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="activity" options={{ title: "Pay", tabBarIcon: ({ color }) => <Ionicons name="card-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
    </Tabs>
  );
}
