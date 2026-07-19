import { router } from "expo-router";
import { FlatList, View } from "react-native";
import { BackHeader, FxScreen } from "@/components/Futuristic";
import { StationCard } from "@/components/StationCard";
import { stations } from "@/data/experience";

export default function Saved() {
  return (
    <FxScreen>
      <BackHeader title="Saved Stations" onBack={() => router.back()} />
      <FlatList data={stations.filter((_, index) => index !== 3)} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => <StationCard station={item} compact />} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} />
    </FxScreen>
  );
}
