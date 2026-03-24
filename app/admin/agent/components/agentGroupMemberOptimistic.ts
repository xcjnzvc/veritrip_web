import type { AgentGroupDetailResponse, AgentGroupListResponse } from "@/lib/api/agent-group";
import { agentGroupKeys } from "@/lib/queryKeys/agent-group";
import type { QueryClient } from "@tanstack/react-query";

type RemoveMemberSnapshot = {
  previousGroupLists: Array<[readonly unknown[], AgentGroupListResponse | undefined]>;
  previousGroupDetail: AgentGroupDetailResponse | undefined;
};

type RemoveMemberParams = {
  queryClient: QueryClient;
  groupId: string;
  agentId: string;
};

export function applyOptimisticRemoveGroupMember({
  queryClient,
  groupId,
  agentId,
}: RemoveMemberParams): RemoveMemberSnapshot {
  const previousGroupLists = queryClient.getQueriesData<AgentGroupListResponse>({
    queryKey: agentGroupKeys.lists(),
  });
  const previousGroupDetail = queryClient.getQueryData<AgentGroupDetailResponse>(
    agentGroupKeys.detail(groupId),
  );

  queryClient.setQueriesData<AgentGroupListResponse>({ queryKey: agentGroupKeys.lists() }, (old) => {
    if (!old) return old;
    return {
      ...old,
      data: old.data.map((g) => {
        if (g.id !== groupId) return g;
        if (!Array.isArray(g.members)) return g;
        return {
          ...g,
          members: g.members.filter((m) => m.agentId !== agentId),
        };
      }),
    };
  });

  queryClient.setQueryData<AgentGroupDetailResponse>(agentGroupKeys.detail(groupId), (old) => {
    if (!old?.data) return old;
    return {
      ...old,
      data: {
        ...old.data,
        members: (old.data.members ?? []).filter((m) => m.agentId !== agentId),
      },
    };
  });

  return {
    previousGroupLists,
    previousGroupDetail,
  };
}

export function rollbackOptimisticRemoveGroupMember({
  queryClient,
  groupId,
  snapshot,
}: {
  queryClient: QueryClient;
  groupId: string;
  snapshot: RemoveMemberSnapshot;
}) {
  for (const [queryKey, data] of snapshot.previousGroupLists) {
    queryClient.setQueryData(queryKey, data);
  }
  if (snapshot.previousGroupDetail) {
    queryClient.setQueryData(agentGroupKeys.detail(groupId), snapshot.previousGroupDetail);
  }
}

export function invalidateGroupMemberQueries({
  queryClient,
  groupId,
}: {
  queryClient: QueryClient;
  groupId: string;
}) {
  void queryClient.invalidateQueries({ queryKey: agentGroupKeys.lists() });
  void queryClient.invalidateQueries({ queryKey: agentGroupKeys.detail(groupId) });
}
