"use client";

import React from "react";
import { Task, UserSummary } from "@/types/task";
import { PriorityIcon } from "@/components/common/PriorityIcon";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface KanbanCardProps {
  task: Task;
  onClick: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const taskKey = `TSK-${task._id.slice(-3).toUpperCase()}`;
  const assignedUser: UserSummary | null =
    typeof task.assignedTo === "object" && task.assignedTo !== null
      ? (task.assignedTo as UserSummary)
      : null;

  return (
    <div
      onClick={() => onClick(task._id)}
      className="group relative bg-[#0d0e12]/80 hover:bg-[#12141a] border border-white/[0.06] hover:border-white/[0.14] rounded-lg p-3 text-left transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/40"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-mono tracking-wider text-[#8a8f98] group-hover:text-white transition-colors">
          {taskKey}
        </span>
        <div className="flex items-center gap-1.5">
          <PriorityIcon priority={task.priority} className="w-3.5 h-3.5" />
        </div>
      </div>

      <h4 className="text-[13px] font-medium text-[#f0f1f3] leading-snug line-clamp-2 mb-2 group-hover:text-white">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-[12px] text-[#8a8f98] line-clamp-1 mb-2.5">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[11px] text-[#8a8f98]">
        <div className="flex items-center gap-2">
          {task.dueDate ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#8a8f98]">
              <Calendar className="w-3 h-3 text-[#62666d]" />
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="text-[11px] text-[#46494f] italic">No due date</span>
          )}
        </div>

        {assignedUser ? (
          <Avatar
            name={assignedUser.name || assignedUser.email}
            size="sm"
            className="w-5 h-5 text-[10px]"
          />
        ) : (
          <div className="w-5 h-5 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[9px] text-[#62666d]">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
