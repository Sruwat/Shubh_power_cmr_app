import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export const fx = {
  bg: "#f2f7fc",
  card: "#ffffff",
  ink: "#05072d",
  muted: "#56607a",
  faint: "#aab4cf",
  line: "#dfe7ef",
  blue: "#168fe2",
  blue2: "#2360a3",
  teal: "#23c4b5",
  cyan: "#dff4ff",
  navy: "#151343",
  navy2: "#233e7a",
  red: "#ff4b3e",
  amber: "#d99622",
  violet: "#8b33ff"
};

export function FxScreen({ children, scroll = true, style }: PropsWithChildren<{ scroll?: boolean; style?: ViewStyle }>) {
  const insets = useSafeAreaInsets();
  if (!scroll) {
    return (
      <SafeAreaView edges={["top"]} style={[styles.screen, style]}>
        {children}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView edges={["top"]} style={[styles.screen, style]}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function FxHeader({ title, subtitle, right, menuPress }: { title: string; subtitle?: string; right?: ReactNode; menuPress?: () => void }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
      {menuPress ? <CircleButton icon="menu-outline" onPress={menuPress} label="Open menu" /> : null}
    </View>
  );
}

export function BrandLogo({ variant = "wordmark", width = 92 }: { variant?: "wordmark" | "mark"; width?: number }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (variant !== "mark") return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1350, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1350, useNativeDriver: true })
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse, variant]);

  if (variant === "mark") {
    return (
      <View style={{ width, height: width, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: width * 1.18,
            height: width * 1.18,
            borderRadius: width * 0.59,
            backgroundColor: "rgba(255,153,0,0.18)",
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.58] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.08] }) }]
          }}
        />
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: width,
            height: width,
            borderRadius: width * 0.5,
            backgroundColor: "rgba(22,143,226,0.14)",
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.42, 0.16] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1.24] }) }]
          }}
        />
        <Image
          source={require("../../assets/shubh-power-mark.png")}
          resizeMode="contain"
          style={{ width, height: width }}
        />
      </View>
    );
  }
  return (
    <Image
      source={require("../../assets/shubh-power-wordmark.png")}
      resizeMode="contain"
      style={{ width, height: width * 0.72 }}
    />
  );
}

export function BackHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <View style={styles.backHeader}>
      <CircleButton icon="chevron-back" onPress={onBack} label="Back" />
      <Text style={styles.backTitle}>{title}</Text>
      <View style={{ marginLeft: "auto" }}>{right}</View>
    </View>
  );
}

export function CircleButton({ icon, onPress, label, dark = false }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; label: string; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.circleButton, dark && styles.circleButtonDark]}>
      <Ionicons name={icon} size={21} color={dark ? "#fff" : fx.ink} />
    </Pressable>
  );
}

export function FxCard({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function EnergyCard({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1500, useNativeDriver: true })
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <View style={[styles.energyCard, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.energyGlow,
          {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.48] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.08] }) }]
          }
        ]}
      />
      {children}
    </View>
  );
}

export function Pill({ label, icon, selected = false, tone = "blue", onPress }: { label: string; icon?: keyof typeof Ionicons.glyphMap; selected?: boolean; tone?: "blue" | "teal" | "amber" | "red" | "violet"; onPress?: () => void }) {
  const color = tone === "teal" ? fx.teal : tone === "amber" ? fx.amber : tone === "red" ? fx.red : tone === "violet" ? fx.violet : fx.blue;
  const Container = onPress ? Pressable : View;
  return (
    <Container accessibilityRole={onPress ? "button" : undefined} onPress={onPress} style={[styles.pill, selected && { borderColor: color, backgroundColor: `${color}16` }]}>
      {icon ? <Ionicons name={icon} size={15} color={selected ? color : fx.muted} /> : null}
      <Text style={[styles.pillText, selected && { color }]}>{label}</Text>
    </Container>
  );
}

export function SearchBar({ placeholder = "Search station, address, area...", onPress, rightIcon = "options-outline" }: { placeholder?: string; onPress?: () => void; rightIcon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.search}>
      <Ionicons name="search-outline" size={20} color={fx.faint} />
      <Text style={styles.searchText}>{placeholder}</Text>
      <Ionicons name={rightIcon} size={22} color={fx.blue} />
    </Pressable>
  );
}

export function FxInput(props: TextInputProps) {
  return <TextInput placeholderTextColor={fx.faint} style={styles.input} {...props} />;
}

