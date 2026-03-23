// React Query용 agent 관련 queryKey 모음
// 목록, 상세, 실행 등으로 확장 가능한 구조
export const agentKeys = {
  all: ["agents"] as const,
  lists: () => [...agentKeys.all, "list"] as const,
  list: (params: unknown) => [...agentKeys.lists(), params] as const,
  details: () => [...agentKeys.all, "detail"] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  run: (id: string) => [...agentKeys.all, "run", id] as const,
};
