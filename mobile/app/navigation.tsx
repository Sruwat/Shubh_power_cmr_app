import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, BottomCta, fx, FxScreen } from "@/components/Futuristic";

export default function NavigationRoute() {
  return (
    <FxScreen scroll={false}>
      <View style={{ flex: 1 }}>
        <View style={{ height: "62%", backgroundColor: "#dfeef9", padding: 18 }}>
          <BackHeader title="" onBack={() => router.back()} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ height: 10, borderRadius: 8, backgroundColor: fx.blue, transform: [{ rotate: "-28deg" }], marginHorizontal: 75 }} />
            <View style={{ height: 10, borderRadius: 8, backgroundColor: fx.blue, transform: [{ rotate: "28deg" }], marginHorizontal: 120, marginTop: 55 }} />
            <View style={{ position: "absolute", left: 95, bottom: 120, width: 34, height: 34, borderRadius: 17, backgroundColor: fx.blue, borderWidth: 5, borderColor: "#fff" }} />
            <View style={{ position: "absolute", right: 70, top: 85, width: 46, height: 46, borderRadius: 23, backgroundColor: fx.teal, borderWidth: 6, borderColor: "#fff", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="flash" size={22} color="#fff" />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 20, gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View><Text style={{ color: fx.ink, fontSize: 28, fontWeight: "900" }}>8 min</Text><Text style={{ color: fx.muted }}>0.8 km - via Main Road</Text></View>
            <View style={{ alignItems: "flex-end" }}><Text style={{ color: fx.teal, fontWeight: "900" }}>Slot at 10:00 AM</Text><Text style={{ color: fx.muted }}>Arrive by 9:55 AM</Text></View>
          </View>
          {["Head north on Sector 62 Road", "Turn right towards Sector 62, Noida", "Enter parking - charger on Level 1"].map((step) => (
            <View key={step} style={{ flexDirection: "row", gap: 12, borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 10 }}>
              <Ionicons name="arrow-forward-circle" size={17} color={fx.blue} />
              <Text style={{ color: fx.muted, flex: 1 }}>{step}</Text>
            </View>
          ))}
        </View>
        <BottomCta label="Start Charging on Arrival" onPress={() => router.push("/(tabs)/scan")} />
      </View>
    </FxScreen>
  );
}
