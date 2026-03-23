"use client";

import { Button } from "@/components/ui/button";
import type { AgentGroupDetailResponse, AgentGroupListResponse } from "@/lib/api/agent-group";
import { agentKeys } from "@/lib/queryKeys/agent";
import { agentGroupKeys } from "@/lib/queryKeys/agent-group";
import {
  useAgentGroupDetailQuery,
  useDeleteAgentGroupMemberMutation,
  useDeleteAgentGroupMutation,
} from "@/lib/queries/agent-group";
import type { AgentGroupMember } from "@/lib/types/agent-group";
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
  const [editAgentId, setEditAgentId] = useState<string | null>(null);

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

  const deleteGroupMemberMutation = useDeleteAgentGroupMemberMutation();
  const deleteGroupMutation = useDeleteAgentGroupMutation();

  const resetMemberDialog = () => {
    setMemberDialogOpen(false);
  };

  const handleRemoveMember = (groupId: string, agentId: string) => {
    if (!selectedGroupId || selectedGroupId !== groupId) return;

    const previousGroupLists = queryClient.getQueriesData<AgentGroupListResponse>({
      queryKey: agentGroupKeys.lists(),
    });
    const previousGroupDetail = queryClient.getQueryData<AgentGroupDetailResponse>(
      agentGroupKeys.detail(selectedGroupId),
    );

    queryClient.setQueriesData<AgentGroupListResponse>(
      { queryKey: agentGroupKeys.lists() },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((g) => {
            if (g.id !== selectedGroupId) return g;
            if (!Array.isArray(g.members)) return g;
            return {
              ...g,
              members: g.members.slice(0, Math.max(0, g.members.length - 1)),
            };
          }),
        };
      },
    );

    queryClient.setQueryData<AgentGroupDetailResponse>(
      agentGroupKeys.detail(selectedGroupId),
      (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            members: (old.data.members ?? []).filter((m) => m.agentId !== agentId),
          },
        };
      },
    );

    deleteGroupMemberMutation.mutate(
      {
        id: groupId,
        agentId,
      },
      {
        onError: () => {
          for (const [queryKey, data] of previousGroupLists) {
            queryClient.setQueryData(queryKey, data);
          }
          if (previousGroupDetail) {
            queryClient.setQueryData(agentGroupKeys.detail(selectedGroupId), previousGroupDetail);
          }
        },
        onSettled: () => {
          void queryClient.invalidateQueries({ queryKey: agentGroupKeys.lists() });
          void queryClient.invalidateQueries({ queryKey: agentGroupKeys.detail(selectedGroupId) });
        },
      },
    );
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
                  그룹 삭제
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
              isRemoving={deleteGroupMemberMutation.isPending}
              onRemoveMember={handleRemoveMember}
              onMemberRowClick={(agentId) => {
                setAgentCreateOpen(false);
                setEditAgentId(agentId);
              }}
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
          onOpenAgentCreate={() => {
            setEditAgentId(null);
            setAgentCreateOpen(true);
          }}
        />
      ) : null}

      {agentCreateOpen || editAgentId != null ? (
        <AdminAgentCreateForm
          key={editAgentId ?? "create"}
          open
          editAgentId={editAgentId}
          onOpenChange={(next) => {
            if (!next) {
              setAgentCreateOpen(false);
              setEditAgentId(null);
            }
          }}
          defaultGroupId={selectedGroupId}
          onSuccess={() => {
            void queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
            if (selectedGroupId) {
              void queryClient.invalidateQueries({
                queryKey: agentGroupKeys.detail(selectedGroupId),
              });
            }
          }}
        />
      ) : null}
    </>
  );
}
