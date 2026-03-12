"use client";

import { cn } from "@/lib/utils";
import { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

interface FieldWrapperProps {
  label: string;
  children: ReactNode;
  required?: boolean;
}

export function FieldWrapper({ label, children, required }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-100">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}




type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function AdminTextarea({ className, error, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
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

