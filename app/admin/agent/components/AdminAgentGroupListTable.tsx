"use client";

import type { AgentGroup } from "@/lib/types/agent-group";
import { Bot } from "lucide-react";
import AdminDataTable, { type AdminTableColumn } from "../../components/AdminDataTable";
import AdminInlineLoading from "../../components/AdminInlineLoading";
import { adminTw } from "../../components/styles";

interface AdminAgentGroupListTableProps {
  groups: AgentGroup[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  selectedGroupId: string | null;
  onSelectGroupId: (id: string) => void;
}

export default function AdminAgentGroupListTable({
  groups,
  isLoading,
  isError,
  error,
  selectedGroupId,
  onSelectGroupId,
}: AdminAgentGroupListTableProps) {
  if (isLoading) {
    return <AdminInlineLoading label="그룹 목록을 불러오는 중…" />;
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message?: unknown }).message === "string"
          ? ((error as { message?: string }).message ?? "알 수 없는 오류")
          : "알 수 없는 오류";

    return (
      <div className="px-4 py-6 text-sm text-red-400">그룹 목록 조회에 실패했습니다: {message}</div>
    );
  }

  const columns: AdminTableColumn[] = [
    { key: "name", header: "이름", width: "45%" },
    { key: "strategy", header: "전략", width: "35%" },
    { key: "memberCount", header: "멤버", width: "20%", align: "right" },
  ];

  return (
    <AdminDataTable
      columns={columns}
      rows={groups}
      getRowKey={(group) => group.id}
      onRowClick={(group) => onSelectGroupId(group.id)}
      rowClassName={(group) => (selectedGroupId === group.id ? "bg-muted/30" : undefined)}
      emptyContent={
        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted flex size-10 items-center justify-center rounded-full">
            <Bot className="text-muted-foreground size-5" />
          </div>
          <p>그룹이 없습니다.</p>
        </div>
      }
      renderRowCells={(group) => {
        const memberCount = group.members?.length ?? 0;

        return (
          <>
            <td className={adminTw.tableCellStrong}>
              <div className="flex flex-col">
                <span className="font-medium">{group.name}</span>
                <span className="text-muted-foreground text-[11px]">{group.id}</span>
              </div>
            </td>
            <td className={adminTw.tableCell}>
              <span className={adminTw.providerBadge}>{group.strategy}</span>
            </td>
            <td className={`${adminTw.tableCell} text-right`}>
              <span className="text-muted-foreground text-xs">{memberCount}</span>
            </td>
          </>
        );
      }}
    />
  );
}
