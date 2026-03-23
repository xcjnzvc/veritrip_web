"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminCardSectionHeaderProps = {
  /** 카드 상단 제목 (굵은 한 줄) */
  title: ReactNode;
  /** 제목 아래 보조 설명 (muted, 작은 글씨) */
  description?: ReactNode;
  /** 제목 오른쪽에 붙는 영역 (배지 등) */
  titleEndContent?: ReactNode;
  /** 오른쪽(모바일에서는 아래) 액션 영역 — 버튼 등 */
  actions?: ReactNode;
  className?: string;
};

/**
 * admin 카드 내부 상단 툴바 — 제목/설명 + 선택적 액션 버튼.
 */
export default function AdminCardSectionHeader({
  title,
  description,
  titleEndContent,
  actions,
  className,
}: AdminCardSectionHeaderProps) {
  return (
    <div className={cn("border-border border-b px-4 py-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{title}</span>
            {titleEndContent}
          </div>
          {description != null ? (
            <div className="text-muted-foreground text-xs">{description}</div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
