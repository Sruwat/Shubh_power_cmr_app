import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { api } from "@/api/client";
import { BackHeader, Cta, fx, FxCard, FxInput, FxScreen, Pill } from "@/components/Futuristic";

export default function ProfileEdit() {
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: async () => (await api.get("/api/v1/users/me")).data, retry: false });
  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@gmail.com");
  const [language, setLanguage] = useState("en");
  const [pushEnabled, setPushEnabled] = useState(true);

  useEffect(() => {
    if (!me.data) return;
    setName(me.data.name ?? "Rahul Sharma");
    setEmail(me.data.email ?? "rahul.sharma@gmail.com");
    setLanguage(me.data.language ?? "en");
    setPushEnabled(me.data.notification_preferences?.push_enabled ?? true);
  }, [me.data]);

  const save = useMutation({
    mutationFn: async () => (await api.patch("/api/v1/users/me", {
      name,
      email,
      language,
      notification_preferences: { push_enabled: pushEnabled, charging_updates: true, payment_updates: true },
      consent_flags: { profile_edit_confirmed: true }
    })).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      Alert.alert("Profile updated", "Your profile preferences are saved.");
      router.back();
    },
    onError: () => Alert.alert("Profile not saved", "Please keep backend and MongoDB running, then try again.")
  });

  return (
    <FxScreen>
      <BackHeader title="Edit Profile" onBack={() => router.back()} />
      <FxCard style={{ backgroundColor: fx.navy }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 68, height: 68, borderRadius: 24, backgroundColor: fx.teal, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 25, fontWeight: "900" }}>{name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "SP"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}>{name || "Shubh Power user"}</Text>
            <Text style={{ color: "#c8d5ff", fontSize: 12 }}>Profile photo upload can connect to object storage in pilot backend.</Text>
          </View>
        </View>
        <Cta label="Change profile photo" icon="camera-outline" kind="teal" onPress={() => Alert.alert("Photo upload", "Avatar storage is API-ready; connect S3/Cloudinary for production uploads.")} />
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Personal information</Text>
        <Field label="Full name" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "900" }}>Language</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pill label="English" selected={language === "en"} onPress={() => setLanguage("en")} />
          <Pill label="Hindi" selected={language === "hi"} onPress={() => setLanguage("hi")} />
        </View>
      </FxCard>

      <FxCard>
        <Text style={{ color: fx.ink, fontWeight: "900" }}>Notifications</Text>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: pushEnabled }} onPress={() => setPushEnabled((value) => !value)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: fx.ink, fontWeight: "900" }}>Charging, payment and support alerts</Text>
            <Text style={{ color: fx.muted, fontSize: 12 }}>Push updates for important account events.</Text>
          </View>
          <Ionicons name={pushEnabled ? "toggle" : "toggle-outline"} size={34} color={pushEnabled ? fx.blue : fx.faint} />
        </Pressable>
      </FxCard>

      <Cta label="Save Profile" icon="checkmark" onPress={() => save.mutate()} disabled={save.isPending} />
    </FxScreen>
  );
}

function Field(props: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: "default" | "email-address"; autoCapitalize?: "none" }) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={{ color: fx.muted, fontSize: 12, fontWeight: "900" }}>{props.label}</Text>
      <FxInput value={props.value} onChangeText={props.onChangeText} keyboardType={props.keyboardType} autoCapitalize={props.autoCapitalize} />
    </View>
  );
}
