"use client";

import { useSilentRefresh } from "@/hooks/useSilentRefresh";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useSilentRefresh();
  const { isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return null;
  }

  return <>{children}</>;
}
