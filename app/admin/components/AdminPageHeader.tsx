"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import AdminLoadingUI from "./AdminLoadingUI";
import { adminTw } from "./styles";

const LOADING_DEMO_MS = 5000;

interface AdminPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export default function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);

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
        <button
          type="button"
          disabled={showLoadingDemo}
          onClick={() => setShowLoadingDemo(true)}
          className="shrink-0 rounded-md border border-dashed border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          로딩 UI 테스트 (약 {LOADING_DEMO_MS / 1000}초)
        </button>
      </div>

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

