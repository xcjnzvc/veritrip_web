"use client";

import AdminPageHeader from "../components/AdminPageHeader";
import { adminTw } from "../components/styles";
import { AgentGroupPageProvider } from "./components/AgentGroupPageContext";
import AdminAgentGroupDetailCard from "./components/AdminAgentGroupDetailCard";
import AdminAgentGroupListCard from "./components/AdminAgentGroupListCard";

export default function AgentPageClient() {
  return (
    <AgentGroupPageProvider>
      <div className={adminTw.page}>
        <AdminPageHeader
          title="에이전트"
          subtitle="에이전트 생성 전에 그룹을 먼저 만들고, 멤버 에이전트를 구성하세요."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <AdminAgentGroupListCard />
          <AdminAgentGroupDetailCard />
        </div>
      </div>
    </AgentGroupPageProvider>
  );
}
