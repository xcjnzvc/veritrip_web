"use client";

import { Loader2 } from "lucide-react";

type AdminInlineLoadingProps = {
  label?: string;
  className?: string;
};

/**
 * 카드·테이블 영역용 인라인 로딩(전체 화면 오버레이 없음).
 */
export default function AdminInlineLoading({
  label = "데이터를 불러오는 중…",
  className = "",
}: AdminInlineLoadingProps) {
  return (
    <div
      className={`flex min-h-[200px] flex-col items-center justify-center gap-3 px-4 py-10 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="text-muted-foreground size-9 animate-spin" aria-hidden />
      <p className="text-muted-foreground text-center text-sm">{label}</p>
    </div>
  );
}
