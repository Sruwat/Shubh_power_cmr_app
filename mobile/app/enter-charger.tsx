import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { BackHeader, Cta, fx, FxCard, FxInput, FxScreen } from "@/components/Futuristic";

export default function EnterCharger() {
  const [chargerId, setChargerId] = useState("");
  return (
    <FxScreen>
      <BackHeader title="Enter Charger ID" onBack={() => router.back()} />
      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Enter Charger ID</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Find the ID on the charger unit label or the station display board.</Text>
        <FxInput value={chargerId} onChangeText={setChargerId} placeholder="e.g. SP-N62-CP01" autoCapitalize="characters" />
        <Text style={{ color: fx.faint, fontSize: 12 }}>Format: SP-[Area Code]-CP[Number]</Text>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Where to find the Charger ID</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>On the charger unit near the screen, station display board near the entrance, or your booking confirmation.</Text>
      </FxCard>
      <Cta label="Validate & Continue" disabled={!chargerId.trim()} onPress={() => router.push("/select-connector")} />
    </FxScreen>
  );
}
