import axiosInstance from "../axiosInstance";
import {
  AgentCreateDto,
  AgentDetailResponse,
  AgentListQuery,
  AgentListResponse,
  AgentRunDto,
  AgentRunResponse,
  AgentUpdateDto,
} from "../types/agent";
import { ApiResponse } from "../types/api";

export type { AgentDetailResponse } from "../types/agent";
export type {
  AgentCreateDto,
  AgentListQuery,
  AgentListResponse,
  AgentRunDto,
  AgentRunResponse,
  AgentUpdateDto,
} from "../types/agent";

// 에이전트 생성 (POST /agents)
export const createAgent = async (body: AgentCreateDto): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>("/mgmt/agents", body);
  return response.data;
};

// 에이전트 목록 조회 (GET /agents)
export const fetchAgents = async (params: AgentListQuery): Promise<AgentListResponse> => {
  const response = await axiosInstance.get<AgentListResponse>("/mgmt/agents", { params });
  return response.data;
};

// 에이전트 단건 조회 (GET /mgmt/agents/:id)
export const fetchAgentDetail = async (id: string): Promise<AgentDetailResponse> => {
  const response = await axiosInstance.get<AgentDetailResponse>(`/mgmt/agents/${id}`);
  return response.data;
};

// 에이전트 수정 (PATCH /agents/:id)
export const updateAgent = async (id: string, body: AgentUpdateDto): Promise<ApiResponse> => {
  const response = await axiosInstance.patch<ApiResponse>(`/mgmt/agents/${id}`, body);
  return response.data;
};

// 에이전트 삭제 (DELETE /agents/:id)
export const deleteAgent = async (id: string): Promise<ApiResponse> => {
  const response = await axiosInstance.delete<ApiResponse>(`/mgmt/agents/${id}`);
  return response.data;
};

// 에이전트 실행 (POST /agents/:id/run)
export const runAgent = async (id: string, body: AgentRunDto): Promise<AgentRunResponse> => {
  const response = await axiosInstance.post<AgentRunResponse>(`/mgmt/agents/${id}/run`, body);
  return response.data;
};
