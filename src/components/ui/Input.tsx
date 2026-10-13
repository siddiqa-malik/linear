import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-md border border-white/10 bg-[#0c0d12] px-3 py-1.5 text-xs text-white placeholder:text-[#62666d] outline-none transition focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/40 disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";