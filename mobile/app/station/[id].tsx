import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { api, distanceLabel, Station } from "@/api/client";
import { Cta, EnergyCard, fx, FxCard, FxScreen, Pill, SectionLabel, StatTile } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";
import { selectedStation, stations } from "@/data/experience";
import { withPresentation } from "@/data/presentation";
import { openGoogleMapsDirections } from "@/utils/maps";
import shubhMark from "../../assets/shubh-power-mark.png";

export default function StationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [preference, setPreference] = useState<"time" | "amount" | "units">("time");
  const [tab, setTab] = useState<"info" | "chargers" | "reviews">("info");
  const fallback = stations.find((station) => station.id === id) ?? selectedStation;
  const station = useQuery({
    queryKey: ["station", id],
    queryFn: async () => withPresentation((await api.get<Station>(`/api/v1/stations/${id}`)).data, 0),
    retry: false
  });
  const item = station.data ?? fallback;
  const isShubh = item.isShubhHub || /shu?bh/i.test(`${item.brand} ${item.name}`);
  const saveStation = useMutation({
    mutationFn: async () => (await api.post(`/api/v1/stations/${id}/save`)).data,
    onSuccess: () => Alert.alert("Station saved", "This charger has been added to your saved stations."),
    onError: () => Alert.alert("Saved locally", "This demo station is marked as saved for this session.")
  });
  const reportIssue = useMutation({
    mutationFn: async () => (await api.post("/api/v1/support/tickets", { category: "station", message: "User reported an issue from station details.", station_id: id })).data,
    onSettled: () => router.push("/support-ticket")
  });

  return (
    <FxScreen>
      <TopChromeBar title="Station details" subtitle="" />

      <EnergyCard style={{ backgroundColor: fx.blue2, gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <View style={{ alignSelf: "flex-start", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>Charging available</Text>
          </View>
          <Pressable onPress={() => saveStation.mutate()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {isShubh ? <Image source={shubhMark} resizeMode="contain" style={{ width: 38, height: 38 }} /> : null}
          <Text style={{ color: "#fff", fontSize: 28, lineHeight: 34, fontWeight: "900", flex: 1 }}>{item.name}</Text>
        </View>
        <Text style={{ color: "#dbe7ff", fontSize: 15, fontWeight: "700" }}>{item.brand} · {distanceLabel(item)}</Text>
        {item.societyName ? <Text style={{ color: "#c8e4ff", fontSize: 13, fontWeight: "900" }}>Private hub: {item.societyName}</Text> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pill label="Connector details updating" selected />
          <Pill label="Tariff updates at station" />
          <Pill label={item.pricePerKwh ? `Rs ${item.pricePerKwh}/kWh` : "Pay at station"} tone="teal" />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}><Cta label="Navigate" icon="navigate-outline" kind="secondary" onPress={() => void openGoogleMapsDirections(item)} /></View>
          <View style={{ flex: 1 }}><Cta label="Scan QR" icon="qr-code-outline" onPress={() => router.push("/(tabs)/scan")} /></View>
        </View>
      </EnergyCard>

      <View style={{ flexDirection: "row", gap: 8, paddingTop: 2 }}>
        <Pill label="Info" selected={tab === "info"} onPress={() => setTab("info")} />
        <Pill label="Chargers" selected={tab === "chargers"} onPress={() => setTab("chargers")} />
        <Pill label="Reviews" selected={tab === "reviews"} onPress={() => setTab("reviews")} />
      </View>

      {tab === "info" ? (
        <>
          <FxCard style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>Charging options</Text>
              <Pill label={item.operational_status || "Live"} selected />
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <StatTile label="Power" value={item.powerLabel || "50 kW"} />
              <StatTile label="Tariff" value={`Rs ${item.pricePerKwh ?? 18}`} tone="teal" />
            </View>
            <Text style={{ color: fx.muted, lineHeight: 22 }}>Charging available. Connector and price details may be updated by the station before charging starts.</Text>
            <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900" }}>Charging preference</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <PreferenceButton label="By time" value="30 min" selected={preference === "time"} onPress={() => setPreference("time")} />
              <PreferenceButton label="By amount" value="Rs 500" selected={preference === "amount"} onPress={() => setPreference("amount")} />
              <PreferenceButton label="By units" value="20 kWh" selected={preference === "units"} onPress={() => setPreference("units")} />
            </View>
            <Cta label="Select Connector" icon="flash-outline" onPress={() => setTab("chargers")} />
          </FxCard>

          <FxCard style={{ gap: 10 }}>
            <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>Location and access</Text>
            <Text style={{ color: fx.muted, lineHeight: 22 }}>{item.address || "Navigation is available for this station."}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {(item.amenities || ["Parking nearby", "Support available", "Public access"]).map((label) => <Pill key={label} label={label} />)}
            </View>
            <Cta label="Open maps" icon="navigate-outline" kind="secondary" onPress={() => void openGoogleMapsDirections(item)} />
          </FxCard>

          <FxCard style={{ gap: 0, paddingVertical: 12 }}>
            <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900", paddingHorizontal: 14, paddingBottom: 6 }}>Tariff breakdown</Text>
            <PriceRow label="Energy Rate" value={`Rs ${item.pricePerKwh}/kWh`} />
            <PriceRow label="Platform Fee" value={`Rs ${item.platformFee} flat`} />
            <PriceRow label="GST (18%)" value="Incl. in above" />
            <PriceRow label="Idle Fee" value={item.idleFee} />
            <PriceRow label="Parking" value={item.parkingFee} />
          </FxCard>

          <FxCard style={{ gap: 10 }}>
            <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>Before you start</Text>
            <Text style={{ color: fx.muted, lineHeight: 22 }}>Confirm connector availability at the station, review tariff information and keep your payment method ready.</Text>
            <Cta label="Book Charging Slot" icon="calendar-outline" onPress={() => router.push("/book-slot")} />
            <Pressable accessibilityRole="button" onPress={() => reportIssue.mutate()} style={{ alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ color: fx.blue, fontWeight: "900" }}>Report an issue</Text>
            </Pressable>
          </FxCard>
        </>
      ) : null}

      {tab === "chargers" ? <ChargersTab station={item} /> : null}
      {tab === "reviews" ? <ReviewsTab station={item} /> : null}

      <SectionLabel>Compatible with Tata Nexon EV, MG ZS EV, BYD Atto 3, fleet vehicles</SectionLabel>
    </FxScreen>
  );
}

function ChargersTab({ station }: { station: Station }) {
  const [selectedConnector, setSelectedConnector] = useState(station.connectorDetails?.[0]?.id);
  const connectors = station.connectorDetails?.length ? station.connectorDetails : [{ id: "CP01", type: "CCS2", power: station.powerLabel || "50 kW DC", status: "Ready to charge" }];
  return (
    <>
      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Available chargers</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Pill label="Available" selected />
          <Pill label="AC" />
          <Pill label="DC" />
        </View>
        {connectors.map((connector) => {
          const active = selectedConnector === connector.id;
          const unavailable = /busy|use|disconnect|fault/i.test(connector.status);
          return (
            <Pressable key={connector.id} onPress={() => setSelectedConnector(connector.id)} style={{ borderRadius: 16, borderWidth: active ? 2 : 1, borderColor: active ? fx.blue : unavailable ? "#fecaca" : fx.line, backgroundColor: unavailable ? "#fff7f7" : active ? "#e7f7ff" : "#fff", padding: 14, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                <View>
                  <Text style={{ color: fx.ink, fontSize: 18, fontWeight: "900" }}>{connector.id} - {connector.type}</Text>
                  <Text style={{ color: fx.muted, fontWeight: "800" }}>{connector.power}</Text>
                </View>
                <Text style={{ color: station.pricePerKwh ? fx.red : fx.muted, fontWeight: "900" }}>Rs {station.pricePerKwh ?? 18}/kWh</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="radio-button-on" size={18} color={unavailable ? fx.red : fx.teal} />
                <Text style={{ color: unavailable ? fx.red : fx.teal, fontWeight: "900" }}>{connector.status}</Text>
                <Pill label={connector.power.replace(" ", "")} />
              </View>
            </Pressable>
          );
        })}
      </FxCard>
      <Cta label={selectedConnector ? `Select ${selectedConnector}` : "Select a connector"} icon="flash-outline" onPress={() => router.push("/confirm-pay")} />
    </>
  );
}

function ReviewsTab({ station }: { station: Station }) {
  const reviews = station.reviews?.length ? station.reviews : [
    { name: "Nikhil D.", rating: 5, time: "3 days ago", vehicle: "Tata Nexon EV", comment: "Charged via app. Connector and navigation were clear." },
    { name: "Vikas Bhola", rating: 4, time: "4 days ago", vehicle: "Mahindra XEV 9e", comment: "Good charger access and smooth wallet settlement." }
  ];
  return (
    <>
      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 24, fontWeight: "900" }}>Rating and reviews</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <View style={{ alignItems: "center", width: 90 }}>
            <Text style={{ color: fx.ink, fontSize: 36, fontWeight: "900" }}>{station.rating?.toFixed(1) ?? "4.6"}</Text>
            <Ionicons name="star" size={20} color={fx.amber} />
            <Text style={{ color: fx.muted, fontWeight: "800", marginTop: 8 }}>{station.reviewCount ?? reviews.length} Reviews</Text>
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            {[5, 4, 3, 2, 1].map((rating, index) => <RatingBar key={rating} rating={rating} fill={[0.88, 0.42, 0.18, 0.06, 0.03][index]} />)}
          </View>
        </View>
      </FxCard>
      <FxCard>
        <Text style={{ color: fx.ink, fontSize: 22, fontWeight: "900" }}>Customer reviews</Text>
        {reviews.map((review) => (
          <View key={`${review.name}-${review.time}`} style={{ borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 12, gap: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <View>
                <Text style={{ color: fx.ink, fontWeight: "900" }}>{review.name}</Text>
                <Text style={{ color: fx.muted, fontSize: 12 }}>{review.time || "Recently"}</Text>
              </View>
              <Text style={{ color: fx.red, fontWeight: "900" }}>{review.vehicle || "Charged via app"}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 3 }}>{Array.from({ length: 5 }).map((_, index) => <Ionicons key={index} name="star" size={14} color={index < review.rating ? fx.amber : fx.line} />)}</View>
            <Text style={{ color: fx.muted, lineHeight: 20 }}>{review.comment}</Text>
          </View>
        ))}
      </FxCard>
    </>
  );
}

function RatingBar({ rating, fill }: { rating: number; fill: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text style={{ width: 14, color: fx.ink, fontWeight: "900" }}>{rating}</Text>
      <View style={{ flex: 1, height: 10, borderRadius: 8, backgroundColor: "#e5e7eb", overflow: "hidden" }}>
        <View style={{ width: `${fill * 100}%`, height: "100%", backgroundColor: fx.red, borderRadius: 8 }} />
      </View>
      <Text style={{ width: 36, color: fx.muted, textAlign: "right", fontWeight: "800" }}>{Math.round(fill * 100)}%</Text>
    </View>
  );
}

function PreferenceButton({ label, value, selected, onPress }: { label: string; value: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ flex: 1, minHeight: 78, borderRadius: 15, borderWidth: 1.5, borderColor: selected ? fx.blue : fx.line, backgroundColor: selected ? "#e7f7ff" : "#fff", padding: 10, justifyContent: "center", gap: 4 }}>
      <Text style={{ color: selected ? fx.blue : fx.muted, fontSize: 11, fontWeight: "900" }}>{label}</Text>
      <Text style={{ color: fx.ink, fontSize: 14, fontWeight: "900" }}>{value}</Text>
    </Pressable>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: fx.line, paddingVertical: 9 }}>
      <Text style={{ color: fx.muted, fontWeight: "800" }}>{label}</Text>
      <Text style={{ color: fx.ink, fontWeight: "900", flexShrink: 1, textAlign: "right" }}>{value}</Text>
    </View>
  );
}

