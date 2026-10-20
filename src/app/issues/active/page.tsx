"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { IssueListView } from "@/components/workspace/IssueListView";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import {
  ChevronDown,
  Star,
  Plus,
  Menu,
  Columns,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

export default function ActiveIssuesPage() {
  const { activeIssueId, setActiveIssueId, setCreateModalOpen } = useUI();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const fetchActiveIssues = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/tasks");
      const all: Task[] = res?.data || res || [];
      setTasks(all.filter((t) => t.status === "in-progress" || t.status === "todo"));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveIssues();
  }, []);

  return (
    <div className="flex h-screen bg-[#0f1017] text-[#e6e7ee] overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ============================================================== */}
        {/* TOP HEADER MATCHING SCREENSHOT: Active issues ▾, ☆, + Filter  */}
        {/* Right: ☰, ☵, View ▾                                           */}
        {/* ============================================================== */}
        <div className="h-11 px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f1017]">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-medium text-white hover:text-white/90 transition cursor-pointer"
            >
              <span>Active issues</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8a8f98]" />
            </button>

            <button
              type="button"
              onClick={() => setIsStarred(!isStarred)}
              className={`p-1 rounded transition cursor-pointer ${
                isStarred ? "text-amber-400" : "text-[#626674] hover:text-white"
              }`}
              title="Add to favorites"
            >
              <Star className="w-3.5 h-3.5" fill={isStarred ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              className="flex items-center gap-1 h-6 px-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-[#8a8f98] hover:text-white transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Filter</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* List vs Board Toggle */}
            <div className="flex items-center bg-[#161722] border border-white/[0.08] rounded-md p-0.5">
              <button
                type="button"
                className="h-6 w-6 flex items-center justify-center rounded bg-white/[0.1] text-white shadow-sm cursor-pointer"
                title="List View"
              >
                <Menu className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="h-6 w-6 flex items-center justify-center rounded text-[#8a8f98] hover:text-white transition cursor-pointer"
                title="Board View"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Dropdown */}
            <button
              type="button"
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-[#161722] hover:bg-[#1f202e] border border-white/[0.08] text-xs text-[#8a8f98] hover:text-white transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>View</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN ISSUES CONTENT MATCHING SCREENSHOT                        */}
        {/* ============================================================== */}
        <main className="flex-1 overflow-y-auto">
          {isLoading && tasks.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-[#8a8f98]">
              <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
              <span className="text-[13px]">Loading active issues...</span>
            </div>
          ) : (
            <IssueListView
              tasks={tasks}
              onTaskClick={(id) => setActiveIssueId(id)}
              onNewIssue={() => setCreateModalOpen(true)}
            />
          )}
        </main>
      </div>

      <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchActiveIssues} />
      <CreateIssueModal onCreated={fetchActiveIssues} />
      <CommandPalette />
    </div>
  );
}
