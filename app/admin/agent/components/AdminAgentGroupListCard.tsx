"use client";

import type { AgentGroupListResponse } from "@/lib/api/agent-group";
import { AGENT_GROUP_LIST_TAKE } from "@/lib/constants/agentGroupList";
import { useAgentGroupListQuery } from "@/lib/queries/agent-group";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AdminCardSectionHeader from "../../components/AdminCardSectionHeader";
import AdminModalDialog from "../../components/AdminModalDialog";
import AdminPagination from "../../components/AdminPagination";
import { adminTw } from "../../components/styles";
import { useAgentGroupPage } from "./AgentGroupPageContext";
import AdminAgentGroupCreateForm from "./AdminAgentGroupCreateForm";
import AdminAgentGroupListTable from "./AdminAgentGroupListTable";

export type AdminAgentGroupListCardProps = {
  initialGroupPage?: number;
  initialGroupList?: AgentGroupListResponse;
  initialGroupListUpdatedAt?: number;
};

export default function AdminAgentGroupListCard({
  initialGroupPage = 1,
  initialGroupList,
  initialGroupListUpdatedAt,
}: AdminAgentGroupListCardProps) {
  const { selectedGroupId, setSelectedGroupId } = useAgentGroupPage();
  const [groupPage, setGroupPage] = useState(initialGroupPage);
  const [isGroupCreateOpen, setIsGroupCreateOpen] = useState(false);

  const useServerSeed =
    initialGroupList != null &&
    initialGroupListUpdatedAt != null &&
    groupPage === initialGroupPage;

  const {
    data: groupListData,
    isLoading,
    isError,
    error,
  } = useAgentGroupListQuery(
    { page: groupPage, take: AGENT_GROUP_LIST_TAKE },
    useServerSeed
      ? { initialData: initialGroupList, initialDataUpdatedAt: initialGroupListUpdatedAt }
      : undefined,
  );

  const groups = groupListData?.data ?? [];
  const meta = groupListData?.meta;

  return (
    <div className="lg:col-span-1">
      <div className={adminTw.card}>
        <AdminCardSectionHeader
          title="그룹 목록"
          description={
            isLoading ? "목록을 불러오는 중…" : `총 ${meta?.totalCount ?? 0}개`
          }
          actions={
            <Button size="sm" onClick={() => setIsGroupCreateOpen(true)} className="gap-2">
              <Plus className="size-4" />
              그룹 생성
            </Button>
          }
        />

        <AdminAgentGroupListTable
          groups={groups}
          isLoading={isLoading}
          isError={isError}
          error={error}
          selectedGroupId={selectedGroupId}
          onSelectGroupId={(id) => setSelectedGroupId(id)}
        />

        {meta ? (
          <AdminPagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPrev={() => setGroupPage((p) => Math.max(1, p - 1))}
            onNext={() => setGroupPage((p) => p + 1)}
          />
        ) : null}
      </div>

      {isGroupCreateOpen ? (
        <AdminModalDialog title="에이전트 그룹 생성" onClose={() => setIsGroupCreateOpen(false)}>
          <AdminAgentGroupCreateForm
            onSuccess={() => {
              setIsGroupCreateOpen(false);
              setSelectedGroupId(null);
            }}
          />
        </AdminModalDialog>
      ) : null}
    </div>
  );
}
