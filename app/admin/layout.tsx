import dynamic from "next/dynamic";
import { Suspense } from "react";
import AdminRouteLoadingUI from "./components/AdminRouteLoadingUI";
import AdminToaster from "./components/AdminToaster";

const RefineProvider = dynamic(() => import("./RefineProvider"), {
  loading: () => (
    <AdminRouteLoadingUI progressTitle="관리자 환경을 불러오는 중" />
  ),
});

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={null}>
      <RefineProvider>{children}</RefineProvider>
      <AdminToaster />
    </Suspense>
  );
}
