import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-primary-main aria-invalid:border-danger-main dark:aria-invalid:ring-destructive/40 dark:bg-input/30 flex field-sizing-content min-h-10 w-full rounded-lg border-2 bg-neutral-10 h-10 px-4 py-2 text-m transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder-text-neutral-60 hover:border-primary-focus",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
