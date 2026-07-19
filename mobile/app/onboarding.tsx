import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandLogo } from "@/components/Futuristic";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/auth";

type Step = "splash" | "language" | "login" | "otp" | "profile" | "location" | "vehicle";
type VehicleKind = "2-Wheeler" | "3-Wheeler" | "Car" | "Fleet";
type ConnectorType = "CCS2" | "Type 2" | "CHAdeMO";

const blue = "#168ddd";
const navy = "#05073f";
const page = "#f4f8fb";
const paleBlue = "#e8f5ff";
const muted = "#59607f";
const faint = "#a8b0ce";
const border = "#dde4eb";
const teal = "#18b9b5";

export default function Onboarding() {
  const [step, setStep] = useState<Step>("splash");
  const [language, setLanguage] = useState("English");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [vehicleKind, setVehicleKind] = useState<VehicleKind>("Car");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [batteryKwh, setBatteryKwh] = useState("40");
  const [connector, setConnector] = useState<ConnectorType>("CCS2");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    if (step !== "splash") return;
    const timer = setTimeout(() => setStep("language"), 1400);
    return () => clearTimeout(timer);
  }, [step]);

  const normalizedPhone = phone.replace(/\D/g, "").slice(0, 10);
  const canSendOtp = normalizedPhone.length === 10;
  const canVerify = otp.replace(/\D/g, "").length >= 4;
  const vehicleName = useMemo(() => {
    const parts = [brand.trim(), model.trim()].filter(Boolean);
    return parts.length ? parts.join(" ") : `${vehicleKind} EV`;
  }, [brand, model, vehicleKind]);

  const requestOtp = async () => {
    if (!canSendOtp) {
      Alert.alert("Enter mobile number", "Please enter a valid 10 digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/v1/auth/request-otp", { phone: normalizedPhone });
      setStep("otp");
    } catch {
      Alert.alert("OTP request failed", "Please check backend connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!canVerify) {
      Alert.alert("Enter OTP", "Use demo OTP 1234 for now.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/api/v1/auth/verify-otp", { phone: normalizedPhone, otp: otp.replace(/\D/g, "") });
      await setTokens(response.data.access_token, response.data.refresh_token);
      setStep("profile");
    } catch {
      Alert.alert("Code not verified", "Use demo OTP 1234 while SMS integration is in demo mode.");
    } finally {
      setLoading(false);
    }
  };

  const saveCustomerProfile = async () => {
    const name = customerName.trim();
    if (name.length < 2) {
      Alert.alert("Enter your name", "Please enter the customer name for this account.");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/api/v1/users/me", {
        name,
        email: customerEmail.trim() || undefined,
        language: language === "Hindi" ? "hi" : "en",
        consent_flags: {
          onboarding_profile_completed: true,
          profile_manually_confirmed: true
        }
      });
      setStep("location");
    } catch {
      Alert.alert("Profile not saved", "MongoDB/backend is not reachable. Please keep the backend running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const allowLocation = async () => {
    await Location.requestForegroundPermissionsAsync();
    setStep("vehicle");
  };

  const finishVehicle = async (skip = false) => {
    setLoading(true);
    try {
      if (!skip) {
        await api.post("/api/v1/vehicles", {
          name: vehicleName,
          vehicle_type: vehicleKind,
          brand,
          model,
          connector_types: [connector],
          registration_number: registrationNumber.trim() || undefined,
          battery_kwh: Number(batteryKwh) || (vehicleKind === "Car" ? 40 : 12),
          photo_url: photoUri,
          detection_status: photoUri ? "photo_captured_manual_confirmed" : "manual_confirmed",
          is_default: true
        });
      }
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Vehicle not saved", "Backend or MongoDB is not reachable. Please keep the backend running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const openVehicleCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Camera permission", "Camera access is needed to click a vehicle photo.");
        return;
      }
    }
    setCameraOpen(true);
  };

  const captureVehiclePhoto = async () => {
    try {
      const picture = await cameraRef.current?.takePictureAsync({ quality: 0.62, skipProcessing: true });
      setPhotoUri(picture?.uri ?? null);
      setCameraOpen(false);
      setBrand((value) => value || "Tata");
      setModel((value) => value || "Nexon EV");
    } catch {
      Alert.alert("Camera", "Photo capture is not available in this preview. You can still confirm details manually.");
      setCameraOpen(false);
    }
  };

  if (step === "splash") {
    return <SplashScreen />;
  }

  if (cameraOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: navy }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View style={{ position: "absolute", left: 28, right: 28, bottom: 42, gap: 14 }}>
          <Text style={{ color: "#fff", fontSize: 19, fontWeight: "900", textAlign: "center" }}>Click a clear photo of your EV</Text>
          <PrimaryButton label="Capture Vehicle Photo" onPress={captureVehiclePhoto} />
          <SecondaryButton label="Enter Details Manually" onPress={() => setCameraOpen(false)} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: page }}>
      <StatusBar style="dark" backgroundColor={page} translucent={false} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {step !== "vehicle" ? (
          <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 28, paddingBottom: 40 }}>
            {step !== "location" && <BrandHeader />}
            {step === "language" && (
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 46 }}>
                  <Text style={styles.title}>Choose Language</Text>
                  <Text style={styles.hint}>अपनी भाषा चुनें</Text>
                </View>
                <View style={{ marginTop: 28, gap: 14 }}>
                  <LanguageOption title="English" subtitle="English" selected={language === "English"} onPress={() => setLanguage("English")} />
                  <LanguageOption title="हिन्दी" subtitle="Hindi" selected={language === "Hindi"} onPress={() => setLanguage("Hindi")} />
                </View>
                <View style={{ marginTop: "auto" }}>
                  <PrimaryButton label="Continue" onPress={() => setStep("login")} />
                </View>
              </View>
            )}

            {step === "login" && (
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 40 }}>
                  <Text style={styles.title}>Welcome back</Text>
                  <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
                </View>
                <View style={styles.phoneBox}>
                  <Text style={styles.country}>IN</Text>
                  <Text style={styles.country}>+91</Text>
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="98765 43210"
                    placeholderTextColor="#b4bcd7"
                    value={phone}
                    onChangeText={(value) => setPhone(value.replace(/\D/g, "").slice(0, 10))}
                    style={styles.phoneInput}
                  />
                </View>
                <Text style={styles.legal}>By continuing you agree to our <Text style={{ color: blue, fontWeight: "800" }}>Terms & Privacy Policy</Text></Text>
                <PrimaryButton label="Send OTP" onPress={requestOtp} disabled={!canSendOtp || loading} />
                <Divider />
                <Pressable accessibilityRole="button" style={styles.googleButton} onPress={() => Alert.alert("Google sign in", "Google sign in can be connected after OAuth setup.")}>
                  <Text style={{ fontSize: 20, fontWeight: "900", color: "#4285f4" }}>G</Text>
                  <Text style={{ color: navy, fontSize: 16, fontWeight: "800" }}>Continue with Google</Text>
                </Pressable>
              </View>
            )}

            {step === "otp" && (
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 40 }}>
                  <Text style={styles.title}>Verify OTP</Text>
                  <Text style={styles.subtitle}>Enter the code sent to +91 {normalizedPhone || "9876543210"}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 34 }}>
                  {[0, 1, 2, 3].map((index) => (
                    <View key={index} style={styles.otpBox}>
                      <Text style={styles.otpText}>{otp[index] || ""}</Text>
                    </View>
                  ))}
                </View>
                <TextInput
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  autoFocus
                  style={{ height: 1, opacity: 0 }}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 18 }}>
                  <Text style={styles.hint}>Demo code: 1234</Text>
                  <Text onPress={() => setStep("login")} style={{ color: blue, fontWeight: "900" }}>Edit number</Text>
                </View>
                <View style={{ marginTop: 28 }}>
                  <PrimaryButton label="Verify & Continue" onPress={verifyOtp} disabled={!canVerify || loading} />
                </View>
              </View>
            )}

            {step === "profile" && (
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 40 }}>
                  <Text style={styles.title}>Tell us about you</Text>
                  <Text style={styles.subtitle}>Your name and contact details are stored in your Shubh Power account.</Text>
                </View>
                <FieldLabel label="Customer name" />
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={faint}
                  autoCapitalize="words"
                  style={styles.vehicleInput}
                />
                <FieldLabel label="Email (optional)" />
                <TextInput
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={faint}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.vehicleInput}
                />
                <View style={{ marginTop: 28 }}>
                  <PrimaryButton label="Save & Continue" onPress={saveCustomerProfile} disabled={loading || customerName.trim().length < 2} />
                </View>
              </View>
            )}

            {step === "location" && (
              <View style={{ flex: 1, justifyContent: "center", paddingBottom: 58 }}>
                <View style={styles.locationAura}>
                  <View style={styles.locationCore}>
                    <Ionicons name="location" size={32} color={blue} />
                  </View>
                </View>
                <Text style={[styles.title, { textAlign: "center", marginTop: 36 }]}>Enable Location</Text>
                <Text style={[styles.subtitle, { textAlign: "center", lineHeight: 23, marginTop: 14 }]}>Shubh Power needs your location to show nearby EV charging stations, estimate travel time, and give real-time availability.</Text>
                <Text style={[styles.hint, { textAlign: "center", marginTop: 12 }]}>Your location is never shared with third parties.</Text>
                <View style={{ marginTop: 42, gap: 14 }}>
                  <PrimaryButton label="Allow Location Access" onPress={allowLocation} />
                  <SecondaryButton label="Search Manually" onPress={() => setStep("vehicle")} />
                </View>
              </View>
            )}
          </View>
        ) : (
          <VehicleScreen
            vehicleKind={vehicleKind}
            setVehicleKind={setVehicleKind}
            brand={brand}
            setBrand={setBrand}
            model={model}
            setModel={setModel}
            registrationNumber={registrationNumber}
            setRegistrationNumber={setRegistrationNumber}
            batteryKwh={batteryKwh}
            setBatteryKwh={setBatteryKwh}
            connector={connector}
            setConnector={setConnector}
            photoUri={photoUri}
            openVehicleCamera={openVehicleCamera}
            loading={loading}
            finishVehicle={finishVehicle}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <StatusBar style="light" backgroundColor={navy} translucent={false} />
      <View style={{ alignItems: "center", marginTop: "78%" }}>
        <View style={{ width: 104, height: 104, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.96)", alignItems: "center", justifyContent: "center" }}>
          <BrandLogo variant="mark" width={74} />
        </View>
        <Text style={styles.splashName}>Shubh Power</Text>
        <Text style={styles.splashTag}>EV CHARGING</Text>
      </View>
      <Text style={styles.splashFoot}>POWERING GREEN MOBILITY</Text>
    </View>
  );
}

