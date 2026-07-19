import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { Cta, EnergyCard, fx, FxScreen } from "@/components/Futuristic";

export default function StartingSession() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace("/charging-complete"), 4200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FxScreen scroll={false} style={{ backgroundColor: fx.navy }}>
      <View style={{ flex: 1, justifyContent: "center", padding: 28, gap: 24 }}>
        <EnergyCard style={{ alignItems: "center", backgroundColor: "transparent", shadowOpacity: 0, elevation: 0 }}>
          <View style={{ width: 98, height: 98, borderRadius: 49, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="flash" size={44} color="#fff" />
          </View>
          <Text style={{ color: "#fff", fontSize: 27, fontWeight: "900" }}>Starting Session...</Text>
          <Text style={{ color: "#dbe7ff", textAlign: "center" }}>Validating charger - Unlocking connector</Text>
          {["Payment authorised", "Communicating with charger", "Connector unlocking"].map((label, index) => (
            <View key={label} style={{ width: "100%", flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Ionicons name={index < 2 ? "checkmark-circle" : "ellipse"} size={21} color={index < 2 ? fx.teal : "#7ca7cd"} />
              <Text style={{ color: index < 2 ? "#fff" : "#a8c4dd", fontWeight: "800" }}>{label}</Text>
            </View>
          ))}
        </EnergyCard>
        <Cta label="Simulate failure" kind="secondary" onPress={() => router.replace("/charging-failed")} />
      </View>
    </FxScreen>
  );
}
