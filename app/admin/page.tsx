"use client";

import { useQuery } from "@tanstack/react-query";
import { userInfo } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import AdminPageHeader from "./components/AdminPageHeader";
import { adminTw } from "./components/styles";

export default function AdminPage() {
  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: userInfo,
    enabled: isLoggedIn,
  });

  const me = data?.data;

  return (
    <div className={adminTw.page}>
      <AdminPageHeader title="Admin Page" />

      {!isLoggedIn && (
        <p className={adminTw.infoText}>관리자 정보를 보려면 먼저 로그인해 주세요.</p>
      )}

      {isLoading && <p className={adminTw.infoText}>내 정보를 불러오는 중...</p>}

      {isError && (
        <p className={adminTw.errorText}>
          내 정보 조회에 실패했습니다: {error instanceof Error ? error.message : "알 수 없는 오류"}
        </p>
      )}

      {!isLoading && !isError && me && (
        <div className={adminTw.infoCard}>
          <p>
            <span className="text-muted-foreground">이름:</span> {me.name}
          </p>
          <p>
            <span className="text-muted-foreground">이메일:</span> {me.email}
          </p>
          <p>
            <span className="text-muted-foreground">역할:</span> {me.role}
          </p>
          <p>
            <span className="text-muted-foreground">ID:</span> {me.id}
          </p>
        </div>
      )}
    </div>
  );
}
