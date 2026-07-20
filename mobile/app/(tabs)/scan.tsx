import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxCard, FxInput, FxScreen, HeaderLogoBadge } from "@/components/Futuristic";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [chargerId, setChargerId] = useState("");

  return (
    <FxScreen>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: fx.ink, fontSize: 30, lineHeight: 36, fontWeight: "900" }}>Scan charger</Text>
          <Text style={{ color: fx.muted, fontSize: 14, fontWeight: "700", marginTop: -2 }}>Point your camera at the QR code on the charger</Text>
        </View>
        <HeaderLogoBadge compact />
      </View>

      {permission?.granted ? (
        <View style={{ height: 330, overflow: "hidden", borderRadius: 20, backgroundColor: fx.navy }}>
          <CameraView style={{ flex: 1 }} barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={() => router.push("/select-connector")} />
          <View pointerEvents="none" style={{ position: "absolute", left: 70, right: 70, top: 78, bottom: 78, borderWidth: 3, borderColor: fx.teal, borderRadius: 22 }} />
          <Text style={{ position: "absolute", left: 20, right: 20, bottom: 18, color: "#fff", textAlign: "center", fontWeight: "800" }}>QR codes are on the charger unit or printed nearby</Text>
        </View>
      ) : (
        <EnergyCard>
          <Ionicons name="qr-code-outline" size={50} color={fx.teal} />
          <Text style={{ color: "#fff", fontSize: 25, lineHeight: 30, fontWeight: "900" }}>Enable camera scanning</Text>
          <Text style={{ color: "#8b91ae", fontSize: 16, lineHeight: 23, fontWeight: "700" }}>Camera access is used only to scan charger QR codes.</Text>
          <Cta label="Allow camera" icon="camera-outline" kind="secondary" onPress={() => void requestPermission()} />
        </EnergyCard>
      )}

      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Enter charger code</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>If the QR code is damaged, enter the charger code printed near the connector.</Text>
        <FxInput value={chargerId} onChangeText={setChargerId} placeholder="e.g. SP-N62-CP01" autoCapitalize="characters" />
        <Cta label="Continue" icon="arrow-forward" disabled={!chargerId.trim()} onPress={() => router.push("/select-connector")} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 23, fontWeight: "900" }}>Charging steps</Text>
        {["Scan QR - Identify the charger securely.", "Confirm tariff - Review connector, price and payment method.", "Start charging - Track energy, time and cost live."].map((line, index) => (
          <View key={line} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: fx.cyan, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: fx.blue, fontWeight: "900" }}>{index + 1}</Text>
            </View>
            <Text style={{ color: fx.ink, flex: 1, fontWeight: "800", lineHeight: 21 }}>{line}</Text>
          </View>
        ))}
      </FxCard>

      <Pressable accessibilityRole="button" onPress={() => router.push("/enter-charger")} style={{ alignItems: "center", padding: 8 }}>
        <Text style={{ color: fx.blue, fontWeight: "900" }}>Enter Charger ID Manually</Text>
      </Pressable>
    </FxScreen>
  );
}
