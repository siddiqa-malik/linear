"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { IssueListView } from "@/components/workspace/IssueListView";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { Task, UserSummary } from "@/types/task";
import { CheckSquare, Loader2 } from "lucide-react";

export default function MyIssuesPage() {
  const { user } = useAuth();
  const { activeIssueId, setActiveIssueId } = useUI();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState<"assigned" | "created">("assigned");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyIssues = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/tasks");
      const allTasks: Task[] = res?.data || res || [];
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const displayTasks = tasks.filter((t) => {
    if (!user) return true;
    const assignedId =
      typeof t.assignedTo === "object" && t.assignedTo !== null
        ? (t.assignedTo as UserSummary)._id
        : t.assignedTo;
    const createdId =
      typeof t.createdBy === "object" && t.createdBy !== null
        ? (t.createdBy as UserSummary)._id
        : t.createdBy;

    if (tab === "assigned") {
      return assignedId === user._id;
    } else {
      return createdId === user._id;
    }
  });

  return (
    <div className="flex h-screen bg-[#08090a] text-[#f7f8f8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-8 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-4 h-4 text-[#5e6ad2]" />
            <h1 className="text-[15px] font-semibold text-white tracking-wide">My Issues</h1>
          </div>

          <div className="flex items-center bg-[#12141a] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setTab("assigned")}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${
                tab === "assigned" ? "bg-white/[0.1] text-white" : "text-[#8a8f98] hover:text-white"
              }`}
            >
              Assigned to me
            </button>
            <button
              onClick={() => setTab("created")}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${
                tab === "created" ? "bg-white/[0.1] text-white" : "text-[#8a8f98] hover:text-white"
              }`}
            >
              Created by me
            </button>
          </div>
        </div>

        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-[#8a8f98]">
              <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
              <span className="text-[13px]">Loading issues...</span>
            </div>
          ) : (
            <IssueListView tasks={displayTasks} onTaskClick={(id) => setActiveIssueId(id)} />
          )}
        </main>
      </div>

      <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchMyIssues} />
      <CreateIssueModal onCreated={fetchMyIssues} />
      <CommandPalette />
    </div>
  );
}
