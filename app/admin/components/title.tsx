import { cn } from "@/lib/utils";

interface AdminTitleProps {
  children: React.ReactNode;
}

export function AdminTitle({ children }: AdminTitleProps) {
  return <h1 className={cn("text-2xl font-bold")}>{children}</h1>;
}
