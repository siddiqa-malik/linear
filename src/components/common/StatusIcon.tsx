import { TaskStatus } from "@/types/task";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusIcon({
  status,
  className,
}: {
  status: TaskStatus | "backlog" | "canceled";
  className?: string;
}) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2
          className={cn("h-3.5 w-3.5 text-[#5e6ad2] shrink-0", className)}
        />
      );
    case "in-progress":
      return (
        <Clock
          className={cn("h-3.5 w-3.5 text-amber-400 shrink-0", className)}
        />
      );
    case "canceled":
      return (
        <XCircle
          className={cn("h-3.5 w-3.5 text-zinc-500 shrink-0", className)}
        />
      );
    case "todo":
    default:
      return (
        <Circle
          className={cn("h-3.5 w-3.5 text-[#8a8f98] shrink-0", className)}
        />
      );
  }
}