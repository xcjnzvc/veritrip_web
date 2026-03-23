import { Suspense } from "react";
import AdminRouteLoadingUI from "../components/AdminRouteLoadingUI";
import AgentPageContent from "./AgentPageContent";

export default function AgentPage() {
  return (
    <Suspense
      fallback={
        <AdminRouteLoadingUI
          progressTitle="에이전트 데이터를 불러오는 중"
          statusLoadingMessages={[
            "에이전트 그룹 목록을 불러오는 중…",
            "그룹·멤버 구성 정보를 준비하는 중…",
            "관리 콘솔 화면을 구성하는 중…",
          ]}
        />
      }
    >
      <AgentPageContent />
    </Suspense>
  );
}
