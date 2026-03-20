import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AgentGroupDetailResponse,
  AgentGroupListResponse,
  createAgentGroup,
  deleteAgentGroup,
  fetchAgentGroups,
  fetchAgentGroupDetail,
  updateAgentGroup,
} from "../api/agent-group";
import type {
  AgentGroupCreateDto,
  AgentGroupListQuery,
  AgentGroupUpdateDto,
} from "../types/agent-group";
import { agentGroupKeys } from "../queryKeys/agent-group";

export const useAgentGroupListQuery = (params: AgentGroupListQuery) => {
  return useQuery<AgentGroupListResponse>({
    queryKey: agentGroupKeys.list(params),
    queryFn: () => fetchAgentGroups(params),
  });
};

export const useAgentGroupDetailQuery = (id: string | null, enabled = true) => {
  return useQuery<AgentGroupDetailResponse>({
    queryKey: agentGroupKeys.detail(id ?? ""),
    queryFn: () => (id ? fetchAgentGroupDetail(id) : Promise.reject(new Error("Group id is empty"))),
    enabled: enabled && !!id,
  });
};

export const useCreateAgentGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AgentGroupCreateDto) => createAgentGroup(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentGroupKeys.lists() });
    },
  });
};

export const useUpdateAgentGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AgentGroupUpdateDto }) => updateAgentGroup(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentGroupKeys.details() });
      queryClient.invalidateQueries({ queryKey: agentGroupKeys.detail(variables.id) });
    },
  });
};

export const useDeleteAgentGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAgentGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentGroupKeys.lists() });
    },
  });
};

