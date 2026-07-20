import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Animated, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";
import { BrandLogo } from "@/components/Futuristic";

const queryClient = new QueryClient();

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const [showLaunch, setShowLaunch] = useState(true);
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    void hydrate();
    const timer = setTimeout(() => setShowLaunch(false), 1550);
    return () => clearTimeout(timer);
  }, [hydrate]);

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 760, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 760, useNativeDriver: true })
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (showLaunch) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" backgroundColor="#151343" translucent={false} />
        <View style={{ flex: 1, backgroundColor: "#151343", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              width: 360,
              height: 360,
              borderRadius: 180,
              backgroundColor: "rgba(89,210,254,0.28)",
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1.1] }) }],
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.64] })
            }}
          />
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: 210,
              backgroundColor: "rgba(35,196,181,0.18)",
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1.08, 0.9] }) }],
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.46] })
            }}
          />
          <Animated.View style={{ transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] }) }] }}>
            <BrandLogo variant="mark" width={118} />
          </Animated.View>
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <BrandLogo variant="wordmark" width={152} />
          </View>
          <Animated.Text
            style={{
              marginTop: 22,
              color: "#fff",
              fontSize: 28,
              fontWeight: "900",
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1] }),
              transform: [{ translateY: pulse.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }]
            }}
          >
            Shubh Power
          </Animated.Text>
          <Text style={{ marginTop: 6, color: "#59d2fe", fontSize: 12, fontWeight: "900", letterSpacing: 1.6 }}>EV CHARGING</Text>
          <Text style={{ position: "absolute", bottom: 64, color: "#59d2fe", fontSize: 12, fontWeight: "900", letterSpacing: 1.8 }}>POWERING GREEN MOBILITY</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#f4f8fb" translucent={false} />
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="search" />
            <Stack.Screen name="filters" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="history" />
            <Stack.Screen name="support" />
            <Stack.Screen name="saved" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="menu" />
            <Stack.Screen name="vehicles" />
            <Stack.Screen name="profile-edit" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="select-connector" />
            <Stack.Screen name="book-slot" />
            <Stack.Screen name="booking-confirmed" />
            <Stack.Screen name="confirm-pay" />
            <Stack.Screen name="starting-session" />
            <Stack.Screen name="charging-complete" />
            <Stack.Screen name="charging-failed" />
            <Stack.Screen name="payment-failed" />
            <Stack.Screen name="invoice" />
            <Stack.Screen name="session-detail" />
            <Stack.Screen name="add-money" />
            <Stack.Screen name="pay-upi" />
            <Stack.Screen name="card-payment" />
            <Stack.Screen name="enter-charger" />
            <Stack.Screen name="navigation" />
            <Stack.Screen name="support-ticket" />
            <Stack.Screen name="ticket/[id]" />
            <Stack.Screen name="station/[id]" />
            <Stack.Screen name="charging/[sessionId]" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
