import { router } from "expo-router";
import { Text, View } from "react-native";
import { BottomCta, fx, FxCard, FxScreen } from "@/components/Futuristic";
import { bookingDates, bookingTimes, selectedStation } from "@/data/experience";
import { TopChromeBar } from "@/components/ShubhShell";

export default function BookSlot() {
  return (
    <FxScreen>
      <TopChromeBar title="Book slot" subtitle="" />
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>{selectedStation.name}</Text>
        <Text style={{ color: fx.muted }}>{selectedStation.connectorDetails[0].type} - {selectedStation.powerLabel} - Rs {selectedStation.pricePerKwh}/kWh - {selectedStation.distance_km} km</Text>
      </FxCard>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>SELECT DATE</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {bookingDates.map((item) => <SlotBox key={item.label} title={item.date} sub={item.label} selected={item.selected} />)}
      </View>
      <Text style={{ color: fx.faint, fontSize: 12, fontWeight: "900" }}>SELECT TIME (30 MIN SLOT)</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {bookingTimes.map((item) => <SlotBox key={item.time} title={item.time} sub={item.free} selected={item.selected} disabled={item.disabled} width="30%" />)}
      </View>
      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Estimated Cost</Text>
        <Row label="Energy (est. 20 kWh x Rs18)" value="Rs360" />
        <Row label="Platform Fee" value="Rs35" />
        <Row label="GST (18%)" value="Rs71" />
        <Row label="Total (est.)" value="Rs466" strong />
      </FxCard>
      <BottomCta label="Proceed to Pay - Rs466" onPress={() => router.push("/confirm-pay")} />
    </FxScreen>
  );
}

function SlotBox({ title, sub, selected, disabled, width }: { title: string; sub: string; selected?: boolean; disabled?: boolean; width?: string }) {
  return (
    <View style={{ width: width as never, flex: width ? undefined : 1, minHeight: 62, borderRadius: 12, borderWidth: 1.5, borderColor: selected ? fx.blue : fx.line, backgroundColor: selected ? `${fx.blue}10` : disabled ? "#f8fafc" : "#fff", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.5 : 1 }}>
      <Text style={{ color: selected ? fx.blue : fx.ink, fontWeight: "900" }}>{title}</Text>
      <Text style={{ color: disabled ? fx.red : fx.blue, fontSize: 12, fontWeight: "800" }}>{sub}</Text>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 }}>
      <Text style={{ color: fx.muted, fontWeight: strong ? "900" : "700" }}>{label}</Text>
      <Text style={{ color: strong ? fx.blue : fx.ink, fontWeight: "900" }}>{value}</Text>
    </View>
  );
}
