"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AdminInput({ label, className, error, ...props }: AdminInputProps) {
  const hasValue =
    typeof props.value === "string"
      ? props.value.length > 0
      : typeof props.value === "number";

  return (
    <div className="flex flex-col gap-1">
      <div className="relative w-full">
        <input
          className={cn(
            "peer w-full border rounded-xl px-4 pt-5 pb-2 text-sm outline-none",
            "bg-gray-900 text-gray-100",
            "border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            error && "border-red-500",
            className,
          )}
          placeholder=" "
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 top-3.5 text-sm text-gray-400 pointer-events-none transition-all",
            "peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-indigo-400",
            "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm",
            hasValue && "top-1.5 text-[10px] text-indigo-400",
          )}
        >
          {label}
        </label>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

