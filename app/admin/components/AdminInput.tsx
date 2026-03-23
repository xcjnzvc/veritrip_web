"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 없으면 React Hook Form + `FormLabel` / `FormControl`용(입력만 렌더, ref·id·aria 전달) */
  label?: string;
  error?: string;
  helperText?: string;
}

const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, className, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldOnly = label == null || label === "";
    const inputId = fieldOnly ? id : (id ?? generatedId);

    const {
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      ...rest
    } = props;

    const stableId = inputId ?? generatedId;
    const errorId = `${stableId}-error`;
    const descriptionId = `${stableId}-description`;

    const hasError = Boolean(error);
    const inputClassName = cn(
      "transition-all duration-200",
      (hasError || ariaInvalidProp === true) &&
        "border-destructive ring-destructive/20 focus-visible:ring-destructive",
      className,
    );

    // RHF: FormItem > FormLabel + FormControl > AdminInput + FormMessage
    if (fieldOnly) {
      const describedBy =
        [ariaDescribedByProp, error ? errorId : undefined, helperText ? descriptionId : undefined]
          .filter(Boolean)
          .join(" ") || undefined;

      return (
        <Input
          id={id}
          ref={ref}
          className={inputClassName}
          aria-invalid={hasError ? true : ariaInvalidProp}
          aria-describedby={describedBy}
          {...rest}
        />
      );
    }

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
          className={inputClassName}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? descriptionId : undefined}
          {...rest}
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
