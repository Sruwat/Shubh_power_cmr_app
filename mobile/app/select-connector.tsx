import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BottomCta, fx, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";
import { selectedStation } from "@/data/experience";

export default function SelectConnector() {
  return (
    <FxScreen>
      <TopChromeBar title="Select connector" subtitle="" />
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>1/3</Text>
      <Text style={{ color: fx.ink, fontSize: 28, lineHeight: 32, fontWeight: "900" }}>Choose a connector</Text>
      <Text style={{ color: fx.muted, lineHeight: 22 }}>Only compatible connectors for Tata Nexon EV</Text>
      {selectedStation.connectorDetails.map((connector, index) => {
        const disabled = connector.status.includes("In use") || connector.status.includes("Busy");
        return (
          <FxCard key={connector.id} style={{ borderColor: index === 0 ? fx.blue : fx.line, backgroundColor: disabled ? "#fbfcfd" : "#fff", opacity: disabled ? 0.62 : 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: disabled ? fx.faint : fx.teal }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: fx.ink, fontWeight: "900" }}>{connector.id}</Text>
                  <Text style={{ color: fx.muted, fontWeight: "800" }}>{connector.type} · {connector.power}</Text>
                </View>
                <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900", marginTop: 5 }}>ChargeSure {index === 0 ? "96" : index === 1 ? "94" : "82"}</Text>
                <Text style={{ color: fx.muted, fontSize: 12 }}>{connector.status}</Text>
              </View>
              {index === 0 ? <Ionicons name="checkmark-circle" size={23} color={fx.blue} /> : null}
            </View>
          </FxCard>
        );
      })}
      <FxCard style={{ backgroundColor: "#f4fbff" }}>
        <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>SMART CHARGE TARGET</Text>
        <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>Recommended: 68%</Text>
        <Text style={{ color: fx.muted, lineHeight: 22 }}>Enough to reach your destination with 18% remaining.</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}><Pill label="Edit" selected /></View>
          <View style={{ flex: 1 }}><Pill label="Book slot" selected /></View>
        </View>
      </FxCard>
      <BottomCta label="Continue" onPress={() => router.push("/book-slot")} />
    </FxScreen>
  );
}
