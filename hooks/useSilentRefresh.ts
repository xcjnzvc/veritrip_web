import { refreshSession } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const useSilentRefresh = () => {
  const { setLogin, setUserInfo, setAuthReady } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      try {
        const session = await refreshSession();
        setLogin(session.accessToken);
        setUserInfo(session.user);
      } catch {
        // console.log("refresh 실패했지만 로그아웃 안 함");
        setLogout();
      }
    };

    refresh();
  }, []);
};
