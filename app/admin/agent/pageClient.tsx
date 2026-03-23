"use client";

import type { AgentGroupListResponse } from "@/lib/api/agent-group";
import AdminPageHeader from "../components/AdminPageHeader";
import { adminTw } from "../components/styles";
import { AgentGroupPageProvider } from "./components/AgentGroupPageContext";
import AdminAgentGroupDetailCard from "./components/AdminAgentGroupDetailCard";
import AdminAgentGroupListCard from "./components/AdminAgentGroupListCard";

export type AgentPageClientProps = {
  initialGroupList?: AgentGroupListResponse;
  initialGroupListUpdatedAt?: number;
};

export default function AgentPageClient({
  initialGroupList,
  initialGroupListUpdatedAt,
}: AgentPageClientProps) {
  return (
    <AgentGroupPageProvider>
      <div className={adminTw.page}>
        <AdminPageHeader
          title="에이전트"
          subtitle="에이전트 생성 전에 그룹을 먼저 만들고, 멤버 에이전트를 구성하세요."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <AdminAgentGroupListCard
            initialGroupList={initialGroupList}
            initialGroupListUpdatedAt={initialGroupListUpdatedAt}
          />
          <AdminAgentGroupDetailCard />
        </div>
      </div>
    </AgentGroupPageProvider>
  );
}
