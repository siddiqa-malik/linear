"use client";

import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { KanbanCard } from "./KanbanCard";
import { StatusIcon } from "@/components/common/StatusIcon";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({
  status,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[300px] min-w-[300px] bg-[#090a0d]/40 rounded-xl p-2 border border-white/[0.04]">
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon status={status} className="w-3.5 h-3.5" />
          <span className="text-[13px] font-medium text-[#e2e4e9] tracking-wide">
            {title}
          </span>
          <span className="text-[11px] font-mono text-[#62666d] bg-white/[0.05] px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
        {tasks.map((task) => (
          <KanbanCard key={task._id} task={task} onClick={onTaskClick} />
        ))}

        {tasks.length === 0 && (
          <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-lg">
            <span className="text-[12px] text-[#62666d]">No tasks in {title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
