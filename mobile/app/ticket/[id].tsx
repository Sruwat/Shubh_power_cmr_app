import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { fx, FxCard, FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

export default function TicketConversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState("");
  return (
    <FxScreen>
      <TopChromeBar title={id ?? "TKT-001"} subtitle="" />
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>CCS2 connector fault at Sector 62</Text>
        <Text style={{ color: fx.faint }}>Created 12 Jul - Category: Hardware Fault - Priority: High</Text>
      </FxCard>
      <Bubble mine text="The CCS2 charger at CP01 at Sector 62 is not starting. I hear a click but the session doesn't begin. Tried twice." />
      <Bubble text="Hi Rahul, thank you for reaching out. Can you share the exact error message shown on the charger screen?" />
      <Bubble mine text="The screen shows Communication Error - E032. Wallet was debited once already." />
      <Bubble text="We've escalated this to our field team. A full refund of Rs466 is being initiated to your wallet. ETA: 15 minutes." />
      <Bubble mine text="Received the refund. Thank you!" />
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <TextInput value={message} onChangeText={setMessage} placeholder="Type your message..." placeholderTextColor={fx.faint} style={{ flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 1, borderColor: fx.line, paddingHorizontal: 14, color: fx.ink }} />
        <Pressable style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: fx.blue, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#fff", fontWeight: "900" }}>Send</Text></Pressable>
      </View>
    </FxScreen>
  );
}

function Bubble({ text, mine = false }: { text: string; mine?: boolean }) {
  return <View style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "84%", backgroundColor: mine ? fx.blue : "#fff", borderRadius: 15, padding: 13, borderWidth: mine ? 0 : 1, borderColor: fx.line }}><Text style={{ color: mine ? "#fff" : fx.ink, lineHeight: 20 }}>{text}</Text><Text style={{ color: mine ? "#dbe7ff" : fx.faint, fontSize: 11, marginTop: 4 }}>12 Jul, 2:15 PM</Text></View>;
}
