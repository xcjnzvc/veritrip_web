import { ApiResponseWithData, ListResponse } from "./api";

// 에이전트 엔티티 (실제 응답 스펙에 맞게 정의)
export interface Agent {
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: number;
  name: string;
  description: string;
  provider: string; // 예: "XAI"
  modelId: string;
}

/** GET /mgmt/agents/:id 단건 응답용 (프롬프트·그룹 등 편집에 필요한 필드) */
export interface AgentDetail extends Agent {
  rolePrompt?: string | null;
  taskPrompt?: string | null;
  outputPrompt?: string | null;
  groupId?: string | null;
}

export type AgentDetailResponse = ApiResponseWithData<AgentDetail>;

// 목록 조회용 쿼리 파라미터 (AgentFindListDto에 맞춰 수정)
export interface AgentListQuery {
  page?: number;
  take?: number;
  keyword?: string;
}

export type AgentListResponse = ListResponse<Agent>;

export interface AgentCreateDto {
  name: string;
  description: string;
  rolePrompt: string;
  taskPrompt: string;
  outputPrompt: string;
  provider: "XAI" | "GEMINI";
  modelId: string;
  groupId?: string;
}

// 수정은 일부 필드만 선택적으로 들어갈 수 있도록 부분 타입으로 정의
export type AgentUpdateDto = Partial<
  Pick<
    AgentCreateDto,
    "name" | "description" | "rolePrompt" | "taskPrompt" | "outputPrompt" | "provider" | "modelId"
  >
>;

export interface AgentRunDto {
  // TODO: AgentRunDto 필드를 백엔드와 맞게 정의
  [key: string]: unknown;
}

export type AgentRunResponse = ApiResponseWithData<unknown>;

export interface AiProvider {
  XAI: "XAI";
  GEMINI: "GEMINI";
}
