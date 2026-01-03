import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-lg border-2 bg-white px-4 py-2 text-base shadow-sm transition-[color,box-shadow,transform] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-medium",
        "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[4px] focus-visible:-translate-y-0.5",
        "aria-invalid:ring-error/20 aria-invalid:border-error dark:aria-invalid:ring-error/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
