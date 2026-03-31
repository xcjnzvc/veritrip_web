"use client";

import { Button } from "@/components/ui/button";
import type { AgentGroupDetailResponse, AgentGroupListResponse } from "@/lib/api/agent-group";
import { agentGroupKeys } from "@/lib/queryKeys/agent-group";
import { useAgentListQuery } from "@/lib/queries/agent";
import { useUpdateAgentGroupMutation } from "@/lib/queries/agent-group";
import type { Agent } from "@/lib/types/agent";
import type { AgentGroupMember, AgentGroupMemberDto } from "@/lib/types/agent-group";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminDataTable from "../../components/AdminDataTable";
import AdminInlineLoading from "../../components/AdminInlineLoading";
import AdminModalDialog from "../../components/AdminModalDialog";
import { adminTw } from "../../components/styles";

type AdminAgentGroupAddMemberDialogProps = {
  selectedGroupId: string | null;
  isGroupDetailLoading: boolean;
  membersSorted: AgentGroupMember[];
  onClose: () => void;
  onOpenAgentCreate: () => void;
};

export default function AdminAgentGroupAddMemberDialog({
  selectedGroupId,
  isGroupDetailLoading,
  membersSorted,
  onClose,
  onOpenAgentCreate,
}: AdminAgentGroupAddMemberDialogProps) {
  const queryClient = useQueryClient();
  const [agentSearchQuery, setAgentSearchQuery] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());

  const agentSelect = useAgentListQuery(
    { page: 1, take: 100, excludeGroupId: selectedGroupId ?? undefined },
    { enabled: !!selectedGroupId },
  );
  const agents = useMemo(() => (agentSelect.data?.data ?? []) as Agent[], [agentSelect.data?.data]);

  const filteredAgents = useMemo(() => {
    const keyword = agentSearchQuery.trim().toLowerCase();
    if (!keyword) return agents;
    return agents.filter(
      (a: Agent) =>
        a.name.toLowerCase().includes(keyword) ||
        (a.description || "").toLowerCase().includes(keyword) ||
        a.modelId.toLowerCase().includes(keyword) ||
        a.provider.toLowerCase().includes(keyword),
    );
  }, [agentSearchQuery, agents]);

  const updateGroupMembersMutation = useUpdateAgentGroupMutation();

  const handleSubmitAddMembers = () => {
    if (!selectedGroupId) return;

    const existingSorted = membersSorted;
    const existingAgentIds = new Set(existingSorted.map((m) => m.agentId));

    const selectedInList = filteredAgents
      .map((a: Agent) => a.id)
      .filter((id: string) => selectedAgentIds.has(id) && !existingAgentIds.has(id));
    if (selectedInList.length === 0) {
      onClose();
      return;
    }

    const combinedBase: Array<{
      agentId: string;
      role: string | null;
      routerKeywords: string | null;
    }> = [
      ...existingSorted.map((m) => ({
        agentId: m.agentId,
        role: m.role,
        routerKeywords: m.routerKeywords,
      })),
      ...selectedInList.map((agentId) => ({
        agentId,
        role: null,
        routerKeywords: null,
      })),
    ];

    const combined: AgentGroupMemberDto[] = combinedBase.map((m, idx) => ({
      agentId: m.agentId,
      role: m.role,
      routerKeywords: m.routerKeywords,
      order: idx,
    }));

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
              members: [
                ...g.members,
                ...selectedInList.map((agentId, idx) => ({
                  id: `optimistic-${selectedGroupId}-${agentId}`,
                  groupId: selectedGroupId,
                  agentId,
                  order: g.members!.length + idx,
                  role: null,
                  routerKeywords: null,
                  agent: {
                    id: agentId,
                    name: "추가 중...",
                  },
                })),
              ],
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
            members: [
              ...(old.data.members ?? []),
              ...selectedInList.map((agentId, idx) => ({
                id: `optimistic-${selectedGroupId}-${agentId}`,
                groupId: selectedGroupId,
                agentId,
                order: (old.data.members ?? []).length + idx,
                role: null,
                routerKeywords: null,
                agent: {
                  id: agentId,
                  name: "추가 중...",
                },
              })),
            ],
          },
        };
      },
    );

    updateGroupMembersMutation.mutate(
      { id: selectedGroupId, body: { members: combined } },
      {
        onError: () => {
          for (const [queryKey, data] of previousGroupLists) {
            queryClient.setQueryData(queryKey, data);
          }
          if (previousGroupDetail) {
            queryClient.setQueryData(agentGroupKeys.detail(selectedGroupId), previousGroupDetail);
          }
        },
        onSuccess: () => {
          onClose();
        },
        onSettled: () => {
          void queryClient.invalidateQueries({ queryKey: agentGroupKeys.lists() });
          void queryClient.invalidateQueries({ queryKey: agentGroupKeys.detail(selectedGroupId) });
        },
      },
    );
  };

  return (
    <AdminModalDialog title="멤버 추가" onClose={onClose}>
      <div className="space-y-4">
        <div className={adminTw.searchWrap}>
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="text"
            value={agentSearchQuery}
            onChange={(e) => setAgentSearchQuery(e.target.value)}
            placeholder="내 에이전트 검색"
            className={adminTw.searchInput}
          />
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onOpenAgentCreate}
            disabled={!selectedGroupId || isGroupDetailLoading}
          >
            <Plus className="size-4" />
            에이전트 생성
          </Button>
        </div>

        <div className="border-border max-h-[420px] overflow-auto rounded-lg border">
          {agentSelect.isLoading ? (
            <AdminInlineLoading label="에이전트 목록을 불러오는 중…" className="min-h-[280px]" />
          ) : (
            <AdminDataTable
              columns={[
                { key: "select", header: "선택", width: 90 },
                { key: "agent", header: "에이전트", width: "50%" },
                { key: "model", header: "모델", width: "50%" },
              ]}
              rows={filteredAgents}
              getRowKey={(a) => a.id}
              emptyContent="에이전트가 없습니다."
              renderRowCells={(a) => {
                const alreadyInGroup = membersSorted.some((m) => m.agentId === a.id);
                const checked = selectedAgentIds.has(a.id);

                return (
                  <>
                    <td className={adminTw.tableCell} style={{ width: 90 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={alreadyInGroup}
                        onChange={(e) => {
                          setSelectedAgentIds((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(a.id);
                            else next.delete(a.id);
                            return next;
                          });
                        }}
                      />
                    </td>
                    <td className={adminTw.tableCellStrong}>
                      <div className="flex flex-col">
                        <span className="font-medium">{a.name}</span>
                        <span className="text-muted-foreground text-[11px]">
                          {a.description || "-"}
                        </span>
                      </div>
                    </td>
                    <td className={adminTw.tableCell}>
                      <div className="flex items-center gap-2">
                        <span className={adminTw.providerBadge}>{a.provider}</span>
                        <span className="text-muted-foreground text-xs">{a.modelId}</span>
                      </div>
                    </td>
                  </>
                );
              }}
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>

          <Button
            type="button"
            disabled={
              updateGroupMembersMutation.isPending ||
              selectedAgentIds.size === 0 ||
              !selectedGroupId
            }
            onClick={handleSubmitAddMembers}
          >
            추가
          </Button>
        </div>
      </div>
    </AdminModalDialog>
  );
}
