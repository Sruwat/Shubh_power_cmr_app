import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren, ReactNode } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, spacing, type } from "./tokens";
import shubhWordmark from "../../assets/shubh-power-wordmark.png";
import { useDrawer } from "@/components/drawerContext";

export function Screen({ children, scroll = false, padded = true }: PropsWithChildren<{ scroll?: boolean; padded?: boolean }>) {
  const insets = useSafeAreaInsets();
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, padded && styles.padded, { paddingBottom: insets.bottom + 136 }]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.safe, padded && styles.padded]} edges={["top"]}>
      {children}
    </SafeAreaView>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Title({ children, compact = false }: PropsWithChildren<{ compact?: boolean }>) {
  return <Text style={[styles.title, compact && styles.titleCompact]}>{children}</Text>;
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Body({ children }: PropsWithChildren) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Caption({ children }: PropsWithChildren) {
  return <Text style={styles.caption}>{children}</Text>;
}

export function Badge({ label, tone = "unknown" }: { label: string; tone?: "success" | "warning" | "error" | "unknown" | "info" }) {
  const toneColor = tone === "success" ? colors.success : tone === "warning" ? colors.warning : tone === "error" ? colors.error : tone === "info" ? colors.primary : colors.unknown;
  const bg = tone === "success" ? colors.successSoft : tone === "warning" ? colors.warningSoft : tone === "error" ? colors.errorSoft : tone === "info" ? colors.primarySoft : colors.unknownSoft;
  return (
    <View style={[styles.badge, { borderColor: toneColor, backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: toneColor }]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, loading = false, icon }: { label: string; onPress: () => void; loading?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.primaryButton}>
      {loading ? <ActivityIndicator color="#fff" /> : <View style={styles.buttonRow}>{icon && <Ionicons name={icon} size={18} color="#fff" />}<Text style={styles.primaryButtonText}>{label}</Text></View>}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}>
      <View style={styles.buttonRow}>{icon && <Ionicons name={icon} size={18} color={colors.primary} />}<Text style={styles.secondaryButtonText}>{label}</Text></View>
    </Pressable>
  );
}

export function Field(props: TextInputProps) {
  return <TextInput placeholderTextColor="#8f8f8f" style={styles.field} {...props} />;
}

export function AppHeader({ title, subtitle, right, backPress, notificationPress }: { title: string; subtitle?: string; right?: ReactNode; backPress?: () => void; notificationPress?: () => void }) {
  const { openDrawer } = useDrawer();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable accessibilityRole="button" accessibilityLabel="Open menu" onPress={openDrawer} style={styles.headerButton}>
          <Ionicons name="menu-outline" size={22} color={colors.navy} />
        </Pressable>
        {backPress ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={backPress} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={22} color={colors.navy} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ flex: 1, minHeight: 56 }}>
        <Image source={shubhWordmark} resizeMode="contain" style={{ width: 102, height: 36 }} />
        <Title compact>{title}</Title>
        {subtitle ? <Caption>{subtitle}</Caption> : null}
      </View>
      <View style={styles.headerRight}>
        {notificationPress ? <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={notificationPress} style={styles.headerButton}><Ionicons name="notifications-outline" size={20} color={colors.navy} /></Pressable> : null}
        {right}
      </View>
    </View>
  );
}

export function IconButton({ icon, onPress, label }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; label: string }) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.iconButton}>
      <Ionicons name={icon} size={20} color={colors.navy} />
    </Pressable>
  );
}

export function Chip({ label, selected = false, icon, onPress }: { label: string; selected?: boolean; icon?: keyof typeof Ionicons.glyphMap; onPress?: () => void }) {
  const Container = onPress ? Pressable : View;
  return (
    <Container accessibilityRole={onPress ? "button" : undefined} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      {icon && <Ionicons name={icon} size={14} color={selected ? colors.primary : colors.body} />}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Container>
  );
}

export function EmptyState({ title, body, icon = "information-circle-outline" }: { title: string; body: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Card style={styles.empty}>
      <Ionicons name={icon} size={26} color={colors.primary} />
      <SectionTitle>{title}</SectionTitle>
      <Body>{body}</Body>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#edf5fb" },
  padded: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.lg },
  scrollContent: { gap: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: "#d8e4f0", padding: spacing.lg, gap: spacing.md, shadowColor: "#0b1b33", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  title: { color: colors.navy, fontSize: type.h1, lineHeight: 34, fontWeight: "800" },
  titleCompact: { fontSize: 26, lineHeight: 31 },
  sectionTitle: { color: colors.navy, fontSize: type.h2, lineHeight: 26, fontWeight: "800" },
  body: { color: colors.body, fontSize: type.small, lineHeight: 21 },
  caption: { color: colors.muted, fontSize: type.caption, lineHeight: 17, fontWeight: "600" },
  brand: { color: colors.primary, fontSize: type.caption, lineHeight: 16, fontWeight: "900", textTransform: "uppercase" },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: "#fff", borderRadius: 24, borderWidth: 1, borderColor: "#dce8f5", padding: 14, shadowColor: "#0b1b33", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  headerButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#f4f8fb", borderWidth: 1, borderColor: "#e2ebf4", alignItems: "center", justifyContent: "center" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  badge: { alignSelf: "flex-start", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  badgeText: { fontSize: type.caption, fontWeight: "700" },
  primaryButton: { minHeight: 52, borderRadius: radius.button, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg },
  primaryButtonText: { color: "#fff", fontSize: type.body, fontWeight: "800" },
  secondaryButton: { minHeight: 52, borderRadius: radius.button, borderColor: colors.primary, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg, backgroundColor: "#fff" },
  secondaryButtonText: { color: colors.primary, fontSize: type.body, fontWeight: "800" },
  buttonRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  field: { minHeight: 54, borderRadius: radius.control, borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", paddingHorizontal: spacing.lg, color: colors.ink, fontSize: type.body },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  chip: { flexDirection: "row", alignItems: "center", gap: spacing.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  chipText: { color: colors.body, fontSize: type.caption, fontWeight: "800" },
  chipTextSelected: { color: colors.primary },
  empty: { alignItems: "flex-start" }
});
