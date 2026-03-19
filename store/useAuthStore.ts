import { User } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthReady: boolean;
  setUserInfo: (userData: User) => void;
  setLogin: (accessToken: string) => void;
  setAuthReady: (ready: boolean) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthReady: false,
      setLogin: (accessToken) => set({ accessToken }),
      setUserInfo: (userData) => set({ user: userData }),
      setAuthReady: (ready) => set({ isAuthReady: ready }),
      setLogout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
