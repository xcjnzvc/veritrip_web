"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, className, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    return (
      <div className="group flex w-full flex-col gap-2">
        <Label
          htmlFor={inputId}
          className={cn(
            "group-focus-within:text-primary text-sm font-semibold transition-colors",
            error && "text-destructive",
          )}
        >
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={cn(
            "transition-all duration-200",
            error && "border-destructive ring-destructive/20 focus-visible:ring-destructive",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? descriptionId : undefined}
          {...props}
        />
        {error ? (
          <p
            id={errorId}
            className="animate-in fade-in slide-in-from-top-1 text-destructive text-xs font-medium"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={descriptionId} className="text-muted-foreground/80 text-xs">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

AdminInput.displayName = "AdminInput";

export default AdminInput;
