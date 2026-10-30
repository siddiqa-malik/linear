"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/workspace/Sidebar";
import { IssueListView } from "@/components/workspace/IssueListView";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { AuthGuard } from "@/components/common/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { Task, UserSummary } from "@/types/task";
import {
  Star,
  Bell,
  Plus,
  SlidersHorizontal,
  Loader2,
  Box,
  PanelRight,
  Filter,
  Target,
} from "lucide-react";

/*
 * MyIssuesPage Component
 * Displays the current user's issues matching the exact styling,
 * subheaders, tabs (Active, Backlog, All issues), empty states,
 * and keyboard shortcuts found in the team issues screen.
 */
export default function MyIssuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeIssueId, setActiveIssueId, setCreateModalOpen } = useUI();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  // Status Tabs: "active" | "backlog" | "all" (default: "all" matching team issues view)
  const [tab, setTab] = useState<"active" | "backlog" | "all">("all");

  // User Filter Scope: "assigned" | "created" (default: "assigned")
  const [scope, setScope] = useState<"assigned" | "created">("assigned");

  /*
   * Fetch all workspace tasks and projects concurrently in parallel
   */
  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);

      const [projRes, issuesRes] = await Promise.all([
        api.get("/projects").catch(() => []),
        api.get("/issues").catch(() => api.get("/tasks").catch(() => [])),
      ]);

      const pList = projRes?.data || projRes || [];
      if (Array.isArray(pList)) setProjects(pList);

      const allTasks: Task[] = issuesRes?.data || issuesRes || [];
      if (Array.isArray(allTasks)) setTasks(allTasks);
    } catch (err) {
      console.error("Failed to fetch my issues:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleCreated = (e: any) => {
      const newTask = e?.detail;
      if (newTask && newTask._id) {
        setTasks((prev) => [newTask, ...prev.filter((t) => t._id !== newTask._id)]);
      }
      fetchData(true);
    };
    window.addEventListener("taskflow:task-created", handleCreated);
    window.addEventListener("task-created", handleCreated);
    return () => {
      window.removeEventListener("taskflow:task-created", handleCreated);
      window.removeEventListener("task-created", handleCreated);
    };
  }, [fetchData]);

  // Keyboard shortcut listener: Press "C" to create a new issue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if ((e.key === "c" || e.key === "C") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setCreateModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCreateModalOpen]);

  /*
   * Filter tasks based on both user scope (assigned vs created) and status tab (active, backlog, all)
   */
  const filteredTasks = tasks.filter((t) => {
    // 1. User scope check
    if (user) {
      const assignedId =
        typeof t.assignedTo === "object" && t.assignedTo !== null
          ? (t.assignedTo as UserSummary)._id
          : t.assignedTo;
      const assignedEmail =
        typeof t.assignedTo === "object" && t.assignedTo !== null
          ? (t.assignedTo as any).email
          : null;

      const createdId =
        typeof t.createdBy === "object" && t.createdBy !== null
          ? (t.createdBy as UserSummary)._id
          : t.createdBy;
      const createdEmail =
        typeof t.createdBy === "object" && t.createdBy !== null
          ? (t.createdBy as any).email
          : null;

      if (scope === "assigned") {
        const matchesUser =
          (assignedId && user._id && assignedId.toString() === user._id.toString()) ||
          (assignedEmail && user.email && assignedEmail.toLowerCase() === user.email.toLowerCase());
        if (!matchesUser) return false;
      } else {
        const matchesUser =
          (createdId && user._id && createdId.toString() === user._id.toString()) ||
          (createdEmail && user.email && createdEmail.toLowerCase() === user.email.toLowerCase());
        if (!matchesUser) return false;
      }
    }

    // 2. Status tab check
    const s = (t.status || "").toLowerCase();
    if (tab === "active") {
      return s === "todo" || s === "unstarted" || s === "in-progress" || s === "started" || s === "in_progress";
    }
    if (tab === "backlog") {
      return s === "backlog";
    }
    return true; // "all" shows all issues
  });

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#0f1017] text-[#e2e4ef] overflow-hidden select-none font-sans">
        {/* Left Workspace Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0f1017]">
          {/* ============================================================== */}
          {/* 1. TOP HEADER: Title (My issues) + Star + Notifications + New  */}
          {/* ============================================================== */}
          <div className="h-11 px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f1017]/80 backdrop-blur-md sticky top-0 z-20">
            {/* Left: Target Icon + Title + Star */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-[#5e6ad2]/15 text-[#858fe8]">
                <Target className="w-3.5 h-3.5" />
              </div>

              <span className="text-[13px] font-medium text-white">My issues</span>

              <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`p-1 rounded hover:bg-white/[0.06] transition cursor-pointer ml-0.5 ${
                  isStarred ? "text-amber-400" : "text-[#8a8f98] hover:text-white"
                }`}
                title={isStarred ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className="w-3.5 h-3.5" fill={isStarred ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Right: Notification Bell + New Issue Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/inbox")}
                className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New issue</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. SUBHEADER: Tabs (Active, Backlog, All) + Assigned / Created */}
          {/* ============================================================== */}
          <div className="h-10 px-6 border-b border-white/[0.04] flex items-center justify-between shrink-0 bg-[#0f1017]">
            {/* Left: Pill Tabs + Scope Filter */}
            <div className="flex items-center gap-2">
              {/* Status Tabs */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTab("active")}
                  className={`px-2.5 py-1 rounded-md text-[12.5px] transition cursor-pointer ${
                    tab === "active"
                      ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setTab("backlog")}
                  className={`px-2.5 py-1 rounded-md text-[12.5px] transition cursor-pointer ${
                    tab === "backlog"
                      ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  Backlog
                </button>

                <button
                  type="button"
                  onClick={() => setTab("all")}
                  className={`px-2.5 py-1 rounded-md text-[12.5px] transition cursor-pointer ${
                    tab === "all"
                      ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  All issues
                </button>

                <div className="pl-1 text-[#626674]">
                  <Box className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Subtle divider */}
              <div className="h-3.5 w-[1px] bg-white/[0.08] mx-0.5" />

              {/* User Scope Filter Toggle */}
              <div className="flex items-center bg-[#161726]/80 p-0.5 rounded-md border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setScope("assigned")}
                  className={`px-2.5 py-0.5 rounded text-[11.5px] transition cursor-pointer ${
                    scope === "assigned"
                      ? "bg-[#25283d] text-white font-medium shadow-sm"
                      : "text-[#8a8f98] hover:text-white"
                  }`}
                >
                  Assigned
                </button>

                <button
                  type="button"
                  onClick={() => setScope("created")}
                  className={`px-2.5 py-0.5 rounded text-[11.5px] transition cursor-pointer ${
                    scope === "created"
                      ? "bg-[#25283d] text-white font-medium shadow-sm"
                      : "text-[#8a8f98] hover:text-white"
                  }`}
                >
                  Created
                </button>
              </div>
            </div>

            {/* Right: Round Filter, Display & Layout Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Filter */}
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-[#161726]/60 hover:bg-[#161726] border border-white/[0.06] text-[#8a8f98] hover:text-white transition cursor-pointer"
                title="Filter issues"
              >
                <Filter className="w-3 h-3" />
              </button>

              {/* Display / Sliders */}
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-[#161726]/60 hover:bg-[#161726] border border-white/[0.06] text-[#8a8f98] hover:text-white transition cursor-pointer"
                title="Display options"
              >
                <SlidersHorizontal className="w-3 h-3" />
              </button>

              {/* Layout Toggle */}
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-[#161726]/60 hover:bg-[#161726] border border-white/[0.06] text-[#8a8f98] hover:text-white transition cursor-pointer"
                title="Layout toggle"
              >
                <PanelRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. MAIN BODY: Issues List OR Centered Empty State               */}
          {/* ============================================================== */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0f1017] w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#8a8f98] my-auto py-16">
                <Loader2 className="w-5 h-5 animate-spin text-[#5e6ad2]" />
                <span>Loading issues...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              /* ============================================================== */
              /* EXACT EMPTY STATE MATCHING TEAM ISSUES SCREEN                  */
              /* ============================================================== */
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto p-6 animate-in fade-in duration-200">
                {/* Heading */}
                <h2 className="text-[18px] sm:text-[19px] font-semibold text-white tracking-tight mb-2">
                  {tab === "active"
                    ? "Active issues"
                    : tab === "backlog"
                    ? "Backlog"
                    : "All issues"}
                </h2>

                {/* Subtext */}
                <p className="text-[12.5px] text-[#8a8f98] leading-relaxed max-w-[360px] mb-6">
                  {tab === "all"
                    ? "All issues is the place where you can see all your work in one view. Once issues are assigned to you or created by you, they will show up here."
                    : tab === "active"
                    ? "Active issues are items currently in progress or waiting to be started."
                    : "Backlog is the place where you can plan and store upcoming work."}
                </p>

                {/* Action Buttons: [Create new issue  C]  [Documentation] */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer shadow-md shadow-[#5e6ad2]/25"
                  >
                    <span>Create new issue</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/20 text-white font-mono text-[10px]">
                      C
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open("https://linear.app/docs", "_blank")}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1c1e2e] hover:bg-[#25283d] border border-white/[0.08] text-[#c5c8d6] hover:text-white text-xs font-medium transition cursor-pointer"
                  >
                    Documentation
                  </button>
                </div>
              </div>
            ) : (
              /* When tasks exist, render the issue list */
              <div className="w-full">
                <IssueListView
                  tasks={filteredTasks}
                  projects={projects}
                  groupTitle={tab === "active" ? "Active" : tab === "backlog" ? "Backlog" : "All issues"}
                  onTaskClick={(id) => setActiveIssueId(id)}
                  onNewIssue={() => setCreateModalOpen(true)}
                />
              </div>
            )}
          </main>
        </div>

        {/* Modals & Drawers */}
        <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchData} />
      </div>
    </AuthGuard>
  );
}
