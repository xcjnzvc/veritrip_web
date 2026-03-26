"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAgentGroupMutation, useUpdateAgentGroupMutation } from "@/lib/queries/agent-group";
import type { AgentGroup, AgentGroupCreateDto, AgentGroupStrategy } from "@/lib/types/agent-group";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminInput from "../../components/AdminInput";
import AdminTextarea from "../../components/AdminTextarea";

interface AdminAgentGroupCreateFormProps {
  onSuccess: () => void;
  editGroup?: AgentGroup | null;
}

const STRATEGIES: AgentGroupStrategy[] = ["SEQUENTIAL", "PARALLEL", "ROUTER"];
type AgentGroupFormValues = Omit<AgentGroupCreateDto, "members">;
const EMPTY_FORM_VALUES: AgentGroupFormValues = {
  name: "",
  description: "",
  strategy: "SEQUENTIAL",
  sharedContext: "",
  synthesizePrompt: "",
};

const toFormValues = (group?: AgentGroup | null): AgentGroupFormValues => {
  if (!group) return EMPTY_FORM_VALUES;

  return {
    name: group.name,
    description: group.description ?? "",
    strategy: group.strategy,
    sharedContext: group.sharedContext ?? "",
    synthesizePrompt: group.synthesizePrompt ?? "",
  };
};

export default function AdminAgentGroupCreateForm({
  onSuccess,
  editGroup,
}: AdminAgentGroupCreateFormProps) {
  const createMutation = useCreateAgentGroupMutation();
  const updateMutation = useUpdateAgentGroupMutation();
  const isEditMode = Boolean(editGroup?.id);

  const [form, setForm] = useState<AgentGroupFormValues>(toFormValues(editGroup));

  useEffect(() => {
    setForm(toFormValues(editGroup));
  }, [editGroup]);

  const handleChange =
    (field: keyof AgentGroupFormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev: AgentGroupFormValues) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditMode && editGroup?.id) {
      updateMutation.mutate(
        {
          id: editGroup.id,
          body: form,
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        },
      );
      return;
    }

    createMutation.mutate(
      {
        ...form,
        members: [],
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  const isSubmitting = isEditMode ? updateMutation.isPending : createMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput
        label="그룹 이름"
        placeholder="에이전트 그룹 이름"
        value={form.name}
        onChange={handleChange("name")}
        required
      />

      <AdminTextarea
        label="그룹 설명"
        placeholder="선택: 그룹에 대한 설명"
        value={form.description ?? ""}
        onChange={handleChange("description")}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">전략</span>
        <Select
          value={form.strategy}
          onValueChange={(value) =>
            setForm((prev: AgentGroupCreateDto) => ({
              ...prev,
              strategy: value as AgentGroupStrategy,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="전략을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {STRATEGIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AdminTextarea
        label="공통 컨텍스트"
        placeholder="선택: 모든 멤버가 공유할 배경 정보"
        value={form.sharedContext ?? ""}
        onChange={handleChange("sharedContext")}
      />

      <AdminTextarea
        label="합성 프롬프트"
        placeholder="선택: 멤버 결과를 하나로 합성할 지시문"
        value={form.synthesizePrompt ?? ""}
        onChange={handleChange("synthesizePrompt")}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? "수정 중..." : "생성 중...") : isEditMode ? "그룹 수정" : "그룹 생성"}
        </Button>
      </div>
    </form>
  );
}
