"use client";

import { AdminTitle } from "../components/title";
import { useAgentListQuery, useDeleteAgentMutation } from "@/lib/queries/agent";
import { useState } from "react";

export default function AgentPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useAgentListQuery({
    page,
    pageSize: limit,
  });

  const deleteMutation = useDeleteAgentMutation();

  const agents = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <AdminTitle>에이전트 목록</AdminTitle>

      {isLoading && <div>로딩 중...</div>}
      {isError && <div className="text-red-400">에이전트 목록 조회에 실패했습니다.</div>}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-md border border-gray-800">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">이름</th>
                  <th className="px-4 py-2 text-left">설명</th>
                  <th className="px-4 py-2 text-left">모델</th>
                  <th className="px-4 py-2 text-left">생성일</th>
                  <th className="px-4 py-2 text-right">액션</th>
                </tr>
              </thead>
              <tbody>
                {agents.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-400" colSpan={6}>
                      에이전트가 없습니다.
                    </td>
                  </tr>
                ) : (
                  agents.map((agent) => (
                    <tr key={agent.id} className="border-t border-gray-800">
                      <td className="px-4 py-2 align-middle text-gray-300">{agent.id}</td>
                      <td className="px-4 py-2 align-middle text-gray-100">{agent.name}</td>
                      <td className="px-4 py-2 align-middle text-gray-400">
                        {agent.description || "-"}
                      </td>
                      <td className="px-4 py-2 align-middle text-gray-300">
                        {agent.provider} / {agent.modelId}
                      </td>
                      <td className="px-4 py-2 align-middle text-gray-400">
                        {new Date(agent.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-2 align-middle text-right">
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
                          onClick={() => deleteMutation.mutate(agent.id)}
                          disabled={deleteMutation.isPending}
                        >
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
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                총 {meta.totalCount}개 / {meta.page} / {meta.totalPages} 페이지
              </span>
              <div className="space-x-2">
                <button
                  type="button"
                  className="px-3 py-1 rounded border border-gray-700 hover:bg-gray-800 disabled:opacity-60"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  이전
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded border border-gray-700 hover:bg-gray-800 disabled:opacity-60"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.totalPages !== 0 && page >= meta.totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}