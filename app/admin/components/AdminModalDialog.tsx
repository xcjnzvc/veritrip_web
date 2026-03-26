"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminTw } from "./styles";

export type AdminModalDialogProps = {
  /** 다이얼로그 제목 */
  title: ReactNode;
  /** 제목 아래 보조 설명 (선택) */
  subtitle?: ReactNode;
  /** 본문 — 폼·테이블 등 */
  children: ReactNode;
  /** 닫기(X) 동작. 없으면 닫기 버튼을 렌더하지 않습니다. */
  onClose?: () => void;
  /**
   * true(기본): 전체 화면 백드롭 + 중앙 카드
   * false: 백드롭 없이 모달과 동일한 카드만 (페이지 내 인라인용)
   */
  withBackdrop?: boolean;
  /** 카드(`modalCard`)에 추가 클래스 */
  className?: string;
  /** 본문 영역 스크롤 활성화 여부 */
  contentScrollable?: boolean;
  /** 본문 영역 최대 높이 클래스 (예: max-h-[70vh]) */
  contentMaxHeightClassName?: string;
  /** 본문 영역 추가 클래스 */
  contentClassName?: string;
};

/**
 * Admin 공통 모달/카드 프레임 — 백드롭(선택) + 제목/부제/닫기 + children.
 */
export default function AdminModalDialog({
  title,
  subtitle,
  children,
  onClose,
  withBackdrop = true,
  className,
  contentScrollable = false,
  contentMaxHeightClassName = "max-h-[70vh]",
  contentClassName,
}: AdminModalDialogProps) {
  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const card = (
    <div className={cn(adminTw.modalCard, className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-lg leading-tight font-semibold">{title}</h2>
          {subtitle ? <p className="text-muted-foreground text-sm">{subtitle}</p> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground shrink-0 rounded p-1"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          contentScrollable && contentMaxHeightClassName,
          contentScrollable && "overflow-y-auto pr-1",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );

  if (!withBackdrop) {
    return card;
  }

  return <div className={adminTw.modalBackdrop}>{card}</div>;
}
