import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";

const queryClient = new QueryClient();

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

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
