"use client";

import { useSilentRefresh } from "@/hooks/useSilentRefresh";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useSilentRefresh();
  return <>{children}</>;
}
