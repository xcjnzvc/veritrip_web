import type { AgentGroupListResponse } from "@/lib/api/agent-group";
import { AGENT_GROUP_LIST_TAKE } from "@/lib/constants/agentGroupList";
import type { AgentGroupListQuery } from "@/lib/types/agent-group";
import { createServerApi } from "./createServerApi";

export async function fetchAgentGroupsServer(
  params: AgentGroupListQuery,
): Promise<AgentGroupListResponse> {
  const api = await createServerApi();
  const response = await api.get<AgentGroupListResponse>("/mgmt/agent-groups", { params });
  return response.data;
}

export async function fetchAgentGroupsFirstPageServer(): Promise<{
  data: AgentGroupListResponse;
  fetchedAt: number;
}> {
  const data = await fetchAgentGroupsServer({ page: 1, take: AGENT_GROUP_LIST_TAKE });
  return { data, fetchedAt: Date.now() };
}
