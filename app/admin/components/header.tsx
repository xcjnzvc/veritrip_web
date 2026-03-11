"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "대시보드", href: "/admin" },
  {
    label: "에이전트 관리",
    href: "/admin/agent",
    children: [
      { label: "에이전트 목록", href: "/admin/agent" },
      { label: "에이전트 생성", href: "/admin/agent/create" },
    ],
  },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [openParent, setOpenParent] = useState<string | null>(null);

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
          const hasChildren = item.children && item.children.length > 0;
          const isActive =
            (item.href && pathname === item.href) ||
            (hasChildren && item.children!.some((child) => pathname.startsWith(child.href)));

          // 상위 메뉴 + 하위 메뉴 토글
          if (hasChildren) {
            const isOpen = openParent === item.label || isActive;

            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    setOpenParent((prev) => (prev === item.label ? null : item.label))
                  }
                  className={cn(
                    "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-gray-800 hover:text-white",
                    isActive && "bg-gray-800 text-white",
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-400">{isOpen ? "▾" : "▸"}</span>
                </button>

                {isOpen && (
                  <div className="ml-2 pl-2 border-l border-gray-800 space-y-1">
                    {item.children!.map((child) => {
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                            "hover:bg-gray-800 hover:text-white",
                            isChildActive && "bg-gray-800 text-white",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // 일반 단일 메뉴
          return (
            <Link
              key={item.href}
              href={item.href!}
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
