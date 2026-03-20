"use client";

import AdminAgentCreateForm from "../components/AdminAgentCreateForm";
import AdminPageHeader from "../../components/AdminPageHeader";
import { useNavigation } from "@refinedev/core";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AgentCreatePage() {
  const { list } = useNavigation();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <AdminPageHeader
          title="에이전트 생성"
          subtitle="먼저 에이전트 그룹을 만든 뒤, 생성한 에이전트를 그룹 멤버로 추가하세요."
        />
        <Button variant="outline" size="sm">
          <Link href="/admin/agent">에이전트 그룹 관리로 이동</Link>
        </Button>
      </div>
      <AdminAgentCreateForm onSuccess={() => list("agents")} />
    </div>
  );
}
