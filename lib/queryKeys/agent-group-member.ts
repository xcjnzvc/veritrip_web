export const agentGroupMemberKeys = {
  all: ["agent-group-members"] as const,
  lists: () => [...agentGroupMemberKeys.all, "list"] as const,
  list: (groupId: string) => [...agentGroupMemberKeys.lists(), groupId] as const,
  detail: (groupId: string, agentId: string) =>
    [...agentGroupMemberKeys.list(groupId), agentId] as const,
};
