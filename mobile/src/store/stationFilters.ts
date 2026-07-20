import { create } from "zustand";

export type StationMode = "shubh" | "all" | "private";
export type SortMode = "distance" | "availability" | "price" | "rating" | "speed";

type StationFilterState = {
  mode: StationMode;
  availableOnly: boolean;
  compatibleOnly: boolean;
  connectorType: string;
  radiusKm: number;
  minRating: number;
  minPowerKw: number;
  sortMode: SortMode;
  setMode: (mode: StationMode) => void;
  setConnectorType: (connectorType: string) => void;
  setRadiusKm: (radiusKm: number) => void;
  setMinRating: (minRating: number) => void;
  setSortMode: (sortMode: SortMode) => void;
  toggleAvailableOnly: () => void;
  toggleCompatibleOnly: () => void;
  reset: () => void;
};

const defaults = {
  mode: "shubh" as StationMode,
  availableOnly: true,
  compatibleOnly: true,
  connectorType: "CCS2",
  radiusKm: 8,
  minRating: 4,
  minPowerKw: 25,
  sortMode: "distance" as SortMode
};

export const useStationFilters = create<StationFilterState>((set) => ({
  ...defaults,
  setMode: (mode) => set({ mode }),
  setConnectorType: (connectorType) => set({ connectorType }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  setMinRating: (minRating) => set({ minRating }),
  setSortMode: (sortMode) => set({ sortMode }),
  toggleAvailableOnly: () => set((state) => ({ availableOnly: !state.availableOnly })),
  toggleCompatibleOnly: () => set((state) => ({ compatibleOnly: !state.compatibleOnly })),
  reset: () => set(defaults)
}));
