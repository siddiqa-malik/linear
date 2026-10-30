"use client";

import React, { useState } from "react";
import { Task } from "@/types/task";
import { Circle, Plus, User, ChevronRight, ChevronDown } from "lucide-react";
import { IssueActionMenu } from "@/components/workspace/IssueActionMenu";

interface IssueListViewProps {
  tasks: Task[];
  projects?: any[];
  groupTitle?: string;
  onTaskClick: (taskId: string) => void;
  onNewIssue?: () => void;
  onNewIssueWithStatus?: (status: string) => void;
  onTaskUpdated?: () => void;
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

// Status Icons matching Linear exactly
function InProgressIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="#eab308"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 2A6 6 0 0 1 8 14Z" fill="#eab308" />
    </svg>
  );
}

function BacklogIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2.2 2"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
    </svg>
  );
}

function TodoIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return <Circle className={`${className} text-[#8a8f98]`} />;
}

function DoneIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="#5e6ad2"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" fill="#5e6ad2" fillOpacity="0.2" />
      <path d="M5 8L7 10L11 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CanceledIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="#707383"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M4 12L12 4" strokeLinecap="round" />
    </svg>
  );
}

function renderStatusIcon(status: string, className = "w-3.5 h-3.5 shrink-0") {
  const s = (status || "").toLowerCase();
  if (s === "in-progress" || s === "started" || s === "in_progress") {
    return <InProgressIcon className={className} />;
  }
  if (s === "backlog") {
    return <BacklogIcon className={className} />;
  }
  if (s === "completed" || s === "done") {
    return <DoneIcon className={className} />;
  }
  if (s === "canceled") {
    return <CanceledIcon className={className} />;
  }
  return <TodoIcon className={className} />;
}

// Standard Linear workflow groups
const WORKFLOW_GROUPS = [
  { key: "in-progress", label: "In Progress", match: ["in-progress", "started", "in_progress"] },
  { key: "todo", label: "Todo", match: ["todo", "unstarted"] },
  { key: "backlog", label: "Backlog", match: ["backlog"] },
  { key: "completed", label: "Done", match: ["completed", "done"] },
  { key: "canceled", label: "Canceled", match: ["canceled"] },
];

