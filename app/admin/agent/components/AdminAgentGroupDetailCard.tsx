"use client";

import { Button } from "@/components/ui/button";
import { agentKeys } from "@/lib/queryKeys/agent";
import {
  useAgentGroupDetailQuery,
  useDeleteAgentGroupMutation,
  useUpdateAgentGroupMutation,
} from "@/lib/queries/agent-group";
import type { AgentGroupMember, AgentGroupMemberDto } from "@/lib/types/agent-group";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AdminCardSectionHeader from "../../components/AdminCardSectionHeader";
import { adminTw } from "../../components/styles";
import { useAgentGroupPage } from "./AgentGroupPageContext";
import AdminAgentCreateForm from "./AdminAgentCreateDialog";
import AdminAgentGroupAddMemberDialog from "./AdminAgentGroupAddMemberDialog";
import AdminAgentGroupMembersTable from "./AdminAgentGroupMembersTable";

export default function AdminAgentGroupDetailCard() {
  const queryClient = useQueryClient();
  const { selectedGroupId, setSelectedGroupId } = useAgentGroupPage();

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [agentCreateOpen, setAgentCreateOpen] = useState(false);

  const {
    data: groupDetailData,
    isLoading: isGroupDetailLoading,
    isError: isGroupDetailError,
    error: groupDetailError,
  } = useAgentGroupDetailQuery(selectedGroupId, true);

  const group = groupDetailData?.data;
  const membersSorted = useMemo(() => {
    const members: AgentGroupMember[] = group?.members ?? [];
    return [...members].sort((a, b) => a.order - b.order);
  }, [group?.members]);

  const updateGroupMembersMutation = useUpdateAgentGroupMutation();
  const deleteGroupMutation = useDeleteAgentGroupMutation();

  const resetMemberDialog = () => {
    setMemberDialogOpen(false);
  };

  const handleRemoveMember = (agentId: string) => {
    if (!selectedGroupId) return;

    const remaining: AgentGroupMemberDto[] = membersSorted
      .filter((x) => x.agentId !== agentId)
      .map((x, idx) => ({
        agentId: x.agentId,
        order: idx,
        role: x.role,
        routerKeywords: x.routerKeywords,
      }));

    updateGroupMembersMutation.mutate({
      id: selectedGroupId,
      body: { members: remaining },
    });
  };

  const handleConfirmDeleteGroup = () => {
    if (!selectedGroupId) return;
    const ok = window.confirm("그룹을 삭제할까요?");
    if (!ok) return;
    const id = selectedGroupId;
    setSelectedGroupId(null);
    deleteGroupMutation.mutate(id);
  };

  return (
    <>
      <div className="lg:col-span-2">
        <div className={adminTw.card}>
          <AdminCardSectionHeader
            title="선택된 그룹"
            titleEndContent={
              group?.strategy ? (
                <span className={adminTw.providerBadge}>{group.strategy}</span>
              ) : null
            }
            description={
              !selectedGroupId
                ? "그룹을 선택하세요."
                : isGroupDetailLoading
                  ? "그룹 정보를 불러오는 중…"
                  : group
                    ? `${group.name} (${membersSorted.length} members)`
                    : "그룹을 선택하세요."
            }
            actions={
              <>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => setMemberDialogOpen(true)}
                  disabled={!selectedGroupId || isGroupDetailLoading}
                >
                  <Plus className="size-4" />
                  멤버 추가
                </Button>

                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDeleteGroup}
                  disabled={!selectedGroupId || deleteGroupMutation.isPending}
                >
                  <Trash2 className="size-4" />
                  삭제
                </Button>
              </>
            }
          />

          <div className="p-4">
            <AdminAgentGroupMembersTable
              membersSorted={membersSorted}
              isLoading={isGroupDetailLoading}
              isError={isGroupDetailError}
              error={groupDetailError}
              isGroupSelected={!!group}
              isRemoving={updateGroupMembersMutation.isPending}
              onRemoveMember={handleRemoveMember}
            />
          </div>
        </div>
      </div>

      {memberDialogOpen ? (
        <AdminAgentGroupAddMemberDialog
          selectedGroupId={selectedGroupId}
          isGroupDetailLoading={isGroupDetailLoading}
          membersSorted={membersSorted}
          onClose={resetMemberDialog}
          onOpenAgentCreate={() => setAgentCreateOpen(true)}
        />
      ) : null}

      {agentCreateOpen ? (
        <AdminAgentCreateForm
          open
          onOpenChange={setAgentCreateOpen}
          defaultGroupId={selectedGroupId}
          onSuccess={() => {
            void queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
          }}
        />
      ) : null}
    </>
  );
}
