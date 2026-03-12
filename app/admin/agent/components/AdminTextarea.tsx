"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function AdminTextarea({
  label,
  className,
  error,
  ...props
}: AdminTextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-100">{label}</label>
      <textarea
        className={cn(
          "px-3 py-2 rounded-md border text-sm bg-gray-900 text-gray-100",
          "border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
          "min-h-[100px] resize-y",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

