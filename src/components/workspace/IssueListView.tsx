"use client";

import React from "react";
import { Task, UserSummary } from "@/types/task";
import { StatusIcon } from "@/components/common/StatusIcon";
import { PriorityIcon } from "@/components/common/PriorityIcon";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";

interface IssueListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function IssueListView({ tasks, onTaskClick }: IssueListViewProps) {
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-[#0d0e12]/60 divide-y divide-white/[0.04]">
      <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-white/[0.02] text-[11px] font-medium text-[#8a8f98] uppercase tracking-wider">
        <div className="col-span-1">Key</div>
        <div className="col-span-6">Title</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-1">Due Date</div>
        <div className="col-span-1 text-right">Assignee</div>
      </div>

      {tasks.map((task) => {
        const taskKey = `TSK-${task._id.slice(-3).toUpperCase()}`;
        const assignedUser: UserSummary | null =
          typeof task.assignedTo === "object" && task.assignedTo !== null
            ? (task.assignedTo as UserSummary)
            : null;

        return (
          <div
            key={task._id}
            onClick={() => onTaskClick(task._id)}
            className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="col-span-1 font-mono text-[11px] text-[#8a8f98] group-hover:text-white">
              {taskKey}
            </div>

            <div className="col-span-6 pr-4">
              <span className="text-[13px] font-medium text-[#e2e4e9] group-hover:text-white">
                {task.title}
              </span>
              {task.description && (
                <p className="text-[12px] text-[#8a8f98] line-clamp-1 mt-0.5">
                  {task.description}
                </p>
              )}
            </div>

            <div className="col-span-2 flex items-center gap-2 text-[12px] text-[#e2e4e9]">
              <StatusIcon status={task.status} className="w-3.5 h-3.5" />
              <span className="capitalize">{task.status.replace("-", " ")}</span>
            </div>

            <div className="col-span-1 flex items-center gap-1.5 text-[12px]">
              <PriorityIcon priority={task.priority} className="w-3.5 h-3.5" />
              <span className="capitalize text-[#8a8f98] text-[11px]">{task.priority}</span>
            </div>

            <div className="col-span-1 text-[11px] text-[#8a8f98] font-mono">
              {task.dueDate ? formatDate(task.dueDate) : "-"}
            </div>

            <div className="col-span-1 flex justify-end">
              {assignedUser ? (
                <Avatar
                  name={assignedUser.name || assignedUser.email}
                  size="sm"
                  className="w-5 h-5 text-[10px]"
                />
              ) : (
                <span className="text-[11px] text-[#62666d]">-</span>
              )}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="py-12 text-center text-[13px] text-[#8a8f98]">
          No issues match the selected filters.
        </div>
      )}
    </div>
  );
}
