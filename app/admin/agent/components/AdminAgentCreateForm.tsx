"use client";

/**
 * 에이전트 생성 다이얼로그(모달).
 * 폼 필드 + AdminModalDialog를 함께 제공합니다.
 */

import { useState, ChangeEvent, FormEvent } from "react";
import AdminInput from "../../components/AdminInput";
import AdminModalDialog from "../../components/AdminModalDialog";
import AdminTextarea from "../../components/AdminTextarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AGENT_GROUP_LIST_SELECT_TAKE } from "@/lib/constants/agentGroupList";
import { useAgentGroupListQuery } from "@/lib/queries/agent-group";
import type { AgentCreateDto } from "@/lib/types/agent";
import { useCreate } from "@refinedev/core";

/** AgentCreateDto 문자열 입력 키 (provider·groupId 제외 — groupId는 Select) */
type AgentCreateTextKey = keyof Pick<
  AgentCreateDto,
  "name" | "description" | "rolePrompt" | "taskPrompt" | "outputPrompt" | "modelId"
>;

type TextFieldRow = {
  kind: "text";
  key: AgentCreateTextKey;
  variant: "input" | "textarea";
  label: string;
  placeholder: string;
  required?: boolean;
};

type ProviderRow = { kind: "provider" };
type GroupSelectRow = { kind: "groupSelect" };

type AgentCreateFormRow = TextFieldRow | ProviderRow | GroupSelectRow;

const GROUP_SELECT_NONE = "__none__";

/**
 * AgentCreateDto 필드 순서: 텍스트 → provider → modelId → 그룹 Select
 */
const AGENT_CREATE_FORM_ROWS: AgentCreateFormRow[] = [
  {
    kind: "text",
    key: "name",
    variant: "input",
    label: "에이전트 이름",
    placeholder: "에이전트 이름을 입력하세요",
    required: true,
  },
  {
    kind: "text",
    key: "description",
    variant: "textarea",
    label: "설명",
    placeholder: "에이전트에 대한 설명을 입력하세요",
    required: true,
  },
  {
    kind: "text",
    key: "rolePrompt",
    variant: "textarea",
    label: "Role Prompt",
    placeholder: "에이전트의 역할을 설명하는 시스템 프롬프트",
    required: true,
  },
  {
    kind: "text",
    key: "taskPrompt",
    variant: "textarea",
    label: "Task Prompt",
    placeholder: "에이전트가 수행해야 할 작업에 대한 프롬프트",
    required: true,
  },
  {
    kind: "text",
    key: "outputPrompt",
    variant: "textarea",
    label: "Output Prompt",
    placeholder: "에이전트 출력 형식을 정의하는 프롬프트",
    required: true,
  },
  { kind: "provider" },
  {
    kind: "text",
    key: "modelId",
    variant: "input",
    label: "Model ID",
    placeholder: "사용할 모델 ID를 입력하세요",
    required: true,
  },
  { kind: "groupSelect" },
];

function getInitialForm(): AgentCreateDto {
  return {
    name: "",
    description: "",
    rolePrompt: "",
    taskPrompt: "",
    outputPrompt: "",
    provider: "GEMINAI",
    modelId: "",
    groupId: undefined,
  };
}

interface AdminAgentCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  /** 열릴 때 그룹 ID를 미리 채움 (예: 선택된 에이전트 그룹) */
  defaultGroupId?: string | null;
}

export default function AdminAgentCreateForm({
  open,
  onOpenChange,
  onSuccess,
  defaultGroupId,
}: AdminAgentCreateFormProps) {
  const { mutate, mutation } = useCreate();

  const {
    data: groupListData,
    isLoading: isGroupListLoading,
    isError: isGroupListError,
  } = useAgentGroupListQuery({ page: 1, take: AGENT_GROUP_LIST_SELECT_TAKE }, { enabled: open });

  const groups = groupListData?.data ?? [];

  const [form, setForm] = useState<AgentCreateDto>(() => ({
    ...getInitialForm(),
    groupId: defaultGroupId?.trim() ? defaultGroupId.trim() : undefined,
  }));

  const handleChange =
    (field: AgentCreateTextKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev: AgentCreateDto) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values: AgentCreateDto = {
      ...form,
      groupId: form.groupId?.trim() || undefined,
    };

    mutate(
      {
        resource: "agents",
        values,
      },
      {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        },
      },
    );
  };

  const isSubmitting = mutation.isPending;

  const renderTextField = (field: TextFieldRow) => {
    const raw = form[field.key];
    const value = raw ?? "";
    const common = {
      label: field.label,
      placeholder: field.placeholder,
      value,
      onChange: handleChange(field.key),
      required: field.required ?? false,
    };

    if (field.variant === "input") {
      return <AdminInput key={field.key} {...common} />;
    }
    return <AdminTextarea key={field.key} {...common} />;
  };

  const renderGroupSelect = (index: number) => {
    const selectValue = form.groupId?.trim() ? form.groupId : GROUP_SELECT_NONE;

    return (
      <div key={`groupSelect-${index}`} className="flex flex-col gap-2">
        <span className="text-sm font-semibold">소속 그룹</span>
        {isGroupListError ? (
          <p className="text-destructive text-sm">그룹 목록을 불러오지 못했습니다.</p>
        ) : (
          <Select
            value={selectValue}
            disabled={isGroupListLoading}
            onValueChange={(value) =>
              setForm((prev: AgentCreateDto) => ({
                ...prev,
                groupId: value === GROUP_SELECT_NONE ? undefined : (value as string),
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isGroupListLoading ? "그룹 목록을 불러오는 중…" : "그룹을 선택하세요 (선택)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={GROUP_SELECT_NONE}>선택 안 함</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const renderRow = (row: AgentCreateFormRow, index: number) => {
    if (row.kind === "provider") {
      return (
        <div key={`provider-${index}`} className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Provider</span>
          <Select
            value={form.provider}
            onValueChange={(value) =>
              setForm((prev: AgentCreateDto) => ({
                ...prev,
                provider: value as AgentCreateDto["provider"],
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Provider를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GEMINAI">재미나이</SelectItem>
              <SelectItem value="XAI">그록</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    if (row.kind === "groupSelect") {
      return renderGroupSelect(index);
    }
    return renderTextField(row);
  };

  if (!open) return null;

  return (
    <AdminModalDialog
      title="에이전트 생성"
      subtitle="먼저 에이전트 그룹을 만든 뒤, 생성한 에이전트를 그룹 멤버로 추가하세요."
      onClose={() => onOpenChange(false)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {AGENT_CREATE_FORM_ROWS.map((row, i) => renderRow(row, i))}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "생성 중..." : "생성하기"}
          </Button>
        </div>
      </form>
    </AdminModalDialog>
  );
}
