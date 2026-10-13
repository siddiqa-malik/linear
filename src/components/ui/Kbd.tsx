import { cn } from "@/lib/utils";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[#8a8f98] select-none",
        className
      )}
    >
      {children}
    </kbd>
  );
}