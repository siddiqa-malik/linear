"use client";

import React from "react";
import { Task } from "@/types/task";
import { Circle, Plus, User } from "lucide-react";

interface IssueListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onNewIssue?: () => void;
}

// Exact Linear 3-Bar Priority Signal Icon
function PriorityBars({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      className={className || "w-3.5 h-3.5 text-[#626674]"}
    >
      <rect x="2" y="8.5" width="2" height="4" rx="0.5" />
      <rect x="6" y="5.5" width="2" height="7" rx="0.5" />
      <rect x="10" y="2.5" width="2" height="10" rx="0.5" />
    </svg>
  );
}

// 10 Exact Starter Issues from Screenshot
const defaultLinearIssues = [
  {
    id: "FIG-1",
    key: "FIG-1",
    title: "Welcome to Linear 👋",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-4",
    key: "FIG-4",
    title: "Connect GitHub or GitLab",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-2",
    key: "FIG-2",
    title: "Try 3 ways to navigate Linear: Command line, keyboard or mouse",
    date: "Mar 18",
    assignee: "MG",
  },
  {
    id: "FIG-5",
    key: "FIG-5",
    title: "Customize settings",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-3",
    key: "FIG-3",
    title: "Connect to Slack",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-8",
    key: "FIG-8",
    title: "✨ProTip: Mouse over this issue & press [Space]",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-9",
    key: "FIG-9",
    title: "Customize views with View Options and Filters",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-10",
    key: "FIG-10",
    title: "Next Steps",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-6",
    key: "FIG-6",
    title: "Use Cycles to focus work over n-weeks",
    date: "Mar 19",
    assignee: "MG",
  },
  {
    id: "FIG-7",
    key: "FIG-7",
    title: "Use Projects to organize work for features or releases",
    date: "Mar 19",
    assignee: "MG",
  },
];

export function IssueListView({ tasks, onTaskClick, onNewIssue }: IssueListViewProps) {
  // Combine real database tasks if present, otherwise display exact screenshot tasks
  const displayList =
    tasks && tasks.length > 0
      ? tasks.map((t, idx) => ({
          id: t._id,
          key: `FIG-${idx + 1}`,
          title: t.title,
          date: "Mar 19",
          assignee:
            typeof t.assignedTo === "object" && t.assignedTo?.name
              ? t.assignedTo.name.slice(0, 2).toUpperCase()
              : "MG",
        }))
      : defaultLinearIssues;

  return (
    <div className="w-full flex flex-col select-none text-[13px] bg-[#0f1017]">
      {/* ============================================================== */}
      {/* GROUP HEADER: ○ Todo  10                                    +  */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/[0.06] text-[#8a8f98]">
        <div className="flex items-center gap-2">
          <Circle className="w-3.5 h-3.5 text-[#8a8f98]" />
          <span className="font-medium text-white text-[13px]">Todo</span>
          <span className="text-[#626674] text-xs font-mono">{displayList.length}</span>
        </div>

        <button
          type="button"
          onClick={onNewIssue}
          className="text-[#626674] hover:text-white transition p-1 cursor-pointer"
          title="Create issue in Todo"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* EXACT LINEAR ISSUE ROWS MATCHING SCREENSHOT                    */}
      {/* ============================================================== */}
      <div className="divide-y divide-white/[0.04]">
        {displayList.map((item) => (
          <div
            key={item.id}
            onClick={() => onTaskClick(item.id)}
            className="flex items-center justify-between px-6 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
          >
            {/* Left Column: Signal Bars + FIG-X Key + Status Circle + Title */}
            <div className="flex items-center gap-3 min-w-0 pr-4">
              {/* Priority Signal Bars */}
              <PriorityBars className="w-3.5 h-3.5 text-[#626674] group-hover:text-[#8a8f98] shrink-0" />

              {/* Issue Key */}
              <span className="font-mono text-xs text-[#8a8f98] group-hover:text-white shrink-0 w-12">
                {item.key}
              </span>

              {/* Status Circle */}
              <Circle className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />

              {/* Issue Title */}
              <span className="text-[13px] text-[#e6e7ee] truncate font-normal group-hover:text-white">
                {item.title}
              </span>
            </div>

            {/* Right Column: Date + Assignee Avatar */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[12px] text-[#626674] group-hover:text-[#8a8f98]">
                {item.date}
              </span>

              {/* Avatar Circle with User Icon matching screenshot */}
              <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[#8a8f98] group-hover:text-white group-hover:border-white/40 transition">
                <User className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
