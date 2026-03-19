"use client";

import { AdminTitle } from "../components/title";
import { useAgentListQuery, useDeleteAgentMutation } from "@/lib/queries/agent";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AgentCreateForm from "./components/AgentCreateForm";
import { useNavigation } from "@refinedev/core";
import { Bot, ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import { adminTw } from "../components/styles";

export default function AgentPage() {
  const [page, setPage] = useState(1);
  const take = 10;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { list } = useNavigation();

  const { data, isLoading, isError } = useAgentListQuery({
    page,
    take,
  });

  const deleteMutation = useDeleteAgentMutation();

  const agents = data?.data ?? [];
  const filteredAgents = agents.filter((agent) => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) {
      return true;
    }

    return (
      agent.name.toLowerCase().includes(keyword) ||
      (agent.description || "").toLowerCase().includes(keyword) ||
      agent.modelId.toLowerCase().includes(keyword) ||
      agent.provider.toLowerCase().includes(keyword)
    );
  });
  const meta = data?.meta;

  return (
    <div className={adminTw.page}>
      <div className={adminTw.headerBlock}>
        <AdminTitle>에이전트 목록</AdminTitle>
        <p className={adminTw.subtitle}>생성한 AI 에이전트를 조회하고 관리합니다.</p>
      </div>

      <div className={adminTw.toolbar}>
        <div className={adminTw.searchWrap}>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름, 설명, 모델 검색"
            className={adminTw.searchInput}
          />
        </div>

        <Button size="sm" onClick={() => setOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          에이전트 추가
        </Button>
      </div>

      {open && (
        <div className={adminTw.modalBackdrop}>
          <div className={adminTw.modalCard}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">에이전트 생성</h2>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground rounded p-1"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <AgentCreateForm
              onSuccess={() => {
                setOpen(false);
                list("agents");
              }}
            />
          </div>
        </div>
      )}

      {isLoading && <div>로딩 중...</div>}
      {isError && <div className="text-red-400">에이전트 목록 조회에 실패했습니다.</div>}

      {!isLoading && !isError && (
        <>
          <div className={`overflow-x-auto ${adminTw.card}`}>
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className={adminTw.tableHeadCell}>ID</th>
                  <th className={adminTw.tableHeadCell}>이름</th>
                  <th className={adminTw.tableHeadCell}>설명</th>
                  <th className={adminTw.tableHeadCell}>모델</th>
                  <th className={adminTw.tableHeadCell}>생성일</th>
                  <th className={`${adminTw.tableHeadCell} text-right`}>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td className={adminTw.emptyCell} colSpan={6}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                          <Bot className="size-5 text-muted-foreground" />
                        </div>
                        <p>{searchQuery ? "검색 결과가 없습니다." : "에이전트가 없습니다."}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => (
                    <tr key={agent.id} className={adminTw.tableRow}>
                      <td className={adminTw.tableCellMono}>{agent.id}</td>
                      <td className={adminTw.tableCellStrong}>{agent.name}</td>
                      <td className={`${adminTw.tableCell} max-w-[260px] truncate`}>
                        {agent.description || "-"}
                      </td>
                      <td className={adminTw.tableCell}>
                        <div className="flex items-center gap-2">
                          <span className={adminTw.providerBadge}>{agent.provider}</span>
                          <span className="text-xs">{agent.modelId}</span>
                        </div>
                      </td>
                      <td className={adminTw.tableCell}>
                        {new Date(agent.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <button
                          type="button"
                          className={adminTw.dangerButton}
                          onClick={() => deleteMutation.mutate(agent.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-3.5" />
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className={adminTw.paginationWrap}>
              <span>
                총 {meta.totalCount}개 / {meta.page} / {meta.totalPages} 페이지
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={adminTw.iconButton}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  className={adminTw.iconButton}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.totalPages !== 0 && page >= meta.totalPages}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
