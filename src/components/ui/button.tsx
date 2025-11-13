import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex w-full items-center justify-center rounded-lg transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary-main hover:bg-primary-hover text-neutral-10",
        secondary: "bg-secondary-main hover:bg-secondary-hover text-neutral-90",
        neutral: "bg-neutral-10 text-neutral-100",
      },
      size: {
        small: "py-1 px-4 text-s-bold",
        medium: "py-1 px-4 text-m-bold",
        large: "py-1.5 px-4 text-l-bold",
      },
      border: {
        false: null,
        true: "border-2 border-neutral-40",
      },
      shadow: {
        false: null,
        true: "shadow-button",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, border, shadow, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, border, shadow }),
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
