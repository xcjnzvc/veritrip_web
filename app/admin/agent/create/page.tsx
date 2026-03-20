"use client";

import { AdminTitle } from "../../components/title";
import AdminAgentCreateForm from "../components/AdminAgentCreateForm";
import { useNavigation } from "@refinedev/core";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AgentCreatePage() {
  const { list } = useNavigation();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <AdminTitle>에이전트 생성</AdminTitle>
        <p className="text-sm text-muted-foreground">
          먼저 에이전트 그룹을 만든 뒤, 생성한 에이전트를 그룹 멤버로 추가하세요.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/agent">에이전트 그룹 관리로 이동</Link>
        </Button>
      </div>
      <AdminAgentCreateForm onSuccess={() => list("agents")} />
    </div>
  );
}
