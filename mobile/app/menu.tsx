import { router } from "expo-router";
import { Text } from "react-native";
import { BackHeader, fx, FxCard, FxScreen, ListRow } from "@/components/Futuristic";

export default function Menu() {
  return (
    <FxScreen>
      <BackHeader title="Menu" onBack={() => router.back()} />
      <FxCard>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>CHARGING</Text>
        <ListRow icon="map-outline" title="Find chargers" onPress={() => router.push("/(tabs)")} />
        <ListRow icon="calendar-outline" title="Bookings" onPress={() => router.push("/history")} />
        <ListRow icon="qr-code-outline" title="Scan charger" onPress={() => router.push("/(tabs)/scan")} />
        <ListRow icon="flash-outline" title="Live session" onPress={() => router.push("/charging/SP-DEMO-LIVE")} />
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>ACCOUNT</Text>
        <ListRow icon="wallet-outline" title="Wallet" onPress={() => router.push("/(tabs)/activity")} />
        <ListRow icon="card-outline" title="Saved payments" onPress={() => router.push("/payments")} />
        <ListRow icon="car-sport-outline" title="My vehicles" onPress={() => router.push("/vehicles")} />
        <ListRow icon="star-outline" title="Saved stations" onPress={() => router.push("/saved")} />
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>HELP</Text>
        <ListRow icon="headset-outline" title="Support" onPress={() => router.push("/support")} />
        <ListRow icon="settings-outline" title="Settings" onPress={() => router.push("/settings")} />
      </FxCard>
    </FxScreen>
  );
}
