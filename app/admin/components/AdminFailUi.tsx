"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminFailUiProps = {
  title: string;
  message?: string;
  children?: ReactNode;
  className?: string;
};

export default function AdminFailUi({ title, message, children, className }: AdminFailUiProps) {
  return (
    <div
      className={cn("flex min-h-[120px] flex-col justify-center gap-2 px-4 py-6", className)}
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm text-red-400">
        {title}
        {message ? `: ${message}` : ""}
      </p>
      {children ? <div className="text-muted-foreground text-xs">{children}</div> : null}
    </div>
  );
}
