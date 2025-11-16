// components/ui/text-field.tsx
"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const inputVariants = cva(
  "flex items-center rounded-lg border-2 px-4 py-2 h-10 text-m bg-neutral-10 text-neutral-90 focus-within:border-primary-main",
  {
    variants: {
      state: {
        default:
          "border-neutral-40 hover:not-focus-within:border-primary-focus",
        error: "border-danger-main",
        success: "border-primary-main",
        disabled: "!border-neutral-30 !text-neutral-60 !cursor-not-allowed",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  showCounter?: boolean;
  maxLength?: number;
  valueLength?: number;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      errorMessage,
      successMessage,
      state,
      showCounter,
      maxLength,
      valueLength,
      className,
      type,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-y-1.5">
        {label && (
          <label htmlFor={props.id} className="text-s text-neutral-90">
            {label}
          </label>
        )}

        <div className={cn(inputVariants({ state }), className)}>
          {leftIcon && (
            <span className="text-neutral-60 absolute left-3">{leftIcon}</span>
          )}
          <input
            ref={ref}
            type={inputType}
            className="placeholder:text-neutral-60 text-m text-neutral-90 flex-1 outline-none"
            {...props}
          />
          {rightIcon && (
            <span className="text-neutral-60 absolute right-3">
              {rightIcon}
            </span>
          )}

          {/* Toggle Visibilty */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeIcon className="h-4 w-4 stroke-2 text-neutral-100" />
              ) : (
                <EyeSlashIcon className="h-4 w-4 stroke-2 text-neutral-100" />
              )}
            </button>
          )}
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="text-s text-danger-main flex items-center gap-x-1">
            <ExclamationTriangleIcon className="h-4 w-4 stroke-2" />
            <span>{errorMessage}</span>
          </div>
        )}
        {!errorMessage && successMessage && (
          <div className="text-s text-success-main flex items-center gap-x-1">
            <CheckIcon className="h-4 w-4 stroke-2" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Counter */}
        {showCounter && typeof maxLength === "number" && (
          <div className="text-neutral-60 text-right text-xs">
            {valueLength ?? 0}/{maxLength}
          </div>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
