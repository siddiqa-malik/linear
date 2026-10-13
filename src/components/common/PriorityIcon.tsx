import { TaskPriority } from "@/types/task";
import { cn } from "@/lib/utils";

export function PriorityIcon({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  switch (priority) {
    case "high":
      return (
        <div
          title="High Priority"
          className={cn("flex items-end gap-0.5 shrink-0", className)}
        >
          <span className="h-1.5 w-0.5 rounded-sm bg-orange-400" />
          <span className="h-2.5 w-0.5 rounded-sm bg-orange-400" />
          <span className="h-3.5 w-0.5 rounded-sm bg-orange-400" />
        </div>
      );
    case "medium":
      return (
        <div
          title="Medium Priority"
          className={cn("flex items-end gap-0.5 shrink-0", className)}
        >
          <span className="h-1.5 w-0.5 rounded-sm bg-yellow-400" />
          <span className="h-2.5 w-0.5 rounded-sm bg-yellow-400" />
          <span className="h-3.5 w-0.5 rounded-sm bg-white/10" />
        </div>
      );
    case "low":
    default:
      return (
        <div
          title="Low Priority"
          className={cn("flex items-end gap-0.5 shrink-0", className)}
        >
          <span className="h-1.5 w-0.5 rounded-sm bg-zinc-400" />
          <span className="h-2.5 w-0.5 rounded-sm bg-white/10" />
          <span className="h-3.5 w-0.5 rounded-sm bg-white/10" />
        </div>
      );
  }
}