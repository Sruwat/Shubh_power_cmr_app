import { create } from "zustand";

export type StationMode = "shubh" | "all" | "private";
export type SortMode = "distance" | "availability" | "price" | "rating" | "speed";

export type StationFilterState = {
  mode: StationMode;
  brand: string;
  accessType: string;
  verificationStatus: string;
  availableOnly: boolean;
  compatibleOnly: boolean;
  demoOnly: boolean;
  connectorType: string;
  radiusKm: number;
  minRating: number;
  minPowerKw: number;
  sortMode: SortMode;
  setMode: (mode: StationMode) => void;
  setBrand: (brand: string) => void;
  setAccessType: (accessType: string) => void;
  setVerificationStatus: (verificationStatus: string) => void;
  setConnectorType: (connectorType: string) => void;
  setRadiusKm: (radiusKm: number) => void;
  setMinRating: (minRating: number) => void;
  setMinPowerKw: (minPowerKw: number) => void;
  setSortMode: (sortMode: SortMode) => void;
  toggleAvailableOnly: () => void;
  toggleCompatibleOnly: () => void;
  toggleDemoOnly: () => void;
  reset: () => void;
};

const defaults = {
  mode: "all" as StationMode,
  brand: "All",
  accessType: "All",
  verificationStatus: "All",
  availableOnly: true,
  compatibleOnly: true,
  demoOnly: false,
  connectorType: "CCS2",
  radiusKm: 8,
  minRating: 4,
  minPowerKw: 25,
  sortMode: "distance" as SortMode
};

export const useStationFilters = create<StationFilterState>((set) => ({
  ...defaults,
  setMode: (mode) => set({ mode }),
  setBrand: (brand) => set({ brand }),
  setAccessType: (accessType) => set({ accessType }),
  setVerificationStatus: (verificationStatus) => set({ verificationStatus }),
  setConnectorType: (connectorType) => set({ connectorType }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  setMinRating: (minRating) => set({ minRating }),
  setMinPowerKw: (minPowerKw) => set({ minPowerKw }),
  setSortMode: (sortMode) => set({ sortMode }),
  toggleAvailableOnly: () => set((state) => ({ availableOnly: !state.availableOnly })),
  toggleCompatibleOnly: () => set((state) => ({ compatibleOnly: !state.compatibleOnly })),
  toggleDemoOnly: () => set((state) => ({ demoOnly: !state.demoOnly })),
  reset: () => set({ ...defaults })
}));
