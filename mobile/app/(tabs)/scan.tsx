import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { fx, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function Scan() {
  return (
    <FxScreen scroll={false} style={{ backgroundColor: fx.navy }}>
      <TopChromeBar subtitle="" />
      <View style={{ flex: 1, backgroundColor: fx.navy, paddingHorizontal: 18, paddingTop: 28, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900", textAlign: "center" }}>Scan charger QR</Text>
        <Text style={{ color: "#b9c9dc", fontSize: 11, lineHeight: 14, marginTop: 4, textAlign: "center" }}>Works across supported partner networks</Text>

        <View style={{ marginTop: 64, width: 194, height: 194, borderRadius: 18, borderWidth: 3, borderColor: "#57f0b4", backgroundColor: "rgba(14,35,61,0.72)", alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: "80%", height: 2, backgroundColor: "#67f1ab", position: "absolute", top: "50%", marginTop: -1 }} />
          <Ionicons name="qr-code-outline" size={58} color="rgba(255,255,255,0.38)" />
        </View>

        <View style={{ marginTop: 28, width: 40, height: 40, borderRadius: 20, backgroundColor: "#233f62", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="flash-outline" size={18} color="#fff" />
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push("/enter-charger")} style={{ marginTop: 24, paddingVertical: 10, paddingHorizontal: 10 }}>
          <Text style={{ color: "#73c6ff", fontSize: 12, fontWeight: "800", textDecorationLine: "underline" }}>QR damaged? Enter charger ID</Text>
        </Pressable>
        <View style={{ marginTop: 18, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="shield-checkmark-outline" size={12} color="#8af0be" />
          <Text style={{ color: "#9fd7c7", fontSize: 10, fontWeight: "800" }}>Shubh chargers also support offline access</Text>
        </View>
      </View>
    </FxScreen>
  );
}
