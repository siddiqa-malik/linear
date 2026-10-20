import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = "sm",
  className,
}: {
  name?: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    xs: "h-4 w-4 text-[9px]",
    sm: "h-5 w-5 text-[10px]",
    md: "h-7 w-7 text-xs",
    lg: "h-9 w-9 text-sm",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User Avatar"}
        referrerPolicy="no-referrer"
        className={cn(
          "shrink-0 rounded-full object-cover border border-white/10 select-none",
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#5e6ad2]/40 to-[#818cf8]/20 border border-white/10 font-semibold text-white select-none",
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}