import axiosInstance from "../axiosInstance";
import { ApiResponse, ApiResponseWithData, ListResponse } from "../types/api";
import { useAuthStore } from "@/store/useAuthStore";

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

// 목록 조회용 쿼리 파라미터 (AgentFindListDto에 맞춰 수정)
export interface AgentListQuery {
  page?: number;
  take?: number;
  keyword?: string;
}

export type AgentListResponse = ListResponse<Agent>;

export type AgentDetailResponse = ApiResponseWithData<Agent>;

export interface AgentCreateDto {
  name: string;
  description: string;
  rolePrompt: string;
  taskPrompt: string;
  outputPrompt: string;
  provider: "XAI" | "GEMINAI";
  modelId: string;
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

// 에이전트 생성 (POST /agents)
export const createAgent = async (body: AgentCreateDto): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>("/agents", body);
  return response.data;
};

// 에이전트 목록 조회 (GET /agents)
export const fetchAgents = async (params: AgentListQuery): Promise<AgentListResponse> => {
  const accessToken = useAuthStore.getState().accessToken;
  console.log("[fetchAgents] accessToken exists:", !!accessToken);
  if (accessToken) {
    console.log("[fetchAgents] accessToken preview:", `${accessToken.slice(0, 12)}...`);
  }

  const response = await axiosInstance.get<AgentListResponse>("/mgmt/agents", { params });
  return response.data;
};

// 에이전트 단건 조회 (GET /agents/:id)
export const fetchAgentDetail = async (id: string): Promise<AgentDetailResponse> => {
  const response = await axiosInstance.get<AgentDetailResponse>(`/agents/${id}`);
  return response.data;
};

// 에이전트 수정 (PATCH /agents/:id)
export const updateAgent = async (id: string, body: AgentUpdateDto): Promise<ApiResponse> => {
  const response = await axiosInstance.patch<ApiResponse>(`/agents/${id}`, body);
  return response.data;
};

// 에이전트 삭제 (DELETE /agents/:id)
export const deleteAgent = async (id: string): Promise<ApiResponse> => {
  const response = await axiosInstance.delete<ApiResponse>(`/agents/${id}`);
  return response.data;
};

// 에이전트 실행 (POST /agents/:id/run)
export const runAgent = async (id: string, body: AgentRunDto): Promise<AgentRunResponse> => {
  const response = await axiosInstance.post<AgentRunResponse>(`/agents/${id}/run`, body);
  return response.data;
};
