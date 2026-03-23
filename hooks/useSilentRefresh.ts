import { refreshSession } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const useSilentRefresh = () => {
  const { setLogin, setUserInfo, setLogout, setAuthReady } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      try {
        const session = await refreshSession();
        setLogin(session.accessToken);
        setUserInfo(session.user);
      } catch {
        // refresh 실패 시 인증 정보만 초기화하고 앱 렌더링은 계속 진행
        setLogout();
      } finally {
        // 첫 인증 시도 완료 후 렌더링 허용
        setAuthReady(true);
      }
    };

    refresh();
  }, [setAuthReady, setLogin, setLogout, setUserInfo]);
};
