import axiosInstance from "../axiosInstance";
import { ApiResponse } from "../types/api";

export const deleteAgentGroupMember = async (
  query: AgentGroupMemberQuery,
): Promise<ApiResponse> => {
  const { groupId, agentId } = query;
  const response = await axiosInstance.delete<ApiResponse>(
    `/mgmt/agent-groups-members/${groupId}/${agentId}`,
  );
  return response.data;
};

export const updateAgnetGroupMember = async (query: AgentGroupMemberUpdateDto) => {
  const { groupId, agentId, ...rest } = query;
  const response = await axiosInstance.put<ApiResponse>(
    `/mgmt/agent-groups-members/${groupId}/${agentId}`,
    rest,
  );
  return response.data;
};

export interface AgentGroupMemberUpdateDto extends AgentGroupMemberQuery {
  order?: number;
  role?: string;
  routerKeywords?: string;
}

export interface AgentGroupMemberQuery {
  groupId: string;
  agentId: string;
}
