import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AgentGroupMemberUpdateDto,
  deleteAgentGroupMember,
  updateAgnetGroupMember,
} from "../api/agent-group-member";
import { agentGroupMemberKeys } from "../queryKeys/agent-group-member";
import { toast } from "../toast";

export const useDeleteAgentGroupMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, agentId }: { id: string; agentId: string }) =>
      deleteAgentGroupMember({ groupId: id, agentId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentGroupMemberKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: agentGroupMemberKeys.detail(variables.id, variables.agentId),
      });
      toast.success("멤버가 그룹에서 제거되었습니다.");
    },
  });
};

export const useUpdateAgentGroupMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: AgentGroupMemberUpdateDto) => updateAgnetGroupMember(query),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentGroupMemberKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: agentGroupMemberKeys.detail(variables.groupId, variables.agentId),
      });
      toast.success("멤버 정보가 수정되었습니다.");
    },
  });
};
