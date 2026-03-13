"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { AdminHeader } from "./components/header";
import { cn } from "@/lib/utils";
import dataProvider from "@/lib/refine/dataProvider";

interface RefineProviderProps {
  children: React.ReactNode;
}

export default function RefineProvider({ children }: RefineProviderProps) {
  return (
    <Refine
      dataProvider={{ default: dataProvider }}
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
        <main
          className={cn(
            "flex-1",
            "px-8 py-6",
            "border-l",
            "bg-white",
          )}
        >
          {children}
        </main>
      </div>
    </Refine>
  );
}

