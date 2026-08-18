import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function StartingSession() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace("/charging/1"), 4200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FxScreen scroll={false} style={{ backgroundColor: fx.navy }}>
      <TopChromeBar title="Starting session" subtitle="" />
      <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 20 }}>
        <EnergyCard style={{ alignItems: "center", backgroundColor: "transparent", shadowOpacity: 0, elevation: 0, gap: 14 }}>
          <View style={{ width: 98, height: 98, borderRadius: 49, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="flash" size={44} color="#fff" />
          </View>
          <Text style={{ color: "#fff", fontSize: 27, fontWeight: "900" }}>Starting your charge…</Text>
          <Text style={{ color: "#dbe7ff", textAlign: "center" }}>Connector 01 · Statiq MLCP Noida Sec-18</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <View style={{ borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Payment authorized</Text></View>
            <View style={{ borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "900" }}>Connector ready</Text></View>
          </View>
          {["Payment authorized", "Charger authenticated", "Starting energy flow"].map((label, index) => (
            <View key={label} style={{ width: "100%", flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Ionicons name={index < 2 ? "checkmark-circle" : "ellipse"} size={21} color={index < 2 ? fx.teal : "#7ca7cd"} />
              <Text style={{ color: index < 2 ? "#fff" : "#a8c4dd", fontWeight: "800" }}>{label}</Text>
            </View>
          ))}
        </EnergyCard>
        <Cta label="Open live session" kind="secondary" onPress={() => router.replace("/charging/1")} />
      </View>
    </FxScreen>
  );
}
