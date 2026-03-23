"use client";

import { Button } from "@/components/ui/button";
import type { AgentGroupMember } from "@/lib/types/agent-group";
import { Bot, Trash2 } from "lucide-react";
import AdminDataTable, { type AdminTableColumn } from "../../components/AdminDataTable";
import AdminInlineLoading from "../../components/AdminInlineLoading";
import { adminTw } from "../../components/styles";

interface AdminAgentGroupMembersTableProps {
  membersSorted: AgentGroupMember[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isGroupSelected: boolean;
  isRemoving: boolean;
  onRemoveMember: (groupId: string, agentId: string) => void;
  onMemberRowClick?: (agentId: string) => void;
}

export default function AdminAgentGroupMembersTable({
  membersSorted,
  isLoading,
  isError,
  error,
  isGroupSelected,
  isRemoving,
  onRemoveMember,
  onMemberRowClick,
}: AdminAgentGroupMembersTableProps) {
  if (isLoading) {
    return <AdminInlineLoading label="그룹·멤버 정보를 불러오는 중…" />;
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

    return <div className="text-sm text-red-400">그룹 조회에 실패했습니다: {message}</div>;
  }

  if (!isGroupSelected) {
    return (
      <div className="text-muted-foreground py-10 text-center text-sm">
        그룹을 선택하면 멤버를 볼 수 있어요.
      </div>
    );
  }

  if (membersSorted.length === 0) {
    return (
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
    );
  }

  const columns: AdminTableColumn[] = [
    { key: "order", header: "순서", width: "10%" },
    { key: "agent", header: "에이전트", width: "30%" },
    { key: "role", header: "역할", width: "15%" },
    { key: "routingKeywords", header: "라우팅 키워드", width: "25%" },
    { key: "action", header: "액션", width: "20%", align: "right" },
  ];

  return (
    <AdminDataTable
      columns={columns}
      rows={membersSorted}
      getRowKey={(m) => m.id}
      onRowClick={onMemberRowClick ? (m) => onMemberRowClick(m.agentId) : undefined}
      renderRowCells={(m) => (
        <>
          <td className={adminTw.tableCellMono}>{m.order}</td>
          <td className={adminTw.tableCellStrong}>
            <div className="flex flex-col">
              <span className="font-medium">{m.agent?.name ?? m.agentId}</span>
              <span className="text-muted-foreground text-[11px]">{m.agentId}</span>
            </div>
          </td>
          <td className={adminTw.tableCell}>
            {m.role ? (
              <span className={adminTw.providerBadge}>{m.role}</span>
            ) : (
              <span className="text-muted-foreground text-xs">-</span>
            )}
          </td>
          <td className={adminTw.tableCell}>
            <span className="text-muted-foreground text-xs">{m.routerKeywords || "-"}</span>
          </td>
          <td className={adminTw.tableCell} style={{ textAlign: "right" }}>
            <Button
              size="sm"
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                const ok = window.confirm("멤버를 제거할까요?");
                if (!ok) return;
                onRemoveMember(m.groupId, m.agentId);
              }}
              disabled={isRemoving}
            >
              <Trash2 className="size-4" />
              제거
            </Button>
          </td>
        </>
      )}
    />
  );
}
