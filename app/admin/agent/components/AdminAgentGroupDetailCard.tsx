"use client";

import { Button } from "@/components/ui/button";
import type { AgentGroupMemberUpdateDto } from "@/lib/api/agent-group-member";
import { useAgentGroupDetailQuery, useDeleteAgentGroupMutation } from "@/lib/queries/agent-group";
import {
  useDeleteAgentGroupMemberMutation,
  useUpdateAgentGroupMemberMutation,
} from "@/lib/queries/agent-group-member";
import { agentKeys } from "@/lib/queryKeys/agent";
import { agentGroupKeys } from "@/lib/queryKeys/agent-group";
import type { AgentGroupMember } from "@/lib/types/agent-group";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AdminCardSectionHeader from "../../components/AdminCardSectionHeader";
import AdminModalDialog from "../../components/AdminModalDialog";
import { adminTw } from "../../components/styles";
import AdminAgentCreateForm from "./AdminAgentCreateDialog";
import AdminAgentGroupCreateDialog from "./AdminAgentGroupCreateDialog";
import AdminAgentGroupAddMemberDialog from "./AdminAgentGroupAddMemberDialog";
import AdminAgentGroupMemberAssignRoleDialog from "./AdminAgentGroupMemberAssignRoleDialog";
import AdminAgentGroupMembersBoard from "./AdminAgentGroupMembersBoard";
import AdminAgentRunDialog from "./AdminAgentRunDialog";
import { useAgentGroupPage } from "./AgentGroupPageContext";
import {
  applyOptimisticRemoveGroupMember,
  invalidateGroupMemberQueries,
  rollbackOptimisticRemoveGroupMember,
} from "./agentGroupMemberOptimistic";

type AdminAgentGroupDetailCardProps = {
  geminiModelIds: string[];
};

export default function AdminAgentGroupDetailCard({
  geminiModelIds,
}: AdminAgentGroupDetailCardProps) {
  const queryClient = useQueryClient();
  const { selectedGroupId, setSelectedGroupId } = useAgentGroupPage();

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [groupEditOpen, setGroupEditOpen] = useState(false);
  const [agentCreateOpen, setAgentCreateOpen] = useState(false);
  const [editAgentId, setEditAgentId] = useState<string | null>(null);
  const [isOutputPromptOpen, setIsOutputPromptOpen] = useState(false);
  const [assignRoleMember, setAssignRoleMember] = useState<AgentGroupMember | null>(null);
  const [runAgentMember, setRunAgentMember] = useState<AgentGroupMember | null>(null);

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
  const updateGroupMemberMutation = useUpdateAgentGroupMemberMutation();
  const deleteGroupMutation = useDeleteAgentGroupMutation();

  const resetMemberDialog = () => {
    setMemberDialogOpen(false);
  };

  const handleRemoveMember = (groupId: string, agentId: string) => {
    if (!selectedGroupId || selectedGroupId !== groupId) return;
    const snapshot = applyOptimisticRemoveGroupMember({
      queryClient,
      groupId: selectedGroupId,
      agentId,
    });

    deleteGroupMemberMutation.mutate(
      {
        id: groupId,
        agentId,
      },
      {
        onError: () => {
          rollbackOptimisticRemoveGroupMember({
            queryClient,
            groupId: selectedGroupId,
            snapshot,
          });
        },
        onSettled: () => {
          invalidateGroupMemberQueries({ queryClient, groupId: selectedGroupId });
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

  const handleSubmitAssignRole = (payload: AgentGroupMemberUpdateDto) => {
    updateGroupMemberMutation.mutate(payload, {
      onSuccess: () => {
        setAssignRoleMember(null);
      },
    });
  };

  const handleReorderMembers = (updates: AgentGroupMemberUpdateDto[]) => {
    if (updates.length === 0) return;

    Promise.all(updates.map((payload) => updateGroupMemberMutation.mutateAsync(payload))).catch(
      () => {
        // 낙관적 순서 적용 상태를 유지하며, 실패 시에도 리스트 재호출은 하지 않습니다.
      },
    );
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
                  variant="secondary"
                  onClick={() => setGroupEditOpen(true)}
                  disabled={!selectedGroupId || isGroupDetailLoading}
                >
                  <Pencil className="size-4" />
                  그룹 수정
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
            {group?.outputPrompt ? (
              <div className="bg-muted/30 mb-4 rounded-md border p-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setIsOutputPromptOpen((prev) => !prev)}
                  aria-expanded={isOutputPromptOpen}
                >
                  <p className="text-xs font-semibold">최종 응답 형식</p>
                  <ChevronDown
                    className={`size-4 transition-transform ${isOutputPromptOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOutputPromptOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                      {group.outputPrompt}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <AdminAgentGroupMembersBoard
              membersSorted={membersSorted}
              isLoading={isGroupDetailLoading}
              isError={isGroupDetailError}
              error={groupDetailError}
              isGroupSelected={!!group}
              isRemoving={deleteGroupMemberMutation.isPending}
              onRemoveMember={handleRemoveMember}
              onAssignRole={(member) => setAssignRoleMember(member)}
              onRunAgent={(member) => setRunAgentMember(member)}
              onReorderMembers={handleReorderMembers}
              isReordering={updateGroupMemberMutation.isPending}
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

      {groupEditOpen && group ? (
        <AdminModalDialog
          title="에이전트 그룹 수정"
          onClose={() => setGroupEditOpen(false)}
          subtitle="그룹 메타 정보를 수정합니다."
          contentScrollable
          contentMaxHeightClassName="max-h-[68vh]"
        >
          <AdminAgentGroupCreateDialog
            editGroup={group}
            onSuccess={() => {
              setGroupEditOpen(false);
            }}
          />
        </AdminModalDialog>
      ) : null}

      {agentCreateOpen || editAgentId != null ? (
        <AdminAgentCreateForm
          key={editAgentId ?? "create"}
          open
          geminiModelIds={geminiModelIds}
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

      {assignRoleMember ? (
        <AdminAgentGroupMemberAssignRoleDialog
          member={assignRoleMember}
          isSubmitting={updateGroupMemberMutation.isPending}
          onClose={() => setAssignRoleMember(null)}
          onSubmit={handleSubmitAssignRole}
        />
      ) : null}

      {runAgentMember ? (
        <AdminAgentRunDialog
          key={runAgentMember.agentId}
          agentId={runAgentMember.agentId}
          agentLabel={runAgentMember.agent?.name ?? runAgentMember.agentId}
          onClose={() => setRunAgentMember(null)}
        />
      ) : null}
    </>
  );
}
