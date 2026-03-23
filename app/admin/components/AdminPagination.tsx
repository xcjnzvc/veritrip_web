"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminTw } from "./styles";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: AdminPaginationProps) {
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = totalPages !== 0 && currentPage >= totalPages;

  return (
    <div className={adminTw.paginationWrap}>
      <span>
        {currentPage} / {totalPages} 페이지
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={adminTw.iconButton}
          onClick={onPrev}
          disabled={isPrevDisabled}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          className={adminTw.iconButton}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
