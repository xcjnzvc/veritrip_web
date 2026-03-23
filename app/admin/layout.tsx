import dynamic from "next/dynamic";
import { Suspense } from "react";

const RefineProvider = dynamic(() => import("./RefineProvider"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">Admin 레이아웃을 불러오는 중...</p>
    </div>
  ),
});

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={null}>
      <RefineProvider>{children}</RefineProvider>
    </Suspense>
  );
}