function BrandHeader() {
  return (
    <View style={{ alignItems: "center" }}>
      <BrandLogo variant="wordmark" width={106} />
    </View>
  );
}

function LanguageOption({ title, subtitle, selected, onPress }: { title: string; subtitle: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.languageCard, selected && styles.languageSelected]}>
      <View>
        <Text style={[styles.languageTitle, selected && { color: blue }]}>{title}</Text>
        <Text style={styles.languageSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, selected && { borderColor: blue }]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}

function VehicleScreen(props: {
  vehicleKind: VehicleKind;
  setVehicleKind: (kind: VehicleKind) => void;
  brand: string;
  setBrand: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  batteryKwh: string;
  setBatteryKwh: (value: string) => void;
  connector: ConnectorType;
  setConnector: (value: ConnectorType) => void;
  photoUri: string | null;
  openVehicleCamera: () => void;
  loading: boolean;
  finishVehicle: (skip?: boolean) => void;
}) {
  const vehicles: Array<{ label: VehicleKind; icon: keyof typeof Ionicons.glyphMap }> = [
    { label: "2-Wheeler", icon: "bicycle" },
    { label: "3-Wheeler", icon: "car-sport" },
    { label: "Car", icon: "car" },
    { label: "Fleet", icon: "bus" }
  ];
  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 42, paddingBottom: 44 }}>
      <Text style={styles.vehicleTitle}>Add Your Vehicle</Text>
      <Text style={styles.subtitle}>We'll show compatible chargers based on your EV</Text>
      <Pressable accessibilityRole="button" onPress={props.openVehicleCamera} style={[styles.photoCapture, props.photoUri && { borderColor: blue, backgroundColor: paleBlue }]}>
        {props.photoUri ? <Image source={{ uri: props.photoUri }} style={{ width: 74, height: 58, borderRadius: 12 }} /> : <View style={styles.photoIcon}><Ionicons name="camera-outline" size={26} color={blue} /></View>}
        <View style={{ flex: 1 }}>
          <Text style={{ color: navy, fontSize: 16, fontWeight: "900" }}>{props.photoUri ? "Vehicle photo captured" : "Click vehicle photo"}</Text>
          <Text style={{ color: muted, fontSize: 12 }}>Then confirm brand, model, battery and connector.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={blue} />
      </Pressable>
      <Label>VEHICLE TYPE</Label>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        {vehicles.map((item) => (
          <Pressable key={item.label} accessibilityRole="button" onPress={() => props.setVehicleKind(item.label)} style={[styles.vehicleType, props.vehicleKind === item.label && styles.vehicleTypeSelected]}>
            <Ionicons name={item.icon} size={24} color={props.vehicleKind === item.label ? blue : muted} />
            <Text style={styles.vehicleTypeText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <Label>POPULAR EVS</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 20, marginTop: 10 }}>
        {["Tata Nexon EV", "Tata Tiago EV", "MG ZS EV", "Mahindra XUV400"].map((item) => (
          <Pressable key={item} onPress={() => props.setModel(item)} style={styles.popularChip}>
            <Text style={{ color: navy, fontWeight: "700" }}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <FieldLabel label="Brand" />
      <TextInput value={props.brand} onChangeText={props.setBrand} placeholder="e.g. Tata, MG, BYD" placeholderTextColor={faint} style={styles.vehicleInput} />
      <FieldLabel label="Model" />
      <TextInput value={props.model} onChangeText={props.setModel} placeholder="e.g. Nexon EV" placeholderTextColor={faint} style={styles.vehicleInput} />
      <FieldLabel label="Registration number" />
      <TextInput
        value={props.registrationNumber}
        onChangeText={(value) => props.setRegistrationNumber(value.toUpperCase())}
        placeholder="e.g. DL01AB1234"
        placeholderTextColor={faint}
        autoCapitalize="characters"
        style={styles.vehicleInput}
      />
      <FieldLabel label="Battery size (kWh)" />
      <TextInput
        value={props.batteryKwh}
        onChangeText={(value) => props.setBatteryKwh(value.replace(/[^0-9.]/g, "").slice(0, 5))}
        placeholder="e.g. 40"
        placeholderTextColor={faint}
        keyboardType="decimal-pad"
        style={styles.vehicleInput}
      />
      <Label>CONNECTOR TYPE</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        {(["CCS2", "Type 2", "CHAdeMO"] as ConnectorType[]).map((item) => (
          <Pressable key={item} accessibilityRole="button" onPress={() => props.setConnector(item)} style={[styles.connector, props.connector === item && styles.connectorSelected]}>
            <Text style={{ color: props.connector === item ? blue : navy, fontWeight: "800" }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ marginTop: 18 }}>
        <PrimaryButton label="Save & Continue" onPress={() => props.finishVehicle(false)} disabled={props.loading} />
      </View>
      <Pressable accessibilityRole="button" onPress={() => props.finishVehicle(true)} style={{ alignItems: "center", paddingVertical: 28 }}>
        <Text style={{ color: faint, fontSize: 15, fontWeight: "800" }}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  );
}

function PrimaryButton({ label, disabled, onPress }: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && { backgroundColor: "#9cccEC" }]}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

function Divider() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 24 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: border }} />
      <Text style={{ color: faint, fontWeight: "800" }}>OR</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: border }} />
    </View>
  );
}

