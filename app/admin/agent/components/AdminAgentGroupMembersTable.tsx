"use client";

import type { AgentGroupMember } from "@/lib/types/agent-group";
import { Trash2 } from "lucide-react";
import { adminTw } from "../../components/styles";

interface AdminAgentGroupMembersTableProps {
  membersSorted: AgentGroupMember[];
  isRemoving: boolean;
  onRemoveMember: (agentId: string) => void;
}

export default function AdminAgentGroupMembersTable({
  membersSorted,
  isRemoving,
  onRemoveMember,
}: AdminAgentGroupMembersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className={adminTw.tableHeadCell}>순서</th>
            <th className={adminTw.tableHeadCell}>에이전트</th>
            <th className={adminTw.tableHeadCell}>역할</th>
            <th className={adminTw.tableHeadCell}>라우팅 키워드</th>
            <th className={`${adminTw.tableHeadCell} text-right`}>액션</th>
          </tr>
        </thead>
        <tbody>
          {membersSorted.map((m) => (
            <tr key={m.id} className={adminTw.tableRow}>
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
                <button
                  type="button"
                  className={adminTw.dangerButton}
                  onClick={() => {
                    const ok = window.confirm("멤버를 제거할까요?");
                    if (!ok) return;
                    onRemoveMember(m.agentId);
                  }}
                  disabled={isRemoving}
                >
                  <Trash2 className="size-3.5" />
                  제거
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