export function Cta({ label, icon, onPress, disabled = false, kind = "primary" }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void; disabled?: boolean; kind?: "primary" | "secondary" | "teal" | "danger" }) {
  const bg = kind === "teal" ? fx.teal : kind === "danger" ? fx.red : fx.blue;
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.cta, kind === "secondary" ? styles.ctaSecondary : { backgroundColor: bg }, disabled && styles.disabled]}>
      {icon ? <Ionicons name={icon} size={20} color={kind === "secondary" ? fx.blue : "#fff"} /> : null}
      <Text style={[styles.ctaText, kind === "secondary" && { color: fx.blue }]}>{label}</Text>
    </Pressable>
  );
}

export function BottomCta({ label, icon, onPress }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomCta, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <Cta label={label} icon={icon} onPress={onPress} />
    </View>
  );
}

export function StatTile({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "teal" | "navy" }) {
  const color = tone === "teal" ? fx.teal : tone === "navy" ? fx.navy : fx.blue;
  return (
    <View style={[styles.statTile, { backgroundColor: `${color}12` }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function ListRow({ icon, title, subtitle, right, onPress }: { icon?: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; right?: ReactNode; onPress?: () => void }) {
  const Container = onPress ? Pressable : View;
  return (
    <Container accessibilityRole={onPress ? "button" : undefined} onPress={onPress} style={styles.row}>
      {icon ? <View style={styles.rowIcon}><Ionicons name={icon} size={18} color={fx.blue} /></View> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={20} color={fx.faint} /> : null)}
    </Container>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: fx.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 18, gap: 14 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  brand: { color: fx.blue, fontSize: 13, lineHeight: 16, fontWeight: "900" },
  title: { color: fx.ink, fontSize: 30, lineHeight: 35, fontWeight: "900" },
  subtitle: { color: fx.muted, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  backHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  backTitle: { color: fx.ink, fontSize: 17, fontWeight: "900" },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: fx.card, borderWidth: 1, borderColor: fx.line, alignItems: "center", justifyContent: "center" },
  circleButtonDark: { backgroundColor: "rgba(255,255,255,0.16)", borderColor: "rgba(255,255,255,0.18)" },
  card: { backgroundColor: fx.card, borderRadius: 16, borderWidth: 1, borderColor: fx.line, padding: 18, gap: 12, shadowColor: "#0b1b33", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  energyCard: { backgroundColor: fx.navy, borderRadius: 20, padding: 20, gap: 12, overflow: "hidden", shadowColor: fx.navy, shadowOpacity: 0.22, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  energyGlow: { position: "absolute", width: 150, height: 150, borderRadius: 75, right: -36, top: -45, backgroundColor: fx.teal },
  pill: { minHeight: 36, borderRadius: 18, borderWidth: 1, borderColor: fx.line, backgroundColor: fx.card, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  pillText: { color: fx.muted, fontSize: 13, fontWeight: "900" },
  search: { minHeight: 56, borderRadius: 16, backgroundColor: fx.card, borderWidth: 1, borderColor: fx.line, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10, shadowColor: "#0b1b33", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  searchText: { flex: 1, color: fx.muted, fontSize: 16, fontWeight: "800" },
  input: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: fx.line, backgroundColor: fx.card, paddingHorizontal: 16, color: fx.ink, fontSize: 16, fontWeight: "700" },
  cta: { minHeight: 52, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 18 },
  ctaSecondary: { backgroundColor: fx.card, borderWidth: 1, borderColor: fx.blue },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  disabled: { opacity: 0.48 },
  bottomCta: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: "rgba(255,255,255,0.94)", borderTopWidth: 1, borderTopColor: fx.line },
  statTile: { flex: 1, minHeight: 72, borderRadius: 13, alignItems: "center", justifyContent: "center", padding: 8 },
  statValue: { fontSize: 18, fontWeight: "900" },
  statLabel: { color: fx.muted, fontSize: 12, fontWeight: "700", marginTop: 2 },
  sectionLabel: { color: fx.faint, fontSize: 12, fontWeight: "900", textTransform: "uppercase", marginTop: 5 },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "#edf1f6" },
  rowIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: fx.cyan, alignItems: "center", justifyContent: "center" },
  rowTitle: { color: fx.ink, fontSize: 15, fontWeight: "900" },
  rowSubtitle: { color: fx.muted, fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: fx.line }
});