function Label({ children }: { children: string }) {
  return <Text style={{ color: faint, fontSize: 12, fontWeight: "900", marginTop: 22 }}>{children}</Text>;
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={{ color: navy, fontSize: 13, marginTop: 20, marginBottom: 8 }}>{label}</Text>;
}

const styles = {
  splash: {
    flex: 1,
    alignItems: "center" as const,
    backgroundColor: navy
  },
  splashName: {
    marginTop: 16,
    color: "#fff",
    fontSize: 21,
    fontWeight: "900" as const
  },
  splashTag: {
    color: "#b7ddff",
    fontSize: 12,
    letterSpacing: 1.4,
    fontWeight: "800" as const
  },
  splashFoot: {
    position: "absolute" as const,
    bottom: 70,
    color: "#8ed1ff",
    fontSize: 12,
    letterSpacing: 1.7,
    fontWeight: "800" as const
  },
  title: {
    color: navy,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900" as const
  },
  vehicleTitle: {
    color: navy,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900" as const
  },
  subtitle: {
    color: muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6
  },
  hint: {
    color: faint,
    fontSize: 13,
    lineHeight: 18
  },
  languageCard: {
    minHeight: 82,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: border,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const
  },
  languageSelected: {
    borderColor: blue,
    backgroundColor: paleBlue
  },
  languageTitle: {
    color: navy,
    fontSize: 18,
    fontWeight: "900" as const
  },
  languageSubtitle: {
    color: muted,
    fontSize: 14,
    marginTop: 4
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#aeb8d2",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: blue
  },
  phoneBox: {
    marginTop: 32,
    minHeight: 54,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    gap: 11
  },
  country: {
    color: navy,
    fontSize: 13,
    fontWeight: "900" as const
  },
  phoneInput: {
    flex: 1,
    color: navy,
    fontSize: 19,
    fontWeight: "800" as const
  },
  legal: {
    color: muted,
    fontSize: 12,
    marginTop: 18,
    marginBottom: 32
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: blue,
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900" as const
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 13,
    borderWidth: 1.2,
    borderColor: blue,
    backgroundColor: "transparent",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  secondaryText: {
    color: "#0078e9",
    fontSize: 16,
    fontWeight: "900" as const
  },
  googleButton: {
    minHeight: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 14
  },
  otpBox: {
    flex: 1,
    height: 58,
    borderRadius: 13,
    borderWidth: 1.4,
    borderColor: border,
    backgroundColor: "#fff",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  otpText: {
    color: navy,
    fontSize: 22,
    fontWeight: "900" as const
  },
  locationAura: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#dff1fc",
    alignSelf: "center" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  locationCore: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#a9d8f6",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  vehicleType: {
    flex: 1,
    height: 78,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8
  },
  vehicleTypeSelected: {
    borderColor: blue,
    borderWidth: 2,
    backgroundColor: paleBlue
  },
  vehicleTypeText: {
    color: navy,
    fontSize: 11,
    fontWeight: "800" as const
  },
  popularChip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    height: 34,
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  vehicleInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    color: navy,
    fontSize: 15
  },
  connector: {
    width: "48%" as const,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  connectorSelected: {
    borderColor: blue,
    borderWidth: 2,
    backgroundColor: paleBlue
  },
  photoCapture: {
    marginTop: 20,
    minHeight: 84,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12
  },
  photoIcon: {
    width: 74,
    height: 58,
    borderRadius: 12,
    backgroundColor: paleBlue,
    alignItems: "center" as const,
    justifyContent: "center" as const
  }
};
