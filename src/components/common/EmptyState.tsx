import React from "react";
import { Button } from "../ui/Button";
import { Kbd } from "../ui/Kbd";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionShortcut?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionShortcut,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center select-none",
        className
      )}
    >
      {/* Icon with glowing ambient circular ring */}
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#12131a] shadow-lg">
        <div className="absolute inset-0 rounded-2xl bg-[#5e6ad2]/10 blur-md" />
        <Icon className="relative h-6 w-6 text-[#8a8f98]" />
      </div>

      <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#8a8f98]">
        {description}
      </p>

      {actionLabel && (
        <div className="mt-5 flex items-center gap-2">
          <Button
            onClick={onAction}
            variant="primary"
            size="sm"
            className="rounded-full px-4"
          >
            <span>{actionLabel}</span>
            {actionShortcut && <Kbd className="ml-1 bg-white/15 text-white">{actionShortcut}</Kbd>}
          </Button>
        </div>
      )}
    </div>
  );
}