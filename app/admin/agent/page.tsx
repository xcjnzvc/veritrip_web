import type { AgentGroupListResponse } from "@/lib/api/agent-group";
import { authenticatedFetch } from "@/lib/server/authenticatedFetch";
import AgentPageClient from "./pageClient";

async function fetchInitialGroupList(): Promise<AgentGroupListResponse | undefined> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return undefined;

  try {
    return await authenticatedFetch<AgentGroupListResponse>(
      apiBase,
      "/mgmt/agent-groups?page=1&take=10",
      { method: "GET" },
      { redirectTo: undefined, retryOn401: true },
    );
  } catch {
    // 갱신까지 실패하면 SSR 초기 데이터는 비워두고 클라이언트에서 정상 처리하도록 둡니다.
    return undefined;
  }
}

export default async function AgentPage() {
  const initialGroupList = await fetchInitialGroupList();

  return <AgentPageClient initialGroupList={initialGroupList} initialGroupPage={1} />;
}
