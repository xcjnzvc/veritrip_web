import type { DataProvider } from "@refinedev/core";
import {
  Agent,
  AgentCreateDto,
  AgentDetailResponse,
  AgentListResponse,
  AgentUpdateDto,
  createAgent,
  deleteAgent,
  fetchAgentDetail,
  fetchAgents,
  updateAgent,
} from "../api/agent";

const dataProvider: DataProvider = {
  // 목록 조회 (GET /agents)
  getList: async ({ resource, pagination }) => {
    if (resource !== "agents") {
      throw new Error(`getList for resource "${resource}" is not implemented`);
    }

    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    const res: AgentListResponse = await fetchAgents({
      page: current,
      pageSize,
    });

    const data: Agent[] = res.data;
    const total = res.meta?.totalCount ?? data.length;

    return {
      data,
      total,
    };
  },

  // 단건 조회 (GET /agents/:id)
  getOne: async ({ resource, id }) => {
    if (resource !== "agents") {
      throw new Error(`getOne for resource "${resource}" is not implemented`);
    }

    const res: AgentDetailResponse = await fetchAgentDetail(id.toString());

    return {
      data: res.data,
    };
  },

  // 생성 (POST /agents)
  create: async ({ resource, variables }) => {
    if (resource !== "agents") {
      throw new Error(`create for resource "${resource}" is not implemented`);
    }

    const body = variables as AgentCreateDto;
    const res = await createAgent(body);

    // API에서 생성된 엔티티를 반환하지 않으면 data는 null일 수 있음
    return {
      data: (res.data ?? body) as unknown as Agent,
    };
  },

  // 수정 (PATCH /agents/:id)
  update: async ({ resource, id, variables }) => {
    if (resource !== "agents") {
      throw new Error(`update for resource "${resource}" is not implemented`);
    }

    const body = variables as AgentUpdateDto;
    const res = await updateAgent(id.toString(), body);

    return {
      data: (res.data ?? { id, ...body }) as unknown as Agent,
    };
  },

  // 삭제 (DELETE /agents/:id)
  deleteOne: async ({ resource, id }) => {
    if (resource !== "agents") {
      throw new Error(`deleteOne for resource "${resource}" is not implemented`);
    }

    await deleteAgent(id.toString());

    return {
      data: { id } as unknown as Agent,
    };
  },

  // 미사용 메서드들 - 필요 시 구현
  getMany: async () => {
    throw new Error("getMany is not implemented");
  },
  createMany: async () => {
    throw new Error("createMany is not implemented");
  },
  updateMany: async () => {
    throw new Error("updateMany is not implemented");
  },
  deleteMany: async () => {
    throw new Error("deleteMany is not implemented");
  },
  getApiUrl: () => "",
  custom: async () => {
    throw new Error("custom is not implemented");
  },
};

export default dataProvider;

