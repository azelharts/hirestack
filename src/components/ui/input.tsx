import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-neutral-60 dark:bg-input/30 hover:border-primary-focus h-10 w-full min-w-0 rounded-lg border-2 bg-neutral-10 px-4 py-2 text-m transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-30 disabled:border-neutral-40 disabled:text-neutral-60",
        "focus-visible:border-primary-main",
        "aria-invalid:border-danger-main dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}

export { Input };
