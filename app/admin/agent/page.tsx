"use client";

import { Button } from "@/components/ui/button";
import { useAgentListQuery } from "@/lib/queries/agent";
import {
  useAgentGroupDetailQuery,
  useAgentGroupListQuery,
  useDeleteAgentGroupMutation,
  useUpdateAgentGroupMutation,
} from "@/lib/queries/agent-group";
import type { AgentGroupMember, AgentGroupMemberDto } from "@/lib/types/agent-group";
import type { Agent } from "@/lib/types/agent";
import { Bot, ChevronLeft, ChevronRight, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { adminTw } from "../components/styles";
import { AdminTitle } from "../components/title";
import AdminAgentGroupCreateForm from "./components/AdminAgentGroupCreateForm";
import AdminAgentGroupListTable from "./components/AdminAgentGroupListTable";
import AdminAgentGroupMembersTable from "./components/AdminAgentGroupMembersTable";

export default function AgentPage() {
  const [groupPage, setGroupPage] = useState(1);
  const take = 10;

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
  } = useAgentGroupListQuery({ page: groupPage, take });

  const groups = groupListData?.data ?? [];
  const meta = groupListData?.meta;
  const effectiveSelectedGroupId = selectedGroupId ?? groups[0]?.id ?? null;

  const {
    data: groupDetailData,
    isLoading: isGroupDetailLoading,
    isError: isGroupDetailError,
    error: groupDetailError,
  } = useAgentGroupDetailQuery(effectiveSelectedGroupId, true);

  const group = groupDetailData?.data;
  const members: AgentGroupMember[] = group?.members ?? [];
  const membersSorted = useMemo(() => [...members].sort((a, b) => a.order - b.order), [members]);

  const agentSelect = useAgentListQuery({ page: 1, take: 100 });
  const agents = (agentSelect.data?.data ?? []) as Agent[];

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
    if (!effectiveSelectedGroupId) return;

    const remaining: AgentGroupMemberDto[] = membersSorted
      .filter((x) => x.agentId !== agentId)
      .map((x, idx) => ({
        agentId: x.agentId,
        order: idx,
        role: x.role,
        routerKeywords: x.routerKeywords,
      }));

    updateGroupMembersMutation.mutate({
      id: effectiveSelectedGroupId,
      body: { members: remaining },
    });
  };

  return (
    <div className={adminTw.page}>
      <div className={adminTw.headerBlock}>
        <AdminTitle>에이전트 그룹</AdminTitle>
        <p className={adminTw.subtitle}>
          에이전트 생성 전에 그룹을 먼저 만들고, 멤버 에이전트를 구성하세요.
        </p>
      </div>

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

            {isGroupListLoading ? (
              <div className="text-muted-foreground px-4 py-6 text-sm">로딩 중...</div>
            ) : isGroupListError ? (
              <div className="px-4 py-6 text-sm text-red-400">
                그룹 목록 조회에 실패했습니다:{" "}
                {groupListError instanceof Error ? groupListError.message : "알 수 없는 오류"}
              </div>
            ) : (
              <AdminAgentGroupListTable
                groups={groups}
                selectedGroupId={effectiveSelectedGroupId}
                onSelectGroupId={setSelectedGroupId}
              />
            )}

            {meta && (
              <div className={adminTw.paginationWrap}>
                <span>
                  {meta.page} / {meta.totalPages} 페이지
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={adminTw.iconButton}
                    onClick={() => setGroupPage((p) => Math.max(1, p - 1))}
                    disabled={groupPage <= 1}
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={adminTw.iconButton}
                    onClick={() => setGroupPage((p) => p + 1)}
                    disabled={meta.totalPages !== 0 && groupPage >= meta.totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
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
                    {group
                      ? `${group.name} (${membersSorted.length} members)`
                      : "그룹을 선택하세요."}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setMemberDialogOpen(true)}
                    disabled={!effectiveSelectedGroupId || isGroupDetailLoading}
                  >
                    <Plus className="size-4" />
                    멤버 추가
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (!effectiveSelectedGroupId) return;
                      const ok = window.confirm("그룹을 삭제할까요?");
                      if (!ok) return;
                      setSelectedGroupId(null);
                      deleteGroupMutation.mutate(effectiveSelectedGroupId, {
                        onSuccess: () => {
                          // noop
                        },
                      });
                    }}
                    disabled={!effectiveSelectedGroupId || deleteGroupMutation.isPending}
                  >
                    <Trash2 className="size-4" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {isGroupDetailLoading ? (
                <div className="text-muted-foreground text-sm">그룹 정보를 불러오는 중...</div>
              ) : isGroupDetailError ? (
                <div className="text-sm text-red-400">
                  그룹 조회에 실패했습니다:{" "}
                  {groupDetailError instanceof Error ? groupDetailError.message : "알 수 없는 오류"}
                </div>
              ) : !group ? (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  그룹을 선택하면 멤버를 볼 수 있어요.
                </div>
              ) : membersSorted.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                      <Bot className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      아직 멤버가 없습니다. “멤버 추가”로 agents를 연결하세요.
                    </p>
                  </div>
                </div>
              ) : (
                <AdminAgentGroupMembersTable
                  membersSorted={membersSorted}
                  isRemoving={updateGroupMembersMutation.isPending}
                  onRemoveMember={handleRemoveMember}
                />
              )}
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
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className={adminTw.tableHeadCell}>선택</th>
                      <th className={adminTw.tableHeadCell}>에이전트</th>
                      <th className={adminTw.tableHeadCell}>모델</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.length === 0 ? (
                      <tr>
                        <td colSpan={3} className={adminTw.emptyCell}>
                          에이전트가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredAgents.map((a) => {
                        const alreadyInGroup = membersSorted.some((m) => m.agentId === a.id);
                        const checked = selectedAgentIds.has(a.id);
                        return (
                          <tr key={a.id} className={adminTw.tableRow}>
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
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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
                    if (!effectiveSelectedGroupId) return;

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
                      { id: effectiveSelectedGroupId, body: { members: combined } },
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
