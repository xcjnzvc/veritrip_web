import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setLogin: (accessToken: string, refreshToken: string) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      // 두 토큰을 동시에 저장합니다.
      setLogin: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setLogout: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage", // localStorage에 저장되어 새로고침해도 유지됩니다. [cite: 2026-03-06]
    },
  ),
);
