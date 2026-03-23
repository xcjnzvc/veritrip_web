import type { AgentCreateDto } from "@/lib/types/agent";

/** AgentCreateDto 문자열 입력 키 (provider·groupId 제외 — groupId는 Select) */
export type AgentCreateTextKey = keyof Pick<
  AgentCreateDto,
  "name" | "description" | "rolePrompt" | "taskPrompt" | "outputPrompt" | "modelId"
>;

export type TextFieldRow = {
  kind: "text";
  key: AgentCreateTextKey;
  variant: "input" | "textarea";
  label: string;
  placeholder: string;
  required?: boolean;
};

export type ProviderRow = { kind: "provider" };
export type GroupSelectRow = { kind: "groupSelect" };

export type AgentFormRow = TextFieldRow | ProviderRow | GroupSelectRow;

export const GROUP_SELECT_NONE = "__none__";

/** AgentCreateDto 필드 순서: 텍스트 → provider → modelId → 그룹 Select */
export const AGENT_FORM_ROWS: AgentFormRow[] = [
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

export function getInitialAgentForm(defaultGroupId?: string | null): AgentCreateDto {
  return {
    name: "",
    description: "",
    rolePrompt: "",
    taskPrompt: "",
    outputPrompt: "",
    provider: "GEMINI",
    modelId: "gemini-1.5-flash",
    groupId: defaultGroupId?.trim() ? defaultGroupId.trim() : undefined,
  };
}
