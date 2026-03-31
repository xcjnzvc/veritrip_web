"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import AdminInput from "../../components/AdminInput";
import AdminModalDialog from "../../components/AdminModalDialog";
import AdminTextarea from "../../components/AdminTextarea";
import AdminInlineLoading from "../../components/AdminInlineLoading";
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
import { useAgentDetailQuery, useUpdateAgentMutation } from "@/lib/queries/agent";
import type { AgentCreateDto, AgentDetail, AgentUpdateDto } from "@/lib/types/agent";
import { useCreate } from "@refinedev/core";
import {
  AGENT_FORM_ROWS,
  GROUP_SELECT_NONE,
  type AgentCreateTextKey,
  type AgentCreateBooleanKey,
  type AgentFormRow,
  type TextFieldRow,
  getInitialAgentForm,
} from "../components/agentFormConfig";

const AGENT_MODAL_MAX_HEIGHT_CLASS = "max-h-[85vh] overflow-hidden";
const AGENT_MODAL_BODY_SCROLL_CLASS = "max-h-[calc(85vh-120px)] overflow-y-auto pr-1 pb-4";

function detailToForm(d: AgentDetail): AgentCreateDto {
  const p = d.provider;
  const provider: AgentCreateDto["provider"] = p === "XAI" || p === "GEMINI" ? p : "GEMINI";
  return {
    name: d.name ?? "",
    description: d.description ?? "",
    rolePrompt: d.rolePrompt ?? "",
    taskPrompt: d.taskPrompt ?? "",
    outputPrompt: d.outputPrompt ?? "",
    provider,
    modelId: d.modelId ?? "",
    groupId: undefined,
    useJson: d.useJson ?? false,
    useSearch: d.useSearch ?? false,
  };
}

type AgentFormFieldsProps = {
  form: AgentCreateDto;
  setForm: Dispatch<SetStateAction<AgentCreateDto>>;
  rows: AgentFormRow[];
  groups: { id: string; name: string }[];
  geminiModelIds: string[];
  isGroupListLoading: boolean;
  isGroupListError: boolean;
};

