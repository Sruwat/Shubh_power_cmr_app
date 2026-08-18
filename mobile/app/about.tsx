import { Text } from "react-native";
import { FxCard, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function About() {
  return (
    <FxScreen>
      <TopChromeBar title="About Shubh Power" subtitle="Approved reference UI implementation" />
      <FxCard>
        <Text style={{ color: "#05072d", fontWeight: "900" }}>Shubh Power</Text>
        <Text style={{ color: "#56607a", lineHeight: 22 }}>EV charging discovery, booking, payments, charging sessions, wallet management, support and rewards.</Text>
      </FxCard>
      <FxCard>
        <Text style={{ color: "#05072d", fontWeight: "900" }}>Reference implementation</Text>
        <Text style={{ color: "#56607a", lineHeight: 22 }}>This screen is kept intentionally simple to mirror the approved product information style.</Text>
      </FxCard>
    </FxScreen>
  );
}
