import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AgentDetailResponse } from "../types/agent";
import {
  AgentListQuery,
  AgentListResponse,
  AgentRunDto,
  AgentRunResponse,
  AgentCreateDto,
  AgentUpdateDto,
  createAgent,
  deleteAgent,
  fetchAgentDetail,
  fetchAgents,
  runAgent,
  updateAgent,
} from "../api/agent";
import { agentKeys } from "../queryKeys/agent";

// -------------
// Query 훅들
// -------------

// 에이전트 목록 조회
export const useAgentListQuery = (
  params: AgentListQuery,
  options?: { enabled?: boolean },
) => {
  return useQuery<AgentListResponse>({
    queryKey: agentKeys.list(params),
    queryFn: () => fetchAgents(params),
    enabled: options?.enabled ?? true,
  });
};

// 에이전트 단건 조회
export const useAgentDetailQuery = (id: string, enabled = true) => {
  return useQuery<AgentDetailResponse>({
    queryKey: agentKeys.detail(id),
    queryFn: () => fetchAgentDetail(id),
    enabled: enabled && !!id,
  });
};

// -------------
// Mutation 훅들
// -------------

// 에이전트 생성
export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AgentCreateDto) => createAgent(body),
    onSuccess: () => {
      // 목록 관련 캐시 전부 무효화
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
};

// 에이전트 수정
export const useUpdateAgentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AgentUpdateDto }) => updateAgent(id, body),
    onSuccess: (_data, variables) => {
      // 상세/목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
};

// 에이전트 삭제
export const useDeleteAgentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAgent(id),
    onSuccess: () => {
      // 삭제 후 목록 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
};

// 에이전트 실행
export const useRunAgentMutation = () => {
  return useMutation<AgentRunResponse, unknown, { id: string; body: AgentRunDto }>({
    mutationFn: ({ id, body }) => runAgent(id, body),
  });
};
