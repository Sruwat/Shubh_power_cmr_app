import { FlatList, View } from "react-native";
import { FxScreen } from "@/components/Futuristic";
import { TopChromeBar } from "@/components/ShubhShell";
import { StationCard } from "@/components/StationCard";
import { stations } from "@/data/experience";

export default function Saved() {
  return (
    <FxScreen>
      <TopChromeBar title="Saved stations" subtitle="" />
      <FlatList data={stations.filter((_, index) => index !== 3)} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => <StationCard station={item} compact />} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} />
    </FxScreen>
  );
}
