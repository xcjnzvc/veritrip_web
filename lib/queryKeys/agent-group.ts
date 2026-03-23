export const agentGroupKeys = {
  all: ["agent-groups"] as const,
  lists: () => [...agentGroupKeys.all, "list"] as const,
  list: (params: unknown) => [...agentGroupKeys.lists(), params] as const,
  details: () => [...agentGroupKeys.all, "detail"] as const,
  detail: (id: string) => [...agentGroupKeys.details(), id] as const,
};

