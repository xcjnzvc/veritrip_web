import { cn } from "@/lib/utils";
import { AdminHeader } from "./components/header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={cn("flex min-h-screen bg-gray-50")}>
      <AdminHeader />
      <main
        className={cn(
          "flex-1",
          "px-8 py-6",
          "border-l",
          "bg-white"
        )}
      >
        {children}
      </main>
    </div>
  );
}

