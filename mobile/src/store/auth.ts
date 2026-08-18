import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  onboardingCompleted: boolean;
  profileName: string | null;
  profileEmail: string | null;
  profilePhone: string | null;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setLocalProfile: (profile: { name?: string | null; email?: string | null; phone?: string | null }) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  onboardingCompleted: false,
  profileName: null,
  profileEmail: null,
  profilePhone: null,
  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },
  setLocalProfile: async ({ name, email, phone }) => {
    if (name !== undefined) {
      const normalized = name?.trim() ?? "";
      if (normalized) await SecureStore.setItemAsync("profileName", normalized);
      else await SecureStore.deleteItemAsync("profileName");
    }
    if (email !== undefined) {
      const normalized = email?.trim() ?? "";
      if (normalized) await SecureStore.setItemAsync("profileEmail", normalized);
      else await SecureStore.deleteItemAsync("profileEmail");
    }
    if (phone !== undefined) {
      const normalized = phone?.replace(/\D/g, "").slice(0, 10) ?? "";
      if (normalized) await SecureStore.setItemAsync("profilePhone", normalized);
      else await SecureStore.deleteItemAsync("profilePhone");
    }
    set((state) => ({
      profileName: name !== undefined ? name?.trim() || null : state.profileName,
      profileEmail: email !== undefined ? email?.trim() || null : state.profileEmail,
      profilePhone: phone !== undefined ? phone?.replace(/\D/g, "").slice(0, 10) || null : state.profilePhone
    }));
  },
  completeOnboarding: async () => {
    await SecureStore.setItemAsync("onboardingCompleted", "true");
    set({ onboardingCompleted: true });
  },
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const onboardingCompleted = (await SecureStore.getItemAsync("onboardingCompleted")) === "true";
    const profileName = await SecureStore.getItemAsync("profileName");
    const profileEmail = await SecureStore.getItemAsync("profileEmail");
    const profilePhone = await SecureStore.getItemAsync("profilePhone");
    set({ accessToken, refreshToken, onboardingCompleted, profileName, profileEmail, profilePhone, hydrated: true });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("onboardingCompleted");
    await SecureStore.deleteItemAsync("profileName");
    await SecureStore.deleteItemAsync("profileEmail");
    await SecureStore.deleteItemAsync("profilePhone");
    set({ accessToken: null, refreshToken: null, onboardingCompleted: false, profileName: null, profileEmail: null, profilePhone: null });
  }
}));
