import axiosInstance from "../axiosInstance";
import {
  AgentGroup,
  AgentGroupCreateDto,
  AgentGroupListQuery,
  AgentGroupUpdateDto,
} from "../types/agent-group";
import { ApiResponse, ApiResponseWithData, ListResponse } from "../types/api";

export type AgentGroupListResponse = ListResponse<AgentGroup>;
export type AgentGroupDetailResponse = ApiResponseWithData<AgentGroup>;

export const fetchAgentGroups = async (
  params: AgentGroupListQuery,
): Promise<AgentGroupListResponse> => {
  const response = await axiosInstance.get<AgentGroupListResponse>("/mgmt/agent-groups", {
    params,
  });
  return response.data;
};

export const fetchAgentGroupDetail = async (id: string): Promise<AgentGroupDetailResponse> => {
  const response = await axiosInstance.get<AgentGroupDetailResponse>(`/mgmt/agent-groups/${id}`);
  return response.data;
};

export const createAgentGroup = async (body: AgentGroupCreateDto): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>("/mgmt/agent-groups", body);
  return response.data;
};

export const updateAgentGroup = async (
  id: string,
  body: AgentGroupUpdateDto,
): Promise<ApiResponse> => {
  const response = await axiosInstance.put<ApiResponse>(`/mgmt/agent-groups/${id}`, body);
  return response.data;
};

export const deleteAgentGroup = async (id: string): Promise<ApiResponse> => {
  const response = await axiosInstance.delete<ApiResponse>(`/mgmt/agent-groups/${id}`);
  return response.data;
};
