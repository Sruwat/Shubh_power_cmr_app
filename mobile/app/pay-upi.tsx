import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { BackHeader, BottomCta, fx, FxCard, FxInput, FxScreen, ListRow } from "@/components/Futuristic";

export default function PayUpi() {
  const [upi, setUpi] = useState("");
  return (
    <FxScreen>
      <BackHeader title="Pay via UPI" onBack={() => router.back()} />
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Enter UPI ID</Text>
        <FxInput value={upi} onChangeText={setUpi} placeholder="yourname@okaxis" autoCapitalize="none" />
      </FxCard>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>SAVED UPI IDS</Text>
      <FxCard>
        {["rahul@okaxis", "rahul.sharma@ybl", "9876543210@okaxis"].map((item) => <ListRow key={item} icon="phone-portrait-outline" title={item} onPress={() => setUpi(item)} />)}
      </FxCard>
      <BottomCta label="Pay Rs466" onPress={() => router.push("/starting-session")} />
    </FxScreen>
  );
}
