"use client";

import { Button } from "@/components/ui/button";
import { useAgentListQuery } from "@/lib/queries/agent";
import { useUpdateAgentGroupMutation } from "@/lib/queries/agent-group";
import type { Agent } from "@/lib/types/agent";
import type { AgentGroupMember, AgentGroupMemberDto } from "@/lib/types/agent-group";
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
  const [agentSearchQuery, setAgentSearchQuery] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());

  const agentSelect = useAgentListQuery({ page: 1, take: 100 }, { enabled: true });
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

    updateGroupMembersMutation.mutate(
      { id: selectedGroupId, body: { members: combined } },
      {
        onSuccess: () => {
          onClose();
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
