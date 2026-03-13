"use client";

import { AdminTitle } from "../../components/title";
import AgentCreateForm from "../components/AgentCreateForm";
import { useNavigation } from "@refinedev/core";

export default function AgentCreatePage() {
  const { list } = useNavigation();

  return (
    <div className="max-w-3xl space-y-6">
      <AdminTitle>에이전트 생성</AdminTitle>
      <AgentCreateForm onSuccess={() => list("agents")} />
    </div>
  );
}