function AgentFormFields({
  form,
  setForm,
  rows,
  groups,
  geminiModelIds,
  isGroupListLoading,
  isGroupListError,
}: AgentFormFieldsProps) {
  const handleChange =
    (field: AgentCreateTextKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleBooleanChange =
    (field: AgentCreateBooleanKey) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.checked }));
    };

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
    if (field.key === "outputPrompt") {
      return <AdminTextarea key={field.key} {...common} />;
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
              setForm((prev) => ({
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

  const renderRow = (row: AgentFormRow, index: number) => {
    if (row.kind === "boolean") {
      const id = `agent-form-${row.key}-${index}`;

      return (
        <div key={id} className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <label htmlFor={id} className="block text-sm font-semibold leading-none">
              {row.label}
            </label>
            {row.description ? <p className="text-muted-foreground text-xs">{row.description}</p> : null}
          </div>
          <input
            id={id}
            type="checkbox"
            checked={form[row.key]}
            onChange={handleBooleanChange(row.key)}
            className="border-input size-4 rounded border"
          />
        </div>
      );
    }
    if (row.kind === "provider") {
      return (
        <div key={`provider-${index}`} className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Provider</span>
          <Select
            value={form.provider}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                provider: value as AgentCreateDto["provider"],
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Provider를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GEMINI">재미나이</SelectItem>
              <SelectItem value="XAI">그록</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    if (row.kind === "groupSelect") {
      return renderGroupSelect(index);
    }
    if (row.kind === "text" && row.key === "modelId") {
      if (form.provider !== "GEMINI") {
        return renderTextField(row);
      }

      const hasModels = geminiModelIds.length > 0;
      const selectValue = form.modelId?.trim() ? form.modelId : undefined;

      return (
        <div key={`model-${index}`} className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Model ID</span>
          <Select
            value={hasModels ? selectValue : undefined}
            disabled={!hasModels}
            onValueChange={(value) => setForm((prev) => ({ ...prev, modelId: value ?? "" }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  hasModels ? "Gemini 모델을 선택하세요" : "Gemini 모델 목록을 불러오지 못했습니다"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {hasModels
                ? geminiModelIds.map((modelId) => (
                    <SelectItem key={modelId} value={modelId}>
                      {modelId}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
          {!hasModels ? (
            <p className="text-muted-foreground text-xs">
              서버에서 모델 목록을 받아오지 못해 선택이 비활성화되었습니다.
            </p>
          ) : null}
        </div>
      );
    }
    return renderTextField(row);
  };

  return <>{rows.map((row, i) => renderRow(row, i))}</>;
}

const EDIT_FORM_ROWS = AGENT_FORM_ROWS.filter((r) => r.kind !== "groupSelect");

type AdminAgentCreateFormProps = {
  open: boolean;
  geminiModelIds: string[];
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultGroupId?: string | null;
  /** 설정 시 수정 모드(상세 조회 후 폼). 소속 그룹 필드는 표시하지 않음. */
  editAgentId?: string | null;
};

function AdminAgentEditFormBody({
  agentId,
  initialForm,
  geminiModelIds,
  onSuccess,
  onCancel,
}: {
  agentId: string;
  initialForm: AgentCreateDto;
  geminiModelIds: string[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const updateMutation = useUpdateAgentMutation();
  const [form, setForm] = useState<AgentCreateDto>(initialForm);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: AgentUpdateDto = {
      name: form.name,
      description: form.description,
      rolePrompt: form.rolePrompt,
      taskPrompt: form.taskPrompt,
      outputPrompt: form.outputPrompt,
      provider: form.provider,
      modelId: form.modelId,
      useJson: form.useJson,
      useSearch: form.useSearch,
    };

    updateMutation.mutate(
      { id: agentId, body },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-6">
      <AgentFormFields
        form={form}
        setForm={setForm}
        rows={EDIT_FORM_ROWS}
        groups={[]}
        geminiModelIds={geminiModelIds}
        isGroupListLoading={false}
        isGroupListError={false}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={updateMutation.isPending}
        >
          취소
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "저장 중…" : "수정"}
        </Button>
      </div>
    </form>
  );
}

export default function AdminAgentCreateForm({
  open,
  geminiModelIds,
  onOpenChange,
  onSuccess,
  defaultGroupId,
  editAgentId = null,
}: AdminAgentCreateFormProps) {
  const [isJsonPreviewOpen, setIsJsonPreviewOpen] = useState(false);
  const isEdit = Boolean(editAgentId);
  const detailQuery = useAgentDetailQuery(editAgentId ?? "", open && isEdit);

  const { mutate, mutation } = useCreate();

  const {
    data: groupListData,
    isLoading: isGroupListLoading,
    isError: isGroupListError,
  } = useAgentGroupListQuery(
    { page: 1, take: AGENT_GROUP_LIST_SELECT_TAKE },
    { enabled: open && !isEdit },
  );

  const groups = groupListData?.data ?? [];

  const [form, setForm] = useState<AgentCreateDto>(() => getInitialAgentForm(defaultGroupId));

  const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
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

  if (!open) return null;

  const handleEditDone = () => {
    onSuccess();
    onOpenChange(false);
  };

  if (isEdit) {
    const agent = detailQuery.data?.data;
    const detailError = detailQuery.isError;
    const detailLoading = detailQuery.isPending || detailQuery.isFetching;
    const renderAgentJsonPreview = () => {
      if (!agent) {
        return <p className="text-muted-foreground text-sm">에이전트 상세 데이터가 없습니다.</p>;
      }
      return (
        <pre className="max-h-[70vh] overflow-auto rounded-md bg-zinc-950 p-4 text-sm text-zinc-100">
          <code>{JSON.stringify(agent, null, 2)}</code>
        </pre>
      );
    };

    return (
      <AdminModalDialog
        title="에이전트 수정"
        subtitle="서버에서 불러온 값을 수정한 뒤 저장합니다."
        onClose={() => onOpenChange(false)}
        className={AGENT_MODAL_MAX_HEIGHT_CLASS}
      >
        {isJsonPreviewOpen ? (
          <AdminModalDialog
            title="에이전트 상세 JSON 미리보기"
            subtitle="API로 불러온 에이전트 detail(data) 값을 그대로 JSON 코드블럭으로 표시합니다."
            onClose={() => setIsJsonPreviewOpen(false)}
            className="max-w-5xl"
          >
            {renderAgentJsonPreview()}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsJsonPreviewOpen(false)}>
                닫기
              </Button>
            </div>
          </AdminModalDialog>
        ) : null}
        <div className="flex justify-end pb-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsJsonPreviewOpen(true)}
            disabled={!agent || detailLoading || detailError}
          >
            에이전트 JSON 보기
          </Button>
        </div>
        <div className={AGENT_MODAL_BODY_SCROLL_CLASS}>
          {!editAgentId ? (
            <p className="text-muted-foreground text-sm">에이전트를 선택해 주세요.</p>
          ) : detailError ? (
            <p className="text-destructive text-sm">
              에이전트 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          ) : detailLoading || !agent ? (
            <AdminInlineLoading label="에이전트 상세를 불러오는 중…" className="min-h-[240px]" />
          ) : (
            <AdminAgentEditFormBody
              key={agent.id}
              agentId={editAgentId}
              initialForm={detailToForm(agent)}
              geminiModelIds={geminiModelIds}
              onSuccess={handleEditDone}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </AdminModalDialog>
    );
  }

  return (
    <AdminModalDialog
      title="에이전트 생성"
      subtitle="먼저 에이전트 그룹을 만든 뒤, 생성한 에이전트를 그룹 멤버로 추가하세요."
      onClose={() => onOpenChange(false)}
      className={AGENT_MODAL_MAX_HEIGHT_CLASS}
    >
      <div className={AGENT_MODAL_BODY_SCROLL_CLASS}>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <AgentFormFields
            form={form}
            setForm={setForm}
            rows={AGENT_FORM_ROWS}
            groups={groups}
            geminiModelIds={geminiModelIds}
            isGroupListLoading={isGroupListLoading}
            isGroupListError={isGroupListError}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "생성 중..." : "생성하기"}
            </Button>
          </div>
        </form>
      </div>
    </AdminModalDialog>
  );
}
