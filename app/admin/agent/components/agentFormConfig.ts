import type { AgentCreateDto } from "@/lib/types/agent";

/** AgentCreateDto 문자열 입력 키 (provider·groupId 제외 — groupId는 Select) */
export type AgentCreateTextKey = keyof Pick<
  AgentCreateDto,
  "name" | "description" | "rolePrompt" | "taskPrompt" | "outputPrompt" | "modelId"
>;

export type AgentCreateBooleanKey = keyof Pick<AgentCreateDto, "useJson" | "useSearch">;

export type TextFieldRow = {
  kind: "text";
  key: AgentCreateTextKey;
  variant: "input" | "textarea";
  label: string;
  placeholder: string;
  required?: boolean;
};

export type BooleanFieldRow = {
  kind: "boolean";
  key: AgentCreateBooleanKey;
  label: string;
  description?: string;
};

export type ProviderRow = { kind: "provider" };
export type GroupSelectRow = { kind: "groupSelect" };

export type AgentFormRow = TextFieldRow | BooleanFieldRow | ProviderRow | GroupSelectRow;

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
    kind: "boolean",
    key: "useJson",
    label: "JSON 사용",
    description: "출력 포맷을 JSON 기반으로 생성하도록 설정합니다.",
  },
  {
    kind: "boolean",
    key: "useSearch",
    label: "웹 검색 사용",
    description: "필요 시 웹 검색을 활용해 결과를 보강합니다.",
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
    useJson: false,
    useSearch: false,
    outputPrompt: "",
    provider: "GEMINI",
    modelId: "gemini-1.5-flash",
    groupId: defaultGroupId?.trim() ? defaultGroupId.trim() : undefined,
  };
}
