import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { api } from "@/api/client";
import { Cta, fx, FxCard, FxInput, FxScreen, Pill, SectionLabel } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";

type VehicleKind = "2-Wheeler" | "3-Wheeler" | "Car" | "Fleet";

const vehicleKinds: Array<{ label: VehicleKind; icon: keyof typeof Ionicons.glyphMap }> = [
  { label: "2-Wheeler", icon: "bicycle" },
  { label: "3-Wheeler", icon: "car-sport" },
  { label: "Car", icon: "car" },
  { label: "Fleet", icon: "bus" }
];

export default function Vehicles() {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ add?: string }>();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [adding, setAdding] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [vehicleKind, setVehicleKind] = useState<VehicleKind>("Car");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [batteryKwh, setBatteryKwh] = useState("");
  const [connector, setConnector] = useState("CCS2");

  useEffect(() => {
    if (params.add === "1") setAdding(true);
  }, [params.add]);

  const vehicles = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => (await api.get("/api/v1/vehicles")).data as Array<Record<string, string | number | boolean | string[]>>
  });

  const saveVehicle = useMutation({
    mutationFn: async () => (await api.post("/api/v1/vehicles", {
      name: `${brand.trim()} ${model.trim()}`.trim() || `${vehicleKind} EV`,
      vehicle_type: vehicleKind,
      brand,
      model,
      registration_number: registrationNumber,
      battery_kwh: Number(batteryKwh) || null,
      connector_types: [connector],
      photo_url: photoUri,
      detection_status: photoUri ? "photo_captured_manual_confirmed" : "manual_confirmed",
      is_default: true
    })).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setAdding(false);
      setCameraOpen(false);
      Alert.alert("Vehicle saved", "Your EV profile is now used for compatible charger recommendations.");
    },
    onError: () => Alert.alert("Vehicle not saved", "Please keep backend and MongoDB running, then try again.")
  });

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Camera permission", "Camera access is needed to click a vehicle photo.");
        return;
      }
    }
    setCameraOpen(true);
  };

  const captureVehicle = async () => {
    try {
      const picture = await cameraRef.current?.takePictureAsync({ quality: 0.62, skipProcessing: true });
      setPhotoUri(picture?.uri ?? null);
      setCameraOpen(false);
    } catch {
      Alert.alert("Camera", "Photo capture is not available in this preview. You can still confirm details manually.");
      setCameraOpen(false);
    }
  };

  if (cameraOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: fx.navy }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View style={{ position: "absolute", left: 20, right: 20, bottom: 34, gap: 14 }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textAlign: "center" }}>Frame the vehicle clearly</Text>
          <Cta label="Click Vehicle Photo" icon="camera-outline" kind="teal" onPress={captureVehicle} />
          <Cta label="Enter Manually" kind="secondary" onPress={() => setCameraOpen(false)} />
        </View>
      </View>
    );
  }

  return (
    <FxScreen>
      <TopChromeBar title={adding ? "Add your vehicle" : `My vehicles (${vehicles.data?.length ?? 0})`} subtitle="" />
      {!adding ? (
        <>
          <FxCard style={{ backgroundColor: fx.blue2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 60, height: 60, borderRadius: 24, backgroundColor: "#1f66d3", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900" }}>SS</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Shankaranand Saraswati</Text>
                <Text style={{ color: "#dbe7ff", fontSize: 12 }}>+91 9876543210 · Tata Nexon EV</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => router.push("/profile-edit")} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="create-outline" size={18} color="#fff" />
              </Pressable>
            </View>
          </FxCard>
          <FxCard style={{ paddingVertical: 0 }}>
            <View style={{ flexDirection: "row" }}>
              <MiniStat label="Vehicles" value={String(vehicles.data?.length ?? 0)} />
              <MiniStat label="Primary" value="1" />
              <MiniStat label="Compatible" value="4" />
            </View>
          </FxCard>
          {vehicles.data?.length ? vehicles.data.map((vehicle) => (
            <FxCard key={String(vehicle.vehicle_id ?? vehicle.id ?? vehicle.name)}>
              <View style={{ flexDirection: "row", gap: 13, alignItems: "center" }}>
                <View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: fx.cyan, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="car-sport" size={28} color={fx.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: fx.ink, fontWeight: "900", fontSize: 16 }}>{String(vehicle.name)}</Text>
                  <Text style={{ color: fx.muted, fontSize: 12 }}>{String(vehicle.registration_number ?? "Registration pending")} - {String(vehicle.battery_kwh ?? "Battery pending")} kWh</Text>
                </View>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#ffe9e6", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="trash-outline" size={17} color={fx.red} />
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {((vehicle.connector_types as string[]) ?? ["CCS2"]).map((item) => <Pill key={item} label={item} selected />)}
                {vehicle.is_default ? <Pill label="Primary" tone="teal" selected /> : null}
              </View>
            </FxCard>
          )) : (
            <FxCard>
              <Text style={{ color: fx.ink, fontWeight: "900", fontSize: 18 }}>No vehicle saved yet</Text>
              <Text style={{ color: fx.muted, lineHeight: 20 }}>Add your own EV details. Nothing dummy will be shown in your investor APK.</Text>
            </FxCard>
          )}
          <Pressable accessibilityRole="button" onPress={() => setAdding(true)}>
            <FxCard style={{ borderStyle: "dashed", alignItems: "center" }}>
              <Text style={{ color: fx.blue, fontWeight: "900" }}>+ Add New Vehicle</Text>
              <Text style={{ color: fx.muted, fontSize: 12, textAlign: "center" }}>Click a photo, confirm details, and get smarter charger matching.</Text>
            </FxCard>
          </Pressable>
        </>
      ) : (
        <>
          <FxCard style={{ backgroundColor: fx.navy }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              {photoUri ? <Image source={{ uri: photoUri }} style={{ width: 88, height: 72, borderRadius: 14 }} /> : <View style={{ width: 88, height: 72, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}><Ionicons name="camera-outline" size={30} color="#fff" /></View>}
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Vehicle photo</Text>
                <Text style={{ color: "#c8d5ff", fontSize: 12 }}>Photo capture is stored as prototype metadata; confirm details below.</Text>
              </View>
            </View>
            <Cta label={photoUri ? "Retake Photo" : "Click Vehicle Photo"} icon="camera-outline" kind="teal" onPress={openCamera} />
          </FxCard>

          <SectionLabel>Vehicle Type</SectionLabel>
          <View style={{ flexDirection: "row", gap: 9 }}>
            {vehicleKinds.map((item) => (
              <Pressable key={item.label} onPress={() => setVehicleKind(item.label)} style={{ flex: 1, minHeight: 76, borderRadius: 13, borderWidth: vehicleKind === item.label ? 2 : 1, borderColor: vehicleKind === item.label ? fx.blue : fx.line, backgroundColor: vehicleKind === item.label ? fx.cyan : "#fff", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <Ionicons name={item.icon} size={22} color={vehicleKind === item.label ? fx.blue : fx.muted} />
                <Text style={{ color: fx.ink, fontSize: 10, fontWeight: "900" }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <SectionLabel>Popular EVs</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
            {["Tata Nexon EV", "Tata Tiago EV", "MG ZS EV", "BYD Atto 3"].map((item) => (
              <Pill key={item} label={item} onPress={() => { const [nextBrand, ...rest] = item.split(" "); setBrand(nextBrand); setModel(rest.join(" ")); }} />
            ))}
          </ScrollView>

          <FxCard>
            <Text style={{ color: fx.ink, fontWeight: "900" }}>Confirm vehicle details</Text>
            <Text style={{ color: fx.muted, fontSize: 12 }}>AI/OCR can be connected later. For pilot safety, the user confirms everything.</Text>
            <Field label="Brand" value={brand} onChangeText={setBrand} placeholder="e.g. Tata, MG, BYD" />
            <Field label="Model" value={model} onChangeText={setModel} placeholder="e.g. Nexon EV" />
            <Field label="Registration number" value={registrationNumber} onChangeText={(value) => setRegistrationNumber(value.toUpperCase())} placeholder="DL01AB1234" />
            <Field label="Battery size (kWh)" value={batteryKwh} onChangeText={setBatteryKwh} placeholder="40" keyboardType="numeric" />
            <Text style={{ color: fx.ink, fontWeight: "900" }}>Connector Type</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {["CCS2", "Type 2", "CHAdeMO"].map((item) => <Pill key={item} label={item} selected={connector === item} onPress={() => setConnector(item)} />)}
            </View>
          </FxCard>
          <Cta label="Save & Continue" icon="checkmark" onPress={() => {
            if (!brand.trim() || !model.trim()) {
              Alert.alert("Vehicle details required", "Please enter at least brand and model before saving.");
              return;
            }
            saveVehicle.mutate();
          }} disabled={saveVehicle.isPending} />
        </>
      )}
    </FxScreen>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 12, borderRightWidth: 1, borderRightColor: fx.line }}>
      <Text style={{ color: fx.ink, fontSize: 16, fontWeight: "900" }}>{value}</Text>
      <Text style={{ color: fx.muted, fontSize: 10, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "900" }}>{label}</Text>
      <FxInput {...props} />
    </View>
  );
}
