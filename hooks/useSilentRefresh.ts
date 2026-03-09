import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const useSilentRefresh = () => {
  const { setLogin, setLogout } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await axiosInstance.post("/auth/refresh");
        const newAccessToken = response.data.data.accessToken;
        setLogin(newAccessToken); // accessToken만 Zustand에 저장
        // refreshToken은 백엔드가 쿠키로 알아서 갱신해줌!
      } catch {
        setLogout();
      }
    };

    refresh();
  }, []);
};
