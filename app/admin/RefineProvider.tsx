"use client";

import { Refine } from "@refinedev/core";
// App Router는 반드시 `/app` 엔트리를 사용합니다. 기본 패키지 엔트리는 Pages Router용이라
// Turbopack에서 청크 로드/하이드레이션 오류가 날 수 있습니다.
import routerProvider from "@refinedev/nextjs-router/app";
import { AdminHeader } from "./components/header";
import { cn } from "@/lib/utils";

interface RefineProviderProps {
  children: React.ReactNode;
}

export default function RefineProvider({ children }: RefineProviderProps) {
  return (
    <Refine
      routerProvider={routerProvider}
      resources={[
        {
          name: "agents",
          list: "/admin/agent",
          create: "/admin/agent/create",
        },
      ]}
      options={{
        syncWithLocation: true,
      }}
    >
      <div className={cn("flex min-h-screen bg-gray-50")}>
        <AdminHeader />
        <main className={cn("flex-1", "px-8 py-6", "border-l", "bg-white")}>{children}</main>
      </div>
    </Refine>
  );
}
