"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAgentListQuery } from "@/lib/queries/agent";
import {
  useAgentGroupDetailQuery,
  useAgentGroupListQuery,
  useDeleteAgentGroupMutation,
  useUpdateAgentGroupMutation,
} from "@/lib/queries/agent-group";
import type { Agent } from "@/lib/types/agent";
import type { AgentGroupMember, AgentGroupMemberDto } from "@/lib/types/agent-group";
import type { AgentGroupListResponse } from "@/lib/api/agent-group";
import { Plus, Search, Trash2, X } from "lucide-react";
import AdminPagination from "../components/AdminPagination";
import { adminTw } from "../components/styles";
import AdminDataTable from "../components/AdminDataTable";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminAgentGroupCreateForm from "./components/AdminAgentGroupCreateForm";
import AdminAgentGroupListTable from "./components/AdminAgentGroupListTable";
import AdminAgentGroupMembersTable from "./components/AdminAgentGroupMembersTable";

type AgentPageClientProps = {
  initialGroupList?: AgentGroupListResponse;
  initialGroupPage?: number;
};

export default function AgentPageClient({
  initialGroupList,
  initialGroupPage = 1,
}: AgentPageClientProps) {
  const take = 10;

  const [groupPage, setGroupPage] = useState(initialGroupPage);

  const [isGroupCreateOpen, setIsGroupCreateOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());

  const {
    data: groupListData,
    isLoading: isGroupListLoading,
    isError: isGroupListError,
    error: groupListError,
  } = useAgentGroupListQuery(
    { page: groupPage, take },
    {
      initialData: groupPage === initialGroupPage ? initialGroupList : undefined,
    },
  );

  const groups = groupListData?.data ?? [];
  const meta = groupListData?.meta;

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

  const agentSelect = useAgentListQuery({ page: 1, take: 100 });
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
  const deleteGroupMutation = useDeleteAgentGroupMutation();

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

  return (
    <div className={adminTw.page}>
      <AdminPageHeader
        title="에이전트 그룹"
        subtitle="에이전트 생성 전에 그룹을 먼저 만들고, 멤버 에이전트를 구성하세요."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* left: groups */}
        <div className="lg:col-span-1">
          <div className={adminTw.card}>
            <div className="border-border border-b px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">그룹 목록</span>
                  <span className="text-muted-foreground text-xs">
                    총 {meta?.totalCount ?? 0}개
                  </span>
                </div>
                <Button size="sm" onClick={() => setIsGroupCreateOpen(true)} className="gap-2">
                  <Plus className="size-4" />
                  그룹 생성
                </Button>
              </div>
            </div>

            <AdminAgentGroupListTable
              groups={groups}
              isLoading={isGroupListLoading}
              isError={isGroupListError}
              error={groupListError}
              selectedGroupId={selectedGroupId}
              onSelectGroupId={setSelectedGroupId}
            />

            {meta && (
              <AdminPagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPrev={() => setGroupPage((p) => Math.max(1, p - 1))}
                onNext={() => setGroupPage((p) => p + 1)}
              />
            )}
          </div>
        </div>

        {/* right: detail */}
        <div className="lg:col-span-2">
          <div className={adminTw.card}>
            <div className="border-border border-b px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">선택된 그룹</span>
                    {group?.strategy && (
                      <span className={adminTw.providerBadge}>{group.strategy}</span>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {group ? `${group.name} (${membersSorted.length} members)` : "그룹을 선택하세요."}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setMemberDialogOpen(true)}
                    disabled={!selectedGroupId || isGroupDetailLoading}
                  >
                    <Plus className="size-4" />
                    멤버 추가
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (!selectedGroupId) return;
                      const ok = window.confirm("그룹을 삭제할까요?");
                      if (!ok) return;
                      setSelectedGroupId(null);
                      deleteGroupMutation.mutate(selectedGroupId, {
                        onSuccess: () => {
                          // noop
                        },
                      });
                    }}
                    disabled={!selectedGroupId || deleteGroupMutation.isPending}
                  >
                    <Trash2 className="size-4" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>

            {/** 멤버 테이블 */}
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
      </div>

      {/* Group create modal */}
      {isGroupCreateOpen && (
        <div className={adminTw.modalBackdrop}>
          <div className={adminTw.modalCard}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">에이전트 그룹 생성</h2>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground rounded p-1"
                onClick={() => setIsGroupCreateOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <AdminAgentGroupCreateForm
              onSuccess={() => {
                setIsGroupCreateOpen(false);
                setSelectedGroupId(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Members add dialog */}
      {memberDialogOpen && (
        <div className={adminTw.modalBackdrop}>
          <div className={adminTw.modalCard}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">멤버 추가</h2>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground rounded p-1"
                onClick={() => {
                  setMemberDialogOpen(false);
                  setSelectedAgentIds(new Set());
                  setAgentSearchQuery("");
                }}
              >
                <X className="size-4" />
              </button>
            </div>

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

              <div className="border-border max-h-[420px] overflow-auto rounded-lg border">
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
                              const next = new Set(selectedAgentIds);
                              if (e.target.checked) next.add(a.id);
                              else next.delete(a.id);
                              setSelectedAgentIds(next);
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
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMemberDialogOpen(false);
                    setSelectedAgentIds(new Set());
                    setAgentSearchQuery("");
                  }}
                >
                  취소
                </Button>

                <Button
                  type="button"
                  disabled={
                    updateGroupMembersMutation.isPending ||
                    selectedAgentIds.size === 0 ||
                    !selectedGroupId
                  }
                  onClick={() => {
                    if (!selectedGroupId) return;

                    const existingSorted = membersSorted;
                    const existingAgentIds = new Set(existingSorted.map((m) => m.agentId));

                    const selectedInList = filteredAgents
                      .map((a: Agent) => a.id)
                      .filter(
                        (id: string) => selectedAgentIds.has(id) && !existingAgentIds.has(id),
                      );

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
                          setMemberDialogOpen(false);
                          setSelectedAgentIds(new Set());
                          setAgentSearchQuery("");
                        },
                      },
                    );
                  }}
                >
                  추가
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

