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
        // 앱 초기 부트스트랩 단계에서는 refresh 실패를 정상 케이스로 간주한다.
        // (비로그인 상태 또는 만료/미보유 쿠키) -> 강제 로그아웃으로 상태를 덮어쓰지 않음
      } finally {
        setAuthReady(true);
      }
    };

    refresh();
  }, []);
};
