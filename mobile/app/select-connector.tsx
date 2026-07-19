import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, BottomCta, fx, FxCard, FxScreen, Pill } from "@/components/Futuristic";
import { selectedStation } from "@/data/experience";

export default function SelectConnector() {
  return (
    <FxScreen>
      <BackHeader title="Select Connector" onBack={() => router.back()} />
      <View style={{ borderRadius: 14, backgroundColor: fx.cyan, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons name="key" size={18} color={fx.blue} />
        <Text style={{ color: fx.blue, fontWeight: "800", flex: 1 }}>Your Nexon EV is compatible with CCS2, Type 2</Text>
      </View>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>AVAILABLE AT Shubh Power EV HUB</Text>
      {selectedStation.connectorDetails.map((connector, index) => {
        const disabled = connector.status.includes("In use") || connector.status.includes("Busy");
        return (
          <FxCard key={connector.id} style={{ borderColor: index === 0 ? fx.blue : fx.line, backgroundColor: disabled ? "#fbfcfd" : "#fff", opacity: disabled ? 0.62 : 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: disabled ? fx.faint : fx.teal }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pill label={connector.type} selected />
                  <Text style={{ color: fx.muted, fontWeight: "800" }}>{connector.id}</Text>
                </View>
                <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900", marginTop: 5 }}>{connector.power}</Text>
                <Text style={{ color: fx.muted, fontSize: 12 }}>{connector.status}</Text>
              </View>
              {index === 0 ? <Ionicons name="checkmark-circle" size={23} color={fx.blue} /> : null}
            </View>
          </FxCard>
        );
      })}
      <BottomCta label="Continue to Book Slot" onPress={() => router.push("/book-slot")} />
    </FxScreen>
  );
}
