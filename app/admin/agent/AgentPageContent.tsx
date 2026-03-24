import type { AgentGroupListResponse } from "@/lib/api/agent-group";
import { fetchAgentGroupsFirstPageServer } from "@/lib/server/fetchAgentGroupsServer";
import AgentPageClient from "./pageClient";

/**
 * 서버에서 그룹 목록 시드를 패칭한 뒤 클라이언트 트리를 렌더합니다.
 * `page.tsx`의 `<Suspense>` 경계 안에서만 사용하세요.
 */
type AgentPageContentProps = {
  geminiModelIds: string[];
};

export default async function AgentPageContent({ geminiModelIds }: AgentPageContentProps) {
  let initialGroupList: AgentGroupListResponse | undefined;
  let initialGroupListUpdatedAt: number | undefined;

  try {
    const seeded = await fetchAgentGroupsFirstPageServer();
    initialGroupList = seeded.data;
    initialGroupListUpdatedAt = seeded.fetchedAt;
  } catch {
    /* 서버 패칭 실패 시 클라이언트 `useAgentGroupListQuery`가 동일 키로 재시도 */
  }

  return (
    <AgentPageClient
      initialGroupList={initialGroupList}
      initialGroupListUpdatedAt={initialGroupListUpdatedAt}
      geminiModelIds={geminiModelIds}
    />
  );
}
