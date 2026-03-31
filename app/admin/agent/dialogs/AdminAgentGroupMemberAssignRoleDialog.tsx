"use client";

import { Button } from "@/components/ui/button";
import type { AgentGroupMemberUpdateDto } from "@/lib/api/agent-group-member";
import type { AgentGroupMember } from "@/lib/types/agent-group";
import { useMemo, useState, type FormEvent } from "react";
import AdminInput from "../../components/AdminInput";
import AdminModalDialog from "../../components/AdminModalDialog";
import AdminTextarea from "../../components/AdminTextarea";

type AdminAgentGroupMemberAssignRoleDialogProps = {
  member: AgentGroupMember;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: AgentGroupMemberUpdateDto) => void;
};

export default function AdminAgentGroupMemberAssignRoleDialog({
  member,
  isSubmitting,
  onClose,
  onSubmit,
}: AdminAgentGroupMemberAssignRoleDialogProps) {
  const [order, setOrder] = useState<string>(String(member.order));
  const [role, setRole] = useState(member.role ?? "");
  const [routerKeywords, setRouterKeywords] = useState(member.routerKeywords ?? "");

  const orderError = useMemo(() => {
    const trimmed = order.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed < 0) {
      return "순서는 0 이상의 정수로 입력하세요.";
    }
    return undefined;
  }, [order]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderError) return;

    const trimmedOrder = order.trim();
    const trimmedRole = role.trim();
    const trimmedRouterKeywords = routerKeywords.trim();

    const payload: AgentGroupMemberUpdateDto = {
      groupId: member.groupId,
      agentId: member.agentId,
      order: trimmedOrder === "" ? undefined : Number(trimmedOrder),
      role: trimmedRole === "" ? "" : trimmedRole,
      routerKeywords: trimmedRouterKeywords === "" ? "" : trimmedRouterKeywords,
    };

    onSubmit(payload);
  };

  return (
    <AdminModalDialog
      title="역할 부여"
      subtitle={`${member.agent?.name ?? member.agentId} 멤버 정보를 수정합니다.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="순서"
          type="number"
          min={0}
          step={1}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          error={orderError}
          placeholder="예: 0"
        />
        <AdminInput
          label="역할"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="예: planner"
        />
        <AdminTextarea
          label="라우팅 키워드"
          value={routerKeywords}
          onChange={(e) => setRouterKeywords(e.target.value)}
          placeholder="예: 여행, 일정, 추천"
          rows={4}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting || Boolean(orderError)}>
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </AdminModalDialog>
  );
}
