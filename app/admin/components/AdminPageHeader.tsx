"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import AdminLoadingUI from "./AdminLoadingUI";
import { adminTw } from "./styles";

const LoginModal = dynamic(() => import("@/app/main/_components/LoginModal"), { ssr: false });

const LOADING_DEMO_MS = 5000;

interface AdminPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** 로그인 버튼 표시. 기본 true */
  showLoginButton?: boolean;
}

export default function AdminPageHeader({
  title,
  subtitle,
  showLoginButton = true,
}: AdminPageHeaderProps) {
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    if (!showLoadingDemo) return;
    const id = window.setTimeout(() => setShowLoadingDemo(false), LOADING_DEMO_MS);
    return () => clearTimeout(id);
  }, [showLoadingDemo]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className={adminTw.headerBlock}>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className={adminTw.subtitle}>{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showLoginButton && !isLoggedIn && (
            <button
              type="button"
              className="rounded-full bg-[#222222] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#111111]"
              onClick={() => setIsLoginModalOpen(true)}
            >
              로그인
            </button>
          )}
          <button
            type="button"
            disabled={showLoadingDemo}
            onClick={() => setShowLoadingDemo(true)}
            className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            로딩 UI 테스트 (약 {LOADING_DEMO_MS / 1000}초)
          </button>
        </div>
      </div>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}

      <AdminLoadingUI
        active={showLoadingDemo}
        progressTitle="테스트 로딩"
        statusLoadingMessages={[
          "데모용 로딩 화면입니다...",
          "약 5초 후 자동으로 닫힙니다.",
          "AdminLoadingUI 동작을 확인하세요.",
        ]}
        brandName="Test"
        showDoneOverlay={false}
      />
    </>
  );
}

