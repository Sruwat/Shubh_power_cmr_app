import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  onboardingCompleted: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  onboardingCompleted: false,
  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },
  completeOnboarding: async () => {
    await SecureStore.setItemAsync("onboardingCompleted", "true");
    set({ onboardingCompleted: true });
  },
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const onboardingCompleted = (await SecureStore.getItemAsync("onboardingCompleted")) === "true";
    set({ accessToken, refreshToken, onboardingCompleted, hydrated: true });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("onboardingCompleted");
    set({ accessToken: null, refreshToken: null, onboardingCompleted: false });
  }
}));
