import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva("rounded-sm border text-center py-0.5 px-2", {
  variants: {
    variant: {
      success: "bg-success-surface border-success-border !text-success-main",
      danger: "bg-danger-surface border-danger-border !text-danger-main",
      secondary:
        "bg-secondary-surface border-secondary-border !text-secondary-main",
    },
    size: {
      small: "text-s",
      medium: "text-m",
    },
  },

  defaultVariants: {
    variant: "success",
    size: "small",
  },
});

export interface DivProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {}

export const Tag = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(tagVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Tag.displayName = "Tag";
