"use client";

import { Button } from "@/components/ui/button";
import type { AgentGroupMemberUpdateDto } from "@/lib/api/agent-group-member";
import type { AgentGroupMember } from "@/lib/types/agent-group";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Bot, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminInlineLoading from "../../components/AdminInlineLoading";

interface AdminAgentGroupMembersTableProps {
  membersSorted: AgentGroupMember[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isGroupSelected: boolean;
  isRemoving: boolean;
  onRemoveMember: (groupId: string, agentId: string) => void;
  onAssignRole: (member: AgentGroupMember) => void;
  onRunAgent: (member: AgentGroupMember) => void;
  onReorderMembers: (updates: AgentGroupMemberUpdateDto[]) => void;
  isReordering?: boolean;
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
  onAssignRole,
  onRunAgent,
  onReorderMembers,
  isReordering = false,
  onMemberRowClick,
}: AdminAgentGroupMembersTableProps) {
  const [boardMembers, setBoardMembers] = useState<AgentGroupMember[]>(membersSorted);

  useEffect(() => {
    setBoardMembers(membersSorted);
  }, [membersSorted]);

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

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;

    const next = [...boardMembers];
    const [moved] = next.splice(source.index, 1);
    if (!moved) return;
    next.splice(destination.index, 0, moved);
    const nextWithOrder = next.map((member, idx) => ({ ...member, order: idx }));
    setBoardMembers(nextWithOrder);

    onReorderMembers(
      nextWithOrder.map((member) => ({
        groupId: member.groupId,
        agentId: member.agentId,
        order: member.order,
      })),
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="members">
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className="min-h-12 space-y-2"
          >
            {boardMembers.map((m, index) => (
              <Draggable key={m.id} draggableId={m.id} index={index}>
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...(!isReordering ? draggableProvided.dragHandleProps : {})}
                    className="bg-card border-border rounded-md border p-3"
                    onClick={() => onMemberRowClick?.(m.agentId)}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.agent?.name ?? m.agentId}</p>
                        <p className="text-muted-foreground truncate text-[11px]">{m.agentId}</p>
                      </div>
                      <span className="text-muted-foreground text-xs">#{m.order}</span>
                    </div>
                    <p className="text-muted-foreground mb-1 text-xs">역할: {m.role || "-"}</p>
                    <p className="text-muted-foreground mb-1 text-xs">
                      키워드: {m.routerKeywords || "-"}
                    </p>
                    <p className="text-muted-foreground mb-3 text-xs">
                      모델: {m.agent?.modelId?.split("/").pop() || "-"}
                    </p>
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssignRole(m);
                        }}
                      >
                        역할 부여
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunAgent(m);
                        }}
                      >
                        실행
                      </Button>
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
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
