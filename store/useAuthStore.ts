import { User } from "@/types/auth";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setUserInfo: (userData: User) => void;
  setLogin: (accessToken: string) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  setLogin: (accessToken) => set({ accessToken }),
  setUserInfo: (userData) => set({ user: userData }),
  setLogout: () => set({ accessToken: null }),
}));
