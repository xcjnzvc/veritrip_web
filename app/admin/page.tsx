"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userInfo } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

const LoginModal = dynamic(() => import("@/app/main/_components/LoginModal"), {
  ssr: false,
});
import { adminTw } from "./components/styles";
import AdminPageHeader from "./components/AdminPageHeader";

export default function AdminPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
      <div className={adminTw.rowBetween}>
        <AdminPageHeader title="Admin Page" />
        {!isLoggedIn && (
          <button
            type="button"
            className="rounded-full bg-[#222222] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#111111]"
            onClick={() => setIsLoginModalOpen(true)}
          >
            로그인
          </button>
        )}
      </div>

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

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
}
