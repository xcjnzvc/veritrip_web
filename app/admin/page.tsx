import { cn } from "@/lib/utils";
import { AdminTitle } from "./components/title";

export default function AdminPage() {
  return (
    <div className={cn("flex flex-col items-center justify-center p-10")}>
      <AdminTitle>Admin Page</AdminTitle>
    </div>
  );
}
