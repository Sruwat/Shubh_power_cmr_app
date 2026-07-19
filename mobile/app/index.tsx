import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const token = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);
  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f4f8fb" }}>
        <ActivityIndicator color="#168ddd" />
      </View>
    );
  }
  return <Redirect href={token || onboardingCompleted ? "/(tabs)" : "/onboarding"} />;
}
