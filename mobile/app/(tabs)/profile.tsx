import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { api } from "@/api/client";
import { Cta, EnergyCard, fx, FxCard, FxHeader, FxScreen, ListRow, StatTile } from "@/components/Futuristic";
import { useAuthStore } from "@/store/auth";

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const localName = useAuthStore((state) => state.profileName);
  const localEmail = useAuthStore((state) => state.profileEmail);
  const localPhone = useAuthStore((state) => state.profilePhone);
  const me = useQuery({ queryKey: ["me"], queryFn: async () => (await api.get("/api/v1/users/me")).data, retry: false });
  const vehicles = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => (await api.get("/api/v1/vehicles")).data as Array<Record<string, string | number | boolean | string[]>>,
    retry: false
  });
  const displayName = me.data?.name ?? localName ?? "Shubh Power user";
  const displayEmail = me.data?.email ?? localEmail ?? "Add email in Edit Profile";
  const phone = me.data?.phone ?? localPhone ?? "9876543210";
  const initials = displayName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase() || "SP";
  const savedVehicles = vehicles.data ?? [];
  const primaryVehicle = savedVehicles.find((vehicle) => vehicle.is_default) ?? savedVehicles[0];
  const vehicleConnector = Array.isArray(primaryVehicle?.connector_types) ? primaryVehicle.connector_types[0] : undefined;

  return (
    <FxScreen>
      <FxHeader title="Profile" subtitle="Account, vehicles and preferences" menuPress={() => router.push("/menu")} />
      <EnergyCard style={{ backgroundColor: fx.blue2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 62, height: 62, borderRadius: 24, backgroundColor: "#6474a0", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 25, fontWeight: "900" }}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontSize: 21, fontWeight: "900" }}>{displayName}</Text>
            <Text style={{ color: "#dbe7ff", fontWeight: "800" }}>+91 {phone}</Text>
            <Text style={{ color: "#b9c7ed", fontSize: 12 }}>{displayEmail}</Text>
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
          <Text style={{ color: fx.ink, fontSize: 17, fontWeight: "900" }}>My Vehicles ({savedVehicles.length})</Text>
          <Text onPress={() => router.push("/vehicles")} style={{ color: fx.blue, fontWeight: "900" }}>Manage</Text>
        </View>
        {primaryVehicle ? (
          <ListRow
            icon="car-sport-outline"
            title={String(primaryVehicle.name ?? "My EV")}
            subtitle={`${String(primaryVehicle.registration_number ?? "Registration pending")} - ${vehicleConnector ?? "Connector pending"}`}
            right={<Text style={{ color: fx.blue, fontSize: 12, fontWeight: "900" }}>Primary</Text>}
          />
        ) : (
          <Text style={{ color: fx.muted, lineHeight: 20 }}>No vehicle added yet. Add your EV manually or with a photo so charger matching becomes personal.</Text>
        )}
        <Cta label="Add vehicle" icon="car-outline" onPress={() => router.push({ pathname: "/vehicles", params: { add: "1" } })} />
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
