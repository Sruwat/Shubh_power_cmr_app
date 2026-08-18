import { Text, View } from "react-native";
import { Cta, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function OfflineAccess() {
  return (
    <FxScreen>
      <TopChromeBar title="Offline Access" subtitle="Keep charging even with weak signal" />
      <View style={{ alignItems: "center", paddingTop: 14, gap: 8 }}>
        <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: "#e7f2ff", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#176fe0", fontSize: 26 }}>⟲</Text>
        </View>
        <Text style={{ color: "#13213b", fontSize: 26, fontWeight: "500", textAlign: "center" }}>Offline access</Text>
        <Text style={{ color: "#7c8496", fontSize: 11, textAlign: "center" }}>Keep charging even with weak signal</Text>
      </View>
      <FxCard>
        <Text style={{ color: "#05072d", fontWeight: "900" }}>What is saved offline</Text>
        <Text style={{ color: "#56607a", lineHeight: 22 }}>Your QR tokens, last wallet balance, saved station list, and the booking confirmation are cached locally for quick access.</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Pill label="QR tokens" selected />
          <Pill label="Wallet balance" selected />
          <Pill label="Saved stations" selected />
        </View>
      </FxCard>
      <FxCard>
        <Text style={{ color: "#05072d", fontWeight: "900" }}>Offline checklist</Text>
        <Text style={{ color: "#56607a", lineHeight: 22 }}>1. Open your charger before leaving network{"\n"}2. Save the connector ID{"\n"}3. Keep the booking confirmation handy</Text>
      </FxCard>
      <Cta label="Open Saved Access" icon="lock-open-outline" onPress={() => undefined} />
    </FxScreen>
  );
}
