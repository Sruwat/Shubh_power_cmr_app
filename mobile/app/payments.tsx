import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text } from "react-native";
import { fx, FxCard, FxScreen, ListRow } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function Payments() {
  return (
    <FxScreen>
      <TopChromeBar title="Saved payments" subtitle="" />
      <FxCard>
        <ListRow icon="phone-portrait-outline" title="rahul@okaxis" subtitle="Google Pay" right={<Text style={{ color: fx.blue, fontSize: 12, fontWeight: "900" }}>Primary</Text>} />
        <ListRow icon="phone-portrait-outline" title="9876543210@ybl" subtitle="PhonePe" right={<Ionicons name="trash-outline" size={18} color={fx.red} />} />
        <ListRow icon="card-outline" title="•••• •••• •••• 4242" subtitle="Visa Credit" right={<Ionicons name="trash-outline" size={18} color={fx.red} />} />
      </FxCard>
      <FxCard style={{ borderStyle: "dashed", alignItems: "center" }}>
        <Text onPress={() => router.push("/card-payment")} style={{ color: fx.blue, fontWeight: "900" }}>+ Add Payment Method</Text>
      </FxCard>
    </FxScreen>
  );
}
