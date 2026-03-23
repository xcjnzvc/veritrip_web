"use client";

import AdminLoadingUI from "./AdminLoadingUI";

export type AdminRouteLoadingUIProps = {
  progressTitle?: string;
  statusLoadingMessages?: string[];
  statusDoneText?: string;
};

const DEFAULT_MESSAGES = [
  "데이터를 요청하는 중…",
  "화면을 구성하는 중…",
  "관리 콘솔을 준비하는 중…",
];

/**
 * 라우트 전환(`loading.tsx`)·Suspense fallback 등 admin 공통 로딩 오버레이.
 */
export default function AdminRouteLoadingUI({
  progressTitle = "관리자 페이지를 불러오는 중",
  statusLoadingMessages = DEFAULT_MESSAGES,
  statusDoneText = "화면을 불러왔습니다.",
}: AdminRouteLoadingUIProps) {
  return (
    <AdminLoadingUI
      active
      progressTitle={progressTitle}
      statusLoadingMessages={statusLoadingMessages}
      statusDoneText={statusDoneText}
    />
  );
}
