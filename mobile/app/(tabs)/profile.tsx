import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { api } from "@/api/client";
import { Cta, EnergyCard, fx, FxCard, FxHeader, FxScreen, ListRow, StatTile } from "@/components/Futuristic";
import { useAuthStore } from "@/store/auth";

export default function Profile() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const me = useQuery({ queryKey: ["me"], queryFn: async () => (await api.get("/api/v1/users/me")).data, retry: false });
  const phone = me.data?.phone ?? "9876543210";
  const addVehicle = useMutation({
    mutationFn: async () => (await api.post("/api/v1/vehicles", { name: "Tata Nexon EV", connector_types: ["CCS2"] })).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      router.push("/vehicles");
    },
    onError: () => {
      Alert.alert("Demo vehicle", "Opening your local vehicle garage.");
      router.push("/vehicles");
    }
  });

  return (
    <FxScreen>
      <FxHeader title="Profile" subtitle="Account, vehicles and preferences" menuPress={() => router.push("/menu")} />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 62, height: 62, borderRadius: 24, backgroundColor: "#6474a0", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 25, fontWeight: "900" }}>RS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontSize: 21, fontWeight: "900" }}>Rahul Sharma</Text>
            <Text style={{ color: "#dbe7ff", fontWeight: "800" }}>+91 {phone}</Text>
            <Text style={{ color: "#b9c7ed", fontSize: 12 }}>rahul.sharma@gmail.com</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit profile" onPress={() => router.push("/profile-edit")}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <StatTile label="Sessions" value="12" tone="navy" />
          <StatTile label="kWh Used" value="142" tone="blue" />
          <StatTile label="CO2 Saved" value="51 kg" tone="teal" />
        </View>
      </EnergyCard>

      <FxCard>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: fx.ink, fontSize: 17, fontWeight: "900" }}>My Vehicles (1)</Text>
          <Text onPress={() => router.push("/vehicles")} style={{ color: fx.blue, fontWeight: "900" }}>Manage</Text>
        </View>
        <ListRow icon="car-sport-outline" title="Tata Nexon EV" subtitle="DL01AB1234 - CCS2" right={<Text style={{ color: fx.blue, fontSize: 12, fontWeight: "900" }}>Primary</Text>} />
        <Cta label="Add vehicle" icon="car-outline" onPress={() => addVehicle.mutate()} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>ACCOUNT</Text>
        <ListRow icon="car-sport-outline" title="My Vehicles" onPress={() => router.push("/vehicles")} />
        <ListRow icon="card-outline" title="Saved Payments" onPress={() => router.push("/payments")} />
        <ListRow icon="star-outline" title="Saved Stations" onPress={() => router.push("/saved")} />
        <ListRow icon="calendar-outline" title="Booking History" onPress={() => router.push("/history")} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>PREFERENCES</Text>
        <ListRow icon="notifications-outline" title="Notifications" onPress={() => router.push("/notifications")} />
        <ListRow icon="moon-outline" title="Dark Mode Preview" onPress={() => router.push("/settings")} />
        <ListRow icon="settings-outline" title="Settings" onPress={() => router.push("/settings")} />
        <ListRow icon="headset-outline" title="Support" onPress={() => router.push("/support")} />
      </FxCard>

      <Pressable accessibilityRole="button" onPress={() => void logout().then(() => router.replace("/onboarding"))} style={{ height: 54, borderRadius: 16, borderWidth: 1, borderColor: fx.blue, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, backgroundColor: "#fff" }}>
        <Ionicons name="log-out-outline" size={18} color={fx.blue} />
        <Text style={{ color: fx.blue, fontWeight: "900", fontSize: 16 }}>Logout</Text>
      </Pressable>
    </FxScreen>
  );
}
