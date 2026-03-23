"use client";

import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

export type AgentGroupPageContextValue = {
  selectedGroupId: string | null;
  setSelectedGroupId: Dispatch<SetStateAction<string | null>>;
};

const AgentGroupPageContext = createContext<AgentGroupPageContextValue | null>(null);

export function AgentGroupPageProvider({ children }: { children: ReactNode }) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ selectedGroupId, setSelectedGroupId }),
    [selectedGroupId],
  );

  return <AgentGroupPageContext.Provider value={value}>{children}</AgentGroupPageContext.Provider>;
}

export function useAgentGroupPage() {
  const ctx = useContext(AgentGroupPageContext);
  if (!ctx) {
    throw new Error("useAgentGroupPage는 AgentGroupPageProvider 안에서만 사용하세요.");
  }
  return ctx;
}