export function IssueListView({
  tasks,
  projects = [],
  groupTitle,
  onTaskClick,
  onNewIssue,
  onNewIssueWithStatus,
  onTaskUpdated,
}: IssueListViewProps) {
  // Track collapsed groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [openMenuIssueId, setOpenMenuIssueId] = useState<string | null>(null);

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Helper map for project lookup
  const projectMap = new Map<string, any>();
  projects.forEach((p) => {
    if (p._id) projectMap.set(p._id.toString(), p);
  });

  // Format tasks with project and assignee details
  const formattedTasks = (tasks || []).map((t, idx) => {
    const taskDate = t.createdAt
      ? new Date(t.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Today";

    const assigneeInitials =
      typeof t.assignedTo === "object" && t.assignedTo?.name
        ? t.assignedTo.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : null;

    const taskKey =
      (t as any).identifier ||
      (t as any).key ||
      (typeof (t as any).projectId === "object" && (t as any).projectId?.key
        ? `${(t as any).projectId.key}-${idx + 1}`
        : `ISSUE-${idx + 1}`);

    // Resolve project name
    let projectName: string | null = null;
    if (typeof t.projectId === "object" && t.projectId?.name) {
      projectName = t.projectId.name;
    } else if (t.projectId && projectMap.has(t.projectId.toString())) {
      projectName = projectMap.get(t.projectId.toString()).name;
    }

    return {
      raw: t,
      id: t._id,
      key: taskKey,
      title: t.title,
      status: (t.status || "unstarted").toLowerCase(),
      projectName,
      date: taskDate,
      assignee: assigneeInitials,
    };
  });

  // Group the tasks by workflow state
  const groupsWithTasks = WORKFLOW_GROUPS.map((grp) => {
    const items = formattedTasks.filter((item) => grp.match.includes(item.status));
    return {
      ...grp,
      items,
    };
  }).filter((grp) => grp.items.length > 0);

  // If tasks exist but none matched predefined groups, create a fallback group
  const matchedTaskIds = new Set(groupsWithTasks.flatMap((g) => g.items.map((i) => i.id)));
  const unmatched = formattedTasks.filter((t) => !matchedTaskIds.has(t.id));
  if (unmatched.length > 0) {
    groupsWithTasks.push({
      key: "other",
      label: groupTitle || "Issues",
      match: [],
      items: unmatched,
    });
  }

  // If no tasks at all
  if (formattedTasks.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center px-4 w-full">
        <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#8a8f98] mb-3">
          <Circle className="w-5 h-5 text-[#626674]" />
        </div>
        <p className="text-[13.5px] font-medium text-white mb-1">No issues</p>
        <p className="text-[12px] text-[#8a8f98] max-w-xs mb-4 leading-relaxed">
          Create an issue to organize tasks, track bugs, and manage your sprint.
        </p>
        {onNewIssue && (
          <button
            type="button"
            onClick={onNewIssue}
            className="px-3.5 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create issue</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col select-none text-[13px] bg-[#0f1017]">
      {groupsWithTasks.map((grp) => {
        const isCollapsed = !!collapsedGroups[grp.key];

        return (
          <div key={grp.key} className="w-full flex flex-col">
            {/* ============================================================== */}
            {/* GROUP HEADER BAR (Flush edge-to-edge, matching Screenshot 1 & 2) */}
            {/* ============================================================== */}
            <div
              onClick={() => toggleGroup(grp.key)}
              className="h-8 px-6 bg-[#13141c] hover:bg-[#151620] border-b border-white/[0.04] flex items-center justify-between text-[#8a8f98] cursor-pointer transition select-none"
            >
              {/* Left: Caret + Status Icon + Title + Count */}
              <div className="flex items-center gap-2">
                <div className="text-[#8a8f98] p-0.5 hover:text-white transition">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>

                {renderStatusIcon(grp.key, "w-3.5 h-3.5 shrink-0")}

                <span className="font-medium text-white text-[13px]">{grp.label}</span>
                <span className="text-[#626674] text-xs font-mono ml-0.5">{grp.items.length}</span>
              </div>

              {/* Right: + Button to create issue in this group */}
              {onNewIssue && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNewIssueWithStatus) {
                      onNewIssueWithStatus(grp.key);
                    } else {
                      onNewIssue();
                    }
                  }}
                  className="text-[#626674] hover:text-white transition p-1 cursor-pointer"
                  title={`Create issue in ${grp.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ============================================================== */}
            {/* ISSUE ROWS (Underneath group, matching Screenshot 2)            */}
            {/* ============================================================== */}
            {!isCollapsed && (
              <div className="divide-y divide-white/[0.03]">
                {grp.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onTaskClick(item.id)}
                    className="flex items-center justify-between px-6 py-2.5 hover:bg-white/[0.02] border-b border-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Left Column: Checkbox + Priority + Key + Status Icon + Title */}
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      {/* Checkbox */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 rounded-[3px] border border-white/20 hover:border-white/50 group-hover:border-white/40 transition shrink-0 cursor-pointer"
                      />

                      {/* 3-Bar Priority Signal */}
                      <PriorityBars className="w-3.5 h-3.5 text-[#626674] group-hover:text-[#8a8f98] shrink-0" />

                      {/* Issue Key (e.g. DES-1) */}
                      <span className="font-mono text-xs text-[#8a8f98] group-hover:text-white shrink-0 min-w-[48px]">
                        {item.key}
                      </span>

                      {/* Status Icon */}
                      {renderStatusIcon(item.status)}

                      {/* Issue Title */}
                      <span className="text-[13px] text-white font-medium truncate group-hover:text-white">
                        {item.title}
                      </span>
                    </div>

                    {/* Right Column: Project Badge + Assignee + Date */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Project Pill Badge matching Screenshot 2 */}
                      {item.projectName && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[11px] font-medium shrink-0">
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="w-3 h-3 text-red-400"
                          >
                            <circle cx="8" cy="8" r="6" />
                            <circle cx="8" cy="8" r="2" fill="currentColor" />
                          </svg>
                          <span>{item.projectName}</span>
                        </div>
                      )}

                      {/* Assignee Avatar */}
                      <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-[8.5px] bg-gradient-to-tr from-amber-500 to-orange-400 shrink-0 overflow-hidden shadow-xs">
                        {item.assignee ? item.assignee : <User className="w-2.5 h-2.5" />}
                      </div>

                      {/* Date */}
                      <span className="text-[11px] text-[#626674] group-hover:text-[#8a8f98] shrink-0 font-normal">
                        {item.date}
                      </span>

                      {/* 3-Dots Actions Menu Button */}
                      <div className="relative flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuIssueId(openMenuIssueId === item.id ? null : item.id);
                          }}
                          className={`p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer ${
                            openMenuIssueId === item.id ? "text-white bg-white/[0.08] opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                          title="Issue actions"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="3" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="8" cy="13" r="1.5" />
                          </svg>
                        </button>

                        {openMenuIssueId === item.id && (
                          <IssueActionMenu
                            issue={item.raw}
                            projects={projects}
                            isOpen={openMenuIssueId === item.id}
                            onClose={() => setOpenMenuIssueId(null)}
                            onUpdated={() => {
                              onTaskUpdated?.();
                              if (typeof window !== "undefined") {
                                window.dispatchEvent(new Event("taskflow:task-created"));
                              }
                            }}
                            onDeleted={() => {
                              onTaskUpdated?.();
                              if (typeof window !== "undefined") {
                                window.dispatchEvent(new Event("taskflow:task-created"));
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
