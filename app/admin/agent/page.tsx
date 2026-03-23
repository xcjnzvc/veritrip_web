import AgentPageClient from "./pageClient";

/** 데이터는 클라이언트에서 패칭 — 서버는 즉시 UI 골격만 내려 TTFB를 줄입니다. */
export default function AgentPage() {
  return <AgentPageClient />;
}
