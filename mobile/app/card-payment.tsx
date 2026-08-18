import { router } from "expo-router";
import { Text, View } from "react-native";
import { BottomCta, fx, FxInput, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function CardPayment() {
  return (
    <FxScreen>
      <TopChromeBar title="Card payment" subtitle="" />
      <View style={{ backgroundColor: fx.blue2, borderRadius: 20, padding: 22, gap: 18 }}>
        <Text style={{ color: "#fff", fontWeight: "900" }}>Visa</Text>
        <Text style={{ color: "#fff", fontSize: 24, letterSpacing: 4 }}>•••• •••• •••• ••••</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#dbe7ff", fontWeight: "900" }}>YOUR NAME</Text>
          <Text style={{ color: "#dbe7ff", fontWeight: "900" }}>MM/YY</Text>
        </View>
      </View>
      <FxInput placeholder="1234 5678 9012 3456" keyboardType="number-pad" />
      <FxInput placeholder="Rahul Sharma" />
      <FxInput placeholder="MM/YY" />
      <FxInput placeholder="CVV" secureTextEntry />
      <Text style={{ color: fx.faint, textAlign: "center" }}>Secured by RBI-certified payment gateway</Text>
      <BottomCta label="Pay Rs466 Securely" onPress={() => router.push("/starting-session")} />
    </FxScreen>
  );
}
