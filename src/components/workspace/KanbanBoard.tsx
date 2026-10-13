"use client";

import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onAddTask: (status?: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "To Do" },
  { status: "in-progress", title: "In Progress" },
  { status: "completed", title: "Done" },
];

export function KanbanBoard({ tasks, onTaskClick, onAddTask }: KanbanBoardProps) {
  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-2">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={colTasks}
            onTaskClick={onTaskClick}
            onAddTask={(status) => onAddTask(status)}
          />
        );
      })}
    </div>
  );
}
