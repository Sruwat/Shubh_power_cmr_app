import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { fx, FxCard, FxScreen, ListRow } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function Settings() {
  return (
    <FxScreen>
      <TopChromeBar title="Settings" subtitle="" />
      <FxCard><Text style={{ color: fx.faint, fontWeight: "900" }}>DISPLAY</Text><ListRow title="Dark Mode" subtitle="Switch to dark theme" right={<Ionicons name="toggle-outline" size={34} color={fx.line} />} /></FxCard>
      <FxCard><Text style={{ color: fx.faint, fontWeight: "900" }}>NOTIFICATIONS</Text><ListRow title="Push Notifications" subtitle="Session updates, offers" right={<Ionicons name="toggle" size={34} color={fx.blue} />} /></FxCard>
      <FxCard><Text style={{ color: fx.faint, fontWeight: "900" }}>PRIVACY</Text><ListRow title="Background Location" subtitle="Track while app is closed" right={<Ionicons name="toggle-outline" size={34} color={fx.line} />} /></FxCard>
      <FxCard><ListRow title="App Version" right={<Text style={{ color: fx.ink, fontWeight: "800" }}>2.4.1 (Build 124)</Text>} /></FxCard>
    </FxScreen>
  );
}
