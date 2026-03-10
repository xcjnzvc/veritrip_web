"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "대시보드", href: "/admin" },
  { label: "사용자 관리", href: "/admin/users" },
  { label: "예약 관리", href: "/admin/reservations" },
  { label: "설정", href: "/admin/settings" },
];

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 left-0",
        "h-screen w-[260px]",
        "border-r bg-gray-900 text-gray-100",
        "flex flex-col",
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <span className="text-lg font-semibold tracking-tight">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-gray-800 hover:text-white",
                isActive && "bg-gray-800 text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
