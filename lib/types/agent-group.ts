export type AgentGroupStrategy = "SEQUENTIAL" | "PARALLEL" | "ROUTER";

// 에이전트(멤버로 포함되어 내려오는 최소 필드)
export interface AgentForMember {
  id: string;
  name: string;
  description?: string | null;
  provider?: string | null;
  modelId?: string | null;
  createdAt?: string;
}

export interface AgentGroupMemberDto {
  agentId: string;
  order?: number;
  role?: string | null;
  routerKeywords?: string | null;
}

export interface AgentGroupMember {
  id: string;
  groupId: string;
  agentId: string;
  order: number;
  role: string | null;
  routerKeywords: string | null;
  agent: AgentForMember;
}

export interface AgentGroup {
  id: string;
  userId: number;
  name: string;
  description?: string | null;
  strategy: AgentGroupStrategy;
  sharedContext?: string | null;
  synthesizePrompt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  members?: AgentGroupMember[];
}

export interface AgentGroupListQuery {
  page?: number;
  take?: number;
}

export interface AgentGroupCreateDto {
  name: string;
  description?: string;
  strategy: AgentGroupStrategy;
  sharedContext?: string;
  synthesizePrompt?: string;
  members: AgentGroupMemberDto[];
}

export type AgentGroupUpdateDto = Partial<Omit<AgentGroupCreateDto, "members">> & {
  members?: AgentGroupMemberDto[];
};
