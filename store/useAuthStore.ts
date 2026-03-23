import { User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. persist 임포트

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
    // 2. persist로 전체를 감싸줍니다.
    (set) => ({
      accessToken: null,
      user: null,
      isAuthReady: false,
      setLogin: (accessToken) => set({ accessToken }),
      setUserInfo: (userData) => set({ user: userData }),
      setAuthReady: (ready) => set({ isAuthReady: ready }),
      setLogout: () => set({ accessToken: null, user: null }), // 로그아웃 시 둘 다 초기화
    }),
    {
      name: "auth-storage", // 3. 로컬 스토리지에 저장될 이름(키값)
    },
  ),
);
