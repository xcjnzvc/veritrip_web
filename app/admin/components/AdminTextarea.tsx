"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, className, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

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
        <Textarea
          id={inputId}
          ref={ref}
          className={cn(
            "min-h-[120px] resize-none transition-all duration-200",
            error && "border-destructive ring-destructive/20 focus-visible:ring-destructive",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
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
          <p className="text-muted-foreground/80 text-xs">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

AdminTextarea.displayName = "AdminTextarea";

export default AdminTextarea;
