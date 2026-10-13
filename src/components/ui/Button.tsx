import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: "px-2 py-1 text-[11px] rounded",
      sm: "px-2.5 py-1.5 text-xs rounded-md",
      md: "px-3.5 py-2 text-xs font-medium rounded-md",
      lg: "px-5 py-2.5 text-sm font-medium rounded-lg",
      icon: "h-8 w-8 p-0 rounded-md flex items-center justify-center",
    };

    const variantClasses = {
      primary: "linear-button-primary text-white font-medium",
      secondary: "linear-button-secondary text-white/90 hover:text-white",
      outline:
        "border border-white/10 bg-transparent text-[#8a8f98] hover:border-white/20 hover:text-white hover:bg-white/[0.04]",
      ghost: "text-[#8a8f98] hover:text-white hover:bg-white/[0.05]",
      danger:
        "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-medium transition-all select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";