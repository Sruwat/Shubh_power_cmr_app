import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { StationMap } from "@/components/StationMap";
import { fx, FxScreen, Pill } from "@/components/Futuristic";
import { stations as demoStations } from "@/data/experience";
import { useNearbyStations } from "@/features/useStations";
import { useStationFilters } from "@/store/stationFilters";
import { TopChromeBar } from "@/components/ShubhShell";
import shubhMark from "../../assets/shubh-power-mark.png";

export default function Home() {
  const { data } = useNearbyStations();
  const { height, width } = useWindowDimensions();
  const filters = useStationFilters();
  const carouselRef = useRef<ScrollView | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const referenceStationMeta = "Near DLF Mall of India, Sector 18, Noida · 1.2 km";
  const displayCoords = { latitude: 28.567, longitude: 77.321 };
  const topHeight = Math.max(156, Math.round(height * 0.15));
  const bottomHeight = Math.min(170, Math.max(144, Math.round(height * 0.14)));
  const mapHeight = Math.max(352, Math.round(height - topHeight - bottomHeight - 84));
  const stations = useMemo(() => {
    const source = data?.items?.length ? data.items : demoStations;
    const q = searchQuery.trim().toLowerCase();
    return source
      .filter((station) => stationMatchesMode(station, filters.mode))
      .filter((station) => !q || `${station.name} ${station.area ?? ""} ${station.address ?? ""} ${station.brand ?? ""} ${station.societyName ?? ""}`.toLowerCase().includes(q))
      .slice(0, 15);
  }, [data?.items, filters.mode, searchQuery]);
  const topStations = stations.slice(0, 5);
  const [selectedId, setSelectedId] = useState(() => topStations.find((station) => /Statiq MLCP Noida Sec-18 Charging Hub/i.test(station.name || ""))?.id ?? topStations[0]?.id ?? demoStations[0].id);
  useEffect(() => {
    if (!topStations.some((station) => station.id === selectedId)) {
      setSelectedId(topStations[0]?.id ?? demoStations[0].id);
      carouselRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [topStations, selectedId]);
  const cardWidth = Math.max(294, Math.round(width - 24));

  return (
    <FxScreen scroll={false} style={{ backgroundColor: "#f7f9fd" }}>
      <View style={{ flex: 1 }}>
        <TopChromeBar showBack={true} />

        <View style={[styles.headerBand, { height: topHeight }]}>
          <View style={styles.topCopy}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Charge with confidence.</Text>
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchMain}>
              <Ionicons name="search-outline" size={19} color="#8d99ab" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search station, place or network"
                placeholderTextColor="#8d99ab"
                returnKeyType="search"
                onSubmitEditing={() => router.push("/search")}
                style={styles.searchInput}
              />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Open filters" onPress={() => router.push("/filters")} style={styles.searchFilterButton}>
              <Ionicons name="options-outline" size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.pillRow}>
            <Pill label="All Ev" icon="shield-checkmark-outline" selected={filters.mode === "all"} tone="blue" onPress={() => filters.setMode("all")} />
            <Pill label="Shubh Power Charger" icon="flash-outline" selected={filters.mode === "shubh"} tone="teal" onPress={() => filters.setMode("shubh")} />
            <Pill label="Ev private charging hub" icon="cash-outline" selected={filters.mode === "private"} tone="amber" onPress={() => filters.setMode("private")} />
          </View>
        </View>

        <View style={[styles.mapWrap, { height: mapHeight }]}>
          <StationMap
            coords={displayCoords}
            stations={stations}
            onSelect={(station) => setSelectedId(station.id)}
            onLocate={() => setSelectedId(topStations[0]?.id ?? demoStations[0].id)}
            onOpenFilters={() => router.push("/filters")}
          />

          <View style={styles.stationCardWrap}>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={cardWidth + 8}
              decelerationRate="fast"
              onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / Math.max(cardWidth + 8, 1));
                const next = topStations[index];
                if (next) setSelectedId(next.id);
              }}
              contentContainerStyle={styles.carouselContent}
            >
              {topStations.map((station, index) => (
                <Pressable key={station.id} accessibilityRole="button" onPress={() => router.push(`/station/${station.id}`)} style={[styles.stationCard, { width: cardWidth }]}>
                  <View style={styles.stationBadge}>{stationBadgeVisual(station)}</View>
                  <View style={{ flex: 1, gap: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text numberOfLines={1} style={styles.stationName}>{station.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={styles.stationMeta}>{station.address || referenceStationMeta}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <View style={styles.metaPill}>
                        <Ionicons name="flash-outline" size={12} color="#2b3444" />
                        <Text style={styles.metaPillText}>{station.powerLabel || `${station.max_power_kw ?? 60} kW`}</Text>
                      </View>
                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>₹{station.pricePerKwh ?? 18}/kWh</Text>
                      </View>
                      <View style={{ flex: 1 }} />
                      <View style={styles.chargeSurePill}>
                        <Text style={styles.chargeSureText}>{station.trustScore ?? 96} ChargeSure</Text>
                      </View>
                      <View style={styles.stationArrow}>
                        <Ionicons name="chevron-forward" size={20} color="#146ddf" />
                      </View>
                    </View>
                    <View style={styles.stationStatsRow}>
                      <StatItem icon="checkmark-circle-outline" label={station.availabilityLabel || "4/6 available"} selected />
                      <View style={styles.stationDivider} />
                      <Text style={styles.carouselCounter}>{index + 1}/5</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={[styles.quickActionsSection, { height: bottomHeight }]}>
          <View style={styles.quickActionsWrap}>
            <QuickAction title="Plan journey" subtitle="Plan A + backup" icon="navigate-outline" onPress={() => router.push("/trip-plan")} />
            <QuickAction title="QueuePass" subtitle="Skip uncertainty" icon="time-outline" onPress={() => router.push("/queuepass")} />
            <QuickAction title="Rescue" subtitle="Urgent help" icon="medkit-outline" onPress={() => router.push("/rescue")} />
          </View>
        </View>
      </View>
    </FxScreen>
  );
}

function stationMatchesMode(station: { stationCategory?: string; isPrivateHub?: boolean; isShubhHub?: boolean; societyName?: string; brand?: string; name?: string }, mode: "shubh" | "all" | "private") {
  if (mode === "all") return !(station.stationCategory === "shubh" || station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`));
  if (mode === "private") return station.stationCategory === "private" || station.isPrivateHub || Boolean(station.societyName);
  return station.stationCategory === "shubh" || station.isShubhHub || /shu?bh/i.test(`${station.brand} ${station.name}`);
}

function StatItem({ icon, label, selected = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; selected?: boolean }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={13} color={selected ? "#17a95a" : "#2d3444"} />
      <Text style={[styles.statItemText, selected && { color: "#17a95a" }]}>{label}</Text>
    </View>
  );
}

function QuickAction({ title, subtitle, icon, onPress }: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.quickActionCard}>
      <View style={styles.quickActionIconWrap}>
        <Ionicons name={icon} size={20} color={fx.blue} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = {
  topCopy: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12
  },
  headerBand: {
    justifyContent: "flex-start" as const,
    gap: 4,
    paddingBottom: 0
  },
  heroTitle: {
    color: "#25354f",
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.25
  },
  searchRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 2
  },
  searchMain: {
    flex: 1,
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#d6e1ec",
    backgroundColor: "#fff",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingHorizontal: 14
  },
  searchText: {
    color: "#6f7b8d",
    fontSize: 13,
    fontWeight: "500" as const
  },
  searchInput: {
    flex: 1,
    color: "#25354f",
    fontSize: 13,
    fontWeight: "600" as const,
    paddingVertical: 0,
    paddingRight: 4
  },
  searchFilterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: fx.blue,
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  pillRow: {
    flexDirection: "row" as const,
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 2
  },
  mapWrap: {
    flex: 0,
    marginTop: -2,
    marginHorizontal: 0,
    position: "relative" as const
  },
  stationCardWrap: {
    position: "absolute" as const,
    left: 12,
    right: 12,
    bottom: 8
  },
  carouselContent: {
    paddingHorizontal: 12,
    gap: 8
  },
  stationCard: {
    minHeight: 102,
    flexDirection: "row" as const,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dde6ef",
    padding: 12,
    gap: 10,
    shadowColor: "#0b1b33",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  stationBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#7a4df0",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  stationBadgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900" as const
  },
  stationName: {
    color: fx.ink,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "900" as const
  },
  stationMeta: {
    color: "#8c96a9",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700" as const
  },
  metaPill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4
  },
  metaPillText: {
    color: "#2b3444",
    fontSize: 11,
    fontWeight: "700" as const
  },
  chargeSurePill: {
    backgroundColor: "#e6fbef",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start" as const,
    marginTop: 1
  },
  chargeSureText: {
    color: "#11a85b",
    fontSize: 10,
    fontWeight: "900" as const
  },
  stationArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef6ff",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  stationStatsRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
    flexWrap: "wrap" as const
  },
  stationDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#dde6ef"
  },
  carouselCounter: {
    color: fx.muted,
    fontSize: 10,
    fontWeight: "800" as const
  },
  quickActionsSection: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 6,
    justifyContent: "flex-start" as const
  },
  quickActionsWrap: {
    flexDirection: "row" as const,
    gap: 8,
    alignItems: "stretch" as const
  },
  quickActionCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dde6ef",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    shadowColor: "#0b1b33",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  quickActionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#e9f1ff",
    alignItems: "center" as const,
    justifyContent: "center" as const
  },
  quickActionTitle: {
    color: fx.ink,
    fontSize: 11,
    fontWeight: "900" as const,
    textAlign: "center" as const
  },
  quickActionSubtitle: {
    color: fx.muted,
    fontSize: 10,
    fontWeight: "700" as const,
    textAlign: "center" as const
  },
  statItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4
  },
  statItemText: {
    color: "#2b3444",
    fontSize: 11,
    fontWeight: "700" as const
  }
};

function stationBrandInitial(brand?: string) {
  const text = `${brand ?? ""}`.toLowerCase();
  if (/shubh/.test(text)) return "S";
  if (/tata/.test(text)) return "T";
  if (/statiq/.test(text)) return "S";
  if (/jio/.test(text)) return "J";
  if (/adani/.test(text)) return "A";
  if (/eesl/.test(text)) return "E";
  return "E";
}

function stationBadgeVisual(station: { brand?: string; isShubhHub?: boolean; name?: string }) {
  const brand = `${station.brand ?? station.name ?? ""}`.toLowerCase();
  if (/shubh/.test(brand) || station.isShubhHub) {
    return <Image source={shubhMark} resizeMode="contain" style={{ width: 26, height: 26 }} />;
  }
  if (/tata/.test(brand)) return <Image source={{ uri: "https://logo.clearbit.com/tatapower.com" }} resizeMode="contain" style={{ width: 23, height: 23 }} />;
  if (/statiq/.test(brand)) return <Image source={{ uri: "https://logo.clearbit.com/statiq.in" }} resizeMode="contain" style={{ width: 23, height: 23 }} />;
  if (/jio-bp|jio bp|jio/.test(brand)) return <Image source={{ uri: "https://logo.clearbit.com/jiobp.com" }} resizeMode="contain" style={{ width: 23, height: 23 }} />;
  return <Text style={styles.stationBadgeText}>{stationBrandInitial(station.brand)}</Text>;
}
